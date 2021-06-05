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
  IsNumber,
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
    attributes: { placeholder: "Status 1", type: "number" },
    ref_key: "statuses",
  })
  status_1;

  @IsNumber()
  @field({
    selector: "input",
    data_type: "number",
    label: "Email 2",
    required: true,
    attributes: { placeholder: "Email 2", type: "number" },
  })
  email_2;

  @Length(10, 350)
  @IsString()
  @field({
    selector: "textarea",
    data_type: "string",
    label: "Description 3",
    required: false,
    hint: "This is a hint!",
    attributes: { placeholder: "Description 3", type: "text" },
  })
  description_3;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 4",
    required: true,
    attributes: { placeholder: "Email 4", type: "email" },
  })
  email_4;

  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    selector: "input",
    data_type: "string",
    label: "Name 5",
    required: true,
    attributes: { placeholder: "Name 5", type: "text" },
  })
  name_5;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
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
    data_type: "string",
    label: "Email 8",
    required: true,
    attributes: { placeholder: "Email 8", type: "email" },
  })
  email_8;

  @Length(10, 350)
  @IsString()
  @field({
    selector: "textarea",
    data_type: "string",
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
    data_type: "string",
    label: "Name 10",
    required: true,
    attributes: { placeholder: "Name 10", type: "text" },
  })
  name_10;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 11",
    required: true,
    attributes: { placeholder: "Status 11", type: "number" },
    ref_key: "statuses",
  })
  status_11;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 12",
    required: true,
    attributes: { placeholder: "Email 12", type: "email" },
  })
  email_12;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 13",
    required: true,
    attributes: { placeholder: "Status 13", type: "number" },
    ref_key: "statuses",
  })
  status_13;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 14",
    required: true,
    attributes: { placeholder: "Email 14", type: "email" },
  })
  email_14;

  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    selector: "input",
    data_type: "string",
    label: "Name 15",
    required: true,
    attributes: { placeholder: "Name 15", type: "text" },
  })
  name_15;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 16",
    required: true,
    attributes: { placeholder: "Email 16", type: "email" },
  })
  email_16;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 17",
    required: true,
    attributes: { placeholder: "Status 17", type: "number" },
    ref_key: "statuses",
  })
  status_17;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 18",
    required: true,
    attributes: { placeholder: "Email 18", type: "email" },
  })
  email_18;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 19",
    required: true,
    attributes: { placeholder: "Status 19", type: "number" },
    ref_key: "statuses",
  })
  status_19;

  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    selector: "input",
    data_type: "string",
    label: "Name 20",
    required: true,
    attributes: { placeholder: "Name 20", type: "text" },
  })
  name_20;

  @Length(10, 350)
  @IsString()
  @field({
    selector: "textarea",
    data_type: "string",
    label: "Description 21",
    required: false,
    hint: "This is a hint!",
    attributes: { placeholder: "Description 21", type: "text" },
  })
  description_21;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 22",
    required: true,
    attributes: { placeholder: "Email 22", type: "email" },
  })
  email_22;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 23",
    required: true,
    attributes: { placeholder: "Status 23", type: "number" },
    ref_key: "statuses",
  })
  status_23;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 24",
    required: true,
    attributes: { placeholder: "Email 24", type: "email" },
  })
  email_24;

  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    selector: "input",
    data_type: "string",
    label: "Name 25",
    required: true,
    attributes: { placeholder: "Name 25", type: "text" },
  })
  name_25;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 26",
    required: true,
    attributes: { placeholder: "Email 26", type: "email" },
  })
  email_26;

  @Length(10, 350)
  @IsString()
  @field({
    selector: "textarea",
    data_type: "string",
    label: "Description 27",
    required: false,
    hint: "This is a hint!",
    attributes: { placeholder: "Description 27", type: "text" },
  })
  description_27;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 28",
    required: true,
    attributes: { placeholder: "Email 28", type: "email" },
  })
  email_28;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 29",
    required: true,
    attributes: { placeholder: "Status 29", type: "number" },
    ref_key: "statuses",
  })
  status_29;

  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    selector: "input",
    data_type: "string",
    label: "Name 30",
    required: true,
    attributes: { placeholder: "Name 30", type: "text" },
  })
  name_30;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 31",
    required: true,
    attributes: { placeholder: "Status 31", type: "number" },
    ref_key: "statuses",
  })
  status_31;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 32",
    required: true,
    attributes: { placeholder: "Email 32", type: "email" },
  })
  email_32;

  @Length(10, 350)
  @IsString()
  @field({
    selector: "textarea",
    data_type: "string",
    label: "Description 33",
    required: false,
    hint: "This is a hint!",
    attributes: { placeholder: "Description 33", type: "text" },
  })
  description_33;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 34",
    required: true,
    attributes: { placeholder: "Email 34", type: "email" },
  })
  email_34;

  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    selector: "input",
    data_type: "string",
    label: "Name 35",
    required: true,
    attributes: { placeholder: "Name 35", type: "text" },
  })
  name_35;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 36",
    required: true,
    attributes: { placeholder: "Email 36", type: "email" },
  })
  email_36;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 37",
    required: true,
    attributes: { placeholder: "Status 37", type: "number" },
    ref_key: "statuses",
  })
  status_37;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 38",
    required: true,
    attributes: { placeholder: "Email 38", type: "email" },
  })
  email_38;

  @Length(10, 350)
  @IsString()
  @field({
    selector: "textarea",
    data_type: "string",
    label: "Description 39",
    required: false,
    hint: "This is a hint!",
    attributes: { placeholder: "Description 39", type: "text" },
  })
  description_39;

  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    selector: "input",
    data_type: "string",
    label: "Name 40",
    required: true,
    attributes: { placeholder: "Name 40", type: "text" },
  })
  name_40;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 41",
    required: true,
    attributes: { placeholder: "Status 41", type: "number" },
    ref_key: "statuses",
  })
  status_41;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 42",
    required: true,
    attributes: { placeholder: "Email 42", type: "email" },
  })
  email_42;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 43",
    required: true,
    attributes: { placeholder: "Status 43", type: "number" },
    ref_key: "statuses",
  })
  status_43;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 44",
    required: true,
    attributes: { placeholder: "Email 44", type: "email" },
  })
  email_44;

  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    selector: "input",
    data_type: "string",
    label: "Name 45",
    required: true,
    attributes: { placeholder: "Name 45", type: "text" },
  })
  name_45;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 46",
    required: true,
    attributes: { placeholder: "Email 46", type: "email" },
  })
  email_46;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 47",
    required: true,
    attributes: { placeholder: "Status 47", type: "number" },
    ref_key: "statuses",
  })
  status_47;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 48",
    required: true,
    attributes: { placeholder: "Email 48", type: "email" },
  })
  email_48;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 49",
    required: true,
    attributes: { placeholder: "Status 49", type: "number" },
    ref_key: "statuses",
  })
  status_49;

  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    selector: "input",
    data_type: "string",
    label: "Name 50",
    required: true,
    attributes: { placeholder: "Name 50", type: "text" },
  })
  name_50;

  @Length(10, 350)
  @IsString()
  @field({
    selector: "textarea",
    data_type: "string",
    label: "Description 51",
    required: false,
    hint: "This is a hint!",
    attributes: { placeholder: "Description 51", type: "text" },
  })
  description_51;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 52",
    required: true,
    attributes: { placeholder: "Email 52", type: "email" },
  })
  email_52;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 53",
    required: true,
    attributes: { placeholder: "Status 53", type: "number" },
    ref_key: "statuses",
  })
  status_53;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 54",
    required: true,
    attributes: { placeholder: "Email 54", type: "email" },
  })
  email_54;

  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    selector: "input",
    data_type: "string",
    label: "Name 55",
    required: true,
    attributes: { placeholder: "Name 55", type: "text" },
  })
  name_55;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 56",
    required: true,
    attributes: { placeholder: "Email 56", type: "email" },
  })
  email_56;

  @Length(10, 350)
  @IsString()
  @field({
    selector: "textarea",
    data_type: "string",
    label: "Description 57",
    required: false,
    hint: "This is a hint!",
    attributes: { placeholder: "Description 57", type: "text" },
  })
  description_57;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 58",
    required: true,
    attributes: { placeholder: "Email 58", type: "email" },
  })
  email_58;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 59",
    required: true,
    attributes: { placeholder: "Status 59", type: "number" },
    ref_key: "statuses",
  })
  status_59;

  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    selector: "input",
    data_type: "string",
    label: "Name 60",
    required: true,
    attributes: { placeholder: "Name 60", type: "text" },
  })
  name_60;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 61",
    required: true,
    attributes: { placeholder: "Status 61", type: "number" },
    ref_key: "statuses",
  })
  status_61;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 62",
    required: true,
    attributes: { placeholder: "Email 62", type: "email" },
  })
  email_62;

  @Length(10, 350)
  @IsString()
  @field({
    selector: "textarea",
    data_type: "string",
    label: "Description 63",
    required: false,
    hint: "This is a hint!",
    attributes: { placeholder: "Description 63", type: "text" },
  })
  description_63;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 64",
    required: true,
    attributes: { placeholder: "Email 64", type: "email" },
  })
  email_64;

  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    selector: "input",
    data_type: "string",
    label: "Name 65",
    required: true,
    attributes: { placeholder: "Name 65", type: "text" },
  })
  name_65;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 66",
    required: true,
    attributes: { placeholder: "Email 66", type: "email" },
  })
  email_66;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 67",
    required: true,
    attributes: { placeholder: "Status 67", type: "number" },
    ref_key: "statuses",
  })
  status_67;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 68",
    required: true,
    attributes: { placeholder: "Email 68", type: "email" },
  })
  email_68;

  @Length(10, 350)
  @IsString()
  @field({
    selector: "textarea",
    data_type: "string",
    label: "Description 69",
    required: false,
    hint: "This is a hint!",
    attributes: { placeholder: "Description 69", type: "text" },
  })
  description_69;

  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    selector: "input",
    data_type: "string",
    label: "Name 70",
    required: true,
    attributes: { placeholder: "Name 70", type: "text" },
  })
  name_70;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 71",
    required: true,
    attributes: { placeholder: "Status 71", type: "number" },
    ref_key: "statuses",
  })
  status_71;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 72",
    required: true,
    attributes: { placeholder: "Email 72", type: "email" },
  })
  email_72;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 73",
    required: true,
    attributes: { placeholder: "Status 73", type: "number" },
    ref_key: "statuses",
  })
  status_73;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 74",
    required: true,
    attributes: { placeholder: "Email 74", type: "email" },
  })
  email_74;

  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    selector: "input",
    data_type: "string",
    label: "Name 75",
    required: true,
    attributes: { placeholder: "Name 75", type: "text" },
  })
  name_75;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 76",
    required: true,
    attributes: { placeholder: "Email 76", type: "email" },
  })
  email_76;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 77",
    required: true,
    attributes: { placeholder: "Status 77", type: "number" },
    ref_key: "statuses",
  })
  status_77;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 78",
    required: true,
    attributes: { placeholder: "Email 78", type: "email" },
  })
  email_78;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 79",
    required: true,
    attributes: { placeholder: "Status 79", type: "number" },
    ref_key: "statuses",
  })
  status_79;

  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    selector: "input",
    data_type: "string",
    label: "Name 80",
    required: true,
    attributes: { placeholder: "Name 80", type: "text" },
  })
  name_80;

  @Length(10, 350)
  @IsString()
  @field({
    selector: "textarea",
    data_type: "string",
    label: "Description 81",
    required: false,
    hint: "This is a hint!",
    attributes: { placeholder: "Description 81", type: "text" },
  })
  description_81;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 82",
    required: true,
    attributes: { placeholder: "Email 82", type: "email" },
  })
  email_82;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 83",
    required: true,
    attributes: { placeholder: "Status 83", type: "number" },
    ref_key: "statuses",
  })
  status_83;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 84",
    required: true,
    attributes: { placeholder: "Email 84", type: "email" },
  })
  email_84;

  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    selector: "input",
    data_type: "string",
    label: "Name 85",
    required: true,
    attributes: { placeholder: "Name 85", type: "text" },
  })
  name_85;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 86",
    required: true,
    attributes: { placeholder: "Email 86", type: "email" },
  })
  email_86;

  @Length(10, 350)
  @IsString()
  @field({
    selector: "textarea",
    data_type: "string",
    label: "Description 87",
    required: false,
    hint: "This is a hint!",
    attributes: { placeholder: "Description 87", type: "text" },
  })
  description_87;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 88",
    required: true,
    attributes: { placeholder: "Email 88", type: "email" },
  })
  email_88;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 89",
    required: true,
    attributes: { placeholder: "Status 89", type: "number" },
    ref_key: "statuses",
  })
  status_89;

  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    selector: "input",
    data_type: "string",
    label: "Name 90",
    required: true,
    attributes: { placeholder: "Name 90", type: "text" },
  })
  name_90;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 91",
    required: true,
    attributes: { placeholder: "Status 91", type: "number" },
    ref_key: "statuses",
  })
  status_91;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 92",
    required: true,
    attributes: { placeholder: "Email 92", type: "email" },
  })
  email_92;

  @Length(10, 350)
  @IsString()
  @field({
    selector: "textarea",
    data_type: "string",
    label: "Description 93",
    required: false,
    hint: "This is a hint!",
    attributes: { placeholder: "Description 93", type: "text" },
  })
  description_93;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 94",
    required: true,
    attributes: { placeholder: "Email 94", type: "email" },
  })
  email_94;

  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    selector: "input",
    data_type: "string",
    label: "Name 95",
    required: true,
    attributes: { placeholder: "Name 95", type: "text" },
  })
  name_95;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 96",
    required: true,
    attributes: { placeholder: "Email 96", type: "email" },
  })
  email_96;

  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
    selector: "select",
    data_type: "number",
    label: "Status 97",
    required: true,
    attributes: { placeholder: "Status 97", type: "number" },
    ref_key: "statuses",
  })
  status_97;

  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    selector: "input",
    data_type: "string",
    label: "Email 98",
    required: true,
    attributes: { placeholder: "Email 98", type: "email" },
  })
  email_98;

  @Length(10, 350)
  @IsString()
  @field({
    selector: "textarea",
    data_type: "string",
    label: "Description 99",
    required: false,
    hint: "This is a hint!",
    attributes: { placeholder: "Description 99", type: "text" },
  })
  description_99;

  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
  @IsString()
  @field({
    selector: "input",
    data_type: "string",
    label: "Name 100",
    required: true,
    attributes: { placeholder: "Name 100", type: "text" },
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
