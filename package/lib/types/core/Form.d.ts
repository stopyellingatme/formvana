import { SvelteComponent, SvelteComponentDev } from "svelte/internal";
import { Writable } from "svelte/store";
import { FieldConfig } from "./FieldConfig";
import { Callback, FieldNode, FormFieldSchema, InitialFormState, OnEvents, ReferenceData, ValidationCallback, ValidationError, ValidationProperties } from "./Types";
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
 * Use one of the Form Manager interfaces if applicable.
 *  - Tested on late 2014 mbp - 2.5ghz core i7, 16gb ram
 *
 * @TODO Time to redo the readme.md file! Lots have changed since then!
 *
 * @TODO Add more superstruct examples for each form type (this should show how easy the template pattern really is)
 * @TODO Add that aggressive/lazy/passive validation thing.
 * @TODO Strip out all svelte (or as much as possible) and use vanilla variables
 *    instead of writable stores
 *
 * @TODO Add debug mode to inspect event listeners and form state snapshots
 *
 */
export declare function newForm<ModelType extends Object>(model: ModelType, validation_options?: Partial<ValidationProperties<ModelType>>, form_properties?: Partial<Form<ModelType>>): Writable<Form<ModelType>>;
/**
 * ---------------------------------------------------------------------------
 * Formvana Form Class
 *
 * Main Concept: fields and model are separate.
 * Fields are built from the model, via the @field() decorator.
 * We keep the fields and the model in sync via model property names
 * and field[name].
 *
 * Form is NOT initially valid.
 *
 * Functions are camelCase.
 * Variables and stores are snake_case.
 * Everyone will love it.
 *
 * ---------------------------------------------------------------------------
 */
export declare class Form<ModelType extends Object> {
    #private;
    constructor(model: ModelType, validation_options?: Partial<ValidationProperties<ModelType>> | Object, form_properties?: Partial<Form<ModelType>>);
    /**
     * HTML Node of form object.
     */
    node?: HTMLFormElement;
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
     * This pattern adds flexibility at the cost of a little complexity and
     * object size.
     *
     * When a single field is validated, the whole model is validated (if
     * using class-validator).
     * We don't show all the errors to the user, only the field emmiting the
     * event.
     * This way, we know if the form is still invalid, even if we aren't
     * showing the user any errors (like, pre-submit-button press).
     */
    errors: ValidationError[];
    /**
     * validation_options contains the logic and configuration for
     * validating the form as well as linking errors to fields
     * and displaying the errors
     */
    validation_options?: ValidationProperties<ModelType>;
    /** Which events should the form dispatch side effects? */
    on_events: OnEvents<HTMLElementEventMap>;
    /** Is the form valid? */
    valid: Writable<boolean>;
    /** Has the form state changed from it's initial value? */
    changed: Writable<boolean>;
    /** Has the form been altered in any way? */
    pristine: Writable<boolean>;
    /** Is the form loading? */
    loading: Writable<boolean>;
    /**
     * refs hold any reference data you'll be using in the form
     *
     * Call attachReferenceData() to link reference data to form or pass it
     * via the constrictor.
     *
     * Fields & reference data are linked via field.ref_key
     *
     * * Format:
     * * {[ref_key]: string, Array<{[label]: string, [value]: any, [data]?: any}>}
     *
     * @UseCase seclet dropdowns, radio buttons, etc.
     */
    refs?: ReferenceData;
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
     * This is the form's initial state.
     * It's only initial model and errors.
     * We're keeping this simple.
     */
    initial_state: InitialFormState<ModelType>;
    /**
     * Emits value changes as a plain JS object.
     * Format: { [field.name]: value }
     *
     * Very similar to Angular form.valueChanges
     */
    value_changes: Writable<Record<keyof ModelType | any, ModelType[keyof ModelType]>>;
    /**
     * Optional field layout, if you aren't using a class object.
     * "no-class" method of building the fields.
     */
    field_schema?: FormFieldSchema;
    /**
     * This allows you to filter fields based on a given form name.
     *
     * @example user model can be used for login and signup
     * @example for_form="login" && for_form="signup"
     */
    for_form?: string;
    /**
     * Any extra data you may want to pass around.
     * @examples description, name, type, header, label, classes, etc.
     */
    meta?: Record<string, any>;
    /** Use the NAME of the field (field.name) to disable/hide the field. */
    hidden_fields?: Array<keyof ModelType>;
    /** Use the NAME of the field (field.name) to disable/hide the field. */
    disabled_fields?: Array<keyof ModelType>;
    /**
     * Builds the fields from the model.
     * Builds the field configs via this.model using metadata-reflection.
     * Or via form.field_shcema
     */
    buildFields: (model?: ModelType) => void;
    /**
     * * Required for form setup.
     *
     * ATTACH TO SAME ELEMENT AS FIELD.NAME {name}!
     * This hooks up the event listeners!
     *
     * Used to grab fields and attach event listeners to each field.
     * Simply loop over the model, checking the form's node
     * for each model[name]. If a field element is found, then
     * attach on_event listeners to the given field.
     *
     * This is for Svelte's "use:FUNCTION" feature.
     * The "use" directive passes the HTML Node as a parameter
     * to the given function (e.g. use:useField(node: HTMLElement)).
     */
    useForm: (node: HTMLFormElement) => void;
    /**
     * This is used to hook up event listeners to a field.
     *
     * You can also use this to add form controls to the Form class.
     * @example form control is outside of the form element so
     * use:useField is added to the element to hook enent listens into it,
     * same as all other controls inside the form element
     */
    useField: (node: FieldNode<ModelType>) => void;
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
    attachReferenceData: (refs?: ReferenceData | undefined) => void;
    /**
     *! Make sure to call this when the component is unloaded/destroyed
     * Removes all event listeners.
     */
    destroy: () => void;
    /**
     * Resets to the inital state of the form.
     *
     * Only model and errors are saved in initial state.
     */
    reset: () => void;
    /** Well, this updates the initial state of the form. */
    updateInitialState: () => void;
    getFieldGroups: () => Array<FieldConfig<ModelType> | Array<FieldConfig<ModelType>>>;
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
