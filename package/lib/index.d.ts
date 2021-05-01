import { ValidationError } from "class-validator";
import { SvelteComponent } from "svelte";
import { Writable } from "svelte/store";
import { SvelteComponentDev } from "svelte/internal";
import { SvelteComponent as SvelteComponent$0 } from "svelte/internal";
interface FieldGroup {
    name: string;
    label?: string;
}
interface FieldStep {
    index: number;
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
    constructor(init: Partial<FieldConfig>);
    /**
     * Only set "name" if you are using FieldConfig apart from
     * your object/model.
     * I.e. you are using plain JSON rather than a TS class.
     */
    readonly name: string;
    // Used to add and remove event listeners
    node: HTMLElement;
    /**
     * el can be either String or Svelte Component.
     * This allows us a more flexible dynamic field generator.
     * Using a template also allows you to style each input as needed.
     */
    selector?: string;
    template?: SvelteComponent;
    label?: string;
    type: string; // Defaults to text, for now
    required: boolean;
    value: Writable<any>;
    /**
     * You can use these to apply styles.
     * However, using a template/component is recommended.
     *
     */
    styles?: string;
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
     * -- anything you want!
     */
    attributes: object;
    hint?: string; // Mainly for textarea, or whatever
    group?: FieldGroup;
    step?: FieldStep;
    private initial_value;
    clearValue: () => void;
    clearErrors: () => void;
    clear: () => void;
    setInitialValue: (value: any) => void;
}
/**
 * Base interface for managing multiple instances of Form
 * classes.
 *
 * TODO: Class for FormGroup and FormStepper
 */
interface FormManager {
    forms: Form<typeof Form>[];
}
//#region Validation
interface ValidationCallback {
    callback: Callback;
    /**
     * When should the callback fire?
     * "before" or "after" validation?
     */
    when: "before" | "after";
}
type ValidatorFunction = (...args: any[]) => Promise<ValidationError[]>;
interface ValidationErrorType {
    target?: Object; // Object that was validated.
    property: string; // Object's property that didn't pass validation.
    value?: any; // Value that didn't pass a validation.
    constraints?: {
        // Constraints that failed validation with error messages.
        [type: string]: string;
    };
    children?: ValidationErrorType[];
}
declare class ValidationError$0 {
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
    target?: Object; // Object that was validated.
    property: string; // Object's property that didn't pass validation.
    value?: any; // Value that didn't pass a validation.
    constraints?: {
        // Constraints that failed validation with error messages.
        [type: string]: string;
    };
    children?: ValidationErrorType[];
}
interface ValidationOptions {
    /**
     * This is the (validation) function that will be called when validating.
     * You can use any validation library you like, as long as this function
     * returns Promise<ValidationError[]>
     */
    validator: ValidatorFunction | undefined;
    /**
     * Validation options come from class-validator ValidatorOptions.
     *
     * Biggest perf increase comes from setting validationError.target = false
     * (so the whole model is not attached to each error message)
     */
    options?: Partial<ValidatorOptions>;
    /**
     * Name of the property which links errors to fields.
     * Error.property_or_name_or_whatever must match field.name.
     * ValidationError[name] must match field.name.
     */
    field_error_link_name: keyof ValidationError$0;
}
/**
 * Options passed to validator during validation.
 * Note: this interface used by class-validator
 */
interface ValidatorOptions extends Record<string, unknown> {
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
     * If [groups]{@link ValidatorOptions#groups} is not given or is empty,
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
//#endregion
//#region Events
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
 * Should be keyof HTMLElementEventMap
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
type LinkOnEvent = "always" | "valid";
type LinkValuesOnEvent = "all" | "field";
//#endregion
//#region Misc
type Callback = ((...args: any[]) => any) | (() => any);
/**
 * Data format for the reference data items
 * Form.refs are of type Record<string, RefDataItem[]>
 */
interface RefDataItem {
    label: string;
    value: any;
    data?: any;
}
type RefData = Record<string, RefDataItem[]>;
type PerformanceOptions = {
    link_all_values_on_event: LinkValuesOnEvent;
    enable_hidden_fields_detection: boolean;
    enable_disabled_fields_detection: boolean;
    enable_change_detection: boolean;
};
/**
 * Formvana - Form Class
 * Form is NOT valid, initially.
 * If you want to make it valid, this.valid.set(true).
 *
 * The main thing to understand here is that the fields and the model are separate.
 * Fields are built using the model, via the @field() & @editable() decorators.
 * We keep the fields and the model in sync (simply) via model property names
 * which are mapped to field.name.
 * We do our best to initialize this thing with good, sane defaults without
 * adding too many restrictions.
 *
 * Recommended Use:
 *  - Initialize let form = new Form(model, {refs: REFS, template: TEMPLATE, etc.})
 *  - Set the model (if you didn't in the first step)
 *  - Attach reference data (if you didn't in the first step)
 *  - Storify the form - check example.form.ts for an example
 *  - Now you're ready to use the form!
 *  - Pass it into the DynamicForm component and let the form generate itself!
 *
 * Performance is blazing with < 500 fields.
 * Can render up to 2000 inputs in per class/fields.
 * Just break it up into 100 or so fields per form (max 250) if its a huge form.
 *  - Tested on late 2014 mbp - 2.5ghz core i7, 16gb ram
 *
 * TODO: Create FormManager interface for dealing with FormGroup and FormStepper classes
 * TODO: Create easy component/pattern for field groups and stepper/wizzard
 * TODO: Create plugin base for form template styling
 *
 * TODO: Allow fields, model and validator to be passed in separately.
 *  - This will allow for a more "dynamic" form building experience
 */
declare class Form<ModelType extends Object> {
    constructor(model: ModelType, validator?: ValidatorFunction, init?: Partial<Form<ModelType>>);
    //#region ** Fields **
    //#region Core Functionality Fields
    /**
     * This is your form Model/Schema.
     * It's used to build the form.fields.
     *
     * The meat and potatos, some would say.
     */
    model: ModelType;
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
    refs?: RefData;
    /**
     * Validation Options contain the logic and config for validating
     * the form as well as linking errors to fields.
     *
     * Other, more fine grained options are in validation_options.options
     */
    readonly validation_options: Partial<ValidationOptions>;
    /**
     * The errors are of type ValidationError.
     * Errors are attached to their corresponding fields.
     * This pattern adds flexibility at the cost of a little complexity.
     *
     * When a single field is validated, the whole model is validated. We just don't
     * show all the errors to the user. This way, we know if the form is still invalid,
     * even if we aren't showing the user any errors (like, pre-submit-button press).
     */
    errors: ValidationError$0[];
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
     * Emits value changes as a plain JS object.
     * Format: { [field.name]: value }
     *
     * Similar to Angular form.valueChanges
     */
    value_changes: Writable<Record<string, any>>;
    /**
     * Use the NAME of the field (field.name) to disable/hide the field.
     */
    hidden_fields?: Array<FieldConfig["name"]>;
    disabled_fields?: Array<FieldConfig["name"]>;
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
     * Form Template Layout
     *
     * Render the form into a custom svelte template!
     * Use a svelte component.
     * * The component/template must accept {form} prop
     *
     * Note: add ` types": ["svelte"] ` to tsconfig compilerOptions
     * to remove TS import error of .svelte files (for your template)
     */
    template?: string | typeof SvelteComponentDev | typeof SvelteComponent$0 | typeof SvelteComponent$0;
    /**
     * Determines the ordering of this.fields.
     * Simply an array of field names (or group names or stepper names)
     * in the order to be displayed
     */
    field_order: Array<FieldConfig["name"]>;
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
    /**
     * Performance options!
     * Use these if you're trying to handle upwards of 1000+ inputs within a given model.
     *
     * link_all_values_on_event - we usually link all field values to the model on
     * each event call. If set to false, we only link the field affected in the OnEvent
     * which saves us iterating over each field and linking it to the model.
     */
    perf_options: Partial<PerformanceOptions>;
    //#endregion
    //#endregion ^^ Fields ^^
    //#region ** Form API **
    //#region - Form Setup
    /**
     * Builds the fields from the model.
     * Builds the field configs via this.model using metadata-reflection.
     *
     * TODO: Allow JSON model and schema validation/setup
     */
    buildFields: (model?: ModelType) => void;
    /**
     * ATTACH TO SAME ELEMENT AS FIELD.NAME!
     *
     * Use on the element that will be interacted with.
     * e.g. <input/> -- <button/> -- <select/> -- etc.
     * Check examples folder for more details.
     *
     * * This hooks up the event listeners!
     *
     * This is for Svelte's "use:FUNCTION" feature.
     * The "use" directive passes the HTML Node as a parameter
     * to the given function (e.g. use:useField(node: HTMLElement)).
     */
    useField: (node: HTMLElement & {
        name: string;
    }) => void;
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
    loadData: <T extends ModelType>(data: T, re_init?: boolean, update_initial_state?: boolean) => Form<ModelType>;
    /**
     * Just pass in the reference data and let the field configs do the rest.
     *
     * * Ref data MUST BE in format: Record<string, RefDataItem[]>
     */
    attachRefData: (refs?: RefData) => void;
    //#endregion
    //#region - Validation
    /**
     * Well, validate the form!
     * Clear the errors first, then do it, obviously.
     * Can also link fields values to model.
     * Can also hide or disable fields before validation.
     */
    validate: (callbacks?: ValidationCallback[]) => Promise<ValidationError$0[]>;
    validateAsync: (callbacks?: ValidationCallback[]) => Promise<ValidationError$0[]>;
    /**
     * If want to (in)validate a specific field for any reason.
     */
    validateField: (field_name: string, withMessage?: string, callbacks?: ValidationCallback[]) => void;
    /**
     * Can attach event listeners to one or more fields.
     */
    addEventListenerToFields: (event: keyof HTMLElementEventMap, callback: Callback, field_names: string | string[]) => void;
    /**
     * Add your own callbacks to the normal _handleValidationEvent method.
     */
    addValidationCallbackToFields: (event: keyof HTMLElementEventMap, callbacks: ValidationCallback[], field_names: string | string[]) => void;
    //#endregion
    //#region - Utility Methods
    // Get Field by name
    get: (field_name: string) => FieldConfig;
    /**
     * Generate a Svelte Store from the current "this".
     */
    storify: () => Writable<Form<ModelType>>;
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
     * Show a field or fields
     * @param names? string | string[]
     */
    showFields: (names?: string | string[]) => void;
    /**
     * Disable a field or fields
     * @param names? string | string[]
     */
    disableFields: (names?: string | string[]) => void;
    /**
     * Enable a field or fields
     * @param names? string | string[]
     */
    enableFields: (names?: string | string[]) => void;
}
declare function field(config: Partial<FieldConfig>): (target: any, propertyKey: string) => void;
//#region Utility Functions
// Get the form field by name
declare function _get(name: string, fields: FieldConfig[]): FieldConfig;
/**
 *
 * Build the field configs from this.model using metadata-reflection.
 * More comments inside...
 */
declare function _buildFormFields(model: any, 
// Grab the editableProperties from the @field decorator
props?: string[]): FieldConfig[];
declare function _getRequiredFieldNames(fields: FieldConfig[]): string[];
/**
 * Helper function for value_change emitter.
 * Write the form's value changes to form.value_changes.
 *
 * @param changes incoming value changes
 * @param field field emitting the changes
 */
declare function _setValueChanges(changes: Writable<Record<string, any>>, field: FieldConfig): void;
//#endregion
//#region HTML Event Helpers
/**
 * Attach the OnEvents events to each form.field.
 * Parent: form.useField(...)
 */
declare function _attachEventListeners(field: FieldConfig, on_events: OnEvents, callback: Callback): void;
declare function _attachOnClearErrorEvents(node: HTMLElement, clear_errors_on_events: OnEvents, callback?: Callback): void;
declare function _addCallbackToField(field: FieldConfig, event: keyof HTMLElementEventMap, callbacks: ValidationCallback[] | Callback, with_validation_event?: boolean): void;
// Link values from FIELDS toMODEL or MODEL to FIELDS
declare function _linkValues<ModelType extends Object>(fromFieldsToModel: boolean, fields: FieldConfig[], model: ModelType): void;
/**
 * Currently this depends on class-validator.
 * TODO: Disconnect class-validator dependency from all functions
 */
declare function _linkFieldErrors(errors: ValidationError$0[], field: FieldConfig, filter_term: keyof ValidationError$0): void;
declare function _linkAllErrors(errors: ValidationError$0[], fields: FieldConfig[]): void;
declare function _hanldeValueLinking<T extends Object>(form: Form<T>, field?: FieldConfig): void;
/**
 * This is used to add functions and callbacks to the OnEvent
 * handler. Functions can be added in a plugin-style manner now.
 */
declare function _executeCallbacks(callbacks: Callback | Callback[]): void;
/**
 * Hanlde the events that will fire for each field.
 * Corresponds to the form.on_events field.
 *
 */
declare function _handleValidationEvent<T extends Object>(form: Form<T>, required_fields: string[], stateful_items: string[], initial_state_str: string, field_names: string[], field?: FieldConfig, callbacks?: ValidationCallback[]): Promise<ValidationError$0[]>;
/**
 * Handle all the things associated with validation!
 * Link the errors to the fields.
 * Check if all required fields are valid.
 * Link values from fields to model if
 * form.link_fields_to_model === LinkOnEvent.Valid is true.
 */
declare function _handleFormValidation<T extends Object>(form: Form<T>, errors: ValidationError$0[], required_fields: string[], field?: FieldConfig): Promise<ValidationError$0[]>;
/**
 * TODO: Clean up this arfv implementation. Seems too clunky.
 *
 * Check if there are any required fields in the errors.
 * If there are no required fields in the errors, the form is valid
 */
declare function _requiredFieldsValid(errors: ValidationError$0[], required_fields: string[]): boolean;
//#endregion
//#region - Form State
// Returns a string of the current state
declare function _getStateSnapshot<T extends Object>(form: Form<T>, stateful_items: string[]): string;
/**
 * Is the current form state different than the initial state?
 *
 * I've tested it with > 1000 fields in a single class with very slight input lag.
 */
declare function _hasStateChanged<T extends Object>(form: Form<T>, stateful_items: string[], initial_state_str: string): void;
/**
 * Grab a snapshot of several items that generally define the state of the form
 * and serialize them into a format that's easy-ish to check/deserialize (for resetting)
 */
declare function _setInitialState<T extends Object>(form: Form<T>, stateful_items: string[], initial_state: any, initial_state_str: string): string;
/**
 * This one's kinda harry.
 * But it resets the form to it's initial state.
 */
declare function _resetState<T extends Object>(form: Form<T>, stateful_items: string[], initial_state: any): void;
//#endregion
//#region - Styling
/**
 * Using this.field_order, rearrange the order of the fields.
 */
declare function _createOrder(field_order: string[], fields: FieldConfig[]): FieldConfig[];
declare function _setFieldAttribute(name: string, fields: FieldConfig[], attributes: Partial<FieldConfig>): void;
declare function _negateField(affected_fields: Array<FieldConfig["name"]>, field_names: Array<FieldConfig["name"]>, fields: FieldConfig[], negation: {
    type: "disable" | "hide";
    value: boolean;
}): void;
export { FieldGroup, FieldStep, FieldConfig, Form, field, _get, _buildFormFields, _getRequiredFieldNames, _setValueChanges, _attachEventListeners, _attachOnClearErrorEvents, _addCallbackToField, _linkValues, _linkFieldErrors, _linkAllErrors, _hanldeValueLinking, _executeCallbacks, _handleValidationEvent, _handleFormValidation, _requiredFieldsValid, _getStateSnapshot, _hasStateChanged, _setInitialState, _resetState, _createOrder, _setFieldAttribute, _negateField, FormManager, ValidationCallback, ValidatorFunction, ValidationErrorType, ValidationError$0 as ValidationError, ValidationOptions, ValidatorOptions, OnEvents, LinkOnEvent, LinkValuesOnEvent, Callback, RefDataItem, RefData, PerformanceOptions };
//# sourceMappingURL=index.d.ts.map