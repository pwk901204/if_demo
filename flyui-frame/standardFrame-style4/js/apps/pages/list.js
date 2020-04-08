/**
 * 列表模块 
 */
require.config(requireConfig);
define(['jquery',
        'fly',
        'common',
        'message',
        'util'
    ],
    function ($, fly, common, message, util) {

        // 页面视图模型 
        var listModel = window.listModel = fly.observable({
            // 表单对应数据 
            formObj: {
                nj: '',
                xb: '',
                zy: '',
                bj: '',
                xm: '',
                sj: '',
                xq: '',
                djsj: '',
                startTime: '',
                endTime: ''
            },

            // 复选按钮点击事件 
            checkboxNodeClick: function (e) {
                e.data.set('checked', !e.data.checked);

                this.set('selectAllFlag', this.getListAllSelectFlag());
            },

            // 全选状态 
            selectAllFlag: false,

            // 全选事件 
            selectAllClick: function (e) {

                // 当前全选按钮状态取反
                var state = !this.selectAllFlag;
                // 设置全选按钮新的状态
                this.set('selectAllFlag', state);

                // 当前页表格数据遍历
                this.listTable.view().forEach(function (item, i) {
                    // 将当前表格行数据都设置为相同状态
                    item.set('checked', state);
                });
            },

            // 获取列表中的全选状态 
            getListAllSelectFlag: function () {
                var resFlag = true;
                // 当前页表格数据遍历
                this.listTable.view().forEach(function (item, i) {
                    // 判断只要有一个没选中则全选不选中
                    if (!item.checked) {
                        resFlag = false;
                        return false;
                    }
                });
                return resFlag;
            },

            // 列表数据源 
            listTable: fly.dataSource({
                read: {
                    url: '../../../json/xb-list.json',
                    type: 'get',
                    dataType: 'json',
                    dataFilter: function (result, type) {
                        // 转换成JSON对象
                        var result = fly.evalJSON(result),
                            data = result.data;
                        listModel.set('pageTotal', data.total);
                        // 分页隐藏优化
                        if (data.rows.length > 0) {
                            $('.row-paging').removeClass('hide');
                        } else {
                            $('.row-paging').addClass('hide');
                        }
                        // 请求数据错误
                        if (!result.status) {
                            // 返回空数据 
                            return fly.toJSON({
                                total: 0,
                                rows: []
                            });
                        };
                        // 转换成JSON
                        return fly.toJSON({
                            rows: data.rows,
                            total: data.total
                        });
                    }
                },
                pageSize: 10
            }).bind('empty', function () {
                // 数据源为空 
                $('.row-paging').hide();
                common.setGridEmpty(10);
            }).bind('requestStart', function () {
                // 加载遮罩 
                util.mask(message.get('LOADING'));
            }).bind('requestEnd', function () {
                // 去掉遮罩 
                util.removeMask();
            }),

            currentPageSize: 10,
            pageSizeList: [{
                text: "5",
                value: 5
            }, {
                text: "10",
                value: 10
            }, {
                text: "15",
                value: 15
            }],
            pageSizeChange: function () {
                // 改变每页的条目数
                listModel.listTable.pageSize(listModel.currentPageSize);
            },

            njSource: fly.dataSource({
                read: {
                    url: '../../../json/njSource.json',
                }
            }),
            xbSource: fly.dataSource({
                read: {
                    url: '../../../json/xbSource.json',
                }
            }),
            zySource: fly.dataSource({
                read: {
                    url: '../../../json/zySource.json',
                }
            }),
            bjSource: fly.dataSource({
                read: {
                    url: '../../../json/bjSource.json',
                }
            }),
            sexSource: fly.dataSource({
                read: {
                    url: '../../../json/sexSource.json',
                }
            }),

            //高级搜索-是否展示  
            searchShow: false,
            // 高级搜索
            advancedSearch: function () {
                if (this.searchShow) {
                    this.set('searchShow', false);
                } else {
                    this.set('searchShow', true);
                }
            },

            // // tab数据源 
            // listTabSource: fly.dataSource({
            //     data: [{
            //         text: '待审核',
            //         value: '1',
            //         checked: true
            //     }, {
            //         text: '已审核',
            //         value: '2'
            //     }]
            // }),

            // // tab点击事件 
            // listTabClick: function (e) {
            //     // 如果已选中则不处理 
            //     if (e.data.checked) {
            //         return false;
            //     }
            //     // 循环将所有状态都置为false 
            //     listModel.listTabSource.view().forEach(function (item) {
            //         item.set('checked', false);
            //     });

            //     // 当前节点选中 
            //     e.data.set('checked', true);
            // },

            // 新增
            addClick: function () {
                util.tip('新增事件', 'success');
            },
            // 编辑
            editClick: function () {
                common.sysConfirm('您确定提交该问卷吗？', function () {
                    util.tip('提交成功了哎！', 'success');
                });
            },
            // 导出  
            exportClick: function () {
                util.tip('导出事件', 'danger');
            },

            // 表格中的按钮点击事件 
            optClick: function (e) {
                util.tip('操作事件！！！', 'success');
            },

            // 查询
            queryClick: function () {
                var filterValid = {
                        nj: {
                            required: true,
                            title: "所属年纪"
                        },
                        xm: {
                            required: true,
                            max: 10,
                            title: "姓名"
                        },
                        sj: {
                            required: true,
                            title: "事件名称"
                        }
                    },
                    highValid = {
                        xq: {
                            required: true,
                            title: "兴趣"
                        },
                        sex: {
                            required: true,
                            title: "性别"
                        },
                        startTime: {
                            required: true,
                            title: "开始时间"
                        }
                    },
                    validForm = listModel.searchShow ? 'queryForm' : 'baseForm';

                // 校验根据是否包括高级搜索 
                var queryModel = $('#' + validForm).flyForm({
                    valid: listModel.searchShow ? $.extend({}, filterValid, highValid) : filterValid
                }).data('flyForm');

                var data = queryModel.data();
                if (!data) {
                    return false;
                }
                listModel.listTable.filter(data);
            }

        });
        fly.bind('body', listModel);
    });