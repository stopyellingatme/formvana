import { SvelteComponent } from "svelte";
import { Writable } from "svelte/store";
import { SvelteComponentDev } from "svelte/internal";
import { SvelteComponent as SvelteComponent$0 } from "svelte/internal";
/**
 * ---------------------------------------------------------------------------
 *
 * *** Data Shapes (Types) ***
 *
 * Will write later. Files delted and source control didnt catch.
 *
 * ---------------------------------------------------------------------------
 */
// #region Validation
/** Using "when" gives us a little more flexibilty. */
interface ValidationCallback {
    callback: Callback;
    /**
     * When should the callback fire?
     * "before" or "after" validation?
     */
    when: "before" | "after";
}
/** Pretty much any funciton as long as it returns a Promise with
 * Validation Error array.
 *
 * @TODO This needs work.
 */
type ValidatorFunction = (...args: any[]) => Promise<ValidationError[]>;
/**
 * All constructor values are optional so we can create a blank Validation
 * Error object, for whatever reason.
 */
declare class ValidationError {
    constructor(field_property_key?: string, errors?: {
        [type: string]: string;
    }, extra_data?: Record<string, any>);
    field_key?: string;
    field_value?: any;
    errors?: {
        [error_type: string]: string;
    };
}
/** Form Validation Options  */
interface ValidationOptions {
    /**
     * PLEASE PASS IN A VALIDATOR FUNCTION! (if you want validation)
     *
     * This is the (validation) function that will be called when validating.
     * You can use any validation library you like, as long as this function
     * returns Promise<ValidationError[]>
     */
    validator: ValidatorFunction;
    /**
     * THIS IS THE SECOND PARAMETER BEING PASSED TO THE VALIDATOR FUNCTION.
     * The other is form.model.
     *
     * This makes using other validation libraries easier.
     * See the examples for more details.
     */
    options?: Record<string, any> | Object;
    // /**
    //  * Optional field layout, if you aren't using a class object.
    //  * "no-class" method of building the fields.
    //  */
    // field_schema?: Record<string, Partial<FieldConfig<Object>>>;
    /**
     * Which events should the form do things on?
     * @examples validate, link values, hide/disable fields, callbacks
     */
    // on_events: OnEvents<HTMLElementEventMap>;
    /** When to link this.field values to this.model values */
    when_link_fields_to_model?: LinkOnEvent;
}
//#endregion
// #region Events
declare class OnEvents<T extends HTMLElementEventMap> {
    /**
     * Determines which events to validate on.
     * You can insert event listeners just by adding a [string]: boolean
     * to the constructor's init object.
     * Enabled By Default: blur, change, focus, input, submit
     */
    constructor(init?: Partial<OnEvents<T>>, disableAll?: boolean);
    /** On each keystroke */
    aggressive: boolean;
    /** Essentially on blur */
    lazy: boolean;
    /** On form submission */
    passive: boolean;
    /**
     * @TODO Create easy mechanism for using "eager" validation.
     *
     * First, use passive.
     * If invalid, use aggressive validation.
     * When valid, use passive again.
     */
    eager: boolean;
    blur: boolean;
    change: boolean;
    click: boolean;
    dblclick: boolean;
    focus: boolean;
    input: boolean;
    keydown: boolean;
    keypress: boolean;
    keyup: boolean;
    mount: boolean;
    mousedown: boolean;
    mouseenter: boolean;
    mouseleave: boolean;
    mousemove: boolean;
    mouseout: boolean;
    mouseover: boolean;
    mouseup: boolean;
    submit: boolean;
}
/**
 * Should we link the values always?
 * Or only if the form is valid?
 */
type LinkOnEvent = "always" | "valid";
type LinkValuesOnEvent = "all" | "field";
//#endregion
// #region Misc
type FieldNode<T extends Object> = (HTMLInputElement | (HTMLElement & {
    type: string;
}) | HTMLSelectElement | HTMLTextAreaElement) & {
    name: keyof T;
};
type ElementEvent = InputEvent & {
    target: {
        value: any;
        checked: boolean;
    };
};
type FormFieldSchema = Record<string, Partial<FieldConfig<Object>>>;
/**
 * Keeping it simple. Just keep up with model and errors.
 */
type InitialFormState<ModelType extends Object> = {
    model: ModelType | Object | undefined;
    errors: ValidationError[] | undefined;
};
/**
 * Data format for the reference data items
 * Form.refs are of type Record<string, RefDataItem[]>
 */
interface RefDataItem {
    label: string;
    value: any;
    meta?: any;
}
/** Helpful shape for loading in reference data for the Form */
type RefData = Record<string, RefDataItem[]>;
/** This gives us a pretty exhaustive typesafe map of element attributes */
type FieldAttributes = Record<ElementAttributesMap & string, any>;
type ElementAttributesMap = keyof HTMLElement | keyof HTMLInputElement | keyof HTMLSelectElement | keyof HTMLFieldSetElement | keyof HTMLImageElement | keyof HTMLButtonElement | keyof HTMLCanvasElement | keyof HTMLOptionElement | keyof AriaAttributes;
/** Catchall type for giving callbacks a bit more typesafety */
type Callback = ((...args: any[]) => any) | (() => any) | void | undefined | boolean | string | Promise<any>;
/**
 * All the WAI-ARIA 1.1 attributes from https://www.w3.org/TR/wai-aria-1.1/
 * This is here because there is no AriaAttrubutes type in the default library.
 */
interface AriaAttributes {
    /** Identifies the currently active element when DOM focus is on a composite widget, textbox, group, or application. */
    "aria-activedescendant"?: string;
    /** Indicates whether assistive technologies will present all, or only parts of, the changed region based on the change notifications defined by the aria-relevant attribute. */
    "aria-atomic"?: boolean | "false" | "true";
    /**
     * Indicates whether inputting text could trigger display of one or more predictions of the user's intended value for an input and specifies how predictions would be
     * presented if they are made.
     */
    "aria-autocomplete"?: "none" | "inline" | "list" | "both";
    /** Indicates an element is being modified and that assistive technologies MAY want to wait until the modifications are complete before exposing them to the user. */
    "aria-busy"?: boolean | "false" | "true";
    /**
     * Indicates the current "checked" state of checkboxes, radio buttons, and other widgets.
     * @see aria-pressed @see aria-selected.
     */
    "aria-checked"?: boolean | "false" | "mixed" | "true";
    /**
     * Defines the total number of columns in a table, grid, or treegrid.
     * @see aria-colindex.
     */
    "aria-colcount"?: number;
    /**
     * Defines an element's column index or position with respect to the total number of columns within a table, grid, or treegrid.
     * @see aria-colcount @see aria-colspan.
     */
    "aria-colindex"?: number;
    /**
     * Defines the number of columns spanned by a cell or gridcell within a table, grid, or treegrid.
     * @see aria-colindex @see aria-rowspan.
     */
    "aria-colspan"?: number;
    /**
     * Identifies the element (or elements) whose contents or presence are controlled by the current element.
     * @see aria-owns.
     */
    "aria-controls"?: string;
    /** Indicates the element that represents the current item within a container or set of related elements. */
    "aria-current"?: boolean | "false" | "true" | "page" | "step" | "location" | "date" | "time";
    /**
     * Identifies the element (or elements) that describes the object.
     * @see aria-labelledby
     */
    "aria-describedby"?: string;
    /**
     * Identifies the element that provides a detailed, extended description for the object.
     * @see aria-describedby.
     */
    "aria-details"?: string;
    /**
     * Indicates that the element is perceivable but disabled, so it is not editable or otherwise operable.
     * @see aria-hidden @see aria-readonly.
     */
    "aria-disabled"?: boolean | "false" | "true";
    /**
     * Indicates what functions can be performed when a dragged object is released on the drop target.
     * @deprecated in ARIA 1.1
     */
    "aria-dropeffect"?: "none" | "copy" | "execute" | "link" | "move" | "popup";
    /**
     * Identifies the element that provides an error message for the object.
     * @see aria-invalid @see aria-describedby.
     */
    "aria-errormessage"?: string;
    /** Indicates whether the element, or another grouping element it controls, is currently expanded or collapsed. */
    "aria-expanded"?: boolean | "false" | "true";
    /**
     * Identifies the next element (or elements) in an alternate reading order of content which, at the user's discretion,
     * allows assistive technology to override the general default of reading in document source order.
     */
    "aria-flowto"?: string;
    /**
     * Indicates an element's "grabbed" state in a drag-and-drop operation.
     * @deprecated in ARIA 1.1
     */
    "aria-grabbed"?: boolean | "false" | "true";
    /** Indicates the availability and type of interactive popup element, such as menu or dialog, that can be triggered by an element. */
    "aria-haspopup"?: boolean | "false" | "true" | "menu" | "listbox" | "tree" | "grid" | "dialog";
    /**
     * Indicates whether the element is exposed to an accessibility API.
     * @see aria-disabled.
     */
    "aria-hidden"?: boolean | "false" | "true";
    /**
     * Indicates the entered value does not conform to the format expected by the application.
     * @see aria-errormessage.
     */
    "aria-invalid"?: boolean | "false" | "true" | "grammar" | "spelling";
    /** Indicates keyboard shortcuts that an author has implemented to activate or give focus to an element. */
    "aria-keyshortcuts"?: string;
    /**
     * Defines a string value that labels the current element.
     * @see aria-labelledby.
     */
    "aria-label"?: string;
    /**
     * Identifies the element (or elements) that labels the current element.
     * @see aria-describedby.
     */
    "aria-labelledby"?: string;
    /** Defines the hierarchical level of an element within a structure. */
    "aria-level"?: number;
    /** Indicates that an element will be updated, and describes the types of updates the user agents, assistive technologies, and user can expect from the live region. */
    "aria-live"?: "off" | "assertive" | "polite";
    /** Indicates whether an element is modal when displayed. */
    "aria-modal"?: boolean | "false" | "true";
    /** Indicates whether a text box accepts multiple lines of input or only a single line. */
    "aria-multiline"?: boolean | "false" | "true";
    /** Indicates that the user may select more than one item from the current selectable descendants. */
    "aria-multiselectable"?: boolean | "false" | "true";
    /** Indicates whether the element's orientation is horizontal, vertical, or unknown/ambiguous. */
    "aria-orientation"?: "horizontal" | "vertical";
    /**
     * Identifies an element (or elements) in order to define a visual, functional, or contextual parent/child relationship
     * between DOM elements where the DOM hierarchy cannot be used to represent the relationship.
     * @see aria-controls.
     */
    "aria-owns"?: string;
    /**
     * Defines a short hint (a word or short phrase) intended to aid the user with data entry when the control has no value.
     * A hint could be a sample value or a brief description of the expected format.
     */
    "aria-placeholder"?: string;
    /**
     * Defines an element's number or position in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
     * @see aria-setsize.
     */
    "aria-posinset"?: number;
    /**
     * Indicates the current "pressed" state of toggle buttons.
     * @see aria-checked @see aria-selected.
     */
    "aria-pressed"?: boolean | "false" | "mixed" | "true";
    /**
     * Indicates that the element is not editable, but is otherwise operable.
     * @see aria-disabled.
     */
    "aria-readonly"?: boolean | "false" | "true";
    /**
     * Indicates what notifications the user agent will trigger when the accessibility tree within a live region is modified.
     * @see aria-atomic.
     */
    "aria-relevant"?: "additions" | "additions removals" | "additions text" | "all" | "removals" | "removals additions" | "removals text" | "text" | "text additions" | "text removals";
    /** Indicates that user input is required on the element before a form may be submitted. */
    "aria-required"?: boolean | "false" | "true";
    /** Defines a human-readable, author-localized description for the role of an element. */
    "aria-roledescription"?: string;
    /**
     * Defines the total number of rows in a table, grid, or treegrid.
     * @see aria-rowindex.
     */
    "aria-rowcount"?: number;
    /**
     * Defines an element's row index or position with respect to the total number of rows within a table, grid, or treegrid.
     * @see aria-rowcount @see aria-rowspan.
     */
    "aria-rowindex"?: number;
    /**
     * Defines the number of rows spanned by a cell or gridcell within a table, grid, or treegrid.
     * @see aria-rowindex @see aria-colspan.
     */
    "aria-rowspan"?: number;
    /**
     * Indicates the current "selected" state of various widgets.
     * @see aria-checked @see aria-pressed.
     */
    "aria-selected"?: boolean | "false" | "true";
    /**
     * Defines the number of items in the current set of listitems or treeitems. Not required if all elements in the set are present in the DOM.
     * @see aria-posinset.
     */
    "aria-setsize"?: number;
    /** Indicates if items in a table or grid are sorted in ascending or descending order. */
    "aria-sort"?: "none" | "ascending" | "descending" | "other";
    /** Defines the maximum allowed value for a range widget. */
    "aria-valuemax"?: number;
    /** Defines the minimum allowed value for a range widget. */
    "aria-valuemin"?: number;
    /**
     * Defines the current value for a range widget.
     * @see aria-valuetext.
     */
    "aria-valuenow"?: number;
    /** Defines the human readable text alternative of aria-valuenow for a range widget. */
    "aria-valuetext"?: string;
}
/**
 * FieldConfig is used to help with the form auto generation functionality.
 *
 * This is not meant to be a complete HTML Input/Select/etc replacement.
 * It is simply a vehicle to help give the form generator
 * an easy-to-use format to work with.
 */
declare class FieldConfig<T extends Object> {
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
     * @example attributes["type"] get's set here.
     *
     * You also have the option to use a plain Object, for extra flexibility.
     *
     * @example attrubutes["description"] is ok without being a FieldAttribute
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
type FieldDictionary = Array<FieldConfig<Object>>;
declare class FieldStepper {
    constructor(fields: FieldDictionary, active_index?: keyof FieldDictionary);
    fields: FieldDictionary;
    active_step: keyof FieldDictionary | undefined;
    get fields_valid(): Writable<boolean>;
}
/**
 * @Recomended_Use
 *  - Initialize let form = new Form(model, {refs: REFS, template: TEMPLATE, etc.})
 *  - Set the model (if you didn't in the first step)
 *  - Attach reference data (if you didn't in the first step)
 *  - Storify the form - check example.form.ts for an example
 *  - Now you're ready to use the form!
 *  - Pass it into the DynamicForm component and let the form generate itself!
 *
 * Performance is blazing with < 500 fields.
 * Can render up to 2000 inputs in per class/fields, not recommended.
 * Just break it up into 100 or so fields per form (max 250) if its a huge form.
 * Use one of the Form Manager interfaces if applicable.
 *  - Tested on late 2014 mbp - 2.5ghz core i7, 16gb ram
 *
 * @TODO Time to redo the readme.md file! Lots have changed since then!
 *
 * @TODO Create easy component/pattern for field groups and stepper/wizzard
 *
 * @TODO Do the stepper example and clean up the Form Manager interface
 * @TODO Add more data type parsers (Object, etc.)
 * @TODO Add several plain html/css examples (without tailwind)
 *
 * @TODO Might want to add a debug mode to inspect event listeners and stuff
 *
 */
/**
 * ---------------------------------------------------------------------------
 * Formvana Form Class
 *
 * Main Concept: fields and model are separate.
 * Fields are built using the model, via the @field() decorator.
 * We keep the fields and the model in sync via your model property names
 * and field[name].
 *
 * Form is NOT valid, initially.
 *
 * Functions are camelCase.
 * Variables and stores are snake_case.
 * Everyone will love it.
 *
 * ---------------------------------------------------------------------------
 */
declare class Form<ModelType extends Object> {
    #private;
    constructor(model: ModelType, validation_options?: Partial<ValidationOptions>, form_properties?: Partial<Form<ModelType>>);
    //#region ** Fields **
    /**
     * HTML Node of form object.
     */
    node?: HTMLFormElement;
    /**
     * This is your form Model/Schema.
     * Used to build the form.fields.
     */
    model: ModelType;
    /**
     * Fields are built using model's reflection metadata.
     * Or using an array of field configuration objects.
     */
    fields: Array<FieldConfig<ModelType>>;
    /**
     * Errors are attached to their corresponding fields.
     * This pattern adds flexibility at the cost of a little complexity and object size.
     *
     * When a single field is validated, the whole model is validated (if
     * using class-validator).
     * We just don't show all the errors to the user.
     * This way, we know if the form is still invalid, even if we aren't
     * showing the user any errors (like, pre-submit-button press).
     */
    errors: ValidationError[];
    /**
     * validation_options contains the logic and configuration for
     * validating the form as well as linking errors to fields.
     */
    validation_options: ValidationOptions;
    /** Which events should the form dispatch side effects? */
    on_events: OnEvents<HTMLElementEventMap>;
    /** Is the form valid? */
    valid: Writable<boolean>;
    /** Has the form state changed from it's initial value? */
    changed: Writable<boolean>;
    /** Has the form been altered in any way? */
    pristine: Writable<boolean>;
    /** Is the form loading? */
    loading: Writable<boolean>;
    /**
     * Form Template Layout
     *
     * Render the form into a custom svelte template!
     * Use a svelte component. Or use a string as the selector.
     * * The template/component must accept {form} prop
     *
     * Note: add ` types": ["svelte"] ` to tsconfig compilerOptions
     * to remove TS import error of .svelte files (for your template)
     */
    template?: string | typeof SvelteComponentDev | typeof SvelteComponent$0 | typeof SvelteComponent$0;
    /**
     * Optional field layout, if you aren't using a class object.
     * "no-class" method of building the fields.
     */
    field_schema?: FormFieldSchema;
    /**
     * refs hold any reference data you'll be using in the form
     *
     * Call attachRefData() to link reference data to form or pass it
     * via the constrictor.
     *
     * Fields & reference data are linked via field.ref_key
     *
     * * Format:
     * * Record<[ref_key]: string, Array<{[label]: string, [value]: any, [data]?: any}>>
     *
     * @UseCase seclet dropdowns, radio buttons, etc.
     */
    refs?: RefData;
    /**
     * Emits value changes as a plain JS object.
     * Format: { [field.name]: value }
     *
     * Similar to Angular form.valueChanges
     */
    value_changes: Writable<Record<keyof ModelType | any, ModelType[keyof ModelType]>>;
    /**
     * This is the model's initial state.
     * It's only initial model and errors.
     * We're keeping this simple.
     */
    initial_state: InitialFormState<ModelType>;
    /** Use the NAME of the field (field.name) to disable/hide the field. */
    hidden_fields?: Array<keyof ModelType>;
    /** Use the NAME of the field (field.name) to disable/hide the field. */
    disabled_fields?: Array<keyof ModelType>;
    /**
     * Any extra data you may want to pass around.
     * @examples description, name, type, header, label, classes, etc.
     *
     * * If you're using the field.for_form propery, set form name here.
     */
    meta?: Record<string, string | number | boolean | Object>;
    //#endregion ^^ Fields ^^
    // #region ** Form API **
    // #region - Form Setup
    /**
     * Builds the fields from the model.
     * Builds the field configs via this.model using metadata-reflection.
     * Or via validation_options.field_shcema
     */
    buildFields: (model?: ModelType) => void;
    /**
     * * useForm
     *
     * Create a function that takes a form node and sets up all the fields
     * with names attached.
     * This will also allow for easy mechanism to attach errors in a
     * plug-and-play manner.
     *
     * Also allows for a better single source of truth for data input.
     */
    useForm: (node: HTMLFormElement) => void;
    //#endregion
    // #region - Validation
    /**
     * Validate the form!
     * You can pass in callbacks as needed.
     * Callbacks can be called "before" or "after" validation.
     */
    validate: (callbacks?: ValidationCallback[] | undefined) => Promise<ValidationError[]> | undefined;
    /** If want to (in)validate a specific field for any reason */
    validateField: (field_name: keyof ModelType, with_message?: string | undefined, callbacks?: ValidationCallback[] | undefined) => void;
    /**
     * Attach a callback to a field or array of fields.
     * If the callback if type ValidationCallback it will be added
     * to the validation handler
     */
    attachCallbacks: (event: keyof HTMLElementEventMap, callback: Callback | ValidationCallback, field_names: keyof ModelType | Array<keyof ModelType>) => void;
    /** Clear ALL the errors. */
    clearErrors: () => void;
    //#endregion
    // #region - Utility Methods
    /** Get Field by name */
    get: <T extends ModelType>(field_name: keyof T) => FieldConfig<T>;
    /**
     * Load new data into the form and build the fields.
     * Data is updated IN PLACE by default.
     * Reinitialize is set to false, by default.
     *
     * Inital State is not updated by default.
     */
    loadModel: <T extends ModelType>(model: T, reinitialize?: boolean, update_initial_state?: boolean) => Form<ModelType>;
    /**
     * Set the value for a field or set of fields.
     * Sets both field.value and model value.
     */
    setValue: (field_names: Array<keyof ModelType> | keyof ModelType, value: any) => void;
    /**
     * Pass in the reference data to add options to fields.
     */
    attachRefData: (refs?: RefData | undefined) => void;
    /**
     *! Make sure to call this when the component is unloaded/destroyed
     * Removes all event listeners and clears the form state.
     */
    destroy: () => void;
    //#endregion
    // #region - Form State
    /**
     * Resets to the inital state of the form.
     *
     * Only model and errors are saved in initial state.
     */
    reset: () => void;
    /** Well, this updates the initial state of the form. */
    updateInitialState: () => void;
    //#endregion
    // #region - Layout
    /**
     * Set the field order.
     * Layout param is simply an array of field (or group)
     * names in the order to be displayed.
     * Leftover fields are appended to bottom of form.
     */
    setFieldOrder: (order: Array<keyof ModelType>) => void;
    /**
     * Set attributes on a given set of fields.
     *
     * @exapmle to hide several fields:
     * names = [field.name, field.name],
     * attributes = { hidden: true };
     */
    setFieldAttributes: (names: string | Array<keyof ModelType>, attributes: Partial<FieldConfig<ModelType>>) => void;
}
declare function field<T extends Object>(config: Partial<FieldConfig<T>>): (target: any, propertyKey: string) => void;
type FormDictionary = Array<Form<any>>;
/**
 * Base interface for managing multiple instances of Form
 * classes.
 *
 * @TODO Class for FormGroup and FormStepper
 */
declare class FormManager {
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
 * @example a data collection wizard with many fields or whatever
 */
declare class FormStepper extends FormManager {
    constructor(forms: FormDictionary, props?: Partial<FormManager>);
    active_step: Writable<keyof FormDictionary>;
    nextStep: () => void;
    backStep: () => void;
}
/**
 * Group of Forms which extends the FormManager functionality.
 */
declare class FormGroup extends FormManager {
    constructor(forms: FormDictionary, props?: Partial<FormManager>);
}
export { FieldConfig, FieldStepper, Form, field, ValidationCallback, ValidatorFunction, ValidationError, ValidationOptions, OnEvents, LinkOnEvent, LinkValuesOnEvent, FieldNode, ElementEvent, FormFieldSchema, InitialFormState, RefDataItem, RefData, FieldAttributes, ElementAttributesMap, Callback, FormManager, FormStepper, FormGroup };
