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
import { editable, field } from "@formvana";

export enum Status {
  ACTIVE,
  PENDING,
  SUSPENDED,
  ARCHIVED,
}
export class ExampleModel {
  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 1",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 1" },
    ref_key: "statuses",
  })
  status_1;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 2",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 2" },
  })
  email_2;

  @editable
  @Length(10, 350)
  @IsString()
  @field({
    el: "textarea",
    type: "text",
    label: "Description 3",
    required: false,
    hint: "This is a hint!",
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Description 3" },
  })
  description_3;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 4",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 4" },
  })
  email_4;

  @editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    el: "input",
    type: "text",
    label: "Name 5",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Name 5" },
  })
  name_5;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 6",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 6" },
  })
  email_6;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 7",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 7" },
    ref_key: "statuses",
  })
  status_7;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 8",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 8" },
  })
  email_8;

  @editable
  @Length(10, 350)
  @IsString()
  @field({
    el: "textarea",
    type: "text",
    label: "Description 9",
    required: false,
    hint: "This is a hint!",
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Description 9" },
  })
  description_9;

  @editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    el: "input",
    type: "text",
    label: "Name 10",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Name 10" },
  })
  name_10;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 11",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 11" },
    ref_key: "statuses",
  })
  status_11;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 12",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 12" },
  })
  email_12;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 13",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 13" },
    ref_key: "statuses",
  })
  status_13;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 14",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 14" },
  })
  email_14;

  @editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    el: "input",
    type: "text",
    label: "Name 15",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Name 15" },
  })
  name_15;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 16",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 16" },
  })
  email_16;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 17",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 17" },
    ref_key: "statuses",
  })
  status_17;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 18",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 18" },
  })
  email_18;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 19",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 19" },
    ref_key: "statuses",
  })
  status_19;

  @editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    el: "input",
    type: "text",
    label: "Name 20",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Name 20" },
  })
  name_20;

  @editable
  @Length(10, 350)
  @IsString()
  @field({
    el: "textarea",
    type: "text",
    label: "Description 21",
    required: false,
    hint: "This is a hint!",
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Description 21" },
  })
  description_21;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 22",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 22" },
  })
  email_22;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 23",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 23" },
    ref_key: "statuses",
  })
  status_23;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 24",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 24" },
  })
  email_24;

  @editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    el: "input",
    type: "text",
    label: "Name 25",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Name 25" },
  })
  name_25;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 26",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 26" },
  })
  email_26;

  @editable
  @Length(10, 350)
  @IsString()
  @field({
    el: "textarea",
    type: "text",
    label: "Description 27",
    required: false,
    hint: "This is a hint!",
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Description 27" },
  })
  description_27;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 28",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 28" },
  })
  email_28;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 29",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 29" },
    ref_key: "statuses",
  })
  status_29;

  @editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    el: "input",
    type: "text",
    label: "Name 30",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Name 30" },
  })
  name_30;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 31",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 31" },
    ref_key: "statuses",
  })
  status_31;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 32",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 32" },
  })
  email_32;

  @editable
  @Length(10, 350)
  @IsString()
  @field({
    el: "textarea",
    type: "text",
    label: "Description 33",
    required: false,
    hint: "This is a hint!",
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Description 33" },
  })
  description_33;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 34",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 34" },
  })
  email_34;

  @editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    el: "input",
    type: "text",
    label: "Name 35",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Name 35" },
  })
  name_35;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 36",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 36" },
  })
  email_36;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 37",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 37" },
    ref_key: "statuses",
  })
  status_37;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 38",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 38" },
  })
  email_38;

  @editable
  @Length(10, 350)
  @IsString()
  @field({
    el: "textarea",
    type: "text",
    label: "Description 39",
    required: false,
    hint: "This is a hint!",
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Description 39" },
  })
  description_39;

  @editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    el: "input",
    type: "text",
    label: "Name 40",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Name 40" },
  })
  name_40;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 41",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 41" },
    ref_key: "statuses",
  })
  status_41;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 42",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 42" },
  })
  email_42;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 43",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 43" },
    ref_key: "statuses",
  })
  status_43;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 44",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 44" },
  })
  email_44;

  @editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    el: "input",
    type: "text",
    label: "Name 45",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Name 45" },
  })
  name_45;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 46",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 46" },
  })
  email_46;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 47",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 47" },
    ref_key: "statuses",
  })
  status_47;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 48",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 48" },
  })
  email_48;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 49",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 49" },
    ref_key: "statuses",
  })
  status_49;

  @editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    el: "input",
    type: "text",
    label: "Name 50",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Name 50" },
  })
  name_50;

  @editable
  @Length(10, 350)
  @IsString()
  @field({
    el: "textarea",
    type: "text",
    label: "Description 51",
    required: false,
    hint: "This is a hint!",
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Description 51" },
  })
  description_51;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 52",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 52" },
  })
  email_52;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 53",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 53" },
    ref_key: "statuses",
  })
  status_53;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 54",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 54" },
  })
  email_54;

  @editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    el: "input",
    type: "text",
    label: "Name 55",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Name 55" },
  })
  name_55;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 56",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 56" },
  })
  email_56;

  @editable
  @Length(10, 350)
  @IsString()
  @field({
    el: "textarea",
    type: "text",
    label: "Description 57",
    required: false,
    hint: "This is a hint!",
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Description 57" },
  })
  description_57;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 58",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 58" },
  })
  email_58;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 59",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 59" },
    ref_key: "statuses",
  })
  status_59;

  @editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    el: "input",
    type: "text",
    label: "Name 60",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Name 60" },
  })
  name_60;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 61",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 61" },
    ref_key: "statuses",
  })
  status_61;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 62",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 62" },
  })
  email_62;

  @editable
  @Length(10, 350)
  @IsString()
  @field({
    el: "textarea",
    type: "text",
    label: "Description 63",
    required: false,
    hint: "This is a hint!",
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Description 63" },
  })
  description_63;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 64",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 64" },
  })
  email_64;

  @editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    el: "input",
    type: "text",
    label: "Name 65",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Name 65" },
  })
  name_65;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 66",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 66" },
  })
  email_66;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 67",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 67" },
    ref_key: "statuses",
  })
  status_67;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 68",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 68" },
  })
  email_68;

  @editable
  @Length(10, 350)
  @IsString()
  @field({
    el: "textarea",
    type: "text",
    label: "Description 69",
    required: false,
    hint: "This is a hint!",
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Description 69" },
  })
  description_69;

  @editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    el: "input",
    type: "text",
    label: "Name 70",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Name 70" },
  })
  name_70;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 71",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 71" },
    ref_key: "statuses",
  })
  status_71;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 72",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 72" },
  })
  email_72;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 73",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 73" },
    ref_key: "statuses",
  })
  status_73;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 74",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 74" },
  })
  email_74;

  @editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    el: "input",
    type: "text",
    label: "Name 75",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Name 75" },
  })
  name_75;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 76",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 76" },
  })
  email_76;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 77",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 77" },
    ref_key: "statuses",
  })
  status_77;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 78",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 78" },
  })
  email_78;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 79",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 79" },
    ref_key: "statuses",
  })
  status_79;

  @editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    el: "input",
    type: "text",
    label: "Name 80",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Name 80" },
  })
  name_80;

  @editable
  @Length(10, 350)
  @IsString()
  @field({
    el: "textarea",
    type: "text",
    label: "Description 81",
    required: false,
    hint: "This is a hint!",
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Description 81" },
  })
  description_81;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 82",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 82" },
  })
  email_82;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 83",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 83" },
    ref_key: "statuses",
  })
  status_83;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 84",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 84" },
  })
  email_84;

  @editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    el: "input",
    type: "text",
    label: "Name 85",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Name 85" },
  })
  name_85;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 86",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 86" },
  })
  email_86;

  @editable
  @Length(10, 350)
  @IsString()
  @field({
    el: "textarea",
    type: "text",
    label: "Description 87",
    required: false,
    hint: "This is a hint!",
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Description 87" },
  })
  description_87;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 88",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 88" },
  })
  email_88;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 89",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 89" },
    ref_key: "statuses",
  })
  status_89;

  @editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    el: "input",
    type: "text",
    label: "Name 90",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Name 90" },
  })
  name_90;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 91",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 91" },
    ref_key: "statuses",
  })
  status_91;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 92",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 92" },
  })
  email_92;

  @editable
  @Length(10, 350)
  @IsString()
  @field({
    el: "textarea",
    type: "text",
    label: "Description 93",
    required: false,
    hint: "This is a hint!",
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Description 93" },
  })
  description_93;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 94",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 94" },
  })
  email_94;

  @editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    el: "input",
    type: "text",
    label: "Name 95",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Name 95" },
  })
  name_95;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 96",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 96" },
  })
  email_96;

  @editable
  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    el: "select",
    type: "select",
    label: "Status 97",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Status 97" },
    ref_key: "statuses",
  })
  status_97;

  @editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    el: "input",
    type: "email",
    label: "Email 98",
    required: false,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Email 98" },
  })
  email_98;

  @editable
  @Length(10, 350)
  @IsString()
  @field({
    el: "textarea",
    type: "text",
    label: "Description 99",
    required: false,
    hint: "This is a hint!",
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Description 99" },
  })
  description_99;

  @editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    el: "input",
    type: "text",
    label: "Name 100",
    required: true,
    classes: "col-span-4 sm:col-span-2",
    attributes: { placeholder: "Name 100" },
  })
  name_100;

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
