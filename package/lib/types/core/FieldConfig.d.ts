import { SvelteComponent } from "svelte";
import { Writable } from "svelte/store";
import { Callback, FieldAttributes, RefDataItem, ValidationCallback, ValidationError } from "./types";
/**
 * FieldConfig is used to help with the form auto generation functionality.
 *
 * This is not meant to be a complete HTML Input/Select/etc replacement.
 * It is simply a vehicle to help give the form generator
 * an easy-to-use format to work with.
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
    node?: HTMLElement;
    /**
     * el can be either String or Svelte Component.
     * This allows us a more flexible dynamic field generator.
     * Using a template also allows you to style each input as needed.
     */
    selector?: string | SvelteComponent;
    /** Value is a writable store defaulting to undefined. */
    value: Writable<any>;
    /** Defaults to text, can be set to anything though. */
    type: string;
    required?: boolean;
    label?: string;
    hint?: string;
    /**
     * Validation Errors!
     * We're mainly looking for the "constraints".
     * One ValidationError object can have multiple errors (constraints)
     */
    errors: Writable<ValidationError | undefined>;
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
    private clearErrors;
    clear: () => void | undefined;
    addEventListener: (event: keyof HTMLElementEventMap, callback: ValidationCallback | Callback) => void;
}
