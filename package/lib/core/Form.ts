import { SvelteComponent, SvelteComponentDev } from "svelte/internal";
import { get, writable, Writable } from "svelte/store";
import { isThisTypeNode } from "typescript";
import {
  _addCallbackToField,
  _attachEventListeners,
  _buildFormFields,
  _buildFormFieldsWithSchema,
  _executeValidationEvent,
  _get,
  _hanldeFieldGroups,
  _linkAllErrors,
  _linkAllValues,
  _resetState,
  _setFieldAttributes,
  _setFieldOrder,
  _setInitialState
} from "../utilities";
import { FieldConfig } from "./FieldConfig";
import {
  Callback,
  ElementEvent,
  FieldNode,
  FormFieldSchema,
  InitialFormState,
  OnEvents,
  ReferenceData,
  ValidationCallback,
  ValidationError,
  ValidationProperties
} from "./Types";

/**
 * @Recomended_Use
 *  - Initialize let form = new Form(model, {refs: REFS, template: TEMPLATE, etc.})
 *  - Set the model (if you didn't in the first step)
 *  - Attach reference data (if you didn't in the first step)
 *  - Storify the form - check example.form.ts for an example
 *  - Now you're ready to use the form!
 *  - Pass it into the DynamicForm component and let the form generate itself!
 *
 * Performance is blazing with < 500 fields.
 * Can render up to 2000 inputs in per class/fields, not recommended.
 * Just break it up into 100 or so fields per form (max 250) if its a huge form.
 * Use one of the Form Manager interfaces if applicable.
 *  - Tested on late 2014 mbp - 2.5ghz core i7, 16gb ram
 *
 * @TODO Time to redo the readme.md file! Lots have changed since then!
 *
 * @TODO Add more superstruct examples for each form type (this should show how easy the template pattern really is)
 * @TODO Add cypress tests!
 *
 * @TODO I think a Form class refactor may be in order.
 *
 * @TODO Add debug mode to inspect event listeners and form state snapshots
 *
 */

export function newForm<ModelType extends Object>(
  model: ModelType,
  validation_options?: Partial<ValidationProperties<ModelType>>,
  form_properties?: Partial<Form<ModelType>>
): Writable<Form<ModelType>> {
  const form = new Form(model, validation_options, form_properties);
  return writable(form);
}

/**
 * ---------------------------------------------------------------------------
 * Formvana Form Class
 *
 * Main Concept: fields and model are separate.
 * Fields are built from the model, via the @field() decorator.
 * We keep the fields and the model in sync via model property names
 * and field[name].
 *
 * Form is NOT initially valid.
 *
 * Functions are camelCase.
 * Variables and stores are snake_case.
 * Everyone will love it.
 *
 * ---------------------------------------------------------------------------
 */
export class Form<ModelType extends Object> {
  constructor(
    model: ModelType,
    validation_options?: Partial<ValidationProperties<ModelType>> | Object,
    form_properties?: Partial<Form<ModelType>>
  ) {
    if (form_properties) Object.assign(this, form_properties);

    /** If there's a model, set the inital state's and build the fields */
    if (model) {
      this.model = model;
      this.buildFields();
    } else {
      throw new Error("Model is not valid. Please use a valid (truthy) model.");
    }

    if (validation_options) {
      Object.assign(this.validation_options, validation_options);
    } else {
      console.warn("No ValidationProperties have been added.");
    }

    if (this.refs) this.attachReferenceData();

    if (this.disabled_fields)
      _setFieldAttributes(this.disabled_fields, this.fields, {
        disabled: true,
        attributes: { disabled: true },
      });

    if (this.hidden_fields)
      _setFieldAttributes(this.hidden_fields, this.fields, {
        hidden: true,
      });

    /**
     * Wait until everything is initalized, then set the inital state.
     * Don't call updateInitialState because it sets changed = false.
     */
    _setInitialState(this, this.initial_state);
  }

  //#region ---------------- Fields ----------------

  /**
   * HTML Node of form object.
   */
  node?: HTMLFormElement;

  /**
   * This is your form Model/Schema.
   * Used to build the form.fields.
   */
  model: ModelType;

  /**
   * Fields are built using model's reflection metadata.
   * Or using an array of field configuration objects.
   */
  fields: Array<FieldConfig<ModelType>> = [];

  /**
   * Errors are attached to their corresponding fields.
   * This pattern adds flexibility at the cost of a little complexity and
   * object size.
   *
   * When a single field is validated, the whole model is validated (if
   * using class-validator).
   * We don't show all the errors to the user, only the field emmiting the
   * event.
   * This way, we know if the form is still invalid, even if we aren't
   * showing the user any errors (like, pre-submit-button press).
   */
  errors: ValidationError[] = [];

  /**
   * validation_options contains the logic and configuration for
   * validating the form as well as linking errors to fields
   * and displaying the errors
   */
  validation_options?: ValidationProperties<ModelType> =
    new ValidationProperties<ModelType>();

  /** Which events should the form dispatch side effects? */
  on_events: OnEvents<HTMLElementEventMap> = new OnEvents({
    input: true,
    change: true,
    blur: true,
    submit: true,
  });

  /** Is the form valid? */
  valid: Writable<boolean> = writable(false);
  /** Has the form state changed from it's initial value? */
  changed: Writable<boolean> = writable(false);
  /** Has the form been altered in any way? */
  pristine: Writable<boolean> = writable(true);
  /** Is the form loading? */
  loading: Writable<boolean> = writable(false);

  /**
   * refs hold any reference data you'll be using in the form
   *
   * Call attachReferenceData() to link reference data to form or pass it
   * via the constrictor.
   *
   * Fields & reference data are linked via field.ref_key
   *
   * * Format:
   * * {[ref_key]: string, Array<{[label]: string, [value]: any, [data]?: any}>}
   *
   * @UseCase seclet dropdowns, radio buttons, etc.
   */
  refs?: ReferenceData;

  /**
   * Form Template Layout
   *
   * Render the form into a custom svelte template!
   * Use a svelte component. Or use a string as the selector.
   * * The template/component must accept {form} prop
   *
   * Note: add ` types": ["svelte"] ` to tsconfig compilerOptions
   * to remove TS import error of .svelte files (for your template)
   */
  template?:
    | string
    | typeof SvelteComponentDev
    | typeof SvelteComponent
    | typeof SvelteComponent;

  /**
   * This is the form's initial state.
   * It's only initial model and errors.
   * We're keeping this simple.
   */
  initial_state: InitialFormState<ModelType> = {
    model: {},
    errors: undefined,
  };

  /**
   * Emits value changes as a plain JS object.
   * Format: { [field.name]: value }
   *
   * Very similar to Angular form.valueChanges
   */
  value_changes: Writable<
    Record<keyof ModelType | any, ModelType[keyof ModelType]>
  > = writable({});

  /**
   * Optional field layout, if you aren't using a class object.
   * "no-class" method of building the fields.
   */
  field_schema?: FormFieldSchema;

  /**
   * This allows you to filter fields based on a given form name.
   *
   * @example user model can be used for login and signup
   * @example for_form="login" && for_form="signup"
   */
  for_form?: string;

  /**
   * Any extra data you may want to pass around.
   * @examples description, name, type, header, label, classes, etc.
   */
  meta?: Record<string, any>;

  /** Use the NAME of the field (field.name) to disable/hide the field. */
  hidden_fields?: Array<keyof ModelType>;
  /** Use the NAME of the field (field.name) to disable/hide the field. */
  disabled_fields?: Array<keyof ModelType>;

  /**
   * Determines the ordering of this.fields.
   * Simply an array of field names (or group names or stepper names)
   * in the order to be displayed
   */
  #field_order?: Array<keyof ModelType>;

  /**
   * We keep track of required fields because validation handles everything
   * except *required* (field.required)
   * @example If there are no required fields, but there ARE errors, the form is still
   * valid. Get it?
   *
   * Keeping track of the required fields allows us to  validate faster.
   */
  #required_fields: Array<keyof ModelType> = [];
  //#endregion xxxxxxxxxxxxxxxx Fields xxxxxxxxxxxxxxxx

  // #region ---------------- Form API ----------------
  // #region - Form Setup

  /**
   * Builds the fields from the model.
   * Builds the field configs via this.model using metadata-reflection.
   * Or via form.field_shcema
   */
  buildFields = (model: ModelType = this.model): Form<ModelType> => {
    if (this.field_schema) {
      this.fields = _buildFormFieldsWithSchema(
        this.field_schema,
        this.for_form
      );
    } else {
      this.fields = _buildFormFields(model, this.for_form);
    }

    this.#required_fields = this.fields
      .filter((f) => f.required)
      .map((f) => f.name as keyof ModelType);
    /** NOTE: Returning this allows method chaining. */
    return this;
  };

  /**
   * * Required for form setup.
   *
   * ATTACH TO SAME ELEMENT AS FIELD.NAME {name}!
   * This hooks up the event listeners!
   *
   * Used to grab fields and attach event listeners to each field.
   * Simply loop over the model, checking the form's node
   * for each model[name]. If a field element is found, then
   * attach on_event listeners to the given field.
   *
   * This is for Svelte's "use:FUNCTION" feature.
   * The "use" directive passes the HTML Node as a parameter
   * to the given function (e.g. use:useField(node: HTMLElement)).
   */
  useForm = (node: HTMLFormElement) => {
    this.node = node;

    /** Set up form/fields here */
    let key: keyof ModelType;
    for (key in this.model) {
      const elements = node.querySelectorAll(`[name="${key}"]`);

      if (elements && elements.length === 1) {
        const element = elements[0];
        this.useField(element as FieldNode<ModelType>);
      } else if (elements.length > 1) {
        elements.forEach((element) => {
          this.useField(element as FieldNode<ModelType>);
        });
      }
    }

    if (this.validation_options?.error_display !== "constraint")
      this.node.noValidate = true;
  };

  /**
   * This is used to hook up event listeners to a field.
   *
   * You can also use this to add form controls to the Form class.
   * @example form control is outside of the form element so
   * use:useField is added to the element to hook enent listens into it,
   * same as all other controls inside the form element
   */
  useField = (node: FieldNode<ModelType>): FieldConfig<ModelType> => {
    /** Attach HTML Node to field so we can remove event listeners later */
    const field = _get(node.name, this.fields);
    field.node = node;

    if (this.on_events)
      _attachEventListeners(field, this.on_events, (e: ElementEvent) =>
        _executeValidationEvent(
          this,
          this.#required_fields,
          field,
          undefined,
          e
        )
      );
    return field;
  };

  //#endregion

  // #region - Validation

  /**
   * Validate the form!
   * You can pass in callbacks as needed.
   * Callbacks can be called "before" or "after" validation.
   */
  validate = (
    callbacks?: ValidationCallback[]
  ): Promise<ValidationError[]> | undefined => {
    return _executeValidationEvent(
      this,
      this.#required_fields,
      undefined,
      callbacks
    );
  };

  /** If want to (in)validate a specific field for any reason */
  validateField = (
    field_name: keyof ModelType,
    with_message?: string,
    callbacks?: ValidationCallback[]
  ): Form<ModelType> => {
    const field = _get(field_name, this.fields);
    if (!with_message) {
      _executeValidationEvent(this, this.#required_fields, field, callbacks);
    } else {
      const err = new ValidationError(
        field_name as string,
        { error: with_message },
        { value: get(field.value) }
      );
      this.errors.push(err);
      if (this.node)
        _linkAllErrors(
          this.errors,
          this.fields,
          this.validation_options?.error_display,
          this.node
        );
    }
    /** NOTE: Returning this allows method chaining. */
    return this;
  };

  /**
   * Attach a callback to a field or array of fields.
   * If the callback if type ValidationCallback it will be added
   * to the validation handler
   */
  attachCallbacks = (
    event: keyof HTMLElementEventMap,
    callback: Callback | ValidationCallback,
    field_names: keyof ModelType | Array<keyof ModelType>
  ): Form<ModelType> => {
    /** If there are multiple fields passed in then loop over to add callbacks */
    if (Array.isArray(field_names)) {
      const fields = field_names.map((f) => _get(f, this.fields));
      fields.forEach((f) =>
        _addCallbackToField(this, f, event, callback, this.#required_fields)
      );
    } else {
      /** If there is one field, add callback to field */
      const field = _get(field_names, this.fields);
      _addCallbackToField(this, field, event, callback, this.#required_fields);
    }
    /** NOTE: Returning this allows method chaining. */
    return this;
  };

  /** Clear ALL the errors. */
  clearErrors = (): Form<ModelType> => {
    this.errors = [];
    this.fields.forEach((f) => {
      f.clearErrors();
    });
    /** NOTE: Returning this allows method chaining. */
    return this;
  };

  //#endregion

  // #region - Utility Methods

  /** Get Field by name */
  get = <T extends ModelType>(field_name: keyof T): FieldConfig<T> =>
    _get(field_name, this.fields);

  /**
   * Load new data into the form and build the fields.
   * Data is updated IN PLACE by default.
   * Reinitialize is set to false, by default.
   *
   * Inital State is not updated by default.
   */
  loadModel = <T extends ModelType>(
    model: T,
    reinitialize: boolean = false,
    update_initial_state: boolean = false
  ): Form<ModelType> => {
    if (reinitialize) {
      this.model = model;
      this.buildFields();
    } else {
      let key: keyof ModelType;
      for (key in this.model) {
        this.model[key] = model[key];
      }
      _linkAllValues(false, this.fields, this.model);
    }

    if (update_initial_state) this.updateInitialState();

    /** NOTE: Returning this allows method chaining. */
    return this;
  };

  /**
   * Set the value for a field or set of fields.
   * Sets both field.value and model value.
   */
  setValue = (
    field_names: Array<keyof ModelType> | keyof ModelType,
    value: any
  ): Form<ModelType> => {
    if (Array.isArray(field_names)) {
      field_names.forEach((f) => {
        const field = _get(f, this.fields);
        field.value.set(value);
        this.model[f] = value;
      });
    } else {
      const field = _get(field_names, this.fields);
      field.value.set(value);
      this.model[field_names] = value;
    }
    /** NOTE: Returning this allows method chaining. */
    return this;
  };

  /**
   * Pass in the reference data to add options to fields.
   */
  attachReferenceData = (refs?: ReferenceData): Form<ModelType> => {
    /** Get all fields with ref_key property */
    const fields_with_ref_keys = this.fields.filter((f) => f.ref_key);
    /** Check if there are refs being passed in */
    if (refs) {
      this.refs = refs;
      fields_with_ref_keys.forEach((field) => {
        if (field.ref_key) field.options = refs[field.ref_key];
      });
    } else if (this.refs) {
      /** Else if this.refs are already attached, add the options to fields */
      fields_with_ref_keys.forEach((field) => {
        if (field.ref_key && this.refs)
          field.options = this.refs[field.ref_key];
      });
    }
    /** NOTE: Returning this allows method chaining. */
    return this;
  };

  /**
   *! Make sure to call this when the component is unloaded/destroyed
   * Removes all event listeners.
   */
  destroy = (): Form<ModelType> => {
    if (this.fields && this.fields.length > 0) {
      // For each field...
      this.fields.forEach((f) => {
        // Remove all the event listeners!
        if (this.on_events)
          Object.keys(this.on_events).forEach((key) => {
            f.node &&
              f.node.removeEventListener(key, (ev: Event) =>
                _executeValidationEvent(
                  this,
                  this.#required_fields,
                  f,
                  undefined,
                  ev as ElementEvent
                )
              );
          });
      });
    }
    /** NOTE: Returning this allows method chaining. */
    return this;
  };

  //#endregion

  // #region - Form State

  /**
   * Resets to the inital state of the form.
   *
   * Only model and errors are saved in initial state.
   */
  reset = (): Form<ModelType> => {
    _resetState(this, this.initial_state);
    /** NOTE: Returning this allows method chaining. */
    return this;
  };

  /** Well, this updates the initial state of the form. */
  updateInitialState = (): Form<ModelType> => {
    _setInitialState(this, this.initial_state);
    this.changed.set(false);
    /** NOTE: Returning this allows method chaining. */
    return this;
  };

  //#endregion

  // #region - Layout

  getFieldGroups = (): Array<
    FieldConfig<ModelType> | Array<FieldConfig<ModelType>>
  > => {
    return _hanldeFieldGroups(this.fields);
  };

  /**
   * Set the field order.
   * Layout param is simply an array of field (or group)
   * names in the order to be displayed.
   * Leftover fields are appended to bottom of form.
   */
  setFieldOrder = (order: Array<keyof ModelType>): Form<ModelType> => {
    if (order && order.length > 0) {
      this.#field_order = order;
      this.fields = _setFieldOrder(this.#field_order, this.fields);
    }
    /** NOTE: Returning this allows method chaining. */
    return this;
  };

  /**
   * Set attributes on a given set of fields.
   *
   * @exapmle to hide several fields:
   * names = [field.name, field.name],
   * attributes = { hidden: true };
   */
  setFieldAttributes = (
    names: string | Array<keyof ModelType>,
    attributes: Partial<FieldConfig<ModelType>>
  ): Form<ModelType> => {
    if (names) {
      if (Array.isArray(names)) {
        _setFieldAttributes(names, this.fields, attributes);
      } else {
        _setFieldAttributes(
          [names as keyof ModelType],
          this.fields,
          attributes
        );
      }
    }
    /** NOTE: Returning this allows method chaining. */
    return this;
  };

  //#endregion

  //#endregion xxxxxxxxxxxxxxxx Form API xxxxxxxxxxxxxxxx
}
