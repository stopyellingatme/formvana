import { validate, ValidationError as VError } from "class-validator";
import { ValidationError } from "@formvana";

export const validator = (model, options) => {
  return validate(model, options).then((errors: VError[]) => {
    return errors.map((error) => {
      return new ValidationError(error.property, error.constraints);
    });
  });
};
