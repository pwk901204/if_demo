'use strict';
var $ = require('jquery');
var fly = require('fly');
var Column = require('./column');

var NAME = 'Grid',
    NS = '.' + fly.NS + NAME,
    CHANGE = 'change',
    DATABOUND = 'dataBound',
    DATABINDING = 'dataBinding',
    CLICK = 'click',
    Template = fly.template,
    proxy = fly.$.proxy;

var defaults = fly.ui.defaults[NAME] = {
    autoBind: true,
    height: null
};

var Grid = module.exports = fly.Component.extend({

    name: NAME,

    options: defaults,

    template: Template(__inline('grid.html')),

    ctor: function (element, options) {
        var that = this,
            columns = element.children;

        that.rowspan = Column.rows(columns);
        that._columns(columns);

        while (element.hasChildNodes()) {
            element.removeChild(element.firstChild);
        }

        that._super(element, options);
        that._templates();
        that._checkEvent();

        fly.notify(that);
    },

    events: [
        CHANGE,
        DATABINDING,
        DATABOUND
    ],

    _columns: function (columns) {
        var Columns = this.Columns = [],
            freezeIndex = 0;
        for (var i = 0, l = columns.length; i < l; i++) {
            var ColumnItem = new Column(columns[i], {
                rowspan: this.rowspan
            });
            if (ColumnItem.options.freeze) {
                Columns.splice(freezeIndex++, 1, ColumnItem);
            } else {
                Columns.push(ColumnItem);
            }
        }
    },

    _templates: function () {
        var that = this,
            Columns = that.Columns,
            templateWrapTr = that._templateWrapTr,
            freezeWidth = 0,
            freezeCol = '',
            itemCol = '',
            freezeHeader = '',
            itemHeader = '',
            freezeTemplate = '',
            itemTemplate = '',
            ColumnItem,
            Columns1 = [],
            Columns2 = [];

        for (var i = 0, l = Columns.length; i < l; i++) {
            ColumnItem = Columns[i];
            if (ColumnItem.options.freeze) {
                Columns1.push(ColumnItem);
                freezeWidth += that._width(ColumnItem);
                freezeCol += that._columnField(ColumnItem, 'col');
                freezeTemplate += that._columnField(ColumnItem, 'template');
            } else {
                Columns2.push(ColumnItem);
                itemCol += that._columnField(ColumnItem, 'col');
                itemTemplate += that._columnField(ColumnItem, 'template');
            }
        }

        var freezeHeader = that._header(Columns1);
        var itemHeader = that._header(Columns2);

        if (Columns1.length) {
            itemCol = '';
            $.each(Columns2, function(i, item){
                itemCol += that._columnField(item, 'colWidth');
            });
        }

        this.freezeWidth = freezeWidth;
        this.freezeCol = freezeCol;
        this.itemCol = itemCol;

        this.freezeHeader = $.map(freezeHeader, function(item){
            return '<tr>' + item + '<th>&nbsp;</th>' + '</tr>';
        }).join('');
        this.itemHeader = $.map(itemHeader, function(item){
            return '<tr>' + item + '</tr>';
        }).join('');

        this.freezeTemplate = freezeTemplate ? Template(templateWrapTr(freezeTemplate, true)) : fly.identity;
        this.itemTemplate = Template(templateWrapTr(itemTemplate, true));

        this._wrap();
    },

    _width: function(ColumnItem){
        var that = this;
        if (ColumnItem.children) {
            var width = 0;
            $.each(ColumnItem.children, function(i, item){
                width += that._width(item);
            });
            return width;
        } else {
            return ColumnItem.options.width;
        }
    },

    _columnField: function(ColumnItem, field){
        var that = this;
        if (ColumnItem.children) {
            return $.map(ColumnItem.children, function(item){
                return that._columnField(item, field);
            }).join('');
        } else {
            return ColumnItem[field];
        }
    },

    _header: function(columns, arr, index){
        var that = this;
        if(!arr) {
            arr = [];
            for (var i = 0; i < that.rowspan; i++) {
                arr[i] = ''
            }
        }
        index = index || 0;
        $.each(columns, function(i, item){
            arr[index] += item.header;
            if (item.children) {
                that._header(item.children, arr, index + 1);
            }
        });
        return arr;
    },

    _templateWrapTr: function (temp, uid) {
        if (temp) {
            return '<tr' + (uid ? ' class="{{if _index % 2}}odd{{else}}even{{/if}}" data-uid="{{uid}}"' : '') + '>' + temp + '</tr>';
        } else {
            return temp;
        }
    },

    _wrap: function () {
        var that = this,
            options = that.options,
            element = that.$element,
            headerFreeze = that.headerFreeze = element.find('.grid-header-freeze'),
            headerWrap = that.headerWrap = element.find('.grid-header-wrap'),
            contentFreeze = that.contentFreeze = element.find('.grid-content-freeze'),
            contentWrap = that.contentWrap = element.find('.grid-content-wrap');

        if (that.freezeWidth) {
            headerFreeze.width(that.freezeWidth).html('<table>' +
                '<colgroup>' + that.freezeCol + '</colgroup>' +
                '<thead>' + that.freezeHeader + '</thead>' +
                '</table>');
            contentFreeze.width(that.freezeWidth).html('<table>' +
                '<colgroup>' + that.freezeCol + '</colgroup>' +
                '<tbody></tbody>' +
                '</table>');
            element.addClass('grid-scroll-x');
        } else {
            headerFreeze.remove();
            contentFreeze.remove();
        }

        headerWrap.html('<table>' +
            '<colgroup>' + that.itemCol + '</colgroup>' +
            '<thead>' + that.itemHeader + '</thead>' +
            '</table>');
        contentWrap.html('<table>' +
            '<colgroup>' + that.itemCol + '</colgroup>' +
            '<tbody></tbody>' +
            '</table>');

        if (options.height) {
            element.addClass('grid-scroll-y');
            contentFreeze.height(options.height);
            contentWrap.height(options.height).scroll(function () {
                contentFreeze.scrollTop($(this).scrollTop());
            });
        }

        contentWrap.scroll(function () {
            headerWrap.scrollLeft($(this).scrollLeft());
        });

        that.checkAll = element.find('.grid-header').find('input:checkbox');
    },

    items: function (id) {
        var freezeItems = this.contentFreeze.find('tr'),
            contentItems = this.contentWrap.find('tr');

        if (typeof (id) === 'number') {
            return {
                freeze: freezeItems.eq(id),
                content: contentItems.eq(id)
            };
        } else if (typeof (id) === 'string') {
            return {
                freeze: freezeItems.filter('[data-uid="' + id + '"]'),
                content: contentItems.filter('[data-uid="' + id + '"]')
            };
        } else {
            return {
                freeze: freezeItems,
                content: contentItems
            };
        }
    },

    _checkAll: function () {
        var that = this,
            checkedAll = true;
        that.dataItems().forEach(function (item) {
            if (!item.checked) checkedAll = false;
        });
        if (checkedAll && that.dataItems().length) { // 如果数据有 并且..
            that.checkAll.attr('checked', 'checked');
            that.checkAll.parent().addClass('state-checked');
        } else {
            that.checkAll.removeAttr('checked');
            that.checkAll.parent().removeClass('state-checked');
        }
    },

    _checkEvent: function () {
        var that = this;
        that.checkAll.click(function () {
            var checked = this.checked;
            that.dataItems().forEach(function (item) {
                item.set('checked', checked);
            });
            that.$element.find('.grid-content input:checkbox').parent()[checked ? 'addClass' : 'removeClass']('state-checked');
        });
        that.$element.find('.grid-content').on('click', 'input:checkbox', function () {
            var uid = $(this).closest('tr').data('uid');
            that.dataSource.get(uid, 'uid').set('checked', this.checked);
            that.trigger('chcekItem', {item: that.dataSource.get(uid, 'uid')});
            $(this).parent()[this.checked ? 'addClass' : 'removeClass']('state-checked');
        });
    },

    refresh: function (e) {
        var that = this,
            view = that.dataItems(),
            length = view.length,
            freezeHtml = '',
            contentHtml = '',
            items;

        that._checkAll();

        if (e.action === 'itemchange') {
            // if (!that._hasBindingTarget()) {
            var data = e.items[0],
                item = that.items(data.uid),
                freezeItem = item.freeze,
                contentItem = item.content,
                idx = contentItem.index();

            if (contentItem.length) {
                var newFreezeItem = $(that.freezeTemplate(data));
                var newContentItem = $(that.itemTemplate(data));

                // 这里应该要移植到 binder
                fly.unbind(contentItem);

                freezeItem.replaceWith($(that.freezeTemplate(data)));
                contentItem.replaceWith($(that.itemTemplate(data)));

                item = that.items(idx);
                freezeItem = item.freeze;
                contentItem = item.content;

                if (freezeItem.length) {
                    freezeItem.attr('data-uid', data.uid);
                    that.trigger('itemChange', {
                        item: freezeItem,
                        data: data
                    });
                }

                if (contentItem.length) {
                    contentItem.attr('data-uid', data.uid);
                    that.trigger('itemChange', {
                        item: contentItem,
                        data: data
                    });
                }

                // 编辑时同步高度
                freezeItem.height(contentItem.height());
            }
            // }

            return;
        }

        if (that.trigger(DATABINDING, {
                action: e.action || 'rebind',
                items: e.items,
                index: e.index
            })) {
            return;
        }

        view.forEach(function (item) {
            freezeHtml += that.freezeTemplate(item);
            contentHtml += that.itemTemplate(item);
        });

        fly.unbind(that.contentFreeze);
        fly.unbind(that.contentWrap);
        that.contentFreeze.find('tbody').html(freezeHtml);
        that.contentWrap.find('tbody').html(contentHtml);

        items = that.items();

        that.trigger(DATABOUND, {
            addedItems: items.freeze
        });
        that.trigger(DATABOUND, {
            addedItems: items.content
        });

        items.freeze.each(function (i) {
            $(this).height(items.content.eq(i).height());
        });
    },

    destroy: function () {
        var that = this;

        that._super();

        that._unbindDataSource();
    }

});

fly.component(Grid);