import { ValidationError } from "class-validator";
import { Writable } from "svelte/store";
import { FieldConfig } from "./";
/**
 * Determines which events to validate/clear validation, on.
 */
export declare class OnEvents {
    constructor(eventsOn?: boolean, init?: Partial<OnEvents>);
    input: boolean;
    change: boolean;
    blur: boolean;
    focus: boolean;
    mount: boolean;
    submit: boolean;
}
export declare enum LinkOnEvent {
    Always = 0,
    Valid = 1
}
export interface RefDataItem {
    label: string;
    value: any;
}
/**
 * Formvana - Form Class
 * Form is NOT valid, initially.
 *
 * Recommended Use:
 *  - Initialize new Form({model: ..., refs: ..., template: ..., etc.})
 *  - Set the model (if you didn't in the previous step)
 *  - (optionally) attach reference data
 *  - call form.storify() -  const { subscribe, update } = form.storify();
 *  - Now you're ready to use the form!
 *
 * Performance is blazing with < 500 fields
 *  - Tested on late 2014 mbp - 2.5ghz core i7, 16gb ram
 *
 */
export declare class Form {
    constructor(init?: Partial<Form>);
    /**
     * This is the model's initial state.
     */
    private initial_state;
    private initial_errors;
    private non_required_fields;
    /**
     * Validation options come from class-validator ValidatorOptions.
     *
     * Biggest perf increase comes from setting validationError.target = false
     * (so the whole model is not attached to each error message)
     */
    validation_options: {
        skipMissingProperties: boolean;
        whitelist: boolean;
        forbidNonWhitelisted: boolean;
        dismissDefaultMessages: boolean;
        groups: any[];
        validationError: {
            target: boolean;
            value: boolean;
        };
        forbidUnknownValues: boolean;
        stopAtFirstError: boolean;
    };
    /**
     * This is your form Model/Schema.
     *
     * (If you did not set the model in constructor)
     * When model is set, call buildFields() to build the fields.
     */
    model: any;
    /**
     * Fields are built from the model's metadata using reflection.
     * If model is set, call buildFields().
     */
    fields: FieldConfig[];
    /**
     * refs hold any reference data you'll be using in the form
     * e.g. seclet dropdowns, radio buttons, etc.
     *
     * (If you did not set the model in constructor)
     * Call attachRefData() to link the data to the respective field
     *
     * * Fields & reference data are linked via field.ref_key
     */
    refs: Record<string, RefDataItem[]>;
    classes: string[];
    /**
     * Determines the ordering of this.fields.
     * Simply an array of field names (or group names or stepper names)
     * in the order to be displayed
     */
    field_order: string[];
    /**
     * Form Template Layout
     *
     * Render the form into a custom svelte template!
     * Use a svelte component.
     * * The component/template must accept {form} prop
     *
     * Note: add ` types": ["svelte"] ` to tsconfig compilerOptions
     * to remove TS import error of .svelte files (for your template)
     */
    template: any;
    /**
     * this.valid is a "store" so we can change the state of the variable
     * inside of the class and it (the change) be reflected outside
     * in the form context.
     */
    valid: Writable<boolean>;
    errors: ValidationError[];
    loading: Writable<boolean>;
    changed: Writable<boolean>;
    touched: Writable<boolean>;
    validate_on_events: OnEvents;
    clear_errors_on_events: OnEvents;
    link_fields_to_model: LinkOnEvent;
    /**
     * * Here be Functions. Beware.
     * * Here be Functions. Beware.
     * * Here be Functions. Beware.
     */
    /**
     * Build the field configs from the given model using metadata-reflection.
     */
    buildFields: () => void;
    /**
     * Set the field order.
     * Layout param is simply an array of field (or group)
     * names in the order to be displayed.
     * Leftover fields are appended to bottom of form.
     */
    setOrder: (order: string[]) => void;
    createOrder: () => void;
    /**
     * * Use this if you're trying to update the layout after initialization
     * Like this:
     * const layout = ["description", "status", "email", "name"];
     * const newState = sget(formState).buildStoredLayout(formState, layout);
     * formState.updateState({ ...newState });
     */
    buildStoredLayout: (formState: Writable<any>, order: string[]) => Writable<any>;
    /**
     * This is for Svelte's "use:FUNCTION" feature.
     * The "use" directive passes the HTML Node as a parameter
     * to the given function (e.g. use:useField(node: HTMLNode)).
     *
     * This hooks up the event listeners!
     */
    useField: (node: HTMLElement) => void;
    /**
     * Validate the field!
     * This should be attached to the field via the useField method.
     */
    validateField: (field: FieldConfig) => Promise<void>;
    validate: () => Promise<ValidationError[]>;
    validateAsync: () => Promise<any>;
    loadData: (data: any) => Form;
    /**
     * Just pass in the reference data and let the field configs do the rest.
     *
     * * Ref data must be in format: Record<string, RefDataItem[]>
     */
    attachRefData: (refs?: Record<string, RefDataItem[]>) => void;
    /**
     * Generate a Svelte Store from the current "this"
     */
    storify: () => Writable<Form>;
    updateInitialState: () => void;
    clearErrors: () => void;
    reset: () => void;
    /**
     *! Make sure to call this when the component is unloaded/destroyed
     */
    destroy: () => void;
    /**
     * TODO: Speed this bad boy up. There are optimizations to be had.
     * ... but it's already pretty speedy.
     * Check if there are any required fields in the errors.
     * If there are no required fields in the errors, the form is valid
     */
    private nonRequiredFieldsValid;
    private handleValidation;
    private linkValues;
    private linkFieldValue;
    /**
     * TODO: Might better way to do comparison than Object.is() and JSON.stringify()
     * TODO: Be my guest to fix it if you know how.
     * But... I've tested it with 1000 fields with minimal input lag.
     */
    private hasChanged;
    private linkFieldErrors;
    private linkErrors;
    private clearFieldErrors;
    private handleOnValidateEvents;
    private handleOnClearErrorEvents;
}
