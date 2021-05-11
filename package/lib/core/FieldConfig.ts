import { SvelteComponent } from "svelte";
import { writable, Writable } from "svelte/store";
import {
  ElementAttributesMap,
  FieldAttributes,
  RefDataItem,
  ValidationError,
} from "./types";

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
  constructor(name: string, init: Partial<FieldConfig>) {
    if (name) {
      this.name = name;
    } else {
      throw new Error(
        "{name: string} is required for FieldConfig intialization."
      );
    }
    // I know, Object.assign... lots of freedom there.
    Object.assign(this, init);

    if (!this.selector && !this.template) {
      throw new Error(
        `Please pass in a valid Element.\nEither a string selector or a SvelteComponent.`
      );
    }

    // Set the type attribute if it's not already set
    if (this.attributes && !this.attributes["type"]) {
      this.attributes["type"] = this.type;
    } else if (!this.attributes) {
      this.attributes = {};
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
        // this.setInitialValue("");
        this.value.set("");
        break;
      case "decimal" || "double":
        // this.setInitialValue(0.0);
        this.value.set(0.0);
        break;
      case "number" || "int" || "integer":
        this.value.set(0);
        // this.setInitialValue(0);
        break;
      case "boolean" || "choice" || "radio" || "checkbox":
        this.value.set(false);
        // this.setInitialValue(false);
        this.options = [];
        break;
      case "select" || "dropdown":
        this.options = [];
        break;

      default:
        this.value.set(undefined);
        // this.setInitialValue(undefined);
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
   * Only set "name" if you are using FieldConfig apart from
   * your object/model.
   * I.e. you are using plain JSON rather than a TS class.
   */
  readonly name: string;

  // Used to add and remove event listeners
  node?: HTMLElement;

  /**
   * Value is a writable store defaulting to undefined.
   */
  value: Writable<any> = writable(undefined);
  required?: boolean;
  type: string = "text"; // Defaults to text, for now
  label?: string;
  hint?: string;

  /**
   * el can be either String or Svelte Component.
   * This allows us a more flexible dynamic field generator.
   * Using a template also allows you to style each input as needed.
   */
  selector?: string;
  template?: SvelteComponent;

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
  options?: RefDataItem[];
  ref_key?: string; // Reference data key

  disabled?: boolean;
  hidden?: boolean;

  /**
   * Validation Errors!
   * We're mainly looking for the class-validator "constraints"
   * One ValidationError object can have multiple errors (constraints)
   */
  errors: Writable<ValidationError | undefined> = writable(undefined);

  /**
   * * JSON of things like:
   * * * disabled
   * * * id="something"
   * * * type="text || email || password || whatever"
   * * * class='input class'
   * * * title='input title'
   * * * multiple
   * * * etc.
   * * * anything you want!
   */
  attributes?: FieldAttributes;
  // attributes: Object = {};

  group?: FieldGroup;
  step?: FieldStep;

  // private initial_value: NonNullable<any>;

  // private clearValue = (): void => {
  //   this.value.set(this.initial_value);
  // };

  private clearErrors = (): void => {
    this.errors.set(undefined);
  };

  clear = (): void | undefined => {
    // this.clearValue();
    this.clearErrors();
  };

  // setInitialValue = (value: any): void => {
  //   this.initial_value = value;
  //   this.value.set(value);
  // };
}
