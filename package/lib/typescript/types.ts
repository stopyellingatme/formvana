/**
 * TODO: Define strict types for FieldConfig
 */

/**
 * Determines which events to validate/clear validation, on.
 * And, you can bring your own event listeners just by adding one on
 * the init.
 * Enabled By Default: blue, change, focus, input, submit
 *
 * Also has the good ole Object.assign in the constructor.
 * It's brazen, but you're a smart kid.
 * Use it wisely.
 *
 * TODO: Possilbe candidate for Mapped Type
 */
export class OnEvents {
  constructor(init?: Partial<OnEvents>, disableAll: boolean = false) {
    // If disableAll is false, turn off all event listeners
    if (disableAll) {
      Object.keys(this).forEach((key) => {
        this[key] = false;
      });
    }
    Object.assign(this, init);
  }

  blur: boolean = true;
  change: boolean = true;
  click: boolean = false;
  dblclick: boolean = false;
  focus: boolean = true;
  input: boolean = true;
  keydown: boolean = false;
  keypress: boolean = false;
  keyup: boolean = false;
  mount: boolean = false;
  mousedown: boolean = false;
  mouseenter: boolean = false;
  mouseleave: boolean = false;
  mousemove: boolean = false;
  mouseout: boolean = false;
  mouseover: boolean = false;
  mouseup: boolean = false;
  submit: boolean = true;
}

/**
 * Should we link the values always?
 * Or only if the form is valid?
 */
export enum LinkOnEvent {
  Always,
  Valid,
}

/**
 * Data format for the reference data items
 * Form.refs are of type Record<string, RefDataItem[]>
 *
 * TODO: Possilbe candidate for Mapped Type
 */
export interface RefDataItem {
  label: string;
  value: any;
}

export type RefData<T extends Record<string, RefDataItem[]>> = {
	
}