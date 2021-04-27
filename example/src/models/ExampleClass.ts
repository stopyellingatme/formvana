
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


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 11",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 11" },ref_key: "statuses",
    }
  )
  status_11;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 12",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 12" },
    }
  )
  email_12;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 13",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 13" },ref_key: "statuses",
    }
  )
  status_13;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 14",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 14" },
    }
  )
  email_14;


  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field({
      selector: "input",
      type: "text",
      label: "Name 15",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 15" },
    }
  )
  name_15;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 16",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 16" },
    }
  )
  email_16;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 17",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 17" },ref_key: "statuses",
    }
  )
  status_17;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 18",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 18" },
    }
  )
  email_18;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 19",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 19" },ref_key: "statuses",
    }
  )
  status_19;


  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field({
      selector: "input",
      type: "text",
      label: "Name 20",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 20" },
    }
  )
  name_20;


  @Length(10, 350)
@IsString()
  @field({
      selector: "textarea",
      type: "text",
      label: "Description 21",
      required: false,hint: "This is a hint!",
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 21" },
    }
  )
  description_21;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 22",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 22" },
    }
  )
  email_22;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 23",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 23" },ref_key: "statuses",
    }
  )
  status_23;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 24",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 24" },
    }
  )
  email_24;


  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field({
      selector: "input",
      type: "text",
      label: "Name 25",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 25" },
    }
  )
  name_25;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 26",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 26" },
    }
  )
  email_26;


  @Length(10, 350)
@IsString()
  @field({
      selector: "textarea",
      type: "text",
      label: "Description 27",
      required: false,hint: "This is a hint!",
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 27" },
    }
  )
  description_27;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 28",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 28" },
    }
  )
  email_28;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 29",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 29" },ref_key: "statuses",
    }
  )
  status_29;


  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field({
      selector: "input",
      type: "text",
      label: "Name 30",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 30" },
    }
  )
  name_30;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 31",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 31" },ref_key: "statuses",
    }
  )
  status_31;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 32",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 32" },
    }
  )
  email_32;


  @Length(10, 350)
@IsString()
  @field({
      selector: "textarea",
      type: "text",
      label: "Description 33",
      required: false,hint: "This is a hint!",
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 33" },
    }
  )
  description_33;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 34",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 34" },
    }
  )
  email_34;


  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field({
      selector: "input",
      type: "text",
      label: "Name 35",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 35" },
    }
  )
  name_35;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 36",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 36" },
    }
  )
  email_36;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 37",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 37" },ref_key: "statuses",
    }
  )
  status_37;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 38",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 38" },
    }
  )
  email_38;


  @Length(10, 350)
@IsString()
  @field({
      selector: "textarea",
      type: "text",
      label: "Description 39",
      required: false,hint: "This is a hint!",
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 39" },
    }
  )
  description_39;


  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field({
      selector: "input",
      type: "text",
      label: "Name 40",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 40" },
    }
  )
  name_40;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 41",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 41" },ref_key: "statuses",
    }
  )
  status_41;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 42",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 42" },
    }
  )
  email_42;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 43",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 43" },ref_key: "statuses",
    }
  )
  status_43;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 44",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 44" },
    }
  )
  email_44;


  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field({
      selector: "input",
      type: "text",
      label: "Name 45",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 45" },
    }
  )
  name_45;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 46",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 46" },
    }
  )
  email_46;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 47",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 47" },ref_key: "statuses",
    }
  )
  status_47;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 48",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 48" },
    }
  )
  email_48;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 49",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 49" },ref_key: "statuses",
    }
  )
  status_49;


  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field({
      selector: "input",
      type: "text",
      label: "Name 50",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 50" },
    }
  )
  name_50;


  @Length(10, 350)
@IsString()
  @field({
      selector: "textarea",
      type: "text",
      label: "Description 51",
      required: false,hint: "This is a hint!",
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 51" },
    }
  )
  description_51;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 52",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 52" },
    }
  )
  email_52;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 53",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 53" },ref_key: "statuses",
    }
  )
  status_53;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 54",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 54" },
    }
  )
  email_54;


  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field({
      selector: "input",
      type: "text",
      label: "Name 55",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 55" },
    }
  )
  name_55;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 56",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 56" },
    }
  )
  email_56;


  @Length(10, 350)
@IsString()
  @field({
      selector: "textarea",
      type: "text",
      label: "Description 57",
      required: false,hint: "This is a hint!",
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 57" },
    }
  )
  description_57;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 58",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 58" },
    }
  )
  email_58;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 59",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 59" },ref_key: "statuses",
    }
  )
  status_59;


  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field({
      selector: "input",
      type: "text",
      label: "Name 60",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 60" },
    }
  )
  name_60;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 61",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 61" },ref_key: "statuses",
    }
  )
  status_61;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 62",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 62" },
    }
  )
  email_62;


  @Length(10, 350)
@IsString()
  @field({
      selector: "textarea",
      type: "text",
      label: "Description 63",
      required: false,hint: "This is a hint!",
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 63" },
    }
  )
  description_63;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 64",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 64" },
    }
  )
  email_64;


  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field({
      selector: "input",
      type: "text",
      label: "Name 65",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 65" },
    }
  )
  name_65;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 66",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 66" },
    }
  )
  email_66;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 67",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 67" },ref_key: "statuses",
    }
  )
  status_67;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 68",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 68" },
    }
  )
  email_68;


  @Length(10, 350)
@IsString()
  @field({
      selector: "textarea",
      type: "text",
      label: "Description 69",
      required: false,hint: "This is a hint!",
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 69" },
    }
  )
  description_69;


  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field({
      selector: "input",
      type: "text",
      label: "Name 70",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 70" },
    }
  )
  name_70;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 71",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 71" },ref_key: "statuses",
    }
  )
  status_71;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 72",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 72" },
    }
  )
  email_72;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 73",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 73" },ref_key: "statuses",
    }
  )
  status_73;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 74",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 74" },
    }
  )
  email_74;


  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field({
      selector: "input",
      type: "text",
      label: "Name 75",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 75" },
    }
  )
  name_75;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 76",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 76" },
    }
  )
  email_76;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 77",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 77" },ref_key: "statuses",
    }
  )
  status_77;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 78",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 78" },
    }
  )
  email_78;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 79",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 79" },ref_key: "statuses",
    }
  )
  status_79;


  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field({
      selector: "input",
      type: "text",
      label: "Name 80",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 80" },
    }
  )
  name_80;


  @Length(10, 350)
@IsString()
  @field({
      selector: "textarea",
      type: "text",
      label: "Description 81",
      required: false,hint: "This is a hint!",
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 81" },
    }
  )
  description_81;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 82",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 82" },
    }
  )
  email_82;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 83",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 83" },ref_key: "statuses",
    }
  )
  status_83;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 84",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 84" },
    }
  )
  email_84;


  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field({
      selector: "input",
      type: "text",
      label: "Name 85",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 85" },
    }
  )
  name_85;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 86",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 86" },
    }
  )
  email_86;


  @Length(10, 350)
@IsString()
  @field({
      selector: "textarea",
      type: "text",
      label: "Description 87",
      required: false,hint: "This is a hint!",
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 87" },
    }
  )
  description_87;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 88",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 88" },
    }
  )
  email_88;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 89",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 89" },ref_key: "statuses",
    }
  )
  status_89;


  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field({
      selector: "input",
      type: "text",
      label: "Name 90",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 90" },
    }
  )
  name_90;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 91",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 91" },ref_key: "statuses",
    }
  )
  status_91;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 92",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 92" },
    }
  )
  email_92;


  @Length(10, 350)
@IsString()
  @field({
      selector: "textarea",
      type: "text",
      label: "Description 93",
      required: false,hint: "This is a hint!",
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 93" },
    }
  )
  description_93;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 94",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 94" },
    }
  )
  email_94;


  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field({
      selector: "input",
      type: "text",
      label: "Name 95",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 95" },
    }
  )
  name_95;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 96",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 96" },
    }
  )
  email_96;


  @IsEnum(Status, { message: "Please choose a Status" })
  @field({
      selector: "select",
      type: "select",
      label: "Status 97",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Status 97" },ref_key: "statuses",
    }
  )
  status_97;


  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
      selector: "input",
      type: "email",
      label: "Email 98",
      required: true,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Email 98" },
    }
  )
  email_98;


  @Length(10, 350)
@IsString()
  @field({
      selector: "textarea",
      type: "text",
      label: "Description 99",
      required: false,hint: "This is a hint!",
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Description 99" },
    }
  )
  description_99;


  @Length(10, 90, { message: "Name must be between 10 and 90 characters" })
@IsString()
  @field({
      selector: "input",
      type: "text",
      label: "Name 100",
      required: false,
      classes: "col-span-4 sm:col-span-2",
      attributes: { placeholder: "Name 100" },
    }
  )
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
