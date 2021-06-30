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
 * Error object, for whatever reason we need.
 * The error.field_key links to it's corresponding field.name
 */
declare class ValidationError {
    constructor(field_name?: string, errors?: {
        [type: string]: string;
    }, extra_data?: Record<string, any>);
    field_key?: string;
    field_value?: any;
    errors?: {
        [error_type: string]: string;
    };
}
/** Form Validation Options  */
interface ValidationProperties<ModelType extends Object> {
    /**
     * This is the (validation) function that will be called when validating.
     * You can use any validation library you like, as long as this function
     * takes the model and returns Promise<ValidationError[]>
     */
    validator: (model: ModelType, options?: Record<string, any> | Object) => Promise<ValidationError[]>;
    /**
     * THIS IS THE SECOND PARAMETER BEING PASSED TO THE VALIDATOR FUNCTION.
     * The other is form.model.
     *
     * This makes using other validation libraries easier.
     * See the examples for more details.
     */
    options?: Record<string, any> | Object;
    /**
     * How should the errors be displayed?
     */
    error_display: "constraint" | {
        dom: {
            type: "ul" | "ol" | "span";
            wrapper_classes?: string[];
            wrapper_styles?: string[];
            attributes?: string[];
            error_classes?: string[];
            error_styles?: string[];
        };
    } | "custom";
}
declare class ValidationProperties<ModelType extends Object> implements ValidationProperties<ModelType> {
    constructor(validator?: (model: ModelType, options?: Record<string, any> | Object) => Promise<ValidationError[]>, options?: Record<string, any> | Object, display?: ErrorDisplay, properties?: Partial<ValidationProperties<ModelType>>);
    /**
     * This is the (validation) function that will be called when validating.
     * You can use any validation library you like, as long as this function
     * takes the model and returns Promise<ValidationError[]>
     */
    validator: (model: ModelType, options?: Record<string, any> | Object) => Promise<ValidationError[]>;
    /**
     * THIS IS THE SECOND PARAMETER BEING PASSED TO THE VALIDATOR FUNCTION.
     * The other is form.model.
     *
     * This makes using other validation libraries easier.
     * See the examples for more details.
     */
    options?: Record<string, any> | Object;
    /**
     * How should the errors be displayed?
     */
    error_display: ErrorDisplay;
}
type ErrorDisplay = "constraint" | {
    dom: {
        type: "ul" | "ol" | "span";
        wrapper_classes?: string[];
        wrapper_styles?: string[];
        attributes?: string[];
        error_classes?: string[];
        error_styles?: string[];
    };
} | "custom";
//#endregion
// #region Events
/**
 * * Enabled By Default: blur, input, change, submit
 *
 * Determines which event listeners are added to each field.
 *
 * You can insert event listeners just by adding a [string]: boolean
 * to the constructor's init object.
 */
declare class OnEvents<T extends HTMLElementEventMap> {
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
    /**
     * Steps for using eager validation.
     *
     * 1. use passive until for is submitted.
     *  - Must detect if form has been submited.
     *
     * 2. If form is invalid, use aggressive until field is valid.
     *  - This is the hardest part.
     *
     * 3. When all valid, go back to passive validation.
     */
    input: boolean;
    change: boolean;
    submit: boolean;
    blur: boolean;
    focus: boolean;
    click: boolean;
    dblclick: boolean;
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
}
type LinkValuesOnEvent = "all" | "field";
//#endregion
// #region Misc
/**
 * If the user is passing in a plain json model, we use this data shape for
 * field configuration setup and layout.
 */
type FormFieldSchema = Record<string, Partial<FieldConfig<Object>>>;
type FieldNode<T extends Object> = (HTMLInputElement | HTMLFieldSetElement | HTMLButtonElement | HTMLSelectElement | HTMLTextAreaElement | HTMLOutputElement) & {
    name: keyof T;
    type: string;
};
type ElementEvent = InputEvent & {
    target: {
        value: any;
        checked: boolean;
    };
};
/**
 * These are the accepted data types used when processing
 * event.target.value output.
 */
type AcceptedDataType = "text" | "string" | "number" | "boolean" | "array" | "file" | "files" | "any";
/**
 * Keeping it simple. Just keep up with model and errors.
 */
type InitialFormState<ModelType extends Object> = {
    model: ModelType | Object | undefined;
    errors: ValidationError[] | undefined;
};
/**
 * Data format for the reference data items
 * Form.refs are of type Record<string, ReferenceDataItem[]>
 */
interface ReferenceDataItem {
    label: string;
    value: any;
    meta?: any;
}
/** Helpful shape for loading in reference data for the Form */
type ReferenceData = Record<string, ReferenceDataItem[]>;
/** This gives us a pretty exhaustive typesafe map of element attributes */
type FieldAttributes = Record<ElementAttributesMap & string, any>;
/** This provides solid type completion for field attributes */
type ElementAttributesMap = keyof HTMLElement | keyof HTMLInputElement | keyof HTMLSelectElement | keyof HTMLFieldSetElement | keyof HTMLImageElement | keyof HTMLOutputElement | keyof HTMLButtonElement | keyof HTMLCanvasElement | keyof HTMLOptionElement | keyof AriaAttributes;
/**
 * These are the types of form meta-data allowed.
 * If you would like something further, push it into the "object" field
 */
type FormMetaDataKeys = "for_form" | "description" | "header" | "label" | "classes" | "styles" | "object";
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
    data_type: AcceptedDataType;
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
    /** Linked to form.refs via ReferenceData[ref_key] */
    ref_key?: string;
    /** Used if there is a set of "options" to choose from. */
    options?: ReferenceDataItem[];
    /** Pretty self-explainitory, disable the field. */
    disabled?: boolean;
    /** Pretty self-explainitory, hide the field. */
    hidden?: boolean;
    /**
     * @TODO Add hooks for this when setting up field.
     *
     * Element.dataset hook, so you can do the really wild things!
     */
    data_set?: string[];
    /**
     * * If you set this, you must set form.for_form!
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
     *
     * @TODO No example for this yet.
     */
    validation_rules?: Object | any;
    /**
     * You may need to excude some event listeners.
     *
     * @example exclude blur and focus events for a checkbox
     */
    exclude_events?: Array<keyof OnEvents<HTMLElementEventMap>>;
    /**
     * You may need to excude some event listeners.
     *
     * @example exclude blur and focus events for a checkbox
     */
    include_events?: Array<keyof OnEvents<HTMLElementEventMap>>;
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
    emitEvent(event_name: keyof HTMLElementEventMap): boolean | undefined;
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
 * @TODO Add more superstruct examples for each form type (this should show how easy the template pattern really is)
 * @TODO Add that aggressive/lazy/passive validation thing.
 * @TODO Strip out all svelte (or as much as possible) and use vanilla variables
 *    instead of writable stores
 *
 * @TODO Add debug mode to inspect event listeners and form state snapshots
 *
 */
declare function newForm<ModelType extends Object>(model: ModelType, validation_options?: Partial<ValidationProperties<ModelType>>, form_properties?: Partial<Form<ModelType>>): Writable<Form<ModelType>>;
/**
 * ---------------------------------------------------------------------------
 * Formvana Form Class
 *
 * Main Concept: fields and model are separate.
 * Fields are built from the model, via the @field() decorator.
 * We keep the fields and the model in sync via model property names
 * and field[name].
 *
 * Form is NOT initially valid.
 *
 * Functions are camelCase.
 * Variables and stores are snake_case.
 * Everyone will love it.
 *
 * ---------------------------------------------------------------------------
 */
declare class Form<ModelType extends Object> {
    #private;
    constructor(model: ModelType, validation_options?: Partial<ValidationProperties<ModelType>> | Object, form_properties?: Partial<Form<ModelType>>);
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
     * This pattern adds flexibility at the cost of a little complexity and
     * object size.
     *
     * When a single field is validated, the whole model is validated (if
     * using class-validator).
     * We don't show all the errors to the user, only the field emmiting the
     * event.
     * This way, we know if the form is still invalid, even if we aren't
     * showing the user any errors (like, pre-submit-button press).
     */
    errors: ValidationError[];
    /**
     * validation_options contains the logic and configuration for
     * validating the form as well as linking errors to fields
     * and displaying the errors
     */
    validation_options?: ValidationProperties<ModelType>;
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
     * refs hold any reference data you'll be using in the form
     *
     * Call attachReferenceData() to link reference data to form or pass it
     * via the constrictor.
     *
     * Fields & reference data are linked via field.ref_key
     *
     * * Format:
     * * {[ref_key]: string, Array<{[label]: string, [value]: any, [data]?: any}>}
     *
     * @UseCase seclet dropdowns, radio buttons, etc.
     */
    refs?: ReferenceData;
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
     * This is the form's initial state.
     * It's only initial model and errors.
     * We're keeping this simple.
     */
    initial_state: InitialFormState<ModelType>;
    /**
     * Emits value changes as a plain JS object.
     * Format: { [field.name]: value }
     *
     * Very similar to Angular form.valueChanges
     */
    value_changes: Writable<Record<keyof ModelType | any, ModelType[keyof ModelType]>>;
    /**
     * Optional field layout, if you aren't using a class object.
     * "no-class" method of building the fields.
     */
    field_schema?: FormFieldSchema;
    /**
     * This allows you to filter fields based on a given form name.
     *
     * @example user model can be used for login and signup
     * @example for_form="login" && for_form="signup"
     */
    for_form?: string;
    /**
     * Any extra data you may want to pass around.
     * @examples description, name, type, header, label, classes, etc.
     */
    meta?: Record<string, any>;
    /** Use the NAME of the field (field.name) to disable/hide the field. */
    hidden_fields?: Array<keyof ModelType>;
    /** Use the NAME of the field (field.name) to disable/hide the field. */
    disabled_fields?: Array<keyof ModelType>;
    //#endregion ^^ Fields ^^
    // #region ** Form API **
    // #region - Form Setup
    /**
     * Builds the fields from the model.
     * Builds the field configs via this.model using metadata-reflection.
     * Or via form.field_shcema
     */
    buildFields: (model?: ModelType) => void;
    /**
     * * Required for form setup.
     *
     * ATTACH TO SAME ELEMENT AS FIELD.NAME {name}!
     * This hooks up the event listeners!
     *
     * Used to grab fields and attach event listeners to each field.
     * Simply loop over the model, checking the form's node
     * for each model[name]. If a field element is found, then
     * attach on_event listeners to the given field.
     *
     * This is for Svelte's "use:FUNCTION" feature.
     * The "use" directive passes the HTML Node as a parameter
     * to the given function (e.g. use:useField(node: HTMLElement)).
     */
    useForm: (node: HTMLFormElement) => void;
    /**
     * This is used to hook up event listeners to a field.
     *
     * You can also use this to add form controls to the Form class.
     * @example form control is outside of the form element so
     * use:useField is added to the element to hook enent listens into it,
     * same as all other controls inside the form element
     */
    useField: (node: FieldNode<ModelType>) => void;
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
    attachReferenceData: (refs?: ReferenceData | undefined) => void;
    /**
     *! Make sure to call this when the component is unloaded/destroyed
     * Removes all event listeners.
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
    getFieldGroups: () => Array<FieldConfig<ModelType> | Array<FieldConfig<ModelType>>>;
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
type FormDictionary = Array<Form<any>>;
/**
 * Base interface for managing multiple instances of Form
 * classes.
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
 * @example a data collection wizard with many fields
 */
declare class FormStepper extends FormManager {
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
    firstStep: () => void;
    lastStep: () => void;
}
/**
 * Group of Forms which extends the FormManager functionality.
 */
declare class FormGroup extends FormManager {
    constructor(forms: FormDictionary, props?: Partial<FormManager>);
}
export { FieldConfig, FieldStepper, newForm, Form, field, ValidationCallback, ValidatorFunction, ValidationError, ValidationProperties, ErrorDisplay, OnEvents, LinkValuesOnEvent, FormFieldSchema, FieldNode, ElementEvent, AcceptedDataType, InitialFormState, ReferenceDataItem, ReferenceData, FieldAttributes, ElementAttributesMap, FormMetaDataKeys, Callback, FormManager, FormStepper, FormGroup };
