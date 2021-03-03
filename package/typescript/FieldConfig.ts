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
    Object.assign(this, init);
    this.attributes["type"] = this.type;

    if (
      this.type === "text" ||
      this.type === "email" ||
      this.type === "password" ||
      this.type === "string"
    ) {
      this.value.set("");
    }

    if (this.type === "number") {
      this.value.set(0);
    }

    if (this.type === "decimal") {
      this.value.set(0.0);
    }

    if (this.type === "boolean" || this.type === "choice") {
      this.value.set(false);
    }

    if (this.el === "select" || this.el === "dropdown") {
      this.options = [];
    }

    if (this.attributes["title"]) {
      this.attributes["aria-label"] = this.attributes["title"];
    } else {
      this.attributes["aria-label"] = this.label || this.name;
    }
  }

  //! DO NOT SET NAME. IT'S SET AUTOMATICALLY IN FORM.TS!
  name: string;

  // Used to add and remove event listeners
  node: HTMLElement;

  el: string; // Element to render in your frontend
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
   * * String array of things like:
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
