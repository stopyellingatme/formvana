import { Writable } from "svelte/store";
import { SvelteComponent, SvelteComponentDev } from "svelte/internal";
import { FieldConfig } from ".";
import { RefData, ValidationError, ValidationCallback, Callback, ValidationOptions, InitialFormState } from "./Types";
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
 * @TODO Time to redo the readme.md file! Lots have changed since then!
 *
 * @TODO Create easy component/pattern for field groups and stepper/wizzard
 *
 * @TODO Do the stepper example and clean up the Form Manager interface
 * @TODO More robust testing with different input types
 * @TODO Add several plain html/css examples (without tailwind)
 * @TODO Clean up form control creation/binding - too complex, currently.
 *
 *
 *
 * @TODO Make a use:Form directive that grabs the fields by name and adds the
 * relevant listeners and hookups. This will remove the need for value:binding
 * and on:event shit.
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
 *
 * Functions are camelCase.
 * Variables and stores are snake_case.
 * Everyone will love it.
 *
 */
export declare class Form<ModelType extends Object> {
    #private;
    constructor(model: ModelType, validation_options: Partial<ValidationOptions>, form_properties?: Partial<Form<ModelType>>);
    /**
     * This is your form Model/Schema.
     * Used to build the form.fields.
     */
    model: ModelType;
    /**
     * Fields are built using model's reflection metadata.
     * Or using an array of field configuration objects.
     */
    fields: Array<FieldConfig<ModelType>>;
    /**
     * Errors are attached to their corresponding fields.
     * This pattern adds flexibility at the cost of a little complexity and object size.
     *
     * When a single field is validated, the whole model is validated (if
     * using class-validator).
     * We just don't show all the errors to the user.
     * This way, we know if the form is still invalid, even if we aren't
     * showing the user any errors (like, pre-submit-button press).
     */
    errors: ValidationError[];
    /**
     * validation_options contains the logic and configuration for
     * validating the form as well as linking errors to fields.
     * If you're using class-validator, just pass in the validate func
     */
    validation_options: ValidationOptions;
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
     * * The template/component must accept {form} prop
     *
     * Note: add ` types": ["svelte"] ` to tsconfig compilerOptions
     * to remove TS import error of .svelte files (for your template)
     */
    template?: string | typeof SvelteComponentDev | typeof SvelteComponent | typeof SvelteComponent;
    /**
     * Optional field layout, if you aren't using a class object.
     * "no-class" method of building the fields.
     */
    field_schema?: Record<string, Partial<FieldConfig<Object>>>;
    /**
     * refs hold any reference data you'll be using in the form
     * e.g. seclet dropdowns, radio buttons, etc.
     *
     * If you did not set the model in constructor:
     * Call attachRefData() to link the data to the respective field
     *
     * * Format:
     * * Record<ref_key: string, Array<{label: string, value: any, data?: any}>>
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
     * It's only initial model and errors.
     * We're keeping this simple.
     */
    initial_state: InitialFormState<ModelType>;
    /** Use the NAME of the field (field.name) to disable/hide the field. */
    hidden_fields?: Array<keyof ModelType>;
    /** Use the NAME of the field (field.name) to disable/hide the field. */
    disabled_fields?: Array<keyof ModelType>;
    /**
     * Any extra data you may want to pass around.
     * @examples description, name, type, header, label, classes, etc.
     *
     * * If you're using the field.for_form propery, set form name here.
     */
    meta?: Record<string, string | number | boolean | Object>;
    /**
     * Builds the fields from the model.
     * Builds the field configs via this.model using metadata-reflection.
     * Or via validation_options.field_shcema
     */
    buildFields: (model?: ModelType) => void;
    /**
     * * useForm
     *
     * Create a function that takes a form node and sets up all the fields
     * with names attached.
     * This will also allow for easy mechanism to attach errors in a
     * plug-and-play manner.
     *
     * Also allows for a better single source of truth for data input.
     */
    useForm: (node: HTMLFormElement) => void;
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
    /** If want to (in)validate a specific field for any reason */
    validateField: (field_name: keyof ModelType, with_message?: string | undefined, callbacks?: ValidationCallback[] | undefined) => void;
    /**
     * Attach a callback to a field or array of fields.
     * If the callback if type ValidationCallback it will be added
     * to the validation handler
     */
    attachCallbacks: (event: keyof HTMLElementEventMap, callback: Callback | ValidationCallback, field_names: keyof ModelType | Array<keyof ModelType>) => void;
    /** Clear ALL the errors. */
    clearErrors: () => void;
    /** Get Field by name */
    get: <T extends ModelType>(field_name: keyof T) => FieldConfig<T>;
    /**
     * Load new data into the form and build the fields.
     * Data is updated IN PLACE by default.
     * Reinitialize is set to false, by default.
     *
     * Inital State is not updated by default.
     */
    loadModel: <T extends ModelType>(model: T, reinitialize?: boolean, update_initial_state?: boolean) => Form<ModelType>;
    /**
     * Set the value for a field or set of fields.
     * Sets both field.value and model value.
     */
    setValue: (field_names: Array<keyof ModelType> | keyof ModelType, value: any) => void;
    /**
     * Pass in the reference data to add options to fields.
     */
    attachRefData: (refs?: RefData | undefined) => void;
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
