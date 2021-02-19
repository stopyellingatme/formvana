import { ValidationError } from "class-validator";
import { writable, Writable } from "svelte/store";

export interface FieldGroup {
  name: string;
  classname?: string;
  label?: string;
}

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
  }

  //! DO NOT SET NAME. IT'S SET AUTOMATICALLY BY FORM.TS!
  name: string;
  node: HTMLElement;
  el: string; // Element to render in your frontend
  type: string = "text"; // Defaults to text
  label: string;
  classname: string;
  required: boolean = false;

  value: Writable<any> = writable(null);

  options?: any[];
  ref_key?: string; // Reference data key

  group?: FieldGroup;

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
