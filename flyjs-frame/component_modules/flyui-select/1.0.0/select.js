
'use strict';
var $ = require('jquery');
var fly = require('fly');
var ListBox = require('./listbox');

var keys = fly.keys,
    proxy = $.proxy;

var CHANGE = "change",
    STATESELECTED = "state-selected",
    LOADING = "icon-loading",
    SELECT = "select",
    SELECTED = "selected",
    REQUESTSTART = "requestStart",
    REQUESTEND = "requestEnd";

var quotRegExp = /"/g;

var alternativeNames = {
    "ComboBox": "DropDown",
    "DropDown": "ComboBox"
};

var Select = ListBox.extend({

    ctor: function(element, options) {
        if(!element) return;
        this._super(element, options);
        this._initial = this.$element.attr('value') || this.$element.find('input:hidden').val();
    },

    setDataSource: function(dataSource) {
        this.options.dataSource = dataSource;
        this._dataSource();
        this.listView.setDataSource(this.dataSource);

        if (this.options.autoBind) {
            this.dataSource.fetch();
        }
    },

    close: function() {
        this.popup.close();
    },

    select: function(candidate) {
        var that = this;

        if (candidate === undefined) {
            return that.selectedIndex;
        } else {
            that._select(candidate);
            that._old = that._accessor();
            that._oldIndex = that.selectedIndex;
        }
    },

    search: function(word) {
        word = typeof word === "string" ? word : this.text();
        var that = this;
        var length = word.length;
        var options = that.options;
        var ignoreCase = options.ignoreCase;
        var filter = options.filter;
        var field = options.textField;

        clearTimeout(that._typing);

        if (!length || length >= options.minLength) {
            that._state = "filter";
            that.listView.filter(true);
            if (filter === "none") {
                that._filter(word);
            } else {
                that._open = true;
                that._filterSource({
                    value: ignoreCase ? word.toLowerCase() : word,
                    field: field,
                    operator: filter,
                    ignoreCase: ignoreCase
                });
            }
        }
    },

    _accessor: function(value, idx) {
        // return this[this._isSelect ? "_accessorSelect" : "_accessorInput"](value, idx);
        return this._accessorInput(value, idx);
    },

    _accessorInput: function(value) {
        var element = this.valueInput || this.$element.find('input:hidden');

        if (value === undefined) {
            return element.val();
        } else {
            element.val(value);
        }
    },

    // _accessorSelect: function(value, idx) {
    //     var element = this.element;
    //     var selectedIndex = element.selectedIndex;
    //     var option;

    //     if (value === undefined) {
    //         if (selectedIndex > -1) {
    //             option = element.options[selectedIndex];
    //         }

    //         if (option) {
    //             value = option.value;
    //         }
    //         return value || "";
    //     } else {
    //         if (selectedIndex > -1) {
    //             element.options[selectedIndex].removeAttribute(SELECTED);
    //         }

    //         if (idx === undefined) {
    //             idx = -1;
    //         }

    //         if (value !== "" && idx == -1) {
    //             this._custom(value);
    //         } else {
    //             if (value) {
    //                 element.value = value;
    //             } else {
    //                 element.selectedIndex = idx;
    //             }

    //             if (element.selectedIndex > -1) {
    //                 option = element.options[element.selectedIndex];
    //             }

    //             if (option) {
    //                 option.setAttribute(SELECTED, SELECTED);
    //             }
    //         }
    //     }
    // },
    
    _listChange: function(e) {
        var that = this,
            listView = that.listView,
            selectable = that.options.selectable,
            selectItems = listView.selectedDataItems();
        if(selectable == 'multiple' && selectItems.length) {
            that._selectValues(selectItems);
        } else {
            that._selectValue(selectItems[0]);
            if (this._presetValue || (this._old && this._oldIndex === -1)) {
                this._oldIndex = this.selectedIndex;
            }
        }
    },

    _custom: function(value) {
        var that = this;
        var element = that.$element;
        var custom = that._customOption;

        if (!custom) {
            custom = $("<option/>");
            that._customOption = custom;

            element.append(custom);
        }

        custom.text(value);
        custom[0].setAttribute(SELECTED, SELECTED);
    },

    _hideBusy: function() {
        var that = this;
        clearTimeout(that._busy);
        that._arrow.removeClass(LOADING);
        that._busy = null;
    },

    _showBusy: function() {
        var that = this;

        that._request = true;

        if (that._busy) {
            return;
        }

        that._busy = setTimeout(function() {
            if (that._arrow) {
                that._arrow.addClass(LOADING);
            }
        }, 100);
    },

    _requestEnd: function() {
        this._request = false;
        this._hideBusy();
    },

    _dataSource: function() {
        var that = this,
            element = that.$element,
            options = that.options,
            dataSource = options.dataSource || {},
            idx;

        dataSource = $.isArray(dataSource) ? {
            data: dataSource
        } : dataSource;

        if (that._isSelect) {
            idx = element[0].selectedIndex;
            if (idx > -1) {
                options.index = idx;
            }

            dataSource.select = element;
            dataSource.fields = [{
                field: options.textField
            }, {
                field: options.valueField
            }];
        }

        if (that.dataSource) {
            that._unbindDataSource();
        } else {
            that._requestStartHandler = proxy(that._showBusy, that);
            that._requestEndHandler = proxy(that._requestEnd, that);
            that._changeHandler = proxy(that._dataChange, that);
            that._errorHandler = proxy(that._hideBusy, that);
        }

        that.dataSource = fly.DataSource.create(dataSource)
            .bind(REQUESTSTART, that._requestStartHandler)
            .bind(REQUESTEND, that._requestEndHandler)
            .bind(CHANGE, that._changeHandler)
            .bind("error", that._errorHandler);
    },

    _firstItem: function() {
        this.listView.first();
    },

    _lastItem: function() {
        this.listView.last();
    },

    _nextItem: function() {
        this.listView.next();
    },

    _prevItem: function() {
        this.listView.prev();
    },

    _move: function(e) {
        var that = this;
        var key = e.keyCode;
        var ul = that.ul[0];
        var down = key === keys.DOWN;
        var dataItem;
        var pressed;
        var current;

        if (key === keys.UP || down) {
            if (e.altKey) {
                that.toggle(down);
            } else {
                if (!that.listView.isBound()) {
                    if (!that._fetch) {
                        that.dataSource.one(CHANGE, function() {
                            that._fetch = false;
                            that._move(e);
                        });

                        that._fetch = true;
                        that._filterSource();
                    }

                    e.preventDefault();

                    return true; //pressed
                }

                current = that._focus();

                if (!that._fetch && (!current || current.hasClass(STATESELECTED))) {
                    if (down) {
                        that._nextItem();

                        if (!that._focus()) {
                            that._lastItem();
                        }
                    } else {
                        that._prevItem();

                        if (!that._focus()) {
                            that._firstItem();
                        }
                    }
                }

                if (that.trigger(SELECT, {
                        item: that.listView.focus()
                    })) {
                    that._focus(current);
                    return;
                }

                that._select(that._focus(), true);

                if (!that.popup.visible()) {
                    that._blur();
                }
            }

            e.preventDefault();
            pressed = true;
        } else if (key === keys.ENTER || key === keys.TAB) {
            if (that.popup.visible()) {
                e.preventDefault();
            }

            current = that._focus();
            dataItem = that.dataItem();

            if (!that.popup.visible() && (!dataItem || that.text() !== that._text(
                    dataItem))) {
                current = null;
            }

            var activeFilter = that.filterInput && that.filterInput[0] ===
                fly.activeElement();

            if (current) {
                if (that.trigger(SELECT, {
                        item: current
                    })) {
                    return;
                }

                that._select(current);
            } else if (that.input) {
                that._accessor(that.input.val());
                that.listView.value(that.input.val());
            }

            if (that._focusElement) {
                that._focusElement(that.wrapper);
            }

            if (activeFilter && key === keys.TAB) {
                that.wrapper.focusout();
            } else {
                that._blur();
            }

            that.close();
            pressed = true;
        } else if (key === keys.ESC) {
            if (that.popup.visible()) {
                e.preventDefault();
            }
            that.close();
            pressed = true;
        }

        return pressed;
    },

    _fetchData: function() {
        var that = this;
        var hasItems = !!that.dataSource.view().length;

        if (that.$element[0].disabled || that._request || that.options.cascadeFrom) {
            return;
        }

        if (!that.listView.isBound() && !that._fetch && !hasItems) {
            that._fetch = true;
            that.dataSource.fetch().done(function() {
                that._fetch = false;
            });
        }
    },

    _options: function(data, optionLabel, value) {
        var that = this,
            element = that.$element,
            length = data.length,
            options = "",
            option,
            dataItem,
            dataText,
            dataValue,
            idx = 0;

        if (optionLabel) {
            options = optionLabel;
        }

        for (; idx < length; idx++) {
            option = "<option";
            dataItem = data[idx];
            dataText = that._text(dataItem);
            dataValue = that._value(dataItem);

            if (dataValue !== undefined) {
                dataValue += "";

                if (dataValue.indexOf('"') !== -1) {
                    dataValue = dataValue.replace(quotRegExp, "&quot;");
                }

                option += ' value="' + dataValue + '"';
            }

            option += ">";

            if (dataText !== undefined) {
                //option += htmlEncode(dataText);
                option += dataText;
            }

            option += "</option>";
            options += option;
        }

        element.html(options);

        if (value !== undefined) {
            element.val(value);
        }
    },

    _reset: function() {
        var that = this,
            element = that.$element,
            formId = element.attr("form"),
            form = formId ? $("#" + formId) : element.closest("form");

        if (form[0]) {
            that._resetHandler = function() {
                setTimeout(function() {
                    that.value(that._initial);
                });
            };

            that._form = form.on("reset", that._resetHandler);
        }
    },

    _cascade: function() {
        var that = this,
            name = fly.NS + that.name,
            options = that.options,
            cascade = options.cascadeFrom,
            parent, parentElement,
            select, valueField,
            change;

        if (cascade) {
            parentElement = $("#" + cascade);
            parent = parentElement.data(name) || parentElement[0][name] || parentElement[0].handler;

            if (!parent) {
                name = fly.NS + alternativeNames[that.name]
                parent = parentElement.data(name) || parentElement[0][name];
            }

            if (!parent) {
                return;
            }

            options.autoBind = false;
            valueField = options.cascadeFromField || parent.options.valueField;

            change = function() {
                that.dataSource.unbind(CHANGE, change);

                var value = that._accessor();

                if (that._userTriggered) {
                    that._clearSelection(parent, true);
                } else if (value) {
                    if (value !== that.listView.value()[0]) {
                        that.value(value);
                    }

                    if (!that.dataSource.view()[0] || that.selectedIndex === -1) {
                        that._clearSelection(parent, true);
                    }
                } else if (that.dataSource.view().length) {
                    that.select(options.index);
                }

                that.enable();
                that._triggerCascade();
                that._userTriggered = false;
            };
            
            select = function() {
                var dataItem = parent.dataItem(),
                    filterValue = dataItem ? parent._value(dataItem) : null,
                    expressions, filters;

                if (filterValue || filterValue === 0) {
                    expressions = that.dataSource.filter() || {};
                    ListBox.removeFiltersForField(expressions, valueField);
                    filters = expressions.filters || [];
                    
                    if (!that.trigger('cascadeFilter', {
                        item: dataItem,
                        filters: filters
                    })) {
                        filters.push({
                            field: valueField,
                            operator: "eq",
                            value: filterValue
                        });
                    }

                    var handler = function() {
                        that.unbind("dataBound", handler);
                        change.apply(that, arguments);
                    };

                    that.first("dataBound", handler);

                    that.dataSource.filter(filters);

                } else {
                    that.enable(false);
                    that._clearSelection(parent);
                    that._triggerCascade();
                    that._userTriggered = false;
                }
            };

            parent.first("cascade", function(e) {
                that._userTriggered = e.userTriggered;
                select();
            });

            if (parent.listView.isBound()) {
                select();
            } else if (!parent.value()) {
                that.enable(false);
            }
        }
    }
});

module.exports = Select;