import { ValidationError, validate } from "class-validator";
import { get, writable, Writable } from "svelte/store";
import { field } from "../../src/utils/typescript.utils";
import { FieldConfig } from "./FieldConfig";

/**
 * Main things left to tackle:
 *  - Field groups and Field ordering (group styling)
 *  - Add more form elements for testing
 *  - Find out how to add options to a selection field elegantly
 *
 *  - Clean up functions and code wherever possible :)
 */

export interface OnEvents {
  input: boolean;
  change: boolean;
  blur: boolean;
  focus: boolean;
  mount: boolean;
}

export class Form {
  constructor(init?: Partial<Form>) {
    Object.assign(this, init);
    if (this.model) {
      this.initial_state = JSON.stringify(this.model);
    }
  }

  // This is stringified for quicker comparison
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
    mount: false,
  });
  validate_on_events: OnEvents = this.on_events();
  clear_errors_on_events: OnEvents = this.on_events(false);

  /**
   * This function builds the field configs from the given model
   * using metadata-reflection.
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
        if (this.model[prop]) {
          config.value.set(this.model[prop]);
        }

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
    this.linkValues(true);
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

  validateField = (name: string, ev) => {
    this.linkValues(true);
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
            this.validateField(this.fields[i].name, ev);
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
    this.fields.forEach((field) => {
      toModel
        ? (this.model[field.name] = get(field.value))
        : field.value.set(this.model[field.name]);
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

  private handleOnValidateEvents = (node: HTMLElement) => {
    Object.entries(this.validate_on_events).forEach(([key, val]) => {
      if (val) {
        node.addEventListener(key, (ev) => {
          //@ts-ignore
          this.validateField(node.name, ev);
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
