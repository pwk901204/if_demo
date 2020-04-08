
'use strict';
var $ = require('jquery');
var fly = require('fly');
var Tooltip = require('tooltip');

var calculate = {},
    math = Math;

/**
 * 获取小数位数
 * @param {Number} num 小数部分位数
 */
var digits = function(num){
    var length;
    try {
		length = num.toString().split('.')[1].length;
	}
	catch (e) {
		length = 0;
	}
    return length;
};

/**
 * 将小数化为整数
 * @param {Number} num 化整后的整数
 */
var integer = function(num){
    return Number(num.toString().replace('.', ''));
}

/**
 * 加法运算
 * @param   {Number} arg1 被加数
 * @param   {Number} arg2 加数
 * @returns {Number} 和
 */
calculate.add = function (arg1, arg2) {
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
calculate.sub = function (arg1, arg2) {
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
calculate.mul = function (arg1, arg2) {
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
calculate.div = function (arg1, arg2) {
    var n = digits(arg2) - digits(arg1),
        m = math.pow(10, n);
    return (integer(arg1) / integer(arg2)) * m;
};

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
    datepicker: '请选择一个日期',
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
};

var tooltip = function(ele, content) {
    if(!showTooltip) return;
    
    var widget = ele.closest('.widget');

    fly.validateTip = new Tooltip(widget.length ? widget : ele, {
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
            /^\d+$/.test(calculate.div(Math.abs(calculate.sub(value, min || 0)), step))) {
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
            fly.selectRange.call(ele, max, value.length);
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
        type = valid.type || control.data('type') || control.attr('type'),
        key = valid.key || control.data('key'),
        text = valid.title || $.trim(control.closest('.widget').children('.label').text()).replace(
            /\*/ig, '').replace(/＊/ig, '').replace(/：/ig, '').replace(/:/ig, ''),
        placeholder;

    // 如果元素完全显示
    if ($(control).is(':visible')) {
        if (type == 'radio' || type == 'checkbox') {
            tooltip(control, PROMPT[type]);
            control.focus();
        } else if (tag == 'select' || tag === 'datepicker' || tag == 'empty') {
            // 下拉值为空或文本框文本域等为空
            tooltip(control, (tag == 'empty' && text) ? '您尚未输入' + text : PROMPT[tag]);
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
            target = typeof selector == STRING ? $((document.getElementById(selector) ? '#' : '.') + selector) : selector,
            customTxt = '您尚未' + (key || (tag == 'empty' ? '输入' : '选择')) + ((!
                /^radio|checkbox$/i.test(type) && text) || '该项内容'),
            offset;
        if (target && target.length) {
            target.focus();
            tooltip(target, customTxt);
        } else {
            // alert
            //fly.tip(customTxt);
        }
    }
    return false;
};

var validate = function(ele, valid, hasTooltip) {
    // debugger;

    ele = $(ele);
    if (ele.length === 0) {
        return true;
    }

    valid = valid || {};
    showTooltip = hasTooltip === false ? false : true;

    var type = valid.type || ele.data('type') || ele.attr('type'),
        tag = ele.attr('role') || ele[0].tagName,
        required = valid.required || !!ele.attr('required'),
        target = valid.target || ele.data('target'),
        accept = target ? target : null,
        name = ele.attr('name'),
        isPass = true;

    tag = tag.toLowerCase();
    if (tag === 'dropdown' || tag === 'combobox') {
        tag = 'select';
    }

    // 禁用字段不验证
    // 或target是禁用状态也不验证
    if (ele.is(':disabled') || (accept && accept.is && accept.is(':disabled'))) {
        return true;
    }

    // 无需验证的状态
    if (type == 'submit' || type == 'reset' || type == 'file' || type == 'image') {
        return true;
    }

    // 需要验证的有
    // input文本框, type, required, pattern, max, min
    // radio, checkbox
    // select
    // textarea
    if ((type == 'radio' || type == 'checkbox') && required) {
        // 单选框和复选框，只需验证是否必选
        var eles = name ? $('input[type="' + type + '"][name="' + name + '"]') : ele,
            pass = false;

        eles.each(function() {
            if (pass == false && $(this).is(':checked')) {
                pass = true;
                return;
            }
        });

        if (pass == false) {
            isPass = remind.call(eles.get(0), valid, tag);
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
