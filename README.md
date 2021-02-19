# Formvana

_Searching for form nirvana with the help of Typescript and (currently) Svelte._

**What I Want!**

- Sinlge source of truth for my Forms
- Form Generator/Dynamic Form (Inspired by Ngx-Formly)
- Easy Form data IO (form.model to get data, form.buildFields to set data)
- Strong, fast Validation (via [class-validator](https://github.com/typestack/class-validator))
- Field Groups/Field Layout is nice too

## VERY EARLY PRE-ALPHA LIBRARY

Currently depends on:

- Tailwindcss (form styling)
- Svelte (form generation)

The mission is to have a "single source of truth" for Form data.
We do this using the reflect-metadata typescript library which allows us to add new decorators (@field, @editable) to a typescript class.
The @editable decorator tells the parser to grab that field name.
Then we use the field name to reflect the @field metadata with the FieldConfig being passed into the @field decorator.

The field setup and parsing is handled by the Form.ts class.
It takes the model (containing the special decorators) and builds an array of fields based on the given FieldConfigs of the model.
Using this pattern, along with class-validator, allows a beautiful Form handling experience.

The Form.fields array makes it easy to itterate over and generate form fields dymanically. There are form options which specify when to validate input or clear errors (on input, change, focus, blur, etc.).
It's also very easy to get data out of the Form by calling Form.model.

----
## YourTsModel.ts (Business.ts)
Simple Example with 4 editable fields.

```ts
// Business.ts
import { Length, IsEmail, IsString } from "class-validator";
import { editable, field } from "../typescript.utils";
import { FieldConfig } from "../FieldConfig";

class Business {
  id: string;

  @editable
  @Length(10, 90)
  @IsString()
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Business Name",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Business Name" },
    })
  )
  name: string = "";

  @editable
  @IsEmail()
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email Address",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email Address" },
    })
  )
  email: string = "";

  @editable
  @Length(10, 240)
  @field(
    new FieldConfig({
      el: "textarea",
      type: "text",
      label: "Description",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description" },
    })
  )
  description: string = "";
  avatar_url: string = "";

  // Address
  address_1: string = "";
  address_2: string = "";
  city: string = "";
  state: string = "";
  zip: string = "";

  @editable
  @IsString()
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "Business Status",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      ref_key: "business_statuses",
    })
  )
  status;
}
```

---

## Form.ts

- Model and Fields

The model above can be attached either by new Form({model: new Business()}) or form.model = new Busniess().
However, this ONLY sets the model.
MODEL AND FIELDS ARE DIFFERENT THINGS!
So, set the model and call form.buildFields() to build the fields with the model's field configurations.
If there's data in the model fields already, it will be reflected in the fields.value as well.

- REFERENCE DATA:

Attach reference data to dropdowns by calling form.attachRefData(refData).

Note: Reference data MUST BE in the format:

```
{
	"ref_key": [
		{value: 0, label: "First Choice"},
		{value: 1, label: "Second Choice"}
	]
}
```

AND! Make sure to call form.destroy() to remove event listeners!

---

_TODO:_

- The useField (svelte specific) stuff
- - how event handlers are hooked to fields
- how model and fields hook up values
- how events (validation/clear errors) are handled/can be set
- layout setup

---

## FieldConfig.ts

Form.fields are of type FieldConfig.ts
The constructor will attempt to parse the input type and add a sensable default to the field.value (type text defaults to "", type number defaults to 0, etc.).

Also contains the HTML Node which is being validated/targeted.

---

## typescript.utils.ts

This is where the specialized (reflect-metadata) decorators are declared.

```
@editable and @field
```

---

## Form.svelte

This generates the form dynamically based on the @fields on the TS model. I would like to remove the tailwind parts for broader use, but it's good for testing right now.

---

## Recommended Use

```commands go here

```

---

\*\* Main things left to tackle:

- Field groups/Field ordering and Layout (group styling)
- Remove Tailwind dependencies
- Remove Svelte dependency? - Maybe fork it?
- Add more form elements for testing with svelte
- Do some documentation on this mfer
- Write tests to generate 100s of form configs, add data/validate, test performance

---

*Note that you will need to have [Node.js](https://nodejs.org) 15.7.0 installed, for now.*

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
