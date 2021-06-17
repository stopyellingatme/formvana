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

  @field({
    label: "Password",
    required: true,
    attributes: { type: "password" },
  })
  password: string;

  @field({
    selector: "file",
    data_type: "file",
    label: "Avatar",
    required: false,
    exclude_events: ["focus", "blur"],
  })
  avatar: string;

  @Length(10, 90)
  @IsString()
  @field({
    label: "Display Name",
    required: true,
    attributes: { placeholder: "Your Name. People See" },
  })
  display_name: string;
}
