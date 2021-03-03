
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
function noop() { }
const identity = x => x;
function assign(tar, src) {
    // @ts-ignore
    for (const k in src)
        tar[k] = src[k];
    return tar;
}
function add_location(element, file, line, column, char) {
    element.__svelte_meta = {
        loc: { file, line, column, char }
    };
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
function validate_store(store, name) {
    if (store != null && typeof store.subscribe !== 'function') {
        throw new Error(`'${name}' is not a store with a 'subscribe' method`);
    }
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

const globals = (typeof window !== 'undefined'
    ? window
    : typeof globalThis !== 'undefined'
        ? globalThis
        : global);

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
function mount_component(component, target, anchor) {
    const { fragment, on_mount, on_destroy, after_update } = component.$$;
    fragment && fragment.m(target, anchor);
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
function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
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
        mount_component(component, options.target, options.anchor);
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

function dispatch_dev(type, detail) {
    document.dispatchEvent(custom_event(type, Object.assign({ version: '3.32.3' }, detail)));
}
function append_dev(target, node) {
    dispatch_dev('SvelteDOMInsert', { target, node });
    append(target, node);
}
function insert_dev(target, node, anchor) {
    dispatch_dev('SvelteDOMInsert', { target, node, anchor });
    insert(target, node, anchor);
}
function detach_dev(node) {
    dispatch_dev('SvelteDOMRemove', { node });
    detach(node);
}
function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
    const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
    if (has_prevent_default)
        modifiers.push('preventDefault');
    if (has_stop_propagation)
        modifiers.push('stopPropagation');
    dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
    const dispose = listen(node, event, handler, options);
    return () => {
        dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
        dispose();
    };
}
function attr_dev(node, attribute, value) {
    attr(node, attribute, value);
    if (value == null)
        dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
    else
        dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
}
function prop_dev(node, property, value) {
    node[property] = value;
    dispatch_dev('SvelteDOMSetProperty', { node, property, value });
}
function set_data_dev(text, data) {
    data = '' + data;
    if (text.wholeText === data)
        return;
    dispatch_dev('SvelteDOMSetData', { node: text, data });
    text.data = data;
}
function validate_each_argument(arg) {
    if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
        let msg = '{#each} only iterates over array-like objects.';
        if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
            msg += ' You can use a spread to convert this iterable into an array.';
        }
        throw new Error(msg);
    }
}
function validate_slots(name, slot, keys) {
    for (const slot_key of Object.keys(slot)) {
        if (!~keys.indexOf(slot_key)) {
            console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
        }
    }
}
/**
 * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
 */
class SvelteComponentDev extends SvelteComponent {
    constructor(options) {
        if (!options || (!options.target && !options.$$inline)) {
            throw new Error("'target' is a required option");
        }
        super();
    }
    $destroy() {
        super.$destroy();
        this.$destroy = () => {
            console.warn('Component was already destroyed'); // eslint-disable-line no-console
        };
    }
    $capture_state() { }
    $inject_state() { }
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

function createCommonjsModule(fn, basedir, module) {
	return module = {
	  path: basedir,
	  exports: {},
	  require: function (path, base) {
      return commonjsRequire(path, (base === undefined || base === null) ? module.path : base);
    }
	}, fn(module, module.exports), module.exports;
}

function commonjsRequire () {
	throw new Error('Dynamic requires are not currently supported by @rollup/plugin-commonjs');
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

var IS_EMAIL = 'isEmail';
/**
 * Checks if the string is an email.
 * If given value is not a string, then it returns false.
 */
function isEmail(value, options) {
    return typeof value === 'string' && isEmail_1(value, options);
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

var IS_LENGTH = 'isLength';
/**
 * Checks if the string's length falls in a range. Note: this function takes into account surrogate pairs.
 * If given value is not a string, then it returns false.
 */
function length(value, min, max) {
    return typeof value === 'string' && isLength_1(value, { min: min, max: max });
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
         * * String array of things like:
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
        if (this.type === "boolean" || this.type === "choice") {
            this.value.set(false);
        }
        if (this.el === "select" || this.el === "dropdown") {
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
        Object.assign(this, init);
        // If eventsOn if false, turn off all event listeners
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
 * Formvana Form Class
 * Form is NOT valid, initially.
 *
 * Recommended Use:
 *  - Initialize new Form(Partial<Form>{})
 *  - Set the model (if you didn't in the previous step)
 *  - (optionally) attach reference data
 *  - spread operator Form into writable store (e.g. writable({...form}); )
 *
 */
class Form {
    constructor(init) {
        /**
         * This is the model's initial state.
         */
        this.initial_state = null;
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
         * Underlying TS Model.
         * When model is set, call buildFields() to build the fields.
         */
        this.model = null;
        /**
         * Fields are built from the model's metadata using reflection.
         * If model is set, call buildFields().
         */
        this.fields = [];
        // Reference Data
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
         * You're not going to be held back by a simplistic classname structure!
         */
        this.template = null;
        /**
         * this.valid is a "store" so we can change the state of the variable
         * inside of the class and it (the change) be reflected outside
         * in the form context.
         */
        this.valid = writable(false);
        this.errors = [];
        this.loading = false;
        this.changed = writable(false);
        this.touched = false;
        this.validate_on_events = new OnEvents();
        this.clear_errors_on_events = new OnEvents(false);
        // When should we link the field values to the model values?
        this.link_fields_to_model = LinkOnEvent.Always;
        /**
         * * Here be Functions. Beware.
         * * Here be Functions. Beware.
         * * Here be Functions. Beware.
         */
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
                    console.log("FIELD CONFIG: ", config);
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
         */
        this.validateField = (field) => {
            // Link the input from the field to the model.
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
            this.link_fields_to_model === LinkOnEvent.Always && this.linkValues(true);
            return validate(this.model, this.validation_options).then((errors) => {
                this.handleValidation(false, errors);
            });
        };
        /**
         * Just pass in the reference data and let the field
         * configs do the rest.
         *
         ** Ref data must be in format:
         * {
         *  [field.name]: [
         *    { label: "Option 1", value: 0 },
         *    { label: "Option 2", value: 1 },
         *   ],
         *  [field.next_name]: [
         *    { label: "Next Option 1", value: 0 },
         *    { label: "Next Option 2", value: 1 },
         *   ],
         * }
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
            // else {
            //   const fields_with_ref_keys = this.fields.filter((f) => f.ref_key);
            //   fields_with_ref_keys.forEach((field) => {
            //     field.options = refs[field.ref_key];
            //   });
            // }
        };
        this.clearErrors = () => {
            this.errors = [];
            this.fields.forEach((field) => {
                field.errors.set(null);
            });
        };
        this.clearValues = () => {
            if (this.fields && this.fields.length > 0) {
                this.fields.forEach((field) => {
                    field.value.set(null);
                });
            }
        };
        // Resets to the inital state of the form.
        this.reset = () => {
            this.clearErrors();
            this.valid.set(false);
            this.changed.set(false);
            // const initial = JSON.parse(this.initial_state);
            Object.keys(this.model).forEach((key) => {
                this.model[key] = this.initial_state[key];
            });
            this.linkValues(false);
        };
        /**
         *! Make sure to call this when the component is unloaded/destroyed
         */
        this.destroy = () => {
            // Remove the event listeners
            if (this.fields && this.fields.length > 0) {
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
        // Link values FROM FIELDS toMODEL or MODEL to FIELDS
        this.linkValues = (toModel) => {
            let i = 0, len = this.fields.length;
            for (; len > i; ++i) {
                toModel
                    ? (this.model[this.fields[i].name] = get_store_value(this.fields[i].value))
                    : this.fields[i].value.set(this.model[this.fields[i].name]);
            }
        };
        /**
         * TODO: This needs a rework. Stringifying is not the most performant.
         */
        this.hasChanged = () => {
            // if (
            //   JSON.stringify(this.model) === this.initial_state &&
            //   this.errors.length === 0
            // ) {
            //   this.changed.set(false);
            //   return;
            // }
            if (Object.is(this.model, this.initial_state) && this.errors.length === 0) {
                this.changed.set(false);
                return;
            }
            this.changed.set(true);
        };
        this.linkFieldErrors = (errors, field) => {
            const error = errors.filter((e) => e.property === field.name);
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
                if (val) {
                    node.addEventListener(key, (ev) => {
                        this.validateField(field);
                    }, false);
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
            this.initial_state = JSON.parse(JSON.stringify(this.model));
            this.buildFields();
        }
        if (this.field_order && this.field_order.length > 0) {
            this.setOrder(this.field_order);
        }
        if (this.refs) {
            this.attachRefData();
        }
    }
    /**
     * Generate a Svelte Store from the current "this"
     */
    storify() {
        return writable(this);
    }
    updateInitialState() {
        if (this.model) {
            this.initial_state = JSON.parse(JSON.stringify(this.model));
        }
    }
    // #region PRIVATE FUNCTIONS
    handleValidation(isField = true, errors, field) {
        // There are errors!
        if (errors.length > 0) {
            this.valid.set(false); // Form is not valid
            this.errors = errors;
            // console.log("ERRORS: ", errors);
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
class Business {
    constructor(init) {
        this.name = "";
        this.email = "";
        this.description = "";
        this.avatar_url = "";
        // Address
        this.address_1 = "";
        this.address_2 = "";
        this.city = "";
        this.state = "";
        this.zip = "";
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
    Length(10, 90, { message: "Name must be between 10 and 90 characters" }),
    IsString(),
    field(new FieldConfig({
        el: "input",
        type: "text",
        label: "Business Name",
        required: true,
        classname: "col-span-4 sm:col-span-2",
        attributes: { placeholder: "Business Name" },
    })),
    __metadata("design:type", String)
], Business.prototype, "name", void 0);
__decorate([
    editable,
    IsEmail({}, { message: "Please enter a valid email address" }),
    field(new FieldConfig({
        el: "input",
        type: "email",
        label: "Email Address",
        required: true,
        classname: "col-span-4 sm:col-span-2",
        attributes: { placeholder: "Email Address" },
    })),
    __metadata("design:type", String)
], Business.prototype, "email", void 0);
__decorate([
    editable,
    Length(10, 350),
    field(new FieldConfig({
        el: "textarea",
        type: "text",
        label: "Description",
        required: true,
        classname: "col-span-4 sm:col-span-2",
        hint: "This will be seen publicly",
        attributes: { placeholder: "Description" },
    })),
    __metadata("design:type", String)
], Business.prototype, "description", void 0);
__decorate([
    editable,
    Length(5, 200),
    field(new FieldConfig({
        el: "input",
        type: "text",
        label: "Address Line 1",
        required: true,
        classname: "col-span-4 sm:col-span-2",
        attributes: { placeholder: "Address 1" },
        group: { name: "address", label: "Business Location" },
    })),
    __metadata("design:type", String)
], Business.prototype, "address_1", void 0);
__decorate([
    editable,
    IsEnum(BusinessStatus, { message: "Please choose a Business Status" }),
    field(new FieldConfig({
        el: "select",
        type: "select",
        label: "Business Status",
        required: true,
        classname: "col-span-4 sm:col-span-2",
        ref_key: "business_statuses",
    })),
    __metadata("design:type", Object)
], Business.prototype, "status", void 0);

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
            value: "ACTIVE",
        },
        {
            label: "DISABLED",
            value: "DISABLED",
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

/* package/svelte/LoadingIndicator.svelte generated by Svelte v3.32.3 */

const file = "package/svelte/LoadingIndicator.svelte";

// (7:0) {#if visible}
function create_if_block(ctx) {
	let div1;
	let div0;
	let svg;
	let circle;
	let animateTransform;
	let animate0;
	let animate1;

	const block = {
		c: function create() {
			div1 = element("div");
			div0 = element("div");
			svg = svg_element("svg");
			circle = svg_element("circle");
			animateTransform = svg_element("animateTransform");
			animate0 = svg_element("animate");
			animate1 = svg_element("animate");
			attr_dev(animateTransform, "attributeName", "transform");
			attr_dev(animateTransform, "attributeType", "XML");
			attr_dev(animateTransform, "type", "rotate");
			attr_dev(animateTransform, "from", "0 50 50");
			attr_dev(animateTransform, "to", "360 50 50");
			attr_dev(animateTransform, "dur", "2.5s");
			attr_dev(animateTransform, "repeatCount", "indefinite");
			add_location(animateTransform, file, 26, 20, 924);
			attr_dev(animate0, "attributeName", "stroke-dashoffset");
			attr_dev(animate0, "values", "0;-30;-124");
			attr_dev(animate0, "dur", "1.25s");
			attr_dev(animate0, "repeatCount", "indefinite");
			add_location(animate0, file, 34, 20, 1259);
			attr_dev(animate1, "attributeName", "stroke-dasharray");
			attr_dev(animate1, "values", "0,200;110,200;110,200");
			attr_dev(animate1, "dur", "1.25s");
			attr_dev(animate1, "repeatCount", "indefinite");
			add_location(animate1, file, 39, 20, 1478);
			attr_dev(circle, "cx", "50");
			attr_dev(circle, "cy", "50");
			attr_dev(circle, "r", "20");
			attr_dev(circle, "fill", "none");
			attr_dev(circle, "stroke-width", "5");
			attr_dev(circle, "stroke", "#4f46e5");
			attr_dev(circle, "stroke-linecap", "round");
			attr_dev(circle, "stroke-dashoffset", "0");
			attr_dev(circle, "stroke-dasharray", "100, 200");
			add_location(circle, file, 16, 16, 573);
			attr_dev(svg, "version", "1.1");
			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
			attr_dev(svg, "xmlns:xlink", "http://www.w3.org/1999/xlink");
			attr_dev(svg, "viewBox", "25 25 50 50");
			add_location(svg, file, 11, 12, 373);
			attr_dev(div0, "class", "fixed z-40 w-16 h-auto");
			add_location(div0, file, 10, 8, 324);
			set_style(div1, "width", /*w*/ ctx[1] + "px");
			set_style(div1, "height", /*h*/ ctx[2] + "px");
			attr_dev(div1, "class", "absolute inset-0 z-40 flex flex-wrap items-center justify-center object-cover w-full m-auto bg-gray-200 opacity-75 cursor-not-allowed");
			add_location(div1, file, 7, 4, 116);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, div0);
			append_dev(div0, svg);
			append_dev(svg, circle);
			append_dev(circle, animateTransform);
			append_dev(circle, animate0);
			append_dev(circle, animate1);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*w*/ 2) {
				set_style(div1, "width", /*w*/ ctx[1] + "px");
			}

			if (dirty & /*h*/ 4) {
				set_style(div1, "height", /*h*/ ctx[2] + "px");
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block.name,
		type: "if",
		source: "(7:0) {#if visible}",
		ctx
	});

	return block;
}

function create_fragment(ctx) {
	let if_block_anchor;
	let if_block = /*visible*/ ctx[0] && create_if_block(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*visible*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block(ctx);
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
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("LoadingIndicator", slots, []);
	let { visible = false } = $$props;
	let { w } = $$props;
	let { h } = $$props;
	const writable_props = ["visible", "w", "h"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<LoadingIndicator> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ("visible" in $$props) $$invalidate(0, visible = $$props.visible);
		if ("w" in $$props) $$invalidate(1, w = $$props.w);
		if ("h" in $$props) $$invalidate(2, h = $$props.h);
	};

	$$self.$capture_state = () => ({ visible, w, h });

	$$self.$inject_state = $$props => {
		if ("visible" in $$props) $$invalidate(0, visible = $$props.visible);
		if ("w" in $$props) $$invalidate(1, w = $$props.w);
		if ("h" in $$props) $$invalidate(2, h = $$props.h);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [visible, w, h];
}

class LoadingIndicator extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance, create_fragment, safe_not_equal, { visible: 0, w: 1, h: 2 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "LoadingIndicator",
			options,
			id: create_fragment.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*w*/ ctx[1] === undefined && !("w" in props)) {
			console.warn("<LoadingIndicator> was created without expected prop 'w'");
		}

		if (/*h*/ ctx[2] === undefined && !("h" in props)) {
			console.warn("<LoadingIndicator> was created without expected prop 'h'");
		}
	}

	get visible() {
		throw new Error("<LoadingIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set visible(value) {
		throw new Error("<LoadingIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get w() {
		throw new Error("<LoadingIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set w(value) {
		throw new Error("<LoadingIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get h() {
		throw new Error("<LoadingIndicator>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set h(value) {
		throw new Error("<LoadingIndicator>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* package/svelte/inputs/InputErrors.svelte generated by Svelte v3.32.3 */

const { Object: Object_1 } = globals;
const file$1 = "package/svelte/inputs/InputErrors.svelte";

function get_each_context(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[2] = list[i];
	child_ctx[4] = i;
	return child_ctx;
}

// (11:0) {#if errorsStore}
function create_if_block$1(ctx) {
	let each_1_anchor;
	let each_value = /*errors*/ ctx[1];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
	}

	const block = {
		c: function create() {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			each_1_anchor = empty();
		},
		m: function mount(target, anchor) {
			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(target, anchor);
			}

			insert_dev(target, each_1_anchor, anchor);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*errors*/ 2) {
				each_value = /*errors*/ ctx[1];
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
					} else {
						each_blocks[i] = create_each_block(child_ctx);
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
		d: function destroy(detaching) {
			destroy_each(each_blocks, detaching);
			if (detaching) detach_dev(each_1_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$1.name,
		type: "if",
		source: "(11:0) {#if errorsStore}",
		ctx
	});

	return block;
}

// (12:2) {#each errors as error, i}
function create_each_block(ctx) {
	let p;
	let t_value = /*error*/ ctx[2].val + "";
	let t;

	const block = {
		c: function create() {
			p = element("p");
			t = text(t_value);
			attr_dev(p, "class", "mt-2 text-sm text-red-600");
			add_location(p, file$1, 12, 4, 226);
		},
		m: function mount(target, anchor) {
			insert_dev(target, p, anchor);
			append_dev(p, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*errors*/ 2 && t_value !== (t_value = /*error*/ ctx[2].val + "")) set_data_dev(t, t_value);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(p);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block.name,
		type: "each",
		source: "(12:2) {#each errors as error, i}",
		ctx
	});

	return block;
}

function create_fragment$1(ctx) {
	let if_block_anchor;
	let if_block = /*errorsStore*/ ctx[0] && create_if_block$1(ctx);

	const block = {
		c: function create() {
			if (if_block) if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if (if_block) if_block.m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
		},
		p: function update(ctx, [dirty]) {
			if (/*errorsStore*/ ctx[0]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$1(ctx);
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
		d: function destroy(detaching) {
			if (if_block) if_block.d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$1.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$1($$self, $$props, $$invalidate) {
	let errors;
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("InputErrors", slots, []);
	let { errorsStore = null } = $$props;
	const writable_props = ["errorsStore"];

	Object_1.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<InputErrors> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ("errorsStore" in $$props) $$invalidate(0, errorsStore = $$props.errorsStore);
	};

	$$self.$capture_state = () => ({ errorsStore, errors });

	$$self.$inject_state = $$props => {
		if ("errorsStore" in $$props) $$invalidate(0, errorsStore = $$props.errorsStore);
		if ("errors" in $$props) $$invalidate(1, errors = $$props.errors);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*errorsStore*/ 1) {
			$$invalidate(1, errors = Object.entries(errorsStore).map(([key, val]) => {
				return { key, val };
			}));
		}
	};

	return [errorsStore, errors];
}

class InputErrors extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$1, create_fragment$1, safe_not_equal, { errorsStore: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "InputErrors",
			options,
			id: create_fragment$1.name
		});
	}

	get errorsStore() {
		throw new Error("<InputErrors>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set errorsStore(value) {
		throw new Error("<InputErrors>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* package/svelte/inputs/Input.svelte generated by Svelte v3.32.3 */

const { Object: Object_1$1 } = globals;
const file$2 = "package/svelte/inputs/Input.svelte";

// (44:4) {#if errors}
function create_if_block_1(ctx) {
	let div;
	let svg;
	let path;

	const block = {
		c: function create() {
			div = element("div");
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "fill-rule", "evenodd");
			attr_dev(path, "d", "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012\n            0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z");
			attr_dev(path, "clip-rule", "evenodd");
			add_location(path, file$2, 55, 10, 1779);
			attr_dev(svg, "class", "w-5 h-5 text-red-500");
			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
			attr_dev(svg, "viewBox", "0 0 20 20");
			attr_dev(svg, "fill", "currentColor");
			attr_dev(svg, "aria-hidden", "true");
			add_location(svg, file$2, 48, 8, 1581);
			attr_dev(div, "class", "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none");
			add_location(div, file$2, 45, 6, 1474);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, svg);
			append_dev(svg, path);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1.name,
		type: "if",
		source: "(44:4) {#if errors}",
		ctx
	});

	return block;
}

// (66:2) {#if errors}
function create_if_block$2(ctx) {
	let inputerrors;
	let current;

	inputerrors = new InputErrors({
			props: { errorsStore: /*errors*/ ctx[5] },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(inputerrors.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(inputerrors, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const inputerrors_changes = {};
			if (dirty & /*errors*/ 32) inputerrors_changes.errorsStore = /*errors*/ ctx[5];
			inputerrors.$set(inputerrors_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(inputerrors.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(inputerrors.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(inputerrors, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$2.name,
		type: "if",
		source: "(66:2) {#if errors}",
		ctx
	});

	return block;
}

function create_fragment$2(ctx) {
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

	let if_block0 = /*errors*/ ctx[5] && create_if_block_1(ctx);
	let if_block1 = /*errors*/ ctx[5] && create_if_block$2(ctx);

	const block = {
		c: function create() {
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
			attr_dev(label_1, "for", /*name*/ ctx[3]);
			attr_dev(label_1, "class", "block text-sm font-medium leading-5 text-gray-700");
			add_location(label_1, file$2, 32, 2, 1123);
			set_attributes(input, input_data);
			add_location(input, file$2, 36, 4, 1278);
			attr_dev(div0, "class", "relative mt-1 rounded-md shadow-sm");
			add_location(div0, file$2, 35, 2, 1225);
			add_location(div1, file$2, 31, 0, 1115);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, label_1);
			append_dev(label_1, t0);
			append_dev(div1, t1);
			append_dev(div1, div0);
			append_dev(div0, input);
			set_input_value(input, /*$valueStore*/ ctx[8]);
			append_dev(div0, t2);
			if (if_block0) if_block0.m(div0, null);
			append_dev(div1, t3);
			if (if_block1) if_block1.m(div1, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(input, "input", /*input_input_handler*/ ctx[11]),
					action_destroyer(/*useInput*/ ctx[2].call(null, input))
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*label*/ 16) set_data_dev(t0, /*label*/ ctx[4]);

			if (!current || dirty & /*name*/ 8) {
				attr_dev(label_1, "for", /*name*/ ctx[3]);
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
					if_block0 = create_if_block_1(ctx);
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
					if_block1 = create_if_block$2(ctx);
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
		i: function intro(local) {
			if (current) return;
			transition_in(if_block1);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block1);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$2.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$2($$self, $$props, $$invalidate) {
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
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Input", slots, []);
	let { errorsStore = null } = $$props;
	validate_store(errorsStore, "errorsStore");
	$$subscribe_errorsStore();
	let { valueStore = null } = $$props;
	validate_store(valueStore, "valueStore");
	$$subscribe_valueStore();
	let { useInput = null } = $$props;
	let { name } = $$props;
	let { label } = $$props;
	let { attrs = {} } = $$props;
	let default_class = "block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 appearance-none transition duration-150 ease-in-out rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5 disabled:cursor-not-allowed";
	let error_class = "block w-full px-3 py-2 placeholder-red-300 border border-red-300 appearance-none transition text-red-900 duration-150 ease-in-out rounded-md focus:outline-none focus:ring-red-500 focus:shadow-outline-red focus:border-red-300 sm:text-sm sm:leading-5 disabled:cursor-not-allowed";
	const writable_props = ["errorsStore", "valueStore", "useInput", "name", "label", "attrs"];

	Object_1$1.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Input> was created with unknown prop '${key}'`);
	});

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

	$$self.$capture_state = () => ({
		InputErrors,
		errorsStore,
		valueStore,
		useInput,
		name,
		label,
		attrs,
		default_class,
		error_class,
		errors,
		$errorsStore,
		input_attributes,
		cls,
		$valueStore
	});

	$$self.$inject_state = $$props => {
		if ("errorsStore" in $$props) $$subscribe_errorsStore($$invalidate(0, errorsStore = $$props.errorsStore));
		if ("valueStore" in $$props) $$subscribe_valueStore($$invalidate(1, valueStore = $$props.valueStore));
		if ("useInput" in $$props) $$invalidate(2, useInput = $$props.useInput);
		if ("name" in $$props) $$invalidate(3, name = $$props.name);
		if ("label" in $$props) $$invalidate(4, label = $$props.label);
		if ("attrs" in $$props) $$invalidate(9, attrs = $$props.attrs);
		if ("default_class" in $$props) $$invalidate(12, default_class = $$props.default_class);
		if ("error_class" in $$props) $$invalidate(13, error_class = $$props.error_class);
		if ("errors" in $$props) $$invalidate(5, errors = $$props.errors);
		if ("input_attributes" in $$props) $$invalidate(6, input_attributes = $$props.input_attributes);
		if ("cls" in $$props) $$invalidate(7, cls = $$props.cls);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

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
			? error_class
			: default_class);
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

class Input extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$2, create_fragment$2, safe_not_equal, {
			errorsStore: 0,
			valueStore: 1,
			useInput: 2,
			name: 3,
			label: 4,
			attrs: 9
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Input",
			options,
			id: create_fragment$2.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*name*/ ctx[3] === undefined && !("name" in props)) {
			console.warn("<Input> was created without expected prop 'name'");
		}

		if (/*label*/ ctx[4] === undefined && !("label" in props)) {
			console.warn("<Input> was created without expected prop 'label'");
		}
	}

	get errorsStore() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set errorsStore(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get valueStore() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set valueStore(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get useInput() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set useInput(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get name() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set name(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get label() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set label(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get attrs() {
		throw new Error("<Input>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set attrs(value) {
		throw new Error("<Input>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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

/* package/svelte/inputs/DropdownOption.svelte generated by Svelte v3.32.3 */
const file$3 = "package/svelte/inputs/DropdownOption.svelte";

// (30:2) {#if selected}
function create_if_block$3(ctx) {
	let span;
	let svg;
	let path;
	let span_class_value;

	const block = {
		c: function create() {
			span = element("span");
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "fill-rule", "evenodd");
			attr_dev(path, "d", "M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z");
			attr_dev(path, "clip-rule", "evenodd");
			add_location(path, file$3, 43, 8, 1088);
			attr_dev(svg, "class", "w-5 h-5");
			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
			attr_dev(svg, "viewBox", "0 0 20 20");
			attr_dev(svg, "fill", "currentColor");
			attr_dev(svg, "aria-hidden", "true");
			add_location(svg, file$3, 36, 6, 917);

			attr_dev(span, "class", span_class_value = "absolute inset-y-0 right-0 flex items-center pr-4 " + (/*highlighted*/ ctx[4]
			? "text-white"
			: "text-indigo-600"));

			add_location(span, file$3, 30, 4, 734);
		},
		m: function mount(target, anchor) {
			insert_dev(target, span, anchor);
			append_dev(span, svg);
			append_dev(svg, path);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*highlighted*/ 16 && span_class_value !== (span_class_value = "absolute inset-y-0 right-0 flex items-center pr-4 " + (/*highlighted*/ ctx[4]
			? "text-white"
			: "text-indigo-600"))) {
				attr_dev(span, "class", span_class_value);
			}
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(span);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$3.name,
		type: "if",
		source: "(30:2) {#if selected}",
		ctx
	});

	return block;
}

function create_fragment$3(ctx) {
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
	let if_block = /*selected*/ ctx[3] && create_if_block$3(ctx);

	const block = {
		c: function create() {
			li = element("li");
			span0 = element("span");
			t0 = text(/*value*/ ctx[2]);
			t1 = space();
			span1 = element("span");
			t2 = text(/*label*/ ctx[1]);
			t3 = space();
			if (if_block) if_block.c();
			attr_dev(span0, "class", "sr-only");
			add_location(span0, file$3, 25, 2, 577);
			attr_dev(span1, "class", span1_class_value = "block truncate " + (/*selected*/ ctx[3] ? "font-semibold" : "font-normal"));
			add_location(span1, file$3, 26, 2, 616);
			attr_dev(li, "id", /*id*/ ctx[0]);
			attr_dev(li, "role", "option");
			li.value = /*value*/ ctx[2];

			attr_dev(li, "class", li_class_value = "relative z-40 py-2 pl-3  " + (/*highlighted*/ ctx[4]
			? "text-white bg-indigo-600"
			: "text-gray-900") + " cursor-pointer select-none pr-9");

			add_location(li, file$3, 14, 0, 294);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, li, anchor);
			append_dev(li, span0);
			append_dev(span0, t0);
			append_dev(li, t1);
			append_dev(li, span1);
			append_dev(span1, t2);
			append_dev(li, t3);
			if (if_block) if_block.m(li, null);

			if (!mounted) {
				dispose = [
					listen_dev(
						li,
						"click",
						function () {
							if (is_function(/*dispatch*/ ctx[5]("click", /*value*/ ctx[2]))) /*dispatch*/ ctx[5]("click", /*value*/ ctx[2]).apply(this, arguments);
						},
						false,
						false,
						false
					),
					listen_dev(li, "mouseenter", /*toggleHighlight*/ ctx[6], false, false, false),
					listen_dev(li, "mouseleave", /*toggleHighlight*/ ctx[6], false, false, false)
				];

				mounted = true;
			}
		},
		p: function update(new_ctx, [dirty]) {
			ctx = new_ctx;
			if (dirty & /*value*/ 4) set_data_dev(t0, /*value*/ ctx[2]);
			if (dirty & /*label*/ 2) set_data_dev(t2, /*label*/ ctx[1]);

			if (dirty & /*selected*/ 8 && span1_class_value !== (span1_class_value = "block truncate " + (/*selected*/ ctx[3] ? "font-semibold" : "font-normal"))) {
				attr_dev(span1, "class", span1_class_value);
			}

			if (/*selected*/ ctx[3]) {
				if (if_block) {
					if_block.p(ctx, dirty);
				} else {
					if_block = create_if_block$3(ctx);
					if_block.c();
					if_block.m(li, null);
				}
			} else if (if_block) {
				if_block.d(1);
				if_block = null;
			}

			if (dirty & /*id*/ 1) {
				attr_dev(li, "id", /*id*/ ctx[0]);
			}

			if (dirty & /*value*/ 4) {
				prop_dev(li, "value", /*value*/ ctx[2]);
			}

			if (dirty & /*highlighted*/ 16 && li_class_value !== (li_class_value = "relative z-40 py-2 pl-3  " + (/*highlighted*/ ctx[4]
			? "text-white bg-indigo-600"
			: "text-gray-900") + " cursor-pointer select-none pr-9")) {
				attr_dev(li, "class", li_class_value);
			}
		},
		i: noop,
		o: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(li);
			if (if_block) if_block.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$3.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$3($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("DropdownOption", slots, []);
	const dispatch = createEventDispatcher();
	const toggleHighlight = () => $$invalidate(4, highlighted = !highlighted);
	let highlighted = false;
	let { id } = $$props;
	let { label } = $$props;
	let { value } = $$props;
	let { selected = false } = $$props;
	const writable_props = ["id", "label", "value", "selected"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DropdownOption> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ("id" in $$props) $$invalidate(0, id = $$props.id);
		if ("label" in $$props) $$invalidate(1, label = $$props.label);
		if ("value" in $$props) $$invalidate(2, value = $$props.value);
		if ("selected" in $$props) $$invalidate(3, selected = $$props.selected);
	};

	$$self.$capture_state = () => ({
		createEventDispatcher,
		dispatch,
		toggleHighlight,
		highlighted,
		id,
		label,
		value,
		selected
	});

	$$self.$inject_state = $$props => {
		if ("highlighted" in $$props) $$invalidate(4, highlighted = $$props.highlighted);
		if ("id" in $$props) $$invalidate(0, id = $$props.id);
		if ("label" in $$props) $$invalidate(1, label = $$props.label);
		if ("value" in $$props) $$invalidate(2, value = $$props.value);
		if ("selected" in $$props) $$invalidate(3, selected = $$props.selected);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [id, label, value, selected, highlighted, dispatch, toggleHighlight];
}

class DropdownOption extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$3, create_fragment$3, safe_not_equal, { id: 0, label: 1, value: 2, selected: 3 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DropdownOption",
			options,
			id: create_fragment$3.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*id*/ ctx[0] === undefined && !("id" in props)) {
			console.warn("<DropdownOption> was created without expected prop 'id'");
		}

		if (/*label*/ ctx[1] === undefined && !("label" in props)) {
			console.warn("<DropdownOption> was created without expected prop 'label'");
		}

		if (/*value*/ ctx[2] === undefined && !("value" in props)) {
			console.warn("<DropdownOption> was created without expected prop 'value'");
		}
	}

	get id() {
		throw new Error("<DropdownOption>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set id(value) {
		throw new Error("<DropdownOption>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get label() {
		throw new Error("<DropdownOption>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set label(value) {
		throw new Error("<DropdownOption>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get value() {
		throw new Error("<DropdownOption>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set value(value) {
		throw new Error("<DropdownOption>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get selected() {
		throw new Error("<DropdownOption>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set selected(value) {
		throw new Error("<DropdownOption>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* package/svelte/inputs/Dropdown.svelte generated by Svelte v3.32.3 */

const { Object: Object_1$2 } = globals;
const file$4 = "package/svelte/inputs/Dropdown.svelte";

function get_each_context$1(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[5] = list[i].label;
	child_ctx[25] = list[i].value;
	child_ctx[27] = i;
	return child_ctx;
}

// (139:4) {#if menu_open}
function create_if_block_2(ctx) {
	let div;
	let ul;
	let div_intro;
	let div_outro;
	let current;
	let each_value = /*options*/ ctx[3];
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const block = {
		c: function create() {
			div = element("div");
			ul = element("ul");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			attr_dev(ul, "tabindex", "-1");
			attr_dev(ul, "role", "listbox");
			attr_dev(ul, "aria-labelledby", "listbox-label");
			attr_dev(ul, "aria-activedescendant", "listbox-item-3");
			attr_dev(ul, "class", "py-1 overflow-auto text-base rounded-md max-h-60 ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm");
			add_location(ul, file$4, 144, 8, 4382);
			attr_dev(div, "class", "absolute z-40 w-full mt-1 bg-white rounded-md shadow-lg");
			add_location(div, file$4, 139, 6, 4211);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, ul);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(ul, null);
			}

			current = true;
		},
		p: function update(ctx, dirty) {
			if (dirty & /*options, $valueStore, handleChange*/ 18440) {
				each_value = /*options*/ ctx[3];
				validate_each_argument(each_value);
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
		i: function intro(local) {
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
		o: function outro(local) {
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			if (div_intro) div_intro.invalidate();
			div_outro = create_out_transition(div, fade, { duration: 75 });
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
			destroy_each(each_blocks, detaching);
			if (detaching && div_outro) div_outro.end();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2.name,
		type: "if",
		source: "(139:4) {#if menu_open}",
		ctx
	});

	return block;
}

// (152:10) {#each options as { label, value }
function create_each_block$1(ctx) {
	let dropdownoption;
	let current;

	function click_handler(...args) {
		return /*click_handler*/ ctx[20](/*label*/ ctx[5], ...args);
	}

	dropdownoption = new DropdownOption({
			props: {
				id: "listbox-option-" + /*i*/ ctx[27],
				label: /*label*/ ctx[5],
				value: /*value*/ ctx[25],
				selected: /*$valueStore*/ ctx[11] === /*label*/ ctx[5]
			},
			$$inline: true
		});

	dropdownoption.$on("click", click_handler);

	const block = {
		c: function create() {
			create_component(dropdownoption.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(dropdownoption, target, anchor);
			current = true;
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
			const dropdownoption_changes = {};
			if (dirty & /*options*/ 8) dropdownoption_changes.label = /*label*/ ctx[5];
			if (dirty & /*options*/ 8) dropdownoption_changes.value = /*value*/ ctx[25];
			if (dirty & /*$valueStore, options*/ 2056) dropdownoption_changes.selected = /*$valueStore*/ ctx[11] === /*label*/ ctx[5];
			dropdownoption.$set(dropdownoption_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(dropdownoption.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(dropdownoption.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(dropdownoption, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$1.name,
		type: "each",
		source: "(152:10) {#each options as { label, value }",
		ctx
	});

	return block;
}

// (164:4) {#if errors}
function create_if_block_1$1(ctx) {
	let div;
	let svg;
	let path;

	const block = {
		c: function create() {
			div = element("div");
			svg = svg_element("svg");
			path = svg_element("path");
			attr_dev(path, "fill-rule", "evenodd");
			attr_dev(path, "d", "M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012\n              0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z");
			attr_dev(path, "clip-rule", "evenodd");
			add_location(path, file$4, 175, 10, 5375);
			attr_dev(svg, "class", "w-5 h-5 text-red-500");
			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
			attr_dev(svg, "viewBox", "0 0 20 20");
			attr_dev(svg, "fill", "currentColor");
			attr_dev(svg, "aria-hidden", "true");
			add_location(svg, file$4, 168, 8, 5177);
			attr_dev(div, "class", "absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none");
			add_location(div, file$4, 165, 6, 5070);
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);
			append_dev(div, svg);
			append_dev(svg, path);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$1.name,
		type: "if",
		source: "(164:4) {#if errors}",
		ctx
	});

	return block;
}

// (186:2) {#if errors}
function create_if_block$4(ctx) {
	let inputerrors;
	let current;

	inputerrors = new InputErrors({
			props: { errorsStore: /*errors*/ ctx[9] },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(inputerrors.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(inputerrors, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const inputerrors_changes = {};
			if (dirty & /*errors*/ 512) inputerrors_changes.errorsStore = /*errors*/ ctx[9];
			inputerrors.$set(inputerrors_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(inputerrors.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(inputerrors.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(inputerrors, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$4.name,
		type: "if",
		source: "(186:2) {#if errors}",
		ctx
	});

	return block;
}

function create_fragment$4(ctx) {
	let div1;
	let label_1;
	let t0;
	let t1;
	let div0;
	let button;
	let span0;

	let t2_value = (/*$valueStore*/ ctx[11]
	? /*$valueStore*/ ctx[11]
	: "Select") + "";

	let t2;
	let t3;
	let span1;
	let svg;
	let path;
	let t4;
	let t5;
	let t6;
	let current;
	let mounted;
	let dispose;

	let button_levels = [
		{ name: /*name*/ ctx[4] },
		/*input_attributes*/ ctx[8],
		{ value: /*$valueStore*/ ctx[11] },
		{ type: "button" },
		{ "aria-haspopup": "listbox" },
		{ "aria-expanded": "true" },
		{ "aria-labelledby": "listbox-label" },
		{ class: /*cls*/ ctx[10] }
	];

	let button_data = {};

	for (let i = 0; i < button_levels.length; i += 1) {
		button_data = assign(button_data, button_levels[i]);
	}

	let if_block0 = /*menu_open*/ ctx[6] && create_if_block_2(ctx);
	let if_block1 = /*errors*/ ctx[9] && create_if_block_1$1(ctx);
	let if_block2 = /*errors*/ ctx[9] && create_if_block$4(ctx);

	const block = {
		c: function create() {
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
			svg = svg_element("svg");
			path = svg_element("path");
			t4 = space();
			if (if_block0) if_block0.c();
			t5 = space();
			if (if_block1) if_block1.c();
			t6 = space();
			if (if_block2) if_block2.c();
			attr_dev(label_1, "for", /*name*/ ctx[4]);
			attr_dev(label_1, "class", "block text-sm font-medium leading-5 text-gray-700");
			add_location(label_1, file$4, 97, 2, 2878);
			attr_dev(span0, "class", "block truncate");
			add_location(span0, file$4, 116, 6, 3375);
			attr_dev(path, "fill-rule", "evenodd");
			attr_dev(path, "d", "M10 3a1 1 0 01.707.293l3 3a1 1 0 01-1.414 1.414L10 5.414 7.707 7.707a1 1 0 01-1.414-1.414l3-3A1 1 0 0110 3zm-3.707 9.293a1 1 0 011.414 0L10 14.586l2.293-2.293a1 1 0 011.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z");
			attr_dev(path, "clip-rule", "evenodd");
			add_location(path, file$4, 130, 10, 3820);
			attr_dev(svg, "class", "w-5 h-5 text-gray-400");
			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
			attr_dev(svg, "viewBox", "0 0 20 20");
			attr_dev(svg, "fill", "currentColor");
			attr_dev(svg, "aria-hidden", "true");
			add_location(svg, file$4, 123, 8, 3621);
			attr_dev(span1, "class", "absolute inset-y-0 right-0 flex items-center pr-2 pointer-events-none");
			add_location(span1, file$4, 119, 6, 3472);
			set_attributes(button, button_data);
			add_location(button, file$4, 101, 4, 3033);
			attr_dev(div0, "class", "relative mt-1 rounded-md shadow-sm");
			add_location(div0, file$4, 100, 2, 2980);
			add_location(div1, file$4, 96, 0, 2870);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, label_1);
			append_dev(label_1, t0);
			append_dev(div1, t1);
			append_dev(div1, div0);
			append_dev(div0, button);
			append_dev(button, span0);
			append_dev(span0, t2);
			append_dev(button, t3);
			append_dev(button, span1);
			append_dev(span1, svg);
			append_dev(svg, path);
			/*button_binding*/ ctx[19](button);
			append_dev(div0, t4);
			if (if_block0) if_block0.m(div0, null);
			append_dev(div0, t5);
			if (if_block1) if_block1.m(div0, null);
			append_dev(div1, t6);
			if (if_block2) if_block2.m(div1, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(window, "keydown", /*handleKeyDown*/ ctx[13], false, false, false),
					listen_dev(button, "click", /*toggle*/ ctx[12], false, false, false),
					listen_dev(button, "focus", /*handleFocus*/ ctx[15], false, false, false),
					listen_dev(button, "blur", /*handleBlur*/ ctx[16], false, false, false),
					action_destroyer(/*useInput*/ ctx[0].call(null, button))
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*label*/ 32) set_data_dev(t0, /*label*/ ctx[5]);

			if (!current || dirty & /*name*/ 16) {
				attr_dev(label_1, "for", /*name*/ ctx[4]);
			}

			if ((!current || dirty & /*$valueStore*/ 2048) && t2_value !== (t2_value = (/*$valueStore*/ ctx[11]
			? /*$valueStore*/ ctx[11]
			: "Select") + "")) set_data_dev(t2, t2_value);

			set_attributes(button, button_data = get_spread_update(button_levels, [
				(!current || dirty & /*name*/ 16) && { name: /*name*/ ctx[4] },
				dirty & /*input_attributes*/ 256 && /*input_attributes*/ ctx[8],
				(!current || dirty & /*$valueStore*/ 2048) && { value: /*$valueStore*/ ctx[11] },
				{ type: "button" },
				{ "aria-haspopup": "listbox" },
				{ "aria-expanded": "true" },
				{ "aria-labelledby": "listbox-label" },
				(!current || dirty & /*cls*/ 1024) && { class: /*cls*/ ctx[10] }
			]));

			if (/*menu_open*/ ctx[6]) {
				if (if_block0) {
					if_block0.p(ctx, dirty);

					if (dirty & /*menu_open*/ 64) {
						transition_in(if_block0, 1);
					}
				} else {
					if_block0 = create_if_block_2(ctx);
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

			if (/*errors*/ ctx[9]) {
				if (if_block1) ; else {
					if_block1 = create_if_block_1$1(ctx);
					if_block1.c();
					if_block1.m(div0, null);
				}
			} else if (if_block1) {
				if_block1.d(1);
				if_block1 = null;
			}

			if (/*errors*/ ctx[9]) {
				if (if_block2) {
					if_block2.p(ctx, dirty);

					if (dirty & /*errors*/ 512) {
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
		i: function intro(local) {
			if (current) return;
			transition_in(if_block0);
			transition_in(if_block2);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block0);
			transition_out(if_block2);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			/*button_binding*/ ctx[19](null);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			if (if_block2) if_block2.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$4.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$4($$self, $$props, $$invalidate) {
	let input_attributes;
	let errors;
	let cls;

	let $errorsStore,
		$$unsubscribe_errorsStore = noop,
		$$subscribe_errorsStore = () => ($$unsubscribe_errorsStore(), $$unsubscribe_errorsStore = subscribe(errorsStore, $$value => $$invalidate(18, $errorsStore = $$value)), errorsStore);

	let $valueStore,
		$$unsubscribe_valueStore = noop,
		$$subscribe_valueStore = () => ($$unsubscribe_valueStore(), $$unsubscribe_valueStore = subscribe(valueStore, $$value => $$invalidate(11, $valueStore = $$value)), valueStore);

	$$self.$$.on_destroy.push(() => $$unsubscribe_errorsStore());
	$$self.$$.on_destroy.push(() => $$unsubscribe_valueStore());
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Dropdown", slots, []);
	let active_index = 0;
	let is_focused = false;
	let menu_open = false;
	const toggle = () => $$invalidate(6, menu_open = !menu_open);
	let { useInput } = $$props;
	let { valueStore } = $$props;
	validate_store(valueStore, "valueStore");
	$$subscribe_valueStore();
	let { errorsStore } = $$props;
	validate_store(errorsStore, "errorsStore");
	$$subscribe_errorsStore();
	let { options } = $$props;
	let { label } = $$props;
	let { name } = $$props;
	let { attrs = {} } = $$props;
	let default_class = "bg-white relative w-full border border-gray-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm";
	let error_class = "bg-white relative w-full text-red-900 border border-red-300 rounded-md shadow-sm pl-3 pr-10 py-2 text-left cursor-default focus:outline-none focus:ring-1 focus:ring-red-500 focus:border-red-500 sm:text-sm";

	onMount(() => {
		// Check if an item is selected on mount
		if (options && options.length > 0) {
			let i = 0, len = options.length;

			for (; len > i; ++i) {
				const item = options[i].value;

				if ($valueStore === item) {
					active_index = i;
				}
			}
		}
	});

	function handleKeyDown(e) {
		if (!is_focused) return;

		switch (e.key) {
			case "ArrowDown":
				$$invalidate(6, menu_open = true);
				e.preventDefault();
				if (options[active_index + 1] && options[active_index + 1].value) {
					set_store_value(valueStore, $valueStore = options[active_index + 1].value, $valueStore);
					active_index = active_index + 1;
					node.dispatchEvent(new Event("change"));
				}
				break;
			case "ArrowUp":
				$$invalidate(6, menu_open = true);
				e.preventDefault();
				if (options[active_index - 1] && options[active_index - 1].value) {
					set_store_value(valueStore, $valueStore = options[active_index - 1].value, $valueStore);
					active_index = active_index - 1;
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

	const writable_props = ["useInput", "valueStore", "errorsStore", "options", "label", "name", "attrs"];

	Object_1$2.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Dropdown> was created with unknown prop '${key}'`);
	});

	function button_binding($$value) {
		binding_callbacks[$$value ? "unshift" : "push"](() => {
			node = $$value;
			$$invalidate(7, node);
		});
	}

	const click_handler = (label, e) => handleChange(e, label);

	$$self.$$set = $$props => {
		if ("useInput" in $$props) $$invalidate(0, useInput = $$props.useInput);
		if ("valueStore" in $$props) $$subscribe_valueStore($$invalidate(1, valueStore = $$props.valueStore));
		if ("errorsStore" in $$props) $$subscribe_errorsStore($$invalidate(2, errorsStore = $$props.errorsStore));
		if ("options" in $$props) $$invalidate(3, options = $$props.options);
		if ("label" in $$props) $$invalidate(5, label = $$props.label);
		if ("name" in $$props) $$invalidate(4, name = $$props.name);
		if ("attrs" in $$props) $$invalidate(17, attrs = $$props.attrs);
	};

	$$self.$capture_state = () => ({
		fly,
		fade,
		onMount,
		DropdownOption,
		InputErrors,
		active_index,
		is_focused,
		menu_open,
		toggle,
		useInput,
		valueStore,
		errorsStore,
		options,
		label,
		name,
		attrs,
		default_class,
		error_class,
		handleKeyDown,
		node,
		handleChange,
		handleFocus,
		handleBlur,
		input_attributes,
		errors,
		$errorsStore,
		cls,
		$valueStore
	});

	$$self.$inject_state = $$props => {
		if ("active_index" in $$props) active_index = $$props.active_index;
		if ("is_focused" in $$props) is_focused = $$props.is_focused;
		if ("menu_open" in $$props) $$invalidate(6, menu_open = $$props.menu_open);
		if ("useInput" in $$props) $$invalidate(0, useInput = $$props.useInput);
		if ("valueStore" in $$props) $$subscribe_valueStore($$invalidate(1, valueStore = $$props.valueStore));
		if ("errorsStore" in $$props) $$subscribe_errorsStore($$invalidate(2, errorsStore = $$props.errorsStore));
		if ("options" in $$props) $$invalidate(3, options = $$props.options);
		if ("label" in $$props) $$invalidate(5, label = $$props.label);
		if ("name" in $$props) $$invalidate(4, name = $$props.name);
		if ("attrs" in $$props) $$invalidate(17, attrs = $$props.attrs);
		if ("default_class" in $$props) $$invalidate(23, default_class = $$props.default_class);
		if ("error_class" in $$props) $$invalidate(24, error_class = $$props.error_class);
		if ("node" in $$props) $$invalidate(7, node = $$props.node);
		if ("input_attributes" in $$props) $$invalidate(8, input_attributes = $$props.input_attributes);
		if ("errors" in $$props) $$invalidate(9, errors = $$props.errors);
		if ("cls" in $$props) $$invalidate(10, cls = $$props.cls);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	$$self.$$.update = () => {
		if ($$self.$$.dirty & /*attrs*/ 131072) {
			$$invalidate(8, input_attributes = Object.assign({}, attrs));
		}

		if ($$self.$$.dirty & /*$errorsStore*/ 262144) {
			$$invalidate(9, errors = $errorsStore && $errorsStore.constraints);
		}

		if ($$self.$$.dirty & /*$errorsStore*/ 262144) {
			$$invalidate(10, cls = $errorsStore && $errorsStore.constraints
			? error_class
			: default_class);
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
		input_attributes,
		errors,
		cls,
		$valueStore,
		toggle,
		handleKeyDown,
		handleChange,
		handleFocus,
		handleBlur,
		attrs,
		$errorsStore,
		button_binding,
		click_handler
	];
}

class Dropdown extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$4, create_fragment$4, safe_not_equal, {
			useInput: 0,
			valueStore: 1,
			errorsStore: 2,
			options: 3,
			label: 5,
			name: 4,
			attrs: 17
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Dropdown",
			options,
			id: create_fragment$4.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*useInput*/ ctx[0] === undefined && !("useInput" in props)) {
			console.warn("<Dropdown> was created without expected prop 'useInput'");
		}

		if (/*valueStore*/ ctx[1] === undefined && !("valueStore" in props)) {
			console.warn("<Dropdown> was created without expected prop 'valueStore'");
		}

		if (/*errorsStore*/ ctx[2] === undefined && !("errorsStore" in props)) {
			console.warn("<Dropdown> was created without expected prop 'errorsStore'");
		}

		if (/*options*/ ctx[3] === undefined && !("options" in props)) {
			console.warn("<Dropdown> was created without expected prop 'options'");
		}

		if (/*label*/ ctx[5] === undefined && !("label" in props)) {
			console.warn("<Dropdown> was created without expected prop 'label'");
		}

		if (/*name*/ ctx[4] === undefined && !("name" in props)) {
			console.warn("<Dropdown> was created without expected prop 'name'");
		}
	}

	get useInput() {
		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set useInput(value) {
		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get valueStore() {
		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set valueStore(value) {
		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get errorsStore() {
		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set errorsStore(value) {
		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get options() {
		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set options(value) {
		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get label() {
		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set label(value) {
		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get name() {
		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set name(value) {
		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get attrs() {
		throw new Error("<Dropdown>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set attrs(value) {
		throw new Error("<Dropdown>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* package/svelte/inputs/Textarea.svelte generated by Svelte v3.32.3 */

const { Object: Object_1$3 } = globals;
const file$5 = "package/svelte/inputs/Textarea.svelte";

// (46:4) {#if hint}
function create_if_block_1$2(ctx) {
	let p;
	let t;

	const block = {
		c: function create() {
			p = element("p");
			t = text(/*hint*/ ctx[4]);
			attr_dev(p, "class", "mt-2 text-sm text-gray-500");
			add_location(p, file$5, 46, 6, 1442);
		},
		m: function mount(target, anchor) {
			insert_dev(target, p, anchor);
			append_dev(p, t);
		},
		p: function update(ctx, dirty) {
			if (dirty & /*hint*/ 16) set_data_dev(t, /*hint*/ ctx[4]);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(p);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$2.name,
		type: "if",
		source: "(46:4) {#if hint}",
		ctx
	});

	return block;
}

// (52:2) {#if errors}
function create_if_block$5(ctx) {
	let inputerrors;
	let current;

	inputerrors = new InputErrors({
			props: { errorsStore: /*errors*/ ctx[6] },
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(inputerrors.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(inputerrors, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const inputerrors_changes = {};
			if (dirty & /*errors*/ 64) inputerrors_changes.errorsStore = /*errors*/ ctx[6];
			inputerrors.$set(inputerrors_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(inputerrors.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(inputerrors.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(inputerrors, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$5.name,
		type: "if",
		source: "(52:2) {#if errors}",
		ctx
	});

	return block;
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
	let if_block1 = /*errors*/ ctx[6] && create_if_block$5(ctx);

	const block = {
		c: function create() {
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
			attr_dev(label_1, "for", /*name*/ ctx[5]);
			attr_dev(label_1, "class", "block text-sm font-medium text-gray-700");
			add_location(label_1, file$5, 34, 2, 1180);
			set_attributes(textarea, textarea_data);
			add_location(textarea, file$5, 38, 4, 1295);
			attr_dev(div0, "class", "mt-1");
			add_location(div0, file$5, 37, 2, 1272);
			attr_dev(div1, "class", "sm:col-span-6");
			add_location(div1, file$5, 33, 0, 1150);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div1, anchor);
			append_dev(div1, label_1);
			append_dev(label_1, t0);
			append_dev(div1, t1);
			append_dev(div1, div0);
			append_dev(div0, textarea);
			set_input_value(textarea, /*$valueStore*/ ctx[9]);
			append_dev(div0, t2);
			if (if_block0) if_block0.m(div0, null);
			append_dev(div1, t3);
			if (if_block1) if_block1.m(div1, null);
			current = true;

			if (!mounted) {
				dispose = [
					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[12]),
					action_destroyer(/*useInput*/ ctx[2].call(null, textarea))
				];

				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			if (!current || dirty & /*label*/ 8) set_data_dev(t0, /*label*/ ctx[3]);

			if (!current || dirty & /*name*/ 32) {
				attr_dev(label_1, "for", /*name*/ ctx[5]);
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
					if_block1 = create_if_block$5(ctx);
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
		i: function intro(local) {
			if (current) return;
			transition_in(if_block1);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block1);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div1);
			if (if_block0) if_block0.d();
			if (if_block1) if_block1.d();
			mounted = false;
			run_all(dispose);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$5.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$5($$self, $$props, $$invalidate) {
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
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Textarea", slots, []);
	let { valueStore } = $$props;
	validate_store(valueStore, "valueStore");
	$$subscribe_valueStore();
	let { errorsStore } = $$props;
	validate_store(errorsStore, "errorsStore");
	$$subscribe_errorsStore();
	let { useInput } = $$props;
	let { label } = $$props;
	let { hint } = $$props;
	let { name } = $$props;
	let { attrs = {} } = $$props;
	let default_class = "block w-full px-3 py-2 placeholder-gray-400 border border-gray-300 appearance-none transition duration-150 ease-in-out rounded-md focus:outline-none focus:shadow-outline-blue focus:border-blue-300 sm:text-sm sm:leading-5 disabled:cursor-not-allowed";
	let error_class = "block w-full px-3 py-2 placeholder-red-300 border border-red-300 appearance-none transition text-red-900 duration-150 ease-in-out rounded-md focus:outline-none focus:ring-red-500 focus:shadow-outline-red focus:border-red-300 sm:text-sm sm:leading-5 disabled:cursor-not-allowed";
	const writable_props = ["valueStore", "errorsStore", "useInput", "label", "hint", "name", "attrs"];

	Object_1$3.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Textarea> was created with unknown prop '${key}'`);
	});

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

	$$self.$capture_state = () => ({
		InputErrors,
		valueStore,
		errorsStore,
		useInput,
		label,
		hint,
		name,
		attrs,
		default_class,
		error_class,
		errors,
		$errorsStore,
		input_attributes,
		cls,
		$valueStore
	});

	$$self.$inject_state = $$props => {
		if ("valueStore" in $$props) $$subscribe_valueStore($$invalidate(0, valueStore = $$props.valueStore));
		if ("errorsStore" in $$props) $$subscribe_errorsStore($$invalidate(1, errorsStore = $$props.errorsStore));
		if ("useInput" in $$props) $$invalidate(2, useInput = $$props.useInput);
		if ("label" in $$props) $$invalidate(3, label = $$props.label);
		if ("hint" in $$props) $$invalidate(4, hint = $$props.hint);
		if ("name" in $$props) $$invalidate(5, name = $$props.name);
		if ("attrs" in $$props) $$invalidate(10, attrs = $$props.attrs);
		if ("default_class" in $$props) $$invalidate(13, default_class = $$props.default_class);
		if ("error_class" in $$props) $$invalidate(14, error_class = $$props.error_class);
		if ("errors" in $$props) $$invalidate(6, errors = $$props.errors);
		if ("input_attributes" in $$props) $$invalidate(7, input_attributes = $$props.input_attributes);
		if ("cls" in $$props) $$invalidate(8, cls = $$props.cls);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

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

class Textarea extends SvelteComponentDev {
	constructor(options) {
		super(options);

		init(this, options, instance$5, create_fragment$5, safe_not_equal, {
			valueStore: 0,
			errorsStore: 1,
			useInput: 2,
			label: 3,
			hint: 4,
			name: 5,
			attrs: 10
		});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Textarea",
			options,
			id: create_fragment$5.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*valueStore*/ ctx[0] === undefined && !("valueStore" in props)) {
			console.warn("<Textarea> was created without expected prop 'valueStore'");
		}

		if (/*errorsStore*/ ctx[1] === undefined && !("errorsStore" in props)) {
			console.warn("<Textarea> was created without expected prop 'errorsStore'");
		}

		if (/*useInput*/ ctx[2] === undefined && !("useInput" in props)) {
			console.warn("<Textarea> was created without expected prop 'useInput'");
		}

		if (/*label*/ ctx[3] === undefined && !("label" in props)) {
			console.warn("<Textarea> was created without expected prop 'label'");
		}

		if (/*hint*/ ctx[4] === undefined && !("hint" in props)) {
			console.warn("<Textarea> was created without expected prop 'hint'");
		}

		if (/*name*/ ctx[5] === undefined && !("name" in props)) {
			console.warn("<Textarea> was created without expected prop 'name'");
		}
	}

	get valueStore() {
		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set valueStore(value) {
		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get errorsStore() {
		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set errorsStore(value) {
		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get useInput() {
		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set useInput(value) {
		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get label() {
		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set label(value) {
		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get hint() {
		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set hint(value) {
		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get name() {
		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set name(value) {
		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get attrs() {
		throw new Error("<Textarea>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set attrs(value) {
		throw new Error("<Textarea>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* package/svelte/inputs/Field.svelte generated by Svelte v3.32.3 */
const file$6 = "package/svelte/inputs/Field.svelte";

// (30:36) 
function create_if_block_2$1(ctx) {
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
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(textarea.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(textarea, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
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
		i: function intro(local) {
			if (current) return;
			transition_in(textarea.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(textarea.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(textarea, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_2$1.name,
		type: "if",
		source: "(30:36) ",
		ctx
	});

	return block;
}

// (20:61) 
function create_if_block_1$3(ctx) {
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
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(dropdown.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(dropdown, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
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
		i: function intro(local) {
			if (current) return;
			transition_in(dropdown.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(dropdown.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(dropdown, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$3.name,
		type: "if",
		source: "(20:61) ",
		ctx
	});

	return block;
}

// (11:2) {#if field.el === "input"}
function create_if_block$6(ctx) {
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
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(input.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(input, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const input_changes = {};
			if (dirty & /*field*/ 1) input_changes.name = /*field*/ ctx[0].name;
			if (dirty & /*field*/ 1) input_changes.label = /*field*/ ctx[0].label;
			if (dirty & /*field*/ 1) input_changes.attrs = /*field*/ ctx[0].attributes;
			if (dirty & /*field*/ 1) input_changes.valueStore = /*field*/ ctx[0].value;
			if (dirty & /*field*/ 1) input_changes.errorsStore = /*field*/ ctx[0].errors;
			if (dirty & /*$form*/ 4) input_changes.useInput = /*$form*/ ctx[2].useField;
			input.$set(input_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(input.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(input.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(input, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$6.name,
		type: "if",
		source: "(11:2) {#if field.el === \\\"input\\\"}",
		ctx
	});

	return block;
}

function create_fragment$6(ctx) {
	let div;
	let current_block_type_index;
	let if_block;
	let div_class_value;
	let current;
	const if_block_creators = [create_if_block$6, create_if_block_1$3, create_if_block_2$1];
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

	const block = {
		c: function create() {
			div = element("div");
			if (if_block) if_block.c();
			attr_dev(div, "class", div_class_value = /*field*/ ctx[0].classname);
			add_location(div, file$6, 9, 0, 196);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, div, anchor);

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].m(div, null);
			}

			current = true;
		},
		p: function update(ctx, [dirty]) {
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
				attr_dev(div, "class", div_class_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(div);

			if (~current_block_type_index) {
				if_blocks[current_block_type_index].d();
			}
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$6.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$6($$self, $$props, $$invalidate) {
	let $form,
		$$unsubscribe_form = noop,
		$$subscribe_form = () => ($$unsubscribe_form(), $$unsubscribe_form = subscribe(form, $$value => $$invalidate(2, $form = $$value)), form);

	$$self.$$.on_destroy.push(() => $$unsubscribe_form());
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("Field", slots, []);
	let { field } = $$props;
	let { form } = $$props;
	validate_store(form, "form");
	$$subscribe_form();
	const writable_props = ["field", "form"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Field> was created with unknown prop '${key}'`);
	});

	$$self.$$set = $$props => {
		if ("field" in $$props) $$invalidate(0, field = $$props.field);
		if ("form" in $$props) $$subscribe_form($$invalidate(1, form = $$props.form));
	};

	$$self.$capture_state = () => ({
		Input,
		Dropdown,
		Textarea,
		field,
		form,
		$form
	});

	$$self.$inject_state = $$props => {
		if ("field" in $$props) $$invalidate(0, field = $$props.field);
		if ("form" in $$props) $$subscribe_form($$invalidate(1, form = $$props.form));
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [field, form, $form];
}

class Field extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$6, create_fragment$6, safe_not_equal, { field: 0, form: 1 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "Field",
			options,
			id: create_fragment$6.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*field*/ ctx[0] === undefined && !("field" in props)) {
			console.warn("<Field> was created without expected prop 'field'");
		}

		if (/*form*/ ctx[1] === undefined && !("form" in props)) {
			console.warn("<Field> was created without expected prop 'form'");
		}
	}

	get field() {
		throw new Error("<Field>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set field(value) {
		throw new Error("<Field>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	get form() {
		throw new Error("<Field>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set form(value) {
		throw new Error("<Field>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/example/SettingsTemplate.svelte generated by Svelte v3.32.3 */
const file$7 = "src/example/SettingsTemplate.svelte";

function get_each_context$2(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[11] = list[i];
	child_ctx[13] = i;
	return child_ctx;
}

// (66:8) {#each $form.fields as field, i}
function create_each_block$2(ctx) {
	let field;
	let current;

	field = new Field({
			props: {
				field: /*field*/ ctx[11],
				form: /*form*/ ctx[0]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(field.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(field, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const field_changes = {};
			if (dirty & /*$form*/ 2) field_changes.field = /*field*/ ctx[11];
			if (dirty & /*form*/ 1) field_changes.form = /*form*/ ctx[0];
			field.$set(field_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(field.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(field.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(field, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$2.name,
		type: "each",
		source: "(66:8) {#each $form.fields as field, i}",
		ctx
	});

	return block;
}

// (80:6) {:else}
function create_else_block_1(ctx) {
	let button;

	const block = {
		c: function create() {
			button = element("button");
			button.textContent = "Reset";
			button.disabled = true;
			attr_dev(button, "class", "inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm cursor-not-allowed focus:outline-none");
			add_location(button, file$7, 80, 8, 2234);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);
		},
		p: noop,
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block_1.name,
		type: "else",
		source: "(80:6) {:else}",
		ctx
	});

	return block;
}

// (73:6) {#if $changed}
function create_if_block_1$4(ctx) {
	let button;
	let mounted;
	let dispose;

	const block = {
		c: function create() {
			button = element("button");
			button.textContent = "Reset";
			attr_dev(button, "class", "inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900");
			add_location(button, file$7, 73, 8, 1877);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);

			if (!mounted) {
				dispose = listen_dev(
					button,
					"click",
					prevent_default(function () {
						if (is_function(/*$form*/ ctx[1].reset)) /*$form*/ ctx[1].reset.apply(this, arguments);
					}),
					false,
					true,
					false
				);

				mounted = true;
			}
		},
		p: function update(new_ctx, dirty) {
			ctx = new_ctx;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block_1$4.name,
		type: "if",
		source: "(73:6) {#if $changed}",
		ctx
	});

	return block;
}

// (95:6) {:else}
function create_else_block(ctx) {
	let button;

	const block = {
		c: function create() {
			button = element("button");
			button.textContent = "Save";
			button.disabled = true;
			attr_dev(button, "class", "inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-600 border border-transparent rounded-md shadow-sm cursor-not-allowed focus:outline-none");
			add_location(button, file$7, 95, 8, 2859);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block.name,
		type: "else",
		source: "(95:6) {:else}",
		ctx
	});

	return block;
}

// (88:6) {#if $valid}
function create_if_block$7(ctx) {
	let button;

	const block = {
		c: function create() {
			button = element("button");
			button.textContent = "Save";
			attr_dev(button, "type", "submit");
			attr_dev(button, "class", "inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-gray-800 border border-transparent rounded-md shadow-sm hover:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900");
			add_location(button, file$7, 88, 8, 2527);
		},
		m: function mount(target, anchor) {
			insert_dev(target, button, anchor);
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(button);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$7.name,
		type: "if",
		source: "(88:6) {#if $valid}",
		ctx
	});

	return block;
}

function create_fragment$7(ctx) {
	let form_1;
	let div4;
	let loadingindicator;
	let t0;
	let div2;
	let div0;
	let h2;
	let t2;
	let p;
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
				visible: /*$form*/ ctx[1].loading,
				w: /*fw*/ ctx[2],
				h: /*fh*/ ctx[3]
			},
			$$inline: true
		});

	let each_value = /*$form*/ ctx[1].fields;
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$2(get_each_context$2(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	function select_block_type(ctx, dirty) {
		if (/*$changed*/ ctx[6]) return create_if_block_1$4;
		return create_else_block_1;
	}

	let current_block_type = select_block_type(ctx);
	let if_block0 = current_block_type(ctx);

	function select_block_type_1(ctx, dirty) {
		if (/*$valid*/ ctx[7]) return create_if_block$7;
		return create_else_block;
	}

	let current_block_type_1 = select_block_type_1(ctx);
	let if_block1 = current_block_type_1(ctx);

	const block = {
		c: function create() {
			form_1 = element("form");
			div4 = element("div");
			create_component(loadingindicator.$$.fragment);
			t0 = space();
			div2 = element("div");
			div0 = element("div");
			h2 = element("h2");
			h2.textContent = "Business Settings";
			t2 = space();
			p = element("p");
			p.textContent = "This is a test. This is only a test. Bleep bloop.";
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
			attr_dev(h2, "class", "text-lg font-medium leading-6 text-gray-900");
			add_location(h2, file$7, 55, 8, 1310);
			attr_dev(p, "class", "mt-1 text-sm text-gray-500");
			add_location(p, file$7, 58, 8, 1417);
			add_location(div0, file$7, 54, 6, 1296);
			attr_dev(div1, "class", "grid grid-cols-4 gap-6 mt-6");
			add_location(div1, file$7, 64, 6, 1607);
			attr_dev(div2, "class", "px-4 py-6 bg-white sm:p-6");
			add_location(div2, file$7, 52, 4, 1223);
			attr_dev(div3, "class", "px-4 py-3 text-right bg-gray-50 sm:px-6");
			add_location(div3, file$7, 71, 4, 1794);
			attr_dev(div4, "class", "shadow sm:rounded-md");
			add_location(div4, file$7, 50, 2, 1121);
			add_render_callback(() => /*form_1_elementresize_handler*/ ctx[9].call(form_1));
			add_location(form_1, file$7, 45, 0, 1020);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, form_1, anchor);
			append_dev(form_1, div4);
			mount_component(loadingindicator, div4, null);
			append_dev(div4, t0);
			append_dev(div4, div2);
			append_dev(div2, div0);
			append_dev(div0, h2);
			append_dev(div0, t2);
			append_dev(div0, p);
			append_dev(div2, t4);
			append_dev(div2, div1);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div1, null);
			}

			append_dev(div4, t5);
			append_dev(div4, div3);
			if_block0.m(div3, null);
			append_dev(div3, t6);
			if_block1.m(div3, null);
			form_1_resize_listener = add_resize_listener(form_1, /*form_1_elementresize_handler*/ ctx[9].bind(form_1));
			current = true;

			if (!mounted) {
				dispose = listen_dev(form_1, "submit", prevent_default(/*handleSubmit*/ ctx[8]), false, true, false);
				mounted = true;
			}
		},
		p: function update(ctx, [dirty]) {
			const loadingindicator_changes = {};
			if (dirty & /*$form*/ 2) loadingindicator_changes.visible = /*$form*/ ctx[1].loading;
			if (dirty & /*fw*/ 4) loadingindicator_changes.w = /*fw*/ ctx[2];
			if (dirty & /*fh*/ 8) loadingindicator_changes.h = /*fh*/ ctx[3];
			loadingindicator.$set(loadingindicator_changes);

			if (dirty & /*$form, form*/ 3) {
				each_value = /*$form*/ ctx[1].fields;
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$2(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$2(child_ctx);
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
		i: function intro(local) {
			if (current) return;
			transition_in(loadingindicator.$$.fragment, local);

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			current = true;
		},
		o: function outro(local) {
			transition_out(loadingindicator.$$.fragment, local);
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(form_1);
			destroy_component(loadingindicator);
			destroy_each(each_blocks, detaching);
			if_block0.d();
			if_block1.d();
			form_1_resize_listener();
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$7.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$7($$self, $$props, $$invalidate) {
	let valid;
	let changed;

	let $form,
		$$unsubscribe_form = noop,
		$$subscribe_form = () => ($$unsubscribe_form(), $$unsubscribe_form = subscribe(form, $$value => $$invalidate(1, $form = $$value)), form);

	let $changed,
		$$unsubscribe_changed = noop,
		$$subscribe_changed = () => ($$unsubscribe_changed(), $$unsubscribe_changed = subscribe(changed, $$value => $$invalidate(6, $changed = $$value)), changed);

	let $valid,
		$$unsubscribe_valid = noop,
		$$subscribe_valid = () => ($$unsubscribe_valid(), $$unsubscribe_valid = subscribe(valid, $$value => $$invalidate(7, $valid = $$value)), valid);

	$$self.$$.on_destroy.push(() => $$unsubscribe_form());
	$$self.$$.on_destroy.push(() => $$unsubscribe_changed());
	$$self.$$.on_destroy.push(() => $$unsubscribe_valid());
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("SettingsTemplate", slots, []);
	const dispatch = createEventDispatcher();
	let { form } = $$props;
	validate_store(form, "form");
	$$subscribe_form();

	const handleSubmit = e => {
		dispatch("submit", e);
	};

	onMount(() => {
		
	}); // setTimeout(() ``=> {
	// $form.fields.forEach((field) => {
	//   console.log("VAL: ", get(field.value));
	// });

	// }, 5000);
	onDestroy(() => {
		// dispatch("destroy", true);
		$form.destroy();
	});

	let fw;
	let fh;
	const writable_props = ["form"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<SettingsTemplate> was created with unknown prop '${key}'`);
	});

	function form_1_elementresize_handler() {
		fh = this.clientHeight;
		fw = this.clientWidth;
		$$invalidate(3, fh);
		$$invalidate(2, fw);
	}

	$$self.$$set = $$props => {
		if ("form" in $$props) $$subscribe_form($$invalidate(0, form = $$props.form));
	};

	$$self.$capture_state = () => ({
		onDestroy,
		onMount,
		LoadingIndicator,
		Field,
		createEventDispatcher,
		dispatch,
		form,
		handleSubmit,
		fw,
		fh,
		$form,
		valid,
		changed,
		$changed,
		$valid
	});

	$$self.$inject_state = $$props => {
		if ("form" in $$props) $$subscribe_form($$invalidate(0, form = $$props.form));
		if ("fw" in $$props) $$invalidate(2, fw = $$props.fw);
		if ("fh" in $$props) $$invalidate(3, fh = $$props.fh);
		if ("valid" in $$props) $$subscribe_valid($$invalidate(4, valid = $$props.valid));
		if ("changed" in $$props) $$subscribe_changed($$invalidate(5, changed = $$props.changed));
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

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
	};

	return [
		form,
		$form,
		fw,
		fh,
		valid,
		changed,
		$changed,
		$valid,
		handleSubmit,
		form_1_elementresize_handler
	];
}

class SettingsTemplate extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$7, create_fragment$7, safe_not_equal, { form: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "SettingsTemplate",
			options,
			id: create_fragment$7.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*form*/ ctx[0] === undefined && !("form" in props)) {
			console.warn("<SettingsTemplate> was created without expected prop 'form'");
		}
	}

	get form() {
		throw new Error("<SettingsTemplate>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set form(value) {
		throw new Error("<SettingsTemplate>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
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
        setLoading: (loading) => update((s) => setLoading(s, loading)),
    };
}
const updateState = (state, updates) => {
    Object.assign(state, updates);
    return state;
};
const setLoading = (state, loading) => {
    state.loading = loading;
    return state;
};
/**
 ** External functionlaity below
 *    || || || ||
 *    \/ \/ \/ \/
 */
const formState = initStore();
const init$2 = () => {
    formState.setLoading(true);
    setTimeout(() => {
        formState.setLoading(false);
    }, 1000);
    // Update form with data fetched from DB
    // getBusiness(SOME_STATE.BUSINESS_ID).then((data) => {
    //   Get current form state
    //     const form = sget(formState);
    //     form.model = new Business(data);
    //     form.updateInitialState();
    //     form.buildFields();
    //     formState.updateState({ form: form });
    // });
};
const onSubmit = (ev) => {
    console.log("SUBMIT: ", ev);
    console.log(get_store_value(formState));
    // formState.setLoading(true);
    // const model = sget(formState).model;
    // updateBusniess(model).then((model) => {
    //     formState.updateState({model: model})
    //     formState.setLoading(false);
    // });
};

/* package/svelte/DynamicForm.svelte generated by Svelte v3.32.3 */
const file$8 = "package/svelte/DynamicForm.svelte";
const get_buttons_slot_changes = dirty => ({});
const get_buttons_slot_context = ctx => ({});

function get_each_context$3(ctx, list, i) {
	const child_ctx = ctx.slice();
	child_ctx[9] = list[i];
	child_ctx[11] = i;
	return child_ctx;
}

const get_header_slot_changes = dirty => ({});
const get_header_slot_context = ctx => ({});

// (45:0) {:else}
function create_else_block$1(ctx) {
	let form_1;
	let div2;
	let loadingindicator;
	let t0;
	let div1;
	let t1;
	let div0;
	let div0_class_value;
	let div1_class_value;
	let t2;
	let div2_class_value;
	let form_1_resize_listener;
	let current;
	let mounted;
	let dispose;

	loadingindicator = new LoadingIndicator({
			props: {
				visible: /*$form*/ ctx[3].loading,
				w: /*fw*/ ctx[1],
				h: /*fh*/ ctx[2]
			},
			$$inline: true
		});

	const header_slot_template = /*#slots*/ ctx[6].header;
	const header_slot = create_slot(header_slot_template, ctx, /*$$scope*/ ctx[5], get_header_slot_context);
	let each_value = /*$form*/ ctx[3].fields;
	validate_each_argument(each_value);
	let each_blocks = [];

	for (let i = 0; i < each_value.length; i += 1) {
		each_blocks[i] = create_each_block$3(get_each_context$3(ctx, each_value, i));
	}

	const out = i => transition_out(each_blocks[i], 1, 1, () => {
		each_blocks[i] = null;
	});

	const buttons_slot_template = /*#slots*/ ctx[6].buttons;
	const buttons_slot = create_slot(buttons_slot_template, ctx, /*$$scope*/ ctx[5], get_buttons_slot_context);

	const block = {
		c: function create() {
			form_1 = element("form");
			div2 = element("div");
			create_component(loadingindicator.$$.fragment);
			t0 = space();
			div1 = element("div");
			if (header_slot) header_slot.c();
			t1 = space();
			div0 = element("div");

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].c();
			}

			t2 = space();
			if (buttons_slot) buttons_slot.c();
			attr_dev(div0, "class", div0_class_value = /*$form*/ ctx[3].classes[2]);
			add_location(div0, file$8, 57, 8, 1382);
			attr_dev(div1, "class", div1_class_value = /*$form*/ ctx[3].classes[1]);
			add_location(div1, file$8, 52, 6, 1222);
			attr_dev(div2, "class", div2_class_value = /*$form*/ ctx[3].classes[0]);
			add_location(div2, file$8, 50, 4, 1120);
			add_render_callback(() => /*form_1_elementresize_handler*/ ctx[7].call(form_1));
			add_location(form_1, file$8, 45, 2, 1009);
		},
		m: function mount(target, anchor) {
			insert_dev(target, form_1, anchor);
			append_dev(form_1, div2);
			mount_component(loadingindicator, div2, null);
			append_dev(div2, t0);
			append_dev(div2, div1);

			if (header_slot) {
				header_slot.m(div1, null);
			}

			append_dev(div1, t1);
			append_dev(div1, div0);

			for (let i = 0; i < each_blocks.length; i += 1) {
				each_blocks[i].m(div0, null);
			}

			append_dev(div2, t2);

			if (buttons_slot) {
				buttons_slot.m(div2, null);
			}

			form_1_resize_listener = add_resize_listener(form_1, /*form_1_elementresize_handler*/ ctx[7].bind(form_1));
			current = true;

			if (!mounted) {
				dispose = listen_dev(form_1, "submit", prevent_default(/*handleSubmit*/ ctx[4]), false, true, false);
				mounted = true;
			}
		},
		p: function update(ctx, dirty) {
			const loadingindicator_changes = {};
			if (dirty & /*$form*/ 8) loadingindicator_changes.visible = /*$form*/ ctx[3].loading;
			if (dirty & /*fw*/ 2) loadingindicator_changes.w = /*fw*/ ctx[1];
			if (dirty & /*fh*/ 4) loadingindicator_changes.h = /*fh*/ ctx[2];
			loadingindicator.$set(loadingindicator_changes);

			if (header_slot) {
				if (header_slot.p && dirty & /*$$scope*/ 32) {
					update_slot(header_slot, header_slot_template, ctx, /*$$scope*/ ctx[5], dirty, get_header_slot_changes, get_header_slot_context);
				}
			}

			if (dirty & /*$form, form*/ 9) {
				each_value = /*$form*/ ctx[3].fields;
				validate_each_argument(each_value);
				let i;

				for (i = 0; i < each_value.length; i += 1) {
					const child_ctx = get_each_context$3(ctx, each_value, i);

					if (each_blocks[i]) {
						each_blocks[i].p(child_ctx, dirty);
						transition_in(each_blocks[i], 1);
					} else {
						each_blocks[i] = create_each_block$3(child_ctx);
						each_blocks[i].c();
						transition_in(each_blocks[i], 1);
						each_blocks[i].m(div0, null);
					}
				}

				group_outros();

				for (i = each_value.length; i < each_blocks.length; i += 1) {
					out(i);
				}

				check_outros();
			}

			if (!current || dirty & /*$form*/ 8 && div0_class_value !== (div0_class_value = /*$form*/ ctx[3].classes[2])) {
				attr_dev(div0, "class", div0_class_value);
			}

			if (!current || dirty & /*$form*/ 8 && div1_class_value !== (div1_class_value = /*$form*/ ctx[3].classes[1])) {
				attr_dev(div1, "class", div1_class_value);
			}

			if (buttons_slot) {
				if (buttons_slot.p && dirty & /*$$scope*/ 32) {
					update_slot(buttons_slot, buttons_slot_template, ctx, /*$$scope*/ ctx[5], dirty, get_buttons_slot_changes, get_buttons_slot_context);
				}
			}

			if (!current || dirty & /*$form*/ 8 && div2_class_value !== (div2_class_value = /*$form*/ ctx[3].classes[0])) {
				attr_dev(div2, "class", div2_class_value);
			}
		},
		i: function intro(local) {
			if (current) return;
			transition_in(loadingindicator.$$.fragment, local);
			transition_in(header_slot, local);

			for (let i = 0; i < each_value.length; i += 1) {
				transition_in(each_blocks[i]);
			}

			transition_in(buttons_slot, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(loadingindicator.$$.fragment, local);
			transition_out(header_slot, local);
			each_blocks = each_blocks.filter(Boolean);

			for (let i = 0; i < each_blocks.length; i += 1) {
				transition_out(each_blocks[i]);
			}

			transition_out(buttons_slot, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(form_1);
			destroy_component(loadingindicator);
			if (header_slot) header_slot.d(detaching);
			destroy_each(each_blocks, detaching);
			if (buttons_slot) buttons_slot.d(detaching);
			form_1_resize_listener();
			mounted = false;
			dispose();
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_else_block$1.name,
		type: "else",
		source: "(45:0) {:else}",
		ctx
	});

	return block;
}

// (43:0) {#if $form.template}
function create_if_block$8(ctx) {
	let switch_instance;
	let switch_instance_anchor;
	let current;
	var switch_value = /*$form*/ ctx[3].template;

	function switch_props(ctx) {
		return {
			props: { form: /*form*/ ctx[0] },
			$$inline: true
		};
	}

	if (switch_value) {
		switch_instance = new switch_value(switch_props(ctx));
	}

	const block = {
		c: function create() {
			if (switch_instance) create_component(switch_instance.$$.fragment);
			switch_instance_anchor = empty();
		},
		m: function mount(target, anchor) {
			if (switch_instance) {
				mount_component(switch_instance, target, anchor);
			}

			insert_dev(target, switch_instance_anchor, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const switch_instance_changes = {};
			if (dirty & /*form*/ 1) switch_instance_changes.form = /*form*/ ctx[0];

			if (switch_value !== (switch_value = /*$form*/ ctx[3].template)) {
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
		i: function intro(local) {
			if (current) return;
			if (switch_instance) transition_in(switch_instance.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			if (switch_instance) transition_out(switch_instance.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(switch_instance_anchor);
			if (switch_instance) destroy_component(switch_instance, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_if_block$8.name,
		type: "if",
		source: "(43:0) {#if $form.template}",
		ctx
	});

	return block;
}

// (59:10) {#each $form.fields as field, i}
function create_each_block$3(ctx) {
	let field;
	let current;

	field = new Field({
			props: {
				field: /*field*/ ctx[9],
				form: /*form*/ ctx[0]
			},
			$$inline: true
		});

	const block = {
		c: function create() {
			create_component(field.$$.fragment);
		},
		m: function mount(target, anchor) {
			mount_component(field, target, anchor);
			current = true;
		},
		p: function update(ctx, dirty) {
			const field_changes = {};
			if (dirty & /*$form*/ 8) field_changes.field = /*field*/ ctx[9];
			if (dirty & /*form*/ 1) field_changes.form = /*form*/ ctx[0];
			field.$set(field_changes);
		},
		i: function intro(local) {
			if (current) return;
			transition_in(field.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(field.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(field, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_each_block$3.name,
		type: "each",
		source: "(59:10) {#each $form.fields as field, i}",
		ctx
	});

	return block;
}

function create_fragment$8(ctx) {
	let current_block_type_index;
	let if_block;
	let if_block_anchor;
	let current;
	const if_block_creators = [create_if_block$8, create_else_block$1];
	const if_blocks = [];

	function select_block_type(ctx, dirty) {
		if (/*$form*/ ctx[3].template) return 0;
		return 1;
	}

	current_block_type_index = select_block_type(ctx);
	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

	const block = {
		c: function create() {
			if_block.c();
			if_block_anchor = empty();
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			if_blocks[current_block_type_index].m(target, anchor);
			insert_dev(target, if_block_anchor, anchor);
			current = true;
		},
		p: function update(ctx, [dirty]) {
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
		i: function intro(local) {
			if (current) return;
			transition_in(if_block);
			current = true;
		},
		o: function outro(local) {
			transition_out(if_block);
			current = false;
		},
		d: function destroy(detaching) {
			if_blocks[current_block_type_index].d(detaching);
			if (detaching) detach_dev(if_block_anchor);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$8.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$8($$self, $$props, $$invalidate) {
	let $form,
		$$unsubscribe_form = noop,
		$$subscribe_form = () => ($$unsubscribe_form(), $$unsubscribe_form = subscribe(form, $$value => $$invalidate(3, $form = $$value)), form);

	$$self.$$.on_destroy.push(() => $$unsubscribe_form());
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("DynamicForm", slots, ['header','buttons']);
	const dispatch = createEventDispatcher();
	let { form } = $$props;
	validate_store(form, "form");
	$$subscribe_form();

	const handleSubmit = e => {
		dispatch("submit", e);
	};

	onMount(() => {
		
	}); // setTimeout(() ``=> {
	// $form.fields.forEach((field) => {
	//   console.log("VAL: ", get(field.value));
	// });

	// }, 5000);
	onDestroy(() => {
		dispatch("destroy", true);
		$form.destroy();
	});

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
	let fw;

	let fh;
	const writable_props = ["form"];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<DynamicForm> was created with unknown prop '${key}'`);
	});

	function form_1_elementresize_handler() {
		fh = this.clientHeight;
		fw = this.clientWidth;
		$$invalidate(2, fh);
		$$invalidate(1, fw);
	}

	$$self.$$set = $$props => {
		if ("form" in $$props) $$subscribe_form($$invalidate(0, form = $$props.form));
		if ("$$scope" in $$props) $$invalidate(5, $$scope = $$props.$$scope);
	};

	$$self.$capture_state = () => ({
		onDestroy,
		onMount,
		LoadingIndicator,
		Field,
		createEventDispatcher,
		dispatch,
		form,
		handleSubmit,
		fw,
		fh,
		$form
	});

	$$self.$inject_state = $$props => {
		if ("form" in $$props) $$subscribe_form($$invalidate(0, form = $$props.form));
		if ("fw" in $$props) $$invalidate(1, fw = $$props.fw);
		if ("fh" in $$props) $$invalidate(2, fh = $$props.fh);
	};

	if ($$props && "$$inject" in $$props) {
		$$self.$inject_state($$props.$$inject);
	}

	return [
		form,
		fw,
		fh,
		$form,
		handleSubmit,
		$$scope,
		slots,
		form_1_elementresize_handler
	];
}

class DynamicForm extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$8, create_fragment$8, safe_not_equal, { form: 0 });

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "DynamicForm",
			options,
			id: create_fragment$8.name
		});

		const { ctx } = this.$$;
		const props = options.props || {};

		if (/*form*/ ctx[0] === undefined && !("form" in props)) {
			console.warn("<DynamicForm> was created without expected prop 'form'");
		}
	}

	get form() {
		throw new Error("<DynamicForm>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}

	set form(value) {
		throw new Error("<DynamicForm>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
	}
}

/* src/example/BusinessSettingsForm.svelte generated by Svelte v3.32.3 */

function create_fragment$9(ctx) {
	let dynamicform;
	let current;

	dynamicform = new DynamicForm({
			props: { form: formState },
			$$inline: true
		});

	dynamicform.$on("submit", onSubmit);

	const block = {
		c: function create() {
			create_component(dynamicform.$$.fragment);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			mount_component(dynamicform, target, anchor);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(dynamicform.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(dynamicform.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			destroy_component(dynamicform, detaching);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$9.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$9($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("BusinessSettingsForm", slots, []);

	onMount(() => {
		setTimeout(
			() => {
				init$2();
			},
			0
		);
	});

	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BusinessSettingsForm> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({
		onMount,
		onSubmit,
		init: init$2,
		formState,
		DynamicForm
	});

	return [];
}

class BusinessSettingsForm extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$9, create_fragment$9, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "BusinessSettingsForm",
			options,
			id: create_fragment$9.name
		});
	}
}

/* src/App.svelte generated by Svelte v3.32.3 */
const file$9 = "src/App.svelte";

function create_fragment$a(ctx) {
	let main;
	let div1;
	let div0;
	let section;
	let businesssettingsform;
	let current;
	businesssettingsform = new BusinessSettingsForm({ $$inline: true });

	const block = {
		c: function create() {
			main = element("main");
			div1 = element("div");
			div0 = element("div");
			section = element("section");
			create_component(businesssettingsform.$$.fragment);
			add_location(section, file$9, 11, 6, 374);
			attr_dev(div0, "class", "w-full space-y-6");
			add_location(div0, file$9, 10, 4, 337);
			attr_dev(div1, "class", "flex items-start justify-center");
			add_location(div1, file$9, 9, 2, 287);
			attr_dev(main, "class", "py-24 pb-10 mx-auto max-w-7xl lg:py-36 xl:py-36 2xl:py-36 md:py-24 lg:px-8");
			add_location(main, file$9, 6, 0, 192);
		},
		l: function claim(nodes) {
			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
		},
		m: function mount(target, anchor) {
			insert_dev(target, main, anchor);
			append_dev(main, div1);
			append_dev(div1, div0);
			append_dev(div0, section);
			mount_component(businesssettingsform, section, null);
			current = true;
		},
		p: noop,
		i: function intro(local) {
			if (current) return;
			transition_in(businesssettingsform.$$.fragment, local);
			current = true;
		},
		o: function outro(local) {
			transition_out(businesssettingsform.$$.fragment, local);
			current = false;
		},
		d: function destroy(detaching) {
			if (detaching) detach_dev(main);
			destroy_component(businesssettingsform);
		}
	};

	dispatch_dev("SvelteRegisterBlock", {
		block,
		id: create_fragment$a.name,
		type: "component",
		source: "",
		ctx
	});

	return block;
}

function instance$a($$self, $$props, $$invalidate) {
	let { $$slots: slots = {}, $$scope } = $$props;
	validate_slots("App", slots, []);
	const writable_props = [];

	Object.keys($$props).forEach(key => {
		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
	});

	$$self.$capture_state = () => ({ BusinessSettingsForm });
	return [];
}

class App extends SvelteComponentDev {
	constructor(options) {
		super(options);
		init(this, options, instance$a, create_fragment$a, safe_not_equal, {});

		dispatch_dev("SvelteRegisterComponent", {
			component: this,
			tagName: "App",
			options,
			id: create_fragment$a.name
		});
	}
}

const app = new App({
	target: document.body
});

export default app;
//# sourceMappingURL=index.mjs.map
