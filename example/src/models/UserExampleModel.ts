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

export class UserExampleModel {
  @IsEmail({}, { message: "Please enter a valid email address" })
  @field({
    label: "Email",
    required: true,
    attributes: { placeholder: "Email", type: "email" },
  })
  email: string;

  @Length(10, 90)
  @field({
    label: "Password",
    required: true,
    attributes: { placeholder: "Enter Password", type: "password" },
  })
  password: string;

  @Length(10, 90)
  @field({
    label: "Confirm Password",
    required: true,
    for_form: "register",
    attributes: {
      placeholder: "Confirm Password",
      type: "password",
      title: "I know this isn't best practice anymore. It's just an example.",
    },
  })
  confirm_password: string;

	@Length(10, 90)
  @IsString()
  @field({
    label: "Display Name",
    required: true,
    for_form: "register",
    attributes: { placeholder: "Your Name. People See" },
  })
  display_name: string;

  @field({
    selector: "file",
    data_type: "file",
    label: "Avatar",
    required: false,
    for_form: "register",
    exclude_events: ["focus", "blur"],
  })
  avatar: string;

  
}
