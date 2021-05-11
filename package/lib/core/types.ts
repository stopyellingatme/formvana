import { Form } from ".";

/**
 * I'm using strings here for easier comparison.
 */
export type InitialFormState<ModelType extends Object> = {
  model: ModelType | undefined;
  errors: ValidationError[] | undefined;
};

/**
 * Base interface for managing multiple instances of Form
 * classes.
 *
 * TODO: Class for FormGroup and FormStepper
 */
export interface FormManager {
  forms: Form<typeof Form>[];
  
}



//#region Validation

export interface ValidationCallback {
  callback: Callback;
  /**
   * When should the callback fire?
   * "before" or "after" validation?
   */
  when: "before" | "after";
}

export type ValidatorFunction = (...args: any[]) => Promise<ValidationError[]>;

export interface ValidationErrorType {
  target?: Object; // Object that was validated.
  property: string; // Object's property that didn't pass validation.
  value?: any; // Value that didn't pass a validation.
  constraints?: {
    // Constraints that failed validation with error messages.
    [type: string]: string;
  };
  children?: ValidationErrorType[];
}

export class ValidationError {
  /**
   * @param errors essentially Record<string #1, string #2>
   * with #1 being the name of the error constraint
   * and #2 being the error message
   * @param model_property_key, which model field are we linking this to?
   * @param options, anything else part of the ValidationErrorType
   */
  constructor(
    model_property_key?: string,
    errors?: { [type: string]: string },
    options?: Partial<ValidationErrorType>
  ) {
    if (model_property_key) this.property = model_property_key;
    if (errors) {
      this.constraints = errors;
    }
    if (options) {
      let k: keyof typeof options;
      for (k in options) {
        this[k] = options[k];
      }
      // Object.keys(this).forEach((key) => {
      //   this[key] = options[key];
      // });
    }
  }

  target?: Object; // Object that was validated.
  property?: string; // Object's property that didn't pass validation.
  value?: any; // Value that didn't pass a validation.
  constraints?: {
    // Constraints that failed validation with error messages.
    [type: string]: string;
  };
  children?: ValidationErrorType[];
}

export interface ValidationOptions {
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
  field_error_link_name: keyof ValidationError;
}

/**
 * Options passed to validator during validation.
 * Note: this interface used by class-validator
 */
export interface ValidatorOptions extends Record<string, unknown> {
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
export class OnEvents {
  constructor(init?: Partial<OnEvents>, disableAll: boolean = false) {
    // If disableAll is false, turn off all event listeners
    if (disableAll) {
      let k: keyof OnEvents | string;
      for (k in this) {
        this[k as keyof OnEvents] = false;
      }
    }
    Object.assign(this, init);
  }

  blur: boolean = true;
  change: boolean = true;
  click: boolean = false;
  dblclick: boolean = false;
  focus: boolean = true;
  input: boolean = true;
  keydown: boolean = false;
  keypress: boolean = false;
  keyup: boolean = false;
  mount: boolean = false;
  mousedown: boolean = false;
  mouseenter: boolean = false;
  mouseleave: boolean = false;
  mousemove: boolean = false;
  mouseout: boolean = false;
  mouseover: boolean = false;
  mouseup: boolean = false;
  submit: boolean = true;
}

/**
 * Should we link the values always?
 * Or only if the form is valid?
 */
export type LinkOnEvent = "always" | "valid";

export type LinkValuesOnEvent = "all" | "field";

//#endregion

//#region Misc
export type Callback = ((...args: any[]) => any) | (() => any);

/**
 * Data format for the reference data items
 * Form.refs are of type Record<string, RefDataItem[]>
 */
export interface RefDataItem {
  label: string;
  value: any;
  data?: any;
}

export type RefData = Record<string, RefDataItem[]>;

export type FieldAttributes = Record<Partial<ElementAttributesMap>, any>;

export type ElementAttributesMap =
  | (keyof HTMLElement &
      keyof HTMLInputElement &
      keyof HTMLImageElement &
      keyof HTMLFieldSetElement &
      keyof HTMLAudioElement &
      keyof HTMLButtonElement &
      keyof HTMLCanvasElement &
      keyof HTMLFormElement &
      keyof HTMLSelectElement &
      keyof HTMLOptionElement)
  | string;

//#endregion
