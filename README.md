# Formvana
----

## VERY EARLY PRE-ALPHA LIBRARY

Out here searching for form nirvana with the help of Typescript and (currently) Svelte.

The mission is to have a "single source of truth" for Form data.
We do this using the reflect-metadata typescript library which allows us to add new decorators (@field, @editable) to a typescript class.
The @editable decorator tells the parser to grab that field name. 
Then we use the field name to reflect the @field metadata with the FieldConfig being passed into the @field decorator.

The field setup and parsing is handled by the Form.ts class.
It takes the model (containing the special decorators) and builds an array of fields based on the given FieldConfigs of the model.
Using this pattern, along with class-validator, allows a beautiful Form handling experience.

The Form.fields array makes it easy to itterate over and generate form fields dymanically. There are form options which specify when to validate input or clear errors (on input, change, focus, blur, etc.).
It's also very easy to get data out of the Form by calling Form.model.


## Form.ts

## FieldConfig.ts

## typescript.utils.ts

## Form.svelte

## Recommended Use

```commands go here
```

** Main things left to tackle:
 *  - !Field groups and Field ordering (group styling)
 *  - Remove Tailwind dependencies
 *  - Remove Svelte dependency? - Maybe fork it?
 *  - Add more form elements for testing with svelte
 *  - Do some documentation on this mfer
 * 
 *  - Clean up functions and code wherever possible :) 

<!-- *Note that you will need to have [Node.js](https://nodejs.org) 15.7.0 installed, for now.* -->


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
