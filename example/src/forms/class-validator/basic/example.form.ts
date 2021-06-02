import { get, Writable, writable } from "svelte/store";
import {
  Form,
  OnEvents,
  RefData,
  ValidationCallback,
  ValidationError,
} from "@formvana";
import { ExampleModel } from "../../../models/ExampleClass";
import { validate, ValidationError as VError } from "class-validator";
import ExampleTemplate from "../../../templates/ExampleTemplate.svelte";

const ref_data: RefData = {
  statuses: [
    {
      label: "ACTIVE",
      value: 0,
    },
    {
      label: "PENDING",
      value: 1,
    },
    {
      label: "SUSPENDED",
      value: 2,
    },
    {
      label: "ARCHIVED",
      value: 3,
    },
  ],
};

/** Can pass this function and form still works, albeit without validation. */
async function vali(model: any, options: any): Promise<ValidationError[]> {
  return [];
}

/** (Optional) Tweak for better perf, if needed. */
const class_validator_options = {
  skipMissingProperties: false,
  dismissDefaultMessages: false,
  validationError: {
    target: false,
    value: false,
  },
  forbidUnknownValues: true,
  stopAtFirstError: true,
};

const validator = async (model, options) => {
  return validate(model, options).then((errors: VError[]) => {
    return errors.map((error) => {
      // console.log(error.property === "status_97");

      return new ValidationError(error.property, error.constraints);
    });
  });
};

function initStore() {
  // Set up the form(vana) object
  let form = new Form(
    new ExampleModel(),
    {
      validator: validator,
      on_events: new OnEvents({ focus: false }),
      ...class_validator_options,
    },
    /** Partial Form Model Properties */
    {
      template: ExampleTemplate,
      refs: ref_data,
      hidden_fields: ["description_3"],
      disabled_fields: ["email_2", "email_8"],
    }
  );

  // And add it to the store...
  const { subscribe, update, set } = writable(form);

  return {
    set,
    update,
    subscribe,
  };
}

/**
 * Export the Form State
 */
export const form_state: Writable<Form<ExampleModel>> = initStore();

let initialized = false;
/**
 * Used to initialize the form on first load.
 */
export const init = () => {
  if (!initialized) {
    // get(form_state).loading.set(true);

    // setTimeout(() => {
    //   get(form_state).loading.set(false);
    // }, 1000);

    setTimeout(() => {
      const callbacks: ValidationCallback[] = [
        // {
        //   callback: () => {
        //     console.log(get(form_state));
        //   },
        //   when: "after",
        // },
        {
          callback: () => {
            get(form_state).setValue("name_100", "some value jfkdsalfjdsk");
          },
          when: "before",
        },
      ];
      get(form_state).validate(callbacks);
    }, 2000);

    setTimeout(() => {
      get(form_state).updateInitialState();
    }, 3000);

    // get(form_state).value_changes.subscribe((val) => {
    //   console.log("CHANGE: ", val);
    // });

    /**
   * Update form with backend data
   * 
        getDBO(SOME_STATE.ITEM_ID).then((data) => {
        const form = get(form_state).loadData(new ExampleModel(data));
      
        OR
      
        const form = get(form_state).loadData(data, false);

        form_state.updateState({ form: form });
      });
   */

    initialized = true;
  }
};

export const onSubmit = (ev) => {
  console.log("SUBMIT: ", ev);
  console.log(get(form_state));

  // form_state.setLoading(true);

  // updateDBO(get(form_state).model).then((model) => {
  //     get(form_state).loadData(model, false);
  //     form_state.updateState({model: new ExampleModel(model)})
  //     form_state.setLoading(false);
  // });
};
