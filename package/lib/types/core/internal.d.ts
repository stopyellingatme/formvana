/** Using "when" gives us a little more flexibilty. */
export interface ValidationCallback {
    callback: Callback;
    /**
     * When should the callback fire?
     * "before" or "after" validation?
     */
    when: "before" | "after";
}
/** Pretty much any funciton as long as it returns a Promise with
 * Validation Error array.
 */
export declare type ValidatorFunction = (...args: any[]) => Promise<ValidationError[]>;
/**
 * @param model_property_key, which model field are we linking this to?
 * @param errors essentially Record<string #1, string #2>
 * with #1 being the name of the error (minlength, pattern)
 * and #2 being the error message
 * @param options, anything else part of the ValidationErrorType
 */
export declare class ValidationError implements ValidationErrorType {
    constructor(model_property_key?: string, errors?: {
        [type: string]: string;
    }, options?: Partial<ValidationErrorType>);
    target?: Object;
    property?: string;
    value?: any;
    constraints?: {
        [type: string]: string;
    };
    children?: ValidationErrorType[];
}
export interface ValidationErrorType {
    target?: Object;
    property?: string;
    value?: any;
    constraints?: {
        [type: string]: string;
    };
    children?: ValidationErrorType[];
}
/** Form Validation Options  */
export interface ValidationOptions {
    /**
     * PLEASE PASS IN A VALIDATOR FUNCTION!
     *
     * This is the (validation) function that will be called when validating.
     * You can use any validation library you like, as long as this function
     * returns Promise<ValidationError[]>
     */
    validator: ValidatorFunction;
    /**
     * Validation options come from class-validator ClassValidatorOptions.
     *
     * Biggest perf increase comes from setting validationError.target = false
     * (so the whole model is not attached to each error message)
     */
    options?: Partial<ClassValidatorOptions>;
    /**
     * Optional validation schema.
     * "no-class" method of validating the model.
     *
     * @TODO Create a way to validate JSON model
     */
    schema?: Object;
    /**
     * Name of the property which links ERRORS to fields.
     * Error.property_or_name_or_whatever must match field.name.
     */
    field_error_link_name: ValidationError["property"];
    /** When to link this.field values to this.model values */
    link_fields_to_model?: LinkOnEvent;
    /**
     * Which events should the form do things on?
     * @examples validate, link values, hide/disable fields, callbacks
     */
    on_events: OnEvents<HTMLElementEventMap>;
}
/**
 * Options passed to validator during validation.
 * Note: this interface used by class-validator
 */
export interface ClassValidatorOptions extends Record<string, unknown> {
    /**
     * If set to true then class-validator will print extra warning messages to the console when something is not right.
     */
    enableDebugMessages?: boolean;
    /**
     * If set to true then validator will skip validation of all properties that are undefined in the validating object.
     */
    skipUndefinedProperties?: boolean;
    /**
     * If set to true then validator will skip validation of all properties that are null in the validating object.
     */
    skipNullProperties?: boolean;
    /**
     * If set to true then validator will skip validation of all properties that are null or undefined in the validating object.
     */
    skipMissingProperties?: boolean;
    /**
     * If set to true validator will strip validated object of any properties that do not have any decorators.
     *
     * Tip: if no other decorator is suitable for your property use @Allow decorator.
     */
    whitelist?: boolean;
    /**
     * If set to true, instead of stripping non-whitelisted properties validator will throw an error
     */
    forbidNonWhitelisted?: boolean;
    /**
     * Groups to be used during validation of the object.
     */
    groups?: string[];
    /**
     * Set default for `always` option of decorators. Default can be overridden in decorator options.
     */
    always?: boolean;
    /**
     * If [groups]{@link ClassValidatorOptions#groups} is not given or is empty,
     * ignore decorators with at least one group.
     */
    strictGroups?: boolean;
    /**
     * If set to true, the validation will not use default messages.
     * Error message always will be undefined if its not explicitly set.
     */
    dismissDefaultMessages?: boolean;
    /**
     * ValidationError special options.
     */
    validationError?: {
        /**
         * Indicates if target should be exposed in ValidationError.
         */
        target?: boolean;
        /**
         * Indicates if validated value should be exposed in ValidationError.
         */
        value?: boolean;
    };
    /**
     * Settings true will cause fail validation of unknown objects.
     */
    forbidUnknownValues?: boolean;
    /**
     * When set to true, validation of the given property will stop after encountering the first error. Defaults to false.
     */
    stopAtFirstError?: boolean;
}
/**
 * Determines which events to validate on.
 * You can insert event listeners just by adding a [string]: boolean
 * to the constructor's init object.
 * Enabled By Default: blue, change, focus, input, submit
 */
export declare class OnEvents<T extends HTMLElementEventMap> {
    constructor(init?: Partial<OnEvents<T>>, disableAll?: boolean);
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
export declare type LinkOnEvent = "always" | "valid";
export declare type LinkValuesOnEvent = "all" | "field";
/**
 * Keeping it simple. Just keep up with model and errors.
 */
export declare type InitialFormState<ModelType extends Object> = {
    model: ModelType | undefined;
    errors: ValidationError[] | undefined;
};
/**
 * Data format for the reference data items
 * Form.refs are of type Record<string, RefDataItem[]>
 */
export interface RefDataItem {
    label: string;
    value: any;
    data?: any;
}
/** Helpful shape for loading in reference data for the Form */
export declare type RefData = Record<string, RefDataItem[]>;
/** This gives us a pretty exhaustive typesafe map of element attributes */
export declare type FieldAttributes = Record<ElementAttributesMap & string, any>;
export declare type ElementAttributesMap = keyof HTMLElement | keyof HTMLInputElement | keyof HTMLSelectElement | keyof HTMLFieldSetElement | keyof HTMLImageElement | keyof HTMLButtonElement | keyof HTMLCanvasElement | keyof HTMLOptionElement | keyof AriaAttributes;
/** Catchall type for giving callbacks a bit more typesafety */
export declare type Callback = ((...args: any[]) => any) | (() => any) | void | undefined | boolean | string | Promise<any>;
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
export {};
