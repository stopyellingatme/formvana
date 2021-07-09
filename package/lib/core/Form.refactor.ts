import { SvelteComponent, SvelteComponentDev } from "svelte/internal";
import { get, writable, Writable } from "svelte/store";
import {
  _addCallbackToField,
  _attachEventListeners,
  _buildFormFields,
  _buildFormFieldsWithSchema,
  _executeValidationEvent,
  _get,
  _hanldeFieldGroups,
  _linkAllErrors,
  _linkAllValues,
  _resetState,
  _setFieldAttributes,
  _setFieldOrder,
  _setInitialState
} from "../utilities";
import { FieldConfig } from "./FieldConfig";
import {
  Callback,
  ElementEvent,
  FieldNode,
  FormFieldSchema,
  InitialFormState,
  OnEvents,
  ReferenceData,
  ValidationCallback,
  ValidationError,
  ValidationProperties
} from "./Types";

/**
 * Let's get a base Form class first.
 * The aim is to try and have types like:
 *  - Validatable
 *  - Stateful
 *  - Templatable
 *  - Watchable
 *  - 
 */
