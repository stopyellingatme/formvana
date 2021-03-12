
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
import { editable, field } from "../../package/typescript";
import { FieldConfig } from "../../package/typescript";

export enum BusinessStatus {
  ACTIVE,
  PENDING,
  SUSPENDED,
  ARCHIVED,
}

export enum UserStatus {
  ACTIVE,
  DISABLED,
}

export class Business {
  
	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 1",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 1" },ref_key: "business_statuses",
    })
  )
  user_status_1;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 2",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 2" },
    })
  )
  email_2;


	@editable
  @Length(10, 350)
@IsString()
  @field(
    new FieldConfig({
      el: "textarea",
      type: "text",
      label: "Description 3",
      required: false,hint: "This is a hint!",
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 3" },
    })
  )
  description_3;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 4",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 4" },
    })
  )
  email_4;


	@editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Name 5",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 5" },
    })
  )
  name_5;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 6",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 6" },
    })
  )
  email_6;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 7",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 7" },ref_key: "business_statuses",
    })
  )
  user_status_7;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 8",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 8" },
    })
  )
  email_8;


	@editable
  @Length(10, 350)
@IsString()
  @field(
    new FieldConfig({
      el: "textarea",
      type: "text",
      label: "Description 9",
      required: false,hint: "This is a hint!",
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 9" },
    })
  )
  description_9;


	@editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Name 10",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 10" },
    })
  )
  name_10;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 11",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 11" },ref_key: "business_statuses",
    })
  )
  user_status_11;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 12",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 12" },
    })
  )
  email_12;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 13",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 13" },ref_key: "business_statuses",
    })
  )
  user_status_13;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 14",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 14" },
    })
  )
  email_14;


	@editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Name 15",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 15" },
    })
  )
  name_15;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 16",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 16" },
    })
  )
  email_16;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 17",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 17" },ref_key: "business_statuses",
    })
  )
  user_status_17;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 18",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 18" },
    })
  )
  email_18;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 19",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 19" },ref_key: "business_statuses",
    })
  )
  user_status_19;


	@editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Name 20",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 20" },
    })
  )
  name_20;


	@editable
  @Length(10, 350)
@IsString()
  @field(
    new FieldConfig({
      el: "textarea",
      type: "text",
      label: "Description 21",
      required: false,hint: "This is a hint!",
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 21" },
    })
  )
  description_21;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 22",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 22" },
    })
  )
  email_22;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 23",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 23" },ref_key: "business_statuses",
    })
  )
  user_status_23;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 24",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 24" },
    })
  )
  email_24;


	@editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Name 25",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 25" },
    })
  )
  name_25;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 26",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 26" },
    })
  )
  email_26;


	@editable
  @Length(10, 350)
@IsString()
  @field(
    new FieldConfig({
      el: "textarea",
      type: "text",
      label: "Description 27",
      required: false,hint: "This is a hint!",
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 27" },
    })
  )
  description_27;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 28",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 28" },
    })
  )
  email_28;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 29",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 29" },ref_key: "business_statuses",
    })
  )
  user_status_29;


	@editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Name 30",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 30" },
    })
  )
  name_30;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 31",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 31" },ref_key: "business_statuses",
    })
  )
  user_status_31;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 32",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 32" },
    })
  )
  email_32;


	@editable
  @Length(10, 350)
@IsString()
  @field(
    new FieldConfig({
      el: "textarea",
      type: "text",
      label: "Description 33",
      required: false,hint: "This is a hint!",
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 33" },
    })
  )
  description_33;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 34",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 34" },
    })
  )
  email_34;


	@editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Name 35",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 35" },
    })
  )
  name_35;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 36",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 36" },
    })
  )
  email_36;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 37",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 37" },ref_key: "business_statuses",
    })
  )
  user_status_37;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 38",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 38" },
    })
  )
  email_38;


	@editable
  @Length(10, 350)
@IsString()
  @field(
    new FieldConfig({
      el: "textarea",
      type: "text",
      label: "Description 39",
      required: false,hint: "This is a hint!",
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 39" },
    })
  )
  description_39;


	@editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Name 40",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 40" },
    })
  )
  name_40;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 41",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 41" },ref_key: "business_statuses",
    })
  )
  user_status_41;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 42",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 42" },
    })
  )
  email_42;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 43",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 43" },ref_key: "business_statuses",
    })
  )
  user_status_43;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 44",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 44" },
    })
  )
  email_44;


	@editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Name 45",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 45" },
    })
  )
  name_45;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 46",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 46" },
    })
  )
  email_46;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 47",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 47" },ref_key: "business_statuses",
    })
  )
  user_status_47;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 48",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 48" },
    })
  )
  email_48;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 49",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 49" },ref_key: "business_statuses",
    })
  )
  user_status_49;


	@editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Name 50",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 50" },
    })
  )
  name_50;


	@editable
  @Length(10, 350)
@IsString()
  @field(
    new FieldConfig({
      el: "textarea",
      type: "text",
      label: "Description 51",
      required: false,hint: "This is a hint!",
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 51" },
    })
  )
  description_51;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 52",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 52" },
    })
  )
  email_52;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 53",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 53" },ref_key: "business_statuses",
    })
  )
  user_status_53;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 54",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 54" },
    })
  )
  email_54;


	@editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Name 55",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 55" },
    })
  )
  name_55;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 56",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 56" },
    })
  )
  email_56;


	@editable
  @Length(10, 350)
@IsString()
  @field(
    new FieldConfig({
      el: "textarea",
      type: "text",
      label: "Description 57",
      required: false,hint: "This is a hint!",
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 57" },
    })
  )
  description_57;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 58",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 58" },
    })
  )
  email_58;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 59",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 59" },ref_key: "business_statuses",
    })
  )
  user_status_59;


	@editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Name 60",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 60" },
    })
  )
  name_60;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 61",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 61" },ref_key: "business_statuses",
    })
  )
  user_status_61;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 62",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 62" },
    })
  )
  email_62;


	@editable
  @Length(10, 350)
@IsString()
  @field(
    new FieldConfig({
      el: "textarea",
      type: "text",
      label: "Description 63",
      required: false,hint: "This is a hint!",
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 63" },
    })
  )
  description_63;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 64",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 64" },
    })
  )
  email_64;


	@editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Name 65",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 65" },
    })
  )
  name_65;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 66",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 66" },
    })
  )
  email_66;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 67",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 67" },ref_key: "business_statuses",
    })
  )
  user_status_67;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 68",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 68" },
    })
  )
  email_68;


	@editable
  @Length(10, 350)
@IsString()
  @field(
    new FieldConfig({
      el: "textarea",
      type: "text",
      label: "Description 69",
      required: false,hint: "This is a hint!",
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 69" },
    })
  )
  description_69;


	@editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Name 70",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 70" },
    })
  )
  name_70;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 71",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 71" },ref_key: "business_statuses",
    })
  )
  user_status_71;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 72",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 72" },
    })
  )
  email_72;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 73",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 73" },ref_key: "business_statuses",
    })
  )
  user_status_73;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 74",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 74" },
    })
  )
  email_74;


	@editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Name 75",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 75" },
    })
  )
  name_75;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 76",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 76" },
    })
  )
  email_76;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 77",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 77" },ref_key: "business_statuses",
    })
  )
  user_status_77;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 78",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 78" },
    })
  )
  email_78;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 79",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 79" },ref_key: "business_statuses",
    })
  )
  user_status_79;


	@editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Name 80",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 80" },
    })
  )
  name_80;


	@editable
  @Length(10, 350)
@IsString()
  @field(
    new FieldConfig({
      el: "textarea",
      type: "text",
      label: "Description 81",
      required: false,hint: "This is a hint!",
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 81" },
    })
  )
  description_81;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 82",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 82" },
    })
  )
  email_82;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 83",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 83" },ref_key: "business_statuses",
    })
  )
  user_status_83;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 84",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 84" },
    })
  )
  email_84;


	@editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Name 85",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 85" },
    })
  )
  name_85;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 86",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 86" },
    })
  )
  email_86;


	@editable
  @Length(10, 350)
@IsString()
  @field(
    new FieldConfig({
      el: "textarea",
      type: "text",
      label: "Description 87",
      required: false,hint: "This is a hint!",
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 87" },
    })
  )
  description_87;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 88",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 88" },
    })
  )
  email_88;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 89",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 89" },ref_key: "business_statuses",
    })
  )
  user_status_89;


	@editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Name 90",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 90" },
    })
  )
  name_90;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 91",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 91" },ref_key: "business_statuses",
    })
  )
  user_status_91;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 92",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 92" },
    })
  )
  email_92;


	@editable
  @Length(10, 350)
@IsString()
  @field(
    new FieldConfig({
      el: "textarea",
      type: "text",
      label: "Description 93",
      required: false,hint: "This is a hint!",
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 93" },
    })
  )
  description_93;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 94",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 94" },
    })
  )
  email_94;


	@editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Name 95",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 95" },
    })
  )
  name_95;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 96",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 96" },
    })
  )
  email_96;


	@editable
  @IsEnum(BusinessStatus, { message: "Please choose a Business Status" })
  @field(
    new FieldConfig({
      el: "select",
      type: "select",
      label: "User Status 97",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "User Status 97" },ref_key: "business_statuses",
    })
  )
  user_status_97;


	@editable
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field(
    new FieldConfig({
      el: "input",
      type: "email",
      label: "Email 98",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 98" },
    })
  )
  email_98;


	@editable
  @Length(10, 350)
@IsString()
  @field(
    new FieldConfig({
      el: "textarea",
      type: "text",
      label: "Description 99",
      required: false,hint: "This is a hint!",
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 99" },
    })
  )
  description_99;


	@editable
  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field(
    new FieldConfig({
      el: "input",
      type: "text",
      label: "Name 100",
      required: true,
      classname: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 100" },
    })
  )
  name_100;


  constructor(init?: Partial<Business>) {
    if (init) {
      Object.keys(this).forEach((key) => {
        if (init[key]) {
          this[key] = init[key];
        }
      });
    }
  }
}