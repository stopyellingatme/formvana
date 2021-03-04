import { ValidationError, ValidatorOptions } from "class-validator/types";
import { validate } from "class-validator";
import { get, writable, Writable } from "svelte/store";
import { FieldConfig } from "./";

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
 * Formvana Form Class
 * Form is NOT valid, initially.
 *
 * Recommended Use:
 *  - Initialize new Form({model: ..., refs: ..., template: ..., etc.})
 *  - Set the model (if you didn't in the previous step)
 *  - (optionally) attach reference data
 *  - call form.storify() -  const { subscribe, update } = form.storify();
 *  - Now you're ready to use the form!
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
   * refs holds any reference data you'll be using in the form
   * e.g. seclet dropdowns, radio buttons, etc.
   *
   * (If you did not set the model in constructor)
   * Call attachRefData() to link the data to the respective field
   *
   * * Fields and reference data are linked via field.ref_key *
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

  private required_fields: string[] = [];

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

        if (config.required) {
          this.required_fields.push(config.name);
        }

        console.log("FIELD CONFIG: ", config);
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
  validate = (): Promise<void> => {
    this.clearErrors();
    this.link_fields_to_model === LinkOnEvent.Always && this.linkValues(true);
    return validate(this.model, this.validation_options).then(
      (errors: ValidationError[]) => {
        this.handleValidation(false, errors);
      }
    );
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
    if (this.model) {
      this.initial_state = JSON.parse(JSON.stringify(this.model));
    }
  };

  clearErrors = (): void => {
    this.errors = [];
    this.fields.forEach((field) => {
      field.errors.set(null);
    });
  };

  // Resets to the inital state of the form.
  reset = (): void => {
    this.clearErrors();
    this.valid.set(false);
    this.changed.set(false);
    this.touched.set(false);
    this.loading.set(false);

    Object.keys(this.model).forEach((key) => {
      this.model[key] = this.initial_state[key];
    });
    this.linkValues(false);
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

  // TODO: Speed this bad boy up. There are optimizations to be had.
  private requiredFieldsValid = (errors: ValidationError[]): boolean => {
    const errs = errors.map(e => e.property);
    let i = 0, len = this.required_fields.length;
    for(; len > i; ++i) {
      if (errs.includes(this.required_fields[i])) {
        return false;
      }
    }
    return true;
  }

  private handleValidation = (
    isField: boolean = true,
    errors: ValidationError[],
    field?: FieldConfig
  ) => {
    const arfv = this.requiredFieldsValid(errors);
    
    // There are errors!
    if (errors.length > 0 && !arfv) {
      this.valid.set(false); // Form is not valid
      this.errors = errors;
      // console.log("ERRORS: ", errors);
      if (isField) {
        // Link errors to field (to show validation errors)
        this.linkFieldErrors(errors, field);
      } else {
        this.valid.set(false); // Form is not valid
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
      toModel
        ? (this.model[this.fields[i].name] = get(this.fields[i].value))
        : this.fields[i].value.set(this.model[this.fields[i].name]);
    }
  };

  /**
   * TODO: There may be a better way to do comparison than Object.is().
   * TODO: Be my guest to fix it if you know how.
   */
  private hasChanged = (): void => {
    if (Object.is(this.model, this.initial_state) && this.errors.length === 0) {
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
      if (val) {
        node.addEventListener(
          key,
          (ev) => {
            this.validateField(field);
          },
          false
        );
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
