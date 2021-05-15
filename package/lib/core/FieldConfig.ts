import { SvelteComponent } from "svelte";
import { writable, Writable } from "svelte/store";
import {
  Callback,
  FieldAttributes,
  RefDataItem,
  ValidationCallback,
  ValidationError,
} from "./types";

/**
 * FieldConfig is used to help with the form auto generation functionality.
 *
 * This is not meant to be a complete HTML Input/Select/etc replacement.
 * It is simply a vehicle to help give the form generator
 * an easy-to-use format to work with.
 */
export class FieldConfig {
  constructor(name: string, init?: Partial<FieldConfig>) {
    if (name) {
      this.name = name;
    } else {
      throw new Error(
        "{name: string} is required for FieldConfig intialization."
      );
    }

    /** I know, Object.assign... lots of freedom there. */
    if (init) Object.assign(this, init);

    if (!this.selector) {
      throw new Error(
        `Please pass in a valid Element.\nEither a string selector or a SvelteComponent.`
      );
    }

    /** Check if the value is still a Writable store */
    if (!this.value || !(<Writable<any>>this.value).subscribe) {
      /** If it's not, make it a writable store. */
      this.value = writable(this.value);
    }

    /**  Set the type attribute if it's not already set */
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

    /**
     * I'm doing this because there's not enough thought about accessibility
     * in Forms. Better to have SOME kind of default than none at all.
     * So, if there's no aria-label and the title attribute is present...
     */
    if (!this.attributes["aria-label"] && this.attributes["title"]) {
      // Set aria-label = title
      this.attributes["aria-label"] = this.attributes["title"];
    } else if (!this.attributes["aria-label"]) {
      // If no aria-label then set it to the label or if !label then name
      this.attributes["aria-label"] = this.label || this.name;
    }
  }

  /**
   * Name of the class property.
   * Only set "name" if you are using FieldConfig apart from
   * your object/model.
   * I.e. you are using plain JSON rather than a TS class.
   */
  readonly name: string;

  /**
   * HTML Element which the field is attached to.
   * Attached using the form.useField method.
   */
  node?: HTMLElement;

  /**
   * el can be either String or Svelte Component.
   * This allows us a more flexible dynamic field generator.
   * Using a template also allows you to style each input as needed.
   */
  selector?: string | SvelteComponent;

  /** Value is a writable store defaulting to undefined. */
  value: Writable<any> = writable(undefined);
  /** Defaults to text, can be set to anything though. */
  type: string = "text";
  required?: boolean;

  label?: string;
  hint?: string;

  /**
   * Validation Errors!
   * We're mainly looking for the "constraints".
   * One ValidationError object can have multiple errors (constraints)
   */
  errors: Writable<ValidationError | undefined> = writable(undefined);

  /**
   * Use styles and classes to apply styling.
   * However, using a template/component is recommended.
   */
  styles?: string;
  classes?: string;

  /** Linked to form.refs via RefData[ref_key] */
  ref_key?: string;
  /** Used if there is a set of "options" to choose from. */
  options?: RefDataItem[];

  /** Pretty self-explainitory, disable the field. */
  disabled?: boolean;
  /** Pretty self-explainitory, hide the field. */
  hidden?: boolean;

  /**
   * Attributes uses a fairly exhaustive map of most HTML Field-ish
   * attributes. Also have the option to use plain JSON Object for
   * extra flexibility.
   *
   * @example attrubutes["description"] is ok without being a FieldAttribute
   */
  attributes?: Partial<FieldAttributes> | Record<string | number | symbol, any>;

  /**
   * Group is optional.
   * Use when you'd like to group multiple fields togethter.
   */
  group?: string | string[];
  /**
   * Step is used when field is part of a multi-step form.
   */
  step?: number | string;

  private clearErrors = (): void => {
    this.errors.set(undefined);
  };

  clear = (): void | undefined => {
    this.clearErrors();
  };

  addEventListener = (
    event: keyof HTMLElementEventMap,
    callback: ValidationCallback | Callback
  ) => {
    if (this.node) {
      this.node.addEventListener(
        event,
        (e) => (callback instanceof Function ? callback(e) : callback),
        false
      );
    } else {
      throw new Error(
        "Node is missing! No Html Node to attach event listener too!"
      );
    }
  };
}
