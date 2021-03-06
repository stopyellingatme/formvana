import { ValidationError, validate } from "class-validator";
import { get, Readable, writable, Writable } from "svelte/store";
import { FieldConfig, FieldGroup } from "./FieldConfig";

export interface OnEvents {
  input: boolean;
  change: boolean;
  blur: boolean;
  focus: boolean;
  mount: boolean;
}

export enum LinkOnEvent {
  Always,
  Valid,
}

export class Form {
  constructor(init?: Partial<Form>) {
    // Object.assign(this, init);
    Object.keys(this).forEach((key) => {
      if (init[key]) {
        this[key] = init[key];
      }
    });
    if (this.model) {
      this.initial_state = JSON.stringify(this.model);
    }
  }

  /**
   * Stringified for quicker comparison
   * Could be a better way of doing this, but for now, this works.
   */
  initial_state: any = null;

  /**
   * Underlying TS Model.
   * Whene model is set, call buildFields() to build the fields.
   */
  model: any = null;

  /**
   * Fields are built from the model's metadata using reflection
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

  on_events = (init: boolean = true): OnEvents => ({
    change: init,
    input: init,
    blur: init,
    focus: init,
    mount: false,
  });
  validate_on_events: OnEvents = this.on_events();
  clear_errors_on_events: OnEvents = this.on_events(false);

  // When should we link the field values to the model values?
  link_fields_to_model_on: LinkOnEvent = 0;

  // Order within array determines order to be applied
  form_classes: string[] = [
    "shadow sm:rounded-md",
    "px-4 py-6 bg-white sm:p-6",
    "grid grid-cols-4 gap-6 mt-6",
  ];

  /**
   * Determines the ordering of the fields.
   * Simply an array of field (or group) names in the order to be displayed
   */
  layout: string[] = [];

  /**
   * * Here be Functions. Beware.
   * * Here be Functions. Beware.
   * * Here be Functions. Beware.
   */

  /**
   * Build the field configs from the given model using metadata-reflection.
   */
  buildFields = () => {
    if (this.model) {
      let props = Reflect.getMetadata("editableProperties", this.model) || [];
      this.fields = props.map((prop) => {
        const config: FieldConfig = Reflect.getMetadata(
          "fieldConfig",
          this.model,
          prop
        );
        config.name = prop;
        // If the model has a value, attach it to the field config
        if (this.model[prop]) {
          config.value.set(this.model[prop]);
        }

        console.log("FIELD CONFIG: ", config);
        return config;
      });

      setTimeout(() => {
        // Decreases initial input lag due to building field errors.
        this.preValidate();
      }, 10);
    }
  };

  /**
   * Set the field order.
   * Layout param is simply an array of field (or group)
   * names in the order to be displayed.
   * Leftover fields are appended to bottom of form.
   */
  setLayout = (layout: string[]) => {
    this.layout = layout;
    this.buildLayout();
  };

  buildLayout = () => {
    let fields = [];
    let leftovers = [];
    this.layout.forEach((item) => {
      this.fields.forEach((field) => {
        if (field.name === item || (field.group && field.group.name === item)) {
          fields.push(field);
        } else if (
          leftovers.indexOf(field) === -1 &&
          this.layout.indexOf(field.name) === -1
        ) {
          leftovers.push(field);
        }
      });
    });
    this.fields = [...fields, ...leftovers];
  };

  // Use this if you're trying to set the layout after store initialization
  buildStoredLayout = (formState: any) => {
    let fields = [];
    let leftovers = [];
    formState.layout.forEach((item) => {
      formState.fields.forEach((field) => {
        if (field.name === item || (field.group && field.group.name === item)) {
          fields.push(field);
        } else if (
          leftovers.indexOf(field) === -1 &&
          formState.layout.indexOf(field.name) === -1
        ) {
          leftovers.push(field);
        }
      });
    });
    formState.fields = [...fields, ...leftovers];
    return formState;
  };

  /**
   * This is for Svelte's "use:FUNCTION" feature.
   * The "use" directive passes the HTML Node as
   * a parameter to the given function (e.g. use:useField(node: HTMLNode)).
   *
   */
  useField = (node: HTMLElement) => {
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

  validate = () => {
    this.clearErrors();
    this.link_fields_to_model_on === LinkOnEvent.Always &&
      this.linkValues(true);
    return validate(this.model).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        this.valid.set(false);
        this.errors = errors;
        this.linkErrors(errors);
        console.log("ERRORS: ", errors);
      } else {
        this.link_fields_to_model_on === LinkOnEvent.Valid &&
          this.linkValues(true);
        this.valid.set(true);
        this.clearErrors();
        console.log("FORM IS VALID! WEEHOO!");
      }
    });
  };

  preValidate = () => {
    this.link_fields_to_model_on === LinkOnEvent.Always &&
      this.linkValues(true);
    return validate(this.model).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        this.valid.set(false);
        this.errors = errors;
        console.log("ERRORS: ", errors);
      }
    });
  };

  validateField = (field: FieldConfig, ev) => {
    this.link_fields_to_model_on === LinkOnEvent.Always &&
      this.linkValues(true);
    return validate(this.model).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        this.valid.set(false);
        this.errors = errors;
        // console.log("ERRORS: ", errors);
        this.linkFieldErrors(errors, field);
      } else {
        this.link_fields_to_model_on === LinkOnEvent.Valid &&
          this.linkValues(true);
        this.valid.set(true);
        this.clearErrors();
        console.log("FORM IS VALID! WEEHOO!");
      }
    });
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
  attachRefData = (refs: object) => {
    const fields = this.fields.filter((f) => f.ref_key);
    fields.forEach((field) => {
      field.options = refs[field.ref_key];
    });
  };

  clearErrors = () => {
    this.errors = [];
    this.fields.forEach((field) => {
      field.errors.set(null);
    });
  };

  clearValues = () => {
    if (this.fields && this.fields.length > 0) {
      this.fields.forEach((field) => {
        field.value.set(null);
      });
    }
  };

  reset = () => {
    this.clearErrors();
    this.valid.set(false);

    const initial = JSON.parse(this.initial_state);
    Object.keys(this.model).forEach((key) => {
      this.model[key] = initial[key];
    });
    this.linkValues(false);
    // setTimeout(() => {
    //   this.preValidate();
    // }, 1);
  };

  destroy = () => {
    if (this.fields && this.fields.length > 0) {
      // This is the fastest way to loop in JS. Too fast to use in nested loops.
      let i = 0,
        len = this.fields.length;
      for (; len > i; ++i) {
        // Remove all the event listeners!
        Object.keys(this.on_events).forEach((key) => {
          this.fields[i].node.removeEventListener(key, (ev) => {
            this.validateField(this.fields[i], ev);
          });

          this.fields[i].node.removeEventListener(key, (ev) => {
            this.clearFieldErrors(this.fields[i].name);
          });
        });
      }
    }
    this.reset();
  };

  //#region Private Functions

  // Link values from fields to model or model to fields
  private linkValues = (toModel: boolean) => {
    let i = 0,
      len = this.fields.length;
    for (; len > i; ++i) {
      toModel
        ? (this.model[this.fields[i].name] = get(this.fields[i].value))
        : this.fields[i].value.set(this.model[this.fields[i].name]);
    }
    this.hasChanged();
  };

  private hasChanged = () => {
    if (JSON.stringify(this.model) === this.initial_state) {
      this.changed.set(false);
      return;
    }
    this.changed.set(true);
  };

  private linkFieldErrors = (errors: ValidationError[], field: FieldConfig) => {
    const error = errors.filter((e) => e.property === field.name);
    if (error && error.length > 0) {
      field.errors.set(error[0]);
    } else {
      field.errors.set(null);
    }
  };

  private linkErrors = (errors: ValidationError[]) => {
    errors.forEach((err) => {
      this.fields.forEach((field) => {
        if (err.property === field.name) {
          field.errors.set(err);
        }
      });
    });
  };

  private clearFieldErrors = (name) => {
    this.fields.forEach((field) => {
      if (field.name === name) {
        field.errors.set(null);
      }
    });
  };

  private handleOnValidateEvents = (node: HTMLElement) => {
    //@ts-ignore
    const field = this.fields.filter((f) => f.name === node.name)[0];
    Object.entries(this.validate_on_events).forEach(([key, val]) => {
      if (val) {
        node.addEventListener(key, (ev) => {
          this.validateField(field, ev);
        });
      }
    });
  };

  private handleOnClearErrorEvents = (node) => {
    Object.entries(this.clear_errors_on_events).forEach(([key, val]) => {
      if (val) {
        node.addEventListener(key, (ev) => {
          this.clearFieldErrors(node.name);
        });
      }
    });
  };
  //#endregion
}
