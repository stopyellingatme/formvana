(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports, require('svelte')) :
    typeof define === 'function' && define.amd ? define(['exports', 'svelte'], factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, factory(global['@formvana'] = {}));
}(this, (function (exports) { 'use strict';

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
     * FieldConfig is used to help with the form auto generation functionality.
     *
     * This is not meant to be a complete HTML input replacement.
     * It is simply a vehicle to help give the form generator
     * a standard-ish format to work with.
     */
    class FieldConfig {
        constructor(init) {
            this.type = "text"; // Defaults to text, for now
            this.required = false;
            this.value = writable(null);
            /**
             * * JSON of things like:
             * -- type="text || email || password || whatever"
             * -- class='input class'
             * -- disabled
             * -- title='input title'
             * -- etc.
             */
            this.attributes = {};
            /**
             * Validation Errors!
             * We're mainly looking for the class-validator "constraints"
             * One ValidationError object can have multiple errors (constraints)
             */
            this.errors = writable(null);
            this.clearValue = () => {
                this.value.set(null);
            };
            this.clearErrors = () => {
                this.errors.set(null);
            };
            this.clear = () => {
                this.clearValue();
                this.clearErrors();
            };
            Object.assign(this, init);
            this.attributes["type"] = this.type;
            if (this.type === "text" ||
                this.type === "email" ||
                this.type === "password" ||
                this.type === "string") {
                this.value.set("");
            }
            if (this.type === "number") {
                this.value.set(0);
            }
            if (this.type === "decimal") {
                this.value.set(0.0);
            }
            if (this.type === "boolean" ||
                this.type === "choice" ||
                this.type === "radio") {
                this.value.set(false);
                this.options = [];
            }
            if (this.el === "select" ||
                this.type === "select" ||
                this.el === "dropdown" ||
                this.type === "radio") {
                this.options = [];
            }
            if (this.attributes["title"]) {
                this.attributes["aria-label"] = this.attributes["title"];
            }
            else {
                this.attributes["aria-label"] = this.label || this.name;
            }
        }
    }

    /**
     * This metadata contains validation rules.
     */
    var ValidationMetadata = /** @class */ (function () {
        // -------------------------------------------------------------------------
        // Constructor
        // -------------------------------------------------------------------------
        function ValidationMetadata(args) {
            /**
             * Validation groups used for this validation.
             */
            this.groups = [];
            /**
             * Specifies if validated value is an array and each of its item must be validated.
             */
            this.each = false;
            /*
             * A transient set of data passed through to the validation result for response mapping
             */
            this.context = undefined;
            this.type = args.type;
            this.target = args.target;
            this.propertyName = args.propertyName;
            this.constraints = args.constraints;
            this.constraintCls = args.constraintCls;
            this.validationTypeOptions = args.validationTypeOptions;
            if (args.validationOptions) {
                this.message = args.validationOptions.message;
                this.groups = args.validationOptions.groups;
                this.always = args.validationOptions.always;
                this.each = args.validationOptions.each;
                this.context = args.validationOptions.context;
            }
        }
        return ValidationMetadata;
    }());

    /**
     * Used to transform validation schemas to validation metadatas.
     */
    var ValidationSchemaToMetadataTransformer = /** @class */ (function () {
        function ValidationSchemaToMetadataTransformer() {
        }
        ValidationSchemaToMetadataTransformer.prototype.transform = function (schema) {
            var metadatas = [];
            Object.keys(schema.properties).forEach(function (property) {
                schema.properties[property].forEach(function (validation) {
                    var validationOptions = {
                        message: validation.message,
                        groups: validation.groups,
                        always: validation.always,
                        each: validation.each,
                    };
                    var args = {
                        type: validation.type,
                        target: schema.name,
                        propertyName: property,
                        constraints: validation.constraints,
                        validationTypeOptions: validation.options,
                        validationOptions: validationOptions,
                    };
                    metadatas.push(new ValidationMetadata(args));
                });
            });
            return metadatas;
        };
        return ValidationSchemaToMetadataTransformer;
    }());

    /**
     * Convert Map, Set to Array
     */
    function convertToArray(val) {
        if (val instanceof Map) {
            return Array.from(val.values());
        }
        return Array.isArray(val) ? val : Array.from(val);
    }

    /**
     * This function returns the global object across Node and browsers.
     *
     * Note: `globalThis` is the standardized approach however it has been added to
     * Node.js in version 12. We need to include this snippet until Node 12 EOL.
     */
    function getGlobal() {
        if (typeof globalThis !== 'undefined') {
            return globalThis;
        }
        if (typeof global !== 'undefined') {
            return global;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: Cannot find name 'window'.
        if (typeof window !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: Cannot find name 'window'.
            return window;
        }
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore: Cannot find name 'self'.
        if (typeof self !== 'undefined') {
            // eslint-disable-next-line @typescript-eslint/ban-ts-comment
            // @ts-ignore: Cannot find name 'self'.
            return self;
        }
    }

    // https://github.com/TylorS/typed-is-promise/blob/abf1514e1b6961adfc75765476b0debb96b2c3ae/src/index.ts
    function isPromise(p) {
        return p !== null && typeof p === 'object' && typeof p.then === 'function';
    }

    /**
     * Storage all metadatas.
     */
    var MetadataStorage = /** @class */ (function () {
        function MetadataStorage() {
            // -------------------------------------------------------------------------
            // Private properties
            // -------------------------------------------------------------------------
            this.validationMetadatas = [];
            this.constraintMetadatas = [];
        }
        Object.defineProperty(MetadataStorage.prototype, "hasValidationMetaData", {
            get: function () {
                return !!this.validationMetadatas.length;
            },
            enumerable: false,
            configurable: true
        });
        // -------------------------------------------------------------------------
        // Public Methods
        // -------------------------------------------------------------------------
        /**
         * Adds a new validation metadata.
         */
        MetadataStorage.prototype.addValidationSchema = function (schema) {
            var _this = this;
            var validationMetadatas = new ValidationSchemaToMetadataTransformer().transform(schema);
            validationMetadatas.forEach(function (validationMetadata) { return _this.addValidationMetadata(validationMetadata); });
        };
        /**
         * Adds a new validation metadata.
         */
        MetadataStorage.prototype.addValidationMetadata = function (metadata) {
            this.validationMetadatas.push(metadata);
        };
        /**
         * Adds a new constraint metadata.
         */
        MetadataStorage.prototype.addConstraintMetadata = function (metadata) {
            this.constraintMetadatas.push(metadata);
        };
        /**
         * Groups metadata by their property names.
         */
        MetadataStorage.prototype.groupByPropertyName = function (metadata) {
            var grouped = {};
            metadata.forEach(function (metadata) {
                if (!grouped[metadata.propertyName])
                    grouped[metadata.propertyName] = [];
                grouped[metadata.propertyName].push(metadata);
            });
            return grouped;
        };
        /**
         * Gets all validation metadatas for the given object with the given groups.
         */
        MetadataStorage.prototype.getTargetValidationMetadatas = function (targetConstructor, targetSchema, always, strictGroups, groups) {
            var includeMetadataBecauseOfAlwaysOption = function (metadata) {
                // `metadata.always` overrides global default.
                if (typeof metadata.always !== 'undefined')
                    return metadata.always;
                // `metadata.groups` overrides global default.
                if (metadata.groups && metadata.groups.length)
                    return false;
                // Use global default.
                return always;
            };
            var excludeMetadataBecauseOfStrictGroupsOption = function (metadata) {
                if (strictGroups) {
                    // Validation is not using groups.
                    if (!groups || !groups.length) {
                        // `metadata.groups` has at least one group.
                        if (metadata.groups && metadata.groups.length)
                            return true;
                    }
                }
                return false;
            };
            // get directly related to a target metadatas
            var originalMetadatas = this.validationMetadatas.filter(function (metadata) {
                if (metadata.target !== targetConstructor && metadata.target !== targetSchema)
                    return false;
                if (includeMetadataBecauseOfAlwaysOption(metadata))
                    return true;
                if (excludeMetadataBecauseOfStrictGroupsOption(metadata))
                    return false;
                if (groups && groups.length > 0)
                    return metadata.groups && !!metadata.groups.find(function (group) { return groups.indexOf(group) !== -1; });
                return true;
            });
            // get metadatas for inherited classes
            var inheritedMetadatas = this.validationMetadatas.filter(function (metadata) {
                // if target is a string it's means we validate against a schema, and there is no inheritance support for schemas
                if (typeof metadata.target === 'string')
                    return false;
                if (metadata.target === targetConstructor)
                    return false;
                if (metadata.target instanceof Function && !(targetConstructor.prototype instanceof metadata.target))
                    return false;
                if (includeMetadataBecauseOfAlwaysOption(metadata))
                    return true;
                if (excludeMetadataBecauseOfStrictGroupsOption(metadata))
                    return false;
                if (groups && groups.length > 0)
                    return metadata.groups && !!metadata.groups.find(function (group) { return groups.indexOf(group) !== -1; });
                return true;
            });
            // filter out duplicate metadatas, prefer original metadatas instead of inherited metadatas
            var uniqueInheritedMetadatas = inheritedMetadatas.filter(function (inheritedMetadata) {
                return !originalMetadatas.find(function (originalMetadata) {
                    return (originalMetadata.propertyName === inheritedMetadata.propertyName &&
                        originalMetadata.type === inheritedMetadata.type);
                });
            });
            return originalMetadatas.concat(uniqueInheritedMetadatas);
        };
        /**
         * Gets all validator constraints for the given object.
         */
        MetadataStorage.prototype.getTargetValidatorConstraints = function (target) {
            return this.constraintMetadatas.filter(function (metadata) { return metadata.target === target; });
        };
        return MetadataStorage;
    }());
    /**
     * Gets metadata storage.
     * Metadata storage follows the best practices and stores metadata in a global variable.
     */
    function getMetadataStorage() {
        var global = getGlobal();
        if (!global.classValidatorMetadataStorage) {
            global.classValidatorMetadataStorage = new MetadataStorage();
        }
        return global.classValidatorMetadataStorage;
    }

    /**
     * Validation error description.
     */
    var ValidationError = /** @class */ (function () {
        function ValidationError() {
        }
        /**
         *
         * @param shouldDecorate decorate the message with ANSI formatter escape codes for better readability
         * @param hasParent true when the error is a child of an another one
         * @param parentPath path as string to the parent of this property
         */
        ValidationError.prototype.toString = function (shouldDecorate, hasParent, parentPath) {
            var _this = this;
            if (shouldDecorate === void 0) { shouldDecorate = false; }
            if (hasParent === void 0) { hasParent = false; }
            if (parentPath === void 0) { parentPath = ""; }
            var boldStart = shouldDecorate ? "\u001B[1m" : "";
            var boldEnd = shouldDecorate ? "\u001B[22m" : "";
            var propConstraintFailed = function (propertyName) {
                return " - property " + boldStart + parentPath + propertyName + boldEnd + " has failed the following constraints: " + boldStart + Object.keys(_this.constraints).join(", ") + boldEnd + " \n";
            };
            if (!hasParent) {
                return ("An instance of " + boldStart + (this.target ? this.target.constructor.name : 'an object') + boldEnd + " has failed the validation:\n" +
                    (this.constraints ? propConstraintFailed(this.property) : "") +
                    (this.children
                        ? this.children.map(function (childError) { return childError.toString(shouldDecorate, true, _this.property); }).join("")
                        : ""));
            }
            else {
                // we format numbers as array indexes for better readability.
                var formattedProperty_1 = Number.isInteger(+this.property)
                    ? "[" + this.property + "]"
                    : "" + (parentPath ? "." : "") + this.property;
                if (this.constraints) {
                    return propConstraintFailed(formattedProperty_1);
                }
                else {
                    return this.children
                        ? this.children
                            .map(function (childError) { return childError.toString(shouldDecorate, true, "" + parentPath + formattedProperty_1); })
                            .join("")
                        : "";
                }
            }
        };
        return ValidationError;
    }());

    /**
     * Validation types.
     */
    var ValidationTypes = /** @class */ (function () {
        function ValidationTypes() {
        }
        /**
         * Checks if validation type is valid.
         */
        ValidationTypes.isValid = function (type) {
            var _this = this;
            return (type !== 'isValid' &&
                type !== 'getMessage' &&
                Object.keys(this)
                    .map(function (key) { return _this[key]; })
                    .indexOf(type) !== -1);
        };
        /* system */
        ValidationTypes.CUSTOM_VALIDATION = 'customValidation'; // done
        ValidationTypes.NESTED_VALIDATION = 'nestedValidation'; // done
        ValidationTypes.PROMISE_VALIDATION = 'promiseValidation'; // done
        ValidationTypes.CONDITIONAL_VALIDATION = 'conditionalValidation'; // done
        ValidationTypes.WHITELIST = 'whitelistValidation'; // done
        ValidationTypes.IS_DEFINED = 'isDefined'; // done
        return ValidationTypes;
    }());

    /**
     * Convert the constraint to a string to be shown in an error
     */
    function constraintToString(constraint) {
        if (Array.isArray(constraint)) {
            return constraint.join(', ');
        }
        return "" + constraint;
    }
    var ValidationUtils = /** @class */ (function () {
        function ValidationUtils() {
        }
        ValidationUtils.replaceMessageSpecialTokens = function (message, validationArguments) {
            var messageString;
            if (message instanceof Function) {
                messageString = message(validationArguments);
            }
            else if (typeof message === 'string') {
                messageString = message;
            }
            if (messageString && validationArguments.constraints instanceof Array) {
                validationArguments.constraints.forEach(function (constraint, index) {
                    messageString = messageString.replace(new RegExp("\\$constraint" + (index + 1), 'g'), constraintToString(constraint));
                });
            }
            if (messageString &&
                validationArguments.value !== undefined &&
                validationArguments.value !== null &&
                typeof validationArguments.value === 'string')
                messageString = messageString.replace(/\$value/g, validationArguments.value);
            if (messageString)
                messageString = messageString.replace(/\$property/g, validationArguments.property);
            if (messageString)
                messageString = messageString.replace(/\$target/g, validationArguments.targetName);
            return messageString;
        };
        return ValidationUtils;
    }());

    /**
     * Executes validation over given object.
     */
    var ValidationExecutor = /** @class */ (function () {
        // -------------------------------------------------------------------------
        // Constructor
        // -------------------------------------------------------------------------
        function ValidationExecutor(validator, validatorOptions) {
            this.validator = validator;
            this.validatorOptions = validatorOptions;
            // -------------------------------------------------------------------------
            // Properties
            // -------------------------------------------------------------------------
            this.awaitingPromises = [];
            this.ignoreAsyncValidations = false;
            // -------------------------------------------------------------------------
            // Private Properties
            // -------------------------------------------------------------------------
            this.metadataStorage = getMetadataStorage();
        }
        // -------------------------------------------------------------------------
        // Public Methods
        // -------------------------------------------------------------------------
        ValidationExecutor.prototype.execute = function (object, targetSchema, validationErrors) {
            var _this = this;
            var _a;
            /**
             * If there is no metadata registered it means possibly the dependencies are not flatterned and
             * more than one instance is used.
             *
             * TODO: This needs proper handling, forcing to use the same container or some other proper solution.
             */
            if (!this.metadataStorage.hasValidationMetaData && ((_a = this.validatorOptions) === null || _a === void 0 ? void 0 : _a.enableDebugMessages) === true) {
                console.warn("No metadata found. There is more than once class-validator version installed probably. You need to flatten your dependencies.");
            }
            var groups = this.validatorOptions ? this.validatorOptions.groups : undefined;
            var strictGroups = (this.validatorOptions && this.validatorOptions.strictGroups) || false;
            var always = (this.validatorOptions && this.validatorOptions.always) || false;
            var targetMetadatas = this.metadataStorage.getTargetValidationMetadatas(object.constructor, targetSchema, always, strictGroups, groups);
            var groupedMetadatas = this.metadataStorage.groupByPropertyName(targetMetadatas);
            if (this.validatorOptions && this.validatorOptions.forbidUnknownValues && !targetMetadatas.length) {
                var validationError = new ValidationError();
                if (!this.validatorOptions ||
                    !this.validatorOptions.validationError ||
                    this.validatorOptions.validationError.target === undefined ||
                    this.validatorOptions.validationError.target === true)
                    validationError.target = object;
                validationError.value = undefined;
                validationError.property = undefined;
                validationError.children = [];
                validationError.constraints = { unknownValue: 'an unknown value was passed to the validate function' };
                validationErrors.push(validationError);
                return;
            }
            if (this.validatorOptions && this.validatorOptions.whitelist)
                this.whitelist(object, groupedMetadatas, validationErrors);
            // General validation
            Object.keys(groupedMetadatas).forEach(function (propertyName) {
                var value = object[propertyName];
                var definedMetadatas = groupedMetadatas[propertyName].filter(function (metadata) { return metadata.type === ValidationTypes.IS_DEFINED; });
                var metadatas = groupedMetadatas[propertyName].filter(function (metadata) { return metadata.type !== ValidationTypes.IS_DEFINED && metadata.type !== ValidationTypes.WHITELIST; });
                if (value instanceof Promise &&
                    metadatas.find(function (metadata) { return metadata.type === ValidationTypes.PROMISE_VALIDATION; })) {
                    _this.awaitingPromises.push(value.then(function (resolvedValue) {
                        _this.performValidations(object, resolvedValue, propertyName, definedMetadatas, metadatas, validationErrors);
                    }));
                }
                else {
                    _this.performValidations(object, value, propertyName, definedMetadatas, metadatas, validationErrors);
                }
            });
        };
        ValidationExecutor.prototype.whitelist = function (object, groupedMetadatas, validationErrors) {
            var _this = this;
            var notAllowedProperties = [];
            Object.keys(object).forEach(function (propertyName) {
                // does this property have no metadata?
                if (!groupedMetadatas[propertyName] || groupedMetadatas[propertyName].length === 0)
                    notAllowedProperties.push(propertyName);
            });
            if (notAllowedProperties.length > 0) {
                if (this.validatorOptions && this.validatorOptions.forbidNonWhitelisted) {
                    // throw errors
                    notAllowedProperties.forEach(function (property) {
                        var _a;
                        var validationError = _this.generateValidationError(object, object[property], property);
                        validationError.constraints = (_a = {}, _a[ValidationTypes.WHITELIST] = "property " + property + " should not exist", _a);
                        validationError.children = undefined;
                        validationErrors.push(validationError);
                    });
                }
                else {
                    // strip non allowed properties
                    notAllowedProperties.forEach(function (property) { return delete object[property]; });
                }
            }
        };
        ValidationExecutor.prototype.stripEmptyErrors = function (errors) {
            var _this = this;
            return errors.filter(function (error) {
                if (error.children) {
                    error.children = _this.stripEmptyErrors(error.children);
                }
                if (Object.keys(error.constraints).length === 0) {
                    if (error.children.length === 0) {
                        return false;
                    }
                    else {
                        delete error.constraints;
                    }
                }
                return true;
            });
        };
        // -------------------------------------------------------------------------
        // Private Methods
        // -------------------------------------------------------------------------
        ValidationExecutor.prototype.performValidations = function (object, value, propertyName, definedMetadatas, metadatas, validationErrors) {
            var customValidationMetadatas = metadatas.filter(function (metadata) { return metadata.type === ValidationTypes.CUSTOM_VALIDATION; });
            var nestedValidationMetadatas = metadatas.filter(function (metadata) { return metadata.type === ValidationTypes.NESTED_VALIDATION; });
            var conditionalValidationMetadatas = metadatas.filter(function (metadata) { return metadata.type === ValidationTypes.CONDITIONAL_VALIDATION; });
            var validationError = this.generateValidationError(object, value, propertyName);
            validationErrors.push(validationError);
            var canValidate = this.conditionalValidations(object, value, conditionalValidationMetadatas);
            if (!canValidate) {
                return;
            }
            // handle IS_DEFINED validation type the special way - it should work no matter skipUndefinedProperties/skipMissingProperties is set or not
            this.customValidations(object, value, definedMetadatas, validationError);
            this.mapContexts(object, value, definedMetadatas, validationError);
            if (value === undefined && this.validatorOptions && this.validatorOptions.skipUndefinedProperties === true) {
                return;
            }
            if (value === null && this.validatorOptions && this.validatorOptions.skipNullProperties === true) {
                return;
            }
            if ((value === null || value === undefined) &&
                this.validatorOptions &&
                this.validatorOptions.skipMissingProperties === true) {
                return;
            }
            this.customValidations(object, value, customValidationMetadatas, validationError);
            this.nestedValidations(value, nestedValidationMetadatas, validationError.children);
            this.mapContexts(object, value, metadatas, validationError);
            this.mapContexts(object, value, customValidationMetadatas, validationError);
        };
        ValidationExecutor.prototype.generateValidationError = function (object, value, propertyName) {
            var validationError = new ValidationError();
            if (!this.validatorOptions ||
                !this.validatorOptions.validationError ||
                this.validatorOptions.validationError.target === undefined ||
                this.validatorOptions.validationError.target === true)
                validationError.target = object;
            if (!this.validatorOptions ||
                !this.validatorOptions.validationError ||
                this.validatorOptions.validationError.value === undefined ||
                this.validatorOptions.validationError.value === true)
                validationError.value = value;
            validationError.property = propertyName;
            validationError.children = [];
            validationError.constraints = {};
            return validationError;
        };
        ValidationExecutor.prototype.conditionalValidations = function (object, value, metadatas) {
            return metadatas
                .map(function (metadata) { return metadata.constraints[0](object, value); })
                .reduce(function (resultA, resultB) { return resultA && resultB; }, true);
        };
        ValidationExecutor.prototype.customValidations = function (object, value, metadatas, error) {
            var _this = this;
            metadatas.forEach(function (metadata) {
                _this.metadataStorage.getTargetValidatorConstraints(metadata.constraintCls).forEach(function (customConstraintMetadata) {
                    if (customConstraintMetadata.async && _this.ignoreAsyncValidations)
                        return;
                    if (_this.validatorOptions &&
                        _this.validatorOptions.stopAtFirstError &&
                        Object.keys(error.constraints || {}).length > 0)
                        return;
                    var validationArguments = {
                        targetName: object.constructor ? object.constructor.name : undefined,
                        property: metadata.propertyName,
                        object: object,
                        value: value,
                        constraints: metadata.constraints,
                    };
                    if (!metadata.each || !(value instanceof Array || value instanceof Set || value instanceof Map)) {
                        var validatedValue = customConstraintMetadata.instance.validate(value, validationArguments);
                        if (isPromise(validatedValue)) {
                            var promise = validatedValue.then(function (isValid) {
                                if (!isValid) {
                                    var _a = _this.createValidationError(object, value, metadata, customConstraintMetadata), type = _a[0], message = _a[1];
                                    error.constraints[type] = message;
                                    if (metadata.context) {
                                        if (!error.contexts) {
                                            error.contexts = {};
                                        }
                                        error.contexts[type] = Object.assign(error.contexts[type] || {}, metadata.context);
                                    }
                                }
                            });
                            _this.awaitingPromises.push(promise);
                        }
                        else {
                            if (!validatedValue) {
                                var _a = _this.createValidationError(object, value, metadata, customConstraintMetadata), type = _a[0], message = _a[1];
                                error.constraints[type] = message;
                            }
                        }
                        return;
                    }
                    // convert set and map into array
                    var arrayValue = convertToArray(value);
                    // Validation needs to be applied to each array item
                    var validatedSubValues = arrayValue.map(function (subValue) {
                        return customConstraintMetadata.instance.validate(subValue, validationArguments);
                    });
                    var validationIsAsync = validatedSubValues.some(function (validatedSubValue) {
                        return isPromise(validatedSubValue);
                    });
                    if (validationIsAsync) {
                        // Wrap plain values (if any) in promises, so that all are async
                        var asyncValidatedSubValues = validatedSubValues.map(function (validatedSubValue) {
                            return isPromise(validatedSubValue) ? validatedSubValue : Promise.resolve(validatedSubValue);
                        });
                        var asyncValidationIsFinishedPromise = Promise.all(asyncValidatedSubValues).then(function (flatValidatedValues) {
                            var validationResult = flatValidatedValues.every(function (isValid) { return isValid; });
                            if (!validationResult) {
                                var _a = _this.createValidationError(object, value, metadata, customConstraintMetadata), type = _a[0], message = _a[1];
                                error.constraints[type] = message;
                                if (metadata.context) {
                                    if (!error.contexts) {
                                        error.contexts = {};
                                    }
                                    error.contexts[type] = Object.assign(error.contexts[type] || {}, metadata.context);
                                }
                            }
                        });
                        _this.awaitingPromises.push(asyncValidationIsFinishedPromise);
                        return;
                    }
                    var validationResult = validatedSubValues.every(function (isValid) { return isValid; });
                    if (!validationResult) {
                        var _b = _this.createValidationError(object, value, metadata, customConstraintMetadata), type = _b[0], message = _b[1];
                        error.constraints[type] = message;
                    }
                });
            });
        };
        ValidationExecutor.prototype.nestedValidations = function (value, metadatas, errors) {
            var _this = this;
            if (value === void 0) {
                return;
            }
            metadatas.forEach(function (metadata) {
                var _a;
                if (metadata.type !== ValidationTypes.NESTED_VALIDATION && metadata.type !== ValidationTypes.PROMISE_VALIDATION) {
                    return;
                }
                if (value instanceof Array || value instanceof Set || value instanceof Map) {
                    // Treats Set as an array - as index of Set value is value itself and it is common case to have Object as value
                    var arrayLikeValue = value instanceof Set ? Array.from(value) : value;
                    arrayLikeValue.forEach(function (subValue, index) {
                        _this.performValidations(value, subValue, index.toString(), [], metadatas, errors);
                    });
                }
                else if (value instanceof Object) {
                    var targetSchema = typeof metadata.target === 'string' ? metadata.target : metadata.target.name;
                    _this.execute(value, targetSchema, errors);
                }
                else {
                    var error = new ValidationError();
                    error.value = value;
                    error.property = metadata.propertyName;
                    error.target = metadata.target;
                    var _b = _this.createValidationError(metadata.target, value, metadata), type = _b[0], message = _b[1];
                    error.constraints = (_a = {},
                        _a[type] = message,
                        _a);
                    errors.push(error);
                }
            });
        };
        ValidationExecutor.prototype.mapContexts = function (object, value, metadatas, error) {
            var _this = this;
            return metadatas.forEach(function (metadata) {
                if (metadata.context) {
                    var customConstraint = void 0;
                    if (metadata.type === ValidationTypes.CUSTOM_VALIDATION) {
                        var customConstraints = _this.metadataStorage.getTargetValidatorConstraints(metadata.constraintCls);
                        customConstraint = customConstraints[0];
                    }
                    var type = _this.getConstraintType(metadata, customConstraint);
                    if (error.constraints[type]) {
                        if (!error.contexts) {
                            error.contexts = {};
                        }
                        error.contexts[type] = Object.assign(error.contexts[type] || {}, metadata.context);
                    }
                }
            });
        };
        ValidationExecutor.prototype.createValidationError = function (object, value, metadata, customValidatorMetadata) {
            var targetName = object.constructor ? object.constructor.name : undefined;
            var type = this.getConstraintType(metadata, customValidatorMetadata);
            var validationArguments = {
                targetName: targetName,
                property: metadata.propertyName,
                object: object,
                value: value,
                constraints: metadata.constraints,
            };
            var message = metadata.message || '';
            if (!metadata.message &&
                (!this.validatorOptions || (this.validatorOptions && !this.validatorOptions.dismissDefaultMessages))) {
                if (customValidatorMetadata && customValidatorMetadata.instance.defaultMessage instanceof Function) {
                    message = customValidatorMetadata.instance.defaultMessage(validationArguments);
                }
            }
            var messageString = ValidationUtils.replaceMessageSpecialTokens(message, validationArguments);
            return [type, messageString];
        };
        ValidationExecutor.prototype.getConstraintType = function (metadata, customValidatorMetadata) {
            var type = customValidatorMetadata && customValidatorMetadata.name ? customValidatorMetadata.name : metadata.type;
            return type;
        };
        return ValidationExecutor;
    }());

    var __awaiter = (undefined && undefined.__awaiter) || function (thisArg, _arguments, P, generator) {
        function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
        return new (P || (P = Promise))(function (resolve, reject) {
            function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
            function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
            function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
            step((generator = generator.apply(thisArg, _arguments || [])).next());
        });
    };
    var __generator = (undefined && undefined.__generator) || function (thisArg, body) {
        var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
        return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
        function verb(n) { return function (v) { return step([n, v]); }; }
        function step(op) {
            if (f) throw new TypeError("Generator is already executing.");
            while (_) try {
                if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
                if (y = 0, t) op = [op[0] & 2, t.value];
                switch (op[0]) {
                    case 0: case 1: t = op; break;
                    case 4: _.label++; return { value: op[1], done: false };
                    case 5: _.label++; y = op[1]; op = [0]; continue;
                    case 7: op = _.ops.pop(); _.trys.pop(); continue;
                    default:
                        if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                        if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                        if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                        if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                        if (t[2]) _.ops.pop();
                        _.trys.pop(); continue;
                }
                op = body.call(thisArg, _);
            } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
            if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
        }
    };
    /**
     * Validator performs validation of the given object based on its metadata.
     */
    var Validator = /** @class */ (function () {
        function Validator() {
        }
        /**
         * Performs validation of the given object based on decorators or validation schema.
         */
        Validator.prototype.validate = function (objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions) {
            return this.coreValidate(objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions);
        };
        /**
         * Performs validation of the given object based on decorators or validation schema and reject on error.
         */
        Validator.prototype.validateOrReject = function (objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions) {
            return __awaiter(this, void 0, void 0, function () {
                var errors;
                return __generator(this, function (_a) {
                    switch (_a.label) {
                        case 0: return [4 /*yield*/, this.coreValidate(objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions)];
                        case 1:
                            errors = _a.sent();
                            if (errors.length)
                                return [2 /*return*/, Promise.reject(errors)];
                            return [2 /*return*/];
                    }
                });
            });
        };
        /**
         * Performs validation of the given object based on decorators or validation schema.
         */
        Validator.prototype.validateSync = function (objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions) {
            var object = typeof objectOrSchemaName === 'string' ? objectOrValidationOptions : objectOrSchemaName;
            var options = typeof objectOrSchemaName === 'string' ? maybeValidatorOptions : objectOrValidationOptions;
            var schema = typeof objectOrSchemaName === 'string' ? objectOrSchemaName : undefined;
            var executor = new ValidationExecutor(this, options);
            executor.ignoreAsyncValidations = true;
            var validationErrors = [];
            executor.execute(object, schema, validationErrors);
            return executor.stripEmptyErrors(validationErrors);
        };
        // -------------------------------------------------------------------------
        // Private Properties
        // -------------------------------------------------------------------------
        /**
         * Performs validation of the given object based on decorators or validation schema.
         * Common method for `validateOrReject` and `validate` methods.
         */
        Validator.prototype.coreValidate = function (objectOrSchemaName, objectOrValidationOptions, maybeValidatorOptions) {
            var object = typeof objectOrSchemaName === 'string' ? objectOrValidationOptions : objectOrSchemaName;
            var options = typeof objectOrSchemaName === 'string' ? maybeValidatorOptions : objectOrValidationOptions;
            var schema = typeof objectOrSchemaName === 'string' ? objectOrSchemaName : undefined;
            var executor = new ValidationExecutor(this, options);
            var validationErrors = [];
            executor.execute(object, schema, validationErrors);
            return Promise.all(executor.awaitingPromises).then(function () {
                return executor.stripEmptyErrors(validationErrors);
            });
        };
        return Validator;
    }());

    /**
     * Container to be used by this library for inversion control. If container was not implicitly set then by default
     * container simply creates a new instance of the given class.
     */
    var defaultContainer = new (/** @class */ (function () {
        function class_1() {
            this.instances = [];
        }
        class_1.prototype.get = function (someClass) {
            var instance = this.instances.find(function (instance) { return instance.type === someClass; });
            if (!instance) {
                instance = { type: someClass, object: new someClass() };
                this.instances.push(instance);
            }
            return instance.object;
        };
        return class_1;
    }()))();
    /**
     * Gets the IOC container used by this library.
     */
    function getFromContainer(someClass) {
        return defaultContainer.get(someClass);
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    /**
     * Validates given object by object's decorators or given validation schema.
     */
    function validate(schemaNameOrObject, objectOrValidationOptions, maybeValidatorOptions) {
        if (typeof schemaNameOrObject === 'string') {
            return getFromContainer(Validator).validate(schemaNameOrObject, objectOrValidationOptions, maybeValidatorOptions);
        }
        else {
            return getFromContainer(Validator).validate(schemaNameOrObject, objectOrValidationOptions);
        }
    }
    /**
     * Validates given object by object's decorators or given validation schema and reject on error.
     */
    function validateOrReject(schemaNameOrObject, objectOrValidationOptions, maybeValidatorOptions) {
        if (typeof schemaNameOrObject === 'string') {
            return getFromContainer(Validator).validateOrReject(schemaNameOrObject, objectOrValidationOptions, maybeValidatorOptions);
        }
        else {
            return getFromContainer(Validator).validateOrReject(schemaNameOrObject, objectOrValidationOptions);
        }
    }

    /**
     * Determines which events to validate/clear validation, on.
     */
    class OnEvents {
        constructor(eventsOn = true, init) {
            this.input = true;
            this.change = true;
            this.blur = true;
            this.focus = true;
            this.mount = false;
            this.submit = true;
            Object.assign(this, init);
            // If eventsOn is false, turn off all event listeners
            if (!eventsOn) {
                Object.keys(this).forEach((key) => {
                    this[key] = false;
                });
            }
        }
    }
    exports.LinkOnEvent = void 0;
    (function (LinkOnEvent) {
        LinkOnEvent[LinkOnEvent["Always"] = 0] = "Always";
        LinkOnEvent[LinkOnEvent["Valid"] = 1] = "Valid";
    })(exports.LinkOnEvent || (exports.LinkOnEvent = {}));
    /**
     * Formvana - Form Class
     * Form is NOT valid, initially.
     *
     * Recommended Use:
     *  - Initialize new Form({model: ..., refs: ..., template: ..., etc.})
     *  - Set the model (if you didn't in the previous step)
     *  - (optionally) attach reference data
     *  - call form.storify() -  const { subscribe, update } = form.storify();
     *  - Now you're ready to use the form!
     *
     * Performance is blazing with < 500 fields.
     * Can render up to 2000 inputs in one class.
     *  - Tested on late 2014 mbp - 2.5ghz core i7, 16gb ram
     *
     */
    class Form {
        constructor(init) {
            /**
             * This is the model's initial state.
             */
            this.initial_state = null;
            this.initial_errors = null;
            this.non_required_fields = [];
            /**
             * Validation options come from class-validator ValidatorOptions.
             *
             * Biggest perf increase comes from setting validationError.target = false
             * (so the whole model is not attached to each error message)
             */
            this.validation_options = {
                skipMissingProperties: false,
                whitelist: false,
                forbidNonWhitelisted: false,
                dismissDefaultMessages: false,
                groups: [],
                validationError: {
                    target: false,
                    value: false,
                },
                forbidUnknownValues: true,
                stopAtFirstError: false,
            };
            /**
             * This is your form Model/Schema.
             *
             * (If you did not set the model in constructor)
             * When model is set, call buildFields() to build the fields.
             */
            this.model = null;
            /**
             * Fields are built from the model's metadata using reflection.
             * If model is set, call buildFields().
             */
            this.fields = [];
            /**
             * refs hold any reference data you'll be using in the form
             * e.g. seclet dropdowns, radio buttons, etc.
             *
             * (If you did not set the model in constructor)
             * Call attachRefData() to link the data to the respective field
             *
             * * Fields & reference data are linked via field.ref_key
             */
            this.refs = null;
            // Order within array determines order to be applied
            this.classes = [];
            /**
             * Determines the ordering of this.fields.
             * Simply an array of field names (or group names or stepper names)
             * in the order to be displayed
             */
            this.field_order = [];
            /**
             * Form Template Layout
             *
             * Render the form into a custom svelte template!
             * Use a svelte component.
             * * The component/template must accept {form} prop
             *
             * Note: add ` types": ["svelte"] ` to tsconfig compilerOptions
             * to remove TS import error of .svelte files (for your template)
             */
            this.template = null;
            /**
             * this.valid is a "store" so we can change the state of the variable
             * inside of the class and it (the change) be reflected outside
             * in the form context.
             */
            this.valid = writable(false);
            this.errors = [];
            this.loading = writable(false);
            this.changed = writable(false);
            this.touched = writable(false);
            this.validate_on_events = new OnEvents();
            this.clear_errors_on_events = new OnEvents(false);
            // When to link field.values to model.values
            this.link_fields_to_model = exports.LinkOnEvent.Always;
            /**
             * * Here be Functions. Beware.
             * * Here be Functions. Beware.
             * * Here be Functions. Beware.
             */
            //#region FUNCTIONS
            /**
             * Build the field configs from the given model using metadata-reflection.
             */
            this.buildFields = () => {
                if (this.model) {
                    // Grab the editableProperties from the @editable decorator
                    let props = Reflect.getMetadata("editableProperties", this.model);
                    // Map the @editable fields to the form.fields array.
                    this.fields = props.map((prop) => {
                        // Get the FieldConfig using metadata reflection
                        const config = Reflect.getMetadata("fieldConfig", this.model, prop);
                        //! SET THE NAME OF THE FIELD!
                        config.name = prop;
                        // If the model has a value, attach it to the field config
                        // 0, "", [], etc. are set in the constructor based on type.
                        if (this.model[prop]) {
                            config.value.set(this.model[prop]);
                        }
                        if (!config.required) {
                            this.non_required_fields.push(config.name);
                        }
                        // console.log("FIELD CONFIG: ", config);
                        // Return the enriched field config
                        return config;
                    });
                }
            };
            /**
             * Set the field order.
             * Layout param is simply an array of field (or group)
             * names in the order to be displayed.
             * Leftover fields are appended to bottom of form.
             */
            this.setOrder = (order) => {
                this.field_order = order;
                this.createOrder();
            };
            this.createOrder = () => {
                let fields = [];
                let leftovers = [];
                // Loop over the order...
                this.field_order.forEach((item) => {
                    // and the fields...
                    this.fields.forEach((field) => {
                        // If the field.name and the order name match...
                        if (field.name === item ||
                            (field.group && field.group.name === item) ||
                            (field.step && `${field.step.index}` === item)) {
                            // Then push it to the fields array
                            fields.push(field);
                        }
                        else if (leftovers.indexOf(field) === -1 &&
                            this.field_order.indexOf(field.name) === -1) {
                            // Field is not in the order, so push it to bottom of order.
                            leftovers.push(field);
                        }
                    });
                });
                this.fields = [...fields, ...leftovers];
            };
            /**
             * * Use this if you're trying to update the layout after initialization
             * Like this:
             * const layout = ["description", "status", "email", "name"];
             * const newState = sget(formState).buildStoredLayout(formState, layout);
             * formState.updateState({ ...newState });
             */
            this.buildStoredLayout = (formState, order) => {
                let fields = [];
                let leftovers = [];
                // Update the order
                formState.update((state) => (state.field_order = order));
                // Get the Form state
                const state = get_store_value(formState);
                state.field_order.forEach((item) => {
                    state.fields.forEach((field) => {
                        if (field.name === item ||
                            (field.group && field.group.name === item) ||
                            (field.step && `${field.step.index}` === item)) {
                            fields.push(field);
                        }
                        else if (leftovers.indexOf(field) === -1 &&
                            state.field_order.indexOf(field.name) === -1) {
                            leftovers.push(field);
                        }
                    });
                });
                state.fields = [...fields, ...leftovers];
                return state;
            };
            /**
             * This is for Svelte's "use:FUNCTION" feature.
             * The "use" directive passes the HTML Node as a parameter
             * to the given function (e.g. use:useField(node: HTMLNode)).
             *
             * This hooks up the event listeners!
             */
            this.useField = (node) => {
                // Attach HTML Node to field so we can remove event listeners later
                this.fields.forEach((field) => {
                    //@ts-ignore
                    if (field.name === node.name) {
                        field.node = node;
                    }
                });
                this.handleOnValidateEvents(node);
                this.handleOnClearErrorEvents(node);
            };
            /**
             * Validate the field!
             * This should be attached to the field via the useField method.
             */
            this.validateField = (field) => {
                // Link the input from the field to the model.
                // this.link_fields_to_model === LinkOnEvent.Always &&
                //   this.linkFieldValue(field);
                this.link_fields_to_model === exports.LinkOnEvent.Always && this.linkValues(true);
                // Return class-validator validate function.
                // Validate the model with given validation config.
                return validate(this.model, this.validation_options).then((errors) => {
                    this.handleValidation(true, errors, field);
                });
            };
            // Validate the form!
            this.validate = () => {
                this.clearErrors();
                // Link the input from the field to the model.
                this.link_fields_to_model === exports.LinkOnEvent.Always && this.linkValues(true);
                return validate(this.model, this.validation_options).then((errors) => {
                    this.handleValidation(false, errors);
                    return errors;
                });
            };
            this.validateAsync = async () => {
                this.clearErrors();
                this.link_fields_to_model === exports.LinkOnEvent.Always && this.linkValues(true);
                try {
                    return await validateOrReject(this.model, this.validation_options);
                }
                catch (errors) {
                    this.handleValidation(false, errors);
                    console.log("Errors: ", errors);
                    return errors;
                }
            };
            this.loadData = (data) => {
                this.model = data;
                this.updateInitialState();
                this.buildFields();
                return this;
            };
            /**
             * Just pass in the reference data and let the field configs do the rest.
             *
             * * Ref data must be in format: Record<string, RefDataItem[]>
             */
            this.attachRefData = (refs) => {
                const fields_with_ref_keys = this.fields.filter((f) => f.ref_key);
                if (refs) {
                    fields_with_ref_keys.forEach((field) => {
                        field.options = refs[field.ref_key];
                    });
                }
                else if (this.refs) {
                    fields_with_ref_keys.forEach((field) => {
                        field.options = this.refs[field.ref_key];
                    });
                }
            };
            /**
             * Generate a Svelte Store from the current "this"
             */
            this.storify = () => {
                return writable(this);
            };
            this.updateInitialState = () => {
                this.initial_state = JSON.parse(JSON.stringify(this.model));
                this.initial_errors = JSON.stringify(this.errors);
                // this.initial_errors = Array.from(this.errors);
                this.changed.set(false);
            };
            this.clearErrors = () => {
                this.errors = [];
                this.fields.forEach((field) => {
                    field.errors.set(null);
                });
            };
            // Resets to the inital state of the form.
            this.reset = () => {
                this.valid.set(false);
                this.changed.set(false);
                this.touched.set(false);
                this.loading.set(false);
                Object.keys(this.model).forEach((key) => {
                    this.model[key] = this.initial_state[key];
                });
                this.linkValues(false);
                // If the initial state has errors, add them to
                this.clearErrors();
                const errs = JSON.parse(this.initial_errors);
                if (errs && errs.length > 0) {
                    errs.forEach((e) => {
                        const val_err = new ValidationError();
                        Object.assign(val_err, e);
                        this.errors.push(val_err);
                    });
                    this.linkErrors(this.errors);
                }
                // if (this.initial_errors && this.initial_errors.length > 0) {
                //   this.errors = Array.from(this.initial_errors);
                // }else {
                //   this.clearErrors();
                // }
            };
            /**
             *! Make sure to call this when the component is unloaded/destroyed
             */
            this.destroy = () => {
                if (this.fields && this.fields.length > 0) {
                    // For each field...
                    this.fields.forEach((f) => {
                        // Remove all the event listeners!
                        Object.keys(this.validate_on_events).forEach((key) => {
                            f.node.removeEventListener(key, (ev) => {
                                this.validateField(f);
                            });
                        });
                        Object.keys(this.clear_errors_on_events).forEach((key) => {
                            f.node.removeEventListener(key, (ev) => {
                                this.clearFieldErrors(f.name);
                            });
                        });
                    });
                }
                // Reset everything else.
                this.reset();
            };
            // #region PRIVATE FUNCTIONS
            /**
             * TODO: Speed this bad boy up. There are optimizations to be had.
             * ... but it's already pretty speedy.
             * Check if there are any required fields in the errors.
             * If there are no required fields in the errors, the form is valid
             */
            this.nonRequiredFieldsValid = (errors) => {
                if (errors.length === 0)
                    return true;
                // Go ahead and return if there are no errors
                let i = 0, len = this.non_required_fields.length;
                // If there are no required fields, just go ahead and return
                if (len === 0)
                    return true;
                const errs = errors.map((e) => e.property);
                for (; len > i; ++i) {
                    if (errs.includes(this.non_required_fields[i])) {
                        return false;
                    }
                }
                return true;
            };
            this.handleValidation = (isField = true, errors, field) => {
                // Non required fields valid (nrfv)
                const nrfv = this.nonRequiredFieldsValid(errors);
                // There are errors!
                if (errors.length > 0 || !nrfv) {
                    this.valid.set(false);
                    this.errors = errors;
                    // console.log("ERRORS: ", errors);
                    // Are we validating the whole form or just the fields?
                    if (isField) {
                        // Link errors to field (to show validation errors)
                        this.linkFieldErrors(errors, field);
                    }
                    else {
                        // This is validatino for the whole form!
                        this.linkErrors(errors);
                    }
                }
                else {
                    // If the config tells us to link the values only when the form
                    // is valid, then link them here.
                    this.link_fields_to_model === exports.LinkOnEvent.Valid && this.linkValues(true);
                    this.valid.set(true); // Form is valid!
                    this.clearErrors(); // Clear form errors
                }
                // Check for changes
                this.hasChanged();
            };
            // Link values from FIELDS toMODEL or MODEL to FIELDS
            this.linkValues = (toModel) => {
                let i = 0, len = this.fields.length;
                for (; len > i; ++i) {
                    const name = this.fields[i].name, val = this.fields[i].value;
                    if (toModel) {
                        // Link field values to the model
                        this.model[name] = get_store_value(val);
                    }
                    else {
                        // Link model values to the fields
                        val.set(this.model[name]);
                    }
                }
            };
            // Here in case we need better performance.
            this.linkFieldValue = (field) => {
                this.model[field.name] = get_store_value(field.value);
            };
            /**
             * TODO: Might better way to do comparison than Object.is() and JSON.stringify()
             * TODO: Be my guest to fix it if you know how.
             * But... I've tested it with 1000 fields with minimal input lag.
             */
            this.hasChanged = () => {
                if (Object.is(this.model, this.initial_state) &&
                    JSON.stringify(this.errors) === this.initial_errors) {
                    this.changed.set(false);
                    return;
                }
                this.changed.set(true);
            };
            this.linkFieldErrors = (errors, field) => {
                const error = errors.filter((e) => e.property === field.name);
                // Check if there's an error for the field
                if (error && error.length > 0) {
                    field.errors.set(error[0]);
                }
                else {
                    field.errors.set(null);
                }
            };
            this.linkErrors = (errors) => {
                errors.forEach((err) => {
                    this.fields.forEach((field) => {
                        if (err.property === field.name) {
                            field.errors.set(err);
                        }
                    });
                });
            };
            this.clearFieldErrors = (name) => {
                this.fields.forEach((field) => {
                    if (field.name === name) {
                        field.errors.set(null);
                    }
                });
            };
            this.handleOnValidateEvents = (node) => {
                // Get the field, for passing to the validateField func
                //@ts-ignore
                const field = this.fields.filter((f) => f.name === node.name)[0];
                Object.entries(this.validate_on_events).forEach(([key, val]) => {
                    // If the OnEvent is true, then add the event listener
                    // If the field has options, we can assume it will use the change event listener
                    if (field.options) {
                        // so don't add the input event listener
                        if (val && val !== "input") {
                            node.addEventListener(key, (ev) => {
                                this.validateField(field);
                            }, false);
                        }
                    }
                    // Else, we can assume it will use the input event listener
                    // * This may be changed in the future
                    else {
                        // and don't add the change event listener
                        if (val && val !== "change") {
                            node.addEventListener(key, (ev) => {
                                this.validateField(field);
                            }, false);
                        }
                    }
                });
            };
            this.handleOnClearErrorEvents = (node) => {
                Object.entries(this.clear_errors_on_events).forEach(([key, val]) => {
                    // If the OnEvent is true, then add the event listener
                    if (val) {
                        node.addEventListener(key, (ev) => {
                            this.clearFieldErrors(node.name);
                        });
                    }
                });
            };
            Object.keys(this).forEach((key) => {
                if (init[key]) {
                    this[key] = init[key];
                }
            });
            if (this.model) {
                /**
                 * This is the best method for reliable deep-ish cloning that i've found.
                 * If you know a BETTER way, be my guest.
                 */
                this.initial_state = JSON.parse(JSON.stringify(this.model));
                this.initial_errors = JSON.stringify(this.errors);
                // this.initial_errors = Array.from(this.errors);
                this.buildFields();
            }
            if (this.field_order && this.field_order.length > 0) {
                this.setOrder(this.field_order);
            }
            if (this.refs) {
                this.attachRefData();
            }
        }
    }

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

    function editable(target, propertyKey) {
        let properties = Reflect.getMetadata("editableProperties", target) || [];
        if (properties.indexOf(propertyKey) < 0) {
            properties.push(propertyKey);
        }
        Reflect.defineMetadata("editableProperties", properties, target);
    }
    function field(config) {
        return function (target, propertyKey) {
            Reflect.defineMetadata("fieldConfig", config, target, propertyKey);
        };
    }

    exports.FieldConfig = FieldConfig;
    exports.Form = Form;
    exports.OnEvents = OnEvents;
    exports.editable = editable;
    exports.field = field;

    Object.defineProperty(exports, '__esModule', { value: true });

})));
//# sourceMappingURL=index.js.map
