import { get, writable, Writable } from "svelte/store";
import { Form } from "./Form";
import { ValidationCallback } from "./types";

type FormDictionary = Array<Form<any>>;

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

    this.#getAllValueChanges();
    this.#getAllValid();
    this.#getAllChanged();
    this.#getAllPristine();
  }

  /** Collection of Forms */
  forms: FormDictionary = [];

  loading: Writable<boolean> = writable(false);

  all_value_changes: Writable<Record<string, any>> = writable({});

  all_valid: Writable<boolean> = writable(false);

  all_changed: Writable<boolean> = writable(false);

  all_pristine: Writable<boolean> = writable(false);

  #all_valid_list: Record<number, boolean> = {};
  #all_changed_list: Record<number, boolean> = {};
  #all_pristine_list: Record<number, boolean> = {};

  /** Validate a given form, a number of forms, or all forms */
  validateAll = (
    callbacks?: ValidationCallback[],
    form_indexes?: number[]
  ): void => {
    if (form_indexes) {
      form_indexes.forEach((index) => {
        this.forms && this.forms[index].validate(callbacks);
      });
    } else {
      let k: keyof FormDictionary;
      for (k in this.forms) {
        this.forms[k].validate(callbacks);
      }
    }
  };

  /** All value changes of all forms */
  #getAllValueChanges = (): void => {
    /** Set all_valid = true, then check if any forms are invalid */
    // let changes: Writable<Record<string, any>> = writable({}),
    let k: keyof FormDictionary,
      i = 0;
    for (k in this.forms) {
      const id = `form_${i}`;

      /** If even one of them is invalid, set all_valid to false */
      if (`${get(this.forms[k].value_changes)}` !== "{}") {
        const previous_changes = get(this.all_value_changes);

        if (!previous_changes[id]) {
          this.all_value_changes.set({ ...previous_changes, [id]: {} });
        }

        this.forms[k].value_changes.subscribe((_changes) => {
          const _previous_changes = get(this.all_value_changes);
          this.all_value_changes.set({ ..._previous_changes, [id]: _changes });
        });
      }

      i++;
    }
  };

  /** Are all of the forms valid? */
  #getAllValid = (): void => {
    let k: keyof FormDictionary,
      i = 0;
    for (k in this.forms) {
      const index = i;
      this.forms[k].valid.subscribe((valid) => {
        this.#all_valid_list[index] = valid;

        if (Object.values(this.#all_valid_list).includes(false)) {
          this.all_valid.set(false);
        } else {
          this.all_valid.set(true);
        }
      });
      i++;
    }
  };

  #getAllChanged = (): void => {
    let k: keyof FormDictionary,
      i = 0;
    for (k in this.forms) {
      const index = i;
      this.forms[k].changed.subscribe((valid) => {
        this.#all_changed_list[index] = valid;

        if (Object.values(this.#all_changed_list).includes(false)) {
          this.all_changed.set(false);
        } else {
          this.all_changed.set(true);
        }
      });
      i++;
    }
  };

  #getAllPristine = (): void => {
    let k: keyof FormDictionary,
      i = 0;
    for (k in this.forms) {
      const index = i;
      this.forms[k].pristine.subscribe((valid) => {
        this.#all_pristine_list[index] = valid;

        if (Object.values(this.#all_pristine_list).includes(false)) {
          this.all_pristine.set(false);
        } else {
          this.all_pristine.set(true);
        }
      });
      i++;
    }
  };
}

/**
 * Collection of Forms used as steps.
 * @example a data collection wizard with many fields or whatever
 */
export class FormStepper extends FormManager {
  constructor(forms: FormDictionary, props?: Partial<FormManager>) {
    super(forms, props);
  }

  active_step: keyof FormDictionary = 0;

  next = () => {
    if (typeof this.active_step === "number") this.active_step++;
  };

  back = () => {
    if (typeof this.active_step === "number") this.active_step--;
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
