import { ValidatorOptions } from "class-validator/types";
import { Writable } from "svelte/store";
import { FieldConfig } from ".";
import { OnEvents, LinkOnEvent, RefData, PerformanceOptions, ValidationError, ValidationCallback } from "./types";
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
 * Can render up to 2000 inputs in per class/fields.
 * Just break it up into 100 or so fields per form (max 250) if its a huge form.
 *  - Tested on late 2014 mbp - 2.5ghz core i7, 16gb ram
 *
 * TODO: Decouple class-validator as to allow validation to be plugin based
 * TODO: Create easy component/pattern for field groups and stepper/wizzard
 * TODO: Create plugin base for form template styling
 *
 * TODO: Allow fields, model and validator to be passed in separately.
 *  - This will allow for a more "dynamic" form building experience
 */
export declare class Form<ModelType extends Object> {
    constructor(model: ModelType, init?: Partial<Form<ModelType>>);
    /**
     * This is your form Model/Schema.
     *
     * (If you didn't set the model in the constructor)
     * When model is set, call buildFields() to build the fields.
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
    refs: RefData;
    /**
     * TODO: Decouple class-validator/allow other validators!
     * TODO: Change this to a custom type that takes the type of validator
     * TODO: and the validators options. This will help decouple
     *
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
     * Emits value changes as a plain JS object.
     * Format: { [field.name]: value }
     *
     * Similar to Angular form.valueChanges
     */
    value_changes: Writable<Record<string, any>>;
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
    readonly clear_errors_on_events: OnEvents;
    readonly link_fields_to_model: LinkOnEvent;
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
     * High Performance options!
     * Use these if you're trying to handle upwards of 1000+ inputs within a given model.
     *
     * link_all_values_on_event - we usually link all field values to the model on
     * each event call. If set to false, we only link the field affected in the OnEvent
     * which saves us iterating over each field and linking it to the model.
     */
    performance_options: Partial<PerformanceOptions>;
    /**
     * Build the field configs via this.model using metadata-reflection.
     */
    private buildFields;
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
    /**
     * Can attach event listeners to one or more fields.
     *
     * TODO: Optionaly, attach the _handleValidationEvents function?
     */
    addEventListenerToFields: (event: keyof HTMLElementEventMap, callback: ((...args: any) => void) | (() => void), field_names: string | string[]) => void;
    /**
     * Well, validate the form!
     * Clear the errors first, then do it, obviously.
     * Can also link fields values to model.
     * Can also hide or disable fields before validation.
     */
    validate: (callbacks?: ValidationCallback[]) => Promise<ValidationError[]>;
    validateAsync: () => Promise<void>;
    /**
     * If want to (in)validate a specific field for any reason.
     */
    validateField: (field_name: string, withMessage?: string) => void;
    get: (field_name: string) => FieldConfig;
    /**
     * Generate a Svelte Store from the current "this".
     */
    storify: () => Writable<Form<ModelType>>;
    clearErrors: () => void;
    /**
     *! Make sure to call this when the component is unloaded/destroyed
     * Removes all event listeners and clears the form state.
     */
    destroy: () => void;
    reset: () => void;
    updateInitialState: () => void;
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
