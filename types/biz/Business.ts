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
import { editable, field } from "../../src/utils/typescript.utils";
import { FieldConfig } from "../_internal/FieldConfig";

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
  @Length(10, 90)
  @IsString()
  name: string = "";

  @editable
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
  @IsEmail()
  email: string = "";

  @editable
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Description",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description" },
    })
  )
  @Length(10, 240)
  description: string = "";
  avatar_url: string = "";

  // Address
  address_1: string = "";
  address_2: string = "";
  city: string = "";
  state: string = "";
  zip: string = "";

  employees: any[] = []; // [Not Mapped]
  members: any[] = []; // [Not Mapped]
  high_score_customer_name: string = "";
  high_score_customer_score: number = 0;

  misc = {};
  activity = {};
  settings = {};

  @editable
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "Business Status",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      ref_key: "business_statuses"
    })
  )
  @IsString()
  status;

  created_at: Date | string = null;
  created_by: string = "";
  updated_at: Date | string = null;
  updated_by: string = "";
}