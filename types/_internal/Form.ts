import { ValidationError, validate } from "class-validator";
import { get } from "svelte/store";
import { FieldConfig } from "./FieldConfig";

/**
 * Main things left to tackle:
 *  - Attach events to fields (onInput, onChange, onFocus, etc.)
 *  - Attach errors to fieldConfigs when validate is called
 *  - Field defaults built from constructor
 *  - Field groups and Field ordering (group styling)
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
   * TODO: Model values will have to be linked to field values.
   */
  model: any = null;

  /**
   * Fields are built from the model's
   * metadata using reflection
   */
  fields: FieldConfig[] = [];

  valid: boolean = false;
  errors: ValidationError[] = [];

  loading: boolean = false;
  changed: boolean = false;
  touched: boolean = false;

  template_classes: string = "grid grid-cols-4 gap-6 mt-6";

  private on_events: OnEvents = {
    change: true,
    input: true,
    blur: true,
    focus: false,
  };
  validate_on_events: OnEvents = this.on_events;
  clear_errors_on_events: OnEvents = this.on_events;

  public makeFields() {
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
  }

  linkValues = () => {
    this.fields.forEach((field) => {
      this.model[field.name] = get(field.value);
    });
  };

  linkErrors = (errors: ValidationError[], name: string) => {
    const errorNames = errors.map((e) => e.property);
    // console.log(errors, errorNames);
    errors.forEach((err) => {
      this.fields.forEach((field) => {
        if (name === err.property && name === field.name) {
          field.errors.set(err);
        } else if (name === field.name && errorNames.indexOf(name) === -1) {
          field.errors.set(null);
        }
      });
    });
  };

  validate = () => {
    this.linkValues();
    return validate(this.model).then((errors: ValidationError[]) => {
      // this.linkErrors(errors);
      if (errors.length > 0) {
        // TODO: Attatch errors to corresponding field configs

        this.errors = errors;
        console.log("ERRORS: ", errors);
      } else {
        this.errors = [];
        this.valid = true;
        this.fields.forEach((field) => {
          field.errors.set(null);
        });
        console.log("FORM IS VALID! WEEHOO!");
      }
    });
  };

  validateField = (name: string) => {
    this.linkValues();
    return validate(this.model).then((errors: ValidationError[]) => {
      if (errors.length > 0) {
        this.errors = errors;
        // console.log("ERRORS: ", errors);
      } else {
        this.errors = [];
        this.valid = true;
        this.fields.forEach((field) => {
          field.errors.set(null);
        });
        console.log("FORM IS VALID! WEEHOO!");
      }
      this.linkErrors(errors, name);
    });
  };

  clearErrors = () => {
    this.errors = [];
  };

  clearValues = () => {
    if (this.fields && this.fields.length > 0) {
      let i = 0,
        len = this.fields.length;
      for (; len > i; ++i) {
        this.fields[i].clearValue();
      }
    }
  };

  reset = () => {
    this.clearErrors();
    this.clearValues();
    this.valid = false;
  };

  useField = (node: HTMLElement) => {
    if (this) {
      if (this.validate_on_events.input) {
        // node.addEventListener("input", this.validate);
        node.addEventListener("input", (ev) => {
          // console.log(ev);
          //@ts-ignore
          this.validateField(node.name);
        });
      }

      if (this.validate_on_events.change) {
        node.addEventListener("change", this.validate);
      }
    }
  };
}
