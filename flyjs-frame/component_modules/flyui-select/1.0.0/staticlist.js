'use strict';

var fly = require('fly'),
	Component = fly.Component,
    proxy = $.proxy,
    isArray = $.isArray;

var CHANGE = 'change',
    STATEFOCUED = 'state-focused',
    STATEHOVER = 'state-hover',
    STATESELECTED = 'state-selected',
    MULTIPLE = 'multiple',
    CLICK = 'click',
    STATIC_LIST_NS = '.StaticList';

module.exports = Component.extend({

    name: 'StaticList',

    ctor: function(element, options) {
        this._super(element, options);

        this.$element.attr('role', 'listbox')
            .on(CLICK + STATIC_LIST_NS, 'li', proxy(this._click, this))
            .on('mouseenter' + STATIC_LIST_NS, 'li', function() {
                $(this).addClass(STATEHOVER);
            })
            .on('mouseleave' + STATIC_LIST_NS, 'li', function() {
                $(this).removeClass(STATEHOVER);
            });

        this.content = this.$element
            .wrap('<div unselectable="on"></div>')
            .parent()
            .css({
                'overflow': 'auto',
                'position': 'relative'
            });

        this._bound = false;

        this._GUID = fly.guid();

        this._selectedIndices = [];

        this._view = [];
        this._dataItems = [];
        this._values = [];

        var value = this.options.value;

        if (value) {
            this._values = isArray(value) ? value.slice(0) : [value];
        }

        this._getter();
        this._templates();

        this.setDataSource(this.options.dataSource);

        this._onScroll = proxy(function() {
            var that = this;
            clearTimeout(that._scrollId);
        }, this);
    },

    options: {
        valueField: null,
        selectable: true,
        template: null
    },

    events: [
        CLICK,
        CHANGE,
        'activate',
        'deactivate',
        'dataBinding',
        'dataBound',
        'selectedItemChange'
    ],

    setDataSource: function(source) {
        var that = this;
        var dataSource = source || [];
        var value = that.options.value;

        dataSource = isArray(dataSource) ? {
            data: dataSource
        } : dataSource;
        dataSource = fly.DataSource.create(dataSource);

        if (that.dataSource) {
            that.dataSource.unbind(CHANGE, that._refreshHandler);

            // value = that.value();
            if (value === null) value = that.value();
            // that.value([]);
            that._bound = false;

            that.value(value);
        } else {
            that._refreshHandler = proxy(that.refresh, that);
        }

        that.dataSource = dataSource.bind(CHANGE, that._refreshHandler);
    },

    setOptions: function(options) {
        this._super(options);

        this._getter();
        this._templates();
        this._render();
    },

    destroy: function() {
        this.$element.off(STATIC_LIST_NS);

        if (this._refreshHandler) {
            this.dataSource.unbind(CHANGE, this._refreshHandler);
        }
        this._super();
        // Component.fn.destroy.call(this);
    },

    scrollToIndex: function(index) {
        var item = this.element.children[index];

        if (item) {
            this.scroll(item);
        }
    },

    scroll: function(item) {
        if (!item) {
            return;
        }

        if (item[0]) {
            item = item[0];
        }

        var content = this.content[0],
            itemOffsetTop = item.offsetTop,
            itemOffsetHeight = item.offsetHeight,
            contentScrollTop = content.scrollTop,
            contentOffsetHeight = content.clientHeight,
            bottomDistance = itemOffsetTop + itemOffsetHeight,
            yDimension, offsetHeight;

        if (contentScrollTop > itemOffsetTop) {
            contentScrollTop = itemOffsetTop;
        } else if (bottomDistance > (contentScrollTop + contentOffsetHeight)) {
            contentScrollTop = (bottomDistance - contentOffsetHeight);
        }

        content.scrollTop = contentScrollTop;
    },

    selectedDataItems: function(dataItems) {
        var getter = this._valueGetter;

        if (dataItems === undefined) {
            return this._dataItems.slice();
        }

        this._dataItems = dataItems;

        this._values = $.map(dataItems, function(dataItem) {
            return getter(dataItem);
        });
    },

    next: function() {
        var current = this.focus();

        if (!current) {
            current = 0;
        } else {
            current = current.next();
        }

        this.focus(current);
    },

    prev: function() {
        var current = this.focus();

        if (!current) {
            current = this.element.children.length - 1;
        } else {
            current = current.prev();
        }

        this.focus(current);
    },

    first: function() {
        this.focus(this.element.children[0]);
    },

    last: function() {
        this.focus(this.element.children[this.element.children.length - 1]);
    },

    focus: function(candidate) {
        var that = this;
        var id = that._GUID;
        var hasCandidate;

        if (candidate === undefined) {
            return that._current;
        }

        candidate = that._get(candidate);
        candidate = candidate[candidate.length - 1];
        candidate = $(this.element.children[candidate]);

        if (that._current) {
            that._current
                .removeClass(STATEFOCUED)
                .removeAttr('id');

            that.trigger('deactivate');
        }

        hasCandidate = !!candidate[0];

        if (hasCandidate) {
            candidate.addClass(STATEFOCUED);
            that.scroll(candidate);

            candidate.attr('id', id);
        }

        that._current = hasCandidate ? candidate : null;
        that.trigger('activate');
    },

    filter: function(filter, skipValueUpdate) {
        if (filter === undefined) {
            return this._filtered;
        }

        this._filtered = filter;
    },

    skipUpdate: function(skipUpdate) {
        this._skipUpdate = skipUpdate;
    },

    select: function(indices) {
        var that = this;
        var selectable = that.options.selectable;
        var singleSelection = selectable !== MULTIPLE && selectable !== false;
        var selectedIndices = that._selectedIndices;

        var added = [];
        var removed = [];
        var result;

        if (indices === undefined) {
            return selectedIndices.slice();
        }

        indices = that._get(indices);

        if (indices.length === 1 && indices[0] === -1) {
            indices = [];
        }

        if (that._filtered && !singleSelection && that._deselectFiltered(indices)) {
            return;
        }

        if (singleSelection && !that._filtered && $.inArray(indices[indices.length - 1],
                selectedIndices) !== -1) {
            if (that._dataItems.length && that._view.length) {
                that._dataItems = [that._view[selectedIndices[0]].item];
            }

            return;
        }

        result = that._deselect(indices);

        removed = result.removed;
        indices = result.indices;

        if (indices.length) {
            if (singleSelection) {
                indices = [indices[indices.length - 1]];
            }

            added = that._select(indices);
        }

        if (added.length || removed.length) {
            that.trigger(CHANGE, {
                added: added,
                removed: removed
            });
        }
    },

    removeAt: function(position) {
        this._selectedIndices.splice(position, 1);
        this._values.splice(position, 1);

        return {
            position: position,
            dataItem: this._dataItems.splice(position, 1)[0]
        };
    },

    setValue: function(value) {
        if (value === '' || value === null) {
            value = [];
        }

        value = isArray(value) || value instanceof fly.ObservableArray ? value.slice(0) : [
            value
        ];

        this._values = value;
    },

    value: function(value) {
        var that = this;
        var deferred = that._valueDeferred;
        var indices;

        if (value === undefined) {
            return that._values.slice();
        }

        that.setValue(value);

        if (!deferred || deferred.state() === 'resolved') {
            that._valueDeferred = deferred = $.Deferred();
        }

        if (that.isBound()) {
            indices = that._valueIndices(that._values);

            if (that.options.selectable === MULTIPLE) {
                that.select(-1);
            }

            that.select(indices);

            deferred.resolve();
        }

        that._skipUpdate = false;

        return deferred;
    },

    _click: function(e) {
        if (!e.isDefaultPrevented()) {
            this.trigger(CLICK, {
                item: $(e.currentTarget)
            });
        }
    },

    _dataItemPosition: function(dataItem, values) {
        var value = this._valueGetter(dataItem);
        var index = -1;

        for (var idx = 0; idx < values.length; idx++) {
            if (value === values[idx]) {
                index = idx;
                break;
            }
        }

        return index;
    },

    _updateIndices: function(indices, values) {
        var data = this._view;
        var idx = 0;
        var index;

        if (!values.length) {
            return [];
        }

        for (; idx < data.length; idx++) {
            index = this._dataItemPosition(data[idx].item, values);

            if (index !== -1) {
                indices[index] = idx;
            }
        }

        return this._normalizeIndices(indices);
    },

    _valueIndices: function(values) {
        var indices = [];
        return this._updateIndices(indices, values);
    },

    _getter: function() {
        this._valueGetter = fly.getter(this.options.valueField);
    },

    _deselect: function(indices) {
        var that = this;
        var children = that.$element[0].children;
        var selectable = that.options.selectable;
        var selectedIndices = that._selectedIndices;
        var dataItems = that._dataItems;
        var values = that._values;
        var removed = [];
        var i = 0;
        var j;

        var index, selectedIndex;
        var removedIndices = 0;

        indices = indices.slice();

        if (selectable === true || !indices.length) {
            for (; i < selectedIndices.length; i++) {
                $(children[selectedIndices[i]]).removeClass(STATESELECTED);

                removed.push({
                    position: i,
                    dataItem: dataItems[i]
                });
            }

            that._values = [];
            that._dataItems = [];
            that._selectedIndices = [];
        } else if (selectable === MULTIPLE) {
            for (; i < indices.length; i++) {
                index = indices[i];

                if (!$(children[index]).hasClass(STATESELECTED)) {
                    continue;
                }

                for (j = 0; j < selectedIndices.length; j++) {
                    selectedIndex = selectedIndices[j];

                    if (selectedIndex === index) {
                        $(children[selectedIndex]).removeClass(STATESELECTED);

                        removed.push({
                            position: j + removedIndices,
                            dataItem: dataItems.splice(j, 1)[0]
                        });

                        selectedIndices.splice(j, 1);
                        indices.splice(i, 1);
                        values.splice(j, 1);

                        removedIndices += 1;
                        i -= 1;
                        j -= 1;
                        break;
                    }
                }
            }
        }

        return {
            indices: indices,
            removed: removed
        };
    },

    _deselectFiltered: function(indices) {
        var children = this.element.children;
        var dataItem, index, position;
        var removed = [];
        var idx = 0;

        for (; idx < indices.length; idx++) {
            index = indices[idx];
            dataItem = this._view[index].item;
            position = this._dataItemPosition(dataItem, this._values);

            if (position > -1) {
                removed.push(this.removeAt(position));
                $(children[index]).removeClass(STATESELECTED);
            }
        }

        if (removed.length) {
            this.trigger(CHANGE, {
                added: [],
                removed: removed
            });

            return true;
        }

        return false;
    },

    _select: function(indices) {
        var that = this;
        var children = that.$element[0].children;
        var data = that._view;
        var dataItem, index;
        var added = [];
        var idx = 0;

        if (indices[indices.length - 1] !== -1) {
            that.focus(indices);
        }

        for (; idx < indices.length; idx++) {
            index = indices[idx];
            dataItem = data[index];

            if (index === -1 || !dataItem) {
                continue;
            }

            dataItem = dataItem.item;

            that._selectedIndices.push(index);
            that._dataItems.push(dataItem);
            that._values.push(that._valueGetter(dataItem));

            $(children[index]).addClass(STATESELECTED);

            added.push({
                dataItem: dataItem
            });
        }

        return added;
    },

    _get: function(candidate) {
        if (typeof candidate === 'number') {
            candidate = [candidate];
        } else if (!isArray(candidate)) {
            candidate = $(candidate).data('offset-index');

            if (candidate === undefined) {
                candidate = -1;
            }

            candidate = [candidate];
        }

        return candidate;
    },

    _template: function() {
        var that = this;
        var options = that.options;
        var template = options.template;

        if (!template) {
            template = fly.template.compile(
                '<li tabindex="-1" role="option" unselectable="on" class="item">{{' +
                fly.expr(options.textField, '$data') + '}}</li>');
        } else {
            template = fly.template.compile(template);
            template = function(data) {
                return '<li tabindex="-1" role="option" unselectable="on" class="item">' +
                template(data) + '</li>';
            };
        }

        return template;
    },

    _templates: function() {
        var template;
        var templates = {
            template: this.options.template
        };

        for (var key in templates) {
            template = templates[key];
            if (template && typeof template !== 'function') {
                templates[key] = fly.template.compile(template);
            }
        }

        this.templates = templates;
    },

    _normalizeIndices: function(indices) {
        var newIndices = [];
        var idx = 0;

        for (; idx < indices.length; idx++) {
            if (indices[idx] !== undefined) {
                newIndices.push(indices[idx]);
            }
        }

        return newIndices;
    },

    // _firstVisibleItem: function() {
    //     var element = this.element;
    //     var content = this.content;
    //     var scrollTop = content.scrollTop;
    //     var itemHeight = $(element.children[0]).height();
    //     var itemIndex = Math.floor(scrollTop / itemHeight) || 0;
    //     var item = element.children[itemIndex] || element.lastChild;
    //     var forward = item.offsetTop < scrollTop;

    //     while (item) {
    //         if (forward) {
    //             if ((item.offsetTop + itemHeight) > scrollTop || !item.nextSibling) {
    //                 break;
    //             }
    //             item = item.nextSibling;
    //         } else {
    //             if (item.offsetTop <= scrollTop || !item.previousSibling) {
    //                 break;
    //             }
    //             item = item.previousSibling;
    //         }
    //     }

    //     return this._view[$(item).data('offset-index')];
    // },

    _renderItem: function(context) {
        var item = '<li tabindex="-1" role="option" unselectable="on" class="item';
        item += context.selected ? ' state-selected' : '';
        item += '"' + ' data-offset-index="' + context.index + '">';
        item += this.templates.template(context.item);
        return item + '</li>';
    },

    _render: function() {
        if (!this.dataSource) return;

        var html = '';

        var i = 0,
            idx = 0,
            context,
            dataContext = [],
            options = this.options,
            view = this.dataSource.view(),
            values = this.value();

        for (i = 0; i < view.length; i++) {
            context = {
                selected: this._selected(view[i], values),
                item: view[i],
                index: i
            };

            dataContext[i] = context;

            html += this._renderItem(context);
        }

        this._view = dataContext;

        this.element.innerHTML = html;
    },

    _selected: function(dataItem, values) {
        var select = !this._filtered || this.options.selectable === MULTIPLE;
        return select && this._dataItemPosition(dataItem, values) !== -1;
    },

    /**
     * 刷新
     * 一般是由 DataSource 改变引起
     * @param {any} e DataSource ChangeEvent
     */
    refresh: function(e) {
        var that = this,
            action = e && e.action;

        // 触发绑定中事件
        that.trigger('dataBinding');

        that._render();

        that._bound = true;

        if (action === 'itemchange') { // 单项改变
            var changedItems = findChangedItems(that._dataItems, e.items);
            if (changedItems.length) {
                that.trigger('selectedItemChange', {
                    items: changedItems
                });
            }
        } else if (that._filtered || that._skipUpdate) { // 数据改变（有过滤条件 或 更新）
            // 聚焦第一项
            that.focus(0);
            if (that._skipUpdate) {
                that._skipUpdate = false;
                that._updateIndices(that._selectedIndices, that._values);
            }
        } else if (!action || action === 'add') { // 新增项
            that.value(that._values);
        }

        if (that._valueDeferred) {
            that._valueDeferred.resolve();
        }

        that.trigger('dataBound');
    },

    isBound: function() {
        return this._bound;
    }
});

function findChangedItems(selected, changed) {
    var changedLength = changed.length;
    var result = [];
    var dataItem;
    var i, j;

    for (i = 0; i < selected.length; i++) {
        dataItem = selected[i];

        for (j = 0; j < changedLength; j++) {
            if (dataItem === changed[j]) {
                result.push({
                    index: i,
                    item: dataItem
                });
            }
        }
    }
    return result;
}