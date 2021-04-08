import { ValidationError } from "class-validator";
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
 * This is not meant to be a complete HTML Input/Select/etc replacement.
 * It is simply a vehicle to help give the form generator
 * an easy-to-use format to work with.
 */
export class FieldConfig {
  constructor(init?: Partial<FieldConfig>) {
    // I know, Object.assign... lots of freedom there.
    Object.assign(this, init);
    this.attributes["type"] = !this.attributes["type"]
      ? this.type
      : this.attributes["type"];

    /**
     * Trying to set some sane defaults when initializing field.
     * These can be over-written easily by simply adding a value to your
     * class field.
     * E.g. class YourClass{ description: string = "This is a descriptor." }
     * The text "This is a descriptor." will be linked to the FieldConfig.value
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
        this.value.set(undefined);
        break;
    }

    if (!this.attributes["aria-label"] && this.attributes["title"]) {
      this.attributes["aria-label"] = this.attributes["title"];
    } else {
      this.attributes["aria-label"] = this.label || this.name;
    }
  }

  /**
   * ! DO NOT SET NAME
   * ! IT IS SET AUTOMATICALLY IN FORM.TS
   */
  readonly name: string;

  // Used to add and remove event listeners
  node: HTMLElement;

  /**
   * el can be either String or Svelte Component.
   * This allows us a more flexible dynamic field generator.
   */
  el: string;
  label?: string;
  type: string = "text"; // Defaults to text, for now
  required: boolean = false;
  value: Writable<any> = writable(null);

  // Styling
  styles?: object;
  classes?: string;

  /**
   * Used if there is a set of "options" to choose from.
   */
  options?: any[];
  ref_key?: string; // Reference data key

  disabled: boolean = false;
  hidden: boolean = false;

  /**
   * Validation Errors!
   * We're mainly looking for the class-validator "constraints"
   * One ValidationError object can have multiple errors (constraints)
   */
  errors: Writable<ValidationError> = writable(null);

  /**
   * * JSON of things like:
   * -- disabled
   * -- id="something"
   * -- type="text || email || password || whatever"
   * -- class='input class'
   * -- title='input title'
   * -- multiple
   * -- etc.
   */
  attributes: object = {};

  hint?: string; // Mainly for textarea, or whatever
  group?: FieldGroup;
  step?: FieldStep;

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
