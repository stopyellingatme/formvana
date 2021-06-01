import { FieldConfig } from "../";
import { RefData } from "../internal";
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
 * I'm sure everyone will love it.
 *
 */
export declare class FormModel<ModelType extends Object> {
    #private;
    constructor(model: ModelType, form_properties?: Partial<FormModel<ModelType>>);
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
     * Any extra data you may want to pass around.
     * @examples description, name, type, header, label, classes, etc.
     *
     * * If you're using the field.for_form propery, set form name here.
     */
    meta?: Record<string, string | number | boolean | Object>;
    /**
     * Aim for "no-class" initialization model:
     *
     * take Array<Partial<FieldConfig>> &
     *
     *      validation schema &
     *
     *      JSON model
     *
     *  => Form<Object>
     *
     * Model keys must match fieldConfig name & validation schema
     * property keys.
     *
     *
     */
    /** Get Field by name */
    get: <T extends ModelType>(field_name: keyof T) => FieldConfig<T>;
    /**
     * Load new data into the form and build the fields.
     * Data is updated IN PLACE by default.
     * Reinitialize is set to false, by default.
     *
     * Inital State is not updated by default.
     */
    loadModel: <T extends ModelType>(model: T, reinitialize?: boolean) => FormModel<ModelType>;
    /**
     * Pass in the reference data to add options to fields.
     */
    attachRefData: (refs?: RefData | undefined) => void;
}
