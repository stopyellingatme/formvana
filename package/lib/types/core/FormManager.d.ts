import { Writable } from "svelte/store";
import { Form } from "./Form";
declare type FormDictionary = Array<Form<any>>;
/**
 * Base interface for managing multiple instances of Form
 * classes.
 *
 * @TODO Class for FormGroup and FormStepper
 */
export declare class FormManager {
    constructor(forms: FormDictionary, props?: Partial<FormManager>);
    /** Collection of Forms */
    forms: FormDictionary;
    loading: Writable<boolean>;
    /**
     * @TODO Add a all_value_changes merged store
     */
    get all_value_changes(): Writable<Object>;
    /** Are all of the forms valid? */
    get all_valid(): Writable<boolean>;
    get all_changed(): Writable<boolean>;
    get all_pristine(): Writable<boolean>;
    /** Get the Form given the identifier */
    getForm: (form_index: keyof FormDictionary) => number | Form<any> | (() => string) | (() => string) | {
        (...items: ConcatArray<Form<any>>[]): Form<any>[];
        (...items: (Form<any> | ConcatArray<Form<any>>)[]): Form<any>[];
    } | ((searchElement: Form<any>, fromIndex?: number | undefined) => number) | ((searchElement: Form<any>, fromIndex?: number | undefined) => number) | ((start?: number | undefined, end?: number | undefined) => Form<any>[]) | ((searchElement: Form<any>, fromIndex?: number | undefined) => boolean) | ((...items: Form<any>[]) => number) | (() => Form<any>[]) | (<U>(callbackfn: (value: Form<any>, index: number, array: Form<any>[]) => U, thisArg?: any) => U[]) | {
        <S extends Form<any>>(callbackfn: (value: Form<any>, index: number, array: Form<any>[]) => value is S, thisArg?: any): S[];
        (callbackfn: (value: Form<any>, index: number, array: Form<any>[]) => unknown, thisArg?: any): Form<any>[];
    } | (() => Form<any> | undefined) | ((separator?: string | undefined) => string) | (() => Form<any> | undefined) | ((compareFn?: ((a: Form<any>, b: Form<any>) => number) | undefined) => FormDictionary) | {
        (start: number, deleteCount?: number | undefined): Form<any>[];
        (start: number, deleteCount: number, ...items: Form<any>[]): Form<any>[];
    } | ((...items: Form<any>[]) => number) | ((callbackfn: (value: Form<any>, index: number, array: Form<any>[]) => unknown, thisArg?: any) => boolean) | ((callbackfn: (value: Form<any>, index: number, array: Form<any>[]) => unknown, thisArg?: any) => boolean) | ((callbackfn: (value: Form<any>, index: number, array: Form<any>[]) => void, thisArg?: any) => void) | {
        (callbackfn: (previousValue: Form<any>, currentValue: Form<any>, currentIndex: number, array: Form<any>[]) => Form<any>): Form<any>;
        (callbackfn: (previousValue: Form<any>, currentValue: Form<any>, currentIndex: number, array: Form<any>[]) => Form<any>, initialValue: Form<any>): Form<any>;
        <U_1>(callbackfn: (previousValue: U_1, currentValue: Form<any>, currentIndex: number, array: Form<any>[]) => U_1, initialValue: U_1): U_1;
    } | {
        (callbackfn: (previousValue: Form<any>, currentValue: Form<any>, currentIndex: number, array: Form<any>[]) => Form<any>): Form<any>;
        (callbackfn: (previousValue: Form<any>, currentValue: Form<any>, currentIndex: number, array: Form<any>[]) => Form<any>, initialValue: Form<any>): Form<any>;
        <U_2>(callbackfn: (previousValue: U_2, currentValue: Form<any>, currentIndex: number, array: Form<any>[]) => U_2, initialValue: U_2): U_2;
    } | {
        <S_1 extends Form<any>>(predicate: (this: void, value: Form<any>, index: number, obj: Form<any>[]) => value is S_1, thisArg?: any): S_1 | undefined;
        (predicate: (value: Form<any>, index: number, obj: Form<any>[]) => unknown, thisArg?: any): Form<any> | undefined;
    } | ((predicate: (value: Form<any>, index: number, obj: Form<any>[]) => unknown, thisArg?: any) => number) | ((value: Form<any>, start?: number | undefined, end?: number | undefined) => FormDictionary) | ((target: number, start: number, end?: number | undefined) => FormDictionary) | (() => IterableIterator<[number, Form<any>]>) | (() => IterableIterator<number>) | (() => IterableIterator<Form<any>>) | (<U_3, This = undefined>(callback: (this: This, value: Form<any>, index: number, array: Form<any>[]) => U_3 | readonly U_3[], thisArg?: This | undefined) => U_3[]) | (<A, D extends number = 1>(this: A, depth?: D | undefined) => FlatArray<A, D>[]);
    /** Validate a given form, a number of forms, or all forms */
    validateAll: (form_indexes?: number[] | undefined) => void;
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
