import { Writable } from "svelte/store";
import { SvelteComponent, SvelteComponentDev } from "svelte/internal";
import { FieldConfig } from ".";
import { RefData, ValidationError, ValidationCallback, Callback, ValidationOptions, InitialFormState } from "./types";
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
 *  - Tested on late 2014 mbp - 2.5ghz core i7, 16gb ram
 *
 *
 * @TODO Create FormManager interface for dealing with FormGroup and FormStepper classes
 * @TODO Create easy component/pattern for field groups and stepper/wizzard
 *
 * @TODO Allow fields, model and validator to be passed in separately.
 *  - This will allow for a more "dynamic" form building experience
 */
/**
 * Formvana Form Class
 *
 * Main Concept: fields and model are separate.
 * Fields are built using the model, via the @field() decorator.
 * We keep the fields and the model in sync via your model property names
 * and field[name].
 *
 * Form is NOT valid, initially.
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
    fields: FieldConfig<ModelType>[];
    /**
     * validation_options contains the logic and configuration for
     * validating the form as well as linking errors to fields.
     * If you're using class-validator, just pass in the validate func
     */
    validation_options: ValidationOptions;
    /**
     * Errors are attached to their corresponding fields.
     * This pattern adds flexibility at the cost of a little complexity.
     *
     * When a single field is validated, the whole model is validated (if
     * using class-validator).
     * We just don't show all the errors to the user.
     * This way, we know if the form is still invalid, even if we aren't
     * showing the user any errors (like, pre-submit-button press).
     */
    errors: ValidationError[];
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
     * Emits value changes as a plain JS object.
     * Format: { [field.name]: value }
     *
     * Similar to Angular form.valueChanges
     */
    value_changes: Writable<Record<keyof ModelType | any, ModelType[keyof ModelType]>>;
    /**
     * This is the model's initial state.
     * Shove the stateful_items into the inital state for a decent snapshot.
     */
    initial_state: InitialFormState<ModelType>;
    /**
     * Use the NAME of the field (field.name) to disable/hide the field.
     */
    hidden_fields?: Array<keyof ModelType>;
    disabled_fields?: Array<keyof ModelType>;
    /**
     * Determines the ordering of this.fields.
     * Simply an array of field names (or group names or stepper names)
     * in the order to be displayed
     *
     */
    private field_order?;
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
     * @TODO Allow plain JSON model, fields and schema validation/setup
     */
    private buildFields;
    /**
     * ATTACH TO SAME ELEMENT AS FIELD.NAME {name}!
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
        name: keyof ModelType;
    }) => void;
    /**
     * Validate the form!
     * You can pass in callbacks as needed.
     * Callbacks can be called "before" or "after" validation.
     */
    validate: (callbacks?: ValidationCallback[] | undefined) => Promise<ValidationError[]> | undefined;
    /**
     * Validate the form!
     * You can pass in callbacks as needed.
     * Callbacks can be applied "before" or "after" validation.
     */
    validateAsync: (callbacks?: ValidationCallback[] | undefined) => Promise<ValidationError[] | undefined>;
    /** If want to (in)validate a specific field for any reason */
    validateField: (field_name: keyof ModelType, withMessage?: string | undefined, callbacks?: ValidationCallback[] | undefined) => void;
    /**
     * Attach a callback to a field or array of fields.
     * If the callback if type ValidationCallback it will be added
     * to the validation handler
     */
    attachCallbacks: (event: keyof HTMLElementEventMap, callback: Callback | ValidationCallback, field_names: keyof ModelType | Array<keyof ModelType>) => void;
    /** Clear ALL the errors. */
    clearErrors: () => void;
    /** Get Field by name */
    get: (field_name: keyof ModelType) => FieldConfig<ModelType>;
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
     *! Make sure to call this when the component is unloaded/destroyed
     * Removes all event listeners and clears the form state.
     */
    destroy: () => void;
    /** Resets to the inital state of the form. */
    reset: () => void;
    /** Well, this updates the initial state of the form. */
    updateInitialState: () => void;
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
