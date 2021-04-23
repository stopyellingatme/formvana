import { ValidatorOptions } from "class-validator/types";
import { ValidationError, validate, validateOrReject } from "class-validator";
import { get, writable, Writable } from "svelte/store";
import { FieldConfig } from ".";
import { OnEvents, LinkOnEvent, RefData } from "./types";
import {
  _buildFormFields,
  _getRequiredFieldNames,
  _get,
  _attachEventListeners,
  _attachOnClearErrorEvents,
  _linkFieldErrors,
  _linkErrors,
  _linkValues,
  _requiredFieldsValid,
  _getStateSnapshot,
  _hasChanged,
  _hideFields,
  _disableFields,
  _createOrder,
  _clearState,
  _setInitialState,
  _resetState,
  _handleValidation,
  _handleOnEvent,
  _validateField,
  _usePlugins,
} from "./internal";

/**
 * Formvana - Form Class
 * Form is NOT valid, initially.
 * If you want to make it valid, this.valid.set(true).
 *
 * The main thing to understand here is that the fields and the model are separate.
 * Fields are built using the model, via the @field() & @editable() decorators.
 * We keep the fields and the model in sync (simply) via model property names
 * which are mapped to field.name.
 * We do our best to initialize this thing with good, sane defaults without
 * adding too many restrictions.
 *
 *
 * Recommended Use:
 *  - Initialize let form = new Form(model, {refs: REFS, template: TEMPLATE, etc.})
 *  - Set the model (if you didn't in the first step)
 *  - Attach reference data (if you didn't in the first step)
 *  - Storify the form - check example.form.ts for an example
 *  - Now you're ready to use the form!
 *  - Pass it into the DynamicForm component and let the form generate itself!
 *
 * Note: You will probably have to use form and field templates as this lib only comes
 * with default html form layout & fields.
 *
 * Performance is blazing with < 500 fields.
 * Can render up to 2000 inputs in per class/fields.
 * Just break it up into 100 or so fields per form (max 250) if its a huge form.
 *  - Tested on late 2014 mbp - 2.5ghz core i7, 16gb ram
 *
 * TODO: Decouple class-validator as to allow validation to be plugin based
 * TODO: Create easy component/pattern for field groups and stepper/wizzard
 * TODO: Create plugin base for form template styling
 * TODO: Add high performance options
 */
export class Form<FormModelType extends Object> {
  constructor(model: FormModelType, init?: Partial<Form<FormModelType>>) {
    if (init) {
      Object.keys(this).forEach((key) => {
        if (init[key]) {
          this[key] = init[key];
        }
      });
    }
    // If there's a model, set the inital state's and build the fields
    if (model) {
      this.model = model;
      this.buildFields();
    } else {
      throw new Error("Model is not valid. Please pass in a valid model.");
    }
    // If they passed in a field order, set the order.
    if (this.field_order && this.field_order.length > 0) {
      this.setOrder(this.field_order);
    }
    // Well well, reference data. Better attach that to the fields.
    if (this.refs) {
      this.attachRefData();
    }

    if (this.disabled_fields && this.disabled_fields.length > 0) {
      _disableFields(this.disabled_fields, this.field_names, this.fields);
    }

    if (this.hidden_fields && this.hidden_fields.length > 0) {
      _hideFields(this.hidden_fields, this.field_names, this.fields);
    }

    // Wait until everything is initalized then set the inital state.
    _setInitialState(
      this,
      this.stateful_items,
      this.initial_state,
      this.initial_state_str
    );
  }

  //#region ** Fields **

  //#region Core Functionality Fields

  /**
   * This is your form Model/Schema.
   *
   * (If you didn't set the model in the constructor)
   * When model is set, call buildFields() to build the fields.
   */
  model: FormModelType;

  /**
   * Fields are built from the model's metadata using reflection.
   * If model is set, call buildFields().
   */
  fields: FieldConfig[] = [];

  /**
   * refs hold any reference data you'll be using in the form
   * e.g. seclet dropdowns, radio buttons, etc.
   *
   * If you did not set the model in constructor:
   * Call attachRefData() to link the data to the respective field
   *
   * * Fields & reference data are linked via field.ref_key
   */
  refs: RefData = {};

  /**
   * TODO: Decouple class-validator/allow other validators!
   * TODO: Change this to a custom type that takes the type of validator
   * TODO: and the validators options. This will help decouple
   *
   * Validation options come from class-validator ValidatorOptions.
   *
   * Biggest perf increase comes from setting validationError.target = false
   * (so the whole model is not attached to each error message)
   */
  readonly validation_options: ValidatorOptions = {
    skipMissingProperties: false,
    whitelist: false,
    forbidNonWhitelisted: false,
    dismissDefaultMessages: false,
    groups: [],
    validationError: {
      target: false,
      value: false,
    },
    forbidUnknownValues: true,
    stopAtFirstError: false,
  };

  /**
   * The errors are of type ValidationError which comes from class-validator.
   * Errors are usually attached to the fields which the error is for.
   * This pattern adds flexibility at the cost of a little complexity.
   */
  errors: ValidationError[] = [];

  /**
   * These next properties are all pretty self-explanatory.
   *
   * this.valid is a svelte store so we can change the state of the variable
   * inside of the class and it (the change) will be reflected
   * in the external form context.
   */
  valid: Writable<boolean> = writable(false);
  loading: Writable<boolean> = writable(false);
  changed: Writable<boolean> = writable(false);
  touched: Writable<boolean> = writable(false);

  /**
   * Emits value changes as a plain JS object.
   * Format: { [field.name]: value }
   *
   * Similar to Angular form.valueChanges
   */
  value_changes: Writable<Record<string, any>> = writable({});

  /**
   * Use the NAME of the field (field.name) to disable/hide the field.
   */
  hidden_fields: string[] = [];
  disabled_fields: string[] = [];

  /**
   * Which events should the form do things on?
   * (validate, link values, hide/disable fields)
   */
  readonly on_events: OnEvents = new OnEvents();
  // Which events should we clear the field errors on?
  readonly clear_errors_on_events: OnEvents = new OnEvents({}, true);

  // When to link this.field values to this.model values
  readonly link_fields_to_model: LinkOnEvent = LinkOnEvent.Always;

  //#endregion

  //#region Field Styling

  /**
   * Determines the ordering of this.fields.
   * Simply an array of field names (or group names or stepper names)
   * in the order to be displayed
   */
  field_order: string[] = [];

  /**
   * Form Template Layout
   *
   * Render the form into a custom svelte template!
   * Use a svelte component.
   * * The component/template must accept {form} prop
   *
   * Note: add ` types": ["svelte"] ` to tsconfig compilerOptions
   * to remove TS import error of .svelte files (for your template)
   */
  template: any = null;

  //#endregion

  //#region Internal Fields

  // Used to make checking for disabled/hidden fields faster
  private field_names: string[] = [];
  /**
   * This is the model's initial state.
   * Shove the stateful_items into the inital state for a decent snapshot.
   */
  private initial_state: any = {};
  private initial_state_str: string = "";
  private stateful_items = [
    "valid",
    "touched",
    "changed",
    "changes",
    "errors",
    "required_fields",
    "refs",
    "field_order",
    "model",
    "hidden_fields",
    "disabled_fields",
  ];

  /**
   * We keep track of required fields because we let class-validator handle everything
   * except *required* (field.required)
   * So if there are no required fields, but there are errors, the form is still
   * valid. This is the mechanism to help keep track of that.
   * Keep track of the fields so we can validate faster.
   */
  private required_fields: string[] = [];

  //#endregion

  //#endregion ^^ Fields ^^

  //#region ** Form API **

  //#region - Form Setup

  /**
   * Build the field configs via this.model using metadata-reflection.
   */
  private buildFields = (model = this.model): void => {
    this.fields = _buildFormFields(model);
    // Set the field names for faster searching
    //(instead of mapping the names (potentially) each keystoke)
    this.field_names = this.fields.map((f) => f.name);
    this.required_fields = _getRequiredFieldNames(this.fields);
  };

  /**
   * ATTACH TO SAME ELEMENT AS FIELD.NAME!
   *
   * Use on the element that will be interacted with.
   * e.g. <input/> -- <button/> -- <select/> -- etc.
   * Check lib/svelte/defaults for more examples.
   *
   * * This hooks up the event listeners!
   *
   * This is for Svelte's "use:FUNCTION" feature.
   * The "use" directive passes the HTML Node as a parameter
   * to the given function (e.g. use:useField(node: HTMLNode)).
   *
   * TODO: Create new Type that has/adds/includes node.name
   */
  useField = (node: HTMLElement): void => {
    // Attach HTML Node to field so we can remove event listeners later
    //@ts-ignore
    const f = _get(node.name, this.fields);
    f.node = node;

    _attachEventListeners(f, this.on_events, (e: Event) =>
      _handleOnEvent(
        this,
        this.required_fields,
        this.stateful_items,
        this.initial_state_str,
        this.field_names,
        f
      )
    );
    _attachOnClearErrorEvents(node, this.clear_errors_on_events, (e: Event) => {
      f.errors.set(null);
    });
  };

  /**
   * Load new data into the form and build the fields.
   * Useful if you fetched data and need to update the form values.
   *
   * ReInit defaults to True. So the default is to pass in a new instance
   * of the model (e.g. new ExampleMode(incoming_data)).
   * If fresh is False then the incoming_data will be serialized into
   * the model.
   *
   * State is updated upon data load, by default.
   *
   * Check example.form.ts for an example use case.
   */
  loadData = <T extends FormModelType>(
    data: T,
    re_init: boolean = true,
    update_initial_state: boolean = true
  ): Form<FormModelType> => {
    if (re_init) {
      this.model = data;
      this.buildFields();
    } else {
      Object.keys(this.model).forEach((key) => {
        this.model[key] = data[key];
      });
      _linkValues(false, this.fields, this.model);
    }

    if (update_initial_state) this.updateInitialState();

    return this;
  };

  /**
   * Just pass in the reference data and let the field configs do the rest.
   *
   * * Ref data MUST BE in format: Record<string, RefDataItem[]>
   */
  attachRefData = (refs?: RefData): void => {
    const fields_with_ref_keys = this.fields.filter((f) => f.ref_key);
    if (refs) {
      fields_with_ref_keys.forEach((field) => {
        if (field.ref_key) field.options = refs[field.ref_key];
      });
    } else if (this.refs) {
      fields_with_ref_keys.forEach((field) => {
        if (field.ref_key) field.options = this.refs[field.ref_key];
      });
    }
  };

  /**
   * TODO: Optionaly, attach the _handleOnEvents function?
   */
  addEventListenerToFields = (
    event: keyof HTMLElementEventMap,
    callback: Function,
    field_names: string | string[]
  ): void => {
    if (Array.isArray(field_names)) {
      const fields = field_names.map((f) => _get(f, this.fields));
      fields.forEach((f) => {
        f.node.addEventListener(event, (e) => callback(e), false);
      });
    } else {
      const field = _get(field_names, this.fields);
      field.node.addEventListener(event, (e) => callback(e), false);
    }
  };
  //#endregion

  //#region - Validation

  /**
   * Well, validate the form!
   * Clear the errors first, then do it, obviously.
   */
  validate = (): Promise<ValidationError[]> => {
    _usePlugins([
      this.clearErrors(),
      // Link the input from the field to the model.
      this.link_fields_to_model === LinkOnEvent.Always &&
        _linkValues(true, this.fields, this.model),
      _hideFields(this.hidden_fields, this.field_names, this.fields),
      _disableFields(this.disabled_fields, this.field_names, this.fields),
    ]);

    // Return class-validator validate() function.
    // Validate the model with given validation config.
    return validate(this.model, this.validation_options).then(
      (errors: ValidationError[]) => {
        _handleValidation(this, errors, this.required_fields);
        return errors;
      }
    );
  };

  validateAsync = async (): Promise<void> => {
    _usePlugins([
      this.clearErrors(),
      // Link the input from the field to the model.
      this.link_fields_to_model === LinkOnEvent.Always &&
        _linkValues(true, this.fields, this.model),
      _hideFields(this.hidden_fields, this.field_names, this.fields),
      _disableFields(this.disabled_fields, this.field_names, this.fields),
    ]);
    try {
      return await validateOrReject(this.model, this.validation_options);
    } catch (errors) {
      _handleValidation(this, errors, this.required_fields);
      // console.log("Errors: ", errors);
      return errors;
    }
  };

  /**
   * If want to (in)validate a specific field for any reason.
   */
  validateField = (field_name: string, message?: string): void => {
    const field = _get(field_name, this.fields);
    if (!message) {
      _validateField(this, field, this.required_fields);
    } else {
      const _err = new ValidationError(),
        err = Object.assign(_err, {
          property: field_name,
          value: get(field.value),
          constraints: [{ error: message }],
        });
      this.errors.push(err);
      _linkErrors(this.errors, this.fields);
    }
  };

  //#endregion

  //#region - Utility Methods

  // Get Field by name
  get = (field_name: string): FieldConfig => {
    return _get(field_name, this.fields);
  };

  /**
   * Generate a Svelte Store from the current "this".
   */
  storify = (): Writable<Form<FormModelType>> => {
    const f = writable(this);
    return f;
  };

  // Clear ALL the errors.
  clearErrors = (): void => {
    this.errors = [];
    this.fields.forEach((f) => {
      f.errors.set(null);
    });
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
        Object.keys(this.on_events).forEach((key) => {
          f.node.removeEventListener(key, (ev) => {
            (e: Event) =>
              _handleOnEvent(
                this,
                this.required_fields,
                this.stateful_items,
                this.initial_state_str,
                this.field_names,
                f
              );
            // this.validateField(f);
          });
        });
        Object.keys(this.clear_errors_on_events).forEach((key) => {
          f.node.removeEventListener(key, (e) => {
            f.errors.set(null);
          });
        });
      });
    }
    // Reset everything else.
    _clearState(this, this.initial_state, this.required_fields);
  };

  //#endregion

  //#region - Form State

  // Resets to the inital state of the form.
  reset = (): void => {
    _resetState(this, this.stateful_items, this.initial_state);
  };

  // Well, this updates the initial state of the form.
  updateInitialState = (): void => {
    _setInitialState(
      this,
      this.stateful_items,
      this.initial_state,
      this.initial_state_str
    );
    this.changed.set(false);
  };

  //#endregion

  //#region - Styling

  /**
   * Set the field order.
   * Layout param is simply an array of field (or group)
   * names in the order to be displayed.
   * Leftover fields are appended to bottom of form.
   */
  setOrder = (order: string[]): void => {
    this.field_order = order;
    this.fields = _createOrder(this.field_order, this.fields);
  };

  /**
   * Hide a field or fields
   * @param names? string | string[]
   */
  hideFields = (names?: string | string[]) => {
    if (names) {
      if (Array.isArray(names)) {
        this.hidden_fields.push(...names);
      } else {
        this.hidden_fields.push(names);
      }
    }
    _hideFields(this.hidden_fields, this.field_names, this.fields);
  };

  /**
   * Disable a field or fields
   * @param names? string | string[]
   */
  disableFields = (names?: string | string[]) => {
    if (names) {
      if (Array.isArray(names)) {
        this.disabled_fields.push(...names);
      } else {
        this.disabled_fields.push(names);
      }
    }
    _disableFields(this.disabled_fields, this.field_names, this.fields);
  };

  //#endregion

  //#endregion ^^ Form API ^^
}
