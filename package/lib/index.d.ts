import { ValidationError } from "class-validator";
import { Writable } from "svelte/store";
import { ValidatorOptions } from "class-validator/types";
declare module "*.svelte";
interface FieldGroup {
    name: string;
    classnames?: string[]; // Order determines when to be applied
    label?: string;
}
interface FieldStep {
    index: number;
    classnames?: string[]; // Order determines when to be applied
    label?: string;
}
/**
 * FieldConfig is used to help with the form auto generation functionality.
 *
 * This is not meant to be a complete HTML Input/Select/etc replacement.
 * It is simply a vehicle to help give the form generator
 * an easy-to-use format to work with.
 */
declare class FieldConfig {
    constructor(init?: Partial<FieldConfig>);
    /**
     * ! DO NOT SET NAME
     * ! IT IS SET AUTOMATICALLY IN FORM.TS
     */
    readonly name: string;
    // Used to add and remove event listeners
    node: HTMLElement;
    /**
     * el can be either String or Svelte Component.
     * This allows us a more flexible dynamic field generator.
     */
    el: string | SvelteComponent;
    label?: string;
    type: string; // Defaults to text, for now
    required: boolean;
    value: Writable<any>;
    // Styling
    styles?: object;
    classes?: string;
    /**
     * Used if there is a set of "options" to choose from.
     */
    options?: any[];
    ref_key?: string; // Reference data key
    disabled: boolean;
    hidden: boolean;
    /**
     * Validation Errors!
     * We're mainly looking for the class-validator "constraints"
     * One ValidationError object can have multiple errors (constraints)
     */
    errors: Writable<ValidationError | null>;
    /**
     * * JSON of things like:
     * -- disabled
     * -- id="something"
     * -- type="text || email || password || whatever"
     * -- class='input class'
     * -- title='input title'
     * -- multiple
     * -- etc.
     */
    attributes: object;
    hint?: string; // Mainly for textarea, or whatever
    group?: FieldGroup;
    step?: FieldStep;
    clearValue: () => void;
    clearErrors: () => void;
    clear: () => void;
}
/**
 * TODO: Define strict types for FieldConfig
 */
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
declare class OnEvents {
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
declare enum LinkOnEvent {
    Always = 0,
    Valid = 1
}
/**
 * Data format for the reference data items
 * Form.refs are of type Record<string, RefDataItem[]>
 *
 * TODO: Possilbe candidate for Mapped Type
 */
interface RefDataItem {
    label: string;
    value: any;
}
type RefData<T extends Record<string, RefDataItem[]>> = {};
/**
 * Formvana - Form Class
 * Form is NOT valid, initially.
 * If you want to make it valid, this.valid.set(true).
 *
 * The main thing to understand here is that the fields and the model are separate.
 * Fields are built using the model, via the @field() & @editable() decorators.
 * We keep the fields and the model in sync based on the provided form config,
 * but we do our best to initialize it with good, sane defaults.
 *
 *
 * Recommended Use:
 *  - Initialize let form = new Form(model, {refs: REFS, template: TEMPLATE, etc.})
 *  - Set the model (if you didn't in the first step)
 *  - Attach reference data (if you didn't in the first step)
 *  - Storify the form - check example.form.ts for an example
 *  - Now you're ready to use the form!
 *  - Pass it into the DynamicForm component and let the form generate itself!
 *
 * Note: You will probably have to use form and field templates as this lib only comes
 * with default html form layout & fields.
 *
 * Performance is blazing with < 500 fields.
 * Can render up to 2000 inputs in one class, but don't do that.
 * Just break it up into 100 or so fields per form (max 250) if its a huge form.
 *  - Tested on late 2014 mbp - 2.5ghz core i7, 16gb ram
 *
 * TODO: decouple class-validator as to allow validation to be plugin based
 * TODO: Break up form properties and functions (FormProperties & FormApi)
 * TODO: Add a changes (value changes) observable
 */
declare class Form {
    constructor(model: any, init?: Partial<Form>);
    //#region ** Fields **
    //#region Core Functionality Fields
    /**
     * This is your form Model/Schema.
     * TODO: Definite candidate for Mapped Type
     *
     * (If you didn't set the model in the constructor)
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
     * If you did not set the model in constructor:
     * Call attachRefData() to link the data to the respective field
     *
     * * Fields & reference data are linked via field.ref_key
     */
    refs: Record<string, RefDataItem[]>;
    /**
     * Validation options come from class-validator ValidatorOptions.
     *
     * Biggest perf increase comes from setting validationError.target = false
     * (so the whole model is not attached to each error message)
     */
    readonly validation_options: ValidatorOptions;
    /**
     * The errors are of type ValidationError which comes from class-validator.
     * Errors are usually attached to the fields which the error is for.
     * This pattern adds flexibility at the cost of a little complexity.
     */
    errors: ValidationError[];
    /**
     * These next properties are all pretty self-explanatory.
     *
     * this.valid is a svelte store so we can change the state of the variable
     * inside of the class and it (the change) will be reflected
     * in the external form context.
     */
    valid: Writable<boolean>;
    loading: Writable<boolean>;
    changed: Writable<boolean>;
    touched: Writable<boolean>;
    /**
     * Use the NAME of the field (field.name) to disable/hide the field.
     */
    hidden_fields: string[];
    disabled_fields: string[];
    /**
     * Which events should the form do things on?
     * (validate, link values, hide/disable fields)
     */
    readonly on_events: OnEvents;
    // Which events should we clear the field errors on?
    readonly clear_errors_on_events: OnEvents;
    // When to link this.field values to this.model values
    readonly link_fields_to_model: LinkOnEvent;
    //#endregion
    //#region Field Styling
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
    //#endregion
    //#region Internal Fields
    // Used to make checking for disabled/hidden fields faster
    private field_names;
    /**
     * This is the model's initial state.
     * Shove the stateful_items into the inital state for a decent snapshot.
     */
    private initial_state;
    private initial_state_str;
    private stateful_items;
    /**
     * We keep track of required fields because we let class-validator handle everything
     * except *required* (field.required)
     * So if there are no required fields, but there are errors, the form is still
     * valid. This is the mechanism to help keep track of that.
     * Keep track of the fields so we can validate faster.
     */
    private required_fields;
    //#endregion
    //#endregion ^^ Fields ^^
    //#region ** Form API **
    //#region - Form Setup
    /**
     * Build the field configs via this.model using metadata-reflection.
     */
    private buildFields;
    /**
     * MUST BE ATTACHED TO SAME ELEMENT WITH FIELD.NAME!
     * MUST BE ATTACHED TO SAME ELEMENT WITH FIELD.NAME!
     * MUST BE ATTACHED TO SAME ELEMENT WITH FIELD.NAME!
     *
     * Use on the element that will be interacted with.
     * e.g. <input/> -- <button/> -- <select/> -- etc.
     * Check lib/svelte/defaults for more examples.
     *
     * * This hooks up the event listeners!
     *
     * This is for Svelte's "use:FUNCTION" feature.
     * The "use" directive passes the HTML Node as a parameter
     * to the given function (e.g. use:useField(node: HTMLNode)).
     *
     * TODO: Create new Type that has/adds/includes node.name
     */
    useField: (node: HTMLElement) => void;
    /**
     * Load new data into the form and build the fields.
     * Useful if you fetched data and need to update the form values.
     *
     * ReInit defaults to True. So the default is to pass in a new instance
     * of the model (e.g. new ExampleMode(incoming_data)).
     * If fresh is False then the incoming_data will be serialized into
     * the model.
     *
     * State is updated upon data load, by default.
     *
     * Check example.form.ts for an example use case.
     */
    loadData: (data: any, re_init?: boolean, update_initial_state?: boolean) => Form;
    /**
     * Just pass in the reference data and let the field configs do the rest.
     *
     * * Ref data MUST BE in format: Record<string, RefDataItem[]>
     */
    attachRefData: (refs?: Record<string, RefDataItem[]>) => void;
    addEventListenerToFields: (event: keyof HTMLElementEventMap, callback: Function, field_names: string | string[]) => void;
    //#endregion
    //#region - Validation
    /**
     * Well, validate the form!
     * Clear the errors first, then do it, obviously.
     */
    validate: () => Promise<ValidationError[]>;
    validateAsync: () => Promise<void>;
    /**
     * If want to (in)validate a specific field for any reason.
     */
    validateField: (field_name: string, message?: string) => void;
    //#endregion
    //#region - Utility Methods
    // Get Field by name
    get: (fieldName: string) => FieldConfig;
    /**
     * Generate a Svelte Store from the current "this".
     */
    storify: () => Writable<Form>;
    // Clear ALL the errors.
    clearErrors: () => void;
    /**
     *! Make sure to call this when the component is unloaded/destroyed
     * Removes all event listeners and clears the form state.
     */
    destroy: () => void;
    //#endregion
    //#region - Form State
    // Resets to the inital state of the form.
    reset: () => void;
    // Well, this updates the initial state of the form.
    updateInitialState: () => void;
    //#endregion
    //#region - Styling
    /**
     * Set the field order.
     * Layout param is simply an array of field (or group)
     * names in the order to be displayed.
     * Leftover fields are appended to bottom of form.
     */
    setOrder: (order: string[]) => void;
    /**
     * Hide a field or fields
     * @param names? string | string[]
     */
    hideFields: (names?: string | string[]) => void;
    /**
     * Disable a field or fields
     * @param names? string | string[]
     */
    disableFields: (names?: string | string[]) => void;
}
declare function editable(target: any, propertyKey: string): void;
declare function field(config: Partial<FieldConfig>): (target: any, propertyKey: string) => void;
//#region Utility Functions
// Get the form field by name
declare function _get(name: string, fields: FieldConfig[]): FieldConfig;
/**
 *
 * Build the field configs from this.model using metadata-reflection.
 * More comments inside...
 */
declare function _buildFormFields(model: any): FieldConfig[];
declare function _getRequiredFieldNames(fields: FieldConfig[]): string[];
//#endregion
//#region HTML Event Helpers
declare function _attachEventListeners(field: FieldConfig, on_events: OnEvents, callback: Function): void;
declare function _attachOnClearErrorEvents(node: HTMLElement, clear_errors_on_events: OnEvents, callback?: Function): void;
//#endregion
//#region Linking Utilities
// Link values from FIELDS toMODEL or MODEL to FIELDS
declare function _linkValues(fromFieldsToModel: boolean, fields: FieldConfig[], model: any): void;
/**
 * Currently this depends on class-validator.
 * TODO: Disconnect class-validator dependency from all functions
 */
declare function _linkFieldErrors(errors: ValidationError[], field: FieldConfig, filter_term: keyof ValidationError // TODO: Create special validation error Type
): void;
declare function _linkErrors(errors: ValidationError[], fields: FieldConfig[]): void;
//#endregion
//#region Validation Helpers
declare function _handleOnEvent(form: Form, required_fields: string[], stateful_items: string[], initial_state_str: string, field_names: string[], field: FieldConfig): Promise<void>;
declare function _validateField(form: Form, field: FieldConfig, required_fields: string[]): Promise<void>;
declare function _handleValidation(form: Form, errors: ValidationError[], required_fields: string[], field?: FieldConfig): Promise<void>;
/**
 * TODO: Clean up this arfv implementation. Seems too clunky.
 *
 * Check if there are any required fields in the errors.
 * If there are no required fields in the errors, the form is valid
 */
declare function _requiredFieldsValid(errors: ValidationError[], required_fields: string[]): boolean;
//#endregion
//#region - Form State
// Returns a string of the current state
declare function _getStateSnapshot(form: Form, stateful_items: string[]): string;
/**
 * Is the current form state different than the initial state?
 *
 * I've tested it with > 1000 fields in a single class with very slight input lag.
 */
declare function _hasChanged(form: Form, stateful_items: string[], initial_state_str: string): void;
// Clears everything before being destoryed.
declare function _clearState(form: Form, initial_state: any, required_fields: string[]): void;
/**
 * Grab a snapshot of several items that generally define the state of the form
 * and serialize them into a format that's easy-ish to check/deserialize (for resetting)
 */
declare function _setInitialState(form: Form, stateful_items: string[], initial_state: any, initial_state_str: string): void;
/**
 * This one's kinda harry.
 * But it resets the form to it's initial state.
 */
declare function _resetState(form: Form, stateful_items: string[], initial_state: any): void;
//#endregion
//#region - Styling
/**
 * Using this.field_order, rearrange the order of the fields.
 */
declare function _createOrder(field_order: string[], fields: FieldConfig[]): FieldConfig[];
declare function _hideFields(hidden_fields: string[], field_names: string[], fields: FieldConfig[]): void;
declare function _hideField(name: string, fields: FieldConfig[]): void;
declare function _disableFields(disabled_fields: string[], field_names: string[], fields: FieldConfig[]): void;
declare function _disableField(name: string, fields: FieldConfig[]): void;
export * from "./svelte";
export { FieldGroup, FieldStep, FieldConfig, Form, editable, field, _get, _buildFormFields, _getRequiredFieldNames, _attachEventListeners, _attachOnClearErrorEvents, _linkValues, _linkFieldErrors, _linkErrors, _handleOnEvent, _validateField, _handleValidation, _requiredFieldsValid, _getStateSnapshot, _hasChanged, _clearState, _setInitialState, _resetState, _createOrder, _hideFields, _hideField, _disableFields, _disableField, OnEvents, LinkOnEvent, RefDataItem, RefData };
//# sourceMappingURL=index.d.ts.map