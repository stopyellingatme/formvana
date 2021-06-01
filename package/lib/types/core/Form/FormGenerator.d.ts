/**
 * - This is intended to work like a typescript Mixin.
 *
 * The function takes a set of params and returns an enriched Form class with
 * with all the fixins.
 */
import { Form } from "../Form";
export default function <T extends Object>(form_options: Partial<T>): Form<T> | undefined;
