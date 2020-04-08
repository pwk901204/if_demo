'use strict';
var $ = require('jquery');
var fly = require('fly');
var Dialog = require('dialog');

var MOUSEDOWN = 'mousedown.tooltip.close',
    SCROLL = 'scroll.tooltip.close';

// 内容模板预编译
var template = fly.template(__inline('tooltip.tpl'));

// 提示组件
var Tooltip = module.exports = fly.Component.extend({

    name: 'Tooltip',

    options: {
        id: 'flyTooltip',
        padding: '5px 8px',
        align: 'top left',
        quickClose: false,
        modal: false,
        backdropOpacity: 0,
        backfocus: false
    },

    ctor: function(element, options) {
        var that = this,
            dialog = Tooltip.dialog;

        options.content = template(options);

        that._super(element, options, false);
        element = that.element;
        options = that.options;

        if (dialog) {
            // 如果已经存在dialog则继续使用
            dialog.content(options.content).show(element);
        } else {
            that.popup = Dialog.popup();
            var diaOptions = $.extend({}, {
                ok: null,
                cancel: null,
                button: null,
                title: ''
            }, options.toJSON ? options.toJSON() : options);
            Tooltip.dialog = new Dialog(that.popup, diaOptions).show(element);
        }

        setTimeout(function(){
            that.quickClose();
        }, 500);
        
    },

    quickClose: function() {
        var that = this;
        $(document).on(MOUSEDOWN, function(e) {
            if ($(e.target).closest(that.popup).length == 0) {
                that.destroy();
                $(document).off(MOUSEDOWN);
            }
        });
        $(document).one(SCROLL, function(e) {
            console.log('destroy');
            that.destroy();
            // $(document).off(SCROLL);
        });
    },

    destroy: function() {
        Tooltip.dialog && Tooltip.dialog.close().destroy();
        Tooltip.dialog = null;
    }

});

// 对外暴露方法  --ligao4 2017/3/29
fly.tooltip = function(element, options) {
    if (typeof options === 'string') {
        options = {
            content: options
        };
    };
    
    return new Tooltip(element, options);
};

fly.component(Tooltip);