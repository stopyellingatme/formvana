import { SvelteComponent } from "svelte";
import { get, writable, Writable } from "svelte/store";
import { field } from "./Decorators";
import {
  AcceptedDataType,
  Callback,
  FieldAttributes,
  FieldNode,
  OnEvents,
  RefDataItem,
  ValidationCallback,
  ValidationError,
} from "./Types";

/**
 * ---------------------------------------------------------------------------
 *
 * FieldConfig is used to help with the form auto generation functionality.
 *
 * This is not meant to be a complete HTML Input/Select/etc replacement.
 * It is simply a vehicle to help give the form generator
 * an easy-to-use format to work with.
 *
 * ---------------------------------------------------------------------------
 */
export class FieldConfig<T extends Object> {
  constructor(name: keyof T, init?: Partial<FieldConfig<T>>) {
    if (name) {
      this.name = name;
    } else {
      throw new Error(
        "{name: string} is required for FieldConfig intialization."
      );
    }

    /** I know, Object.assign... lots of freedom there. */
    if (init) Object.assign(this, init);

    /** Is value Writable store? */
    if (!this.value || !(<Writable<any>>this.value).subscribe) {
      /** If it's not, make it a writable store. */
      this.value = writable(this.value);
    }

    if (init && init["type"]) this.attributes["type"] = init["type"];

    /**
     * I'm doing this because there's not enough thought about accessibility
     * in Forms or for libraries. Better to have SOME kind of default than none
     * at all.
     * So, if there's no aria-label and the title attribute is present...
     */
    if (!this.attributes["aria-label"] && this.attributes["title"]) {
      /** Set aria-label = title */
      this.attributes["aria-label"] = this.attributes["title"];
    } else if (!this.attributes["aria-label"]) {
      /** If no aria-label then set it to the label or if !label then name */
      this.attributes["aria-label"] = this.label || this.name;
    }

    if (this.required) {
      this.attributes["required"] = true;
      this.attributes["aria-required"] = true;
    }
  }

  /**
   * Name of the class property.
   * Only set "name" if you are using FieldConfig apart from
   * your object/model.
   * I.e. you are using plain JSON rather than a TS class.
   */
  readonly name: keyof T;

  /**
   * HTML Element which the field is attached to.
   * Attached using the form.useField method.
   */
  node?: FieldNode<T>;

  /**
   * el can be either String or Svelte Component.
   * This allows us a more flexible dynamic field generator.
   * Using a template also allows you to style each input as needed.
   */
  selector?: string | SvelteComponent;

  /** Value is a writable store defaulting to undefined. */
  value: Writable<any> = writable(undefined);

  /**
   * Tyoe of the input
   */
  #type: string = "text";

  public set type(v: string) {
    this.#type = v;
    this.attributes["type"] = this.#type;
  }

  public get type(): string {
    return this.#type;
  }

  /**
   * This is the DATA TYPE of the value!
   * If set to number (or decimal, or int, etc.) it will be parsed as number.
   * If the type is not accounted for in this library, we return the original
   * event.target.value.
   *
   * This is not the input.type.
   *
   * Defaults to "string"
   */
  data_type: AcceptedDataType = "string";

  /**
   * Validation Errors!
   * We're mainly looking in the "errors" field.
   * One ValidationError object can have multiple errors.
   */
  errors: Writable<ValidationError | undefined> = writable(undefined);

  /**
   * Attributes uses a fairly exhaustive map of most HTML Field-ish
   * attributes.
   *
   * You also have the option to use a plain Object, for extra flexibility.
   *
   * @example attributes["type"] get's set here.
   *
   * @example attrubutes["description"] passes type-check without being a FieldAttribute
   * but still gives you type-completion on any known attribute.
   */
  attributes: Partial<FieldAttributes> | Record<string | number | symbol, any> =
    {};

  /** Has the input been altered? */
  touched: Writable<boolean> = writable(false);

  /** Is this a required field? */
  required?: boolean;
  /** Label can be sting or array of strings */
  label?: string | string[];
  /** Hint can be sting or array of strings */
  hint?: string | string[];

  /** Linked to form.refs via RefData[ref_key] */
  ref_key?: string;
  /** Used if there is a set of "options" to choose from. */
  options?: RefDataItem[];

  /** Pretty self-explainitory, disable the field. */
  disabled?: boolean;
  /** Pretty self-explainitory, hide the field. */
  hidden?: boolean;

  /**
   * @TODO Add hooks for this when setting up field.
   *
   * Element.dataset hook, so you can do the really wild things!
   */
  data_set?: string[];

  /**
   * * If you set this, you must set form.meta.name!
   * * If you set this, you must set form.meta.name!
   *
   * In case you'd like to filter some fields for a specific form
   *
   * @example if you have a class to use on multiple forms, but want to
   * use this specific field on one form instead of other. Or whatever.
   */
  for_form?: string | string[];

  /**
   * If you're using a validation library that supports
   * a validation rules pattern, this is here for you.
   */
  validation_rules?: Object;

  /**
   * You may need to excude some event listeners.
   *
   * @example exclude blur and focus events for a checkbox
   */
  exclude_events?: Array<keyof OnEvents<HTMLElementEventMap>>;

  /** Are you grouping multiple fields togethter? */
  group?: string | string[];
  /**
   * Step is used when field is part of a multi-step form.
   */
  step?: number | string;

  /** Clear the field's errors */
  clearErrors = (): void => {
    this.errors.set(undefined);
  };

  /** Add event listeners to the field in a more typesafe way. */
  addEventListener = (
    event: keyof HTMLElementEventMap,
    callback: ValidationCallback | Callback
  ) => {
    if (this.node) {
      this.node.addEventListener(
        event,
        /** Check if the callback is directly executable */
        (e: InputEvent | Event) =>
          callback instanceof Function ? callback(e) : callback,
        /** No extra options being passed in */
        false
      );
    } else {
      throw new Error(
        "Node is missing! No Html Node to attach event listener too!"
      );
    }
  };

  emitEvent(event_name: keyof HTMLElementEventMap): boolean | undefined {
    const event = new Event(event_name);
    return this.node?.dispatchEvent(event);
  }
}

type FieldDictionary = Array<FieldConfig<Object>>;

export class FieldStepper {
  constructor(fields: FieldDictionary, active_index?: keyof FieldDictionary) {
    this.fields = fields;

    if (active_index) {
      this.active_step = active_index;
    } else {
      /** Get the first set, and set the active_index */
      let k: keyof FieldDictionary,
        first = true;
      for (k in fields) {
        if (first) this.active_step = k;
      }
    }
  }

  fields: FieldDictionary;

  active_step: keyof FieldDictionary | undefined;

  public get fields_valid(): Writable<boolean> {
    let valid = true,
      k: keyof FieldDictionary;
    for (k in this.fields) {
      /** If there's an error, set valid to false. */
      if (get(this.fields[k].errors)) {
        valid = false;
      }
    }
    return writable(valid);
  }
}
