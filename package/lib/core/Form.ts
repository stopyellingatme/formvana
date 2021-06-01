import { get, writable, Writable } from "svelte/store";
import { SvelteComponent, SvelteComponentDev } from "svelte/internal";
import { FieldConfig } from ".";
import {
  OnEvents,
  RefData,
  ValidationError,
  ValidationCallback,
  Callback,
  ValidationOptions,
  InitialFormState,
} from "./Types";
import {
  _buildFormFields,
  _get,
  _attachEventListeners,
  _linkAllErrors,
  _linkValues,
  _requiredFieldsValid,
  _setFieldOrder,
  _setInitialState,
  _resetState,
  _executeValidationEvent,
  _addCallbackToField,
  _setFieldAttributes,
  _buildFormFieldsWithSchema,
} from "./formMethods";

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
 *  - Tested on late 2014 mbp - 2.5ghz core i7, 16gb ram
 *
 * @TODO Time to redo the readme.md file! Lots have changed since then!
 *
 * @TODO Create easy component/pattern for field groups and stepper/wizzard
 *
 * @TODO Do the stepper example and clean up the Form Manager interface
 * @TODO More robust testing with different input types
 * @TODO Add several plain html/css examples (without tailwind)
 * @TODO Clean up form control creation/binding - too complex, currently.
 */

/**
 * Formvana Form Class
 *
 * Main Concept: fields and model are separate.
 * Fields are built using the model, via the @field() decorator.
 * We keep the fields and the model in sync via your model property names
 * and field[name].
 *
 * Form is NOT valid, initially.
 *
 * Functions are camelCase.
 * Variables and stores are snake_case.
 * Everyone will love it.
 *
 */
export class Form<ModelType extends Object> {
  constructor(
    model: ModelType,
    validation_options: Partial<ValidationOptions>,
    form_properties?: Partial<Form<ModelType>>
  ) {
    if (form_properties) Object.assign(this, form_properties);

    /** If there's a model, set the inital state's and build the fields */
    if (model) {
      this.model = model;
    } else {
      throw new Error("Model is not valid. Please use a valid model.");
    }

    if (validation_options) {
      Object.assign(this.validation_options, validation_options);
    } else {
      throw new Error(
        "Please add a validator with ReturnType<Promise<ValidationError[]>>"
      );
    }

    this.buildFields();

    if (this.refs) this.attachRefData();

    if (this.disabled_fields)
      _setFieldAttributes(this.disabled_fields, this.fields, {
        disabled: true,
        attributes: { disabled: true },
      });

    if (this.hidden_fields)
      _setFieldAttributes(this.hidden_fields, this.fields, {
        hidden: true,
      });

    /** Wait until everything is initalized, then set the inital state. */
    _setInitialState(this, this.initial_state);
  }

  //#region ** Fields **

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
   * This pattern adds flexibility at the cost of a little complexity and object size.
   *
   * When a single field is validated, the whole model is validated (if
   * using class-validator).
   * We just don't show all the errors to the user.
   * This way, we know if the form is still invalid, even if we aren't
   * showing the user any errors (like, pre-submit-button press).
   */
  errors: ValidationError[] = [];

  /**
   * validation_options contains the logic and configuration for
   * validating the form as well as linking errors to fields.
   * If you're using class-validator, just pass in the validate func
   */
  validation_options: ValidationOptions = {
    validator: async () => [],
    on_events: new OnEvents(),
    /** When to link this.field values to this.model values */
    link_fields_to_model: "always",
    /** Options from class-validator, thats why snake and camel case mixing */
    // options: {},
  };

  /** Is the form valid? */
  valid: Writable<boolean> = writable(false);
  /** Has the form state changed from it's initial value? */
  changed: Writable<boolean> = writable(false);
  /** Has the form been altered in any way? */
  pristine: Writable<boolean> = writable(true);
  /** Is the form loading? */
  loading: Writable<boolean> = writable(false);

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
   * refs hold any reference data you'll be using in the form
   * e.g. seclet dropdowns, radio buttons, etc.
   *
   * If you did not set the model in constructor:
   * Call attachRefData() to link the data to the respective field
   *
   * * Format:
   * * Record<ref_key: string, Array<{label: string, value: any, data?: any}>>
   *
   * * Fields & reference data are linked via field.ref_key
   */
  refs?: RefData;

  /**
   * Emits value changes as a plain JS object.
   * Format: { [field.name]: value }
   *
   * Similar to Angular form.valueChanges
   */
  value_changes: Writable<
    Record<keyof ModelType | any, ModelType[keyof ModelType]>
  > = writable({});

  /**
   * This is the model's initial state.
   * It's only initial model and errors.
   * We're keeping this simple.
   */
  initial_state: InitialFormState<ModelType> = {
    model: {},
    errors: undefined,
  };

  /** Use the NAME of the field (field.name) to disable/hide the field. */
  hidden_fields?: Array<keyof ModelType>;
  /** Use the NAME of the field (field.name) to disable/hide the field. */
  disabled_fields?: Array<keyof ModelType>;

  /**
   * Any extra data you may want to pass around.
   * @examples description, name, type, header, label, classes, etc.
   *
   * * If you're using the field.for_form propery, set form name here.
   */
  meta?: Record<string, string | number | boolean | Object>;

  /**
   * Determines the ordering of this.fields.
   * Simply an array of field names (or group names or stepper names)
   * in the order to be displayed
   *
   */
  #field_order?: Array<keyof ModelType>;

  /**
   * We keep track of required fields because we let class-validator handle everything
   * except *required* (field.required)
   * If there are no required fields, but there ARE errors, the form is still
   * valid. Get it?
   * Keep track of the fields so we can validate faster.
   */
  #required_fields: Array<keyof ModelType> = [];

  //#endregion ^^ Fields ^^

  // #region ** Form API **

  // #region - Form Setup

  /**
   * Builds the fields from the model.
   * Builds the field configs via this.model using metadata-reflection.
   *
   * @TODO Allow plain JSON model, fields and schema validation/setup
   */
  buildFields = (model: ModelType = this.model): void => {
    if (this.validation_options.schema) {
      this.fields = _buildFormFieldsWithSchema(
        this.validation_options.schema,
        this.meta
      );
    } else {
      this.fields = _buildFormFields(model, this.meta);
    }

    this.#required_fields = this.fields
      .filter((f) => f.required)
      .map((f) => f.name as keyof ModelType);
  };

  /**
   * Aim for "no-class" initialization model:
   *
   * take Array<Partial<FieldConfig>> &
   *
   *      validation schema &
   *
   *      JSON model
   *
   *  => Form<Object>
   *
   * Model keys must match fieldConfig name & validation schema
   * property keys.
   *
   *
   */

  /**
   * ATTACH TO SAME ELEMENT AS FIELD.NAME {name}!
   * This hooks up the event listeners!
   *
   * This is for Svelte's "use:FUNCTION" feature.
   * The "use" directive passes the HTML Node as a parameter
   * to the given function (e.g. use:useField(node: HTMLElement)).
   *
   * Use on the element that will be interacted with.
   * e.g. <input/> -- <button/> -- <select/> -- etc.
   * Check examples folder for more details.
   */
  useField = (node: HTMLElement & { name: keyof ModelType }): void => {
    /** Attach HTML Node to field so we can remove event listeners later */
    const field = _get(node.name, this.fields);
    field.node = node;

    if (this.validation_options.on_events)
      _attachEventListeners(
        field,
        this.validation_options.on_events,
        (e: Event) =>
          _executeValidationEvent(
            this,
            this.#required_fields,
            field,
            undefined,
            e
          )
      );
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

  /**
   * Validate the form, async!
   * You can pass in callbacks as needed.
   * Callbacks can be applied "before" or "after" validation.
   */
  validateAsync = async (
    callbacks?: ValidationCallback[]
  ): Promise<ValidationError[] | undefined> => {
    return await _executeValidationEvent(
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
  ): void => {
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
      _linkAllErrors(this.errors, this.fields);
    }
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
  ): void => {
    if (Array.isArray(field_names)) {
      const fields = field_names.map((f) => _get(f, this.fields));
      fields.forEach((f) => {
        _addCallbackToField(this, f, event, callback, this.#required_fields);
      });
    } else {
      const field = _get(field_names, this.fields);
      _addCallbackToField(this, field, event, callback, this.#required_fields);
    }
  };

  /** Clear ALL the errors. */
  clearErrors = (): void => {
    this.errors = [];
    this.fields.forEach((f) => {
      f.errors.set(undefined);
    });
  };

  //#endregion

  // #region - Utility Methods

  /** Get Field by name */
  get = <T extends ModelType>(field_name: keyof T): FieldConfig<T> => {
    return _get(field_name, this.fields);
  };

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
      _linkValues(false, this.fields, this.model);
    }

    if (update_initial_state) this.updateInitialState();

    return this;
  };

  /** Set the value for a field or set of fields */
  setValue = (
    field_names: Array<keyof ModelType> | keyof ModelType,
    value: any
  ): void => {
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
  };

  /**
   * Pass in the reference data to add options to fields.
   */
  attachRefData = (refs?: RefData): void => {
    const fields_with_ref_keys = this.fields.filter((f) => f.ref_key);
    if (refs) {
      this.refs = refs;
      fields_with_ref_keys.forEach((field) => {
        if (field.ref_key) field.options = refs[field.ref_key];
      });
    } else if (this.refs) {
      fields_with_ref_keys.forEach((field) => {
        if (field.ref_key && this.refs)
          field.options = this.refs[field.ref_key];
      });
    }
  };

  /**
   *! Make sure to call this when the component is unloaded/destroyed
   * Removes all event listeners and clears the form state.
   */
  destroy = (): void => {
    if (this.fields && this.fields.length > 0) {
      // For each field...
      this.fields.forEach((f) => {
        // Remove all the event listeners!
        if (this.validation_options.on_events)
          Object.keys(this.validation_options.on_events).forEach((key) => {
            f.node &&
              f.node.removeEventListener(key, (ev) => {
                (e: Event) =>
                  _executeValidationEvent(this, this.#required_fields, f);
              });
          });
      });
    }
  };

  //#endregion

  // #region - Form State

  /** Resets to the inital state of the form. */
  reset = (): void => {
    _resetState(this, this.initial_state);
  };

  /** Well, this updates the initial state of the form. */
  updateInitialState = (): void => {
    _setInitialState(this, this.initial_state);
    this.changed.set(false);
  };

  //#endregion

  // #region - Layout

  /**
   * Set the field order.
   * Layout param is simply an array of field (or group)
   * names in the order to be displayed.
   * Leftover fields are appended to bottom of form.
   */
  setFieldOrder = (order: Array<keyof ModelType>): void => {
    if (order && order.length > 0) {
      this.#field_order = order;
      this.fields = _setFieldOrder(this.#field_order, this.fields);
    }
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
  ): void => {
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
  };

  //#endregion

  //#endregion ^^ Form API ^^
}
