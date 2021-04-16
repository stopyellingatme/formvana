import { ValidationError } from "class-validator";
import { SvelteComponent } from "svelte";
import { Writable } from "svelte/store";
export interface FieldGroup {
    name: string;
    classnames?: string[];
    label?: string;
}
export interface FieldStep {
    index: number;
    classnames?: string[];
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
    constructor(init?: Partial<FieldConfig>);
    /**
     * ! DO NOT SET NAME
     * ! IT IS SET AUTOMATICALLY IN FORM.TS
     */
    readonly name: string;
    node: HTMLElement;
    /**
     * el can be either String or Svelte Component.
     * This allows us a more flexible dynamic field generator.
     */
    el: string | SvelteComponent;
    label?: string;
    type: string;
    required: boolean;
    value: Writable<any>;
    styles?: object;
    classes?: string;
    /**
     * Used if there is a set of "options" to choose from.
     */
    options?: any[];
    ref_key?: string;
    disabled: boolean;
    hidden: boolean;
    /**
     * Validation Errors!
     * We're mainly looking for the class-validator "constraints"
     * One ValidationError object can have multiple errors (constraints)
     */
    errors: Writable<ValidationError | null>;
    /**
     * * JSON of things like:
     * -- disabled
     * -- id="something"
     * -- type="text || email || password || whatever"
     * -- class='input class'
     * -- title='input title'
     * -- multiple
     * -- etc.
     */
    attributes: object;
    hint?: string;
    group?: FieldGroup;
    step?: FieldStep;
    clearValue: () => void;
    clearErrors: () => void;
    clear: () => void;
}
