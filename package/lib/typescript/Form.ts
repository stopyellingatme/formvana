import { ValidatorOptions } from "class-validator/types";
import { ValidationError, validate, validateOrReject } from "class-validator";
import { get, writable, Writable } from "svelte/store";
import { FieldConfig } from ".";

/**
 * Determines which events to validate/clear validation, on.
 * And, you can bring your own event listeners just by adding one on
 * the init.
 * Good ole Object.assign. It's brazen, but you're a smart kid.
 * Use it wisely.
 */
export class OnEvents {
  constructor(eventsOn: boolean = true, init?: Partial<OnEvents>) {
    Object.assign(this, init);
    // If eventsOn is false, turn off all event listeners
    if (!eventsOn) {
      Object.keys(this).forEach((key) => {
        this[key] = false;
      });
    }
  }

  input: boolean = true;
  change: boolean = true;
  blur: boolean = true;
  focus: boolean = true;
  mount: boolean = false;
  submit: boolean = true;
}

/**
 * Should we link the values always?
 * Or only if the form is valid?
 */
export enum LinkOnEvent {
  Always,
  Valid,
}

/**
 * Data format for the reference data items
 * Form.refs are of type Record<string, RefDataItem[]>
 */
export interface RefDataItem {
  label: string;
  value: any;
}

/**
 * Formvana - Form Class
 * Form is NOT valid, initially. If you want to make it valid, this.valid.set(true)
 *
 * The main thing to understand here is that the fields and the model are separate.
 * Fields are built using the model, via the @field() & @editable() decorators.
 * We keep the fields and the model in sync based on the provided form config,
 * but we do our best to initialize it with good, sane defaults.
 *
 *
 * Recommended Use:
 *  - Initialize let form = new Form({model: MODEL, refs: REFS, template: TEMPLATE, etc.})
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
 * Can render up to 2000 inputs in one class, but don't do that.
 * Just break it up into 100 or so fields per form (max-ish) if its a huge form.
 *  - Tested on late 2014 mbp - 2.5ghz core i7, 16gb ram
 *
 */
export class Form {
  /**
   * TODO: Add disableIf && hideIf methods!
   */
  constructor(init?: Partial<Form>) {
    Object.keys(this).forEach((key) => {
      if (init[key]) {
        this[key] = init[key];
      }
    });
    // If there's a model, set the inital state's and build the fields
    if (this.model) {
      this.buildFields();
    }
    // If they passed in a field order, set the order.
    if (this.field_order && this.field_order.length > 0) {
      this.setOrder(this.field_order);
    }
    // Well well, reference data. Better attach that to the fields.
    if (this.refs) {
      this.attachRefData();
    }

    // Wait until everything is initalized then set the inital state.
    this.setInitialState();
  }

  /**
   * This is your form Model/Schema.
   *
   * (If you didn't set the model in the constructor)
   * When model is set, call buildFields() to build the fields.
   */
  model: any = null;

  /**
   * Fields are built from the model's metadata using reflection.
   * If model is set, call buildFields().
   */
  fields: FieldConfig[] = [];

  /**
   * refs hold any reference data you'll be using in the form
   * e.g. seclet dropdowns, radio buttons, etc.
   *
   * (If you did not set the model in constructor)
   * Call attachRefData() to link the data to the respective field
   *
   * * Fields & reference data are linked via field.ref_key
   */
  refs: Record<string, RefDataItem[]> = null;

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

  /**
   * Validation options come from class-validator ValidatorOptions.
   *
   * Biggest perf increase comes from setting validationError.target = false
   * (so the whole model is not attached to each error message)
   */
  validation_options: ValidatorOptions = {
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

  hidden_fields: string[] = [];
  disabled_fields: string[] = [];

  // Which events should the form be validated on?
  validate_on_events: OnEvents = new OnEvents();
  // Which events should we clear the field errors on?
  clear_errors_on_events: OnEvents = new OnEvents(false);

  // When to link this.field values to this.model values
  link_fields_to_model: LinkOnEvent = LinkOnEvent.Always;

  private field_names: string[] = [];
  /**
   * This is the model's initial state.
   * Shove the stateful_items into the inital state for a decent snapshot.
   */
  private initial_state: any = {};
  private initial_state_str: string = null;
  private stateful_items = [
    "valid",
    "touched",
    "changed",
    "errors",
    "required_fields",
    "refs",
    "field_order",
    "model",
  ];

  /**
   * We keep track of required fields because we let class-validator handle everything
   * except *required* (field.required)
   * So if there are no required fields, but there are errors, the form is still
   * valid. This is the mechanism to help keep track of that.
   * Keep track of the fields so we can validate faster.
   */
  private required_fields: string[] = [];

  /**
   * * Here be Functions. Beware.
   * * Here be Functions. Beware.
   * * Here be Functions. Beware.
   */

  //#region FUNCTIONS

  /**
   * This is the first method that was written for formvana :)
   *
   * Build the field configs from this.model using metadata-reflection.
   * More comments inside...
   */
  buildFields = (): void => {
    if (this.model) {
      // Grab the editableProperties from the @editable decorator
      let props = Reflect.getMetadata("editableProperties", this.model);
      // Map the @editable fields to the form.fields array.
      this.fields = props.map((prop) => {
        // Get the FieldConfig using metadata reflection
        const config: FieldConfig = Reflect.getMetadata(
          "fieldConfig",
          this.model,
          prop
        );
        //! SET THE NAME OF THE FIELD!
        config.name = prop;

        // If the model has a value, attach it to the field config
        // 0, "", [], etc. are set in the constructor based on type.
        if (this.model[prop]) {
          config.value.set(this.model[prop]);
        }

        // Gotta keep track of the required feilds, for our own validation.
        if (config.required) {
          this.required_fields.push(config.name);
        }

        // We made it. Return the field config and let's generate some inputs!
        return config;
      });
      this.field_names = this.fields.map((f) => f.name);
    }
  };

  /**
   * MUST BE ATTACHED TO SAME ELEMENT WITH FIELD.NAME!
   * MUST BE ATTACHED TO SAME ELEMENT WITH FIELD.NAME!
   * MUST BE ATTACHED TO SAME ELEMENT WITH FIELD.NAME!
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
   */
  useField = (node: HTMLElement): void => {
    // Attach HTML Node to field so we can remove event listeners later
    this.fields.forEach((field) => {
      //@ts-ignore
      if (field.name === node.name) {
        field.node = node;
      }
    });

    this.attachOnValidateEvents(node);
    this.attachOnClearErrorEvents(node);
  };

  /**
   * Well, validate the form!
   * Clear the errors first, then do it, obviously.
   */
  validate = (): Promise<ValidationError[]> => {
    this.clearErrors();
    // Link the input from the field to the model.
    this.link_fields_to_model === LinkOnEvent.Always && this.linkValues(true);
    this.hideFields(), this.disableFields();
    // Return class-validator validate() function.
    // Validate the model with given validation config.
    return validate(this.model, this.validation_options).then(
      (errors: ValidationError[]) => {
        this.handleValidation(false, errors);
        return errors;
      }
    );
  };

  validateAsync = async (): Promise<any> => {
    this.clearErrors();
    this.link_fields_to_model === LinkOnEvent.Always && this.linkValues(true);
    this.hideFields(), this.disableFields();
    try {
      return await validateOrReject(this.model, this.validation_options);
    } catch (errors) {
      this.handleValidation(false, errors);
      console.log("Errors: ", errors);
      return errors;
    }
  };

  /**
   * Load new data into the form and build the fields.
   * Useful if you fetched data and need to update the form values.
   *
   * Fresh defaults to True. So the default is to pass in a new instance
   * of the model (e.g. new ExampleMode(incoming_data)).
   * If fresh is False then the incoming_data will be serialized into
   * the model.
   *
   * State is updated upon data load, by default.
   *
   * Check example.form.ts for an example use case.
   */
  loadData = (
    data: any,
    freshModel: boolean = true,
    updateState: boolean = true
  ): Form => {
    if (freshModel) {
      this.model = data;
      this.buildFields();
    } else {
      Object.keys(this.model).forEach((key) => {
        this.model[key] = data[key];
      });
      this.linkValues(false);
    }

    updateState && this.updateInitialState();

    return this;
  };

  /**
   * Just pass in the reference data and let the field configs do the rest.
   *
   * * Ref data MUST BE in format: Record<string, RefDataItem[]>
   * * Ref data MUST BE in format: Record<string, RefDataItem[]>
   * * Ref data MUST BE in format: Record<string, RefDataItem[]>
   */
  attachRefData = (refs?: Record<string, RefDataItem[]>): void => {
    const fields_with_ref_keys = this.fields.filter((f) => f.ref_key);
    if (refs) {
      fields_with_ref_keys.forEach((field) => {
        field.options = refs[field.ref_key];
      });
    } else if (this.refs) {
      fields_with_ref_keys.forEach((field) => {
        field.options = this.refs[field.ref_key];
      });
    }
  };

  /**
   * Generate a Svelte Store from the current "this".
   */
  storify = (): Writable<Form> => {
    const f = writable(this);
    return f;
  };

  /**
   * Set the field order.
   * Layout param is simply an array of field (or group)
   * names in the order to be displayed.
   * Leftover fields are appended to bottom of form.
   */
  setOrder = (order: string[]): void => {
    this.field_order = order;
    this.createOrder();
  };

  /**
   * * Use this if you're trying to update the layout after initialization.
   * Similar to this.setOrder()
   *
   * Like this:
   * const layout = ["description", "status", "email", "name"];
   * const newState = sget(formState).buildStoredLayout(formState, layout);
   * formState.updateState({ ...newState });
   */
  buildStoredLayout = (
    formState: Writable<any>,
    order: string[]
  ): Writable<any> => {
    let fields = [];
    let leftovers = [];
    // Update the order
    formState.update((state) => (state.field_order = order));
    // Get the Form state
    const state = get(formState);
    state.field_order.forEach((item) => {
      state.fields.forEach((field) => {
        if (
          field.name === item ||
          (field.group && field.group.name === item) ||
          (field.step && `${field.step.index}` === item)
        ) {
          fields.push(field);
        } else if (
          leftovers.indexOf(field) === -1 &&
          state.field_order.indexOf(field.name) === -1
        ) {
          leftovers.push(field);
        }
      });
    });
    state.fields = [...fields, ...leftovers];
    return state;
  };

  // Well, this updates the initial state of the form.
  updateInitialState = (): void => {
    this.setInitialState();
    this.changed.set(false);
  };

  // Clear ALL the errors.
  clearErrors = (): void => {
    this.errors = [];
    this.fields.forEach((field) => {
      field.errors.set(null);
    });
  };

  // Resets to the inital state of the form.
  reset = (): void => {
    this.resetState();
  };

  hideField = (name: string) => {
    this.hidden_fields.push(name);
    this.hideFields();
  };

  disableField = (name: string) => {
    this.disabled_fields.push(name);
    this.disableFields();
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
        Object.keys(this.validate_on_events).forEach((key) => {
          f.node.removeEventListener(key, (ev) => {
            this.validateField(f);
          });
        });
        Object.keys(this.clear_errors_on_events).forEach((key) => {
          f.node.removeEventListener(key, (ev) => {
            this.clearFieldErrors(f.name);
          });
        });
      });
    }
    // Reset everything else.
    this.clearState();
  };

  // #region PRIVATE FUNCTIONS

  /**
   * Validate the field!
   * This is  attached to the field:
   * useField -> attachOnValidateEvents(node) ->  validateField
   */
  private validateField = (field: FieldConfig): Promise<void> => {
    // Link the input from the field to the model.
    this.link_fields_to_model === LinkOnEvent.Always && this.linkValues(true);
    this.hideFields(), this.disableFields();
    // this.link_fields_to_model === LinkOnEvent.Always &&
    // this.linkFieldValue(field);

    // Return class-validator validate() function.
    // Validate the model with given validation config.
    return validate(this.model, this.validation_options).then(
      (errors: ValidationError[]) => {
        this.handleValidation(true, errors, field);
      }
    );
  };

  private hideFields = () => {
    let i = 0,
      len = this.hidden_fields.length;
    if (len === 0) return;
    for (; len > i; ++i) {
      const field = this.hidden_fields[i],
        field_index = this.field_names.indexOf(field);
      if (field_index !== -1) {
        this._hideField(this.field_names[i]);
      }
    }
  };

  private _hideField = (name: string) => {
    this.fields.forEach((f) => {
      if ((f.name = name)) {
        f.hidden = true;
      }
    });
  };

  private disableFields = () => {
    let i = 0,
      len = this.disabled_fields.length;
    if (len === 0) return;
    for (; len > i; ++i) {
      const field = this.disabled_fields[i],
        field_index = this.field_names.indexOf(field);
      if (field_index !== -1) {
        this._disableField(this.field_names[i]);
      }
    }
  };

  private _disableField = (name: string) => {
    this.fields.forEach((f) => {
      if ((f.name = name)) {
        f.disabled = true;
        f.attributes["disabled"] = true;
      }
    });
  };

  // Clears everything before being destoryed.
  private clearState = (): void => {
    this.model = null;
    this.initial_state = {};
    this.required_fields = [];
    this.refs = null;
    this.template = null;
  };

  /**
   * Grab a snapshot of several items that generally define the state of the form
   * and serialize them into a format that's easy-ish to check/deserialize (for resetting)
   */
  private setInitialState = (): void => {
    /**
     * This is the best method for reliable deep-ish cloning that i've found.
     * If you know a BETTER way, be my guest. No extra dependencies please.
     */
    this.stateful_items.forEach((key) => {
      if (key === "valid" || key === "touched" || key === "changed") {
        get(this[key])
          ? (this.initial_state[key] = writable(true))
          : (this.initial_state[key] = writable(false));
      } else {
        this.initial_state[key] = JSON.parse(JSON.stringify(this[key]));
      }
      this.initial_state_str = JSON.stringify(this.initial_state);
    });
  };

  /**
   * This one's kinda harry.
   * But it resets the form to it's initial state.
   */
  private resetState = (): void => {
    this.stateful_items.forEach((key) => {
      if (key === "valid" || key === "touched" || key === "changed") {
        // Check the inital_state's key with the svelte store get() method
        get(this.initial_state[key])
          ? this[key].set(true)
          : this[key].set(false);
      } else if (key === "errors") {
        // Clear the errors so we don't have leftovers all over the place
        this.clearErrors();
        // Attach errors located in initial_state (to this.errors)
        this[key] = this.initial_state[key].map((e) => {
          // Create new ValidationError to match the class-validator error type
          let err = new ValidationError();
          Object.assign(err, e);
          return err;
        });
        // If this.errors is not empty then attach the errors to the fields
        if (this[key] && this[key].length > 0) {
          this.linkErrors(this.errors);
        }
      } else if (key === "model") {
        /**
         * We have to disconnect the initial_state's model so that we don't get
         * burned by reference links.
         * We also don't want to overwrite the actual model, because it contains
         * all the metadata for validation, feilds, etc.
         * So we just copy the inital_state[model] and shove it's values back into
         * this.model.
         * That way when we reset the form, we still get validation errors from the
         * model's decorators.
         */
        const m_state = JSON.parse(JSON.stringify(this.initial_state[key]));
        Object.keys(this[key]).forEach((mkey) => {
          this[key][mkey] = m_state[mkey];
        });
        this.linkValues(false);
      } else {
        this[key] = JSON.parse(JSON.stringify(this.initial_state[key]));
      }
    });
  };

  /**
   * TODO: Clean up this arfv implementation. Seems too clunky.
   *
   * Check if there are any required fields in the errors.
   * If there are no required fields in the errors, the form is valid
   */
  private requiredFieldsValid = (errors: ValidationError[]): boolean => {
    if (errors.length === 0) return true;
    // Go ahead and return if there are no errors
    let i = 0,
      len = this.required_fields.length;
    // If there are no required fields, just go ahead and return
    if (len === 0) return true;
    // Otherwise we have to map the names of the errors so we can
    // check if they're for a required field
    const errs = errors.map((e) => e.property);
    for (; len > i; ++i) {
      if (errs.includes(this.required_fields[i])) {
        return false;
      }
    }
    return true;
  };

  private handleValidation = (
    isField: boolean = true,
    errors: ValidationError[],
    field?: FieldConfig
  ): void => {
    // There are errors!
    if (errors.length > 0) {
      this.errors = errors;

      // Are we validating the whole form or just the fields?
      if (isField) {
        // Link errors to field (to show validation errors)
        this.linkFieldErrors(errors, field);
      } else {
        // This is validatino for the whole form!
        this.linkErrors(errors);
      }

      // TODO: Clean up this arfv implementation. Seems too clunky.
      // All required fields valid (arfv)
      const arfv = this.requiredFieldsValid(errors);

      if (arfv) {
        this.valid.set(true);
      } else {
        this.valid.set(false);
      }
    } else {
      // We can't get here unless the errors we see are for non-required fields

      // If the config tells us to link the values only when the form
      // is valid, then link them here.
      this.link_fields_to_model === LinkOnEvent.Valid && this.linkValues(true);
      this.valid.set(true); // Form is valid!
      this.clearErrors(); // Clear form errors
    }
    // Check for changes
    this.hasChanged();
  };

  // Link values from FIELDS toMODEL or MODEL to FIELDS
  private linkValues = (fromFieldsToModel: boolean): void => {
    // Still the fastest way i've seen to loop in JS.
    let i = 0,
      len = this.fields.length;
    for (; len > i; ++i) {
      // Get name and value of the field
      const name = this.fields[i].name,
        val = this.fields[i].value;
      if (fromFieldsToModel) {
        // Link field values to the model
        this.model[name] = get(val);
      } else {
        // Link model values to the fields
        val.set(this.model[name]);
      }
    }
  };

  // Here in case we need better performance.
  private linkFieldValue = (field: FieldConfig): void => {
    this.model[field.name] = get(field.value);
  };

  private getStateSnapshot = (): string => {
    let i = 0,
      len = this.stateful_items.length,
      result = {};
    for (; len > i; ++i) {
      const item = this.stateful_items[i];
      result[item] = this[item];
    }
    return JSON.stringify(result);
  };

  /**
   * TODO: Might better way to do comparison than JSON.stringify()
   * TODO: Be my guest to fix it if you know how.
   * But...
   * I've tested it with > 1000 fields in a single class with very slight input lag.
   */
  private hasChanged = (): void => {
    const state = this.getStateSnapshot();

    if (state === this.initial_state_str) {
      this.changed.set(false);
      return;
    }
    this.changed.set(true);
  };

  private linkFieldErrors = (
    errors: ValidationError[],
    field: FieldConfig
  ): void => {
    const error = errors.filter((e) => e.property === field.name);
    // Check if there's an error for the field
    if (error && error.length > 0) {
      field.errors.set(error[0]);
    } else {
      field.errors.set(null);
    }
  };

  private linkErrors = (errors: ValidationError[]): void => {
    errors.forEach((err) => {
      this.fields.forEach((field) => {
        if (err.property === field.name) {
          field.errors.set(err);
        }
      });
    });
  };

  private clearFieldErrors = (name): void => {
    this.fields.forEach((field) => {
      if (field.name === name) {
        field.errors.set(null);
      }
    });
  };

  private createOrder = (): void => {
    let fields = [];
    let leftovers = [];
    // Loop over the order...
    this.field_order.forEach((item) => {
      // and the fields...
      this.fields.forEach((field) => {
        // If the field.name and the order name match...
        if (
          field.name === item ||
          (field.group && field.group.name === item) ||
          (field.step && `${field.step.index}` === item)
        ) {
          // Then push it to the fields array
          fields.push(field);
        } else if (
          leftovers.indexOf(field) === -1 &&
          this.field_order.indexOf(field.name) === -1
        ) {
          // Field is not in the order, so push it to bottom of order.
          leftovers.push(field);
        }
      });
    });
    this.fields = [...fields, ...leftovers];
  };

  private attachOnValidateEvents = (node: HTMLElement): void => {
    // Get the field, for passing to the validateField func
    //@ts-ignore
    const field = this.fields.filter((f) => f.name === node.name)[0];
    Object.entries(this.validate_on_events).forEach(
      ([eventName, shouldListen]) => {
        // If the OnEvent is true, then add the event listener
        // If the field has options, we can assume it will use the change event listener
        if (field.options) {
          // so don't add the input event listener
          if (shouldListen && eventName !== "input") {
            node.addEventListener(
              eventName,
              (ev) => {
                this.validateField(field);
              },
              false
            );
          }
        }
        // Else, we can assume it will use the input event listener
        // * This may be changed in the future
        else {
          // and don't add the change event listener
          if (shouldListen && eventName !== "change") {
            node.addEventListener(
              eventName,
              (ev) => {
                this.validateField(field);
              },
              false
            );
          }
        }
      }
    );
  };

  private attachOnClearErrorEvents = (node): void => {
    Object.entries(this.clear_errors_on_events).forEach(([key, val]) => {
      // If the OnEvent is true, then add the event listener
      if (val) {
        node.addEventListener(key, (ev) => {
          this.clearFieldErrors(node.name);
        });
      }
    });
  };
  //#endregion
  //#endregion
}
