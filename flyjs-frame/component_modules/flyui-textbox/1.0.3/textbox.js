/**
 * 普通文本框
 * @author: huanzhang
 */

'use strict';
var $ = require('jquery');
var fly = require('fly');
var NAME = 'TextBox',
  NS = '.' + fly.NS + NAME,
  DISABLED = 'disabled',
  READONLY = 'readonly',
  CHANGE = 'change',
  DEFAULT = 'state-default',
  FOCUSED = 'state-focused',
  STATEDISABLED = 'state-disabled',
  STATEHOVER = 'state-hover',
  MOUSEENTER = 'mouseenter' + NS,
  MOUSELEAVE = 'mouseleave' + NS,
  proxy = $.proxy;

// 默认配置参数
var defaults = (fly.ui.defaults[NAME] = {
  suffix: null,
  search: null,
  enabled: true,
  placeholder: '',
  value: null,
  phclass: 'placeholder'
});

// 按钮组件
var c = (module.exports = fly.Component.extend({
  name: NAME,
  template: fly.template(__inline('textbox.html')),
  ctor: function(element, options) {
    var that = this,
      placeholder = element.getAttribute('placeholder');

    if (!element) return;
    if (placeholder) options.placeholder = placeholder;

    that._super(element, options);
    that._wrapper();

    that._enable();
    that._placeholder();
    fly.notify(that);
  },
  options: defaults, // 默认的配置项信息
  events: [CHANGE, 'focus', 'blur'], // 绑定事件
  _wrapper: function() {
    var that = this,
      element = that.$element,
      input;

    that._inputWrapper = element.find('.textbox-wrap');
    that.input = input = element.find('input:text');
    that.suffix = element.find('.suffix');
    that.wrapper = element;

    input.attr('role', NAME); // 校验

    if (that.options.suffix) {
      input.parent().css('marginRight', element.find('.suffix').outerWidth());
    }
  },

  // 后缀
  onsuffix: function(e) {
    this.trigger('onsuffix');
  },

  // textBox聚焦事件
  _inputFocus: function(e) {
    this._inputWrapper.addClass(FOCUSED);
    this._placeholder(false);
    this.trigger('focus', e);
  },

  // textBox失焦事件
  _inputFocusout: function(e) {
    var that = this;
    that._inputWrapper.removeClass(FOCUSED);
    that._placeholder();
    this.trigger('blur', e);
  },

  // textBox内容的改变事件
  _inputChange: function() {
    this.trigger(CHANGE);
  },

  // 设置textBox的只读状态
  _enable: function() {
    var that = this,
      options = that.options,
      disabled = that.input.is('[disabled]');

    if (options.enable !== undefined) {
      options.enabled = options.enable;
    }

    if (!options.enabled || disabled) {
      that.enable(false);
    } else {
      that.readonly(that.input.is('[readonly]'));
    }
  },

  /**
   * [可编辑状态处理]
   * @param  {[Object]} options [textBox定义参数对象]
   */
  _editable: function(options) {
    var that = this,
      disable = options.disable,
      readonly = options.readonly,
      wrapper = that._inputWrapper.off(NS),
      input = that.input.off(NS);

    if (!readonly && !disable) {
      wrapper
        .addClass(DEFAULT)
        .removeClass(STATEDISABLED)
        .on(MOUSEENTER, function() {
          wrapper.toggleClass(STATEHOVER, true);
        })
        .on(MOUSELEAVE, function() {
          wrapper.toggleClass(STATEHOVER, false);
        });

      input
        .removeAttr(DISABLED)
        .removeAttr(READONLY)
        .on('focus' + NS, proxy(that._inputFocus, that))
        .on('focusout' + NS, proxy(that._inputFocusout, that))
        .on(CHANGE + NS, proxy(that._inputChange, that));
    } else {
      wrapper
        .addClass(disable ? STATEDISABLED : DEFAULT)
        .removeClass(disable ? DEFAULT : STATEDISABLED);

      input.attr(DISABLED, disable).attr(READONLY, readonly);
    }
  },

  /**
   * readonly表示只读，但是值可以被传递
   * 设置文本框的readonly只读状态
   * @param  {[Boolean]} readonly [布尔值,false表示取消只读，true表示设置只读]
   */
  readonly: function(readonly) {
    this._editable({
      readonly: readonly === undefined ? true : readonly,
      disable: false
    });
  },

  /**
   * disable表示只读，但是文本框中的值不会被获取
   * [设置文本框的disable只读状态]
   * @param  {[Boolean]} enable [布尔值,false表示取消只读，true表示设置只读]
   */
  enable: function(enable) {
    this._editable({
      readonly: false,
      disable: !(enable = enable === undefined ? true : enable)
    });
  },

  /**
   * [给文本框赋值操作]
   * @param  {[String]} value [内容，是需要给文本框设置的值]
   */
  value: function(value) {
    if (value === undefined) {
      value = this.input.val();
      if (!fly.support.html5 && value == this.options.placeholder) {
        value = '';
      }
      return value;
    }
    this.input.val(value);
    this._placeholder();
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
      input[show ? 'addClass' : 'removeClass'](that.options.phclass);

      // if (!placeholder && input[0] === fly.activeElement()) {
      //      fly.caret(input[0], 0, 0);
      // }
    }
  },

  // textBox销毁事件
  destroy: function() {
    var that = this;
    that.$element.off(NS);
    that._inputWrapper.off(NS);
    that._super();
  }
}));

fly.component(c);
