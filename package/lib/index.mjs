import"svelte";function t(){}function e(e){let i;return function(e,...i){if(null==e)return t;const n=e.subscribe(...i);return n.unsubscribe?()=>n.unsubscribe():n}(e,(t=>i=t))(),i}const i=[];function n(e,n=t){let r;const s=[];function o(t){if(o=t,((n=e)!=n?o==o:n!==o||n&&"object"==typeof n||"function"==typeof n)&&(e=t,r)){const t=!i.length;for(let t=0;t<s.length;t+=1){const n=s[t];n[1](),i.push(n,e)}if(t){for(let t=0;t<i.length;t+=2)i[t][0](i[t+1]);i.length=0}}var n,o}return{set:o,update:function(t){o(t(e))},subscribe:function(i,a=t){const u=[i,a];return s.push(u),1===s.length&&(r=n(o)||t),i(e),()=>{const t=s.indexOf(u);-1!==t&&s.splice(t,1),0===s.length&&(r(),r=null)}}}}class r{constructor(t){switch(this.type="text",this.required=!1,this.value=n(null),this.disabled=!1,this.hidden=!1,this.errors=n(null),this.attributes={},this.clearValue=()=>{this.value.set(null)},this.clearErrors=()=>{this.errors.set(null)},this.clear=()=>{this.clearValue(),this.clearErrors()},Object.assign(this,t),this.attributes.type=this.attributes.type?this.attributes.type:this.type,this.type){case"text":this.value.set("");break;case"decimal":case"number":this.value.set(0);break;case"boolean":this.value.set(!1),this.options=[];break;case"select":this.options=[];break;default:this.value.set(void 0)}!this.attributes["aria-label"]&&this.attributes.title?this.attributes["aria-label"]=this.attributes.title:this.attributes["aria-label"]||(this.attributes["aria-label"]=this.label||this.name)}}var s=function(t){this.groups=[],this.each=!1,this.context=void 0,this.type=t.type,this.target=t.target,this.propertyName=t.propertyName,this.constraints=t.constraints,this.constraintCls=t.constraintCls,this.validationTypeOptions=t.validationTypeOptions,t.validationOptions&&(this.message=t.validationOptions.message,this.groups=t.validationOptions.groups,this.always=t.validationOptions.always,this.each=t.validationOptions.each,this.context=t.validationOptions.context)},o=function(){function t(){}return t.prototype.transform=function(t){var e=[];return Object.keys(t.properties).forEach((function(i){t.properties[i].forEach((function(n){var r={message:n.message,groups:n.groups,always:n.always,each:n.each},o={type:n.type,target:t.name,propertyName:i,constraints:n.constraints,validationTypeOptions:n.options,validationOptions:r};e.push(new s(o))}))})),e},t}();function a(){return"undefined"!=typeof globalThis?globalThis:"undefined"!=typeof global?global:"undefined"!=typeof window?window:"undefined"!=typeof self?self:void 0}function u(t){return null!==t&&"object"==typeof t&&"function"==typeof t.then}var l=function(){function t(){this.validationMetadatas=[],this.constraintMetadatas=[]}return Object.defineProperty(t.prototype,"hasValidationMetaData",{get:function(){return!!this.validationMetadatas.length},enumerable:!1,configurable:!0}),t.prototype.addValidationSchema=function(t){var e=this;(new o).transform(t).forEach((function(t){return e.addValidationMetadata(t)}))},t.prototype.addValidationMetadata=function(t){this.validationMetadatas.push(t)},t.prototype.addConstraintMetadata=function(t){this.constraintMetadatas.push(t)},t.prototype.groupByPropertyName=function(t){var e={};return t.forEach((function(t){e[t.propertyName]||(e[t.propertyName]=[]),e[t.propertyName].push(t)})),e},t.prototype.getTargetValidationMetadatas=function(t,e,i,n,r){var s=function(t){return void 0!==t.always?t.always:(!t.groups||!t.groups.length)&&i},o=function(t){return!(!n||r&&r.length||!t.groups||!t.groups.length)},a=this.validationMetadatas.filter((function(i){return(i.target===t||i.target===e)&&(!!s(i)||!o(i)&&(!(r&&r.length>0)||i.groups&&!!i.groups.find((function(t){return-1!==r.indexOf(t)}))))})),u=this.validationMetadatas.filter((function(e){return"string"!=typeof e.target&&(e.target!==t&&((!(e.target instanceof Function)||t.prototype instanceof e.target)&&(!!s(e)||!o(e)&&(!(r&&r.length>0)||e.groups&&!!e.groups.find((function(t){return-1!==r.indexOf(t)}))))))})).filter((function(t){return!a.find((function(e){return e.propertyName===t.propertyName&&e.type===t.type}))}));return a.concat(u)},t.prototype.getTargetValidatorConstraints=function(t){return this.constraintMetadatas.filter((function(e){return e.target===t}))},t}();var c=function(){function t(){}return t.prototype.toString=function(t,e,i){var n=this;void 0===t&&(t=!1),void 0===e&&(e=!1),void 0===i&&(i="");var r=t?"[1m":"",s=t?"[22m":"",o=function(t){return" - property "+r+i+t+s+" has failed the following constraints: "+r+Object.keys(n.constraints).join(", ")+s+" \n"};if(e){var a=Number.isInteger(+this.property)?"["+this.property+"]":(i?".":"")+this.property;return this.constraints?o(a):this.children?this.children.map((function(e){return e.toString(t,!0,""+i+a)})).join(""):""}return"An instance of "+r+(this.target?this.target.constructor.name:"an object")+s+" has failed the validation:\n"+(this.constraints?o(this.property):"")+(this.children?this.children.map((function(e){return e.toString(t,!0,n.property)})).join(""):"")},t}(),f=function(){function t(){}return t.isValid=function(t){var e=this;return"isValid"!==t&&"getMessage"!==t&&-1!==Object.keys(this).map((function(t){return e[t]})).indexOf(t)},t.CUSTOM_VALIDATION="customValidation",t.NESTED_VALIDATION="nestedValidation",t.PROMISE_VALIDATION="promiseValidation",t.CONDITIONAL_VALIDATION="conditionalValidation",t.WHITELIST="whitelistValidation",t.IS_DEFINED="isDefined",t}();var h=function(){function t(){}return t.replaceMessageSpecialTokens=function(t,e){var i;return t instanceof Function?i=t(e):"string"==typeof t&&(i=t),i&&e.constraints instanceof Array&&e.constraints.forEach((function(t,e){i=i.replace(new RegExp("\\$constraint"+(e+1),"g"),function(t){return Array.isArray(t)?t.join(", "):""+t}(t))})),i&&void 0!==e.value&&null!==e.value&&"string"==typeof e.value&&(i=i.replace(/\$value/g,e.value)),i&&(i=i.replace(/\$property/g,e.property)),i&&(i=i.replace(/\$target/g,e.targetName)),i},t}(),d=function(){function t(t,e){this.validator=t,this.validatorOptions=e,this.awaitingPromises=[],this.ignoreAsyncValidations=!1,this.metadataStorage=function(){var t=a();return t.classValidatorMetadataStorage||(t.classValidatorMetadataStorage=new l),t.classValidatorMetadataStorage}()}return t.prototype.execute=function(t,e,i){var n,r=this;this.metadataStorage.hasValidationMetaData||!0!==(null===(n=this.validatorOptions)||void 0===n?void 0:n.enableDebugMessages)||console.warn("No metadata found. There is more than once class-validator version installed probably. You need to flatten your dependencies.");var s=this.validatorOptions?this.validatorOptions.groups:void 0,o=this.validatorOptions&&this.validatorOptions.strictGroups||!1,a=this.validatorOptions&&this.validatorOptions.always||!1,u=this.metadataStorage.getTargetValidationMetadatas(t.constructor,e,a,o,s),l=this.metadataStorage.groupByPropertyName(u);if(this.validatorOptions&&this.validatorOptions.forbidUnknownValues&&!u.length){var h=new c;return this.validatorOptions&&this.validatorOptions.validationError&&void 0!==this.validatorOptions.validationError.target&&!0!==this.validatorOptions.validationError.target||(h.target=t),h.value=void 0,h.property=void 0,h.children=[],h.constraints={unknownValue:"an unknown value was passed to the validate function"},void i.push(h)}this.validatorOptions&&this.validatorOptions.whitelist&&this.whitelist(t,l,i),Object.keys(l).forEach((function(e){var n=t[e],s=l[e].filter((function(t){return t.type===f.IS_DEFINED})),o=l[e].filter((function(t){return t.type!==f.IS_DEFINED&&t.type!==f.WHITELIST}));n instanceof Promise&&o.find((function(t){return t.type===f.PROMISE_VALIDATION}))?r.awaitingPromises.push(n.then((function(n){r.performValidations(t,n,e,s,o,i)}))):r.performValidations(t,n,e,s,o,i)}))},t.prototype.whitelist=function(t,e,i){var n=this,r=[];Object.keys(t).forEach((function(t){e[t]&&0!==e[t].length||r.push(t)})),r.length>0&&(this.validatorOptions&&this.validatorOptions.forbidNonWhitelisted?r.forEach((function(e){var r,s=n.generateValidationError(t,t[e],e);s.constraints=((r={})[f.WHITELIST]="property "+e+" should not exist",r),s.children=void 0,i.push(s)})):r.forEach((function(e){return delete t[e]})))},t.prototype.stripEmptyErrors=function(t){var e=this;return t.filter((function(t){if(t.children&&(t.children=e.stripEmptyErrors(t.children)),0===Object.keys(t.constraints).length){if(0===t.children.length)return!1;delete t.constraints}return!0}))},t.prototype.performValidations=function(t,e,i,n,r,s){var o=r.filter((function(t){return t.type===f.CUSTOM_VALIDATION})),a=r.filter((function(t){return t.type===f.NESTED_VALIDATION})),u=r.filter((function(t){return t.type===f.CONDITIONAL_VALIDATION})),l=this.generateValidationError(t,e,i);s.push(l),this.conditionalValidations(t,e,u)&&(this.customValidations(t,e,n,l),this.mapContexts(t,e,n,l),void 0===e&&this.validatorOptions&&!0===this.validatorOptions.skipUndefinedProperties||null===e&&this.validatorOptions&&!0===this.validatorOptions.skipNullProperties||null==e&&this.validatorOptions&&!0===this.validatorOptions.skipMissingProperties||(this.customValidations(t,e,o,l),this.nestedValidations(e,a,l.children),this.mapContexts(t,e,r,l),this.mapContexts(t,e,o,l)))},t.prototype.generateValidationError=function(t,e,i){var n=new c;return this.validatorOptions&&this.validatorOptions.validationError&&void 0!==this.validatorOptions.validationError.target&&!0!==this.validatorOptions.validationError.target||(n.target=t),this.validatorOptions&&this.validatorOptions.validationError&&void 0!==this.validatorOptions.validationError.value&&!0!==this.validatorOptions.validationError.value||(n.value=e),n.property=i,n.children=[],n.constraints={},n},t.prototype.conditionalValidations=function(t,e,i){return i.map((function(i){return i.constraints[0](t,e)})).reduce((function(t,e){return t&&e}),!0)},t.prototype.customValidations=function(t,e,i,n){var r=this;i.forEach((function(i){r.metadataStorage.getTargetValidatorConstraints(i.constraintCls).forEach((function(s){if(!(s.async&&r.ignoreAsyncValidations||r.validatorOptions&&r.validatorOptions.stopAtFirstError&&Object.keys(n.constraints||{}).length>0)){var o={targetName:t.constructor?t.constructor.name:void 0,property:i.propertyName,object:t,value:e,constraints:i.constraints};if(i.each&&(e instanceof Array||e instanceof Set||e instanceof Map)){var a,l=((a=e)instanceof Map?Array.from(a.values()):Array.isArray(a)?a:Array.from(a)).map((function(t){return s.instance.validate(t,o)}));if(l.some((function(t){return u(t)}))){var c=l.map((function(t){return u(t)?t:Promise.resolve(t)})),f=Promise.all(c).then((function(o){if(!o.every((function(t){return t}))){var a=r.createValidationError(t,e,i,s),u=a[0],l=a[1];n.constraints[u]=l,i.context&&(n.contexts||(n.contexts={}),n.contexts[u]=Object.assign(n.contexts[u]||{},i.context))}}));r.awaitingPromises.push(f)}else{if(!l.every((function(t){return t}))){var h=r.createValidationError(t,e,i,s);v=h[0],g=h[1];n.constraints[v]=g}}}else{var d=s.instance.validate(e,o);if(u(d)){var p=d.then((function(o){if(!o){var a=r.createValidationError(t,e,i,s),u=a[0],l=a[1];n.constraints[u]=l,i.context&&(n.contexts||(n.contexts={}),n.contexts[u]=Object.assign(n.contexts[u]||{},i.context))}}));r.awaitingPromises.push(p)}else if(!d){var y=r.createValidationError(t,e,i,s),v=y[0],g=y[1];n.constraints[v]=g}}}}))}))},t.prototype.nestedValidations=function(t,e,i){var n=this;void 0!==t&&e.forEach((function(r){var s;if(r.type===f.NESTED_VALIDATION||r.type===f.PROMISE_VALIDATION)if(t instanceof Array||t instanceof Set||t instanceof Map)(t instanceof Set?Array.from(t):t).forEach((function(r,s){n.performValidations(t,r,s.toString(),[],e,i)}));else if(t instanceof Object){var o="string"==typeof r.target?r.target:r.target.name;n.execute(t,o,i)}else{var a=new c;a.value=t,a.property=r.propertyName,a.target=r.target;var u=n.createValidationError(r.target,t,r),l=u[0],h=u[1];a.constraints=((s={})[l]=h,s),i.push(a)}}))},t.prototype.mapContexts=function(t,e,i,n){var r=this;return i.forEach((function(t){if(t.context){var e=void 0;if(t.type===f.CUSTOM_VALIDATION)e=r.metadataStorage.getTargetValidatorConstraints(t.constraintCls)[0];var i=r.getConstraintType(t,e);n.constraints[i]&&(n.contexts||(n.contexts={}),n.contexts[i]=Object.assign(n.contexts[i]||{},t.context))}}))},t.prototype.createValidationError=function(t,e,i,n){var r=t.constructor?t.constructor.name:void 0,s=this.getConstraintType(i,n),o={targetName:r,property:i.propertyName,object:t,value:e,constraints:i.constraints},a=i.message||"";return i.message||this.validatorOptions&&(!this.validatorOptions||this.validatorOptions.dismissDefaultMessages)||n&&n.instance.defaultMessage instanceof Function&&(a=n.instance.defaultMessage(o)),[s,h.replaceMessageSpecialTokens(a,o)]},t.prototype.getConstraintType=function(t,e){return e&&e.name?e.name:t.type},t}(),p=function(t,e,i,n){return new(i||(i=Promise))((function(r,s){function o(t){try{u(n.next(t))}catch(t){s(t)}}function a(t){try{u(n.throw(t))}catch(t){s(t)}}function u(t){var e;t.done?r(t.value):(e=t.value,e instanceof i?e:new i((function(t){t(e)}))).then(o,a)}u((n=n.apply(t,e||[])).next())}))},y=function(t,e){var i,n,r,s,o={label:0,sent:function(){if(1&r[0])throw r[1];return r[1]},trys:[],ops:[]};return s={next:a(0),throw:a(1),return:a(2)},"function"==typeof Symbol&&(s[Symbol.iterator]=function(){return this}),s;function a(s){return function(a){return function(s){if(i)throw new TypeError("Generator is already executing.");for(;o;)try{if(i=1,n&&(r=2&s[0]?n.return:s[0]?n.throw||((r=n.return)&&r.call(n),0):n.next)&&!(r=r.call(n,s[1])).done)return r;switch(n=0,r&&(s=[2&s[0],r.value]),s[0]){case 0:case 1:r=s;break;case 4:return o.label++,{value:s[1],done:!1};case 5:o.label++,n=s[1],s=[0];continue;case 7:s=o.ops.pop(),o.trys.pop();continue;default:if(!(r=o.trys,(r=r.length>0&&r[r.length-1])||6!==s[0]&&2!==s[0])){o=0;continue}if(3===s[0]&&(!r||s[1]>r[0]&&s[1]<r[3])){o.label=s[1];break}if(6===s[0]&&o.label<r[1]){o.label=r[1],r=s;break}if(r&&o.label<r[2]){o.label=r[2],o.ops.push(s);break}r[2]&&o.ops.pop(),o.trys.pop();continue}s=e.call(t,o)}catch(t){s=[6,t],n=0}finally{i=r=0}if(5&s[0])throw s[1];return{value:s[0]?s[1]:void 0,done:!0}}([s,a])}}},v=function(){function t(){}return t.prototype.validate=function(t,e,i){return this.coreValidate(t,e,i)},t.prototype.validateOrReject=function(t,e,i){return p(this,void 0,void 0,(function(){var n;return y(this,(function(r){switch(r.label){case 0:return[4,this.coreValidate(t,e,i)];case 1:return(n=r.sent()).length?[2,Promise.reject(n)]:[2]}}))}))},t.prototype.validateSync=function(t,e,i){var n="string"==typeof t?e:t,r="string"==typeof t?t:void 0,s=new d(this,"string"==typeof t?i:e);s.ignoreAsyncValidations=!0;var o=[];return s.execute(n,r,o),s.stripEmptyErrors(o)},t.prototype.coreValidate=function(t,e,i){var n="string"==typeof t?e:t,r="string"==typeof t?t:void 0,s=new d(this,"string"==typeof t?i:e),o=[];return s.execute(n,r,o),Promise.all(s.awaitingPromises).then((function(){return s.stripEmptyErrors(o)}))},t}(),g=new(function(){function t(){this.instances=[]}return t.prototype.get=function(t){var e=this.instances.find((function(e){return e.type===t}));return e||(e={type:t,object:new t},this.instances.push(e)),e.object},t}());function _(t){return g.get(t)}var m,b,w="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};function O(t,e,i){return"string"==typeof t?_(v).validate(t,e,i):_(v).validate(t,e)}class E{constructor(t,e=!1){this.blur=!0,this.change=!0,this.click=!1,this.dblclick=!1,this.focus=!0,this.input=!0,this.keydown=!1,this.keypress=!1,this.keyup=!1,this.mount=!1,this.mousedown=!1,this.mouseenter=!1,this.mouseleave=!1,this.mousemove=!1,this.mouseout=!1,this.mouseover=!1,this.mouseup=!1,this.submit=!0,e&&Object.keys(this).forEach((t=>{this[t]=!1})),Object.assign(this,t)}}function k(t,e){return e.filter((e=>e.name===t))[0]}function T(t){return Reflect.getMetadata("editableProperties",t).map((e=>{const i=new r({...Reflect.getMetadata("fieldConfig",t,e),name:e});return t[e]&&i.value.set(t[e]),i}))}function A(t){let e=[];return t.forEach((t=>{t.required&&e.push(t.name)})),e}function x(t,e,i){Object.entries(e).forEach((([e,n])=>{n&&t.node.addEventListener(e,(t=>i(t)),!1)}))}function V(t,e,i){Object.entries(e).forEach((([e,n])=>{n&&t.addEventListener(e,(t=>i(t)),!1)}))}function M(t,i,n){let r=0,s=i.length;for(;s>r;++r){const s=i[r].name,o=i[r].value;t?n[s]=e(o):o.set(n[s])}}function S(t,e,i){const n=t.filter((t=>t[i]===e.name));n&&n.length>0?e.errors.set(n[0]):e.errors.set(null)}function j(t,e){t.forEach((t=>{k(t.property,e).errors.set(t)}))}function I(t,e,i,n,r,s){return t.link_fields_to_model===m.Always&&M(!0,t.fields,t.model),J(t.hidden_fields,r,t.fields),W(t.disabled_fields,r,t.fields),N(t,s,e).then((()=>{C(t,i,n)}))}function N(t,e,i){return O(t.model,t.validation_options).then((n=>{P(t,n,i,e)}))}async function P(t,e,i,n){try{e.length>0?(t.errors=e,n?S(e,n,"property"):j(e,t.fields),D(e,i)?t.valid.set(!0):t.valid.set(!1)):(t.link_fields_to_model===m.Valid&&M(!0,t.fields,t.model),t.valid.set(!0),t.clearErrors())}catch(t){if(t)throw t}}function D(t,e){if(0===t.length)return!0;let i=0,n=e.length;if(0===n)return!0;const r=t.map((t=>t.property));for(;n>i;++i)if(r.includes(e[i]))return!1;return!0}function L(t,e){let i=0,n=e.length,r={};for(;n>i;++i){const n=e[i];r[n]=t[n]}return JSON.stringify(r)}function C(t,e,i){L(t,e)!==i?t.changed.set(!0):t.changed.set(!1)}function F(t,e,i){t.model=null,t.refs=null,t.template=null}function R(t,i,r,s){i.forEach((i=>{"valid"===i||"touched"===i||"changed"===i?e(t[i])?r[i]=n(!0):r[i]=n(!1):r[i]=JSON.parse(JSON.stringify(t[i])),JSON.stringify(r)}))}function U(t,i,n){i.forEach((i=>{if("valid"===i||"touched"===i||"changed"===i)e(n[i])?t[i].set(!0):t[i].set(!1);else if("errors"===i)t.clearErrors(),t.errors=n.errors.map((t=>{let e=new c;return Object.assign(e,t),e})),t.errors&&t.errors.length>0&&j(t.errors,t.fields);else if("model"===i){const e=JSON.parse(JSON.stringify(n[i]));Object.keys(t[i]).forEach((n=>{t[i][n]=e[n]})),M(!1,t.fields,t.model)}else t[i]=JSON.parse(JSON.stringify(n[i]))}))}function q(t,e){let i=[],n=[];return t.forEach((r=>{const s=k(r,e);s.name===r||s.group&&s.group.name===r||s.step&&`${s.step.index}`===r?i.push(s):-1===n.indexOf(s)&&-1===t.indexOf(s.name)&&n.push(s)})),e=[...i,...n]}function J(t,e,i){let n=0,r=t.length;if(0!==r)for(;r>n;++n){const r=t[n],s=e.indexOf(r);-1!==s&&K(e[s],i)}}function K(t,e){k(t,e).hidden=!0}function W(t,e,i){let n=0,r=t.length;if(0!==r)for(;r>n;++n){const r=t[n],s=e.indexOf(r);-1!==s&&z(e[s],i)}}function z(t,e){const i=k(t,e);i.disabled=!0,i.attributes.disabled=!0}!function(t){t[t.Always=0]="Always",t[t.Valid=1]="Valid"}(m||(m={}));class ${constructor(t,i){if(this.model=null,this.fields=[],this.refs=null,this.validation_options={skipMissingProperties:!1,whitelist:!1,forbidNonWhitelisted:!1,dismissDefaultMessages:!1,groups:[],validationError:{target:!1,value:!1},forbidUnknownValues:!0,stopAtFirstError:!1},this.errors=[],this.valid=n(!1),this.loading=n(!1),this.changed=n(!1),this.touched=n(!1),this.hidden_fields=[],this.disabled_fields=[],this.on_events=new E,this.clear_errors_on_events=new E({},!0),this.link_fields_to_model=m.Always,this.field_order=[],this.template=null,this.field_names=[],this.initial_state={},this.initial_state_str="",this.stateful_items=["valid","touched","changed","errors","required_fields","refs","field_order","model","hidden_fields","disabled_fields"],this.required_fields=[],this.buildFields=(t=this.model)=>{this.fields=T(t),this.field_names=this.fields.map((t=>t.name)),this.required_fields=A(this.fields)},this.useField=t=>{const e=k(t.name,this.fields);e.node=t,x(e,this.on_events,(t=>I(this,this.required_fields,this.stateful_items,this.initial_state_str,this.field_names,e))),V(t,this.clear_errors_on_events,(t=>{e.errors.set(null)}))},this.loadData=(t,e=!0,i=!0)=>(e?(this.model=t,this.buildFields()):(Object.keys(this.model).forEach((e=>{this.model[e]=t[e]})),M(!1,this.fields,this.model)),i&&this.updateInitialState(),this),this.attachRefData=t=>{const e=this.fields.filter((t=>t.ref_key));t?e.forEach((e=>{e.options=t[e.ref_key]})):this.refs&&e.forEach((t=>{t.options=this.refs[t.ref_key]}))},this.addEventListenerToFields=(t,e,i)=>{if(Array.isArray(i)){i.map((t=>k(t,this.fields))).forEach((i=>{i.node.addEventListener(t,(t=>e(t)),!1)}))}else{k(i,this.fields).node.addEventListener(t,(t=>e(t)),!1)}},this.validate=()=>(this.clearErrors(),this.link_fields_to_model===m.Always&&M(!0,this.fields,this.model),J(this.hidden_fields,this.field_names,this.fields),W(this.disabled_fields,this.field_names,this.fields),O(this.model,this.validation_options).then((t=>(P(this,t,this.required_fields),t)))),this.validateAsync=async()=>{this.clearErrors(),this.link_fields_to_model===m.Always&&M(!0,this.fields,this.model),J(this.hidden_fields,this.field_names,this.fields),W(this.disabled_fields,this.field_names,this.fields);try{return await(t=this.model,e=this.validation_options,"string"==typeof t?_(v).validateOrReject(t,e,i):_(v).validateOrReject(t,e))}catch(t){return P(this,t,this.required_fields),t}var t,e,i},this.validateField=(t,i)=>{const n=k(t,this.fields);if(i){const r=new c,s=Object.assign(r,{property:t,value:e(n.value),constraints:[{error:i}]});this.errors.push(s),j(this.errors,this.fields)}else N(this,n,this.required_fields)},this.get=t=>k(t,this.fields),this.storify=()=>n(this),this.clearErrors=()=>{this.errors=[],this.fields.forEach((t=>{t.errors.set(null)}))},this.destroy=()=>{this.fields&&this.fields.length>0&&this.fields.forEach((t=>{Object.keys(this.on_events).forEach((e=>{t.node.removeEventListener(e,(t=>{}))})),Object.keys(this.clear_errors_on_events).forEach((e=>{t.node.removeEventListener(e,(e=>{t.errors.set(null)}))}))})),F(this,this.initial_state,this.required_fields)},this.reset=()=>{U(this,this.stateful_items,this.initial_state)},this.updateInitialState=()=>{R(this,this.stateful_items,this.initial_state,this.initial_state_str),this.changed.set(!1)},this.setOrder=t=>{this.field_order=t,this.fields=q(this.field_order,this.fields)},this.hideFields=t=>{t&&(Array.isArray(t)?this.hidden_fields.push(...t):this.hidden_fields.push(t)),J(this.hidden_fields,this.field_names,this.fields)},this.disableFields=t=>{t&&(Array.isArray(t)?this.disabled_fields.push(...t):this.disabled_fields.push(t)),W(this.disabled_fields,this.field_names,this.fields)},Object.keys(this).forEach((t=>{i[t]&&(this[t]=i[t])})),!t)throw new Error("Model is not valid (falsey). Please pass in a valid (truthy) model.");this.model=t,this.buildFields(),this.field_order&&this.field_order.length>0&&this.setOrder(this.field_order),this.refs&&this.attachRefData(),this.disabled_fields&&this.disabled_fields.length>0&&W(this.disabled_fields,this.field_names,this.fields),this.hidden_fields&&this.hidden_fields.length>0&&J(this.hidden_fields,this.field_names,this.fields),R(this,this.stateful_items,this.initial_state,this.initial_state_str)}}
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
***************************************************************************** */function H(t,e){let i=Reflect.getMetadata("editableProperties",t)||[];i.indexOf(e)<0&&i.push(e),Reflect.defineMetadata("editableProperties",i,t)}function B(t){return function(e,i){Reflect.defineMetadata("fieldConfig",t,e,i)}}!function(t){!function(e){var i="object"==typeof w?w:"object"==typeof self?self:"object"==typeof this?this:Function("return this;")(),n=r(t);function r(t,e){return function(i,n){"function"!=typeof t[i]&&Object.defineProperty(t,i,{configurable:!0,writable:!0,value:n}),e&&e(i,n)}}void 0===i.Reflect?i.Reflect=t:n=r(i.Reflect,n),function(t){var e=Object.prototype.hasOwnProperty,i="function"==typeof Symbol,n=i&&void 0!==Symbol.toPrimitive?Symbol.toPrimitive:"@@toPrimitive",r=i&&void 0!==Symbol.iterator?Symbol.iterator:"@@iterator",s="function"==typeof Object.create,o={__proto__:[]}instanceof Array,a=!s&&!o,u={create:s?function(){return nt(Object.create(null))}:o?function(){return nt({__proto__:null})}:function(){return nt({})},has:a?function(t,i){return e.call(t,i)}:function(t,e){return e in t},get:a?function(t,i){return e.call(t,i)?t[i]:void 0}:function(t,e){return t[e]}},l=Object.getPrototypeOf(Function),c="object"==typeof process&&process.env&&"true"===process.env.REFLECT_METADATA_USE_MAP_POLYFILL,f=c||"function"!=typeof Map||"function"!=typeof Map.prototype.entries?tt():Map,h=c||"function"!=typeof Set||"function"!=typeof Set.prototype.entries?et():Set,d=new(c||"function"!=typeof WeakMap?it():WeakMap);function p(t,e,i,n){if(D(i)){if(!W(t))throw new TypeError;if(!$(e))throw new TypeError;return k(t,e)}if(!W(t))throw new TypeError;if(!F(e))throw new TypeError;if(!F(n)&&!D(n)&&!L(n))throw new TypeError;return L(n)&&(n=void 0),T(t,e,i=K(i),n)}function y(t,e){function i(i,n){if(!F(i))throw new TypeError;if(!D(n)&&!H(n))throw new TypeError;j(t,e,i,n)}return i}function v(t,e,i,n){if(!F(i))throw new TypeError;return D(n)||(n=K(n)),j(t,e,i,n)}function g(t,e,i){if(!F(e))throw new TypeError;return D(i)||(i=K(i)),x(t,e,i)}function _(t,e,i){if(!F(e))throw new TypeError;return D(i)||(i=K(i)),V(t,e,i)}function m(t,e,i){if(!F(e))throw new TypeError;return D(i)||(i=K(i)),M(t,e,i)}function b(t,e,i){if(!F(e))throw new TypeError;return D(i)||(i=K(i)),S(t,e,i)}function w(t,e){if(!F(t))throw new TypeError;return D(e)||(e=K(e)),I(t,e)}function O(t,e){if(!F(t))throw new TypeError;return D(e)||(e=K(e)),N(t,e)}function E(t,e,i){if(!F(e))throw new TypeError;D(i)||(i=K(i));var n=A(e,i,!1);if(D(n))return!1;if(!n.delete(t))return!1;if(n.size>0)return!0;var r=d.get(e);return r.delete(i),r.size>0||d.delete(e),!0}function k(t,e){for(var i=t.length-1;i>=0;--i){var n=(0,t[i])(e);if(!D(n)&&!L(n)){if(!$(n))throw new TypeError;e=n}}return e}function T(t,e,i,n){for(var r=t.length-1;r>=0;--r){var s=(0,t[r])(e,i,n);if(!D(s)&&!L(s)){if(!F(s))throw new TypeError;n=s}}return n}function A(t,e,i){var n=d.get(t);if(D(n)){if(!i)return;n=new f,d.set(t,n)}var r=n.get(e);if(D(r)){if(!i)return;r=new f,n.set(e,r)}return r}function x(t,e,i){if(V(t,e,i))return!0;var n=Z(e);return!L(n)&&x(t,n,i)}function V(t,e,i){var n=A(e,i,!1);return!D(n)&&q(n.has(t))}function M(t,e,i){if(V(t,e,i))return S(t,e,i);var n=Z(e);return L(n)?void 0:M(t,n,i)}function S(t,e,i){var n=A(e,i,!1);if(!D(n))return n.get(t)}function j(t,e,i,n){A(i,n,!0).set(t,e)}function I(t,e){var i=N(t,e),n=Z(t);if(null===n)return i;var r=I(n,e);if(r.length<=0)return i;if(i.length<=0)return r;for(var s=new h,o=[],a=0,u=i;a<u.length;a++){var l=u[a];s.has(l)||(s.add(l),o.push(l))}for(var c=0,f=r;c<f.length;c++){l=f[c];s.has(l)||(s.add(l),o.push(l))}return o}function N(t,e){var i=[],n=A(t,e,!1);if(D(n))return i;for(var r=G(n.keys()),s=0;;){var o=Q(r);if(!o)return i.length=s,i;var a=Y(o);try{i[s]=a}catch(t){try{X(r)}finally{throw t}}s++}}function P(t){if(null===t)return 1;switch(typeof t){case"undefined":return 0;case"boolean":return 2;case"string":return 3;case"symbol":return 4;case"number":return 5;case"object":return null===t?1:6;default:return 6}}function D(t){return void 0===t}function L(t){return null===t}function C(t){return"symbol"==typeof t}function F(t){return"object"==typeof t?null!==t:"function"==typeof t}function R(t,e){switch(P(t)){case 0:case 1:case 2:case 3:case 4:case 5:return t}var i=3===e?"string":5===e?"number":"default",r=B(t,n);if(void 0!==r){var s=r.call(t,i);if(F(s))throw new TypeError;return s}return U(t,"default"===i?"number":i)}function U(t,e){if("string"===e){var i=t.toString;if(z(i))if(!F(r=i.call(t)))return r;if(z(n=t.valueOf))if(!F(r=n.call(t)))return r}else{var n;if(z(n=t.valueOf))if(!F(r=n.call(t)))return r;var r,s=t.toString;if(z(s))if(!F(r=s.call(t)))return r}throw new TypeError}function q(t){return!!t}function J(t){return""+t}function K(t){var e=R(t,3);return C(e)?e:J(e)}function W(t){return Array.isArray?Array.isArray(t):t instanceof Object?t instanceof Array:"[object Array]"===Object.prototype.toString.call(t)}function z(t){return"function"==typeof t}function $(t){return"function"==typeof t}function H(t){switch(P(t)){case 3:case 4:return!0;default:return!1}}function B(t,e){var i=t[e];if(null!=i){if(!z(i))throw new TypeError;return i}}function G(t){var e=B(t,r);if(!z(e))throw new TypeError;var i=e.call(t);if(!F(i))throw new TypeError;return i}function Y(t){return t.value}function Q(t){var e=t.next();return!e.done&&e}function X(t){var e=t.return;e&&e.call(t)}function Z(t){var e=Object.getPrototypeOf(t);if("function"!=typeof t||t===l)return e;if(e!==l)return e;var i=t.prototype,n=i&&Object.getPrototypeOf(i);if(null==n||n===Object.prototype)return e;var r=n.constructor;return"function"!=typeof r||r===t?e:r}function tt(){var t={},e=[],i=function(){function t(t,e,i){this._index=0,this._keys=t,this._values=e,this._selector=i}return t.prototype["@@iterator"]=function(){return this},t.prototype[r]=function(){return this},t.prototype.next=function(){var t=this._index;if(t>=0&&t<this._keys.length){var i=this._selector(this._keys[t],this._values[t]);return t+1>=this._keys.length?(this._index=-1,this._keys=e,this._values=e):this._index++,{value:i,done:!1}}return{value:void 0,done:!0}},t.prototype.throw=function(t){throw this._index>=0&&(this._index=-1,this._keys=e,this._values=e),t},t.prototype.return=function(t){return this._index>=0&&(this._index=-1,this._keys=e,this._values=e),{value:t,done:!0}},t}();return function(){function e(){this._keys=[],this._values=[],this._cacheKey=t,this._cacheIndex=-2}return Object.defineProperty(e.prototype,"size",{get:function(){return this._keys.length},enumerable:!0,configurable:!0}),e.prototype.has=function(t){return this._find(t,!1)>=0},e.prototype.get=function(t){var e=this._find(t,!1);return e>=0?this._values[e]:void 0},e.prototype.set=function(t,e){var i=this._find(t,!0);return this._values[i]=e,this},e.prototype.delete=function(e){var i=this._find(e,!1);if(i>=0){for(var n=this._keys.length,r=i+1;r<n;r++)this._keys[r-1]=this._keys[r],this._values[r-1]=this._values[r];return this._keys.length--,this._values.length--,e===this._cacheKey&&(this._cacheKey=t,this._cacheIndex=-2),!0}return!1},e.prototype.clear=function(){this._keys.length=0,this._values.length=0,this._cacheKey=t,this._cacheIndex=-2},e.prototype.keys=function(){return new i(this._keys,this._values,n)},e.prototype.values=function(){return new i(this._keys,this._values,s)},e.prototype.entries=function(){return new i(this._keys,this._values,o)},e.prototype["@@iterator"]=function(){return this.entries()},e.prototype[r]=function(){return this.entries()},e.prototype._find=function(t,e){return this._cacheKey!==t&&(this._cacheIndex=this._keys.indexOf(this._cacheKey=t)),this._cacheIndex<0&&e&&(this._cacheIndex=this._keys.length,this._keys.push(t),this._values.push(void 0)),this._cacheIndex},e}();function n(t,e){return t}function s(t,e){return e}function o(t,e){return[t,e]}}function et(){return function(){function t(){this._map=new f}return Object.defineProperty(t.prototype,"size",{get:function(){return this._map.size},enumerable:!0,configurable:!0}),t.prototype.has=function(t){return this._map.has(t)},t.prototype.add=function(t){return this._map.set(t,t),this},t.prototype.delete=function(t){return this._map.delete(t)},t.prototype.clear=function(){this._map.clear()},t.prototype.keys=function(){return this._map.keys()},t.prototype.values=function(){return this._map.values()},t.prototype.entries=function(){return this._map.entries()},t.prototype["@@iterator"]=function(){return this.keys()},t.prototype[r]=function(){return this.keys()},t}()}function it(){var t=16,i=u.create(),n=r();return function(){function t(){this._key=r()}return t.prototype.has=function(t){var e=s(t,!1);return void 0!==e&&u.has(e,this._key)},t.prototype.get=function(t){var e=s(t,!1);return void 0!==e?u.get(e,this._key):void 0},t.prototype.set=function(t,e){return s(t,!0)[this._key]=e,this},t.prototype.delete=function(t){var e=s(t,!1);return void 0!==e&&delete e[this._key]},t.prototype.clear=function(){this._key=r()},t}();function r(){var t;do{t="@@WeakMap@@"+l()}while(u.has(i,t));return i[t]=!0,t}function s(t,i){if(!e.call(t,n)){if(!i)return;Object.defineProperty(t,n,{value:u.create()})}return t[n]}function o(t,e){for(var i=0;i<e;++i)t[i]=255*Math.random()|0;return t}function a(t){return"function"==typeof Uint8Array?"undefined"!=typeof crypto?crypto.getRandomValues(new Uint8Array(t)):"undefined"!=typeof msCrypto?msCrypto.getRandomValues(new Uint8Array(t)):o(new Uint8Array(t),t):o(new Array(t),t)}function l(){var e=a(t);e[6]=79&e[6]|64,e[8]=191&e[8]|128;for(var i="",n=0;n<t;++n){var r=e[n];4!==n&&6!==n&&8!==n||(i+="-"),r<16&&(i+="0"),i+=r.toString(16).toLowerCase()}return i}}function nt(t){return t.__=void 0,delete t.__,t}t("decorate",p),t("metadata",y),t("defineMetadata",v),t("hasMetadata",g),t("hasOwnMetadata",_),t("getMetadata",m),t("getOwnMetadata",b),t("getMetadataKeys",w),t("getOwnMetadataKeys",O),t("deleteMetadata",E)}(n)}()}(b||(b={}));export{r as FieldConfig,$ as Form,m as LinkOnEvent,E as OnEvents,x as _attachEventListeners,V as _attachOnClearErrorEvents,T as _buildFormFields,F as _clearState,q as _createOrder,z as _disableField,W as _disableFields,k as _get,A as _getRequiredFieldNames,L as _getStateSnapshot,I as _handleOnEvent,P as _handleValidation,C as _hasChanged,K as _hideField,J as _hideFields,j as _linkErrors,S as _linkFieldErrors,M as _linkValues,D as _requiredFieldsValid,U as _resetState,R as _setInitialState,N as _validateField,H as editable,B as field};
//# sourceMappingURL=index.mjs.map
