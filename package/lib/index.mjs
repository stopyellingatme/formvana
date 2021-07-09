function noop() { }
function safe_not_equal(a, b) {
    return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
}
function subscribe(store, ...callbacks) {
    if (store == null) {
        return noop;
    }
    const unsub = store.subscribe(...callbacks);
    return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
}
function get_store_value(store) {
    let value;
    subscribe(store, _ => value = _)();
    return value;
}
Promise.resolve();

const subscriber_queue = [];
/**
 * Create a `Writable` store that allows both updating and reading by subscription.
 * @param {*=}value initial value
 * @param {StartStopNotifier=}start start and stop notifications for subscriptions
 */
function writable(value, start = noop) {
    let stop;
    const subscribers = [];
    function set(new_value) {
        if (safe_not_equal(value, new_value)) {
            value = new_value;
            if (stop) { // store is ready
                const run_queue = !subscriber_queue.length;
                for (let i = 0; i < subscribers.length; i += 1) {
                    const s = subscribers[i];
                    s[1]();
                    subscriber_queue.push(s, value);
                }
                if (run_queue) {
                    for (let i = 0; i < subscriber_queue.length; i += 2) {
                        subscriber_queue[i][0](subscriber_queue[i + 1]);
                    }
                    subscriber_queue.length = 0;
                }
            }
        }
    }
    function update(fn) {
        set(fn(value));
    }
    function subscribe(run, invalidate = noop) {
        const subscriber = [run, invalidate];
        subscribers.push(subscriber);
        if (subscribers.length === 1) {
            stop = start(set) || noop;
        }
        run(value);
        return () => {
            const index = subscribers.indexOf(subscriber);
            if (index !== -1) {
                subscribers.splice(index, 1);
            }
            if (subscribers.length === 0) {
                stop();
                stop = null;
            }
        };
    }
    return { set, update, subscribe };
}

/**
 * ---------------------------------------------------------------------------
 *
 * FieldConfig is used to help with the form auto generation functionality.
 *
 * This is not meant to be a complete HTML Input/Select/etc replacement.
 * It is simply a vehicle to help give the form generator
 * an easy-to-use format to work with.
 *
 * ---------------------------------------------------------------------------
 */
class FieldConfig {
    constructor(name, init) {
        if (name) {
            this.name = name;
        }
        else {
            throw new Error("{name: string} is required for FieldConfig intialization.");
        }
        /** I know, Object.assign... lots of freedom there. */
        if (init)
            Object.assign(this, init);
        /** Is value Writable store? */
        if (!this.value || !this.value.subscribe) {
            /** If it's not, make it a writable store. */
            this.value = writable(this.value);
        }
        /**
         * I'm doing this because there's not enough thought about accessibility
         * in Forms or for libraries. Better to have SOME kind of default than none
         * at all.
         * So, if there's no aria-label and the title attribute is present...
         */
        if (!this.attributes["aria-label"] && this.attributes["title"]) {
            /** Set aria-label = title */
            this.attributes["aria-label"] = this.attributes["title"];
        }
        else if (!this.attributes["aria-label"]) {
            /** If no aria-label then set it to the label or if !label then name */
            this.attributes["aria-label"] = this.label || this.name;
        }
        /**
         * If required is passed in then make sure the attributes reflect that
         * the field is required.
         */
        if (this.required) {
            this.attributes["required"] = true;
            this.attributes["aria-required"] = true;
        }
        /**
         * This is here becuase i spent ~45min trying to figure out why the
         * file explorer would not open when I clicked the file input label.
         * Well, it's because it needs an Id, not just a name. Duh.
         */
        if (this.data_type === "file" || this.data_type === "files") {
            if (!this.attributes["id"])
                this.attributes["id"] = this.name;
        }
        if (this.data_set)
            this.setDataSet(this.data_set);
    }
    /**
     * Name of the class property.
     * Only set "name" if you are using FieldConfig apart from
     * your object/model.
     * I.e. you are using plain JSON rather than a TS class.
     */
    name;
    /**
     * HTML Element which the field is attached to.
     * Attached using the form.useField method.
     */
    node;
    /**
     * el can be either String or Svelte Component.
     * This allows us a more flexible dynamic field generator.
     * Using a template also allows you to style each input as needed.
     */
    selector;
    /** Value is a writable store defaulting to undefined. */
    value = writable(undefined);
    /**
     * This is the DATA TYPE of the value!
     * If set to number (or decimal, or int, etc.) it will be parsed as number.
     * If the type is not accounted for in this library, we return the original
     * event.target.value.
     *
     * This is not the input.type.
     *
     * Defaults to "string"
     */
    data_type = "string";
    /**
     * Validation Errors!
     * We're mainly looking in the "errors" field.
     * One ValidationError object can have multiple errors.
     */
    errors = writable(undefined);
    /**
     * Attributes uses a fairly exhaustive map of most HTML Field-ish
     * attributes.
     *
     * You also have the option to use a plain Object, for extra flexibility.
     *
     * @example attributes["type"] get's set here.
     *
     * @example attrubutes["description"] passes type-check without being a FieldAttribute
     * but still gives you type-completion on any known attribute.
     */
    attributes = {};
    /** Has the input been altered? */
    touched = writable(false);
    /** Is this a required field? */
    required;
    /** Label can be sting or array of strings */
    label;
    /** Hint can be sting or array of strings */
    hint;
    /** Linked to form.refs via ReferenceData[ref_key] */
    ref_key;
    /** Used if there is a set of "options" to choose from. */
    options;
    /** Pretty self-explainitory, disable the field. */
    disabled;
    /** Pretty self-explainitory, hide the field. */
    hidden;
    /**
     * * If you set this, you must set form.for_form!
     *
     * In case you'd like to filter some fields for a specific form
     *
     * @example if you have a class to use on multiple forms, but want to
     * use this specific field on one form instead of other. Or whatever.
     */
    for_form;
    /**
     * You may need to excude some event listeners.
     *
     * @example exclude blur and focus events for a checkbox
     */
    exclude_events;
    /**
     * You may need to excude some event listeners.
     *
     * @example exclude blur and focus events for a checkbox
     */
    include_events;
    /** Are you grouping multiple fields togethter? */
    group;
    /**
     * Step is used when field is part of a multi-step form.
     */
    step;
    /**
     * @TODO Add hooks for this when setting up field.
     *
     * Element.dataset hook, so you can do the really wild things!
     */
    data_set;
    /** Is the field valid? */
    get valid() {
        if (!get_store_value(this.errors))
            return true;
        return false;
    }
    setErrors = (errors) => {
        this.errors.set(errors);
        return this;
    };
    /** Clear the field's errors */
    clearErrors = () => {
        this.errors.set(undefined);
        return this;
    };
    /** Add event listeners to the field in a more typesafe way. */
    addEventListener = (event, callback) => {
        if (this.node) {
            if (Array.isArray(event)) {
                event.forEach((_event) => {
                    this.node &&
                        this.node.addEventListener(_event, 
                        /** Check if the callback is directly executable */
                        (e) => callback instanceof Function ? callback(e) : callback, 
                        /** No extra options being passed in */
                        false);
                });
            }
            else {
                this.node.addEventListener(event, 
                /** Check if the callback is directly executable */
                (e) => callback instanceof Function ? callback(e) : callback, 
                /** No extra options being passed in */
                false);
            }
        }
        else {
            throw new Error("Node is missing! There is no Html Node to attach event listener too!");
        }
        return this;
    };
    /** Remove event listeners from the field in a more typesafe way. */
    removeEventListener = (event, callback) => {
        if (this.node) {
            if (Array.isArray(event)) {
                event.forEach((_event) => {
                    this.node &&
                        this.node.removeEventListener(_event, 
                        /** Check if the callback is directly executable */
                        (e) => callback instanceof Function ? callback(e) : callback, 
                        /** No extra options being passed in */
                        false);
                });
            }
            else {
                this.node.removeEventListener(event, 
                /** Check if the callback is directly executable */
                (e) => callback instanceof Function ? callback(e) : callback, 
                /** No extra options being passed in */
                false);
            }
        }
        else {
            throw new Error("Node is missing! There is no Html Node to attach event listener too!");
        }
        return this;
    };
    /**
     * This will fire the an HTMLElementEventMap event.
     *
     * @example you want to manually fire the change event
     */
    emitEvent(event_name) {
        const event = new Event(event_name);
        return this.node?.dispatchEvent(event);
    }
    /** Use this if you're altering the data_set property */
    setDataSet(data) {
        this.data_set = data;
        if (this.data_set) {
            let k;
            for (k in this.data_set) {
                this.node && (this.node.dataset[k] = this.data_set[k]);
            }
        }
        return this;
    }
}

/**
 * ---------------------------------------------------------------------------
 *
 * *** General Form Utilities ***
 *
 * Will write later. Files delted and source control didnt catch.
 *
 * ---------------------------------------------------------------------------
 */
/** Get the form field by name */
function _get(name, fields) {
    return fields.filter((f) => f.name === name)[0];
}
/**
 * Set any attributes on the given fields.
 */
function _setFieldAttributes(target_fields, fields, attributes) {
    let i = 0, len = target_fields.length;
    if (len === 0)
        return;
    const all_field_names = fields.map((f) => f.name);
    for (; len > i; ++i) {
        const field_index = all_field_names.indexOf(target_fields[i]);
        if (field_index !== -1) {
            const field_name = all_field_names[field_index];
            _setFieldAttribute(field_name, fields, attributes);
        }
    }
}
/**
 * Set any attributes on the given field.
 */
function _setFieldAttribute(name, fields, attributes) {
    /**  Get field config */
    const f = _get(name, fields);
    /**  Loop over key of Partial FieldConfig */
    let k;
    for (k in attributes) {
        /**  If we hit the attributes property then we set the field.attributes */
        if (k === "attributes") {
            Object.assign(f.attributes, attributes[k]);
        }
        else if (k !== "name") {
            /**  "name" is readonly on FieldConfig */
            setFieldProperty(f, k, attributes[k]);
        }
    }
}
/**
 * Initially created to deal with TS compiler errors.
 * Dynamically assigning a value to f[key] wouldn't play nice.
 */
function setFieldProperty(f, key, value) {
    f[key] = value;
}

/**
 * ---------------------------------------------------------------------------
 *
 * *** Form Layout ***
 *
 * Will write later. Files delted and source control didnt catch.
 *
 * ---------------------------------------------------------------------------
 */
/**
 * I wanted a way to handle field groups in an effective but lightweight
 * manner. I believe this achieves that goal.
 *
 *
 */
function _hanldeFieldGroups(fields) {
    if (fields && fields.length > 0) {
        /**
         * Use a blank object to store/map field groups.
         */
        let field_groups = {};
        /** This sets up the return type to be easily itterable. */
        const getSortedFields = () => {
            /** Array for storing the field config or array of field configs */
            const new_fields = [];
            Object.keys(field_groups).forEach((key) => {
                new_fields.push(field_groups[key]);
            });
            /** Return our crazy array structure. */
            return new_fields;
        };
        /** is the field.group in the field_groups map already? */
        const isGroupInFieldGroups = (group_name) => {
            if (Array.isArray(field_groups[group_name]))
                return true;
            /** If we made it here, there was no match */
            return false;
        };
        for (let i = 0; fields.length > i; ++i) {
            const field = fields[i];
            /** Is the field part of a group? */
            if (field.group) {
                if (Array.isArray(field.group)) {
                    field.group.forEach((name) => {
                        /**
                         * Have we already created a group (in our object above)
                         * for the field.group?
                         */
                        const isInGroupResult = isGroupInFieldGroups(name);
                        if (isInGroupResult) {
                            field_groups[name].push(field);
                        }
                        else {
                            /**
                             * If not, we add key for the field.gorup and initialize
                             * it with an array of the field.
                             * We use the array so we can add more fields later when we
                             * find more fields with the same group name.
                             */
                            field_groups[name] = [field];
                        }
                    });
                }
                else if (typeof field.group === "string") {
                    /**
                     * Have we already created a group (in our object above)
                     * for the field.group?
                     */
                    const isInGroupResult = isGroupInFieldGroups(field.group);
                    if (isInGroupResult) {
                        field_groups[field.group].push(field);
                    }
                    else {
                        /**
                         * If not, we add key for the field.gorup and initialize
                         * it with an array of the field.
                         * We use the array so we can add more fields later when we
                         * find more fields with the same group name.
                         */
                        field_groups[field.group] = [field];
                    }
                }
            }
            else {
                /**
                 * If the field does not have a group then we use this identifier
                 * to ensure all fields stay in order after this manipulation.
                 */
                field_groups[`field_${i}`] = field;
            }
        }
        const _fields = getSortedFields();
        return _fields;
    }
    else {
        return fields;
    }
}
/**
 * Using this.field_order, rearrange the order of the fields.
 */
function _setFieldOrder(field_order, fields) {
    let newLayout = [];
    let leftovers = [];
    /** Loop over the order... */
    field_order.forEach((name) => {
        const field = _get(name, fields);
        /** If the field.name and the order name match... */
        if (field.name === name) {
            /** Then push it to the fields array */
            newLayout.push(field);
        }
        else if (leftovers.indexOf(field) === -1 &&
            field_order.indexOf(field.name) === -1) {
            /** Field is not in the order, so push it to bottom of order. */
            leftovers.push(field);
        }
    });
    fields = [...newLayout, ...leftovers];
    return fields;
}

const max_int = Number.MAX_SAFE_INTEGER;
/**
 * ---------------------------------------------------------------------------
 *
 * *** Linking Methods ***
 *
 * This section handles linking values and errors.
 * Nearly all of functions are hot paths or part of hot paths.
 *
 * ---------------------------------------------------------------------------
 */
//#region Error Linking
/**
 * Link form.errors to it's corresponding field.errors
 * Via error[field_name]
 *
 * @Hotpath
 */
function _linkFieldErrors(errors, field, error_display, form_node) {
    const error = errors.filter((e) => e["field_key"] === field.name);
    /** Used when we _handleErrorDisplay */
    let field_error = undefined;
    /** Check if there's an error for the field */
    if (error && error.length > 0) {
        field.setErrors(error[0]).node?.setAttribute("aria-invalid", "true");
        field_error = error[0];
    }
    else {
        /**  Remove errors from field and hanlde error display.  */
        field.clearErrors().node?.removeAttribute("aria-invalid");
    }
    if (error_display && form_node)
        _handleErrorDisplay(field, field_error, error_display, form_node);
}
/**
 * Link all Validation Errors on Form.errors to each field via the
 * field_error_link_name.
 *
 * @Hotpath
 */
function _linkAllErrors(errors, fields, error_display, form_node) {
    /** Loop over the errors! */
    errors.forEach((err) => {
        /**
         * If error[field_key] is truthy, attach the error to the
         * field[field_key (name)]
         */
        if (err["field_key"]) {
            const field = _get(err["field_key"], fields);
            field.errors.set(err);
            if (error_display && form_node)
                _handleErrorDisplay(field, err, error_display, form_node);
        }
    });
    /** Get all fields with errors. */
    const fields_with_errors = errors.map((e) => e.field_key);
    /** Go through each field and check if the field is in the error map. */
    fields.forEach((field) => {
        /** If not, then remove the all errors from the field. */
        if (!errors || !fields_with_errors.includes(field.name)) {
            field.clearErrors().node?.removeAttribute("aria-invalid");
            if (error_display && form_node)
                _handleErrorDisplay(field, undefined, error_display, form_node);
        }
    });
}
function _handleErrorDisplay(field, error, error_display, form_node) {
    if (error_display === "constraint") {
        /** Constraint implementation goes here */
        _handleConstraintValidation(field, error, form_node);
    }
    else if (error_display === "custom") {
        /**
         * If "custom", the library user will have to create their own component
         * to show validation errors.
         */
        return;
    }
    else if (typeof error_display === "object") {
        /** If there is only one error message */
        _handleDomErrorDisplay(field, error, error_display, form_node);
    }
}
function _handleConstraintValidation(field, error, form_node) {
    if (error && error.errors) {
        const message = error.errors;
        Object.keys(message).forEach((key) => {
            field.node?.setCustomValidity(`${key}: ${message[key]}`);
        });
    }
    else {
        field.node?.setCustomValidity("");
    }
    form_node.reportValidity();
}
/**
 * This one is pretty harry.
 * There is a lot going on in this function but almost everything is commented.
 * I'm sure there's room for improvement down there somewhere.
 */
function _handleDomErrorDisplay(field, error, error_display, form_node) {
    if (typeof error_display === "object")
        if (error_display.dom.type === "span") {
            _handleDomSingleErrorDisplay(field, error, error_display, form_node);
        }
        else if (error_display.dom.type === "ol" ||
            error_display.dom.type === "ul") {
            _handleDomListErrorDisplay(field, error, error_display, form_node);
        }
}
/**
 * It works. It's fast. And it works.
 * But it's not the easiest thing to read.
 *
 * What's going on here?
 * Well we want to make error display as easy as possible while still offering
 * a level of customization.
 * This function handles the display of errors in a list attached to an element
 * with data-error-for={field.name}.
 * The error.field_key attaches to the field with field_key === field.name.
 *
 * @TODO Clean this up. But maintain verbosity, if possible. No crazy one liners.
 */
function _handleDomListErrorDisplay(field, error, error_display, form_node) {
    if (typeof error_display === "object") {
        const error_element_id = `___error-list-item-for-${field.name}`;
        if (error && error.errors) {
            const messages = Object.keys(error.errors).map((key) => error.errors && error.errors[key]);
            /** Have we already created an error node element for the given field? */
            const error_node = form_node.querySelector(`#${error_element_id}`);
            /** If so, we only update the list items */
            if (error_node) {
                /** Remove all list item elements from list parent */
                const children = error_node.querySelectorAll("li");
                children.forEach((child) => {
                    error_node?.removeChild(child);
                });
                /** Loop over error messages */
                for (let i = 0; messages.length > i; ++i) {
                    const message = messages[i], message_element = document.createElement("li"), text_node = document.createTextNode(message || "");
                    message_element.appendChild(text_node);
                    _setErrorElementStyling(error_display, message_element);
                    error_node.appendChild(message_element);
                }
            }
            else {
                /** Add new error element and add errors to list */
                const list_element = document.createElement(error_display.dom.type);
                /** If there are classes for the error list wrapper, apply them */
                error_display.dom.wrapper_classes &&
                    list_element.classList.add(...error_display.dom.wrapper_classes);
                /** Add an id to the element so we can grab it later */
                list_element.id = error_element_id;
                /** Loop over error messages. */
                for (const message of messages) {
                    /** Create a list item to add the error message into */
                    const message_element = document.createElement("li"), 
                    /** Create a text node with the error message */
                    text_node = document.createTextNode(message || "");
                    /** Append text node to the new list item element */
                    message_element.appendChild(text_node);
                    /** Apply any classes being passed in through config */
                    _setErrorElementStyling(error_display, message_element);
                    /** Add the new list item to the parent list element */
                    list_element.appendChild(message_element);
                }
                /** Append the list element to the error_node element */
                _getErrorNode(field, form_node)?.appendChild(list_element);
            }
        }
        else {
            /** No field errors! */
            /** Get the error node from the field */
            const node = _getErrorNode(field, form_node);
            if (node) {
                node.childNodes.forEach((n) => {
                    node.removeChild(n);
                });
            }
        }
    }
}
function _setErrorElementStyling(error_display, message_element) {
    if (typeof error_display === "object") {
        if (error_display.dom.error_classes)
            message_element.classList.add(...error_display.dom?.error_classes);
        if (error_display.dom.error_styles)
            message_element.setAttribute("style", error_display.dom.error_styles?.join("; "));
    }
}
function _handleDomSingleErrorDisplay(field, error, error_display, form_node) {
    if (typeof error_display === "object")
        if (error && error.errors) {
            const message = Object.keys(error.errors)
                .map((key) => error.errors && error.errors[key])
                .join("");
            /** Get the error node and check if we already have a span element added */
            const error_node = _getErrorNode(field, form_node), node = error_node?.querySelector("span");
            /** If se, we just update the textContent with the error message */
            if (node) {
                node.textContent = message;
            }
            else {
                /** Create the span element to append text */
                const span = document.createElement("span");
                span.setAttribute("aria-live", "polite");
                /** Add a text node and append the message. */
                const text_node = document.createTextNode(message);
                span.appendChild(text_node);
                /** Add any extra classes for styling */
                error_display.dom.error_classes &&
                    error_node?.classList.add(...error_display.dom.error_classes);
                /** Add the span to the field's node - which the field.name is attached */
                error_node?.appendChild(span);
            }
        }
        else {
            const error_node = _getErrorNode(field, form_node);
            if (error_node) {
                error_node.childNodes.forEach((n) => {
                    error_node.removeChild(n);
                });
            }
        }
}
function _getErrorNode(field, form_node) {
    let node;
    /** Check if there are data-error-for datasets attached to any elements */
    form_node.querySelectorAll("[data-error-for]").forEach((el) => {
        /** If so, check if the errorFor value is for the current field */
        /** @ts-ignore */
        if (el.dataset && el.dataset["errorFor"] === field.name)
            node = el;
    });
    if (field.node?.parentElement?.nodeName !== "LABEL") {
        /** If no node is found, just pin to the field's parent element. */
        if (!node)
            node = field.node?.parentElement;
    }
    return node;
}
//#endregion
//#region Value Linking
/**
 * Link values from FIELDS to MODEL or MODEL to FIELDS
 *
 * @Hotpath
 */
function _linkAllValues(from_fields_to_model, fields, model) {
    fields.forEach((field) => {
        /** Get name and value of the field */
        const name = field.name, val = field.value;
        if (from_fields_to_model) {
            /**  Link field[values] to model[values] */
            model[name] = get_store_value(val);
        }
        else {
            /**  Link form.model[values] to the form.fields[values] */
            val.set(model[name]);
            /** @ts-ignore */
            if (field.node && (field.node.value || field.node.value === 0)) {
                if (model[name]) {
                    /** @ts-ignore */
                    field.node.value = model[name];
                }
                else {
                    /** @ts-ignore */
                    field.node.value = "";
                }
            }
        }
    });
}
/**
 * Link the event value to the target field and model.
 *
 * @Hotpath
 */
function _linkValueFromEvent(field, model, event) {
    const value = _getValueFromEvent(event, field);
    /**
     * Well, we have to set both.
     * This compensates for native select elements and probably more.
     */
    model[field.name] = value;
    field.value.set(value);
}
/**
 * Ok, there's a lot going on here.
 * But we're really just checking the data_type for special cases.
 *
 * Objects and arrays need special treatment.
 *
 * Check if the target has some special value properties to help us out.
 * If not, just grab the target.value and move on.
 *
 * @Hotpath
 */
function _getValueFromEvent(event, field) {
    if (event && event.target) {
        if (field) {
            /**
             * Yeah, we do a lot of checking in this bitch.
             * Deep fucking ribbit hole.
             */
            switch (field.data_type) {
                case "string" :
                    return event.target.value;
                case "number":
                    return _parseNumberOrValue(event.target.value);
                case "boolean":
                    return Boolean(event.target.value);
                case "array":
                    return _parseArray(event, field);
                case "file" :
                    return _parseFileInput(event);
            }
        }
        else
            return event.target.value;
        /** If none of the above conditions apply, just retrun the value */
        return event.target.value;
    }
    else
        return undefined;
}
function _parseFileInput(event) {
    /** @ts-ignore */
    if (event.target.files) {
        /** @ts-ignore */
        const files = event.target.files;
        if (files && files.length === 1) {
            return files.item(0);
        }
        else if (files && files.length > 1) {
            return Object.values(files);
        }
        else if (files && files.length == 0) {
            return event.target.value;
        }
        return files;
    }
    return event.target.value;
}
function _parseArray(event, field) {
    let vals = get_store_value(field.value) ? [...get_store_value(field.value)] : [], target_value = event.target.value;
    /**
     * If the target is checked and the target value isn't in the field.value
     * then add the target value to the field value.
     */
    if (vals.indexOf(target_value) === -1) {
        vals.push(target_value);
    }
    else {
        /** Else remove the target.value from the field.value */
        vals.splice(vals.indexOf(target_value), 1);
    }
    /** Return the array of values */
    return vals;
}
/**
 * Check if the value is a (safe) intiger.
 * Because the event value will happily pass the number 1 as
 * "1", a string. So we parse it, check it, and if it's safe, return it.
 * Otherwise just return the initial value.
 *
 * We check if the value is not a number or if the value (as a number)
 * is greater than the max number value.
 *
 * If either is true, return plain value.
 * Else return value as number.
 *
 * @Hotpath
 */
function _parseNumberOrValue(value) {
    if (value === "" ||
        value === undefined ||
        value === null ||
        typeof value === "undefined" ||
        /**
         * This is needed when a null or undefined value is attached
         * to a select option value.
         */
        value === "undefined" ||
        value === "null")
        return undefined;
    if (isNaN(+value) || +value >= max_int || +value <= -max_int)
        return value;
    else
        return +value;
}

/**
 * ---------------------------------------------------------------------------
 *
 * *** Form State ***
 *
 * Will write later. Files delted and source control didnt catch.
 *
 * ---------------------------------------------------------------------------
 */
/**
 * Helper function for value_change emitter.
 * Write the form's value changes to form.value_changes.
 *
 * @Hotpath
 *
 * @param changes incoming value changes
 * @param field field emitting the changes
 */
function _setValueChanges(changes, field) {
    const _changes = get_store_value(changes);
    /** Is the change is on the same field? */
    if (_changes[field.name]) {
        _changes[field.name] = get_store_value(field.value);
        changes.set({ ..._changes });
    }
    else {
        /** Or is the change on a different field? */
        changes.set({ ..._changes, [field.name]: get_store_value(field.value) });
    }
}
/**
 * Is the current form state different than the initial state?
 *
 * I've tested it with ~ 1000 fields in a single class with very slight input lag.
 *
 * @Hotpath
 */
function _hasStateChanged(value_changes, changed) {
    // const changes = get(value_changes) !== {} ? get(value_changes) : null;
    const changes = get_store_value(value_changes);
    if (changes && changes !== {} && Object.keys(changes).length > 0) {
        changed.set(true);
        return;
    }
    changed.set(false);
}
/**
 * Grab a snapshot of several items that generally define the state of the form
 * and serialize them into a format that's easy-ish to check/deserialize (for resetting)
 */
function _setInitialState(form, initial_state) {
    Object.assign(initial_state.model, form.model);
    /**
     * Well, we have to check if there are any nested objects and stringify them
     * to disconnect the values from the initial Object.assign, above.
     */
    if (initial_state.model) {
        Object.keys(initial_state.model).forEach((key) => {
            if (initial_state.model)
                serializeObject(initial_state.model, key);
        });
    }
    if (form.errors && form.errors.length > 0) {
        initial_state.errors = [...form.errors];
    }
    else {
        initial_state.errors = [];
    }
    return initial_state;
}
function serializeObject(incoming_model, key) {
    if (incoming_model && typeof incoming_model[key] === "object") {
        incoming_model[key] = JSON.parse(JSON.stringify(incoming_model[key]));
    }
}
/**
 * Reset form to inital state.
 */
function _resetState(form, initial_state) {
    /** !CANNOT OVERWRITE MODEL. VALIDATION GETS FUCKED UP! */
    Object.assign(form.model, initial_state.model);
    if (form.model) {
        Object.keys(form.model).forEach((key) => {
            if (form.model)
                serializeObject(form.model, key);
        });
    }
    /** Clear the form errors before assigning initial_state.errors */
    form.clearErrors();
    if (initial_state.errors && initial_state.errors.length > 0) {
        form.errors = [...initial_state.errors];
    }
    else {
        form.errors = [];
    }
    /** Done serializing the initial_state, now link everything. */
    /** Link the values, now */
    _linkAllValues(false, form.fields, form.model);
    /** Reset all field touches, too. */
    form.fields.forEach((f) => f.touched.set(false));
    /**
     * If there were errors in the inital_state
     * link them to each field
     */
    if (form.node) {
        _linkAllErrors(form.errors, form.fields, form.validation_options?.error_display, form.node);
    }
    /** Reset the value changes and the "changed" store */
    form.value_changes.set({});
    form.changed.set(false);
}

/**
 * ---------------------------------------------------------------------------
 *
 * *** Form Validation ***
 *
 * Will write later. Files delted and source control didnt catch.
 *
 * ---------------------------------------------------------------------------
 */
/**
 * Hanlde the events that will fire for each field.
 * Corresponds to the form.on_events field.
 *
 * @Hotpath
 */
function _executeValidationEvent(form, required_fields, field, callbacks, event) {
    /** The form has been altered (no longer pristine) */
    form.pristine.set(false);
    /** If field && it hasn't been marked as touched... touch it. */
    if (field && !get_store_value(field.touched))
        field.touched.set(true);
    /** Execute pre-validation callbacks */
    _executeCallbacks([
        field && _linkValueFromEvent(field, form.model, event),
        /** Execution step may need work */
        field && _setValueChanges(form.value_changes, field),
        callbacks && _executeValidationCallbacks("before", callbacks),
    ]);
    /**
     * @TODO This section needs a rework.
     * Too many moving parts.
     * Hard to pass in custom validation parameters.
     *
     * If validation options are present, use them.
     * Else, just fire the callbacks and be done.
     */
    if (form.validation_options &&
        form.validation_options.options &&
        form.validation_options.validator) {
        return form.validation_options
            .validator(form.model, form.validation_options.options)
            .then((errors) => {
            _executeCallbacks([
                _handleValidationSideEffects(form, errors, required_fields, field),
                _hasStateChanged(form.value_changes, form.changed),
                callbacks && _executeValidationCallbacks("after", callbacks),
            ]);
            return errors;
        });
    }
    else if (form.validation_options &&
        form.validation_options.validator &&
        !form.validation_options.options) {
        return form.validation_options
            .validator(form.model)
            .then((errors) => {
            _executeCallbacks([
                _handleValidationSideEffects(form, errors, required_fields, field),
                _hasStateChanged(form.value_changes, form.changed),
                callbacks && _executeValidationCallbacks("after", callbacks),
            ]);
            return errors;
        });
    }
    else {
        _executeCallbacks([
            _hasStateChanged(form.value_changes, form.changed),
            callbacks && _executeValidationCallbacks("after", callbacks),
        ]);
        return undefined;
    }
}
/**
 * Execute validation callbacks, depending on when_to_call
 * @Hotpath
 */
function _executeValidationCallbacks(when_to_call, callbacks) {
    if (callbacks && callbacks.length > 0)
        callbacks.forEach((cb) => {
            if (cb.when === when_to_call) {
                _callFunction(cb.callback);
            }
        });
}
/**
 * Check if the callback is a function and execute it accordingly
 * @Hotpath
 */
function _callFunction(cb) {
    if (cb instanceof Function) {
        cb();
    }
}
/**
 * This is used to add functions and callbacks to the OnEvent
 * handler. Functions can be added in a plugin-style manner now.
 *
 * @Hotpath
 */
function _executeCallbacks(callbacks) {
    /** Is it an Array of callbacks? */
    if (Array.isArray(callbacks)) {
        callbacks.forEach((cb) => {
            _callFunction(cb);
        });
    }
    else {
        _callFunction(callbacks);
    }
}
/**
 * Handle all the things associated with validation!
 * Link the errors to the fields.
 * Check if all required fields are valid.
 * Link values from fields to model if
 * form.when_link_fields_to_model === LinkOnEvent.Valid is true.
 *
 * @Hotpath
 */
async function _handleValidationSideEffects(form, errors, required_fields, field) {
    /**  There are errors! */
    if (errors && errors.length > 0) {
        form.errors = errors;
        /**  Are we validating the whole form or just the fields? */
        if (field && form.node) {
            /**  Link errors to field (to show validation errors) */
            _linkFieldErrors(errors, field, form.validation_options?.error_display, form.node);
        }
        else if (form.node) {
            /**  This is validation for the whole form! */
            _linkAllErrors(errors, form.fields, form.validation_options?.error_display, form.node);
        }
        /**  All required fields are valid? */
        if (_requiredFieldsValid(errors, required_fields)) {
            form.valid.set(true);
        }
        else {
            form.valid.set(false);
        }
    }
    else {
        /** We can't get here unless the errors we see are for non-required fields */
        /**  Are we validating the whole form or just the fields? */
        if (field && form.node) {
            /**  Link errors to field (to show validation errors) */
            _linkFieldErrors(errors, field, form.validation_options?.error_display, form.node);
        }
        else if (form.node) {
            /**  This is validation for the whole form! */
            _linkAllErrors(errors, form.fields, form.validation_options?.error_display, form.node);
        }
        form.clearErrors(); /** Clear form errors */
        form.valid.set(true); /** Form is valid! */
    }
    return errors;
}
/**
 * @TODO Clean up this requiredFieldsValid implementation. Seems too clunky.
 *
 * Check if there are any required fields in the errors.
 * If there are no required fields in the errors, the form is valid.
 *
 * @Hotpath
 */
function _requiredFieldsValid(errors, required_fields) {
    if (errors.length === 0)
        return true;
    /** Go ahead and return if there are no errors */
    let i = 0, len = required_fields.length;
    /** If there are no required fields, just go ahead and return */
    if (len === 0)
        return true;
    /**
     * Otherwise we have to map the names of the errors so we can
     * check if they're for a required field
     */
    const errs = errors.map((e) => e["field_key"]);
    for (; len > i; ++i) {
        if (errs.indexOf(required_fields[i]) !== -1) {
            return false;
        }
    }
    return true;
}

/**
 * ---------------------------------------------------------------------------
 *
 * *** Form Setup ***
 *
 * Will write later. Files deleted and source control didnt catch.
 *
 * ---------------------------------------------------------------------------
 */
/**
 * Build the field configs from this.model using metadata-reflection.
 * Grab the editableProperties from the @field decorator.
 */
function _buildFormFields(model, for_form, props = Reflect.getMetadata("editableProperties", model)) {
    /** Map the @field fields to the form.fields */
    let fields = props.map((prop) => {
        /** Get the @FieldConfig using metadata reflection */
        const field = new FieldConfig(prop, {
            ...Reflect.getMetadata("fieldConfig", model, prop),
            value: model[prop],
        });
        /** We made it. Return the field config and let's generate some inputs! */
        return field;
    });
    if (for_form) {
        /** Filter fields used in a specific form */
        fields = fields.filter((f) => f.for_form === undefined || for_form === f.for_form);
    }
    return fields;
}
function _buildFormFieldsWithSchema(props, for_form) {
    let k, fields = [];
    for (k in props) {
        const field = new FieldConfig(k, {
            ...props[k],
        });
        fields.push(field);
    }
    if (for_form) {
        /** Filter fields used in a specific form */
        fields = fields.filter((f) => f.for_form === undefined || for_form === f.for_form);
    }
    return fields;
}
// #region HTML Event Helpers
/**
 * Attach the OnEvents events to each form.field.
 * Each field with a corresponding model.name will have event listeners
 * attached.
 * Children fields of the form, where useForm has been attached, will have
 * event listeners attached.
 */
function _attachEventListeners(field, on_events, callback) {
    Object.entries(on_events).forEach(([event_name, should_listen]) => {
        const filterListenerOnSelectElement = () => {
            if (field.node?.nodeName === "SELECT" && event_name !== "input") {
                field.addEventListener(event_name, callback);
            }
            else {
                field.addEventListener(event_name, callback);
            }
        };
        /** If should_listen === true, then add the event listener */
        if (should_listen) {
            /**
             * If should_listen === true... and...
             * If field.exclude_events DOES NOT contain the event name
             * THEN add the event listener to the field.
             */
            if (!field.exclude_events?.includes(event_name))
                filterListenerOnSelectElement();
        }
        /**
         * If the field.include_events includes the event_name
         * then add that event listener to the field.
         * Does NOT matter if should_listen is true || false.
         */
        if (field.include_events?.includes(event_name))
            filterListenerOnSelectElement();
    });
}
function _addCallbackToField(form, field, event, callback, required_fields) {
    /** Check if callback is of type ValidationCallback */
    if (callback && callback.when) {
        field.addEventListener(event, _executeValidationEvent(form, required_fields, undefined, [
            callback,
        ]));
    }
    else {
        field.addEventListener(event, callback);
    }
}

/**
 * All constructor values are optional so we can create a blank Validation
 * Error object, for whatever reason we need.
 * The error.field_key links to it's corresponding field.name
 */
class ValidationError {
    constructor(field_name, errors, extra_data) {
        if (field_name)
            this.field_key = field_name;
        if (errors)
            this.errors = errors;
        if (extra_data)
            Object.assign(this, extra_data);
    }
    field_key;
    field_value;
    errors;
}
class ValidationProperties {
    constructor(validator, options, display, properties) {
        if (properties)
            Object.assign(this, properties);
        if (validator)
            this.validator = validator;
        if (options)
            this.options = options;
        if (display)
            this.error_display = display;
    }
    /**
     * This is the (validation) function that will be called when validating.
     * You can use any validation library you like, as long as this function
     * takes the model and returns Promise<ValidationError[]>
     */
    validator = async () => [];
    /**
     * THIS IS THE SECOND PARAMETER BEING PASSED TO THE VALIDATOR FUNCTION.
     * The other is form.model.
     *
     * This makes using other validation libraries easier.
     * See the examples for more details.
     */
    options;
    /**
     * How should the errors be displayed?
     */
    error_display = { dom: { type: "ul" } };
}
//#endregion
// #region Events
/**
 * * Enabled By Default: blur, input, change, submit
 *
 * Determines which event listeners are added to each field.
 *
 * You can insert event listeners just by adding a [string]: boolean
 * to the constructor's init object.
 */
class OnEvents {
    constructor(init, disableAll = false) {
        // If disableAll is false, turn off all event listeners
        if (disableAll) {
            let k;
            for (k in this) {
                this[k] = false;
            }
        }
        Object.assign(this, init);
    }
    /**
     * Steps for using eager validation.
     *
     * 1. use passive until form is submitted.
     *  - Must detect if form has been submited.
     *
     * 2. If form is invalid, use aggressive until field is valid.
     *  - This is the hardest part.
     *
     * 3. When all valid, go back to passive validation.
     */
    input = false;
    change = false;
    submit = false;
    blur = false;
    focus = false;
    click = false;
    dblclick = false;
    keydown = false;
    keypress = false;
    keyup = false;
    mount = false;
    mousedown = false;
    mouseenter = false;
    mouseleave = false;
    mousemove = false;
    mouseout = false;
    mouseover = false;
    mouseup = false;
}
/**
 * @depricated makes the for_form functionality wayyy to clunky
 *
 * These are the types of form meta-data allowed.
 * If you would like something further, push it into the "object" field
 */
//  export type FormMetaDataKeys =
//  | "for_form"
//  | "description"
//  | "header"
//  | "label"
//  | "classes"
//  | "styles"
//  /**
//   * Added "object" so a user can pass anything they want, while still getting
//   * some type completion on the rest of the meta-data
//   */
//  | "object";
//#endregion

/**
 * @Recomended_Use
 *  - Initialize let form = new Form(model, {refs: REFS, template: TEMPLATE, etc.})
 *  - Set the model (if you didn't in the first step)
 *  - Attach reference data (if you didn't in the first step)
 *  - Storify the form - check example.form.ts for an example
 *  - Now you're ready to use the form!
 *  - Pass it into the DynamicForm component and let the form generate itself!
 *
 * Performance is blazing with < 500 fields.
 * Can render up to 2000 inputs in per class/fields, not recommended.
 * Just break it up into 100 or so fields per form (max 250) if its a huge form.
 * Use one of the Form Manager interfaces if applicable.
 *  - Tested on late 2014 mbp - 2.5ghz core i7, 16gb ram
 *
 * @TODO Time to redo the readme.md file! Lots have changed since then!
 *
 * @TODO Add more superstruct examples for each form type (this should show how easy the template pattern really is)
 * @TODO Add cypress tests!
 *
 * @TODO I think a Form class refactor may be in order.
 *
 * @TODO Add debug mode to inspect event listeners and form state snapshots
 *
 */
function newForm(model, validation_options, form_properties) {
    const form = new Form(model, validation_options, form_properties);
    return writable(form);
}
/**
 * ---------------------------------------------------------------------------
 * Formvana Form Class
 *
 * Main Concept: fields and model are separate.
 * Fields are built from the model, via the @field() decorator.
 * We keep the fields and the model in sync via model property names
 * and field[name].
 *
 * Form is NOT initially valid.
 *
 * Functions are camelCase.
 * Variables and stores are snake_case.
 * Everyone will love it.
 *
 * ---------------------------------------------------------------------------
 */
class Form {
    constructor(model, validation_options, form_properties) {
        if (form_properties)
            Object.assign(this, form_properties);
        /** If there's a model, set the inital state's and build the fields */
        if (model) {
            this.model = model;
            this.buildFields();
        }
        else {
            throw new Error("Model is not valid. Please use a valid (truthy) model.");
        }
        if (validation_options) {
            Object.assign(this.validation_options, validation_options);
        }
        else {
            console.warn("No ValidationProperties have been added.");
        }
        if (this.refs)
            this.attachReferenceData();
        if (this.disabled_fields)
            _setFieldAttributes(this.disabled_fields, this.fields, {
                disabled: true,
                attributes: { disabled: true },
            });
        if (this.hidden_fields)
            _setFieldAttributes(this.hidden_fields, this.fields, {
                hidden: true,
            });
        /**
         * Wait until everything is initalized, then set the inital state.
         * Don't call updateInitialState because it sets changed = false.
         */
        _setInitialState(this, this.initial_state);
    }
    //#region ---------------- Fields ----------------
    /**
     * HTML Node of form object.
     */
    node;
    /**
     * This is your form Model/Schema.
     * Used to build the form.fields.
     */
    model;
    /**
     * Fields are built using model's reflection metadata.
     * Or using an array of field configuration objects.
     */
    fields = [];
    /**
     * Errors are attached to their corresponding fields.
     * This pattern adds flexibility at the cost of a little complexity and
     * object size.
     *
     * When a single field is validated, the whole model is validated (if
     * using class-validator).
     * We don't show all the errors to the user, only the field emmiting the
     * event.
     * This way, we know if the form is still invalid, even if we aren't
     * showing the user any errors (like, pre-submit-button press).
     */
    errors = [];
    /**
     * validation_options contains the logic and configuration for
     * validating the form as well as linking errors to fields
     * and displaying the errors
     */
    validation_options = new ValidationProperties();
    /** Which events should the form dispatch side effects? */
    on_events = new OnEvents({
        input: true,
        change: true,
        blur: true,
        submit: true,
    });
    /** Is the form valid? */
    valid = writable(false);
    /** Has the form state changed from it's initial value? */
    changed = writable(false);
    /** Has the form been altered in any way? */
    pristine = writable(true);
    /** Is the form loading? */
    loading = writable(false);
    /**
     * refs hold any reference data you'll be using in the form
     *
     * Call attachReferenceData() to link reference data to form or pass it
     * via the constrictor.
     *
     * Fields & reference data are linked via field.ref_key
     *
     * * Format:
     * * {[ref_key]: string, Array<{[label]: string, [value]: any, [data]?: any}>}
     *
     * @UseCase seclet dropdowns, radio buttons, etc.
     */
    refs;
    /**
     * Form Template Layout
     *
     * Render the form into a custom svelte template!
     * Use a svelte component. Or use a string as the selector.
     * * The template/component must accept {form} prop
     *
     * Note: add ` types": ["svelte"] ` to tsconfig compilerOptions
     * to remove TS import error of .svelte files (for your template)
     */
    template;
    /**
     * This is the form's initial state.
     * It's only initial model and errors.
     * We're keeping this simple.
     */
    initial_state = {
        model: {},
        errors: undefined,
    };
    /**
     * Emits value changes as a plain JS object.
     * Format: { [field.name]: value }
     *
     * Very similar to Angular form.valueChanges
     */
    value_changes = writable({});
    /**
     * Optional field layout, if you aren't using a class object.
     * "no-class" method of building the fields.
     */
    field_schema;
    /**
     * This allows you to filter fields based on a given form name.
     *
     * @example user model can be used for login and signup
     * @example for_form="login" && for_form="signup"
     */
    for_form;
    /**
     * Any extra data you may want to pass around.
     * @examples description, name, type, header, label, classes, etc.
     */
    meta;
    /** Use the NAME of the field (field.name) to disable/hide the field. */
    hidden_fields;
    /** Use the NAME of the field (field.name) to disable/hide the field. */
    disabled_fields;
    /**
     * Determines the ordering of this.fields.
     * Simply an array of field names (or group names or stepper names)
     * in the order to be displayed
     */
    #field_order;
    /**
     * We keep track of required fields because validation handles everything
     * except *required* (field.required)
     * @example If there are no required fields, but there ARE errors, the form is still
     * valid. Get it?
     *
     * Keeping track of the required fields allows us to  validate faster.
     */
    #required_fields = [];
    //#endregion xxxxxxxxxxxxxxxx Fields xxxxxxxxxxxxxxxx
    // #region ---------------- Form API ----------------
    // #region - Form Setup
    /**
     * Builds the fields from the model.
     * Builds the field configs via this.model using metadata-reflection.
     * Or via form.field_shcema
     */
    buildFields = (model = this.model) => {
        if (this.field_schema) {
            this.fields = _buildFormFieldsWithSchema(this.field_schema, this.for_form);
        }
        else {
            this.fields = _buildFormFields(model, this.for_form);
        }
        this.#required_fields = this.fields
            .filter((f) => f.required)
            .map((f) => f.name);
        /** NOTE: Returning this allows method chaining. */
        return this;
    };
    /**
     * * Required for form setup.
     *
     * ATTACH TO SAME ELEMENT AS FIELD.NAME {name}!
     * This hooks up the event listeners!
     *
     * Used to grab fields and attach event listeners to each field.
     * Simply loop over the model, checking the form's node
     * for each model[name]. If a field element is found, then
     * attach on_event listeners to the given field.
     *
     * This is for Svelte's "use:FUNCTION" feature.
     * The "use" directive passes the HTML Node as a parameter
     * to the given function (e.g. use:useField(node: HTMLElement)).
     */
    useForm = (node) => {
        this.node = node;
        /** Set up form/fields here */
        let key;
        for (key in this.model) {
            const elements = node.querySelectorAll(`[name="${key}"]`);
            if (elements && elements.length === 1) {
                const element = elements[0];
                this.useField(element);
            }
            else if (elements.length > 1) {
                elements.forEach((element) => {
                    this.useField(element);
                });
            }
        }
        if (this.validation_options?.error_display !== "constraint")
            this.node.noValidate = true;
    };
    /**
     * This is used to hook up event listeners to a field.
     *
     * You can also use this to add form controls to the Form class.
     * @example form control is outside of the form element so
     * use:useField is added to the element to hook enent listens into it,
     * same as all other controls inside the form element
     */
    useField = (node) => {
        /** Attach HTML Node to field so we can remove event listeners later */
        const field = _get(node.name, this.fields);
        field.node = node;
        if (this.on_events)
            _attachEventListeners(field, this.on_events, (e) => _executeValidationEvent(this, this.#required_fields, field, undefined, e));
        return field;
    };
    //#endregion
    // #region - Validation
    /**
     * Validate the form!
     * You can pass in callbacks as needed.
     * Callbacks can be called "before" or "after" validation.
     */
    validate = (callbacks) => {
        return _executeValidationEvent(this, this.#required_fields, undefined, callbacks);
    };
    /** If want to (in)validate a specific field for any reason */
    validateField = (field_name, with_message, callbacks) => {
        const field = _get(field_name, this.fields);
        if (!with_message) {
            _executeValidationEvent(this, this.#required_fields, field, callbacks);
        }
        else {
            const err = new ValidationError(field_name, { error: with_message }, { value: get_store_value(field.value) });
            this.errors.push(err);
            if (this.node)
                _linkAllErrors(this.errors, this.fields, this.validation_options?.error_display, this.node);
        }
        /** NOTE: Returning this allows method chaining. */
        return this;
    };
    /**
     * Attach a callback to a field or array of fields.
     * If the callback if type ValidationCallback it will be added
     * to the validation handler
     */
    attachCallbacks = (event, callback, field_names) => {
        /** If there are multiple fields passed in then loop over to add callbacks */
        if (Array.isArray(field_names)) {
            const fields = field_names.map((f) => _get(f, this.fields));
            fields.forEach((f) => _addCallbackToField(this, f, event, callback, this.#required_fields));
        }
        else {
            /** If there is one field, add callback to field */
            const field = _get(field_names, this.fields);
            _addCallbackToField(this, field, event, callback, this.#required_fields);
        }
        /** NOTE: Returning this allows method chaining. */
        return this;
    };
    /** Clear ALL the errors. */
    clearErrors = () => {
        this.errors = [];
        this.fields.forEach((f) => {
            f.clearErrors();
        });
        /** NOTE: Returning this allows method chaining. */
        return this;
    };
    //#endregion
    // #region - Utility Methods
    /** Get Field by name */
    get = (field_name) => _get(field_name, this.fields);
    /**
     * Load new data into the form and build the fields.
     * Data is updated IN PLACE by default.
     * Reinitialize is set to false, by default.
     *
     * Inital State is not updated by default.
     */
    loadModel = (model, reinitialize = false, update_initial_state = false) => {
        if (reinitialize) {
            this.model = model;
            this.buildFields();
        }
        else {
            let key;
            for (key in this.model) {
                this.model[key] = model[key];
            }
            _linkAllValues(false, this.fields, this.model);
        }
        if (update_initial_state)
            this.updateInitialState();
        /** NOTE: Returning this allows method chaining. */
        return this;
    };
    /**
     * Set the value for a field or set of fields.
     * Sets both field.value and model value.
     */
    setValue = (field_names, value) => {
        if (Array.isArray(field_names)) {
            field_names.forEach((f) => {
                const field = _get(f, this.fields);
                field.value.set(value);
                this.model[f] = value;
            });
        }
        else {
            const field = _get(field_names, this.fields);
            field.value.set(value);
            this.model[field_names] = value;
        }
        /** NOTE: Returning this allows method chaining. */
        return this;
    };
    /**
     * Pass in the reference data to add options to fields.
     */
    attachReferenceData = (refs) => {
        /** Get all fields with ref_key property */
        const fields_with_ref_keys = this.fields.filter((f) => f.ref_key);
        /** Check if there are refs being passed in */
        if (refs) {
            this.refs = refs;
            fields_with_ref_keys.forEach((field) => {
                if (field.ref_key)
                    field.options = refs[field.ref_key];
            });
        }
        else if (this.refs) {
            /** Else if this.refs are already attached, add the options to fields */
            fields_with_ref_keys.forEach((field) => {
                if (field.ref_key && this.refs)
                    field.options = this.refs[field.ref_key];
            });
        }
        /** NOTE: Returning this allows method chaining. */
        return this;
    };
    /**
     *! Make sure to call this when the component is unloaded/destroyed
     * Removes all event listeners.
     */
    destroy = () => {
        if (this.fields && this.fields.length > 0) {
            // For each field...
            this.fields.forEach((f) => {
                // Remove all the event listeners!
                if (this.on_events)
                    Object.keys(this.on_events).forEach((key) => {
                        f.node &&
                            f.node.removeEventListener(key, (ev) => _executeValidationEvent(this, this.#required_fields, f, undefined, ev));
                    });
            });
        }
        /** NOTE: Returning this allows method chaining. */
        return this;
    };
    //#endregion
    // #region - Form State
    /**
     * Resets to the inital state of the form.
     *
     * Only model and errors are saved in initial state.
     */
    reset = () => {
        _resetState(this, this.initial_state);
        /** NOTE: Returning this allows method chaining. */
        return this;
    };
    /** Well, this updates the initial state of the form. */
    updateInitialState = () => {
        _setInitialState(this, this.initial_state);
        this.changed.set(false);
        /** NOTE: Returning this allows method chaining. */
        return this;
    };
    //#endregion
    // #region - Layout
    getFieldGroups = () => {
        return _hanldeFieldGroups(this.fields);
    };
    /**
     * Set the field order.
     * Layout param is simply an array of field (or group)
     * names in the order to be displayed.
     * Leftover fields are appended to bottom of form.
     */
    setFieldOrder = (order) => {
        if (order && order.length > 0) {
            this.#field_order = order;
            this.fields = _setFieldOrder(this.#field_order, this.fields);
        }
        /** NOTE: Returning this allows method chaining. */
        return this;
    };
    /**
     * Set attributes on a given set of fields.
     *
     * @exapmle to hide several fields:
     * names = [field.name, field.name],
     * attributes = { hidden: true };
     */
    setFieldAttributes = (names, attributes) => {
        if (names) {
            if (Array.isArray(names)) {
                _setFieldAttributes(names, this.fields, attributes);
            }
            else {
                _setFieldAttributes([names], this.fields, attributes);
            }
        }
        /** NOTE: Returning this allows method chaining. */
        return this;
    };
}

var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

/*! *****************************************************************************
Copyright (C) Microsoft. All rights reserved.
Licensed under the Apache License, Version 2.0 (the "License"); you may not use
this file except in compliance with the License. You may obtain a copy of the
License at http://www.apache.org/licenses/LICENSE-2.0

THIS CODE IS PROVIDED ON AN *AS IS* BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
KIND, EITHER EXPRESS OR IMPLIED, INCLUDING WITHOUT LIMITATION ANY IMPLIED
WARRANTIES OR CONDITIONS OF TITLE, FITNESS FOR A PARTICULAR PURPOSE,
MERCHANTABLITY OR NON-INFRINGEMENT.

See the Apache Version 2.0 License for specific language governing permissions
and limitations under the License.
***************************************************************************** */

var Reflect$1;
(function (Reflect) {
    // Metadata Proposal
    // https://rbuckton.github.io/reflect-metadata/
    (function (factory) {
        var root = typeof commonjsGlobal === "object" ? commonjsGlobal :
            typeof self === "object" ? self :
                typeof this === "object" ? this :
                    Function("return this;")();
        var exporter = makeExporter(Reflect);
        if (typeof root.Reflect === "undefined") {
            root.Reflect = Reflect;
        }
        else {
            exporter = makeExporter(root.Reflect, exporter);
        }
        factory(exporter);
        function makeExporter(target, previous) {
            return function (key, value) {
                if (typeof target[key] !== "function") {
                    Object.defineProperty(target, key, { configurable: true, writable: true, value: value });
                }
                if (previous)
                    previous(key, value);
            };
        }
    })(function (exporter) {
        var hasOwn = Object.prototype.hasOwnProperty;
        // feature test for Symbol support
        var supportsSymbol = typeof Symbol === "function";
        var toPrimitiveSymbol = supportsSymbol && typeof Symbol.toPrimitive !== "undefined" ? Symbol.toPrimitive : "@@toPrimitive";
        var iteratorSymbol = supportsSymbol && typeof Symbol.iterator !== "undefined" ? Symbol.iterator : "@@iterator";
        var supportsCreate = typeof Object.create === "function"; // feature test for Object.create support
        var supportsProto = { __proto__: [] } instanceof Array; // feature test for __proto__ support
        var downLevel = !supportsCreate && !supportsProto;
        var HashMap = {
            // create an object in dictionary mode (a.k.a. "slow" mode in v8)
            create: supportsCreate
                ? function () { return MakeDictionary(Object.create(null)); }
                : supportsProto
                    ? function () { return MakeDictionary({ __proto__: null }); }
                    : function () { return MakeDictionary({}); },
            has: downLevel
                ? function (map, key) { return hasOwn.call(map, key); }
                : function (map, key) { return key in map; },
            get: downLevel
                ? function (map, key) { return hasOwn.call(map, key) ? map[key] : undefined; }
                : function (map, key) { return map[key]; },
        };
        // Load global or shim versions of Map, Set, and WeakMap
        var functionPrototype = Object.getPrototypeOf(Function);
        var usePolyfill = typeof process === "object" && process.env && process.env["REFLECT_METADATA_USE_MAP_POLYFILL"] === "true";
        var _Map = !usePolyfill && typeof Map === "function" && typeof Map.prototype.entries === "function" ? Map : CreateMapPolyfill();
        var _Set = !usePolyfill && typeof Set === "function" && typeof Set.prototype.entries === "function" ? Set : CreateSetPolyfill();
        var _WeakMap = !usePolyfill && typeof WeakMap === "function" ? WeakMap : CreateWeakMapPolyfill();
        // [[Metadata]] internal slot
        // https://rbuckton.github.io/reflect-metadata/#ordinary-object-internal-methods-and-internal-slots
        var Metadata = new _WeakMap();
        /**
         * Applies a set of decorators to a property of a target object.
         * @param decorators An array of decorators.
         * @param target The target object.
         * @param propertyKey (Optional) The property key to decorate.
         * @param attributes (Optional) The property descriptor for the target key.
         * @remarks Decorators are applied in reverse order.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Example = Reflect.decorate(decoratorsArray, Example);
         *
         *     // property (on constructor)
         *     Reflect.decorate(decoratorsArray, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.decorate(decoratorsArray, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Object.defineProperty(Example, "staticMethod",
         *         Reflect.decorate(decoratorsArray, Example, "staticMethod",
         *             Object.getOwnPropertyDescriptor(Example, "staticMethod")));
         *
         *     // method (on prototype)
         *     Object.defineProperty(Example.prototype, "method",
         *         Reflect.decorate(decoratorsArray, Example.prototype, "method",
         *             Object.getOwnPropertyDescriptor(Example.prototype, "method")));
         *
         */
        function decorate(decorators, target, propertyKey, attributes) {
            if (!IsUndefined(propertyKey)) {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsObject(attributes) && !IsUndefined(attributes) && !IsNull(attributes))
                    throw new TypeError();
                if (IsNull(attributes))
                    attributes = undefined;
                propertyKey = ToPropertyKey(propertyKey);
                return DecorateProperty(decorators, target, propertyKey, attributes);
            }
            else {
                if (!IsArray(decorators))
                    throw new TypeError();
                if (!IsConstructor(target))
                    throw new TypeError();
                return DecorateConstructor(decorators, target);
            }
        }
        exporter("decorate", decorate);
        // 4.1.2 Reflect.metadata(metadataKey, metadataValue)
        // https://rbuckton.github.io/reflect-metadata/#reflect.metadata
        /**
         * A default metadata decorator factory that can be used on a class, class member, or parameter.
         * @param metadataKey The key for the metadata entry.
         * @param metadataValue The value for the metadata entry.
         * @returns A decorator function.
         * @remarks
         * If `metadataKey` is already defined for the target and target key, the
         * metadataValue for that key will be overwritten.
         * @example
         *
         *     // constructor
         *     @Reflect.metadata(key, value)
         *     class Example {
         *     }
         *
         *     // property (on constructor, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticProperty;
         *     }
         *
         *     // property (on prototype, TypeScript only)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         property;
         *     }
         *
         *     // method (on constructor)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         static staticMethod() { }
         *     }
         *
         *     // method (on prototype)
         *     class Example {
         *         @Reflect.metadata(key, value)
         *         method() { }
         *     }
         *
         */
        function metadata(metadataKey, metadataValue) {
            function decorator(target, propertyKey) {
                if (!IsObject(target))
                    throw new TypeError();
                if (!IsUndefined(propertyKey) && !IsPropertyKey(propertyKey))
                    throw new TypeError();
                OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
            }
            return decorator;
        }
        exporter("metadata", metadata);
        /**
         * Define a unique metadata entry on the target.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param metadataValue A value that contains attached metadata.
         * @param target The target object on which to define metadata.
         * @param propertyKey (Optional) The property key for the target.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     Reflect.defineMetadata("custom:annotation", options, Example);
         *
         *     // property (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticProperty");
         *
         *     // property (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "property");
         *
         *     // method (on constructor)
         *     Reflect.defineMetadata("custom:annotation", options, Example, "staticMethod");
         *
         *     // method (on prototype)
         *     Reflect.defineMetadata("custom:annotation", options, Example.prototype, "method");
         *
         *     // decorator factory as metadata-producing annotation.
         *     function MyAnnotation(options): Decorator {
         *         return (target, key?) => Reflect.defineMetadata("custom:annotation", options, target, key);
         *     }
         *
         */
        function defineMetadata(metadataKey, metadataValue, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryDefineOwnMetadata(metadataKey, metadataValue, target, propertyKey);
        }
        exporter("defineMetadata", defineMetadata);
        /**
         * Gets a value indicating whether the target object or its prototype chain has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object or its prototype chain; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasMetadata", hasMetadata);
        /**
         * Gets a value indicating whether the target object has the provided metadata key defined.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata key was defined on the target object; otherwise, `false`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.hasOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function hasOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryHasOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("hasOwnMetadata", hasOwnMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object or its prototype chain.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetMetadata(metadataKey, target, propertyKey);
        }
        exporter("getMetadata", getMetadata);
        /**
         * Gets the metadata value for the provided metadata key on the target object.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns The metadata value for the metadata key if found; otherwise, `undefined`.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function getOwnMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryGetOwnMetadata(metadataKey, target, propertyKey);
        }
        exporter("getOwnMetadata", getOwnMetadata);
        /**
         * Gets the metadata keys defined on the target object or its prototype chain.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getMetadataKeys(Example.prototype, "method");
         *
         */
        function getMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryMetadataKeys(target, propertyKey);
        }
        exporter("getMetadataKeys", getMetadataKeys);
        /**
         * Gets the unique metadata keys defined on the target object.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns An array of unique metadata keys.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.getOwnMetadataKeys(Example);
         *
         *     // property (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.getOwnMetadataKeys(Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.getOwnMetadataKeys(Example.prototype, "method");
         *
         */
        function getOwnMetadataKeys(target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            return OrdinaryOwnMetadataKeys(target, propertyKey);
        }
        exporter("getOwnMetadataKeys", getOwnMetadataKeys);
        /**
         * Deletes the metadata entry from the target object with the provided key.
         * @param metadataKey A key used to store and retrieve metadata.
         * @param target The target object on which the metadata is defined.
         * @param propertyKey (Optional) The property key for the target.
         * @returns `true` if the metadata entry was found and deleted; otherwise, false.
         * @example
         *
         *     class Example {
         *         // property declarations are not part of ES6, though they are valid in TypeScript:
         *         // static staticProperty;
         *         // property;
         *
         *         constructor(p) { }
         *         static staticMethod(p) { }
         *         method(p) { }
         *     }
         *
         *     // constructor
         *     result = Reflect.deleteMetadata("custom:annotation", Example);
         *
         *     // property (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticProperty");
         *
         *     // property (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "property");
         *
         *     // method (on constructor)
         *     result = Reflect.deleteMetadata("custom:annotation", Example, "staticMethod");
         *
         *     // method (on prototype)
         *     result = Reflect.deleteMetadata("custom:annotation", Example.prototype, "method");
         *
         */
        function deleteMetadata(metadataKey, target, propertyKey) {
            if (!IsObject(target))
                throw new TypeError();
            if (!IsUndefined(propertyKey))
                propertyKey = ToPropertyKey(propertyKey);
            var metadataMap = GetOrCreateMetadataMap(target, propertyKey, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            if (!metadataMap.delete(metadataKey))
                return false;
            if (metadataMap.size > 0)
                return true;
            var targetMetadata = Metadata.get(target);
            targetMetadata.delete(propertyKey);
            if (targetMetadata.size > 0)
                return true;
            Metadata.delete(target);
            return true;
        }
        exporter("deleteMetadata", deleteMetadata);
        function DecorateConstructor(decorators, target) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsConstructor(decorated))
                        throw new TypeError();
                    target = decorated;
                }
            }
            return target;
        }
        function DecorateProperty(decorators, target, propertyKey, descriptor) {
            for (var i = decorators.length - 1; i >= 0; --i) {
                var decorator = decorators[i];
                var decorated = decorator(target, propertyKey, descriptor);
                if (!IsUndefined(decorated) && !IsNull(decorated)) {
                    if (!IsObject(decorated))
                        throw new TypeError();
                    descriptor = decorated;
                }
            }
            return descriptor;
        }
        function GetOrCreateMetadataMap(O, P, Create) {
            var targetMetadata = Metadata.get(O);
            if (IsUndefined(targetMetadata)) {
                if (!Create)
                    return undefined;
                targetMetadata = new _Map();
                Metadata.set(O, targetMetadata);
            }
            var metadataMap = targetMetadata.get(P);
            if (IsUndefined(metadataMap)) {
                if (!Create)
                    return undefined;
                metadataMap = new _Map();
                targetMetadata.set(P, metadataMap);
            }
            return metadataMap;
        }
        // 3.1.1.1 OrdinaryHasMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasmetadata
        function OrdinaryHasMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return true;
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryHasMetadata(MetadataKey, parent, P);
            return false;
        }
        // 3.1.2.1 OrdinaryHasOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryhasownmetadata
        function OrdinaryHasOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return false;
            return ToBoolean(metadataMap.has(MetadataKey));
        }
        // 3.1.3.1 OrdinaryGetMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetmetadata
        function OrdinaryGetMetadata(MetadataKey, O, P) {
            var hasOwn = OrdinaryHasOwnMetadata(MetadataKey, O, P);
            if (hasOwn)
                return OrdinaryGetOwnMetadata(MetadataKey, O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (!IsNull(parent))
                return OrdinaryGetMetadata(MetadataKey, parent, P);
            return undefined;
        }
        // 3.1.4.1 OrdinaryGetOwnMetadata(MetadataKey, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarygetownmetadata
        function OrdinaryGetOwnMetadata(MetadataKey, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return undefined;
            return metadataMap.get(MetadataKey);
        }
        // 3.1.5.1 OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarydefineownmetadata
        function OrdinaryDefineOwnMetadata(MetadataKey, MetadataValue, O, P) {
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ true);
            metadataMap.set(MetadataKey, MetadataValue);
        }
        // 3.1.6.1 OrdinaryMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinarymetadatakeys
        function OrdinaryMetadataKeys(O, P) {
            var ownKeys = OrdinaryOwnMetadataKeys(O, P);
            var parent = OrdinaryGetPrototypeOf(O);
            if (parent === null)
                return ownKeys;
            var parentKeys = OrdinaryMetadataKeys(parent, P);
            if (parentKeys.length <= 0)
                return ownKeys;
            if (ownKeys.length <= 0)
                return parentKeys;
            var set = new _Set();
            var keys = [];
            for (var _i = 0, ownKeys_1 = ownKeys; _i < ownKeys_1.length; _i++) {
                var key = ownKeys_1[_i];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            for (var _a = 0, parentKeys_1 = parentKeys; _a < parentKeys_1.length; _a++) {
                var key = parentKeys_1[_a];
                var hasKey = set.has(key);
                if (!hasKey) {
                    set.add(key);
                    keys.push(key);
                }
            }
            return keys;
        }
        // 3.1.7.1 OrdinaryOwnMetadataKeys(O, P)
        // https://rbuckton.github.io/reflect-metadata/#ordinaryownmetadatakeys
        function OrdinaryOwnMetadataKeys(O, P) {
            var keys = [];
            var metadataMap = GetOrCreateMetadataMap(O, P, /*Create*/ false);
            if (IsUndefined(metadataMap))
                return keys;
            var keysObj = metadataMap.keys();
            var iterator = GetIterator(keysObj);
            var k = 0;
            while (true) {
                var next = IteratorStep(iterator);
                if (!next) {
                    keys.length = k;
                    return keys;
                }
                var nextValue = IteratorValue(next);
                try {
                    keys[k] = nextValue;
                }
                catch (e) {
                    try {
                        IteratorClose(iterator);
                    }
                    finally {
                        throw e;
                    }
                }
                k++;
            }
        }
        // 6 ECMAScript Data Typ0es and Values
        // https://tc39.github.io/ecma262/#sec-ecmascript-data-types-and-values
        function Type(x) {
            if (x === null)
                return 1 /* Null */;
            switch (typeof x) {
                case "undefined": return 0 /* Undefined */;
                case "boolean": return 2 /* Boolean */;
                case "string": return 3 /* String */;
                case "symbol": return 4 /* Symbol */;
                case "number": return 5 /* Number */;
                case "object": return x === null ? 1 /* Null */ : 6 /* Object */;
                default: return 6 /* Object */;
            }
        }
        // 6.1.1 The Undefined Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-undefined-type
        function IsUndefined(x) {
            return x === undefined;
        }
        // 6.1.2 The Null Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-null-type
        function IsNull(x) {
            return x === null;
        }
        // 6.1.5 The Symbol Type
        // https://tc39.github.io/ecma262/#sec-ecmascript-language-types-symbol-type
        function IsSymbol(x) {
            return typeof x === "symbol";
        }
        // 6.1.7 The Object Type
        // https://tc39.github.io/ecma262/#sec-object-type
        function IsObject(x) {
            return typeof x === "object" ? x !== null : typeof x === "function";
        }
        // 7.1 Type Conversion
        // https://tc39.github.io/ecma262/#sec-type-conversion
        // 7.1.1 ToPrimitive(input [, PreferredType])
        // https://tc39.github.io/ecma262/#sec-toprimitive
        function ToPrimitive(input, PreferredType) {
            switch (Type(input)) {
                case 0 /* Undefined */: return input;
                case 1 /* Null */: return input;
                case 2 /* Boolean */: return input;
                case 3 /* String */: return input;
                case 4 /* Symbol */: return input;
                case 5 /* Number */: return input;
            }
            var hint = PreferredType === 3 /* String */ ? "string" : PreferredType === 5 /* Number */ ? "number" : "default";
            var exoticToPrim = GetMethod(input, toPrimitiveSymbol);
            if (exoticToPrim !== undefined) {
                var result = exoticToPrim.call(input, hint);
                if (IsObject(result))
                    throw new TypeError();
                return result;
            }
            return OrdinaryToPrimitive(input, hint === "default" ? "number" : hint);
        }
        // 7.1.1.1 OrdinaryToPrimitive(O, hint)
        // https://tc39.github.io/ecma262/#sec-ordinarytoprimitive
        function OrdinaryToPrimitive(O, hint) {
            if (hint === "string") {
                var toString_1 = O.toString;
                if (IsCallable(toString_1)) {
                    var result = toString_1.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            else {
                var valueOf = O.valueOf;
                if (IsCallable(valueOf)) {
                    var result = valueOf.call(O);
                    if (!IsObject(result))
                        return result;
                }
                var toString_2 = O.toString;
                if (IsCallable(toString_2)) {
                    var result = toString_2.call(O);
                    if (!IsObject(result))
                        return result;
                }
            }
            throw new TypeError();
        }
        // 7.1.2 ToBoolean(argument)
        // https://tc39.github.io/ecma262/2016/#sec-toboolean
        function ToBoolean(argument) {
            return !!argument;
        }
        // 7.1.12 ToString(argument)
        // https://tc39.github.io/ecma262/#sec-tostring
        function ToString(argument) {
            return "" + argument;
        }
        // 7.1.14 ToPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-topropertykey
        function ToPropertyKey(argument) {
            var key = ToPrimitive(argument, 3 /* String */);
            if (IsSymbol(key))
                return key;
            return ToString(key);
        }
        // 7.2 Testing and Comparison Operations
        // https://tc39.github.io/ecma262/#sec-testing-and-comparison-operations
        // 7.2.2 IsArray(argument)
        // https://tc39.github.io/ecma262/#sec-isarray
        function IsArray(argument) {
            return Array.isArray
                ? Array.isArray(argument)
                : argument instanceof Object
                    ? argument instanceof Array
                    : Object.prototype.toString.call(argument) === "[object Array]";
        }
        // 7.2.3 IsCallable(argument)
        // https://tc39.github.io/ecma262/#sec-iscallable
        function IsCallable(argument) {
            // NOTE: This is an approximation as we cannot check for [[Call]] internal method.
            return typeof argument === "function";
        }
        // 7.2.4 IsConstructor(argument)
        // https://tc39.github.io/ecma262/#sec-isconstructor
        function IsConstructor(argument) {
            // NOTE: This is an approximation as we cannot check for [[Construct]] internal method.
            return typeof argument === "function";
        }
        // 7.2.7 IsPropertyKey(argument)
        // https://tc39.github.io/ecma262/#sec-ispropertykey
        function IsPropertyKey(argument) {
            switch (Type(argument)) {
                case 3 /* String */: return true;
                case 4 /* Symbol */: return true;
                default: return false;
            }
        }
        // 7.3 Operations on Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-objects
        // 7.3.9 GetMethod(V, P)
        // https://tc39.github.io/ecma262/#sec-getmethod
        function GetMethod(V, P) {
            var func = V[P];
            if (func === undefined || func === null)
                return undefined;
            if (!IsCallable(func))
                throw new TypeError();
            return func;
        }
        // 7.4 Operations on Iterator Objects
        // https://tc39.github.io/ecma262/#sec-operations-on-iterator-objects
        function GetIterator(obj) {
            var method = GetMethod(obj, iteratorSymbol);
            if (!IsCallable(method))
                throw new TypeError(); // from Call
            var iterator = method.call(obj);
            if (!IsObject(iterator))
                throw new TypeError();
            return iterator;
        }
        // 7.4.4 IteratorValue(iterResult)
        // https://tc39.github.io/ecma262/2016/#sec-iteratorvalue
        function IteratorValue(iterResult) {
            return iterResult.value;
        }
        // 7.4.5 IteratorStep(iterator)
        // https://tc39.github.io/ecma262/#sec-iteratorstep
        function IteratorStep(iterator) {
            var result = iterator.next();
            return result.done ? false : result;
        }
        // 7.4.6 IteratorClose(iterator, completion)
        // https://tc39.github.io/ecma262/#sec-iteratorclose
        function IteratorClose(iterator) {
            var f = iterator["return"];
            if (f)
                f.call(iterator);
        }
        // 9.1 Ordinary Object Internal Methods and Internal Slots
        // https://tc39.github.io/ecma262/#sec-ordinary-object-internal-methods-and-internal-slots
        // 9.1.1.1 OrdinaryGetPrototypeOf(O)
        // https://tc39.github.io/ecma262/#sec-ordinarygetprototypeof
        function OrdinaryGetPrototypeOf(O) {
            var proto = Object.getPrototypeOf(O);
            if (typeof O !== "function" || O === functionPrototype)
                return proto;
            // TypeScript doesn't set __proto__ in ES5, as it's non-standard.
            // Try to determine the superclass constructor. Compatible implementations
            // must either set __proto__ on a subclass constructor to the superclass constructor,
            // or ensure each class has a valid `constructor` property on its prototype that
            // points back to the constructor.
            // If this is not the same as Function.[[Prototype]], then this is definately inherited.
            // This is the case when in ES6 or when using __proto__ in a compatible browser.
            if (proto !== functionPrototype)
                return proto;
            // If the super prototype is Object.prototype, null, or undefined, then we cannot determine the heritage.
            var prototype = O.prototype;
            var prototypeProto = prototype && Object.getPrototypeOf(prototype);
            if (prototypeProto == null || prototypeProto === Object.prototype)
                return proto;
            // If the constructor was not a function, then we cannot determine the heritage.
            var constructor = prototypeProto.constructor;
            if (typeof constructor !== "function")
                return proto;
            // If we have some kind of self-reference, then we cannot determine the heritage.
            if (constructor === O)
                return proto;
            // we have a pretty good guess at the heritage.
            return constructor;
        }
        // naive Map shim
        function CreateMapPolyfill() {
            var cacheSentinel = {};
            var arraySentinel = [];
            var MapIterator = /** @class */ (function () {
                function MapIterator(keys, values, selector) {
                    this._index = 0;
                    this._keys = keys;
                    this._values = values;
                    this._selector = selector;
                }
                MapIterator.prototype["@@iterator"] = function () { return this; };
                MapIterator.prototype[iteratorSymbol] = function () { return this; };
                MapIterator.prototype.next = function () {
                    var index = this._index;
                    if (index >= 0 && index < this._keys.length) {
                        var result = this._selector(this._keys[index], this._values[index]);
                        if (index + 1 >= this._keys.length) {
                            this._index = -1;
                            this._keys = arraySentinel;
                            this._values = arraySentinel;
                        }
                        else {
                            this._index++;
                        }
                        return { value: result, done: false };
                    }
                    return { value: undefined, done: true };
                };
                MapIterator.prototype.throw = function (error) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    throw error;
                };
                MapIterator.prototype.return = function (value) {
                    if (this._index >= 0) {
                        this._index = -1;
                        this._keys = arraySentinel;
                        this._values = arraySentinel;
                    }
                    return { value: value, done: true };
                };
                return MapIterator;
            }());
            return /** @class */ (function () {
                function Map() {
                    this._keys = [];
                    this._values = [];
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                }
                Object.defineProperty(Map.prototype, "size", {
                    get: function () { return this._keys.length; },
                    enumerable: true,
                    configurable: true
                });
                Map.prototype.has = function (key) { return this._find(key, /*insert*/ false) >= 0; };
                Map.prototype.get = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    return index >= 0 ? this._values[index] : undefined;
                };
                Map.prototype.set = function (key, value) {
                    var index = this._find(key, /*insert*/ true);
                    this._values[index] = value;
                    return this;
                };
                Map.prototype.delete = function (key) {
                    var index = this._find(key, /*insert*/ false);
                    if (index >= 0) {
                        var size = this._keys.length;
                        for (var i = index + 1; i < size; i++) {
                            this._keys[i - 1] = this._keys[i];
                            this._values[i - 1] = this._values[i];
                        }
                        this._keys.length--;
                        this._values.length--;
                        if (key === this._cacheKey) {
                            this._cacheKey = cacheSentinel;
                            this._cacheIndex = -2;
                        }
                        return true;
                    }
                    return false;
                };
                Map.prototype.clear = function () {
                    this._keys.length = 0;
                    this._values.length = 0;
                    this._cacheKey = cacheSentinel;
                    this._cacheIndex = -2;
                };
                Map.prototype.keys = function () { return new MapIterator(this._keys, this._values, getKey); };
                Map.prototype.values = function () { return new MapIterator(this._keys, this._values, getValue); };
                Map.prototype.entries = function () { return new MapIterator(this._keys, this._values, getEntry); };
                Map.prototype["@@iterator"] = function () { return this.entries(); };
                Map.prototype[iteratorSymbol] = function () { return this.entries(); };
                Map.prototype._find = function (key, insert) {
                    if (this._cacheKey !== key) {
                        this._cacheIndex = this._keys.indexOf(this._cacheKey = key);
                    }
                    if (this._cacheIndex < 0 && insert) {
                        this._cacheIndex = this._keys.length;
                        this._keys.push(key);
                        this._values.push(undefined);
                    }
                    return this._cacheIndex;
                };
                return Map;
            }());
            function getKey(key, _) {
                return key;
            }
            function getValue(_, value) {
                return value;
            }
            function getEntry(key, value) {
                return [key, value];
            }
        }
        // naive Set shim
        function CreateSetPolyfill() {
            return /** @class */ (function () {
                function Set() {
                    this._map = new _Map();
                }
                Object.defineProperty(Set.prototype, "size", {
                    get: function () { return this._map.size; },
                    enumerable: true,
                    configurable: true
                });
                Set.prototype.has = function (value) { return this._map.has(value); };
                Set.prototype.add = function (value) { return this._map.set(value, value), this; };
                Set.prototype.delete = function (value) { return this._map.delete(value); };
                Set.prototype.clear = function () { this._map.clear(); };
                Set.prototype.keys = function () { return this._map.keys(); };
                Set.prototype.values = function () { return this._map.values(); };
                Set.prototype.entries = function () { return this._map.entries(); };
                Set.prototype["@@iterator"] = function () { return this.keys(); };
                Set.prototype[iteratorSymbol] = function () { return this.keys(); };
                return Set;
            }());
        }
        // naive WeakMap shim
        function CreateWeakMapPolyfill() {
            var UUID_SIZE = 16;
            var keys = HashMap.create();
            var rootKey = CreateUniqueKey();
            return /** @class */ (function () {
                function WeakMap() {
                    this._key = CreateUniqueKey();
                }
                WeakMap.prototype.has = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.has(table, this._key) : false;
                };
                WeakMap.prototype.get = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? HashMap.get(table, this._key) : undefined;
                };
                WeakMap.prototype.set = function (target, value) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ true);
                    table[this._key] = value;
                    return this;
                };
                WeakMap.prototype.delete = function (target) {
                    var table = GetOrCreateWeakMapTable(target, /*create*/ false);
                    return table !== undefined ? delete table[this._key] : false;
                };
                WeakMap.prototype.clear = function () {
                    // NOTE: not a real clear, just makes the previous data unreachable
                    this._key = CreateUniqueKey();
                };
                return WeakMap;
            }());
            function CreateUniqueKey() {
                var key;
                do
                    key = "@@WeakMap@@" + CreateUUID();
                while (HashMap.has(keys, key));
                keys[key] = true;
                return key;
            }
            function GetOrCreateWeakMapTable(target, create) {
                if (!hasOwn.call(target, rootKey)) {
                    if (!create)
                        return undefined;
                    Object.defineProperty(target, rootKey, { value: HashMap.create() });
                }
                return target[rootKey];
            }
            function FillRandomBytes(buffer, size) {
                for (var i = 0; i < size; ++i)
                    buffer[i] = Math.random() * 0xff | 0;
                return buffer;
            }
            function GenRandomBytes(size) {
                if (typeof Uint8Array === "function") {
                    if (typeof crypto !== "undefined")
                        return crypto.getRandomValues(new Uint8Array(size));
                    if (typeof msCrypto !== "undefined")
                        return msCrypto.getRandomValues(new Uint8Array(size));
                    return FillRandomBytes(new Uint8Array(size), size);
                }
                return FillRandomBytes(new Array(size), size);
            }
            function CreateUUID() {
                var data = GenRandomBytes(UUID_SIZE);
                // mark as random - RFC 4122 § 4.4
                data[6] = data[6] & 0x4f | 0x40;
                data[8] = data[8] & 0xbf | 0x80;
                var result = "";
                for (var offset = 0; offset < UUID_SIZE; ++offset) {
                    var byte = data[offset];
                    if (offset === 4 || offset === 6 || offset === 8)
                        result += "-";
                    if (byte < 16)
                        result += "0";
                    result += byte.toString(16).toLowerCase();
                }
                return result;
            }
        }
        // uses a heuristic used by v8 and chakra to force an object into dictionary mode.
        function MakeDictionary(obj) {
            obj.__ = undefined;
            delete obj.__;
            return obj;
        }
    });
})(Reflect$1 || (Reflect$1 = {}));

function field(config) {
    return function (target, propertyKey) {
        let properties = Reflect.getMetadata("editableProperties", target) || [];
        if (properties.indexOf(propertyKey) < 0) {
            properties.push(propertyKey);
        }
        Reflect.defineMetadata("editableProperties", properties, target);
        Reflect.defineMetadata("fieldConfig", config, target, propertyKey);
    };
}
// export function editable(target: any, propertyKey: string) {
//   let properties: string[] =
//     Reflect.getMetadata("editableProperties", target) || [];
//   if (properties.indexOf(propertyKey) < 0) {
//     properties.push(propertyKey);
//   }
//   Reflect.defineMetadata("editableProperties", properties, target);
// }

/**
 * Base interface for managing multiple instances of Form
 * classes.
 */
class FormManager {
    constructor(forms, props) {
        if (forms)
            this.forms = forms;
        if (props)
            Object.assign(this, props);
        this.#getAllValueChanges();
        this.#getAllValid();
        this.#getAllChanged();
        this.#getAllPristine();
    }
    /** Collection of Forms */
    forms = [];
    loading = writable(false);
    all_value_changes = writable({});
    all_valid = writable(false);
    any_changed = writable(false);
    all_pristine = writable(false);
    #all_valid_list = {};
    #all_changed_list = {};
    #all_pristine_list = {};
    _subscriptions = [];
    /** Validate a given form, a number of forms, or all forms */
    validateAll = (callbacks, form_indexes) => {
        if (form_indexes) {
            form_indexes.forEach((index) => {
                this.forms && this.forms[index].validate(callbacks);
            });
        }
        else {
            let k;
            for (k in this.forms) {
                this.forms[k].validate(callbacks);
            }
        }
    };
    destroy = () => {
        this.forms.forEach((f) => f.destroy());
    };
    destroySubscriptions = () => {
        if (this._subscriptions && this._subscriptions.length > 0) {
            this._subscriptions.forEach((unsub) => unsub());
        }
    };
    resetAll = () => {
        this.forms.forEach((f) => f.reset());
    };
    /** All value changes of all forms */
    #getAllValueChanges = () => {
        /** Set all_valid = true, then check if any forms are invalid */
        // let changes: Writable<Record<string, any>> = writable({}),
        let k, i = 0;
        for (k in this.forms) {
            const id = `form_${i}`;
            /** If even one of them is invalid, set all_valid to false */
            if (`${get_store_value(this.forms[k].value_changes)}` !== "{}") {
                const previous_changes = get_store_value(this.all_value_changes);
                if (!previous_changes[id]) {
                    this.all_value_changes.set({ ...previous_changes, [id]: {} });
                }
                const unsubscriber = this.forms[k].value_changes.subscribe((_changes) => {
                    const _previous_changes = get_store_value(this.all_value_changes);
                    this.all_value_changes.set({
                        ..._previous_changes,
                        [id]: _changes,
                    });
                });
                this._subscriptions.push(unsubscriber);
            }
            i++;
        }
    };
    /** Are all of the forms valid? */
    #getAllValid = () => {
        let k, i = 0;
        for (k in this.forms) {
            const index = i;
            const unsubscribe = this.forms[k].valid.subscribe((valid) => {
                this.#all_valid_list[index] = valid;
                if (Object.values(this.#all_valid_list).includes(false)) {
                    this.all_valid.set(false);
                }
                else {
                    this.all_valid.set(true);
                }
            });
            this._subscriptions.push(unsubscribe);
            i++;
        }
    };
    #getAllChanged = () => {
        let k, i = 0;
        for (k in this.forms) {
            const index = i;
            const unsubscribe = this.forms[k].changed.subscribe((changed) => {
                this.#all_changed_list[index] = changed;
                if (Object.values(this.#all_changed_list).includes(true)) {
                    this.any_changed.set(true);
                }
                else {
                    this.any_changed.set(false);
                }
            });
            this._subscriptions.push(unsubscribe);
            i++;
        }
    };
    #getAllPristine = () => {
        let k, i = 0;
        for (k in this.forms) {
            const index = i;
            const unsubscribe = this.forms[k].pristine.subscribe((pristine) => {
                this.#all_pristine_list[index] = pristine;
                if (Object.values(this.#all_pristine_list).includes(false)) {
                    this.all_pristine.set(false);
                }
                else {
                    this.all_pristine.set(true);
                }
            });
            this._subscriptions.push(unsubscribe);
            i++;
        }
    };
}
/**
 * Collection of Forms used as steps.
 * @example a data collection wizard with many fields
 */
class FormStepper extends FormManager {
    constructor(forms, props) {
        super(forms, props);
    }
    /** What step are we on currently? */
    active_step = writable(0);
    /**
     * You can attach data to each step of the stepper.
     *
     * In the example below step #0 has a title, description and instructions.
     * @example { 0: {title: string, description: string, instructions: string} }
     */
    step_data;
    /** Set active step index ++1 */
    nextStep = () => {
        const active_step = get_store_value(this.active_step);
        /** If the active step type is number, increment it. */
        if (typeof active_step === "number")
            this.active_step.set(active_step + 1);
    };
    /** Set active step index --1 */
    backStep = () => {
        const active_step = get_store_value(this.active_step);
        /** If the active step type is number, decrement it. */
        if (typeof active_step === "number")
            this.active_step.set(active_step - 1);
    };
    firstStep = () => {
        if (typeof get_store_value(this.active_step) === "number")
            this.active_step.set(0);
    };
    lastStep = () => {
        if (typeof get_store_value(this.active_step) === "number" && this.forms.length > 0)
            this.active_step.set(this.forms.length - 1);
    };
}
/**
 * Group of Forms which extends the FormManager functionality.
 */
class FormGroup extends FormManager {
    constructor(forms, props) {
        super(forms, props);
    }
}

export { FieldConfig, Form, FormGroup, FormManager, FormStepper, OnEvents, ValidationError, ValidationProperties, field, newForm };
//# sourceMappingURL=index.mjs.map
