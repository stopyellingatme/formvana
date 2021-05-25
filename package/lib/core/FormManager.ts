import { get, writable, Writable } from "svelte/store";
import { Form } from "./Form";

type FormDictionary = Record<number | string, Form<Object>>;

/**
 * Base interface for managing multiple instances of Form
 * classes.
 *
 * @TODO Class for FormGroup and FormStepper
 */
export class FormManager {
  constructor(forms: FormDictionary, props?: Partial<FormManager>) {
    if (forms) this.forms = forms;
    if (props) Object.assign(this, props);
  }

  /** Collection of Forms */
  forms: FormDictionary = {};

  /** Are all of the forms valid? */
  public get all_valid(): Writable<boolean> {
    /** Set all_valid = true, then check if any forms are invalid */
    let valid = true,
      k: keyof FormDictionary;
    for (k in this.forms) {
      /** If even one of them is invalid, set all_valid to false */
      if (!get(this.forms[k].valid)) {
        valid = false;
      }
    }
    return writable(valid);
  }

  /** Get the Form given the identifier */
  get = (form_index: keyof FormDictionary) => {
    return this.forms[form_index];
  };

  /** Validate a given form, a number of forms, or all forms */
  validateAll = (form_indexes?: number[]): void => {
    if (form_indexes) {
      form_indexes.forEach((index) => {
        this.forms && this.forms[index].validate();
      });
    } else {
      let k: keyof FormDictionary;
      for (k in this.forms) {
        this.forms[k].validate();
      }
    }
  };
}

/**
 * Group of Forms which extends the FormManager functionality.
 */
export class FormGroup extends FormManager {
  constructor(forms: FormDictionary, props?: Partial<FormManager>) {
    super(forms, props);
  }
}

/**
 * Collection of Forms used to manage as steps.
 * @example a data collection wizard with many fields or whatever
 */
export class FormStepper extends FormManager {
  constructor(forms: FormDictionary, props?: Partial<FormManager>) {
    super(forms, props);
  }

  active_step: number | string = 0;
}
