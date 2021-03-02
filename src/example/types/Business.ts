import {
  validate,
  validateOrReject,
  Contains,
  IsInt,
  Length,
  IsEmail,
  IsFQDN,
  IsDate,
  Min,
  Max,
  IsString,
} from "class-validator";
import { editable, field } from "../../../package/typescript";
import { FieldConfig } from "../../../package/typescript";

export type BusinessStatus = "ACTIVE" | "PENDING" | "SUSPENDED" | "ARCHIVED";

export class Business {
  constructor(init?: Partial<Business>) {
    if (init) {
      Object.keys(this).forEach((key) => {
        if (init[key]) {
          this[key] = init[key];
        }
      });
    }
  }

  id: string;

  @editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
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
  @IsEmail({}, { message: "Please enter a valid email address" })
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
  @Length(10, 350)
  @field(
    new FieldConfig({
      el: "textarea",
      type: "text",
      label: "Description",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      hint: "This will be seen publicly",
      attributes: { placeholder: "Description" },
    })
  )
  description: string = "";
  avatar_url: string = "";

  // Address
  @editable
  @Length(5, 200)
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Address Line 1",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Address 1" },
      group: { name: "address", label: "Business Location" },
    })
  )
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
