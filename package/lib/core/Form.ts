import { get, writable, Writable } from "svelte/store";
import { FieldConfig } from ".";
import {
  OnEvents,
  LinkOnEvent,
  RefData,
  PerformanceOptions,
  ValidationError,
  ValidationCallback,
  ValidatorFunction,
  Callback,
  ValidationOptions,
  InitialFormState,
} from "./types";
import {
  _buildFormFields,
  _getRequiredFieldNames,
  _get,
  _attachEventListeners,
  _attachOnClearErrorEvents,
  _linkFieldErrors,
  _linkAllErrors,
  _linkValues,
  _requiredFieldsValid,
  _hasStateChanged,
  _createOrder,
  _setInitialState,
  _resetState,
  _handleFormValidation,
  _handleValidationEvent,
  _executeCallbacks,
  _hanldeValueLinking,
  _addCallbackToField,
  _negateField,
} from "./internal";
import { SvelteComponent, SvelteComponentDev } from "svelte/internal";

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
 * Recommended Use:
 *  - Initialize let form = new Form(model, {refs: REFS, template: TEMPLATE, etc.})
 *  - Set the model (if you didn't in the first step)
 *  - Attach reference data (if you didn't in the first step)
 *  - Storify the form - check example.form.ts for an example
 *  - Now you're ready to use the form!
 *  - Pass it into the DynamicForm component and let the form generate itself!
 *
 * Performance is blazing with < 500 fields.
 * Can render up to 2000 inputs in per class/fields.
 * Just break it up into 100 or so fields per form (max 250) if its a huge form.
 *  - Tested on late 2014 mbp - 2.5ghz core i7, 16gb ram
 *
 * TODO: Create FormManager interface for dealing with FormGroup and FormStepper classes
 * TODO: Create easy component/pattern for field groups and stepper/wizzard
 * TODO: Create plugin base for form template styling
 *
 * TODO: Allow fields, model and validator to be passed in separately.
 *  - This will allow for a more "dynamic" form building experience
 */
export class Form<ModelType extends Object> {
  constructor(
    model: ModelType,
    validation_options: Partial<ValidationOptions>,
    init?: Partial<Form<ModelType>>
  ) {
    if (init) {
      Object.assign(this, init);
    }
    // If there's a model, set the inital state's and build the fields
    if (model) {
      this.model = model;
      this.buildFields();
    } else {
      throw new Error("Model is not valid. Please pass in a valid model.");
    }
    if (validation_options) {
      Object.assign(this.validation_options, validation_options);
      // this.validation_options.validator = validation_options.validator;
    } else {
      throw new Error(
        "Please add a validator with ReturnType<Promise<ValidationError[]>>"
      );
    }
    // If they passed in a field order, set the order.
    if (this.field_order && this.field_order.length > 0)
      this.setOrder(this.field_order);

    // Well well, reference data. Better attach that to the fields.
    if (this.refs) this.attachRefData();

    if (this.disabled_fields && this.disabled_fields.length > 0)
      _negateField(this.disabled_fields, this.field_names, this.fields, {
        type: "disable",
        value: true,
      });

    if (this.hidden_fields && this.hidden_fields.length > 0)
      _negateField(this.hidden_fields, this.field_names, this.fields, {
        type: "hide",
        value: true,
      });

    // Wait until everything is initalized then set the inital state.
    _setInitialState(
      this,
      this.initial_state,
    );
  }

  //#region ** Fields **

  //#region Core Functionality Fields

  /**
   * This is your form Model/Schema.
   * It's used to build the form.fields.
   *
   * The meat and potatos, some would say.
   */
  model: ModelType;

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
  refs?: RefData;

  /**
   * Validation Options contain the logic and config for validating
   * the form as well as linking errors to fields.
   *
   * Other, more fine grained options are in validation_options.options
   */
  validation_options: Partial<ValidationOptions> = {
    validator: undefined,
    options: {
      skipMissingProperties: false,
      dismissDefaultMessages: false,
      validationError: {
        target: false,
        value: false,
      },
      forbidUnknownValues: true,
      stopAtFirstError: false,
    },
    field_error_link_name: "property",
  };

  /**
   * The errors are of type ValidationError.
   * Errors are attached to their corresponding fields.
   * This pattern adds flexibility at the cost of a little complexity.
   *
   * When a single field is validated, the whole model is validated. We just don't
   * show all the errors to the user. This way, we know if the form is still invalid,
   * even if we aren't showing the user any errors (like, pre-submit-button press).
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
  hidden_fields?: Array<FieldConfig["name"]>;
  disabled_fields?: Array<FieldConfig["name"]>;

  /**
   * Which events should the form do things on?
   * (validate, link values, hide/disable fields)
   */
  on_events: OnEvents = new OnEvents();
  // Which events should we clear the field errors on?
  clear_errors_on_events: OnEvents = new OnEvents({}, true);

  // When to link this.field values to this.model values
  link_fields_to_model: LinkOnEvent = "always";

  //#endregion

  //#region Field Styling

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
  template?:
    | string
    | typeof SvelteComponentDev
    | typeof SvelteComponent
    | typeof SvelteComponent;

  /**
   * Determines the ordering of this.fields.
   * Simply an array of field names (or group names or stepper names)
   * in the order to be displayed
   */
  private field_order: Array<FieldConfig["name"]> = [];

  //#endregion

  //#region Internal Fields

  // Used to make checking for disabled/hidden fields faster
  private field_names: Array<FieldConfig["name"]> = [];
  /**
   * This is the model's initial state.
   * Shove the stateful_items into the inital state for a decent snapshot.
   */
  private initial_state: InitialFormState<ModelType> = {
    model: undefined,
    errors: undefined,
  };

  /**
   * We keep track of required fields because we let class-validator handle everything
   * except *required* (field.required)
   * So if there are no required fields, but there are errors, the form is still
   * valid. This is the mechanism to help keep track of that.
   * Keep track of the fields so we can validate faster.
   */
  private required_fields: Array<FieldConfig["name"]> = [];

  /**
   * Performance options!
   * Use these if you're trying to handle upwards of 1000+ inputs within a given model.
   *
   * link_all_values_on_event - we usually link all field values to the model on
   * each event call. If set to false, we only link the field affected in the OnEvent
   * which saves us iterating over each field and linking it to the model.
   */
  perf_options: Partial<PerformanceOptions> = {
    link_all_values_on_event: "all",
    enable_hidden_fields_detection: true,
    enable_disabled_fields_detection: true,
    enable_change_detection: true,
  };

  //#endregion

  //#endregion ^^ Fields ^^

  //#region ** Form API **

  //#region - Form Setup

  /**
   * Builds the fields from the model.
   * Builds the field configs via this.model using metadata-reflection.
   *
   * TODO: Allow JSON model and schema validation/setup
   */
  buildFields = (model = this.model): void => {
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
   * Check examples folder for more details.
   *
   * * This hooks up the event listeners!
   *
   * This is for Svelte's "use:FUNCTION" feature.
   * The "use" directive passes the HTML Node as a parameter
   * to the given function (e.g. use:useField(node: HTMLElement)).
   */
  useField = (node: HTMLElement & { name: string }): void => {
    // Attach HTML Node to field so we can remove event listeners later
    const field = _get(node.name, this.fields);
    field.node = node;

    _attachEventListeners(field, this.on_events, (e: Event) =>
      _handleValidationEvent(
        this,
        this.required_fields,
        this.field_names,
        field
      )
    );
    _attachOnClearErrorEvents(node, this.clear_errors_on_events, (e: Event) => {
      field.errors.set(null);
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
  loadData = <T extends ModelType>(
    data: T,
    re_init: boolean = true,
    update_initial_state: boolean = true
  ): Form<ModelType> => {
    if (re_init) {
      this.model = data;
      this.buildFields();
    } else {
      let key: keyof ModelType;
      for (key in this.model) {
        this.model[key] = data[key];
      }
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
  //#endregion

  //#region - Validation

  /**
   * Well, validate the form!
   * Clear the errors first, then do it, obviously.
   * Can also link fields values to model.
   * Can also hide or disable fields before validation.
   */
  validate = (
    callbacks?: ValidationCallback[]
  ): Promise<ValidationError[]> | undefined => {
    return _handleValidationEvent(
      this,
      this.required_fields,
      this.field_names,
      undefined,
      callbacks
    );
  };

  validateAsync = async (
    callbacks?: ValidationCallback[]
  ): Promise<ValidationError[] | undefined> => {
    return await _handleValidationEvent(
      this,
      this.required_fields,
      this.field_names,
      undefined,
      callbacks
    );
  };

  /**
   * If want to (in)validate a specific field for any reason.
   */
  validateField = (
    field_name: string,
    withMessage?: string,
    callbacks?: ValidationCallback[]
  ): void => {
    const field = _get(field_name, this.fields);
    if (!withMessage) {
      _handleValidationEvent(
        this,
        this.required_fields,
        this.field_names,
        field,
        callbacks
      );
    } else {
      const err = new ValidationError(
        field_name,
        { error: withMessage },
        { value: get(field.value) }
      );
      this.errors.push(err);
      _linkAllErrors(this.errors, this.fields);
    }
  };

  /**
   * Can attach event listeners to one or more fields.
   */
  addEventListenerToFields = (
    event: keyof HTMLElementEventMap,
    callback: Callback,
    field_names: string | string[]
  ): void => {
    if (Array.isArray(field_names)) {
      const fields = field_names.map((f) => _get(f, this.fields));
      fields.forEach((f) => {
        _addCallbackToField(
          this,
          f,
          event,
          callback,
          false,
          this.required_fields,
          this.field_names
        );
      });
    } else {
      const field = _get(field_names, this.fields);
      _addCallbackToField(
        this,
        field,
        event,
        callback,
        false,
        this.required_fields,
        this.field_names
      );
    }
  };

  /**
   * Add your own callbacks to the normal _handleValidationEvent method.
   */
  addValidationCallbackToFields = (
    event: keyof HTMLElementEventMap,
    callbacks: ValidationCallback[],
    field_names: string | string[]
  ): void => {
    if (Array.isArray(field_names)) {
      const fields = field_names.map((f) => _get(f, this.fields));
      fields.forEach((f) => {
        _addCallbackToField(
          this,
          f,
          event,
          callbacks,
          true,
          this.required_fields,
          this.field_names
        );
      });
    } else {
      const field = _get(field_names, this.fields);
      _addCallbackToField(
        this,
        field,
        event,
        callbacks,
        true,
        this.required_fields,
        this.field_names
      );
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
  storify = (): Writable<Form<ModelType>> => {
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
          f.node &&
            f.node.removeEventListener(key, (ev) => {
              (e: Event) =>
                _handleValidationEvent(
                  this,
                  this.required_fields,
                  this.field_names,
                  f
                );
            });
        });
        Object.keys(this.clear_errors_on_events).forEach((key) => {
          f.node &&
            f.node.removeEventListener(key, (e) => {
              f.errors.set(null);
            });
        });
      });
    }
  };

  //#endregion

  //#region - Form State

  // Resets to the inital state of the form.
  reset = (): void => {
    _resetState(this, this.initial_state);
  };

  // Well, this updates the initial state of the form.
  updateInitialState = (): void => {
    _setInitialState(
      this,
      this.initial_state
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
    if (order && order.length > 0) {
      this.field_order = order;
      this.fields = _createOrder(this.field_order, this.fields);
    }
  };

  /**
   * Hide a field or fields
   * @param names? string | string[]
   */
  hideFields = (names?: string | string[]) => {
    if (names && this.hidden_fields) {
      if (Array.isArray(names)) {
        this.hidden_fields.push(...names);
      } else {
        this.hidden_fields.push(names);
      }
    }
    if (this.hidden_fields)
      _negateField(this.hidden_fields, this.field_names, this.fields, {
        type: "hide",
        value: true,
      });
  };

  /**
   * Show a field or fields
   * @param names? string | string[]
   */
  showFields = (names?: string | string[]) => {
    if (names && this.hidden_fields) {
      if (Array.isArray(names)) {
        names.forEach((name) => {
          if (this.hidden_fields)
            this.hidden_fields.splice(this.hidden_fields.indexOf(name), 1);
        });
      } else {
        this.hidden_fields.splice(this.hidden_fields.indexOf(names), 1);
      }
    }
    if (this.hidden_fields)
      _negateField(this.hidden_fields, this.field_names, this.fields, {
        type: "hide",
        value: false,
      });
  };

  /**
   * Disable a field or fields
   * @param names? string | string[]
   */
  disableFields = (names?: string | string[]) => {
    if (names && this.disabled_fields) {
      if (Array.isArray(names)) {
        this.disabled_fields.push(...names);
      } else {
        this.disabled_fields.push(names);
      }
    }
    if (this.disabled_fields)
      _negateField(this.disabled_fields, this.field_names, this.fields, {
        type: "disable",
        value: true,
      });
  };

  /**
   * Enable a field or fields
   * @param names? string | string[]
   */
  enableFields = (names?: string | string[]) => {
    if (names && this.disabled_fields) {
      if (Array.isArray(names)) {
        names.forEach((name) => {
          if (this.disabled_fields)
            this.disabled_fields.splice(this.disabled_fields.indexOf(name), 1);
        });
      } else {
        this.disabled_fields.splice(this.disabled_fields.indexOf(names), 1);
      }
    }
    if (this.disabled_fields)
      _negateField(this.disabled_fields, this.field_names, this.fields, {
        type: "disable",
        value: false,
      });
  };

  //#endregion

  //#endregion ^^ Form API ^^
}
