'use strict';
var $ = require('jquery');
var fly = require('fly');
var Select = require('select');

// 静态变量
var NAME = 'DropDown',
    NS = '.' + fly.NS + NAME,
    DISABLED = "disabled",
    STRING = 'string',
    READONLY = "readonly",
    CHANGE = "change",
    FOCUSED = "state-focused",
    DEFAULT = "state-default",
    STATEDISABLED = "state-disabled",
    SELECTED = "state-selected",
    HOVEREVENTS = "mouseenter" + NS + " mouseleave" + NS,
    TABINDEX = "tabindex",
    STATE_ACCEPT = "accept",
    keys = fly.keys,
    proxy = $.proxy,
    ObservableObject = fly.ObservableObject,
    // ObservableArray = fly.ObservableArray,
    isPlainObject = $.isPlainObject;

var defaults = fly.ui.defaults[NAME] = {
    enabled: true,
    autoBind: true,
    index: -1,
    name: '',
    text: null,
    value: null,
    delay: 500,
    height: 200,
    textField: "text",
    valueField: "value",
    // textSplit: ',',
    // valueSplit: ',',
    optionLabel: "请选择", // 提示选项，可接受文字和object
    cascadeFrom: '',
    cascadeFromField: '',
    ignoreCase: true,
    selectable: true,  // multiple
    template: null,
    valuePrimitive: true,
    valueTemplate: null, // 显示text的模板
    optionLabelTemplate: null // 选项模板
};

var c = module.exports = Select.extend({

    name: NAME,
    
    template: fly.template(__inline('dropdown.tpl')),

    ctor: function(element, options) {
        var that = this;
        var index = options && options.index;
        var optionLabel, text;

        that.ns = NS;
        // options = $.isArray(options) ? {
        //     dataSource: options
        // } : options;

        that._super(element, options);
        options = that.options;

        that.valueInput = that.$element.find('input[type="hidden"]');
        that.valueInput.on('focus' + NS, proxy(that._focusHandler, that))
            .attr('role', NAME); // 校验;

        that._inputTemplate();
        that._reset();

        that.optionLabel = $();

        that._wrapper();
        that._tabindex();
        that.wrapper.data(TABINDEX, that.wrapper.attr(TABINDEX));

        that._span();
        that._popup();
        // that._dataSource();
        that._ignoreCase();
        that._enable();

        that._oldIndex = that.selectedIndex = -1;

        if (index !== undefined) {
            options.index = index;
        }

        that._initialIndex = options.index;
        that._optionLabel();
        that._initList();

        that._cascade();

        if (options.autoBind) {
            that.dataSource.fetch();
        } else if (that.selectedIndex === -1) {
            text = options.text || "";
            if (!text) {
                optionLabel = options.optionLabel;

                if (optionLabel && options.index === 0) {
                    text = optionLabel;
                } else if (that._isSelect) {
                    text = element.children(":selected").text();
                }
            }

            that._textAccessor(text);
        }

        fly.notify(that);
    },

    options: defaults,

    events: [
        "open",
        "close",
        CHANGE,
        "select",
        'focus',
        'blur',
        "dataBinding",
        "dataBound",
        "cascade",
        'cascadeFilter'
    ],

    setOptions: function(options) {
        // this._super.setOptions(options);
        this._super();
        this.listView.setOptions(this._listOptions(options));

        this._optionLabel();
        this._inputTemplate();
        this._accessors();
        this._enable();

        if (!this.value() && this.optionLabel[0]) {
            this.select(0);
        }
    },

    destroy: function() {
        var that = this;

        that.wrapper.off(NS);
        that.valueInput.off(NS);
        that._inputWrapper.off(NS);

        that._arrow.off();
        that._arrow = null;

        that.optionLabel.off();
        that._super();
        // that._super.destroy.call(that);
    },

    open: function() {
        var that = this;

        if (that.popup.visible()) {
            return;
        }

        if (!that.listView.isBound() || that._state === STATE_ACCEPT) {
            that._open = true;
            that._state = "rebind";
        } else if (that._allowOpening()) {
            that.popup.open();
            that._focusItem();
        }
    },

    toggle: function(toggle) {
        this._toggle(toggle, true);
    },

    _allowOpening: function(length) {
        return this.optionLabel[0] || this.dataSource.view().length;
    },

    current: function(candidate) {
        var current;

        if (candidate === undefined) {
            current = this.listView.focus();

            if (!current && this.selectedIndex === 0 && this.optionLabel[0]) {
                return this.optionLabel;
            }

            return current;
        }

        this._focus(candidate);
    },

    dataItem: function(index) {
        var that = this;
        var dataItem = null;
        var hasOptionLabel = !!that.optionLabel[0];
        var optionLabel = that.options.optionLabel;

        if (index === undefined) {
            dataItem = that.listView.selectedDataItems()[0];
        } else {
            if (typeof index !== "number") {
                if (index.hasClass("list-optionlabel")) {
                    index = -1;
                } else {
                    index = $(that.items()).index(index);
                }
            } else if (hasOptionLabel) {
                index -= 1;
            }

            dataItem = that.dataSource.view()[index];
        }

        if (!dataItem && hasOptionLabel) {
            dataItem = isPlainObject(optionLabel) ? new ObservableObject(optionLabel) :
                that._assignInstance(that._optionLabelText(), "");
        }

        return dataItem;
    },

    refresh: function() {
        this.listView.refresh();
    },

    text: function(text) {
        var that = this;
        var dataItem, loweredText;
        var ignoreCase = that.options.ignoreCase;

        text = text === null ? "" : text;

        if (text !== undefined) {
            if (typeof text === STRING) {
                loweredText = ignoreCase ? text.toLowerCase() : text;

                that._select(function(data) {
                    data = that._text(data);

                    if (ignoreCase) {
                        data = (data + "").toLowerCase();
                    }

                    return data === loweredText;
                });

                dataItem = that.dataItem();

                if (dataItem) {
                    text = dataItem;
                }
            }

            that._textAccessor(text);
        } else {
            return that._textAccessor();
        }
    },

    value: function(value) {
        var that = this;

        if (value === undefined) {
            value = that._accessor() || that.listView.value()[0];
            return value === undefined || value === null ? "" : value;
        }

        // if (value === null) {
        //     value = '';
        // }

        if (value) {
            that._initialIndex = null;
        }

        that.listView.value(value)
            .done(function() {

                if (that.selectedIndex === -1 && that.text()) {
                    that.text('');
                }

                that._old = that._accessor();
                that._oldIndex = that.selectedIndex;

            });

        that._fetchData();
    },

    _optionLabel: function() {
        var that = this;
        var options = that.options;
        var optionLabel = options.optionLabel;
        var template = options.optionLabelTemplate;

        if (!optionLabel) {
            that.optionLabel.off().remove();
            that.optionLabel = $();
            return;
        }

        if (!template) {
            template = "{{";

            if (typeof optionLabel === STRING) {
                template += "$data";
            } else {
                template += fly.expr(options.textField, "$data");
            }

            template += "}}";
        }

        if (typeof template !== "function") {
            template = fly.template.compile(template);
        }

        that.optionLabelTemplate = template;

        if (!that.optionLabel[0]) {
            that.optionLabel = $('<div class="list-optionlabel"></div>').prependTo(
                that.list);
        }

        that.optionLabel.html(template(optionLabel))
            .off()
            .click(proxy(that._click, that))
            .on(HOVEREVENTS, that._toggleHover);

    },

    _optionLabelText: function() {
        var optionLabel = this.options.optionLabel;
        return (typeof optionLabel === STRING) ? optionLabel : this._text(optionLabel);
    },

    _listBound: function() {
        var that = this;
        var initialIndex = that._initialIndex;
        var optionLabel = that.options.optionLabel;

        var data = that.dataSource.view();
        var length = data.length;
        var dataItem;

        var height;
        var value;

        that._presetValue = false;

        if (that.popup.visible()) {
            that.popup._position();
        }

        that._makeUnselectable();

        if (that._open) {
            that.toggle(that._allowOpening());
        }

        that._open = false;

        if (!that._fetch) {
            if (length) {
                if (!that.listView.value().length && initialIndex > -1 &&
                    initialIndex !== null) {
                    that.select(initialIndex);
                }

                that._initialIndex = null;

                dataItem = that.listView.selectedDataItems();

                if (dataItem.length == 1 && that.text() !== that._text(dataItem)) {
                    that._selectValue(dataItem[0]);
                }
            } else if (that._textAccessor() !== that._optionLabelText()) {
                that.listView.value("");
                that._selectValue(null);
            }
        }

        that._hideBusy();
        that.trigger("dataBound");
    },

    _listChange: function(e) {
        //debugger;
        var that = this,
            listView = that.listView,
            selectable = that.options.selectable,
            selectItems = listView.selectedDataItems();
        if(selectable == 'multiple' && selectItems.length) {
            that._selectValues(selectItems);
        } else {
            // that._selectValue(selectItems[0]);
            that._selectValue(selectItems[selectItems.length - 1]);
            if (this._presetValue || (this._old && this._oldIndex === -1)) {
                this._oldIndex = this.selectedIndex;
            }
            this.popup.close()
        }
    },

    // 多选
    _selectValues: function(dataItems){
        var that = this,
            idx = that.listView.select(),
            labelElement = that.optionLabel,
            value = [],
            text = '',
            i = 0,
            l = dataItems.length;
        labelElement.removeClass(FOCUSED + ' ' + SELECTED);
        for (; i < l; i++) {
            value.push(that._dataValue(dataItems[i]));
        }

        value = value.join(that.options.valueSplit);

        that._textAccessor(dataItems);
        that._accessor(value, idx);
    },

    _selectValue: function(dataItem) {
        var that = this;
        var optionLabel = that.options.optionLabel;
        var labelElement = that.optionLabel;
        var idx = that.listView.select();

        var value = "";
        var text = "";

        // 清除多选的内容
        var listDataItems = that.listView._dataItems;
        that.listView._dataItems = listDataItems.length ? [listDataItems.pop()] : [];

        idx = idx[idx.length - 1];
        if (idx === undefined) {
            idx = -1;
        }

        labelElement.removeClass(FOCUSED + ' ' + SELECTED);

        if (dataItem) {
            text = dataItem;
            value = that._dataValue(dataItem);
            if (optionLabel) {
                idx += 1;
            }
        } else if (optionLabel) {
            that._focus(labelElement.addClass(SELECTED));
            text = that._optionLabelText();
            if (typeof optionLabel === STRING) {
                value = "";
            } else {
                value = that._value(optionLabel);
            }

            idx = 0;
        }

        that.selectedIndex = idx;

        if (value === null) {
            value = "";
        }

        that._textAccessor(text);
        that._accessor(value, idx);

        that._triggerCascade();
    },

    _focusHandler: function() {
        this.wrapper.focus();
    },

    _focusinHandler: function(e) {
        this._inputWrapper.addClass(FOCUSED);
        this.trigger('focus', e);
        this._prevent = false;
    },

    _focusoutHandler: function(e) {
        var that = this;
        var isIFrame = window.self !== window.top;
        var focusedItem = that._focus();

        if (!that._prevent) {

            if (isIFrame) {
                that._change();
            } else {
                that._blur();
            }

            that._inputWrapper.removeClass(FOCUSED);
            that._prevent = true;
            that._open = false;
            that.valueInput.blur();
            this.trigger('blur', e);
        }
    },

    _wrapperMousedown: function() {
        this._prevent = false;
    },

    _wrapperClick: function(e) {
        e.preventDefault();
        this._focused = this.wrapper;
        this._toggle();
    },

    _editable: function(options) {
        var that = this;
        var element = that.valueInput;
        var disable = options.disable;
        var readonly = options.readonly;
        var wrapper = that.wrapper.off(NS);
        var dropDownWrapper = that._inputWrapper.off(HOVEREVENTS);

        if (!readonly && !disable) {
            element.removeAttr(DISABLED).removeAttr(READONLY);

            dropDownWrapper
                .addClass(DEFAULT)
                .removeClass(STATEDISABLED)
                .on(HOVEREVENTS, that._toggleHover);

            wrapper
                .attr(TABINDEX, wrapper.data(TABINDEX))
                .on("keydown" + NS, proxy(that._keydown, that))
                /*.on("focusin" + NS, proxy(that._focusinHandler, that))
                .on("focusout" + NS, proxy(that._focusoutHandler, that))*/
                .on("mousedown" + NS, proxy(that._wrapperMousedown, that))
                .on("click" + NS, proxy(that._wrapperClick, that));

        } else if (disable) {
            wrapper.removeAttr(TABINDEX);
            dropDownWrapper
                .addClass(STATEDISABLED)
                .removeClass(DEFAULT);
        } else {
            dropDownWrapper
                .addClass(DEFAULT)
                .removeClass(STATEDISABLED);

            /*wrapper
                .on("focusin" + NS, proxy(that._focusinHandler, that))
                .on("focusout" + NS, proxy(that._focusoutHandler, that));*/
        }

        element.attr(DISABLED, disable)
            .attr(READONLY, readonly);
    },

    _option: function(value, text) {
        return '<option value="' + value + '">' + text + "</option>";
    },

    _keydown: function(e) {
        var key = e.keyCode;
        e.keyCode = key;
        this._move(e);
    },

    _click: function(e) {
        var item = e.item || $(e.currentTarget);

        if (this.trigger("select", {
                item: item
            })) {
            this.close();
            return;
        }

        this._userTriggered = true;

        this._select(item);
        this._blur();
    },

    _get: function(candidate) {
        var data, found, idx;
        var jQueryCandidate = $(candidate);

        if (this.optionLabel[0]) {
            if (typeof candidate === "number") {
                if (candidate > -1) {
                    candidate -= 1;
                }
            } else if (jQueryCandidate.hasClass("list-optionlabel")) {
                candidate = -1;
            }
        }

        if (typeof candidate === "function") {
            data = this.dataSource.view();

            for (idx = 0; idx < data.length; idx++) {
                if (candidate(data[idx])) {
                    candidate = idx;
                    found = true;
                    break;
                }
            }

            if (!found) {
                candidate = -1;
            }
        }

        return candidate;
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
            if (this.options.optionLabel) {
                this._focus(this.optionLabel);
                this._select(this.optionLabel);
            } else {
                listView.scrollToIndex(0);
            }
        }
    },

    _focus: function(candidate) {
        var listView = this.listView;
        var optionLabel = this.optionLabel;

        if (candidate === undefined) {
            candidate = listView.focus();

            if (!candidate && optionLabel.hasClass(FOCUSED)) {
                candidate = optionLabel;
            }

            return candidate;
        }

        optionLabel.removeClass(FOCUSED);

        candidate = this._get(candidate);

        listView.focus(candidate);

        if (candidate === -1) {
            optionLabel.addClass(FOCUSED);
        }
    },

    _select: function(candidate, keepState) {
        var that = this;
        var optionLabel = that.optionLabel;

        candidate = that._get(candidate);
        that.listView.select(candidate);

        if (candidate === -1) {
            that._selectValue(null);
        }
    },

    _span: function() {
        var that = this,
            wrapper = that.wrapper,
            SELECTOR = "span.input",
            span;

        span = wrapper.find(SELECTOR);

        // 验证目标元素
        that.valueInput.data('target', span);

        that.span = span;
        that._inputWrapper = wrapper.find('.widget-wrap');
        that._arrow = wrapper.find(".icon");
    },

    _wrapper: function() {
        this._focused = this.wrapper = this.$element;
    },

    _clearSelection: function(parent) {
        this.select(parent.value() ? 0 : -1);
    },

    _inputTemplate: function() {
        var that = this,
            template = that.options.valueTemplate;

        if (!template) {
            template = that._text;
        } else {
            template = fly.template.compile(template);
        }

        that.valueTemplate = template;
    },

    _textAccessor: function(text) {
        var template = this.valueTemplate,
            options = this.options,
            optionLabel = options.optionLabel,
            span = this.span;

        if (text !== undefined) {
            if (isPlainObject(text) || text instanceof fly.ObservableObject) {
                span.html(template(text));
            } 
            else if ($.isArray(text) || text instanceof fly.ObservableArray) {
                span.html($.map(text, function(item, i) {
                    return template(item);
                }).join(options.textSplit));
            } 
            else if (optionLabel && this._optionLabelText() === text) {
                span.html(this.optionLabelTemplate(optionLabel))
            }
        } else {
            return span.text();
        }
    },

    _preselect: function(value, text) {
        if (!value && !text) {
            text = this._optionLabelText();
        }

        this._accessor(value);
        this._textAccessor(text);

        this._old = this._accessor();
        this._oldIndex = this.selectedIndex;

        this.listView.setValue(value);

        this._initialIndex = null;
        this._presetValue = true;
    },

    _assignInstance: function(text, value) {
        var textField = this.options.textField,
            valueField = this.options.valueField,
            dataItem = {};

        if (textField) {
            assign(dataItem, textField.split("."), text);
            assign(dataItem, valueField.split("."), value);
            dataItem = new ObservableObject(dataItem);
        } else {
            dataItem = text;
        }

        return dataItem;
    }
});

function assign(instance, fields, value) {
    var idx = 0,
        lastIndex = fields.length - 1,
        field;

    for (; idx < lastIndex; ++idx) {
        field = fields[idx];

        if (!(field in instance)) {
            instance[field] = {};
        }

        instance = instance[field];
    }

    instance[fields[lastIndex]] = value;
}

fly.component(c);
