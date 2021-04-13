import { ValidatorOptions } from "class-validator/types";
import { ValidationError } from "class-validator";
import { Writable } from "svelte/store";
import { FieldConfig } from ".";
import { RefDataItem, OnEvents, LinkOnEvent } from "./types";
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
 * TODO: what if they want to add their own event listeners (on specific fields)?
 * TODO: Break up form properties and functions (FormProperties & FormApi)
 * TODO: Add a changes (value changes) observable
 */
export declare class Form {
    constructor(model: any, init?: Partial<Form>);
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
    readonly validate_on_events: OnEvents;
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
     * Build the field configs from this.model using metadata-reflection.
     * More comments inside...
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
     */
    useField: (node: HTMLElement) => void;
    /**
     * Load new data into the form and build the fields.
     * Useful if you fetched data and need to update the form values.
     *
     * Fresh defaults to True. So the default is to pass in a new instance
     * of the model (e.g. new ExampleMode(incoming_data)).
     * If fresh is False then the incoming_data will be serialized into
     * the model.
     *
     * State is updated upon data load, by default.
     *
     * Check example.form.ts for an example use case.
     */
    loadData: (data: any, freshModel?: boolean, updateInitialState?: boolean) => Form;
    /**
     * Just pass in the reference data and let the field configs do the rest.
     *
     * * Ref data MUST BE in format: Record<string, RefDataItem[]>
     */
    attachRefData: (refs?: Record<string, RefDataItem[]>) => void;
    /**
     * Well, validate the form!
     * Clear the errors first, then do it, obviously.
     */
    validate: () => Promise<ValidationError[]>;
    validateAsync: () => Promise<void>;
    /**
     * If wanna invalidate a specific field for any reason.
     */
    invalidateField: (field_name: string, message?: string) => void;
    /**
     * * Use this if you're trying to update the layout after initialization.
     * Similar to this.setOrder()
     *
     * Like this:
     * const layout = ["description", "status", "email", "name"];
     * const newState = sget(formState).buildStoredLayout(formState, layout);
     * formState.updateState({ ...newState });
     */
    buildStoredLayout: (formState: Writable<any>, order: string[]) => Writable<any>;
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
    get: (fieldName: string) => FieldConfig;
    /**
     * Generate a Svelte Store from the current "this".
     */
    storify: () => Writable<Form>;
    clearErrors: () => void;
    /**
     *! Make sure to call this when the component is unloaded/destroyed
     * Removes all event listeners and clears the form state.
     */
    destroy: () => void;
    reset: () => void;
    updateInitialState: () => void;
    /**
     * Validate the field!
     * This is  attached to the field:
     * useField -> attachOnValidateEvents(node) ->  validateField
     */
    private validateField;
    private handleValidation;
    /**
     * Using this.field_order, rearrange the order of the fields.
     */
    private createOrder;
    private clearState;
    /**
     * Grab a snapshot of several items that generally define the state of the form
     * and serialize them into a format that's easy-ish to check/deserialize (for resetting)
     */
    private setInitialState;
    /**
     * This one's kinda harry.
     * But it resets the form to it's initial state.
     */
    private resetState;
}
