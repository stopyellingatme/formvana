import { Writable } from "svelte/store";
import { FieldConfig } from ".";
import { OnEvents, LinkOnEvent, RefData, ValidationError, ValidationCallback, Callback, ValidationOptions } from "./types";
import { SvelteComponent, SvelteComponentDev } from "svelte/internal";
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
export declare class Form<ModelType extends Object> {
    constructor(model: ModelType, validation_options: Partial<ValidationOptions>, init?: Partial<Form<ModelType>>);
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
    validation_options: Partial<ValidationOptions>;
    /**
     * The errors are of type ValidationError.
     * Errors are attached to their corresponding fields.
     * This pattern adds flexibility at the cost of a little complexity.
     *
     * When a single field is validated, the whole model is validated. We just don't
     * show all the errors to the user. This way, we know if the form is still invalid,
     * even if we aren't showing the user any errors (like, pre-submit-button press).
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
    changed: Writable<boolean>;
    loading: Writable<boolean>;
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
    on_events: OnEvents;
    clear_errors_on_events: OnEvents;
    link_fields_to_model: LinkOnEvent;
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
    template?: string | typeof SvelteComponentDev | typeof SvelteComponent | typeof SvelteComponent;
    /**
     * Determines the ordering of this.fields.
     * Simply an array of field names (or group names or stepper names)
     * in the order to be displayed
     */
    private field_order;
    private field_names;
    /**
     * This is the model's initial state.
     * Shove the stateful_items into the inital state for a decent snapshot.
     */
    private initial_state;
    /**
     * We keep track of required fields because we let class-validator handle everything
     * except *required* (field.required)
     * So if there are no required fields, but there are errors, the form is still
     * valid. This is the mechanism to help keep track of that.
     * Keep track of the fields so we can validate faster.
     */
    private required_fields;
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
     * Data is updated IN PLACE by default.
     * Reinitialize is set to false, by default.
     *
     * Inital State is not updated by default.
     */
    loadData: <T extends ModelType>(data: T, reinitialize?: boolean, update_initial_state?: boolean) => Form<ModelType>;
    /**
     * Pass in the reference data to add options to fields.
     */
    attachRefData: (refs?: RefData) => void;
    /**
     * Validate the form!
     * You can pass in callbacks as needed.
     * Callbacks can be called "before" or "after" validation.
     */
    validate: (callbacks?: ValidationCallback[]) => Promise<ValidationError[]> | undefined;
    /**
     * Validate the form!
     * You can pass in callbacks as needed.
     * Callbacks can be called "before" or "after" validation.
     */
    validateAsync: (callbacks?: ValidationCallback[]) => Promise<ValidationError[] | undefined>;
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
    setFieldOrder: (order: string[]) => void;
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
