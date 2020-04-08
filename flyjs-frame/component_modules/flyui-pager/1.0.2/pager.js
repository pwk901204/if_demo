'use strict';
var fly = require('fly'),
    $ = require('jquery'),
    DropDown = require('dropdown');

var NAME = 'Pager',
    NS = '.' + fly.NS + NAME,
    CLICK = 'click',
    keys = fly.keys,
    proxy = fly.$.proxy,
    math = Math,
    pageEllipsis = '<span class="ellipsis"><i class="icon icon-more"></i></span>';

var defaults = fly.ui.defaults[NAME] = {
    firstText: '首页',
    lastText: '末页',
    prevText: '上一页',
    nextText: '下一页',
    simple: false,  // 简易模式
    showCurrentPage: true,  // 简易模式下，是否显示当前页码
    current: 1,  // 默认加载第N页数据
    linkTo: '#',  // 分页静态页链接, 默认'#'
    showSwitch: true,  //是否显示切换器
    pageInfo: '<span>总{{total}}条，共{{pages}}页</span>', // 页码信息模板
    pageSwitch: '5,10,20,50', // 页码切换信息
    pageNumber: '2,5', // 页码块两头的个数, 中间的个数
    autoBind: true,
};

var c = module.exports = fly.Component.extend({
    name: NAME,
    options: defaults,
    switches: [],
    switchValue: '10',
    switchChange: function(e){
        if (this.switchValue != this.dataSource.pageSize()) {
            this.currentPageNumber = 1;
            this.dataSource.pageSize(e.data.switchValue);
        };
    },
    template: fly.template(__inline('pager.tpl')),
    ctor: function (element, options) {
        this._super(element, options);
        options = this.options;

        this.currentPageNumber = options.current;

        // 判断是否简易模式
        if (options.simple) {
            // 保证始终能够渲染上下页码按钮
            this.options.prevText = options.prevText || '上一页';
            this.options.nextText = options.nextText || '下一页';
        }

        if (options.pageInfo) {
            this.pageInfoTemplate = fly.template(options.pageInfo);
            this.pageInfoView = this.$element.find('.info');
        }
        if (options.pageSwitch) {
            var pages = $.map(options.pageSwitch.split(','), function (v) {
                return {
                    text: v,
                    value: parseInt(v)
                };
            });
            this.pageSwitchView = this.$element.find('.switch');
            this.set('switches', pages);
            this.set('switchValue', 10);
        }
        if (options.pageNumber) {
            var numberEntries = options.pageNumber.split(',');
            this.displayEntries = parseInt(numberEntries[1]);
            this.edgeEntries = parseInt(numberEntries[0]);
        }
        this.$pageNumberWrap = this.$element.find('.number')
            .on(CLICK, 'a', proxy(this._clickHandler, this));
        this.setDataSource();
    },

    /**
     * 设置数据源
     * @param   dataSource
     */
    setDataSource: function (dataSource) {
        var that = this;
        
        if (that.dataSource) {
            that._unbindDataSource();
        }
        
        that.dataSource = fly.DataSource.create(dataSource || {})
            .bind("empty", proxy(that._emptyHandler, that))
            .bind("error", proxy(that._errorHandler, that))
            .bind("change", proxy(that.selectPage, that));

        //解决data-auto-bind不生效的问题
        if(that.options.autoBind === false){
            return false;
        }

        that.selectPage(this.options.current);
    },

    /**
     * 取消绑定
     */
    _unbindDataSource: function () {
        var that = this;
        that.dataSource
            .unbind("empty", proxy(that._emptyHandler, that))
            .unbind("error", proxy(that._errorHandler, that))
            .unbind("change", proxy(that.selectPage, that));
    },

    /**
     * 计算总页数
     * @returns  totalPages
     */
    _getTotalPages: function () {
        var dataSource = this.dataSource;
        if (dataSource.options.total === false) {
            return 0;
        }
        return dataSource.totalPages();
    },

    /**
     * 计算分页间隔
     * @returns  start end
     */
    _getInterval: function (currentPage) {
        var options = this.options,
            dataSource = this.dataSource,
            totalPages = this._getTotalPages(),
            numDisplayEntries = this.displayEntries || 5;

        var half = math.ceil(numDisplayEntries / 2),
            upper_limit = totalPages - numDisplayEntries;

        var start = currentPage > half ?
            math.max(math.min(currentPage - half, upper_limit), 0) :
            0;

        var end = currentPage > half ?
            math.min(currentPage + numDisplayEntries - half, totalPages) :
            math.min(numDisplayEntries, totalPages);

        return {
            start: start,
            end: end
        };
    },

    _emptyHandler: function () {
        if (this.dataSource.page() > 1) {
            this.trigger('error');
        } else {
            this.$element.hide();
        }
    },

    _errorHandler: function () {
        this.$element.hide();
    },

    _clickHandler: function (e) {
        var page = $(e.target).data('pageNumber');
        if (this.dataSource) {
            this.currentPageNumber = page;
            this.dataSource.page(page);
        }
        this.trigger('onpageclick', {
            current: page,
            target: this
        });
        return false;
    },

    // 选择分页
    selectPage: function (page) {
        this.set('switchValue', this.dataSource.pageSize());
        if (typeof page == 'number') {
            this.dataSource.page(page);
            return;
        }

        page = this.dataSource.page();
        if (!page || this.dataSource.data().length == 0) {
            return;
        }

        this.$element.show();
        this.$pageNumberWrap.empty();
        this._drawLinks(page);
        this._drawInfo();
    },

    // 创建分页按钮
    _createLink: function (pageNo, currentPage, appendopts) {
        var lnk,
            cls,
            np = this._getTotalPages();

        pageNo = pageNo < 1 ? 1 : ((pageNo <= np || np == 0) ? pageNo : np);
        
        appendopts = $.extend({
            text: pageNo,
            classes: ''
        }, appendopts || {});
        
        cls = appendopts.classes;

        if (pageNo == currentPage) {
            lnk = $('<span class="btn ' + ((cls == 'prev' || cls == 'next') ?
                'btn-default' : 'btn-primary') + ' current">' +
                appendopts.text + '</span>');
        } else {
            lnk = $('<a class="btn btn-default">' + appendopts.text + '</a>')
                .attr('href', this.options.linkTo.replace(/__id__/, pageNo));
        }
        if (cls) {
            lnk.addClass(cls);
        }
        lnk.data('pageNumber', pageNo);
        return lnk;
    },

    _appendRange: function (currentPage, start, end, opts) {
        var i = start;
        for (; i < end; i++) {
            this._createLink(i + 1, currentPage, opts).appendTo(this.$pageNumberWrap);
        }
    },

    _drawLinks: function (currentPage) {
        var begin, end,
            that = this,
            opts = that.options,
            interval = that._getInterval(currentPage),
            np = that._getTotalPages(),
            numEdgeEntries = that.edgeEntries,
            numberView = that.$pageNumberWrap;

        if (opts.firstText) {
            numberView.append(that._createLink(1, currentPage, {
                text: opts.firstText,
                classes: "prev"
            }));
        }

        if (opts.prevText) {
            numberView.append(that._createLink(currentPage - 1, currentPage, {
                text: opts.prevText,
                classes: "prev"
            }));
        }

        if (opts.pageNumber) {
            if (this.options.simple) {  // 简易模式
                if (this.options.showCurrentPage) {
                    numberView.append([
                        '<span class="simple">',
                            '<span class="current-page btn">' + this.currentPageNumber + '</span>',
                            '<span class="btn split-line">/</span>',
                            '<span class="btn">' + np + '</span>',
                        '</span>'].join(''));
                }
            } else {
                if (interval.start > 0 && numEdgeEntries > 0) {
                    end = math.min(numEdgeEntries, interval.start);
                    that._appendRange(currentPage, 0, end, {
                        classes: 'sp'
                    });
                    if (numEdgeEntries < interval.start) {
                        $(pageEllipsis).appendTo(numberView);
                    }
                }

                that._appendRange(currentPage, interval.start, interval.end);

                if (interval.end <= np && numEdgeEntries > 0) {
                    if (np - numEdgeEntries > interval.end) {
                        $(pageEllipsis).appendTo(numberView);
                    }
                    begin = math.max(np - numEdgeEntries, interval.end);
                    that._appendRange(currentPage, begin, np, {
                        classes: 'ep'
                    });
                }
            }
        }

        if (opts.nextText) {
            numberView.append(that._createLink(currentPage + 1, currentPage, {
                text: opts.nextText,
                classes: "next"
            }));
        }

        if (opts.lastText) {
            numberView.append(that._createLink(np, currentPage, {
                text: opts.lastText,
                classes: "next"
            }));
        }
    },
    
    /**
    * 展示总条数和总页数
    */
    _drawInfo: function () {
        var dataSource = this.dataSource,
            pageInfoTemplate = this.pageInfoTemplate,
            pageInfoView = this.pageInfoView;
        if (this.options.pageInfo && dataSource.options.total !== false) {
            pageInfoView.html(pageInfoTemplate({
                total: dataSource.total(),
                pages: dataSource.totalPages(),
                current: dataSource.page()
            }));
        }
    },
    
    /**
    *组件销毁
    */
    destroy: function () {
        this.$element.empty().off();
        this._super();
    }
});

fly.component(c);