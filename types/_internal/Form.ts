import { ValidationError, validate, validateOrReject } from "class-validator";
import { get } from "svelte/store";
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
      this.initial_state = Object.assign({}, this.model);
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

  valid: boolean = false;
  errors: ValidationError[] = [];

  loading: boolean = false;
  changed: boolean = false;
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
        const config = Reflect.getMetadata("field", this.model, prop);
        config.attributes["type"] = config.type;
        config.form_options = this;
        // this.model[prop] = config.value;

        if (config.el === "select") {
          config.options = [];
        }
        console.log("FIELD CONFIG: ", config);

        // TODO: fix up that field config. This is where (some of) the magic happens.
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
        this.errors = errors;
        this.linkErrors(errors);
        console.log("ERRORS: ", errors);
      } else {
        this.valid = true;
        this.clearErrors();
        console.log("FORM IS VALID! WEEHOO!");
      }
    });
  };

  validateField = (name: string) => {
    this.linkValues();
    return validate(this.model).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        this.errors = errors;
        console.log("ERRORS: ", errors);
        this.linkFieldErrors(errors, name);
      } else {
        this.valid = true;
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
    this.clearValues();
    this.valid = false;
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
  };

  private linkFieldErrors = (
    errors: ValidationError[],
    incomingName: string
  ) => {
    const errorNames = errors.map((e) => e.property);
    // console.log(errors, errorNames);
    errors.forEach((err) => {
      this.fields.forEach((field) => {
        if (incomingName === field.name) {
          if (incomingName === err.property) {
            field.errors.set(err);
          }
          // The incoming (field) name is not in the list of errors
          else if (errorNames.indexOf(incomingName) === -1) {
            field.errors.set(null);
          }
        }
      });
    });
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
    if (this.validate_on_events.input) {
      node.addEventListener("input", (ev) => {
        this.validateField(node.name);
      });
    }

    if (this.validate_on_events.change) {
      node.addEventListener("change", (ev) => {
        this.validateField(node.name);
      });
    }

    if (this.validate_on_events.focus) {
      node.addEventListener("focus", (ev) => {
        this.validateField(node.name);
      });
    }

    if (this.validate_on_events.blur) {
      node.addEventListener("blur", (ev) => {
        this.validateField(node.name);
      });
    }
  };

  private handleOnClearErrorEvents = (node) => {
    if (this.clear_errors_on_events.input) {
      node.addEventListener("input", (ev) => {
        this.clearFieldErrors(node.name);
      });
    }

    if (this.clear_errors_on_events.change) {
      node.addEventListener("change", (ev) => {
        this.clearFieldErrors(node.name);
      });
    }

    if (this.clear_errors_on_events.focus) {
      node.addEventListener("focus", (ev) => {
        this.clearFieldErrors(node.name);
      });
    }

    if (this.clear_errors_on_events.blur) {
      node.addEventListener("blur", (ev) => {
        this.clearFieldErrors(node.name);
      });
    }
  };
  //#endregion
}
