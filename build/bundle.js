
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(window.document);
var app = (function () {
    'use strict';

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
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
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
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }
    function compute_rest_props(props, keys) {
        const rest = {};
        keys = new Set(keys);
        for (const k in props)
            if (!keys.has(k) && k[0] !== '$')
                rest[k] = props[k];
        return rest;
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
    function to_number(value) {
        return value === '' ? null : +value;
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
    function toggle_class(element, name, toggle) {
        element.classList[toggle ? 'add' : 'remove'](name);
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

    function create_animation(node, from, fn, params) {
        if (!from)
            return noop;
        const to = node.getBoundingClientRect();
        if (from.left === to.left && from.right === to.right && from.top === to.top && from.bottom === to.bottom)
            return noop;
        const { delay = 0, duration = 300, easing = identity, 
        // @ts-ignore todo: should this be separated from destructuring? Or start/end added to public api and documentation?
        start: start_time = now() + delay, 
        // @ts-ignore todo:
        end = start_time + duration, tick = noop, css } = fn(node, { from, to }, params);
        let running = true;
        let started = false;
        let name;
        function start() {
            if (css) {
                name = create_rule(node, 0, 1, duration, delay, easing, css);
            }
            if (!delay) {
                started = true;
            }
        }
        function stop() {
            if (css)
                delete_rule(node, name);
            running = false;
        }
        loop(now => {
            if (!started && now >= start_time) {
                started = true;
            }
            if (started && now >= end) {
                tick(1, 0);
                stop();
            }
            if (!running) {
                return false;
            }
            if (started) {
                const p = now - start_time;
                const t = 0 + 1 * easing(p / duration);
                tick(t, 1 - t);
            }
            return true;
        });
        start();
        tick(0, 1);
        return stop;
    }
    function fix_position(node) {
        const style = getComputedStyle(node);
        if (style.position !== 'absolute' && style.position !== 'fixed') {
            const { width, height } = style;
            const a = node.getBoundingClientRect();
            node.style.position = 'absolute';
            node.style.width = width;
            node.style.height = height;
            add_transform(node, a);
        }
    }
    function add_transform(node, a) {
        const b = node.getBoundingClientRect();
        if (a.left !== b.left || a.top !== b.top) {
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            node.style.transform = `${transform} translate(${a.left - b.left}px, ${a.top - b.top}px)`;
        }
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
    function afterUpdate(fn) {
        get_current_component().$$.after_update.push(fn);
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
    function setContext(key, context) {
        get_current_component().$$.context.set(key, context);
    }
    function getContext(key) {
        return get_current_component().$$.context.get(key);
    }
    // TODO figure out if we still want to support
    // shorthand events, or if we want to implement
    // a real bubbling mechanism
    function bubble(component, event) {
        const callbacks = component.$$.callbacks[event.type];
        if (callbacks) {
            callbacks.slice().forEach(fn => fn(event));
        }
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
    function tick() {
        schedule_update();
        return resolved_promise;
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

    function destroy_block(block, lookup) {
        block.d(1);
        lookup.delete(block.key);
    }
    function outro_and_destroy_block(block, lookup) {
        transition_out(block, 1, 1, () => {
            lookup.delete(block.key);
        });
    }
    function fix_and_outro_and_destroy_block(block, lookup) {
        block.f();
        outro_and_destroy_block(block, lookup);
    }
    function update_keyed_each(old_blocks, dirty, get_key, dynamic, ctx, list, lookup, node, destroy, create_each_block, next, get_context) {
        let o = old_blocks.length;
        let n = list.length;
        let i = o;
        const old_indexes = {};
        while (i--)
            old_indexes[old_blocks[i].key] = i;
        const new_blocks = [];
        const new_lookup = new Map();
        const deltas = new Map();
        i = n;
        while (i--) {
            const child_ctx = get_context(ctx, list, i);
            const key = get_key(child_ctx);
            let block = lookup.get(key);
            if (!block) {
                block = create_each_block(key, child_ctx);
                block.c();
            }
            else if (dynamic) {
                block.p(child_ctx, dirty);
            }
            new_lookup.set(key, new_blocks[i] = block);
            if (key in old_indexes)
                deltas.set(key, Math.abs(i - old_indexes[key]));
        }
        const will_move = new Set();
        const did_move = new Set();
        function insert(block) {
            transition_in(block, 1);
            block.m(node, next);
            lookup.set(block.key, block);
            next = block.first;
            n--;
        }
        while (o && n) {
            const new_block = new_blocks[n - 1];
            const old_block = old_blocks[o - 1];
            const new_key = new_block.key;
            const old_key = old_block.key;
            if (new_block === old_block) {
                // do nothing
                next = new_block.first;
                o--;
                n--;
            }
            else if (!new_lookup.has(old_key)) {
                // remove old block
                destroy(old_block, lookup);
                o--;
            }
            else if (!lookup.has(new_key) || will_move.has(new_key)) {
                insert(new_block);
            }
            else if (did_move.has(old_key)) {
                o--;
            }
            else if (deltas.get(new_key) > deltas.get(old_key)) {
                did_move.add(new_key);
                insert(new_block);
            }
            else {
                will_move.add(old_key);
                o--;
            }
        }
        while (o--) {
            const old_block = old_blocks[o];
            if (!new_lookup.has(old_block.key))
                destroy(old_block, lookup);
        }
        while (n)
            insert(new_blocks[n - 1]);
        return new_blocks;
    }
    function validate_each_keys(ctx, list, get_context, get_key) {
        const keys = new Set();
        for (let i = 0; i < list.length; i++) {
            const key = get_key(get_context(ctx, list, i));
            if (keys.has(key)) {
                throw new Error('Cannot have duplicate keys in a keyed each');
            }
            keys.add(key);
        }
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
    function get_spread_object(spread_props) {
        return typeof spread_props === 'object' && spread_props !== null ? spread_props : {};
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

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.35.0' }, detail)));
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
     * Creates a `Readable` store that allows reading by subscription.
     * @param value initial value
     * @param {StartStopNotifier}start start and stop notifications for subscriptions
     */
    function readable(value, start) {
        return {
            subscribe: writable(value, start).subscribe
        };
    }
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
    function derived(stores, fn, initial_value) {
        const single = !Array.isArray(stores);
        const stores_array = single
            ? [stores]
            : stores;
        const auto = fn.length < 2;
        return readable(initial_value, (set) => {
            let inited = false;
            const values = [];
            let pending = 0;
            let cleanup = noop;
            const sync = () => {
                if (pending) {
                    return;
                }
                cleanup();
                const result = fn(single ? values[0] : values, set);
                if (auto) {
                    set(result);
                }
                else {
                    cleanup = is_function(result) ? result : noop;
                }
            };
            const unsubscribers = stores_array.map((store, i) => subscribe(store, (value) => {
                values[i] = value;
                pending &= ~(1 << i);
                if (inited) {
                    sync();
                }
            }, () => {
                pending |= (1 << i);
            }));
            inited = true;
            sync();
            return function stop() {
                run_all(unsubscribers);
                cleanup();
            };
        });
    }

    function notificationsStore(initialValue = []) {
      const store = writable(initialValue);
      const { set, update, subscribe } = store;
      let defaultOptions = {
        duration: 3000,
        placement: 'bottom-right',
        type: 'info',
        theme: 'dark',
      };
      function add(options) {
        const {
          duration = 3000,
          placement = 'bottom-right',
          type = 'info',
          theme = 'dark',
          ...rest
        } = { ...defaultOptions, ...options };

        const uid = Date.now();
        const obj = {
          ...rest,
          uid,
          placement,
          type,
          theme,
          duration,
          remove: () => {
            update((v) => v.filter((i) => i.uid !== uid));
          },
          update: (data) => {
            delete data.uid;
            const index = get_store_value(store)?.findIndex((v) => v?.uid === uid);
            if (index > -1) {
              update((v) => [
                ...v.slice(0, index),
                { ...v[index], ...data },
                ...v.slice(index + 1),
              ]);
            }
          },
        };
        update((v) => [...v, obj]);
        if (duration > 0) {
          setTimeout(() => {
            obj.remove();
            if (typeof obj.onRemove === 'function') obj.onRemove();
          }, duration);
        }
        return obj;
      }

      function getById(uid) {
        return get_store_value(store)?.find((v) => v?.uid === uid);
      }

      function clearAll() {
        set([]);
      }
      function clearLast() {
        update((v) => {
          return v.slice(0, v.length - 1);
        });
      }

      function setDefaults(options) {
        defaultOptions = { ...defaultOptions, ...options };
      }

      return {
        subscribe,
        add,
        success: getHelper('success', add),
        info: getHelper('info', add),
        error: getHelper('error', add),
        warning: getHelper('warning', add),
        clearAll,
        clearLast,
        getById,
        setDefaults,
      };
    }
    const toasts = notificationsStore([]);

    function getHelper(type, add) {
      return function () {
        if (typeof arguments[0] === 'object') {
          const options = arguments[0];
          return add({ ...options, type });
        } else if (
          typeof arguments[0] === 'string' &&
          typeof arguments[1] === 'string'
        ) {
          const options = arguments[2] || {};
          return add({
            ...options,
            type,
            title: arguments[0],
            description: arguments[1],
          });
        } else if (typeof arguments[0] === 'string') {
          const options = arguments[1] || {};
          return add({
            ...options,
            type,
            description: arguments[0],
          });
        }
      };
    }

    function cubicOut(t) {
        const f = t - 1.0;
        return f * f * f + 1.0;
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

    function __rest(s, e) {
        var t = {};
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
            t[p] = s[p];
        if (s != null && typeof Object.getOwnPropertySymbols === "function")
            for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
                if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                    t[p[i]] = s[p[i]];
            }
        return t;
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
    function crossfade(_a) {
        var { fallback } = _a, defaults = __rest(_a, ["fallback"]);
        const to_receive = new Map();
        const to_send = new Map();
        function crossfade(from, node, params) {
            const { delay = 0, duration = d => Math.sqrt(d) * 30, easing = cubicOut } = assign(assign({}, defaults), params);
            const to = node.getBoundingClientRect();
            const dx = from.left - to.left;
            const dy = from.top - to.top;
            const dw = from.width / to.width;
            const dh = from.height / to.height;
            const d = Math.sqrt(dx * dx + dy * dy);
            const style = getComputedStyle(node);
            const transform = style.transform === 'none' ? '' : style.transform;
            const opacity = +style.opacity;
            return {
                delay,
                duration: is_function(duration) ? duration(d) : duration,
                easing,
                css: (t, u) => `
				opacity: ${t * opacity};
				transform-origin: top left;
				transform: ${transform} translate(${u * dx}px,${u * dy}px) scale(${t + (1 - t) * dw}, ${t + (1 - t) * dh});
			`
            };
        }
        function transition(items, counterparts, intro) {
            return (node, params) => {
                items.set(params.key, {
                    rect: node.getBoundingClientRect()
                });
                return () => {
                    if (counterparts.has(params.key)) {
                        const { rect } = counterparts.get(params.key);
                        counterparts.delete(params.key);
                        return crossfade(rect, node, params);
                    }
                    // if the node is disappearing altogether
                    // (i.e. wasn't claimed by the other list)
                    // then we need to supply an outro
                    items.delete(params.key);
                    return fallback && fallback(node, params, intro);
                };
            };
        }
        return [
            transition(to_send, to_receive, false),
            transition(to_receive, to_send, true)
        ];
    }

    function flip(node, animation, params = {}) {
        const style = getComputedStyle(node);
        const transform = style.transform === 'none' ? '' : style.transform;
        const scaleX = animation.from.width / node.clientWidth;
        const scaleY = animation.from.height / node.clientHeight;
        const dx = (animation.from.left - animation.to.left) / scaleX;
        const dy = (animation.from.top - animation.to.top) / scaleY;
        const d = Math.sqrt(dx * dx + dy * dy);
        const { delay = 0, duration = (d) => Math.sqrt(d) * 120, easing = cubicOut } = params;
        return {
            delay,
            duration: is_function(duration) ? duration(d) : duration,
            easing,
            css: (_t, u) => `transform: ${transform} translate(${u * dx}px, ${u * dy}px);`
        };
    }

    /* node_modules/svelte-toasts/src/ToastContainer.svelte generated by Svelte v3.35.0 */
    const file$i = "node_modules/svelte-toasts/src/ToastContainer.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[1] = list[i];
    	return child_ctx;
    }

    function get_each_context_1$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[14] = list[i];
    	return child_ctx;
    }

    const get_default_slot_changes$1 = dirty => ({ data: dirty & /*$toasts*/ 4 });
    const get_default_slot_context$1 = ctx => ({ data: /*toast*/ ctx[14] });

    // (98:10) {:else}
    function create_else_block$5(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[10].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[9], get_default_slot_context$1);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, $toasts*/ 516) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[9], dirty, get_default_slot_changes$1, get_default_slot_context$1);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$5.name,
    		type: "else",
    		source: "(98:10) {:else}",
    		ctx
    	});

    	return block;
    }

    // (96:10) {#if toast.component}
    function create_if_block$7(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;
    	var switch_value = /*toast*/ ctx[14].component;

    	function switch_props(ctx) {
    		return {
    			props: { data: /*toast*/ ctx[14] },
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
    			if (dirty & /*$toasts*/ 4) switch_instance_changes.data = /*toast*/ ctx[14];

    			if (switch_value !== (switch_value = /*toast*/ ctx[14].component)) {
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
    		id: create_if_block$7.name,
    		type: "if",
    		source: "(96:10) {#if toast.component}",
    		ctx
    	});

    	return block;
    }

    // (88:6) {#each $toasts         .filter((n) => n.placement === placement)         .reverse() as toast (toast.uid)}
    function create_each_block_1$1(key_1, ctx) {
    	let li;
    	let current_block_type_index;
    	let if_block;
    	let t;
    	let li_intro;
    	let li_outro;
    	let rect;
    	let stop_animation = noop;
    	let current;
    	const if_block_creators = [create_if_block$7, create_else_block$5];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*toast*/ ctx[14].component) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			li = element("li");
    			if_block.c();
    			t = space();
    			attr_dev(li, "class", "svelte-n9vmq4");
    			add_location(li, file$i, 90, 8, 2068);
    			this.first = li;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			if_blocks[current_block_type_index].m(li, null);
    			append_dev(li, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
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
    				if_block.m(li, t);
    			}
    		},
    		r: function measure() {
    			rect = li.getBoundingClientRect();
    		},
    		f: function fix() {
    			fix_position(li);
    			stop_animation();
    			add_transform(li, rect);
    		},
    		a: function animate() {
    			stop_animation();
    			stop_animation = create_animation(li, rect, flip, {});
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block);

    			add_render_callback(() => {
    				if (li_outro) li_outro.end(1);
    				if (!li_intro) li_intro = create_in_transition(li, fade, { duration: 500 });
    				li_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block);
    			if (li_intro) li_intro.invalidate();

    			li_outro = create_out_transition(li, fly, {
    				y: /*flyMap*/ ctx[4][/*toast*/ ctx[14].placement],
    				duration: 1000
    			});

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			if_blocks[current_block_type_index].d();
    			if (detaching && li_outro) li_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1$1.name,
    		type: "each",
    		source: "(88:6) {#each $toasts         .filter((n) => n.placement === placement)         .reverse() as toast (toast.uid)}",
    		ctx
    	});

    	return block;
    }

    // (85:0) {#each placements as placement}
    function create_each_block$1(ctx) {
    	let div;
    	let ul;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t;
    	let current;

    	function func(...args) {
    		return /*func*/ ctx[11](/*placement*/ ctx[1], ...args);
    	}

    	let each_value_1 = /*$toasts*/ ctx[2].filter(func).reverse();
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*toast*/ ctx[14].uid;
    	validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1$1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1$1(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div = element("div");
    			ul = element("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			attr_dev(ul, "class", "svelte-n9vmq4");
    			add_location(ul, file$i, 86, 4, 1943);
    			attr_dev(div, "class", "toast-container " + /*placement*/ ctx[1] + " svelte-n9vmq4");
    			set_style(div, "width", /*width*/ ctx[0]);
    			add_location(div, file$i, 85, 2, 1874);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, ul);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}

    			append_dev(div, t);
    			current = true;
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*flyMap, $toasts, placements, $$scope*/ 540) {
    				each_value_1 = /*$toasts*/ ctx[2].filter(func).reverse();
    				validate_each_argument(each_value_1);
    				group_outros();
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].r();
    				validate_each_keys(ctx, each_value_1, get_each_context_1$1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, ul, fix_and_outro_and_destroy_block, create_each_block_1$1, null, get_each_context_1$1);
    				for (let i = 0; i < each_blocks.length; i += 1) each_blocks[i].a();
    				check_outros();
    			}

    			if (!current || dirty & /*width*/ 1) {
    				set_style(div, "width", /*width*/ ctx[0]);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;

    			for (let i = 0; i < each_value_1.length; i += 1) {
    				transition_in(each_blocks[i]);
    			}

    			current = true;
    		},
    		o: function outro(local) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(85:0) {#each placements as placement}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$k(ctx) {
    	let each_1_anchor;
    	let current;
    	let each_value = /*placements*/ ctx[3];
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
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			each_1_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(target, anchor);
    			}

    			insert_dev(target, each_1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*placements, width, $toasts, flyMap, $$scope*/ 541) {
    				each_value = /*placements*/ ctx[3];
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
    						each_blocks[i].m(each_1_anchor.parentNode, each_1_anchor);
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

    			current = true;
    		},
    		o: function outro(local) {
    			each_blocks = each_blocks.filter(Boolean);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				transition_out(each_blocks[i]);
    			}

    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_each(each_blocks, detaching);
    			if (detaching) detach_dev(each_1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$k.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$k($$self, $$props, $$invalidate) {
    	let $toasts;
    	validate_store(toasts, "toasts");
    	component_subscribe($$self, toasts, $$value => $$invalidate(2, $toasts = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ToastContainer", slots, ['default']);
    	var { theme = "dark" } = $$props;
    	var { placement = "bottom-right" } = $$props;
    	var { type = "info" } = $$props;
    	var { showProgress = false } = $$props;
    	var { duration = 3000 } = $$props;
    	var { width = "320px" } = $$props;

    	/**
     * Default slot which is Toast component/template which will get toast data
     * @slot {{ data: ToastProps }}
     */
    	var placements = [
    		"bottom-right",
    		"bottom-left",
    		"top-right",
    		"top-left",
    		"top-center",
    		"bottom-center",
    		"center-center"
    	];

    	var flyMap = {
    		"bottom-right": 400,
    		"top-right": -400,
    		"bottom-left": 400,
    		"top-left": -400,
    		"bottom-center": 400,
    		"top-center": -400,
    		"center-center": -800
    	};

    	onMount(() => {
    		toasts.setDefaults({
    			placement,
    			showProgress,
    			theme,
    			duration,
    			type
    		});
    	});

    	const writable_props = ["theme", "placement", "type", "showProgress", "duration", "width"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ToastContainer> was created with unknown prop '${key}'`);
    	});

    	const func = (placement, n) => n.placement === placement;

    	$$self.$$set = $$props => {
    		if ("theme" in $$props) $$invalidate(5, theme = $$props.theme);
    		if ("placement" in $$props) $$invalidate(1, placement = $$props.placement);
    		if ("type" in $$props) $$invalidate(6, type = $$props.type);
    		if ("showProgress" in $$props) $$invalidate(7, showProgress = $$props.showProgress);
    		if ("duration" in $$props) $$invalidate(8, duration = $$props.duration);
    		if ("width" in $$props) $$invalidate(0, width = $$props.width);
    		if ("$$scope" in $$props) $$invalidate(9, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		fly,
    		fade,
    		onMount,
    		flip,
    		toasts,
    		theme,
    		placement,
    		type,
    		showProgress,
    		duration,
    		width,
    		placements,
    		flyMap,
    		$toasts
    	});

    	$$self.$inject_state = $$props => {
    		if ("theme" in $$props) $$invalidate(5, theme = $$props.theme);
    		if ("placement" in $$props) $$invalidate(1, placement = $$props.placement);
    		if ("type" in $$props) $$invalidate(6, type = $$props.type);
    		if ("showProgress" in $$props) $$invalidate(7, showProgress = $$props.showProgress);
    		if ("duration" in $$props) $$invalidate(8, duration = $$props.duration);
    		if ("width" in $$props) $$invalidate(0, width = $$props.width);
    		if ("placements" in $$props) $$invalidate(3, placements = $$props.placements);
    		if ("flyMap" in $$props) $$invalidate(4, flyMap = $$props.flyMap);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		width,
    		placement,
    		$toasts,
    		placements,
    		flyMap,
    		theme,
    		type,
    		showProgress,
    		duration,
    		$$scope,
    		slots,
    		func
    	];
    }

    class ToastContainer extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$k, create_fragment$k, safe_not_equal, {
    			theme: 5,
    			placement: 1,
    			type: 6,
    			showProgress: 7,
    			duration: 8,
    			width: 0
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToastContainer",
    			options,
    			id: create_fragment$k.name
    		});
    	}

    	get theme() {
    		throw new Error("<ToastContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<ToastContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get placement() {
    		throw new Error("<ToastContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set placement(value) {
    		throw new Error("<ToastContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get type() {
    		throw new Error("<ToastContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set type(value) {
    		throw new Error("<ToastContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get showProgress() {
    		throw new Error("<ToastContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set showProgress(value) {
    		throw new Error("<ToastContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get duration() {
    		throw new Error("<ToastContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set duration(value) {
    		throw new Error("<ToastContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get width() {
    		throw new Error("<ToastContainer>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set width(value) {
    		throw new Error("<ToastContainer>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-toasts/src/BootstrapToast.svelte generated by Svelte v3.35.0 */

    const file$h = "node_modules/svelte-toasts/src/BootstrapToast.svelte";
    const get_extra_slot_changes$1 = dirty => ({});
    const get_extra_slot_context$1 = ctx => ({});
    const get_close_icon_slot_changes_1 = dirty => ({});
    const get_close_icon_slot_context_1 = ctx => ({});
    const get_icon_slot_changes_1 = dirty => ({});
    const get_icon_slot_context_1 = ctx => ({});
    const get_close_icon_slot_changes$1 = dirty => ({});
    const get_close_icon_slot_context$1 = ctx => ({});
    const get_icon_slot_changes$2 = dirty => ({});
    const get_icon_slot_context$2 = ctx => ({});

    // (30:2) {#if data.title}
    function create_if_block_5(ctx) {
    	let div;
    	let t0;
    	let strong;
    	let t1_value = /*data*/ ctx[1].title + "";
    	let t1;
    	let t2;
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const icon_slot_template = /*#slots*/ ctx[5].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[4], get_icon_slot_context$2);
    	const icon_slot_or_fallback = icon_slot || fallback_block_3(ctx);
    	const close_icon_slot_template = /*#slots*/ ctx[5]["close-icon"];
    	const close_icon_slot = create_slot(close_icon_slot_template, ctx, /*$$scope*/ ctx[4], get_close_icon_slot_context$1);
    	const close_icon_slot_or_fallback = close_icon_slot || fallback_block_2(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			if (icon_slot_or_fallback) icon_slot_or_fallback.c();
    			t0 = space();
    			strong = element("strong");
    			t1 = text(t1_value);
    			t2 = space();
    			button = element("button");
    			if (close_icon_slot_or_fallback) close_icon_slot_or_fallback.c();
    			attr_dev(strong, "class", "st-toast-title svelte-1f0ncae");
    			add_location(strong, file$h, 97, 6, 2893);
    			attr_dev(button, "data-notification-btn", "");
    			attr_dev(button, "class", "st-toast-close-btn svelte-1f0ncae");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "aria-label", "close");
    			add_location(button, file$h, 99, 6, 3010);
    			attr_dev(div, "class", "st-toast-header svelte-1f0ncae");
    			add_location(div, file$h, 30, 4, 586);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);

    			if (icon_slot_or_fallback) {
    				icon_slot_or_fallback.m(div, null);
    			}

    			append_dev(div, t0);
    			append_dev(div, strong);
    			append_dev(strong, t1);
    			append_dev(div, t2);
    			append_dev(div, button);

    			if (close_icon_slot_or_fallback) {
    				close_icon_slot_or_fallback.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*onRemove*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (icon_slot) {
    				if (icon_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(icon_slot, icon_slot_template, ctx, /*$$scope*/ ctx[4], dirty, get_icon_slot_changes$2, get_icon_slot_context$2);
    				}
    			} else {
    				if (icon_slot_or_fallback && icon_slot_or_fallback.p && dirty & /*data*/ 2) {
    					icon_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			if ((!current || dirty & /*data*/ 2) && t1_value !== (t1_value = /*data*/ ctx[1].title + "")) set_data_dev(t1, t1_value);

    			if (close_icon_slot) {
    				if (close_icon_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(close_icon_slot, close_icon_slot_template, ctx, /*$$scope*/ ctx[4], dirty, get_close_icon_slot_changes$1, get_close_icon_slot_context$1);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_slot_or_fallback, local);
    			transition_in(close_icon_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_slot_or_fallback, local);
    			transition_out(close_icon_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (icon_slot_or_fallback) icon_slot_or_fallback.d(detaching);
    			if (close_icon_slot_or_fallback) close_icon_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_5.name,
    		type: "if",
    		source: "(30:2) {#if data.title}",
    		ctx
    	});

    	return block;
    }

    // (80:8) {:else}
    function create_else_block_1(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1\ts1,0.4,1,1S10.6,16,10,16z");
    			add_location(path0, file$h, 87, 13, 2492);
    			attr_dev(path1, "d", "M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S10.6,16,10,16z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$h, 89, 14, 2656);
    			attr_dev(svg, "class", "st-toast-icon svelte-1f0ncae");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$h, 80, 10, 2283);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block_1.name,
    		type: "else",
    		source: "(80:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (64:40) 
    function create_if_block_8(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z");
    			add_location(path0, file$h, 71, 13, 1979);
    			attr_dev(path1, "d", "M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$h, 73, 14, 2098);
    			attr_dev(svg, "class", "st-toast-icon svelte-1f0ncae");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$h, 64, 10, 1770);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_8.name,
    		type: "if",
    		source: "(64:40) ",
    		ctx
    	});

    	return block;
    }

    // (52:39) 
    function create_if_block_7(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,5a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,7Zm4,17.12H12V21.88h2.88V15.12H13V12.88h4.13v9H20Z");
    			add_location(path, file$h, 59, 13, 1527);
    			attr_dev(svg, "class", "st-toast-icon svelte-1f0ncae");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 32 32");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$h, 52, 10, 1318);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_7.name,
    		type: "if",
    		source: "(52:39) ",
    		ctx
    	});

    	return block;
    }

    // (33:8) {#if data.type === 'success'}
    function create_if_block_6(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M10,1c-4.9,0-9,4.1-9,9s4.1,9,9,9s9-4,9-9S15,1,10,1z M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z");
    			add_location(path0, file$h, 41, 12, 909);
    			attr_dev(path1, "fill", "none");
    			attr_dev(path1, "d", "M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$h, 44, 12, 1065);
    			attr_dev(svg, "class", "st-toast-icon svelte-1f0ncae");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$h, 33, 10, 689);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_6.name,
    		type: "if",
    		source: "(33:8) {#if data.type === 'success'}",
    		ctx
    	});

    	return block;
    }

    // (32:24)          
    function fallback_block_3(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*data*/ ctx[1].type === "success") return create_if_block_6;
    		if (/*data*/ ctx[1].type === "info") return create_if_block_7;
    		if (/*data*/ ctx[1].type === "error") return create_if_block_8;
    		return create_else_block_1;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_3.name,
    		type: "fallback",
    		source: "(32:24)          ",
    		ctx
    	});

    	return block;
    }

    // (107:32)            
    function fallback_block_2(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z");
    			add_location(path, file$h, 115, 12, 3452);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "bx--toast-notification__close-icon svelte-1f0ncae");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 32 32");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$h, 107, 10, 3211);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_2.name,
    		type: "fallback",
    		source: "(107:32)            ",
    		ctx
    	});

    	return block;
    }

    // (125:4) {#if !data.title}
    function create_if_block_1$2(ctx) {
    	let current;
    	const icon_slot_template = /*#slots*/ ctx[5].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[4], get_icon_slot_context_1);
    	const icon_slot_or_fallback = icon_slot || fallback_block_1$1(ctx);

    	const block = {
    		c: function create() {
    			if (icon_slot_or_fallback) icon_slot_or_fallback.c();
    		},
    		m: function mount(target, anchor) {
    			if (icon_slot_or_fallback) {
    				icon_slot_or_fallback.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (icon_slot) {
    				if (icon_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(icon_slot, icon_slot_template, ctx, /*$$scope*/ ctx[4], dirty, get_icon_slot_changes_1, get_icon_slot_context_1);
    				}
    			} else {
    				if (icon_slot_or_fallback && icon_slot_or_fallback.p && dirty & /*data*/ 2) {
    					icon_slot_or_fallback.p(ctx, dirty);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (icon_slot_or_fallback) icon_slot_or_fallback.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$2.name,
    		type: "if",
    		source: "(125:4) {#if !data.title}",
    		ctx
    	});

    	return block;
    }

    // (174:8) {:else}
    function create_else_block$4(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1\ts1,0.4,1,1S10.6,16,10,16z");
    			add_location(path0, file$h, 181, 13, 5622);
    			attr_dev(path1, "d", "M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S10.6,16,10,16z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$h, 183, 14, 5786);
    			attr_dev(svg, "class", "st-toast-icon svelte-1f0ncae");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$h, 174, 10, 5413);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$4.name,
    		type: "else",
    		source: "(174:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (158:40) 
    function create_if_block_4$1(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z");
    			add_location(path0, file$h, 165, 13, 5109);
    			attr_dev(path1, "d", "M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$h, 167, 14, 5228);
    			attr_dev(svg, "class", "st-toast-icon svelte-1f0ncae");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$h, 158, 10, 4900);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4$1.name,
    		type: "if",
    		source: "(158:40) ",
    		ctx
    	});

    	return block;
    }

    // (146:39) 
    function create_if_block_3$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,5a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,7Zm4,17.12H12V21.88h2.88V15.12H13V12.88h4.13v9H20Z");
    			add_location(path, file$h, 153, 13, 4657);
    			attr_dev(svg, "class", "st-toast-icon svelte-1f0ncae");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 32 32");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$h, 146, 10, 4448);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3$1.name,
    		type: "if",
    		source: "(146:39) ",
    		ctx
    	});

    	return block;
    }

    // (127:8) {#if data.type === 'success'}
    function create_if_block_2$1(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M10,1c-4.9,0-9,4.1-9,9s4.1,9,9,9s9-4,9-9S15,1,10,1z M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z");
    			add_location(path0, file$h, 135, 12, 4039);
    			attr_dev(path1, "fill", "none");
    			attr_dev(path1, "d", "M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$h, 138, 12, 4195);
    			attr_dev(svg, "class", "st-toast-icon svelte-1f0ncae");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$h, 127, 10, 3819);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2$1.name,
    		type: "if",
    		source: "(127:8) {#if data.type === 'success'}",
    		ctx
    	});

    	return block;
    }

    // (126:24)          
    function fallback_block_1$1(ctx) {
    	let if_block_anchor;

    	function select_block_type_1(ctx, dirty) {
    		if (/*data*/ ctx[1].type === "success") return create_if_block_2$1;
    		if (/*data*/ ctx[1].type === "info") return create_if_block_3$1;
    		if (/*data*/ ctx[1].type === "error") return create_if_block_4$1;
    		return create_else_block$4;
    	}

    	let current_block_type = select_block_type_1(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type_1(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1$1.name,
    		type: "fallback",
    		source: "(126:24)          ",
    		ctx
    	});

    	return block;
    }

    // (194:4) {#if !data.title}
    function create_if_block$6(ctx) {
    	let button;
    	let current;
    	let mounted;
    	let dispose;
    	const close_icon_slot_template = /*#slots*/ ctx[5]["close-icon"];
    	const close_icon_slot = create_slot(close_icon_slot_template, ctx, /*$$scope*/ ctx[4], get_close_icon_slot_context_1);
    	const close_icon_slot_or_fallback = close_icon_slot || fallback_block$1(ctx);

    	const block = {
    		c: function create() {
    			button = element("button");
    			if (close_icon_slot_or_fallback) close_icon_slot_or_fallback.c();
    			attr_dev(button, "data-notification-btn", "");
    			attr_dev(button, "class", "st-toast-close-btn svelte-1f0ncae");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "aria-label", "close");
    			add_location(button, file$h, 194, 6, 6120);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);

    			if (close_icon_slot_or_fallback) {
    				close_icon_slot_or_fallback.m(button, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button, "click", /*onRemove*/ ctx[2], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (close_icon_slot) {
    				if (close_icon_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(close_icon_slot, close_icon_slot_template, ctx, /*$$scope*/ ctx[4], dirty, get_close_icon_slot_changes_1, get_close_icon_slot_context_1);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(close_icon_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(close_icon_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (close_icon_slot_or_fallback) close_icon_slot_or_fallback.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$6.name,
    		type: "if",
    		source: "(194:4) {#if !data.title}",
    		ctx
    	});

    	return block;
    }

    // (202:32)            
    function fallback_block$1(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z");
    			add_location(path, file$h, 210, 12, 6562);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "bx--toast-notification__close-icon svelte-1f0ncae");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 32 32");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$h, 202, 10, 6321);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block$1.name,
    		type: "fallback",
    		source: "(202:32)            ",
    		ctx
    	});

    	return block;
    }

    function create_fragment$j(ctx) {
    	let div2;
    	let t0;
    	let div1;
    	let t1;
    	let span;
    	let t2_value = /*data*/ ctx[1].description + "";
    	let t2;
    	let t3;
    	let t4;
    	let div0;
    	let div2_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	let if_block0 = /*data*/ ctx[1].title && create_if_block_5(ctx);
    	let if_block1 = !/*data*/ ctx[1].title && create_if_block_1$2(ctx);
    	let if_block2 = !/*data*/ ctx[1].title && create_if_block$6(ctx);
    	const extra_slot_template = /*#slots*/ ctx[5].extra;
    	const extra_slot = create_slot(extra_slot_template, ctx, /*$$scope*/ ctx[4], get_extra_slot_context$1);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			if (if_block0) if_block0.c();
    			t0 = space();
    			div1 = element("div");
    			if (if_block1) if_block1.c();
    			t1 = space();
    			span = element("span");
    			t2 = text(t2_value);
    			t3 = space();
    			if (if_block2) if_block2.c();
    			t4 = space();
    			div0 = element("div");
    			if (extra_slot) extra_slot.c();
    			attr_dev(span, "class", "st-toast-description svelte-1f0ncae");
    			add_location(span, file$h, 192, 4, 6031);
    			attr_dev(div0, "class", "st-toast-extra");
    			add_location(div0, file$h, 217, 4, 6761);
    			attr_dev(div1, "class", "st-toast-body svelte-1f0ncae");
    			toggle_class(div1, "st-toast-no-title", !/*data*/ ctx[1].title);
    			add_location(div1, file$h, 123, 2, 3658);
    			attr_dev(div2, "class", div2_class_value = "st-toast bootstrap " + (/*data*/ ctx[1].theme || /*theme*/ ctx[0]) + " " + (/*data*/ ctx[1].type || "info") + " svelte-1f0ncae");
    			attr_dev(div2, "role", "alert");
    			attr_dev(div2, "aria-live", "assertive");
    			attr_dev(div2, "aria-atomic", "true");
    			add_location(div2, file$h, 22, 0, 402);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			if (if_block0) if_block0.m(div2, null);
    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			if (if_block1) if_block1.m(div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, span);
    			append_dev(span, t2);
    			append_dev(div1, t3);
    			if (if_block2) if_block2.m(div1, null);
    			append_dev(div1, t4);
    			append_dev(div1, div0);

    			if (extra_slot) {
    				extra_slot.m(div0, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(div2, "click", /*onClick*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*data*/ ctx[1].title) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);

    					if (dirty & /*data*/ 2) {
    						transition_in(if_block0, 1);
    					}
    				} else {
    					if_block0 = create_if_block_5(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div2, t0);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (!/*data*/ ctx[1].title) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);

    					if (dirty & /*data*/ 2) {
    						transition_in(if_block1, 1);
    					}
    				} else {
    					if_block1 = create_if_block_1$2(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(div1, t1);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}

    			if ((!current || dirty & /*data*/ 2) && t2_value !== (t2_value = /*data*/ ctx[1].description + "")) set_data_dev(t2, t2_value);

    			if (!/*data*/ ctx[1].title) {
    				if (if_block2) {
    					if_block2.p(ctx, dirty);

    					if (dirty & /*data*/ 2) {
    						transition_in(if_block2, 1);
    					}
    				} else {
    					if_block2 = create_if_block$6(ctx);
    					if_block2.c();
    					transition_in(if_block2, 1);
    					if_block2.m(div1, t4);
    				}
    			} else if (if_block2) {
    				group_outros();

    				transition_out(if_block2, 1, 1, () => {
    					if_block2 = null;
    				});

    				check_outros();
    			}

    			if (extra_slot) {
    				if (extra_slot.p && dirty & /*$$scope*/ 16) {
    					update_slot(extra_slot, extra_slot_template, ctx, /*$$scope*/ ctx[4], dirty, get_extra_slot_changes$1, get_extra_slot_context$1);
    				}
    			}

    			if (dirty & /*data*/ 2) {
    				toggle_class(div1, "st-toast-no-title", !/*data*/ ctx[1].title);
    			}

    			if (!current || dirty & /*data, theme*/ 3 && div2_class_value !== (div2_class_value = "st-toast bootstrap " + (/*data*/ ctx[1].theme || /*theme*/ ctx[0]) + " " + (/*data*/ ctx[1].type || "info") + " svelte-1f0ncae")) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			transition_in(if_block1);
    			transition_in(if_block2);
    			transition_in(extra_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			transition_out(if_block1);
    			transition_out(if_block2);
    			transition_out(extra_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			if (if_block2) if_block2.d();
    			if (extra_slot) extra_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$j.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$j($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("BootstrapToast", slots, ['icon','close-icon','extra']);
    	var { theme = "light" } = $$props;
    	var { data = {} } = $$props;

    	var onRemove = e => {
    		e.stopPropagation();
    		data.remove();
    		if (typeof data.onRemove === "function") data.onRemove();
    	};

    	var onClick = () => {
    		if (typeof data.onClick === "function") data.onClick();
    	};

    	const writable_props = ["theme", "data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BootstrapToast> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("theme" in $$props) $$invalidate(0, theme = $$props.theme);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    		if ("$$scope" in $$props) $$invalidate(4, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({ theme, data, onRemove, onClick });

    	$$self.$inject_state = $$props => {
    		if ("theme" in $$props) $$invalidate(0, theme = $$props.theme);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    		if ("onRemove" in $$props) $$invalidate(2, onRemove = $$props.onRemove);
    		if ("onClick" in $$props) $$invalidate(3, onClick = $$props.onClick);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [theme, data, onRemove, onClick, $$scope, slots];
    }

    class BootstrapToast extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$j, create_fragment$j, safe_not_equal, { theme: 0, data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BootstrapToast",
    			options,
    			id: create_fragment$j.name
    		});
    	}

    	get theme() {
    		throw new Error("<BootstrapToast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<BootstrapToast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<BootstrapToast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<BootstrapToast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    function is_date(obj) {
        return Object.prototype.toString.call(obj) === '[object Date]';
    }

    function get_interpolator(a, b) {
        if (a === b || a !== a)
            return () => a;
        const type = typeof a;
        if (type !== typeof b || Array.isArray(a) !== Array.isArray(b)) {
            throw new Error('Cannot interpolate values of different type');
        }
        if (Array.isArray(a)) {
            const arr = b.map((bi, i) => {
                return get_interpolator(a[i], bi);
            });
            return t => arr.map(fn => fn(t));
        }
        if (type === 'object') {
            if (!a || !b)
                throw new Error('Object cannot be null');
            if (is_date(a) && is_date(b)) {
                a = a.getTime();
                b = b.getTime();
                const delta = b - a;
                return t => new Date(a + t * delta);
            }
            const keys = Object.keys(b);
            const interpolators = {};
            keys.forEach(key => {
                interpolators[key] = get_interpolator(a[key], b[key]);
            });
            return t => {
                const result = {};
                keys.forEach(key => {
                    result[key] = interpolators[key](t);
                });
                return result;
            };
        }
        if (type === 'number') {
            const delta = b - a;
            return t => a + t * delta;
        }
        throw new Error(`Cannot interpolate ${type} values`);
    }
    function tweened(value, defaults = {}) {
        const store = writable(value);
        let task;
        let target_value = value;
        function set(new_value, opts) {
            if (value == null) {
                store.set(value = new_value);
                return Promise.resolve();
            }
            target_value = new_value;
            let previous_task = task;
            let started = false;
            let { delay = 0, duration = 400, easing = identity, interpolate = get_interpolator } = assign(assign({}, defaults), opts);
            if (duration === 0) {
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                store.set(value = target_value);
                return Promise.resolve();
            }
            const start = now() + delay;
            let fn;
            task = loop(now => {
                if (now < start)
                    return true;
                if (!started) {
                    fn = interpolate(value, new_value);
                    if (typeof duration === 'function')
                        duration = duration(value, new_value);
                    started = true;
                }
                if (previous_task) {
                    previous_task.abort();
                    previous_task = null;
                }
                const elapsed = now - start;
                if (elapsed > duration) {
                    store.set(value = new_value);
                    return false;
                }
                // @ts-ignore
                store.set(value = fn(easing(elapsed / duration)));
                return true;
            });
            return task.promise;
        }
        return {
            set,
            update: (fn, opts) => set(fn(target_value, value), opts),
            subscribe: store.subscribe
        };
    }

    /* node_modules/svelte-toasts/src/FlatToast.svelte generated by Svelte v3.35.0 */
    const file$g = "node_modules/svelte-toasts/src/FlatToast.svelte";
    const get_close_icon_slot_changes = dirty => ({});
    const get_close_icon_slot_context = ctx => ({});
    const get_extra_slot_changes = dirty => ({});
    const get_extra_slot_context = ctx => ({});
    const get_icon_slot_changes$1 = dirty => ({});
    const get_icon_slot_context$1 = ctx => ({});

    // (91:4) {:else}
    function create_else_block$3(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1\ts1,0.4,1,1S10.6,16,10,16z");
    			add_location(path0, file$g, 98, 9, 2485);
    			attr_dev(path1, "d", "M9.2,5h1.5v7H9.2V5z M10,16c-0.6,0-1-0.4-1-1s0.4-1,1-1s1,0.4,1,1S10.6,16,10,16z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$g, 100, 10, 2641);
    			attr_dev(svg, "class", "st-toast-icon svelte-17hk2g0");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$g, 91, 6, 2304);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$3.name,
    		type: "else",
    		source: "(91:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (75:36) 
    function create_if_block_4(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M10,1c-5,0-9,4-9,9s4,9,9,9s9-4,9-9S15,1,10,1z M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z");
    			add_location(path0, file$g, 82, 9, 2036);
    			attr_dev(path1, "d", "M13.5,14.5l-8-8l1-1l8,8L13.5,14.5z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$g, 84, 10, 2147);
    			attr_dev(svg, "class", "st-toast-icon svelte-17hk2g0");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$g, 75, 6, 1855);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_4.name,
    		type: "if",
    		source: "(75:36) ",
    		ctx
    	});

    	return block;
    }

    // (63:35) 
    function create_if_block_3(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M16,2A14,14,0,1,0,30,16,14,14,0,0,0,16,2Zm0,5a1.5,1.5,0,1,1-1.5,1.5A1.5,1.5,0,0,1,16,7Zm4,17.12H12V21.88h2.88V15.12H13V12.88h4.13v9H20Z");
    			add_location(path, file$g, 70, 9, 1632);
    			attr_dev(svg, "class", "st-toast-icon svelte-17hk2g0");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 32 32");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$g, 63, 6, 1451);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(63:35) ",
    		ctx
    	});

    	return block;
    }

    // (44:4) {#if data.type === 'success'}
    function create_if_block_2(ctx) {
    	let svg;
    	let path0;
    	let path1;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			attr_dev(path0, "d", "M10,1c-4.9,0-9,4.1-9,9s4.1,9,9,9s9-4,9-9S15,1,10,1z M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z");
    			add_location(path0, file$g, 52, 8, 1086);
    			attr_dev(path1, "fill", "none");
    			attr_dev(path1, "d", "M8.7,13.5l-3.2-3.2l1-1l2.2,2.2l4.8-4.8l1,1L8.7,13.5z");
    			attr_dev(path1, "data-icon-path", "inner-path");
    			attr_dev(path1, "opacity", "0");
    			add_location(path1, file$g, 55, 8, 1230);
    			attr_dev(svg, "class", "st-toast-icon svelte-17hk2g0");
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 20 20");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$g, 44, 6, 898);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path0);
    			append_dev(svg, path1);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(44:4) {#if data.type === 'success'}",
    		ctx
    	});

    	return block;
    }

    // (43:20)      
    function fallback_block_1(ctx) {
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*data*/ ctx[1].type === "success") return create_if_block_2;
    		if (/*data*/ ctx[1].type === "info") return create_if_block_3;
    		if (/*data*/ ctx[1].type === "error") return create_if_block_4;
    		return create_else_block$3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type !== (current_block_type = select_block_type(ctx))) {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block_1.name,
    		type: "fallback",
    		source: "(43:20)      ",
    		ctx
    	});

    	return block;
    }

    // (111:4) {#if data.title}
    function create_if_block_1$1(ctx) {
    	let h3;
    	let t_value = /*data*/ ctx[1].title + "";
    	let t;

    	const block = {
    		c: function create() {
    			h3 = element("h3");
    			t = text(t_value);
    			attr_dev(h3, "class", "st-toast-title svelte-17hk2g0");
    			add_location(h3, file$g, 111, 6, 2905);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h3, anchor);
    			append_dev(h3, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 2 && t_value !== (t_value = /*data*/ ctx[1].title + "")) set_data_dev(t, t_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h3);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(111:4) {#if data.title}",
    		ctx
    	});

    	return block;
    }

    // (126:28)        
    function fallback_block(ctx) {
    	let svg;
    	let path;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "d", "M24 9.4L22.6 8 16 14.6 9.4 8 8 9.4 14.6 16 8 22.6 9.4 24 16 17.4 22.6 24 24 22.6 17.4 16 24 9.4z");
    			add_location(path, file$g, 134, 8, 3455);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "class", "bx--toast-notification__close-icon svelte-17hk2g0");
    			attr_dev(svg, "width", "20");
    			attr_dev(svg, "height", "20");
    			attr_dev(svg, "viewBox", "0 0 32 32");
    			attr_dev(svg, "aria-hidden", "true");
    			add_location(svg, file$g, 126, 6, 3246);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: fallback_block.name,
    		type: "fallback",
    		source: "(126:28)        ",
    		ctx
    	});

    	return block;
    }

    // (141:2) {#if data.showProgress}
    function create_if_block$5(ctx) {
    	let progress_1;

    	const block = {
    		c: function create() {
    			progress_1 = element("progress");
    			set_style(progress_1, "height", /*data*/ ctx[1].duration > 0 ? "4px" : 0);
    			progress_1.value = /*$progress*/ ctx[2];
    			attr_dev(progress_1, "class", "svelte-17hk2g0");
    			add_location(progress_1, file$g, 141, 4, 3650);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, progress_1, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*data*/ 2) {
    				set_style(progress_1, "height", /*data*/ ctx[1].duration > 0 ? "4px" : 0);
    			}

    			if (dirty & /*$progress*/ 4) {
    				prop_dev(progress_1, "value", /*$progress*/ ctx[2]);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(progress_1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$5.name,
    		type: "if",
    		source: "(141:2) {#if data.showProgress}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$i(ctx) {
    	let div2;
    	let t0;
    	let div1;
    	let t1;
    	let p;
    	let t2_value = /*data*/ ctx[1].description + "";
    	let t2;
    	let t3;
    	let div0;
    	let t4;
    	let button;
    	let t5;
    	let div2_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const icon_slot_template = /*#slots*/ ctx[7].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[6], get_icon_slot_context$1);
    	const icon_slot_or_fallback = icon_slot || fallback_block_1(ctx);
    	let if_block0 = /*data*/ ctx[1].title && create_if_block_1$1(ctx);
    	const extra_slot_template = /*#slots*/ ctx[7].extra;
    	const extra_slot = create_slot(extra_slot_template, ctx, /*$$scope*/ ctx[6], get_extra_slot_context);
    	const close_icon_slot_template = /*#slots*/ ctx[7]["close-icon"];
    	const close_icon_slot = create_slot(close_icon_slot_template, ctx, /*$$scope*/ ctx[6], get_close_icon_slot_context);
    	const close_icon_slot_or_fallback = close_icon_slot || fallback_block(ctx);
    	let if_block1 = /*data*/ ctx[1].showProgress && create_if_block$5(ctx);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			if (icon_slot_or_fallback) icon_slot_or_fallback.c();
    			t0 = space();
    			div1 = element("div");
    			if (if_block0) if_block0.c();
    			t1 = space();
    			p = element("p");
    			t2 = text(t2_value);
    			t3 = space();
    			div0 = element("div");
    			if (extra_slot) extra_slot.c();
    			t4 = space();
    			button = element("button");
    			if (close_icon_slot_or_fallback) close_icon_slot_or_fallback.c();
    			t5 = space();
    			if (if_block1) if_block1.c();
    			attr_dev(p, "class", "st-toast-description svelte-17hk2g0");
    			add_location(p, file$g, 114, 4, 2965);
    			attr_dev(div0, "class", "st-toast-extra");
    			add_location(div0, file$g, 115, 4, 3024);
    			attr_dev(div1, "class", "st-toast-details svelte-17hk2g0");
    			add_location(div1, file$g, 109, 2, 2847);
    			attr_dev(button, "class", "st-toast-close-btn svelte-17hk2g0");
    			attr_dev(button, "type", "button");
    			attr_dev(button, "aria-label", "close");
    			add_location(button, file$g, 119, 2, 3103);
    			attr_dev(div2, "class", div2_class_value = "st-toast flat " + (/*data*/ ctx[1].theme || /*theme*/ ctx[0]) + " " + (/*data*/ ctx[1].type || "info") + " svelte-17hk2g0");
    			attr_dev(div2, "role", "alert");
    			attr_dev(div2, "aria-live", "assertive");
    			attr_dev(div2, "aria-atomic", "true");
    			add_location(div2, file$g, 35, 0, 681);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);

    			if (icon_slot_or_fallback) {
    				icon_slot_or_fallback.m(div2, null);
    			}

    			append_dev(div2, t0);
    			append_dev(div2, div1);
    			if (if_block0) if_block0.m(div1, null);
    			append_dev(div1, t1);
    			append_dev(div1, p);
    			append_dev(p, t2);
    			append_dev(div1, t3);
    			append_dev(div1, div0);

    			if (extra_slot) {
    				extra_slot.m(div0, null);
    			}

    			append_dev(div2, t4);
    			append_dev(div2, button);

    			if (close_icon_slot_or_fallback) {
    				close_icon_slot_or_fallback.m(button, null);
    			}

    			append_dev(div2, t5);
    			if (if_block1) if_block1.m(div2, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(button, "click", /*onRemove*/ ctx[4], false, false, false),
    					listen_dev(div2, "click", /*onClick*/ ctx[5], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (icon_slot) {
    				if (icon_slot.p && dirty & /*$$scope*/ 64) {
    					update_slot(icon_slot, icon_slot_template, ctx, /*$$scope*/ ctx[6], dirty, get_icon_slot_changes$1, get_icon_slot_context$1);
    				}
    			} else {
    				if (icon_slot_or_fallback && icon_slot_or_fallback.p && dirty & /*data*/ 2) {
    					icon_slot_or_fallback.p(ctx, dirty);
    				}
    			}

    			if (/*data*/ ctx[1].title) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(div1, t1);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if ((!current || dirty & /*data*/ 2) && t2_value !== (t2_value = /*data*/ ctx[1].description + "")) set_data_dev(t2, t2_value);

    			if (extra_slot) {
    				if (extra_slot.p && dirty & /*$$scope*/ 64) {
    					update_slot(extra_slot, extra_slot_template, ctx, /*$$scope*/ ctx[6], dirty, get_extra_slot_changes, get_extra_slot_context);
    				}
    			}

    			if (close_icon_slot) {
    				if (close_icon_slot.p && dirty & /*$$scope*/ 64) {
    					update_slot(close_icon_slot, close_icon_slot_template, ctx, /*$$scope*/ ctx[6], dirty, get_close_icon_slot_changes, get_close_icon_slot_context);
    				}
    			}

    			if (/*data*/ ctx[1].showProgress) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block$5(ctx);
    					if_block1.c();
    					if_block1.m(div2, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}

    			if (!current || dirty & /*data, theme*/ 3 && div2_class_value !== (div2_class_value = "st-toast flat " + (/*data*/ ctx[1].theme || /*theme*/ ctx[0]) + " " + (/*data*/ ctx[1].type || "info") + " svelte-17hk2g0")) {
    				attr_dev(div2, "class", div2_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_slot_or_fallback, local);
    			transition_in(extra_slot, local);
    			transition_in(close_icon_slot_or_fallback, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_slot_or_fallback, local);
    			transition_out(extra_slot, local);
    			transition_out(close_icon_slot_or_fallback, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (icon_slot_or_fallback) icon_slot_or_fallback.d(detaching);
    			if (if_block0) if_block0.d();
    			if (extra_slot) extra_slot.d(detaching);
    			if (close_icon_slot_or_fallback) close_icon_slot_or_fallback.d(detaching);
    			if (if_block1) if_block1.d();
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$i.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$i($$self, $$props, $$invalidate) {
    	let $progress;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("FlatToast", slots, ['icon','extra','close-icon']);
    	var { theme = "light" } = $$props;
    	var { data = {} } = $$props;
    	var progress = tweened(1, { duration: data.duration, easing: identity });
    	validate_store(progress, "progress");
    	component_subscribe($$self, progress, value => $$invalidate(2, $progress = value));

    	onMount(() => {
    		progress.set(0, { duration: data.duration });
    	});

    	var onRemove = e => {
    		e.stopPropagation();
    		data.remove();
    		if (typeof data.onRemove === "function") data.onRemove();
    	};

    	var onClick = () => {
    		if (typeof data.onClick === "function") data.onClick();
    	};

    	const writable_props = ["theme", "data"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FlatToast> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("theme" in $$props) $$invalidate(0, theme = $$props.theme);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    		if ("$$scope" in $$props) $$invalidate(6, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		afterUpdate,
    		tweened,
    		linear: identity,
    		theme,
    		data,
    		progress,
    		onRemove,
    		onClick,
    		$progress
    	});

    	$$self.$inject_state = $$props => {
    		if ("theme" in $$props) $$invalidate(0, theme = $$props.theme);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    		if ("progress" in $$props) $$invalidate(3, progress = $$props.progress);
    		if ("onRemove" in $$props) $$invalidate(4, onRemove = $$props.onRemove);
    		if ("onClick" in $$props) $$invalidate(5, onClick = $$props.onClick);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [theme, data, $progress, progress, onRemove, onClick, $$scope, slots];
    }

    class FlatToast extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$i, create_fragment$i, safe_not_equal, { theme: 0, data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FlatToast",
    			options,
    			id: create_fragment$i.name
    		});
    	}

    	get theme() {
    		throw new Error("<FlatToast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set theme(value) {
    		throw new Error("<FlatToast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<FlatToast>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<FlatToast>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/utils.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const isUndefined = value => typeof value === "undefined";

    const isFunction = value => typeof value === "function";

    const isNumber = value => typeof value === "number";

    /**
     * Decides whether a given `event` should result in a navigation or not.
     * @param {object} event
     */
    function shouldNavigate(event) {
    	return (
    		!event.defaultPrevented &&
    		event.button === 0 &&
    		!(event.metaKey || event.altKey || event.ctrlKey || event.shiftKey)
    	);
    }

    function createCounter() {
    	let i = 0;
    	/**
    	 * Returns an id and increments the internal state
    	 * @returns {number}
    	 */
    	return () => i++;
    }

    /**
     * Create a globally unique id
     *
     * @returns {string} An id
     */
    function createGlobalId() {
    	return Math.random().toString(36).substring(2);
    }

    const isSSR = typeof window === "undefined";

    function addListener(target, type, handler) {
    	target.addEventListener(type, handler);
    	return () => target.removeEventListener(type, handler);
    }

    /*
     * Adapted from https://github.com/EmilTholin/svelte-routing
     *
     * https://github.com/EmilTholin/svelte-routing/blob/master/LICENSE
     */

    const createKey = ctxName => `@@svnav-ctx__${ctxName}`;

    // Use strings instead of objects, so different versions of
    // svelte-navigator can potentially still work together
    const LOCATION = createKey("LOCATION");
    const ROUTER = createKey("ROUTER");
    const ROUTE = createKey("ROUTE");
    const ROUTE_PARAMS = createKey("ROUTE_PARAMS");
    const FOCUS_ELEM = createKey("FOCUS_ELEM");

    const paramRegex = /^:(.+)/;

    /**
     * Check if `string` starts with `search`
     * @param {string} string
     * @param {string} search
     * @return {boolean}
     */
    const startsWith = (string, search) =>
    	string.substr(0, search.length) === search;

    /**
     * Check if `segment` is a root segment
     * @param {string} segment
     * @return {boolean}
     */
    const isRootSegment = segment => segment === "";

    /**
     * Check if `segment` is a dynamic segment
     * @param {string} segment
     * @return {boolean}
     */
    const isDynamic = segment => paramRegex.test(segment);

    /**
     * Check if `segment` is a splat
     * @param {string} segment
     * @return {boolean}
     */
    const isSplat = segment => segment[0] === "*";

    /**
     * Strip potention splat and splatname of the end of a path
     * @param {string} str
     * @return {string}
     */
    const stripSplat = str => str.replace(/\*.*$/, "");

    /**
     * Strip `str` of potential start and end `/`
     * @param {string} str
     * @return {string}
     */
    const stripSlashes = str => str.replace(/(^\/+|\/+$)/g, "");

    /**
     * Split up the URI into segments delimited by `/`
     * @param {string} uri
     * @return {string[]}
     */
    function segmentize(uri, filterFalsy = false) {
    	const segments = stripSlashes(uri).split("/");
    	return filterFalsy ? segments.filter(Boolean) : segments;
    }

    /**
     * Add the query to the pathname if a query is given
     * @param {string} pathname
     * @param {string} [query]
     * @return {string}
     */
    const addQuery = (pathname, query) =>
    	pathname + (query ? `?${query}` : "");

    /**
     * Normalizes a basepath
     *
     * @param {string} path
     * @returns {string}
     *
     * @example
     * normalizePath("base/path/") // -> "/base/path"
     */
    const normalizePath = path => `/${stripSlashes(path)}`;

    /**
     * Joins and normalizes multiple path fragments
     *
     * @param {...string} pathFragments
     * @returns {string}
     */
    function join(...pathFragments) {
    	const joinFragment = fragment => segmentize(fragment, true).join("/");
    	const joinedSegments = pathFragments.map(joinFragment).join("/");
    	return normalizePath(joinedSegments);
    }

    // We start from 1 here, so we can check if an origin id has been passed
    // by using `originId || <fallback>`
    const LINK_ID = 1;
    const ROUTE_ID = 2;
    const ROUTER_ID = 3;
    const USE_FOCUS_ID = 4;
    const USE_LOCATION_ID = 5;
    const USE_MATCH_ID = 6;
    const USE_NAVIGATE_ID = 7;
    const USE_PARAMS_ID = 8;
    const USE_RESOLVABLE_ID = 9;
    const USE_RESOLVE_ID = 10;
    const NAVIGATE_ID = 11;

    const labels = {
    	[LINK_ID]: "Link",
    	[ROUTE_ID]: "Route",
    	[ROUTER_ID]: "Router",
    	[USE_FOCUS_ID]: "useFocus",
    	[USE_LOCATION_ID]: "useLocation",
    	[USE_MATCH_ID]: "useMatch",
    	[USE_NAVIGATE_ID]: "useNavigate",
    	[USE_PARAMS_ID]: "useParams",
    	[USE_RESOLVABLE_ID]: "useResolvable",
    	[USE_RESOLVE_ID]: "useResolve",
    	[NAVIGATE_ID]: "navigate",
    };

    const createLabel = labelId => labels[labelId];

    function createIdentifier(labelId, props) {
    	let attr;
    	if (labelId === ROUTE_ID) {
    		attr = props.path ? `path="${props.path}"` : "default";
    	} else if (labelId === LINK_ID) {
    		attr = `to="${props.to}"`;
    	} else if (labelId === ROUTER_ID) {
    		attr = `basepath="${props.basepath || ""}"`;
    	}
    	return `<${createLabel(labelId)} ${attr || ""} />`;
    }

    function createMessage(labelId, message, props, originId) {
    	const origin = props && createIdentifier(originId || labelId, props);
    	const originMsg = origin ? `\n\nOccurred in: ${origin}` : "";
    	const label = createLabel(labelId);
    	const msg = isFunction(message) ? message(label) : message;
    	return `<${label}> ${msg}${originMsg}`;
    }

    const createMessageHandler = handler => (...args) =>
    	handler(createMessage(...args));

    const fail = createMessageHandler(message => {
    	throw new Error(message);
    });

    // eslint-disable-next-line no-console
    const warn = createMessageHandler(console.warn);

    const SEGMENT_POINTS = 4;
    const STATIC_POINTS = 3;
    const DYNAMIC_POINTS = 2;
    const SPLAT_PENALTY = 1;
    const ROOT_POINTS = 1;

    /**
     * Score a route depending on how its individual segments look
     * @param {object} route
     * @param {number} index
     * @return {object}
     */
    function rankRoute(route, index) {
    	const score = route.default
    		? 0
    		: segmentize(route.fullPath).reduce((acc, segment) => {
    				let nextScore = acc;
    				nextScore += SEGMENT_POINTS;

    				if (isRootSegment(segment)) {
    					nextScore += ROOT_POINTS;
    				} else if (isDynamic(segment)) {
    					nextScore += DYNAMIC_POINTS;
    				} else if (isSplat(segment)) {
    					nextScore -= SEGMENT_POINTS + SPLAT_PENALTY;
    				} else {
    					nextScore += STATIC_POINTS;
    				}

    				return nextScore;
    		  }, 0);

    	return { route, score, index };
    }

    /**
     * Give a score to all routes and sort them on that
     * @param {object[]} routes
     * @return {object[]}
     */
    function rankRoutes(routes) {
    	return (
    		routes
    			.map(rankRoute)
    			// If two routes have the exact same score, we go by index instead
    			.sort((a, b) => {
    				if (a.score < b.score) {
    					return 1;
    				}
    				if (a.score > b.score) {
    					return -1;
    				}
    				return a.index - b.index;
    			})
    	);
    }

    /**
     * Ranks and picks the best route to match. Each segment gets the highest
     * amount of points, then the type of segment gets an additional amount of
     * points where
     *
     *  static > dynamic > splat > root
     *
     * This way we don't have to worry about the order of our routes, let the
     * computers do it.
     *
     * A route looks like this
     *
     *  { fullPath, default, value }
     *
     * And a returned match looks like:
     *
     *  { route, params, uri }
     *
     * @param {object[]} routes
     * @param {string} uri
     * @return {?object}
     */
    function pick(routes, uri) {
    	let bestMatch;
    	let defaultMatch;

    	const [uriPathname] = uri.split("?");
    	const uriSegments = segmentize(uriPathname);
    	const isRootUri = uriSegments[0] === "";
    	const ranked = rankRoutes(routes);

    	for (let i = 0, l = ranked.length; i < l; i++) {
    		const { route } = ranked[i];
    		let missed = false;
    		const params = {};

    		// eslint-disable-next-line no-shadow
    		const createMatch = uri => ({ ...route, params, uri });

    		if (route.default) {
    			defaultMatch = createMatch(uri);
    			continue;
    		}

    		const routeSegments = segmentize(route.fullPath);
    		const max = Math.max(uriSegments.length, routeSegments.length);
    		let index = 0;

    		for (; index < max; index++) {
    			const routeSegment = routeSegments[index];
    			const uriSegment = uriSegments[index];

    			if (!isUndefined(routeSegment) && isSplat(routeSegment)) {
    				// Hit a splat, just grab the rest, and return a match
    				// uri:   /files/documents/work
    				// route: /files/* or /files/*splatname
    				const splatName = routeSegment === "*" ? "*" : routeSegment.slice(1);

    				params[splatName] = uriSegments
    					.slice(index)
    					.map(decodeURIComponent)
    					.join("/");
    				break;
    			}

    			if (isUndefined(uriSegment)) {
    				// URI is shorter than the route, no match
    				// uri:   /users
    				// route: /users/:userId
    				missed = true;
    				break;
    			}

    			const dynamicMatch = paramRegex.exec(routeSegment);

    			if (dynamicMatch && !isRootUri) {
    				const value = decodeURIComponent(uriSegment);
    				params[dynamicMatch[1]] = value;
    			} else if (routeSegment !== uriSegment) {
    				// Current segments don't match, not dynamic, not splat, so no match
    				// uri:   /users/123/settings
    				// route: /users/:id/profile
    				missed = true;
    				break;
    			}
    		}

    		if (!missed) {
    			bestMatch = createMatch(join(...uriSegments.slice(0, index)));
    			break;
    		}
    	}

    	return bestMatch || defaultMatch || null;
    }

    /**
     * Check if the `route.fullPath` matches the `uri`.
     * @param {Object} route
     * @param {string} uri
     * @return {?object}
     */
    function match(route, uri) {
    	return pick([route], uri);
    }

    /**
     * Resolve URIs as though every path is a directory, no files. Relative URIs
     * in the browser can feel awkward because not only can you be "in a directory",
     * you can be "at a file", too. For example:
     *
     *  browserSpecResolve('foo', '/bar/') => /bar/foo
     *  browserSpecResolve('foo', '/bar') => /foo
     *
     * But on the command line of a file system, it's not as complicated. You can't
     * `cd` from a file, only directories. This way, links have to know less about
     * their current path. To go deeper you can do this:
     *
     *  <Link to="deeper"/>
     *  // instead of
     *  <Link to=`{${props.uri}/deeper}`/>
     *
     * Just like `cd`, if you want to go deeper from the command line, you do this:
     *
     *  cd deeper
     *  # not
     *  cd $(pwd)/deeper
     *
     * By treating every path as a directory, linking to relative paths should
     * require less contextual information and (fingers crossed) be more intuitive.
     * @param {string} to
     * @param {string} base
     * @return {string}
     */
    function resolve(to, base) {
    	// /foo/bar, /baz/qux => /foo/bar
    	if (startsWith(to, "/")) {
    		return to;
    	}

    	const [toPathname, toQuery] = to.split("?");
    	const [basePathname] = base.split("?");
    	const toSegments = segmentize(toPathname);
    	const baseSegments = segmentize(basePathname);

    	// ?a=b, /users?b=c => /users?a=b
    	if (toSegments[0] === "") {
    		return addQuery(basePathname, toQuery);
    	}

    	// profile, /users/789 => /users/789/profile
    	if (!startsWith(toSegments[0], ".")) {
    		const pathname = baseSegments.concat(toSegments).join("/");
    		return addQuery((basePathname === "/" ? "" : "/") + pathname, toQuery);
    	}

    	// ./       , /users/123 => /users/123
    	// ../      , /users/123 => /users
    	// ../..    , /users/123 => /
    	// ../../one, /a/b/c/d   => /a/b/one
    	// .././one , /a/b/c/d   => /a/b/c/one
    	const allSegments = baseSegments.concat(toSegments);
    	const segments = [];

    	allSegments.forEach(segment => {
    		if (segment === "..") {
    			segments.pop();
    		} else if (segment !== ".") {
    			segments.push(segment);
    		}
    	});

    	return addQuery(`/${segments.join("/")}`, toQuery);
    }

    /**
     * Normalizes a location for consumption by `Route` children and the `Router`.
     * It removes the apps basepath from the pathname
     * and sets default values for `search` and `hash` properties.
     *
     * @param {Object} location The current global location supplied by the history component
     * @param {string} basepath The applications basepath (i.e. when serving from a subdirectory)
     *
     * @returns The normalized location
     */
    function normalizeLocation(location, basepath) {
    	const { pathname, hash = "", search = "", state } = location;
    	const baseSegments = segmentize(basepath, true);
    	const pathSegments = segmentize(pathname, true);
    	while (baseSegments.length) {
    		if (baseSegments[0] !== pathSegments[0]) {
    			fail(
    				ROUTER_ID,
    				`Invalid state: All locations must begin with the basepath "${basepath}", found "${pathname}"`,
    			);
    		}
    		baseSegments.shift();
    		pathSegments.shift();
    	}
    	return {
    		pathname: join(...pathSegments),
    		hash,
    		search,
    		state,
    	};
    }

    const normalizeUrlFragment = frag => (frag.length === 1 ? "" : frag);

    /**
     * Creates a location object from an url.
     * It is used to create a location from the url prop used in SSR
     *
     * @param {string} url The url string (e.g. "/path/to/somewhere")
     *
     * @returns {{ pathname: string; search: string; hash: string }} The location
     */
    function createLocation(url) {
    	const searchIndex = url.indexOf("?");
    	const hashIndex = url.indexOf("#");
    	const hasSearchIndex = searchIndex !== -1;
    	const hasHashIndex = hashIndex !== -1;
    	const hash = hasHashIndex ? normalizeUrlFragment(url.substr(hashIndex)) : "";
    	const pathnameAndSearch = hasHashIndex ? url.substr(0, hashIndex) : url;
    	const search = hasSearchIndex
    		? normalizeUrlFragment(pathnameAndSearch.substr(searchIndex))
    		: "";
    	const pathname = hasSearchIndex
    		? pathnameAndSearch.substr(0, searchIndex)
    		: pathnameAndSearch;
    	return { pathname, search, hash };
    }

    /**
     * Resolves a link relative to the parent Route and the Routers basepath.
     *
     * @param {string} path The given path, that will be resolved
     * @param {string} routeBase The current Routes base path
     * @param {string} appBase The basepath of the app. Used, when serving from a subdirectory
     * @returns {string} The resolved path
     *
     * @example
     * resolveLink("relative", "/routeBase", "/") // -> "/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/") // -> "/absolute"
     * resolveLink("relative", "/routeBase", "/base") // -> "/base/routeBase/relative"
     * resolveLink("/absolute", "/routeBase", "/base") // -> "/base/absolute"
     */
    function resolveLink(path, routeBase, appBase) {
    	return join(appBase, resolve(path, routeBase));
    }

    /**
     * Get the uri for a Route, by matching it against the current location.
     *
     * @param {string} routePath The Routes resolved path
     * @param {string} pathname The current locations pathname
     */
    function extractBaseUri(routePath, pathname) {
    	const fullPath = normalizePath(stripSplat(routePath));
    	const baseSegments = segmentize(fullPath, true);
    	const pathSegments = segmentize(pathname, true).slice(0, baseSegments.length);
    	const routeMatch = match({ fullPath }, join(...pathSegments));
    	return routeMatch && routeMatch.uri;
    }

    /*
     * Adapted from https://github.com/reach/router/blob/b60e6dd781d5d3a4bdaaf4de665649c0f6a7e78d/src/lib/history.js
     *
     * https://github.com/reach/router/blob/master/LICENSE
     */

    const POP = "POP";
    const PUSH = "PUSH";
    const REPLACE = "REPLACE";

    function getLocation(source) {
    	return {
    		...source.location,
    		pathname: encodeURI(decodeURI(source.location.pathname)),
    		state: source.history.state,
    		_key: (source.history.state && source.history.state._key) || "initial",
    	};
    }

    function createHistory(source) {
    	let listeners = [];
    	let location = getLocation(source);
    	let action = POP;

    	const notifyListeners = (listenerFns = listeners) =>
    		listenerFns.forEach(listener => listener({ location, action }));

    	return {
    		get location() {
    			return location;
    		},
    		listen(listener) {
    			listeners.push(listener);

    			const popstateListener = () => {
    				location = getLocation(source);
    				action = POP;
    				notifyListeners([listener]);
    			};

    			// Call listener when it is registered
    			notifyListeners([listener]);

    			const unlisten = addListener(source, "popstate", popstateListener);
    			return () => {
    				unlisten();
    				listeners = listeners.filter(fn => fn !== listener);
    			};
    		},
    		/**
    		 * Navigate to a new absolute route.
    		 *
    		 * @param {string|number} to The path to navigate to.
    		 *
    		 * If `to` is a number we will navigate to the stack entry index + `to`
    		 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    		 * @param {Object} options
    		 * @param {*} [options.state] The state will be accessible through `location.state`
    		 * @param {boolean} [options.replace=false] Replace the current entry in the history
    		 * stack, instead of pushing on a new one
    		 */
    		navigate(to, options) {
    			const { state = {}, replace = false } = options || {};
    			action = replace ? REPLACE : PUSH;
    			if (isNumber(to)) {
    				if (options) {
    					warn(
    						NAVIGATE_ID,
    						"Navigation options (state or replace) are not supported, " +
    							"when passing a number as the first argument to navigate. " +
    							"They are ignored.",
    					);
    				}
    				action = POP;
    				source.history.go(to);
    			} else {
    				const keyedState = { ...state, _key: createGlobalId() };
    				// try...catch iOS Safari limits to 100 pushState calls
    				try {
    					source.history[replace ? "replaceState" : "pushState"](
    						keyedState,
    						"",
    						to,
    					);
    				} catch (e) {
    					source.location[replace ? "replace" : "assign"](to);
    				}
    			}

    			location = getLocation(source);
    			notifyListeners();
    		},
    	};
    }

    function createStackFrame(state, uri) {
    	return { ...createLocation(uri), state };
    }

    // Stores history entries in memory for testing or other platforms like Native
    function createMemorySource(initialPathname = "/") {
    	let index = 0;
    	let stack = [createStackFrame(null, initialPathname)];

    	return {
    		// This is just for testing...
    		get entries() {
    			return stack;
    		},
    		get location() {
    			return stack[index];
    		},
    		addEventListener() {},
    		removeEventListener() {},
    		history: {
    			get state() {
    				return stack[index].state;
    			},
    			pushState(state, title, uri) {
    				index++;
    				// Throw away anything in the stack with an index greater than the current index.
    				// This happens, when we go back using `go(-n)`. The index is now less than `stack.length`.
    				// If we call `go(+n)` the stack entries with an index greater than the current index can
    				// be reused.
    				// However, if we navigate to a path, instead of a number, we want to create a new branch
    				// of navigation.
    				stack = stack.slice(0, index);
    				stack.push(createStackFrame(state, uri));
    			},
    			replaceState(state, title, uri) {
    				stack[index] = createStackFrame(state, uri);
    			},
    			go(to) {
    				const newIndex = index + to;
    				if (newIndex < 0 || newIndex > stack.length - 1) {
    					return;
    				}
    				index = newIndex;
    			},
    		},
    	};
    }

    // Global history uses window.history as the source if available,
    // otherwise a memory history
    const canUseDOM = !!(
    	!isSSR &&
    	window.document &&
    	window.document.createElement
    );
    // Use memory history in iframes (for example in Svelte REPL)
    const isEmbeddedPage = !isSSR && window.location.origin === "null";
    const globalHistory = createHistory(
    	canUseDOM && !isEmbeddedPage ? window : createMemorySource(),
    );

    // We need to keep the focus candidate in a separate file, so svelte does
    // not update, when we mutate it.
    // Also, we need a single global reference, because taking focus needs to
    // work globally, even if we have multiple top level routers
    // eslint-disable-next-line import/no-mutable-exports
    let focusCandidate = null;

    // eslint-disable-next-line import/no-mutable-exports
    let initialNavigation = true;

    /**
     * Check if RouterA is above RouterB in the document
     * @param {number} routerIdA The first Routers id
     * @param {number} routerIdB The second Routers id
     */
    function isAbove(routerIdA, routerIdB) {
    	const routerMarkers = document.querySelectorAll("[data-svnav-router]");
    	for (let i = 0; i < routerMarkers.length; i++) {
    		const node = routerMarkers[i];
    		const currentId = Number(node.dataset.svnavRouter);
    		if (currentId === routerIdA) return true;
    		if (currentId === routerIdB) return false;
    	}
    	return false;
    }

    /**
     * Check if a Route candidate is the best choice to move focus to,
     * and store the best match.
     * @param {{
         level: number;
         routerId: number;
         route: {
           id: number;
           focusElement: import("svelte/store").Readable<Promise<Element>|null>;
         }
       }} item A Route candidate, that updated and is visible after a navigation
     */
    function pushFocusCandidate(item) {
    	if (
    		// Best candidate if it's the only candidate...
    		!focusCandidate ||
    		// Route is nested deeper, than previous candidate
    		// -> Route change was triggered in the deepest affected
    		// Route, so that's were focus should move to
    		item.level > focusCandidate.level ||
    		// If the level is identical, we want to focus the first Route in the document,
    		// so we pick the first Router lookin from page top to page bottom.
    		(item.level === focusCandidate.level &&
    			isAbove(item.routerId, focusCandidate.routerId))
    	) {
    		focusCandidate = item;
    	}
    }

    /**
     * Reset the focus candidate.
     */
    function clearFocusCandidate() {
    	focusCandidate = null;
    }

    function initialNavigationOccurred() {
    	initialNavigation = false;
    }

    /*
     * `focus` Adapted from https://github.com/oaf-project/oaf-side-effects/blob/master/src/index.ts
     *
     * https://github.com/oaf-project/oaf-side-effects/blob/master/LICENSE
     */
    function focus(elem) {
    	if (!elem) return false;
    	const TABINDEX = "tabindex";
    	try {
    		if (!elem.hasAttribute(TABINDEX)) {
    			elem.setAttribute(TABINDEX, "-1");
    			let unlisten;
    			// We remove tabindex after blur to avoid weird browser behavior
    			// where a mouse click can activate elements with tabindex="-1".
    			const blurListener = () => {
    				elem.removeAttribute(TABINDEX);
    				unlisten();
    			};
    			unlisten = addListener(elem, "blur", blurListener);
    		}
    		elem.focus();
    		return document.activeElement === elem;
    	} catch (e) {
    		// Apparently trying to focus a disabled element in IE can throw.
    		// See https://stackoverflow.com/a/1600194/2476884
    		return false;
    	}
    }

    function isEndMarker(elem, id) {
    	return Number(elem.dataset.svnavRouteEnd) === id;
    }

    function isHeading(elem) {
    	return /^H[1-6]$/i.test(elem.tagName);
    }

    function query(selector, parent = document) {
    	return parent.querySelector(selector);
    }

    function queryHeading(id) {
    	const marker = query(`[data-svnav-route-start="${id}"]`);
    	let current = marker.nextElementSibling;
    	while (!isEndMarker(current, id)) {
    		if (isHeading(current)) {
    			return current;
    		}
    		const heading = query("h1,h2,h3,h4,h5,h6", current);
    		if (heading) {
    			return heading;
    		}
    		current = current.nextElementSibling;
    	}
    	return null;
    }

    function handleFocus(route) {
    	Promise.resolve(get_store_value(route.focusElement)).then(elem => {
    		const focusElement = elem || queryHeading(route.id);
    		if (!focusElement) {
    			warn(
    				ROUTER_ID,
    				"Could not find an element to focus. " +
    					"You should always render a header for accessibility reasons, " +
    					'or set a custom focus element via the "useFocus" hook. ' +
    					"If you don't want this Route or Router to manage focus, " +
    					'pass "primary={false}" to it.',
    				route,
    				ROUTE_ID,
    			);
    		}
    		const headingFocused = focus(focusElement);
    		if (headingFocused) return;
    		focus(document.documentElement);
    	});
    }

    const createTriggerFocus = (a11yConfig, announcementText, location) => (
    	manageFocus,
    	announceNavigation,
    ) =>
    	// Wait until the dom is updated, so we can look for headings
    	tick().then(() => {
    		if (!focusCandidate || initialNavigation) {
    			initialNavigationOccurred();
    			return;
    		}
    		if (manageFocus) {
    			handleFocus(focusCandidate.route);
    		}
    		if (a11yConfig.announcements && announceNavigation) {
    			const { path, fullPath, meta, params, uri } = focusCandidate.route;
    			const announcementMessage = a11yConfig.createAnnouncement(
    				{ path, fullPath, meta, params, uri },
    				get_store_value(location),
    			);
    			Promise.resolve(announcementMessage).then(message => {
    				announcementText.set(message);
    			});
    		}
    		clearFocusCandidate();
    	});

    const visuallyHiddenStyle =
    	"position:fixed;" +
    	"top:-1px;" +
    	"left:0;" +
    	"width:1px;" +
    	"height:1px;" +
    	"padding:0;" +
    	"overflow:hidden;" +
    	"clip:rect(0,0,0,0);" +
    	"white-space:nowrap;" +
    	"border:0;";

    /* node_modules/svelte-navigator/src/Router.svelte generated by Svelte v3.35.0 */

    const { Object: Object_1 } = globals;

    const file$f = "node_modules/svelte-navigator/src/Router.svelte";

    // (165:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}
    function create_if_block$4(ctx) {
    	let div;
    	let t;

    	const block = {
    		c: function create() {
    			div = element("div");
    			t = text(/*$announcementText*/ ctx[0]);
    			attr_dev(div, "role", "status");
    			attr_dev(div, "aria-atomic", "true");
    			attr_dev(div, "aria-live", "polite");
    			attr_dev(div, "style", visuallyHiddenStyle);
    			add_location(div, file$f, 165, 1, 6079);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*$announcementText*/ 1) set_data_dev(t, /*$announcementText*/ ctx[0]);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$4.name,
    		type: "if",
    		source: "(165:0) {#if isTopLevelRouter && manageFocus && a11yConfig.announcements}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$h(ctx) {
    	let div;
    	let t0;
    	let t1;
    	let if_block_anchor;
    	let current;
    	const default_slot_template = /*#slots*/ ctx[20].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[19], null);
    	let if_block = /*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements && create_if_block$4(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			t0 = space();
    			if (default_slot) default_slot.c();
    			t1 = space();
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    			set_style(div, "display", "none");
    			attr_dev(div, "aria-hidden", "true");
    			attr_dev(div, "data-svnav-router", /*routerId*/ ctx[3]);
    			add_location(div, file$f, 160, 0, 5923);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			insert_dev(target, t0, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			insert_dev(target, t1, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty[0] & /*$$scope*/ 524288) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[19], dirty, null, null);
    				}
    			}

    			if (/*isTopLevelRouter*/ ctx[2] && /*manageFocus*/ ctx[4] && /*a11yConfig*/ ctx[1].announcements) if_block.p(ctx, dirty);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching) detach_dev(t0);
    			if (default_slot) default_slot.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$h.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    var createId$1 = createCounter();

    function instance$h($$self, $$props, $$invalidate) {
    	let $location;
    	let $routes;
    	let $prevLocation;
    	let $activeRoute;
    	let $announcementText;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Router", slots, ['default']);

    	function _extends() {
    		_extends = Object.assign || function (target) {
    			for (var i = 1; i < arguments.length; i++) {
    				var source = arguments[i];

    				for (var key in source) {
    					if (Object.prototype.hasOwnProperty.call(source, key)) {
    						target[key] = source[key];
    					}
    				}
    			}

    			return target;
    		};

    		return _extends.apply(this, arguments);
    	}

    	var defaultBasepath = "/";
    	var { basepath = defaultBasepath } = $$props;
    	var { url = null } = $$props;
    	var { history = globalHistory } = $$props;
    	var { primary = true } = $$props;
    	var { a11y = {} } = $$props;

    	var a11yConfig = _extends(
    		{
    			createAnnouncement: route => "Navigated to " + route.uri,
    			announcements: true
    		},
    		a11y
    	); // Remember the initial `basepath`, so we can fire a warning

    	// when the user changes it later
    	var initialBasepath = basepath;

    	var normalizedBasepath = normalizePath(basepath);
    	var locationContext = getContext(LOCATION);
    	var routerContext = getContext(ROUTER);
    	var isTopLevelRouter = !locationContext;
    	var routerId = createId$1();
    	var manageFocus = primary && !(routerContext && !routerContext.manageFocus);
    	var announcementText = writable("");
    	validate_store(announcementText, "announcementText");
    	component_subscribe($$self, announcementText, value => $$invalidate(0, $announcementText = value));
    	var routes = writable([]);
    	validate_store(routes, "routes");
    	component_subscribe($$self, routes, value => $$invalidate(16, $routes = value));
    	var activeRoute = writable(null); // Used in SSR to synchronously set that a Route is active.
    	validate_store(activeRoute, "activeRoute");
    	component_subscribe($$self, activeRoute, value => $$invalidate(18, $activeRoute = value));
    	var hasActiveRoute = false; // Nesting level of router.

    	// We will need this to identify sibling routers, when moving
    	// focus on navigation, so we can focus the first possible router
    	var level = isTopLevelRouter ? 0 : routerContext.level + 1; // If we're running an SSR we force the location to the `url` prop

    	var getInitialLocation = () => normalizeLocation(isSSR ? createLocation(url) : history.location, normalizedBasepath);

    	var location = isTopLevelRouter
    	? writable(getInitialLocation())
    	: locationContext;

    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(15, $location = value));
    	var prevLocation = writable($location);
    	validate_store(prevLocation, "prevLocation");
    	component_subscribe($$self, prevLocation, value => $$invalidate(17, $prevLocation = value));
    	var triggerFocus = createTriggerFocus(a11yConfig, announcementText, location);
    	var createRouteFilter = routeId => routeList => routeList.filter(routeItem => routeItem.id !== routeId);

    	function registerRoute(route) {
    		if (isSSR) {
    			// In SSR we should set the activeRoute immediately if it is a match.
    			// If there are more Routes being registered after a match is found,
    			// we just skip them.
    			if (hasActiveRoute) {
    				return;
    			}

    			var matchingRoute = match(route, $location.pathname);

    			if (matchingRoute) {
    				hasActiveRoute = true; // Return the match in SSR mode, so the matched Route can use it immediatly.

    				// Waiting for activeRoute to update does not work, because it updates
    				// after the Route is initialized
    				return matchingRoute; // eslint-disable-line consistent-return
    			}
    		} else {
    			routes.update(prevRoutes => {
    				// Remove an old version of the updated route,
    				// before pushing the new version
    				var nextRoutes = createRouteFilter(route.id)(prevRoutes);

    				nextRoutes.push(route);
    				return nextRoutes;
    			});
    		}
    	}

    	function unregisterRoute(routeId) {
    		routes.update(createRouteFilter(routeId));
    	}

    	if (!isTopLevelRouter && basepath !== defaultBasepath) {
    		warn(ROUTER_ID, "Only top-level Routers can have a \"basepath\" prop. It is ignored.", { basepath });
    	}

    	if (isTopLevelRouter) {
    		// The topmost Router in the tree is responsible for updating
    		// the location store and supplying it through context.
    		onMount(() => {
    			var unlisten = history.listen(changedHistory => {
    				var normalizedLocation = normalizeLocation(changedHistory.location, normalizedBasepath);
    				prevLocation.set($location);
    				location.set(normalizedLocation);
    			});

    			return unlisten;
    		});

    		setContext(LOCATION, location);
    	}

    	setContext(ROUTER, {
    		activeRoute,
    		registerRoute,
    		unregisterRoute,
    		manageFocus,
    		level,
    		id: routerId,
    		history: isTopLevelRouter ? history : routerContext.history,
    		basepath: isTopLevelRouter
    		? normalizedBasepath
    		: routerContext.basepath
    	});

    	const writable_props = ["basepath", "url", "history", "primary", "a11y"];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Router> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("basepath" in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(11, url = $$props.url);
    		if ("history" in $$props) $$invalidate(12, history = $$props.history);
    		if ("primary" in $$props) $$invalidate(13, primary = $$props.primary);
    		if ("a11y" in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ("$$scope" in $$props) $$invalidate(19, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId: createId$1,
    		_extends,
    		getContext,
    		setContext,
    		onMount,
    		writable,
    		LOCATION,
    		ROUTER,
    		globalHistory,
    		normalizePath,
    		pick,
    		match,
    		normalizeLocation,
    		createLocation,
    		isSSR,
    		warn,
    		ROUTER_ID,
    		pushFocusCandidate,
    		visuallyHiddenStyle,
    		createTriggerFocus,
    		defaultBasepath,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		a11yConfig,
    		initialBasepath,
    		normalizedBasepath,
    		locationContext,
    		routerContext,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		hasActiveRoute,
    		level,
    		getInitialLocation,
    		location,
    		prevLocation,
    		triggerFocus,
    		createRouteFilter,
    		registerRoute,
    		unregisterRoute,
    		bestMatch,
    		hasHash,
    		shouldManageFocus,
    		announceNavigation,
    		$location,
    		$routes,
    		$prevLocation,
    		$activeRoute,
    		$announcementText
    	});

    	$$self.$inject_state = $$props => {
    		if ("defaultBasepath" in $$props) defaultBasepath = $$props.defaultBasepath;
    		if ("basepath" in $$props) $$invalidate(10, basepath = $$props.basepath);
    		if ("url" in $$props) $$invalidate(11, url = $$props.url);
    		if ("history" in $$props) $$invalidate(12, history = $$props.history);
    		if ("primary" in $$props) $$invalidate(13, primary = $$props.primary);
    		if ("a11y" in $$props) $$invalidate(14, a11y = $$props.a11y);
    		if ("a11yConfig" in $$props) $$invalidate(1, a11yConfig = $$props.a11yConfig);
    		if ("initialBasepath" in $$props) $$invalidate(24, initialBasepath = $$props.initialBasepath);
    		if ("normalizedBasepath" in $$props) normalizedBasepath = $$props.normalizedBasepath;
    		if ("locationContext" in $$props) locationContext = $$props.locationContext;
    		if ("routerContext" in $$props) routerContext = $$props.routerContext;
    		if ("isTopLevelRouter" in $$props) $$invalidate(2, isTopLevelRouter = $$props.isTopLevelRouter);
    		if ("routerId" in $$props) $$invalidate(3, routerId = $$props.routerId);
    		if ("manageFocus" in $$props) $$invalidate(4, manageFocus = $$props.manageFocus);
    		if ("announcementText" in $$props) $$invalidate(5, announcementText = $$props.announcementText);
    		if ("routes" in $$props) $$invalidate(6, routes = $$props.routes);
    		if ("activeRoute" in $$props) $$invalidate(7, activeRoute = $$props.activeRoute);
    		if ("hasActiveRoute" in $$props) hasActiveRoute = $$props.hasActiveRoute;
    		if ("level" in $$props) $$invalidate(28, level = $$props.level);
    		if ("getInitialLocation" in $$props) getInitialLocation = $$props.getInitialLocation;
    		if ("location" in $$props) $$invalidate(8, location = $$props.location);
    		if ("prevLocation" in $$props) $$invalidate(9, prevLocation = $$props.prevLocation);
    		if ("triggerFocus" in $$props) $$invalidate(30, triggerFocus = $$props.triggerFocus);
    		if ("createRouteFilter" in $$props) createRouteFilter = $$props.createRouteFilter;
    		if ("bestMatch" in $$props) $$invalidate(34, bestMatch = $$props.bestMatch);
    		if ("hasHash" in $$props) $$invalidate(35, hasHash = $$props.hasHash);
    		if ("shouldManageFocus" in $$props) $$invalidate(36, shouldManageFocus = $$props.shouldManageFocus);
    		if ("announceNavigation" in $$props) $$invalidate(37, announceNavigation = $$props.announceNavigation);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*basepath*/ 1024) {
    			if (basepath !== initialBasepath) {
    				warn(ROUTER_ID, "You cannot change the \"basepath\" prop. It is ignored.");
    			} // This reactive statement will be run when the Router is created
    		}

    		if ($$self.$$.dirty[0] & /*$routes, $location*/ 98304) {
    			// when there are no Routes and then again the following tick, so it
    			// will not find an active Route in SSR and in the browser it will only
    			// pick an active Route after all Routes have been registered.
    			{
    				var bestMatch = pick($routes, $location.pathname);
    				activeRoute.set(bestMatch);
    			} // Manage focus and announce navigation to screen reader users
    		}

    		if ($$self.$$.dirty[0] & /*$location, $prevLocation*/ 163840) {
    			{
    				if (isTopLevelRouter) {
    					var hasHash = !!$location.hash; // When a hash is present in the url, we skip focus management, because

    					// focusing a different element will prevent in-page jumps (See #3)
    					var shouldManageFocus = !hasHash && manageFocus; // We don't want to make an announcement, when the hash changes,

    					// but the active route stays the same
    					var announceNavigation = !hasHash || $location.pathname !== $prevLocation.pathname;

    					triggerFocus(shouldManageFocus, announceNavigation);
    				}
    			} // Queue matched Route, so top level Router can decide which Route to focus.
    		}

    		if ($$self.$$.dirty[0] & /*$activeRoute*/ 262144) {
    			// Non primary Routers should just be ignored
    			if (manageFocus && $activeRoute && $activeRoute.primary) {
    				pushFocusCandidate({ level, routerId, route: $activeRoute });
    			}
    		}
    	};

    	return [
    		$announcementText,
    		a11yConfig,
    		isTopLevelRouter,
    		routerId,
    		manageFocus,
    		announcementText,
    		routes,
    		activeRoute,
    		location,
    		prevLocation,
    		basepath,
    		url,
    		history,
    		primary,
    		a11y,
    		$location,
    		$routes,
    		$prevLocation,
    		$activeRoute,
    		$$scope,
    		slots
    	];
    }

    class Router extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(
    			this,
    			options,
    			instance$h,
    			create_fragment$h,
    			safe_not_equal,
    			{
    				basepath: 10,
    				url: 11,
    				history: 12,
    				primary: 13,
    				a11y: 14
    			},
    			[-1, -1]
    		);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Router",
    			options,
    			id: create_fragment$h.name
    		});
    	}

    	get basepath() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set basepath(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get url() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get history() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set history(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get a11y() {
    		throw new Error("<Router>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set a11y(value) {
    		throw new Error("<Router>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /**
     * Check if a component or hook have been created outside of a
     * context providing component
     * @param {number} componentId
     * @param {*} props
     * @param {string?} ctxKey
     * @param {number?} ctxProviderId
     */
    function usePreflightCheck(
    	componentId,
    	props,
    	ctxKey = ROUTER,
    	ctxProviderId = ROUTER_ID,
    ) {
    	const ctx = getContext(ctxKey);
    	if (!ctx) {
    		fail(
    			componentId,
    			label =>
    				`You cannot use ${label} outside of a ${createLabel(ctxProviderId)}.`,
    			props,
    		);
    	}
    }

    const toReadonly = ctx => {
    	const { subscribe } = getContext(ctx);
    	return { subscribe };
    };

    /**
     * Access the current location via a readable store.
     * @returns {import("svelte/store").Readable<{
        pathname: string;
        search: string;
        hash: string;
        state: {};
      }>}
     *
     * @example
      ```html
      <script>
        import { useLocation } from "svelte-navigator";

        const location = useLocation();

        $: console.log($location);
        // {
        //   pathname: "/blog",
        //   search: "?id=123",
        //   hash: "#comments",
        //   state: {}
        // }
      </script>
      ```
     */
    function useLocation() {
    	usePreflightCheck(USE_LOCATION_ID);
    	return toReadonly(LOCATION);
    }

    /**
     * @typedef {{
        path: string;
        fullPath: string;
        uri: string;
        params: {};
      }} RouteMatch
     */

    /**
     * @typedef {import("svelte/store").Readable<RouteMatch|null>} RouteMatchStore
     */

    /**
     * Access the history of top level Router.
     */
    function useHistory() {
    	const { history } = getContext(ROUTER);
    	return history;
    }

    /**
     * Access the base of the parent Route.
     */
    function useRouteBase() {
    	const route = getContext(ROUTE);
    	return route ? derived(route, _route => _route.base) : writable("/");
    }

    /**
     * Resolve a given link relative to the current `Route` and the `Router`s `basepath`.
     * It is used under the hood in `Link` and `useNavigate`.
     * You can use it to manually resolve links, when using the `link` or `links` actions.
     *
     * @returns {(path: string) => string}
     *
     * @example
      ```html
      <script>
        import { link, useResolve } from "svelte-navigator";

        const resolve = useResolve();
        // `resolvedLink` will be resolved relative to its parent Route
        // and the Routers `basepath`
        const resolvedLink = resolve("relativePath");
      </script>

      <a href={resolvedLink} use:link>Relative link</a>
      ```
     */
    function useResolve() {
    	usePreflightCheck(USE_RESOLVE_ID);
    	const routeBase = useRouteBase();
    	const { basepath: appBase } = getContext(ROUTER);
    	/**
    	 * Resolves the path relative to the current route and basepath.
    	 *
    	 * @param {string} path The path to resolve
    	 * @returns {string} The resolved path
    	 */
    	const resolve = path => resolveLink(path, get_store_value(routeBase), appBase);
    	return resolve;
    }

    /**
     * A hook, that returns a context-aware version of `navigate`.
     * It will automatically resolve the given link relative to the current Route.
     * It will also resolve a link against the `basepath` of the Router.
     *
     * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router>
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /absolutePath
      </button>
      ```
      *
      * @example
      ```html
      <!-- App.svelte -->
      <script>
        import { link, Route } from "svelte-navigator";
        import RouteComponent from "./RouteComponent.svelte";
      </script>

      <Router basepath="/base">
        <Route path="route1">
          <RouteComponent />
        </Route>
        <!-- ... -->
      </Router>

      <!-- RouteComponent.svelte -->
      <script>
        import { useNavigate } from "svelte-navigator";

        const navigate = useNavigate();
      </script>

      <button on:click="{() => navigate('relativePath')}">
        go to /base/route1/relativePath
      </button>
      <button on:click="{() => navigate('/absolutePath')}">
        go to /base/absolutePath
      </button>
      ```
     */
    function useNavigate() {
    	usePreflightCheck(USE_NAVIGATE_ID);
    	const resolve = useResolve();
    	const { navigate } = useHistory();
    	/**
    	 * Navigate to a new route.
    	 * Resolves the link relative to the current route and basepath.
    	 *
    	 * @param {string|number} to The path to navigate to.
    	 *
    	 * If `to` is a number we will navigate to the stack entry index + `to`
    	 * (-> `navigate(-1)`, is equivalent to hitting the back button of the browser)
    	 * @param {Object} options
    	 * @param {*} [options.state]
    	 * @param {boolean} [options.replace=false]
    	 */
    	const navigateRelative = (to, options) => {
    		// If to is a number, we navigate to the target stack entry via `history.go`.
    		// Otherwise resolve the link
    		const target = isNumber(to) ? to : resolve(to);
    		return navigate(target, options);
    	};
    	return navigateRelative;
    }

    /* node_modules/svelte-navigator/src/Route.svelte generated by Svelte v3.35.0 */
    const file$e = "node_modules/svelte-navigator/src/Route.svelte";

    const get_default_slot_changes = dirty => ({
    	params: dirty & /*$params*/ 16,
    	location: dirty & /*$location*/ 4
    });

    const get_default_slot_context = ctx => ({
    	params: isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    	location: /*$location*/ ctx[2],
    	navigate: /*navigate*/ ctx[10]
    });

    // (84:0) {#if isActive}
    function create_if_block$3(ctx) {
    	let router;
    	let current;

    	router = new Router({
    			props: {
    				primary: /*primary*/ ctx[1],
    				$$slots: { default: [create_default_slot$b] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(router.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const router_changes = {};
    			if (dirty & /*primary*/ 2) router_changes.primary = /*primary*/ ctx[1];

    			if (dirty & /*$$scope, component, $location, $params, $$restProps*/ 264213) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(router, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$3.name,
    		type: "if",
    		source: "(84:0) {#if isActive}",
    		ctx
    	});

    	return block;
    }

    // (100:2) {:else}
    function create_else_block$2(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[17].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[18], get_default_slot_context);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope, $params, $location*/ 262164) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[18], dirty, get_default_slot_changes, get_default_slot_context);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$2.name,
    		type: "else",
    		source: "(100:2) {:else}",
    		ctx
    	});

    	return block;
    }

    // (92:2) {#if component !== null}
    function create_if_block_1(ctx) {
    	let switch_instance;
    	let switch_instance_anchor;
    	let current;

    	const switch_instance_spread_levels = [
    		{ location: /*$location*/ ctx[2] },
    		{ navigate: /*navigate*/ ctx[10] },
    		isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4],
    		/*$$restProps*/ ctx[11]
    	];

    	var switch_value = /*component*/ ctx[0];

    	function switch_props(ctx) {
    		let switch_instance_props = {};

    		for (let i = 0; i < switch_instance_spread_levels.length; i += 1) {
    			switch_instance_props = assign(switch_instance_props, switch_instance_spread_levels[i]);
    		}

    		return {
    			props: switch_instance_props,
    			$$inline: true
    		};
    	}

    	if (switch_value) {
    		switch_instance = new switch_value(switch_props());
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
    			const switch_instance_changes = (dirty & /*$location, navigate, isSSR, get, params, $params, $$restProps*/ 3604)
    			? get_spread_update(switch_instance_spread_levels, [
    					dirty & /*$location*/ 4 && { location: /*$location*/ ctx[2] },
    					dirty & /*navigate*/ 1024 && { navigate: /*navigate*/ ctx[10] },
    					dirty & /*isSSR, get, params, $params*/ 528 && get_spread_object(isSSR ? get_store_value(/*params*/ ctx[9]) : /*$params*/ ctx[4]),
    					dirty & /*$$restProps*/ 2048 && get_spread_object(/*$$restProps*/ ctx[11])
    				])
    			: {};

    			if (switch_value !== (switch_value = /*component*/ ctx[0])) {
    				if (switch_instance) {
    					group_outros();
    					const old_component = switch_instance;

    					transition_out(old_component.$$.fragment, 1, 0, () => {
    						destroy_component(old_component, 1);
    					});

    					check_outros();
    				}

    				if (switch_value) {
    					switch_instance = new switch_value(switch_props());
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
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(92:2) {#if component !== null}",
    		ctx
    	});

    	return block;
    }

    // (85:1) <Router {primary}>
    function create_default_slot$b(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block_1, create_else_block$2];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*component*/ ctx[0] !== null) return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
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
    		id: create_default_slot$b.name,
    		type: "slot",
    		source: "(85:1) <Router {primary}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$g(ctx) {
    	let div0;
    	let t0;
    	let t1;
    	let div1;
    	let current;
    	let if_block = /*isActive*/ ctx[3] && create_if_block$3(ctx);

    	const block = {
    		c: function create() {
    			div0 = element("div");
    			t0 = space();
    			if (if_block) if_block.c();
    			t1 = space();
    			div1 = element("div");
    			set_style(div0, "display", "none");
    			attr_dev(div0, "aria-hidden", "true");
    			attr_dev(div0, "data-svnav-route-start", /*id*/ ctx[5]);
    			add_location(div0, file$e, 82, 0, 2540);
    			set_style(div1, "display", "none");
    			attr_dev(div1, "aria-hidden", "true");
    			attr_dev(div1, "data-svnav-route-end", /*id*/ ctx[5]);
    			add_location(div1, file$e, 108, 0, 3213);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div0, anchor);
    			insert_dev(target, t0, anchor);
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*isActive*/ ctx[3]) {
    				if (if_block) {
    					if_block.p(ctx, dirty);

    					if (dirty & /*isActive*/ 8) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$3(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(t1.parentNode, t1);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
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
    			if (detaching) detach_dev(div0);
    			if (detaching) detach_dev(t0);
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$g.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    var createId = createCounter();

    function instance$g($$self, $$props, $$invalidate) {
    	let isActive;
    	const omit_props_names = ["path","component","meta","primary"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $parentBase;
    	let $location;
    	let $activeRoute;
    	let $params;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Route", slots, ['default']);
    	var { path = "" } = $$props;
    	var { component = null } = $$props;
    	var { meta = {} } = $$props;
    	var { primary = true } = $$props;
    	usePreflightCheck(ROUTE_ID, $$props);
    	var id = createId();
    	var { registerRoute, unregisterRoute, activeRoute } = getContext(ROUTER);
    	validate_store(activeRoute, "activeRoute");
    	component_subscribe($$self, activeRoute, value => $$invalidate(16, $activeRoute = value));
    	var parentBase = useRouteBase();
    	validate_store(parentBase, "parentBase");
    	component_subscribe($$self, parentBase, value => $$invalidate(15, $parentBase = value));
    	var location = useLocation();
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(2, $location = value));
    	var focusElement = writable(null); // In SSR we cannot wait for $activeRoute to update,

    	// so we use the match returned from `registerRoute` instead
    	var ssrMatch;

    	var route = writable();
    	var params = writable({});
    	validate_store(params, "params");
    	component_subscribe($$self, params, value => $$invalidate(4, $params = value));
    	setContext(ROUTE, route);
    	setContext(ROUTE_PARAMS, params);
    	setContext(FOCUS_ELEM, focusElement); // We need to call useNavigate after the route is set,

    	// so we can use the routes path for link resolution
    	var navigate = useNavigate(); // There is no need to unregister Routes in SSR since it will all be

    	// thrown away anyway
    	if (!isSSR) {
    		onDestroy(() => unregisterRoute(id));
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(27, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(11, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("path" in $$new_props) $$invalidate(12, path = $$new_props.path);
    		if ("component" in $$new_props) $$invalidate(0, component = $$new_props.component);
    		if ("meta" in $$new_props) $$invalidate(13, meta = $$new_props.meta);
    		if ("primary" in $$new_props) $$invalidate(1, primary = $$new_props.primary);
    		if ("$$scope" in $$new_props) $$invalidate(18, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		createCounter,
    		createId,
    		getContext,
    		onDestroy,
    		setContext,
    		writable,
    		get: get_store_value,
    		Router,
    		ROUTER,
    		ROUTE,
    		ROUTE_PARAMS,
    		FOCUS_ELEM,
    		useLocation,
    		useNavigate,
    		useRouteBase,
    		usePreflightCheck,
    		isSSR,
    		extractBaseUri,
    		join,
    		ROUTE_ID,
    		path,
    		component,
    		meta,
    		primary,
    		id,
    		registerRoute,
    		unregisterRoute,
    		activeRoute,
    		parentBase,
    		location,
    		focusElement,
    		ssrMatch,
    		route,
    		isDefault,
    		rawBase,
    		updatedRoute,
    		params,
    		activeParams,
    		navigate,
    		$parentBase,
    		$location,
    		isActive,
    		$activeRoute,
    		$params
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(27, $$props = assign(assign({}, $$props), $$new_props));
    		if ("path" in $$props) $$invalidate(12, path = $$new_props.path);
    		if ("component" in $$props) $$invalidate(0, component = $$new_props.component);
    		if ("meta" in $$props) $$invalidate(13, meta = $$new_props.meta);
    		if ("primary" in $$props) $$invalidate(1, primary = $$new_props.primary);
    		if ("id" in $$props) $$invalidate(5, id = $$new_props.id);
    		if ("registerRoute" in $$props) $$invalidate(19, registerRoute = $$new_props.registerRoute);
    		if ("unregisterRoute" in $$props) unregisterRoute = $$new_props.unregisterRoute;
    		if ("activeRoute" in $$props) $$invalidate(6, activeRoute = $$new_props.activeRoute);
    		if ("parentBase" in $$props) $$invalidate(7, parentBase = $$new_props.parentBase);
    		if ("location" in $$props) $$invalidate(8, location = $$new_props.location);
    		if ("focusElement" in $$props) $$invalidate(21, focusElement = $$new_props.focusElement);
    		if ("ssrMatch" in $$props) $$invalidate(14, ssrMatch = $$new_props.ssrMatch);
    		if ("route" in $$props) $$invalidate(22, route = $$new_props.route);
    		if ("isDefault" in $$props) $$invalidate(23, isDefault = $$new_props.isDefault);
    		if ("rawBase" in $$props) $$invalidate(24, rawBase = $$new_props.rawBase);
    		if ("updatedRoute" in $$props) $$invalidate(25, updatedRoute = $$new_props.updatedRoute);
    		if ("params" in $$props) $$invalidate(9, params = $$new_props.params);
    		if ("activeParams" in $$props) $$invalidate(26, activeParams = $$new_props.activeParams);
    		if ("navigate" in $$props) $$invalidate(10, navigate = $$new_props.navigate);
    		if ("isActive" in $$props) $$invalidate(3, isActive = $$new_props.isActive);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*path, $parentBase, meta, $location, primary*/ 45062) {
    			{
    				// The route store will be re-computed whenever props, location or parentBase change
    				var isDefault = path === "";

    				var rawBase = join($parentBase, path);

    				var updatedRoute = {
    					id,
    					path,
    					meta,
    					// If no path prop is given, this Route will act as the default Route
    					// that is rendered if no other Route in the Router is a match
    					default: isDefault,
    					fullPath: isDefault ? "" : rawBase,
    					base: isDefault
    					? $parentBase
    					: extractBaseUri(rawBase, $location.pathname),
    					primary,
    					focusElement
    				};

    				route.set(updatedRoute); // If we're in SSR mode and the Route matches,

    				// `registerRoute` will return the match
    				$$invalidate(14, ssrMatch = registerRoute(updatedRoute));
    			}
    		}

    		if ($$self.$$.dirty & /*ssrMatch, $activeRoute*/ 81920) {
    			$$invalidate(3, isActive = !!(ssrMatch || $activeRoute && $activeRoute.id === id));
    		}

    		if ($$self.$$.dirty & /*isActive, ssrMatch, $activeRoute*/ 81928) {
    			if (isActive) {
    				var { params: activeParams } = ssrMatch || $activeRoute;
    				params.set(activeParams);
    			}
    		}
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		component,
    		primary,
    		$location,
    		isActive,
    		$params,
    		id,
    		activeRoute,
    		parentBase,
    		location,
    		params,
    		navigate,
    		$$restProps,
    		path,
    		meta,
    		ssrMatch,
    		$parentBase,
    		$activeRoute,
    		slots,
    		$$scope
    	];
    }

    class Route extends SvelteComponentDev {
    	constructor(options) {
    		super(options);

    		init(this, options, instance$g, create_fragment$g, safe_not_equal, {
    			path: 12,
    			component: 0,
    			meta: 13,
    			primary: 1
    		});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Route",
    			options,
    			id: create_fragment$g.name
    		});
    	}

    	get path() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set path(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get component() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set component(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get meta() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set meta(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get primary() {
    		throw new Error("<Route>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set primary(value) {
    		throw new Error("<Route>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* node_modules/svelte-navigator/src/Link.svelte generated by Svelte v3.35.0 */
    const file$d = "node_modules/svelte-navigator/src/Link.svelte";

    function create_fragment$f(ctx) {
    	let a;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[14].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[13], null);
    	let a_levels = [{ href: /*href*/ ctx[0] }, /*ariaCurrent*/ ctx[1], /*props*/ ctx[2]];
    	let a_data = {};

    	for (let i = 0; i < a_levels.length; i += 1) {
    		a_data = assign(a_data, a_levels[i]);
    	}

    	const block = {
    		c: function create() {
    			a = element("a");
    			if (default_slot) default_slot.c();
    			set_attributes(a, a_data);
    			add_location(a, file$d, 65, 0, 2037);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, a, anchor);

    			if (default_slot) {
    				default_slot.m(a, null);
    			}

    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(a, "click", /*onClick*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8192) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[13], dirty, null, null);
    				}
    			}

    			set_attributes(a, a_data = get_spread_update(a_levels, [
    				(!current || dirty & /*href*/ 1) && { href: /*href*/ ctx[0] },
    				dirty & /*ariaCurrent*/ 2 && /*ariaCurrent*/ ctx[1],
    				dirty & /*props*/ 4 && /*props*/ ctx[2]
    			]));
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(a);
    			if (default_slot) default_slot.d(detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$f.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$f($$self, $$props, $$invalidate) {
    	let href;
    	let isPartiallyCurrent;
    	let isCurrent;
    	let ariaCurrent;
    	let props;
    	const omit_props_names = ["to","replace","state","getProps"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Link", slots, ['default']);

    	function _extends() {
    		$$invalidate(9, _extends = Object.assign || function (target) {
    			for (var i = 1; i < arguments.length; i++) {
    				var source = arguments[i];

    				for (var key in source) {
    					if (Object.prototype.hasOwnProperty.call(source, key)) {
    						target[key] = source[key];
    					}
    				}
    			}

    			return target;
    		});

    		return _extends.apply(this, arguments);
    	}

    	var { to } = $$props;
    	var { replace = false } = $$props;
    	var { state = {} } = $$props;
    	var { getProps = null } = $$props;
    	usePreflightCheck(LINK_ID, $$props);
    	var location = useLocation();
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(10, $location = value));
    	var dispatch = createEventDispatcher();
    	var resolve = useResolve();
    	var { navigate } = useHistory(); // We need to pass location here to force re-resolution of the link,

    	function onClick(event) {
    		dispatch("click", event);

    		if (shouldNavigate(event)) {
    			event.preventDefault(); // Don't push another entry to the history stack when the user

    			// clicks on a Link to the page they are currently on.
    			var shouldReplace = isCurrent || replace;

    			navigate(href, { state, replace: shouldReplace });
    		}
    	}

    	$$self.$$set = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		$$invalidate(19, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("to" in $$new_props) $$invalidate(5, to = $$new_props.to);
    		if ("replace" in $$new_props) $$invalidate(6, replace = $$new_props.replace);
    		if ("state" in $$new_props) $$invalidate(7, state = $$new_props.state);
    		if ("getProps" in $$new_props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ("$$scope" in $$new_props) $$invalidate(13, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		_extends,
    		createEventDispatcher,
    		useLocation,
    		useResolve,
    		useHistory,
    		usePreflightCheck,
    		shouldNavigate,
    		isFunction,
    		startsWith,
    		LINK_ID,
    		to,
    		replace,
    		state,
    		getProps,
    		location,
    		dispatch,
    		resolve,
    		navigate,
    		onClick,
    		href,
    		$location,
    		isPartiallyCurrent,
    		isCurrent,
    		ariaCurrent,
    		props
    	});

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(18, $$props = assign(assign({}, $$props), $$new_props));
    		if ("to" in $$props) $$invalidate(5, to = $$new_props.to);
    		if ("replace" in $$props) $$invalidate(6, replace = $$new_props.replace);
    		if ("state" in $$props) $$invalidate(7, state = $$new_props.state);
    		if ("getProps" in $$props) $$invalidate(8, getProps = $$new_props.getProps);
    		if ("location" in $$props) $$invalidate(3, location = $$new_props.location);
    		if ("dispatch" in $$props) dispatch = $$new_props.dispatch;
    		if ("resolve" in $$props) $$invalidate(16, resolve = $$new_props.resolve);
    		if ("navigate" in $$props) navigate = $$new_props.navigate;
    		if ("href" in $$props) $$invalidate(0, href = $$new_props.href);
    		if ("isPartiallyCurrent" in $$props) $$invalidate(11, isPartiallyCurrent = $$new_props.isPartiallyCurrent);
    		if ("isCurrent" in $$props) $$invalidate(12, isCurrent = $$new_props.isCurrent);
    		if ("ariaCurrent" in $$props) $$invalidate(1, ariaCurrent = $$new_props.ariaCurrent);
    		if ("props" in $$props) $$invalidate(2, props = $$new_props.props);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*to, $location*/ 1056) {
    			// when the pathname changes. Otherwise we could end up with stale path params,
    			// when for example an :id changes in the parent Routes path
    			$$invalidate(0, href = resolve(to, $location));
    		}

    		if ($$self.$$.dirty & /*$location, href*/ 1025) {
    			$$invalidate(11, isPartiallyCurrent = startsWith($location.pathname, href));
    		}

    		if ($$self.$$.dirty & /*href, $location*/ 1025) {
    			$$invalidate(12, isCurrent = href === $location.pathname);
    		}

    		if ($$self.$$.dirty & /*isCurrent*/ 4096) {
    			$$invalidate(1, ariaCurrent = isCurrent ? { "aria-current": "page" } : {});
    		}

    		$$invalidate(2, props = (() => {
    			if (isFunction(getProps)) {
    				var dynamicProps = getProps({
    					location: $location,
    					href,
    					isPartiallyCurrent,
    					isCurrent
    				});

    				return _extends({}, $$restProps, dynamicProps);
    			}

    			return $$restProps;
    		})());
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		href,
    		ariaCurrent,
    		props,
    		location,
    		onClick,
    		to,
    		replace,
    		state,
    		getProps,
    		_extends,
    		$location,
    		isPartiallyCurrent,
    		isCurrent,
    		$$scope,
    		slots
    	];
    }

    class Link extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$f, create_fragment$f, safe_not_equal, { to: 5, replace: 6, state: 7, getProps: 8 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link",
    			options,
    			id: create_fragment$f.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*to*/ ctx[5] === undefined && !("to" in props)) {
    			console.warn("<Link> was created without expected prop 'to'");
    		}
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get replace() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set replace(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get state() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set state(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get getProps() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set getProps(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    var commonjsGlobal = typeof globalThis !== 'undefined' ? globalThis : typeof window !== 'undefined' ? window : typeof global !== 'undefined' ? global : typeof self !== 'undefined' ? self : {};

    function createCommonjsModule(fn) {
      var module = { exports: {} };
    	return fn(module, module.exports), module.exports;
    }

    var prism = createCommonjsModule(function (module) {
    /* **********************************************
         Begin prism-core.js
    ********************************************** */

    /// <reference lib="WebWorker"/>

    var _self = (typeof window !== 'undefined')
    	? window   // if in browser
    	: (
    		(typeof WorkerGlobalScope !== 'undefined' && self instanceof WorkerGlobalScope)
    		? self // if in worker
    		: {}   // if in node js
    	);

    /**
     * Prism: Lightweight, robust, elegant syntax highlighting
     *
     * @license MIT <https://opensource.org/licenses/MIT>
     * @author Lea Verou <https://lea.verou.me>
     * @namespace
     * @public
     */
    var Prism = (function (_self){

    // Private helper vars
    var lang = /\blang(?:uage)?-([\w-]+)\b/i;
    var uniqueId = 0;


    var _ = {
    	/**
    	 * By default, Prism will attempt to highlight all code elements (by calling {@link Prism.highlightAll}) on the
    	 * current page after the page finished loading. This might be a problem if e.g. you wanted to asynchronously load
    	 * additional languages or plugins yourself.
    	 *
    	 * By setting this value to `true`, Prism will not automatically highlight all code elements on the page.
    	 *
    	 * You obviously have to change this value before the automatic highlighting started. To do this, you can add an
    	 * empty Prism object into the global scope before loading the Prism script like this:
    	 *
    	 * ```js
    	 * window.Prism = window.Prism || {};
    	 * Prism.manual = true;
    	 * // add a new <script> to load Prism's script
    	 * ```
    	 *
    	 * @default false
    	 * @type {boolean}
    	 * @memberof Prism
    	 * @public
    	 */
    	manual: _self.Prism && _self.Prism.manual,
    	disableWorkerMessageHandler: _self.Prism && _self.Prism.disableWorkerMessageHandler,

    	/**
    	 * A namespace for utility methods.
    	 *
    	 * All function in this namespace that are not explicitly marked as _public_ are for __internal use only__ and may
    	 * change or disappear at any time.
    	 *
    	 * @namespace
    	 * @memberof Prism
    	 */
    	util: {
    		encode: function encode(tokens) {
    			if (tokens instanceof Token) {
    				return new Token(tokens.type, encode(tokens.content), tokens.alias);
    			} else if (Array.isArray(tokens)) {
    				return tokens.map(encode);
    			} else {
    				return tokens.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\u00a0/g, ' ');
    			}
    		},

    		/**
    		 * Returns the name of the type of the given value.
    		 *
    		 * @param {any} o
    		 * @returns {string}
    		 * @example
    		 * type(null)      === 'Null'
    		 * type(undefined) === 'Undefined'
    		 * type(123)       === 'Number'
    		 * type('foo')     === 'String'
    		 * type(true)      === 'Boolean'
    		 * type([1, 2])    === 'Array'
    		 * type({})        === 'Object'
    		 * type(String)    === 'Function'
    		 * type(/abc+/)    === 'RegExp'
    		 */
    		type: function (o) {
    			return Object.prototype.toString.call(o).slice(8, -1);
    		},

    		/**
    		 * Returns a unique number for the given object. Later calls will still return the same number.
    		 *
    		 * @param {Object} obj
    		 * @returns {number}
    		 */
    		objId: function (obj) {
    			if (!obj['__id']) {
    				Object.defineProperty(obj, '__id', { value: ++uniqueId });
    			}
    			return obj['__id'];
    		},

    		/**
    		 * Creates a deep clone of the given object.
    		 *
    		 * The main intended use of this function is to clone language definitions.
    		 *
    		 * @param {T} o
    		 * @param {Record<number, any>} [visited]
    		 * @returns {T}
    		 * @template T
    		 */
    		clone: function deepClone(o, visited) {
    			visited = visited || {};

    			var clone, id;
    			switch (_.util.type(o)) {
    				case 'Object':
    					id = _.util.objId(o);
    					if (visited[id]) {
    						return visited[id];
    					}
    					clone = /** @type {Record<string, any>} */ ({});
    					visited[id] = clone;

    					for (var key in o) {
    						if (o.hasOwnProperty(key)) {
    							clone[key] = deepClone(o[key], visited);
    						}
    					}

    					return /** @type {any} */ (clone);

    				case 'Array':
    					id = _.util.objId(o);
    					if (visited[id]) {
    						return visited[id];
    					}
    					clone = [];
    					visited[id] = clone;

    					(/** @type {Array} */(/** @type {any} */(o))).forEach(function (v, i) {
    						clone[i] = deepClone(v, visited);
    					});

    					return /** @type {any} */ (clone);

    				default:
    					return o;
    			}
    		},

    		/**
    		 * Returns the Prism language of the given element set by a `language-xxxx` or `lang-xxxx` class.
    		 *
    		 * If no language is set for the element or the element is `null` or `undefined`, `none` will be returned.
    		 *
    		 * @param {Element} element
    		 * @returns {string}
    		 */
    		getLanguage: function (element) {
    			while (element && !lang.test(element.className)) {
    				element = element.parentElement;
    			}
    			if (element) {
    				return (element.className.match(lang) || [, 'none'])[1].toLowerCase();
    			}
    			return 'none';
    		},

    		/**
    		 * Returns the script element that is currently executing.
    		 *
    		 * This does __not__ work for line script element.
    		 *
    		 * @returns {HTMLScriptElement | null}
    		 */
    		currentScript: function () {
    			if (typeof document === 'undefined') {
    				return null;
    			}
    			if ('currentScript' in document && 1 < 2 /* hack to trip TS' flow analysis */) {
    				return /** @type {any} */ (document.currentScript);
    			}

    			// IE11 workaround
    			// we'll get the src of the current script by parsing IE11's error stack trace
    			// this will not work for inline scripts

    			try {
    				throw new Error();
    			} catch (err) {
    				// Get file src url from stack. Specifically works with the format of stack traces in IE.
    				// A stack will look like this:
    				//
    				// Error
    				//    at _.util.currentScript (http://localhost/components/prism-core.js:119:5)
    				//    at Global code (http://localhost/components/prism-core.js:606:1)

    				var src = (/at [^(\r\n]*\((.*):.+:.+\)$/i.exec(err.stack) || [])[1];
    				if (src) {
    					var scripts = document.getElementsByTagName('script');
    					for (var i in scripts) {
    						if (scripts[i].src == src) {
    							return scripts[i];
    						}
    					}
    				}
    				return null;
    			}
    		},

    		/**
    		 * Returns whether a given class is active for `element`.
    		 *
    		 * The class can be activated if `element` or one of its ancestors has the given class and it can be deactivated
    		 * if `element` or one of its ancestors has the negated version of the given class. The _negated version_ of the
    		 * given class is just the given class with a `no-` prefix.
    		 *
    		 * Whether the class is active is determined by the closest ancestor of `element` (where `element` itself is
    		 * closest ancestor) that has the given class or the negated version of it. If neither `element` nor any of its
    		 * ancestors have the given class or the negated version of it, then the default activation will be returned.
    		 *
    		 * In the paradoxical situation where the closest ancestor contains __both__ the given class and the negated
    		 * version of it, the class is considered active.
    		 *
    		 * @param {Element} element
    		 * @param {string} className
    		 * @param {boolean} [defaultActivation=false]
    		 * @returns {boolean}
    		 */
    		isActive: function (element, className, defaultActivation) {
    			var no = 'no-' + className;

    			while (element) {
    				var classList = element.classList;
    				if (classList.contains(className)) {
    					return true;
    				}
    				if (classList.contains(no)) {
    					return false;
    				}
    				element = element.parentElement;
    			}
    			return !!defaultActivation;
    		}
    	},

    	/**
    	 * This namespace contains all currently loaded languages and the some helper functions to create and modify languages.
    	 *
    	 * @namespace
    	 * @memberof Prism
    	 * @public
    	 */
    	languages: {
    		/**
    		 * Creates a deep copy of the language with the given id and appends the given tokens.
    		 *
    		 * If a token in `redef` also appears in the copied language, then the existing token in the copied language
    		 * will be overwritten at its original position.
    		 *
    		 * ## Best practices
    		 *
    		 * Since the position of overwriting tokens (token in `redef` that overwrite tokens in the copied language)
    		 * doesn't matter, they can technically be in any order. However, this can be confusing to others that trying to
    		 * understand the language definition because, normally, the order of tokens matters in Prism grammars.
    		 *
    		 * Therefore, it is encouraged to order overwriting tokens according to the positions of the overwritten tokens.
    		 * Furthermore, all non-overwriting tokens should be placed after the overwriting ones.
    		 *
    		 * @param {string} id The id of the language to extend. This has to be a key in `Prism.languages`.
    		 * @param {Grammar} redef The new tokens to append.
    		 * @returns {Grammar} The new language created.
    		 * @public
    		 * @example
    		 * Prism.languages['css-with-colors'] = Prism.languages.extend('css', {
    		 *     // Prism.languages.css already has a 'comment' token, so this token will overwrite CSS' 'comment' token
    		 *     // at its original position
    		 *     'comment': { ... },
    		 *     // CSS doesn't have a 'color' token, so this token will be appended
    		 *     'color': /\b(?:red|green|blue)\b/
    		 * });
    		 */
    		extend: function (id, redef) {
    			var lang = _.util.clone(_.languages[id]);

    			for (var key in redef) {
    				lang[key] = redef[key];
    			}

    			return lang;
    		},

    		/**
    		 * Inserts tokens _before_ another token in a language definition or any other grammar.
    		 *
    		 * ## Usage
    		 *
    		 * This helper method makes it easy to modify existing languages. For example, the CSS language definition
    		 * not only defines CSS highlighting for CSS documents, but also needs to define highlighting for CSS embedded
    		 * in HTML through `<style>` elements. To do this, it needs to modify `Prism.languages.markup` and add the
    		 * appropriate tokens. However, `Prism.languages.markup` is a regular JavaScript object literal, so if you do
    		 * this:
    		 *
    		 * ```js
    		 * Prism.languages.markup.style = {
    		 *     // token
    		 * };
    		 * ```
    		 *
    		 * then the `style` token will be added (and processed) at the end. `insertBefore` allows you to insert tokens
    		 * before existing tokens. For the CSS example above, you would use it like this:
    		 *
    		 * ```js
    		 * Prism.languages.insertBefore('markup', 'cdata', {
    		 *     'style': {
    		 *         // token
    		 *     }
    		 * });
    		 * ```
    		 *
    		 * ## Special cases
    		 *
    		 * If the grammars of `inside` and `insert` have tokens with the same name, the tokens in `inside`'s grammar
    		 * will be ignored.
    		 *
    		 * This behavior can be used to insert tokens after `before`:
    		 *
    		 * ```js
    		 * Prism.languages.insertBefore('markup', 'comment', {
    		 *     'comment': Prism.languages.markup.comment,
    		 *     // tokens after 'comment'
    		 * });
    		 * ```
    		 *
    		 * ## Limitations
    		 *
    		 * The main problem `insertBefore` has to solve is iteration order. Since ES2015, the iteration order for object
    		 * properties is guaranteed to be the insertion order (except for integer keys) but some browsers behave
    		 * differently when keys are deleted and re-inserted. So `insertBefore` can't be implemented by temporarily
    		 * deleting properties which is necessary to insert at arbitrary positions.
    		 *
    		 * To solve this problem, `insertBefore` doesn't actually insert the given tokens into the target object.
    		 * Instead, it will create a new object and replace all references to the target object with the new one. This
    		 * can be done without temporarily deleting properties, so the iteration order is well-defined.
    		 *
    		 * However, only references that can be reached from `Prism.languages` or `insert` will be replaced. I.e. if
    		 * you hold the target object in a variable, then the value of the variable will not change.
    		 *
    		 * ```js
    		 * var oldMarkup = Prism.languages.markup;
    		 * var newMarkup = Prism.languages.insertBefore('markup', 'comment', { ... });
    		 *
    		 * assert(oldMarkup !== Prism.languages.markup);
    		 * assert(newMarkup === Prism.languages.markup);
    		 * ```
    		 *
    		 * @param {string} inside The property of `root` (e.g. a language id in `Prism.languages`) that contains the
    		 * object to be modified.
    		 * @param {string} before The key to insert before.
    		 * @param {Grammar} insert An object containing the key-value pairs to be inserted.
    		 * @param {Object<string, any>} [root] The object containing `inside`, i.e. the object that contains the
    		 * object to be modified.
    		 *
    		 * Defaults to `Prism.languages`.
    		 * @returns {Grammar} The new grammar object.
    		 * @public
    		 */
    		insertBefore: function (inside, before, insert, root) {
    			root = root || /** @type {any} */ (_.languages);
    			var grammar = root[inside];
    			/** @type {Grammar} */
    			var ret = {};

    			for (var token in grammar) {
    				if (grammar.hasOwnProperty(token)) {

    					if (token == before) {
    						for (var newToken in insert) {
    							if (insert.hasOwnProperty(newToken)) {
    								ret[newToken] = insert[newToken];
    							}
    						}
    					}

    					// Do not insert token which also occur in insert. See #1525
    					if (!insert.hasOwnProperty(token)) {
    						ret[token] = grammar[token];
    					}
    				}
    			}

    			var old = root[inside];
    			root[inside] = ret;

    			// Update references in other language definitions
    			_.languages.DFS(_.languages, function(key, value) {
    				if (value === old && key != inside) {
    					this[key] = ret;
    				}
    			});

    			return ret;
    		},

    		// Traverse a language definition with Depth First Search
    		DFS: function DFS(o, callback, type, visited) {
    			visited = visited || {};

    			var objId = _.util.objId;

    			for (var i in o) {
    				if (o.hasOwnProperty(i)) {
    					callback.call(o, i, o[i], type || i);

    					var property = o[i],
    					    propertyType = _.util.type(property);

    					if (propertyType === 'Object' && !visited[objId(property)]) {
    						visited[objId(property)] = true;
    						DFS(property, callback, null, visited);
    					}
    					else if (propertyType === 'Array' && !visited[objId(property)]) {
    						visited[objId(property)] = true;
    						DFS(property, callback, i, visited);
    					}
    				}
    			}
    		}
    	},

    	plugins: {},

    	/**
    	 * This is the most high-level function in Prism’s API.
    	 * It fetches all the elements that have a `.language-xxxx` class and then calls {@link Prism.highlightElement} on
    	 * each one of them.
    	 *
    	 * This is equivalent to `Prism.highlightAllUnder(document, async, callback)`.
    	 *
    	 * @param {boolean} [async=false] Same as in {@link Prism.highlightAllUnder}.
    	 * @param {HighlightCallback} [callback] Same as in {@link Prism.highlightAllUnder}.
    	 * @memberof Prism
    	 * @public
    	 */
    	highlightAll: function(async, callback) {
    		_.highlightAllUnder(document, async, callback);
    	},

    	/**
    	 * Fetches all the descendants of `container` that have a `.language-xxxx` class and then calls
    	 * {@link Prism.highlightElement} on each one of them.
    	 *
    	 * The following hooks will be run:
    	 * 1. `before-highlightall`
    	 * 2. `before-all-elements-highlight`
    	 * 3. All hooks of {@link Prism.highlightElement} for each element.
    	 *
    	 * @param {ParentNode} container The root element, whose descendants that have a `.language-xxxx` class will be highlighted.
    	 * @param {boolean} [async=false] Whether each element is to be highlighted asynchronously using Web Workers.
    	 * @param {HighlightCallback} [callback] An optional callback to be invoked on each element after its highlighting is done.
    	 * @memberof Prism
    	 * @public
    	 */
    	highlightAllUnder: function(container, async, callback) {
    		var env = {
    			callback: callback,
    			container: container,
    			selector: 'code[class*="language-"], [class*="language-"] code, code[class*="lang-"], [class*="lang-"] code'
    		};

    		_.hooks.run('before-highlightall', env);

    		env.elements = Array.prototype.slice.apply(env.container.querySelectorAll(env.selector));

    		_.hooks.run('before-all-elements-highlight', env);

    		for (var i = 0, element; element = env.elements[i++];) {
    			_.highlightElement(element, async === true, env.callback);
    		}
    	},

    	/**
    	 * Highlights the code inside a single element.
    	 *
    	 * The following hooks will be run:
    	 * 1. `before-sanity-check`
    	 * 2. `before-highlight`
    	 * 3. All hooks of {@link Prism.highlight}. These hooks will be run by an asynchronous worker if `async` is `true`.
    	 * 4. `before-insert`
    	 * 5. `after-highlight`
    	 * 6. `complete`
    	 *
    	 * Some the above hooks will be skipped if the element doesn't contain any text or there is no grammar loaded for
    	 * the element's language.
    	 *
    	 * @param {Element} element The element containing the code.
    	 * It must have a class of `language-xxxx` to be processed, where `xxxx` is a valid language identifier.
    	 * @param {boolean} [async=false] Whether the element is to be highlighted asynchronously using Web Workers
    	 * to improve performance and avoid blocking the UI when highlighting very large chunks of code. This option is
    	 * [disabled by default](https://prismjs.com/faq.html#why-is-asynchronous-highlighting-disabled-by-default).
    	 *
    	 * Note: All language definitions required to highlight the code must be included in the main `prism.js` file for
    	 * asynchronous highlighting to work. You can build your own bundle on the
    	 * [Download page](https://prismjs.com/download.html).
    	 * @param {HighlightCallback} [callback] An optional callback to be invoked after the highlighting is done.
    	 * Mostly useful when `async` is `true`, since in that case, the highlighting is done asynchronously.
    	 * @memberof Prism
    	 * @public
    	 */
    	highlightElement: function(element, async, callback) {
    		// Find language
    		var language = _.util.getLanguage(element);
    		var grammar = _.languages[language];

    		// Set language on the element, if not present
    		element.className = element.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;

    		// Set language on the parent, for styling
    		var parent = element.parentElement;
    		if (parent && parent.nodeName.toLowerCase() === 'pre') {
    			parent.className = parent.className.replace(lang, '').replace(/\s+/g, ' ') + ' language-' + language;
    		}

    		var code = element.textContent;

    		var env = {
    			element: element,
    			language: language,
    			grammar: grammar,
    			code: code
    		};

    		function insertHighlightedCode(highlightedCode) {
    			env.highlightedCode = highlightedCode;

    			_.hooks.run('before-insert', env);

    			env.element.innerHTML = env.highlightedCode;

    			_.hooks.run('after-highlight', env);
    			_.hooks.run('complete', env);
    			callback && callback.call(env.element);
    		}

    		_.hooks.run('before-sanity-check', env);

    		if (!env.code) {
    			_.hooks.run('complete', env);
    			callback && callback.call(env.element);
    			return;
    		}

    		_.hooks.run('before-highlight', env);

    		if (!env.grammar) {
    			insertHighlightedCode(_.util.encode(env.code));
    			return;
    		}

    		if (async && _self.Worker) {
    			var worker = new Worker(_.filename);

    			worker.onmessage = function(evt) {
    				insertHighlightedCode(evt.data);
    			};

    			worker.postMessage(JSON.stringify({
    				language: env.language,
    				code: env.code,
    				immediateClose: true
    			}));
    		}
    		else {
    			insertHighlightedCode(_.highlight(env.code, env.grammar, env.language));
    		}
    	},

    	/**
    	 * Low-level function, only use if you know what you’re doing. It accepts a string of text as input
    	 * and the language definitions to use, and returns a string with the HTML produced.
    	 *
    	 * The following hooks will be run:
    	 * 1. `before-tokenize`
    	 * 2. `after-tokenize`
    	 * 3. `wrap`: On each {@link Token}.
    	 *
    	 * @param {string} text A string with the code to be highlighted.
    	 * @param {Grammar} grammar An object containing the tokens to use.
    	 *
    	 * Usually a language definition like `Prism.languages.markup`.
    	 * @param {string} language The name of the language definition passed to `grammar`.
    	 * @returns {string} The highlighted HTML.
    	 * @memberof Prism
    	 * @public
    	 * @example
    	 * Prism.highlight('var foo = true;', Prism.languages.javascript, 'javascript');
    	 */
    	highlight: function (text, grammar, language) {
    		var env = {
    			code: text,
    			grammar: grammar,
    			language: language
    		};
    		_.hooks.run('before-tokenize', env);
    		env.tokens = _.tokenize(env.code, env.grammar);
    		_.hooks.run('after-tokenize', env);
    		return Token.stringify(_.util.encode(env.tokens), env.language);
    	},

    	/**
    	 * This is the heart of Prism, and the most low-level function you can use. It accepts a string of text as input
    	 * and the language definitions to use, and returns an array with the tokenized code.
    	 *
    	 * When the language definition includes nested tokens, the function is called recursively on each of these tokens.
    	 *
    	 * This method could be useful in other contexts as well, as a very crude parser.
    	 *
    	 * @param {string} text A string with the code to be highlighted.
    	 * @param {Grammar} grammar An object containing the tokens to use.
    	 *
    	 * Usually a language definition like `Prism.languages.markup`.
    	 * @returns {TokenStream} An array of strings and tokens, a token stream.
    	 * @memberof Prism
    	 * @public
    	 * @example
    	 * let code = `var foo = 0;`;
    	 * let tokens = Prism.tokenize(code, Prism.languages.javascript);
    	 * tokens.forEach(token => {
    	 *     if (token instanceof Prism.Token && token.type === 'number') {
    	 *         console.log(`Found numeric literal: ${token.content}`);
    	 *     }
    	 * });
    	 */
    	tokenize: function(text, grammar) {
    		var rest = grammar.rest;
    		if (rest) {
    			for (var token in rest) {
    				grammar[token] = rest[token];
    			}

    			delete grammar.rest;
    		}

    		var tokenList = new LinkedList();
    		addAfter(tokenList, tokenList.head, text);

    		matchGrammar(text, tokenList, grammar, tokenList.head, 0);

    		return toArray(tokenList);
    	},

    	/**
    	 * @namespace
    	 * @memberof Prism
    	 * @public
    	 */
    	hooks: {
    		all: {},

    		/**
    		 * Adds the given callback to the list of callbacks for the given hook.
    		 *
    		 * The callback will be invoked when the hook it is registered for is run.
    		 * Hooks are usually directly run by a highlight function but you can also run hooks yourself.
    		 *
    		 * One callback function can be registered to multiple hooks and the same hook multiple times.
    		 *
    		 * @param {string} name The name of the hook.
    		 * @param {HookCallback} callback The callback function which is given environment variables.
    		 * @public
    		 */
    		add: function (name, callback) {
    			var hooks = _.hooks.all;

    			hooks[name] = hooks[name] || [];

    			hooks[name].push(callback);
    		},

    		/**
    		 * Runs a hook invoking all registered callbacks with the given environment variables.
    		 *
    		 * Callbacks will be invoked synchronously and in the order in which they were registered.
    		 *
    		 * @param {string} name The name of the hook.
    		 * @param {Object<string, any>} env The environment variables of the hook passed to all callbacks registered.
    		 * @public
    		 */
    		run: function (name, env) {
    			var callbacks = _.hooks.all[name];

    			if (!callbacks || !callbacks.length) {
    				return;
    			}

    			for (var i=0, callback; callback = callbacks[i++];) {
    				callback(env);
    			}
    		}
    	},

    	Token: Token
    };
    _self.Prism = _;


    // Typescript note:
    // The following can be used to import the Token type in JSDoc:
    //
    //   @typedef {InstanceType<import("./prism-core")["Token"]>} Token

    /**
     * Creates a new token.
     *
     * @param {string} type See {@link Token#type type}
     * @param {string | TokenStream} content See {@link Token#content content}
     * @param {string|string[]} [alias] The alias(es) of the token.
     * @param {string} [matchedStr=""] A copy of the full string this token was created from.
     * @class
     * @global
     * @public
     */
    function Token(type, content, alias, matchedStr) {
    	/**
    	 * The type of the token.
    	 *
    	 * This is usually the key of a pattern in a {@link Grammar}.
    	 *
    	 * @type {string}
    	 * @see GrammarToken
    	 * @public
    	 */
    	this.type = type;
    	/**
    	 * The strings or tokens contained by this token.
    	 *
    	 * This will be a token stream if the pattern matched also defined an `inside` grammar.
    	 *
    	 * @type {string | TokenStream}
    	 * @public
    	 */
    	this.content = content;
    	/**
    	 * The alias(es) of the token.
    	 *
    	 * @type {string|string[]}
    	 * @see GrammarToken
    	 * @public
    	 */
    	this.alias = alias;
    	// Copy of the full string this token was created from
    	this.length = (matchedStr || '').length | 0;
    }

    /**
     * A token stream is an array of strings and {@link Token Token} objects.
     *
     * Token streams have to fulfill a few properties that are assumed by most functions (mostly internal ones) that process
     * them.
     *
     * 1. No adjacent strings.
     * 2. No empty strings.
     *
     *    The only exception here is the token stream that only contains the empty string and nothing else.
     *
     * @typedef {Array<string | Token>} TokenStream
     * @global
     * @public
     */

    /**
     * Converts the given token or token stream to an HTML representation.
     *
     * The following hooks will be run:
     * 1. `wrap`: On each {@link Token}.
     *
     * @param {string | Token | TokenStream} o The token or token stream to be converted.
     * @param {string} language The name of current language.
     * @returns {string} The HTML representation of the token or token stream.
     * @memberof Token
     * @static
     */
    Token.stringify = function stringify(o, language) {
    	if (typeof o == 'string') {
    		return o;
    	}
    	if (Array.isArray(o)) {
    		var s = '';
    		o.forEach(function (e) {
    			s += stringify(e, language);
    		});
    		return s;
    	}

    	var env = {
    		type: o.type,
    		content: stringify(o.content, language),
    		tag: 'span',
    		classes: ['token', o.type],
    		attributes: {},
    		language: language
    	};

    	var aliases = o.alias;
    	if (aliases) {
    		if (Array.isArray(aliases)) {
    			Array.prototype.push.apply(env.classes, aliases);
    		} else {
    			env.classes.push(aliases);
    		}
    	}

    	_.hooks.run('wrap', env);

    	var attributes = '';
    	for (var name in env.attributes) {
    		attributes += ' ' + name + '="' + (env.attributes[name] || '').replace(/"/g, '&quot;') + '"';
    	}

    	return '<' + env.tag + ' class="' + env.classes.join(' ') + '"' + attributes + '>' + env.content + '</' + env.tag + '>';
    };

    /**
     * @param {RegExp} pattern
     * @param {number} pos
     * @param {string} text
     * @param {boolean} lookbehind
     * @returns {RegExpExecArray | null}
     */
    function matchPattern(pattern, pos, text, lookbehind) {
    	pattern.lastIndex = pos;
    	var match = pattern.exec(text);
    	if (match && lookbehind && match[1]) {
    		// change the match to remove the text matched by the Prism lookbehind group
    		var lookbehindLength = match[1].length;
    		match.index += lookbehindLength;
    		match[0] = match[0].slice(lookbehindLength);
    	}
    	return match;
    }

    /**
     * @param {string} text
     * @param {LinkedList<string | Token>} tokenList
     * @param {any} grammar
     * @param {LinkedListNode<string | Token>} startNode
     * @param {number} startPos
     * @param {RematchOptions} [rematch]
     * @returns {void}
     * @private
     *
     * @typedef RematchOptions
     * @property {string} cause
     * @property {number} reach
     */
    function matchGrammar(text, tokenList, grammar, startNode, startPos, rematch) {
    	for (var token in grammar) {
    		if (!grammar.hasOwnProperty(token) || !grammar[token]) {
    			continue;
    		}

    		var patterns = grammar[token];
    		patterns = Array.isArray(patterns) ? patterns : [patterns];

    		for (var j = 0; j < patterns.length; ++j) {
    			if (rematch && rematch.cause == token + ',' + j) {
    				return;
    			}

    			var patternObj = patterns[j],
    				inside = patternObj.inside,
    				lookbehind = !!patternObj.lookbehind,
    				greedy = !!patternObj.greedy,
    				alias = patternObj.alias;

    			if (greedy && !patternObj.pattern.global) {
    				// Without the global flag, lastIndex won't work
    				var flags = patternObj.pattern.toString().match(/[imsuy]*$/)[0];
    				patternObj.pattern = RegExp(patternObj.pattern.source, flags + 'g');
    			}

    			/** @type {RegExp} */
    			var pattern = patternObj.pattern || patternObj;

    			for ( // iterate the token list and keep track of the current token/string position
    				var currentNode = startNode.next, pos = startPos;
    				currentNode !== tokenList.tail;
    				pos += currentNode.value.length, currentNode = currentNode.next
    			) {

    				if (rematch && pos >= rematch.reach) {
    					break;
    				}

    				var str = currentNode.value;

    				if (tokenList.length > text.length) {
    					// Something went terribly wrong, ABORT, ABORT!
    					return;
    				}

    				if (str instanceof Token) {
    					continue;
    				}

    				var removeCount = 1; // this is the to parameter of removeBetween
    				var match;

    				if (greedy) {
    					match = matchPattern(pattern, pos, text, lookbehind);
    					if (!match) {
    						break;
    					}

    					var from = match.index;
    					var to = match.index + match[0].length;
    					var p = pos;

    					// find the node that contains the match
    					p += currentNode.value.length;
    					while (from >= p) {
    						currentNode = currentNode.next;
    						p += currentNode.value.length;
    					}
    					// adjust pos (and p)
    					p -= currentNode.value.length;
    					pos = p;

    					// the current node is a Token, then the match starts inside another Token, which is invalid
    					if (currentNode.value instanceof Token) {
    						continue;
    					}

    					// find the last node which is affected by this match
    					for (
    						var k = currentNode;
    						k !== tokenList.tail && (p < to || typeof k.value === 'string');
    						k = k.next
    					) {
    						removeCount++;
    						p += k.value.length;
    					}
    					removeCount--;

    					// replace with the new match
    					str = text.slice(pos, p);
    					match.index -= pos;
    				} else {
    					match = matchPattern(pattern, 0, str, lookbehind);
    					if (!match) {
    						continue;
    					}
    				}

    				var from = match.index,
    					matchStr = match[0],
    					before = str.slice(0, from),
    					after = str.slice(from + matchStr.length);

    				var reach = pos + str.length;
    				if (rematch && reach > rematch.reach) {
    					rematch.reach = reach;
    				}

    				var removeFrom = currentNode.prev;

    				if (before) {
    					removeFrom = addAfter(tokenList, removeFrom, before);
    					pos += before.length;
    				}

    				removeRange(tokenList, removeFrom, removeCount);

    				var wrapped = new Token(token, inside ? _.tokenize(matchStr, inside) : matchStr, alias, matchStr);
    				currentNode = addAfter(tokenList, removeFrom, wrapped);

    				if (after) {
    					addAfter(tokenList, currentNode, after);
    				}

    				if (removeCount > 1) {
    					// at least one Token object was removed, so we have to do some rematching
    					// this can only happen if the current pattern is greedy
    					matchGrammar(text, tokenList, grammar, currentNode.prev, pos, {
    						cause: token + ',' + j,
    						reach: reach
    					});
    				}
    			}
    		}
    	}
    }

    /**
     * @typedef LinkedListNode
     * @property {T} value
     * @property {LinkedListNode<T> | null} prev The previous node.
     * @property {LinkedListNode<T> | null} next The next node.
     * @template T
     * @private
     */

    /**
     * @template T
     * @private
     */
    function LinkedList() {
    	/** @type {LinkedListNode<T>} */
    	var head = { value: null, prev: null, next: null };
    	/** @type {LinkedListNode<T>} */
    	var tail = { value: null, prev: head, next: null };
    	head.next = tail;

    	/** @type {LinkedListNode<T>} */
    	this.head = head;
    	/** @type {LinkedListNode<T>} */
    	this.tail = tail;
    	this.length = 0;
    }

    /**
     * Adds a new node with the given value to the list.
     * @param {LinkedList<T>} list
     * @param {LinkedListNode<T>} node
     * @param {T} value
     * @returns {LinkedListNode<T>} The added node.
     * @template T
     */
    function addAfter(list, node, value) {
    	// assumes that node != list.tail && values.length >= 0
    	var next = node.next;

    	var newNode = { value: value, prev: node, next: next };
    	node.next = newNode;
    	next.prev = newNode;
    	list.length++;

    	return newNode;
    }
    /**
     * Removes `count` nodes after the given node. The given node will not be removed.
     * @param {LinkedList<T>} list
     * @param {LinkedListNode<T>} node
     * @param {number} count
     * @template T
     */
    function removeRange(list, node, count) {
    	var next = node.next;
    	for (var i = 0; i < count && next !== list.tail; i++) {
    		next = next.next;
    	}
    	node.next = next;
    	next.prev = node;
    	list.length -= i;
    }
    /**
     * @param {LinkedList<T>} list
     * @returns {T[]}
     * @template T
     */
    function toArray(list) {
    	var array = [];
    	var node = list.head.next;
    	while (node !== list.tail) {
    		array.push(node.value);
    		node = node.next;
    	}
    	return array;
    }


    if (!_self.document) {
    	if (!_self.addEventListener) {
    		// in Node.js
    		return _;
    	}

    	if (!_.disableWorkerMessageHandler) {
    		// In worker
    		_self.addEventListener('message', function (evt) {
    			var message = JSON.parse(evt.data),
    				lang = message.language,
    				code = message.code,
    				immediateClose = message.immediateClose;

    			_self.postMessage(_.highlight(code, _.languages[lang], lang));
    			if (immediateClose) {
    				_self.close();
    			}
    		}, false);
    	}

    	return _;
    }

    // Get current script and highlight
    var script = _.util.currentScript();

    if (script) {
    	_.filename = script.src;

    	if (script.hasAttribute('data-manual')) {
    		_.manual = true;
    	}
    }

    function highlightAutomaticallyCallback() {
    	if (!_.manual) {
    		_.highlightAll();
    	}
    }

    if (!_.manual) {
    	// If the document state is "loading", then we'll use DOMContentLoaded.
    	// If the document state is "interactive" and the prism.js script is deferred, then we'll also use the
    	// DOMContentLoaded event because there might be some plugins or languages which have also been deferred and they
    	// might take longer one animation frame to execute which can create a race condition where only some plugins have
    	// been loaded when Prism.highlightAll() is executed, depending on how fast resources are loaded.
    	// See https://github.com/PrismJS/prism/issues/2102
    	var readyState = document.readyState;
    	if (readyState === 'loading' || readyState === 'interactive' && script && script.defer) {
    		document.addEventListener('DOMContentLoaded', highlightAutomaticallyCallback);
    	} else {
    		if (window.requestAnimationFrame) {
    			window.requestAnimationFrame(highlightAutomaticallyCallback);
    		} else {
    			window.setTimeout(highlightAutomaticallyCallback, 16);
    		}
    	}
    }

    return _;

    })(_self);

    if (module.exports) {
    	module.exports = Prism;
    }

    // hack for components to work correctly in node.js
    if (typeof commonjsGlobal !== 'undefined') {
    	commonjsGlobal.Prism = Prism;
    }

    // some additional documentation/types

    /**
     * The expansion of a simple `RegExp` literal to support additional properties.
     *
     * @typedef GrammarToken
     * @property {RegExp} pattern The regular expression of the token.
     * @property {boolean} [lookbehind=false] If `true`, then the first capturing group of `pattern` will (effectively)
     * behave as a lookbehind group meaning that the captured text will not be part of the matched text of the new token.
     * @property {boolean} [greedy=false] Whether the token is greedy.
     * @property {string|string[]} [alias] An optional alias or list of aliases.
     * @property {Grammar} [inside] The nested grammar of this token.
     *
     * The `inside` grammar will be used to tokenize the text value of each token of this kind.
     *
     * This can be used to make nested and even recursive language definitions.
     *
     * Note: This can cause infinite recursion. Be careful when you embed different languages or even the same language into
     * each another.
     * @global
     * @public
    */

    /**
     * @typedef Grammar
     * @type {Object<string, RegExp | GrammarToken | Array<RegExp | GrammarToken>>}
     * @property {Grammar} [rest] An optional grammar object that will be appended to this grammar.
     * @global
     * @public
     */

    /**
     * A function which will invoked after an element was successfully highlighted.
     *
     * @callback HighlightCallback
     * @param {Element} element The element successfully highlighted.
     * @returns {void}
     * @global
     * @public
    */

    /**
     * @callback HookCallback
     * @param {Object<string, any>} env The environment variables of the hook.
     * @returns {void}
     * @global
     * @public
     */


    /* **********************************************
         Begin prism-markup.js
    ********************************************** */

    Prism.languages.markup = {
    	'comment': /<!--[\s\S]*?-->/,
    	'prolog': /<\?[\s\S]+?\?>/,
    	'doctype': {
    		// https://www.w3.org/TR/xml/#NT-doctypedecl
    		pattern: /<!DOCTYPE(?:[^>"'[\]]|"[^"]*"|'[^']*')+(?:\[(?:[^<"'\]]|"[^"]*"|'[^']*'|<(?!!--)|<!--(?:[^-]|-(?!->))*-->)*\]\s*)?>/i,
    		greedy: true,
    		inside: {
    			'internal-subset': {
    				pattern: /(\[)[\s\S]+(?=\]>$)/,
    				lookbehind: true,
    				greedy: true,
    				inside: null // see below
    			},
    			'string': {
    				pattern: /"[^"]*"|'[^']*'/,
    				greedy: true
    			},
    			'punctuation': /^<!|>$|[[\]]/,
    			'doctype-tag': /^DOCTYPE/,
    			'name': /[^\s<>'"]+/
    		}
    	},
    	'cdata': /<!\[CDATA\[[\s\S]*?]]>/i,
    	'tag': {
    		pattern: /<\/?(?!\d)[^\s>\/=$<%]+(?:\s(?:\s*[^\s>\/=]+(?:\s*=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+(?=[\s>]))|(?=[\s/>])))+)?\s*\/?>/,
    		greedy: true,
    		inside: {
    			'tag': {
    				pattern: /^<\/?[^\s>\/]+/,
    				inside: {
    					'punctuation': /^<\/?/,
    					'namespace': /^[^\s>\/:]+:/
    				}
    			},
    			'attr-value': {
    				pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
    				inside: {
    					'punctuation': [
    						{
    							pattern: /^=/,
    							alias: 'attr-equals'
    						},
    						/"|'/
    					]
    				}
    			},
    			'punctuation': /\/?>/,
    			'attr-name': {
    				pattern: /[^\s>\/]+/,
    				inside: {
    					'namespace': /^[^\s>\/:]+:/
    				}
    			}

    		}
    	},
    	'entity': [
    		{
    			pattern: /&[\da-z]{1,8};/i,
    			alias: 'named-entity'
    		},
    		/&#x?[\da-f]{1,8};/i
    	]
    };

    Prism.languages.markup['tag'].inside['attr-value'].inside['entity'] =
    	Prism.languages.markup['entity'];
    Prism.languages.markup['doctype'].inside['internal-subset'].inside = Prism.languages.markup;

    // Plugin to make entity title show the real entity, idea by Roman Komarov
    Prism.hooks.add('wrap', function (env) {

    	if (env.type === 'entity') {
    		env.attributes['title'] = env.content.replace(/&amp;/, '&');
    	}
    });

    Object.defineProperty(Prism.languages.markup.tag, 'addInlined', {
    	/**
    	 * Adds an inlined language to markup.
    	 *
    	 * An example of an inlined language is CSS with `<style>` tags.
    	 *
    	 * @param {string} tagName The name of the tag that contains the inlined language. This name will be treated as
    	 * case insensitive.
    	 * @param {string} lang The language key.
    	 * @example
    	 * addInlined('style', 'css');
    	 */
    	value: function addInlined(tagName, lang) {
    		var includedCdataInside = {};
    		includedCdataInside['language-' + lang] = {
    			pattern: /(^<!\[CDATA\[)[\s\S]+?(?=\]\]>$)/i,
    			lookbehind: true,
    			inside: Prism.languages[lang]
    		};
    		includedCdataInside['cdata'] = /^<!\[CDATA\[|\]\]>$/i;

    		var inside = {
    			'included-cdata': {
    				pattern: /<!\[CDATA\[[\s\S]*?\]\]>/i,
    				inside: includedCdataInside
    			}
    		};
    		inside['language-' + lang] = {
    			pattern: /[\s\S]+/,
    			inside: Prism.languages[lang]
    		};

    		var def = {};
    		def[tagName] = {
    			pattern: RegExp(/(<__[^>]*>)(?:<!\[CDATA\[(?:[^\]]|\](?!\]>))*\]\]>|(?!<!\[CDATA\[)[\s\S])*?(?=<\/__>)/.source.replace(/__/g, function () { return tagName; }), 'i'),
    			lookbehind: true,
    			greedy: true,
    			inside: inside
    		};

    		Prism.languages.insertBefore('markup', 'cdata', def);
    	}
    });

    Prism.languages.html = Prism.languages.markup;
    Prism.languages.mathml = Prism.languages.markup;
    Prism.languages.svg = Prism.languages.markup;

    Prism.languages.xml = Prism.languages.extend('markup', {});
    Prism.languages.ssml = Prism.languages.xml;
    Prism.languages.atom = Prism.languages.xml;
    Prism.languages.rss = Prism.languages.xml;


    /* **********************************************
         Begin prism-css.js
    ********************************************** */

    (function (Prism) {

    	var string = /("|')(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/;

    	Prism.languages.css = {
    		'comment': /\/\*[\s\S]*?\*\//,
    		'atrule': {
    			pattern: /@[\w-](?:[^;{\s]|\s+(?![\s{]))*(?:;|(?=\s*\{))/,
    			inside: {
    				'rule': /^@[\w-]+/,
    				'selector-function-argument': {
    					pattern: /(\bselector\s*\(\s*(?![\s)]))(?:[^()\s]|\s+(?![\s)])|\((?:[^()]|\([^()]*\))*\))+(?=\s*\))/,
    					lookbehind: true,
    					alias: 'selector'
    				},
    				'keyword': {
    					pattern: /(^|[^\w-])(?:and|not|only|or)(?![\w-])/,
    					lookbehind: true
    				}
    				// See rest below
    			}
    		},
    		'url': {
    			// https://drafts.csswg.org/css-values-3/#urls
    			pattern: RegExp('\\burl\\((?:' + string.source + '|' + /(?:[^\\\r\n()"']|\\[\s\S])*/.source + ')\\)', 'i'),
    			greedy: true,
    			inside: {
    				'function': /^url/i,
    				'punctuation': /^\(|\)$/,
    				'string': {
    					pattern: RegExp('^' + string.source + '$'),
    					alias: 'url'
    				}
    			}
    		},
    		'selector': RegExp('[^{}\\s](?:[^{};"\'\\s]|\\s+(?![\\s{])|' + string.source + ')*(?=\\s*\\{)'),
    		'string': {
    			pattern: string,
    			greedy: true
    		},
    		'property': /(?!\s)[-_a-z\xA0-\uFFFF](?:(?!\s)[-\w\xA0-\uFFFF])*(?=\s*:)/i,
    		'important': /!important\b/i,
    		'function': /[-a-z0-9]+(?=\()/i,
    		'punctuation': /[(){};:,]/
    	};

    	Prism.languages.css['atrule'].inside.rest = Prism.languages.css;

    	var markup = Prism.languages.markup;
    	if (markup) {
    		markup.tag.addInlined('style', 'css');

    		Prism.languages.insertBefore('inside', 'attr-value', {
    			'style-attr': {
    				pattern: /(^|["'\s])style\s*=\s*(?:"[^"]*"|'[^']*')/i,
    				lookbehind: true,
    				inside: {
    					'attr-value': {
    						pattern: /=\s*(?:"[^"]*"|'[^']*'|[^\s'">=]+)/,
    						inside: {
    							'style': {
    								pattern: /(["'])[\s\S]+(?=["']$)/,
    								lookbehind: true,
    								alias: 'language-css',
    								inside: Prism.languages.css
    							},
    							'punctuation': [
    								{
    									pattern: /^=/,
    									alias: 'attr-equals'
    								},
    								/"|'/
    							]
    						}
    					},
    					'attr-name': /^style/i
    				}
    			}
    		}, markup.tag);
    	}

    }(Prism));


    /* **********************************************
         Begin prism-clike.js
    ********************************************** */

    Prism.languages.clike = {
    	'comment': [
    		{
    			pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/,
    			lookbehind: true,
    			greedy: true
    		},
    		{
    			pattern: /(^|[^\\:])\/\/.*/,
    			lookbehind: true,
    			greedy: true
    		}
    	],
    	'string': {
    		pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/,
    		greedy: true
    	},
    	'class-name': {
    		pattern: /(\b(?:class|interface|extends|implements|trait|instanceof|new)\s+|\bcatch\s+\()[\w.\\]+/i,
    		lookbehind: true,
    		inside: {
    			'punctuation': /[.\\]/
    		}
    	},
    	'keyword': /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/,
    	'boolean': /\b(?:true|false)\b/,
    	'function': /\w+(?=\()/,
    	'number': /\b0x[\da-f]+\b|(?:\b\d+(?:\.\d*)?|\B\.\d+)(?:e[+-]?\d+)?/i,
    	'operator': /[<>]=?|[!=]=?=?|--?|\+\+?|&&?|\|\|?|[?*/~^%]/,
    	'punctuation': /[{}[\];(),.:]/
    };


    /* **********************************************
         Begin prism-javascript.js
    ********************************************** */

    Prism.languages.javascript = Prism.languages.extend('clike', {
    	'class-name': [
    		Prism.languages.clike['class-name'],
    		{
    			pattern: /(^|[^$\w\xA0-\uFFFF])(?!\s)[_$A-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\.(?:prototype|constructor))/,
    			lookbehind: true
    		}
    	],
    	'keyword': [
    		{
    			pattern: /((?:^|})\s*)(?:catch|finally)\b/,
    			lookbehind: true
    		},
    		{
    			pattern: /(^|[^.]|\.\.\.\s*)\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|(?:get|set)(?=\s*[\[$\w\xA0-\uFFFF])|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/,
    			lookbehind: true
    		},
    	],
    	// Allow for all non-ASCII characters (See http://stackoverflow.com/a/2008444)
    	'function': /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/,
    	'number': /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/,
    	'operator': /--|\+\+|\*\*=?|=>|&&=?|\|\|=?|[!=]==|<<=?|>>>?=?|[-+*/%&|^!=<>]=?|\.{3}|\?\?=?|\?\.?|[~:]/
    });

    Prism.languages.javascript['class-name'][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;

    Prism.languages.insertBefore('javascript', 'keyword', {
    	'regex': {
    		pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s]|\b(?:return|yield))\s*)\/(?:\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=(?:\s|\/\*(?:[^*]|\*(?!\/))*\*\/)*(?:$|[\r\n,.;:})\]]|\/\/))/,
    		lookbehind: true,
    		greedy: true,
    		inside: {
    			'regex-source': {
    				pattern: /^(\/)[\s\S]+(?=\/[a-z]*$)/,
    				lookbehind: true,
    				alias: 'language-regex',
    				inside: Prism.languages.regex
    			},
    			'regex-flags': /[a-z]+$/,
    			'regex-delimiter': /^\/|\/$/
    		}
    	},
    	// This must be declared before keyword because we use "function" inside the look-forward
    	'function-variable': {
    		pattern: /#?(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)\s*=>))/,
    		alias: 'function'
    	},
    	'parameter': [
    		{
    			pattern: /(function(?:\s+(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*)?\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\))/,
    			lookbehind: true,
    			inside: Prism.languages.javascript
    		},
    		{
    			pattern: /(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*(?=\s*=>)/i,
    			inside: Prism.languages.javascript
    		},
    		{
    			pattern: /(\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*=>)/,
    			lookbehind: true,
    			inside: Prism.languages.javascript
    		},
    		{
    			pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:(?!\s)[_$a-zA-Z\xA0-\uFFFF](?:(?!\s)[$\w\xA0-\uFFFF])*\s*)\(\s*|\]\s*\(\s*)(?!\s)(?:[^()\s]|\s+(?![\s)])|\([^()]*\))+(?=\s*\)\s*\{)/,
    			lookbehind: true,
    			inside: Prism.languages.javascript
    		}
    	],
    	'constant': /\b[A-Z](?:[A-Z_]|\dx?)*\b/
    });

    Prism.languages.insertBefore('javascript', 'string', {
    	'template-string': {
    		pattern: /`(?:\\[\s\S]|\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}|(?!\${)[^\\`])*`/,
    		greedy: true,
    		inside: {
    			'template-punctuation': {
    				pattern: /^`|`$/,
    				alias: 'string'
    			},
    			'interpolation': {
    				pattern: /((?:^|[^\\])(?:\\{2})*)\${(?:[^{}]|{(?:[^{}]|{[^}]*})*})+}/,
    				lookbehind: true,
    				inside: {
    					'interpolation-punctuation': {
    						pattern: /^\${|}$/,
    						alias: 'punctuation'
    					},
    					rest: Prism.languages.javascript
    				}
    			},
    			'string': /[\s\S]+/
    		}
    	}
    });

    if (Prism.languages.markup) {
    	Prism.languages.markup.tag.addInlined('script', 'javascript');
    }

    Prism.languages.js = Prism.languages.javascript;


    /* **********************************************
         Begin prism-file-highlight.js
    ********************************************** */

    (function () {
    	if (typeof self === 'undefined' || !self.Prism || !self.document) {
    		return;
    	}

    	// https://developer.mozilla.org/en-US/docs/Web/API/Element/matches#Polyfill
    	if (!Element.prototype.matches) {
    		Element.prototype.matches = Element.prototype.msMatchesSelector || Element.prototype.webkitMatchesSelector;
    	}

    	var Prism = window.Prism;

    	var LOADING_MESSAGE = 'Loading…';
    	var FAILURE_MESSAGE = function (status, message) {
    		return '✖ Error ' + status + ' while fetching file: ' + message;
    	};
    	var FAILURE_EMPTY_MESSAGE = '✖ Error: File does not exist or is empty';

    	var EXTENSIONS = {
    		'js': 'javascript',
    		'py': 'python',
    		'rb': 'ruby',
    		'ps1': 'powershell',
    		'psm1': 'powershell',
    		'sh': 'bash',
    		'bat': 'batch',
    		'h': 'c',
    		'tex': 'latex'
    	};

    	var STATUS_ATTR = 'data-src-status';
    	var STATUS_LOADING = 'loading';
    	var STATUS_LOADED = 'loaded';
    	var STATUS_FAILED = 'failed';

    	var SELECTOR = 'pre[data-src]:not([' + STATUS_ATTR + '="' + STATUS_LOADED + '"])'
    		+ ':not([' + STATUS_ATTR + '="' + STATUS_LOADING + '"])';

    	var lang = /\blang(?:uage)?-([\w-]+)\b/i;

    	/**
    	 * Sets the Prism `language-xxxx` or `lang-xxxx` class to the given language.
    	 *
    	 * @param {HTMLElement} element
    	 * @param {string} language
    	 * @returns {void}
    	 */
    	function setLanguageClass(element, language) {
    		var className = element.className;
    		className = className.replace(lang, ' ') + ' language-' + language;
    		element.className = className.replace(/\s+/g, ' ').trim();
    	}


    	Prism.hooks.add('before-highlightall', function (env) {
    		env.selector += ', ' + SELECTOR;
    	});

    	Prism.hooks.add('before-sanity-check', function (env) {
    		var pre = /** @type {HTMLPreElement} */ (env.element);
    		if (pre.matches(SELECTOR)) {
    			env.code = ''; // fast-path the whole thing and go to complete

    			pre.setAttribute(STATUS_ATTR, STATUS_LOADING); // mark as loading

    			// add code element with loading message
    			var code = pre.appendChild(document.createElement('CODE'));
    			code.textContent = LOADING_MESSAGE;

    			var src = pre.getAttribute('data-src');

    			var language = env.language;
    			if (language === 'none') {
    				// the language might be 'none' because there is no language set;
    				// in this case, we want to use the extension as the language
    				var extension = (/\.(\w+)$/.exec(src) || [, 'none'])[1];
    				language = EXTENSIONS[extension] || extension;
    			}

    			// set language classes
    			setLanguageClass(code, language);
    			setLanguageClass(pre, language);

    			// preload the language
    			var autoloader = Prism.plugins.autoloader;
    			if (autoloader) {
    				autoloader.loadLanguages(language);
    			}

    			// load file
    			var xhr = new XMLHttpRequest();
    			xhr.open('GET', src, true);
    			xhr.onreadystatechange = function () {
    				if (xhr.readyState == 4) {
    					if (xhr.status < 400 && xhr.responseText) {
    						// mark as loaded
    						pre.setAttribute(STATUS_ATTR, STATUS_LOADED);

    						// highlight code
    						code.textContent = xhr.responseText;
    						Prism.highlightElement(code);

    					} else {
    						// mark as failed
    						pre.setAttribute(STATUS_ATTR, STATUS_FAILED);

    						if (xhr.status >= 400) {
    							code.textContent = FAILURE_MESSAGE(xhr.status, xhr.statusText);
    						} else {
    							code.textContent = FAILURE_EMPTY_MESSAGE;
    						}
    					}
    				}
    			};
    			xhr.send(null);
    		}
    	});

    	Prism.plugins.fileHighlight = {
    		/**
    		 * Executes the File Highlight plugin for all matching `pre` elements under the given container.
    		 *
    		 * Note: Elements which are already loaded or currently loading will not be touched by this method.
    		 *
    		 * @param {ParentNode} [container=document]
    		 */
    		highlight: function highlight(container) {
    			var elements = (container || document).querySelectorAll(SELECTOR);

    			for (var i = 0, element; element = elements[i++];) {
    				Prism.highlightElement(element);
    			}
    		}
    	};

    	var logged = false;
    	/** @deprecated Use `Prism.plugins.fileHighlight.highlight` instead. */
    	Prism.fileHighlight = function () {
    		if (!logged) {
    			console.warn('Prism.fileHighlight is deprecated. Use `Prism.plugins.fileHighlight.highlight` instead.');
    			logged = true;
    		}
    		Prism.plugins.fileHighlight.highlight.apply(this, arguments);
    	};

    })();
    });

    /* src/components/Code.svelte generated by Svelte v3.35.0 */
    const file$c = "src/components/Code.svelte";

    function create_fragment$e(ctx) {
    	let pre;
    	let pre_class_value;

    	const block = {
    		c: function create() {
    			pre = element("pre");
    			attr_dev(pre, "class", pre_class_value = "bg-gray-100 " + /*$$restProps*/ ctx[1].class);
    			add_location(pre, file$c, 6, 0, 164);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, pre, anchor);
    			pre.innerHTML = /*html*/ ctx[0];
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*html*/ 1) pre.innerHTML = /*html*/ ctx[0];
    			if (dirty & /*$$restProps*/ 2 && pre_class_value !== (pre_class_value = "bg-gray-100 " + /*$$restProps*/ ctx[1].class)) {
    				attr_dev(pre, "class", pre_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(pre);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$e.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$e($$self, $$props, $$invalidate) {
    	let html;
    	const omit_props_names = ["code","lang"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Code", slots, []);
    	var { code = "" } = $$props;
    	var { lang = "javascript" } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("code" in $$new_props) $$invalidate(2, code = $$new_props.code);
    		if ("lang" in $$new_props) $$invalidate(3, lang = $$new_props.lang);
    	};

    	$$self.$capture_state = () => ({ Prism: prism, code, lang, html });

    	$$self.$inject_state = $$new_props => {
    		if ("code" in $$props) $$invalidate(2, code = $$new_props.code);
    		if ("lang" in $$props) $$invalidate(3, lang = $$new_props.lang);
    		if ("html" in $$props) $$invalidate(0, html = $$new_props.html);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*code, lang*/ 12) {
    			$$invalidate(0, html = prism.highlight(code, prism.languages[lang], lang));
    		}
    	};

    	return [html, $$restProps, code, lang];
    }

    class Code extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$e, create_fragment$e, safe_not_equal, { code: 2, lang: 3 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Code",
    			options,
    			id: create_fragment$e.name
    		});
    	}

    	get code() {
    		throw new Error("<Code>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set code(value) {
    		throw new Error("<Code>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get lang() {
    		throw new Error("<Code>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set lang(value) {
    		throw new Error("<Code>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/BootstrapToastDocs.svelte generated by Svelte v3.35.0 */
    const file$b = "src/pages/BootstrapToastDocs.svelte";

    // (26:14) <Link class="text-blue-600 underline" to="/toast">
    function create_default_slot$a(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("here");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$a.name,
    		type: "slot",
    		source: "(26:14) <Link class=\\\"text-blue-600 underline\\\" to=\\\"/toast\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$d(ctx) {
    	let div3;
    	let h1;
    	let t1;
    	let div2;
    	let div0;
    	let h30;
    	let t3;
    	let img0;
    	let img0_src_value;
    	let t4;
    	let div1;
    	let h31;
    	let t6;
    	let img1;
    	let img1_src_value;
    	let t7;
    	let p0;
    	let t8;
    	let link;
    	let t9;
    	let t10;
    	let code0;
    	let t11;
    	let code1;
    	let t12;
    	let code2;
    	let t13;
    	let p1;
    	let t15;
    	let code3;
    	let t16;
    	let h32;
    	let t18;
    	let p2;
    	let t20;
    	let code4;
    	let t21;
    	let h33;
    	let t23;
    	let p3;
    	let t25;
    	let code5;
    	let t26;
    	let h34;
    	let t28;
    	let p4;
    	let t30;
    	let code6;
    	let current;

    	link = new Link({
    			props: {
    				class: "text-blue-600 underline",
    				to: "/toast",
    				$$slots: { default: [create_default_slot$a] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	code0 = new Code({
    			props: {
    				class: "mt-5",
    				lang: "html",
    				code: ` 
  <script>`
    			},
    			$$inline: true
    		});

    	code1 = new Code({
    			props: {
    				code: `    import { toasts, ToastContainer, BootstrapToast }  from "svelte-toasts";
    
    const showToast = () => {
      const toast = toasts.add({
        description: 'Message body',
        component: BootstrapToast, // this will override toast component provided by ToastContainer
      });
    };
  `
    			},
    			$$inline: true
    		});

    	code2 = new Code({
    			props: {
    				class: "",
    				lang: "html",
    				code: `  <script>
  
  <button on:click={showToast}>Show Toast</button>
  <ToastContainer {toasts} let:data={data}>
    <BootstrapToast {data} /> <!-- default slot as toast component -->
  </ToastContainer>
  `
    			},
    			$$inline: true
    		});

    	code3 = new Code({
    			props: {
    				class: "my-5",
    				code: `
  <slot name="icon"></slot>
  <slot name="extra"></slot>
  <slot name="close-icon">
  `
    			},
    			$$inline: true
    		});

    	code4 = new Code({
    			props: {
    				class: "my-5",
    				code: `
  <BootstrapToast data={data}>
    <slot name="icon">
      <svg xmlns="http://www.w3.org/2000/svg" fill="#ccc" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    </slot>
  </BootstrapToast>
  `
    			},
    			$$inline: true
    		});

    	code5 = new Code({
    			props: {
    				class: "my-5",
    				code: `
  <BootstrapToast data={data}>
    <slot name="extra">
      <span class="text-sm text-gray-300">08:15:30 AM</span>
    </slot>
  </BootstrapToast>
  `
    			},
    			$$inline: true
    		});

    	code6 = new Code({
    			props: {
    				class: "my-5",
    				code: `
  <BootstrapToast data={data}>
    <slot name="close-icon">
      <span class="text-sm text-gray-300">Close</span>
    </slot>
  </BootstrapToast>
  `
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			h1 = element("h1");
    			h1.textContent = "BootstrapToast";
    			t1 = space();
    			div2 = element("div");
    			div0 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Dark Theme";
    			t3 = space();
    			img0 = element("img");
    			t4 = space();
    			div1 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Light Theme";
    			t6 = space();
    			img1 = element("img");
    			t7 = space();
    			p0 = element("p");
    			t8 = text("BootstrapToast component takes \"data\" prop which is a toast object as\n    described ");
    			create_component(link.$$.fragment);
    			t9 = text(". You\n    can use BootstrapToast like this.");
    			t10 = space();
    			create_component(code0.$$.fragment);
    			t11 = space();
    			create_component(code1.$$.fragment);
    			t12 = space();
    			create_component(code2.$$.fragment);
    			t13 = space();
    			p1 = element("p");
    			p1.textContent = "BootstrapToast accepts following optional slots:";
    			t15 = space();
    			create_component(code3.$$.fragment);
    			t16 = space();
    			h32 = element("h3");
    			h32.textContent = "Icon Slot";
    			t18 = space();
    			p2 = element("p");
    			p2.textContent = "You can provide your own custom icon or any element to be shown as toast\n    icon instead of predefined icons.";
    			t20 = space();
    			create_component(code4.$$.fragment);
    			t21 = space();
    			h33 = element("h3");
    			h33.textContent = "Extra Slot";
    			t23 = space();
    			p3 = element("p");
    			p3.textContent = "You can provide some extra content to be shown below toast message,\n    something like timestamp, some link to other page etc.";
    			t25 = space();
    			create_component(code5.$$.fragment);
    			t26 = space();
    			h34 = element("h3");
    			h34.textContent = "Close Icon Slot";
    			t28 = space();
    			p4 = element("p");
    			p4.textContent = "By default, a cross icon is show inside close button but if you want to\n    change this icon, you can provide your own icon or some text.";
    			t30 = space();
    			create_component(code6.$$.fragment);
    			attr_dev(h1, "class", "text-3xl mb-5 outline-none");
    			add_location(h1, file$b, 4, 2, 131);
    			add_location(h30, file$b, 7, 6, 299);
    			if (img0.src !== (img0_src_value = "images/bootstrap-dark.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "width", "320px");
    			attr_dev(img0, "alt", "Light theme toasts");
    			add_location(img0, file$b, 8, 6, 325);
    			attr_dev(div0, "class", "toast-component flex flex-col items-center");
    			add_location(div0, file$b, 6, 4, 236);
    			add_location(h31, file$b, 15, 6, 512);
    			if (img1.src !== (img1_src_value = "images/bootstrap-light.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "width", "320px");
    			attr_dev(img1, "alt", "Dark theme toasts");
    			add_location(img1, file$b, 16, 6, 539);
    			attr_dev(div1, "class", "toast-component flex flex-col items-center");
    			add_location(div1, file$b, 14, 4, 449);
    			attr_dev(div2, "class", "flex flex-col md:flex-row");
    			add_location(div2, file$b, 5, 2, 192);
    			attr_dev(p0, "id", "code");
    			attr_dev(p0, "class", "space-5 mt-5");
    			add_location(p0, file$b, 23, 2, 670);
    			attr_dev(p1, "id", "slots");
    			attr_dev(p1, "class", "mt-5");
    			add_location(p1, file$b, 57, 2, 1566);
    			attr_dev(h32, "id", "icon-slot");
    			attr_dev(h32, "class", "text-xl mt-3");
    			add_location(h32, file$b, 68, 2, 1787);
    			attr_dev(p2, "class", "my-4");
    			add_location(p2, file$b, 69, 2, 1844);
    			attr_dev(h33, "id", "extra-clot");
    			attr_dev(h33, "class", "text-xl mt-3");
    			add_location(h33, file$b, 87, 2, 2425);
    			attr_dev(p3, "class", "my-4");
    			add_location(p3, file$b, 88, 2, 2484);
    			attr_dev(h34, "id", "close-icon-slot");
    			attr_dev(h34, "class", "text-xl mt-3");
    			add_location(h34, file$b, 104, 2, 2838);
    			attr_dev(p4, "class", "my-4");
    			add_location(p4, file$b, 105, 2, 2907);
    			attr_dev(div3, "class", "p-5 mb-20");
    			add_location(div3, file$b, 3, 0, 105);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, h1);
    			append_dev(div3, t1);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h30);
    			append_dev(div0, t3);
    			append_dev(div0, img0);
    			append_dev(div2, t4);
    			append_dev(div2, div1);
    			append_dev(div1, h31);
    			append_dev(div1, t6);
    			append_dev(div1, img1);
    			append_dev(div3, t7);
    			append_dev(div3, p0);
    			append_dev(p0, t8);
    			mount_component(link, p0, null);
    			append_dev(p0, t9);
    			append_dev(div3, t10);
    			mount_component(code0, div3, null);
    			append_dev(div3, t11);
    			mount_component(code1, div3, null);
    			append_dev(div3, t12);
    			mount_component(code2, div3, null);
    			append_dev(div3, t13);
    			append_dev(div3, p1);
    			append_dev(div3, t15);
    			mount_component(code3, div3, null);
    			append_dev(div3, t16);
    			append_dev(div3, h32);
    			append_dev(div3, t18);
    			append_dev(div3, p2);
    			append_dev(div3, t20);
    			mount_component(code4, div3, null);
    			append_dev(div3, t21);
    			append_dev(div3, h33);
    			append_dev(div3, t23);
    			append_dev(div3, p3);
    			append_dev(div3, t25);
    			mount_component(code5, div3, null);
    			append_dev(div3, t26);
    			append_dev(div3, h34);
    			append_dev(div3, t28);
    			append_dev(div3, p4);
    			append_dev(div3, t30);
    			mount_component(code6, div3, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			transition_in(code0.$$.fragment, local);
    			transition_in(code1.$$.fragment, local);
    			transition_in(code2.$$.fragment, local);
    			transition_in(code3.$$.fragment, local);
    			transition_in(code4.$$.fragment, local);
    			transition_in(code5.$$.fragment, local);
    			transition_in(code6.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			transition_out(code0.$$.fragment, local);
    			transition_out(code1.$$.fragment, local);
    			transition_out(code2.$$.fragment, local);
    			transition_out(code3.$$.fragment, local);
    			transition_out(code4.$$.fragment, local);
    			transition_out(code5.$$.fragment, local);
    			transition_out(code6.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);
    			destroy_component(link);
    			destroy_component(code0);
    			destroy_component(code1);
    			destroy_component(code2);
    			destroy_component(code3);
    			destroy_component(code4);
    			destroy_component(code5);
    			destroy_component(code6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$d.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$d($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("BootstrapToastDocs", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<BootstrapToastDocs> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link, Code });
    	return [];
    }

    class BootstrapToastDocs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$d, create_fragment$d, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "BootstrapToastDocs",
    			options,
    			id: create_fragment$d.name
    		});
    	}
    }

    /* src/components/Table.svelte generated by Svelte v3.35.0 */

    const file$a = "src/components/Table.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    function get_each_context_2(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[6] = list[i];
    	return child_ctx;
    }

    // (11:14) {#each columns as column (column)}
    function create_each_block_2(key_1, ctx) {
    	let th;
    	let t0_value = /*column*/ ctx[6].header + "";
    	let t0;
    	let t1;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			th = element("th");
    			t0 = text(t0_value);
    			t1 = space();
    			attr_dev(th, "scope", "col");
    			attr_dev(th, "class", "px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase");
    			add_location(th, file$a, 11, 16, 493);
    			this.first = th;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, th, anchor);
    			append_dev(th, t0);
    			append_dev(th, t1);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*columns*/ 1 && t0_value !== (t0_value = /*column*/ ctx[6].header + "")) set_data_dev(t0, t0_value);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(th);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_2.name,
    		type: "each",
    		source: "(11:14) {#each columns as column (column)}",
    		ctx
    	});

    	return block;
    }

    // (31:16) {#each columns as column (column)}
    function create_each_block_1(key_1, ctx) {
    	let td;
    	let div;
    	let t_value = /*row*/ ctx[3][/*column*/ ctx[6].dataIndex] + "";
    	let t;
    	let div_class_value;
    	let td_style_value;

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			td = element("td");
    			div = element("div");
    			t = text(t_value);
    			attr_dev(div, "class", div_class_value = "text-sm text-gray-600 " + /*column*/ ctx[6].class);
    			add_location(div, file$a, 32, 20, 1455);
    			attr_dev(td, "class", "px-6 py-4");

    			attr_dev(td, "style", td_style_value = /*column*/ ctx[6].width
    			? `min-width: ${/*column*/ ctx[6].width}`
    			: "");

    			add_location(td, file$a, 31, 18, 1353);
    			this.first = td;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, td, anchor);
    			append_dev(td, div);
    			append_dev(div, t);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;
    			if (dirty & /*data, columns*/ 3 && t_value !== (t_value = /*row*/ ctx[3][/*column*/ ctx[6].dataIndex] + "")) set_data_dev(t, t_value);

    			if (dirty & /*columns*/ 1 && div_class_value !== (div_class_value = "text-sm text-gray-600 " + /*column*/ ctx[6].class)) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*columns*/ 1 && td_style_value !== (td_style_value = /*column*/ ctx[6].width
    			? `min-width: ${/*column*/ ctx[6].width}`
    			: "")) {
    				attr_dev(td, "style", td_style_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(td);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(31:16) {#each columns as column (column)}",
    		ctx
    	});

    	return block;
    }

    // (29:12) {#each data as row (row)}
    function create_each_block(key_1, ctx) {
    	let tr;
    	let each_blocks = [];
    	let each_1_lookup = new Map();
    	let t;
    	let each_value_1 = /*columns*/ ctx[0];
    	validate_each_argument(each_value_1);
    	const get_key = ctx => /*column*/ ctx[6];
    	validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		let child_ctx = get_each_context_1(ctx, each_value_1, i);
    		let key = get_key(child_ctx);
    		each_1_lookup.set(key, each_blocks[i] = create_each_block_1(key, child_ctx));
    	}

    	const block = {
    		key: key_1,
    		first: null,
    		c: function create() {
    			tr = element("tr");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t = space();
    			add_location(tr, file$a, 29, 14, 1279);
    			this.first = tr;
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, tr, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tr, null);
    			}

    			append_dev(tr, t);
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*columns, data*/ 3) {
    				each_value_1 = /*columns*/ ctx[0];
    				validate_each_argument(each_value_1);
    				validate_each_keys(ctx, each_value_1, get_each_context_1, get_key);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key, 1, ctx, each_value_1, each_1_lookup, tr, destroy_block, create_each_block_1, t, get_each_context_1);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(tr);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(29:12) {#each data as row (row)}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$c(ctx) {
    	let div3;
    	let div2;
    	let div1;
    	let div0;
    	let table;
    	let thead;
    	let tr;
    	let each_blocks_1 = [];
    	let each0_lookup = new Map();
    	let t;
    	let tbody;
    	let each_blocks = [];
    	let each1_lookup = new Map();
    	let div3_class_value;
    	let each_value_2 = /*columns*/ ctx[0];
    	validate_each_argument(each_value_2);
    	const get_key = ctx => /*column*/ ctx[6];
    	validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);

    	for (let i = 0; i < each_value_2.length; i += 1) {
    		let child_ctx = get_each_context_2(ctx, each_value_2, i);
    		let key = get_key(child_ctx);
    		each0_lookup.set(key, each_blocks_1[i] = create_each_block_2(key, child_ctx));
    	}

    	let each_value = /*data*/ ctx[1];
    	validate_each_argument(each_value);
    	const get_key_1 = ctx => /*row*/ ctx[3];
    	validate_each_keys(ctx, each_value, get_each_context, get_key_1);

    	for (let i = 0; i < each_value.length; i += 1) {
    		let child_ctx = get_each_context(ctx, each_value, i);
    		let key = get_key_1(child_ctx);
    		each1_lookup.set(key, each_blocks[i] = create_each_block(key, child_ctx));
    	}

    	const block = {
    		c: function create() {
    			div3 = element("div");
    			div2 = element("div");
    			div1 = element("div");
    			div0 = element("div");
    			table = element("table");
    			thead = element("thead");
    			tr = element("tr");

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].c();
    			}

    			t = space();
    			tbody = element("tbody");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			add_location(tr, file$a, 9, 12, 423);
    			attr_dev(thead, "class", "bg-gray-100");
    			add_location(thead, file$a, 8, 10, 383);
    			attr_dev(tbody, "class", "bg-white divide-y divide-gray-200");
    			add_location(tbody, file$a, 26, 10, 1164);
    			attr_dev(table, "class", "min-w-full divide-y divide-gray-200");
    			add_location(table, file$a, 7, 8, 321);
    			attr_dev(div0, "class", "shadow overflow-hidden border-b border-gray-200");
    			add_location(div0, file$a, 6, 6, 251);
    			attr_dev(div1, "class", "py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8");
    			add_location(div1, file$a, 5, 4, 173);
    			attr_dev(div2, "class", "-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8");
    			add_location(div2, file$a, 4, 2, 115);
    			attr_dev(div3, "class", div3_class_value = "flex flex-col " + /*$$restProps*/ ctx[2].class);
    			add_location(div3, file$a, 3, 0, 65);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div3, anchor);
    			append_dev(div3, div2);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			append_dev(div0, table);
    			append_dev(table, thead);
    			append_dev(thead, tr);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].m(tr, null);
    			}

    			append_dev(table, t);
    			append_dev(table, tbody);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(tbody, null);
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*columns*/ 1) {
    				each_value_2 = /*columns*/ ctx[0];
    				validate_each_argument(each_value_2);
    				validate_each_keys(ctx, each_value_2, get_each_context_2, get_key);
    				each_blocks_1 = update_keyed_each(each_blocks_1, dirty, get_key, 1, ctx, each_value_2, each0_lookup, tr, destroy_block, create_each_block_2, null, get_each_context_2);
    			}

    			if (dirty & /*columns, data*/ 3) {
    				each_value = /*data*/ ctx[1];
    				validate_each_argument(each_value);
    				validate_each_keys(ctx, each_value, get_each_context, get_key_1);
    				each_blocks = update_keyed_each(each_blocks, dirty, get_key_1, 1, ctx, each_value, each1_lookup, tbody, destroy_block, create_each_block, null, get_each_context);
    			}

    			if (dirty & /*$$restProps*/ 4 && div3_class_value !== (div3_class_value = "flex flex-col " + /*$$restProps*/ ctx[2].class)) {
    				attr_dev(div3, "class", div3_class_value);
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div3);

    			for (let i = 0; i < each_blocks_1.length; i += 1) {
    				each_blocks_1[i].d();
    			}

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$c.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$c($$self, $$props, $$invalidate) {
    	const omit_props_names = ["columns","data"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Table", slots, []);
    	var { columns = [] } = $$props;
    	var { data = [] } = $$props;

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(2, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("columns" in $$new_props) $$invalidate(0, columns = $$new_props.columns);
    		if ("data" in $$new_props) $$invalidate(1, data = $$new_props.data);
    	};

    	$$self.$capture_state = () => ({ columns, data });

    	$$self.$inject_state = $$new_props => {
    		if ("columns" in $$props) $$invalidate(0, columns = $$new_props.columns);
    		if ("data" in $$props) $$invalidate(1, data = $$new_props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [columns, data, $$restProps];
    }

    class Table extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$c, create_fragment$c, safe_not_equal, { columns: 0, data: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Table",
    			options,
    			id: create_fragment$c.name
    		});
    	}

    	get columns() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set columns(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get data() {
    		throw new Error("<Table>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set data(value) {
    		throw new Error("<Table>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/FlatToastDocs.svelte generated by Svelte v3.35.0 */
    const file$9 = "src/pages/FlatToastDocs.svelte";

    // (36:79) <Link       class="text-blue-600 underline"       to="/toast">
    function create_default_slot$9(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("here");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$9.name,
    		type: "slot",
    		source: "(36:79) <Link       class=\\\"text-blue-600 underline\\\"       to=\\\"/toast\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$b(ctx) {
    	let meta0;
    	let meta1;
    	let meta2;
    	let meta3;
    	let meta4;
    	let meta5;
    	let meta6;
    	let t0;
    	let div3;
    	let h1;
    	let t2;
    	let div2;
    	let div0;
    	let h30;
    	let t4;
    	let img0;
    	let img0_src_value;
    	let t5;
    	let div1;
    	let h31;
    	let t7;
    	let img1;
    	let img1_src_value;
    	let t8;
    	let p0;
    	let t9;
    	let link;
    	let t10;
    	let t11;
    	let code0;
    	let t12;
    	let code1;
    	let t13;
    	let code2;
    	let t14;
    	let p1;
    	let t16;
    	let code3;
    	let t17;
    	let h32;
    	let t19;
    	let p2;
    	let t21;
    	let code4;
    	let t22;
    	let h33;
    	let t24;
    	let p3;
    	let t26;
    	let code5;
    	let t27;
    	let h34;
    	let t29;
    	let p4;
    	let t31;
    	let code6;
    	let current;

    	link = new Link({
    			props: {
    				class: "text-blue-600 underline",
    				to: "/toast",
    				$$slots: { default: [create_default_slot$9] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	code0 = new Code({
    			props: {
    				class: "mt-5",
    				lang: "html",
    				code: ` 
  <script>`
    			},
    			$$inline: true
    		});

    	code1 = new Code({
    			props: {
    				code: `    import { toasts, ToastContainer, FlatToast }  from "svelte-toasts";
    
    const showToast = () => {
      const toast = toasts.add({
        description: 'Message body',
        component: BootstrapToast, // this will override toast component provided by ToastContainer
      });
    };
  `
    			},
    			$$inline: true
    		});

    	code2 = new Code({
    			props: {
    				class: "",
    				lang: "html",
    				code: `  <script>
  
  <button on:click={showToast}>Show Toast</button>
  <ToastContainer {toasts} let:data={data}>
    <FlatToast {data} /> <!-- default slot as toast component -->
  </ToastContainer>
  `
    			},
    			$$inline: true
    		});

    	code3 = new Code({
    			props: {
    				class: "my-5",
    				code: `
  <slot name="icon"></slot>
  <slot name="extra"></slot>
  <slot name="close-icon">
  `
    			},
    			$$inline: true
    		});

    	code4 = new Code({
    			props: {
    				class: "my-5",
    				code: `
  <FlatToast data={data}>
    <slot name="icon">
      <svg xmlns="http://www.w3.org/2000/svg" fill="#ccc" viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
      </svg>
    </slot>
  </FlatToast>
  `
    			},
    			$$inline: true
    		});

    	code5 = new Code({
    			props: {
    				class: "my-5",
    				code: `
  <FlatToast data={data}>
    <slot name="extra">
      <span class="text-sm text-gray-300">08:15:30 AM</span>
    </slot>
  </FlatToast>
  `
    			},
    			$$inline: true
    		});

    	code6 = new Code({
    			props: {
    				class: "my-5",
    				code: `
  <FlatToast data={data}>
    <slot name="close-icon">
      <span class="text-sm text-gray-300">Close</span>
    </slot>
  </FlatToast>
  `
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			meta0 = element("meta");
    			meta1 = element("meta");
    			meta2 = element("meta");
    			meta3 = element("meta");
    			meta4 = element("meta");
    			meta5 = element("meta");
    			meta6 = element("meta");
    			t0 = space();
    			div3 = element("div");
    			h1 = element("h1");
    			h1.textContent = "FlatToast";
    			t2 = space();
    			div2 = element("div");
    			div0 = element("div");
    			h30 = element("h3");
    			h30.textContent = "Dark Theme";
    			t4 = space();
    			img0 = element("img");
    			t5 = space();
    			div1 = element("div");
    			h31 = element("h3");
    			h31.textContent = "Light Theme";
    			t7 = space();
    			img1 = element("img");
    			t8 = space();
    			p0 = element("p");
    			t9 = text("FlatToast component takes \"data\" prop which is a toast object as described ");
    			create_component(link.$$.fragment);
    			t10 = text(". You can use FlatToast like this.");
    			t11 = space();
    			create_component(code0.$$.fragment);
    			t12 = space();
    			create_component(code1.$$.fragment);
    			t13 = space();
    			create_component(code2.$$.fragment);
    			t14 = space();
    			p1 = element("p");
    			p1.textContent = "FlatToast accepts following optional slots:";
    			t16 = space();
    			create_component(code3.$$.fragment);
    			t17 = space();
    			h32 = element("h3");
    			h32.textContent = "Icon Slot";
    			t19 = space();
    			p2 = element("p");
    			p2.textContent = "You can provide your own custom icon or any element to be shown as toast\n    icon instead of predefined icons.";
    			t21 = space();
    			create_component(code4.$$.fragment);
    			t22 = space();
    			h33 = element("h3");
    			h33.textContent = "Extra Slot";
    			t24 = space();
    			p3 = element("p");
    			p3.textContent = "You can provide some extra content to be shown below toast message,\n    something like timestamp, some link to other page etc.";
    			t26 = space();
    			create_component(code5.$$.fragment);
    			t27 = space();
    			h34 = element("h3");
    			h34.textContent = "Close Icon Slot";
    			t29 = space();
    			p4 = element("p");
    			p4.textContent = "By default, a cross icon is show inside close button but if you want to\n    change this icon, you can provide your own icon or some text.";
    			t31 = space();
    			create_component(code6.$$.fragment);
    			document.title = "Svelte Toasts: FlatToast";
    			attr_dev(meta0, "name", "title");
    			attr_dev(meta0, "content", "Svelte Toasts: FlatToast");
    			add_location(meta0, file$9, 6, 2, 211);
    			attr_dev(meta1, "name", "description");
    			attr_dev(meta1, "content", "Svelte Toasts: FlatToast docs");
    			add_location(meta1, file$9, 7, 2, 270);
    			attr_dev(meta2, "name", "keywords");
    			attr_dev(meta2, "content", "svelte, svelte-toasts,toasts,bootstrap-toast,flat-toast,store-toast");
    			add_location(meta2, file$9, 8, 2, 340);
    			attr_dev(meta3, "name", "robots");
    			attr_dev(meta3, "content", "index, follow");
    			add_location(meta3, file$9, 12, 2, 455);
    			attr_dev(meta4, "http-equiv", "Content-Type");
    			attr_dev(meta4, "content", "text/html; charset=utf-8");
    			add_location(meta4, file$9, 13, 2, 504);
    			attr_dev(meta5, "name", "language");
    			attr_dev(meta5, "content", "English");
    			add_location(meta5, file$9, 14, 2, 576);
    			attr_dev(meta6, "name", "author");
    			attr_dev(meta6, "content", "Zohaib Ijaz");
    			add_location(meta6, file$9, 15, 2, 621);
    			attr_dev(h1, "class", "text-3xl mb-5 outline-none");
    			add_location(h1, file$9, 19, 2, 708);
    			add_location(h30, file$9, 22, 6, 871);
    			if (img0.src !== (img0_src_value = "./images/flat-dark.png")) attr_dev(img0, "src", img0_src_value);
    			attr_dev(img0, "width", "320px");
    			attr_dev(img0, "alt", "Light theme toasts");
    			add_location(img0, file$9, 23, 6, 897);
    			attr_dev(div0, "class", "toast-component flex flex-col items-center");
    			add_location(div0, file$9, 21, 4, 808);
    			add_location(h31, file$9, 30, 6, 1081);
    			if (img1.src !== (img1_src_value = "images/flat-light.png")) attr_dev(img1, "src", img1_src_value);
    			attr_dev(img1, "width", "320px");
    			attr_dev(img1, "alt", "Dark theme toasts");
    			add_location(img1, file$9, 31, 6, 1108);
    			attr_dev(div1, "class", "toast-component flex flex-col items-center");
    			add_location(div1, file$9, 29, 4, 1018);
    			attr_dev(div2, "class", "flex flex-col md:flex-row");
    			add_location(div2, file$9, 20, 2, 764);
    			attr_dev(p0, "id", "code");
    			attr_dev(p0, "class", "space-5 mt-5");
    			add_location(p0, file$9, 34, 2, 1204);
    			attr_dev(p1, "id", "slots");
    			attr_dev(p1, "class", "mt-5");
    			add_location(p1, file$9, 69, 2, 2089);
    			attr_dev(h32, "id", "icon-slot");
    			attr_dev(h32, "class", "text-xl mt-3");
    			add_location(h32, file$9, 78, 2, 2297);
    			attr_dev(p2, "class", "my-4");
    			add_location(p2, file$9, 79, 2, 2354);
    			attr_dev(h33, "id", "extra-clot");
    			attr_dev(h33, "class", "text-xl mt-3");
    			add_location(h33, file$9, 97, 2, 2925);
    			attr_dev(p3, "class", "my-4");
    			add_location(p3, file$9, 98, 2, 2984);
    			attr_dev(h34, "id", "close-icon-slot");
    			attr_dev(h34, "class", "text-xl mt-3");
    			add_location(h34, file$9, 114, 2, 3328);
    			attr_dev(p4, "class", "my-4");
    			add_location(p4, file$9, 115, 2, 3397);
    			attr_dev(div3, "class", "p-5 mb-20");
    			add_location(div3, file$9, 18, 0, 682);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, meta0);
    			append_dev(document.head, meta1);
    			append_dev(document.head, meta2);
    			append_dev(document.head, meta3);
    			append_dev(document.head, meta4);
    			append_dev(document.head, meta5);
    			append_dev(document.head, meta6);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div3, anchor);
    			append_dev(div3, h1);
    			append_dev(div3, t2);
    			append_dev(div3, div2);
    			append_dev(div2, div0);
    			append_dev(div0, h30);
    			append_dev(div0, t4);
    			append_dev(div0, img0);
    			append_dev(div2, t5);
    			append_dev(div2, div1);
    			append_dev(div1, h31);
    			append_dev(div1, t7);
    			append_dev(div1, img1);
    			append_dev(div3, t8);
    			append_dev(div3, p0);
    			append_dev(p0, t9);
    			mount_component(link, p0, null);
    			append_dev(p0, t10);
    			append_dev(div3, t11);
    			mount_component(code0, div3, null);
    			append_dev(div3, t12);
    			mount_component(code1, div3, null);
    			append_dev(div3, t13);
    			mount_component(code2, div3, null);
    			append_dev(div3, t14);
    			append_dev(div3, p1);
    			append_dev(div3, t16);
    			mount_component(code3, div3, null);
    			append_dev(div3, t17);
    			append_dev(div3, h32);
    			append_dev(div3, t19);
    			append_dev(div3, p2);
    			append_dev(div3, t21);
    			mount_component(code4, div3, null);
    			append_dev(div3, t22);
    			append_dev(div3, h33);
    			append_dev(div3, t24);
    			append_dev(div3, p3);
    			append_dev(div3, t26);
    			mount_component(code5, div3, null);
    			append_dev(div3, t27);
    			append_dev(div3, h34);
    			append_dev(div3, t29);
    			append_dev(div3, p4);
    			append_dev(div3, t31);
    			mount_component(code6, div3, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			transition_in(code0.$$.fragment, local);
    			transition_in(code1.$$.fragment, local);
    			transition_in(code2.$$.fragment, local);
    			transition_in(code3.$$.fragment, local);
    			transition_in(code4.$$.fragment, local);
    			transition_in(code5.$$.fragment, local);
    			transition_in(code6.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			transition_out(code0.$$.fragment, local);
    			transition_out(code1.$$.fragment, local);
    			transition_out(code2.$$.fragment, local);
    			transition_out(code3.$$.fragment, local);
    			transition_out(code4.$$.fragment, local);
    			transition_out(code5.$$.fragment, local);
    			transition_out(code6.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(meta0);
    			detach_dev(meta1);
    			detach_dev(meta2);
    			detach_dev(meta3);
    			detach_dev(meta4);
    			detach_dev(meta5);
    			detach_dev(meta6);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div3);
    			destroy_component(link);
    			destroy_component(code0);
    			destroy_component(code1);
    			destroy_component(code2);
    			destroy_component(code3);
    			destroy_component(code4);
    			destroy_component(code5);
    			destroy_component(code6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$b.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$b($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("FlatToastDocs", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<FlatToastDocs> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link, Code, Table });
    	return [];
    }

    class FlatToastDocs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$b, create_fragment$b, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "FlatToastDocs",
    			options,
    			id: create_fragment$b.name
    		});
    	}
    }

    /* src/components/Link.svelte generated by Svelte v3.35.0 */

    // (6:0) <Link  {to}  on:click  class="{$$restProps.class} {$location.pathname === to ? activeClass : ''}"  >
    function create_default_slot$8(ctx) {
    	let current;
    	const default_slot_template = /*#slots*/ ctx[5].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[7], null);

    	const block = {
    		c: function create() {
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 128) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[7], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$8.name,
    		type: "slot",
    		source: "(6:0) <Link  {to}  on:click  class=\\\"{$$restProps.class} {$location.pathname === to ? activeClass : ''}\\\"  >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$a(ctx) {
    	let link;
    	let current;

    	link = new Link({
    			props: {
    				to: /*to*/ ctx[0],
    				class: "" + (/*$$restProps*/ ctx[4].class + " " + (/*$location*/ ctx[2].pathname === /*to*/ ctx[0]
    				? /*activeClass*/ ctx[1]
    				: "")),
    				$$slots: { default: [create_default_slot$8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link.$on("click", /*click_handler*/ ctx[6]);

    	const block = {
    		c: function create() {
    			create_component(link.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(link, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link_changes = {};
    			if (dirty & /*to*/ 1) link_changes.to = /*to*/ ctx[0];

    			if (dirty & /*$$restProps, $location, to, activeClass*/ 23) link_changes.class = "" + (/*$$restProps*/ ctx[4].class + " " + (/*$location*/ ctx[2].pathname === /*to*/ ctx[0]
    			? /*activeClass*/ ctx[1]
    			: ""));

    			if (dirty & /*$$scope*/ 128) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(link, detaching);
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
    	const omit_props_names = ["to","activeClass"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Link", slots, ['default']);
    	var location = useLocation();
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(2, $location = value));
    	var { to } = $$props;
    	var { activeClass = "" } = $$props;

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(4, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("to" in $$new_props) $$invalidate(0, to = $$new_props.to);
    		if ("activeClass" in $$new_props) $$invalidate(1, activeClass = $$new_props.activeClass);
    		if ("$$scope" in $$new_props) $$invalidate(7, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Link,
    		useLocation,
    		location,
    		to,
    		activeClass,
    		$location
    	});

    	$$self.$inject_state = $$new_props => {
    		if ("location" in $$props) $$invalidate(3, location = $$new_props.location);
    		if ("to" in $$props) $$invalidate(0, to = $$new_props.to);
    		if ("activeClass" in $$props) $$invalidate(1, activeClass = $$new_props.activeClass);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		to,
    		activeClass,
    		$location,
    		location,
    		$$restProps,
    		slots,
    		click_handler,
    		$$scope
    	];
    }

    class Link_1 extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$a, create_fragment$a, safe_not_equal, { to: 0, activeClass: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Link_1",
    			options,
    			id: create_fragment$a.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*to*/ ctx[0] === undefined && !("to" in props)) {
    			console.warn("<Link> was created without expected prop 'to'");
    		}
    	}

    	get to() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get activeClass() {
    		throw new Error("<Link>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set activeClass(value) {
    		throw new Error("<Link>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/MenuItem.svelte generated by Svelte v3.35.0 */
    const file$8 = "src/components/MenuItem.svelte";
    const get_icon_slot_changes = dirty => ({});
    const get_icon_slot_context = ctx => ({});

    // (16:1) <Link class="link" {to}>
    function create_default_slot$7(ctx) {
    	let t;
    	let current;
    	const icon_slot_template = /*#slots*/ ctx[6].icon;
    	const icon_slot = create_slot(icon_slot_template, ctx, /*$$scope*/ ctx[8], get_icon_slot_context);
    	const default_slot_template = /*#slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[8], null);

    	const block = {
    		c: function create() {
    			if (icon_slot) icon_slot.c();
    			t = space();
    			if (default_slot) default_slot.c();
    		},
    		m: function mount(target, anchor) {
    			if (icon_slot) {
    				icon_slot.m(target, anchor);
    			}

    			insert_dev(target, t, anchor);

    			if (default_slot) {
    				default_slot.m(target, anchor);
    			}

    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (icon_slot) {
    				if (icon_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(icon_slot, icon_slot_template, ctx, /*$$scope*/ ctx[8], dirty, get_icon_slot_changes, get_icon_slot_context);
    				}
    			}

    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 256) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[8], dirty, null, null);
    				}
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(icon_slot, local);
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(icon_slot, local);
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (icon_slot) icon_slot.d(detaching);
    			if (detaching) detach_dev(t);
    			if (default_slot) default_slot.d(detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$7.name,
    		type: "slot",
    		source: "(16:1) <Link class=\\\"link\\\" {to}>",
    		ctx
    	});

    	return block;
    }

    // (20:1) {#if $location.pathname === to}
    function create_if_block$2(ctx) {
    	let div;
    	let div_intro;
    	let div_outro;
    	let current;

    	const block = {
    		c: function create() {
    			div = element("div");
    			attr_dev(div, "class", "absolute w-1 h-full right-0 top-0 bg-gray-500");
    			add_location(div, file$8, 20, 2, 577);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;

    			add_render_callback(() => {
    				if (div_outro) div_outro.end(1);
    				if (!div_intro) div_intro = create_in_transition(div, /*receive*/ ctx[1], { key: "selection" });
    				div_intro.start();
    			});

    			current = true;
    		},
    		o: function outro(local) {
    			if (div_intro) div_intro.invalidate();
    			div_outro = create_out_transition(div, /*send*/ ctx[0], { key: "selection" });
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (detaching && div_outro) div_outro.end();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$2.name,
    		type: "if",
    		source: "(20:1) {#if $location.pathname === to}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$9(ctx) {
    	let li;
    	let link;
    	let t;
    	let li_class_value;
    	let current;
    	let mounted;
    	let dispose;

    	link = new Link_1({
    			props: {
    				class: "link",
    				to: /*to*/ ctx[2],
    				$$slots: { default: [create_default_slot$7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block = /*$location*/ ctx[3].pathname === /*to*/ ctx[2] && create_if_block$2(ctx);

    	const block = {
    		c: function create() {
    			li = element("li");
    			create_component(link.$$.fragment);
    			t = space();
    			if (if_block) if_block.c();

    			attr_dev(li, "class", li_class_value = "relative block p-4 text-grey-darker font-semibold border-gray-700 hover:border-r-4 hover:border-gray-700 hover:bg-gray-100 shadow-sm cursor-pointer " + (/*$location*/ ctx[3].pathname === /*to*/ ctx[2]
    			? "bg-gray-100"
    			: "") + " svelte-n1e92e");

    			add_location(li, file$8, 8, 0, 225);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			mount_component(link, li, null);
    			append_dev(li, t);
    			if (if_block) if_block.m(li, null);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(li, "click", /*click_handler*/ ctx[7], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			const link_changes = {};
    			if (dirty & /*to*/ 4) link_changes.to = /*to*/ ctx[2];

    			if (dirty & /*$$scope*/ 256) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);

    			if (/*$location*/ ctx[3].pathname === /*to*/ ctx[2]) {
    				if (if_block) {
    					if (dirty & /*$location, to*/ 12) {
    						transition_in(if_block, 1);
    					}
    				} else {
    					if_block = create_if_block$2(ctx);
    					if_block.c();
    					transition_in(if_block, 1);
    					if_block.m(li, null);
    				}
    			} else if (if_block) {
    				group_outros();

    				transition_out(if_block, 1, 1, () => {
    					if_block = null;
    				});

    				check_outros();
    			}

    			if (!current || dirty & /*$location, to*/ 12 && li_class_value !== (li_class_value = "relative block p-4 text-grey-darker font-semibold border-gray-700 hover:border-r-4 hover:border-gray-700 hover:bg-gray-100 shadow-sm cursor-pointer " + (/*$location*/ ctx[3].pathname === /*to*/ ctx[2]
    			? "bg-gray-100"
    			: "") + " svelte-n1e92e")) {
    				attr_dev(li, "class", li_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			transition_in(if_block);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			transition_out(if_block);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);
    			destroy_component(link);
    			if (if_block) if_block.d();
    			mounted = false;
    			dispose();
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
    	let $location;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("MenuItem", slots, ['icon','default']);
    	var location = useLocation();
    	validate_store(location, "location");
    	component_subscribe($$self, location, value => $$invalidate(3, $location = value));
    	var navigate = useNavigate();
    	var { send } = $$props;
    	var { receive } = $$props;
    	var { to } = $$props;
    	const writable_props = ["send", "receive", "to"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<MenuItem> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => navigate(to);

    	$$self.$$set = $$props => {
    		if ("send" in $$props) $$invalidate(0, send = $$props.send);
    		if ("receive" in $$props) $$invalidate(1, receive = $$props.receive);
    		if ("to" in $$props) $$invalidate(2, to = $$props.to);
    		if ("$$scope" in $$props) $$invalidate(8, $$scope = $$props.$$scope);
    	};

    	$$self.$capture_state = () => ({
    		Link: Link_1,
    		useLocation,
    		useNavigate,
    		location,
    		navigate,
    		send,
    		receive,
    		to,
    		$location
    	});

    	$$self.$inject_state = $$props => {
    		if ("location" in $$props) $$invalidate(4, location = $$props.location);
    		if ("navigate" in $$props) $$invalidate(5, navigate = $$props.navigate);
    		if ("send" in $$props) $$invalidate(0, send = $$props.send);
    		if ("receive" in $$props) $$invalidate(1, receive = $$props.receive);
    		if ("to" in $$props) $$invalidate(2, to = $$props.to);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		send,
    		receive,
    		to,
    		$location,
    		location,
    		navigate,
    		slots,
    		click_handler,
    		$$scope
    	];
    }

    class MenuItem extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$9, create_fragment$9, safe_not_equal, { send: 0, receive: 1, to: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "MenuItem",
    			options,
    			id: create_fragment$9.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || {};

    		if (/*send*/ ctx[0] === undefined && !("send" in props)) {
    			console.warn("<MenuItem> was created without expected prop 'send'");
    		}

    		if (/*receive*/ ctx[1] === undefined && !("receive" in props)) {
    			console.warn("<MenuItem> was created without expected prop 'receive'");
    		}

    		if (/*to*/ ctx[2] === undefined && !("to" in props)) {
    			console.warn("<MenuItem> was created without expected prop 'to'");
    		}
    	}

    	get send() {
    		throw new Error("<MenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set send(value) {
    		throw new Error("<MenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get receive() {
    		throw new Error("<MenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set receive(value) {
    		throw new Error("<MenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	get to() {
    		throw new Error("<MenuItem>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set to(value) {
    		throw new Error("<MenuItem>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Sidebar.svelte generated by Svelte v3.35.0 */
    const file$7 = "src/components/Sidebar.svelte";

    // (33:6) <MenuItem to="/" {send} {receive}>
    function create_default_slot_6$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Demo");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6$1.name,
    		type: "slot",
    		source: "(33:6) <MenuItem to=\\\"/\\\" {send} {receive}>",
    		ctx
    	});

    	return block;
    }

    // (39:6) <MenuItem to="/store" {send} {receive}>
    function create_default_slot_5$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Store");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5$1.name,
    		type: "slot",
    		source: "(39:6) <MenuItem to=\\\"/store\\\" {send} {receive}>",
    		ctx
    	});

    	return block;
    }

    // (45:6) <MenuItem to="/toast-container" {send} {receive}>
    function create_default_slot_4$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("ToastContainer");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4$1.name,
    		type: "slot",
    		source: "(45:6) <MenuItem to=\\\"/toast-container\\\" {send} {receive}>",
    		ctx
    	});

    	return block;
    }

    // (46:6) <MenuItem to="/toast" {send} {receive}>
    function create_default_slot_3$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Toast");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3$1.name,
    		type: "slot",
    		source: "(46:6) <MenuItem to=\\\"/toast\\\" {send} {receive}>",
    		ctx
    	});

    	return block;
    }

    // (47:6) <MenuItem to="/flat-toast" {send} {receive}>
    function create_default_slot_2$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("FlatToast");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$2.name,
    		type: "slot",
    		source: "(47:6) <MenuItem to=\\\"/flat-toast\\\" {send} {receive}>",
    		ctx
    	});

    	return block;
    }

    // (48:6) <MenuItem to="/bootstrap-toast" {send} {receive}>
    function create_default_slot_1$5(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("BootstrapToast");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$5.name,
    		type: "slot",
    		source: "(48:6) <MenuItem to=\\\"/bootstrap-toast\\\" {send} {receive}>",
    		ctx
    	});

    	return block;
    }

    // (49:6) <MenuItem to="/custom-toast" {send} {receive}>
    function create_default_slot$6(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Custom Toast");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$6.name,
    		type: "slot",
    		source: "(49:6) <MenuItem to=\\\"/custom-toast\\\" {send} {receive}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$8(ctx) {
    	let aside;
    	let div;
    	let ul;
    	let menuitem0;
    	let t0;
    	let menuitem1;
    	let t1;
    	let menuitem2;
    	let t2;
    	let menuitem3;
    	let t3;
    	let menuitem4;
    	let t4;
    	let menuitem5;
    	let t5;
    	let menuitem6;
    	let current;

    	menuitem0 = new MenuItem({
    			props: {
    				to: "/",
    				send: /*send*/ ctx[1],
    				receive: /*receive*/ ctx[2],
    				$$slots: { default: [create_default_slot_6$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	menuitem1 = new MenuItem({
    			props: {
    				to: "/store",
    				send: /*send*/ ctx[1],
    				receive: /*receive*/ ctx[2],
    				$$slots: { default: [create_default_slot_5$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	menuitem2 = new MenuItem({
    			props: {
    				to: "/toast-container",
    				send: /*send*/ ctx[1],
    				receive: /*receive*/ ctx[2],
    				$$slots: { default: [create_default_slot_4$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	menuitem3 = new MenuItem({
    			props: {
    				to: "/toast",
    				send: /*send*/ ctx[1],
    				receive: /*receive*/ ctx[2],
    				$$slots: { default: [create_default_slot_3$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	menuitem4 = new MenuItem({
    			props: {
    				to: "/flat-toast",
    				send: /*send*/ ctx[1],
    				receive: /*receive*/ ctx[2],
    				$$slots: { default: [create_default_slot_2$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	menuitem5 = new MenuItem({
    			props: {
    				to: "/bootstrap-toast",
    				send: /*send*/ ctx[1],
    				receive: /*receive*/ ctx[2],
    				$$slots: { default: [create_default_slot_1$5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	menuitem6 = new MenuItem({
    			props: {
    				to: "/custom-toast",
    				send: /*send*/ ctx[1],
    				receive: /*receive*/ ctx[2],
    				$$slots: { default: [create_default_slot$6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			aside = element("aside");
    			div = element("div");
    			ul = element("ul");
    			create_component(menuitem0.$$.fragment);
    			t0 = space();
    			create_component(menuitem1.$$.fragment);
    			t1 = space();
    			create_component(menuitem2.$$.fragment);
    			t2 = space();
    			create_component(menuitem3.$$.fragment);
    			t3 = space();
    			create_component(menuitem4.$$.fragment);
    			t4 = space();
    			create_component(menuitem5.$$.fragment);
    			t5 = space();
    			create_component(menuitem6.$$.fragment);
    			attr_dev(ul, "class", "list-reset w-full");
    			add_location(ul, file$7, 31, 4, 860);
    			attr_dev(div, "class", "mt-10 bg-white shadow w-full my-2 overflow-hidden");
    			add_location(div, file$7, 30, 2, 792);
    			attr_dev(aside, "class", "border-r-2 border-gray-200 p-0 h-screen pt-3 svelte-pgt55k");
    			set_style(aside, "width", /*$width*/ ctx[0] * 250 + "px");
    			add_location(aside, file$7, 26, 0, 691);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, aside, anchor);
    			append_dev(aside, div);
    			append_dev(div, ul);
    			mount_component(menuitem0, ul, null);
    			append_dev(ul, t0);
    			mount_component(menuitem1, ul, null);
    			append_dev(ul, t1);
    			mount_component(menuitem2, ul, null);
    			append_dev(ul, t2);
    			mount_component(menuitem3, ul, null);
    			append_dev(ul, t3);
    			mount_component(menuitem4, ul, null);
    			append_dev(ul, t4);
    			mount_component(menuitem5, ul, null);
    			append_dev(ul, t5);
    			mount_component(menuitem6, ul, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const menuitem0_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				menuitem0_changes.$$scope = { dirty, ctx };
    			}

    			menuitem0.$set(menuitem0_changes);
    			const menuitem1_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				menuitem1_changes.$$scope = { dirty, ctx };
    			}

    			menuitem1.$set(menuitem1_changes);
    			const menuitem2_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				menuitem2_changes.$$scope = { dirty, ctx };
    			}

    			menuitem2.$set(menuitem2_changes);
    			const menuitem3_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				menuitem3_changes.$$scope = { dirty, ctx };
    			}

    			menuitem3.$set(menuitem3_changes);
    			const menuitem4_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				menuitem4_changes.$$scope = { dirty, ctx };
    			}

    			menuitem4.$set(menuitem4_changes);
    			const menuitem5_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				menuitem5_changes.$$scope = { dirty, ctx };
    			}

    			menuitem5.$set(menuitem5_changes);
    			const menuitem6_changes = {};

    			if (dirty & /*$$scope*/ 32) {
    				menuitem6_changes.$$scope = { dirty, ctx };
    			}

    			menuitem6.$set(menuitem6_changes);

    			if (!current || dirty & /*$width*/ 1) {
    				set_style(aside, "width", /*$width*/ ctx[0] * 250 + "px");
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(menuitem0.$$.fragment, local);
    			transition_in(menuitem1.$$.fragment, local);
    			transition_in(menuitem2.$$.fragment, local);
    			transition_in(menuitem3.$$.fragment, local);
    			transition_in(menuitem4.$$.fragment, local);
    			transition_in(menuitem5.$$.fragment, local);
    			transition_in(menuitem6.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(menuitem0.$$.fragment, local);
    			transition_out(menuitem1.$$.fragment, local);
    			transition_out(menuitem2.$$.fragment, local);
    			transition_out(menuitem3.$$.fragment, local);
    			transition_out(menuitem4.$$.fragment, local);
    			transition_out(menuitem5.$$.fragment, local);
    			transition_out(menuitem6.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(aside);
    			destroy_component(menuitem0);
    			destroy_component(menuitem1);
    			destroy_component(menuitem2);
    			destroy_component(menuitem3);
    			destroy_component(menuitem4);
    			destroy_component(menuitem5);
    			destroy_component(menuitem6);
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
    	let $width;
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Sidebar", slots, []);
    	var { open = true } = $$props;

    	var [send, receive] = crossfade({
    		duration: d => Math.sqrt(d * 200), // fallback(node, params) {
    		
    	}); //   console.log('🚀 ~ file: Sidebar.svelte ~ line 10 ~ fallback ~ style', style)
    	//   const transform = style.transform === 'none' ? '' : style.transform;
    	//   return {
    	//     duration: 6000,

    	//     easing: linear,
    	//     css: (t) => `
    	// 			transform: translateY(${t * 50});
    	// 		`,
    	//   };
    	// },
    	var width = tweened(open ? 1 : 0, { duration: 200 });

    	validate_store(width, "width");
    	component_subscribe($$self, width, value => $$invalidate(0, $width = value));
    	const writable_props = ["open"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Sidebar> was created with unknown prop '${key}'`);
    	});

    	$$self.$$set = $$props => {
    		if ("open" in $$props) $$invalidate(4, open = $$props.open);
    	};

    	$$self.$capture_state = () => ({
    		tweened,
    		MenuItem,
    		crossfade,
    		fade,
    		open,
    		send,
    		receive,
    		width,
    		$width
    	});

    	$$self.$inject_state = $$props => {
    		if ("open" in $$props) $$invalidate(4, open = $$props.open);
    		if ("send" in $$props) $$invalidate(1, send = $$props.send);
    		if ("receive" in $$props) $$invalidate(2, receive = $$props.receive);
    		if ("width" in $$props) $$invalidate(3, width = $$props.width);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*open*/ 16) {
    			{
    				width.set(open ? 1 : 0);
    			}
    		}
    	};

    	return [$width, send, receive, width, open];
    }

    class Sidebar extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$8, create_fragment$8, safe_not_equal, { open: 4 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Sidebar",
    			options,
    			id: create_fragment$8.name
    		});
    	}

    	get open() {
    		throw new Error("<Sidebar>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set open(value) {
    		throw new Error("<Sidebar>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/components/Tailwind.svelte generated by Svelte v3.35.0 */

    function create_fragment$7(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
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

    function instance$7($$self, $$props) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Tailwind", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<Tailwind> was created with unknown prop '${key}'`);
    	});

    	return [];
    }

    class Tailwind extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$7, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Tailwind",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    /* src/components/Button.svelte generated by Svelte v3.35.0 */
    const file$6 = "src/components/Button.svelte";

    function create_fragment$6(ctx) {
    	let button_1;
    	let button_1_class_value;
    	let current;
    	let mounted;
    	let dispose;
    	const default_slot_template = /*#slots*/ ctx[4].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[3], null);

    	const block = {
    		c: function create() {
    			button_1 = element("button");
    			if (default_slot) default_slot.c();
    			attr_dev(button_1, "class", button_1_class_value = "ring ring-blue-600 focus:ring-offset-1 ring-offset-blue-100 h-8 px-4 bg-blue-600 focus:bg-blue-600 border-0 focus:outline-none text-white " + /*$$restProps*/ ctx[1].class);
    			add_location(button_1, file$6, 11, 0, 195);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button_1, anchor);

    			if (default_slot) {
    				default_slot.m(button_1, null);
    			}

    			/*button_1_binding*/ ctx[6](button_1);
    			current = true;

    			if (!mounted) {
    				dispose = listen_dev(button_1, "click", /*click_handler*/ ctx[5], false, false, false);
    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (default_slot) {
    				if (default_slot.p && dirty & /*$$scope*/ 8) {
    					update_slot(default_slot, default_slot_template, ctx, /*$$scope*/ ctx[3], dirty, null, null);
    				}
    			}

    			if (!current || dirty & /*$$restProps*/ 2 && button_1_class_value !== (button_1_class_value = "ring ring-blue-600 focus:ring-offset-1 ring-offset-blue-100 h-8 px-4 bg-blue-600 focus:bg-blue-600 border-0 focus:outline-none text-white " + /*$$restProps*/ ctx[1].class)) {
    				attr_dev(button_1, "class", button_1_class_value);
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button_1);
    			if (default_slot) default_slot.d(detaching);
    			/*button_1_binding*/ ctx[6](null);
    			mounted = false;
    			dispose();
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
    	const omit_props_names = ["autoFocus"];
    	let $$restProps = compute_rest_props($$props, omit_props_names);
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Button", slots, ['default']);
    	var button;
    	var { autoFocus = false } = $$props;

    	onMount(() => {
    		if (autoFocus) {
    			setTimeout(
    				() => {
    					button.focus();
    				},
    				100
    			);
    		}
    	});

    	function click_handler(event) {
    		bubble($$self, event);
    	}

    	function button_1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			button = $$value;
    			$$invalidate(0, button);
    		});
    	}

    	$$self.$$set = $$new_props => {
    		$$props = assign(assign({}, $$props), exclude_internal_props($$new_props));
    		$$invalidate(1, $$restProps = compute_rest_props($$props, omit_props_names));
    		if ("autoFocus" in $$new_props) $$invalidate(2, autoFocus = $$new_props.autoFocus);
    		if ("$$scope" in $$new_props) $$invalidate(3, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => ({ onMount, button, autoFocus });

    	$$self.$inject_state = $$new_props => {
    		if ("button" in $$props) $$invalidate(0, button = $$new_props.button);
    		if ("autoFocus" in $$props) $$invalidate(2, autoFocus = $$new_props.autoFocus);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [
    		button,
    		$$restProps,
    		autoFocus,
    		$$scope,
    		slots,
    		click_handler,
    		button_1_binding
    	];
    }

    class Button extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$6, create_fragment$6, safe_not_equal, { autoFocus: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Button",
    			options,
    			id: create_fragment$6.name
    		});
    	}

    	get autoFocus() {
    		throw new Error("<Button>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set autoFocus(value) {
    		throw new Error("<Button>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/pages/Demo.svelte generated by Svelte v3.35.0 */

    const { console: console_1 } = globals;
    const file$5 = "src/pages/Demo.svelte";

    // (92:10) <Button autoFocus on:click={addToast}>
    function create_default_slot_1$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("Show Toast");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$4.name,
    		type: "slot",
    		source: "(92:10) <Button autoFocus on:click={addToast}>",
    		ctx
    	});

    	return block;
    }

    // (297:4) {:else}
    function create_else_block$1(ctx) {
    	let flattoast;
    	let current;

    	flattoast = new FlatToast({
    			props: { data: /*data*/ ctx[33] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(flattoast.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(flattoast, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const flattoast_changes = {};
    			if (dirty[1] & /*data*/ 4) flattoast_changes.data = /*data*/ ctx[33];
    			flattoast.$set(flattoast_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flattoast.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flattoast.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(flattoast, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block$1.name,
    		type: "else",
    		source: "(297:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (295:4) {#if toastType === 'bootstrap'}
    function create_if_block$1(ctx) {
    	let bootstraptoast;
    	let current;

    	bootstraptoast = new BootstrapToast({
    			props: { data: /*data*/ ctx[33] },
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(bootstraptoast.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(bootstraptoast, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const bootstraptoast_changes = {};
    			if (dirty[1] & /*data*/ 4) bootstraptoast_changes.data = /*data*/ ctx[33];
    			bootstraptoast.$set(bootstraptoast_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bootstraptoast.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bootstraptoast.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(bootstraptoast, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(295:4) {#if toastType === 'bootstrap'}",
    		ctx
    	});

    	return block;
    }

    // (294:2) <ToastContainer placement="bottom-right" let:data>
    function create_default_slot$5(ctx) {
    	let current_block_type_index;
    	let if_block;
    	let if_block_anchor;
    	let current;
    	const if_block_creators = [create_if_block$1, create_else_block$1];
    	const if_blocks = [];

    	function select_block_type(ctx, dirty) {
    		if (/*toastType*/ ctx[7] === "bootstrap") return 0;
    		return 1;
    	}

    	current_block_type_index = select_block_type(ctx);
    	if_block = if_blocks[current_block_type_index] = if_block_creators[current_block_type_index](ctx);

    	const block = {
    		c: function create() {
    			if_block.c();
    			if_block_anchor = empty();
    		},
    		m: function mount(target, anchor) {
    			if_blocks[current_block_type_index].m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
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
    		id: create_default_slot$5.name,
    		type: "slot",
    		source: "(294:2) <ToastContainer placement=\\\"bottom-right\\\" let:data>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div20;
    	let div19;
    	let h1;
    	let t1;
    	let div18;
    	let div1;
    	let label0;
    	let span0;
    	let t3;
    	let input0;
    	let t4;
    	let label1;
    	let span1;
    	let t6;
    	let textarea;
    	let t7;
    	let label2;
    	let span2;
    	let t9;
    	let input1;
    	let t10;
    	let div0;
    	let button0;
    	let t11;
    	let button1;
    	let t13;
    	let button2;
    	let t15;
    	let div17;
    	let div4;
    	let div3;
    	let span3;
    	let t17;
    	let div2;
    	let label3;
    	let input2;
    	let t18;
    	let span4;
    	let t20;
    	let label4;
    	let input3;
    	let t21;
    	let span5;
    	let t23;
    	let div7;
    	let div6;
    	let span6;
    	let t25;
    	let div5;
    	let label5;
    	let input4;
    	let t26;
    	let span7;
    	let t28;
    	let label6;
    	let input5;
    	let t29;
    	let span8;
    	let t31;
    	let div10;
    	let div9;
    	let span9;
    	let t33;
    	let div8;
    	let label7;
    	let input6;
    	let t34;
    	let span10;
    	let t36;
    	let label8;
    	let input7;
    	let t37;
    	let span11;
    	let t39;
    	let label9;
    	let input8;
    	let t40;
    	let span12;
    	let t42;
    	let label10;
    	let input9;
    	let t43;
    	let span13;
    	let t45;
    	let label11;
    	let input10;
    	let t46;
    	let span14;
    	let t48;
    	let label12;
    	let input11;
    	let t49;
    	let span15;
    	let t51;
    	let label13;
    	let input12;
    	let t52;
    	let span16;
    	let t54;
    	let div13;
    	let div12;
    	let span17;
    	let t56;
    	let div11;
    	let label14;
    	let input13;
    	let t57;
    	let span18;
    	let t59;
    	let label15;
    	let input14;
    	let t60;
    	let span19;
    	let t62;
    	let label16;
    	let input15;
    	let t63;
    	let span20;
    	let t65;
    	let label17;
    	let input16;
    	let t66;
    	let span21;
    	let t68;
    	let div16;
    	let div15;
    	let span22;
    	let t70;
    	let div14;
    	let label18;
    	let input17;
    	let t71;
    	let span23;
    	let t73;
    	let toastcontainer;
    	let current;
    	let mounted;
    	let dispose;

    	button0 = new Button({
    			props: {
    				autoFocus: true,
    				$$slots: { default: [create_default_slot_1$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	button0.$on("click", /*addToast*/ ctx[9]);

    	toastcontainer = new ToastContainer({
    			props: {
    				placement: "bottom-right",
    				$$slots: {
    					default: [
    						create_default_slot$5,
    						({ data }) => ({ 33: data }),
    						({ data }) => [0, data ? 4 : 0]
    					]
    				},
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div20 = element("div");
    			div19 = element("div");
    			h1 = element("h1");
    			h1.textContent = "Demo";
    			t1 = space();
    			div18 = element("div");
    			div1 = element("div");
    			label0 = element("label");
    			span0 = element("span");
    			span0.textContent = "Title";
    			t3 = space();
    			input0 = element("input");
    			t4 = space();
    			label1 = element("label");
    			span1 = element("span");
    			span1.textContent = "Description";
    			t6 = space();
    			textarea = element("textarea");
    			t7 = space();
    			label2 = element("label");
    			span2 = element("span");
    			span2.textContent = "Duration (seconds)";
    			t9 = space();
    			input1 = element("input");
    			t10 = space();
    			div0 = element("div");
    			create_component(button0.$$.fragment);
    			t11 = space();
    			button1 = element("button");
    			button1.textContent = "Clear All";
    			t13 = space();
    			button2 = element("button");
    			button2.textContent = "Clear Last";
    			t15 = space();
    			div17 = element("div");
    			div4 = element("div");
    			div3 = element("div");
    			span3 = element("span");
    			span3.textContent = "Toast Type / Design";
    			t17 = space();
    			div2 = element("div");
    			label3 = element("label");
    			input2 = element("input");
    			t18 = space();
    			span4 = element("span");
    			span4.textContent = "FLat";
    			t20 = space();
    			label4 = element("label");
    			input3 = element("input");
    			t21 = space();
    			span5 = element("span");
    			span5.textContent = "Bootstrap";
    			t23 = space();
    			div7 = element("div");
    			div6 = element("div");
    			span6 = element("span");
    			span6.textContent = "Theme";
    			t25 = space();
    			div5 = element("div");
    			label5 = element("label");
    			input4 = element("input");
    			t26 = space();
    			span7 = element("span");
    			span7.textContent = "Dark";
    			t28 = space();
    			label6 = element("label");
    			input5 = element("input");
    			t29 = space();
    			span8 = element("span");
    			span8.textContent = "Light";
    			t31 = space();
    			div10 = element("div");
    			div9 = element("div");
    			span9 = element("span");
    			span9.textContent = "Placement/Position";
    			t33 = space();
    			div8 = element("div");
    			label7 = element("label");
    			input6 = element("input");
    			t34 = space();
    			span10 = element("span");
    			span10.textContent = "Bottom-Right";
    			t36 = space();
    			label8 = element("label");
    			input7 = element("input");
    			t37 = space();
    			span11 = element("span");
    			span11.textContent = "Top-Right";
    			t39 = space();
    			label9 = element("label");
    			input8 = element("input");
    			t40 = space();
    			span12 = element("span");
    			span12.textContent = "Top-Left";
    			t42 = space();
    			label10 = element("label");
    			input9 = element("input");
    			t43 = space();
    			span13 = element("span");
    			span13.textContent = "Bottom-Left";
    			t45 = space();
    			label11 = element("label");
    			input10 = element("input");
    			t46 = space();
    			span14 = element("span");
    			span14.textContent = "Bottom-Center";
    			t48 = space();
    			label12 = element("label");
    			input11 = element("input");
    			t49 = space();
    			span15 = element("span");
    			span15.textContent = "Top-Center";
    			t51 = space();
    			label13 = element("label");
    			input12 = element("input");
    			t52 = space();
    			span16 = element("span");
    			span16.textContent = "Center-Center";
    			t54 = space();
    			div13 = element("div");
    			div12 = element("div");
    			span17 = element("span");
    			span17.textContent = "Type";
    			t56 = space();
    			div11 = element("div");
    			label14 = element("label");
    			input13 = element("input");
    			t57 = space();
    			span18 = element("span");
    			span18.textContent = "Success";
    			t59 = space();
    			label15 = element("label");
    			input14 = element("input");
    			t60 = space();
    			span19 = element("span");
    			span19.textContent = "Info";
    			t62 = space();
    			label16 = element("label");
    			input15 = element("input");
    			t63 = space();
    			span20 = element("span");
    			span20.textContent = "Error";
    			t65 = space();
    			label17 = element("label");
    			input16 = element("input");
    			t66 = space();
    			span21 = element("span");
    			span21.textContent = "Warning";
    			t68 = space();
    			div16 = element("div");
    			div15 = element("div");
    			span22 = element("span");
    			span22.textContent = "Show Progress (only when duration is greater than 0)";
    			t70 = space();
    			div14 = element("div");
    			label18 = element("label");
    			input17 = element("input");
    			t71 = space();
    			span23 = element("span");
    			span23.textContent = "Show Progress";
    			t73 = space();
    			create_component(toastcontainer.$$.fragment);
    			attr_dev(h1, "class", "text-3xl text-left outline-none");
    			add_location(h1, file$5, 58, 4, 1303);
    			attr_dev(span0, "class", "text-gray-800 font-bold mt-4 block");
    			add_location(span0, file$5, 62, 10, 1475);
    			attr_dev(input0, "type", "text");
    			attr_dev(input0, "class", "mt-1 block w-full");
    			attr_dev(input0, "placeholder", "");
    			add_location(input0, file$5, 63, 10, 1547);
    			attr_dev(label0, "class", "block text-left");
    			add_location(label0, file$5, 61, 8, 1433);
    			attr_dev(span1, "class", "text-gray-800 font-bold mt-4 block");
    			add_location(span1, file$5, 72, 10, 1788);
    			attr_dev(textarea, "class", "mt-1 block w-full");
    			attr_dev(textarea, "rows", "3");
    			add_location(textarea, file$5, 73, 10, 1866);
    			attr_dev(label1, "class", "block text-left");
    			add_location(label1, file$5, 71, 8, 1746);
    			attr_dev(span2, "class", "text-gray-800 font-bold mt-4 block");
    			add_location(span2, file$5, 80, 10, 2052);
    			attr_dev(input1, "type", "number");
    			attr_dev(input1, "class", "mt-1 block w-full");
    			attr_dev(input1, "placeholder", "duration in seconds");
    			add_location(input1, file$5, 83, 10, 2161);
    			attr_dev(label2, "class", "block text-left");
    			add_location(label2, file$5, 79, 8, 2010);
    			attr_dev(button1, "class", "ring ring-red-600 focus:ring-offset-1 ring-offset-red-100 h-8 px-4 bg-red-600 focus:bg-red-600 border-0 focus:outline-none text-white");
    			add_location(button1, file$5, 93, 10, 2697);
    			attr_dev(button2, "class", "ring ring-red-600 focus:ring-offset-1 ring-offset-red-100 h-8 px-4 bg-red-600 focus:bg-red-600 border-0 focus:outline-none text-white");
    			add_location(button2, file$5, 97, 10, 2938);
    			attr_dev(div0, "class", "flex space-x-4 flex-row align-center mt-4");
    			add_location(div0, file$5, 90, 8, 2350);
    			add_location(div1, file$5, 60, 6, 1419);
    			attr_dev(span3, "class", "text-gray-800 font-bold mt-4 block");
    			add_location(span3, file$5, 106, 12, 3290);
    			attr_dev(input2, "type", "radio");
    			attr_dev(input2, "name", "toast-type");
    			input2.__value = "flat";
    			input2.value = input2.__value;
    			/*$$binding_groups*/ ctx[15][0].push(input2);
    			add_location(input2, file$5, 111, 16, 3483);
    			attr_dev(span4, "class", "ml-2");
    			add_location(span4, file$5, 117, 16, 3664);
    			attr_dev(label3, "class", "inline-flex items-center");
    			add_location(label3, file$5, 110, 14, 3426);
    			attr_dev(input3, "type", "radio");
    			attr_dev(input3, "name", "toast-type");
    			input3.__value = "bootstrap";
    			input3.value = input3.__value;
    			/*$$binding_groups*/ ctx[15][0].push(input3);
    			add_location(input3, file$5, 120, 16, 3789);
    			attr_dev(span5, "class", "ml-2");
    			add_location(span5, file$5, 126, 16, 3975);
    			attr_dev(label4, "class", "inline-flex items-center");
    			add_location(label4, file$5, 119, 14, 3732);
    			add_location(div2, file$5, 109, 12, 3406);
    			attr_dev(div3, "class", "mt-2");
    			add_location(div3, file$5, 105, 10, 3259);
    			attr_dev(div4, "class", "block text-left");
    			add_location(div4, file$5, 104, 8, 3219);
    			attr_dev(span6, "class", "text-gray-800 font-bold mt-4 block");
    			add_location(span6, file$5, 133, 12, 4164);
    			attr_dev(input4, "type", "radio");
    			attr_dev(input4, "name", "theme");
    			input4.__value = "dark";
    			input4.value = input4.__value;
    			/*$$binding_groups*/ ctx[15][1].push(input4);
    			add_location(input4, file$5, 136, 16, 4315);
    			attr_dev(span7, "class", "ml-2");
    			add_location(span7, file$5, 142, 16, 4487);
    			attr_dev(label5, "class", "inline-flex items-center");
    			add_location(label5, file$5, 135, 14, 4258);
    			attr_dev(input5, "type", "radio");
    			attr_dev(input5, "name", "theme");
    			input5.__value = "light";
    			input5.value = input5.__value;
    			/*$$binding_groups*/ ctx[15][1].push(input5);
    			add_location(input5, file$5, 145, 16, 4612);
    			attr_dev(span8, "class", "ml-2");
    			add_location(span8, file$5, 151, 16, 4785);
    			attr_dev(label6, "class", "inline-flex items-center");
    			add_location(label6, file$5, 144, 14, 4555);
    			add_location(div5, file$5, 134, 12, 4238);
    			attr_dev(div6, "class", "mt-2");
    			add_location(div6, file$5, 132, 10, 4133);
    			attr_dev(div7, "class", "block text-left");
    			add_location(div7, file$5, 131, 8, 4093);
    			attr_dev(span9, "class", "text-gray-800 font-bold mt-4 block");
    			add_location(span9, file$5, 158, 12, 4970);
    			attr_dev(input6, "type", "radio");
    			attr_dev(input6, "name", "placement");
    			input6.__value = "bottom-right";
    			input6.value = input6.__value;
    			/*$$binding_groups*/ ctx[15][2].push(input6);
    			add_location(input6, file$5, 163, 16, 5162);
    			attr_dev(span10, "class", "ml-2");
    			add_location(span10, file$5, 169, 16, 5350);
    			attr_dev(label7, "class", "inline-flex items-center");
    			add_location(label7, file$5, 162, 14, 5105);
    			attr_dev(input7, "type", "radio");
    			attr_dev(input7, "name", "placement");
    			input7.__value = "top-right";
    			input7.value = input7.__value;
    			/*$$binding_groups*/ ctx[15][2].push(input7);
    			add_location(input7, file$5, 172, 16, 5483);
    			attr_dev(span11, "class", "ml-2");
    			add_location(span11, file$5, 178, 16, 5668);
    			attr_dev(label8, "class", "inline-flex items-center");
    			add_location(label8, file$5, 171, 14, 5426);
    			attr_dev(input8, "type", "radio");
    			attr_dev(input8, "name", "placement");
    			input8.__value = "top-left";
    			input8.value = input8.__value;
    			/*$$binding_groups*/ ctx[15][2].push(input8);
    			add_location(input8, file$5, 181, 16, 5798);
    			attr_dev(span12, "class", "ml-2");
    			add_location(span12, file$5, 187, 16, 5982);
    			attr_dev(label9, "class", "inline-flex items-center");
    			add_location(label9, file$5, 180, 14, 5741);
    			attr_dev(input9, "type", "radio");
    			attr_dev(input9, "name", "placement");
    			input9.__value = "bottom-left";
    			input9.value = input9.__value;
    			/*$$binding_groups*/ ctx[15][2].push(input9);
    			add_location(input9, file$5, 190, 16, 6111);
    			attr_dev(span13, "class", "ml-2");
    			add_location(span13, file$5, 196, 16, 6298);
    			attr_dev(label10, "class", "inline-flex items-center");
    			add_location(label10, file$5, 189, 14, 6054);
    			attr_dev(input10, "type", "radio");
    			attr_dev(input10, "name", "placement");
    			input10.__value = "bottom-center";
    			input10.value = input10.__value;
    			/*$$binding_groups*/ ctx[15][2].push(input10);
    			add_location(input10, file$5, 199, 16, 6430);
    			attr_dev(span14, "class", "ml-2");
    			add_location(span14, file$5, 205, 16, 6619);
    			attr_dev(label11, "class", "inline-flex items-center");
    			add_location(label11, file$5, 198, 14, 6373);
    			attr_dev(input11, "type", "radio");
    			attr_dev(input11, "name", "placement");
    			input11.__value = "top-center";
    			input11.value = input11.__value;
    			/*$$binding_groups*/ ctx[15][2].push(input11);
    			add_location(input11, file$5, 208, 16, 6753);
    			attr_dev(span15, "class", "ml-2");
    			add_location(span15, file$5, 214, 16, 6939);
    			attr_dev(label12, "class", "inline-flex items-center");
    			add_location(label12, file$5, 207, 14, 6696);
    			attr_dev(input12, "type", "radio");
    			attr_dev(input12, "name", "placement");
    			input12.__value = "center-center";
    			input12.value = input12.__value;
    			/*$$binding_groups*/ ctx[15][2].push(input12);
    			add_location(input12, file$5, 217, 16, 7070);
    			attr_dev(span16, "class", "ml-2");
    			add_location(span16, file$5, 223, 16, 7259);
    			attr_dev(label13, "class", "inline-flex items-center");
    			add_location(label13, file$5, 216, 14, 7013);
    			add_location(div8, file$5, 161, 12, 5085);
    			attr_dev(div9, "class", "mt-2");
    			add_location(div9, file$5, 157, 10, 4939);
    			attr_dev(div10, "class", "block text-left");
    			add_location(div10, file$5, 156, 8, 4899);
    			attr_dev(span17, "class", "text-gray-800 font-bold mt-4 block");
    			add_location(span17, file$5, 230, 12, 7452);
    			attr_dev(input13, "type", "radio");
    			attr_dev(input13, "name", "type");
    			input13.__value = "success";
    			input13.value = input13.__value;
    			/*$$binding_groups*/ ctx[15][3].push(input13);
    			add_location(input13, file$5, 233, 16, 7602);
    			attr_dev(span18, "class", "ml-2");
    			add_location(span18, file$5, 239, 16, 7775);
    			attr_dev(label14, "class", "inline-flex items-center");
    			add_location(label14, file$5, 232, 14, 7545);
    			attr_dev(input14, "type", "radio");
    			attr_dev(input14, "name", "type");
    			input14.__value = "info";
    			input14.value = input14.__value;
    			/*$$binding_groups*/ ctx[15][3].push(input14);
    			add_location(input14, file$5, 242, 16, 7903);
    			attr_dev(span19, "class", "ml-2");
    			add_location(span19, file$5, 248, 16, 8073);
    			attr_dev(label15, "class", "inline-flex items-center");
    			add_location(label15, file$5, 241, 14, 7846);
    			attr_dev(input15, "type", "radio");
    			attr_dev(input15, "name", "type");
    			input15.__value = "error";
    			input15.value = input15.__value;
    			/*$$binding_groups*/ ctx[15][3].push(input15);
    			add_location(input15, file$5, 251, 16, 8198);
    			attr_dev(span20, "class", "ml-2");
    			add_location(span20, file$5, 257, 16, 8369);
    			attr_dev(label16, "class", "inline-flex items-center");
    			add_location(label16, file$5, 250, 14, 8141);
    			attr_dev(input16, "type", "radio");
    			attr_dev(input16, "name", "type");
    			input16.__value = "warning";
    			input16.value = input16.__value;
    			/*$$binding_groups*/ ctx[15][3].push(input16);
    			add_location(input16, file$5, 260, 16, 8495);
    			attr_dev(span21, "class", "ml-2");
    			add_location(span21, file$5, 266, 16, 8668);
    			attr_dev(label17, "class", "inline-flex items-center");
    			add_location(label17, file$5, 259, 14, 8438);
    			add_location(div11, file$5, 231, 12, 7525);
    			attr_dev(div12, "class", "mt-2");
    			add_location(div12, file$5, 229, 10, 7421);
    			attr_dev(div13, "class", "block text-left");
    			add_location(div13, file$5, 228, 8, 7381);
    			attr_dev(span22, "class", "text-gray-800 font-bold mt-4 block");
    			add_location(span22, file$5, 273, 12, 8855);
    			attr_dev(input17, "type", "checkbox");
    			attr_dev(input17, "name", "show-progress");
    			input17.__value = "flat";
    			input17.value = input17.__value;
    			add_location(input17, file$5, 278, 16, 9081);
    			attr_dev(span23, "class", "ml-2");
    			add_location(span23, file$5, 284, 16, 9273);
    			attr_dev(label18, "class", "inline-flex items-center");
    			add_location(label18, file$5, 277, 14, 9024);
    			add_location(div14, file$5, 276, 12, 9004);
    			attr_dev(div15, "class", "mt-2");
    			add_location(div15, file$5, 272, 10, 8824);
    			attr_dev(div16, "class", "block text-left");
    			add_location(div16, file$5, 271, 8, 8784);
    			add_location(div17, file$5, 103, 6, 3205);
    			attr_dev(div18, "class", "grid grid-cols-1 md:grid-cols-2 gap-6");
    			add_location(div18, file$5, 59, 4, 1361);
    			attr_dev(div19, "class", "mt-1");
    			add_location(div19, file$5, 57, 2, 1280);
    			attr_dev(div20, "class", "flex flex-col container p-4 mx-auto items-center h-auto min-h-screen");
    			add_location(div20, file$5, 54, 0, 1192);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div20, anchor);
    			append_dev(div20, div19);
    			append_dev(div19, h1);
    			append_dev(div19, t1);
    			append_dev(div19, div18);
    			append_dev(div18, div1);
    			append_dev(div1, label0);
    			append_dev(label0, span0);
    			append_dev(label0, t3);
    			append_dev(label0, input0);
    			set_input_value(input0, /*title*/ ctx[1]);
    			/*input0_binding*/ ctx[11](input0);
    			append_dev(div1, t4);
    			append_dev(div1, label1);
    			append_dev(label1, span1);
    			append_dev(label1, t6);
    			append_dev(label1, textarea);
    			set_input_value(textarea, /*description*/ ctx[2]);
    			append_dev(div1, t7);
    			append_dev(div1, label2);
    			append_dev(label2, span2);
    			append_dev(label2, t9);
    			append_dev(label2, input1);
    			set_input_value(input1, /*duration*/ ctx[3]);
    			append_dev(div1, t10);
    			append_dev(div1, div0);
    			mount_component(button0, div0, null);
    			append_dev(div0, t11);
    			append_dev(div0, button1);
    			append_dev(div0, t13);
    			append_dev(div0, button2);
    			append_dev(div18, t15);
    			append_dev(div18, div17);
    			append_dev(div17, div4);
    			append_dev(div4, div3);
    			append_dev(div3, span3);
    			append_dev(div3, t17);
    			append_dev(div3, div2);
    			append_dev(div2, label3);
    			append_dev(label3, input2);
    			input2.checked = input2.__value === /*toastType*/ ctx[7];
    			append_dev(label3, t18);
    			append_dev(label3, span4);
    			append_dev(div2, t20);
    			append_dev(div2, label4);
    			append_dev(label4, input3);
    			input3.checked = input3.__value === /*toastType*/ ctx[7];
    			append_dev(label4, t21);
    			append_dev(label4, span5);
    			append_dev(div17, t23);
    			append_dev(div17, div7);
    			append_dev(div7, div6);
    			append_dev(div6, span6);
    			append_dev(div6, t25);
    			append_dev(div6, div5);
    			append_dev(div5, label5);
    			append_dev(label5, input4);
    			input4.checked = input4.__value === /*theme*/ ctx[6];
    			append_dev(label5, t26);
    			append_dev(label5, span7);
    			append_dev(div5, t28);
    			append_dev(div5, label6);
    			append_dev(label6, input5);
    			input5.checked = input5.__value === /*theme*/ ctx[6];
    			append_dev(label6, t29);
    			append_dev(label6, span8);
    			append_dev(div17, t31);
    			append_dev(div17, div10);
    			append_dev(div10, div9);
    			append_dev(div9, span9);
    			append_dev(div9, t33);
    			append_dev(div9, div8);
    			append_dev(div8, label7);
    			append_dev(label7, input6);
    			input6.checked = input6.__value === /*placement*/ ctx[4];
    			append_dev(label7, t34);
    			append_dev(label7, span10);
    			append_dev(div8, t36);
    			append_dev(div8, label8);
    			append_dev(label8, input7);
    			input7.checked = input7.__value === /*placement*/ ctx[4];
    			append_dev(label8, t37);
    			append_dev(label8, span11);
    			append_dev(div8, t39);
    			append_dev(div8, label9);
    			append_dev(label9, input8);
    			input8.checked = input8.__value === /*placement*/ ctx[4];
    			append_dev(label9, t40);
    			append_dev(label9, span12);
    			append_dev(div8, t42);
    			append_dev(div8, label10);
    			append_dev(label10, input9);
    			input9.checked = input9.__value === /*placement*/ ctx[4];
    			append_dev(label10, t43);
    			append_dev(label10, span13);
    			append_dev(div8, t45);
    			append_dev(div8, label11);
    			append_dev(label11, input10);
    			input10.checked = input10.__value === /*placement*/ ctx[4];
    			append_dev(label11, t46);
    			append_dev(label11, span14);
    			append_dev(div8, t48);
    			append_dev(div8, label12);
    			append_dev(label12, input11);
    			input11.checked = input11.__value === /*placement*/ ctx[4];
    			append_dev(label12, t49);
    			append_dev(label12, span15);
    			append_dev(div8, t51);
    			append_dev(div8, label13);
    			append_dev(label13, input12);
    			input12.checked = input12.__value === /*placement*/ ctx[4];
    			append_dev(label13, t52);
    			append_dev(label13, span16);
    			append_dev(div17, t54);
    			append_dev(div17, div13);
    			append_dev(div13, div12);
    			append_dev(div12, span17);
    			append_dev(div12, t56);
    			append_dev(div12, div11);
    			append_dev(div11, label14);
    			append_dev(label14, input13);
    			input13.checked = input13.__value === /*type*/ ctx[5];
    			append_dev(label14, t57);
    			append_dev(label14, span18);
    			append_dev(div11, t59);
    			append_dev(div11, label15);
    			append_dev(label15, input14);
    			input14.checked = input14.__value === /*type*/ ctx[5];
    			append_dev(label15, t60);
    			append_dev(label15, span19);
    			append_dev(div11, t62);
    			append_dev(div11, label16);
    			append_dev(label16, input15);
    			input15.checked = input15.__value === /*type*/ ctx[5];
    			append_dev(label16, t63);
    			append_dev(label16, span20);
    			append_dev(div11, t65);
    			append_dev(div11, label17);
    			append_dev(label17, input16);
    			input16.checked = input16.__value === /*type*/ ctx[5];
    			append_dev(label17, t66);
    			append_dev(label17, span21);
    			append_dev(div17, t68);
    			append_dev(div17, div16);
    			append_dev(div16, div15);
    			append_dev(div15, span22);
    			append_dev(div15, t70);
    			append_dev(div15, div14);
    			append_dev(div14, label18);
    			append_dev(label18, input17);
    			input17.checked = /*showProgress*/ ctx[8];
    			append_dev(label18, t71);
    			append_dev(label18, span23);
    			append_dev(div20, t73);
    			mount_component(toastcontainer, div20, null);
    			current = true;

    			if (!mounted) {
    				dispose = [
    					listen_dev(input0, "input", /*input0_input_handler*/ ctx[10]),
    					listen_dev(textarea, "input", /*textarea_input_handler*/ ctx[12]),
    					listen_dev(input1, "input", /*input1_input_handler*/ ctx[13]),
    					listen_dev(button1, "click", toasts.clearAll, false, false, false),
    					listen_dev(button2, "click", toasts.clearLast, false, false, false),
    					listen_dev(input2, "change", /*input2_change_handler*/ ctx[14]),
    					listen_dev(input3, "change", /*input3_change_handler*/ ctx[16]),
    					listen_dev(input4, "change", /*input4_change_handler*/ ctx[17]),
    					listen_dev(input5, "change", /*input5_change_handler*/ ctx[18]),
    					listen_dev(input6, "change", /*input6_change_handler*/ ctx[19]),
    					listen_dev(input7, "change", /*input7_change_handler*/ ctx[20]),
    					listen_dev(input8, "change", /*input8_change_handler*/ ctx[21]),
    					listen_dev(input9, "change", /*input9_change_handler*/ ctx[22]),
    					listen_dev(input10, "change", /*input10_change_handler*/ ctx[23]),
    					listen_dev(input11, "change", /*input11_change_handler*/ ctx[24]),
    					listen_dev(input12, "change", /*input12_change_handler*/ ctx[25]),
    					listen_dev(input13, "change", /*input13_change_handler*/ ctx[26]),
    					listen_dev(input14, "change", /*input14_change_handler*/ ctx[27]),
    					listen_dev(input15, "change", /*input15_change_handler*/ ctx[28]),
    					listen_dev(input16, "change", /*input16_change_handler*/ ctx[29]),
    					listen_dev(input17, "change", /*input17_change_handler*/ ctx[30])
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*title*/ 2 && input0.value !== /*title*/ ctx[1]) {
    				set_input_value(input0, /*title*/ ctx[1]);
    			}

    			if (dirty[0] & /*description*/ 4) {
    				set_input_value(textarea, /*description*/ ctx[2]);
    			}

    			if (dirty[0] & /*duration*/ 8 && to_number(input1.value) !== /*duration*/ ctx[3]) {
    				set_input_value(input1, /*duration*/ ctx[3]);
    			}

    			const button0_changes = {};

    			if (dirty[1] & /*$$scope*/ 8) {
    				button0_changes.$$scope = { dirty, ctx };
    			}

    			button0.$set(button0_changes);

    			if (dirty[0] & /*toastType*/ 128) {
    				input2.checked = input2.__value === /*toastType*/ ctx[7];
    			}

    			if (dirty[0] & /*toastType*/ 128) {
    				input3.checked = input3.__value === /*toastType*/ ctx[7];
    			}

    			if (dirty[0] & /*theme*/ 64) {
    				input4.checked = input4.__value === /*theme*/ ctx[6];
    			}

    			if (dirty[0] & /*theme*/ 64) {
    				input5.checked = input5.__value === /*theme*/ ctx[6];
    			}

    			if (dirty[0] & /*placement*/ 16) {
    				input6.checked = input6.__value === /*placement*/ ctx[4];
    			}

    			if (dirty[0] & /*placement*/ 16) {
    				input7.checked = input7.__value === /*placement*/ ctx[4];
    			}

    			if (dirty[0] & /*placement*/ 16) {
    				input8.checked = input8.__value === /*placement*/ ctx[4];
    			}

    			if (dirty[0] & /*placement*/ 16) {
    				input9.checked = input9.__value === /*placement*/ ctx[4];
    			}

    			if (dirty[0] & /*placement*/ 16) {
    				input10.checked = input10.__value === /*placement*/ ctx[4];
    			}

    			if (dirty[0] & /*placement*/ 16) {
    				input11.checked = input11.__value === /*placement*/ ctx[4];
    			}

    			if (dirty[0] & /*placement*/ 16) {
    				input12.checked = input12.__value === /*placement*/ ctx[4];
    			}

    			if (dirty[0] & /*type*/ 32) {
    				input13.checked = input13.__value === /*type*/ ctx[5];
    			}

    			if (dirty[0] & /*type*/ 32) {
    				input14.checked = input14.__value === /*type*/ ctx[5];
    			}

    			if (dirty[0] & /*type*/ 32) {
    				input15.checked = input15.__value === /*type*/ ctx[5];
    			}

    			if (dirty[0] & /*type*/ 32) {
    				input16.checked = input16.__value === /*type*/ ctx[5];
    			}

    			if (dirty[0] & /*showProgress*/ 256) {
    				input17.checked = /*showProgress*/ ctx[8];
    			}

    			const toastcontainer_changes = {};

    			if (dirty[0] & /*toastType*/ 128 | dirty[1] & /*$$scope, data*/ 12) {
    				toastcontainer_changes.$$scope = { dirty, ctx };
    			}

    			toastcontainer.$set(toastcontainer_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(button0.$$.fragment, local);
    			transition_in(toastcontainer.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(button0.$$.fragment, local);
    			transition_out(toastcontainer.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div20);
    			/*input0_binding*/ ctx[11](null);
    			destroy_component(button0);
    			/*$$binding_groups*/ ctx[15][0].splice(/*$$binding_groups*/ ctx[15][0].indexOf(input2), 1);
    			/*$$binding_groups*/ ctx[15][0].splice(/*$$binding_groups*/ ctx[15][0].indexOf(input3), 1);
    			/*$$binding_groups*/ ctx[15][1].splice(/*$$binding_groups*/ ctx[15][1].indexOf(input4), 1);
    			/*$$binding_groups*/ ctx[15][1].splice(/*$$binding_groups*/ ctx[15][1].indexOf(input5), 1);
    			/*$$binding_groups*/ ctx[15][2].splice(/*$$binding_groups*/ ctx[15][2].indexOf(input6), 1);
    			/*$$binding_groups*/ ctx[15][2].splice(/*$$binding_groups*/ ctx[15][2].indexOf(input7), 1);
    			/*$$binding_groups*/ ctx[15][2].splice(/*$$binding_groups*/ ctx[15][2].indexOf(input8), 1);
    			/*$$binding_groups*/ ctx[15][2].splice(/*$$binding_groups*/ ctx[15][2].indexOf(input9), 1);
    			/*$$binding_groups*/ ctx[15][2].splice(/*$$binding_groups*/ ctx[15][2].indexOf(input10), 1);
    			/*$$binding_groups*/ ctx[15][2].splice(/*$$binding_groups*/ ctx[15][2].indexOf(input11), 1);
    			/*$$binding_groups*/ ctx[15][2].splice(/*$$binding_groups*/ ctx[15][2].indexOf(input12), 1);
    			/*$$binding_groups*/ ctx[15][3].splice(/*$$binding_groups*/ ctx[15][3].indexOf(input13), 1);
    			/*$$binding_groups*/ ctx[15][3].splice(/*$$binding_groups*/ ctx[15][3].indexOf(input14), 1);
    			/*$$binding_groups*/ ctx[15][3].splice(/*$$binding_groups*/ ctx[15][3].indexOf(input15), 1);
    			/*$$binding_groups*/ ctx[15][3].splice(/*$$binding_groups*/ ctx[15][3].indexOf(input16), 1);
    			destroy_component(toastcontainer);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("Demo", slots, []);
    	var titleNode;
    	var title = "Success";
    	var description = "Form submitted successfully!";
    	var duration = 0;
    	var placement = "bottom-right";
    	var type = "success";
    	var theme = "dark";
    	var toastType = "flat";
    	var showProgress = false;

    	var onClick = () => {
    		console.log("Toast clicked");
    	};

    	var onRemove = () => {
    		console.log("Toast removed");
    	};

    	var addToast = () => {
    		if (description.trim()) {
    			toasts.add({
    				title,
    				description,
    				duration: duration * 1000,
    				placement,
    				type,
    				theme,
    				showProgress,
    				onClick,
    				onRemove
    			}); /*component: BootstrapToast*/ // const id = setInterval(() => {
    		} // 	progress += 10;
    		// 	toast.update({ description: `Progress: ${progress}%`, type: progress === 100? 'success' : 'info'});
    	}; // 	if (progress === 100) {
    	// 		progress = -100;
    	// 		clearInterval(id)
    	// 	}

    	onDestroy(() => {
    		toasts.clearAll();
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console_1.warn(`<Demo> was created with unknown prop '${key}'`);
    	});

    	const $$binding_groups = [[], [], [], []];

    	function input0_input_handler() {
    		title = this.value;
    		$$invalidate(1, title);
    	}

    	function input0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			titleNode = $$value;
    			$$invalidate(0, titleNode);
    		});
    	}

    	function textarea_input_handler() {
    		description = this.value;
    		$$invalidate(2, description);
    	}

    	function input1_input_handler() {
    		duration = to_number(this.value);
    		$$invalidate(3, duration);
    	}

    	function input2_change_handler() {
    		toastType = this.__value;
    		$$invalidate(7, toastType);
    	}

    	function input3_change_handler() {
    		toastType = this.__value;
    		$$invalidate(7, toastType);
    	}

    	function input4_change_handler() {
    		theme = this.__value;
    		$$invalidate(6, theme);
    	}

    	function input5_change_handler() {
    		theme = this.__value;
    		$$invalidate(6, theme);
    	}

    	function input6_change_handler() {
    		placement = this.__value;
    		$$invalidate(4, placement);
    	}

    	function input7_change_handler() {
    		placement = this.__value;
    		$$invalidate(4, placement);
    	}

    	function input8_change_handler() {
    		placement = this.__value;
    		$$invalidate(4, placement);
    	}

    	function input9_change_handler() {
    		placement = this.__value;
    		$$invalidate(4, placement);
    	}

    	function input10_change_handler() {
    		placement = this.__value;
    		$$invalidate(4, placement);
    	}

    	function input11_change_handler() {
    		placement = this.__value;
    		$$invalidate(4, placement);
    	}

    	function input12_change_handler() {
    		placement = this.__value;
    		$$invalidate(4, placement);
    	}

    	function input13_change_handler() {
    		type = this.__value;
    		$$invalidate(5, type);
    	}

    	function input14_change_handler() {
    		type = this.__value;
    		$$invalidate(5, type);
    	}

    	function input15_change_handler() {
    		type = this.__value;
    		$$invalidate(5, type);
    	}

    	function input16_change_handler() {
    		type = this.__value;
    		$$invalidate(5, type);
    	}

    	function input17_change_handler() {
    		showProgress = this.checked;
    		$$invalidate(8, showProgress);
    	}

    	$$self.$capture_state = () => ({
    		onDestroy,
    		Button,
    		toasts,
    		ToastContainer,
    		FlatToast,
    		BootstrapToast,
    		titleNode,
    		title,
    		description,
    		duration,
    		placement,
    		type,
    		theme,
    		toastType,
    		showProgress,
    		onClick,
    		onRemove,
    		addToast
    	});

    	$$self.$inject_state = $$props => {
    		if ("titleNode" in $$props) $$invalidate(0, titleNode = $$props.titleNode);
    		if ("title" in $$props) $$invalidate(1, title = $$props.title);
    		if ("description" in $$props) $$invalidate(2, description = $$props.description);
    		if ("duration" in $$props) $$invalidate(3, duration = $$props.duration);
    		if ("placement" in $$props) $$invalidate(4, placement = $$props.placement);
    		if ("type" in $$props) $$invalidate(5, type = $$props.type);
    		if ("theme" in $$props) $$invalidate(6, theme = $$props.theme);
    		if ("toastType" in $$props) $$invalidate(7, toastType = $$props.toastType);
    		if ("showProgress" in $$props) $$invalidate(8, showProgress = $$props.showProgress);
    		if ("onClick" in $$props) onClick = $$props.onClick;
    		if ("onRemove" in $$props) onRemove = $$props.onRemove;
    		if ("addToast" in $$props) $$invalidate(9, addToast = $$props.addToast);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty[0] & /*titleNode*/ 1) {
    			// }, 1000);
    			if (titleNode) {
    				titleNode.focus();
    			}
    		}
    	};

    	return [
    		titleNode,
    		title,
    		description,
    		duration,
    		placement,
    		type,
    		theme,
    		toastType,
    		showProgress,
    		addToast,
    		input0_input_handler,
    		input0_binding,
    		textarea_input_handler,
    		input1_input_handler,
    		input2_change_handler,
    		$$binding_groups,
    		input3_change_handler,
    		input4_change_handler,
    		input5_change_handler,
    		input6_change_handler,
    		input7_change_handler,
    		input8_change_handler,
    		input9_change_handler,
    		input10_change_handler,
    		input11_change_handler,
    		input12_change_handler,
    		input13_change_handler,
    		input14_change_handler,
    		input15_change_handler,
    		input16_change_handler,
    		input17_change_handler
    	];
    }

    class Demo extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$5, create_fragment$5, safe_not_equal, {}, [-1, -1]);

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Demo",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/pages/StoreDocs.svelte generated by Svelte v3.35.0 */
    const file$4 = "src/pages/StoreDocs.svelte";

    // (104:80) <Link       class="text-blue-600 underline"       to="/toast-container">
    function create_default_slot_1$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("ToastContainer");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$3.name,
    		type: "slot",
    		source: "(104:80) <Link       class=\\\"text-blue-600 underline\\\"       to=\\\"/toast-container\\\">",
    		ctx
    	});

    	return block;
    }

    // (125:4) <Link class="text-blue-600 underline" to="/toast-container">
    function create_default_slot$4(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("here");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$4.name,
    		type: "slot",
    		source: "(125:4) <Link class=\\\"text-blue-600 underline\\\" to=\\\"/toast-container\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let meta0;
    	let meta1;
    	let meta2;
    	let meta3;
    	let meta4;
    	let meta5;
    	let meta6;
    	let t0;
    	let div;
    	let h1;
    	let t2;
    	let table;
    	let t3;
    	let p0;
    	let t5;
    	let code0;
    	let t6;
    	let p1;
    	let t7;
    	let b0;
    	let i;
    	let t9;
    	let b1;
    	let t11;
    	let link0;
    	let t12;
    	let t13;
    	let p2;
    	let code1;
    	let t14;
    	let p3;
    	let t15;
    	let b2;
    	let t17;
    	let link1;
    	let t18;
    	let current;

    	table = new Table({
    			props: {
    				columns: /*columns*/ ctx[0],
    				data: /*data*/ ctx[1],
    				class: "my-5"
    			},
    			$$inline: true
    		});

    	code0 = new Code({
    			props: {
    				class: "my-5",
    				code: `
    import { toasts } from 'svelte-toasts';
  
    toasts.setDefaults({
      theme: 'light',
      placement: 'top-right',
      type: 'success',
      duration: 5000
    });
  
    const toast = toasts.add({
      title: 'Alert',
      description: 'Your changes will be lost!',
      duration: 0,
    });
  
    setTimeout(() => {
      toast.remove();
      // or
      // toasts.getById(toast.uid).remove();
    }, 3000);
  
    toasts.error('Something went wrong. Try again later.');
    `
    			},
    			$$inline: true
    		});

    	link0 = new Link({
    			props: {
    				class: "text-blue-600 underline",
    				to: "/toast-container",
    				$$slots: { default: [create_default_slot_1$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	code1 = new Code({
    			props: {
    				class: "my-5",
    				code: `
      import { toasts, ToastContainer } from 'svelte-toasts';
    
      <ToastContainer {toasts} placement="top-right" let:data>
        <FlatToast {data} />
        <!-- Or you can provide your own toast component -->
        <!-- <YourOwnComponent {data} /> -->
      </ToastContainer>
      `
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				class: "text-blue-600 underline",
    				to: "/toast-container",
    				$$slots: { default: [create_default_slot$4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			meta0 = element("meta");
    			meta1 = element("meta");
    			meta2 = element("meta");
    			meta3 = element("meta");
    			meta4 = element("meta");
    			meta5 = element("meta");
    			meta6 = element("meta");
    			t0 = space();
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Toasts Store";
    			t2 = space();
    			create_component(table.$$.fragment);
    			t3 = space();
    			p0 = element("p");
    			p0.textContent = "You can import toasts store like this.";
    			t5 = space();
    			create_component(code0.$$.fragment);
    			t6 = space();
    			p1 = element("p");
    			t7 = text("Since ");
    			b0 = element("b");
    			i = element("i");
    			i.textContent = "toasts";
    			t9 = text(" is a store so you can use ");
    			b1 = element("b");
    			b1.textContent = "$";
    			t11 = text(" syntax and you\n    will get an array or toasts which you can loop through and implement how you\n    want to show your toasts but most common cases can be handled by just using ");
    			create_component(link0.$$.fragment);
    			t12 = text(" component.");
    			t13 = space();
    			p2 = element("p");
    			create_component(code1.$$.fragment);
    			t14 = space();
    			p3 = element("p");
    			t15 = text("Read more about ");
    			b2 = element("b");
    			b2.textContent = "ToastContainer";
    			t17 = space();
    			create_component(link1.$$.fragment);
    			t18 = text(".");
    			document.title = "Svelte Toasts: Store";
    			attr_dev(meta0, "name", "title");
    			attr_dev(meta0, "content", "Svelte Toasts: Store");
    			add_location(meta0, file$4, 54, 2, 1619);
    			attr_dev(meta1, "name", "description");
    			attr_dev(meta1, "content", "Svelte Toasts: Store docs");
    			add_location(meta1, file$4, 55, 2, 1674);
    			attr_dev(meta2, "name", "keywords");
    			attr_dev(meta2, "content", "svelte, svelte-toasts,toasts,bootstrap-toast,flat-toast,store-toast");
    			add_location(meta2, file$4, 56, 2, 1740);
    			attr_dev(meta3, "name", "robots");
    			attr_dev(meta3, "content", "index, follow");
    			add_location(meta3, file$4, 60, 2, 1855);
    			attr_dev(meta4, "http-equiv", "Content-Type");
    			attr_dev(meta4, "content", "text/html; charset=utf-8");
    			add_location(meta4, file$4, 61, 2, 1904);
    			attr_dev(meta5, "name", "language");
    			attr_dev(meta5, "content", "English");
    			add_location(meta5, file$4, 62, 2, 1976);
    			attr_dev(meta6, "name", "author");
    			attr_dev(meta6, "content", "Zohaib Ijaz");
    			add_location(meta6, file$4, 63, 2, 2021);
    			attr_dev(h1, "class", "text-3xl mb-5 outline-none");
    			add_location(h1, file$4, 67, 2, 2108);
    			attr_dev(p0, "class", "space-5");
    			add_location(p0, file$4, 71, 2, 2211);
    			add_location(i, file$4, 101, 13, 2832);
    			add_location(b0, file$4, 101, 10, 2829);
    			add_location(b1, file$4, 101, 57, 2876);
    			add_location(p1, file$4, 100, 2, 2815);
    			add_location(p2, file$4, 108, 2, 3180);
    			add_location(b2, file$4, 123, 20, 3565);
    			add_location(p3, file$4, 122, 2, 3541);
    			attr_dev(div, "class", "p-5 mb-20");
    			add_location(div, file$4, 66, 0, 2082);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, meta0);
    			append_dev(document.head, meta1);
    			append_dev(document.head, meta2);
    			append_dev(document.head, meta3);
    			append_dev(document.head, meta4);
    			append_dev(document.head, meta5);
    			append_dev(document.head, meta6);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t2);
    			mount_component(table, div, null);
    			append_dev(div, t3);
    			append_dev(div, p0);
    			append_dev(div, t5);
    			mount_component(code0, div, null);
    			append_dev(div, t6);
    			append_dev(div, p1);
    			append_dev(p1, t7);
    			append_dev(p1, b0);
    			append_dev(b0, i);
    			append_dev(p1, t9);
    			append_dev(p1, b1);
    			append_dev(p1, t11);
    			mount_component(link0, p1, null);
    			append_dev(p1, t12);
    			append_dev(div, t13);
    			append_dev(div, p2);
    			mount_component(code1, p2, null);
    			append_dev(div, t14);
    			append_dev(div, p3);
    			append_dev(p3, t15);
    			append_dev(p3, b2);
    			append_dev(p3, t17);
    			mount_component(link1, p3, null);
    			append_dev(p3, t18);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			transition_in(code0.$$.fragment, local);
    			transition_in(link0.$$.fragment, local);
    			transition_in(code1.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			transition_out(code0.$$.fragment, local);
    			transition_out(link0.$$.fragment, local);
    			transition_out(code1.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(meta0);
    			detach_dev(meta1);
    			detach_dev(meta2);
    			detach_dev(meta3);
    			detach_dev(meta4);
    			detach_dev(meta5);
    			detach_dev(meta6);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_component(table);
    			destroy_component(code0);
    			destroy_component(link0);
    			destroy_component(code1);
    			destroy_component(link1);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("StoreDocs", slots, []);

    	var columns = [
    		{
    			header: "Name",
    			dataIndex: "name",
    			class: "text-bold"
    		},
    		{ header: "Type", dataIndex: "type" },
    		{
    			header: "Description",
    			dataIndex: "description"
    		}
    	];

    	var data = [
    		{
    			name: "add",
    			type: "Function",
    			description: "This is key function to show toast. You can pass options and modify the generated toast. It will return toast object which you can use to modify or remove that specific toast programmatically, e.g. toast1.update({ title: 'New Title'})"
    		},
    		{
    			name: "removeAll",
    			type: "Function",
    			description: "This function removes all toasts and clears store state to empty array"
    		},
    		{
    			name: "removeLast",
    			type: "Function",
    			description: "This function removes one toast (if any) that was generated at the end"
    		},
    		{
    			name: "getById",
    			type: "Function",
    			description: "This function returns toast data for given id. Every toast has a unique uid"
    		},
    		{
    			name: "setDefaults",
    			type: "Function",
    			description: "This function sets default options so you don't need to pass those options again and again, e.g. theme, placement etc."
    		},
    		{
    			name: "success",
    			type: "Function",
    			description: "Show success/green toast."
    		},
    		{
    			name: "info",
    			type: "Function",
    			description: "Show info/blue toast."
    		},
    		{
    			name: "error",
    			type: "Function",
    			description: "Show error/red toast."
    		},
    		{
    			name: "warning",
    			type: "Function",
    			description: "Show warning/orange toast."
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<StoreDocs> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link, Code, Table, columns, data });

    	$$self.$inject_state = $$props => {
    		if ("columns" in $$props) $$invalidate(0, columns = $$props.columns);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [columns, data];
    }

    class StoreDocs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$4, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "StoreDocs",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/pages/ToastDocs.svelte generated by Svelte v3.35.0 */
    const file$3 = "src/pages/ToastDocs.svelte";

    // (116:6) <Link class="text-blue-600 underline" to="/flat-toast">
    function create_default_slot_1$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("FlatToast");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$2.name,
    		type: "slot",
    		source: "(116:6) <Link class=\\\"text-blue-600 underline\\\" to=\\\"/flat-toast\\\">",
    		ctx
    	});

    	return block;
    }

    // (119:6) <Link class="text-blue-600 underline" to="/bootstrap-toast"         >
    function create_default_slot$3(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("BootstrapToast");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$3.name,
    		type: "slot",
    		source: "(119:6) <Link class=\\\"text-blue-600 underline\\\" to=\\\"/bootstrap-toast\\\"         >",
    		ctx
    	});

    	return block;
    }

    function create_fragment$3(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let p0;
    	let t3;
    	let code0;
    	let t4;
    	let p1;
    	let t6;
    	let table;
    	let t7;
    	let p2;
    	let t9;
    	let ul;
    	let li0;
    	let link0;
    	let t10;
    	let li1;
    	let link1;
    	let t11;
    	let p3;
    	let t12;
    	let b;
    	let t14;
    	let t15;
    	let p4;
    	let code1;
    	let t16;
    	let code2;
    	let t17;
    	let code3;
    	let current;

    	code0 = new Code({
    			props: {
    				class: "my-5",
    				code: `
    {
      title: "Welcome",
      description: "Thanks for trying svelte-toasts!",
      uid: 1615153277482,
      placement: "bottom-right",
      type: "success",
      theme: "dark",
      duration: 0,
      remove: () => { /* implementation */ },
      update: () => { /* implementation */ },
      onClick: () => { console.log("Toast clicked"); }
      onRemove: () => { console.log("Toast removed"); },
      // and whatever properties that you want to add when calling toasts.add(options)
    }
  `
    			},
    			$$inline: true
    		});

    	table = new Table({
    			props: {
    				columns: /*columns*/ ctx[0],
    				data: /*data*/ ctx[1],
    				class: "my-5"
    			},
    			$$inline: true
    		});

    	link0 = new Link({
    			props: {
    				class: "text-blue-600 underline",
    				to: "/flat-toast",
    				$$slots: { default: [create_default_slot_1$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				class: "text-blue-600 underline",
    				to: "/bootstrap-toast",
    				$$slots: { default: [create_default_slot$3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	code1 = new Code({
    			props: {
    				class: "mt-5",
    				lang: "html",
    				code: ` 
  <script>`
    			},
    			$$inline: true
    		});

    	code2 = new Code({
    			props: {
    				code: `  import { toasts, ToastContainer, FlatToast }  from "svelte-toasts";
  
  const showToast = () => {
    const toast = toasts.add({
      description: 'Message body',
      component: BootstrapToast, // this will override toast component provided by ToastContainer
    });
  };
`
    			},
    			$$inline: true
    		});

    	code3 = new Code({
    			props: {
    				class: "",
    				lang: "html",
    				code: ` <script>

  <button on:click={showToast}>Show Toast</button>
  <ToastContainer {toasts} let:data={data}>
    <FlatToast {data} /> <!-- default slot as toast component -->
  </ToastContainer>
  `
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Toast";
    			t1 = space();
    			p0 = element("p");
    			p0.textContent = "A toast is shown based on a toast object in toasts store. When you call\n    toasts.add(options) then a toast object is added in toasts store which then\n    is shown by ToastContainer. A toast object looks like this.";
    			t3 = space();
    			create_component(code0.$$.fragment);
    			t4 = space();
    			p1 = element("p");
    			p1.textContent = "Below is a detail description of every property.";
    			t6 = space();
    			create_component(table.$$.fragment);
    			t7 = space();
    			p2 = element("p");
    			p2.textContent = "There are two builtin toast components in this package.";
    			t9 = space();
    			ul = element("ul");
    			li0 = element("li");
    			create_component(link0.$$.fragment);
    			t10 = space();
    			li1 = element("li");
    			create_component(link1.$$.fragment);
    			t11 = space();
    			p3 = element("p");
    			t12 = text("You can provide as default slot to ToastContainer to use that component for\n    all toasts but if you want to use a different design/template for a specific\n    toast, you can provide ");
    			b = element("b");
    			b.textContent = "component";
    			t14 = text(" property in toast options.");
    			t15 = space();
    			p4 = element("p");
    			create_component(code1.$$.fragment);
    			t16 = space();
    			create_component(code2.$$.fragment);
    			t17 = space();
    			create_component(code3.$$.fragment);
    			attr_dev(h1, "class", "text-3xl mb-5 outline-none");
    			add_location(h1, file$3, 82, 2, 2881);
    			attr_dev(p0, "class", "space-5");
    			add_location(p0, file$3, 83, 2, 2933);
    			attr_dev(p1, "class", "space-5");
    			add_location(p1, file$3, 107, 2, 3733);
    			attr_dev(p2, "class", "space-5");
    			add_location(p2, file$3, 111, 2, 3851);
    			add_location(li0, file$3, 114, 4, 3965);
    			add_location(li1, file$3, 117, 4, 4062);
    			attr_dev(ul, "class", "list-disc pl-8");
    			add_location(ul, file$3, 113, 2, 3933);
    			add_location(b, file$3, 126, 27, 4383);
    			add_location(p3, file$3, 123, 2, 4191);
    			add_location(p4, file$3, 128, 2, 4436);
    			attr_dev(div, "class", "p-5 mb-20");
    			add_location(div, file$3, 81, 0, 2855);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			append_dev(div, p0);
    			append_dev(div, t3);
    			mount_component(code0, div, null);
    			append_dev(div, t4);
    			append_dev(div, p1);
    			append_dev(div, t6);
    			mount_component(table, div, null);
    			append_dev(div, t7);
    			append_dev(div, p2);
    			append_dev(div, t9);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			mount_component(link0, li0, null);
    			append_dev(ul, t10);
    			append_dev(ul, li1);
    			mount_component(link1, li1, null);
    			append_dev(div, t11);
    			append_dev(div, p3);
    			append_dev(p3, t12);
    			append_dev(p3, b);
    			append_dev(p3, t14);
    			append_dev(div, t15);
    			append_dev(div, p4);
    			mount_component(code1, p4, null);
    			append_dev(p4, t16);
    			mount_component(code2, p4, null);
    			append_dev(p4, t17);
    			mount_component(code3, p4, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(code0.$$.fragment, local);
    			transition_in(table.$$.fragment, local);
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(code1.$$.fragment, local);
    			transition_in(code2.$$.fragment, local);
    			transition_in(code3.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(code0.$$.fragment, local);
    			transition_out(table.$$.fragment, local);
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(code1.$$.fragment, local);
    			transition_out(code2.$$.fragment, local);
    			transition_out(code3.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(code0);
    			destroy_component(table);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(code1);
    			destroy_component(code2);
    			destroy_component(code3);
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
    	validate_slots("ToastDocs", slots, []);

    	var columns = [
    		{
    			header: "Prop",
    			dataIndex: "name",
    			class: "text-bold"
    		},
    		{
    			header: "Type",
    			dataIndex: "type",
    			width: "150px"
    		},
    		{
    			header: "Default",
    			dataIndex: "default",
    			width: "150px"
    		},
    		{
    			header: "Description",
    			dataIndex: "description"
    		}
    	];

    	var data = [
    		{
    			name: "title",
    			type: "string",
    			description: "Title of toast",
    			default: "-"
    		},
    		{
    			name: "description",
    			type: "string",
    			description: "Description/body of toast",
    			default: "-"
    		},
    		{
    			name: "remove",
    			type: "Function",
    			description: "Invoking remove method will remove the respective toast object from store/UI. e.g. toast1.remove()",
    			default: "-"
    		},
    		{
    			name: "update",
    			type: "Function",
    			description: "Invoke update method to update a specific toast values like title, description or duration etc. toast.update({ title; \"Progress: 80%\" })",
    			default: "-"
    		},
    		{
    			name: "onClick",
    			type: "Function",
    			description: "You can provide onClick callback which will be invoked when toast will be clicked (except toast close icon/button)",
    			default: "() => {}"
    		},
    		{
    			name: "onRemove",
    			type: "Function",
    			description: "You can provide onRemove callback which will be invoked when toast will be auto removed or removed by clicking on cross icon/button.",
    			default: "() => {}"
    		},
    		{
    			name: "component",
    			type: "Svelte Component",
    			description: "You can provide your own toast component to render toast for a specific toast object",
    			default: "-"
    		},
    		{
    			name: "placement",
    			type: "string",
    			description: "Set placement of current toast, it will override default placement set by ToastContainer",
    			default: "-"
    		},
    		{
    			name: "showProgress",
    			type: "boolean",
    			description: "If set to \"true\" and duration is greater than 0 then a timeout progress bar will be shown at the bottom of current toast. It will override default value set by ToastContainer.",
    			default: "-"
    		},
    		{
    			name: "theme",
    			type: "string",
    			description: "\"dark\" and \"light\" themes are implemented for builtin Toast components but in case of your own Toast component, you can implement or leave this feature. This will override default value set by ToastContainer if you are using builtin Toast components.",
    			default: "-"
    		},
    		{
    			name: "type",
    			type: "string",
    			description: "Four types of toasts are available i.e. success, info, error and warning. It will override toast type set by ToastContainer.",
    			default: "-"
    		},
    		{
    			name: "duration",
    			type: "number",
    			description: "Duration in milliseconds after which toast will be auto removed. If duration will be 0 or negative, toast will not be auto removed but user can click on cross icon to remove it. It will override duration specified by ToastContainer.",
    			default: "-"
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ToastDocs> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link, Code, Table, columns, data });

    	$$self.$inject_state = $$props => {
    		if ("columns" in $$props) $$invalidate(0, columns = $$props.columns);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [columns, data];
    }

    class ToastDocs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToastDocs",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/pages/ToastContainerDocs.svelte generated by Svelte v3.35.0 */
    const file$2 = "src/pages/ToastContainerDocs.svelte";

    // (147:42) <Link       class="text-blue-600 underline"       to="/toast-component">
    function create_default_slot$2(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("here");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$2.name,
    		type: "slot",
    		source: "(147:42) <Link       class=\\\"text-blue-600 underline\\\"       to=\\\"/toast-component\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let table;
    	let t2;
    	let p0;
    	let t4;
    	let code0;
    	let t5;
    	let p1;
    	let t7;
    	let p2;
    	let code1;
    	let t8;
    	let p3;
    	let t10;
    	let ul;
    	let li0;
    	let t12;
    	let li1;
    	let t14;
    	let li2;
    	let t16;
    	let li3;
    	let t18;
    	let li4;
    	let t20;
    	let li5;
    	let t22;
    	let li6;
    	let t24;
    	let li7;
    	let t26;
    	let li8;
    	let t28;
    	let li9;
    	let t30;
    	let li10;
    	let t32;
    	let li11;
    	let t34;
    	let p4;
    	let t35;
    	let link;
    	let t36;
    	let current;

    	table = new Table({
    			props: {
    				columns: /*columns*/ ctx[0],
    				data: /*data*/ ctx[1],
    				class: "my-5"
    			},
    			$$inline: true
    		});

    	code0 = new Code({
    			props: {
    				class: "my-5",
    				code: `
  import { toasts, ToastContainer, FlatToast }  from "svelte-toasts";

  const showToast = () => {
    const toast = toasts.add({
      title: 'Message title',
      description: 'Message body',
      duration: 10000, // 0 or negative to avoid auto-remove
      placement: 'bottom-right',
      type: 'info',
      theme: 'dark',
      placement: 'bottom-right',
      type: 'success',
      theme,
      onClick: () => {},
      onRemove: () => {},
      // component: BootstrapToast, // allows to override toast component/template per toast
    });

  };
  </script>

  <main class="flex flex-col container items-center mt-10">
    <h1 class="text-lg block text-center">Svelte Toasts</h1>
    <button on:click={showToast}>Show Toast</button>
    <ToastContainer {toasts} let:data={data}>
      <FlatToast {data} />
    </ToastContainer>
  </main>
    `
    			},
    			$$inline: true
    		});

    	code1 = new Code({
    			props: {
    				class: "my-5",
    				code: `
    <ToastContainer
      placement="top-right"
      showProgress
      theme="light"
      type="success"
      duration={5000}
      width="350px"
      toasts={toasts}
      let:data={data}
    >
      <FlatToast data={data} />
    </ToastContainer>
      `
    			},
    			$$inline: true
    		});

    	link = new Link({
    			props: {
    				class: "text-blue-600 underline",
    				to: "/toast-component",
    				$$slots: { default: [create_default_slot$2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "ToastsContainer";
    			t1 = space();
    			create_component(table.$$.fragment);
    			t2 = space();
    			p0 = element("p");
    			p0.textContent = "ToastContainer sets default options for toasts and handles toasts\n    placement/position. There are 7 placements allowed i.e \"bottom-right\",\n    \"bottom-left\", \"top-right\", \"top-left\", \"top-center\", 'bottom-center\",\n    \"center-center\".";
    			t4 = space();
    			create_component(code0.$$.fragment);
    			t5 = space();
    			p1 = element("p");
    			p1.textContent = "There are some default options that will be added to every toast's data but\n    we can override those default options for all toasts. e.g.";
    			t7 = space();
    			p2 = element("p");
    			create_component(code1.$$.fragment);
    			t8 = space();
    			p3 = element("p");
    			p3.textContent = "ToastContainer takes a default slot as a toast template. This must be a\n    component which should accept \"data\" prop which contains all toast related\n    data. \"data\" is object with following properties and other user specified\n    extra properties.";
    			t10 = space();
    			ul = element("ul");
    			li0 = element("li");
    			li0.textContent = "title";
    			t12 = space();
    			li1 = element("li");
    			li1.textContent = "description";
    			t14 = space();
    			li2 = element("li");
    			li2.textContent = "remove";
    			t16 = space();
    			li3 = element("li");
    			li3.textContent = "update";
    			t18 = space();
    			li4 = element("li");
    			li4.textContent = "onClick";
    			t20 = space();
    			li5 = element("li");
    			li5.textContent = "onRemove";
    			t22 = space();
    			li6 = element("li");
    			li6.textContent = "component";
    			t24 = space();
    			li7 = element("li");
    			li7.textContent = "placement";
    			t26 = space();
    			li8 = element("li");
    			li8.textContent = "showProgress";
    			t28 = space();
    			li9 = element("li");
    			li9.textContent = "theme";
    			t30 = space();
    			li10 = element("li");
    			li10.textContent = "type";
    			t32 = space();
    			li11 = element("li");
    			li11.textContent = "duration";
    			t34 = space();
    			p4 = element("p");
    			t35 = text("Read more about toast component props ");
    			create_component(link.$$.fragment);
    			t36 = text(".");
    			attr_dev(h1, "class", "text-3xl mb-5 outline-none");
    			add_location(h1, file$2, 57, 2, 1679);
    			attr_dev(p0, "class", "space-5");
    			add_location(p0, file$2, 61, 2, 1785);
    			add_location(p1, file$2, 101, 2, 2954);
    			add_location(p2, file$2, 105, 2, 3110);
    			add_location(p3, file$2, 124, 2, 3436);
    			add_location(li0, file$2, 131, 4, 3736);
    			add_location(li1, file$2, 132, 4, 3755);
    			add_location(li2, file$2, 133, 4, 3780);
    			add_location(li3, file$2, 134, 4, 3800);
    			add_location(li4, file$2, 135, 4, 3820);
    			add_location(li5, file$2, 136, 4, 3841);
    			add_location(li6, file$2, 137, 4, 3863);
    			add_location(li7, file$2, 138, 4, 3886);
    			add_location(li8, file$2, 139, 4, 3909);
    			add_location(li9, file$2, 140, 4, 3935);
    			add_location(li10, file$2, 141, 4, 3954);
    			add_location(li11, file$2, 142, 4, 3972);
    			attr_dev(ul, "class", "list-disc pl-8");
    			add_location(ul, file$2, 130, 2, 3704);
    			add_location(p4, file$2, 145, 2, 4001);
    			attr_dev(div, "class", "p-5 mb-20");
    			add_location(div, file$2, 56, 0, 1653);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			mount_component(table, div, null);
    			append_dev(div, t2);
    			append_dev(div, p0);
    			append_dev(div, t4);
    			mount_component(code0, div, null);
    			append_dev(div, t5);
    			append_dev(div, p1);
    			append_dev(div, t7);
    			append_dev(div, p2);
    			mount_component(code1, p2, null);
    			append_dev(div, t8);
    			append_dev(div, p3);
    			append_dev(div, t10);
    			append_dev(div, ul);
    			append_dev(ul, li0);
    			append_dev(ul, t12);
    			append_dev(ul, li1);
    			append_dev(ul, t14);
    			append_dev(ul, li2);
    			append_dev(ul, t16);
    			append_dev(ul, li3);
    			append_dev(ul, t18);
    			append_dev(ul, li4);
    			append_dev(ul, t20);
    			append_dev(ul, li5);
    			append_dev(ul, t22);
    			append_dev(ul, li6);
    			append_dev(ul, t24);
    			append_dev(ul, li7);
    			append_dev(ul, t26);
    			append_dev(ul, li8);
    			append_dev(ul, t28);
    			append_dev(ul, li9);
    			append_dev(ul, t30);
    			append_dev(ul, li10);
    			append_dev(ul, t32);
    			append_dev(ul, li11);
    			append_dev(div, t34);
    			append_dev(div, p4);
    			append_dev(p4, t35);
    			mount_component(link, p4, null);
    			append_dev(p4, t36);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link_changes = {};

    			if (dirty & /*$$scope*/ 4) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(table.$$.fragment, local);
    			transition_in(code0.$$.fragment, local);
    			transition_in(code1.$$.fragment, local);
    			transition_in(link.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(table.$$.fragment, local);
    			transition_out(code0.$$.fragment, local);
    			transition_out(code1.$$.fragment, local);
    			transition_out(link.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(table);
    			destroy_component(code0);
    			destroy_component(code1);
    			destroy_component(link);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("ToastContainerDocs", slots, []);

    	var columns = [
    		{
    			header: "Prop",
    			dataIndex: "name",
    			class: "text-bold"
    		},
    		{
    			header: "Type",
    			dataIndex: "type",
    			width: "150px"
    		},
    		{
    			header: "Default",
    			dataIndex: "default",
    			width: "150px"
    		},
    		{
    			header: "Description",
    			dataIndex: "description"
    		}
    	];

    	var data = [
    		{
    			name: "toasts",
    			type: "store object",
    			description: "toasts store object that will be used in ToastContainer component to show toasts.",
    			default: "-"
    		},
    		{
    			name: "placement",
    			type: "string",
    			description: "Set default placement of toasts",
    			default: "bottom-right"
    		},
    		{
    			name: "showProgress",
    			type: "boolean",
    			description: "If set to \"true\" and duration is greater than 0 then a timeout progress bar will be shown at the bottom of every toast.",
    			default: false
    		},
    		{
    			name: "theme",
    			type: "string",
    			description: "\"dark\" and \"light\" themes are implemented for builtin Toast components but in case of your own Toast component, you can implement or leave this feature.",
    			default: "dark"
    		},
    		{
    			name: "type",
    			type: "string",
    			description: "Four types of toasts are available i.e. success, info, error and warning.",
    			default: "info"
    		},
    		{
    			name: "duration",
    			type: "number",
    			description: "Duration in milliseconds after which toast will be auto removed. If duration will be 0 or negative, toast will not be auto removed but user can click on cross icon to remove it.",
    			default: 3000
    		},
    		{
    			name: "width",
    			type: "number | string",
    			description: "Width of toasts.",
    			default: "320px"
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<ToastContainerDocs> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link, Code, Table, columns, data });

    	$$self.$inject_state = $$props => {
    		if ("columns" in $$props) $$invalidate(0, columns = $$props.columns);
    		if ("data" in $$props) $$invalidate(1, data = $$props.data);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [columns, data];
    }

    class ToastContainerDocs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "ToastContainerDocs",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src/pages/CustomToastDocs.svelte generated by Svelte v3.35.0 */
    const file$1 = "src/pages/CustomToastDocs.svelte";

    // (21:7) <Link class="text-blue-600 underline" to="/flat-toast">
    function create_default_slot_2$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("FlatToast");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2$1.name,
    		type: "slot",
    		source: "(21:7) <Link class=\\\"text-blue-600 underline\\\" to=\\\"/flat-toast\\\">",
    		ctx
    	});

    	return block;
    }

    // (22:4) <Link class="text-blue-600 underline" to="/bootstrap-toast"       >
    function create_default_slot_1$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("BootstrapToast");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1$1.name,
    		type: "slot",
    		source: "(22:4) <Link class=\\\"text-blue-600 underline\\\" to=\\\"/bootstrap-toast\\\"       >",
    		ctx
    	});

    	return block;
    }

    // (28:11) <Link class="text-blue-600 underline" to="/toast">
    function create_default_slot$1(ctx) {
    	let t;

    	const block = {
    		c: function create() {
    			t = text("here");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, t, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(t);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(28:11) <Link class=\\\"text-blue-600 underline\\\" to=\\\"/toast\\\">",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let meta0;
    	let meta1;
    	let meta2;
    	let meta3;
    	let meta4;
    	let meta5;
    	let meta6;
    	let t0;
    	let div;
    	let h1;
    	let t2;
    	let p0;
    	let t3;
    	let link0;
    	let t4;
    	let link1;
    	let t5;
    	let link2;
    	let t6;
    	let h30;
    	let t8;
    	let code0;
    	let t9;
    	let code1;
    	let t10;
    	let code2;
    	let t11;
    	let h31;
    	let t13;
    	let code3;
    	let t14;
    	let code4;
    	let t15;
    	let code5;
    	let t16;
    	let p1;
    	let t18;
    	let code6;
    	let t19;
    	let code7;
    	let t20;
    	let code8;
    	let current;

    	link0 = new Link({
    			props: {
    				class: "text-blue-600 underline",
    				to: "/flat-toast",
    				$$slots: { default: [create_default_slot_2$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link1 = new Link({
    			props: {
    				class: "text-blue-600 underline",
    				to: "/bootstrap-toast",
    				$$slots: { default: [create_default_slot_1$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	link2 = new Link({
    			props: {
    				class: "text-blue-600 underline",
    				to: "/toast",
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	code0 = new Code({
    			props: {
    				class: "mt-5",
    				lang: "html",
    				code: ` 
  <script>`
    			},
    			$$inline: true
    		});

    	code1 = new Code({
    			props: {
    				code: `    import { toasts, ToastContainer }  from "svelte-toasts";
    
    const showToast = () => {
      const toast = toasts.add({
        title: 'Hello'
        description: 'Message body',
      });
    };
  `
    			},
    			$$inline: true
    		});

    	code2 = new Code({
    			props: {
    				class: "",
    				lang: "html",
    				code: `  <script>
  
  <button on:click={showToast}>Show Toast</button>
  <ToastContainer {toasts} let:data={data}>
    <div class="my-toast {data.type}">
      <button on:click={data.remove}>Close</button>
      <p class="title">{data.title}</p>
      <hr>
      <p class="description">{data.description}</p>
      <div>
        Some other content here.
      </div>
    </div>
  </ToastContainer>
  `
    			},
    			$$inline: true
    		});

    	code3 = new Code({
    			props: {
    				class: "mt-5",
    				lang: "html",
    				code: ` 
  // MyToast.svelte
  <script>`
    			},
    			$$inline: true
    		});

    	code4 = new Code({
    			props: { code: `    let data = {};` },
    			$$inline: true
    		});

    	code5 = new Code({
    			props: {
    				class: "",
    				lang: "html",
    				code: `  <script>
  
  <div class="my-toast {data.type}">
    <button on:click={data.remove}>Close</button>
    <p class="title">{data.title}</p>
    <hr>
    <p class="description">{data.description}</p>
    <div>
      <slot>Some other content here.</slot>
    </div>
  </div>
  `
    			},
    			$$inline: true
    		});

    	code6 = new Code({
    			props: {
    				class: "mt-5",
    				lang: "html",
    				code: ` 
  <script>`
    			},
    			$$inline: true
    		});

    	code7 = new Code({
    			props: {
    				code: `    import { toasts, ToastContainer }  from "svelte-toasts";
    import MyToast from './MyToast.svelte';
    // import path might be different based on location of your component
    
    const showToast = () => {
      const toast = toasts.add({
        title: 'Hello'
        description: 'Message body',
      });
    };
  `
    			},
    			$$inline: true
    		});

    	code8 = new Code({
    			props: {
    				class: "",
    				lang: "html",
    				code: `  <script>
  
  <button on:click={showToast}>Show Toast</button>
  <ToastContainer {toasts} let:data={data}>
    <MyToast {data} />
  </ToastContainer>
  `
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			meta0 = element("meta");
    			meta1 = element("meta");
    			meta2 = element("meta");
    			meta3 = element("meta");
    			meta4 = element("meta");
    			meta5 = element("meta");
    			meta6 = element("meta");
    			t0 = space();
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Custom Toast";
    			t2 = space();
    			p0 = element("p");
    			t3 = text("If ");
    			create_component(link0.$$.fragment);
    			t4 = text(" or\n    ");
    			create_component(link1.$$.fragment);
    			t5 = text(" do not fullfil your needs even after overriding styles, you can create and\n    use your own toast component. ToastContainer has default slot which acts as Toast\n    Component template. You can write inline markup or create a stand alone component\n    which takes a \"data\" prop which is actually a toast object. You read about toast\n    object ");
    			create_component(link2.$$.fragment);
    			t6 = space();
    			h30 = element("h3");
    			h30.textContent = "Inline Template";
    			t8 = space();
    			create_component(code0.$$.fragment);
    			t9 = space();
    			create_component(code1.$$.fragment);
    			t10 = space();
    			create_component(code2.$$.fragment);
    			t11 = space();
    			h31 = element("h3");
    			h31.textContent = "Custom Toast Component";
    			t13 = space();
    			create_component(code3.$$.fragment);
    			t14 = space();
    			create_component(code4.$$.fragment);
    			t15 = space();
    			create_component(code5.$$.fragment);
    			t16 = space();
    			p1 = element("p");
    			p1.textContent = "And now you can use that component as toast template";
    			t18 = space();
    			create_component(code6.$$.fragment);
    			t19 = space();
    			create_component(code7.$$.fragment);
    			t20 = space();
    			create_component(code8.$$.fragment);
    			document.title = "Svelte Toasts: Custom Toast";
    			attr_dev(meta0, "name", "title");
    			attr_dev(meta0, "content", "Svelte Toasts: Custom Toast");
    			add_location(meta0, file$1, 5, 2, 166);
    			attr_dev(meta1, "name", "description");
    			attr_dev(meta1, "content", "Svelte Toasts: Custom Toast docs");
    			add_location(meta1, file$1, 6, 2, 228);
    			attr_dev(meta2, "name", "keywords");
    			attr_dev(meta2, "content", "svelte, svelte-toasts,toasts,bootstrap-toast,flat-toast,store-toast");
    			add_location(meta2, file$1, 7, 2, 301);
    			attr_dev(meta3, "name", "robots");
    			attr_dev(meta3, "content", "index, follow");
    			add_location(meta3, file$1, 11, 2, 416);
    			attr_dev(meta4, "http-equiv", "Content-Type");
    			attr_dev(meta4, "content", "text/html; charset=utf-8");
    			add_location(meta4, file$1, 12, 2, 465);
    			attr_dev(meta5, "name", "language");
    			attr_dev(meta5, "content", "English");
    			add_location(meta5, file$1, 13, 2, 537);
    			attr_dev(meta6, "name", "author");
    			attr_dev(meta6, "content", "Zohaib Ijaz");
    			add_location(meta6, file$1, 14, 2, 582);
    			attr_dev(h1, "class", "text-3xl mb-5 outline-none");
    			add_location(h1, file$1, 18, 2, 669);
    			attr_dev(p0, "id", "code");
    			attr_dev(p0, "class", "space-5 mt-5");
    			add_location(p0, file$1, 19, 2, 728);
    			attr_dev(h30, "class", "text-xl mt-3");
    			add_location(h30, file$1, 29, 2, 1357);
    			attr_dev(h31, "class", "text-xl mt-3");
    			add_location(h31, file$1, 67, 2, 2163);
    			add_location(p1, file$1, 93, 2, 2680);
    			attr_dev(div, "class", "p-5 mb-20");
    			add_location(div, file$1, 17, 0, 643);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			append_dev(document.head, meta0);
    			append_dev(document.head, meta1);
    			append_dev(document.head, meta2);
    			append_dev(document.head, meta3);
    			append_dev(document.head, meta4);
    			append_dev(document.head, meta5);
    			append_dev(document.head, meta6);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t2);
    			append_dev(div, p0);
    			append_dev(p0, t3);
    			mount_component(link0, p0, null);
    			append_dev(p0, t4);
    			mount_component(link1, p0, null);
    			append_dev(p0, t5);
    			mount_component(link2, p0, null);
    			append_dev(div, t6);
    			append_dev(div, h30);
    			append_dev(div, t8);
    			mount_component(code0, div, null);
    			append_dev(div, t9);
    			mount_component(code1, div, null);
    			append_dev(div, t10);
    			mount_component(code2, div, null);
    			append_dev(div, t11);
    			append_dev(div, h31);
    			append_dev(div, t13);
    			mount_component(code3, div, null);
    			append_dev(div, t14);
    			mount_component(code4, div, null);
    			append_dev(div, t15);
    			mount_component(code5, div, null);
    			append_dev(div, t16);
    			append_dev(div, p1);
    			append_dev(div, t18);
    			mount_component(code6, div, null);
    			append_dev(div, t19);
    			mount_component(code7, div, null);
    			append_dev(div, t20);
    			mount_component(code8, div, null);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const link0_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link0_changes.$$scope = { dirty, ctx };
    			}

    			link0.$set(link0_changes);
    			const link1_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link1_changes.$$scope = { dirty, ctx };
    			}

    			link1.$set(link1_changes);
    			const link2_changes = {};

    			if (dirty & /*$$scope*/ 1) {
    				link2_changes.$$scope = { dirty, ctx };
    			}

    			link2.$set(link2_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link0.$$.fragment, local);
    			transition_in(link1.$$.fragment, local);
    			transition_in(link2.$$.fragment, local);
    			transition_in(code0.$$.fragment, local);
    			transition_in(code1.$$.fragment, local);
    			transition_in(code2.$$.fragment, local);
    			transition_in(code3.$$.fragment, local);
    			transition_in(code4.$$.fragment, local);
    			transition_in(code5.$$.fragment, local);
    			transition_in(code6.$$.fragment, local);
    			transition_in(code7.$$.fragment, local);
    			transition_in(code8.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link0.$$.fragment, local);
    			transition_out(link1.$$.fragment, local);
    			transition_out(link2.$$.fragment, local);
    			transition_out(code0.$$.fragment, local);
    			transition_out(code1.$$.fragment, local);
    			transition_out(code2.$$.fragment, local);
    			transition_out(code3.$$.fragment, local);
    			transition_out(code4.$$.fragment, local);
    			transition_out(code5.$$.fragment, local);
    			transition_out(code6.$$.fragment, local);
    			transition_out(code7.$$.fragment, local);
    			transition_out(code8.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			detach_dev(meta0);
    			detach_dev(meta1);
    			detach_dev(meta2);
    			detach_dev(meta3);
    			detach_dev(meta4);
    			detach_dev(meta5);
    			detach_dev(meta6);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(div);
    			destroy_component(link0);
    			destroy_component(link1);
    			destroy_component(link2);
    			destroy_component(code0);
    			destroy_component(code1);
    			destroy_component(code2);
    			destroy_component(code3);
    			destroy_component(code4);
    			destroy_component(code5);
    			destroy_component(code6);
    			destroy_component(code7);
    			destroy_component(code8);
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
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("CustomToastDocs", slots, []);
    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<CustomToastDocs> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Link, Code });
    	return [];
    }

    class CustomToastDocs extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "CustomToastDocs",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    var isXs = writable(!window.matchMedia('(min-width: 640px)').matches);

    /* src/App.svelte generated by Svelte v3.35.0 */
    const file = "src/App.svelte";

    // (72:8) {:else}
    function create_else_block(ctx) {
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M4 6h16M4 12h16M4 18h16");
    			add_location(path, file, 84, 12, 2447);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "#212121");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "width", "1em");
    			attr_dev(svg, "height", "1em");
    			attr_dev(svg, "class", "mr-2 text-xl cursor-pointer");
    			add_location(svg, file, 72, 10, 2109);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler_1*/ ctx[4], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(72:8) {:else}",
    		ctx
    	});

    	return block;
    }

    // (52:8) {#if open}
    function create_if_block(ctx) {
    	let svg;
    	let path;
    	let mounted;
    	let dispose;

    	const block = {
    		c: function create() {
    			svg = svg_element("svg");
    			path = svg_element("path");
    			attr_dev(path, "stroke-linecap", "round");
    			attr_dev(path, "stroke-linejoin", "round");
    			attr_dev(path, "stroke-width", "2");
    			attr_dev(path, "d", "M4 6h16M4 12h16m-7 6h7");
    			add_location(path, file, 64, 12, 1898);
    			attr_dev(svg, "xmlns", "http://www.w3.org/2000/svg");
    			attr_dev(svg, "fill", "#212121");
    			attr_dev(svg, "viewBox", "0 0 24 24");
    			attr_dev(svg, "stroke", "currentColor");
    			attr_dev(svg, "width", "1em");
    			attr_dev(svg, "height", "1em");
    			attr_dev(svg, "class", "mr-2 text-xl cursor-pointer");
    			add_location(svg, file, 52, 10, 1559);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, svg, anchor);
    			append_dev(svg, path);

    			if (!mounted) {
    				dispose = listen_dev(svg, "click", /*click_handler*/ ctx[3], false, false, false);
    				mounted = true;
    			}
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(svg);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(52:8) {#if open}",
    		ctx
    	});

    	return block;
    }

    // (115:6) <Link to="/">
    function create_default_slot_8(ctx) {
    	let h1;

    	const block = {
    		c: function create() {
    			h1 = element("h1");
    			h1.textContent = "Svelte Toasts";
    			attr_dev(h1, "class", "text-2xl block text-left text-center");
    			add_location(h1, file, 115, 8, 5242);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h1, anchor);
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_8.name,
    		type: "slot",
    		source: "(115:6) <Link to=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (141:6) <Route path="/">
    function create_default_slot_7(ctx) {
    	let demo;
    	let current;
    	demo = new Demo({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(demo.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(demo, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(demo.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(demo.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(demo, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_7.name,
    		type: "slot",
    		source: "(141:6) <Route path=\\\"/\\\">",
    		ctx
    	});

    	return block;
    }

    // (144:6) <Route path="store">
    function create_default_slot_6(ctx) {
    	let storedocs;
    	let current;
    	storedocs = new StoreDocs({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(storedocs.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(storedocs, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(storedocs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(storedocs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(storedocs, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_6.name,
    		type: "slot",
    		source: "(144:6) <Route path=\\\"store\\\">",
    		ctx
    	});

    	return block;
    }

    // (147:6) <Route path="toast-container">
    function create_default_slot_5(ctx) {
    	let toastcontainerdocs;
    	let current;
    	toastcontainerdocs = new ToastContainerDocs({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(toastcontainerdocs.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(toastcontainerdocs, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toastcontainerdocs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toastcontainerdocs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toastcontainerdocs, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_5.name,
    		type: "slot",
    		source: "(147:6) <Route path=\\\"toast-container\\\">",
    		ctx
    	});

    	return block;
    }

    // (150:6) <Route path="toast">
    function create_default_slot_4(ctx) {
    	let toastdocs;
    	let current;
    	toastdocs = new ToastDocs({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(toastdocs.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(toastdocs, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(toastdocs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(toastdocs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(toastdocs, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_4.name,
    		type: "slot",
    		source: "(150:6) <Route path=\\\"toast\\\">",
    		ctx
    	});

    	return block;
    }

    // (153:6) <Route path="flat-toast">
    function create_default_slot_3(ctx) {
    	let flattoastdocs;
    	let current;
    	flattoastdocs = new FlatToastDocs({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(flattoastdocs.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(flattoastdocs, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(flattoastdocs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(flattoastdocs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(flattoastdocs, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_3.name,
    		type: "slot",
    		source: "(153:6) <Route path=\\\"flat-toast\\\">",
    		ctx
    	});

    	return block;
    }

    // (156:6) <Route path="bootstrap-toast">
    function create_default_slot_2(ctx) {
    	let bootstraptoastdocs;
    	let current;
    	bootstraptoastdocs = new BootstrapToastDocs({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(bootstraptoastdocs.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(bootstraptoastdocs, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(bootstraptoastdocs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(bootstraptoastdocs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(bootstraptoastdocs, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_2.name,
    		type: "slot",
    		source: "(156:6) <Route path=\\\"bootstrap-toast\\\">",
    		ctx
    	});

    	return block;
    }

    // (159:6) <Route path="custom-toast">
    function create_default_slot_1(ctx) {
    	let customtoastdocs;
    	let current;
    	customtoastdocs = new CustomToastDocs({ $$inline: true });

    	const block = {
    		c: function create() {
    			create_component(customtoastdocs.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(customtoastdocs, target, anchor);
    			current = true;
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(customtoastdocs.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(customtoastdocs.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(customtoastdocs, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot_1.name,
    		type: "slot",
    		source: "(159:6) <Route path=\\\"custom-toast\\\">",
    		ctx
    	});

    	return block;
    }

    // (48:0) <Router basepath={ROOT_URL} {url}>
    function create_default_slot(ctx) {
    	let header;
    	let div1;
    	let div0;
    	let t0;
    	let svg0;
    	let path0;
    	let path1;
    	let path2;
    	let path3;
    	let path4;
    	let t1;
    	let link;
    	let t2;
    	let div3;
    	let div2;
    	let a;
    	let svg1;
    	let path5;
    	let t3;
    	let div4;
    	let sidebar;
    	let t4;
    	let main;
    	let route0;
    	let t5;
    	let route1;
    	let t6;
    	let route2;
    	let t7;
    	let route3;
    	let t8;
    	let route4;
    	let t9;
    	let route5;
    	let t10;
    	let route6;
    	let current;

    	function select_block_type(ctx, dirty) {
    		if (/*open*/ ctx[1]) return create_if_block;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	link = new Link_1({
    			props: {
    				to: "/",
    				$$slots: { default: [create_default_slot_8] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	sidebar = new Sidebar({
    			props: { open: /*open*/ ctx[1] },
    			$$inline: true
    		});

    	route0 = new Route({
    			props: {
    				path: "/",
    				$$slots: { default: [create_default_slot_7] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route1 = new Route({
    			props: {
    				path: "store",
    				$$slots: { default: [create_default_slot_6] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route2 = new Route({
    			props: {
    				path: "toast-container",
    				$$slots: { default: [create_default_slot_5] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route3 = new Route({
    			props: {
    				path: "toast",
    				$$slots: { default: [create_default_slot_4] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route4 = new Route({
    			props: {
    				path: "flat-toast",
    				$$slots: { default: [create_default_slot_3] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route5 = new Route({
    			props: {
    				path: "bootstrap-toast",
    				$$slots: { default: [create_default_slot_2] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	route6 = new Route({
    			props: {
    				path: "custom-toast",
    				$$slots: { default: [create_default_slot_1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			header = element("header");
    			div1 = element("div");
    			div0 = element("div");
    			if_block.c();
    			t0 = space();
    			svg0 = svg_element("svg");
    			path0 = svg_element("path");
    			path1 = svg_element("path");
    			path2 = svg_element("path");
    			path3 = svg_element("path");
    			path4 = svg_element("path");
    			t1 = space();
    			create_component(link.$$.fragment);
    			t2 = space();
    			div3 = element("div");
    			div2 = element("div");
    			a = element("a");
    			svg1 = svg_element("svg");
    			path5 = svg_element("path");
    			t3 = space();
    			div4 = element("div");
    			create_component(sidebar.$$.fragment);
    			t4 = space();
    			main = element("main");
    			create_component(route0.$$.fragment);
    			t5 = space();
    			create_component(route1.$$.fragment);
    			t6 = space();
    			create_component(route2.$$.fragment);
    			t7 = space();
    			create_component(route3.$$.fragment);
    			t8 = space();
    			create_component(route4.$$.fragment);
    			t9 = space();
    			create_component(route5.$$.fragment);
    			t10 = space();
    			create_component(route6.$$.fragment);
    			add_location(div0, file, 50, 6, 1524);
    			attr_dev(path0, "d", "m287.878906 373.824219h-234.425781c-29.472656 0-53.453125-23.980469-53.453125-53.453125v-234.425782c0-29.476562 23.980469-53.453124 53.453125-53.453124h223.464844c3.769531 0 6.824219 3.050781 6.824219 6.824218 0 3.773438-3.054688 6.828125-6.824219 6.828125h-223.464844c-21.945313 0-39.800781 17.851563-39.800781 39.800781v234.425782c0 21.945312 17.855468 39.796875 39.800781 39.796875h234.425781c21.945313 0 39.800782-17.851563 39.800782-39.796875v-206.117188c0-3.773437 3.054687-6.824218 6.824218-6.824218 3.769532 0 6.828125 3.050781 6.828125 6.824218v206.117188c0 29.472656-23.980469 53.453125-53.453125 53.453125zm0 0");
    			add_location(path0, file, 102, 8, 2862);
    			attr_dev(path1, "d", "m327.628906 119.421875c-15.1875 0-29.578125-5.671875-40.710937-16.105469-11.625-10.886718-18.3125-25.652344-18.832031-41.574218-1.074219-32.859376 24.78125-60.464844 57.644531-61.539063 15.828125-.660156 31.089843 5.179687 42.710937 16.074219 11.625 10.886718 18.3125 25.652344 18.832032 41.570312 1.070312 32.859375-24.785157 60.46875-57.644532 61.542969-.664062.027344-1.332031.03125-2 .03125zm.085938-105.597656c-.511719 0-1.023438.007812-1.539063.019531-25.335937.832031-45.273437 22.121094-44.441406 47.460938.398437 12.273437 5.554687 23.652343 14.515625 32.046874 8.964844 8.398438 20.675781 12.6875 32.933594 12.398438 25.335937-.832031 45.273437-22.117188 44.441406-47.460938-.398438-12.269531-5.554688-23.652343-14.515625-32.042968-8.585937-8.046875-19.683594-12.421875-31.394531-12.421875zm0 0");
    			add_location(path1, file, 104, 10, 3514);
    			attr_dev(path2, "d", "m65.265625 178.847656c-4-3.996094-10.484375-3.996094-14.480469 0-4 4-4 10.484375 0 14.480469 3.996094 4 10.480469 4 14.480469 0 4-3.996094 4-10.480469 0-14.480469zm0 0");
    			add_location(path2, file, 106, 10, 4349);
    			attr_dev(path3, "d", "m283.714844 178.851562c-3.996094-4-10.480469-4-14.480469 0-3.996094 3.996094-3.996094 10.480469 0 14.480469 4 4 10.484375 4 14.480469 0 4-4 4-10.484375 0-14.480469zm0 0");
    			add_location(path3, file, 108, 10, 4547);
    			attr_dev(path4, "d", "m218.453125 218.015625c-.105469-10.710937-95.464844-10.710937-95.570313 0v.230469c0 18.058594 21.394532 32.699218 47.785157 32.699218s47.785156-14.640624 47.785156-32.699218c0-.078125 0-.152344 0-.230469zm-48.9375 19.273437c-11.3125 0-20.480469-3.054687-20.480469-6.824218 0-3.769532 9.167969-6.828125 20.480469-6.828125 11.308594 0 20.480469 3.058593 20.480469 6.828125 0 3.769531-9.167969 6.824218-20.480469 6.824218zm0 0");
    			add_location(path4, file, 110, 10, 4746);
    			attr_dev(svg0, "class", "text-5xl mx-4");
    			attr_dev(svg0, "height", "1em");
    			attr_dev(svg0, "fill", "#e63e08");
    			attr_dev(svg0, "width", "1em");
    			attr_dev(svg0, "viewBox", "0 -7 387.30393 387");
    			attr_dev(svg0, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg0, file, 94, 6, 2667);
    			attr_dev(div1, "class", "flex items-center");
    			add_location(div1, file, 49, 4, 1486);
    			attr_dev(path5, "d", "m12 .5c-6.63 0-12 5.28-12 11.792 0 5.211 3.438 9.63 8.205 11.188.6.111.82-.254.82-.567 0-.28-.01-1.022-.015-2.005-3.338.711-4.042-1.582-4.042-1.582-.546-1.361-1.335-1.725-1.335-1.725-1.087-.731.084-.716.084-.716 1.205.082 1.838 1.215 1.838 1.215 1.07 1.803 2.809 1.282 3.495.981.108-.763.417-1.282.76-1.577-2.665-.295-5.466-1.309-5.466-5.827 0-1.287.465-2.339 1.235-3.164-.135-.298-.54-1.497.105-3.121 0 0 1.005-.316 3.3 1.209.96-.262 1.98-.392 3-.398 1.02.006 2.04.136 3 .398 2.28-1.525 3.285-1.209 3.285-1.209.645 1.624.24 2.823.12 3.121.765.825 1.23 1.877 1.23 3.164 0 4.53-2.805 5.527-5.475 5.817.42.354.81 1.077.81 2.182 0 1.578-.015 2.846-.015 3.229 0 .309.21.678.825.56 4.801-1.548 8.236-5.97 8.236-11.173 0-6.512-5.373-11.792-12-11.792z");
    			attr_dev(path5, "fill", "#212121");
    			add_location(path5, file, 128, 13, 5701);
    			attr_dev(svg1, "class", "text-3xl");
    			attr_dev(svg1, "enable-background", "new 0 0 24 24");
    			attr_dev(svg1, "height", "1em");
    			attr_dev(svg1, "viewBox", "0 0 24 24");
    			attr_dev(svg1, "width", "1em");
    			attr_dev(svg1, "xmlns", "http://www.w3.org/2000/svg");
    			add_location(svg1, file, 121, 10, 5480);
    			attr_dev(a, "href", "https://github.com/mzohaibqc/svelte-toasts");
    			attr_dev(a, "target", "_blank");
    			add_location(a, file, 120, 8, 5400);
    			attr_dev(div2, "class", "");
    			add_location(div2, file, 119, 6, 5377);
    			attr_dev(div3, "class", "flex items-center");
    			add_location(div3, file, 118, 4, 5339);
    			attr_dev(header, "class", "flex justify-between px-5 py-3 shadow");
    			add_location(header, file, 48, 2, 1427);
    			attr_dev(main, "class", "svelte-qpluaa");
    			add_location(main, file, 139, 4, 6631);
    			attr_dev(div4, "class", "content svelte-qpluaa");
    			add_location(div4, file, 137, 2, 6582);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, header, anchor);
    			append_dev(header, div1);
    			append_dev(div1, div0);
    			if_block.m(div0, null);
    			append_dev(div1, t0);
    			append_dev(div1, svg0);
    			append_dev(svg0, path0);
    			append_dev(svg0, path1);
    			append_dev(svg0, path2);
    			append_dev(svg0, path3);
    			append_dev(svg0, path4);
    			append_dev(div1, t1);
    			mount_component(link, div1, null);
    			append_dev(header, t2);
    			append_dev(header, div3);
    			append_dev(div3, div2);
    			append_dev(div2, a);
    			append_dev(a, svg1);
    			append_dev(svg1, path5);
    			insert_dev(target, t3, anchor);
    			insert_dev(target, div4, anchor);
    			mount_component(sidebar, div4, null);
    			append_dev(div4, t4);
    			append_dev(div4, main);
    			mount_component(route0, main, null);
    			append_dev(main, t5);
    			mount_component(route1, main, null);
    			append_dev(main, t6);
    			mount_component(route2, main, null);
    			append_dev(main, t7);
    			mount_component(route3, main, null);
    			append_dev(main, t8);
    			mount_component(route4, main, null);
    			append_dev(main, t9);
    			mount_component(route5, main, null);
    			append_dev(main, t10);
    			mount_component(route6, main, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(div0, null);
    				}
    			}

    			const link_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				link_changes.$$scope = { dirty, ctx };
    			}

    			link.$set(link_changes);
    			const sidebar_changes = {};
    			if (dirty & /*open*/ 2) sidebar_changes.open = /*open*/ ctx[1];
    			sidebar.$set(sidebar_changes);
    			const route0_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route0_changes.$$scope = { dirty, ctx };
    			}

    			route0.$set(route0_changes);
    			const route1_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route1_changes.$$scope = { dirty, ctx };
    			}

    			route1.$set(route1_changes);
    			const route2_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route2_changes.$$scope = { dirty, ctx };
    			}

    			route2.$set(route2_changes);
    			const route3_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route3_changes.$$scope = { dirty, ctx };
    			}

    			route3.$set(route3_changes);
    			const route4_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route4_changes.$$scope = { dirty, ctx };
    			}

    			route4.$set(route4_changes);
    			const route5_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route5_changes.$$scope = { dirty, ctx };
    			}

    			route5.$set(route5_changes);
    			const route6_changes = {};

    			if (dirty & /*$$scope*/ 64) {
    				route6_changes.$$scope = { dirty, ctx };
    			}

    			route6.$set(route6_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(link.$$.fragment, local);
    			transition_in(sidebar.$$.fragment, local);
    			transition_in(route0.$$.fragment, local);
    			transition_in(route1.$$.fragment, local);
    			transition_in(route2.$$.fragment, local);
    			transition_in(route3.$$.fragment, local);
    			transition_in(route4.$$.fragment, local);
    			transition_in(route5.$$.fragment, local);
    			transition_in(route6.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(link.$$.fragment, local);
    			transition_out(sidebar.$$.fragment, local);
    			transition_out(route0.$$.fragment, local);
    			transition_out(route1.$$.fragment, local);
    			transition_out(route2.$$.fragment, local);
    			transition_out(route3.$$.fragment, local);
    			transition_out(route4.$$.fragment, local);
    			transition_out(route5.$$.fragment, local);
    			transition_out(route6.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(header);
    			if_block.d();
    			destroy_component(link);
    			if (detaching) detach_dev(t3);
    			if (detaching) detach_dev(div4);
    			destroy_component(sidebar);
    			destroy_component(route0);
    			destroy_component(route1);
    			destroy_component(route2);
    			destroy_component(route3);
    			destroy_component(route4);
    			destroy_component(route5);
    			destroy_component(route6);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(48:0) <Router basepath={ROOT_URL} {url}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment(ctx) {
    	let tailwind;
    	let t;
    	let router;
    	let current;
    	tailwind = new Tailwind({ $$inline: true });

    	router = new Router({
    			props: {
    				basepath: /*ROOT_URL*/ ctx[2],
    				url: /*url*/ ctx[0],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(tailwind.$$.fragment);
    			t = space();
    			create_component(router.$$.fragment);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			mount_component(tailwind, target, anchor);
    			insert_dev(target, t, anchor);
    			mount_component(router, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, [dirty]) {
    			const router_changes = {};
    			if (dirty & /*url*/ 1) router_changes.url = /*url*/ ctx[0];

    			if (dirty & /*$$scope, open*/ 66) {
    				router_changes.$$scope = { dirty, ctx };
    			}

    			router.$set(router_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(tailwind.$$.fragment, local);
    			transition_in(router.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(tailwind.$$.fragment, local);
    			transition_out(router.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(tailwind, detaching);
    			if (detaching) detach_dev(t);
    			destroy_component(router, detaching);
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
    	let $isXs;
    	validate_store(isXs, "isXs");
    	component_subscribe($$self, isXs, $$value => $$invalidate(5, $isXs = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots("App", slots, []);
    	var ROOT_URL = "/svelte-toasts";
    	var { url = "" } = $$props;
    	var open = !$isXs;

    	onMount(() => {
    		setTimeout(
    			() => {
    				toasts.success("Thanks for trying svelte-toasts. Don't forget to star if you like this.", { duration: 0, placement: "bottom-right" });
    			},
    			100
    		);

    		function onResize() {
    			var xs = !window.matchMedia("(min-width: 640px)").matches;

    			isXs.update(prev => {
    				if (prev && !xs) {
    					$$invalidate(1, open = true);
    				}

    				if (!prev && xs) {
    					$$invalidate(1, open = false);
    				}

    				return xs;
    			});
    		}

    		window.addEventListener("resize", onResize);

    		return () => {
    			window.removeEventListener("resize", onResize);
    		};
    	});

    	const writable_props = ["url"];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== "$$") console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	const click_handler = () => {
    		$$invalidate(1, open = false);
    	};

    	const click_handler_1 = () => {
    		$$invalidate(1, open = true);
    	};

    	$$self.$$set = $$props => {
    		if ("url" in $$props) $$invalidate(0, url = $$props.url);
    	};

    	$$self.$capture_state = () => ({
    		onMount,
    		toasts,
    		Router,
    		Route,
    		BootstrapToastDocs,
    		FlatToastDocs,
    		Link: Link_1,
    		Sidebar,
    		Tailwind,
    		Demo,
    		StoreDocs,
    		ToastDocs,
    		ToastContainerDocs,
    		CustomToastDocs,
    		isXs,
    		ROOT_URL,
    		url,
    		open,
    		$isXs
    	});

    	$$self.$inject_state = $$props => {
    		if ("ROOT_URL" in $$props) $$invalidate(2, ROOT_URL = $$props.ROOT_URL);
    		if ("url" in $$props) $$invalidate(0, url = $$props.url);
    		if ("open" in $$props) $$invalidate(1, open = $$props.open);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	return [url, open, ROOT_URL, click_handler, click_handler_1];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, { url: 0 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}

    	get url() {
    		throw new Error("<App>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set url(value) {
    		throw new Error("<App>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    const app = new App({
      target: document.body,
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
