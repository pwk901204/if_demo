'use strict';
var $ = require('jquery');
var fly = require('fly');
var Popup = require('popup'),
    StaticList = require('./staticlist'),
    Component = fly.Component,
    proxy = $.proxy,
    extend = $.extend;

var ID = "id",
    CHANGE = "change",
    STATEHOVER = "state-hover",
    OPEN = "open",
    CLOSE = "close",
    SELECT = "select",
    REQUESTSTART = "requestStart",
    REQUESTEND = "requestEnd",
    WIDTH = "width";

var ListBox = Component.extend({
    
    name: 'ListBox',

    ctor: function(element, options) {
        var that = this,
            ns = that.ns,
            id;

        if(!element) return;
        that._super(element, options);
        element = that.$element;
        options = that.options;
        id = element.attr(ID);

        that.ul = $('<ul unselectable="on" class="list reset" />')
            .attr({tabIndex: -1});

        that.list = $("<div class='list-container'/>")
            .append(that.ul)
            .on("mousedown" + ns, proxy(that._listMousedown, that));

        if (id) {
            that.list.attr(ID, id + "List");
            that.ul.attr(ID, id + "ListBox");
        }

        that._accessors();
        that._initValue();
    },

    options: {
        valuePrimitive: true
    },

    setOptions: function(options) {
        this._super(options);
        if (options && options.enable !== undefined) {
            options.enabled = options.enable;
        }
    },

    focus: function() {
        this._focused.focus();
    },

    readonly: function(readonly) {
        this._editable({
            readonly: readonly === undefined ? true : readonly,
            disable: false
        });
    },

    enable: function(enable) {
        this._editable({
            readonly: false,
            disable: !(enable = enable === undefined ? true : enable)
        });
    },

    _listOptions: function(options) {
        var currentOptions = this.options;

        options = options || {};
        options = {
            height: options.height || currentOptions.height,
            valueField: options.valueField || currentOptions.valueField,
            textField: options.textField || currentOptions.textField,
            template: options.template || currentOptions.template
        };

        if (!options.template) {
            options.template = '{{' + fly.expr(options.textField, "$data") + '}}';
        }

        return options;
    },

    _initList: function() {
        var that = this;
        var options = that.options;
        var value = options.value;

        var listBoundHandler = proxy(that._listBound, that);

        var listOptions = {
            autoBind: false,
            value: options.value,
            selectable: options.selectable,
            dataSource: that.dataSource,
            dataBinding: function() {
                that.trigger("dataBinding");
            },
            dataBound: listBoundHandler,
            listBound: listBoundHandler,
            click: proxy(that._click, that),
            change: proxy(that._listChange, that),
            activate: proxy(that._activateItem, that),
            selectedItemChange: proxy(that._listChange, that)
        };

        listOptions = extend(that._listOptions(), listOptions);

        that.listView = new StaticList(that.ul[0], listOptions);

        if (value !== undefined) {
            that.listView.value(value.toString().split(options.valueSplit)).done(function() {
                var text = options.text;

                if (that.input && that.selectedIndex === -1) {
                    if (text === undefined || text === null) {
                        text = value;
                    }

                    that._accessor(value);
                    that.input.val(text);
                }
            });
        }
    },

    _listMousedown: function(e) {
        if (!this.filterInput || this.filterInput[0] !== e.target) {
            e.preventDefault();
        }
    },

    _filterSource: function(filter, force) {
        var that = this;
        var options = that.options;
        var dataSource = that.dataSource;
        var expression = extend({}, dataSource.filter() || {});

        var removed = ListBox.removeFiltersForField(expression, options.textField);

        if ((filter || removed) && that.trigger("filtering", {
                filter: filter
            })) {
            return;
        }

        if (filter) {
            expression = expression.filters || [];
            expression.push(filter);
        }

        if (!force) {
            dataSource.filter(expression);
        } else {
            dataSource.read(expression);
        }
    },

    _initValue: function() {
        var that = this,
            value = that.options.value;

        if (value !== null) {
            (that.valueInput || that.$element.find('input:hidden')).val(value);
        } else {
            value = that._accessor();
            that.options.value = value;
        }

        that._old = value;
    },

    _ignoreCase: function() {
        var that = this,
            model = that.dataSource.reader.model,
            field;

        if (model && model.fields) {
            field = model.fields[that.options.textField];

            if (field && field.type && field.type !== "string") {
                that.options.ignoreCase = false;
            }
        }
    },

    _focus: function(candidate) {
        return this.listView.focus(candidate);
    },

    current: function(candidate) {
        return this._focus(candidate);
    },

    items: function() {
        return this.ul[0].children;
    },

    destroy: function() {
        // Component.fn.destroy.call(this);
        this._super();
        this._unbindDataSource();
        this.listView.destroy();
        this.list.off(this.ns);
        this.popup.destroy();

        if (this._form) {
            this._form.off('reset', this._resetHandler);
        }
    },

    dataItem: function(index) {
        var that = this;

        if (index === undefined) {
            return that.listView.selectedDataItems()[0];
        }

        if (typeof index !== "number") {
            index = $(that.items()).index(index);
        }

        return that.dataSource.view()[index];
    },

    _activateItem: function() {
        this.listView.focus();
    },

    _accessors: function() {
        var that = this;
        var element = $(that.$element);
        var options = that.options;
        var getter = fly.getter;
        var textField = element.attr("data-text-field");
        var valueField = element.attr("data-value-field");

        if (!options.textField && textField) {
            options.textField = textField;
        }

        if (!options.valueField && valueField) {
            options.valueField = valueField;
        }

        that._text = getter(options.textField);
        that._value = getter(options.valueField);
    },

    _blur: function() {
        var that = this;

        that._change();

        if(that.options.selectable === true) {
            that.close();
        }
    },

    /**
     * 检测值是否改变
     * 若改变则会触发change事件
     */
    _change: function() {
        var that = this;
        var index = that.selectedIndex;
        var optionValue = that.options.value;
        var value = that.value();
        var trigger;

        if (that._isSelect && !that.listView.isBound() && optionValue) {
            value = optionValue;
        }

        if (value !== that._old) {
            trigger = true;
        } else if (index !== undefined && index !== that._oldIndex) {
            trigger = true;
        }

        if (trigger) {
            that._old = value;
            that._oldIndex = index;
            that.$element.trigger(CHANGE);
            that.trigger(CHANGE);
        }
    },

    _data: function() {
        var data = this.dataSource.view();
    },

    _enable: function() {
        var that = this,
            options = that.options,
            disabled = that.$element.is("[disabled]");

        if (options.enable !== undefined) {
            options.enabled = options.enable;
        }

        if (!options.enabled || disabled) {
            that.enable(false);
        } else {
            that.readonly(that.$element.is("[readonly]"));
        }
    },

    _dataValue: function(dataItem) {
        var value = this._value(dataItem);

        if (value === undefined) {
            value = this._text(dataItem);
        }

        return value;
    },

    _offsetHeight: function() {
        var offsetHeight = 0;
        var siblings = this.listView.content.prevAll(":visible");

        siblings.each(function() {
            var element = $(this);

            if (element.hasClass("list-filter")) {
                offsetHeight += element.children().outerHeight();
            } else {
                offsetHeight += element.outerHeight();
            }
        });

        return offsetHeight;
    },

    _height: function(length) {
        var that = this;
        var list = that.list;
        var height = that.options.height;
        var visible = that.popup.visible();
        var offsetTop;
        var popups;

        if (length) {
            popups = list.add(list.parent(".animation-container")).show();

            height = that.listView.content[0].scrollHeight > height ? height : "auto";

            popups.height(height);

            if (height !== "auto") {
                offsetTop = that._offsetHeight();

                if (offsetTop) {
                    height -= offsetTop;
                }
            }

            that.listView.content.height(height);

            if (!visible) {
                popups.hide();
            }
        }

        return height;
    },

    _adjustListWidth: function() {
        var list = this.list,
            width = list[0].style.width,
            wrapper = this.wrapper,
            computedStyle, computedWidth;

        if (!list.data(WIDTH) && width) {
            return;
        }

        computedStyle = window.getComputedStyle ? window.getComputedStyle(wrapper[0],
            null) : 0;
        computedWidth = computedStyle ? parseFloat(computedStyle.width) : wrapper.outerWidth();

        if (computedStyle && fly.support.browser.ie) {
            computedWidth += parseFloat(computedStyle.paddingLeft) + parseFloat(
                    computedStyle.paddingRight) + parseFloat(computedStyle.borderLeftWidth) +
                parseFloat(computedStyle.borderRightWidth);
        }

        if (list.css("box-sizing") !== "border-box") {
            width = computedWidth - (list.outerWidth() - list.width());
        } else {
            width = computedWidth;
        }

        list.css({
                // fontFamily: wrapper.css("font-family"), // 几乎没有字体变化的需求
                width: width
            })
            .data(WIDTH, width);

        return true;
    },

    _openHandler: function(e) {
        this._adjustListWidth();

        if (this.trigger(OPEN)) {
            e.preventDefault();
        }
    },

    _closeHandler: function(e) {
        if (this.trigger(CLOSE)) {
            e.preventDefault();
        }
    },

    _focusItem: function() {
        var listView = this.listView;
        var focusedItem = listView.focus();
        var index = listView.select();

        index = index[index.length - 1];

        if (index === undefined && this.options.highlightFirst && !focusedItem) {
            index = 0;
        }

        if (index !== undefined) {
            listView.focus(index);
        } else {
            listView.scrollToIndex(0);
        }
    },

    _firstOpen: function() {
        this._height(this.dataSource.view().length);
    },

    _popup: function() {
        var that = this;

        that.popup = new Popup(that.list, extend({}, that.options.popup, {
            anchor: that.wrapper,
            open: proxy(that._openHandler, that),
            close: proxy(that._closeHandler, that),
            animation: that.options.animation
        }));

        that.popup.one(OPEN, proxy(that._firstOpen, that));
    },

    _makeUnselectable: function() {
        if (fly.support.browser.ie < 9) {
            this.list.find("*").not(".textbox").attr("unselectable", "on");
        }
    },

    _toggleHover: function(e) {
        $(e.currentTarget).toggleClass(STATEHOVER, e.type === "mouseenter");
    },

    _toggle: function(open, preventFocus) {
        var that = this;

        open = open !== undefined ? open : !that.popup.visible();

        if (!preventFocus && that._focused[0] !== fly.activeElement()) {
            that._focused.focus();
        }

        that[open ? OPEN : CLOSE]();
    },

    _triggerCascade: function() {
        var that = this;

        if (!that._cascadeTriggered || that._old !== that.value() || that._oldIndex !==
            that.selectedIndex) {
            that._cascadeTriggered = true;
            that.trigger("cascade", {
                userTriggered: that._userTriggered
            });
        }
    },

    _dataChange: function(e){
        var that = this;
        if (e.action !== 'itemchange') {
            that.popup.one(OPEN, proxy(that._firstOpen, that));
        }
    },

    _unbindDataSource: function() {
        var that = this;

        that.dataSource.unbind(REQUESTSTART, that._requestStartHandler)
            .unbind(REQUESTEND, that._requestEndHandler)
            .unbind("error", that._errorHandler);
    }
});

ListBox.removeFiltersForField = function(expression, field) {
    var filters;
    var found = false;

    if (expression.filters) {
        filters = $.grep(expression.filters, function(filter) {
            found = ListBox.removeFiltersForField(filter, field);
            if (filter.filters) {
                return filter.filters.length;
            } else {
                return filter.field != field;
            }
        });

        if (!found && expression.filters.length !== filters.length) {
            found = true;
        }

        expression.filters = filters;
    }

    return found;
};

module.exports = ListBox;