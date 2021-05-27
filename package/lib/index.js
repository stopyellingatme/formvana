!function(t,e){"object"==typeof exports&&"undefined"!=typeof module?e(exports):"function"==typeof define&&define.amd?define(["exports"],e):e((t="undefined"!=typeof globalThis?globalThis:t||self)["@formvana"]={})}(this,(function(t){"use strict";function e(){}function i(t){let i;return function(t,...i){if(null==t)return e;const r=t.subscribe(...i);return r.unsubscribe?()=>r.unsubscribe():r}(t,(t=>i=t))(),i}const r=[];function n(t,i=e){let n;const s=[];function o(e){if(o=e,((i=t)!=i?o==o:i!==o||i&&"object"==typeof i||"function"==typeof i)&&(t=e,n)){const e=!r.length;for(let e=0;e<s.length;e+=1){const i=s[e];i[1](),r.push(i,t)}if(e){for(let t=0;t<r.length;t+=2)r[t][0](r[t+1]);r.length=0}}var i,o}return{set:o,update:function(e){o(e(t))},subscribe:function(r,a=e){const u=[r,a];return s.push(u),1===s.length&&(n=i(o)||e),r(t),()=>{const t=s.indexOf(u);-1!==t&&s.splice(t,1),0===s.length&&(n(),n=null)}}}}class s{constructor(t,e){if(this.value=n(void 0),this.type="text",this.errors=n(void 0),this.clearErrors=()=>{this.errors.set(void 0)},this.clear=()=>{this.clearErrors()},this.addEventListener=(t,e)=>{if(!this.node)throw new Error("Node is missing! No Html Node to attach event listener too!");this.node.addEventListener(t,(t=>e instanceof Function?e(t):e),!1)},!t)throw new Error("{name: string} is required for FieldConfig intialization.");if(this.name=t,e&&Object.assign(this,e),!this.selector)throw new Error("Please pass in a valid Element.\nEither a string selector or a SvelteComponent.");switch(this.value&&this.value.subscribe||(this.value=n(this.value)),this.attributes&&!this.attributes.type?this.attributes.type=this.type:this.attributes||(this.attributes={},this.attributes.type=this.type),this.type){case"text":this.value.set("");break;case"decimal":case"number":this.value.set(0);break;case"boolean":this.value.set(!1),this.options=[];break;case"select":this.options=[];break;default:this.value.set(void 0)}!this.attributes["aria-label"]&&this.attributes.title?this.attributes["aria-label"]=this.attributes.title:this.attributes["aria-label"]||(this.attributes["aria-label"]=this.label||this.name)}}class o{constructor(t,e,i){if(t&&(this.property=t),e&&(this.constraints=e),i){let t;for(t in i)this[t]=i[t]}}}class a{constructor(t,e=!1){if(this.blur=!0,this.change=!0,this.click=!1,this.dblclick=!1,this.focus=!0,this.input=!0,this.keydown=!1,this.keypress=!1,this.keyup=!1,this.mount=!1,this.mousedown=!1,this.mouseenter=!1,this.mouseleave=!1,this.mousemove=!1,this.mouseout=!1,this.mouseover=!1,this.mouseup=!1,this.submit=!0,e){let t;for(t in this)this[t]=!1}Object.assign(this,t)}}function u(t,e=Reflect.getMetadata("editableProperties",t)){return e.map((e=>new s(e,{...Reflect.getMetadata("fieldConfig",t,e),value:t[e]})))}function l(t,e){return e.filter((e=>e.name===t))[0]}function f(t,e){const r=i(t);r[e.name]?(r[e.name]=i(e.value),t.set({...r})):t.set({...r,[e.name]:i(e.value)})}function h(t,e,i){Object.entries(e).forEach((([e,r])=>{r&&("SELECT"===t.node?.nodeName&&"input"!==e&&t.addEventListener(e,i),"SELECT"!==t.node?.nodeName&&t.addEventListener(e,i))}))}function c(t,e,i,r,n){r&&r.when?e.addEventListener(i,v(t,n,void 0,[r])):e.addEventListener(i,r)}function d(t,e,r){let n=0,s=e.length;for(;s>n;++n){const s=e[n].name,o=e[n].value;t?r[s]=i(o):o.set(r[s])}}function p(t,e,i){const r=t.filter((t=>t[i]===e.name));r&&r.length>0?e.errors.set(r[0]):e.errors.set(void 0)}function _(t,e,i){t.forEach((t=>{let r;for(r in t)if(r===i){l(t[i],e).errors.set(t)}}))}function y(t,e,i){("always"===i||"valid"===i)&&d(!0,e,t)}function v(t,e,i,r){return t.pristine.set(!1),g([y(t.model,t.fields,t.validation_options.link_fields_to_model),i&&f(t.value_changes,i),r&&m("before",r)]),t.validation_options.validator(t.model,t.validation_options.options).then((n=>(g([w(t,n,e,i),E(t.value_changes,t.changed),r&&m("after",r)]),n)))}function m(t,e){e&&e.length>0&&e.forEach((e=>{e.when===t&&b(e.callback)}))}function b(t){t instanceof Function&&t()}function g(t){Array.isArray(t)?t.forEach((t=>{b(t)})):b(t)}async function w(t,e,i,r){return e&&e.length>0?(t.errors=e,r?t.validation_options.field_error_link_name&&p(e,r,t.validation_options.field_error_link_name):_(e,t.fields,t.validation_options.field_error_link_name),k(e,i)?t.valid.set(!0):t.valid.set(!1)):(y(t.model,t.fields,t.validation_options.link_fields_to_model),t.clearErrors(),t.valid.set(!0)),e}function k(t,e){if(0===t.length)return!0;let i=0,r=e.length;if(0===r)return!0;const n=t.map((t=>t.property));for(;r>i;++i)if(-1!==n.indexOf(e[i]))return!1;return!0}function E(t,e){const r=i(t)!=={}?i(t):null;r&&Object.keys(r).length>0?e.set(!0):e.set(!1)}function O(t,e){return e.model=Object.assign({},t.model),t.errors&&t.errors.length>0?e.errors=[...t.errors]:e.errors=[],e}function j(t,e){let i;if(e.model)for(i in e.model)t.model[i]=e.model[i];t.clearErrors(),e.errors&&e.errors.length>0?t.errors=[...e.errors]:t.errors=[],d(!1,t.fields,t.model),t.errors&&t.errors.length>0&&_(t.errors,t.fields,t.validation_options.field_error_link_name),t.value_changes.set({}),t.changed.set(!1)}function x(t,e){let i=[],r=[];return t.forEach((n=>{const s=l(n,e);s.name===n?i.push(s):-1===r.indexOf(s)&&-1===t.indexOf(s.name)&&r.push(s)})),e=[...i,...r]}function T(t,e,i){let r=0,n=t.length;if(0===n)return;const s=e.map((t=>t.name));for(;n>r;++r){const n=s.indexOf(t[r]);if(-1!==n){F(s[n],e,i)}}}function F(t,e,i){const r=l(t,e);let n;for(n in i)"attributes"===n?Object.assign(r.attributes,i[n]):"name"!==n&&A(r,n,i[n])}function A(t,e,i){t[e]=i}var M,S="undefined"!=typeof globalThis?globalThis:"undefined"!=typeof window?window:"undefined"!=typeof global?global:"undefined"!=typeof self?self:{};
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
    ***************************************************************************** */!function(t){!function(e){var i="object"==typeof S?S:"object"==typeof self?self:"object"==typeof this?this:Function("return this;")(),r=n(t);function n(t,e){return function(i,r){"function"!=typeof t[i]&&Object.defineProperty(t,i,{configurable:!0,writable:!0,value:r}),e&&e(i,r)}}void 0===i.Reflect?i.Reflect=t:r=n(i.Reflect,r),function(t){var e=Object.prototype.hasOwnProperty,i="function"==typeof Symbol,r=i&&void 0!==Symbol.toPrimitive?Symbol.toPrimitive:"@@toPrimitive",n=i&&void 0!==Symbol.iterator?Symbol.iterator:"@@iterator",s="function"==typeof Object.create,o={__proto__:[]}instanceof Array,a=!s&&!o,u={create:s?function(){return rt(Object.create(null))}:o?function(){return rt({__proto__:null})}:function(){return rt({})},has:a?function(t,i){return e.call(t,i)}:function(t,e){return e in t},get:a?function(t,i){return e.call(t,i)?t[i]:void 0}:function(t,e){return t[e]}},l=Object.getPrototypeOf(Function),f="object"==typeof process&&process.env&&"true"===process.env.REFLECT_METADATA_USE_MAP_POLYFILL,h=f||"function"!=typeof Map||"function"!=typeof Map.prototype.entries?tt():Map,c=f||"function"!=typeof Set||"function"!=typeof Set.prototype.entries?et():Set,d=new(f||"function"!=typeof WeakMap?it():WeakMap);function p(t,e,i,r){if(R(i)){if(!$(t))throw new TypeError;if(!G(e))throw new TypeError;return O(t,e)}if(!$(t))throw new TypeError;if(!V(e))throw new TypeError;if(!V(r)&&!R(r)&&!q(r))throw new TypeError;return q(r)&&(r=void 0),j(t,e,i=D(i),r)}function _(t,e){function i(i,r){if(!V(i))throw new TypeError;if(!R(r)&&!H(r))throw new TypeError;S(t,e,i,r)}return i}function y(t,e,i,r){if(!V(i))throw new TypeError;return R(r)||(r=D(r)),S(t,e,i,r)}function v(t,e,i){if(!V(e))throw new TypeError;return R(i)||(i=D(i)),T(t,e,i)}function m(t,e,i){if(!V(e))throw new TypeError;return R(i)||(i=D(i)),F(t,e,i)}function b(t,e,i){if(!V(e))throw new TypeError;return R(i)||(i=D(i)),A(t,e,i)}function g(t,e,i){if(!V(e))throw new TypeError;return R(i)||(i=D(i)),M(t,e,i)}function w(t,e){if(!V(t))throw new TypeError;return R(e)||(e=D(e)),P(t,e)}function k(t,e){if(!V(t))throw new TypeError;return R(e)||(e=D(e)),C(t,e)}function E(t,e,i){if(!V(e))throw new TypeError;R(i)||(i=D(i));var r=x(e,i,!1);if(R(r))return!1;if(!r.delete(t))return!1;if(r.size>0)return!0;var n=d.get(e);return n.delete(i),n.size>0||d.delete(e),!0}function O(t,e){for(var i=t.length-1;i>=0;--i){var r=(0,t[i])(e);if(!R(r)&&!q(r)){if(!G(r))throw new TypeError;e=r}}return e}function j(t,e,i,r){for(var n=t.length-1;n>=0;--n){var s=(0,t[n])(e,i,r);if(!R(s)&&!q(s)){if(!V(s))throw new TypeError;r=s}}return r}function x(t,e,i){var r=d.get(t);if(R(r)){if(!i)return;r=new h,d.set(t,r)}var n=r.get(e);if(R(n)){if(!i)return;n=new h,r.set(e,n)}return n}function T(t,e,i){if(F(t,e,i))return!0;var r=Z(e);return!q(r)&&T(t,r,i)}function F(t,e,i){var r=x(e,i,!1);return!R(r)&&U(r.has(t))}function A(t,e,i){if(F(t,e,i))return M(t,e,i);var r=Z(e);return q(r)?void 0:A(t,r,i)}function M(t,e,i){var r=x(e,i,!1);if(!R(r))return r.get(t)}function S(t,e,i,r){x(i,r,!0).set(t,e)}function P(t,e){var i=C(t,e),r=Z(t);if(null===r)return i;var n=P(r,e);if(n.length<=0)return i;if(i.length<=0)return n;for(var s=new c,o=[],a=0,u=i;a<u.length;a++){var l=u[a];s.has(l)||(s.add(l),o.push(l))}for(var f=0,h=n;f<h.length;f++){l=h[f];s.has(l)||(s.add(l),o.push(l))}return o}function C(t,e){var i=[],r=x(t,e,!1);if(R(r))return i;for(var n=B(r.keys()),s=0;;){var o=Q(n);if(!o)return i.length=s,i;var a=J(o);try{i[s]=a}catch(t){try{X(n)}finally{throw t}}s++}}function L(t){if(null===t)return 1;switch(typeof t){case"undefined":return 0;case"boolean":return 2;case"string":return 3;case"symbol":return 4;case"number":return 5;case"object":return null===t?1:6;default:return 6}}function R(t){return void 0===t}function q(t){return null===t}function I(t){return"symbol"==typeof t}function V(t){return"object"==typeof t?null!==t:"function"==typeof t}function K(t,e){switch(L(t)){case 0:case 1:case 2:case 3:case 4:case 5:return t}var i=3===e?"string":5===e?"number":"default",n=Y(t,r);if(void 0!==n){var s=n.call(t,i);if(V(s))throw new TypeError;return s}return z(t,"default"===i?"number":i)}function z(t,e){if("string"===e){var i=t.toString;if(W(i))if(!V(n=i.call(t)))return n;if(W(r=t.valueOf))if(!V(n=r.call(t)))return n}else{var r;if(W(r=t.valueOf))if(!V(n=r.call(t)))return n;var n,s=t.toString;if(W(s))if(!V(n=s.call(t)))return n}throw new TypeError}function U(t){return!!t}function N(t){return""+t}function D(t){var e=K(t,3);return I(e)?e:N(e)}function $(t){return Array.isArray?Array.isArray(t):t instanceof Object?t instanceof Array:"[object Array]"===Object.prototype.toString.call(t)}function W(t){return"function"==typeof t}function G(t){return"function"==typeof t}function H(t){switch(L(t)){case 3:case 4:return!0;default:return!1}}function Y(t,e){var i=t[e];if(null!=i){if(!W(i))throw new TypeError;return i}}function B(t){var e=Y(t,n);if(!W(e))throw new TypeError;var i=e.call(t);if(!V(i))throw new TypeError;return i}function J(t){return t.value}function Q(t){var e=t.next();return!e.done&&e}function X(t){var e=t.return;e&&e.call(t)}function Z(t){var e=Object.getPrototypeOf(t);if("function"!=typeof t||t===l)return e;if(e!==l)return e;var i=t.prototype,r=i&&Object.getPrototypeOf(i);if(null==r||r===Object.prototype)return e;var n=r.constructor;return"function"!=typeof n||n===t?e:n}function tt(){var t={},e=[],i=function(){function t(t,e,i){this._index=0,this._keys=t,this._values=e,this._selector=i}return t.prototype["@@iterator"]=function(){return this},t.prototype[n]=function(){return this},t.prototype.next=function(){var t=this._index;if(t>=0&&t<this._keys.length){var i=this._selector(this._keys[t],this._values[t]);return t+1>=this._keys.length?(this._index=-1,this._keys=e,this._values=e):this._index++,{value:i,done:!1}}return{value:void 0,done:!0}},t.prototype.throw=function(t){throw this._index>=0&&(this._index=-1,this._keys=e,this._values=e),t},t.prototype.return=function(t){return this._index>=0&&(this._index=-1,this._keys=e,this._values=e),{value:t,done:!0}},t}();return function(){function e(){this._keys=[],this._values=[],this._cacheKey=t,this._cacheIndex=-2}return Object.defineProperty(e.prototype,"size",{get:function(){return this._keys.length},enumerable:!0,configurable:!0}),e.prototype.has=function(t){return this._find(t,!1)>=0},e.prototype.get=function(t){var e=this._find(t,!1);return e>=0?this._values[e]:void 0},e.prototype.set=function(t,e){var i=this._find(t,!0);return this._values[i]=e,this},e.prototype.delete=function(e){var i=this._find(e,!1);if(i>=0){for(var r=this._keys.length,n=i+1;n<r;n++)this._keys[n-1]=this._keys[n],this._values[n-1]=this._values[n];return this._keys.length--,this._values.length--,e===this._cacheKey&&(this._cacheKey=t,this._cacheIndex=-2),!0}return!1},e.prototype.clear=function(){this._keys.length=0,this._values.length=0,this._cacheKey=t,this._cacheIndex=-2},e.prototype.keys=function(){return new i(this._keys,this._values,r)},e.prototype.values=function(){return new i(this._keys,this._values,s)},e.prototype.entries=function(){return new i(this._keys,this._values,o)},e.prototype["@@iterator"]=function(){return this.entries()},e.prototype[n]=function(){return this.entries()},e.prototype._find=function(t,e){return this._cacheKey!==t&&(this._cacheIndex=this._keys.indexOf(this._cacheKey=t)),this._cacheIndex<0&&e&&(this._cacheIndex=this._keys.length,this._keys.push(t),this._values.push(void 0)),this._cacheIndex},e}();function r(t,e){return t}function s(t,e){return e}function o(t,e){return[t,e]}}function et(){return function(){function t(){this._map=new h}return Object.defineProperty(t.prototype,"size",{get:function(){return this._map.size},enumerable:!0,configurable:!0}),t.prototype.has=function(t){return this._map.has(t)},t.prototype.add=function(t){return this._map.set(t,t),this},t.prototype.delete=function(t){return this._map.delete(t)},t.prototype.clear=function(){this._map.clear()},t.prototype.keys=function(){return this._map.keys()},t.prototype.values=function(){return this._map.values()},t.prototype.entries=function(){return this._map.entries()},t.prototype["@@iterator"]=function(){return this.keys()},t.prototype[n]=function(){return this.keys()},t}()}function it(){var t=16,i=u.create(),r=n();return function(){function t(){this._key=n()}return t.prototype.has=function(t){var e=s(t,!1);return void 0!==e&&u.has(e,this._key)},t.prototype.get=function(t){var e=s(t,!1);return void 0!==e?u.get(e,this._key):void 0},t.prototype.set=function(t,e){return s(t,!0)[this._key]=e,this},t.prototype.delete=function(t){var e=s(t,!1);return void 0!==e&&delete e[this._key]},t.prototype.clear=function(){this._key=n()},t}();function n(){var t;do{t="@@WeakMap@@"+l()}while(u.has(i,t));return i[t]=!0,t}function s(t,i){if(!e.call(t,r)){if(!i)return;Object.defineProperty(t,r,{value:u.create()})}return t[r]}function o(t,e){for(var i=0;i<e;++i)t[i]=255*Math.random()|0;return t}function a(t){return"function"==typeof Uint8Array?"undefined"!=typeof crypto?crypto.getRandomValues(new Uint8Array(t)):"undefined"!=typeof msCrypto?msCrypto.getRandomValues(new Uint8Array(t)):o(new Uint8Array(t),t):o(new Array(t),t)}function l(){var e=a(t);e[6]=79&e[6]|64,e[8]=191&e[8]|128;for(var i="",r=0;r<t;++r){var n=e[r];4!==r&&6!==r&&8!==r||(i+="-"),n<16&&(i+="0"),i+=n.toString(16).toLowerCase()}return i}}function rt(t){return t.__=void 0,delete t.__,t}t("decorate",p),t("metadata",_),t("defineMetadata",y),t("hasMetadata",v),t("hasOwnMetadata",m),t("getMetadata",b),t("getOwnMetadata",g),t("getMetadataKeys",w),t("getOwnMetadataKeys",k),t("deleteMetadata",E)}(r)}()}(M||(M={}));class P{constructor(t,e){this.forms=[],this.loading=n(!1),this.getForm=t=>this.forms[t],this.validateAll=t=>{if(t)t.forEach((t=>{this.forms&&this.forms[t].validate()}));else{let t;for(t in this.forms)this.forms[t].validate()}},t&&(this.forms=t),e&&Object.assign(this,e)}get all_value_changes(){let t,e={},r=0;for(t in this.forms)"{}"!=`${i(this.forms[t].value_changes)}`&&(e[`form_${r}`]||(e[`form_${r}`]={}),Object.assign(e[`form_${r}`],i(this.forms[t].value_changes))),r++;return n(e)}get all_valid(){let t,e=!0;for(t in this.forms)i(this.forms[t].valid)||(e=!1);return n(e)}get all_changed(){let t,e=!0;for(t in this.forms)i(this.forms[t].changed)||(e=!1);return n(e)}get all_pristine(){let t,e=!0;for(t in this.forms)i(this.forms[t].pristine)||(e=!1);return n(e)}}t.FieldConfig=s,t.FieldStepper=class{constructor(t,e){if(this.fields=t,e)this.active_step=e;else{let e;for(e in t)this.active_step=e}}get fields_valid(){let t,e=!0;for(t in this.fields)i(this.fields[t].errors)&&(e=!1);return n(e)}},t.Form=class{constructor(t,e,r){if(this.fields=[],this.validation_options={validator:async()=>[],on_events:new a,link_fields_to_model:"always",field_error_link_name:"property",options:{skipMissingProperties:!1,dismissDefaultMessages:!1,validationError:{target:!1,value:!1},forbidUnknownValues:!0,stopAtFirstError:!1}},this.errors=[],this.valid=n(!1),this.changed=n(!1),this.pristine=n(!0),this.loading=n(!1),this.value_changes=n({}),this.initial_state={model:void 0,errors:void 0},this.required_fields=[],this.buildFields=(t=this.model)=>{this.fields=u(t),this.required_fields=this.fields.filter((t=>t.required)).map((t=>t.name))},this.useField=t=>{const e=l(t.name,this.fields);e.node=t,this.validation_options.on_events&&h(e,this.validation_options.on_events,(t=>v(this,this.required_fields,e)))},this.validate=t=>v(this,this.required_fields,void 0,t),this.validateAsync=async t=>await v(this,this.required_fields,void 0,t),this.validateField=(t,e,r)=>{const n=l(t,this.fields);if(e){const r=new o(t,{error:e},{value:i(n.value)});this.errors.push(r),_(this.errors,this.fields,this.validation_options.field_error_link_name)}else v(this,this.required_fields,n,r)},this.attachCallbacks=(t,e,i)=>{if(Array.isArray(i)){i.map((t=>l(t,this.fields))).forEach((i=>{c(this,i,t,e,this.required_fields)}))}else{c(this,l(i,this.fields),t,e,this.required_fields)}},this.clearErrors=()=>{this.errors=[],this.fields.forEach((t=>{t.errors.set(void 0)}))},this.get=t=>l(t,this.fields),this.loadModel=(t,e=!1,i=!1)=>{if(e)this.model=t,this.buildFields();else{let e;for(e in this.model)this.model[e]=t[e];d(!1,this.fields,this.model)}return i&&this.updateInitialState(),this},this.attachRefData=t=>{const e=this.fields.filter((t=>t.ref_key));t?(this.refs=t,e.forEach((e=>{e.ref_key&&(e.options=t[e.ref_key])}))):this.refs&&e.forEach((t=>{t.ref_key&&this.refs&&(t.options=this.refs[t.ref_key])}))},this.destroy=()=>{this.fields&&this.fields.length>0&&this.fields.forEach((t=>{this.validation_options.on_events&&Object.keys(this.validation_options.on_events).forEach((e=>{t.node&&t.node.removeEventListener(e,(t=>{}))}))}))},this.reset=()=>{j(this,this.initial_state)},this.updateInitialState=()=>{O(this,this.initial_state),this.changed.set(!1)},this.setFieldOrder=t=>{t&&t.length>0&&(this.field_order=t,this.fields=x(this.field_order,this.fields))},this.setFieldAttributes=(t,e)=>{t&&(Array.isArray(t)?T(t,this.fields,e):T([t],this.fields,e))},r&&Object.assign(this,r),!t)throw new Error("Model is not valid. Please use a valid model.");if(this.model=t,this.buildFields(),!e)throw new Error("Please add a validator with ReturnType<Promise<ValidationError[]>>");Object.assign(this.validation_options,e),this.field_order&&this.setFieldOrder(this.field_order),this.refs&&this.attachRefData(),this.disabled_fields&&T(this.disabled_fields,this.fields,{disabled:!0,attributes:{disabled:!0}}),this.hidden_fields&&T(this.hidden_fields,this.fields,{hidden:!0}),O(this,this.initial_state)}},t.FormGroup=class extends P{constructor(t,e){super(t,e)}},t.FormManager=P,t.FormStepper=class extends P{constructor(t,e){super(t,e),this.active_step=0,this.next=()=>{"number"==typeof this.active_step&&this.active_step++},this.back=()=>{"number"==typeof this.active_step&&this.active_step--}}},t.OnEvents=a,t.ValidationError=o,t._addCallbackToField=c,t._attachEventListeners=h,t._buildFormFields=u,t._executeCallbacks=g,t._executeValidationEvent=v,t._get=l,t._handleValidationSideEffects=w,t._hanldeValueLinking=y,t._hasStateChanged=E,t._linkAllErrors=_,t._linkFieldErrors=p,t._linkValues=d,t._requiredFieldsValid=k,t._resetState=j,t._setFieldAttribute=F,t._setFieldAttributes=T,t._setFieldOrder=x,t._setInitialState=O,t._setValueChanges=f,t.field=function(t){return function(e,i){let r=Reflect.getMetadata("editableProperties",e)||[];r.indexOf(i)<0&&r.push(i),Reflect.defineMetadata("editableProperties",r,e),Reflect.defineMetadata("fieldConfig",t,e,i)}},Object.defineProperty(t,"__esModule",{value:!0})}));
//# sourceMappingURL=index.js.map
