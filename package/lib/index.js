!function(e,t){"object"==typeof exports&&"undefined"!=typeof module?t(exports):"function"==typeof define&&define.amd?define(["exports"],t):t((e="undefined"!=typeof globalThis?globalThis:e||self)["@formvana"]={})}(this,(function(e){"use strict";function t(){}function i(e){let i;return function(e,...i){if(null==e)return t;const r=e.subscribe(...i);return r.unsubscribe?()=>r.unsubscribe():r}(e,(e=>i=e))(),i}const r=[];function n(e,i=t){let n;const s=[];function o(t){if(o=t,((i=e)!=i?o==o:i!==o||i&&"object"==typeof i||"function"==typeof i)&&(e=t,n)){const t=!r.length;for(let t=0;t<s.length;t+=1){const i=s[t];i[1](),r.push(i,e)}if(t){for(let e=0;e<r.length;e+=2)r[e][0](r[e+1]);r.length=0}}var i,o}return{set:o,update:function(t){o(t(e))},subscribe:function(r,a=t){const l=[r,a];return s.push(l),1===s.length&&(n=i(o)||t),r(e),()=>{const e=s.indexOf(l);-1!==e&&s.splice(e,1),0===s.length&&(n(),n=null)}}}}class s{constructor(e,t){if(!e)throw new Error("{name: string} is required for FieldConfig intialization.");if(this.name=e,t&&Object.assign(this,t),!this.selector)throw new Error("Please pass in a valid Element.\nEither a string selector or a SvelteComponent.");switch(this.value&&this.value.subscribe||(this.value=n(this.value)),this.attributes&&!this.attributes.type?this.attributes.type=this.type:this.attributes||(this.attributes={},this.attributes.type=this.type),this.type){case"text":this.value.set("");break;case"decimal":case"number":this.value.set(0);break;case"boolean":this.value.set(!1),this.options=[];break;case"select":this.options=[];break;default:this.value.set(void 0)}!this.attributes["aria-label"]&&this.attributes.title?this.attributes["aria-label"]=this.attributes.title:this.attributes["aria-label"]||(this.attributes["aria-label"]=this.label||this.name)}name;node;selector;value=n(void 0);type="text";required;label;hint;errors=n(void 0);styles;classes;ref_key;options;disabled;hidden;attributes;group;step;clearErrors=()=>{this.errors.set(void 0)};clear=()=>{this.clearErrors()};addEventListener=(e,t)=>{if(!this.node)throw new Error("Node is missing! No Html Node to attach event listener too!");this.node.addEventListener(e,(e=>t instanceof Function?t(e):t),!1)}}class o{constructor(e,t,i){if(e&&(this.property=e),t&&(this.constraints=t),i){let e;for(e in i)this[e]=i[e]}}target;property;value;constraints;children}class a{constructor(e,t=!1){if(t){let e;for(e in this)this[e]=!1}Object.assign(this,e)}blur=!0;change=!0;click=!1;dblclick=!1;focus=!0;input=!0;keydown=!1;keypress=!1;keyup=!1;mount=!1;mousedown=!1;mouseenter=!1;mouseleave=!1;mousemove=!1;mouseout=!1;mouseover=!1;mouseup=!1;submit=!0}function l(e,t=Reflect.getMetadata("editableProperties",e)){return t.map((t=>new s(t,{...Reflect.getMetadata("fieldConfig",e,t),value:e[t]})))}function u(e,t){return t.filter((t=>t.name===e))[0]}function f(e,t){const r=i(e);r[t.name]?(r[t.name]=i(t.value),e.set({...r})):e.set({...r,[t.name]:i(t.value)})}function c(e,t,i){Object.entries(t).forEach((([t,r])=>{r&&("SELECT"===e.node?.nodeName&&"input"!==t&&e.addEventListener(t,i),"SELECT"!==e.node?.nodeName&&e.addEventListener(t,i))}))}function h(e,t,i,r,n){r&&r.when?t.addEventListener(i,y(e,n,void 0,[r])):t.addEventListener(i,r)}function d(e,t,r){let n=0,s=t.length;for(;s>n;++n){const s=t[n].name,o=t[n].value;e?r[s]=i(o):o.set(r[s])}}function p(e,t,i){const r=e.filter((e=>e[i]===t.name));r&&r.length>0?t.errors.set(r[0]):t.errors.set(void 0)}function _(e,t,i){e.forEach((e=>{let r;for(r in e)if(r===i){u(e[i],t).errors.set(e)}}))}function v(e,t,i){("always"===i||"valid"===i)&&d(!0,t,e)}function y(e,t,i,r){return e.pristine.set(!1),m([v(e.model,e.fields,e.validation_options.link_fields_to_model),i&&f(e.value_changes,i),r&&g("before",r)]),e.validation_options.validator(e.model,e.validation_options.options).then((n=>(m([w(e,n,t,i),E(e.value_changes,e.changed),r&&g("after",r)]),n)))}function g(e,t){t&&t.length>0&&t.forEach((t=>{t.when===e&&b(t.callback)}))}function b(e){e instanceof Function&&e()}function m(e){Array.isArray(e)?e.forEach((e=>{b(e)})):b(e)}async function w(e,t,i,r){return t&&t.length>0?(e.errors=t,r?e.validation_options.field_error_link_name&&p(t,r,e.validation_options.field_error_link_name):_(t,e.fields,e.validation_options.field_error_link_name),k(t,i)?e.valid.set(!0):e.valid.set(!1)):(v(e.model,e.fields,e.validation_options.link_fields_to_model),e.clearErrors(),e.valid.set(!0)),t}function k(e,t){if(0===e.length)return!0;let i=0,r=t.length;if(0===r)return!0;const n=e.map((e=>e.property));for(;r>i;++i)if(-1!==n.indexOf(t[i]))return!1;return!0}function E(e,t){const r=i(e)!=={}?i(e):null;r&&Object.keys(r).length>0?t.set(!0):t.set(!1)}function O(e,t){return t.model=Object.assign({},e.model),e.errors&&e.errors.length>0?t.errors=[...e.errors]:t.errors=[],t}function A(e,t){let i;if(t.model)for(i in t.model)e.model[i]=t.model[i];e.clearErrors(),t.errors&&t.errors.length>0?e.errors=[...t.errors]:e.errors=[],d(!1,e.fields,e.model),e.errors&&e.errors.length>0&&_(e.errors,e.fields,e.validation_options.field_error_link_name),e.value_changes.set({}),e.changed.set(!1)}function j(e,t){let i=[],r=[];return e.forEach((n=>{const s=u(n,t);s.name===n?i.push(s):-1===r.indexOf(s)&&-1===e.indexOf(s.name)&&r.push(s)})),t=[...i,...r]}function x(e,t,i){let r=0,n=e.length;if(0===n)return;const s=t.map((e=>e.name));for(;n>r;++r){const n=s.indexOf(e[r]);if(-1!==n){T(s[n],t,i)}}}function T(e,t,i){const r=u(e,t);let n;for(n in i)"attributes"===n?Object.assign(r.attributes,i[n]):"name"!==n&&F(r,n,i[n])}function F(e,t,i){e[t]=i}var M,P="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};
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
    ***************************************************************************** */!function(e){!function(t){var i="object"==typeof P?P:"object"==typeof self?self:"object"==typeof this?this:Function("return this;")(),r=n(e);function n(e,t){return function(i,r){"function"!=typeof e[i]&&Object.defineProperty(e,i,{configurable:!0,writable:!0,value:r}),t&&t(i,r)}}void 0===i.Reflect?i.Reflect=e:r=n(i.Reflect,r),function(e){var t=Object.prototype.hasOwnProperty,i="function"==typeof Symbol,r=i&&void 0!==Symbol.toPrimitive?Symbol.toPrimitive:"@@toPrimitive",n=i&&void 0!==Symbol.iterator?Symbol.iterator:"@@iterator",s="function"==typeof Object.create,o={__proto__:[]}instanceof Array,a=!s&&!o,l={create:s?function(){return re(Object.create(null))}:o?function(){return re({__proto__:null})}:function(){return re({})},has:a?function(e,i){return t.call(e,i)}:function(e,t){return t in e},get:a?function(e,i){return t.call(e,i)?e[i]:void 0}:function(e,t){return e[t]}},u=Object.getPrototypeOf(Function),f="object"==typeof process&&process.env&&"true"===process.env.REFLECT_METADATA_USE_MAP_POLYFILL,c=f||"function"!=typeof Map||"function"!=typeof Map.prototype.entries?ee():Map,h=f||"function"!=typeof Set||"function"!=typeof Set.prototype.entries?te():Set,d=new(f||"function"!=typeof WeakMap?ie():WeakMap);function p(e,t,i,r){if(V(i)){if(!W(e))throw new TypeError;if(!G(t))throw new TypeError;return O(e,t)}if(!W(e))throw new TypeError;if(!I(t))throw new TypeError;if(!I(r)&&!V(r)&&!R(r))throw new TypeError;return R(r)&&(r=void 0),A(e,t,i=D(i),r)}function _(e,t){function i(i,r){if(!I(i))throw new TypeError;if(!V(r)&&!H(r))throw new TypeError;P(e,t,i,r)}return i}function v(e,t,i,r){if(!I(i))throw new TypeError;return V(r)||(r=D(r)),P(e,t,i,r)}function y(e,t,i){if(!I(t))throw new TypeError;return V(i)||(i=D(i)),x(e,t,i)}function g(e,t,i){if(!I(t))throw new TypeError;return V(i)||(i=D(i)),T(e,t,i)}function b(e,t,i){if(!I(t))throw new TypeError;return V(i)||(i=D(i)),F(e,t,i)}function m(e,t,i){if(!I(t))throw new TypeError;return V(i)||(i=D(i)),M(e,t,i)}function w(e,t){if(!I(e))throw new TypeError;return V(t)||(t=D(t)),S(e,t)}function k(e,t){if(!I(e))throw new TypeError;return V(t)||(t=D(t)),C(e,t)}function E(e,t,i){if(!I(t))throw new TypeError;V(i)||(i=D(i));var r=j(t,i,!1);if(V(r))return!1;if(!r.delete(e))return!1;if(r.size>0)return!0;var n=d.get(t);return n.delete(i),n.size>0||d.delete(t),!0}function O(e,t){for(var i=e.length-1;i>=0;--i){var r=(0,e[i])(t);if(!V(r)&&!R(r)){if(!G(r))throw new TypeError;t=r}}return t}function A(e,t,i,r){for(var n=e.length-1;n>=0;--n){var s=(0,e[n])(t,i,r);if(!V(s)&&!R(s)){if(!I(s))throw new TypeError;r=s}}return r}function j(e,t,i){var r=d.get(e);if(V(r)){if(!i)return;r=new c,d.set(e,r)}var n=r.get(t);if(V(n)){if(!i)return;n=new c,r.set(t,n)}return n}function x(e,t,i){if(T(e,t,i))return!0;var r=Z(t);return!R(r)&&x(e,r,i)}function T(e,t,i){var r=j(t,i,!1);return!V(r)&&U(r.has(e))}function F(e,t,i){if(T(e,t,i))return M(e,t,i);var r=Z(t);return R(r)?void 0:F(e,r,i)}function M(e,t,i){var r=j(t,i,!1);if(!V(r))return r.get(e)}function P(e,t,i,r){j(i,r,!0).set(e,t)}function S(e,t){var i=C(e,t),r=Z(e);if(null===r)return i;var n=S(r,t);if(n.length<=0)return i;if(i.length<=0)return n;for(var s=new h,o=[],a=0,l=i;a<l.length;a++){var u=l[a];s.has(u)||(s.add(u),o.push(u))}for(var f=0,c=n;f<c.length;f++){u=c[f];s.has(u)||(s.add(u),o.push(u))}return o}function C(e,t){var i=[],r=j(e,t,!1);if(V(r))return i;for(var n=B(r.keys()),s=0;;){var o=Q(n);if(!o)return i.length=s,i;var a=J(o);try{i[s]=a}catch(e){try{X(n)}finally{throw e}}s++}}function L(e){if(null===e)return 1;switch(typeof e){case"undefined":return 0;case"boolean":return 2;case"string":return 3;case"symbol":return 4;case"number":return 5;case"object":return null===e?1:6;default:return 6}}function V(e){return void 0===e}function R(e){return null===e}function q(e){return"symbol"==typeof e}function I(e){return"object"==typeof e?null!==e:"function"==typeof e}function K(e,t){switch(L(e)){case 0:case 1:case 2:case 3:case 4:case 5:return e}var i=3===t?"string":5===t?"number":"default",n=Y(e,r);if(void 0!==n){var s=n.call(e,i);if(I(s))throw new TypeError;return s}return z(e,"default"===i?"number":i)}function z(e,t){if("string"===t){var i=e.toString;if($(i))if(!I(n=i.call(e)))return n;if($(r=e.valueOf))if(!I(n=r.call(e)))return n}else{var r;if($(r=e.valueOf))if(!I(n=r.call(e)))return n;var n,s=e.toString;if($(s))if(!I(n=s.call(e)))return n}throw new TypeError}function U(e){return!!e}function N(e){return""+e}function D(e){var t=K(e,3);return q(t)?t:N(t)}function W(e){return Array.isArray?Array.isArray(e):e instanceof Object?e instanceof Array:"[object Array]"===Object.prototype.toString.call(e)}function $(e){return"function"==typeof e}function G(e){return"function"==typeof e}function H(e){switch(L(e)){case 3:case 4:return!0;default:return!1}}function Y(e,t){var i=e[t];if(null!=i){if(!$(i))throw new TypeError;return i}}function B(e){var t=Y(e,n);if(!$(t))throw new TypeError;var i=t.call(e);if(!I(i))throw new TypeError;return i}function J(e){return e.value}function Q(e){var t=e.next();return!t.done&&t}function X(e){var t=e.return;t&&t.call(e)}function Z(e){var t=Object.getPrototypeOf(e);if("function"!=typeof e||e===u)return t;if(t!==u)return t;var i=e.prototype,r=i&&Object.getPrototypeOf(i);if(null==r||r===Object.prototype)return t;var n=r.constructor;return"function"!=typeof n||n===e?t:n}function ee(){var e={},t=[],i=function(){function e(e,t,i){this._index=0,this._keys=e,this._values=t,this._selector=i}return e.prototype["@@iterator"]=function(){return this},e.prototype[n]=function(){return this},e.prototype.next=function(){var e=this._index;if(e>=0&&e<this._keys.length){var i=this._selector(this._keys[e],this._values[e]);return e+1>=this._keys.length?(this._index=-1,this._keys=t,this._values=t):this._index++,{value:i,done:!1}}return{value:void 0,done:!0}},e.prototype.throw=function(e){throw this._index>=0&&(this._index=-1,this._keys=t,this._values=t),e},e.prototype.return=function(e){return this._index>=0&&(this._index=-1,this._keys=t,this._values=t),{value:e,done:!0}},e}();return function(){function t(){this._keys=[],this._values=[],this._cacheKey=e,this._cacheIndex=-2}return Object.defineProperty(t.prototype,"size",{get:function(){return this._keys.length},enumerable:!0,configurable:!0}),t.prototype.has=function(e){return this._find(e,!1)>=0},t.prototype.get=function(e){var t=this._find(e,!1);return t>=0?this._values[t]:void 0},t.prototype.set=function(e,t){var i=this._find(e,!0);return this._values[i]=t,this},t.prototype.delete=function(t){var i=this._find(t,!1);if(i>=0){for(var r=this._keys.length,n=i+1;n<r;n++)this._keys[n-1]=this._keys[n],this._values[n-1]=this._values[n];return this._keys.length--,this._values.length--,t===this._cacheKey&&(this._cacheKey=e,this._cacheIndex=-2),!0}return!1},t.prototype.clear=function(){this._keys.length=0,this._values.length=0,this._cacheKey=e,this._cacheIndex=-2},t.prototype.keys=function(){return new i(this._keys,this._values,r)},t.prototype.values=function(){return new i(this._keys,this._values,s)},t.prototype.entries=function(){return new i(this._keys,this._values,o)},t.prototype["@@iterator"]=function(){return this.entries()},t.prototype[n]=function(){return this.entries()},t.prototype._find=function(e,t){return this._cacheKey!==e&&(this._cacheIndex=this._keys.indexOf(this._cacheKey=e)),this._cacheIndex<0&&t&&(this._cacheIndex=this._keys.length,this._keys.push(e),this._values.push(void 0)),this._cacheIndex},t}();function r(e,t){return e}function s(e,t){return t}function o(e,t){return[e,t]}}function te(){return function(){function e(){this._map=new c}return Object.defineProperty(e.prototype,"size",{get:function(){return this._map.size},enumerable:!0,configurable:!0}),e.prototype.has=function(e){return this._map.has(e)},e.prototype.add=function(e){return this._map.set(e,e),this},e.prototype.delete=function(e){return this._map.delete(e)},e.prototype.clear=function(){this._map.clear()},e.prototype.keys=function(){return this._map.keys()},e.prototype.values=function(){return this._map.values()},e.prototype.entries=function(){return this._map.entries()},e.prototype["@@iterator"]=function(){return this.keys()},e.prototype[n]=function(){return this.keys()},e}()}function ie(){var e=16,i=l.create(),r=n();return function(){function e(){this._key=n()}return e.prototype.has=function(e){var t=s(e,!1);return void 0!==t&&l.has(t,this._key)},e.prototype.get=function(e){var t=s(e,!1);return void 0!==t?l.get(t,this._key):void 0},e.prototype.set=function(e,t){return s(e,!0)[this._key]=t,this},e.prototype.delete=function(e){var t=s(e,!1);return void 0!==t&&delete t[this._key]},e.prototype.clear=function(){this._key=n()},e}();function n(){var e;do{e="@@WeakMap@@"+u()}while(l.has(i,e));return i[e]=!0,e}function s(e,i){if(!t.call(e,r)){if(!i)return;Object.defineProperty(e,r,{value:l.create()})}return e[r]}function o(e,t){for(var i=0;i<t;++i)e[i]=255*Math.random()|0;return e}function a(e){return"function"==typeof Uint8Array?"undefined"!=typeof crypto?crypto.getRandomValues(new Uint8Array(e)):"undefined"!=typeof msCrypto?msCrypto.getRandomValues(new Uint8Array(e)):o(new Uint8Array(e),e):o(new Array(e),e)}function u(){var t=a(e);t[6]=79&t[6]|64,t[8]=191&t[8]|128;for(var i="",r=0;r<e;++r){var n=t[r];4!==r&&6!==r&&8!==r||(i+="-"),n<16&&(i+="0"),i+=n.toString(16).toLowerCase()}return i}}function re(e){return e.__=void 0,delete e.__,e}e("decorate",p),e("metadata",_),e("defineMetadata",v),e("hasMetadata",y),e("hasOwnMetadata",g),e("getMetadata",b),e("getOwnMetadata",m),e("getMetadataKeys",w),e("getOwnMetadataKeys",k),e("deleteMetadata",E)}(r)}()}(M||(M={}));class S{constructor(e,t){e&&(this.forms=e),t&&Object.assign(this,t),this.#getAllValueChanges(),this.#getAllValid(),this.#getAllChanged(),this.#getAllPristine()}forms=[];loading=n(!1);all_value_changes=n({});all_valid=n(!1);all_changed=n(!1);all_pristine=n(!1);#all_valid_list={};#all_changed_list={};#all_pristine_list={};validateAll=(e,t)=>{if(t)t.forEach((t=>{this.forms&&this.forms[t].validate(e)}));else{let t;for(t in this.forms)this.forms[t].validate(e)}};#getAllValueChanges=()=>{let e,t=0;for(e in this.forms){const r=`form_${t}`;if("{}"!=`${i(this.forms[e].value_changes)}`){const t=i(this.all_value_changes);t[r]||this.all_value_changes.set({...t,[r]:{}}),this.forms[e].value_changes.subscribe((e=>{const t=i(this.all_value_changes);this.all_value_changes.set({...t,[r]:e})}))}t++}};#getAllValid=()=>{let e,t=0;for(e in this.forms){const i=t;this.forms[e].valid.subscribe((e=>{this.#all_valid_list[i]=e,Object.values(this.#all_valid_list).includes(!1)?this.all_valid.set(!1):this.all_valid.set(!0)})),t++}};#getAllChanged=()=>{let e,t=0;for(e in this.forms){const i=t;this.forms[e].changed.subscribe((e=>{this.#all_changed_list[i]=e,Object.values(this.#all_changed_list).includes(!1)?this.all_changed.set(!1):this.all_changed.set(!0)})),t++}};#getAllPristine=()=>{let e,t=0;for(e in this.forms){const i=t;this.forms[e].pristine.subscribe((e=>{this.#all_pristine_list[i]=e,Object.values(this.#all_pristine_list).includes(!1)?this.all_pristine.set(!1):this.all_pristine.set(!0)})),t++}}}e.FieldConfig=s,e.FieldStepper=class{constructor(e,t){if(this.fields=e,t)this.active_step=t;else{let t;for(t in e)this.active_step=t}}fields;active_step;get fields_valid(){let e,t=!0;for(e in this.fields)i(this.fields[e].errors)&&(t=!1);return n(t)}},e.Form=class{constructor(e,t,i){if(i&&Object.assign(this,i),!e)throw new Error("Model is not valid. Please use a valid model.");if(this.model=e,this.#buildFields(),!t)throw new Error("Please add a validator with ReturnType<Promise<ValidationError[]>>");Object.assign(this.validation_options,t),this.#field_order&&this.setFieldOrder(this.#field_order),this.refs&&this.attachRefData(),this.disabled_fields&&x(this.disabled_fields,this.fields,{disabled:!0,attributes:{disabled:!0}}),this.hidden_fields&&x(this.hidden_fields,this.fields,{hidden:!0}),O(this,this.initial_state)}model;fields=[];validation_options={validator:async()=>[],on_events:new a,link_fields_to_model:"always",field_error_link_name:"property",options:{skipMissingProperties:!1,dismissDefaultMessages:!1,validationError:{target:!1,value:!1},forbidUnknownValues:!0,stopAtFirstError:!1}};errors=[];valid=n(!1);changed=n(!1);pristine=n(!0);loading=n(!1);template;refs;value_changes=n({});initial_state={model:void 0,errors:void 0};hidden_fields;disabled_fields;#field_order;#required_fields=[];#buildFields=(e=this.model)=>{this.fields=l(e),this.#required_fields=this.fields.filter((e=>e.required)).map((e=>e.name))};useField=e=>{const t=u(e.name,this.fields);t.node=e,this.validation_options.on_events&&c(t,this.validation_options.on_events,(e=>y(this,this.#required_fields,t)))};validate=e=>y(this,this.#required_fields,void 0,e);validateAsync=async e=>await y(this,this.#required_fields,void 0,e);validateField=(e,t,r)=>{const n=u(e,this.fields);if(t){const r=new o(e,{error:t},{value:i(n.value)});this.errors.push(r),_(this.errors,this.fields,this.validation_options.field_error_link_name)}else y(this,this.#required_fields,n,r)};attachCallbacks=(e,t,i)=>{if(Array.isArray(i)){i.map((e=>u(e,this.fields))).forEach((i=>{h(this,i,e,t,this.#required_fields)}))}else{h(this,u(i,this.fields),e,t,this.#required_fields)}};clearErrors=()=>{this.errors=[],this.fields.forEach((e=>{e.errors.set(void 0)}))};get=e=>u(e,this.fields);loadModel=(e,t=!1,i=!1)=>{if(t)this.model=e,this.#buildFields();else{let t;for(t in this.model)this.model[t]=e[t];d(!1,this.fields,this.model)}return i&&this.updateInitialState(),this};attachRefData=e=>{const t=this.fields.filter((e=>e.ref_key));e?(this.refs=e,t.forEach((t=>{t.ref_key&&(t.options=e[t.ref_key])}))):this.refs&&t.forEach((e=>{e.ref_key&&this.refs&&(e.options=this.refs[e.ref_key])}))};destroy=()=>{this.fields&&this.fields.length>0&&this.fields.forEach((e=>{this.validation_options.on_events&&Object.keys(this.validation_options.on_events).forEach((t=>{e.node&&e.node.removeEventListener(t,(e=>{}))}))}))};reset=()=>{A(this,this.initial_state)};updateInitialState=()=>{O(this,this.initial_state),this.changed.set(!1)};setFieldOrder=e=>{e&&e.length>0&&(this.#field_order=e,this.fields=j(this.#field_order,this.fields))};setFieldAttributes=(e,t)=>{e&&(Array.isArray(e)?x(e,this.fields,t):x([e],this.fields,t))}},e.FormGroup=class extends S{constructor(e,t){super(e,t)}},e.FormManager=S,e.FormStepper=class extends S{constructor(e,t){super(e,t)}active_step=0;next=()=>{"number"==typeof this.active_step&&this.active_step++};back=()=>{"number"==typeof this.active_step&&this.active_step--}},e.OnEvents=a,e.ValidationError=o,e._addCallbackToField=h,e._attachEventListeners=c,e._buildFormFields=l,e._executeCallbacks=m,e._executeValidationEvent=y,e._get=u,e._handleValidationSideEffects=w,e._hanldeValueLinking=v,e._hasStateChanged=E,e._linkAllErrors=_,e._linkFieldErrors=p,e._linkValues=d,e._requiredFieldsValid=k,e._resetState=A,e._setFieldAttribute=T,e._setFieldAttributes=x,e._setFieldOrder=j,e._setInitialState=O,e._setValueChanges=f,e.field=function(e){return function(t,i){let r=Reflect.getMetadata("editableProperties",t)||[];r.indexOf(i)<0&&r.push(i),Reflect.defineMetadata("editableProperties",r,t),Reflect.defineMetadata("fieldConfig",e,t,i)}},Object.defineProperty(e,"__esModule",{value:!0})}));
//# sourceMappingURL=index.js.map
