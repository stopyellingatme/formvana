import { SvelteComponent } from "svelte";
import { Writable } from "svelte/store";
import { Callback, FieldAttributes, FieldNode, OnEvents, RefDataItem, ValidationCallback, ValidationError } from "./Types";
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
export declare class FieldConfig<T extends Object> {
    constructor(name: keyof T, init?: Partial<FieldConfig<T>>);
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
    value: Writable<any>;
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
    data_type: string;
    /**
     * Validation Errors!
     * We're mainly looking in the "errors" field.
     * One ValidationError object can have multiple errors.
     */
    errors: Writable<ValidationError | undefined>;
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
    attributes: Partial<FieldAttributes> | Record<string | number | symbol, any>;
    /** Has the input been altered? */
    touched: Writable<boolean>;
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
    /** Element.dataset hook, so you can do the really wild things! */
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
    clearErrors: () => void;
    /** Add event listeners to the field in a more typesafe way. */
    addEventListener: (event: keyof HTMLElementEventMap, callback: ValidationCallback | Callback) => void;
}
declare type FieldDictionary = Array<FieldConfig<Object>>;
export declare class FieldStepper {
    constructor(fields: FieldDictionary, active_index?: keyof FieldDictionary);
    fields: FieldDictionary;
    active_step: keyof FieldDictionary | undefined;
    get fields_valid(): Writable<boolean>;
}
export {};
