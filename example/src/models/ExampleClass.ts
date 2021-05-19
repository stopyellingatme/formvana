
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
      type: "select",
      label: "Status 1",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 1" },ref_key: "statuses",
    }
  )
  status_1;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 2",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 2" },
    }
  )
  email_2;


  @Length(10, 350)
@IsString()
  @field({
      selector: "textarea",
      type: "text",
      label: "Description 3",
      required: false,hint: "This is a hint!",
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 3" },
    }
  )
  description_3;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 4",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 4" },
    }
  )
  email_4;


  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field({
      selector: "input",
      type: "text",
      label: "Name 5",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 5" },
    }
  )
  name_5;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 6",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 6" },
    }
  )
  email_6;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 7",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 7" },ref_key: "statuses",
    }
  )
  status_7;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 8",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 8" },
    }
  )
  email_8;


  @Length(10, 350)
@IsString()
  @field({
      selector: "textarea",
      type: "text",
      label: "Description 9",
      required: false,hint: "This is a hint!",
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 9" },
    }
  )
  description_9;


  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field({
      selector: "input",
      type: "text",
      label: "Name 10",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 10" },
    }
  )
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
