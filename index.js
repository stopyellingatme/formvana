
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
(function (global, factory) {
    typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
    typeof define === 'function' && define.amd ? define(factory) :
    (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Formvana = factory());
}(this, (function () { 'use strict';

    function noop() { }
    const identity = x => x;
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
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
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty === undefined) {
                return lets;
            }
            if (typeof lets === 'object') {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return $$scope.dirty | lets;
        }
        return $$scope.dirty;
    }
    function update_slot(slot, slot_definition, ctx, $$scope, dirty, get_slot_changes_fn, get_slot_context_fn) {
        const slot_changes = get_slot_changes(slot_definition, $$scope, dirty, get_slot_changes_fn);
        if (slot_changes) {
            const slot_context = get_slot_context(slot_definition, ctx, $$scope, get_slot_context_fn);
            slot.p(slot_context, slot_changes);
        }
    }
    function set_store_value(store, ret, value = ret) {
        store.set(value);
        return ret;
    }
    function action_destroyer(action_result) {
        return action_result && is_function(action_result.destroy) ? action_result.destroy : noop;
    }

    const is_client = typeof window !== 'undefined';
    let now = is_client
        ? () => window.performance.now()
        : () => Date.now();
    let raf = is_client ? cb => requestAnimationFrame(cb) : noop;

    const tasks = new Set();
    function run_tasks(now) {
        tasks.forEach(task => {
            if (!task.c(now)) {
                tasks.delete(task);
                task.f();
            }
        });
        if (tasks.size !== 0)
            raf(run_tasks);
    }
    /**
     * Creates a new task that runs on each raf frame
     * until it returns a falsy value or is aborted
     */
    function loop(callback) {
        let task;
        if (tasks.size === 0)
            raf(run_tasks);
        return {
            promise: new Promise(fulfill => {
                tasks.add(task = { c: callback, f: fulfill });
            }),
            abort() {
                tasks.delete(task);
            }
        };
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element(name) {
        return document.createElement(name);
    }
    function svg_element(name) {
        return document.createElementNS('http://www.w3.org/2000/svg', name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function prevent_default(fn) {
        return function (event) {
            event.preventDefault();
            // @ts-ignore
            return fn.call(this, event);
        };
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function set_attributes(node, attributes) {
        // @ts-ignore
        const descriptors = Object.getOwnPropertyDescriptors(node.__proto__);
        for (const key in attributes) {
            if (attributes[key] == null) {
                node.removeAttribute(key);
            }
            else if (key === 'style') {
                node.style.cssText = attributes[key];
            }
            else if (key === '__value') {
                node.value = node[key] = attributes[key];
            }
            else if (descriptors[key] && descriptors[key].set) {
                node[key] = attributes[key];
            }
            else {
                attr(node, key, attributes[key]);
            }
        }
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_data(text, data) {
        data = '' + data;
        if (text.wholeText !== data)
            text.data = data;
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    // unfortunately this can't be a constant as that wouldn't be tree-shakeable
    // so we cache the result instead
    let crossorigin;
    function is_crossorigin() {
        if (crossorigin === undefined) {
            crossorigin = false;
            try {
                if (typeof window !== 'undefined' && window.parent) {
                    void window.parent.document;
                }
            }
            catch (error) {
                crossorigin = true;
            }
        }
        return crossorigin;
    }
    function add_resize_listener(node, fn) {
        const computed_style = getComputedStyle(node);
        if (computed_style.position === 'static') {
            node.style.position = 'relative';
        }
        const iframe = element('iframe');
        iframe.setAttribute('style', 'display: block; position: absolute; top: 0; left: 0; width: 100%; height: 100%; ' +
            'overflow: hidden; border: 0; opacity: 0; pointer-events: none; z-index: -1;');
        iframe.setAttribute('aria-hidden', 'true');
        iframe.tabIndex = -1;
        const crossorigin = is_crossorigin();
        let unsubscribe;
        if (crossorigin) {
            iframe.src = "data:text/html,<script>onresize=function(){parent.postMessage(0,'*')}</script>";
            unsubscribe = listen(window, 'message', (event) => {
                if (event.source === iframe.contentWindow)
                    fn();
            });
        }
        else {
            iframe.src = 'about:blank';
            iframe.onload = () => {
                unsubscribe = listen(iframe.contentWindow, 'resize', fn);
            };
        }
        append(node, iframe);
        return () => {
            if (crossorigin) {
                unsubscribe();
            }
            else if (unsubscribe && iframe.contentWindow) {
                unsubscribe();
            }
            detach(iframe);
        };
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    const active_docs = new Set();
    let active = 0;
    // https://github.com/darkskyapp/string-hash/blob/master/index.js
    function hash(str) {
        let hash = 5381;
        let i = str.length;
        while (i--)
            hash = ((hash << 5) - hash) ^ str.charCodeAt(i);
        return hash >>> 0;
    }
    function create_rule(node, a, b, duration, delay, ease, fn, uid = 0) {
        const step = 16.666 / duration;
        let keyframes = '{\n';
        for (let p = 0; p <= 1; p += step) {
            const t = a + (b - a) * ease(p);
            keyframes += p * 100 + `%{${fn(t, 1 - t)}}\n`;
        }
        const rule = keyframes + `100% {${fn(b, 1 - b)}}\n}`;
        const name = `__svelte_${hash(rule)}_${uid}`;
        const doc = node.ownerDocument;
        active_docs.add(doc);
        const stylesheet = doc.__svelte_stylesheet || (doc.__svelte_stylesheet = doc.head.appendChild(element('style')).sheet);
        const current_rules = doc.__svelte_rules || (doc.__svelte_rules = {});
        if (!current_rules[name]) {
            current_rules[name] = true;
            stylesheet.insertRule(`@keyframes ${name} ${rule}`, stylesheet.cssRules.length);
        }
        const animation = node.style.animation || '';
        node.style.animation = `${animation ? `${animation}, ` : ''}${name} ${duration}ms linear ${delay}ms 1 both`;
        active += 1;
        return name;
    }
    function delete_rule(node, name) {
        const previous = (node.style.animation || '').split(', ');
        const next = previous.filter(name
            ? anim => anim.indexOf(name) < 0 // remove specific animation
            : anim => anim.indexOf('__svelte') === -1 // remove all Svelte animations
        );
        const deleted = previous.length - next.length;
        if (deleted) {
            node.style.animation = next.join(', ');
            active -= deleted;
            if (!active)
                clear_rules();
        }
    }
    function clear_rules() {
        raf(() => {
            if (active)
                return;
            active_docs.forEach(doc => {
                const stylesheet = doc.__svelte_stylesheet;
                let i = stylesheet.cssRules.length;
                while (i--)
                    stylesheet.deleteRule(i);
                doc.__svelte_rules = {};
            });
            active_docs.clear();
        });
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }
    function createEventDispatcher() {
        const component = get_current_component();
        return (type, detail) => {
            const callbacks = component.$$.callbacks[type];
            if (callbacks) {
                // TODO are there situations where events could be dispatched
                // in a server (non-DOM) environment?
                const event = custom_event(type, detail);
                callbacks.slice().forEach(fn => {
                    fn.call(component, event);
                });
            }
        };
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }

    let promise;
    function wait() {
        if (!promise) {
            promise = Promise.resolve();
            promise.then(() => {
                promise = null;
            });
        }
        return promise;
    }
    function dispatch(node, direction, kind) {
        node.dispatchEvent(custom_event(`${direction ? 'intro' : 'outro'}${kind}`));
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }
    const null_transition = { duration: 0 };
    function create_in_transition(node, fn, params) {
        let config = fn(node, params);
        let running = false;
        let animation_name;
        let task;
        let uid = 0;
        function cleanup() {
            if (animation_name)
                delete_rule(node, animation_name);
        }
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 0, 1, duration, delay, easing, css, uid++);
            tick(0, 1);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            if (task)
                task.abort();
            running = true;
            add_render_callback(() => dispatch(node, true, 'start'));
            task = loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(1, 0);
                        dispatch(node, true, 'end');
                        cleanup();
                        return running = false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(t, 1 - t);
                    }
                }
                return running;
            });
        }
        let started = false;
        return {
            start() {
                if (started)
                    return;
                delete_rule(node);
                if (is_function(config)) {
                    config = config();
                    wait().then(go);
                }
                else {
                    go();
                }
            },
            invalidate() {
                started = false;
            },
            end() {
                if (running) {
                    cleanup();
                    running = false;
                }
            }
        };
    }
    function create_out_transition(node, fn, params) {
        let config = fn(node, params);
        let running = true;
        let animation_name;
        const group = outros;
        group.r += 1;
        function go() {
            const { delay = 0, duration = 300, easing = identity, tick = noop, css } = config || null_transition;
            if (css)
                animation_name = create_rule(node, 1, 0, duration, delay, easing, css);
            const start_time = now() + delay;
            const end_time = start_time + duration;
            add_render_callback(() => dispatch(node, false, 'start'));
            loop(now => {
                if (running) {
                    if (now >= end_time) {
                        tick(0, 1);
                        dispatch(node, false, 'end');
                        if (!--group.r) {
                            // this will result in `end()` being called,
                            // so we don't need to clean up here
                            run_all(group.c);
                        }
                        return false;
                    }
                    if (now >= start_time) {
                        const t = easing((now - start_time) / duration);
                        tick(1 - t, t);
                    }
                }
                return running;
            });
        }
        if (is_function(config)) {
            wait().then(() => {
                // @ts-ignore
                config = config();
                go();
            });
        }
        else {
            go();
        }
        return {
            end(reset) {
                if (reset && config.tick) {
                    config.tick(1, 0);
                }
                if (running) {
                    if (animation_name)
                        delete_rule(node, animation_name);
                    running = false;
                }
            }
        };
    }

    function get_spread_update(levels, updates) {
        const update = {};
        const to_null_out = {};
        const accounted_for = { $$scope: 1 };
        let i = levels.length;
        while (i--) {
            const o = levels[i];
            const n = updates[i];
            if (n) {
                for (const key in o) {
                    if (!(key in n))
                        to_null_out[key] = 1;
                }
                for (const key in n) {
                    if (!accounted_for[key]) {
                        update[key] = n[key];
                        accounted_for[key] = 1;
                    }
                }
                levels[i] = n;
            }
            else {
                for (const key in o) {
                    accounted_for[key] = 1;
                }
            }
        }
        for (const key in to_null_out) {
            if (!(key in update))
                update[key] = undefined;
        }
        return update;
    }
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init$2(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
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

    /*! *****************************************************************************
    Copyright (c) Microsoft Corporation.

    Permission to use, copy, modify, and/or distribute this software for any
    purpose with or without fee is hereby granted.

    THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
    REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
    AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
    INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
    LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
    OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
    PERFORMANCE OF THIS SOFTWARE.
    ***************************************************************************** */

    function __decorate(decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    }

    function __metadata(metadataKey, metadataValue) {
        if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(metadataKey, metadataValue);
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

    /**
     * This metadata interface contains information for custom validators.
     */
    var ConstraintMetadata = /** @class */ (function () {
        // -------------------------------------------------------------------------
        // Constructor
        // -------------------------------------------------------------------------
        function ConstraintMetadata(target, name, async) {
            if (async === void 0) { async = false; }
            this.target = target;
            this.name = name;
            this.async = async;
        }
        Object.defineProperty(ConstraintMetadata.prototype, "instance", {
            // -------------------------------------------------------------------------
            // Accessors
            // -------------------------------------------------------------------------
            /**
             * Instance of the target custom validation class which performs validation.
             */
            get: function () {
                return getFromContainer(this.target);
            },
            enumerable: false,
            configurable: true
        });
        return ConstraintMetadata;
    }());

    /**
     * Registers a custom validation decorator.
     */
    function registerDecorator(options) {
        var constraintCls;
        if (options.validator instanceof Function) {
            constraintCls = options.validator;
            var constraintClasses = getFromContainer(MetadataStorage).getTargetValidatorConstraints(options.validator);
            if (constraintClasses.length > 1) {
                throw "More than one implementation of ValidatorConstraintInterface found for validator on: " + options.target.name + ":" + options.propertyName;
            }
        }
        else {
            var validator_1 = options.validator;
            constraintCls = /** @class */ (function () {
                function CustomConstraint() {
                }
                CustomConstraint.prototype.validate = function (value, validationArguments) {
                    return validator_1.validate(value, validationArguments);
                };
                CustomConstraint.prototype.defaultMessage = function (validationArguments) {
                    if (validator_1.defaultMessage) {
                        return validator_1.defaultMessage(validationArguments);
                    }
                    return '';
                };
                return CustomConstraint;
            }());
            getMetadataStorage().addConstraintMetadata(new ConstraintMetadata(constraintCls, options.name, options.async));
        }
        var validationMetadataArgs = {
            type: options.name && ValidationTypes.isValid(options.name) ? options.name : ValidationTypes.CUSTOM_VALIDATION,
            target: options.target,
            propertyName: options.propertyName,
            validationOptions: options.options,
            constraintCls: constraintCls,
            constraints: options.constraints,
        };
        getMetadataStorage().addValidationMetadata(new ValidationMetadata(validationMetadataArgs));
    }

    function buildMessage(impl, validationOptions) {
        return function (validationArguments) {
            var eachPrefix = validationOptions && validationOptions.each ? 'each value in ' : '';
            return impl(eachPrefix, validationArguments);
        };
    }
    function ValidateBy(options, validationOptions) {
        return function (object, propertyName) {
            registerDecorator({
                name: options.name,
                target: object.constructor,
                propertyName: propertyName,
                options: validationOptions,
                constraints: options.constraints,
                validator: options.validator,
            });
        };
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function getDefaultExportFromCjs (x) {
    	return x && x.__esModule && Object.prototype.hasOwnProperty.call(x, 'default') ? x['default'] : x;
    }

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var assertString_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = assertString;

    function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

    function assertString(input) {
      var isString = typeof input === 'string' || input instanceof String;

      if (!isString) {
        var invalidType = _typeof(input);

        if (input === null) invalidType = 'null';else if (invalidType === 'object') invalidType = input.constructor.name;
        throw new TypeError("Expected a string but received a ".concat(invalidType));
      }
    }

    module.exports = exports.default;
    module.exports.default = exports.default;
    });

    var merge_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = merge;

    function merge() {
      var obj = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
      var defaults = arguments.length > 1 ? arguments[1] : undefined;

      for (var key in defaults) {
        if (typeof obj[key] === 'undefined') {
          obj[key] = defaults[key];
        }
      }

      return obj;
    }

    module.exports = exports.default;
    module.exports.default = exports.default;
    });

    var isByteLength_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = isByteLength;

    var _assertString = _interopRequireDefault(assertString_1);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

    /* eslint-disable prefer-rest-params */
    function isByteLength(str, options) {
      (0, _assertString.default)(str);
      var min;
      var max;

      if (_typeof(options) === 'object') {
        min = options.min || 0;
        max = options.max;
      } else {
        // backwards compatibility: isByteLength(str, min [, max])
        min = arguments[1];
        max = arguments[2];
      }

      var len = encodeURI(str).split(/%..|./).length - 1;
      return len >= min && (typeof max === 'undefined' || len <= max);
    }

    module.exports = exports.default;
    module.exports.default = exports.default;
    });

    var isFQDN_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = isFQDN;

    var _assertString = _interopRequireDefault(assertString_1);

    var _merge = _interopRequireDefault(merge_1);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    var default_fqdn_options = {
      require_tld: true,
      allow_underscores: false,
      allow_trailing_dot: false,
      allow_numeric_tld: false
    };

    function isFQDN(str, options) {
      (0, _assertString.default)(str);
      options = (0, _merge.default)(options, default_fqdn_options);
      /* Remove the optional trailing dot before checking validity */

      if (options.allow_trailing_dot && str[str.length - 1] === '.') {
        str = str.substring(0, str.length - 1);
      }

      var parts = str.split('.');
      var tld = parts[parts.length - 1];

      if (options.require_tld) {
        // disallow fqdns without tld
        if (parts.length < 2) {
          return false;
        }

        if (!/^([a-z\u00a1-\uffff]{2,}|xn[a-z0-9-]{2,})$/i.test(tld)) {
          return false;
        } // disallow spaces && special characers


        if (/[\s\u2002-\u200B\u202F\u205F\u3000\uFEFF\uDB40\uDC20\u00A9\uFFFD]/.test(tld)) {
          return false;
        }
      } // reject numeric TLDs


      if (!options.allow_numeric_tld && /^\d+$/.test(tld)) {
        return false;
      }

      return parts.every(function (part) {
        if (part.length > 63) {
          return false;
        }

        if (!/^[a-z_\u00a1-\uffff0-9-]+$/i.test(part)) {
          return false;
        } // disallow full-width chars


        if (/[\uff01-\uff5e]/.test(part)) {
          return false;
        } // disallow parts starting or ending with hyphen


        if (/^-|-$/.test(part)) {
          return false;
        }

        if (!options.allow_underscores && /_/.test(part)) {
          return false;
        }

        return true;
      });
    }

    module.exports = exports.default;
    module.exports.default = exports.default;
    });

    var isIP_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = isIP;

    var _assertString = _interopRequireDefault(assertString_1);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    /**
    11.3.  Examples

       The following addresses

                 fe80::1234 (on the 1st link of the node)
                 ff02::5678 (on the 5th link of the node)
                 ff08::9abc (on the 10th organization of the node)

       would be represented as follows:

                 fe80::1234%1
                 ff02::5678%5
                 ff08::9abc%10

       (Here we assume a natural translation from a zone index to the
       <zone_id> part, where the Nth zone of any scope is translated into
       "N".)

       If we use interface names as <zone_id>, those addresses could also be
       represented as follows:

                fe80::1234%ne0
                ff02::5678%pvc1.3
                ff08::9abc%interface10

       where the interface "ne0" belongs to the 1st link, "pvc1.3" belongs
       to the 5th link, and "interface10" belongs to the 10th organization.
     * * */
    var ipv4Maybe = /^(([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9]{2}|2[0-4][0-9]|25[0-5])$/;
    var ipv6Block = /^[0-9A-F]{1,4}$/i;

    function isIP(str) {
      var version = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : '';
      (0, _assertString.default)(str);
      version = String(version);

      if (!version) {
        return isIP(str, 4) || isIP(str, 6);
      } else if (version === '4') {
        if (!ipv4Maybe.test(str)) {
          return false;
        }

        var parts = str.split('.').sort(function (a, b) {
          return a - b;
        });
        return parts[3] <= 255;
      } else if (version === '6') {
        var addressAndZone = [str]; // ipv6 addresses could have scoped architecture
        // according to https://tools.ietf.org/html/rfc4007#section-11

        if (str.includes('%')) {
          addressAndZone = str.split('%');

          if (addressAndZone.length !== 2) {
            // it must be just two parts
            return false;
          }

          if (!addressAndZone[0].includes(':')) {
            // the first part must be the address
            return false;
          }

          if (addressAndZone[1] === '') {
            // the second part must not be empty
            return false;
          }
        }

        var blocks = addressAndZone[0].split(':');
        var foundOmissionBlock = false; // marker to indicate ::
        // At least some OS accept the last 32 bits of an IPv6 address
        // (i.e. 2 of the blocks) in IPv4 notation, and RFC 3493 says
        // that '::ffff:a.b.c.d' is valid for IPv4-mapped IPv6 addresses,
        // and '::a.b.c.d' is deprecated, but also valid.

        var foundIPv4TransitionBlock = isIP(blocks[blocks.length - 1], 4);
        var expectedNumberOfBlocks = foundIPv4TransitionBlock ? 7 : 8;

        if (blocks.length > expectedNumberOfBlocks) {
          return false;
        } // initial or final ::


        if (str === '::') {
          return true;
        } else if (str.substr(0, 2) === '::') {
          blocks.shift();
          blocks.shift();
          foundOmissionBlock = true;
        } else if (str.substr(str.length - 2) === '::') {
          blocks.pop();
          blocks.pop();
          foundOmissionBlock = true;
        }

        for (var i = 0; i < blocks.length; ++i) {
          // test for a :: which can not be at the string start/end
          // since those cases have been handled above
          if (blocks[i] === '' && i > 0 && i < blocks.length - 1) {
            if (foundOmissionBlock) {
              return false; // multiple :: in address
            }

            foundOmissionBlock = true;
          } else if (foundIPv4TransitionBlock && i === blocks.length - 1) ; else if (!ipv6Block.test(blocks[i])) {
            return false;
          }
        }

        if (foundOmissionBlock) {
          return blocks.length >= 1;
        }

        return blocks.length === expectedNumberOfBlocks;
      }

      return false;
    }

    module.exports = exports.default;
    module.exports.default = exports.default;
    });

    var isEmail_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = isEmail;

    var _assertString = _interopRequireDefault(assertString_1);

    var _merge = _interopRequireDefault(merge_1);

    var _isByteLength = _interopRequireDefault(isByteLength_1);

    var _isFQDN = _interopRequireDefault(isFQDN_1);

    var _isIP = _interopRequireDefault(isIP_1);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest(); }

    function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method."); }

    function _unsupportedIterableToArray(o, minLen) { if (!o) return; if (typeof o === "string") return _arrayLikeToArray(o, minLen); var n = Object.prototype.toString.call(o).slice(8, -1); if (n === "Object" && o.constructor) n = o.constructor.name; if (n === "Map" || n === "Set") return Array.from(o); if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen); }

    function _arrayLikeToArray(arr, len) { if (len == null || len > arr.length) len = arr.length; for (var i = 0, arr2 = new Array(len); i < len; i++) { arr2[i] = arr[i]; } return arr2; }

    function _iterableToArrayLimit(arr, i) { if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return; var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

    function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

    var default_email_options = {
      allow_display_name: false,
      require_display_name: false,
      allow_utf8_local_part: true,
      require_tld: true,
      blacklisted_chars: '',
      ignore_max_length: false
    };
    /* eslint-disable max-len */

    /* eslint-disable no-control-regex */

    var splitNameAddress = /^([^\x00-\x1F\x7F-\x9F\cX]+)<(.+)>$/i;
    var emailUserPart = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~]+$/i;
    var gmailUserPart = /^[a-z\d]+$/;
    var quotedEmailUser = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f]))*$/i;
    var emailUserUtf8Part = /^[a-z\d!#\$%&'\*\+\-\/=\?\^_`{\|}~\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]+$/i;
    var quotedEmailUserUtf8 = /^([\s\x01-\x08\x0b\x0c\x0e-\x1f\x7f\x21\x23-\x5b\x5d-\x7e\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]|(\\[\x01-\x09\x0b\x0c\x0d-\x7f\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))*$/i;
    var defaultMaxEmailLength = 254;
    /* eslint-enable max-len */

    /* eslint-enable no-control-regex */

    /**
     * Validate display name according to the RFC2822: https://tools.ietf.org/html/rfc2822#appendix-A.1.2
     * @param {String} display_name
     */

    function validateDisplayName(display_name) {
      var trim_quotes = display_name.match(/^"(.+)"$/i);
      var display_name_without_quotes = trim_quotes ? trim_quotes[1] : display_name; // display name with only spaces is not valid

      if (!display_name_without_quotes.trim()) {
        return false;
      } // check whether display name contains illegal character


      var contains_illegal = /[\.";<>]/.test(display_name_without_quotes);

      if (contains_illegal) {
        // if contains illegal characters,
        // must to be enclosed in double-quotes, otherwise it's not a valid display name
        if (!trim_quotes) {
          return false;
        } // the quotes in display name must start with character symbol \


        var all_start_with_back_slash = display_name_without_quotes.split('"').length === display_name_without_quotes.split('\\"').length;

        if (!all_start_with_back_slash) {
          return false;
        }
      }

      return true;
    }

    function isEmail(str, options) {
      (0, _assertString.default)(str);
      options = (0, _merge.default)(options, default_email_options);

      if (options.require_display_name || options.allow_display_name) {
        var display_email = str.match(splitNameAddress);

        if (display_email) {
          var display_name;

          var _display_email = _slicedToArray(display_email, 3);

          display_name = _display_email[1];
          str = _display_email[2];

          // sometimes need to trim the last space to get the display name
          // because there may be a space between display name and email address
          // eg. myname <address@gmail.com>
          // the display name is `myname` instead of `myname `, so need to trim the last space
          if (display_name.endsWith(' ')) {
            display_name = display_name.substr(0, display_name.length - 1);
          }

          if (!validateDisplayName(display_name)) {
            return false;
          }
        } else if (options.require_display_name) {
          return false;
        }
      }

      if (!options.ignore_max_length && str.length > defaultMaxEmailLength) {
        return false;
      }

      var parts = str.split('@');
      var domain = parts.pop();
      var user = parts.join('@');
      var lower_domain = domain.toLowerCase();

      if (options.domain_specific_validation && (lower_domain === 'gmail.com' || lower_domain === 'googlemail.com')) {
        /*
          Previously we removed dots for gmail addresses before validating.
          This was removed because it allows `multiple..dots@gmail.com`
          to be reported as valid, but it is not.
          Gmail only normalizes single dots, removing them from here is pointless,
          should be done in normalizeEmail
        */
        user = user.toLowerCase(); // Removing sub-address from username before gmail validation

        var username = user.split('+')[0]; // Dots are not included in gmail length restriction

        if (!(0, _isByteLength.default)(username.replace('.', ''), {
          min: 6,
          max: 30
        })) {
          return false;
        }

        var _user_parts = username.split('.');

        for (var i = 0; i < _user_parts.length; i++) {
          if (!gmailUserPart.test(_user_parts[i])) {
            return false;
          }
        }
      }

      if (options.ignore_max_length === false && (!(0, _isByteLength.default)(user, {
        max: 64
      }) || !(0, _isByteLength.default)(domain, {
        max: 254
      }))) {
        return false;
      }

      if (!(0, _isFQDN.default)(domain, {
        require_tld: options.require_tld
      })) {
        if (!options.allow_ip_domain) {
          return false;
        }

        if (!(0, _isIP.default)(domain)) {
          if (!domain.startsWith('[') || !domain.endsWith(']')) {
            return false;
          }

          var noBracketdomain = domain.substr(1, domain.length - 2);

          if (noBracketdomain.length === 0 || !(0, _isIP.default)(noBracketdomain)) {
            return false;
          }
        }
      }

      if (user[0] === '"') {
        user = user.slice(1, user.length - 1);
        return options.allow_utf8_local_part ? quotedEmailUserUtf8.test(user) : quotedEmailUser.test(user);
      }

      var pattern = options.allow_utf8_local_part ? emailUserUtf8Part : emailUserPart;
      var user_parts = user.split('.');

      for (var _i2 = 0; _i2 < user_parts.length; _i2++) {
        if (!pattern.test(user_parts[_i2])) {
          return false;
        }
      }

      if (options.blacklisted_chars) {
        if (user.search(new RegExp("[".concat(options.blacklisted_chars, "]+"), 'g')) !== -1) return false;
      }

      return true;
    }

    module.exports = exports.default;
    module.exports.default = exports.default;
    });

    var isEmailValidator = /*@__PURE__*/getDefaultExportFromCjs(isEmail_1);

    var IS_EMAIL = 'isEmail';
    /**
     * Checks if the string is an email.
     * If given value is not a string, then it returns false.
     */
    function isEmail(value, options) {
        return typeof value === 'string' && isEmailValidator(value, options);
    }
    /**
     * Checks if the string is an email.
     * If given value is not a string, then it returns false.
     */
    function IsEmail(options, validationOptions) {
        return ValidateBy({
            name: IS_EMAIL,
            constraints: [options],
            validator: {
                validate: function (value, args) { return isEmail(value, args.constraints[0]); },
                defaultMessage: buildMessage(function (eachPrefix) { return eachPrefix + '$property must be an email'; }, validationOptions),
            },
        }, validationOptions);
    }

    var isLength_1 = createCommonjsModule(function (module, exports) {

    Object.defineProperty(exports, "__esModule", {
      value: true
    });
    exports.default = isLength;

    var _assertString = _interopRequireDefault(assertString_1);

    function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

    function _typeof(obj) { "@babel/helpers - typeof"; if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

    /* eslint-disable prefer-rest-params */
    function isLength(str, options) {
      (0, _assertString.default)(str);
      var min;
      var max;

      if (_typeof(options) === 'object') {
        min = options.min || 0;
        max = options.max;
      } else {
        // backwards compatibility: isLength(str, min [, max])
        min = arguments[1] || 0;
        max = arguments[2];
      }

      var surrogatePairs = str.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]/g) || [];
      var len = str.length - surrogatePairs.length;
      return len >= min && (typeof max === 'undefined' || len <= max);
    }

    module.exports = exports.default;
    module.exports.default = exports.default;
    });

    var isLengthValidator = /*@__PURE__*/getDefaultExportFromCjs(isLength_1);

    var IS_LENGTH = 'isLength';
    /**
     * Checks if the string's length falls in a range. Note: this function takes into account surrogate pairs.
     * If given value is not a string, then it returns false.
     */
    function length(value, min, max) {
        return typeof value === 'string' && isLengthValidator(value, { min: min, max: max });
    }
    /**
     * Checks if the string's length falls in a range. Note: this function takes into account surrogate pairs.
     * If given value is not a string, then it returns false.
     */
    function Length(min, max, validationOptions) {
        return ValidateBy({
            name: IS_LENGTH,
            constraints: [min, max],
            validator: {
                validate: function (value, args) { return length(value, args.constraints[0], args.constraints[1]); },
                defaultMessage: buildMessage(function (eachPrefix, args) {
                    var isMinLength = args.constraints[0] !== null && args.constraints[0] !== undefined;
                    var isMaxLength = args.constraints[1] !== null && args.constraints[1] !== undefined;
                    if (isMinLength && (!args.value || args.value.length < args.constraints[0])) {
                        return eachPrefix + '$property must be longer than or equal to $constraint1 characters';
                    }
                    else if (isMaxLength && args.value.length > args.constraints[1]) {
                        return eachPrefix + '$property must be shorter than or equal to $constraint2 characters';
                    }
                    return (eachPrefix +
                        '$property must be longer than or equal to $constraint1 and shorter than or equal to $constraint2 characters');
                }, validationOptions),
            },
        }, validationOptions);
    }

    var IS_ENUM = 'isEnum';
    /**
     * Checks if a given value is an enum
     */
    function isEnum(value, entity) {
        var enumValues = Object.keys(entity).map(function (k) { return entity[k]; });
        return enumValues.indexOf(value) >= 0;
    }
    /**
     * Checks if a given value is an enum
     */
    function IsEnum(entity, validationOptions) {
        return ValidateBy({
            name: IS_ENUM,
            constraints: [entity],
            validator: {
                validate: function (value, args) { return isEnum(value, args.constraints[0]); },
                defaultMessage: buildMessage(function (eachPrefix) { return eachPrefix + '$property must be a valid enum value'; }, validationOptions),
            },
        }, validationOptions);
    }

    var IS_STRING = 'isString';
    /**
     * Checks if a given value is a real string.
     */
    function isString(value) {
        return value instanceof String || typeof value === 'string';
    }
    /**
     * Checks if a given value is a real string.
     */
    function IsString(validationOptions) {
        return ValidateBy({
            name: IS_STRING,
            validator: {
                validate: function (value, args) { return isString(value); },
                defaultMessage: buildMessage(function (eachPrefix) { return eachPrefix + '$property must be a string'; }, validationOptions),
            },
        }, validationOptions);
    }

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
    var LinkOnEvent;
    (function (LinkOnEvent) {
        LinkOnEvent[LinkOnEvent["Always"] = 0] = "Always";
        LinkOnEvent[LinkOnEvent["Valid"] = 1] = "Valid";
    })(LinkOnEvent || (LinkOnEvent = {}));
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
     * Performance is blazing with < 500 fields
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
            this.link_fields_to_model = LinkOnEvent.Always;
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
                this.link_fields_to_model === LinkOnEvent.Always && this.linkValues(true);
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
                this.link_fields_to_model === LinkOnEvent.Always && this.linkValues(true);
                return validate(this.model, this.validation_options).then((errors) => {
                    this.handleValidation(false, errors);
                    return errors;
                });
            };
            this.validateAsync = async () => {
                this.clearErrors();
                this.link_fields_to_model === LinkOnEvent.Always && this.linkValues(true);
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
                    this.link_fields_to_model === LinkOnEvent.Valid && this.linkValues(true);
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

    var BusinessStatus;
    (function (BusinessStatus) {
        BusinessStatus[BusinessStatus["ACTIVE"] = 0] = "ACTIVE";
        BusinessStatus[BusinessStatus["PENDING"] = 1] = "PENDING";
        BusinessStatus[BusinessStatus["SUSPENDED"] = 2] = "SUSPENDED";
        BusinessStatus[BusinessStatus["ARCHIVED"] = 3] = "ARCHIVED";
    })(BusinessStatus || (BusinessStatus = {}));
    var UserStatus;
    (function (UserStatus) {
        UserStatus[UserStatus["ACTIVE"] = 0] = "ACTIVE";
        UserStatus[UserStatus["DISABLED"] = 1] = "DISABLED";
    })(UserStatus || (UserStatus = {}));
    class Business {
        constructor(init) {
            if (init) {
                Object.keys(this).forEach((key) => {
                    if (init[key]) {
                        this[key] = init[key];
                    }
                });
            }
        }
    }
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 1",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 1" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_1", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 2",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 2" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_2", void 0);
    __decorate([
        editable,
        Length(10, 350),
        IsString(),
        field(new FieldConfig({
            el: "textarea",
            type: "text",
            label: "Description 3",
            required: false, hint: "This is a hint!",
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Description 3" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "description_3", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 4",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 4" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_4", void 0);
    __decorate([
        editable,
        Length(10, 90, { message: "Name must be between 10 and 90 characters" }),
        IsString(),
        field(new FieldConfig({
            el: "input",
            type: "text",
            label: "Name 5",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Name 5" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "name_5", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 6",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 6" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_6", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 7",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 7" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_7", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 8",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 8" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_8", void 0);
    __decorate([
        editable,
        Length(10, 350),
        IsString(),
        field(new FieldConfig({
            el: "textarea",
            type: "text",
            label: "Description 9",
            required: false, hint: "This is a hint!",
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Description 9" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "description_9", void 0);
    __decorate([
        editable,
        Length(10, 90, { message: "Name must be between 10 and 90 characters" }),
        IsString(),
        field(new FieldConfig({
            el: "input",
            type: "text",
            label: "Name 10",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Name 10" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "name_10", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 11",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 11" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_11", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 12",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 12" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_12", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 13",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 13" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_13", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 14",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 14" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_14", void 0);
    __decorate([
        editable,
        Length(10, 90, { message: "Name must be between 10 and 90 characters" }),
        IsString(),
        field(new FieldConfig({
            el: "input",
            type: "text",
            label: "Name 15",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Name 15" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "name_15", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 16",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 16" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_16", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 17",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 17" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_17", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 18",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 18" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_18", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 19",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 19" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_19", void 0);
    __decorate([
        editable,
        Length(10, 90, { message: "Name must be between 10 and 90 characters" }),
        IsString(),
        field(new FieldConfig({
            el: "input",
            type: "text",
            label: "Name 20",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Name 20" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "name_20", void 0);
    __decorate([
        editable,
        Length(10, 350),
        IsString(),
        field(new FieldConfig({
            el: "textarea",
            type: "text",
            label: "Description 21",
            required: false, hint: "This is a hint!",
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Description 21" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "description_21", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 22",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 22" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_22", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 23",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 23" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_23", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 24",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 24" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_24", void 0);
    __decorate([
        editable,
        Length(10, 90, { message: "Name must be between 10 and 90 characters" }),
        IsString(),
        field(new FieldConfig({
            el: "input",
            type: "text",
            label: "Name 25",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Name 25" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "name_25", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 26",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 26" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_26", void 0);
    __decorate([
        editable,
        Length(10, 350),
        IsString(),
        field(new FieldConfig({
            el: "textarea",
            type: "text",
            label: "Description 27",
            required: false, hint: "This is a hint!",
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Description 27" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "description_27", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 28",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 28" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_28", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 29",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 29" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_29", void 0);
    __decorate([
        editable,
        Length(10, 90, { message: "Name must be between 10 and 90 characters" }),
        IsString(),
        field(new FieldConfig({
            el: "input",
            type: "text",
            label: "Name 30",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Name 30" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "name_30", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 31",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 31" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_31", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 32",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 32" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_32", void 0);
    __decorate([
        editable,
        Length(10, 350),
        IsString(),
        field(new FieldConfig({
            el: "textarea",
            type: "text",
            label: "Description 33",
            required: false, hint: "This is a hint!",
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Description 33" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "description_33", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 34",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 34" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_34", void 0);
    __decorate([
        editable,
        Length(10, 90, { message: "Name must be between 10 and 90 characters" }),
        IsString(),
        field(new FieldConfig({
            el: "input",
            type: "text",
            label: "Name 35",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Name 35" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "name_35", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 36",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 36" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_36", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 37",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 37" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_37", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 38",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 38" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_38", void 0);
    __decorate([
        editable,
        Length(10, 350),
        IsString(),
        field(new FieldConfig({
            el: "textarea",
            type: "text",
            label: "Description 39",
            required: false, hint: "This is a hint!",
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Description 39" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "description_39", void 0);
    __decorate([
        editable,
        Length(10, 90, { message: "Name must be between 10 and 90 characters" }),
        IsString(),
        field(new FieldConfig({
            el: "input",
            type: "text",
            label: "Name 40",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Name 40" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "name_40", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 41",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 41" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_41", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 42",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 42" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_42", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 43",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 43" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_43", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 44",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 44" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_44", void 0);
    __decorate([
        editable,
        Length(10, 90, { message: "Name must be between 10 and 90 characters" }),
        IsString(),
        field(new FieldConfig({
            el: "input",
            type: "text",
            label: "Name 45",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Name 45" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "name_45", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 46",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 46" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_46", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 47",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 47" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_47", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 48",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 48" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_48", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 49",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 49" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_49", void 0);
    __decorate([
        editable,
        Length(10, 90, { message: "Name must be between 10 and 90 characters" }),
        IsString(),
        field(new FieldConfig({
            el: "input",
            type: "text",
            label: "Name 50",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Name 50" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "name_50", void 0);
    __decorate([
        editable,
        Length(10, 350),
        IsString(),
        field(new FieldConfig({
            el: "textarea",
            type: "text",
            label: "Description 51",
            required: false, hint: "This is a hint!",
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Description 51" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "description_51", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 52",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 52" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_52", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 53",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 53" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_53", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 54",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 54" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_54", void 0);
    __decorate([
        editable,
        Length(10, 90, { message: "Name must be between 10 and 90 characters" }),
        IsString(),
        field(new FieldConfig({
            el: "input",
            type: "text",
            label: "Name 55",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Name 55" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "name_55", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 56",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 56" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_56", void 0);
    __decorate([
        editable,
        Length(10, 350),
        IsString(),
        field(new FieldConfig({
            el: "textarea",
            type: "text",
            label: "Description 57",
            required: false, hint: "This is a hint!",
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Description 57" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "description_57", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 58",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 58" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_58", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 59",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 59" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_59", void 0);
    __decorate([
        editable,
        Length(10, 90, { message: "Name must be between 10 and 90 characters" }),
        IsString(),
        field(new FieldConfig({
            el: "input",
            type: "text",
            label: "Name 60",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Name 60" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "name_60", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 61",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 61" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_61", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 62",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 62" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_62", void 0);
    __decorate([
        editable,
        Length(10, 350),
        IsString(),
        field(new FieldConfig({
            el: "textarea",
            type: "text",
            label: "Description 63",
            required: false, hint: "This is a hint!",
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Description 63" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "description_63", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 64",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 64" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_64", void 0);
    __decorate([
        editable,
        Length(10, 90, { message: "Name must be between 10 and 90 characters" }),
        IsString(),
        field(new FieldConfig({
            el: "input",
            type: "text",
            label: "Name 65",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Name 65" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "name_65", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 66",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 66" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_66", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 67",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 67" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_67", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 68",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 68" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_68", void 0);
    __decorate([
        editable,
        Length(10, 350),
        IsString(),
        field(new FieldConfig({
            el: "textarea",
            type: "text",
            label: "Description 69",
            required: false, hint: "This is a hint!",
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Description 69" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "description_69", void 0);
    __decorate([
        editable,
        Length(10, 90, { message: "Name must be between 10 and 90 characters" }),
        IsString(),
        field(new FieldConfig({
            el: "input",
            type: "text",
            label: "Name 70",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Name 70" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "name_70", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 71",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 71" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_71", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 72",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 72" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_72", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 73",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 73" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_73", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 74",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 74" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_74", void 0);
    __decorate([
        editable,
        Length(10, 90, { message: "Name must be between 10 and 90 characters" }),
        IsString(),
        field(new FieldConfig({
            el: "input",
            type: "text",
            label: "Name 75",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Name 75" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "name_75", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 76",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 76" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_76", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 77",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 77" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_77", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 78",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 78" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_78", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 79",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 79" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_79", void 0);
    __decorate([
        editable,
        Length(10, 90, { message: "Name must be between 10 and 90 characters" }),
        IsString(),
        field(new FieldConfig({
            el: "input",
            type: "text",
            label: "Name 80",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Name 80" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "name_80", void 0);
    __decorate([
        editable,
        Length(10, 350),
        IsString(),
        field(new FieldConfig({
            el: "textarea",
            type: "text",
            label: "Description 81",
            required: false, hint: "This is a hint!",
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Description 81" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "description_81", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 82",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 82" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_82", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 83",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 83" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_83", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 84",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 84" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_84", void 0);
    __decorate([
        editable,
        Length(10, 90, { message: "Name must be between 10 and 90 characters" }),
        IsString(),
        field(new FieldConfig({
            el: "input",
            type: "text",
            label: "Name 85",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Name 85" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "name_85", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 86",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 86" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_86", void 0);
    __decorate([
        editable,
        Length(10, 350),
        IsString(),
        field(new FieldConfig({
            el: "textarea",
            type: "text",
            label: "Description 87",
            required: false, hint: "This is a hint!",
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Description 87" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "description_87", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 88",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 88" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_88", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 89",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 89" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_89", void 0);
    __decorate([
        editable,
        Length(10, 90, { message: "Name must be between 10 and 90 characters" }),
        IsString(),
        field(new FieldConfig({
            el: "input",
            type: "text",
            label: "Name 90",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Name 90" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "name_90", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 91",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 91" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_91", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 92",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 92" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_92", void 0);
    __decorate([
        editable,
        Length(10, 350),
        IsString(),
        field(new FieldConfig({
            el: "textarea",
            type: "text",
            label: "Description 93",
            required: false, hint: "This is a hint!",
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Description 93" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "description_93", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 94",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 94" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_94", void 0);
    __decorate([
        editable,
        Length(10, 90, { message: "Name must be between 10 and 90 characters" }),
        IsString(),
        field(new FieldConfig({
            el: "input",
            type: "text",
            label: "Name 95",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Name 95" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "name_95", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 96",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 96" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_96", void 0);
    __decorate([
        editable,
        IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
        field(new FieldConfig({
            el: "select",
            type: "select",
            label: "User Status 97",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "User Status 97" }, ref_key: "business_statuses",
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "user_status_97", void 0);
    __decorate([
        editable,
        IsEmail({}, { message: "Please enter a valid email address" }),
        field(new FieldConfig({
            el: "input",
            type: "email",
            label: "Email 98",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Email 98" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "email_98", void 0);
    __decorate([
        editable,
        Length(10, 350),
        IsString(),
        field(new FieldConfig({
            el: "textarea",
            type: "text",
            label: "Description 99",
            required: false, hint: "This is a hint!",
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Description 99" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "description_99", void 0);
    __decorate([
        editable,
        Length(10, 90, { message: "Name must be between 10 and 90 characters" }),
        IsString(),
        field(new FieldConfig({
            el: "input",
            type: "text",
            label: "Name 100",
            required: true,
            classname: "col-span-4 sm:col-span-2",
            attributes: { placeholder: "Name 100" },
        })),
        __metadata("design:type", Object)
    ], Business.prototype, "name_100", void 0);

    /**
     * Reference data can be accessed by (example):
     * ref_data["user_status"]
     * Returns array of {key, value}
     *
     * ref_data is an object (map-ish-thing) of
     * <string, array<key, value>>
     */
    const data = {
        user_statuses: [
            {
                label: "ACTIVE",
                value: 0,
            },
            {
                label: "DISABLED",
                value: 1,
            },
        ],
        business_statuses: [
            {
                label: "ACTIVE",
                value: 0,
            },
            {
                label: "PENDING",
                value: 1,
            },
            {
                label: "SUSPENDED",
                value: 2,
            },
            {
                label: "ARCHIVED",
                value: 3,
            },
        ],
    };
    function init$1() {
        const { subscribe, set, update } = writable(data);
        return {
            subscribe,
            set,
            setItems: (items) => update((s) => setItems(s, items)),
        };
    }
    const setItems = (state, items) => {
        state = items;
        return state;
    };
    const refs = init$1();

    /* package/svelte/LoadingIndicator.svelte generated by Svelte v3.35.0 */

    function create_if_block$8(ctx) {
    	let div1;
    	let div0;

    	return {
    		c() {
    			div1 = element("div");
    			div0 = element("div");
    			div0.innerHTML = `<svg version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="25 25 50 50"><circle cx="50" cy="50" r="20" fill="none" stroke-width="5" stroke="#4f46e5" stroke-linecap="round" stroke-dashoffset="0" stroke-dasharray="100, 200"><animateTransform attributeName="transform" attributeType="XML" type="rotate" from="0 50 50" to="360 50 50" dur="2.5s" repeatCount="indefinite"></animateTransform><animate attributeName="stroke-dashoffset" values="0;-30;-124" dur="1.25s" repeatCount="indefinite"></animate><animate attributeName="stroke-dasharray" values="0,200;110,200;110,200" dur="1.25s" repeatCount="indefinite"></animate></circle></svg>`;
    			attr(div0, "class", "fixed z-40 w-16 h-auto");
    			set_style(div1, "width", /*w*/ ctx[1] + "px");
    			set_style(div1, "height", /*h*/ ctx[2] + "px");
    			attr(div1, "class", "absolute inset-0 z-40 flex flex-wrap items-center justify-center object-cover w-full m-auto bg-gray-200 opacity-75 cursor-not-allowed");
    		},
    		m(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, div0);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*w*/ 2) {
    				set_style(div1, "width", /*w*/ ctx[1] + "px");
    			}

    			if (dirty & /*h*/ 4) {
    				set_style(div1, "height", /*h*/ ctx[2] + "px");
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(div1);
    		}
    	};
    }

    function create_fragment$a(ctx) {
    	let if_block_anchor;
    	let if_block = /*visible*/ ctx[0] && create_if_block$8(ctx);

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},
    		p(ctx, [dirty]) {
    			if (/*visible*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$8(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$9($$self, $$props, $$invalidate) {
    	let { visible = false } = $$props;
    	let { w } = $$props;
    	let { h } = $$props;

    	$$self.$$set = $$props => {
    		if ("visible" in $$props) $$invalidate(0, visible = $$props.visible);
    		if ("w" in $$props) $$invalidate(1, w = $$props.w);
    		if ("h" in $$props) $$invalidate(2, h = $$props.h);
    	};

    	return [visible, w, h];
    }

    class LoadingIndicator extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$2(this, options, instance$9, create_fragment$a, safe_not_equal, { visible: 0, w: 1, h: 2 });
    	}
    }

    /* package/svelte/tailwind/InputErrors.svelte generated by Svelte v3.35.0 */

    function get_each_context$2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[2] = list[i];
    	child_ctx[4] = i;
    	return child_ctx;
    }

    // (11:0) {#if errorsStore}
    function create_if_block$7(ctx) {
    	let each_1_anchor;
    	let each_value = /*errors*/ ctx[1];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
    	}

    	return {
    		c() {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		m(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert(target, each_1_anchor, anchor);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*errors*/ 2) {
    				each_value = /*errors*/ ctx[1];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$2(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$2(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach(each_1_anchor);
    		}
    	};
    }

    // (12:2) {#each errors as error, i}
    function create_each_block$2(ctx) {
    	let p;
    	let t_value = /*error*/ ctx[2].val + "";
    	let t;

    	return {
    		c() {
    			p = element("p");
    			t = text(t_value);
    			attr(p, "class", "mt-2 text-sm text-red-600");
    		},
    		m(target, anchor) {
    			insert(target, p, anchor);
    			append(p, t);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*errors*/ 2 && t_value !== (t_value = /*error*/ ctx[2].val + "")) set_data(t, t_value);
    		},
    		d(detaching) {
    			if (detaching) detach(p);
    		}
    	};
    }

    function create_fragment$9(ctx) {
    	let if_block_anchor;
    	let if_block = /*errorsStore*/ ctx[0] && create_if_block$7(ctx);

    	return {
    		c() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    		},
    		p(ctx, [dirty]) {
    			if (/*errorsStore*/ ctx[0]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$7(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$8($$self, $$props, $$invalidate) {
    	let errors;
    	let { errorsStore = null } = $$props;

    	$$self.$$set = $$props => {
    		if ("errorsStore" in $$props) $$invalidate(0, errorsStore = $$props.errorsStore);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*errorsStore*/ 1) {
    			$$invalidate(1, errors = Object.entries(errorsStore).map(([key, val]) => {
    				return { key, val };
    			}));
    		}
    	};

    	return [errorsStore, errors];
    }

    class InputErrors extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$2(this, options, instance$8, create_fragment$9, safe_not_equal, { errorsStore: 0 });
    	}
    }

    /* package/svelte/tailwind/Input.svelte generated by Svelte v3.35.0 */

    function create_if_block_1$4(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");

    			div.innerHTML = `<svg class="w-5 h-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012
            0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`;

    			attr(div, "class", "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (66:2) {#if errors}
    function create_if_block$6(ctx) {
    	let inputerrors;
    	let current;

    	inputerrors = new InputErrors({
    			props: { errorsStore: /*errors*/ ctx[5] }
    		});

    	return {
    		c() {
    			create_component(inputerrors.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(inputerrors, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const inputerrors_changes = {};
    			if (dirty & /*errors*/ 32) inputerrors_changes.errorsStore = /*errors*/ ctx[5];
    			inputerrors.$set(inputerrors_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(inputerrors.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(inputerrors.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(inputerrors, detaching);
    		}
    	};
    }

    function create_fragment$8(ctx) {
    	let div1;
    	let label_1;
    	let t0;
    	let t1;
    	let div0;
    	let input;
    	let t2;
    	let t3;
    	let current;
    	let mounted;
    	let dispose;

    	let input_levels = [
    		{ name: /*name*/ ctx[3] },
    		/*input_attributes*/ ctx[6],
    		{ class: /*cls*/ ctx[7] }
    	];

    	let input_data = {};

    	for (let i = 0; i < input_levels.length; i += 1) {
    		input_data = assign(input_data, input_levels[i]);
    	}

    	let if_block0 = /*errors*/ ctx[5] && create_if_block_1$4();
    	let if_block1 = /*errors*/ ctx[5] && create_if_block$6(ctx);

    	return {
    		c() {
    			div1 = element("div");
    			label_1 = element("label");
    			t0 = text(/*label*/ ctx[4]);
    			t1 = space();
    			div0 = element("div");
    			input = element("input");
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if (if_block1) if_block1.c();
    			attr(label_1, "for", /*name*/ ctx[3]);
    			attr(label_1, "class", "block text-sm font-medium leading-5 text-gray-700");
    			set_attributes(input, input_data);
    			attr(div0, "class", "relative mt-1 rounded-md shadow-sm");
    		},
    		m(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, label_1);
    			append(label_1, t0);
    			append(div1, t1);
    			append(div1, div0);
    			append(div0, input);
    			set_input_value(input, /*$valueStore*/ ctx[8]);
    			append(div0, t2);
    			if (if_block0) if_block0.m(div0, null);
    			append(div1, t3);
    			if (if_block1) if_block1.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(input, "input", /*input_input_handler*/ ctx[11]),
    					action_destroyer(/*useInput*/ ctx[2].call(null, input))
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (!current || dirty & /*label*/ 16) set_data(t0, /*label*/ ctx[4]);

    			if (!current || dirty & /*name*/ 8) {
    				attr(label_1, "for", /*name*/ ctx[3]);
    			}

    			set_attributes(input, input_data = get_spread_update(input_levels, [
    				(!current || dirty & /*name*/ 8) && { name: /*name*/ ctx[3] },
    				dirty & /*input_attributes*/ 64 && /*input_attributes*/ ctx[6],
    				(!current || dirty & /*cls*/ 128) && { class: /*cls*/ ctx[7] }
    			]));

    			if (dirty & /*$valueStore*/ 256 && input.value !== /*$valueStore*/ ctx[8]) {
    				set_input_value(input, /*$valueStore*/ ctx[8]);
    			}

    			if (/*errors*/ ctx[5]) {
    				if (if_block0) ; else {
    					if_block0 = create_if_block_1$4();
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*errors*/ ctx[5]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*errors*/ 32) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$6(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    let default_class$2 = "block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 appearance-none transition duration-150 ease-in-out rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5 disabled:cursor-not-allowed";
    let error_class$2 = "block w-full px-3 py-2 placeholder-red-300 border border-red-300 appearance-none transition text-red-900 duration-150 ease-in-out rounded-md focus:outline-none focus:ring-red-500 focus:shadow-outline-red focus:border-red-300 sm:text-sm sm:leading-5 disabled:cursor-not-allowed";

    function instance$7($$self, $$props, $$invalidate) {
    	let errors;
    	let input_attributes;
    	let cls;

    	let $errorsStore,
    		$$unsubscribe_errorsStore = noop,
    		$$subscribe_errorsStore = () => ($$unsubscribe_errorsStore(), $$unsubscribe_errorsStore = subscribe(errorsStore, $$value => $$invalidate(10, $errorsStore = $$value)), errorsStore);

    	let $valueStore,
    		$$unsubscribe_valueStore = noop,
    		$$subscribe_valueStore = () => ($$unsubscribe_valueStore(), $$unsubscribe_valueStore = subscribe(valueStore, $$value => $$invalidate(8, $valueStore = $$value)), valueStore);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_errorsStore());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_valueStore());
    	let { errorsStore = null } = $$props;
    	$$subscribe_errorsStore();
    	let { valueStore = null } = $$props;
    	$$subscribe_valueStore();
    	let { useInput = null } = $$props;
    	let { name } = $$props;
    	let { label } = $$props;
    	let { attrs = {} } = $$props;

    	function input_input_handler() {
    		$valueStore = this.value;
    		valueStore.set($valueStore);
    	}

    	$$self.$$set = $$props => {
    		if ("errorsStore" in $$props) $$subscribe_errorsStore($$invalidate(0, errorsStore = $$props.errorsStore));
    		if ("valueStore" in $$props) $$subscribe_valueStore($$invalidate(1, valueStore = $$props.valueStore));
    		if ("useInput" in $$props) $$invalidate(2, useInput = $$props.useInput);
    		if ("name" in $$props) $$invalidate(3, name = $$props.name);
    		if ("label" in $$props) $$invalidate(4, label = $$props.label);
    		if ("attrs" in $$props) $$invalidate(9, attrs = $$props.attrs);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$errorsStore*/ 1024) {
    			$$invalidate(5, errors = $errorsStore && $errorsStore.constraints);
    		}

    		if ($$self.$$.dirty & /*attrs*/ 512) {
    			$$invalidate(6, input_attributes = Object.assign(
    				{
    					autocomplete: "off",
    					autocorrect: "off",
    					spellcheck: false
    				},
    				attrs
    			));
    		}

    		if ($$self.$$.dirty & /*$errorsStore*/ 1024) {
    			$$invalidate(7, cls = $errorsStore && $errorsStore.constraints
    			? error_class$2
    			: default_class$2);
    		}
    	};

    	return [
    		errorsStore,
    		valueStore,
    		useInput,
    		name,
    		label,
    		errors,
    		input_attributes,
    		cls,
    		$valueStore,
    		attrs,
    		$errorsStore,
    		input_input_handler
    	];
    }

    class Input extends SvelteComponent {
    	constructor(options) {
    		super();

    		init$2(this, options, instance$7, create_fragment$8, safe_not_equal, {
    			errorsStore: 0,
    			valueStore: 1,
    			useInput: 2,
    			name: 3,
    			label: 4,
    			attrs: 9
    		});
    	}
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
    }

    function fade(node, { delay = 0, duration = 400, easing = identity } = {}) {
        const o = +getComputedStyle(node).opacity;
        return {
            delay,
            duration,
            easing,
            css: t => `opacity: ${t * o}`
        };
    }
    function fly(node, { delay = 0, duration = 400, easing = cubicOut, x = 0, y = 0, opacity = 0 } = {}) {
        const style = getComputedStyle(node);
        const target_opacity = +style.opacity;
        const transform = style.transform === 'none' ? '' : style.transform;
        const od = target_opacity * (1 - opacity);
        return {
            delay,
            duration,
            easing,
            css: (t, u) => `
			transform: ${transform} translate(${(1 - t) * x}px, ${(1 - t) * y}px);
			opacity: ${target_opacity - (od * u)}`
        };
    }

    /* package/svelte/tailwind/DropdownOption.svelte generated by Svelte v3.35.0 */

    function create_if_block$5(ctx) {
    	let span;
    	let svg;
    	let path;
    	let span_class_value;

    	return {
    		c() {
    			span = element("span");
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr(path, "fill-rule", "evenodd");
    			attr(path, "d", "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z");
    			attr(path, "clip-rule", "evenodd");
    			attr(svg, "class", "w-5 h-5");
    			attr(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr(svg, "viewBox", "0 0 20 20");
    			attr(svg, "fill", "currentColor");
    			attr(svg, "aria-hidden", "true");

    			attr(span, "class", span_class_value = "absolute inset-y-0 right-0 flex items-center pr-4 " + (/*highlighted*/ ctx[4] || /*selected*/ ctx[3]
    			? "text-white"
    			: "text-indigo-600"));
    		},
    		m(target, anchor) {
    			insert(target, span, anchor);
    			append(span, svg);
    			append(svg, path);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*highlighted, selected*/ 24 && span_class_value !== (span_class_value = "absolute inset-y-0 right-0 flex items-center pr-4 " + (/*highlighted*/ ctx[4] || /*selected*/ ctx[3]
    			? "text-white"
    			: "text-indigo-600"))) {
    				attr(span, "class", span_class_value);
    			}
    		},
    		d(detaching) {
    			if (detaching) detach(span);
    		}
    	};
    }

    function create_fragment$7(ctx) {
    	let li;
    	let span0;
    	let t0;
    	let t1;
    	let span1;
    	let t2;
    	let span1_class_value;
    	let t3;
    	let li_class_value;
    	let mounted;
    	let dispose;
    	let if_block = /*selected*/ ctx[3] && create_if_block$5(ctx);

    	return {
    		c() {
    			li = element("li");
    			span0 = element("span");
    			t0 = text(/*label*/ ctx[1]);
    			t1 = space();
    			span1 = element("span");
    			t2 = text(/*label*/ ctx[1]);
    			t3 = space();
    			if (if_block) if_block.c();
    			attr(span0, "class", "sr-only");
    			attr(span1, "class", span1_class_value = "block truncate " + (/*selected*/ ctx[3] ? "font-semibold" : "font-normal"));
    			attr(li, "id", /*id*/ ctx[0]);
    			attr(li, "role", "option");
    			li.value = /*value*/ ctx[2];

    			attr(li, "class", li_class_value = "relative z-40 py-2 pl-3  " + (/*highlighted*/ ctx[4] || /*selected*/ ctx[3]
    			? "text-white bg-indigo-600"
    			: "text-gray-900") + " cursor-pointer select-none pr-9");
    		},
    		m(target, anchor) {
    			insert(target, li, anchor);
    			append(li, span0);
    			append(span0, t0);
    			append(li, t1);
    			append(li, span1);
    			append(span1, t2);
    			append(li, t3);
    			if (if_block) if_block.m(li, null);

    			if (!mounted) {
    				dispose = [
    					listen(li, "click", function () {
    						if (is_function(/*dispatch*/ ctx[5]("click", /*value*/ ctx[2]))) /*dispatch*/ ctx[5]("click", /*value*/ ctx[2]).apply(this, arguments);
    					}),
    					listen(li, "mouseenter", /*toggleHighlight*/ ctx[6]),
    					listen(li, "mouseleave", /*toggleHighlight*/ ctx[6])
    				];

    				mounted = true;
    			}
    		},
    		p(new_ctx, [dirty]) {
    			ctx = new_ctx;
    			if (dirty & /*label*/ 2) set_data(t0, /*label*/ ctx[1]);
    			if (dirty & /*label*/ 2) set_data(t2, /*label*/ ctx[1]);

    			if (dirty & /*selected*/ 8 && span1_class_value !== (span1_class_value = "block truncate " + (/*selected*/ ctx[3] ? "font-semibold" : "font-normal"))) {
    				attr(span1, "class", span1_class_value);
    			}

    			if (/*selected*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block$5(ctx);
    					if_block.c();
    					if_block.m(li, null);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty & /*id*/ 1) {
    				attr(li, "id", /*id*/ ctx[0]);
    			}

    			if (dirty & /*value*/ 4) {
    				li.value = /*value*/ ctx[2];
    			}

    			if (dirty & /*highlighted, selected*/ 24 && li_class_value !== (li_class_value = "relative z-40 py-2 pl-3  " + (/*highlighted*/ ctx[4] || /*selected*/ ctx[3]
    			? "text-white bg-indigo-600"
    			: "text-gray-900") + " cursor-pointer select-none pr-9")) {
    				attr(li, "class", li_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d(detaching) {
    			if (detaching) detach(li);
    			if (if_block) if_block.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    function instance$6($$self, $$props, $$invalidate) {
    	const dispatch = createEventDispatcher();
    	const toggleHighlight = () => $$invalidate(4, highlighted = !highlighted);
    	let highlighted = false;
    	let { id } = $$props;
    	let { label } = $$props;
    	let { value } = $$props;
    	let { selected = false } = $$props;

    	$$self.$$set = $$props => {
    		if ("id" in $$props) $$invalidate(0, id = $$props.id);
    		if ("label" in $$props) $$invalidate(1, label = $$props.label);
    		if ("value" in $$props) $$invalidate(2, value = $$props.value);
    		if ("selected" in $$props) $$invalidate(3, selected = $$props.selected);
    	};

    	return [id, label, value, selected, highlighted, dispatch, toggleHighlight];
    }

    class DropdownOption extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$2(this, options, instance$6, create_fragment$7, safe_not_equal, { id: 0, label: 1, value: 2, selected: 3 });
    	}
    }

    /* package/svelte/tailwind/Dropdown.svelte generated by Svelte v3.35.0 */

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[5] = list[i].label;
    	child_ctx[23] = list[i].value;
    	child_ctx[25] = i;
    	return child_ctx;
    }

    // (131:4) {#if menu_open}
    function create_if_block_2$1(ctx) {
    	let div;
    	let ul;
    	let div_intro;
    	let div_outro;
    	let current;
    	let each_value = /*options*/ ctx[3];
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	return {
    		c() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr(ul, "tabindex", "-1");
    			attr(ul, "role", "listbox");
    			attr(ul, "aria-labelledby", "listbox-label");
    			attr(ul, "aria-activedescendant", "listbox-item-3");
    			attr(ul, "class", "py-1 overflow-auto text-base rounded-md max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm");
    			attr(div, "class", "absolute z-40 w-full mt-1 bg-white rounded-md shadow-lg");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    			append(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (dirty & /*options, selectedLabel, handleChange*/ 16648) {
    				each_value = /*options*/ ctx[3];
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(ul, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				if (!div_intro) div_intro = create_in_transition(div, fly, { duration: 75, y: -40 });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, fade, { duration: 75 });
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    			destroy_each(each_blocks, detaching);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};
    }

    // (144:10) {#each options as { label, value }
    function create_each_block$1(ctx) {
    	let dropdownoption;
    	let current;

    	function click_handler(...args) {
    		return /*click_handler*/ ctx[21](/*value*/ ctx[23], ...args);
    	}

    	dropdownoption = new DropdownOption({
    			props: {
    				id: "listbox-option-" + /*i*/ ctx[25],
    				label: /*label*/ ctx[5],
    				value: /*value*/ ctx[23],
    				selected: /*selectedLabel*/ ctx[8] === /*label*/ ctx[5]
    			}
    		});

    	dropdownoption.$on("click", click_handler);

    	return {
    		c() {
    			create_component(dropdownoption.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(dropdownoption, target, anchor);
    			current = true;
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;
    			const dropdownoption_changes = {};
    			if (dirty & /*options*/ 8) dropdownoption_changes.label = /*label*/ ctx[5];
    			if (dirty & /*options*/ 8) dropdownoption_changes.value = /*value*/ ctx[23];
    			if (dirty & /*selectedLabel, options*/ 264) dropdownoption_changes.selected = /*selectedLabel*/ ctx[8] === /*label*/ ctx[5];
    			dropdownoption.$set(dropdownoption_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(dropdownoption.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(dropdownoption.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(dropdownoption, detaching);
    		}
    	};
    }

    // (156:4) {#if errors}
    function create_if_block_1$3(ctx) {
    	let div;

    	return {
    		c() {
    			div = element("div");

    			div.innerHTML = `<svg class="w-5 h-5 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012
              0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clip-rule="evenodd"></path></svg>`;

    			attr(div, "class", "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none");
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(div);
    		}
    	};
    }

    // (178:2) {#if errors}
    function create_if_block$4(ctx) {
    	let inputerrors;
    	let current;

    	inputerrors = new InputErrors({
    			props: { errorsStore: /*errors*/ ctx[10] }
    		});

    	return {
    		c() {
    			create_component(inputerrors.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(inputerrors, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const inputerrors_changes = {};
    			if (dirty & /*errors*/ 1024) inputerrors_changes.errorsStore = /*errors*/ ctx[10];
    			inputerrors.$set(inputerrors_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(inputerrors.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(inputerrors.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(inputerrors, detaching);
    		}
    	};
    }

    function create_fragment$6(ctx) {
    	let div1;
    	let label_1;
    	let t0;
    	let t1;
    	let div0;
    	let button;
    	let span0;

    	let t2_value = (/*selectedLabel*/ ctx[8]
    	? /*selectedLabel*/ ctx[8]
    	: "Select") + "";

    	let t2;
    	let t3;
    	let span1;
    	let t4;
    	let t5;
    	let t6;
    	let current;
    	let mounted;
    	let dispose;

    	let button_levels = [
    		{ name: /*name*/ ctx[4] },
    		/*input_attributes*/ ctx[9],
    		{ value: /*selectedLabel*/ ctx[8] },
    		{ type: "button" },
    		{ "aria-haspopup": "listbox" },
    		{ "aria-expanded": "true" },
    		{ "aria-labelledby": "listbox-label" },
    		{ class: /*cls*/ ctx[11] }
    	];

    	let button_data = {};

    	for (let i = 0; i < button_levels.length; i += 1) {
    		button_data = assign(button_data, button_levels[i]);
    	}

    	let if_block0 = /*menu_open*/ ctx[6] && create_if_block_2$1(ctx);
    	let if_block1 = /*errors*/ ctx[10] && create_if_block_1$3();
    	let if_block2 = /*errors*/ ctx[10] && create_if_block$4(ctx);

    	return {
    		c() {
    			div1 = element("div");
    			label_1 = element("label");
    			t0 = text(/*label*/ ctx[5]);
    			t1 = space();
    			div0 = element("div");
    			button = element("button");
    			span0 = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			span1 = element("span");
    			span1.innerHTML = `<svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true"><path fill-rule="evenodd" d="M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clip-rule="evenodd"></path></svg>`;
    			t4 = space();
    			if (if_block0) if_block0.c();
    			t5 = space();
    			if (if_block1) if_block1.c();
    			t6 = space();
    			if (if_block2) if_block2.c();
    			attr(label_1, "for", /*name*/ ctx[4]);
    			attr(label_1, "class", "block text-sm font-medium leading-5 text-gray-700");
    			attr(span0, "class", "block truncate");
    			attr(span1, "class", "absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none");
    			set_attributes(button, button_data);
    			attr(div0, "class", "relative mt-1 rounded-md shadow-sm");
    		},
    		m(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, label_1);
    			append(label_1, t0);
    			append(div1, t1);
    			append(div1, div0);
    			append(div0, button);
    			append(button, span0);
    			append(span0, t2);
    			append(button, t3);
    			append(button, span1);
    			/*button_binding*/ ctx[20](button);
    			append(div0, t4);
    			if (if_block0) if_block0.m(div0, null);
    			append(div0, t5);
    			if (if_block1) if_block1.m(div0, null);
    			append(div1, t6);
    			if (if_block2) if_block2.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(window, "keydown", /*handleKeyDown*/ ctx[13]),
    					listen(button, "click", /*toggle*/ ctx[12]),
    					listen(button, "focus", /*handleFocus*/ ctx[15]),
    					listen(button, "blur", /*handleBlur*/ ctx[16]),
    					action_destroyer(/*useInput*/ ctx[0].call(null, button))
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (!current || dirty & /*label*/ 32) set_data(t0, /*label*/ ctx[5]);

    			if (!current || dirty & /*name*/ 16) {
    				attr(label_1, "for", /*name*/ ctx[4]);
    			}

    			if ((!current || dirty & /*selectedLabel*/ 256) && t2_value !== (t2_value = (/*selectedLabel*/ ctx[8]
    			? /*selectedLabel*/ ctx[8]
    			: "Select") + "")) set_data(t2, t2_value);

    			set_attributes(button, button_data = get_spread_update(button_levels, [
    				(!current || dirty & /*name*/ 16) && { name: /*name*/ ctx[4] },
    				dirty & /*input_attributes*/ 512 && /*input_attributes*/ ctx[9],
    				(!current || dirty & /*selectedLabel*/ 256) && { value: /*selectedLabel*/ ctx[8] },
    				{ type: "button" },
    				{ "aria-haspopup": "listbox" },
    				{ "aria-expanded": "true" },
    				{ "aria-labelledby": "listbox-label" },
    				(!current || dirty & /*cls*/ 2048) && { class: /*cls*/ ctx[11] }
    			]));

    			if (/*menu_open*/ ctx[6]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*menu_open*/ 64) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_2$1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div0, t5);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*errors*/ ctx[10]) {
    				if (if_block1) ; else {
    					if_block1 = create_if_block_1$3();
    					if_block1.c();
    					if_block1.m(div0, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (/*errors*/ ctx[10]) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*errors*/ 1024) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$4(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div1, null);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block2);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block0);
    			transition_out(if_block2);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div1);
    			/*button_binding*/ ctx[20](null);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    let default_class$1 = "bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
    let error_class$1 = "bg-white relative w-full text-red-900 border border-red-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm";

    function instance$5($$self, $$props, $$invalidate) {
    	let selectedLabel;
    	let input_attributes;
    	let errors;
    	let cls;

    	let $valueStore,
    		$$unsubscribe_valueStore = noop,
    		$$subscribe_valueStore = () => ($$unsubscribe_valueStore(), $$unsubscribe_valueStore = subscribe(valueStore, $$value => $$invalidate(18, $valueStore = $$value)), valueStore);

    	let $errorsStore,
    		$$unsubscribe_errorsStore = noop,
    		$$subscribe_errorsStore = () => ($$unsubscribe_errorsStore(), $$unsubscribe_errorsStore = subscribe(errorsStore, $$value => $$invalidate(19, $errorsStore = $$value)), errorsStore);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_valueStore());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_errorsStore());
    	let is_focused = false;
    	let menu_open = false;
    	const toggle = () => $$invalidate(6, menu_open = !menu_open);
    	let { useInput } = $$props;
    	let { valueStore } = $$props; // Used as active_index
    	$$subscribe_valueStore();
    	let { errorsStore } = $$props;
    	$$subscribe_errorsStore();
    	let { options } = $$props;
    	let { label } = $$props;
    	let { name } = $$props;
    	let { attrs = {} } = $$props;

    	onMount(() => {
    		
    	});

    	function handleKeyDown(e) {
    		if (!is_focused) return;

    		switch (e.key) {
    			case "ArrowDown":
    				$$invalidate(6, menu_open = true);
    				e.preventDefault();
    				if (options[$valueStore + 1] && options[$valueStore + 1].value) {
    					set_store_value(valueStore, $valueStore = $valueStore + 1, $valueStore);
    					node.dispatchEvent(new Event("change"));
    				}
    				break;
    			case "ArrowUp":
    				$$invalidate(6, menu_open = true);
    				e.preventDefault();
    				if (options[$valueStore - 1] && (options[$valueStore - 1].value || options[$valueStore - 1].value === 0)) {
    					set_store_value(valueStore, $valueStore = $valueStore - 1, $valueStore);
    					node.dispatchEvent(new Event("change"));
    				}
    				break;
    			case "Escape":
    				e.preventDefault();
    				if (is_focused) $$invalidate(6, menu_open = false);
    				break;
    		}
    	}

    	/**
     * Capture the element with useInput.
     * We need it for dispatching the attached validation (or clear) events
     */
    	let node;

    	const handleChange = (e, val) => {
    		set_store_value(valueStore, $valueStore = val, $valueStore);
    		node.dispatchEvent(new Event("change"));
    		$$invalidate(6, menu_open = false);
    	};

    	const handleFocus = e => {
    		is_focused = true;
    	}; // dispatch("focus", $valueStore);

    	const handleBlur = e => {
    		is_focused = false;

    		// dispatch("blur", $valueStore);
    		$$invalidate(6, menu_open = false);
    	};

    	function button_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			node = $$value;
    			$$invalidate(7, node);
    		});
    	}

    	const click_handler = (value, e) => handleChange(e, value);

    	$$self.$$set = $$props => {
    		if ("useInput" in $$props) $$invalidate(0, useInput = $$props.useInput);
    		if ("valueStore" in $$props) $$subscribe_valueStore($$invalidate(1, valueStore = $$props.valueStore));
    		if ("errorsStore" in $$props) $$subscribe_errorsStore($$invalidate(2, errorsStore = $$props.errorsStore));
    		if ("options" in $$props) $$invalidate(3, options = $$props.options);
    		if ("label" in $$props) $$invalidate(5, label = $$props.label);
    		if ("name" in $$props) $$invalidate(4, name = $$props.name);
    		if ("attrs" in $$props) $$invalidate(17, attrs = $$props.attrs);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*options, $valueStore*/ 262152) {
    			$$invalidate(8, selectedLabel = options && options[$valueStore] && options[$valueStore].label);
    		}

    		if ($$self.$$.dirty & /*attrs*/ 131072) {
    			$$invalidate(9, input_attributes = Object.assign({}, attrs));
    		}

    		if ($$self.$$.dirty & /*$errorsStore*/ 524288) {
    			$$invalidate(10, errors = $errorsStore && $errorsStore.constraints);
    		}

    		if ($$self.$$.dirty & /*$errorsStore*/ 524288) {
    			$$invalidate(11, cls = $errorsStore && $errorsStore.constraints
    			? error_class$1
    			: default_class$1);
    		}
    	};

    	return [
    		useInput,
    		valueStore,
    		errorsStore,
    		options,
    		name,
    		label,
    		menu_open,
    		node,
    		selectedLabel,
    		input_attributes,
    		errors,
    		cls,
    		toggle,
    		handleKeyDown,
    		handleChange,
    		handleFocus,
    		handleBlur,
    		attrs,
    		$valueStore,
    		$errorsStore,
    		button_binding,
    		click_handler
    	];
    }

    class Dropdown extends SvelteComponent {
    	constructor(options) {
    		super();

    		init$2(this, options, instance$5, create_fragment$6, safe_not_equal, {
    			useInput: 0,
    			valueStore: 1,
    			errorsStore: 2,
    			options: 3,
    			label: 5,
    			name: 4,
    			attrs: 17
    		});
    	}
    }

    /* package/svelte/tailwind/Textarea.svelte generated by Svelte v3.35.0 */

    function create_if_block_1$2(ctx) {
    	let p;
    	let t;

    	return {
    		c() {
    			p = element("p");
    			t = text(/*hint*/ ctx[4]);
    			attr(p, "class", "mt-2 text-sm text-gray-500");
    		},
    		m(target, anchor) {
    			insert(target, p, anchor);
    			append(p, t);
    		},
    		p(ctx, dirty) {
    			if (dirty & /*hint*/ 16) set_data(t, /*hint*/ ctx[4]);
    		},
    		d(detaching) {
    			if (detaching) detach(p);
    		}
    	};
    }

    // (52:2) {#if errors}
    function create_if_block$3(ctx) {
    	let inputerrors;
    	let current;

    	inputerrors = new InputErrors({
    			props: { errorsStore: /*errors*/ ctx[6] }
    		});

    	return {
    		c() {
    			create_component(inputerrors.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(inputerrors, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const inputerrors_changes = {};
    			if (dirty & /*errors*/ 64) inputerrors_changes.errorsStore = /*errors*/ ctx[6];
    			inputerrors.$set(inputerrors_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(inputerrors.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(inputerrors.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(inputerrors, detaching);
    		}
    	};
    }

    function create_fragment$5(ctx) {
    	let div1;
    	let label_1;
    	let t0;
    	let t1;
    	let div0;
    	let textarea;
    	let t2;
    	let t3;
    	let current;
    	let mounted;
    	let dispose;

    	let textarea_levels = [
    		{ name: /*name*/ ctx[5] },
    		/*input_attributes*/ ctx[7],
    		{ class: /*cls*/ ctx[8] }
    	];

    	let textarea_data = {};

    	for (let i = 0; i < textarea_levels.length; i += 1) {
    		textarea_data = assign(textarea_data, textarea_levels[i]);
    	}

    	let if_block0 = /*hint*/ ctx[4] && create_if_block_1$2(ctx);
    	let if_block1 = /*errors*/ ctx[6] && create_if_block$3(ctx);

    	return {
    		c() {
    			div1 = element("div");
    			label_1 = element("label");
    			t0 = text(/*label*/ ctx[3]);
    			t1 = space();
    			div0 = element("div");
    			textarea = element("textarea");
    			t2 = space();
    			if (if_block0) if_block0.c();
    			t3 = space();
    			if (if_block1) if_block1.c();
    			attr(label_1, "for", /*name*/ ctx[5]);
    			attr(label_1, "class", "block text-sm font-medium text-gray-700");
    			set_attributes(textarea, textarea_data);
    			attr(div0, "class", "mt-1");
    			attr(div1, "class", "sm:col-span-6");
    		},
    		m(target, anchor) {
    			insert(target, div1, anchor);
    			append(div1, label_1);
    			append(label_1, t0);
    			append(div1, t1);
    			append(div1, div0);
    			append(div0, textarea);
    			set_input_value(textarea, /*$valueStore*/ ctx[9]);
    			append(div0, t2);
    			if (if_block0) if_block0.m(div0, null);
    			append(div1, t3);
    			if (if_block1) if_block1.m(div1, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen(textarea, "input", /*textarea_input_handler*/ ctx[12]),
    					action_destroyer(/*useInput*/ ctx[2].call(null, textarea))
    				];

    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			if (!current || dirty & /*label*/ 8) set_data(t0, /*label*/ ctx[3]);

    			if (!current || dirty & /*name*/ 32) {
    				attr(label_1, "for", /*name*/ ctx[5]);
    			}

    			set_attributes(textarea, textarea_data = get_spread_update(textarea_levels, [
    				(!current || dirty & /*name*/ 32) && { name: /*name*/ ctx[5] },
    				dirty & /*input_attributes*/ 128 && /*input_attributes*/ ctx[7],
    				(!current || dirty & /*cls*/ 256) && { class: /*cls*/ ctx[8] }
    			]));

    			if (dirty & /*$valueStore*/ 512) {
    				set_input_value(textarea, /*$valueStore*/ ctx[9]);
    			}

    			if (/*hint*/ ctx[4]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$2(ctx);
    					if_block0.c();
    					if_block0.m(div0, null);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (/*errors*/ ctx[6]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*errors*/ 64) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block$3(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, null);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block1);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block1);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div1);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};
    }

    let default_class = "block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 appearance-none transition duration-150 ease-in-out rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5 disabled:cursor-not-allowed";
    let error_class = "block w-full px-3 py-2 placeholder-red-300 border border-red-300 appearance-none transition text-red-900 duration-150 ease-in-out rounded-md focus:outline-none focus:ring-red-500 focus:shadow-outline-red focus:border-red-300 sm:text-sm sm:leading-5 disabled:cursor-not-allowed";

    function instance$4($$self, $$props, $$invalidate) {
    	let errors;
    	let input_attributes;
    	let cls;

    	let $errorsStore,
    		$$unsubscribe_errorsStore = noop,
    		$$subscribe_errorsStore = () => ($$unsubscribe_errorsStore(), $$unsubscribe_errorsStore = subscribe(errorsStore, $$value => $$invalidate(11, $errorsStore = $$value)), errorsStore);

    	let $valueStore,
    		$$unsubscribe_valueStore = noop,
    		$$subscribe_valueStore = () => ($$unsubscribe_valueStore(), $$unsubscribe_valueStore = subscribe(valueStore, $$value => $$invalidate(9, $valueStore = $$value)), valueStore);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_errorsStore());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_valueStore());
    	let { valueStore } = $$props;
    	$$subscribe_valueStore();
    	let { errorsStore } = $$props;
    	$$subscribe_errorsStore();
    	let { useInput } = $$props;
    	let { label } = $$props;
    	let { hint } = $$props;
    	let { name } = $$props;
    	let { attrs = {} } = $$props;

    	function textarea_input_handler() {
    		$valueStore = this.value;
    		valueStore.set($valueStore);
    	}

    	$$self.$$set = $$props => {
    		if ("valueStore" in $$props) $$subscribe_valueStore($$invalidate(0, valueStore = $$props.valueStore));
    		if ("errorsStore" in $$props) $$subscribe_errorsStore($$invalidate(1, errorsStore = $$props.errorsStore));
    		if ("useInput" in $$props) $$invalidate(2, useInput = $$props.useInput);
    		if ("label" in $$props) $$invalidate(3, label = $$props.label);
    		if ("hint" in $$props) $$invalidate(4, hint = $$props.hint);
    		if ("name" in $$props) $$invalidate(5, name = $$props.name);
    		if ("attrs" in $$props) $$invalidate(10, attrs = $$props.attrs);
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$errorsStore*/ 2048) {
    			$$invalidate(6, errors = $errorsStore && $errorsStore.constraints);
    		}

    		if ($$self.$$.dirty & /*attrs*/ 1024) {
    			$$invalidate(7, input_attributes = Object.assign(
    				{
    					autocomplete: "off", // Default to 3 rows
    					autocorrect: "off",
    					spellcheck: true
    				},
    				attrs,
    				{ rows: 3 }
    			)); // Default to 3 rows
    		}

    		if ($$self.$$.dirty & /*$errorsStore*/ 2048) {
    			$$invalidate(8, cls = $errorsStore && $errorsStore.constraints
    			? error_class
    			: default_class);
    		}
    	};

    	return [
    		valueStore,
    		errorsStore,
    		useInput,
    		label,
    		hint,
    		name,
    		errors,
    		input_attributes,
    		cls,
    		$valueStore,
    		attrs,
    		$errorsStore,
    		textarea_input_handler
    	];
    }

    class Textarea extends SvelteComponent {
    	constructor(options) {
    		super();

    		init$2(this, options, instance$4, create_fragment$5, safe_not_equal, {
    			valueStore: 0,
    			errorsStore: 1,
    			useInput: 2,
    			label: 3,
    			hint: 4,
    			name: 5,
    			attrs: 10
    		});
    	}
    }

    /* package/svelte/tailwind/Field.svelte generated by Svelte v3.35.0 */

    function create_if_block_2(ctx) {
    	let textarea;
    	let current;

    	textarea = new Textarea({
    			props: {
    				name: /*field*/ ctx[0].name,
    				label: /*field*/ ctx[0].label,
    				hint: /*field*/ ctx[0].hint,
    				attrs: /*field*/ ctx[0].attributes,
    				valueStore: /*field*/ ctx[0].value,
    				errorsStore: /*field*/ ctx[0].errors,
    				useInput: /*$form*/ ctx[2].useField
    			}
    		});

    	return {
    		c() {
    			create_component(textarea.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(textarea, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const textarea_changes = {};
    			if (dirty & /*field*/ 1) textarea_changes.name = /*field*/ ctx[0].name;
    			if (dirty & /*field*/ 1) textarea_changes.label = /*field*/ ctx[0].label;
    			if (dirty & /*field*/ 1) textarea_changes.hint = /*field*/ ctx[0].hint;
    			if (dirty & /*field*/ 1) textarea_changes.attrs = /*field*/ ctx[0].attributes;
    			if (dirty & /*field*/ 1) textarea_changes.valueStore = /*field*/ ctx[0].value;
    			if (dirty & /*field*/ 1) textarea_changes.errorsStore = /*field*/ ctx[0].errors;
    			if (dirty & /*$form*/ 4) textarea_changes.useInput = /*$form*/ ctx[2].useField;
    			textarea.$set(textarea_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(textarea.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(textarea.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(textarea, detaching);
    		}
    	};
    }

    // (20:61) 
    function create_if_block_1$1(ctx) {
    	let dropdown;
    	let current;

    	dropdown = new Dropdown({
    			props: {
    				name: /*field*/ ctx[0].name,
    				label: /*field*/ ctx[0].label,
    				attrs: /*field*/ ctx[0].attributes,
    				options: /*field*/ ctx[0].options,
    				valueStore: /*field*/ ctx[0].value,
    				errorsStore: /*field*/ ctx[0].errors,
    				useInput: /*$form*/ ctx[2].useField
    			}
    		});

    	return {
    		c() {
    			create_component(dropdown.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(dropdown, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const dropdown_changes = {};
    			if (dirty & /*field*/ 1) dropdown_changes.name = /*field*/ ctx[0].name;
    			if (dirty & /*field*/ 1) dropdown_changes.label = /*field*/ ctx[0].label;
    			if (dirty & /*field*/ 1) dropdown_changes.attrs = /*field*/ ctx[0].attributes;
    			if (dirty & /*field*/ 1) dropdown_changes.options = /*field*/ ctx[0].options;
    			if (dirty & /*field*/ 1) dropdown_changes.valueStore = /*field*/ ctx[0].value;
    			if (dirty & /*field*/ 1) dropdown_changes.errorsStore = /*field*/ ctx[0].errors;
    			if (dirty & /*$form*/ 4) dropdown_changes.useInput = /*$form*/ ctx[2].useField;
    			dropdown.$set(dropdown_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(dropdown.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(dropdown.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(dropdown, detaching);
    		}
    	};
    }

    // (11:2) {#if field.el === "input"}
    function create_if_block$2(ctx) {
    	let input;
    	let current;

    	input = new Input({
    			props: {
    				name: /*field*/ ctx[0].name,
    				label: /*field*/ ctx[0].label,
    				attrs: /*field*/ ctx[0].attributes,
    				valueStore: /*field*/ ctx[0].value,
    				errorsStore: /*field*/ ctx[0].errors,
    				useInput: /*$form*/ ctx[2].useField
    			}
    		});

    	return {
    		c() {
    			create_component(input.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(input, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const input_changes = {};
    			if (dirty & /*field*/ 1) input_changes.name = /*field*/ ctx[0].name;
    			if (dirty & /*field*/ 1) input_changes.label = /*field*/ ctx[0].label;
    			if (dirty & /*field*/ 1) input_changes.attrs = /*field*/ ctx[0].attributes;
    			if (dirty & /*field*/ 1) input_changes.valueStore = /*field*/ ctx[0].value;
    			if (dirty & /*field*/ 1) input_changes.errorsStore = /*field*/ ctx[0].errors;
    			if (dirty & /*$form*/ 4) input_changes.useInput = /*$form*/ ctx[2].useField;
    			input.$set(input_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(input.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(input, detaching);
    		}
    	};
    }

    function create_fragment$4(ctx) {
    	let div;
    	let current_block_type_index;
    	let if_block;
    	let div_class_value;
    	let current;
    	const if_block_creators = [create_if_block$2, create_if_block_1$1, create_if_block_2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*field*/ ctx[0].el === "input") return 0;
    		if (/*field*/ ctx[0].el === "select" || /*field*/ ctx[0].el === "dropdown") return 1;
    		if (/*field*/ ctx[0].el === "textarea") return 2;
    		return -1;
    	}

    	if (~(current_block_type_index = select_block_type(ctx))) {
    		if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    	}

    	return {
    		c() {
    			div = element("div");
    			if (if_block) if_block.c();
    			attr(div, "class", div_class_value = /*field*/ ctx[0].classname);
    		},
    		m(target, anchor) {
    			insert(target, div, anchor);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].m(div, null);
    			}

    			current = true;
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if (~current_block_type_index) {
    					if_blocks[current_block_type_index].p(ctx, dirty);
    				}
    			} else {
    				if (if_block) {
    					group_outros();

    					transition_out(if_blocks[previous_block_index], 1, 1, () => {
    						if_blocks[previous_block_index] = null;
    					});

    					check_outros();
    				}

    				if (~current_block_type_index) {
    					if_block = if_blocks[current_block_type_index];

    					if (!if_block) {
    						if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    						if_block.c();
    					} else {
    						if_block.p(ctx, dirty);
    					}

    					transition_in(if_block, 1);
    					if_block.m(div, null);
    				} else {
    					if_block = null;
    				}
    			}

    			if (!current || dirty & /*field*/ 1 && div_class_value !== (div_class_value = /*field*/ ctx[0].classname)) {
    				attr(div, "class", div_class_value);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(div);

    			if (~current_block_type_index) {
    				if_blocks[current_block_type_index].d();
    			}
    		}
    	};
    }

    function instance$3($$self, $$props, $$invalidate) {
    	let $form,
    		$$unsubscribe_form = noop,
    		$$subscribe_form = () => ($$unsubscribe_form(), $$unsubscribe_form = subscribe(form, $$value => $$invalidate(2, $form = $$value)), form);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_form());
    	let { field } = $$props;
    	let { form } = $$props;
    	$$subscribe_form();

    	$$self.$$set = $$props => {
    		if ("field" in $$props) $$invalidate(0, field = $$props.field);
    		if ("form" in $$props) $$subscribe_form($$invalidate(1, form = $$props.form));
    	};

    	return [field, form, $form];
    }

    class Field extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$2(this, options, instance$3, create_fragment$4, safe_not_equal, { field: 0, form: 1 });
    	}
    }

    /* src/example/SettingsTemplate.svelte generated by Svelte v3.35.0 */

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[13] = list[i];
    	child_ctx[15] = i;
    	return child_ctx;
    }

    // (64:8) {#each $form.fields as field, i}
    function create_each_block(ctx) {
    	let field;
    	let current;

    	field = new Field({
    			props: {
    				field: /*field*/ ctx[13],
    				form: /*form*/ ctx[0]
    			}
    		});

    	return {
    		c() {
    			create_component(field.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(field, target, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const field_changes = {};
    			if (dirty & /*$form*/ 2) field_changes.field = /*field*/ ctx[13];
    			if (dirty & /*form*/ 1) field_changes.form = /*form*/ ctx[0];
    			field.$set(field_changes);
    		},
    		i(local) {
    			if (current) return;
    			transition_in(field.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(field.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(field, detaching);
    		}
    	};
    }

    // (78:6) {:else}
    function create_else_block_1(ctx) {
    	let button;

    	return {
    		c() {
    			button = element("button");
    			button.textContent = "Reset";
    			button.disabled = true;
    			attr(button, "class", "inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm cursor-not-allowed focus:outline-none");
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);
    		},
    		p: noop,
    		d(detaching) {
    			if (detaching) detach(button);
    		}
    	};
    }

    // (71:6) {#if $changed}
    function create_if_block_1(ctx) {
    	let button;
    	let mounted;
    	let dispose;

    	return {
    		c() {
    			button = element("button");
    			button.textContent = "Reset";
    			attr(button, "class", "inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900");
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);

    			if (!mounted) {
    				dispose = listen(button, "click", prevent_default(function () {
    					if (is_function(/*$form*/ ctx[1].reset)) /*$form*/ ctx[1].reset.apply(this, arguments);
    				}));

    				mounted = true;
    			}
    		},
    		p(new_ctx, dirty) {
    			ctx = new_ctx;
    		},
    		d(detaching) {
    			if (detaching) detach(button);
    			mounted = false;
    			dispose();
    		}
    	};
    }

    // (93:6) {:else}
    function create_else_block$1(ctx) {
    	let button;

    	return {
    		c() {
    			button = element("button");
    			button.textContent = "Save";
    			button.disabled = true;
    			attr(button, "class", "inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm cursor-not-allowed focus:outline-none");
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(button);
    		}
    	};
    }

    // (86:6) {#if $valid}
    function create_if_block$1(ctx) {
    	let button;

    	return {
    		c() {
    			button = element("button");
    			button.textContent = "Save";
    			attr(button, "type", "submit");
    			attr(button, "class", "inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900");
    		},
    		m(target, anchor) {
    			insert(target, button, anchor);
    		},
    		d(detaching) {
    			if (detaching) detach(button);
    		}
    	};
    }

    function create_fragment$3(ctx) {
    	let form_1;
    	let div4;
    	let loadingindicator;
    	let t0;
    	let div2;
    	let div0;
    	let t4;
    	let div1;
    	let t5;
    	let div3;
    	let t6;
    	let form_1_resize_listener;
    	let current;
    	let mounted;
    	let dispose;

    	loadingindicator = new LoadingIndicator({
    			props: {
    				visible: /*$loading*/ ctx[7],
    				w: /*fw*/ ctx[2],
    				h: /*fh*/ ctx[3]
    			}
    		});

    	let each_value = /*$form*/ ctx[1].fields;
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const out = i => transition_out(each_blocks[i], 1, 1, () => {
    		each_blocks[i] = null;
    	});

    	function select_block_type(ctx, dirty) {
    		if (/*$changed*/ ctx[8]) return create_if_block_1;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block0 = current_block_type(ctx);

    	function select_block_type_1(ctx, dirty) {
    		if (/*$valid*/ ctx[9]) return create_if_block$1;
    		return create_else_block$1;
    	}

    	let current_block_type_1 = select_block_type_1(ctx);
    	let if_block1 = current_block_type_1(ctx);

    	return {
    		c() {
    			form_1 = element("form");
    			div4 = element("div");
    			create_component(loadingindicator.$$.fragment);
    			t0 = space();
    			div2 = element("div");
    			div0 = element("div");

    			div0.innerHTML = `<h2 class="text-lg font-medium leading-6 text-gray-900">Business Settings</h2> 
        <p class="mt-1 text-sm text-gray-500">This is a test. This is only a test. Bleep bloop.</p>`;

    			t4 = space();
    			div1 = element("div");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t5 = space();
    			div3 = element("div");
    			if_block0.c();
    			t6 = space();
    			if_block1.c();
    			attr(div1, "class", "grid grid-cols-4 gap-6 mt-6");
    			attr(div2, "class", "px-4 py-6 bg-white sm:p-6");
    			attr(div3, "class", "px-4 py-3 text-right bg-gray-50 sm:px-6");
    			attr(div4, "class", "shadow sm:rounded-md");
    			add_render_callback(() => /*form_1_elementresize_handler*/ ctx[11].call(form_1));
    		},
    		m(target, anchor) {
    			insert(target, form_1, anchor);
    			append(form_1, div4);
    			mount_component(loadingindicator, div4, null);
    			append(div4, t0);
    			append(div4, div2);
    			append(div2, div0);
    			append(div2, t4);
    			append(div2, div1);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append(div4, t5);
    			append(div4, div3);
    			if_block0.m(div3, null);
    			append(div3, t6);
    			if_block1.m(div3, null);
    			form_1_resize_listener = add_resize_listener(form_1, /*form_1_elementresize_handler*/ ctx[11].bind(form_1));
    			current = true;

    			if (!mounted) {
    				dispose = listen(form_1, "submit", prevent_default(/*handleSubmit*/ ctx[10]));
    				mounted = true;
    			}
    		},
    		p(ctx, [dirty]) {
    			const loadingindicator_changes = {};
    			if (dirty & /*$loading*/ 128) loadingindicator_changes.visible = /*$loading*/ ctx[7];
    			if (dirty & /*fw*/ 4) loadingindicator_changes.w = /*fw*/ ctx[2];
    			if (dirty & /*fh*/ 8) loadingindicator_changes.h = /*fh*/ ctx[3];
    			loadingindicator.$set(loadingindicator_changes);

    			if (dirty & /*$form, form*/ 3) {
    				each_value = /*$form*/ ctx[1].fields;
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    						transition_in(each_blocks[i], 1);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						transition_in(each_blocks[i], 1);
    						each_blocks[i].m(div1, null);
    					}
    				}

    				group_outros();

    				for (i = each_value.length; i < each_blocks.length; i += 1) {
    					out(i);
    				}

    				check_outros();
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block0) {
    				if_block0.p(ctx, dirty);
    			} else {
    				if_block0.d(1);
    				if_block0 = current_block_type(ctx);

    				if (if_block0) {
    					if_block0.c();
    					if_block0.m(div3, t6);
    				}
    			}

    			if (current_block_type_1 !== (current_block_type_1 = select_block_type_1(ctx))) {
    				if_block1.d(1);
    				if_block1 = current_block_type_1(ctx);

    				if (if_block1) {
    					if_block1.c();
    					if_block1.m(div3, null);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(loadingindicator.$$.fragment, local);

    			for (let i = 0; i < each_value.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o(local) {
    			transition_out(loadingindicator.$$.fragment, local);
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(form_1);
    			destroy_component(loadingindicator);
    			destroy_each(each_blocks, detaching);
    			if_block0.d();
    			if_block1.d();
    			form_1_resize_listener();
    			mounted = false;
    			dispose();
    		}
    	};
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let valid;
    	let changed;
    	let loading;

    	let $form,
    		$$unsubscribe_form = noop,
    		$$subscribe_form = () => ($$unsubscribe_form(), $$unsubscribe_form = subscribe(form, $$value => $$invalidate(1, $form = $$value)), form);

    	let $loading,
    		$$unsubscribe_loading = noop,
    		$$subscribe_loading = () => ($$unsubscribe_loading(), $$unsubscribe_loading = subscribe(loading, $$value => $$invalidate(7, $loading = $$value)), loading);

    	let $changed,
    		$$unsubscribe_changed = noop,
    		$$subscribe_changed = () => ($$unsubscribe_changed(), $$unsubscribe_changed = subscribe(changed, $$value => $$invalidate(8, $changed = $$value)), changed);

    	let $valid,
    		$$unsubscribe_valid = noop,
    		$$subscribe_valid = () => ($$unsubscribe_valid(), $$unsubscribe_valid = subscribe(valid, $$value => $$invalidate(9, $valid = $$value)), valid);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_form());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_loading());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_changed());
    	$$self.$$.on_destroy.push(() => $$unsubscribe_valid());
    	const dispatch = createEventDispatcher();
    	let { form } = $$props;
    	$$subscribe_form();

    	const handleSubmit = e => {
    		console.log(e);
    		dispatch("event", e);
    	};

    	onMount(() => {
    		
    	});

    	onDestroy(() => {
    		// dispatch("destroy", true);
    		$form.destroy();
    	});

    	let fw;
    	let fh;

    	function form_1_elementresize_handler() {
    		fh = this.clientHeight;
    		fw = this.clientWidth;
    		$$invalidate(3, fh);
    		$$invalidate(2, fw);
    	}

    	$$self.$$set = $$props => {
    		if ("form" in $$props) $$subscribe_form($$invalidate(0, form = $$props.form));
    	};

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*$form*/ 2) {
    			/**
     * Well, it looks like we're gonna have to
     * make this thing handle the FormGroup and
     * FormStepper stuff.
     *
     * $: fields are_of_type {
     *      type: "default | group | stepper",
     *      item: FieldConfig | FieldGroup | FieldStepper
     *    }
     */
    			$$subscribe_valid($$invalidate(4, valid = $form.valid));
    		}

    		if ($$self.$$.dirty & /*$form*/ 2) {
    			$$subscribe_changed($$invalidate(5, changed = $form.changed));
    		}

    		if ($$self.$$.dirty & /*$form*/ 2) {
    			$$subscribe_loading($$invalidate(6, loading = $form.loading));
    		}
    	};

    	return [
    		form,
    		$form,
    		fw,
    		fh,
    		valid,
    		changed,
    		loading,
    		$loading,
    		$changed,
    		$valid,
    		handleSubmit,
    		form_1_elementresize_handler
    	];
    }

    class SettingsTemplate extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$2(this, options, instance$2, create_fragment$3, safe_not_equal, { form: 0 });
    	}
    }

    function initStore() {
        // Just gonna set up the form real quick...
        let form = new Form({
            model: new Business(),
            field_order: ["description", "status", "email", "name"],
            template: SettingsTemplate,
            validate_on_events: new OnEvents(true, { focus: false }),
            refs: get_store_value(refs),
        });
        // And add it to the store...
        const { subscribe, update } = form.storify();
        return {
            subscribe,
            updateState: (updates) => update((s) => updateState(s, updates)),
        };
    }
    const updateState = (state, updates) => {
        Object.assign(state, updates);
        return state;
    };
    /**
     * * External functionlaity below
     *    || || || || || || || ||
     *    \/ \/ \/ \/ \/ \/ \/ \/
     */
    const formState = initStore();
    const init = () => {
        get_store_value(formState).loading.set(true);
        setTimeout(() => {
            get_store_value(formState).loading.set(false);
            // get(formState).valid.set(true);
            // get(formState).validate();
        }, 1000);
        // setTimeout(() => {
        //   get(formState).updateInitialState();
        // }, 3000);
        // Update form with data fetched from DB
        // getBusiness(SOME_STATE.BUSINESS_ID).then((data) => {
        //   Get current form state
        //   const form = get(formState).loadData(new Business(data));
        //   formState.updateState({ form: form });
        // });
    };

    /* package/svelte/DynamicForm.svelte generated by Svelte v3.35.0 */
    const get_default_slot_changes = dirty => ({ form: dirty & /*form*/ 1 });
    const get_default_slot_context = ctx => ({ form: /*form*/ ctx[0] });

    // (37:0) {:else}
    function create_else_block(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], get_default_slot_context);

    	return {
    		c() {
    			if (default_slot) default_slot.c();
    		},
    		m(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, form*/ 9) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};
    }

    // (30:0) {#if $form.template}
    function create_if_block(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*$form*/ ctx[1].template;

    	function switch_props(ctx) {
    		return { props: { form: /*form*/ ctx[0] } };
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props(ctx));
    		switch_instance.$on("event", /*event_handler*/ ctx[5]);
    	}

    	return {
    		c() {
    			if (switch_instance) create_component(switch_instance.$$.fragment);
    			switch_instance_anchor = empty();
    		},
    		m(target, anchor) {
    			if (switch_instance) {
    				mount_component(switch_instance, target, anchor);
    			}

    			insert(target, switch_instance_anchor, anchor);
    			current = true;
    		},
    		p(ctx, dirty) {
    			const switch_instance_changes = {};
    			if (dirty & /*form*/ 1) switch_instance_changes.form = /*form*/ ctx[0];

    			if (switch_value !== (switch_value = /*$form*/ ctx[1].template)) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props(ctx));
    					switch_instance.$on("event", /*event_handler*/ ctx[5]);
    					create_component(switch_instance.$$.fragment);
    					transition_in(switch_instance.$$.fragment, 1);
    					mount_component(switch_instance, switch_instance_anchor.parentNode, switch_instance_anchor);
    				} else {
    					switch_instance = null;
    				}
    			} else if (switch_value) {
    				switch_instance.$set(switch_instance_changes);
    			}
    		},
    		i(local) {
    			if (current) return;
    			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(switch_instance_anchor);
    			if (switch_instance) destroy_component(switch_instance, detaching);
    		}
    	};
    }

    function create_fragment$2(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block, create_else_block];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*$form*/ ctx[1].template) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	return {
    		c() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p(ctx, [dirty]) {
    			let previous_block_index = current_block_type_index;
    			current_block_type_index = select_block_type(ctx);

    			if (current_block_type_index === previous_block_index) {
    				if_blocks[current_block_type_index].p(ctx, dirty);
    			} else {
    				group_outros();

    				transition_out(if_blocks[previous_block_index], 1, 1, () => {
    					if_blocks[previous_block_index] = null;
    				});

    				check_outros();
    				if_block = if_blocks[current_block_type_index];

    				if (!if_block) {
    					if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);
    					if_block.c();
    				} else {
    					if_block.p(ctx, dirty);
    				}

    				transition_in(if_block, 1);
    				if_block.m(if_block_anchor.parentNode, if_block_anchor);
    			}
    		},
    		i(local) {
    			if (current) return;
    			transition_in(if_block);
    			current = true;
    		},
    		o(local) {
    			transition_out(if_block);
    			current = false;
    		},
    		d(detaching) {
    			if_blocks[current_block_type_index].d(detaching);
    			if (detaching) detach(if_block_anchor);
    		}
    	};
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $form,
    		$$unsubscribe_form = noop,
    		$$subscribe_form = () => ($$unsubscribe_form(), $$unsubscribe_form = subscribe(form, $$value => $$invalidate(1, $form = $$value)), form);

    	$$self.$$.on_destroy.push(() => $$unsubscribe_form());
    	let { $$slots: slots = {}, $$scope } = $$props;
    	const dispatch = createEventDispatcher();
    	let { form } = $$props;
    	$$subscribe_form();

    	onMount(() => {
    		dispatch("mount", true);
    	});

    	onDestroy(() => {
    		dispatch("destroy", true);
    		$form.destroy();
    	});

    	const event_handler = e => dispatch(e.detail.type, e);

    	$$self.$$set = $$props => {
    		if ("form" in $$props) $$subscribe_form($$invalidate(0, form = $$props.form));
    		if ("$$scope" in $$props) $$invalidate(3, $$scope = $$props.$$scope);
    	};

    	return [form, $form, dispatch, $$scope, slots, event_handler];
    }

    class DynamicForm extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$2(this, options, instance$1, create_fragment$2, safe_not_equal, { form: 0 });
    	}
    }

    /* src/example/BusinessSettingsForm.svelte generated by Svelte v3.35.0 */

    function create_fragment$1(ctx) {
    	let dynamicform;
    	let current;
    	dynamicform = new DynamicForm({ props: { form: formState } });
    	dynamicform.$on("submit", /*submit_handler*/ ctx[0]);

    	return {
    		c() {
    			create_component(dynamicform.$$.fragment);
    		},
    		m(target, anchor) {
    			mount_component(dynamicform, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(dynamicform.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(dynamicform.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			destroy_component(dynamicform, detaching);
    		}
    	};
    }

    function instance($$self) {
    	onMount(() => {
    		setTimeout(
    			() => {
    				init();
    			},
    			0
    		);
    	});

    	const submit_handler = e => console.log("MADE IT HERE -- ", e);
    	return [submit_handler];
    }

    class BusinessSettingsForm extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$2(this, options, instance, create_fragment$1, safe_not_equal, {});
    	}
    }

    /* src/App.svelte generated by Svelte v3.35.0 */

    function create_fragment(ctx) {
    	let main;
    	let div1;
    	let div0;
    	let section;
    	let businesssettingsform;
    	let current;
    	businesssettingsform = new BusinessSettingsForm({});

    	return {
    		c() {
    			main = element("main");
    			div1 = element("div");
    			div0 = element("div");
    			section = element("section");
    			create_component(businesssettingsform.$$.fragment);
    			attr(div0, "class", "w-full space-y-6");
    			attr(div1, "class", "flex items-start justify-center");
    			attr(main, "class", "py-24 pb-10 mx-auto max-w-7xl lg:py-36 xl:py-36 2xl:py-36 md:py-24 lg:px-8");
    		},
    		m(target, anchor) {
    			insert(target, main, anchor);
    			append(main, div1);
    			append(div1, div0);
    			append(div0, section);
    			mount_component(businesssettingsform, section, null);
    			current = true;
    		},
    		p: noop,
    		i(local) {
    			if (current) return;
    			transition_in(businesssettingsform.$$.fragment, local);
    			current = true;
    		},
    		o(local) {
    			transition_out(businesssettingsform.$$.fragment, local);
    			current = false;
    		},
    		d(detaching) {
    			if (detaching) detach(main);
    			destroy_component(businesssettingsform);
    		}
    	};
    }

    class App extends SvelteComponent {
    	constructor(options) {
    		super();
    		init$2(this, options, null, create_fragment, safe_not_equal, {});
    	}
    }

    const app = new App({
    	target: document.body
    });

    return app;

})));
//# sourceMappingURL=index.js.map
