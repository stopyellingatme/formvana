import { Writable } from "svelte/store";
import { Form } from "./Form";
import { ValidationCallback } from "./Types";
/**
 * ---------------------------------------------------------------------------
 *
 * Multi-Form Management Helpers
 *
 * These interfaces/classes are meant to aid when using multiple Form objects.
 * Such as when several forms need to be grouped together or made into a
 * stepper/wizard.
 *
 * Classes are below the FormManager interface.
 *
 * ---------------------------------------------------------------------------
 */
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
    _subscriptions: any[];
    /** Validate a given form, a number of forms, or all forms */
    validateAll: (callbacks?: ValidationCallback[] | undefined, form_indexes?: number[] | undefined) => void;
    destroy: () => void;
    destroySubscriptions: () => void;
    resetAll: () => void;
}
/**
 * Collection of Forms used as steps.
 * @example a data collection wizard with many fields
 */
export declare class FormStepper extends FormManager {
    constructor(forms: FormDictionary, props?: Partial<FormManager>);
    /** What step are we on currently? */
    active_step: Writable<keyof FormDictionary>;
    /**
     * You can attach data to each step of the stepper.
     *
     * In the example below step #0 has a title, description and instructions.
     * @example { 0: {title: string, description: string, instructions: string} }
     */
    step_data?: Record<keyof FormDictionary, Object | string>;
    /** Set active step index ++1 */
    nextStep: () => void;
    /** Set active step index --1 */
    backStep: () => void;
}
/**
 * Group of Forms which extends the FormManager functionality.
 */
export declare class FormGroup extends FormManager {
    constructor(forms: FormDictionary, props?: Partial<FormManager>);
}
export {};
