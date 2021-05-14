import { Writable } from "svelte/store";
import { SvelteComponent, SvelteComponentDev } from "svelte/internal";
import { FieldConfig } from ".";
import { OnEvents, LinkOnEvent, RefData, ValidationError, ValidationCallback, Callback, ValidationOptions, InitialFormState } from "./types";
/**
 * * Recommended Use:
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
 *  - Tested on late 2014 mbp - 2.5ghz core i7, 16gb ram
 *
 *
 * TODO: Create FormManager interface for dealing with FormGroup and FormStepper classes
 * TODO: Create easy component/pattern for field groups and stepper/wizzard
 *
 * TODO: Allow fields, model and validator to be passed in separately.
 *  - This will allow for a more "dynamic" form building experience
 */
/**
 * Formvana - Form Class
 * Form is NOT valid, initially.
 *
 * Main Concept: fields and model are separate.
 * Fields are built using the model, via the @field() decorator.
 * We keep the fields and the model in sync via your model property names
 * and field[name].
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
     * validation_options contains the logic and configuration for
     * validating the form as well as linking errors to fields.
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
    pristine: Writable<boolean>;
    loading: Writable<boolean>;
    /**
     * Emits value changes as a plain JS object.
     * Format: { [field.name]: value }
     *
     * Similar to Angular form.valueChanges
     */
    value_changes: Writable<Record<string, any>>;
    /**
     * This is the model's initial state.
     * Shove the stateful_items into the inital state for a decent snapshot.
     */
    initial_state: InitialFormState<ModelType>;
    /**
     * Which events should the form do things on?
     * (validate, link values, hide/disable fields)
     */
    on_events: OnEvents;
    link_fields_to_model: LinkOnEvent;
    /**
     * Use the NAME of the field (field.name) to disable/hide the field.
     */
    hidden_fields?: Array<FieldConfig["name"]>;
    disabled_fields?: Array<FieldConfig["name"]>;
    /**
     * Determines the ordering of this.fields.
     * Simply an array of field names (or group names or stepper names)
     * in the order to be displayed
     */
    private field_order?;
    private field_names;
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
    private buildFields;
    /**
     * ATTACH TO SAME ELEMENT AS FIELD.NAME!
     * This hooks up the event listeners!
     *
     * This is for Svelte's "use:FUNCTION" feature.
     * The "use" directive passes the HTML Node as a parameter
     * to the given function (e.g. use:useField(node: HTMLElement)).
     *
     * Use on the element that will be interacted with.
     * e.g. <input/> -- <button/> -- <select/> -- etc.
     * Check examples folder for more details.
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
    loadModel: <T extends ModelType>(model: T, reinitialize?: boolean, update_initial_state?: boolean) => Form<ModelType>;
    /**
     * Pass in the reference data to add options to fields.
     */
    attachRefData: (refs?: Record<string, import("./types").RefDataItem[]> | undefined) => void;
    /**
     * Validate the form!
     * You can pass in callbacks as needed.
     * Callbacks can be called "before" or "after" validation.
     */
    validate: (callbacks?: ValidationCallback[] | undefined) => Promise<ValidationError[]> | undefined;
    /**
     * Validate the form!
     * You can pass in callbacks as needed.
     * Callbacks can be called "before" or "after" validation.
     */
    validateAsync: (callbacks?: ValidationCallback[] | undefined) => Promise<ValidationError[] | undefined>;
    /**
     * If want to (in)validate a specific field for any reason.
     */
    validateField: (field_name: string, withMessage?: string | undefined, callbacks?: ValidationCallback[] | undefined) => void;
    /**
     * Attach a callback to a field or array of fields.
     * If the callback if type ValidationCallback it will be added
     * to the validation handler
     */
    attachCallbacks: (event: keyof HTMLElementEventMap, callback: Callback | ValidationCallback, field_names: string | string[]) => void;
    clearErrors: () => void;
    get: (field_name: string) => FieldConfig;
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
     * Set attributes on a given set of fields.
     *
     * @exapmle to hide several fields:
     * names = [field.name, field.name],
     * attributes = { hidden: true };
     */
    setFieldAttributes: (names: string | string[], attributes: Partial<FieldConfig>) => void;
}
