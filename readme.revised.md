# Formvana

## _**Searching for Form Nirvana with the help of Typescript and Svelte.**_

**What I Want!**

- Sinlge source of truth for forms
- Form Generator/Dynamic Form (Inspired by Ngx-Formly)
- Easy Form data IO (form.model to get data, form.loadModel to set data)
- Bring your own Validation
- Field Groups/Field Layout is good too

---

## STILL UNDER ACTIVE DEVELOPMENT

**CONFIG MUST HAVE!!!**

```json
  // tsconfig.json
  "emitDecoratorMetadata": true,
  "experimentalDecorators": true,
```

The mission is to have a "single source of truth" for Form data.
We do this using the reflect-metadata typescript library which allows us to add new decorators (@field, @editable) to a typescript class.
The @editable decorator tells the parser to grab that field name.
Then we use the field name to reflect the @field metadata with the FieldConfig being passed into the @field decorator.

The field setup and parsing is handled by the Form.ts class.
It takes the model (containing the special decorators) and builds an array of fields based on the given FieldConfigs of the model.
Using this pattern, along with class-validator, allows a beautiful Form handling experience.

The Form.fields array makes it easy to loop over and generate form fields dymanically. There are form options which specify when to validate input or clear errors (on input, change, focus, blur, etc.).
It's also very easy to get data out of the Form by calling Form.model.

---

## &bull; Simple Example

<details>

<summary>User Model Exmaple</summary>

```ts
import { Length, IsEmail, IsString } from "class-validator";
import { field } from "@formvana";

export class UserExampleModel {
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    label: "Email",
    required: true,
    attributes: { placeholder: "Email", type: "email" },
  })
  email: string;

  @Length(10, 90)
  @field({
    label: "Password",
    required: true,
    attributes: { placeholder: "Enter Password", type: "password" },
  })
  password: string;

  @Length(10, 90)
  @field({
    label: "Confirm Password",
    required: true,
    for_form: "register",
    attributes: {
      placeholder: "Confirm Password",
      type: "password",
      title: "I know this isn't best practice anymore. It's just an example.",
    },
  })
  confirm_password: string;

  @Length(10, 90)
  @IsString()
  @field({
    label: "Display Name",
    required: true,
    for_form: "register",
    attributes: { placeholder: "Your Name. People See" },
  })
  display_name: string;

  @field({
    selector: "file",
    data_type: "file",
    label: "Avatar",
    required: false,
    for_form: "register",
    exclude_events: ["focus", "blur"],
  })
  avatar: string;
}
```

</details>

<details>

<summary>Model Usage</summary>

```html
<script>
  import { validate } from "class-validator";
  import { Form, ValidationError } from "@formvana";
  import { UserExampleModel } from "./models/UserExampleModel";
  import ButtonArea from "./components/controls/ButtonArea.svelte";

  const options = {
    validator: (model, options) =>
      validate(model, options).then((errors) => {
        /**
         * We have to format the errors that class-validator returns
         * into the proper shape (ValidationError) for the formvana
         * validator callback chain.
         */
        return errors.map((error) => {
          return new ValidationError(error.property, error.constraints);
        });
      }),
    error_display: "constraint",
  };

  $: form = new Form(new UserExampleModel(), options);

  $: valid = form.valid;
  $: changed = form.changed;
</script>

<form
  use:form.useForm
  class="flex flex-col w-full justify-items-center items-centers"
>
  <h2>Simple Exmaple</h2>
  <br />
  <div class="grid grid-cols-2 gap-6 mt-6">
    <!-- Loop over the form fields -->
    {#each form.fields as field}
      <div class="flex flex-col p-2">
        {#if field.selector === "textarea"}
          <label for={field.name}>{field.label}</label>
          <textarea
            class="p-1 border-2 border-gray-700 rounded"
            name={field.name}
            rows="3"
            {...field.attributes}
          />
        {:else if field.selector === "select"}
          <select
            class="p-1 border-2 border-gray-700 rounded"
            name={field.name}
            {...field.attributes}
          >
            {#each field.options as option}
              <option value={option.value}>{option.label}</option>
            {/each}
          </select>
        {:else}
          <!-- Default to simple label and input combo -->
          <label for={field.name}>{field.label}</label>
          <input
            class="p-1 border-2 border-gray-700 rounded"
            name={field.name}
            {...field.attributes}
          />
        {/if}

        <div data-error-for={field.name} />
      </div>
    {/each}
  </div>
</form>

<div class="px-8 py-2 pb-12 mx-auto max-w-7xl">
  <ButtonArea reset={form.reset} {valid} {changed} />
</div>
```

</details>

## &bull; Form.ts

- Model and Fields (form.model & form.fields)

1. Set the Model
2. Build the Fields ( form.buildFields() )

The model (in the section) above can be attached by one of the following methods:

```js
const form = new Form({ model: new Business() });

or;

const form = new Form();
form.model = new Busniess();
```

However, this ONLY sets the model.

`MODEL AND FIELDS ARE DIFFERENT THINGS!`

Call `form.buildFields()` to build/set the form.fields with the model's field configurations.

If the model's fields already have data, the field data will be reflected in form.fields.value.

`Validation!`

1. Set validation options via `form.validation_options`.
2. See available options at [class-validator](https://github.com/typestack/class-validator)

---

**REFERENCE DATA:**

Attach reference data to dropdowns by calling form.attachReferenceData(ReferenceData).

**Note:** attachReferenceData can only be called after fields are built. You gotta have fields to attach the data too.

**Another Note:** Reference data MUST BE in the format (for now):

```json
{
  "ref_key": [
    { "value": 0, "label": "First Choice" },
    { "value": 1, "label": "Second Choice" }
  ]
}
```

---

**AND! Make sure to call form.destroy() to remove event listeners!**

^^ I'm working on a way to do some of this automagically.

_FORM.TS TODO:_

- The useField (svelte specific) stuff
- - how event handlers are hooked to fields
- how model and fields hook up values
- how events (validation/clear errors) are handled/can be set
- layout setup

## &bull; FieldConfig.ts

Form.fields are of type FieldConfig.ts
The constructor will attempt to parse the input type and add a sensable default to the field.value (type text defaults to "", type number defaults to 0, etc.).

Also contains the HTML Node which is being validated/targeted.

<details>

<summary>The current default Field Configuration class looks like this.</summary>

```ts
class FieldConfig {
  constructor(init?: Partial<FieldConfig>) {
    Object.assign(this, init);
    this.attributes["type"] = this.type;

    if (
      this.type === "text" ||
      this.type === "email" ||
      this.type === "password" ||
      this.type === "string"
    ) {
      this.value.set("");
    }

    if (this.type === "number") {
      this.value.set(0);
    }

    if (this.type === "decimal") {
      this.value.set(0.0);
    }

    if (this.type === "boolean" || this.type === "choice") {
      this.value.set(false);
    }

    if (this.el === "select" || this.el === "dropdown") {
      this.options = [];
    }

    if (!this.attributes["title"]) {
      this.attributes["title"] = this.label || this.name;
    }
  }

  //! DO NOT SET NAME. IT'S SET AUTOMATICALLY BY FORM.TS!
  name: string;
  // Main use is to add and remove event listeners
  node: HTMLElement;
  el: string; // Element to render in your frontend
  type: string = "text"; // Defaults to text, for now
  label: string;
  classname: string;
  required: boolean = false;

  value: Writable<any> = writable(null);

  options?: any[];
  ref_key?: string; // Reference data key

  hint?: string; // Mainly for textarea, for now
  group?: FieldGroup;
  step?: FieldStep;

  /**
   * * String array of things like:
   * -- type="text || email || password || whatever"
   * -- class='input class'
   * -- disabled
   * -- title='input title'
   * -- etc.
   */
  attributes: object = {};

  /**
   * Validation Errors!
   * We're mainly looking for the class-validator "constraints"
   * One ValidationError object can have multiple errors (constraints)
   */
  errors: Writable<ValidationError> = writable(null);

  clearValue = () => {
    this.value.set(null);
  };

  clearErrors = () => {
    this.errors.set(null);
  };

  clear = () => {
    this.clearValue();
    this.clearErrors();
  };
}
```

</details>

## &bull; typescript.utils.ts

This is where the specialized (reflect-metadata) decorators are declared.

```
@editable and @field
```

[Got the idea from here.](https://www.meziantou.net/generate-an-html-form-from-an-object-in-typescript.htm)

## &bull; Form.svelte

This generates the form dynamically based on the @fields on the TS model. I would like to remove the tailwind parts for broader use, but it's good for testing right now.

Eventually the area with inputs will be a named \<slot\> to pass in something like a \<Fields prop={field} \\> type of component.

## Recommended Use

```commands go here
Just run it and see how you feel about this whole method.

```

---

_Note that you will need to have [Node.js](https://nodejs.org) 15.7.0 installed, for now._

## So, for now, you can run it like an app

Install the dependencies...

```bash
cd formvana
npm i
```

...then start [Rollup](https://rollupjs.org):

```bash
npm run dev
```

Navigate to [localhost:5000](http://localhost:5000). You should see your app running.
