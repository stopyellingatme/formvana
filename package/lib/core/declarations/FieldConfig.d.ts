import { SvelteComponent } from "svelte";
import { Writable } from "svelte/store";
import { FieldAttributes, RefDataItem, ValidationError } from "./types";
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
export declare class FieldConfig {
    constructor(name: string, init: Partial<FieldConfig>);
    /**
     * Only set "name" if you are using FieldConfig apart from
     * your object/model.
     * I.e. you are using plain JSON rather than a TS class.
     */
    readonly name: string;
    node?: HTMLElement;
    /**
     * Value is a writable store defaulting to undefined.
     */
    value: Writable<any>;
    required?: boolean;
    type: string;
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
    ref_key?: string;
    disabled?: boolean;
    hidden?: boolean;
    /**
     * Validation Errors!
     * We're mainly looking for the class-validator "constraints"
     * One ValidationError object can have multiple errors (constraints)
     */
    errors: Writable<ValidationError | undefined>;
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
    group?: FieldGroup;
    step?: FieldStep;
    private clearErrors;
    clear: () => void | undefined;
}
