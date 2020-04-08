/*! flyui v1.0.3 | by huanzhang & ueteam | (c) 2016 iFlytek, Inc. | Licensed under MIT | 2016-07-03 21:07:44 CST */
(function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = typeof require == "function" && require;
                if (!u && a) return a(o, !0);
                if (i) return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND", f
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n ? n : e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }
    var i = typeof require == "function" && require;
    for (var o = 0; o < r.length; o++) s(r[o]);
    return s
})({
    1: [
        function(require, module, exports) {
            /**
             * 绑定器
             * 参考Knockout/kendo/VUE
             * @author: huanzhang
             * @email: huanzhang@iflytek.com
             * @update: 2015-06-30
             */

            'use strict';

            // 依赖
            var fly = require('./fly.core'),
                utils = require('./fly.utils'),
                data = require('./fly.data'),
                tmpl = require('./fly.template'),
                ui = require('./fly.ui'),
                $ = fly.$,
                proxy = $.proxy,
                isArray = $.isArray,
                Class = fly.Class,
                DataSource = data.DataSource,
                Observable = fly.Observable,
                ObservableObject = fly.ObservableObject,
                ObservableArray = fly.ObservableArray,
                deleteExpando = fly.support.deleteExpando;

            // 绑定器
            var widgetBinders = {},
                binders = {
                    widget: widgetBinders
                };

            // 静态变量
            var FUNCTION = 'function',
                NUMBER = 'number',
                CHANGE = 'change',
                VALUE = 'value',
                SOURCE = 'source',
                EVENTS = 'events',
                CHECKED = 'checked',
                CSS = 'css',
                DISABLED = 'disabled',
                READONLY = 'readonly';

            // 正则表达式
            var regKeyValue = /[A-Za-z0-9_\-]+:(\{([^}]*)\}|[^,}]+)/g,
                regWhiteSpace = /\s/g,
                regTemplate = /template$/i,
                regDate = /^\/Date\((.*?)\)\/$/,
                regNewLine = /(\r+|\n+)/g,
                regQuote = /(?=['\\])/g;

            //格式化字符串
            var toString = function(value, fmt, culture) {
                if (value && fmt) {
                    if (value.getTime()) {
                        return formatDate(value, fmt, culture);
                    } else if (typeof value === NUMBER) {
                        return formatNumber(value, fmt, culture);
                    }
                }

                return value !== undefined ? value : '';
            };

            var Binding = Observable.extend({

                ctor: function(parents, path) {
                    var that = this;
                    that._super();
                    that.source = parents && parents[0];
                    that.parents = parents;
                    that.path = path;
                    that.dependencies = {};
                    that.dependencies[path] = true;
                    that.observable = that.source instanceof Observable;

                    that._access = function(e) {
                        that.dependencies[e.field] = true;
                    };

                    if (that.observable) {
                        that._change = function(e) {
                            that.change(e);
                        };

                        that.source.bind(CHANGE, that._change);
                    }
                },

                _parents: function() {
                    var parents = this.parents;
                    var value = this.get();

                    if (value && typeof value.parent == FUNCTION) {
                        var parent = value.parent();

                        if ($.inArray(parent, parents) < 0) {
                            parents = [parent].concat(parents);
                        }
                    }

                    return parents;
                },

                change: function(e) {
                    var dependency,
                        ch,
                        field = e.field,
                        that = this;

                    if (that.path === 'this') {
                        that.trigger(CHANGE, e);
                    } else {
                        for (dependency in that.dependencies) {
                            if (dependency.indexOf(field) === 0) {
                                ch = dependency.charAt(field.length);

                                if (!ch || ch === '.' || ch === '[') {
                                    that.trigger(CHANGE, e);
                                    break;
                                }
                            }
                        }
                    }
                },

                start: function(source) {
                    source.bind('get', this._access);
                },

                stop: function(source) {
                    source.unbind('get', this._access);
                },

                get: function() {

                    var that = this,
                        source = that.source,
                        index = 0,
                        path = that.path,
                        result = source;

                    if (!that.observable) {
                        return result;
                    }

                    that.start(that.source);

                    result = source.get(path);

                    // Traverse the observable hierarchy if the binding is not resolved at the current level.
                    while (result === undefined && source) {

                        source = that.parents[++index];

                        if (source instanceof ObservableObject) {
                            result = source.get(path);
                        }
                    }

                    // second pass try to get the parent from the object hierarchy
                    if (result === undefined) {
                        source = that.source; //get the initial source

                        while (result === undefined && source) {
                            source = source.parent();

                            if (source instanceof ObservableObject) {
                                result = source.get(path);
                            }
                        }
                    }

                    // If the result is a function - invoke it
                    if (typeof result === FUNCTION) {
                        index = path.lastIndexOf('.');

                        // If the function is a member of a nested observable object make that nested observable the context (this) of the function
                        if (index > 0) {
                            source = source.get(path.substring(0, index));
                        }

                        // Invoke the function
                        that.start(source);

                        if (source !== that.source) {
                            result = result.call(source, that.source);
                        } else {
                            result = result.call(source);
                        }

                        that.stop(source);
                    }

                    // If the binding is resolved by a parent object
                    if (source && source !== that.source) {

                        that.currentSource = source; // save parent object

                        // Listen for changes in the parent object
                        source.unbind(CHANGE, that._change)
                            .bind(CHANGE, that._change);
                    }

                    that.stop(that.source);

                    return result;
                },

                set: function(value) {
                    var source = this.currentSource || this.source;

                    var field = fly.getter(this.path)(source);

                    if (typeof field === FUNCTION) {
                        if (source !== this.source) {
                            field.call(source, this.source, value);
                        } else {
                            field.call(source, value);
                        }
                    } else {
                        source.set(this.path, value);
                    }
                },

                destroy: function() {
                    if (this.observable) {
                        this.source.unbind(CHANGE, this._change);
                        if (this.currentSource) {
                            this.currentSource.unbind(CHANGE, this._change);
                        }
                    }

                    this.unbind();
                }
            });

            var EventBinding = Binding.extend({
                get: function() {
                    var source = this.source,
                        path = this.path,
                        index = 0,
                        handler;

                    handler = source.get(path);

                    while (!handler && source) {
                        source = this.parents[++index];

                        if (source instanceof ObservableObject) {
                            handler = source.get(path);
                        }
                    }

                    return proxy(handler, source);
                }
            });

            var TemplateBinding = Binding.extend({
                ctor: function(source, path, template) {
                    this._super(source, path);
                    this.template = template;
                },

                render: function(value) {
                    var html;

                    this.start(this.source);

                    html = tmpl(this.template, value.toJSON && value.toJSON() || value);

                    this.stop(this.source);

                    return html;
                }
            });

            var BindingTarget = Class.extend({

                ctor: function(target, options) {
                    this.target = target;
                    this.options = options;
                    this.toDestroy = [];
                },

                bind: function(bindings) {
                    var key,
                        hasValue,
                        hasSource,
                        hasEvents,
                        hasChecked,
                        hasCss,
                        widgetBinding = this instanceof WidgetBindingTarget,
                        specificBinders = this.binders();

                    for (key in bindings) {
                        if (key == VALUE) {
                            hasValue = true;
                        } else if (key == SOURCE) {
                            hasSource = true;
                        } else if (key == EVENTS) {
                            hasEvents = true;
                        } else if (key == CHECKED) {
                            hasChecked = true;
                        } else if (key == CSS && !widgetBinding) {
                            hasCss = true;
                        } else {
                            this.applyBinding(key, bindings, specificBinders);
                        }
                    }
                    if (hasSource) {
                        this.applyBinding(SOURCE, bindings, specificBinders);
                    }

                    if (hasValue) {
                        this.applyBinding(VALUE, bindings, specificBinders);
                    }

                    if (hasChecked) {
                        this.applyBinding(CHECKED, bindings, specificBinders);
                    }

                    if (hasEvents) {
                        this.applyBinding(EVENTS, bindings, specificBinders);
                    }

                    if (hasCss && !widgetBinding) {
                        this.applyBinding(CSS, bindings, specificBinders);
                    }
                },

                binders: function() {
                    return binders[this.target.nodeName.toLowerCase()] || {};
                },

                applyBinding: function(name, bindings, specificBinders) {
                    var binder = specificBinders[name] || binders[name],
                        toDestroy = this.toDestroy,
                        attribute,
                        binding = bindings[name];

                    if (binder) {
                        binder = new binder(this.target, bindings, this.options);

                        toDestroy.push(binder);

                        if (binding instanceof Binding) {
                            binder.bind(binding);
                            toDestroy.push(binding);
                        } else {
                            for (attribute in binding) {
                                binder.bind(binding, attribute);
                                toDestroy.push(binding[attribute]);
                            }
                        }
                    } else if (name !== 'template') {
                        throw new Error('The ' + name +
                            ' binding is not supported by the ' + this.target
                            .nodeName.toLowerCase() + ' element');
                    }
                },

                destroy: function() {
                    var idx,
                        length,
                        toDestroy = this.toDestroy;

                    for (idx = 0, length = toDestroy.length; idx < length; idx++) {
                        toDestroy[idx].destroy();
                    }
                }
            });

            var WidgetBindingTarget = BindingTarget.extend({

                binders: function() {
                    return widgetBinders[this.target.name.toLowerCase()] || {};
                },

                applyBinding: function(name, bindings, specificBinders) {
                    var binder = specificBinders[name] || widgetBinders[name],
                        toDestroy = this.toDestroy,
                        attribute,
                        binding = bindings[name];

                    if (binder) {
                        binder = new binder(this.target, bindings, this.target.options);

                        toDestroy.push(binder);

                        if (binding instanceof Binding) {
                            binder.bind(binding);
                            toDestroy.push(binding);
                        } else {
                            for (attribute in binding) {
                                binder.bind(binding, attribute);
                                toDestroy.push(binding[attribute]);
                            }
                        }
                    } else {
                        throw new Error('The ' + name +
                            ' binding is not supported by the ' + this.target
                            .name + ' widget');
                    }
                }
            });

            var Binder = Class.extend({

                ctor: function(element, bindings, options) {
                    this.element = element;
                    this.bindings = bindings;
                    this.options = options;
                },

                bind: function(binding, attribute) {
                    var that = this;

                    binding = attribute ? binding[attribute] : binding;

                    binding.bind(CHANGE, function(e) {
                        that.refresh(attribute || e);
                    });

                    that.refresh(attribute);
                },

                destroy: function() {}
            });

            var TypedBinder = Binder.extend({

                dataType: function() {
                    var dataType = this.element.getAttribute('data-type') ||
                        this.element.type || 'text';
                    return dataType.toLowerCase();
                },

                parsedValue: function() {
                    return this._parseValue(this.element.value, this.dataType());
                },

                _parseValue: function(value, dataType) {
                    if (dataType == 'date') {
                        value = fly.parseDate(value, 'yyyy-MM-dd');
                    } else if (dataType == 'datetime') {
                        value = fly.parseDate(value, 'yyyy-MM-dd HH:mm:ss');
                    } else if (dataType == 'number') {
                        value = parseFloat(value);
                    } else if (dataType == 'boolean') {
                        value = value.toLowerCase();
                        if (parseFloat(value) !== NaN) {
                            value = Boolean(parseFloat(value));
                        } else {
                            value = (value === 'true');
                        }
                    }
                    return value;
                }
            });

            binders.attr = Binder.extend({
                refresh: function(key) {
                    this.element.setAttribute(key, this.bindings.attr[key].get());
                }
            });

            binders.css = Binder.extend({
                ctor: function(element, bindings, options) {
                    this._super(element, bindings, options);
                    this.classes = {};
                },
                refresh: function(className) {
                    var element = $(this.element),
                        binding = this.bindings.css[className],
                        hasClass = this.classes[className] = binding.get();
                    if (hasClass) {
                        element.addClass(className);
                    } else {
                        element.removeClass(className);
                    }
                }
            });

            binders.style = Binder.extend({
                refresh: function(key) {
                    this.element.style[key] = this.bindings.style[key].get() ||
                        "";
                }
            });

            binders.enabled = Binder.extend({
                refresh: function() {
                    if (this.bindings.enabled.get()) {
                        this.element.removeAttribute(DISABLED);
                    } else {
                        this.element.setAttribute(DISABLED, DISABLED);
                    }
                }
            });

            binders.readonly = Binder.extend({
                refresh: function() {
                    if (this.bindings.readonly.get()) {
                        this.element.setAttribute(READONLY, READONLY);
                    } else {
                        this.element.removeAttribute(READONLY);
                    }
                }
            });

            binders.disabled = Binder.extend({
                refresh: function() {
                    if (this.bindings.disabled.get()) {
                        this.element.setAttribute(DISABLED, DISABLED);
                    } else {
                        this.element.removeAttribute(DISABLED);
                    }
                }
            });

            binders.events = Binder.extend({
                ctor: function(element, bindings, options) {
                    this._super(element, bindings, options);
                    this.handlers = {};
                },

                refresh: function(key) {
                    var element = $(this.element),
                        binding = this.bindings.events[key],
                        handler = this.handlers[key];

                    if (handler) {
                        element.off(key, handler);
                    }

                    handler = this.handlers[key] = binding.get();

                    element.on(key, binding.source, handler);
                },

                destroy: function() {
                    var element = $(this.element),
                        handler;

                    for (handler in this.handlers) {
                        element.off(handler, this.handlers[handler]);
                    }
                }
            });

            binders.text = Binder.extend({
                refresh: function() {
                    var text = this.bindings.text.get();
                    var dataFormat = this.element.getAttribute("data-format") ||
                        "";
                    if (text == null) {
                        text = "";
                    }

                    $(this.element).text(toString(text, dataFormat));
                }
            });

            binders.visible = Binder.extend({
                refresh: function() {
                    if (this.bindings.visible.get()) {
                        this.element.style.display = "";
                    } else {
                        this.element.style.display = "none";
                    }
                }
            });

            binders.invisible = Binder.extend({
                refresh: function() {
                    if (!this.bindings.invisible.get()) {
                        this.element.style.display = "";
                    } else {
                        this.element.style.display = "none";
                    }
                }
            });

            binders.html = Binder.extend({
                refresh: function() {
                    this.element.innerHTML = this.bindings.html.get();
                }
            });

            binders.value = TypedBinder.extend({
                ctor: function(element, bindings, options) {
                    this._super(element, bindings, options);
                    this._change = proxy(this.change, this);
                    this.eventName = options.valueUpdate || CHANGE;

                    $(this.element).on(this.eventName, this._change);

                    this._initChange = false;
                },

                change: function() {
                    this._initChange = this.eventName != CHANGE;

                    this.bindings[VALUE].set(this.parsedValue());

                    this._initChange = false;
                },

                refresh: function() {
                    if (!this._initChange) {
                        var value = this.bindings[VALUE].get();

                        if (value == null) {
                            value = '';
                        }

                        var type = this.dataType();

                        if (type == "date") {
                            value = toString(value, "yyyy-MM-dd");
                        } else if (type == "datetime-local") {
                            value = toString(value, "yyyy-MM-ddTHH:mm:ss");
                        }

                        this.element.value = value;
                    }

                    this._initChange = false;
                },

                destroy: function() {
                    $(this.element).off(this.eventName, this._change);
                }
            });

            binders.source = Binder.extend({

                ctor: function(element, bindings, options) {

                    this._super(element, bindings, options);

                    var source = this.bindings.source.get();
                    if (source instanceof DataSource && options.autoBind !== false) {
                        source.fetch();
                    }
                },

                refresh: function(e) {
                    var that = this,
                        itemChange = that.options.itemChange,
                        source = that.bindings.source.get();

                    //if (source instanceof ObservableArray) {
                    e = e || {};

                    if (e.action == "add") {
                        that.add(e.index, e.items);
                    } else if (e.action == "remove") {
                        that.remove(e.index, e.items);
                    } else if (e.action == undefined) {
                        that.render();
                    } else if (e.action == "itemchange" && itemChange) {
                        that.render();
                    }
                    //} else {
                    //    that.render();
                    //}
                },

                container: function() {
                    var element = this.element;

                    if (element.nodeName.toLowerCase() == "table") {
                        if (!element.tBodies[0]) {
                            element.appendChild(document.createElement("tbody"));
                        }
                        element = element.tBodies[0];
                    }

                    return element;
                },

                template: function() {
                    var options = this.options,
                        template = options.template,
                        nodeName = this.container().nodeName.toLowerCase();

                    if (!template) {
                        if (nodeName == "select") {
                            if (options.valueField || options.textField) {
                                template = '<option value="{{' + options.valueField ||
                                    options.textField + '}}">' + options.textField ||
                                    options.valueField + '</option>';
                            } else {
                                template = "<option>{{data}}</option>";
                            }
                        } else if (nodeName == "tbody") {
                            template = "<tr><td>{{data}}</td></tr>";
                        } else if (nodeName == "ul" || nodeName == "ol") {
                            template = "<li>{{data}}</li>";
                        } else {
                            template = "{{data}}";
                        }
                        template = tmpl.compile(template);
                    } else {
                        template = tmpl.renderFile(template);
                    }

                    return template;
                },

                add: function(index, items) {
                    var element = this.container(),
                        parents,
                        idx,
                        length,
                        child,
                        clone = element.cloneNode(false),
                        reference = element.children[index];

                    $(clone).html(this.template()(items));

                    if (clone.children.length) {
                        parents = this.bindings.source._parents();

                        for (idx = 0, length = items.length; idx < length; idx++) {
                            child = clone.children[0];
                            element.insertBefore(child, reference || null);
                            bindElement(child, items[idx], this.options.roles, [
                                items[idx]
                            ].concat(parents));
                        }
                    }
                },

                remove: function(index, items) {
                    var idx, element = this.container();

                    for (idx = 0; idx < items.length; idx++) {
                        var child = element.children[index];
                        unbindElementTree(child);
                        element.removeChild(child);
                    }
                },

                render: function() {
                    var source = this.bindings.source.get(),
                        parents,
                        idx,
                        length,
                        element = this.container(),
                        template = this.template();

                    if (source instanceof DataSource) {
                        source = source.view();
                    }

                    if (!(source instanceof ObservableArray) && !isArray(source)) {
                        source = [source];
                    }

                    if (this.bindings.template) {
                        unbindElementChildren(element);

                        $(element).html(this.bindings.template.render(source));

                        if (element.children.length) {
                            parents = this.bindings.source._parents();

                            for (idx = 0, length = source.length; idx < length; idx++) {
                                bindElement(element.children[idx], source[idx],
                                    this.options.roles, [source[idx]].concat(
                                        parents));
                            }
                        }
                    } else {
                        $(element).html(template(source));
                    }
                }
            });

            binders.input = {
                checked: TypedBinder.extend({
                    ctor: function(element, bindings, options) {
                        this._super(element, bindings, options);
                        this._change = proxy(this.change, this);
                        $(this.element).on(CHANGE, this._change);
                    },

                    change: function() {
                        var element = this.element;
                        var value = this.value();

                        if (element.type == "radio") {
                            value = this.parsedValue();
                            this.bindings[CHECKED].set(value);
                        } else if (element.type == "checkbox") {
                            var source = this.bindings[CHECKED].get();
                            var index;

                            if (source instanceof ObservableArray) {
                                value = this.parsedValue();
                                if (value instanceof Date) {
                                    for (var i = 0; i < source.length; i++) {
                                        if (source[i] instanceof Date && +source[i] === +
                                            value) {
                                            index = i;
                                            break;
                                        }
                                    }
                                } else {
                                    index = source.indexOf(value);
                                }
                                if (index > -1) {
                                    source.splice(index, 1);
                                } else {
                                    source.push(value);
                                }
                            } else {
                                this.bindings[CHECKED].set(value);
                            }
                        }
                    },

                    refresh: function() {
                        var value = this.bindings[CHECKED].get(),
                            source = value,
                            type = this.dataType(),
                            element = this.element;

                        if (element.type == "checkbox") {
                            if (source instanceof ObservableArray) {
                                var index = -1;
                                value = this.parsedValue();
                                if (value instanceof Date) {
                                    for (var i = 0; i < source.length; i++) {
                                        if (source[i] instanceof Date && +source[i] === +
                                            value) {
                                            index = i;
                                            break;
                                        }
                                    }
                                } else {
                                    index = source.indexOf(value);
                                }
                                element.checked = (index >= 0);
                            } else {
                                element.checked = source;
                            }
                        } else if (element.type == "radio" && value != null) {
                            value = toDateString(value, type);
                            if (element.value === value.toString()) {
                                element.checked = true;
                            }
                        }
                    },

                    value: function() {
                        var element = this.element,
                            value = element.value;

                        if (element.type == "checkbox") {
                            value = element.checked;
                        }

                        return value;
                    },
                    destroy: function() {
                        $(this.element).off(CHANGE, this._change);
                    }
                })
            };

            widgetBinders.events = Binder.extend({

                ctor: function(widget, bindings, options) {
                    this._super(widget.element[0], bindings, options);
                    this.widget = widget;
                    this.handlers = {};
                },

                refresh: function(key) {
                    var binding = this.bindings.events[key],
                        handler = this.handlers[key];

                    if (handler) {
                        this.widget.unbind(key, handler);
                    }

                    handler = binding.get();

                    this.handlers[key] = function(e) {
                        e.data = binding.source;

                        handler(e);

                        if (e.data === binding.source) {
                            delete e.data;
                        }
                    };

                    this.widget.bind(key, this.handlers[key]);
                },

                destroy: function() {
                    var handler;

                    for (handler in this.handlers) {
                        this.widget.unbind(handler, this.handlers[handler]);
                    }
                }
            });

            widgetBinders.checked = Binder.extend({

                ctor: function(widget, bindings, options) {
                    this._super(widget.element[0], bindings, options);
                    this.widget = widget;
                    this._change = proxy(this.change, this);
                    this.widget.bind(CHANGE, this._change);
                },
                change: function() {
                    this.bindings[CHECKED].set(this.value());
                },

                refresh: function() {
                    this.widget.check(this.bindings[CHECKED].get() === true);
                },

                value: function() {
                    var element = this.element,
                        value = element.value;

                    if (value == "on" || value == "off") {
                        value = element.checked;
                    }

                    return value;
                },

                destroy: function() {
                    this.widget.unbind(CHANGE, this._change);
                }
            });

            widgetBinders.visible = Binder.extend({

                ctor: function(widget, bindings, options) {
                    this._super(widget.element[0], bindings, options);
                    this.widget = widget;
                },

                refresh: function() {
                    var visible = this.bindings.visible.get();
                    this.widget.wrapper[0].style.display = visible ? "" : "none";
                }
            });

            widgetBinders.invisible = Binder.extend({

                ctor: function(widget, bindings, options) {
                    this._super(widget.element[0], bindings, options);
                    this.widget = widget;
                },

                refresh: function() {
                    var invisible = this.bindings.invisible.get();
                    this.widget.wrapper[0].style.display = invisible ? "none" : "";
                }
            });

            widgetBinders.enabled = Binder.extend({

                ctor: function(widget, bindings, options) {
                    this._super(widget.element[0], bindings, options);
                    this.widget = widget;
                },

                refresh: function() {
                    if (this.widget.enable) {
                        this.widget.enable(this.bindings.enabled.get());
                    }
                }
            });

            widgetBinders.disabled = Binder.extend({

                ctor: function(widget, bindings, options) {
                    this._super(widget.element[0], bindings, options);
                    this.widget = widget;
                },

                refresh: function() {
                    if (this.widget.enable) {
                        this.widget.enable(!this.bindings.disabled.get());
                    }
                }
            });

            widgetBinders.source = dataSourceBinding("source", "dataSource", "setDataSource");

            widgetBinders.value = Binder.extend({

                ctor: function(widget, bindings, options) {
                    this._super(widget.element[0], bindings, options);
                    this.widget = widget;
                    this._change = proxy(this.change, this);
                    this.widget.first(CHANGE, this._change);

                    var value = this.bindings.value.get();

                    //value == null
                    this._valueIsObservableObject = !options.valuePrimitive && value instanceof ObservableObject;
                    this._valueIsObservableArray = value instanceof ObservableArray;
                    this._initChange = false;
                },

                change: function() {
                    var value = this.widget.value(),
                        field = this.options.valueField || this.options.textField,
                        isArray = toString.call(value) === "[object Array]",
                        isObservableObject = this._valueIsObservableObject,
                        valueIndex, valueLength, values = [],
                        sourceItem, sourceValue,
                        idx, length, source;

                    this._initChange = true;

                    if (field) {

                        if (this.bindings.source) {
                            source = this.bindings.source.get();
                        }

                        if (value === "" && (isObservableObject || this.options.valuePrimitive)) {
                            value = null;
                        } else {
                            if (!source || source instanceof DataSource) {
                                source = this.widget.dataSource.view();
                            }

                            if (isArray) {
                                valueLength = value.length;
                                values = value.slice(0);
                            }

                            for (idx = 0, length = source.length; idx < length; idx++) {
                                sourceItem = source[idx];
                                sourceValue = sourceItem.get(field);

                                if (isArray) {
                                    for (valueIndex = 0; valueIndex < valueLength; valueIndex++) {
                                        if (sourceValue == values[valueIndex]) {
                                            values[valueIndex] = sourceItem;
                                            break;
                                        }
                                    }
                                } else if (sourceValue == value) {
                                    value = isObservableObject ? sourceItem : sourceValue;
                                    break;
                                }
                            }

                            if (values[0]) {
                                if (this._valueIsObservableArray) {
                                    value = values;
                                } else if (isObservableObject || !field) {
                                    value = values[0];
                                } else {
                                    value = values[0].get(field);
                                }
                            }
                        }
                    }

                    this.bindings.value.set(value);
                    this._initChange = false;
                },

                refresh: function() {
                    if (!this._initChange) {
                        var widget = this.widget;
                        var textField = this.options.textField;
                        var valueField = this.options.valueField || textField;
                        var value = this.bindings.value.get();
                        var text = this.options.text || "";
                        var idx = 0,
                            length;
                        var values = [];

                        if (value === undefined) {
                            value = null;
                        }

                        if (valueField) {
                            if (value instanceof ObservableArray) {
                                for (length = value.length; idx < length; idx++) {
                                    values[idx] = value[idx].get(valueField);
                                }
                                value = values;
                            } else if (value instanceof ObservableObject) {
                                text = value.get(textField);
                                value = value.get(valueField);
                            }
                        }

                        if (widget.options.autoBind === false && widget.listView && !widget
                            .listView.isBound()) {
                            if (textField === valueField && !text) {
                                text = value;
                            }

                            widget._preselect(value, text);
                        } else {
                            widget.value(value);
                        }
                    }

                    this._initChange = false;
                },

                destroy: function() {
                    this.widget.unbind(CHANGE, this._change);
                }
            });

            function parseBindings(bind) {
                var result = {},
                    idx,
                    length,
                    token,
                    colonIndex,
                    key,
                    value,
                    tokens;

                tokens = bind.match(regKeyValue);

                for (idx = 0, length = tokens.length; idx < length; idx++) {
                    token = tokens[idx];
                    colonIndex = token.indexOf(":");

                    key = token.substring(0, colonIndex);
                    value = token.substring(colonIndex + 1);

                    if (value.charAt(0) == "{") {
                        value = parseBindings(value);
                    }

                    result[key] = value;
                }

                return result;
            }

            function createBindings(bindings, source, type) {
                var binding,
                    result = {};

                for (binding in bindings) {
                    result[binding] = new type(source, bindings[binding]);
                }

                return result;
            }

            function rolesFromNamespaces(namespaces) {
                var roles = [],
                    idx,
                    length;

                if (!namespaces[0]) {
                    namespaces = [fly.ui];
                }

                for (idx = 0, length = namespaces.length; idx < length; idx++) {
                    roles[idx] = namespaces[idx].roles;
                }

                return $.extend.apply(null, [{}].concat(roles.reverse()));
            };

            function bindElement(element, source, roles, parents) {
                var role = element.getAttribute("data-role"),
                    bind = element.getAttribute("data-bind"),
                    children = element.children,
                    childrenCopy = [],
                    deep = true,
                    bindings,
                    options = {},
                    idx,
                    target;

                parents = parents || [source];

                if (role || bind) {
                    unbindElement(element);
                }

                if (role) {
                    target = bindingTargetForRole(element, roles);
                }

                if (bind) {
                    bind = parseBindings(bind.replace(regWhiteSpace, ""));

                    if (!target) {
                        options = utils.parseEleOptions(element, {
                            textField: "",
                            valueField: "",
                            template: "",
                            valueUpdate: "change",
                            valuePrimitive: false,
                            itemChange: true,
                            autoBind: true
                        });
                        options.roles = roles;
                        target = new BindingTarget(element, options);
                    }

                    target.source = source;

                    bindings = createBindings(bind, parents, Binding);

                    if (options.template) {
                        bindings.template = new TemplateBinding(parents, '', options.template);
                    }

                    if (bindings.click) {
                        bind.events = bind.events || {};
                        bind.events.click = bind.click;
                        bindings.click.destroy();
                        delete bindings.click;
                    }

                    if (bindings.source) {
                        deep = false;
                    }

                    if (bind.attr) {
                        bindings.attr = createBindings(bind.attr, parents, Binding);
                    }

                    if (bind.style) {
                        bindings.style = createBindings(bind.style, parents, Binding);
                    }

                    if (bind.events) {
                        bindings.events = createBindings(bind.events, parents,
                            EventBinding);
                    }

                    if (bind.css) {
                        bindings.css = createBindings(bind.css, parents, Binding);
                    }

                    target.bind(bindings);
                }

                if (target) {
                    element.flyBindingTarget = target;
                }

                if (deep && children) {
                    for (idx = 0; idx < children.length; idx++) {
                        childrenCopy[idx] = children[idx];
                    }

                    for (idx = 0; idx < childrenCopy.length; idx++) {
                        bindElement(childrenCopy[idx], source, roles, parents);
                    }
                }
            }

            function unbindElement(element) {
                var bindingTarget = element.flyBindingTarget;

                if (bindingTarget) {
                    bindingTarget.destroy();

                    if (deleteExpando) {
                        delete element.flyBindingTarget;
                    } else if (element.removeAttribute) {
                        element.removeAttribute("flyBindingTarget");
                    } else {
                        element.flyBindingTarget = null;
                    }
                }
            }

            function unbindElementTree(element) {
                unbindElement(element);

                unbindElementChildren(element);
            }

            function unbindElementChildren(element) {
                var children = element.children;

                if (children) {
                    for (var idx = 0, length = children.length; idx < length; idx++) {
                        unbindElementTree(children[idx]);
                    }
                }
            }

            function unbind(dom) {
                var idx, length;

                dom = $(dom);

                for (idx = 0, length = dom.length; idx < length; idx++) {
                    unbindElementTree(dom[idx]);
                }
            }

            function bind(dom, object) {
                var idx,
                    length,
                    node,
                    roles = rolesFromNamespaces([].slice.call(arguments, 2));

                $(dom).each(function() {
                    node = $(this)[0];
                    if (node.nodeType === 1) {
                        bindElement(node, object, roles);
                    }
                });
            }

            function notify(widget) {
                var element = widget.element,
                    bindingTarget = element[0].flyBindingTarget;

                if (bindingTarget) {
                    bind(element, bindingTarget.source);
                }
            }

            function retrievePrimitiveValues(value, valueField) {
                var values = [];
                var idx = 0;
                var length;
                var item;

                if (!valueField) {
                    return value;
                }

                if (value instanceof ObservableArray) {
                    for (length = value.length; idx < length; idx++) {
                        item = value[idx];
                        values[idx] = item.get ? item.get(valueField) : item[valueField];
                    }
                    value = values;
                } else if (value instanceof ObservableObject) {
                    value = value.get(valueField);
                }

                return value;
            }

            function bindingTargetForRole(element, roles) {
                var widget = fly.ui.initWidget(element, {}, roles);

                if (widget) {
                    return new WidgetBindingTarget(widget);
                }
            }

            function dataSourceBinding(bindingName, fieldName, setter) {
                return Binder.extend({

                    ctor: function(widget, bindings, options) {
                        var that = this;

                        that._super(widget.element[0], bindings, options);

                        that.widget = widget;
                        that._dataBinding = proxy(that.dataBinding, that);
                        that._dataBound = proxy(that.dataBound, that);
                        that._itemChange = proxy(that.itemChange, that);
                    },

                    itemChange: function(e) {
                        bindElement(e.item[0], e.data, this._ns(e.ns), [e.data].concat(
                            this.bindings[bindingName]._parents()));
                    },

                    dataBinding: function(e) {
                        var idx,
                            length,
                            widget = this.widget,
                            items = e.removedItems || widget.items();

                        for (idx = 0, length = items.length; idx < length; idx++) {
                            unbindElementTree(items[idx]);
                        }
                    },

                    _ns: function(ns) {
                        ns = ns || fly.ui;
                        return rolesFromNamespaces([ns]);
                    },

                    dataBound: function(e) {
                        var idx,
                            length,
                            widget = this.widget,
                            items = e.addedItems || widget.items(),
                            dataSource = widget[fieldName],
                            view,
                            parents;

                        if (items.length) {
                            view = e.addedDataItems || dataSource.view();
                            parents = this.bindings[bindingName]._parents();

                            for (idx = 0, length = view.length; idx < length; idx++) {
                                bindElement(items[idx], view[idx], this._ns(e.ns), [
                                    view[idx]
                                ].concat(parents));
                            }
                        }
                    },

                    refresh: function(e) {
                        var that = this,
                            source,
                            widget = that.widget;

                        e = e || {};

                        if (!e.action) {
                            that.destroy();

                            widget.bind("dataBinding", that._dataBinding);
                            widget.bind("dataBound", that._dataBound);
                            widget.bind("itemChange", that._itemChange);

                            source = that.bindings[bindingName].get();

                            if (widget[fieldName] instanceof DataSource && widget[
                                fieldName] != source) {
                                if (source instanceof DataSource) {
                                    widget[setter](source);
                                } else if (source && source._dataSource) {
                                    widget[setter](source._dataSource);
                                } else {
                                    widget[fieldName].data(source);
                                    // widget instanceof ui.MultiSelect
                                    if (that.bindings.value && (widget instanceof ui.Select)) {
                                        widget.value(retrievePrimitiveValues(that.bindings
                                            .value.get(), widget.options.valueField
                                        ));
                                    }
                                }
                            }
                        }
                    },

                    destroy: function() {
                        var widget = this.widget;

                        widget.unbind("dataBinding", this._dataBinding);
                        widget.unbind("dataBound", this._dataBound);
                        widget.unbind("itemChange", this._itemChange);
                    }
                });
            }

            fly.bind = bind;
            fly.unbind = unbind;
            fly.notify = notify;

            module.exports = bind;

        }, {
            "./fly.core": 4,
            "./fly.data": 5,
            "./fly.template": 12,
            "./fly.ui": 13,
            "./fly.utils": 14
        }
    ],
    2: [
        function(require, module, exports) {
            /**
             * 精确计算
             * @author: huanzhang
             * @email: huanzhang@iflytek.com
             * @update: 2015-07-27
             */

            'use strict';

            // 依赖core
            var fly = require("./fly.core");

            var calculate = {},
                math = Math;

            /**
             * 获取小数位数
             * @param {Number} num 小数部分位数
             */
            var digits = function(num) {
                var length;
                try {
                    length = num.toString().split('.')[1].length;
                } catch (e) {
                    length = 0;
                }
                return length;
            };

            /**
             * 将小数化为整数
             * @param {Number} num 化整后的整数
             */
            var integer = function(num) {
                return Number(num.toString().replace('.', ''));
            }

            /**
             * 加法运算
             * @param   {Number} arg1 被加数
             * @param   {Number} arg2 加数
             * @returns {Number} 和
             */
            calculate.add = function(arg1, arg2) {
                var n = math.max(digits(arg1), digits(arg2)),
                    m = math.pow(10, n);
                return math.floor(arg1 * m + arg2 * m) / m;
            };

            /**
             * 减法运算
             * @param   {Number} arg1 被减数
             * @param   {Number} arg2 减数
             * @returns {Number} 差
             */
            calculate.sub = function(arg1, arg2) {
                var n = math.max(digits(arg1), digits(arg2)),
                    m = math.pow(10, n);
                return math.floor(arg1 * m - arg2 * m) / m;
            };

            /**
             * 乘法运算
             * @param   {Number} arg1 被乘数
             * @param   {Number} arg2 乘数
             * @returns {Number} 积
             */
            calculate.mul = function(arg1, arg2) {
                var n = digits(arg1) + digits(arg2),
                    m = math.pow(10, n);
                return integer(arg1) * integer(arg2) / m;
            };

            /**
             * 除法运算
             * @param   {Number} arg1 被除数
             * @param   {Number} arg2 除数
             * @returns {Number} 商
             */
            calculate.div = function(arg1, arg2) {
                var n = digits(arg2) - digits(arg1),
                    m = math.pow(10, n);
                return (integer(arg1) / integer(arg2)) * m;
            };

            fly.calc = calculate;
            module.exports = calculate;
        }, {
            "./fly.core": 4
        }
    ],
    3: [
        function(require, module, exports) {
            /**
             * class基类
             * John Resig Class.js
             * 因为callee，这里不能使用严格模式
             * @author: huanzhang
             * @email: huanzhang@iflytek.com
             * @update: 2015-07-01
             */

            var fly = require('./fly.core');

            var Class = function() {};

            var CTOR = 'ctor', //构造函数名
                EXTEND = 'extend',
                FUNCTION = 'function';

            /**
             * 给基类增加一个extend方法
             * @param   {Object}   prop 扩展的属性
             * @returns {[[Type]]} [[Description]]
             */
            Class.extend = function(prop) {

                var _super = this.prototype;

                // 父类的实例赋给变量prototype
                var prototype = new this();

                // 把要扩展的属性复制到prototype变量上
                for (var name in prop) {
                    // this._super访问父类的实例
                    prototype[name] = name == CTOR && typeof prop[name] == FUNCTION &&
                        typeof _super[name] == FUNCTION ?
                        (function(name, fn) {
                        return function() {
                            // 备份this._super
                            var tmp = this._super;
                            // 替换成父类的同名ctor方法
                            this._super = _super[name];
                            // 此时fn中的this里面的this._super已经换成了_super[name],即父类的同名方法
                            var ret = fn.apply(this, arguments);
                            // 把备份的还原回去
                            this._super = tmp;
                            return ret;
                        };
                    })(name, prop[name]) :
                        prop[name];
                }

                // 假的构造函数
                function Class() {
                    // 执行真正的ctor构造函数
                    this.ctor.apply(this, arguments);
                }

                // 继承父类的静态属性
                for (var key in this) {
                    if (this.hasOwnProperty(key) && key != EXTEND)
                        Class[key] = this[key];
                }

                // 子类的原型指向父类的实例
                Class.prototype = prototype;

                // 父类的实例
                Class.prototype._super = new this();

                // 覆盖父类的静态属性
                if (prop.statics) {
                    for (var name in prop.statics) {
                        if (prop.statics.hasOwnProperty(name)) {
                            Class[name] = prop.statics[name];
                            if (name == CTOR) {
                                Class[name]();
                            }
                        }
                    }
                }

                Class.prototype.constructor = Class;

                // 原型可扩展
                Class.extendPrototype = function(prop) {
                    for (var name in prop) {
                        prototype[name] = prop[name];
                    }
                };

                Class.fn = Class.prototype;
                // 任何Class.extend的返回对象都将具备extend方法
                Class.extend = arguments.callee;

                return Class;
            };

            fly.Class = Class;
            module.exports = Class;
        }, {
            "./fly.core": 4
        }
    ],
    4: [
        function(require, module, exports) {
            /**
             * 基础代码
             * @author: huanzhang
             * @email: huanzhang@iflytek.com
             * @update: 2015-06-01 15:20
             */

            'use strict';

            // 依赖jQuery
            //var $ = require("jquery");

            // 命名空间
            var fly = window.fly = window.fly || {};

            // 路径
            var URLFLAG = 'js/flyui';

            // 缓存jquery
            fly.$ = $;

            // 缓存window对象
            fly.$win = $(window);

            // 缓存document对象
            fly.$doc = $(document);

            // 缓存html
            fly.$html = $('html');

            // 常用键值
            fly.keys = {
                INSERT: 45,
                DELETE: 46,
                BACKSPACE: 8,
                TAB: 9,
                ENTER: 13,
                ESC: 27,
                LEFT: 37,
                UP: 38,
                RIGHT: 39,
                DOWN: 40,
                END: 35,
                HOME: 36,
                SPACEBAR: 32,
                PAGEUP: 33,
                PAGEDOWN: 34,
                F10: 121,
                F12: 123,
                NUMPAD_PLUS: 107,
                NUMPAD_MINUS: 109,
                NUMPAD_DOT: 110
            };

            // 命名空间
            fly.NS = 'fly';

            var extend = $.extend,
                _scrollbar, // 滚动条宽度
                effects = {}, // 效果库
                support = {}, // 特性支持
                OLDDISPLAY = 'olddisplay';

            // 监视DOM改变
            support.mutationobserver = window.MutationObserver ||
                window.WebKitMutationObserver || null;

            // 是否支持html5
            support.html5 = (function() {
                var i = document.createElement('input'),
                    result;
                i.setAttribute('type', 'range');
                result = i.type != 'text';
                i = null;
                return result;
            })();

            // 是否支持触屏
            /*support.touch = (
    ('ontouchstart' in document) ||
    (global.DocumentTouch && document instanceof global.DocumentTouch) || //非IE
    (global.navigator.msPointerEnabled && global.navigator.msMaxTouchPoints > 0) || //IE 10
    (global.navigator.pointerEnabled && global.navigator.maxTouchPoints > 0) || //IE >=11
    false
);*/

            // 获取滚动条宽度
            support.scrollbar = function(refresh) {
                var div, result;

                if (!isNaN(_scrollbar) && !refresh) {
                    return _scrollbar;
                }

                div = document.createElement('div');
                div.style.cssText =
                    'overflow:scroll;overflow-x:hidden;zoom:1;clear:both;display:block';
                div.innerHTML = '&nbsp;';
                document.body.appendChild(div);

                result = div.offsetWidth - div.scrollWidth;
                document.body.removeChild(div);
                div = null;
                return result;
            };

            // 是否可以直接删除扩展
            support.deleteExpando = (function() {
                var a = document.createElement('a');
                try {
                    delete a.test;
                } catch (e) {
                    return false;
                }
                return true;
            })();

            // 识别浏览器
            fly.browser = (function() {
                var browser = {},
                    userAgent = navigator.userAgent;
                if (userAgent.indexOf("Opera") > -1) {
                    browser.opera = 1;
                } else if (userAgent.indexOf("Firefox") > -1) {
                    browser.firefox = 1;
                } else if (userAgent.indexOf("Chrome") > -1) {
                    browser.chrome = 1;
                } else if (userAgent.indexOf("Safari") > -1) {
                    browser.safari = 1;
                } else if (!!window.ActiveXObject || "ActiveXObject" in window) {
                    new RegExp("MSIE (\\d+\\.\\d+);").test(userAgent);
                    browser.ie = parseInt(RegExp.$1 || 11);
                }
                return browser;
            })();

            // 获取当前路径
            // 不论是以何种方式加载，都不能改变flyui的名称
            /*fly.path = (function(script, key, i, me, thisScript) {
    for (i in script) {
        if (script[i].src && script[i].src.indexOf(key) !== -1) {
            me = script[i];
        }
    };
    thisScript = me || script[script.length - 1];
    me = thisScript.src.replace(/\\/g, '/');
    return me.lastIndexOf('/') < 0 ? '.' :
        me.substring(0, me.lastIndexOf(key));
}(document.getElementsByTagName('script'), URLFLAG));*/

            /**
             * 生成标准GUID
             * @return {String} 32位GUID字符串
             */
            fly.guid = function() {
                return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(
                    c) {
                    var r = Math.random() * 16 | 0,
                        v = c == 'x' ? r : (r & 0x3 | 0x8);
                    return v.toString(16);
                }).toUpperCase();
            };

            /**
             * 恒等
             * 在某些没有默认值的时候使用
             * @param   {Any} o 任何输入
             * @returns {Any} 输出
             */
            fly.identity = function(o) {
                return o;
            }

            /**
             * 处理动画需要的参数
             * @param   {object}   options  效果参数
             * @param   {number}   duration 持续时间
             * @param   {boolean}  reverse  是否反转
             * @param   {function} complete 完成回调
             * @returns {object}   完整的动画参数
             */
            function prepareAnimationOptions(options, duration, reverse, complete) {
                if (typeof options === 'string') {

                    if (isFunction(duration)) {
                        complete = duration;
                        duration = 400;
                        reverse = false;
                    }

                    if (isFunction(reverse)) {
                        complete = reverse;
                        reverse = false;
                    }

                    if (typeof duration === BOOLEAN) {
                        reverse = duration;
                        duration = 400;
                    }

                    options = {
                        effects: options,
                        duration: duration,
                        reverse: reverse,
                        complete: complete
                    };
                }

                return extend({
                    effects: {},
                    duration: 400,
                    reverse: false,
                    init: $.noop,
                    teardown: $.noop,
                    hide: false
                }, options, {
                    completeCallback: options.complete,
                    complete: $.noop
                });
            }

            /**
             * 执行动画效果
             * @param   {object}   element  承载动画效果的Element
             * @param   {object}   options  效果参数
             * @param   {number}   duration 持续时间
             * @param   {boolean}  reverse  是否反转
             * @param   {function} complete 回调
             * @returns {object}   承载动画效果的Element
             */
            function animate(options, duration, reverse, complete) {
                var idx = 0,
                    element = this,
                    length = element.length,
                    instance;

                for (; idx < length; idx++) {
                    instance = $(element[idx]);
                    instance.queue(function() {
                        effects.promise(instance, prepareAnimationOptions(options, duration,
                            reverse,
                            complete));
                    });
                }

                return element;
            }

            extend(effects, {
                enabled: true,

                Element: function(element) {
                    this.element = $(element);
                },

                promise: function(element, options) {
                    if (!element.is(":visible")) {
                        element.css("display", element.data(OLDDISPLAY) || "block");
                    }

                    options.hide && element.data(OLDDISPLAY, element.css("display")).hide();
                    options.init && options.init();
                    options.completeCallback && options.completeCallback(element);

                    element.dequeue();
                },

                disable: function() {
                    this.enabled = false;
                    this.promise = this.promiseShim;
                },

                enable: function() {
                    this.enabled = true;
                    this.promise = this.animatedPromise;
                }
            });

            effects.promiseShim = effects.promise;

            extend($.fn, {
                animated: function() {
                    return animate.apply(this, arguments);
                }
            });

            extend($.expr[':'], {
                focusable: function(element) {
                    var idx = $.attr(element, "tabindex"),
                        nodeName = element.nodeName.toLowerCase(),
                        isTabIndexNotNaN = !isNaN(idx) && idx > -1;

                    if (/input|select|textarea|button|object/.test(nodeName) ?
                        !element.disabled :
                        "a" === nodeName ?
                        element.href || isTabIndexNotNaN :
                        isTabIndexNotNaN
                    ) {
                        return !$(element).parents().addBack().filter(function() {
                            return $.css(this, "visibility") === "hidden" || $.expr.filters
                                .hidden(this);
                        }).length;
                    }
                }
            });

            fly.support = support;

            module.exports = fly;

        }, {}
    ],
    5: [
        function(require, module, exports) {
            /**
             * 数据对象
             * @author: huanzhang
             * @email: huanzhang@iflytek.com
             * @update: 2015-09-06
             */

            'use strict';

            // 依赖
            var fly = require('./fly.core'),
                ob = require('./fly.observable'),
                Model = require('./fly.model'),
                format = require('./fly.format'),
                utils = require('./fly.utils'),
                Class = fly.Class,
                Observable = fly.Observable,
                ObservableObject = fly.ObservableObject,
                ObservableArray = fly.ObservableArray,
                LazyObservableArray = fly.LazyObservableArray,
                identity = fly.identity,
                getter = fly.getter,
                $ = fly.$,
                each = $.each,
                map = $.map,
                proxy = $.proxy,
                extend = $.extend,
                isEmptyObject = $.isEmptyObject,
                isPlainObject = $.isPlainObject,
                isFunction = $.isFunction,
                isNumber = $.isNumeric,
                isArray = $.isArray,
                grep = $.grep,
                noop = $.noop,
                Deferred = $.Deferred,
                ajax = $.ajax,
                slice = [].slice,
                math = Math;

            // 数据对象
            var data = {};

            // 静态变量
            var FUNCTION = 'function',
                STRING = 'string',
                CHANGE = 'change',
                CREATE = 'create',
                READ = 'read',
                UPDATE = 'update',
                DESTROY = 'destroy',
                ERROR = 'error',
                REQUESTSTART = 'requestStart',
                PROGRESS = 'progress',
                REQUESTEND = 'requestEnd',
                EMPTY = 'empty',
                PUSH = 'push',
                CRUD = [CREATE, READ, UPDATE, DESTROY],
                ARR = '[object Array]';

            // 操作符转换
            var operatorMap = {
                '==': 'eq',
                '!=': 'neq',
                '<': 'lt',
                '<=': 'lte',
                '>': 'gt',
                '>=': 'gte',
                notsubstringof: 'doesnotcontain'
            };

            // 正则
            var dateRegExp = /^\/Date\((.*?)\)\/$/,
                newLineRegExp = /(\r+|\n+)/g,
                quoteRegExp = /(?=['\\])/g;


            var DataSource = Observable.extend({

                ctor: function(options) {
                    if (!options) return;

                    var that = this,
                        options = options || {},
                        data = options.data,
                        read = options.read,
                        model;

                    // 兼容老版本的写法
                    if (data && data.url) {
                        read = data;
                    } else if (typeof data == STRING) {
                        read = {
                            url: data
                        };
                    } else if (isArray(data)) {
                        options.server = false;
                        options.pageMode = 0;
                    }

                    // 如果存在read接口，则需要设置server属性为true
                    // 同时对url进行处理
                    if (read) {
                        options.read = $.extend(read, {
                            url: utils.url(read.url)
                        });
                    }

                    // 继承options
                    options = that.options = extend({}, that.options, options);

                    that._map = {};
                    that._prefetch = {}; // 预拉取
                    that._data = []; // 初始数据
                    that._pristineData = []; // 关键数据
                    that._ranges = [];
                    that._view = [];
                    that._pristineTotal = 0;
                    that._destroyed = []; // 已销毁
                    that._pageSize = options.pageSize;
                    that._page = options.page || (options.pageSize ? 1 : undefined); // 当前页码
                    that._sort = normalizeSort(options.sort);
                    that._filter = normalizeFilter(options.filter);
                    that._total = options.total;

                    that._shouldDetachObservableParents = true;

                    that._super();

                    that.transport = Transport.create(options, that);

                    if (isFunction(that.transport.push)) {
                        that.transport.push({
                            pushCreate: proxy(that._pushCreate, that),
                            pushUpdate: proxy(that._pushUpdate, that),
                            pushDestroy: proxy(that._pushDestroy, that)
                        });
                    }

                    that.reader = new DataReader(options.model, options.modelBase, read ||
                        options.childrenField);

                    model = that.reader.model || {};

                    that._detachObservableParents();

                    that._data = that._observe(that._data);
                    that._online = true;

                    that.bind(["push", ERROR, CHANGE, REQUESTSTART, REQUESTEND,
                        PROGRESS
                    ], options);
                },

                options: {
                    data: null,
                    interface: {},
                    server: true,
                    serverPage: true,
                    pageMode: 1 // 翻页方式 1.使用currentPageNo直接请求当前页码  0.使用skip和take控制
                },

                parent: noop,

                /**
                 * 获取item
                 * @param   {String} id          值
                 * @param   {String} [key='id',] 字段名
                 * @returns {Object} 符合条件的data
                 */
                get: function(id, key) {
                    var data = this._data,
                        key = key || 'id',
                        idx,
                        length;

                    for (idx = 0, length = data.length; idx < length; idx++) {
                        if (data[idx][key] == id) {
                            return data[idx];
                        }
                    }
                },

                /**
                 * 获取指定uid的item
                 * @param   {string} id UID
                 * @returns {object} 符合条件的data
                 */
                getByUid: function(id) {
                    var data = this._data,
                        idx,
                        length;

                    if (!data) {
                        return null;
                    }

                    for (idx = 0, length = data.length; idx < length; idx++) {
                        if (data[idx].uid == id) {
                            return data[idx];
                        }
                    }
                },

                indexOf: function(model) {
                    return indexOfModel(this._data, model);
                },

                at: function(index) {
                    return this._data.at(index);
                },

                data: function(value) {
                    var that = this;
                    if (value !== undefined) {
                        that._detachObservableParents();
                        that._data = this._observe(value);

                        that._pristineData = value.slice(0);

                        that._storeData();

                        that._ranges = [];
                        that.trigger('reset');
                        that._addRange(that._data);

                        that._total = that._data.length;
                        that._pristineTotal = that._total;

                        that._process(that._data);
                    } else {
                        if (that._data) {
                            for (var idx = 0; idx < that._data.length; idx++) {
                                that._data.at(idx);
                            }
                        }

                        return that._data;
                    }
                },

                _index: function(data) {
                    var skip = this.skip() || 0;
                    each(data, function(i, item) {
                        if (item != undefined && item != null) {
                            item['_index'] = skip + i + 1;
                        }
                    });
                    return data;
                },

                view: function(value) {
                    if (value === undefined) {
                        return this._view;
                    } else {
                        this._view = this._observeView(value);
                    }
                },

                _observeView: function(data) {
                    var that = this;
                    replaceWithObservable(data, that._data, that._ranges, that.reader.model ||
                        ObservableObject, false);

                    var view = new LazyObservableArray(data, that.reader.model);
                    view.parent = function() {
                        return that.parent();
                    };
                    return view;
                },

                _createNewModel: function(model) {
                    if (this.reader.model) {
                        return new this.reader.model(model);
                    }

                    if (model instanceof ObservableObject) {
                        return model;
                    }

                    return new ObservableObject(model);
                },

                insert: function(index, model) {
                    if (!model) {
                        model = index;
                        index = 0;
                    }

                    if (!(model instanceof Model)) {
                        model = this._createNewModel(model);
                    }

                    this._data.splice(index, 0, model);

                    return model;
                },

                add: function(model) {
                    return this.insert(this._data.length, model);
                },

                pushCreate: function(items) {
                    if (!isArray(items)) {
                        items = [items];
                    }

                    var pushed = [];
                    var autoSync = this.options.autoSync;
                    this.options.autoSync = false;

                    try {
                        for (var idx = 0; idx < items.length; idx++) {
                            var item = items[idx],
                                result = this.add(item),
                                pristine = result.toJSON();

                            pushed.push(result);
                            this._pristineData.push(pristine);
                        }
                    } finally {
                        this.options.autoSync = autoSync;
                    }

                    if (pushed.length) {
                        this.trigger(PUSH, {
                            type: CREATE,
                            items: pushed
                        });
                    }
                },

                pushUpdate: function(items) {
                    if (!isArray(items)) {
                        items = [items];
                    }

                    var pushed = [];

                    for (var idx = 0; idx < items.length; idx++) {
                        var item = items[idx],
                            model = this._createNewModel(item),
                            target = this.get(model.id);

                        if (target) {
                            pushed.push(target);
                            target.accept(item);
                            target.trigger(CHANGE);
                            this._updatePristineForModel(target, item);
                        } else {
                            this.pushCreate(item);
                        }
                    }

                    if (pushed.length) {
                        this.trigger(PUSH, {
                            type: UPDATE,
                            items: pushed
                        });
                    }
                },

                pushDestroy: function(items) {
                    var pushed = this._removeItems(items);

                    if (pushed.length) {
                        this.trigger(PUSH, {
                            type: DESTROY,
                            items: pushed
                        });
                    }
                },

                _pushCreate: function(result) {
                    this._push(result, "pushCreate");
                },

                _pushUpdate: function(result) {
                    this._push(result, "pushUpdate");
                },

                _pushDestroy: function(result) {
                    this._push(result, "pushDestroy");
                },

                _push: function(result, operation) {
                    var data = this._readData(result);

                    if (!data) {
                        data = result;
                    }

                    this[operation](data);
                },

                _removeItems: function(items) {
                    if (!isArray(items)) {
                        items = [items];
                    }

                    var destroyed = [],
                        autoSync = this.options.autoSync;
                    this.options.autoSync = false;

                    try {
                        for (var idx = 0; idx < items.length; idx++) {
                            var item = items[idx],
                                model = this._createNewModel(item),
                                found = false;

                            this._eachItem(this._data, function(items) {
                                for (var idx = 0; idx < items.length; idx++) {
                                    var item = items.at(idx);
                                    if (item.id === model.id) {
                                        destroyed.push(item);
                                        items.splice(idx, 1);
                                        found = true;
                                        break;
                                    }
                                }
                            });

                            if (found) {
                                this._removePristineForModel(model);
                                this._destroyed.pop();
                            }
                        }
                    } finally {
                        this.options.autoSync = autoSync;
                    }

                    return destroyed;
                },

                remove: function(model) {
                    var result,
                        that = this;

                    this._eachItem(that._data, function(items) {
                        removeModel(items, model);
                    });

                    this._removeModelFromRanges(model);

                    this._updateRangesLength();

                    return model;
                },

                /**
                 * 返回已销毁的数据
                 * @returns {Array} 已销毁的数据
                 */
                destroyed: function() {
                    return this._destroyed;
                },

                created: function() {
                    var idx,
                        length,
                        result = [],
                        data = this._data;

                    for (idx = 0, length = data.length; idx < length; idx++) {
                        if (data[idx].isNew && data[idx].isNew()) {
                            result.push(data[idx]);
                        }
                    }
                    return result;
                },

                updated: function() {
                    var idx,
                        length,
                        result = [],
                        data = this._data;

                    for (idx = 0, length = data.length; idx < length; idx++) {
                        if ((data[idx].isNew && !data[idx].isNew()) && data[idx].dirty) {
                            result.push(data[idx]);
                        }
                    }
                    return result;
                },

                cancelChanges: function(model) {
                    var that = this;

                    if (model instanceof Model) {
                        that._cancelModel(model);
                    } else {
                        that._destroyed = [];
                        that._detachObservableParents();
                        that._data = that._observe(that._pristineData);
                        if (that.options.server) {
                            that._total = that._pristineTotal;
                        }

                        that._ranges = [];
                        that._addRange(that._data);

                        that._change();
                    }
                },

                hasChanges: function() {
                    var data = this._data,
                        idx,
                        length;

                    if (this._destroyed.length) {
                        return true;
                    }

                    for (idx = 0, length = data.length; idx < length; idx++) {
                        if ((data[idx].isNew && data[idx].isNew()) || data[idx].dirty) {
                            return true;
                        }
                    }

                    return false;
                },

                _updatePristineForModel: function(model, values) {
                    this._executeOnPristineForModel(model, function(index, items) {
                        extend(true, items[index], values);
                    });
                },

                _executeOnPristineForModel: function(model, callback) {
                    this._eachPristineItem(
                        function(items) {
                            var index = indexOfPristineModel(items, model);
                            if (index > -1) {
                                callback(index, items);
                                return true;
                            }
                        });
                },

                _removePristineForModel: function(model) {
                    this._executeOnPristineForModel(model, function(index, items) {
                        items.splice(index, 1);
                    });
                },

                _readData: function(data) {
                    var read = this.reader.data;
                    return read.call(this.reader, data);
                },

                _eachPristineItem: function(callback) {
                    this._eachItem(this._pristineData, callback);
                },

                _eachItem: function(data, callback) {
                    if (data && data.length) {
                        callback(data);
                    }
                },

                _pristineForModel: function(model) {
                    var pristine,
                        idx,
                        callback = function(items) {
                            idx = indexOfPristineModel(items, model);
                            if (idx > -1) {
                                pristine = items[idx];
                                return true;
                            }
                        };

                    this._eachPristineItem(callback);

                    return pristine;
                },

                _cancelModel: function(model) {
                    var pristine = this._pristineForModel(model);

                    this._eachItem(this._data, function(items) {
                        var idx = indexOfModel(items, model);
                        if (idx >= 0) {
                            if (pristine && (!model.isNew() || pristine.__state__)) {
                                items[idx].accept(pristine);
                            } else {
                                items.splice(idx, 1);
                            }
                        }
                    });
                },

                read: function(data) {
                    var that = this,
                        params = that._params(data);
                    var deferred = Deferred();

                    that._queueRequest(params, function() {
                        var isPrevented = that.trigger(REQUESTSTART, {
                            type: READ
                        });
                        if (!isPrevented) {
                            that.trigger(PROGRESS);

                            that._ranges = [];
                            that.trigger("reset");
                            if (that._online) {
                                that.transport.read({
                                    data: params,
                                    cache: false,
                                    success: function(data) {
                                        that.success(data);
                                        deferred.resolve();
                                    },
                                    error: function() {
                                        var args = slice.call(arguments);
                                        that.error.apply(that, args);
                                        deferred.reject.apply(deferred, args);
                                    }
                                });
                            }
                        } else {
                            that._dequeueRequest();

                            deferred.resolve(isPrevented);
                        }
                    });

                    return deferred.promise();
                },

                success: function(data) {
                    var that = this,
                        options = that.options;

                    that.trigger(REQUESTEND, {
                        response: data,
                        type: READ
                    });

                    if (that._online) {
                        data = that.reader.parse(data);

                        if (that._handleCustomErrors(data)) {
                            that._dequeueRequest();
                            return;
                        }

                        that._total = that.reader.total(data);

                        data = that._readData(data);
                    } else {
                        data = that._readData(data);

                        var items = [];

                        for (var idx = 0; idx < data.length; idx++) {
                            var item = data[idx];
                            var state = item.__state__;

                            if (state == "destroy") {
                                this._destroyed.push(this._createNewModel(item));
                            } else {
                                items.push(item);
                            }
                        }

                        data = items;

                        that._total = data.length;
                    }

                    that._pristineTotal = that._total;

                    that._pristineData = data.slice(0);

                    that._detachObservableParents();

                    that._data = that._observe(data);

                    that._storeData();

                    that._addRange(that._data);

                    that._process(that._data);

                    that._dequeueRequest();
                },

                _detachObservableParents: function() {
                    if (this._data && this._shouldDetachObservableParents) {
                        for (var idx = 0; idx < this._data.length; idx++) {
                            if (this._data[idx].parent) {
                                this._data[idx].parent = noop;
                            }
                        }
                    }
                },

                _storeData: function(updatePristine) {
                    var server = this.options.server;
                    var model = this.reader.model;

                    function items(data) {
                        var state = [];

                        for (var idx = 0; idx < data.length; idx++) {
                            var dataItem = data.at(idx);
                            var item = dataItem.toJSON();

                            if (server && dataItem.items) {
                                item.items = items(dataItem.items);
                            } else {
                                item.uid = dataItem.uid;

                                if (model) {
                                    if (dataItem.isNew()) {
                                        item.__state__ = "create";
                                    } else if (dataItem.dirty) {
                                        item.__state__ = "update";
                                    }
                                }
                            }
                            state.push(item);
                        }

                        return state;
                    }
                },

                _addRange: function(data) {
                    var that = this,
                        start = that._skip || 0,
                        end = start + data.length;

                    that._ranges.push({
                        start: start,
                        end: end,
                        data: data
                    });
                    that._ranges.sort(function(x, y) {
                        return x.start - y.start;
                    });
                },

                error: function(xhr, status, errorThrown) {
                    this._dequeueRequest();
                    this.trigger(REQUESTEND, {});
                    this.trigger(ERROR, {
                        xhr: xhr,
                        status: status,
                        errorThrown: errorThrown
                    });
                },

                _pageParam: function() {
                    return !this.options.pageMode ? {
                        take: this.take(),
                        skip: this.skip(),
                        page: this.page()
                    } : {
                        currentPageNo: this.page()
                    };
                },

                _params: function(data) {
                    var that = this,
                        pageParam = that._pageParam(),
                        thatOptions = that.options,
                        options = extend(pageParam, {
                            pageSize: that.pageSize(),
                            sort: that._sort
                        }, data);

                    if (!thatOptions.server) {
                        if (!thatOptions.pageSize) {
                            delete options.take;
                            delete options.skip;
                        }
                        delete options.page;
                        delete options.pageSize;
                        delete options.currentPageNo;
                    }

                    return options;
                },

                _queueRequest: function(options, callback) {
                    var that = this;
                    if (!that._requestInProgress) {
                        that._requestInProgress = true;
                        that._pending = undefined;
                        callback();
                    } else {
                        that._pending = {
                            callback: proxy(callback, that),
                            options: options
                        };
                    }
                },

                _dequeueRequest: function() {
                    var that = this;
                    that._requestInProgress = false;
                    if (that._pending) {
                        that._queueRequest(that._pending.options, that._pending.callback);
                    }
                },

                _handleCustomErrors: function(response) {
                    var errors = this.reader.errors(response);
                    if (!errors) {
                        return false;
                    }

                    this.trigger(errors == EMPTY ? EMPTY : ERROR, {
                        xhr: null,
                        status: "customerror",
                        errorThrown: "custom error",
                        errors: errors
                    });
                    return true;
                },

                _observe: function(data) {
                    var that = this,
                        model = that.reader.model,
                        wrap = false;

                    that._shouldDetachObservableParents = true;

                    if (model && data.length) {
                        wrap = !(data[0] instanceof model);
                    }

                    if (data instanceof ObservableArray) {
                        that._shouldDetachObservableParents = false;
                        if (wrap) {
                            data.type = that.reader.model;
                            data.wrapAll(data, data);
                        }
                    } else {
                        var arrayType = that.pageSize() && !that.options.server ?
                            LazyObservableArray : ObservableArray;
                        data = new arrayType(data, that.reader.model);
                        data.parent = function() {
                            return that.parent();
                        };
                    }

                    if (that._changeHandler && that._data && that._data instanceof ObservableArray) {
                        that._data.unbind(CHANGE, that._changeHandler);
                    } else {
                        that._changeHandler = proxy(that._change, that);
                    }

                    return data.bind(CHANGE, that._changeHandler);
                },

                _change: function(e) {
                    var that = this,
                        idx, length, action = e ? e.action : "";

                    if (action === "remove") {
                        for (idx = 0, length = e.items.length; idx < length; idx++) {
                            if (!e.items[idx].isNew || !e.items[idx].isNew()) {
                                that._destroyed.push(e.items[idx]);
                            }
                        }
                    }

                    var total = parseInt(that._total, 10);
                    if (!isNumber(that._total)) {
                        total = parseInt(that._pristineTotal, 10);
                    }
                    if (action === "add") {
                        total += e.items.length;
                    } else if (action === "remove") {
                        total -= e.items.length;
                    } else if (action !== "itemchange" && action !== "sync" && !that.options
                        .server) {
                        total = that._pristineTotal;
                    } else if (action === "sync") {
                        total = that._pristineTotal = parseInt(that._total, 10);
                    }

                    that._total = total;

                    that._process(that._data, e);
                },

                _process: function(data, e) {
                    var that = this,
                        options = {},
                        result;

                    if (that.options.server !== true) {
                        options.skip = that._skip;
                        options.take = that._take || that._pageSize;

                        if (options.skip === undefined && that._page !== undefined &&
                            that._pageSize !==
                            undefined) {
                            options.skip = (that._page - 1) * that._pageSize;
                        }
                    }

                    if (that.options.server !== true) {
                        options.sort = that._sort;
                        options.filter = that._filter;
                    }

                    result = that._queryProcess(data, options);

                    that.view(that._index(result.data));

                    if (result.total !== undefined && !that.options.server) {
                        that._total = result.total;
                    }

                    e = e || {};

                    e.items = e.items || that._view;

                    that.trigger(CHANGE, e);
                },

                _queryProcess: function(data, options) {
                    return Query.process(data, options);
                },

                _mergeState: function(options) {
                    var that = this,
                        pageMode = that.options.pageMode;

                    if (options !== undefined) {
                        that._pageSize = options.pageSize;
                        that._page = options.page;
                        that._sort = options.sort;
                        that._filter = options.filter;
                        that._skip = options.skip;
                        that._take = options.take;

                        if (that._skip === undefined) {
                            that._skip = that.skip();
                            options.skip = that.skip();
                        }

                        if (!pageMode && that._take === undefined && that._pageSize !==
                            undefined) {
                            that._take = that._pageSize;
                            options.take = that._take;
                        }

                        if (options.sort) {
                            that._sort = options.sort = normalizeSort(options.sort);
                        }

                        if (options.filter) {
                            if (!that.options.server) {
                                that._filter = options.filter = normalizeFilter(options
                                    .filter);
                            } else {
                                that._filter = normalizeFilter(options.filter);
                                delete options.filter;

                                if (that._filter) {
                                    each(that._filter.filters, function(i, item) {
                                        options[item.field] = item.value;
                                    });
                                }
                            }
                        }

                        if (pageMode) {
                            options.currentPageNo = that._page;
                            delete options.page;
                            delete options.take;
                            delete options.skip;
                        }

                    }
                    return options;
                },

                query: function(options) {
                    var result;
                    var remote = this.options.server;

                    if (remote || ((this._data === undefined || this._data.length === 0) &&
                        !this._destroyed
                        .length)) {
                        return this.read(this._mergeState(options));
                    }

                    var isPrevented = this.trigger(REQUESTSTART, {
                        type: READ
                    });
                    if (!isPrevented) {
                        this.trigger(PROGRESS);

                        result = this._queryProcess(this._data, this._mergeState(
                            options));

                        if (!remote) {
                            if (result.total !== undefined) {
                                this._total = result.total;
                            } else {
                                this._total = this._data.length;
                            }
                        }

                        this.view(this._index(result.data));
                        this.trigger(REQUESTEND, {
                            type: READ
                        });
                        this.trigger(CHANGE, {
                            items: result.data
                        });
                    }

                    return Deferred().resolve(isPrevented).promise();
                },

                fetch: function(callback) {
                    var that = this;
                    var fn = function(isPrevented) {
                        if (isPrevented !== true && isFunction(callback)) {
                            callback.call(that);
                        }
                    };

                    return this._query().then(fn);
                },

                _query: function(options) {
                    var that = this;

                    return that.query(extend({}, {
                        page: that.page(),
                        pageSize: that.pageSize(),
                        sort: that.sort(),
                        filter: that.filter()
                    }, options));
                },

                next: function(options) {
                    var that = this,
                        page = that.page(),
                        total = that.total();

                    options = options || {};

                    if (!page || (total && page + 1 > that.totalPages())) {
                        return;
                    }

                    that._skip = page * that.take();

                    page += 1;
                    options.page = page;

                    that._query(options);

                    return page;
                },

                prev: function(options) {
                    var that = this,
                        page = that.page();

                    options = options || {};

                    if (!page || page === 1) {
                        return;
                    }

                    that._skip = that._skip - that.take();

                    page -= 1;
                    options.page = page;

                    that._query(options);

                    return page;
                },

                page: function(val) {
                    var that = this,
                        skip;

                    if (val !== undefined) {
                        if (this.options.total === false) {
                            val = math.max(val, 1);
                        } else {
                            val = math.max(math.min(math.max(val, 1), that.totalPages()),
                                1);
                        }
                        that._query({
                            page: val
                        });
                        return;
                    }
                    skip = that.skip();

                    return skip !== undefined ? math.round((skip || 0) / (that.take() ||
                            1)) + 1 :
                        undefined;
                },

                pageSize: function(val) {
                    var that = this;

                    if (val !== undefined) {
                        that._query({
                            pageSize: val,
                            page: 1
                        });
                        return;
                    }

                    return that.take();
                },

                sort: function(val) {
                    var that = this;

                    if (val !== undefined) {
                        that._query({
                            sort: val
                        });
                        return;
                    }

                    return that._sort;
                },

                filter: function(val) {
                    var that = this;

                    if (val === undefined) {
                        return that._filter;
                    }

                    if (isPlainObject(val) && val.field === undefined) {
                        val = $.map(val, function(value, field) {
                            return {
                                field: field,
                                value: value
                            };
                        });
                    }

                    that._query({
                        filter: val,
                        page: 1
                    });
                    that.trigger("reset");
                },

                total: function() {
                    return parseInt(this._total || 0, 10);
                },

                totalPages: function() {
                    var that = this,
                        pageSize = that.pageSize() || that.total();

                    return math.ceil((that.total() || 0) / pageSize);
                },

                /*inRange: function(skip, take) {
        var that = this,
            end = math.min(skip + take, that.total());

        if (!that.options.server && that._data.length > 0) {
            return true;
        }

        return that._findRange(skip, end).length > 0;
    },

    lastRange: function() {
        var ranges = this._ranges;
        return ranges[ranges.length - 1] || {
            start: 0,
            end: 0,
            data: []
        };
    },

    enableRequestsInProgress: function() {
        this._skipRequestsInProgress = false;
    },*/

                range: function(skip, take) {
                    skip = math.min(skip || 0, this.total());

                    var that = this,
                        total = that.total(),
                        pageSkip = math.max(math.floor(skip / take), 0) * take,
                        size = math.min(pageSkip + take, total),
                        data;

                    that._skipRequestsInProgress = false;

                    data = that._findRange(skip, math.min(skip + take, total));

                    if (data.length) {
                        that._skipRequestsInProgress = true;
                        that._pending = undefined;

                        that._skip = skip > that.skip() ? math.min(size, (that.totalPages() -
                                1) *
                            that.take()) : pageSkip;

                        that._take = take;

                        var server = that.options.server;

                        try {
                            that.options.server = true;

                            if (server) {
                                that._detachObservableParents();
                                that._data = data = that._observe(data);
                            }
                            that._process(data);
                        } finally {
                            that.options.server = server;
                        }

                        return;
                    }

                    if (take !== undefined) {
                        if (!that._rangeExists(pageSkip, size)) {
                            that.prefetch(pageSkip, take, function() {
                                if (skip > pageSkip && size < that.total() && !that
                                    ._rangeExists(
                                        size, math.min(size + take, that.total()))) {
                                    that.prefetch(size, take, function() {
                                        that.range(skip, take);
                                    });
                                } else {
                                    that.range(skip, take);
                                }
                            });
                        } else if (pageSkip < skip) {
                            that.prefetch(size, take, function() {
                                that.range(skip, take);
                            });
                        }
                    }
                },

                _findRange: function(start, end) {
                    var that = this,
                        ranges = that._ranges,
                        range,
                        data = [],
                        skipIdx,
                        takeIdx,
                        startIndex,
                        endIndex,
                        rangeData,
                        rangeEnd,
                        processed,
                        options = that.options,
                        remote = options.server,
                        flatData,
                        count,
                        length;

                    for (skipIdx = 0, length = ranges.length; skipIdx < length; skipIdx++) {
                        range = ranges[skipIdx];
                        if (start >= range.start && start <= range.end) {
                            count = 0;

                            for (takeIdx = skipIdx; takeIdx < length; takeIdx++) {
                                range = ranges[takeIdx];
                                flatData = range.data;

                                if (flatData.length && start + count >= range.start) {
                                    rangeData = range.data;
                                    rangeEnd = range.end;

                                    if (!remote) {
                                        var sort = normalizeSort(that.sort() || []);
                                        processed = that._queryProcess(range.data, {
                                            sort: sort,
                                            filter: that.filter()
                                        });
                                        flatData = rangeData = processed.data;

                                        if (processed.total !== undefined) {
                                            rangeEnd = processed.total;
                                        }
                                    }

                                    startIndex = 0;
                                    if (start + count > range.start) {
                                        startIndex = (start + count) - range.start;
                                    }
                                    endIndex = flatData.length;
                                    if (rangeEnd > end) {
                                        endIndex = endIndex - (rangeEnd - end);
                                    }
                                    count += endIndex - startIndex;
                                    data = data.concat(rangeData.slice(startIndex,
                                        endIndex))

                                    if (end <= range.end && count == end - start) {
                                        return data;
                                    }
                                }
                            }
                            break;
                        }
                    }
                    return [];
                },

                skip: function() {
                    var that = this;

                    if (that._skip === undefined) {
                        return (that._page !== undefined ? (that._page - 1) * (that.take() ||
                                1) :
                            undefined);
                    }
                    return that._skip;
                },

                take: function() {
                    return this._take || this._pageSize;
                },

                _prefetchSuccessHandler: function(skip, size, callback, force) {
                    var that = this;

                    return function(data) {
                        var found = false,
                            range = {
                                start: skip,
                                end: size,
                                data: []
                            },
                            idx,
                            length,
                            temp;

                        that._dequeueRequest();

                        that.trigger(REQUESTEND, {
                            response: data,
                            type: READ
                        });

                        data = that.reader.parse(data);

                        temp = that._readData(data);

                        if (temp.length) {
                            for (idx = 0, length = that._ranges.length; idx <
                                length; idx++) {
                                if (that._ranges[idx].start === skip) {
                                    found = true;
                                    range = that._ranges[idx];
                                    break;
                                }
                            }
                            if (!found) {
                                that._ranges.push(range);
                            }
                        }

                        range.data = that._observe(temp);
                        range.end = range.start + range.data.length;
                        that._ranges.sort(function(x, y) {
                            return x.start - y.start;
                        });
                        that._total = that.reader.total(data);

                        if (force || !that._skipRequestsInProgress) {
                            if (callback && temp.length) {
                                callback();
                            } else {
                                that.trigger(CHANGE, {});
                            }
                        }
                    };
                },

                prefetch: function(skip, take, callback) {
                    var that = this,
                        size = math.min(skip + take, that.total()),
                        options = extend(that._pageParam(), {
                            pageSize: take,
                            sort: that._sort,
                            filter: that._filter
                        });

                    if (!that._rangeExists(skip, size)) {
                        clearTimeout(that._timeout);

                        that._timeout = setTimeout(function() {
                            that._queueRequest(options, function() {
                                if (!that.trigger(REQUESTSTART, {
                                    type: READ
                                })) {
                                    that.transport.read({
                                        data: that._params(options),
                                        cache: false,
                                        success: that._prefetchSuccessHandler(
                                            skip, size, callback),
                                        error: function() {
                                            var args = slice.call(
                                                arguments);
                                            that.error.apply(that, args);
                                        }
                                    });
                                } else {
                                    that._dequeueRequest();
                                }
                            });
                        }, 100);
                    } else if (callback) {
                        callback();
                    }
                },

                _rangeExists: function(start, end) {
                    var that = this,
                        ranges = that._ranges,
                        idx,
                        length;

                    for (idx = 0, length = ranges.length; idx < length; idx++) {
                        if (ranges[idx].start <= start && ranges[idx].end >= end) {
                            return true;
                        }
                    }
                    return false;
                },

                _removeModelFromRanges: function(model) {
                    var result,
                        found,
                        range;

                    for (var idx = 0, length = this._ranges.length; idx < length; idx++) {
                        range = this._ranges[idx];

                        this._eachItem(range.data, function(items) {
                            result = removeModel(items, model);
                            if (result) {
                                found = true;
                            }
                        });

                        if (found) {
                            break;
                        }
                    }
                },

                _updateRangesLength: function() {
                    var startOffset = 0,
                        range,
                        rangeLength;

                    for (var idx = 0, length = this._ranges.length; idx < length; idx++) {
                        range = this._ranges[idx];
                        range.start = range.start - startOffset;

                        rangeLength = range.data.length;
                        startOffset = range.end - rangeLength;
                        range.end = range.start + rangeLength;
                    }
                }
            });


            DataSource.create = function(options) {

                if (isArray(options) || options instanceof ObservableArray) {
                    options = {
                        data: options
                    };
                }

                var dataSource = options || {},
                    data = dataSource.data,
                    fields = dataSource.fields,
                    select = dataSource.select,
                    idx,
                    length,
                    model = {},
                    field;

                if (!data && fields && !dataSource.transport && select) {
                    data = inferSelect(select, fields);
                }

                // 自动创建Model
                if (Model && fields && !dataSource.model) {
                    for (idx = 0, length = fields.length; idx < length; idx++) {
                        field = fields[idx];
                        if (field.type) {
                            model[field.field] = field;
                        }
                    }

                    if (!isEmptyObject(model)) {
                        dataSource.model = extend(true, model, {
                            fields: model
                        });
                    }
                }

                dataSource.data = data;

                return dataSource instanceof DataSource ? dataSource : new DataSource(
                    dataSource);
            };


            var NodeDataSource = DataSource.extend({

                ctor: function(options) {
                    if (!options) return;

                    var node = Node.define({
                        children: options
                    });

                    this._super(extend(true, {}, {
                        modelBase: node,
                        model: node
                    }, options));

                    this._attachBubbleHandlers();
                },

                _attachBubbleHandlers: function() {
                    var that = this;

                    that._data.bind(ERROR, function(e) {
                        that.trigger(ERROR, e);
                    });
                },

                remove: function(node) {
                    var parentNode = node.parentNode(),
                        dataSource = this,
                        result;

                    if (parentNode && parentNode._initChildren) {
                        dataSource = parentNode.children;
                    }

                    result = dataSource._super.remove(node);

                    if (parentNode && !dataSource.data().length) {
                        parentNode.hasChildren = false;
                    }

                    return result;
                },

                success: dataMethod("success"),

                data: dataMethod("data"),

                insert: function(index, model) {
                    var parentNode = this.parent();

                    if (parentNode && parentNode._initChildren) {
                        parentNode.hasChildren = true;
                        parentNode._initChildren();
                    }

                    return this._super.insert.call(this, index, model);
                },

                _find: function(method, value, key) {
                    var idx, length, node, data, children;

                    node = this._super[method].call(this, value, key);

                    if (node) {
                        return node;
                    }

                    data = this._data;

                    if (!data) {
                        return;
                    }

                    for (idx = 0, length = data.length; idx < length; idx++) {
                        children = data[idx].children;

                        if (!(children instanceof NodeDataSource)) {
                            continue;
                        }

                        node = children[method](value);

                        if (node) {
                            return node;
                        }
                    }
                },

                get: function(id, key) {
                    return this._find("get", id, key);
                },

                getByUid: function(uid) {
                    return this._find("getByUid", uid);
                }
            });


            var Node = Model.define({
                idField: "id",

                ctor: function(value) {
                    if (!value) return;

                    var that = this,
                        hasChildren = that.hasChildren || value && value.hasChildren,
                        childrenField = "items",
                        childrenOptions = {};

                    if (value.children instanceof Array) {
                        value.items = value.children;
                        delete value.children;
                    }

                    that._super(value);

                    if (typeof that.children === STRING && that.children != 'children') {
                        childrenField = that.children;
                    }

                    childrenOptions = {
                        childrenField: childrenField,
                        model: {
                            hasChildren: hasChildren,
                            id: that.idField,
                            fields: that.fields
                        }
                    };

                    if (typeof that.children !== STRING) {
                        extend(childrenOptions, that.children);
                    }

                    childrenOptions.data = value;

                    if (!hasChildren) {
                        hasChildren = childrenOptions.childrenField;
                    }

                    if (typeof hasChildren === STRING) {
                        hasChildren = fly.getter(hasChildren);
                    }

                    if (isFunction(hasChildren)) {
                        that.hasChildren = !!hasChildren.call(that, that);
                    }

                    that._childrenOptions = childrenOptions;

                    if (that.hasChildren) {
                        that._initChildren();
                    }

                    that._loaded = !!(value && (value[childrenField] || value._loaded));
                },

                _initChildren: function() {
                    var that = this;
                    var children, transport, parameterMap;

                    if (!(that.children instanceof NodeDataSource)) {
                        children = that.children = new NodeDataSource(that._childrenOptions);

                        transport = children.transport;
                        parameterMap = transport.parameterMap;

                        transport.parameterMap = function(data, type) {
                            data[that.idField || "id"] = that.id;

                            if (parameterMap) {
                                data = parameterMap(data, type);
                            }

                            return data;
                        };

                        children.parent = function() {
                            return that;
                        };

                        children.bind(CHANGE, function(e) {
                            e.node = e.node || that;
                            that.trigger(CHANGE, e);
                        });

                        children.bind(ERROR, function(e) {
                            var collection = that.parent();

                            if (collection) {
                                e.node = e.node || that;
                                collection.trigger(ERROR, e);
                            }
                        });

                        that._updateChildrenField();
                    }
                },

                append: function(model) {
                    this._initChildren();
                    this.loaded(true);
                    this.children.add(model);
                },

                hasChildren: false,

                level: function() {
                    var parentNode = this.parentNode(),
                        level = 0;

                    while (parentNode && parentNode.parentNode) {
                        level++;
                        parentNode = parentNode.parentNode ? parentNode.parentNode() :
                            null;
                    }

                    return level;
                },

                _updateChildrenField: function() {
                    var fieldName = this._childrenOptions.childrenField;

                    this[fieldName || "items"] = this.children.data();
                },

                _childrenLoaded: function() {
                    this._loaded = true;

                    this._updateChildrenField();
                },

                load: function() {
                    var options = {};
                    var method = "_query";
                    var children, promise;

                    if (this.hasChildren) {
                        this._initChildren();

                        children = this.children;

                        options[this.idField || "id"] = this.id;

                        if (!this._loaded) {
                            children._data = undefined;
                            method = "read";
                        }

                        children.one(CHANGE, proxy(this._childrenLoaded, this));

                        promise = children[method](options);
                    } else {
                        this.loaded(true);
                    }

                    return promise || Deferred().resolve().promise();
                },

                parentNode: function() {
                    var array = this.parent();

                    return array.parent();
                },

                loaded: function(value) {
                    if (value !== undefined) {
                        this._loaded = value;
                    } else {
                        return this._loaded;
                    }
                },

                shouldSerialize: function(field) {
                    return this._super.shouldSerialize.call(this, field) &&
                        field !== "children" &&
                        field !== "_loaded" &&
                        field !== "hasChildren" &&
                        field !== "_childrenOptions";
                }
            });


            var Cache = Class.extend({
                ctor: function() {
                    this._store = {};
                },
                add: function(key, data) {
                    if (key !== undefined) {
                        this._store[stringify(key)] = data;
                    }
                },
                find: function(key) {
                    return this._store[stringify(key)];
                },
                clear: function() {
                    this._store = {};
                },
                remove: function(key) {
                    delete this._store[stringify(key)];
                }
            });

            Cache.create = function(options) {
                var store = {
                    "inmemory": function() {
                        return new Cache();
                    }
                };

                if (isPlainObject(options) && isFunction(options.find)) {
                    return options;
                }

                if (options === true) {
                    return new Cache();
                }

                return store[options]();
            };


            var DataReader = Class.extend({
                ctor: function(model, modelBase, data) {
                    var that = this,
                        serializeFunction = proxy(that.serialize, that),
                        dataFunction = proxy(typeof data === STRING ? getter(data) :
                            that.data, that),
                        originalFieldNames = {},
                        getters = {},
                        serializeGetters = {},
                        fieldNames = {},
                        shouldSerialize = false,
                        dataModel,
                        fieldName;

                    that._dataAccessFunction = dataFunction;

                    if (typeof data === STRING) {
                        that[data] = getter(data);
                    }

                    if (isPlainObject(model)) {
                        dataModel = modelBase ? modelBase.define(model) : Model.define(
                            model);
                    }

                    if (!dataModel) {
                        return;
                    }

                    that.model = model = dataModel;

                    if (model.fields) {
                        each(model.fields, function(field, value) {
                            var fromName;

                            fieldName = field;

                            if (isPlainObject(value) && value.field) {
                                fieldName = value.field;
                            } else if (typeof value === STRING) {
                                fieldName = value;
                            }

                            if (isPlainObject(value) && value.from) {
                                fromName = value.from;
                            }

                            shouldSerialize = shouldSerialize || (fromName &&
                                fromName !==
                                field) || fieldName !== field;

                            getters[field] = getter(fromName || fieldName);
                            serializeGetters[field] = getter(field);
                            originalFieldNames[fromName || fieldName] = field;
                            fieldNames[field] = fromName || fieldName;
                        });

                        if (shouldSerialize) {
                            that.serialize = wrapDataAccess(serializeFunction,
                                dataModel,
                                serializeRecords, serializeGetters, originalFieldNames,
                                fieldNames);
                        }
                    }

                    that.data = wrapDataAccess(dataFunction, dataModel, convertRecords,
                        getters, originalFieldNames, fieldNames);
                },
                errors: function(data) {
                    return data ? data.errors : null;
                },
                parse: function(data) {
                    // 是否对无数据的情况进行过滤，这是一个大坑
                    if (data && data.rows && data.rows.length == 0) {
                        data.errors = EMPTY;
                    }
                    return data;
                },
                data: function(data) {
                    if (data && data.rows != undefined) {
                        return data.rows;
                    }
                    return data;
                },
                total: function(data) {
                    if (data && data.total != undefined) {
                        return data.total;
                    }
                    return data.length;
                },
                serialize: function(data) {
                    return data;
                }
            });


            var Query = Class.extend({

                ctor: function(data) {
                    this.data = data || [];
                },

                statics: {
                    normalizeFilter: normalizeFilter,

                    filterExpr: function(expression) {
                        var expressions = [],
                            fieldFunctions = [],
                            operatorFunctions = [],
                            logic = {
                                and: ' && ',
                                or: ' || '
                            },
                            idx,
                            length,
                            filter,
                            expr,
                            field,
                            operator,
                            filters = expression.filters;

                        for (idx = 0, length = filters.length; idx < length; idx++) {
                            filter = filters[idx];
                            field = filter.field;
                            operator = filter.operator;

                            if (filter.filters) {
                                expr = Query.filterExpr(filter);
                                // __o[0] -> __o[1]
                                filter = expr.expression
                                    .replace(/__o\[(\d+)\]/g, function(match, index) {
                                        index = +index;
                                        return '__o[' + (operatorFunctions.length +
                                            index) + ']';
                                    })
                                    .replace(/__f\[(\d+)\]/g, function(match, index) {
                                        index = +index;
                                        return '__f[' + (fieldFunctions.length +
                                            index) + ']';
                                    });

                                operatorFunctions.push.apply(operatorFunctions, expr.operators);
                                fieldFunctions.push.apply(fieldFunctions, expr.fields);
                            } else {
                                if (typeof field === FUNCTION) {
                                    expr = '__f[' + fieldFunctions.length + '](d)';
                                    fieldFunctions.push(field);
                                } else {
                                    expr = fly.expr(field);
                                }

                                if (typeof operator === FUNCTION) {
                                    filter = '__o[' + operatorFunctions.length + '](' +
                                        expr + ', ' + operators.quote(
                                            filter.value) + ')';
                                    operatorFunctions.push(operator);
                                } else {
                                    filter = operators[(operator || 'eq').toLowerCase()]
                                    (expr, filter.value, filter
                                        .ignoreCase !== undefined ? filter.ignoreCase :
                                        true);
                                }
                            }

                            expressions.push(filter);
                        }

                        return {
                            expression: '(' + expressions.join(logic[expression.logic]) +
                                ')',
                            fields: fieldFunctions,
                            operators: operatorFunctions
                        };
                    },

                    process: function(data, options) {
                        options = options || {};

                        var query = new Query(data),
                            sort = normalizeSort(options.sort || []),
                            total,
                            filterCallback = options.filterCallback,
                            filter = options.filter,
                            skip = options.skip,
                            take = options.take;

                        if (filter) {
                            query = query.filter(filter);

                            if (filterCallback) {
                                query = filterCallback(query);
                            }

                            total = query.toArray().length;
                        }

                        if (sort) {
                            query = query.sort(sort);
                        }

                        if (skip !== undefined && take !== undefined) {
                            query = query.range(skip, take);
                        }

                        return {
                            total: total,
                            data: query.toArray()
                        };
                    }
                },

                toArray: function() {
                    return this.data;
                },

                range: function(index, count) {
                    return new Query(this.data.slice(index, index + count));
                },

                skip: function(count) {
                    return new Query(this.data.slice(count));
                },

                take: function(count) {
                    return new Query(this.data.slice(0, count));
                },

                select: function(selector) {
                    return new Query(map(this.data, selector));
                },

                order: function(selector, dir) {
                    var sort = {
                        dir: dir
                    };

                    if (selector) {
                        if (selector.compare) {
                            sort.compare = selector.compare;
                        } else {
                            sort.field = selector;
                        }
                    }

                    return new Query(this.data.slice(0).sort(Comparer.create(sort)));
                },

                orderBy: function(selector) {
                    return this.order(selector, 'asc');
                },

                orderByDescending: function(selector) {
                    return this.order(selector, 'desc');
                },

                sort: function(field, dir, comparer) {
                    var descriptors = normalizeSort(field, dir),
                        comparers = [],
                        length = descriptors.length,
                        idx = 0;

                    comparer = comparer || Comparer;

                    if (length) {
                        for (; idx < length; idx++) {
                            comparers.push(comparer.create(descriptors[idx]));
                        }

                        return this.orderBy({
                            compare: comparer.combine(comparers)
                        });
                    }

                    return this;
                },

                filter: function(expressions) {
                    var idx,
                        current,
                        length,
                        compiled,
                        predicate,
                        data = this.data,
                        fields,
                        operators,
                        result = [],
                        filter;

                    expressions = normalizeFilter(expressions);

                    if (!expressions || expressions.filters.length === 0) {
                        return this;
                    }

                    compiled = Query.filterExpr(expressions);
                    fields = compiled.fields;
                    operators = compiled.operators;

                    predicate = filter = new Function('d, __f, __o', 'return ' +
                        compiled.expression);

                    if (fields.length || operators.length) {
                        filter = function(d) {
                            return predicate(d, fields, operators);
                        };
                    }


                    for (idx = 0, length = data.length; idx < length; idx++) {
                        current = data[idx];

                        if (filter(current)) {
                            result.push(current);
                        }
                    }

                    return new Query(result);
                }

            });

            var Transport = {
                create: function(options, dataSource) {
                    var transport,
                        currentTransport = options.transport,
                        read = options.read;

                    if (read) {
                        transport = isFunction(currentTransport) ? currentTransport : new RemoteTransport({
                            read: read,
                            dataSource: dataSource
                        });
                    } else {
                        transport = new LocalTransport({
                            data: options.data || []
                        });
                    }

                    /*if (isArray(data) || !data) {
            transport = new LocalTransport({
                data: data || []
            });
        } else {
            options.read = typeof data === STRING ? {
                url: data
            } : data;
            options.read.url = utils.url(options.read.url);

            if (dataSource) {
                options.dataSource = dataSource;
            }

            transport = new RemoteTransport({
                read: typeof data === STRING ? {
                        url: data
                    } : data,
                dataSource: dataSource
            });
        }*/

                    return transport;
                }
            };


            var LocalTransport = Class.extend({
                ctor: function(options) {
                    this.data = options.data;
                },
                read: function(options) {
                    var data = [];
                    if (options.take && options.skip) {
                        for (var i = 0; i < options.take; i++) {
                            data.push(this.data[options.skip + i]);
                        }
                    } else {
                        data = this.data;
                    }
                    options.success(data);
                },
                update: function(options) {
                    options.success(options.data);
                },
                create: function(options) {
                    options.success(options.data);
                },
                destroy: function(options) {
                    options.success(options.data);
                }
            });

            var RemoteTransport = Class.extend({

                ctor: function(options) {
                    var that = this,
                        parameterMap;

                    options = that.options = extend({}, that.options, options);

                    each(CRUD, function(index, type) {
                        if (typeof options[type] === STRING) {
                            options[type] = {
                                url: options[type]
                            };
                        }
                    });

                    that.cache = options.cache ? Cache.create(options.cache) : {
                        find: noop,
                        add: noop
                    };

                    parameterMap = options.parameterMap;

                    if (isFunction(options.push)) {
                        that.push = options.push;
                    }

                    if (!that.push) {
                        that.push = identity;
                    }

                    that.parameterMap = isFunction(parameterMap) ? parameterMap :
                        function(options) {
                            var result = {};

                            each(options, function(option, value) {
                                if (option in parameterMap) {
                                    option = parameterMap[option];
                                    if (isPlainObject(option)) {
                                        value = option.value(value);
                                        option = option.key;
                                    }
                                }

                                result[option] = value;
                            });

                            return result;
                    };
                },

                options: {
                    parameterMap: identity
                },

                create: function(options) {
                    return ajax(this.setup(options, CREATE));
                },

                read: function(options) {
                    var that = this,
                        success,
                        error,
                        result,
                        cache = that.cache;

                    options = that.setup(options, READ);
                    success = options.success || noop;
                    error = options.error || noop;
                    result = cache.find(options.data);

                    if (result !== undefined) {
                        success(result);
                    } else {
                        options.success = function(result) {
                            cache.add(options.data, result);
                            success(result);
                        };

                        ajax(options);
                    }
                },

                update: function(options) {
                    return ajax(this.setup(options, UPDATE));
                },

                destroy: function(options) {
                    return ajax(this.setup(options, DESTROY));
                },

                setup: function(options, type) {
                    options = options || {};

                    var that = this,
                        parameters,
                        operation = that.options[type],
                        data = isFunction(operation.data) ? operation.data(options.data) :
                        operation.data;

                    options = extend(true, {}, operation, options);
                    parameters = extend(true, {}, data, options.data);

                    options.data = that.parameterMap(parameters, type);

                    if (isFunction(options.url)) {
                        options.url = options.url(parameters);
                    }

                    return options;
                }
            });


            /**
             * 将数据转化为带有index的JSON Object
             * @param   {Array}  array 需要格式化的数组
             * @returns {Object} JSON
             */
            function toJSON(array) {
                var idx, length = array.length,
                    result = new Array(length);

                for (idx = 0; idx < length; idx++) {
                    result[idx] = format.toJSON(array[idx]);
                }

                return result;
            }

            /*function map(array, callback) {
    var idx, length = array.length,
        result = new Array(length);

    for (idx = 0; idx < length; idx++) {
        result[idx] = callback(array[idx], idx, array);
    }

    return result;
};*/

            function dataMethod(name) {
                return function() {
                    var data = this._data,
                        result = DataSource.fn[name].apply(this, slice.call(arguments));

                    if (this._data != data) {
                        this._attachBubbleHandlers();
                    }

                    return result;
                };
            }

            function normalizeSort(field, dir) {
                if (field) {
                    var descriptor = typeof field === STRING ? {
                            field: field,
                            dir: dir
                        } : field,
                        descriptors = isArray(descriptor) ?
                        descriptor :
                        (descriptor !== undefined ? [descriptor] : []);

                    return grep(descriptors, function(d) {
                        return !!d.dir;
                    });
                }
            }

            function normalizeOperator(expression) {
                var idx,
                    length,
                    filter,
                    operator,
                    filters = expression.filters;

                if (filters) {
                    for (idx = 0, length = filters.length; idx < length; idx++) {
                        filter = filters[idx];
                        operator = filter.operator;

                        if (operator && typeof operator === STRING) {
                            filter.operator = operatorMap[operator.toLowerCase()] || operator;
                        }

                        normalizeOperator(filter);
                    }
                }
            }

            function normalizeFilter(expression) {
                if (expression && !isEmptyObject(expression)) {
                    if (isArray(expression) || !expression.filters) {
                        expression = {
                            logic: 'and',
                            filters: isArray(expression) ? expression : [expression]
                        };
                    }

                    normalizeOperator(expression);

                    return expression;
                }
            }

            var operators = (function() {

                function quote(value) {
                    return value.replace(quoteRegExp, '\\').replace(newLineRegExp, '');
                }

                function operator(op, a, b, ignore) {
                    var date;

                    if (b != null) {
                        if (typeof b === STRING) {
                            b = quote(b);
                            date = dateRegExp.exec(b);
                            if (date) {
                                b = new Date(+date[1]);
                            } else if (ignore) {
                                b = "'" + b.toLowerCase() + "'";
                                a = '(' + a + ' || "").toLowerCase()';
                            } else {
                                b = "'" + b + "'";
                            }
                        }

                        if (b.getTime) {
                            a = '(' + a + '?' + a + '.getTime():' + a + ')';
                            b = b.getTime();
                        }
                    }

                    return a + ' ' + op + ' ' + b;
                }

                return {
                    quote: function(value) {
                        if (value && value.getTime) {
                            return "new Date(" + value.getTime() + ")";
                        }

                        if (typeof value == "string") {
                            return "'" + quote(value) + "'";
                        }

                        return "" + value;
                    },
                    eq: function(a, b, ignore) {
                        return operator("==", a, b, ignore);
                    },
                    neq: function(a, b, ignore) {
                        return operator("!=", a, b, ignore);
                    },
                    gt: function(a, b, ignore) {
                        return operator(">", a, b, ignore);
                    },
                    gte: function(a, b, ignore) {
                        return operator(">=", a, b, ignore);
                    },
                    lt: function(a, b, ignore) {
                        return operator("<", a, b, ignore);
                    },
                    lte: function(a, b, ignore) {
                        return operator("<=", a, b, ignore);
                    },
                    startswith: function(a, b, ignore) {
                        if (ignore) {
                            a = "(" + a + " || '').toLowerCase()";
                            if (b) {
                                b = b.toLowerCase();
                            }
                        }

                        if (b) {
                            b = quote(b);
                        }

                        return a + ".lastIndexOf('" + b + "', 0) == 0";
                    },
                    endswith: function(a, b, ignore) {
                        if (ignore) {
                            a = "(" + a + " || '').toLowerCase()";
                            if (b) {
                                b = b.toLowerCase();
                            }
                        }

                        if (b) {
                            b = quote(b);
                        }

                        return a + ".indexOf('" + b + "', " + a + ".length - " + (b ||
                                "").length +
                            ") >= 0";
                    },
                    contains: function(a, b, ignore) {
                        if (ignore) {
                            a = "(" + a + " || '').toLowerCase()";
                            if (b) {
                                b = b.toLowerCase();
                            }
                        }

                        if (b) {
                            b = quote(b);
                        }

                        return a + ".indexOf('" + b + "') >= 0";
                    },
                    doesnotcontain: function(a, b, ignore) {
                        if (ignore) {
                            a = "(" + a + " || '').toLowerCase()";
                            if (b) {
                                b = b.toLowerCase();
                            }
                        }

                        if (b) {
                            b = quote(b);
                        }

                        return a + ".indexOf('" + b + "') == -1";
                    }
                };
            })();


            function serializeRecords(data, getters, modelInstance, originalFieldNames,
                fieldNames) {
                var record,
                    getter,
                    originalName,
                    idx,
                    length;

                for (idx = 0, length = data.length; idx < length; idx++) {
                    record = data[idx];
                    for (getter in getters) {
                        originalName = fieldNames[getter];

                        if (originalName && originalName !== getter) {
                            record[originalName] = getters[getter](record);
                            delete record[getter];
                        }
                    }
                }
            }

            function convertRecords(data, getters, modelInstance, originalFieldNames,
                fieldNames) {
                var record,
                    getter,
                    originalName,
                    idx,
                    length;

                for (idx = 0, length = data.length; idx < length; idx++) {
                    record = data[idx];
                    for (getter in getters) {
                        record[getter] = modelInstance._parse(getter, getters[getter](record));

                        originalName = fieldNames[getter];
                        if (originalName && originalName !== getter) {
                            delete record[originalName];
                        }
                    }
                }
            }

            function wrapDataAccess(originalFunction, model, converter, getters,
                originalFieldNames, fieldNames) {
                return function(data) {
                    data = originalFunction(data);

                    if (data && !isEmptyObject(getters)) {
                        if (toString.call(data) !== ARR && !(data instanceof ObservableArray)) {
                            data = [data];
                        }

                        converter(data, getters, new model(), originalFieldNames,
                            fieldNames);
                    }

                    return data || [];
                };
            }


            function replaceInRanges(ranges, data, item, observable) {
                for (var idx = 0; idx < ranges.length; idx++) {
                    if (ranges[idx].data === data) {
                        break;
                    }
                    if (replaceInRange(ranges[idx].data, item, observable)) {
                        break;
                    }
                }
            }

            function replaceInRange(items, item, observable) {
                for (var idx = 0, length = items.length; idx < length; idx++) {
                    if (items[idx] === item || items[idx] === observable) {
                        items[idx] = observable;
                        return true;
                    }
                }
            }

            function replaceWithObservable(view, data, ranges, type) {
                for (var viewIndex = 0, length = view.length; viewIndex < length; viewIndex++) {
                    var item = view[viewIndex];

                    if (!item || item instanceof type) {
                        continue;
                    }

                    for (var idx = 0; idx < data.length; idx++) {
                        if (data[idx] === item) {
                            view[viewIndex] = data.at(idx);
                            replaceInRanges(ranges, data, item, view[viewIndex]);
                            break;
                        }
                    }
                }
            }

            function removeModel(data, model) {
                var idx, length;

                for (idx = 0, length = data.length; idx < length; idx++) {
                    var dataItem = data.at(idx);
                    if (dataItem.uid == model.uid) {
                        data.splice(idx, 1);
                        return dataItem;
                    }
                }
            }


            function indexOfPristineModel(data, model) {
                if (model) {
                    return indexOf(data, function(item) {
                        if (item.uid) {
                            return item.uid == model.uid;
                        }

                        return item[model.idField] === model.id;
                    });
                }
                return -1;
            }

            function indexOfModel(data, model) {
                if (model) {
                    return indexOf(data, function(item) {
                        return item.uid == model.uid;
                    });
                }
                return -1;
            }

            function indexOf(data, comparer) {
                var idx, length;

                for (idx = 0, length = data.length; idx < length; idx++) {
                    if (comparer(data[idx])) {
                        return idx;
                    }
                }

                return -1;
            }

            function fieldNameFromModel(fields, name) {
                if (fields && !isEmptyObject(fields)) {
                    var descriptor = fields[name];
                    var fieldName;
                    if (isPlainObject(descriptor)) {
                        fieldName = descriptor.from || descriptor.field || name;
                    } else {
                        fieldName = fields[name] || name;
                    }

                    if (isFunction(fieldName)) {
                        return name;
                    }

                    return fieldName;
                }
                return name;
            }

            function convertFilterDescriptorsField(descriptor, model) {
                var idx,
                    length,
                    target = {};

                for (var field in descriptor) {
                    if (field !== "filters") {
                        target[field] = descriptor[field];
                    }
                }

                if (descriptor.filters) {
                    target.filters = [];
                    for (idx = 0, length = descriptor.filters.length; idx < length; idx++) {
                        target.filters[idx] = convertFilterDescriptorsField(descriptor.filters[
                            idx], model);
                    }
                } else {
                    target.field = fieldNameFromModel(model.fields, target.field);
                }
                return target;
            }

            function convertDescriptorsField(descriptors, model) {
                var idx,
                    length,
                    result = [],
                    target,
                    descriptor;

                for (idx = 0, length = descriptors.length; idx < length; idx++) {
                    target = {};

                    descriptor = descriptors[idx];

                    for (var field in descriptor) {
                        target[field] = descriptor[field];
                    }

                    target.field = fieldNameFromModel(model.fields, target.field);

                    result.push(target);
                }
                return result;
            }

            function inferSelect(select, fields) {
                var options = $(select)[0].children,
                    idx,
                    length,
                    data = [],
                    record,
                    firstField = fields[0],
                    secondField = fields[1],
                    value,
                    option;

                for (idx = 0, length = options.length; idx < length; idx++) {
                    record = {};
                    option = options[idx];

                    if (option.disabled) {
                        continue;
                    }

                    record[firstField.field] = option.text;

                    value = option.attributes.value;

                    if (value && value.specified) {
                        value = option.value;
                    } else {
                        value = option.text;
                    }

                    record[secondField.field] = value;

                    data.push(record);
                }

                return data;
            }

            var Comparer = {

                selector: function(field) {
                    return isFunction(field) ? field : getter(field);
                },

                compare: function(field) {
                    var selector = this.selector(field);
                    return function(a, b) {
                        a = selector(a);
                        b = selector(b);

                        if (a == null && b == null) {
                            return 0;
                        }

                        if (a == null) {
                            return -1;
                        }

                        if (b == null) {
                            return 1;
                        }

                        if (a.localeCompare) {
                            return a.localeCompare(b);
                        }

                        return a > b ? 1 : (a < b ? -1 : 0);
                    };
                },

                create: function(sort) {
                    var compare = sort.compare || this.compare(sort.field);

                    if (sort.dir == "desc") {
                        return function(a, b) {
                            return compare(b, a, true);
                        };
                    }

                    return compare;
                },

                combine: function(comparers) {
                    return function(a, b) {
                        var result = comparers[0](a, b),
                            idx,
                            length;

                        for (idx = 1, length = comparers.length; idx < length; idx++) {
                            result = result || comparers[idx](a, b);
                        }

                        return result;
                    };
                }
            };


            /** 数据对象 */
            extend(data, {
                Query: Query,
                DataSource: DataSource,
                NodeDataSource: NodeDataSource,
                LocalTransport: LocalTransport,
                RemoteTransport: RemoteTransport,
                Cache: Cache,
                DataReader: DataReader,
                Model: Model
            });


            fly.dataSource = function(object) {
                if (!(object instanceof DataSource)) {
                    object = new DataSource(object);
                }
                return object;
            };

            fly.nodeDataSource = function(object) {
                if (!(object instanceof NodeDataSource)) {
                    object = new NodeDataSource(object);
                }
                return object;
            };

            fly.data = data;
            module.exports = data;

        }, {
            "./fly.core": 4,
            "./fly.format": 7,
            "./fly.model": 9,
            "./fly.observable": 10,
            "./fly.utils": 14
        }
    ],
    6: [
        function(require, module, exports) {
            /**
             * 拖拽
             * @author: huanzhang
             * @email: huanzhang@iflytek.com
             * @update: 2015-09-22
             */

            'use strict';

            // 依赖core
            var fly = require("./fly.core"),
                $ = fly.$,
                $win = fly.$win,
                $doc = fly.$doc,
                proxy = $.proxy,
                isTouch = fly.support.touch;

            var html = document.documentElement;

            var isLosecapture = fly.browser.ie != 6 && 'onlosecapture' in html;

            var isSetCapture = 'setCapture' in html;

            var types = {
                start: isTouch ? 'touchstart' : 'mousedown',
                over: isTouch ? 'touchmove' : 'mousemove',
                end: isTouch ? 'touchend' : 'mouseup'
            };


            var getEvent = isTouch ? function(event) {
                if (!event.touches) {
                    event = event.originalEvent.touches.item(0);
                }
                return event;
            } : function(event) {
                return event;
            };


            var DragEvent = function() {
                this.start = proxy(this.start, this);
                this.over = proxy(this.over, this);
                this.end = proxy(this.end, this);
                this.onstart = this.onover = this.onend = $.noop;
            };

            DragEvent.types = types;

            DragEvent.prototype = {

                start: function(event) {
                    event = this.startFix(event);

                    $doc.on(types.over, this.over).on(types.end, this.end);

                    this.onstart(event);
                    return false;
                },

                over: function(event) {
                    event = this.overFix(event);
                    this.onover(event);
                    return false;
                },

                end: function(event) {
                    event = this.endFix(event);

                    $doc.off(types.over, this.over).off(types.end, this.end);

                    this.onend(event);
                    return false;
                },

                startFix: function(event) {
                    event = getEvent(event);

                    this.target = $(event.target);
                    this.selectstart = function() {
                        return false;
                    };

                    $doc.on('selectstart', this.selectstart).on('dblclick', this.end);

                    if (isLosecapture) {
                        this.target.on('losecapture', this.end);
                    } else {
                        $win.on('blur', this.end);
                    }

                    if (isSetCapture) {
                        this.target[0].setCapture();
                    }

                    return event;
                },

                overFix: function(event) {
                    event = getEvent(event);
                    return event;
                },

                endFix: function(event) {
                    event = getEvent(event);

                    $doc.off('selectstart', this.selectstart).off('dblclick', this.end);

                    if (isLosecapture) {
                        this.target.off('losecapture', this.end);
                    } else {
                        $win.off('blur', this.end);
                    }

                    if (isSetCapture) {
                        this.target[0].releaseCapture();
                    }

                    return event;
                }

            };


            /**
             * 启动拖拽
             * @param   {HTMLElement}   被拖拽的元素
             * @param   {Event} 触发拖拽的事件对象。可选，若无则监听 elem 的按下事件启动
             */
            DragEvent.create = function(elem, event) {
                var $elem = $(elem);
                var dragEvent = new DragEvent();
                var startType = DragEvent.types.start;
                var noop = function() {};
                var className = elem.className
                    .replace(/^\s|\s.*/g, '') + '-drag-start';

                var minX;
                var minY;
                var maxX;
                var maxY;

                var api = {
                    onstart: noop,
                    onover: noop,
                    onend: noop,
                    off: function() {
                        $elem.off(startType, dragEvent.start);
                    }
                };


                dragEvent.onstart = function(event) {
                    var isFixed = $elem.css('position') === 'fixed';
                    var dl = $doc.scrollLeft();
                    var dt = $doc.scrollTop();
                    var w = $elem.width();
                    var h = $elem.height();

                    minX = 0;
                    minY = 0;
                    maxX = isFixed ? $win.width() - w + minX : $doc.width() - w;
                    maxY = isFixed ? $win.height() - h + minY : $doc.height() - h;

                    var offset = $elem.offset();
                    var left = this.startLeft = isFixed ? offset.left - dl : offset.left;
                    var top = this.startTop = isFixed ? offset.top - dt : offset.top;

                    this.clientX = event.clientX;
                    this.clientY = event.clientY;

                    $elem.addClass(className);
                    api.onstart.call(elem, event, left, top);
                };


                dragEvent.onover = function(event) {
                    var left = event.clientX - this.clientX + this.startLeft;
                    var top = event.clientY - this.clientY + this.startTop;
                    var style = $elem[0].style;

                    left = Math.max(minX, Math.min(maxX, left));
                    top = Math.max(minY, Math.min(maxY, top));

                    style.left = left + 'px';
                    style.top = top + 'px';

                    api.onover.call(elem, event, left, top);
                };


                dragEvent.onend = function(event) {
                    var position = $elem.position();
                    var left = position.left;
                    var top = position.top;
                    $elem.removeClass(className);
                    api.onend.call(elem, event, left, top);
                };


                dragEvent.off = function() {
                    $elem.off(startType, dragEvent.start);
                };


                if (event) {
                    dragEvent.start(event);
                } else {
                    $elem.on(startType, dragEvent.start);
                }

                return api;
            };

            fly.DragEvent = DragEvent;
            module.exports = DragEvent;

        }, {
            "./fly.core": 4
        }
    ],
    7: [
        function(require, module, exports) {
            /**
             * 格式转换
             * @author: huanzhang
             * @email: huanzhang@iflytek.com
             * @update: 2015-06-06
             */

            'use strict';

            // 依赖core
            var fly = require("./fly.core");

            // 类型检测
            var objectToString = {}.toString;

            // 纯数字
            var numberRegExp = /^\d*$/;

            // 特殊字符
            var escapeableRegExp = /["\\\x00-\x1f\x7f-\x9f]/g;

            var _meta = {
                '\b': '\\b',
                '\t': '\\t',
                '\n': '\\n',
                '\f': '\\f',
                '\r': '\\r',
                '"': '\\"',
                '\\': '\\\\'
            };

            var format = {};

            /**
             * 时间格式化
             * @param   {Object} date   Date
             * @param   {String} format 格式化参数
             * @returns {String} 格式化Date
             */
            var formatDate = function(date, format) {
                var regExps = {
                    'M+': date.getMonth() + 1,
                    'd+': date.getDate(),
                    'H+': date.getHours(),
                    'm+': date.getMinutes(),
                    's+': date.getSeconds(),
                    'q+': Math.floor((date.getMonth() + 3) / 3),
                    'S': date.getMilliseconds()
                };

                if (/(y+)/.test(format)) {
                    format = format.replace(RegExp.$1, (date.getFullYear() + '').substr(4 -
                        RegExp.$1.length));
                }

                for (var reg in regExps) {
                    var regExp = new RegExp('(' + reg + ')'),
                        temp = regExps[reg] + '',
                        real;
                    if (regExp.test(format)) {
                        real = RegExp.$1.length == 1 ? temp : ('00' + temp).substr(temp.length);
                        format = format.replace(RegExp.$1, real);
                    }
                }

                return format;
            };

            /**
             * 将字符串转为日期
             * @param   {String} value   需要格式化的时间字符串 或者 Date
             * @param   {String} formats 格式
             * @returns {String} 格式化后的时间
             */
            format.parseDate = function(value, format) {

                // 标准转换格式
                var stand = 'yyyy/MM/dd HH:mm:ss',
                    now = new Date(),
                    idx = 0,
                    date,
                    length,
                    reg;

                // 匹配格式库
                var formats = [
                    'yyyyMMddHHmmss',
                    'yyyyMMddHHmm',
                    'yyyyMMdd',
                    'yyyy-MM-dd HH:mm:ss.t',
                    'yyyy-MM-dd HH:mm:ss',
                    'yyyy-MM-dd HH:mm',
                    'yyyy-MM-dd',
                    'HHmmss',
                    'HH:mm:ss'
                ];

                var regExps = {
                    'y+': now.getFullYear(),
                    'M+': now.getMonth() + 1,
                    'd+': now.getDate(),
                    'H+': 0,
                    'm+': 0,
                    's+': 0
                };

                // 如果是日期，则直接返回
                if (objectToString.call(value) === '[object Date]') {
                    date = value;
                } else if (value) {
                    for (length = formats.length; idx < length; idx++) {
                        var newData = stand,
                            newFormat = formats[idx];

                        if (newFormat.length != value.length) {
                            continue;
                        }

                        for (reg in regExps) {
                            var regExp = new RegExp('(' + reg + ')'),
                                index = newFormat.search(regExp),
                                temp = '';
                            if (index >= 0) {
                                temp = value.substr(index, RegExp.$1.length);
                                if (!numberRegExp.test(temp)) {
                                    break;
                                }
                            } else {
                                temp = regExps[reg] + '';
                            }
                            temp = temp.length == 1 ? '0' + temp : temp;
                            newData = newData.replace(regExp, temp);
                        }

                        try {
                            date = new Date(newData);
                            if (!date.getTime()) {
                                continue;
                            }
                            break;
                        } catch (e) {
                            continue;
                        }
                    }
                }

                // 如果存在格式化
                value = !(date && date.getTime && date.getTime()) ? value : date;
                if (format) {
                    return formatDate(value, format);
                } else {
                    return value;
                }
            };

            /**
             * 将目标转为JSON
             * @param   {Object} o 需要转换的目标
             * @returns {String} JSON
             */
            format.toJSON = function(o) {
                if (typeof(JSON) == 'object' && JSON.stringify) {
                    var json = JSON.stringify(o);
                    return json;
                }
                var type = typeof(o);

                if (o === null)
                    return 'null';

                if (type == 'undefined')
                    return undefined;

                if (type == 'number' || type == 'boolean')
                    return o + '';

                if (type == 'string')
                    return fly.quoteString(o);

                if (type == 'object') {
                    if (typeof o.toJSON == 'function')
                        return fly.toJSON(o.toJSON());

                    if (o.constructor === Date) {
                        return formatDate(o, 'yyyy-MM-ddTHH:mm:ss.SZ');
                    }

                    if (o.constructor === Array) {
                        var ret = [];
                        for (var i = 0; i < o.length; i++)
                            ret.push(fly.toJSON(o[i]) || '');

                        return '[' + ret.join(',') + ']';
                    }

                    var pairs = [];
                    for (var k in o) {
                        var name;
                        var type = typeof k;

                        if (type == 'number')
                            name = '"' + k + '"';
                        else if (type == 'string')
                            name = fly.quoteString(k);
                        else
                            continue; //skip non-string or number keys

                        if (typeof o[k] == 'function')
                            continue; //skip pairs where the value is a function.

                        var val = fly.toJSON(o[k]);

                        pairs.push(name + ':' + val);
                    }

                    return '{' + pairs.join(', ') + '}';
                }
            };

            /**
             * 将JSON还原
             * @param   {String} src JSON字符串
             * @returns {Object}   [[Description]]
             */
            format.evalJSON = function(src) {
                if (!src) {
                    return {};
                }
                if (typeof(JSON) == 'object' && JSON.parse) {
                    return JSON.parse(src);
                }
                return eval('(' + src + ')');
            };

            /**
             * 安全还原JSON
             * @param   {String} src JSON字符串
             * @returns {[[Type]]} [[Description]]
             */
            format.secureEvalJSON = function(src) {
                if (typeof(JSON) == 'object' && JSON.parse) {
                    return JSON.parse(src);
                }

                var filtered = src;
                filtered = filtered.replace(/\\["\\\/bfnrtu]/g, '@');
                filtered = filtered.replace(
                    /"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']');
                filtered = filtered.replace(/(?:^|:|,)(?:\s*\[)+/g, '');

                if (/^[\],:{}\s]*$/.test(filtered))
                    return eval('(' + src + ')');
                else
                    throw new SyntaxError('Error parsing JSON, source is not valid.');
            };

            /**
             * 处理字符串中的引号
             * @param   {String} string [[Description]]
             * @returns {String} [[Description]]
             */
            format.quoteString = function(string) {
                if (string.match(escapeableRegExp)) {
                    return '"' + string.replace(escapeableRegExp, function(a) {
                        var c = _meta[a];
                        if (typeof c === 'string') return c;
                        c = a.charCodeAt();
                        return '\\u00' + Math.floor(c / 16).toString(
                            16) + (c % 16).toString(16);
                    }) + '"';
                }
                return '"' + string + '"';
            };

            /**
             * 字符格式化
             * @param   {String}   source 源字符串
             * @param   {Array}    params 格式化数据
             * @returns {String} 格式化后的字符串
             */
            format.format = function(source, params) {
                if (arguments.length == 1)
                    return function() {
                        var args = $.makeArray(arguments);
                        args.unshift(source);
                        return format.format.apply(this, args);
                    };
                if (arguments.length > 2 && params.constructor != Array) {
                    params = $.makeArray(arguments).slice(1);
                }
                if (params.constructor != Array) {
                    params = [params];
                }
                $.each(params, function(i, n) {
                    source = source.replace(new RegExp('\\{' + i + '\\}', 'g'), n);
                });
                return source;
            };

            $.extend(fly, format);
            module.exports = format;

        }, {
            "./fly.core": 4
        }
    ],
    8: [
        function(require, module, exports) {
            /**
             * 兼容IE7及以下
             * @author: huanzhang
             * @email: huanzhang@iflytek.com
             * @update: 2015-06-01 15:20
             */

            'use strict';

            // 依赖core
            var fly = require("./fly.core");

            var colRegExp = /^col-[a-z]{2}-/,
                colLength = 12;

            $.fn['rowie'] = function() {
                this.each(function() {
                    var row = $(this),
                        sum = row.width(),
                        col = Math.floor(sum / colLength),
                        over = sum - col * colLength,
                        cols = $.map(new Array(colLength), function(v, i) {
                            return col + ((i + over < colLength) ? 0 : 1);
                        }),
                        colsNum = [],
                        i = 0;
                    row.children().each(function() {
                        var td = $(this),
                            cls = td.attr('class').split(' '),
                            start = td.data('start') || i,
                            end = td.data('end') || (parseInt($.map(cls, function(v, i) {
                                if (colRegExp.test(v)) return v.replace(
                                    colRegExp, '');
                            })[0]) + start),
                            width = 0;
                        for (; start < end; start++) {
                            width += cols[start];
                        }
                        td.width(width);
                        i = end;
                    });
                });
            };

            if (fly.browser.ie < 8) {
                fly.$doc.ready(function() {
                    $('.row-ie').rowie();
                });

                fly.$win.resize(fly.utils.throttle(function() {
                    $('.row-ie').rowie();
                }, 500));
            }

        }, {
            "./fly.core": 4
        }
    ],
    9: [
        function(require, module, exports) {
            /**
             * 数据模型
             * @author: huanzhang
             * @email: huanzhang@iflytek.com
             * @update: 2015-09-06
             */

            'use strict';

            // 依赖
            var fly = require('./fly.core'),
                ob = require('./fly.observable'),
                format = require('./fly.format'),
                ObservableObject = fly.ObservableObject,
                $ = fly.$,
                extend = $.extend,
                isArray = $.isArray,
                isEmptyObject = $.isEmptyObject,
                isPlainObject = $.isPlainObject;

            // 静态变量
            var STRING = 'string';

            function getFieldByName(obj, name) {
                var field,
                    fieldName;

                for (fieldName in obj) {
                    field = obj[fieldName];
                    if (isPlainObject(field) && field.field && field.field === name) {
                        return field;
                    } else if (field === name) {
                        return field;
                    }
                }
                return null;
            }

            function equal(x, y) {
                if (x === y) {
                    return true;
                }

                var xtype = $.type(x),
                    ytype = $.type(y),
                    field;

                if (xtype !== ytype) {
                    return false;
                }

                if (xtype === "date") {
                    return x.getTime() === y.getTime();
                }

                if (xtype !== "object" && xtype !== "array") {
                    return false;
                }

                for (field in x) {
                    if (!equal(x[field], y[field])) {
                        return false;
                    }
                }

                return true;
            }

            var parsers = {

                "number": function(value) {
                    return parseFloat(value);
                },

                "date": function(value) {
                    return format.parseDate(value);
                },

                "boolean": function(value) {
                    if (typeof value === STRING) {
                        return value.toLowerCase() === "true";
                    }
                    return value != null ? !!value : value;
                },

                "string": function(value) {
                    return value != null ? (value + "") : value;
                },

                "default": function(value) {
                    return value;
                }
            };

            var defaultValues = {
                "string": "",
                "number": 0,
                "date": new Date(),
                "boolean": false,
                "default": ""
            };

            var Model = ObservableObject.extend({

                ctor: function(data) {
                    var that = this,
                        initializers = that._initializers;

                    if (!data || isEmptyObject(data)) {
                        data = extend({}, that.defaults, data);

                        if (initializers) {
                            for (var idx = 0; idx < initializers.length; idx++) {
                                var name = initializers[idx];
                                data[name] = that.defaults[name]();
                            }
                        }
                    }

                    that._super(data);

                    that.dirty = false;

                    if (that.idField) {
                        that.id = that.get(that.idField);

                        if (that.id === undefined) {
                            that.id = that._defaultId;
                        }
                    }
                },

                shouldSerialize: function(field) {
                    return this._super.shouldSerialize(field) &&
                        field !== "uid" &&
                        !(this.idField !== "id" && field === "id") &&
                        field !== "dirty" &&
                        field !== "_accessors";
                },

                _parse: function(field, value) {
                    var that = this,
                        fieldName = field,
                        fields = (that.fields || {}),
                        parse;

                    field = fields[field];
                    if (!field) {
                        field = getFieldByName(fields, fieldName);
                    }
                    if (field) {
                        parse = field.parse;
                        if (!parse && field.type) {
                            parse = parsers[field.type.toLowerCase()];
                        }
                    }

                    return parse ? parse(value) : value;
                },

                _notifyChange: function(e) {
                    var action = e.action;

                    if (action == 'add' || action == 'remove') {
                        this.dirty = true;
                    }
                },

                editable: function(field) {
                    field = (this.fields || {})[field];
                    return field ? field.editable !== false : true;
                },

                set: function(field, value, initiator) {
                    var that = this;

                    if (that.editable(field)) {
                        value = that._parse(field, value);

                        if (!equal(value, that.get(field))) {
                            that.dirty = true;
                            ObservableObject.fn.set.call(this, field, value, initiator);
                        }
                    }
                },

                accept: function(data) {
                    var that = this,
                        parent = function() {
                            return that;
                        },
                        field;

                    for (field in data) {
                        var value = data[field];

                        if (field.charAt(0) != "_") {
                            value = that.wrap(data[field], field, parent);
                        }

                        that._set(field, value);
                    }

                    if (that.idField) {
                        that.id = that.get(that.idField);
                    }

                    that.dirty = false;
                },

                isNew: function() {
                    return this.id === this._defaultId;
                }
            });

            Model.define = function(base, options) {
                if (options === undefined) {
                    options = base;
                    base = Model;
                }

                var model,
                    proto = extend({
                        defaults: {}
                    }, options),
                    name,
                    field,
                    type,
                    value,
                    idx,
                    length,
                    fields = {},
                    originalName,
                    id = proto.id,
                    functionFields = [];

                if (id) {
                    proto.idField = id;
                }

                if (proto.id) {
                    delete proto.id;
                }

                if (id) {
                    proto.defaults[id] = proto._defaultId = "";
                }

                if (isArray(proto.fields)) {
                    for (idx = 0, length = proto.fields.length; idx < length; idx++) {
                        field = proto.fields[idx];
                        if (typeof field === STRING) {
                            fields[field] = {};
                        } else if (field.field) {
                            fields[field.field] = field;
                        }
                    }
                    proto.fields = fields;
                }

                for (name in proto.fields) {
                    field = proto.fields[name];
                    type = field.type || "default";
                    value = null;
                    originalName = name;

                    name = typeof(field.field) === STRING ? field.field : name;

                    if (!field.nullable) {
                        value = proto.defaults[originalName !== name ? originalName : name] =
                            field.defaultValue !==
                            undefined ? field.defaultValue : defaultValues[type.toLowerCase()];

                        if (typeof value === "function") {
                            functionFields.push(name);
                        }
                    }

                    if (options.id === name) {
                        proto._defaultId = value;
                    }

                    proto.defaults[originalName !== name ? originalName : name] = value;

                    field.parse = field.parse || parsers[type];
                }

                if (functionFields.length > 0) {
                    proto._initializers = functionFields;
                }

                model = base.extend(proto);
                model.define = function(options) {
                    return Model.define(model, options);
                };

                if (proto.fields) {
                    model.fields = proto.fields;
                    model.idField = proto.idField;
                }

                return model;
            };

            fly.Model = Model;
            module.exports = Model;

        }, {
            "./fly.core": 4,
            "./fly.format": 7,
            "./fly.observable": 10
        }
    ],
    10: [
        function(require, module, exports) {
            /**
             * 观察者对象
             * @author: huanzhang
             * @email: huanzhang@iflytek.com
             * @update: 2015-09-06
             */

            'use strict';

            // 依赖
            var fly = require('./fly.core'),
                Class = require('./fly.class'),
                $ = fly.$,
                proxy = $.proxy,
                noop = $.noop;

            // 数据对象
            var data = {};

            // 缓存get/set
            var getterCache = {},
                setterCache = {};

            // 将类数组的对象转化为数组
            var slice = [].slice;

            // 强制转化为字符串
            var objectToString = {}.toString;

            // 静态变量
            var FUNCTION = 'function',
                STRING = 'string',
                CHANGE = 'change',
                GET = "get",
                OBJ = '[object Object]',
                ARR = '[object Array]';

            /**
             * 构建表达式
             * @param   {String}  [expression=''] 原始表达式
             * @param   {Boolean} safe            是否安全构建
             * @param   {String}  paramName       参数名
             * @returns {String}  [[Description]]
             */
            fly.expr = function(expression, safe, paramName) {
                expression = expression || '';

                if (typeof safe == STRING) {
                    paramName = safe;
                    safe = false;
                }

                paramName = paramName || 'd';

                if (expression && expression.charAt(0) !== '[') {
                    expression = '.' + expression;
                }

                if (safe) {
                    expression = expression.replace(/"([^.]*)\.([^"]*)"/g,
                        '"$1_$DOT$_$2"');
                    expression = expression.replace(/'([^.]*)\.([^']*)'/g,
                        "'$1_$DOT$_$2'");
                    expression = wrapExpression(expression.split('.'), paramName);
                    expression = expression.replace(/_\$DOT\$_/g, '.');
                } else {
                    expression = paramName + expression;
                }

                return expression;
            }

            /**
             * 取值
             * @param   {String}   expression 表达式
             * @param   {String}   safe       key
             * @returns {Function} 解析表达式的函数
             */
            fly.getter = function(expression, safe) {
                var key = expression + safe;
                return getterCache[key] = getterCache[key] || new Function('d',
                    'return ' + fly.expr(expression, safe));
            }

            /**
             * 赋值
             * @param   {String}   expression 表达式
             * @returns {Function} 解析表达式的函数
             */
            fly.setter = function(expression) {
                return setterCache[expression] = setterCache[expression] || new Function(
                    'd, value', fly.expr(expression) + '=value');
            }

            /**
             * 阻止默认动作
             * @param {Object} e 事件对象
             */
            fly.preventDefault = function(e) {
                e.preventDefault();
            }

            /**
             * 包裹表达式
             * @param   {Array}  members   成员 ['a', 'b'] ==> ((d.a || {}).b)
             * @param   {String} paramName 参数名
             * @returns {String} 拼装好的表达式
             */
            function wrapExpression(members, paramName) {
                var result = paramName || 'd',
                    index,
                    idx,
                    length,
                    member,
                    count = 1;

                for (idx = 0, length = members.length; idx < length; idx++) {
                    member = members[idx];
                    if (member !== '') {
                        index = member.indexOf('[');

                        if (index !== 0) {
                            if (index == -1) {
                                member = '.' + member;
                            } else {
                                count++;
                                member = '.' + member.substring(0, index) + ' || {})' +
                                    member.substring(index);
                            }
                        }

                        count++;
                        result += member + ((idx < length - 1) ? ' || {})' : ')');
                    }
                }
                return new Array(count).join('(') + result;
            };

            /**
             * 事件处理器
             * @param   {Object}   context 事件上下文
             * @param   {String}   type    事件名称
             * @param   {String}   field   字段名
             * @param   {Boolean}  prefix  是否需要预处理
             * @returns {Function} [[Description]]
             */
            function eventHandler(context, type, field, prefix) {
                return function(e) {
                    var event = {},
                        key;

                    for (key in e) {
                        event[key] = e[key];
                    }

                    if (prefix) {
                        event.field = field + '.' + e.field;
                    } else {
                        event.field = field;
                    }

                    if (type == CHANGE && context._notifyChange) {
                        context._notifyChange(event);
                    }

                    context.trigger(type, event);
                };
            }

            // 观察者
            var Observable = Class.extend({

                ctor: function() {
                    this._events = {};
                },

                /**
                 * 注册监听事件
                 * @param  {String}   eventName 事件名称，可以是字符串或数组
                 * @param  {Function} handlers  事件，可以是函数或函数map
                 * @param  {Boolean}  one       是否只执行一次
                 * @return {Object}   观察者对象
                 */
                bind: function(eventName, handlers, one) {
                    var that = this,
                        idx = 0,
                        idt,
                        events,
                        original,
                        handler,
                        handlersIsFunction = typeof handlers === FUNCTION,
                        eventNames = typeof eventName === STRING ? [
                            eventName
                        ] :
                        eventName,
                        length = eventNames.length;

                    if (handlers === undefined) {
                        for (idt in eventName) {
                            that.bind(idt, eventName[idt]);
                        }
                        return that;
                    }

                    for (; idx < length; idx++) {
                        eventName = eventNames[idx];

                        handler = handlersIsFunction ? handlers : handlers[
                            eventName];

                        if (handler) {
                            if (one) {
                                original = handler;
                                handler = function() {
                                    that.unbind(eventName, handler);
                                    original.apply(that, arguments);
                                };
                                handler.original = original;
                            }
                            events = that._events[eventName] = that._events[
                                eventName] || [];
                            events.push(handler);
                        }
                    }

                    return that;
                },

                /**
                 * 只执行一次的事件
                 * @param  {String}   eventName 事件名称，可以是字符串或数组
                 * @param  {Function} handlers  事件，可以是函数或函数map
                 * @return {Object}   观察者对象
                 */
                one: function(eventNames, handlers) {
                    return this.bind(eventNames, handlers, true);
                },

                /**
                 * 将事件注册到最前
                 * @param  {String}   eventName 事件名称，可以是字符串或数组
                 * @param  {Function} handlers  事件，可以是函数或函数map
                 * @return {Object}   观察者对象
                 */
                first: function(eventName, handlers) {
                    var that = this,
                        idx = 0,
                        events,
                        handler,
                        handlersIsFunction = typeof handlers === FUNCTION,
                        eventNames = typeof eventName === STRING ? [
                            eventName
                        ] :
                        eventName,
                        length = eventNames.length;

                    for (; idx < length; idx++) {
                        eventName = eventNames[idx];

                        handler = handlersIsFunction ? handlers : handlers[
                            eventName];

                        if (handler) {
                            events = that._events[eventName] = that._events[
                                eventName] || [];
                            events.unshift(handler);
                        }
                    }

                    return that;
                },

                /**
                 * 触发事件
                 * @param  {String}  eventName 事件名称
                 * @param  {Event}   e         Event对象
                 * @return {Boolean}
                 */
                trigger: function(eventName, e) {
                    var that = this,
                        events = that._events[eventName],
                        idx,
                        length;

                    if (events) {
                        e = e || {};
                        e.sender = that;
                        e._defaultPrevented = false;
                        e.preventDefault = function() {
                            this._defaultPrevented = true;
                        };
                        e.isDefaultPrevented = function() {
                            return this._defaultPrevented === true;
                        };
                        events = events.slice();

                        for (idx = 0, length = events.length; idx < length; idx++) {
                            events[idx].call(that, e);
                        }

                        return e._defaultPrevented === true;
                    }

                    return false;
                },

                /**
                 * 注销事件
                 * @param  {String}   eventName 事件名称
                 * @param  {Function} handler   事件 同一个事件名称可能有好几个事件，
                 *                              这里可以只注销其中一个
                 * @return {Object}   观察者对象
                 */
                unbind: function(eventName, handler) {
                    var that = this,
                        events = that._events[eventName],
                        idx;

                    if (eventName === undefined) {
                        that._events = {};
                    } else if (events) {
                        if (handler) {
                            for (idx = events.length - 1; idx >= 0; idx--) {
                                if (events[idx] === handler || events[idx].original ===
                                    handler) {
                                    events.splice(idx, 1);
                                }
                            }
                        } else {
                            that._events[eventName] = [];
                        }
                    }

                    return that;
                }
            });

            /** 对象监听模型 */
            var ObservableObject = Observable.extend({

                ctor: function(value) {
                    var that = this,
                        member,
                        field,
                        parent = function() {
                            return that;
                        };

                    if (value === undefined) return;

                    that._super();

                    for (field in value) {
                        member = value[field];

                        if (typeof member === "object" && member && !member.getTime &&
                            field.charAt(0) != "_") {
                            member = that.wrap(member, field, parent);
                        }

                        that[field] = member;
                    }

                    that.uid = fly.guid();
                },

                /**
                 * 是否需要序列化
                 * @param   {String}  field 字段名
                 * @returns {Boolean}
                 */
                shouldSerialize: function(field) {
                    return this.hasOwnProperty(field) && field !== "_events" &&
                        field !== "_super" && typeof this[field] !== FUNCTION &&
                        field !== "uid";
                },

                /**
                 * 遍历自身
                 * @param {Function} f [[Description]]
                 */
                forEach: function(f) {
                    for (var i in this) {
                        if (this.shouldSerialize(i)) {
                            f(this[i], i);
                        }
                    }
                },

                toJSON: function() {
                    var result = {},
                        value, field;

                    for (field in this) {
                        if (this.shouldSerialize(field)) {
                            value = this[field];

                            if (value instanceof ObservableObject || value instanceof ObservableArray) {
                                value = value.toJSON();
                            }

                            result[field] = value;
                        }
                    }

                    return result;
                },

                /*toFilter: function() {
        var filter = [],
            value, field;

        for (field in this) {
            if (this.shouldSerialize(field)) {
                value = this[field];

                if ((typeof value == 'number' ? true : value) && !(value instanceof ObservableObject ||
                        value instanceof ObservableArray)) {
                    filter.push({
                        field: field,
                        value: value
                    });
                }
            }
        }

        return filter;
    },*/

                get: function(field) {
                    var that = this,
                        result;

                    that.trigger(GET, {
                        field: field
                    });

                    if (field === "this") {
                        result = that;
                    } else {
                        result = fly.getter(field, true)(that);
                    }

                    return result;
                },

                _set: function(field, value) {
                    var that = this;
                    var composite = field.indexOf(".") >= 0;

                    if (composite) {
                        var paths = field.split("."),
                            path = "";

                        while (paths.length > 1) {
                            path += paths.shift();
                            var obj = fly.getter(path, true)(that);
                            if (obj instanceof ObservableObject) {
                                obj.set(paths.join("."), value);
                                return composite;
                            }
                            path += ".";
                        }
                    }

                    fly.setter(field)(that, value);

                    return composite;
                },

                set: function(field, value) {
                    var that = this,
                        composite = field.indexOf(".") >= 0,
                        current = fly.getter(field, true)(that);

                    if (current !== value) {

                        if (!that.trigger("set", {
                            field: field,
                            value: value
                        })) {
                            if (!composite) {
                                value = that.wrap(value, field, function() {
                                    return that;
                                });
                            }
                            if (!that._set(field, value) || field.indexOf("(") >=
                                0 || field.indexOf("[") >= 0) {
                                that.trigger(CHANGE, {
                                    field: field
                                });
                            }
                        }
                    }
                },

                parent: noop,

                wrap: function(object, field, parent) {
                    var that = this,
                        type = objectToString.call(object);

                    if (object != null && (type === OBJ || type === ARR)) {
                        var isObservableArray = object instanceof ObservableArray;
                        var isDataSource = object instanceof fly.data.DataSource;

                        if (type === OBJ && !isDataSource && !
                            isObservableArray) {

                            if (!(object instanceof ObservableObject)) {
                                object = new ObservableObject(object);
                            }

                            if (object.parent() != parent()) {
                                object.bind(GET, eventHandler(that, GET, field,
                                    true));
                                object.bind(CHANGE, eventHandler(that, CHANGE,
                                    field, true));
                            }
                        } else if (type === ARR || isObservableArray ||
                            isDataSource) {
                            if (!isObservableArray && !isDataSource) {
                                object = new ObservableArray(object);
                            }

                            if (object.parent() != parent()) {
                                object.bind(CHANGE, eventHandler(that, CHANGE,
                                    field, false));
                            }
                        }

                        object.parent = parent;
                    }

                    return object;
                }
            });

            var ObservableArray = Observable.extend({

                ctor: function(array, type) {
                    var that = this;
                    if (!array) return;
                    that.type = type || ObservableObject;
                    that._super();
                    that.length = array.length;
                    that.wrapAll(array, that);
                },

                at: function(index) {
                    return this[index];
                },

                toJSON: function() {
                    var idx, length = this.length,
                        value, json = new Array(length);

                    for (idx = 0; idx < length; idx++) {
                        value = this[idx];

                        if (value instanceof ObservableObject) {
                            value = value.toJSON();
                        }

                        json[idx] = value;
                    }

                    return json;
                },

                parent: noop,

                wrapAll: function(source, target) {
                    var that = this,
                        idx,
                        length,
                        parent = function() {
                            return that;
                        };

                    target = target || [];

                    for (idx = 0, length = source.length; idx < length; idx++) {
                        target[idx] = that.wrap(source[idx], parent);
                    }

                    return target;
                },

                wrap: function(object, parent) {
                    var that = this,
                        observable;

                    if (object !== null && objectToString.call(object) === OBJ) {
                        observable = object instanceof that.type || object instanceof fly
                            .Model;

                        if (!observable) {
                            object = object instanceof ObservableObject ?
                                object.toJSON() : object;
                            object = new that.type(object);
                        }

                        object.parent = parent;

                        object.bind(CHANGE, function(e) {
                            that.trigger(CHANGE, {
                                field: e.field,
                                node: e.node,
                                index: e.index,
                                items: e.items || [this],
                                action: e.node ? (e.action ||
                                    "itemloaded") : "itemchange"
                            });
                        });
                    }

                    return object;
                },

                push: function() {
                    var index = this.length,
                        items = this.wrapAll(arguments),
                        result;

                    result = [].push.apply(this, items);

                    this.trigger(CHANGE, {
                        action: 'add',
                        index: index,
                        items: items
                    });

                    return result;
                },

                slice: slice,

                sort: [].sort,

                join: [].join,

                pop: function() {
                    var length = this.length,
                        result = pop.apply(this);

                    if (length) {
                        this.trigger(CHANGE, {
                            action: "remove",
                            index: length - 1,
                            items: [result]
                        });
                    }

                    return result;
                },

                splice: function(index, howMany, item) {
                    var items = this.wrapAll(slice.call(arguments, 2)),
                        result, i, len;

                    result = [].splice.apply(this, [index, howMany].concat(
                        items));

                    if (result.length) {
                        this.trigger(CHANGE, {
                            action: "remove",
                            index: index,
                            items: result
                        });

                        for (i = 0, len = result.length; i < len; i++) {
                            if (result[i] && result[i].children) {
                                result[i].unbind(CHANGE);
                            }
                        }
                    }

                    if (item) {
                        this.trigger(CHANGE, {
                            action: "add",
                            index: index,
                            items: items
                        });
                    }
                    return result;
                },

                shift: function() {
                    var length = this.length,
                        result = [].shift.apply(this);

                    if (length) {
                        this.trigger(CHANGE, {
                            action: "remove",
                            index: 0,
                            items: [result]
                        });
                    }

                    return result;
                },

                unshift: function() {
                    var items = this.wrapAll(arguments),
                        result;

                    result = [].unshift.apply(this, items);

                    this.trigger(CHANGE, {
                        action: "add",
                        index: 0,
                        items: items
                    });

                    return result;
                },

                indexOf: function(item) {
                    var that = this,
                        idx,
                        length;

                    for (idx = 0, length = that.length; idx < length; idx++) {
                        if (that[idx] === item) {
                            return idx;
                        }
                    }
                    return -1;
                },

                forEach: function(callback) {
                    var idx = 0,
                        length = this.length;

                    for (; idx < length; idx++) {
                        callback(this[idx], idx, this);
                    }
                },

                map: function(callback) {
                    var idx = 0,
                        result = [],
                        length = this.length;

                    for (; idx < length; idx++) {
                        result[idx] = callback(this[idx], idx, this);
                    }

                    return result;
                },

                filter: function(callback) {
                    var idx = 0,
                        result = [],
                        item,
                        length = this.length;

                    for (; idx < length; idx++) {
                        item = this[idx];
                        if (callback(item, idx, this)) {
                            result[result.length] = item;
                        }
                    }

                    return result;
                },

                find: function(callback) {
                    var idx = 0,
                        item,
                        length = this.length;

                    for (; idx < length; idx++) {
                        item = this[idx];
                        if (callback(item, idx, this)) {
                            return item;
                        }
                    }
                },

                every: function(callback) {
                    var idx = 0,
                        item,
                        length = this.length;

                    for (; idx < length; idx++) {
                        item = this[idx];
                        if (!callback(item, idx, this)) {
                            return false;
                        }
                    }

                    return true;
                },

                some: function(callback) {
                    var idx = 0,
                        item,
                        length = this.length;

                    for (; idx < length; idx++) {
                        item = this[idx];
                        if (callback(item, idx, this)) {
                            return true;
                        }
                    }

                    return false;
                },

                /**
                 * 删除
                 * @param {Any} item 需要删除的项
                 */
                remove: function(item) {
                    var idx = this.indexOf(item);

                    if (idx !== -1) {
                        this.splice(idx, 1);
                    }
                },

                /**
                 * 置空
                 */
                empty: function() {
                    this.splice(0, this.length);
                }

            });

            var LazyObservableArray = ObservableArray.extend({
                ctor: function(data, type) {
                    this._super();

                    this.type = type || ObservableObject;

                    for (var idx = 0; idx < data.length; idx++) {
                        this[idx] = data[idx];
                    }

                    this.length = idx;
                    this._parent = proxy(function() {
                        return this;
                    }, this);
                },
                at: function(index) {
                    var item = this[index];

                    if (!(item instanceof this.type)) {
                        item = this[index] = this.wrap(item, this._parent);
                    } else {
                        item.parent = this._parent;
                    }

                    return item;
                }
            });

            fly.Observable = Observable;
            fly.ObservableObject = ObservableObject;
            fly.ObservableArray = ObservableArray;
            fly.LazyObservableArray = LazyObservableArray;


            /**
             * 隐式实例化VM
             * @param   {Object} object
             * @returns {Object} viewmodel
             */
            fly.observable = function(object) {
                if (!(object instanceof ObservableObject)) {
                    object = new ObservableObject(object);
                }
                return object;
            };

            module.exports = Observable;

        }, {
            "./fly.class": 3,
            "./fly.core": 4
        }
    ],
    11: [
        function(require, module, exports) {
            /**
             * 路由 暂未实现
             * @author: huanzhang
             * @email: huanzhang@iflytek.com
             * @update:
             */

            module.exports = null;
        }, {}
    ],
    12: [
        function(require, module, exports) {
            /**
             * 模板引擎
             * 来自artTemplate3.0.0
             * @author: huanzhang
             * @email: huanzhang@iflytek.com
             * @update: 2015-07-01
             */

            'use strict';

            // core
            var fly = require('./fly.core');

            var escapeMap = {
                '<': '&#60;',
                '>': '&#62;',
                '"': '&#34;',
                "'": '&#39;',
                '&': '&#38;'
            };

            // 静态分析模板变量
            var KEYWORDS =
                // 关键字
                'break,case,catch,continue,debugger,default,delete,do,else,false' +
                ',finally,for,function,if,in,instanceof,new,null,return,switch,this' +
                ',throw,true,try,typeof,var,void,while,with'

            // 保留字
            +',abstract,boolean,byte,char,class,const,double,enum,export,extends' +
                ',final,float,goto,implements,import,int,interface,long,native' +
                ',package,private,protected,public,short,static,super,synchronized' +
                ',throws,transient,volatile'

            // ECMA 5 - use strict
            + ',arguments,let,yield'

            + ',undefined';

            var REMOVE_RE =
                /\/\*[\w\W]*?\*\/|\/\/[^\n]*\n|\/\/[^\n]*$|"(?:[^"\\]|\\[\w\W])*"|'(?:[^'\\]|\\[\w\W])*'|\s*\.\s*[$\w\.]+/g;
            var SPLIT_RE = /[^\w$]+/g;
            var KEYWORDS_RE = new RegExp(["\\b" + KEYWORDS.replace(/,/g, '\\b|\\b') + "\\b"]
                .join('|'), 'g');
            var NUMBER_RE = /^\d[^,]*|,\d[^,]*/g;
            var BOUNDARY_RE = /^,+|,+$/g;
            var SPLIT2_RE = /^$|,+/;

            var toString = function(value, type) {

                if (typeof value !== 'string') {
                    type = typeof value;
                    if (type === 'number') {
                        value += '';
                    } else if (type === 'function') {
                        value = toString(value.call(value));
                    } else {
                        value = '';
                    }
                }

                return value;

            };

            var escapeFn = function(s) {
                return escapeMap[s];
            };

            var escapeHTML = function(content) {
                return toString(content)
                    .replace(/&(?![\w#]+;)|[<>"']/g, escapeFn);
            };

            var isArray = Array.isArray || function(obj) {
                return ({}).toString.call(obj) === '[object Array]';
            };

            var each = function(data, callback) {
                var i, len;
                if (isArray(data)) {
                    for (i = 0, len = data.length; i < len; i++) {
                        callback.call(data, data[i], i, data);
                    }
                } else {
                    for (i in data) {
                        callback.call(data, data[i], i);
                    }
                }
            };


            /**
             * 模板
             * @param   {String} filename 模板名
             * @param   {Object, String} content  数据 如果为字符串则编译并缓存编译结果
             * @returns {String, Function} 渲染好的HTML字符串或者渲染方法
             */
            var template = function(filename, content) {
                return filename.indexOf('<') != -1 ? compile(filename) : (typeof content ===
                    'string' ?
                    compile(content, {
                        filename: filename
                    }) : renderFile(filename, content));
            };

            /**
             * 设置全局配置
             * @param {String} name  名称
             * @param {Any}    value 值
             */
            template.config = function(name, value) {
                defaults[name] = value;
            };

            // 默认设置
            var defaults = template.defaults = {
                openTag: '<%', // 逻辑语法开始标签
                closeTag: '%>', // 逻辑语法结束标签
                escape: true, // 是否编码输出变量的 HTML 字符
                cache: true, // 是否开启缓存（依赖 options 的 filename 字段）
                compress: false, // 是否压缩输出
                parser: null // 自定义语法格式器 @see: template-syntax.js
            };

            // 缓存
            var cacheStore = template.cache = {};

            /**
             * 渲染模板
             * @name    template.render
             * @param   {String}    模板
             * @param   {Object}    数据
             * @return  {String}    渲染好的字符串
             */
            template.render = function(source, options) {
                return compile(source, options);
            };

            /**
             * 渲染模板(根据模板名)
             * @name    template.render
             * @param   {String}    模板名
             * @param   {Object}    数据
             * @return  {String}    渲染好的字符串
             */
            var renderFile = template.renderFile = function(filename, data) {
                var fn = template.get(filename) || showDebugInfo({
                    filename: filename,
                    name: 'Render Error',
                    message: 'Template not found'
                });
                return data ? fn(data) : fn;
            };

            /**
             * 获取编译缓存（可由外部重写此方法）
             * @param   {String}    模板名
             * @param   {Function}  编译好的函数
             */
            template.get = function(filename) {

                var cache;

                if (cacheStore[filename]) {
                    // 使用内存缓存
                    cache = cacheStore[filename];
                } else if (typeof document === 'object') {
                    // 加载模板并编译
                    var elem = document.getElementById(filename);

                    if (elem) {
                        var source = (elem.value || elem.innerHTML)
                            .replace(/^\s*|\s*$/g, '');
                        cache = compile(source, {
                            filename: filename
                        });
                    }
                }

                return cache;
            };

            var utils = template.utils = {

                $helpers: {},

                $include: renderFile,

                $string: toString,

                $escape: escapeHTML,

                $each: each

            };

            /**
             * 添加模板辅助方法
             * @name    template.helper
             * @param   {String}    名称
             * @param   {Function}  方法
             */
            template.helper = function(name, helper) {
                helpers[name] = helper;
            };

            var helpers = template.helpers = utils.$helpers;

            /**
             * 模板错误事件（可由外部重写此方法）
             * @name    template.onerror
             * @event
             */
            template.onerror = function(e) {
                var message = 'Template Error\n\n';
                for (var name in e) {
                    message += '<' + name + '>\n' + e[name] + '\n\n';
                }

                if (typeof console === 'object') {
                    console.error(message);
                }
            };


            /**
             * 模板调试器
             * @param   {Object} e event
             * @returns {String}   调试函数
             */
            var showDebugInfo = function(e) {

                template.onerror(e);

                return function() {
                    return '{Template Error}';
                };
            };

            /**
             * 编译模板
             * @param   {String}    模板字符串
             * @param   {Object}    编译选项
             *
             *      - openTag       {String}
             *      - closeTag      {String}
             *      - filename      {String}
             *      - escape        {Boolean}
             *      - compress      {Boolean}
             *      - debug         {Boolean}
             *      - cache         {Boolean}
             *      - parser        {Function}
             *
             * @return  {Function}  渲染方法
             */
            var compile = template.compile = function(source, options) {

                // 合并默认配置
                options = options || {};
                for (var name in defaults) {
                    if (options[name] === undefined) {
                        options[name] = defaults[name];
                    }
                }

                var filename = options.filename;

                try {
                    var Render = compiler(source, options);
                } catch (e) {
                    e.filename = filename || 'anonymous';
                    e.name = 'Syntax Error';
                    return showDebugInfo(e);
                }

                // 对编译结果进行一次包装
                function render(data) {
                    try {
                        return new Render(data, filename) + '';
                    } catch (e) {
                        // 运行时出错后自动开启调试模式重新编译
                        if (!options.debug) {
                            options.debug = true;
                            return compile(source, options)(data);
                        }
                        return showDebugInfo(e)();
                    }
                }

                render.prototype = Render.prototype;
                render.toString = function() {
                    return Render.toString();
                };

                if (filename && options.cache) {
                    cacheStore[filename] = render;
                }

                return render;
            };

            // 数组迭代
            var forEach = utils.$each;

            // 获取变量
            function getVariable(code) {
                return code
                    .replace(REMOVE_RE, '')
                    .replace(SPLIT_RE, ',')
                    .replace(KEYWORDS_RE, '')
                    .replace(NUMBER_RE, '')
                    .replace(BOUNDARY_RE, '')
                    .split(SPLIT2_RE);
            };


            // 字符串转义
            function stringify(code) {
                return "'" + code
                    // 单引号与反斜杠转义
                    .replace(/('|\\)/g, '\\$1')
                    // 换行符转义(windows + linux)
                    .replace(/\r/g, '\\r')
                    .replace(/\n/g, '\\n') + "'";
            }


            function compiler(source, options) {

                var debug = options.debug;
                var openTag = options.openTag;
                var closeTag = options.closeTag;
                var parser = options.parser;
                var compress = options.compress;
                var escape = options.escape;

                var line = 1;
                var uniq = {
                    $data: 1,
                    $filename: 1,
                    $utils: 1,
                    $helpers: 1,
                    $out: 1,
                    $line: 1
                };

                var isNewEngine = ''.trim; // '__proto__' in {}
                var replaces = isNewEngine ? ["$out='';", "$out+=", ";", "$out"] : [
                    "$out=[];", "$out.push(", ");", "$out.join('')"
                ];

                var concat = isNewEngine ? "$out+=text;return $out;" :
                    "$out.push(text);";

                var print = "function(){" + "var text=''.concat.apply('',arguments);" +
                    concat + "}";

                var include = "function(filename,data){" + "data=data||$data;" +
                    "var text=$utils.$include(filename,data,$filename);" + concat + "}";

                var headerCode = "'use strict';" +
                    "var $utils=this,$helpers=$utils.$helpers," + (debug ? "$line=0," :
                        "");

                var mainCode = replaces[0];

                var footerCode = "return new String(" + replaces[3] + ");"

                // html与逻辑语法分离
                forEach(source.split(openTag), function(code) {
                    code = code.split(closeTag);

                    var $0 = code[0];
                    var $1 = code[1];

                    // code: [html]
                    if (code.length === 1) {
                        mainCode += html($0);

                        // code: [logic, html]
                    } else {
                        mainCode += logic($0);
                        if ($1) {
                            mainCode += html($1);
                        }
                    }
                });

                var code = headerCode + mainCode + footerCode;

                // 调试语句
                if (debug) {
                    code = "try{" + code + "}catch(e){" + "throw {" +
                        "filename:$filename," + "name:'Render Error'," +
                        "message:e.message," + "line:$line," + "source:" + stringify(
                            source) + ".split(/\\n/)[$line-1].replace(/^\\s+/,'')" +
                        "};" + "}";
                }

                try {
                    var Render = new Function("$data", "$filename", code);
                    Render.prototype = utils;
                    return Render;
                } catch (e) {
                    e.temp = "function anonymous($data,$filename) {" + code + "}";
                    throw e;
                }

                // 处理 HTML 语句
                function html(code) {

                    // 记录行号
                    line += code.split(/\n/).length - 1;

                    // 压缩多余空白与注释
                    if (compress) {
                        code = code
                            .replace(/\s+/g, ' ')
                            .replace(/<!--[\w\W]*?-->/g, '');
                    }

                    if (code) {
                        code = replaces[1] + stringify(code) + replaces[2] + "\n";
                    }

                    return code;
                }


                // 处理逻辑语句
                function logic(code) {
                    var thisLine = line;
                    if (parser) {
                        // 语法转换插件钩子
                        code = parser(code, options);
                    } else if (debug) {
                        // 记录行号
                        code = code.replace(/\n/g, function() {
                            line++;
                            return "$line=" + line + ";";
                        });
                    }

                    // 输出语句. 编码: <%=value%> 不编码:<%=#value%>
                    // <%=#value%> 等同 v2.0.3 之前的 <%==value%>
                    if (code.indexOf('=') === 0) {
                        var escapeSyntax = escape && !/^=[=#]/.test(code);
                        code = code.replace(/^=[=#]?|[\s;]*$/g, '');
                        // 对内容编码
                        if (escapeSyntax) {
                            var name = code.replace(/\s*\([^\)]+\)/, '');
                            // 排除 utils.* | include | print
                            if (!utils[name] && !/^(include|print)$/.test(name)) {
                                code = "$escape(" + code + ")";
                            }

                            // 不编码
                        } else {
                            code = "$string(" + code + ")";
                        }

                        code = replaces[1] + code + replaces[2];
                    }

                    if (debug) {
                        code = "$line=" + thisLine + ";" + code;
                    }

                    // 提取模板中的变量名
                    forEach(getVariable(code), function(name) {

                        // name 值可能为空，在安卓低版本浏览器下
                        if (!name || uniq[name]) {
                            return;
                        }

                        var value;

                        // 声明模板变量
                        // 赋值优先级:
                        // [include, print] > utils > helpers > data
                        if (name === 'print') {
                            value = print;
                        } else if (name === 'include') {
                            value = include;
                        } else if (utils[name]) {
                            value = "$utils." + name;
                        } else if (helpers[name]) {
                            value = "$helpers." + name;
                        } else {
                            value = "$data." + name;
                        }

                        headerCode += name + "=" + value + ",";
                        uniq[name] = true;
                    });

                    return code + "\n";
                }
            };

            // 定义模板引擎的语法
            defaults.openTag = '{{';
            defaults.closeTag = '}}';


            var filtered = function(js, filter) {
                var parts = filter.split(':');
                var name = parts.shift();
                var args = parts.join(':') || '';

                if (args) {
                    args = ', ' + args;
                }

                return '$helpers.' + name + '(' + js + args + ')';
            }

            defaults.parser = function(code, options) {

                // var match = code.match(/([\w\$]*)(\b.*)/);
                // var key = match[1];
                // var args = match[2];
                // var split = args.split(' ');
                // split.shift();

                code = code.replace(/^\s/, '');

                var split = code.split(' ');
                var key = split.shift();
                var args = split.join(' ');

                switch (key) {

                    case 'if':
                        code = 'if(' + args + '){';
                        break;
                    case 'else':
                        if (split.shift() === 'if') {
                            split = ' if(' + split.join(' ') + ')';
                        } else {
                            split = '';
                        }
                        code = '}else' + split + '{';
                        break;
                    case '/if':
                        code = '}';
                        break;
                    case 'each':
                        var object = split[0] || '$data';
                        var as = split[1] || 'as';
                        var value = split[2] || '$value';
                        var index = split[3] || '$index';
                        var param = value + ',' + index;

                        if (as !== 'as') {
                            object = '[]';
                        }

                        code = '$each(' + object + ',function(' + param + '){';
                        break;
                    case '/each':
                        code = '});';
                        break;
                    case 'echo':
                        code = 'print(' + args + ');';
                        break;
                    case 'print':
                    case 'include':
                        code = key + '(' + split.join(',') + ');';
                        break;
                    default:
                        // 过滤器（辅助方法）
                        // {{value | filterA:'abcd' | filterB}}
                        // >>> $helpers.filterB($helpers.filterA(value, 'abcd'))
                        // TODO: {{ddd||aaa}} 不包含空格
                        if (/^\s*\|\s*[\w\$]/.test(args)) {
                            var escape = true;

                            // {{#value | link}}
                            if (code.indexOf('#') === 0) {
                                code = code.substr(1);
                                escape = false;
                            }

                            var i = 0;
                            var array = code.split('|');
                            var len = array.length;
                            var val = array[i++];

                            for (; i < len; i++) {
                                val = filtered(val, array[i]);
                            }

                            code = (escape ? '=' : '=#') + val;

                            // 即将弃用 {{helperName value}}
                        } else if (template.helpers[key]) {

                            code = '=#' + key + '(' + split.join(',') + ');';

                            // 内容直接输出 {{value}}
                        } else {

                            code = '=' + code;
                        }
                        break;
                }

                return code;
            };


            fly.template = template;
            module.exports = template;
        }, {
            "./fly.core": 4
        }
    ],
    13: [
        function(require, module, exports) {
            /**
             * 组件
             * @author: huanzhang
             * @email: huanzhang@iflytek.com
             * @update: 2015-06-01 15:20
             */

            'use strict';

            // 依赖模块
            var fly = require('./fly.core'),
                Observable = require('./fly.observable'),
                utils = require('./fly.utils'),
                $ = fly.$,
                NS = fly.NS,
                slice = [].slice;

            var STRING = 'string',
                FUNCTION = 'function',
                ROLE = 'role',
                HANDLER = 'handler';

            var ui = {
                roles: {},
                defaults: {}
            };

            ui.Widget = Observable.extend({

                ctor: function(element, options, cache) {
                    var that = this,
                        name = that.name || '',
                        dataSource;

                    options = options || {};

                    that.element = $(element);
                    that._super();

                    dataSource = options.dataSource || null;

                    if (dataSource) {
                        options = $.extend({}, options, {
                            dataSource: {}
                        });
                    }

                    options = that.options = $.extend(true, {}, that.options, options);

                    if (dataSource) {
                        options.dataSource = dataSource;
                    }

                    if (cache !== false) {
                        that.element.data(ROLE, name.toLowerCase());
                        that.element.data(HANDLER, that);
                        that.element.data(NS + name, that);
                    }

                    that.bind(that.events, options);
                },

                events: [],

                options: {
                    prefix: ''
                },

                _hasBindingTarget: function() {
                    return !!this.element[0].flyBindingTarget;
                },

                _tabindex: function(target) {
                    target = target || this.wrapper;

                    var element = this.element,
                        TABINDEX = 'tabindex',
                        tabindex = target.attr(TABINDEX) || element.attr(TABINDEX);

                    element.removeAttr(TABINDEX);

                    target.attr(TABINDEX, !isNaN(tabindex) ? tabindex : 0);
                },

                setOptions: function(options) {
                    this._setEvents(options);
                    $.extend(this.options, options);
                },

                _setEvents: function(options) {
                    var that = this,
                        idx = 0,
                        length = that.events.length,
                        e;

                    for (; idx < length; idx++) {
                        e = that.events[idx];
                        if (that.options[e] && options[e]) {
                            that.unbind(e, that.options[e]);
                        }
                    }

                    that.bind(that.events, options);
                },

                resize: function(force) {
                    var size = this.getSize(),
                        currentSize = this._size;

                    if (force || (size.width > 0 || size.height > 0) && (!currentSize ||
                        size.width !==
                        currentSize.width || size.height !== currentSize.height)) {
                        this._size = size;
                        this._resize(size, force);
                        this.trigger('resize', size);
                    }
                },

                getSize: function() {
                    return {
                        width: this.element.width(),
                        height: this.element.height()
                    };
                },

                size: function(size) {
                    if (!size) {
                        return this.getSize();
                    } else {
                        this.setSize(size);
                    }
                },

                setSize: $.noop,
                _resize: $.noop,

                destroy: function() {
                    var that = this;

                    that.element.removeData(that.name);
                    that.element.removeData(HANDLER);
                    that.unbind();
                },

                angular: function() {}
            });

            ui.DataBoundWidget = ui.Widget.extend({

                dataItems: function() {
                    return this.dataSource.view();
                },

                _angularItems: function(cmd) {
                    var that = this;
                    that.angular(cmd, function() {
                        return {
                            elements: that.items(),
                            data: $.map(that.dataItems(), function(dataItem) {
                                return {
                                    dataItem: dataItem
                                };
                            })
                        };
                    });
                }
            });

            ui.register = function(widget, register) {
                var name = widget.fn.name,
                    getter;

                register = register || fly.ui;
                register[name] = widget;
                register.roles[name.toLowerCase()] = widget;

                getter = 'getFly' + name;
                name = NS + name;

                $.fn[name] = function(options) {
                    var value = this,
                        args;

                    options = options || {};

                    if (typeof options === STRING) {
                        args = slice.call(arguments, 1);

                        this.each(function() {
                            var widget = $.data(this, name),
                                method,
                                result;

                            if (!widget) {
                                throw new Error('Cannot call method "' + options + '" of ' +
                                    name + ' before it is initialized');
                            }

                            method = widget[options];

                            if (typeof method !== FUNCTION) {
                                throw new Error('Cannot find method "' + options + '" of ' +
                                    name);
                            }

                            result = method.apply(widget, args);

                            if (result !== undefined) {
                                value = result;
                                return false;
                            }
                        });
                    } else {
                        this.each(function() {
                            new widget(this, options);
                        });
                    }

                    return value;
                };

                $.fn[name].widget = widget;

                $.fn[getter] = function() {
                    return this.data(name);
                };
            };

            ui.initWidget = function(element, options, roles) {
                var result,
                    option,
                    widget,
                    idx,
                    length,
                    role,
                    value,
                    dataSource,
                    fullPath,
                    widgetKeyRegExp;

                if (!roles) {
                    roles = fly.ui.roles;
                } else if (roles.roles) {
                    roles = roles.roles;
                }

                element = element.nodeType ? element : element[0];

                role = element.getAttribute('data-role');

                if (!role) {
                    return;
                }

                widget = roles[role];

                var data = $(element).data(),
                    name = widget.fn.name,
                    widgetKey = widget ? 'fly' + name : '';

                widgetKeyRegExp = new RegExp("^" + widgetKey + "$", "i");

                for (var key in data) {
                    if (key.match(widgetKeyRegExp)) {
                        // we have detected a widget of the same kind - save its reference, we will set its options
                        if (key === widgetKey) {
                            result = data[key];
                        } else {
                            return data[key];
                        }
                    }
                }

                if (!widget) {
                    return;
                }

                dataSource = utils.parseOption(element, 'dataSource');

                options = $.extend({}, utils.parseEleOptions(element, widget.fn.options),
                    options);

                if (dataSource) {
                    if (typeof dataSource === STRING) {
                        options.dataSource = fly.getter(dataSource)(window);
                    } else {
                        options.dataSource = dataSource;
                    }
                }

                for (idx = 0, length = widget.fn.events.length; idx < length; idx++) {
                    option = widget.fn.events[idx];

                    value = utils.parseOption(element, option);

                    if (value !== undefined) {
                        options[option] = fly.getter(value)(window);
                    }
                }

                if (!result) {
                    result = new widget(element, options);
                } else if (!$.isEmptyObject(options)) {
                    result.setOptions(options);
                }

                return result;
            };

            fly.ui = ui;
            module.exports = ui;

        }, {
            "./fly.core": 4,
            "./fly.observable": 10,
            "./fly.utils": 14
        }
    ],
    14: [
        function(require, module, exports) {
            /**
             * 常用工具集合
             * @author: huanzhang
             * @email: huanzhang@iflytek.com
             * @update: 2015-06-01 15:20
             */

            'use strict';

            // 依赖core
            var fly = require("./fly.core");
            var $ = fly.$;

            // 工具类库
            var utils = fly.utils || {};

            // 用来检测类型，例如 objectToString.call(value) => "[object Date]"
            var objectToString = {}.toString;

            // 不换行空格，例如&nbsp;
            var nonBreakingSpaceRegExp = /\u00A0/g;

            // 科学计数法
            var exponentRegExp = /[eE][\-+]?[0-9]+/;

            var shortTimeZoneRegExp = /[+|\-]\d{1,2}/,
                longTimeZoneRegExp = /[+|\-]\d{1,2}:?\d{2}/,
                dateRegExp = /^\/Date\((.*?)\)\/$/,
                dashRegExp = /([A-Z])/g,
                jsonRegExp = /^\s*(?:\{(?:.|\r\n|\n)*\}|\[(?:.|\r\n|\n)*\])\s*$/,
                jsonFormatRegExp = /^\{(\d+)(:[^\}]+)?\}|^\[[A-Za-z_]*\]$/,
                numberRegExp = /^(\+|-?)\d+(\.?)\d*$/;

            var offsetRegExp = /[+-]\d*/;

            var formatsSequence = ['G', 'g', 'd', 'F', 'D', 'y', 'm', 'T', 't'];

            /**
             * 获取URL中的参数值
             * @param  {String} name 参数名
             * @return {String} 参数值，若没有该参数，则返回''
             */
            utils.getQueryString = function(name) {
                var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i");
                var r = window.location.search.substr(1).match(reg);
                if (r != null) {
                    return unescape(r[2]);
                }
                return '';
            };

            /**
             * 获取时间戳
             */
            utils.now = Date.now || function() {
                return new Date().getTime();
            };

            /**
             * 函数节流
             * 创建并返回一个像节流阀一样的函数，当重复调用函数的时候，最多每隔 wait 毫秒调用一次该函数。
             * 对于想控制一些触发频率较高的事件有帮助。
             * 如果你想禁用第一次首先执行的话，传递 {leading: false}
             * 还有如果你想禁用最后一次执行的话，传递 {trailing: false}
             * 来自underscore
             * @param   {Function} func    要执行的函数
             * @param   {Number}   wait    频度时间
             * @param   {Object}   options 配置参数
             * @returns {Function} 已节流的函数
             */
            utils.throttle = function(func, wait, options) {
                var context, args, result;
                var timeout = null;
                var previous = 0;
                if (!options) options = {};
                var later = function() {
                    previous = options.leading === false ? 0 : utils.now();
                    timeout = null;
                    result = func.apply(context, args);
                    if (!timeout) context = args = null;
                };
                return function() {
                    var now = utils.now();
                    if (!previous && options.leading === false) previous = now;
                    var remaining = wait - (now - previous);
                    context = this;
                    args = arguments;
                    if (remaining <= 0 || remaining > wait) {
                        if (timeout) {
                            clearTimeout(timeout);
                            timeout = null;
                        }
                        previous = now;
                        result = func.apply(context, args);
                        if (!timeout) context = args = null;
                    } else if (!timeout && options.trailing !== false) {
                        timeout = setTimeout(later, remaining);
                    }
                    return result;
                };
            };

            /**
             * 函数防反跳
             * 将延迟函数的执行(真正的执行)在函数最后一次调用时刻的 wait 毫秒之后
             * 来自underscore
             * @param   {Function} func        要执行的函数
             * @param   {Number}   wait        等待的时间
             * @param   {Boolean}  [immediate] 为 true 时会在 wait 时间间隔的开始调用这个函数
             * @returns {Function} 函数的防反跳版本
             */
            utils.debounce = function(func, wait, immediate) {
                var timeout, args, context, timestamp, result;

                var later = function() {
                    var last = utils.now() - timestamp;
                    if (last < wait && last >= 0) {
                        timeout = setTimeout(later, wait - last);
                    } else {
                        timeout = null;
                        if (!immediate) {
                            result = func.apply(context, args);
                            if (!timeout) context = args = null;
                        }
                    }
                };

                return function() {
                    context = this;
                    args = arguments;
                    timestamp = utils.now();
                    var callNow = immediate && !timeout;
                    if (!timeout) timeout = setTimeout(later, wait);
                    if (callNow) {
                        result = func.apply(context, args);
                        context = args = null;
                    }

                    return result;
                };
            };

            /**
             * 检查元素是否在视野中
             * @param  {Element} element 需要检查的元素
             * @param  {Object}  options 设置选项，可以设置顶部和左边的偏移量
             * @return {Boolean} 在当前视野中，返回true；否则返回false
             */
            utils.isInView = function(element, options) {
                var $element = $(element);

                if (!$element.is(':visible')) {
                    return false;
                }

                var windowLeft = fly.$win.scrollLeft(),
                    windowTop = fly.$win.scrollTop(),
                    windowWidth = fly.$win.width(),
                    windowHeight = fly.$win.height(),
                    width = $element.width(),
                    height = $element.height(),
                    offset = $element.offset(),
                    left = offset.left,
                    top = offset.top;

                options = $.extend({
                    top: 0,
                    left: 0
                }, options);

                // 下边缘在屏幕顶部以下
                // 上边缘在屏幕底部以上
                // 右边缘在屏幕左部以右
                // 左边缘在屏幕右部以左
                if (top + height >= windowTop &&
                    top - options.top <= windowTop + windowHeight &&
                    left + width >= windowLeft &&
                    left - options.left <= windowLeft + windowWidth) {
                    return true;
                } else {
                    return false;
                }
            };

            /**
             * 处理url
             * @param   {String} url 原始url
             * @returns {String} 完整url
             */
            utils.url = function(url) {
                var path = typeof(CONTEXTPATH) == 'undefined' ? '' : CONTEXTPATH;

                if (!url) return '';

                if (url.indexOf('http://') == 0 || url.indexOf('https://') == 0 || url.indexOf(
                    '//') == 0 || (path && url.indexOf(path) == 0)) {
                    return url;
                } else {
                    return path + url;
                }
            };

            /**
             * 解析元素指定的属性值
             * @param   {Object} element 元素
             * @param   {String} option  属性
             * @returns {Any}    解析后的值
             */
            utils.parseOption = function(element, option) {
                var value;

                if (option.indexOf('data') === 0) {
                    option = option.substring(4);
                    option = option.charAt(0).toLowerCase() + option.substring(1);
                }

                option = option.replace(dashRegExp, "-$1").toLowerCase();
                value = element.getAttribute("data-" + option);

                if (value === null) {
                    value = undefined;
                } else if (value === "null") {
                    value = null
                } else if (value === "true") {
                    value = true;
                } else if (value === "false") {
                    value = false;
                } else if (numberRegExp.test(value)) {
                    value = parseFloat(value);
                } else if (jsonRegExp.test(value) && !jsonFormatRegExp.test(value)) {
                    value = new Function("return (" + value + ")")();
                }

                return value;
            };

            /**
             * 解析元素属性值
             * @param   {Object} element 元素
             * @param   {Object} options 需要解析的参数
             * @returns {Object} 解析后的值
             */
            utils.parseEleOptions = function(element, options) {
                var result = {},
                    option,
                    value;

                for (option in options) {
                    value = utils.parseOption(element, option);

                    if (value !== undefined) {
                        /*if (templateRegExp.test(option)) {
                value = fly.template($("#" + value).html());
            }*/
                        result[option] = value;
                    }
                }

                return result;
            };

            /**
             * 计算字符串的字节长度
             * @param   {String} str 需要计算长度的字符串
             * @returns {Number} 字节长度
             */
            utils.getByteLen = function(str) {
                var len = 0,
                    str = str || '',
                    l = str.length,
                    i = 0;
                for (; i < l; i++) {
                    var code = str.charCodeAt(i);
                    if (code >= 0 && code <= 128) {
                        len += 1;
                    } else {
                        len += 2;
                    }
                }
                return len;
            };

            /**
             * 在输入框中选取字符
             * @param   {Number} start [[Description]]
             * @param   {Number} end   [[Description]]
             * @returns {Object} document
             */
            utils.selectRange = function(start, end) {
                var ele = this[0] || this;
                if (ele.createTextRange) {
                    var range = ele.createTextRange();
                    range.collapse(true);
                    range.moveEnd('character', end);
                    range.moveStart('character', start);
                    range.select();
                } else {
                    ele.focus();
                    ele.setSelectionRange(start, end);
                }
                return ele;
            };

            /**
             * POST发送数据
             * @param   {String}   url  数据接口
             * @param   {Object}   data 需要传输的数据
             * @param   {String}   type 接收数据的方式
             * @returns {Function} jQuery Ajax
             */
            utils.post = function(url, data, type) {
                type = type || 'json';
                return $.ajax({
                    url: utils.url(url),
                    data: data || {},
                    dataType: type || 'json',
                    type: 'POST'
                });
            };

            /**
             * GET请求数据
             * @param   {String}   url  数据接口
             * @param   {Object}   data 需要传输的数据
             * @param   {String}   type 接收数据的方式
             * @returns {Function} jQuery Ajax
             */
            utils.get = function(url, data, type) {
                type = type || 'json';
                return $.ajax({
                    url: utils.url(url),
                    cache: false,
                    data: data || {},
                    dataType: type || 'json',
                    type: 'GET'
                });
            };

            /**
             * 获取最高层级的window
             * @returns {Object} 引用flyui的最高层级的window对象
             */
            fly.top = function() {
                var top = window,
                    test = function(name) {
                        try {
                            var doc = window[name].document; // 跨域|无权限
                            doc.getElementsByTagName; // chrome 本地安全限制
                        } catch (e) {
                            return false;
                        }

                        return window[name].fly &&
                            doc.getElementsByTagName('frameset').length === 0;
                    };

                if (test('top')) {
                    top = window.top;
                } else if (test('parent')) {
                    top = window.parent;
                }

                return top;
            }();

            /**
             * 销毁vm绑定的组件
             * @param {Object} element
             */
            fly.destroy = function(element) {
                $(element).find('[data-role]').addBack().each(function() {
                    var data = $(this).data();
                    for (var key in data) {
                        if (key.indexOf(fly.NS) === 0 && typeof data[key].destroy ===
                            FUNCTION) {
                            data[key].destroy();
                        }
                    }
                });
            };

            /**
             * 获取计算后的样式
             * @param   {Object} element    DOM
             * @param   {Array}  properties 属性
             * @returns {Object} 样式对象
             */
            fly.getComputedStyles = function(element, properties) {
                var defaultView = document.defaultView,
                    styles = {},
                    computedStyle;

                if (defaultView && defaultView.getComputedStyle) {
                    computedStyle = defaultView.getComputedStyle(element, "");

                    if (properties) {
                        $.each(properties, function(idx, value) {
                            styles[value] = computedStyle.getPropertyValue(value);
                        });
                    }
                } else {
                    computedStyle = element.currentStyle;

                    if (properties) {
                        $.each(properties, function(idx, value) {
                            styles[value] = computedStyle[value.replace(/\-(\w)/g, function(
                                strMatch, g1) {
                                return g1.toUpperCase();
                            })];
                        });
                    }
                }

                if ($.isEmptyObject(styles)) {
                    styles = computedStyle;
                }

                return styles;
            };

            /**
             * 是否支持滚动条
             * @param   {Object}  element DOM
             * @returns {Boolean} 是则支持，否则不支持
             */
            fly.isScrollable = function(element) {
                return fly.getComputedStyles(element, ["overflow"]).overflow != "visible";
            };

            /**
             * 返回当前获得焦点的元素
             * @returns {Object} DOM
             */
            fly.activeElement = function() {
                try {
                    return document.activeElement;
                } catch (e) {
                    return document.documentElement.activeElement;
                }
            };

            /**
             * 插入字符
             * @param   {Object} element DOM
             * @param   {Number} start   开始位置
             * @param   {Number} end     结束位置
             * @returns {Array}  [[Description]]
             */
            fly.caret = function(element, start, end) {
                var rangeElement;
                var isPosition = start !== undefined;

                if (end === undefined) {
                    end = start;
                }

                if (element[0]) {
                    element = element[0];
                }

                if (isPosition && element.disabled) {
                    return;
                }

                try {
                    if (element.selectionStart !== undefined) {
                        if (isPosition) {
                            element.focus();
                            element.setSelectionRange(start, end);
                        } else {
                            start = [element.selectionStart, element.selectionEnd];
                        }
                    } else if (document.selection) {
                        if ($(element).is(":visible")) {
                            element.focus();
                        }

                        rangeElement = element.createTextRange();

                        if (isPosition) {
                            rangeElement.collapse(true);
                            rangeElement.moveStart("character", start);
                            rangeElement.moveEnd("character", end - start);
                            rangeElement.select();
                        } else {
                            var rangeDuplicated = rangeElement.duplicate(),
                                selectionStart, selectionEnd;

                            rangeElement.moveToBookmark(document.selection.createRange().getBookmark());
                            rangeDuplicated.setEndPoint('EndToStart', rangeElement);
                            selectionStart = rangeDuplicated.text.length;
                            selectionEnd = selectionStart + rangeElement.text.length;

                            start = [selectionStart, selectionEnd];
                        }
                    }
                } catch (e) {
                    start = [];
                }

                return start;
            };

            fly.utils = utils;
            module.exports = utils;
        }, {
            "./fly.core": 4
        }
    ],
    15: [
        function(require, module, exports) {
            /**
             * 数据校验
             * @author: huanzhang
             * @email: huanzhang@iflytek.com
             * @update:
             */

            'use strict';

            // 依赖core
            var fly = require('./fly.core'),
                utils = require('./fly.utils'),
                calc = require('./fly.calculate'),
                format = require('./fly.format'),
                $ = fly.$;

            // 验证库
            var REGEXP = {
                EMAIL: "^[a-z0-9._%-]+@([a-z0-9-]+\\.)+[a-z]{2,4}$",
                NUMBER: "^\\-?\\d+(\\.\\d+)?$",
                URL: "^(http|https|ftp)\\:\\/\\/[a-z0-9\\-\\.]+\\.[a-z]{2,3}(:[a-z0-9]*)?\\/?([a-z0-9\\-\\._\\?\\,\\'\\/\\\\\\+&amp;%\\$#\\=~])*$",
                TEL: "^1\\d{10}$",
                ZIPCODE: "^\\d{6}$"
            };

            // 提示语
            var PROMPT = {
                radio: '请选择一个选项',
                checkbox: '如果要继续，请选中此框',
                select: '请选择列表中的一项',
                email: '请输入电子邮件地址',
                url: '请输入网站地址',
                tel: '请输入手机号码',
                number: '请输入数值',
                date: '请输入日期',
                pattern: '内容格式不符合要求',
                empty: '请填写此字段',
                multiple: '多条数据使用逗号分隔'
            };

            var UNDEFINED = 'undefined',
                NUMBER = 'number',
                FUNCTION = 'function',
                STRING = 'string';

            var specialChars = /\W+$/;

            var showTooltip = true;

            var isRegExp = function(valid) {
                var ele = $(this),
                    value = $.trim(ele.val()),
                    type = valid.type || ele.attr('type'),
                    regex = valid.pattern;

                // 获取正则表达式，pattern属性获取优先，然后通过type类型匹配。
                // 注意，不处理为空的情况
                regex = regex || (function() {
                    return ele.attr('pattern');
                })() || (function() {
                    // 文本框类型处理，可能有管道符——多类型重叠，如手机或邮箱
                    return type && $.map(type.split('|'), function(typeSplit) {
                        var matchRegex = REGEXP[typeSplit.toUpperCase()];
                        if (matchRegex) return matchRegex;
                    }).join('|');
                })();

                // 若值为空或正则为空
                if (value === '' || !regex) return true;

                // multiple多数据的处理
                var isMultiple = !!$(ele).attr('multiple'),
                    newRegExp = new RegExp(regex);

                // number类型下multiple无效
                if (isMultiple && !/^number|range$/i.test(type)) {
                    var isAllPass = true;
                    $.each(value.split(','), function(i, partValue) {
                        partValue = $.trim(partValue);
                        if (isAllPass && !newRegExp.test(partValue)) {
                            isAllPass = false;
                        }
                    });
                    return isAllPass;
                } else {
                    return newRegExp.test(value);
                }
                return true;
            };

            var tooltip = function(ele, content) {
                if (!showTooltip) return;

                if (fly.validateTip) {
                    fly.validateTip(content);
                    return;
                }

                var widget = ele.closest('.widget');
                ele = widget.length ? widget : ele;
                ele.flyTooltip && ele.flyTooltip({
                    content: content
                });
            };

            var isEmpty = function(value) {
                var ele = $(this),
                    trimValue = ele.val();

                value = value || ele.attr('placeholder');

                if (ele.attr('type') !== 'password') {
                    trimValue = $.trim(trimValue);
                }

                if (trimValue === '' || trimValue === value) {
                    return true;
                }

                return false;
            };

            var isOverflow = function(valid) {
                var ele = $(this);
                if (!ele) return false;

                var value = ele.val(),
                    step = ele.attr('step'),
                    type = ele.data('type') || ele.attr('type'),
                    min = ele.attr('min'),
                    max = ele.attr('max');

                valid = valid || {};

                if (typeof(valid.min) !== UNDEFINED) min = valid.min;
                if (typeof(valid.max) !== UNDEFINED) max = valid.max;
                if (typeof(valid.step) !== UNDEFINED) step = valid.step;
                if (typeof(valid.type) !== UNDEFINED) type = valid.type;

                if (type === NUMBER) {
                    if (typeof(min) !== UNDEFINED && value < min) {
                        tooltip(ele, '值必须大于或等于' + min);
                    } else if (typeof(max) !== UNDEFINED && value > max) {
                        tooltip(ele, '值必须小于或等于' + max);
                    } else if (typeof(step) !== UNDEFINED && !
                        /^\d+$/.test(calc.div(Math.abs(calc.sub(value, min || 0)), step))) {
                        tooltip(ele, '值无效');
                    } else {
                        return false;
                    }
                    ele.focus();
                    ele.select();
                } else {
                    if (typeof(min) !== UNDEFINED && value.length < min) {
                        tooltip(ele, '至少输入' + min + '个字符');
                        ele.focus();
                    } else if (typeof(max) !== UNDEFINED && value.length > max) {
                        tooltip(ele, '最多输入' + max + '个字符');
                        utils.selectRange.call(ele, max, value.length);
                    } else {
                        return false;
                    }
                }

                return true;
            };

            var customValid = function(valid) {
                var ele = $(this),
                    value = ele.val(),
                    check = valid.check;

                if (typeof(check) === FUNCTION) {
                    return check.call(ele);
                }

                return true;
            };

            var remind = function(valid, tag) {

                var control = $(this),
                    type = valid.type,
                    key = valid.key || control.data('key'),
                    text = valid.title || $.trim(control.closest('.widget').children(
                        '.label').text()).replace(
                        /\*/ig, '').replace(/＊/ig, '').replace(/：/ig, '').replace(/:/ig, ''),
                    placeholder;

                // 如果元素完全显示
                if ($(control).is(':visible')) {
                    if (type == 'radio' || type == 'checkbox') {
                        tooltip(control, PROMPT[type]);
                        control.focus();
                    } else if (tag == 'select' || tag == 'empty') {
                        // 下拉值为空或文本框文本域等为空
                        tooltip(control, (tag == 'empty' && text) ? '您尚未输入' + text : PROMPT[
                            tag]);
                        control.focus();
                    } else if (/^range|number$/i.test(type) && Number(control.val())) {
                        // 整数值与数值的特殊提示
                        tooltip(control, '值无效');
                        control.focus();
                        control.select();
                    } else {
                        // 文本框文本域格式不准确
                        // 提示文字的获取	
                        var finalText = PROMPT[type] || PROMPT['pattern'];
                        if (text) {
                            finalText = '您输入的' + text + '格式不准确';
                        }
                        if (type != 'number' && !!control.attr('multiple')) {
                            finalText += "，" + PROMPT["multiple"];
                        }

                        tooltip(control, finalText);
                        control.focus();
                        control.select();
                    }
                } else {
                    // 元素隐藏，寻找关联提示元素, 并走label提示流(radio, checkbox除外)
                    var selector = control.data('target'),
                        target = typeof selector == STRING ? $((document.getElementById(
                            selector) ? '#' : '.') + selector) : selector,
                        customTxt = '您尚未' + (key || (tag == 'empty' ? '输入' : '选择')) + ((!
                            /^radio|checkbox$/i.test(type) && text) || '该项内容'),
                        offset;
                    if (target && target.length) {
                        tooltip(target, customTxt);
                    } else {
                        // alert
                        //fly.tip(customTxt);
                    }
                }
                return false;
            };

            var validate = function(ele, valid, hasTooltip) {
                ele = $(ele);
                if (ele.length === 0) {
                    return true;
                }

                valid = valid || {};
                showTooltip = hasTooltip === false ? false : true;

                var type = valid.type || ele.data('type') || ele.attr('type'),
                    tag = ele[0].tagName,
                    required = valid.required || !!ele.attr('required'),
                    target = valid.target || ele.attr('mind-target'),
                    accept = target ? $('[mind-accept="' + target + '"]') : null,
                    name = ele.attr('name'),
                    isPass = true;

                // 禁用字段不验证
                // 或target是禁用状态也不验证
                if (ele.is(':disabled') || (accept && accept.is(':disabled'))) {
                    return true;
                }

                // 无需验证的状态
                if (type == 'submit' || type == 'reset' || type == 'file' || type ==
                    'image') {
                    return true;
                }

                // 需要验证的有
                // input文本框, type, required, pattern, max, min
                // radio, checkbox
                // select
                // textarea
                if ((type == 'radio' || type == 'checkbox') && required) {
                    // 单选框和复选框，只需验证是否必选
                    var eles = name ? $('input[type="' + type + '"][name="' + name + '"]') :
                        ele,
                        pass = false;

                    eles.each(function() {
                        if (pass == false && $(this).is(':checked')) {
                            pass = true;
                            return;
                        }
                    });

                    if (pass == false) {
                        isPass = remind.call(eles.get(0), type, tag);
                    }
                } else if (tag == 'select' && required && !ele.val()) {
                    // 下拉框只要关心值
                    isPass = remind.call(ele, valid, tag);
                } else if (required && isEmpty.call(ele)) {
                    // 空值
                    // 需要判断当前控件的类型
                    remind.call(ele, valid, 'empty');
                    isPass = false;
                } else if (!isRegExp.call(ele, valid)) {
                    // 各种类型文本框以及文本域
                    // allpass为true表示是为空，为false表示验证不通过
                    remind.call(ele, valid, tag);
                    isPass = false;
                } else if (isOverflow.call(ele, valid)) {
                    // 最大值最小值, 个数是否超出的验证
                    isPass = false;
                } else if (!customValid.call(ele, valid)) {
                    // 最后校验 自定义校验
                    isPass = false;
                    ele.focus();
                }

                ele.toggleClass('error', !isPass);

                return isPass;
            };

            fly.validate = validate;
            module.exports = validate;

        }, {
            "./fly.calculate": 2,
            "./fly.core": 4,
            "./fly.format": 7,
            "./fly.utils": 14
        }
    ],
    16: [
        function(require, module, exports) {
            'use strict';

            var fly = {};

            fly = require('./fly.core');
            require('./fly.binder');
            require('./fly.calculate');
            require('./fly.class');
            require('./fly.data');
            require('./fly.drag');
            require('./fly.format');
            require('./fly.legacy');
            require('./fly.model');
            require('./fly.observable');
            require('./fly.router');
            require('./fly.template');
            require('./fly.ui');
            require('./fly.utils');
            require('./fly.validate');

            module.exports = fly;

        }, {
            "./fly.binder": 1,
            "./fly.calculate": 2,
            "./fly.class": 3,
            "./fly.core": 4,
            "./fly.data": 5,
            "./fly.drag": 6,
            "./fly.format": 7,
            "./fly.legacy": 8,
            "./fly.model": 9,
            "./fly.observable": 10,
            "./fly.router": 11,
            "./fly.template": 12,
            "./fly.ui": 13,
            "./fly.utils": 14,
            "./fly.validate": 15
        }
    ]
}, {}, [16]);
