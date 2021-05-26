import { Writable } from "svelte/store";
import { Form } from "./Form";
declare type FormDictionary = Array<Form<Object>>;
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
    /** Are all of the forms valid? */
    get all_valid(): Writable<boolean>;
    get all_changed(): Writable<boolean>;
    get all_pristine(): Writable<boolean>;
    /** Get the Form given the identifier */
    get: (form_index: keyof FormDictionary) => number | Form<Object> | (() => string) | (() => string) | {
        (...items: ConcatArray<Form<Object>>[]): Form<Object>[];
        (...items: (Form<Object> | ConcatArray<Form<Object>>)[]): Form<Object>[];
    } | ((searchElement: Form<Object>, fromIndex?: number | undefined) => number) | ((searchElement: Form<Object>, fromIndex?: number | undefined) => number) | ((start?: number | undefined, end?: number | undefined) => Form<Object>[]) | ((searchElement: Form<Object>, fromIndex?: number | undefined) => boolean) | ((...items: Form<Object>[]) => number) | (() => Form<Object>[]) | (<U>(callbackfn: (value: Form<Object>, index: number, array: Form<Object>[]) => U, thisArg?: any) => U[]) | {
        <S extends Form<Object>>(callbackfn: (value: Form<Object>, index: number, array: Form<Object>[]) => value is S, thisArg?: any): S[];
        (callbackfn: (value: Form<Object>, index: number, array: Form<Object>[]) => unknown, thisArg?: any): Form<Object>[];
    } | (() => Form<Object> | undefined) | ((separator?: string | undefined) => string) | (() => Form<Object> | undefined) | ((compareFn?: ((a: Form<Object>, b: Form<Object>) => number) | undefined) => FormDictionary) | {
        (start: number, deleteCount?: number | undefined): Form<Object>[];
        (start: number, deleteCount: number, ...items: Form<Object>[]): Form<Object>[];
    } | ((...items: Form<Object>[]) => number) | ((callbackfn: (value: Form<Object>, index: number, array: Form<Object>[]) => unknown, thisArg?: any) => boolean) | ((callbackfn: (value: Form<Object>, index: number, array: Form<Object>[]) => unknown, thisArg?: any) => boolean) | ((callbackfn: (value: Form<Object>, index: number, array: Form<Object>[]) => void, thisArg?: any) => void) | {
        (callbackfn: (previousValue: Form<Object>, currentValue: Form<Object>, currentIndex: number, array: Form<Object>[]) => Form<Object>): Form<Object>;
        (callbackfn: (previousValue: Form<Object>, currentValue: Form<Object>, currentIndex: number, array: Form<Object>[]) => Form<Object>, initialValue: Form<Object>): Form<Object>;
        <U_1>(callbackfn: (previousValue: U_1, currentValue: Form<Object>, currentIndex: number, array: Form<Object>[]) => U_1, initialValue: U_1): U_1;
    } | {
        (callbackfn: (previousValue: Form<Object>, currentValue: Form<Object>, currentIndex: number, array: Form<Object>[]) => Form<Object>): Form<Object>;
        (callbackfn: (previousValue: Form<Object>, currentValue: Form<Object>, currentIndex: number, array: Form<Object>[]) => Form<Object>, initialValue: Form<Object>): Form<Object>;
        <U_2>(callbackfn: (previousValue: U_2, currentValue: Form<Object>, currentIndex: number, array: Form<Object>[]) => U_2, initialValue: U_2): U_2;
    } | {
        <S_1 extends Form<Object>>(predicate: (this: void, value: Form<Object>, index: number, obj: Form<Object>[]) => value is S_1, thisArg?: any): S_1 | undefined;
        (predicate: (value: Form<Object>, index: number, obj: Form<Object>[]) => unknown, thisArg?: any): Form<Object> | undefined;
    } | ((predicate: (value: Form<Object>, index: number, obj: Form<Object>[]) => unknown, thisArg?: any) => number) | ((value: Form<Object>, start?: number | undefined, end?: number | undefined) => FormDictionary) | ((target: number, start: number, end?: number | undefined) => FormDictionary) | (() => IterableIterator<[number, Form<Object>]>) | (() => IterableIterator<number>) | (() => IterableIterator<Form<Object>>) | (<U_3, This = undefined>(callback: (this: This, value: Form<Object>, index: number, array: Form<Object>[]) => U_3 | readonly U_3[], thisArg?: This | undefined) => U_3[]) | (<A, D extends number = 1>(this: A, depth?: D | undefined) => FlatArray<A, D>[]);
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
