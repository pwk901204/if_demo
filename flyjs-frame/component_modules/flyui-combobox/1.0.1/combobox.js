
'use strict';

var $ = require('jquery');
var fly = require('fly');
var Select = require('select');

var NAME = 'ComboBox',
    NS = '.' + fly.NS + NAME,
    CLICK = 'click' + NS,
    MOUSEDOWN = 'mousedown' + NS,
    DISABLED = 'disabled',
    READONLY = 'readonly',
    CHANGE = 'change',
    DEFAULT = 'state-default',
    FOCUSED = 'state-focused',
    STATEDISABLED = 'state-disabled',
    STATE_SELECTED = 'state-selected',
    STATE_FILTER = 'filter',
    STATE_ACCEPT = 'accept',
    STATE_REBIND = 'rebind',
    HOVEREVENTS = 'mouseenter' + NS + ' mouseleave' + NS,
    UNSELECTABLE = 'unselectable="on"',
    NULL = null,
    keys = fly.keys,
    proxy = $.proxy,
    caret = fly.caret,
    activeElement = fly.activeElement;

// 默认的配置属性 
var defaults = fly.ui.defaults[NAME] = {
    enabled: true, // 默认启用
    index: -1, // 默认不选择
    text: null,
    value: null,
    autoBind: true,
    delay: 200,
    textField: 'text', // text字段名
    valueField: 'value', // value字段名
    minLength: 0, // 执行搜索时所需要的最小长度
    height: 200, // popup高度
    highlightFirst: true,
    cascadeFrom: '',
    cascadeFromField: '',
    filter: 'none',
    placeholder: '请选择',
    suggest: false,
    selectable: true,
    ignoreCase: true, //忽略大小写
    valuePrimitive: true,
    textSplit: ',',
    valueSplit: ',',
    template: null
};

// 按钮组件
var c = module.exports = Select.extend({

    name: NAME,
    
    template: fly.template(__inline('combobox.tpl')),

    ctor: function(element, options) {
        var that = this,
            placeholder,
            text;

        if(!element) return;

        that.ns = NS;
        placeholder = element.getAttribute('placeholder')

        options = $.isArray(options) ? {
            dataSource: options
        } : options;
        
        placeholder && (options.placeholder = placeholder);

        that._super(element, options);

        options = that.options;
        
        that.valueInput = that.$element.find('input[type="hidden"]');
        that.valueInput.on('focus' + NS, proxy(that._focusHandler, that))
            .attr('role', NAME); // 校验;

        that._reset();

        that._wrapper();

        that._input();

        that._tabindex(that.input);

        that._popup();

        that._dataSource();

        that._ignoreCase();

        that._enable();

        that._oldIndex = that.selectedIndex = -1;

        that._initialIndex = options.index;

        that._initList();

        that._cascade();

        if (options.autoBind) {
            that._filterSource();
        } else {
            text = options.text;
            if (text) {
                that.input.val(text);
                that._prev = text;
            }
        }

        if (!text) {
            that._placeholder();
        }

        fly.notify(that);
    },

    options: defaults,

    // 绑定实现的一些事件    
    events: [
        'open',
        'close',
        CHANGE,
        'select',
        'focus',
        'blur',
        'filtering',
        'dataBinding',
        'dataBound',
        'cascade',
        'cascadeFilter'
    ],

    /**
     * [对外暴露自定义参数对象方法]
     * @param {[Object]} options [自定义comBoBox的属性参数]
     */
    setOptions: function(options) {
        this._super(options);
        this.listView.setOptions(options);
        this._accessors();
    },

    /**
     * [comBoBox对象的销毁方法]
     */
    destroy: function() {
        var that = this,
            ns = that.ns;
        that.input.off(ns);
        that.valueInput.off(ns);
        that._inputWrapper.off(ns);
        that._super();
    },

    _focusHandler: function() {
        this.input.focus();
    },

    // 下拉箭头事件 
    _arrowClick: function() {
        this._toggle();
    },

    // 文本输入框的聚焦事件 
    _inputFocus: function(e) {
        this._inputWrapper.addClass(FOCUSED);
        this._placeholder(false);
        this.trigger('focus', e);
    },

    // 文本输入框的失焦事件 
    _inputFocusout: function(e) {
        var that = this;

        that._inputWrapper.removeClass(FOCUSED);
        clearTimeout(that._typing);
        that._typing = null;

        if (that.options.text !== that.input.val()) {
            that.text(that.text());
        }

        that._placeholder();
        that._blur();

        that.valueInput.blur();
        this.trigger('blur', e);
    },

    /**
     * [可编辑状态处理]
     * @param  {[Object]} options [文本框定义参数对象]
     */
    _editable: function(options) {
        var that = this,
            disable = options.disable,
            readonly = options.readonly,
            wrapper = that._inputWrapper.off(NS),
            input = that.valueInput.add(that.input.off(NS)),
            arrow = that._arrow.parent().off(CLICK + ' ' + MOUSEDOWN);

        if (!readonly && !disable) {

            // 给DOM添加样式和绑定鼠标移入和移出事件 
            wrapper
                .addClass(DEFAULT)
                .removeClass(STATEDISABLED)
                .on(HOVEREVENTS, that._toggleHover);

            input.removeAttr(DISABLED)
                .removeAttr(READONLY);

            arrow.on(CLICK, proxy(that._arrowClick, that))
                .on(MOUSEDOWN, function(e) {
                    e.preventDefault();
                });

            // 移出disable和readonly属性，绑定聚焦和失焦及改变事件 
            that.input
                .on('keydown' + NS, proxy(that._keydown, that))
                .on('focus' + NS, proxy(that._inputFocus, that))
                .on('focusout' + NS, proxy(that._inputFocusout, that));

        } else {

            // 设置只读状态 
            wrapper
                .addClass(disable ? STATEDISABLED : DEFAULT)
                .removeClass(disable ? DEFAULT : STATEDISABLED);

            input.attr(DISABLED, disable)
                .attr(READONLY, readonly);
        }
    },

    /**
     * 打开下拉框
     */
    open: function() {
        var that = this;
        var state = that._state;
        var focusedItem;
        var index;

        if (that.popup.visible()) {
            return;
        }

        if ((!that.listView.isBound() && state !== STATE_FILTER) || state ===
            STATE_ACCEPT) {
            that._open = true;
            that._state = STATE_REBIND;
            that.listView.filter(false);
            that._filterSource();
        } else {
            that.popup.open();
            that._focusItem();
        }
    },

    /**
     * 绑定列表数据
     */
    _listBound: function() {
        var that = this;
        var options = that.options;
        var initialIndex = that._initialIndex;
        var filtered = that._state === STATE_FILTER;
        var isActive = that.input[0] === activeElement();

        var listView = that.listView;
        var focusedItem = listView.focus();
        var data = this.dataSource.view();
        var page = this.dataSource.page();
        var length = data.length;
        var dataItem;
        var value;

        that._presetValue = false;

        if (that.popup.visible()) {
            that.popup._position();
        }

        that._makeUnselectable();

        if (!filtered && !that._fetch) {
            if (!listView.value().length) {
                if (initialIndex !== null && initialIndex > -1) {
                    that.select(initialIndex);
                    focusedItem = listView.focus();
                } else if (that._accessor()) {
                    listView.value(that._accessor());
                }
            }
            // 修复data-index不能选中的问题 by pang.ziqin
            that._initialIndex = !length ? that._initialIndex : null;

            dataItem = that.listView.selectedDataItems()[0];
            if (dataItem && that.text() && that.text() !== that._text(dataItem)) {
                that._selectValue(dataItem);
            }
        } else if (filtered && focusedItem) {
            focusedItem.removeClass('state-selected');
        }

        if (length && (page === undefined || page === 1)) {
            if (options.highlightFirst) {
                if (!focusedItem) {
                    listView.focus(0);
                }
            } else {
                listView.focus(-1);
            }

            if (options.suggest && isActive && that.input.val()) {
                that.suggest(data[0]);
            }
        }

        if (that._open) {
            that._open = false;

            if (that._typing && !isActive) {
                that.popup.close();
            } else {
                that.toggle(!!length);
            }

            that._typing = null;
        }

        if (that._touchScroller) {
            that._touchScroller.reset();
        }

        that._hideBusy();
        that.trigger('dataBound');
    },

    // 选中的值改变 
    _listChange: function() {
        this._selectValue(this.listView.selectedDataItems()[0]);

        if (this._presetValue) {
            this._oldIndex = this.selectedIndex;
        }
    },

    _get: function(candidate) {
        var data, found, idx;

        if (typeof candidate === 'function') {
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

    _select: function(candidate, keepState) {
        candidate = this._get(candidate);

        if (candidate === -1) {
            this.input[0].value = '';
            this._accessor('');
        }

        this.listView.select(candidate);

        if (!keepState && this._state === STATE_FILTER) {
            this.listView.filter(false);
            this._state = STATE_ACCEPT;
        }
    },

    /**
     * [comBoBox下拉框的选中改变值]
     * @param  {[String]} dataItem [选中选项的值]
     */
    _selectValue: function(dataItem) {
        var idx = this.listView.select();
        var value = '';
        var text = '';

        idx = idx[idx.length - 1];
        if (idx === undefined) {
            idx = -1;
        }

        this.selectedIndex = idx;

        if (idx === -1) {
            value = text = this.input[0].value;
            this.listView.focus(-1);
        } else {
            if (dataItem) {
                value = this._dataValue(dataItem);
                text = this._text(dataItem);
            }

            if (value === null) {
                value = '';
            }
        }

        this._prev = this.input[0].value = text;
        this._accessor(value !== undefined ? value : text, idx);

        this._placeholder();
        this._triggerCascade();
    },

    // 刷新 
    refresh: function() {
        this.listView.refresh();
    },

    suggest: function(word) {
        var that = this;
        var element = that.input[0];
        var value = that.text();
        var caretIdx = caret(element)[0];
        var key = that._last;
        var idx;

        if (key == keys.BACKSPACE || key == keys.DELETE) {
            that._last = undefined;
            return;
        }

        word = word || '';

        if (typeof word !== 'string') {
            if (word[0]) {
                word = that.dataSource.view()[List.inArray(word[0], that.ul[0])];
            }

            word = word ? that._text(word) : '';
        }

        if (caretIdx <= 0) {
            caretIdx = value.toLowerCase().indexOf(word.toLowerCase()) + 1;
        }

        if (word) {
            idx = word.toLowerCase().indexOf(value.toLowerCase());
            if (idx > -1) {
                value += word.substring(idx + value.length);
            }
        } else {
            value = value.substring(0, caretIdx);
        }

        if (value.length !== caretIdx || !word) {
            element.value = value;
            if (element === activeElement()) {
                caret(element, caretIdx, value.length);
            }
        }
    },

    text: function(text) {
        text = text === null ? '' : text;

        var that = this;
        var input = that.input[0];
        var ignoreCase = that.options.ignoreCase;
        var loweredText = text;
        var dataItem;
        var value;

        if (text === undefined) {
            return input.value;
        }

        dataItem = that.dataItem();

        if (that.options.autoBind === false && !that.listView.isBound()) {
            return;
        }

        if (dataItem && that._text(dataItem) === text) {
            value = that._value(dataItem);
            if (value === null) {
                value = '';
            } else {
                value += '';
            }

            if (value === that._old) {
                that._triggerCascade();
                return;
            }
        }

        if (ignoreCase) {
            loweredText = loweredText.toLowerCase();
        }

        that._select(function(data) {
            data = that._text(data);

            if (ignoreCase) {
                data = (data + '').toLowerCase();
            }

            return data === loweredText;
        });

        if (that.selectedIndex < 0) {
            that._accessor(text);
            input.value = text;

            that._triggerCascade();
        }

        that._prev = input.value;
    },

    toggle: function(toggle) {
        this._toggle(toggle, true);
    },

    value: function(value) {
        var that = this;
        var options = that.options;

        if (value === undefined) {
            value = that._accessor() || that.listView.value()[0];
            return value === undefined || value === null ? '' : value;
        }

        if (value === null) {
            value = '';
        }

        value = value.toString();

        if (value === options.value && that.input.val() === options.text) {
            return;
        }

        that._accessor(value);

        that.listView
            .value(value)
            .done(function() {
                that._triggerCascade();

                that._selectValue(that.listView.selectedDataItems()[0]);

                if (that.selectedIndex === -1) {
                    that._accessor(value);
                    that.input.val(value);
                    that._placeholder(true);
                }

                that._old = that._accessor();
                that._oldIndex = that.selectedIndex;

                that._prev = that.input.val();

                if (that._state === STATE_FILTER) {
                    that._state = STATE_ACCEPT;
                }
            });

        that._fetchData();
    },

    _click: function(e) {
        var item = e.item;

        this._userTriggered = true;
        this._select(item);
      	if (this.trigger('select', {
                item: item
            })) {
            this.close();
            return;
        }
        this._blur();
    },

    _filter: function(word) {
        var that = this;
        var options = that.options;
        var dataSource = that.dataSource;
        var ignoreCase = options.ignoreCase;
        var predicate = function(dataItem) {
            var text = that._text(dataItem);
            if (text !== undefined) {
                text = text + '';
                if (text !== '' && word === '') {
                    return false;
                }

                if (ignoreCase) {
                    text = text.toLowerCase();
                }

                return text.indexOf(word) === 0;
            }
        };

        if (ignoreCase) {
            word = word.toLowerCase();
        }

        if (!that.ul[0].firstChild) {
            dataSource.one(CHANGE, function() {
                if (dataSource.view()[0]) {
                    that.search(word);
                }
            }).fetch();
            return;
        }

        this.listView.focus(this._get(predicate));

        var current = this.listView.focus();

        if (current) {
            if (options.suggest) {
                this.suggest(current);
            }

            this.open();
        }

        if (this.options.highlightFirst && !word) {
            this.listView.first();
        }
    },

    // 给input解析，添加生成制定的DOM结构样式 
    _input: function() {
        var that = this,
            wrapper = that.wrapper,
            name = that.$element.attr('name') || '',
            SELECTOR = 'input:text',
            input;

        if (name) {
            name = 'name="' + name + '_text" ';
        }

        input = wrapper.find(SELECTOR);
        input.val(this.options.text || that.$element.value);

        if (fly.support.html5) {
            input.attr('placeholder', that.options.placeholder);
        }

        // 关联验证目标元素
        that.valueInput.data('target', input);

        that._focused = that.input = input;
        that._inputWrapper = $(wrapper[0].firstChild);
        that._arrow = wrapper.find('.icon')
            .attr({
                'role': 'button',
                'tabIndex': -1
            });
    },

    // 键盘按键按下事件 
    _keydown: function(e) {
        var that = this,
            key = e.keyCode;

        that._last = key;

        clearTimeout(that._typing);
        that._typing = null;

        // 回车键执行搜索事件 
        if (key != keys.TAB && !that._move(e)) {
            that._search();
        }
    },

    /**
     * [设置placeholder是否显示]
     * @param  {[Boolean]} show [是否显示，false表示不显示，然后根据value去判断是否显示]
     */
    _placeholder: function(show) {
        var that = this,
            input = that.input,
            placeholder = that.options.placeholder,
            value;
            
        if (fly.support.html5) {
            input.attr('placeholder', placeholder);
            return;
        }

        if (placeholder) {
            value = that.value();

            if (show === undefined) {
                show = !value;
            }

            input.toggleClass('readonly', show);

            if (!show) {
                if (!value) {
                    placeholder = '';
                } else {
                    return;
                }
            }

            input.val(placeholder);

            if (!placeholder && input[0] === activeElement()) {
                caret(input[0], 0, 0);
            }
        }
    },

    // combobox的搜索方法，文本框去匹配 
    _search: function() {
        var that = this;

        that._typing = setTimeout(function() {
            var value = that.text();

            if (that._prev !== value) {
                that._prev = value;
                that.search(value);
            }

            that._typing = null;
        }, that.options.delay);
    },

    // dom处理，解析页面dom成制定制定结构样式 
    _wrapper: function() {
        this.wrapper = this.$element;
    },

    /**
     * [执行选中显示处理]
     * @param  {[String]} value [选项的值]
     * @param  {[String]} text  [选项的文本内容]
     */
    _preselect: function(value, text) {

        this.input.val(text);
        this._accessor(value);

        this._old = this._accessor();
        this._oldIndex = this.selectedIndex;

        this.listView.setValue(value);

        this._initialIndex = null;
        this._presetValue = true;
    },

    _clearSelection: function(parent, isFiltered) {
        var that = this;
        var hasValue = parent.value();
        var custom = hasValue && parent.selectedIndex === -1;

        if (isFiltered || !hasValue || custom) {
            that.options.value = '';
            that.value('');
        }
    }
});

fly.component(c);