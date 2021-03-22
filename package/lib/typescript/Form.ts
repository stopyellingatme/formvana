import { ValidatorOptions } from "class-validator/types";
import { ValidationError, validate, validateOrReject } from "class-validator";
import { get, writable, Writable } from "svelte/store";
import { FieldConfig } from ".";

/**
 * Determines which events to validate/clear validation, on.
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

export enum LinkOnEvent {
  Always,
  Valid,
}

export interface RefDataItem {
  label: string;
  value: any;
}

/**
 * Formvana - Form Class
 * Form is NOT valid, initially.
 *
 * Recommended Use:
 *  - Initialize new Form({model: ..., refs: ..., template: ..., etc.})
 *  - Set the model (if you didn't in the previous step)
 *  - (optionally) attach reference data
 *  - call form.storify() -  const { subscribe, update } = form.storify();
 *  - Now you're ready to use the form!
 *
 * Performance is blazing with < 500 fields. 
 * Can render up to 2000 inputs in one class.
 *  - Tested on late 2014 mbp - 2.5ghz core i7, 16gb ram
 *
 */
export class Form {
  constructor(init?: Partial<Form>) {
    Object.keys(this).forEach((key) => {
      if (init[key]) {
        this[key] = init[key];
      }
    });
    if (this.model) {
      /**
       * This is the best method for reliable deep-ish cloning that i've found.
       * If you know a BETTER way, be my guest.
       */
      this.initial_state = JSON.parse(JSON.stringify(this.model));
      this.initial_errors = JSON.stringify(this.errors);
      // this.initial_errors = Array.from(this.errors);
      this.buildFields();
    }
    if (this.field_order && this.field_order.length > 0) {
      this.setOrder(this.field_order);
    }
    if (this.refs) {
      this.attachRefData();
    }
  }

  /**
   * This is the model's initial state.
   */
  private initial_state: any = null;
  private initial_errors: any = null;

  private non_required_fields: string[] = [];

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
   * This is your form Model/Schema.
   *
   * (If you did not set the model in constructor)
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

  // Order within array determines order to be applied
  classes: string[] = [];

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
   * this.valid is a "store" so we can change the state of the variable
   * inside of the class and it (the change) be reflected outside
   * in the form context.
   */
  valid: Writable<boolean> = writable(false);
  errors: ValidationError[] = [];

  loading: Writable<boolean> = writable(false);
  changed: Writable<boolean> = writable(false);
  touched: Writable<boolean> = writable(false);

  validate_on_events: OnEvents = new OnEvents();
  clear_errors_on_events: OnEvents = new OnEvents(false);

  // When to link field.values to model.values
  link_fields_to_model: LinkOnEvent = LinkOnEvent.Always;

  /**
   * * Here be Functions. Beware.
   * * Here be Functions. Beware.
   * * Here be Functions. Beware.
   */

  //#region FUNCTIONS

  /**
   * Build the field configs from the given model using metadata-reflection.
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

        if (!config.required) {
          this.non_required_fields.push(config.name);
        }

        // console.log("FIELD CONFIG: ", config);
        // Return the enriched field config
        return config;
      });
    }
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

  createOrder = (): void => {
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

  /**
   * * Use this if you're trying to update the layout after initialization
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

  /**
   * This is for Svelte's "use:FUNCTION" feature.
   * The "use" directive passes the HTML Node as a parameter
   * to the given function (e.g. use:useField(node: HTMLNode)).
   *
   * This hooks up the event listeners!
   */
  useField = (node: HTMLElement): void => {
    // Attach HTML Node to field so we can remove event listeners later
    this.fields.forEach((field) => {
      //@ts-ignore
      if (field.name === node.name) {
        field.node = node;
      }
    });

    this.handleOnValidateEvents(node);
    this.handleOnClearErrorEvents(node);
  };

  /**
   * Validate the field!
   * This should be attached to the field via the useField method.
   */
  validateField = (field: FieldConfig): Promise<void> => {
    // Link the input from the field to the model.
    // this.link_fields_to_model === LinkOnEvent.Always &&
    //   this.linkFieldValue(field);
    this.link_fields_to_model === LinkOnEvent.Always && this.linkValues(true);

    // Return class-validator validate function.
    // Validate the model with given validation config.
    return validate(this.model, this.validation_options).then(
      (errors: ValidationError[]) => {
        this.handleValidation(true, errors, field);
      }
    );
  };

  // Validate the form!
  validate = (): Promise<ValidationError[]> => {
    this.clearErrors();
    // Link the input from the field to the model.
    this.link_fields_to_model === LinkOnEvent.Always && this.linkValues(true);
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
    try {
      return await validateOrReject(this.model, this.validation_options);
    } catch (errors) {
      this.handleValidation(false, errors);
      console.log("Errors: ", errors);
      return errors;
    }
  };

  loadData = (data: any): Form => {
    this.model = data;
    this.updateInitialState();
    this.buildFields();
    return this;
  };

  /**
   * Just pass in the reference data and let the field configs do the rest.
   *
   * * Ref data must be in format: Record<string, RefDataItem[]>
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
   * Generate a Svelte Store from the current "this"
   */
  storify = (): Writable<Form> => {
    return writable(this);
  };

  updateInitialState = (): void => {
    this.initial_state = JSON.parse(JSON.stringify(this.model));
    this.initial_errors = JSON.stringify(this.errors);
    // this.initial_errors = Array.from(this.errors);
    this.changed.set(false);
  };

  clearErrors = (): void => {
    this.errors = [];
    this.fields.forEach((field) => {
      field.errors.set(null);
    });
  };

  // Resets to the inital state of the form.
  reset = (): void => {
    this.valid.set(false);
    this.changed.set(false);
    this.touched.set(false);
    this.loading.set(false);

    Object.keys(this.model).forEach((key) => {
      this.model[key] = this.initial_state[key];
    });
    this.linkValues(false);

    // If the initial state has errors, add them to
    this.clearErrors();
    const errs = JSON.parse(this.initial_errors);
    if (errs && errs.length > 0) {
      errs.forEach((e) => {
        const val_err = new ValidationError();
        Object.assign(val_err, e);
        this.errors.push(val_err);
      });
      this.linkErrors(this.errors);
    }

    // if (this.initial_errors && this.initial_errors.length > 0) {
    //   this.errors = Array.from(this.initial_errors);
    // }else {
    //   this.clearErrors();
    // }
  };

  /**
   *! Make sure to call this when the component is unloaded/destroyed
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
    this.reset();
  };

  // #region PRIVATE FUNCTIONS

  /**
   * TODO: Speed this bad boy up. There are optimizations to be had.
   * ... but it's already pretty speedy.
   * Check if there are any required fields in the errors.
   * If there are no required fields in the errors, the form is valid
   */
  private nonRequiredFieldsValid = (errors: ValidationError[]): boolean => {
    if (errors.length === 0) return true;
    // Go ahead and return if there are no errors
    let i = 0,
      len = this.non_required_fields.length;
    // If there are no required fields, just go ahead and return
    if (len === 0) return true;
    const errs = errors.map((e) => e.property);
    for (; len > i; ++i) {
      if (errs.includes(this.non_required_fields[i])) {
        return false;
      }
    }
    return true;
  };

  private handleValidation = (
    isField: boolean = true,
    errors: ValidationError[],
    field?: FieldConfig
  ) => {
    // Non required fields valid (nrfv)
    const nrfv = this.nonRequiredFieldsValid(errors);

    // There are errors!
    if (errors.length > 0 || !nrfv) {
      this.valid.set(false);
      this.errors = errors;
      // console.log("ERRORS: ", errors);

      // Are we validating the whole form or just the fields?
      if (isField) {
        // Link errors to field (to show validation errors)
        this.linkFieldErrors(errors, field);
      } else {
        // This is validatino for the whole form!
        this.linkErrors(errors);
      }
    } else {
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
  private linkValues = (toModel: boolean): void => {
    let i = 0,
      len = this.fields.length;
    for (; len > i; ++i) {
      const name = this.fields[i].name,
        val = this.fields[i].value;
      if (toModel) {
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

  /**
   * TODO: Might better way to do comparison than Object.is() and JSON.stringify()
   * TODO: Be my guest to fix it if you know how.
   * But... I've tested it with 1000 fields with minimal input lag.
   */
  private hasChanged = (): void => {
    if (
      Object.is(this.model, this.initial_state) &&
      JSON.stringify(this.errors) === this.initial_errors
    ) {
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

  private handleOnValidateEvents = (node: HTMLElement): void => {
    // Get the field, for passing to the validateField func
    //@ts-ignore
    const field = this.fields.filter((f) => f.name === node.name)[0];
    Object.entries(this.validate_on_events).forEach(([key, val]) => {
      // If the OnEvent is true, then add the event listener
      // If the field has options, we can assume it will use the change event listener
      if (field.options) {
        // so don't add the input event listener
        if (val && val !== "input") {
          node.addEventListener(
            key,
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
        if (val && val !== "change") {
          node.addEventListener(
            key,
            (ev) => {
              this.validateField(field);
            },
            false
          );
        }
      }
    });
  };

  private handleOnClearErrorEvents = (node): void => {
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
