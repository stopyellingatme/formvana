import { ValidationError } from "class-validator";
import { writable, Writable } from "svelte/store";

export class FieldConfig {
  constructor(init?: Partial<FieldConfig>) {
    Object.assign(this, init);
    this.attributes["type"] = this.type;

    if (this.el === "select") {
      this.options = [];
    }
  }

  node: HTMLElement;
  el: string;
  //! DO NOT SET NAME. IT IS SET AUTOMATICALLY!
  name: string;
  type: string = "text"; // Default to text
  label: string;
  className: string;

  value: Writable<any> = writable(null);
  required: boolean = false;
  options?: any[];

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
