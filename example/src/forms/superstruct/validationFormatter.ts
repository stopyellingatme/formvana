import { validate, StructError } from "superstruct";
import { ValidationError } from "@formvana";

/**
 * ! TESTING TO SEE IF THIS WORKS! -- IT WORKED! :)
 *
 * This was a test to see if it's possible/easy to coop the ValidationError
 * in order to conform other validator's error types into the proper shape.
 *
 * It seems to have been successful, albeit a little more complex than I'd like.
 */
export const doValidation = async (
  model,
  struct
): Promise<ValidationError[]> => {
  /** Validate the struct */
  /** Flatten the array so it's not [[ValidationError], [ValidationError]] */
  return [].concat(
    [],
    ...validate(model, struct)
      .map((error: StructError) => {
        if (!error) return;

        /** Map the failures into ValidationErrors */
        let errors;
        if (error.failures instanceof Function) {
          errors = error.failures().map((fail) => {
            /** Get/Format the validation contraints */
            const constraints = Object.assign(
              {},
              ...error
                .failures()
                .filter((failure) => failure.key === fail.key)
                .map((err) => ({ [err.type]: err.message }))
            );
            /** Return the validaiton error with the given field key and errors */
            return new ValidationError(fail.key, constraints);
          });
        }
        return errors;
      })
      .filter((e) => e)
  );
};
