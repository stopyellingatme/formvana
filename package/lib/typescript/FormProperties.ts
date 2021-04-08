import { ValidatorOptions } from "class-validator/types";
import { ValidationError } from "class-validator";
import { writable, Writable } from "svelte/store";
import { FieldConfig } from ".";
import { RefDataItem, OnEvents, LinkOnEvent } from "./common";

export class FormProperties {
  /**
   * This is your form Model/Schema.
   * TODO: Definite candidate for Mapped Type
   *
   * (If you didn't set the model in the constructor)
   * When model is set, call buildFields() to build the fields.
   */
  model: any = null;

  /**
   * Fields are built from the model's metadata using reflection.
   * If model is set, call buildFields().
   */
  fields: FieldConfig[] = [];

  /**
   * refs hold any reference data you'll be using in the form
   * e.g. seclet dropdowns, radio buttons, etc.
   *
   * If you did not set the model in constructor:
   * Call attachRefData() to link the data to the respective field
   *
   * * Fields & reference data are linked via field.ref_key
   */
  refs: Record<string, RefDataItem[]> = null;

  /**
   * Determines the ordering of this.fields.
   * Simply an array of field names (or group names or stepper names)
   * in the order to be displayed
   */
  field_order: string[] = [];

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
  template: any = null;

  /**
   * Validation options come from class-validator ValidatorOptions.
   *
   * Biggest perf increase comes from setting validationError.target = false
   * (so the whole model is not attached to each error message)
   */
  validation_options: ValidatorOptions = {
    skipMissingProperties: false,
    whitelist: false,
    forbidNonWhitelisted: false,
    dismissDefaultMessages: false,
    groups: [],
    validationError: {
      target: false,
      value: false,
    },
    forbidUnknownValues: true,
    stopAtFirstError: false,
  };

  /**
   * The errors are of type ValidationError which comes from class-validator.
   * Errors are usually attached to the fields which the error is for.
   * This pattern adds flexibility at the cost of a little complexity.
   */
  errors: ValidationError[] = [];

  /**
   * These next properties are all pretty self-explanatory.
   *
   * this.valid is a svelte store so we can change the state of the variable
   * inside of the class and it (the change) will be reflected
   * in the external form context.
   */
  valid: Writable<boolean> = writable(false);
  loading: Writable<boolean> = writable(false);
  changed: Writable<boolean> = writable(false);
  touched: Writable<boolean> = writable(false);

  /**
   * Use the NAME of the field (field.name) to disable/hide the field.
   */
  hidden_fields: string[] = [];
  disabled_fields: string[] = [];

  // Which events should the form be validated on?
  validate_on_events: OnEvents = new OnEvents();
  // Which events should we clear the field errors on?
  clear_errors_on_events: OnEvents = new OnEvents({}, true);

  // When to link this.field values to this.model values
  link_fields_to_model: LinkOnEvent = LinkOnEvent.Always;

  // Used to make checking for disabled/hidden fields faster
  // private field_names: string[] = [];

  /**
   * This is the model's initial state.
   * Shove the stateful_items into the inital state for a decent snapshot.
   */
  private initial_state: any = {};
  private initial_state_str: string = null;
  private stateful_items = [
    "valid",
    "touched",
    "changed",
    "errors",
    "required_fields",
    "refs",
    "field_order",
    "model",
    "hidden_fields",
    "disabled_fields",
  ];

  /**
   * We keep track of required fields because we let class-validator handle everything
   * except *required* (field.required)
   * So if there are no required fields, but there are errors, the form is still
   * valid. This is the mechanism to help keep track of that.
   * Keep track of the fields so we can validate faster.
   */
  private required_fields: string[] = [];
}
