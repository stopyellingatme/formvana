import { ValidationError } from "class-validator";
import { SvelteComponent } from "svelte";
import { writable, Writable } from "svelte/store";

export interface FieldGroup {
  name: string;
  label?: string;
}

export interface FieldStep {
  index: number;
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
  constructor(init: Partial<FieldConfig>) {
    // I know, Object.assign... lots of freedom there.
    Object.assign(this, init);

    if (!this.selector && !this.template) {
      throw new Error(
        `Please pass in a valid Element.\nEither a string selector or a SvelteComponent.`
      );
    }

    // Set the type attribute if it's not already set
    if (!this.attributes["type"]) {
      this.attributes["type"] = this.type;
    }

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
        this.setInitialValue("");
        break;
      case "decimal" || "double":
        this.setInitialValue(0.0);
        break;
      case "number" || "int" || "integer":
        this.setInitialValue(0);
        break;
      case "boolean" || "choice" || "radio" || "checkbox":
        this.setInitialValue(false);
        this.options = [];
        break;
      case "select" || "dropdown":
        this.options = [];
        break;

      default:
        this.setInitialValue(undefined);
        break;
    }

    // If there's no aria-label and the title attribute is present...
    if (!this.attributes["aria-label"] && this.attributes["title"]) {
      // Set aria-label = title
      this.attributes["aria-label"] = this.attributes["title"];
    } else if (!this.attributes["aria-label"]) {
      // If no aria-label then set it to the label or name
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
   * Using a template also allows you to style each input as needed.
   */
  selector?: string;
  template?: SvelteComponent;

  label?: string;
  type: string = "text"; // Defaults to text, for now
  required: boolean = false;
  value: Writable<any> = writable(undefined);

  /**
   * You can use these to apply styles.
   * However, using a template/component is recommended.
   *
   */
  styles?: string;
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
  errors: Writable<ValidationError | null> = writable(null);

  /**
   * * JSON of things like:
   * -- disabled
   * -- id="something"
   * -- type="text || email || password || whatever"
   * -- class='input class'
   * -- title='input title'
   * -- multiple
   * -- etc.
   * -- anything you want!
   */
  attributes: object = {};

  hint?: string; // Mainly for textarea, or whatever
  group?: FieldGroup;
  step?: FieldStep;

  private initial_value: any;

  clearValue = () => {
    this.value.set(this.initial_value);
  };

  clearErrors = () => {
    this.errors.set(null);
  };

  clear = () => {
    this.clearValue();
    this.clearErrors();
  };

  setInitialValue = (value: any) => {
    this.initial_value = value;
    this.value.set(value);
  };
}
