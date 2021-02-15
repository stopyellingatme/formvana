import { ValidationError } from "class-validator";
import { writable, Writable } from "svelte/store";
import { Form } from "./Form";

export class FieldConfig {
  constructor(init?: Partial<FieldConfig>) {
    Object.assign(this, init);
  }
  node: HTMLElement;

  el: string;
  name: string; // is also "id"
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
  errors: Writable<ValidationError[]> = writable([]);

  onValidate: () => void;
  onClear: () => void;

  public useField(node: HTMLElement, form: Form) {
    this.node = node;
    const validate_opts = form.validate_on_events;
    const clear_opts = form.validate_on_events;

    this.onValidate = () => {
      form.validate();
    };

    this.onClear = () => {
      this.clearErrors();
    };

    if (validate_opts.input) {
      node.addEventListener("input", form.validate);
    }

    if (validate_opts.change) {
      node.addEventListener("change", form.validate);
    }
  }

  public clearValue() {
    this.value.set(null);
  }

  public clearErrors() {
    this.errors.set([]);
  }

  public clear() {
    this.clearValue();
    this.clearErrors();
  }

  destroy() {
    this.node.removeEventListener("input", this.onValidate);
    this.node.removeEventListener("change", this.onValidate);
    this.node.removeEventListener("focus", this.onValidate);
    this.node.removeEventListener("blur", this.onValidate);
  }
}
