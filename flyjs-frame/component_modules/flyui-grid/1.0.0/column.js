'use strict';
var fly = require('fly');
var Column = module.exports = fly.Component.extend({

    name: 'Column',

    options: {
        title: '标题',
        type: 'field',
        field: '',
        width: '',
        template: '',
        freeze: false,
        align: 'left',
        sort: false,
        filter: false
    },

    ctor: function (element, options) {
        var that = this, tmpl;

        if (element.nodeName.indexOf('GROUP') > -1) {
            var cols = element.children.length;
            var children = [];
            $.each(element.children, function(i, ele){
                children.push(new Column(ele, {
                    rowspan: options.rowspan - 1
                }));
            });
            that.children = children;
            options.colspan = that._colspan();
        } else {
            tmpl = $.trim(element.innerHTML);
        }

        options = $.extend({}, fly.parseOptions(element, Column.fn.options), options);

        that._super(element, options);
        that._template(tmpl);
        that._col();
    },

    _colspan: function(children) {
        var that = this,
            colspan = 0;
        $.each(children || that.children, function(i, item){
            if (item.children) {
                colspan += that._colspan(item.children);
            } else {
                colspan++;
            }
        });
        return colspan;
    },

    _col: function () {
        var options = this.options;
        if (options.type === 'checked' && !options.width) {
            this.options.width = 40;
        } else if (options.type === 'index' && !options.width) {
            this.options.width = 60;
        } else if (options.freeze && !options.width) {
            this.options.width = 100;
        }
        this.col = '<col ' + (options.width ? 'style="width:' + options.width + 'px"' : '') + '>';
        this.colWidth = '<col style="width:' + (options.width || 100) + 'px">';
    },

    _template: function (tmpl) {
        var that = this,
            options = that.options,
            field = '{{' + options.field + '}}';

        if (options.type === 'checked') {
            that.header = '<th rowspan="' + (options.rowspan || 1) + '" class="text-center"><label class="checkbox-label"><input type="checkbox" title="全选"></label></th>';
            that.template = '<td class="text-center"><label class="checkbox-label {{if checked}}state-checked{{/if}}" ><input type="checkbox" {{if checked}}checked{{/if}} title="选择"></label></td>';
        } else if (options.type === 'index') {
            that.header = '<th rowspan="' + (options.rowspan || 1) + '" class="text-center">序号</th>';
            that.template = '<td class="text-center">{{_index}}</td>';
        } else {
            if (that.children) {
                that.header = '<th colspan="' + options.colspan + '" class="text-' + options.align + '">' + options.title + '</th>';
            } else {
                that.header = '<th rowspan="' + (options.rowspan || 1) + '" class="text-' + options.align + '">' + options.title + '</th>';
                that.template = '<td class="text-' + options.align + '" title="' + field + '">' + (tmpl || options.template || field) + '</td>';
            }
        }
    }

});

Column.rows = function(elements, rowNum) {
    var l = elements.length,
        rowsArr = [];
    rowNum = rowNum || 1;
    for (var i = 0; i < l; i++) {
        if (elements[i].nodeName.toLowerCase().indexOf('group') > -1) {
            rowsArr.push(Column.rows(elements[i].children, rowNum + 1));
        } else {
            rowsArr.push(rowNum);
        }
    }
    return rowsArr.sort(function(a,b){
        return b-a;
    })[0];
}