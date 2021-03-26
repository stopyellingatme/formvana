import { ValidationError } from "class-validator/types";
import { writable, Writable } from "svelte/store";

export interface FieldGroup {
  name: string;
  classnames?: string[]; // Order determines when to be applied
  label?: string;
}

export interface FieldStep {
  index: number;
  classnames?: string[]; // Order determines when to be applied
  label?: string;
}

/**
 * FieldConfig is used to help with the form auto generation functionality.
 *
 * This is not meant to be a complete HTML input replacement.
 * It is simply a vehicle to help give the form generator
 * a standard-ish format to work with.
 */
export class FieldConfig {
  constructor(init?: Partial<FieldConfig>) {
    // I know, Object.assign... lots of freedom there.
    Object.assign(this, init);
    this.attributes["type"] = this.type;

    /**
     * Just trying to set some sane defaults when initializing field.
     * These can be over-written easily by simply adding a value to your 
     * class field.
     * E.g. class YourClass{ description: string = "This is a descriptor." }
     * The text "This is a descriptor." will be linked to the FieldConfig
     * when the fields are built from the model (in Form.buildFields();)
     */
    switch (this.type) {
      case "text" || "email" || "password" || "string":
        this.value.set("");
        break;
      case "decimal" || "double":
        this.value.set(0.0);
        break;
      case "number" || "int" || "integer":
        this.value.set(0);
        break;
      case "boolean" || "choice" || "radio" || "checkbox":
        this.value.set(false);
        this.options = [];
        break;
      case "select" || "dropdown":
        this.options = [];
        break;

      default:
        this.value.set("");
        break;
    }

    if (!this.attributes["aria-label"] && this.attributes["title"]) {
      this.attributes["aria-label"] = this.attributes["title"];
    } else {
      this.attributes["aria-label"] = this.label || this.name;
    }
  }

  //! DO NOT SET NAME. IT'S SET AUTOMATICALLY IN FORM.TS!
  name: string;

  // Used to add and remove event listeners
  node: HTMLElement;

  /**
   * el can be either String or Svelte Component.
   * This allows us a more flexible dynamic render.
   */
  el: string;
  // Svelte template for custom field redering
  el_template?: any;
  type: string = "text"; // Defaults to text, for now
  label: string;

  // Classes applied to the div wrapping the input field
  classname: string;
  required: boolean = false;

  value: Writable<any> = writable(null);

  /**
   * Used if there is a set of "options" to choose from.
   */
  options?: any[];
  ref_key?: string; // Reference data key

  hint?: string; // Mainly for textarea, for now
  group?: FieldGroup;
  step?: FieldStep;

  /**
   * * JSON of things like:
   * -- type="text || email || password || whatever"
   * -- class='input class'
   * -- disabled
   * -- title='input title'
   * -- etc.
   */
  attributes: object = {};

  /**
   * Validation Errors!
   * We're mainly looking for the class-validator "constraints"
   * One ValidationError object can have multiple errors (constraints)
   */
  errors: Writable<ValidationError> = writable(null);

  clearValue = () => {
    this.value.set(null);
  };

  clearErrors = () => {
    this.errors.set(null);
  };

  clear = () => {
    this.clearValue();
    this.clearErrors();
  };
}
