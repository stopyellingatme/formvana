// Script to generate 100's of inputs for testing.
const fs = require("fs");

const output_path = `./example/src/models/TestClass.ts`;

const test_class_string = (fields) => `
import {
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  IsEnum,
  Min,
  Max,
  IsString
} from "class-validator";
import { editable, field } from "@formvana";

export enum Status {
  ACTIVE,
  PENDING,
  SUSPENDED,
  ARCHIVED,
}
export class ExampleModel {
  ${fields.join("\n")}

  constructor(init?: Partial<ExampleModel>) {
    if (init) {
      Object.keys(this).forEach((key) => {
        if (init[key]) {
          this[key] = init[key];
        }
      });
    }
  }
}
`;

const field = (
  type,
  name,
  label,
  req,
  el,
  hint,
  validators,
  initial_val,
  ref_key,
  is_group,
  is_step
) => `
	@editable
  ${validators.join("\n")}
  @field({
      el: "${el}",
      type: "${type}",
      label: "${label}",
      required: ${req},${("\n", hint ? 'hint: "' + hint + '",' : "")}
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "${label}" },${
  ("\n", ref_key ? 'ref_key: "' + ref_key + '",' : "")
}${
  ("\n", is_group ? "group: { name: " + name + ", label: " + label + " }," : "")
}${
  ("\n", is_step ? "step: { index: " + name + ", label: " + label + " }," : "")
}
    }
  )
  ${name}${initial_val ? " = " + initial_val : ""};
`;

function generateFields() {
  let fields = [];
  let i = 1,
    len = 101;
  for (; len > i; ++i) {
    if (i <= 10) {
      fields.push(psudoRandomGetField(i));
    } else if (i >= 11) {
      fields.push(psudoRandomGetField(i));
    } else if (i <= 20) {
      fields.push(psudoRandomGetField(i));
    } else if (i >= 21) {
      fields.push(psudoRandomGetField(i));
    } else if (i <= 30) {
      fields.push(psudoRandomGetField(i));
    } else if (i >= 30) {
      fields.push(psudoRandomGetField(i));
    } else {
      fields.push(psudoRandomGetField(i));
    }
  }

  const model = test_class_string(fields);

  fs.writeFile(output_path, model, null, fwcb);
}

function psudoRandomGetField(i) {
  let f = null;
  if (i % 5 === 0) {
    f = field(
      "text",
      "name_" + i,
      "Name " + i,
      true,
      "input",
      null,
      [
        `@Length(10, 90, { message: "Name must be between 10 and 90 characters" })`,
        "@IsString()",
      ],
      "",
      null,
      null,
      null
    );
  } else if (i % 2 === 0) {
    f = field(
      "email",
      "email_" + i,
      "Email " + i,
      true,
      "input",
      null,
      [`@IsEmail({}, { message: "Please enter a valid email address" })`],
      "",
      null,
      null,
      null
    );
  } else if (i % 3 === 0) {
    f = field(
      "text",
      "description_" + i,
      "Description " + i,
      false,
      "textarea",
      "This is a hint!",
      [`@Length(10, 350)`, `@IsString()`],
      "",
      null,
      null,
      null
    );
  } else {
    f = field(
      "select",
      "status_" + i,
      "Status " + i,
      true,
      "select",
      null,
      [
        `@IsEnum(Status, { message: "Please choose a Status" })`,
      ],
      null,
      "statuses",
      null,
      null
    );
  }
  return f;
}

function fwcb(path, err) {
  if (err) {
    return console.log(err);
  }
  console.log(`File was saved! \n${path}`);
}

(() => generateFields())();
