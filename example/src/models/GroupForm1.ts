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
  IsString,
} from "class-validator";
import { field } from "@formvana";

export enum Status {
  ACTIVE,
  PENDING,
  SUSPENDED,
  ARCHIVED,
}
export class ExampleModel {
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 1",
    required: true,
    group: "personal",
    attributes: { placeholder: "Status 1", type: "number" },
    ref_key: "statuses",
  })
  status_1;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    label: "Email 2",
    required: true,
    attributes: { placeholder: "Email 2", type: "email" },
  })
  email_2;

  @Length(10, 350)
  @IsString()
  @field({
    selector: "textarea",
    label: "Description 3",
    required: false,
    hint: "This is a hint!",
    attributes: { placeholder: "Description 3", type: "text" },
  })
  description_3;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    label: "Email 4",
    required: true,
    group: "personal",
    attributes: { placeholder: "Email 4", type: "email" },
  })
  email_4;

  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    selector: "input",
    label: "Name 5",
    required: true,
    group: "personal",
    attributes: { placeholder: "Name 5", type: "text" },
  })
  name_5;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    label: "Email 6",
    required: true,
    attributes: { placeholder: "Email 6", type: "email" },
  })
  email_6;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 7",
    required: true,
    attributes: { placeholder: "Status 7", type: "number" },
    ref_key: "statuses",
  })
  status_7;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    label: "Email 8",
    required: true,
    attributes: { placeholder: "Email 8", type: "email" },
  })
  email_8;

  @Length(10, 350)
  @IsString()
  @field({
    selector: "textarea",
    label: "Description 9",
    required: false,
    hint: "This is a hint!",
    attributes: { placeholder: "Description 9", type: "text" },
  })
  description_9;

  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    selector: "input",
    label: "Name 10",
    required: true,
    attributes: { placeholder: "Name 10", type: "text" },
  })
  name_10;

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
