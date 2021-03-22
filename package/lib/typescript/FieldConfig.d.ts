import { ValidationError } from "class-validator/types";
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
 * This is not meant to be a complete HTML input replacement.
 * It is simply a vehicle to help give the form generator
 * a standard-ish format to work with.
 */
export declare class FieldConfig {
    constructor(init?: Partial<FieldConfig>);
    name: string;
    node: HTMLElement;
    el: string;
    type: string;
    label: string;
    classname: string;
    required: boolean;
    value: Writable<any>;
    /**
     * Used if there is a set of "options" to choose from.
     */
    options?: any[];
    ref_key?: string;
    hint?: string;
    group?: FieldGroup;
    step?: FieldStep;
    /**
     * * JSON of things like:
     * -- type="text || email || password || whatever"
     * -- class='input class'
     * -- disabled
     * -- title='input title'
     * -- etc.
     */
    attributes: object;
    /**
     * Validation Errors!
     * We're mainly looking for the class-validator "constraints"
     * One ValidationError object can have multiple errors (constraints)
     */
    errors: Writable<ValidationError>;
    clearValue: () => void;
    clearErrors: () => void;
    clear: () => void;
}
