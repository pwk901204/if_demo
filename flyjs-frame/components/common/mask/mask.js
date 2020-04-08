'use strict';

var mask = {

    init: function(options) {
        this.element = window.$('body');
        this.options = options || {
            top: true,
            content: '正在加载中...'
        };
        if (this.options.top) {
            this.element = window.top.$('body');
        }
        this.maskTpl();
        this._setOption();
        this.add();
    },

    maskTpl: function() {
        var str =
            '<div class="fly-mask">' +
            '<div class="fly-mask-background"><iframe scrolling="no" frameborder="0"></iframe></div>' +
            '<div class="fly-mask-content">' +
            '<div><i></i><em>' + this.options.content + '</em></div></div></div>';
        this.maskElement = $(str);
    },

    _setOption: function() {

        if (this.element.find('.fly-mask').length) {
            this.element.find('em').html(this.options.content);
        }
    },

    //定位
    _position: function() {
        var width = this.element.outerWidth(),
            height = this.element.outerHeight(),
            position = 'absolute',
            $content = this.maskElement.children('.fly-mask-content');

        //对body遮罩时需要100%宽高
        if (this.element.is('body')) {
            width = height = '100%';
            position = 'fixed';
        }

        this.maskElement.css({
            position: position,
            width: width,
            height: height
        });
        $content.css({
            marginLeft: 0 - $content.width() / 2,
            marginTop: 0 - $content.height() / 2
        });
    },

    add: function() {
        if (!this.element.data('count')) {
            this.element.addClass('fly-has-mask');
            this.maskElement.appendTo(this.element);
            this._position();
        }
        this._add();
    },

    remove: function() {
        this._remove();
        if (!this.element.data('count')) {
            this.element
                .removeClass('fly-has-mask')
                .find('.fly-mask').remove();
        }
    },

    removeAll: function() {
        this.hasMask() && this.element
            .removeClass('fly-has-mask')
            .find('.fly-mask').remove();
        this.hasMask() && this.element.data('count', 0);
    },

    //计数器+1
    _add: function() {
        var num = this.element.data('count') || 0;
        this.element.data('count', num + 1);
    },

    //计数器-1
    _remove: function() {
        var num = this.element.data('count') || 1;
        this.element.data('count', num - 1);
    },

    hasMask: function() {
        return this.element && this.element.data('count');
    }
};

module.exports = mask;