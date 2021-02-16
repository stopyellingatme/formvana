import { ValidationError, validate } from "class-validator";
import { get, writable, Writable } from "svelte/store";
import { FieldConfig } from "./FieldConfig";


/**
 * Main things left to tackle:
 *  - Field defaults built from constructor
 *  - Field groups and Field ordering (group styling)
 *  - Add change detection using initial_state
 */

export interface OnEvents {
  input: boolean;
  change: boolean;
  blur: boolean;
  focus: boolean;
}

export class Form {
  constructor(init?: Partial<Form>) {
    Object.assign(this, init);
    if (this.model) {
      this.initial_state = JSON.stringify(this.model);
    }
  }

  initial_state: any = null;

  /**
   * Underlying TS Model.
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

  template_classes: string = "grid grid-cols-4 gap-6 mt-6";

  on_events = (init: boolean = true): OnEvents => ({
    change: init,
    input: init,
    blur: init,
    focus: init,
  });
  validate_on_events: OnEvents = this.on_events();
  clear_errors_on_events: OnEvents = this.on_events(false);

  /**
   * This function builds the field configs from the given model
   * using metadata-reflection.
   */
  makeFields = () => {
    if (this.model) {
      let props = Reflect.getMetadata("editableProperties", this.model) || [];
      this.fields = props.map((prop) => {
        const config: FieldConfig = Reflect.getMetadata(
          "fieldConfig",
          this.model,
          prop
        );
        config.name = prop;

        console.log("FIELD CONFIG: ", config);
        return config;
      });
    }
  };

  /**
   * This is for Svelte's "use:FUNCTION" feature.
   * The "use" directive passes the HTML Node on which the directive is
   * attached, as a parameter to the given function (e.g. use:useField).
   *
   */
  useField = (node: any) => {
    // Attach HTML Node to field so we can remove event listeners later
    this.fields.forEach((field) => {
      if (field.name === node.name) {
        field.node = node;
      }
    });

    this.handleOnValidateEvents(node);
    this.handleOnClearErrorEvents(node);
  };

  validate = () => {
    this.clearErrors();
    this.linkValues();
    return validate(this.model).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        this.valid.set(false);
        this.errors = errors;
        this.linkErrors(errors);
        console.log("ERRORS: ", errors);
      } else {
        this.valid.set(true);
        this.clearErrors();
        console.log("FORM IS VALID! WEEHOO!");
      }
    });
  };

  validateField = (name: string) => {
    this.linkValues();
    return validate(this.model).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        this.valid.set(false);
        this.errors = errors;
        console.log("ERRORS: ", errors);
        this.linkFieldErrors(errors, name);
      } else {
        this.valid.set(true);
        this.clearErrors();
        console.log("FORM IS VALID! WEEHOO!");
      }
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
    Object.keys(this.model).forEach(key => {
      this.model[key] = initial[key];
    });
    this.linkModelToFieldValues();
  };

  destroy = () => {
    if (this.fields && this.fields.length > 0) {
      // This is the fastest way to loop in JS. Too fast to use in nested loops.
      let i = 0,
        len = this.fields.length;
      for (; len > i; ++i) {
        // Validate Event Listeners
        this.fields[i].node.removeEventListener("input", (ev) => {
          this.validateField(this.fields[i].name);
        });
        this.fields[i].node.removeEventListener("change", (ev) => {
          this.validateField(this.fields[i].name);
        });
        this.fields[i].node.removeEventListener("focus", (ev) => {
          this.validateField(this.fields[i].name);
        });
        this.fields[i].node.removeEventListener("blur", (ev) => {
          this.validateField(this.fields[i].name);
        });
        // Clear Error Listeners
        this.fields[i].node.removeEventListener("input", (ev) => {
          this.clearFieldErrors(this.fields[i].name);
        });
        this.fields[i].node.removeEventListener("change", (ev) => {
          this.clearFieldErrors(this.fields[i].name);
        });
        this.fields[i].node.removeEventListener("focus", (ev) => {
          this.clearFieldErrors(this.fields[i].name);
        });
        this.fields[i].node.removeEventListener("blur", (ev) => {
          this.clearFieldErrors(this.fields[i].name);
        });
      }
    }
    this.reset();
  };

  //#region Private Functions
  private linkValues = () => {
    this.fields.forEach((field) => {
      this.model[field.name] = get(field.value);
    });
    this.hasChanged();
  };

  private linkModelToFieldValues = () => {
    this.fields.forEach((field) => {
      field.value.set(this.model[field.name]);
    });
    this.hasChanged();
  };

  private hasChanged = () => {
    if (JSON.stringify(this.model) === this.initial_state) {
      this.changed.set(false);
      return;
    }
    this.changed.set(true);
  };

  private linkFieldErrors = (
    errors: ValidationError[],
    incomingName: string
  ) => {
    const field = this.fields.filter((f) => f.name === incomingName)[0];
    const error = errors.filter((e) => e.property === incomingName);
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

  private handleOnValidateEvents = (node) => {
    Object.entries(this.validate_on_events).forEach(([key, val]) => {
      if (val) {
        node.addEventListener(key, (ev) => {
          this.validateField(node.name);
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
