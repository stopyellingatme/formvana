export declare type ValidationErrorType = {
    target?: Object;
    property: string;
    value?: any;
    constraints?: {
        [type: string]: string;
    };
    children?: ValidationErrorType[];
};
export declare class ValidationError {
    /**
     * @param errors essentially Record<string #1, string #2>
     * with #1 being the name of the error constraint
     * and #2 being the error message
     * @param model_property_key, which model field are we linking this to?
     * @param options, anything else part of the ValidationErrorType
     */
    constructor(model_property_key?: string, errors?: {
        [type: string]: string;
    }, options?: Partial<ValidationErrorType>);
    target?: Object;
    property: string;
    value?: any;
    constraints?: {
        [type: string]: string;
    };
    children?: ValidationErrorType[];
}
export declare type ValidationCallback = {
    callback: ((...args: any) => void) | (() => void);
    /**
     * When should the callback fire?
     * "before" or "after" validation?
     */
    when: "before" | "after";
};
export declare type LinkValuesOnEvent = "all" | "field";
export declare type PerformanceOptions = {
    link_all_values_on_event: LinkValuesOnEvent;
    enable_hidden_fields_detection: boolean;
    enable_disabled_fields_detection: boolean;
    enable_change_detection: boolean;
};
/**
 * Determines which events to validate/clear validation, on.
 * And, you can bring your own event listeners just by adding one on
 * the init.
 * Enabled By Default: blue, change, focus, input, submit
 *
 * Also has the good ole Object.assign in the constructor.
 * It's brazen, but you're a smart kid.
 * Use it wisely.
 *
 * TODO: Possilbe candidate for Mapped Type
 */
export declare class OnEvents {
    constructor(init?: Partial<OnEvents>, disableAll?: boolean);
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
/**
 * Data format for the reference data items
 * Form.refs are of type Record<string, RefDataItem[]>
 *
 * TODO: Possilbe candidate for Mapped Type
 */
export interface RefDataItem {
    label: string;
    value: any;
    data?: any;
}
export declare type RefData = Record<string, RefDataItem[]>;
