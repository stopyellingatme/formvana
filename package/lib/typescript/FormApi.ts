// import { ValidatorOptions } from "class-validator/types";
// import { ValidationError, validate, validateOrReject } from "class-validator";
// import { get, writable, Writable } from "svelte/store";
// import { FieldConfig } from ".";
// import { RefDataItem, OnEvents, LinkOnEvent } from "./common";
// import { FormProperties } from "./FormProperties";

// /**
//  * TODO: Decouple error-ed methods with their private properties.
//  */
// export class FormInternalApi extends FormProperties {
//   constructor() {
//     super();
//   }

//   /**
//    * Validate the field!
//    * This is  attached to the field:
//    * useField -> attachOnValidateEvents(node) ->  validateField
//    */
//   private validateField = (field: FieldConfig): Promise<void> => {
//     // Link the input from the field to the model.
//     this.link_fields_to_model === LinkOnEvent.Always && this.linkValues(true);
//     this._hideFields(), this._disableFields();
//     // this.link_fields_to_model === LinkOnEvent.Always &&
//     // this.linkFieldValue(field);

//     // Return class-validator validate() function.
//     // Validate the model with given validation config.
//     return validate(this.model, this.validation_options).then(
//       (errors: ValidationError[]) => {
//         this.handleValidation(true, errors, field);
//       }
//     );
//   };

//   // Clears everything before being destoryed.
//   private clearState = (): void => {
//     this.model = null;
//     this.initial_state = {};
//     this.required_fields = [];
//     this.refs = null;
//     this.template = null;
//   };

//   /**
//    * Grab a snapshot of several items that generally define the state of the form
//    * and serialize them into a format that's easy-ish to check/deserialize (for resetting)
//    */
//   private setInitialState = (): void => {
//     /**
//      * This is the best method for reliable deep-ish cloning that I've found.
//      * If you know a BETTER way, be my guest. No extra dependencies please.
//      */
//     this.stateful_items.forEach((key) => {
//       if (key === "valid" || key === "touched" || key === "changed") {
//         get(this[key])
//           ? (this.initial_state[key] = writable(true))
//           : (this.initial_state[key] = writable(false));
//       } else {
//         this.initial_state[key] = JSON.parse(JSON.stringify(this[key]));
//       }
//       this.initial_state_str = JSON.stringify(this.initial_state);
//     });
//   };

//   /**
//    * This one's kinda harry.
//    * But it resets the form to it's initial state.
//    */
//   private resetState = (): void => {
//     this.stateful_items.forEach((key) => {
//       if (key === "valid" || key === "touched" || key === "changed") {
//         // Check the inital_state's key with the svelte store get() method
//         get(this.initial_state[key])
//           ? this[key].set(true)
//           : this[key].set(false);
//       } else if (key === "errors") {
//         // Clear the errors so we don't have leftovers all over the place
//         this.clearErrors();
//         // Attach errors located in initial_state (to this.errors)
//         this[key] = this.initial_state[key].map((e) => {
//           // Create new ValidationError to match the class-validator error type
//           let err = new ValidationError();
//           Object.assign(err, e);
//           return err;
//         });
//         // If this.errors is not empty then attach the errors to the fields
//         if (this[key] && this[key].length > 0) {
//           this.linkErrors();
//         }
//       } else if (key === "model") {
//         /**
//          * We have to disconnect the initial_state's model so that we don't get
//          * burned by reference links.
//          * We also don't want to overwrite the actual model, because it contains
//          * all the metadata for validation, feilds, etc.
//          * So we just copy the inital_state[model] and shove it's values back into
//          * this.model.
//          * That way when we reset the form, we still get validation errors from the
//          * model's decorators.
//          */
//         const m_state = JSON.parse(JSON.stringify(this.initial_state[key]));
//         Object.keys(this[key]).forEach((mkey) => {
//           this[key][mkey] = m_state[mkey];
//         });
//         this.linkValues(false);
//       } else {
//         this[key] = JSON.parse(JSON.stringify(this.initial_state[key]));
//       }
//     });
//   };

//   /**
//    * TODO: Clean up this arfv implementation. Seems too clunky.
//    *
//    * Check if there are any required fields in the errors.
//    * If there are no required fields in the errors, the form is valid
//    */
//   private requiredFieldsValid = (errors: ValidationError[]): boolean => {
//     if (errors.length === 0) return true;
//     // Go ahead and return if there are no errors
//     let i = 0,
//       len = this.required_fields.length;
//     // If there are no required fields, just go ahead and return
//     if (len === 0) return true;
//     // Otherwise we have to map the names of the errors so we can
//     // check if they're for a required field
//     const errs = errors.map((e) => e.property);
//     for (; len > i; ++i) {
//       if (errs.includes(this.required_fields[i])) {
//         return false;
//       }
//     }
//     return true;
//   };

//   private handleValidation = (
//     isField: boolean = true,
//     errors: ValidationError[],
//     field?: FieldConfig
//   ): void => {
//     // There are errors!
//     if (errors.length > 0) {
//       this.errors = errors;

//       // Are we validating the whole form or just the fields?
//       if (isField) {
//         // Link errors to field (to show validation errors)
//         this.linkFieldErrors(errors, field);
//       } else {
//         // This is validatino for the whole form!
//         this.linkErrors(errors);
//       }

//       // TODO: Clean up this arfv implementation. Seems too clunky.
//       // All required fields valid (arfv)
//       const arfv = this.requiredFieldsValid(errors);

//       if (arfv) {
//         this.valid.set(true);
//       } else {
//         this.valid.set(false);
//       }
//     } else {
//       // We can't get here unless the errors we see are for non-required fields

//       // If the config tells us to link the values only when the form
//       // is valid, then link them here.
//       this.link_fields_to_model === LinkOnEvent.Valid && this.linkValues(true);
//       this.valid.set(true); // Form is valid!
//       this.clearErrors(); // Clear form errors
//     }
//     // Check for changes
//     this.hasChanged();
//   };

//   // Link values from FIELDS toMODEL or MODEL to FIELDS
//   private linkValues = (fromFieldsToModel: boolean): void => {
//     // Still the fastest way i've seen to loop in JS.
//     let i = 0,
//       len = this.fields.length;
//     for (; len > i; ++i) {
//       // Get name and value of the field
//       const name = this.fields[i].name,
//         val = this.fields[i].value;
//       if (fromFieldsToModel) {
//         // Link field values to the model
//         this.model[name] = get(val);
//       } else {
//         // Link model values to the fields
//         val.set(this.model[name]);
//       }
//     }
//   };

//   // Here in case we need better performance.
//   private linkFieldValue = (field: FieldConfig): void => {
//     this.model[field.name] = get(field.value);
//   };

//   private getStateSnapshot = (): string => {
//     let i = 0,
//       len = this.stateful_items.length,
//       result = {};
//     for (; len > i; ++i) {
//       const item = this.stateful_items[i];
//       result[item] = this[item];
//     }
//     return JSON.stringify(result);
//   };

//   /**
//    * TODO: Might better way to do comparison than JSON.stringify()
//    * TODO: Be my guest to fix it if you know how.
//    * But...
//    * I've tested it with > 1000 fields in a single class with very slight input lag.
//    */
//   private hasChanged = (): void => {
//     const state = this.getStateSnapshot();

//     if (state === this.initial_state_str) {
//       this.changed.set(false);
//       return;
//     }
//     this.changed.set(true);
//   };

//   private linkFieldErrors = (
//     errors: ValidationError[],
//     field: FieldConfig
//   ): void => {
//     const error = errors.filter((e) => e.property === field.name);
//     // Check if there's an error for the field
//     if (error && error.length > 0) {
//       field.errors.set(error[0]);
//     } else {
//       field.errors.set(null);
//     }
//   };

//   private linkErrors = (errors: ValidationError[] = this.errors): void => {
//     errors.forEach((err) => {
//       this.fields.forEach((field) => {
//         if (err.property === field.name) {
//           field.errors.set(err);
//         }
//       });
//     });
//   };

//   private clearFieldErrors = (name): void => {
//     this.fields.forEach((field) => {
//       if (field.name === name) {
//         field.errors.set(null);
//       }
//     });
//   };

//   private _hideFields = () => {
//     let i = 0,
//       len = this.hidden_fields.length;
//     if (len === 0) return;
//     for (; len > i; ++i) {
//       const field = this.hidden_fields[i],
//         field_index = this.field_names.indexOf(field);
//       if (field_index !== -1) {
//         this._hideField(this.field_names[i]);
//       }
//     }
//   };

//   private _hideField = (name: string) => {
//     this.fields.forEach((f) => {
//       if (f.name === name) {
//         f.hidden = true;
//       }
//     });
//   };

//   private _disableFields = () => {
//     let i = 0,
//       len = this.disabled_fields.length;
//     if (len === 0) return;
//     for (; len > i; ++i) {
//       const field = this.disabled_fields[i],
//         field_index = this.field_names.indexOf(field);
//       if (field_index !== -1) {
//         this._disableField(this.field_names[i]);
//       }
//     }
//   };

//   private _disableField = (name: string) => {
//     this.fields.forEach((f) => {
//       if (f.name === name) {
//         f.disabled = true;
//         f.attributes["disabled"] = true;
//       }
//     });
//   };

//   private createOrder = (): void => {
//     let fields = [];
//     let leftovers = [];
//     // Loop over the order...
//     this.field_order.forEach((item) => {
//       // and the fields...
//       this.fields.forEach((field) => {
//         // If the field.name and the order name match...
//         if (
//           field.name === item ||
//           (field.group && field.group.name === item) ||
//           (field.step && `${field.step.index}` === item)
//         ) {
//           // Then push it to the fields array
//           fields.push(field);
//         } else if (
//           leftovers.indexOf(field) === -1 &&
//           this.field_order.indexOf(field.name) === -1
//         ) {
//           // Field is not in the order, so push it to bottom of order.
//           leftovers.push(field);
//         }
//       });
//     });
//     this.fields = [...fields, ...leftovers];
//   };

//   private attachOnValidateEvents = (node: HTMLElement): void => {
//     // Get the field, for passing to the validateField func
//     //@ts-ignore
//     const field = this.fields.filter((f) => f.name === node.name)[0];
//     Object.entries(this.validate_on_events).forEach(
//       ([eventName, shouldListen]) => {
//         // If the OnEvent is true, then add the event listener
//         // If the field has options, we can assume it will use the change event listener
//         if (field.options) {
//           // so don't add the input event listener
//           if (shouldListen && eventName !== "input") {
//             node.addEventListener(
//               eventName,
//               (ev) => {
//                 this.validateField(field);
//               },
//               false
//             );
//           }
//         }
//         // Else, we can assume it will use the input event listener
//         // * This may be changed in the future
//         else {
//           // and don't add the change event listener
//           if (shouldListen && eventName !== "change") {
//             node.addEventListener(
//               eventName,
//               (ev) => {
//                 this.validateField(field);
//               },
//               false
//             );
//           }
//         }
//       }
//     );
//   };

//   private attachOnClearErrorEvents = (node): void => {
//     Object.entries(this.clear_errors_on_events).forEach(([key, val]) => {
//       // If the OnEvent is true, then add the event listener
//       if (val) {
//         node.addEventListener(key, (ev) => {
//           this.clearFieldErrors(node.name);
//         });
//       }
//     });
//   };
// }

// export class FormApi extends FormInternalApi {
// 	constructor() {
// 		super();
// 	}

//   /**
//    * This is the first method that was written for formvana :)
//    *
//    * Build the field configs from this.model using metadata-reflection.
//    * More comments inside...
//    */
//   buildFields = (): void => {
//     if (this.model) {
//       // Grab the editableProperties from the @editable decorator
//       let props = Reflect.getMetadata("editableProperties", this.model);
//       // Map the @editable fields to the form.fields array.
//       this.fields = props.map((prop) => {
//         // Get the FieldConfig using metadata reflection
//         const field: FieldConfig = new FieldConfig({
//           ...Reflect.getMetadata("fieldConfig", this.model, prop),
//           name: prop,
//         });

//         // Set fieldConfig.value(this.model[prop])
//         // 0, "", [], etc. are set in the constructor based on type.
//         if (this.model[prop]) {
//           field.value.set(this.model[prop]);
//         }

//         // Gotta keep track of the required feilds, for our own validation.
//         if (field.required) {
//           this.required_fields.push(field.name);
//         }

//         // We made it. Return the field config and let's generate some inputs!
//         return field;
//       });
//       this.field_names = this.fields.map((f) => f.name);
//     }
//   };

//   /**
//    * MUST BE ATTACHED TO SAME ELEMENT WITH FIELD.NAME!
//    * MUST BE ATTACHED TO SAME ELEMENT WITH FIELD.NAME!
//    * MUST BE ATTACHED TO SAME ELEMENT WITH FIELD.NAME!
//    *
//    * Use on the element that will be interacted with.
//    * e.g. <input/> -- <button/> -- <select/> -- etc.
//    * Check lib/svelte/defaults for more examples.
//    *
//    * * This hooks up the event listeners!
//    *
//    * This is for Svelte's "use:FUNCTION" feature.
//    * The "use" directive passes the HTML Node as a parameter
//    * to the given function (e.g. use:useField(node: HTMLNode)).
//    */
//   useField = (node: HTMLElement): void => {
//     // Attach HTML Node to field so we can remove event listeners later
//     this.fields.forEach((field) => {
//       //@ts-ignore
//       if (field.name === node.name) {
//         field.node = node;
//       }
//     });

//     this.attachOnValidateEvents(node);
//     this.attachOnClearErrorEvents(node);
//   };

//   /**
//    * Well, validate the form!
//    * Clear the errors first, then do it, obviously.
//    */
//   validate = (): Promise<ValidationError[]> => {
//     this.clearErrors();
//     // Link the input from the field to the model.
//     this.link_fields_to_model === LinkOnEvent.Always && this.linkValues(true);
//     this._hideFields(), this._disableFields();
//     // Return class-validator validate() function.
//     // Validate the model with given validation config.
//     return validate(this.model, this.validation_options).then(
//       (errors: ValidationError[]) => {
//         this.handleValidation(false, errors);
//         return errors;
//       }
//     );
//   };

//   validateAsync = async (): Promise<any> => {
//     this.clearErrors();
//     this.link_fields_to_model === LinkOnEvent.Always && this.linkValues(true);
//     this._hideFields(), this._disableFields();
//     try {
//       return await validateOrReject(this.model, this.validation_options);
//     } catch (errors) {
//       this.handleValidation(false, errors);
//       console.log("Errors: ", errors);
//       return errors;
//     }
//   };

//   /**
//    * If wanna invalidate a specific field for any reason.
//    */
//   invalidateField = (field_name: string, message: string): void => {
//     const field = this.get(field_name),
//       _err = new ValidationError(),
//       err = Object.assign(_err, {
//         property: field_name,
//         value: get(field.value),
//         constraints: [{ error: message }],
//       });
//     this.errors.push(err);
//     this.linkErrors();
//   };

//   /**
//    * Load new data into the form and build the fields.
//    * Useful if you fetched data and need to update the form values.
//    *
//    * Fresh defaults to True. So the default is to pass in a new instance
//    * of the model (e.g. new ExampleMode(incoming_data)).
//    * If fresh is False then the incoming_data will be serialized into
//    * the model.
//    *
//    * State is updated upon data load, by default.
//    *
//    * Check example.form.ts for an example use case.
//    */
//   loadData = (
//     data: any,
//     freshModel: boolean = true,
//     updateInitialState: boolean = true
//   ): Form<MType> => {
//     if (freshModel) {
//       this.model = data;
//       this.buildFields();
//     } else {
//       Object.keys(this.model).forEach((key) => {
//         this.model[key] = data[key];
//       });
//       this.linkValues(false);
//     }

//     updateInitialState && this.updateInitialState();

//     return this;
//   };

//   /**
//    * Just pass in the reference data and let the field configs do the rest.
//    *
//    * * Ref data MUST BE in format: Record<string, RefDataItem[]>
//    */
//   attachRefData = (refs?: Record<string, RefDataItem[]>): void => {
//     const fields_with_ref_keys = this.fields.filter((f) => f.ref_key);
//     if (refs) {
//       fields_with_ref_keys.forEach((field) => {
//         field.options = refs[field.ref_key];
//       });
//     } else if (this.refs) {
//       fields_with_ref_keys.forEach((field) => {
//         field.options = this.refs[field.ref_key];
//       });
//     }
//   };

//   /**
//    * Generate a Svelte Store from the current "this".
//    */
//   storify = (): Writable<Form<MType>> => {
//     const f = writable(this);
//     return f;
//   };

//   /**
//    * Set the field order.
//    * Layout param is simply an array of field (or group)
//    * names in the order to be displayed.
//    * Leftover fields are appended to bottom of form.
//    */
//   setOrder = (order: string[]): void => {
//     this.field_order = order;
//     this.createOrder();
//   };

//   /**
//    * Get Field by name
//    */
//   get = (name: string): FieldConfig => {
//     return this.fields.filter((f) => f.name === name)[0];
//   };

//   /**
//    * * Use this if you're trying to update the layout after initialization.
//    * Similar to this.setOrder()
//    *
//    * Like this:
//    * const layout = ["description", "status", "email", "name"];
//    * const newState = sget(formState).buildStoredLayout(formState, layout);
//    * formState.updateState({ ...newState });
//    */
//   buildStoredLayout = (
//     formState: Writable<any>,
//     order: string[]
//   ): Writable<any> => {
//     let fields = [];
//     let leftovers = [];
//     // Update the order
//     formState.update((state) => (state.field_order = order));
//     // Get the Form state
//     const state = get(formState);
//     state.field_order.forEach((item) => {
//       state.fields.forEach((field) => {
//         if (
//           field.name === item ||
//           (field.group && field.group.name === item) ||
//           (field.step && `${field.step.index}` === item)
//         ) {
//           fields.push(field);
//         } else if (
//           leftovers.indexOf(field) === -1 &&
//           state.field_order.indexOf(field.name) === -1
//         ) {
//           leftovers.push(field);
//         }
//       });
//     });
//     state.fields = [...fields, ...leftovers];
//     return state;
//   };

//   // Well, this updates the initial state of the form.
//   updateInitialState = (): void => {
//     this.setInitialState();
//     this.changed.set(false);
//   };

//   // Clear ALL the errors.
//   clearErrors = (): void => {
//     this.errors = [];
//     this.fields.forEach((field) => {
//       field.errors.set(null);
//     });
//   };

//   // Resets to the inital state of the form.
//   reset = (): void => {
//     this.resetState();
//   };

//   hideFields = (names?: string | string[]) => {
//     if (names) {
//       if (Array.isArray(names)) {
//         this.hidden_fields.push(...names);
//       } else {
//         this.hidden_fields.push(names);
//       }
//     }
//     this._hideFields();
//   };

//   disableFields = (names?: string | string[]) => {
//     if (names) {
//       if (Array.isArray(names)) {
//         this.disabled_fields.push(...names);
//       } else {
//         this.disabled_fields.push(names);
//       }
//     }
//     this._disableFields();
//   };

//   /**
//    *! Make sure to call this when the component is unloaded/destroyed
//    * Removes all event listeners and clears the form state.
//    */
//   destroy = (): void => {
//     if (this.fields && this.fields.length > 0) {
//       // For each field...
//       this.fields.forEach((f) => {
//         // Remove all the event listeners!
//         Object.keys(this.validate_on_events).forEach((key) => {
//           f.node.removeEventListener(key, (ev) => {
//             this.validateField(f);
//           });
//         });
//         Object.keys(this.clear_errors_on_events).forEach((key) => {
//           f.node.removeEventListener(key, (ev) => {
//             this.clearFieldErrors(f.name);
//           });
//         });
//       });
//     }
//     // Reset everything else.
//     this.clearState();
//   };
// }
