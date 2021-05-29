import { Writable } from "svelte/store";
import { Form } from "./Form";
import { ValidationCallback } from "./internal";
declare type FormDictionary = Array<Form<any>>;
/**
 * Base interface for managing multiple instances of Form
 * classes.
 *
 * @TODO Class for FormGroup and FormStepper
 */
export declare class FormManager {
    #private;
    constructor(forms: FormDictionary, props?: Partial<FormManager>);
    /** Collection of Forms */
    forms: FormDictionary;
    loading: Writable<boolean>;
    all_value_changes: Writable<Record<string, any>>;
    all_valid: Writable<boolean>;
    any_changed: Writable<boolean>;
    all_pristine: Writable<boolean>;
    /** Validate a given form, a number of forms, or all forms */
    validateAll: (callbacks?: ValidationCallback[] | undefined, form_indexes?: number[] | undefined) => void;
    destroy: () => void;
    resetAll: () => void;
}
/**
 * Collection of Forms used as steps.
 * @example a data collection wizard with many fields or whatever
 */
export declare class FormStepper extends FormManager {
    constructor(forms: FormDictionary, props?: Partial<FormManager>);
    active_step: keyof FormDictionary;
    next: () => void;
    back: () => void;
}
/**
 * Group of Forms which extends the FormManager functionality.
 */
export declare class FormGroup extends FormManager {
    constructor(forms: FormDictionary, props?: Partial<FormManager>);
}
export {};
