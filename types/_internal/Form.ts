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
  }

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
    let i = 0,
      len = this.fields.length;
    for (; len > i; ++i) {
      this.model[this.fields[i].name] = get(this.fields[i].value);
    }
  };

  linkErrors = (errors: ValidationError[]) => {
    let i = 0,
      j = 0,
      len = this.fields.length,
      lenn = errors.length;
    for (; len > i; ++i) {
      for (; lenn > j; ++j) {
        // console.log(this.fields[i].name, errors[j].property);

        if (this.fields[i].name === errors[j].property) {
          // console.log("ADDED EEROR TO FIELD: ", this.fields[i]);

          this.fields[i].errors.set(errors[j]);
        }
      }
    }
  };

  validate = () => {
    this.linkValues();
    return validate(this.model).then((errors: ValidationError[]) => {
      this.linkErrors(errors);
      if (errors.length > 0) {
        // TODO: Attatch errors to corresponding field configs

        this.errors = errors;
        console.log("ERRORS: ", errors);
      } else {
        this.errors = [];
        this.valid = true;
        console.log("FORM IS VALID! WEEHOO!");
      }
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
      console.log("USE FIELD: ", this);

      const validate_opts = this.validate_on_events;
      const clear_opts = this.clear_errors_on_events;

      if (validate_opts.input) {
        node.addEventListener("input", this.validate);
      }

      if (validate_opts.change) {
        node.addEventListener("change", this.validate);
      }
    }
  };
}
