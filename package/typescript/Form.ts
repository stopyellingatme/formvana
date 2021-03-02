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
    // If eventsOn if false, turn off all event listeners
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

/**
 * Formvana Form Class
 * Form is NOT valid, initially.
 *
 * Recommended Use:
 *  - Initialize new Form(Partial<Form>{})
 *  - Set the model (if you didn't in the previous step)
 *  - (optionally) attach reference data
 *  - spread operator Form into writable store (e.g. writable({...form}); )
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
      this.initial_state = JSON.parse(JSON.stringify(this.model));
      this.buildFields();
    }
    if (this.layout && this.layout.length > 0) {
      this.setLayout(this.layout);
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
   * Validation options come from class-validator. 
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
   * Underlying TS Model.
   * When model is set, call buildFields() to build the fields.
   */
  model: any = null;

  /**
   * Fields are built from the model's metadata using reflection.
   * If model is set, call buildFields().
   */
  fields: FieldConfig[] = [];

  /**
   * this.valid is a "store" so we can change the state of the variable
   * inside of the class and it (the change) be reflected outside
   * in the form context.
   */
  valid: Writable<boolean> = writable(false);
  errors: ValidationError[] = [];

  loading: boolean = false;
  changed: Writable<boolean> = writable(false);
  touched: boolean = false;

  validate_on_events: OnEvents = new OnEvents();
  clear_errors_on_events: OnEvents = new OnEvents(false);

  // When should we link the field values to the model values?
  link_fields_to_model: LinkOnEvent = LinkOnEvent.Always;

  // Order within array determines order to be applied
  classes: string[] = [];

  /**
   * Determines the ordering of this.fields.
   * Simply an array of field names (or group names or stepper names) 
   * in the order to be displayed
   */
  layout: string[] = [];

  // Reference Data
  refs: any = null;

  /**
   * * Here be Functions. Beware.
   * * Here be Functions. Beware.
   * * Here be Functions. Beware.
   */

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
  setLayout = (layout: string[]): void => {
    this.layout = layout;
    this.buildLayout();
  };

  buildLayout = (): void => {
    let fields = [];
    let leftovers = [];
    // Loop over the layout...
    this.layout.forEach((item) => {
      // and the fields...
      this.fields.forEach((field) => {
        // If the field.name and the layout name match...
        if (
          field.name === item ||
          (field.group && field.group.name === item) ||
          (field.step && `${field.step.index}` === item)
        ) {
          // Then push it to the fields array
          fields.push(field);
        } else if (
          leftovers.indexOf(field) === -1 &&
          this.layout.indexOf(field.name) === -1
        ) {
          // Field is not in the layout, so push it to bottom of layout.
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
    layout: string[]
  ): Writable<any> => {
    let fields = [];
    let leftovers = [];
    // Update the layout
    formState.update((state) => state.layout = layout);
    // Get the Form state
    const state = get(formState);
    state.layout.forEach((item) => {
      state.fields.forEach((field) => {
        if (
          field.name === item ||
          (field.group && field.group.name === item) ||
          (field.step && `${field.step.index}` === item)
        ) {
          fields.push(field);
        } else if (
          leftovers.indexOf(field) === -1 &&
          state.layout.indexOf(field.name) === -1
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
   * The "use" directive passes the HTML Node as
   * a parameter to the given function (e.g. use:useField(node: HTMLNode)).
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

  /**
   * Just pass in the reference data and let the field
   * configs do the rest.
   *
   ** Ref data must be in format:
   * {
   *  [field.name]: [
   *    { label: "Option 1", value: 0 },
   *    { label: "Option 2", value: 1 },
   *   ],
   *  [field.other_name]: [
   *    { label: "Other Option 1", value: 0 },
   *    { label: "Other Option 2", value: 1 },
   *   ],
   * }
   */
  attachRefData = (refs?: object): void => {
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
    // else {
    //   const fields_with_ref_keys = this.fields.filter((f) => f.ref_key);
    //   fields_with_ref_keys.forEach((field) => {
    //     field.options = refs[field.ref_key];
    //   });
    // }
  };

  /**
   * Generate a Svelte Store from the current "this"
   */
  storify(): Writable<Form> {
    return writable(this);
  }

  clearErrors = (): void => {
    this.errors = [];
    this.fields.forEach((field) => {
      field.errors.set(null);
    });
  };

  clearValues = (): void => {
    if (this.fields && this.fields.length > 0) {
      this.fields.forEach((field) => {
        field.value.set(null);
      });
    }
  };

  // Resets to the inital state of the form.
  reset = (): void => {
    this.clearErrors();
    this.valid.set(false);
    this.changed.set(false);

    // const initial = JSON.parse(this.initial_state);
    Object.keys(this.model).forEach((key) => {
      this.model[key] = this.initial_state[key];
    });
    this.linkValues(false);
  };

  /**
   *! Make sure to call this when the component is unloaded/destroyed
   */
  destroy = (): void => {
    // Remove the event listeners
    if (this.fields && this.fields.length > 0) {
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

  updateInitialState() {
    if (this.model) {
      this.initial_state = JSON.parse(JSON.stringify(this.model));
    }
  }
  // #region PRIVATE FUNCTIONS

  private handleValidation(
    isField: boolean = true,
    errors: ValidationError[],
    field?: FieldConfig
  ) {
    // There are errors!
    if (errors.length > 0) {
      this.valid.set(false); // Form is not valid
      this.errors = errors;
      // console.log("ERRORS: ", errors);
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
  }

  // Link values FROM FIELDS toMODEL or MODEL to FIELDS
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
   * TODO: This needs a rework. Stringifying is not the most performant.
   */
  private hasChanged = (): void => {
    // if (
    //   JSON.stringify(this.model) === this.initial_state &&
    //   this.errors.length === 0
    // ) {
    //   this.changed.set(false);
    //   return;
    // }
    if (
      Object.is(this.model, this.initial_state) && 
      this.errors.length === 0
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
        node.addEventListener(key, (ev) => {
          this.validateField(field);
        }, false);
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
}
