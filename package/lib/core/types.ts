export type ValidatorFunction = (...args: any[]) => Promise<ValidationError[]>;

export type ValidationErrorType = {
  target?: Object; // Object that was validated.
  property: string; // Object's property that didn't pass validation.
  value?: any; // Value that didn't pass a validation.
  constraints?: {
    // Constraints that failed validation with error messages.
    [type: string]: string;
  };
  children?: ValidationErrorType[];
};

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
    this.property = model_property_key;
    if (errors) {
      this.constraints = errors;
    }
    if (options) {
      Object.keys(this).forEach((key) => {
        if (options[key]) this[key] = options[key];
      });
    }
  }

  target?: Object; // Object that was validated.
  property: string; // Object's property that didn't pass validation.
  value?: any; // Value that didn't pass a validation.
  constraints?: {
    // Constraints that failed validation with error messages.
    [type: string]: string;
  };
  children?: ValidationErrorType[];
}

export type Callback = ((...args: any) => any) | (() => any);

export type ValidationCallback = {
  callback: Callback;
  /**
   * When should the callback fire?
   * "before" or "after" validation?
   */
  when: "before" | "after";
};

export type LinkValuesOnEvent = "all" | "field";

export type PerformanceOptions = {
  link_all_values_on_event: LinkValuesOnEvent;
  enable_hidden_fields_detection: boolean;
  enable_disabled_fields_detection: boolean;
  enable_change_detection: boolean;
};
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
 * TODO: Possilbe candidate for Mapped Type
 */
export class OnEvents {
  constructor(init?: Partial<OnEvents>, disableAll: boolean = false) {
    // If disableAll is false, turn off all event listeners
    if (disableAll) {
      Object.keys(this).forEach((key) => {
        this[key] = false;
      });
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
// export enum LinkOnEvent {
//   Always,
//   Valid,
// }
export type LinkOnEvent = "always" | "valid";

/**
 * Data format for the reference data items
 * Form.refs are of type Record<string, RefDataItem[]>
 *
 * TODO: Possilbe candidate for Mapped Type
 */
export interface RefDataItem {
  label: string;
  value: any;
  data?: any;
}

export type RefData = Record<string, RefDataItem[]>;
