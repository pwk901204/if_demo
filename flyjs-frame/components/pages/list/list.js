var fly = require('fly'),
    textbox = require('textbox'),
    alert = require('alert'),
    form = require('form'),
    grid = require('grid'),
    pager = require('pager'),
    dialog = require('dialog'),
    utils = require('common/utils'),
    dropdown = require('dropdown');

module.exports = fly.Component.extend({

    template: __inline('./list.html'),

    formObj: {
        mc: '',
        bm: ''
    },

    // 部门数据源 
    departmentSource: fly.data({
        read: {
            url: '/mock/department',
            type: 'get',
            dataFilter: function(res) {
                var data = fly.evalJSON(res).data;
                return data;
            }
        }
    }),

    // 列表数据源 
    gridDs: fly.data({
        read: {
            url: '/mock/list',
            dataFilter: function(res) {
                if (!res.flag) {
                    return {
                        rows: [],
                        total: 0
                    };
                }
                return {
                    rows: res.data.result,
                    total: res.data.total
                };
            }
        },
        pageSize: 5
    }).bind('empty', function(data) {
        //debugger;
    }).bind('requestStart', function() {
        utils.mask();
    }).bind('requestEnd', function() {
        utils.removeMask();
    }),

    // 方法 
    methods: {
        // 搜索事件 
        searchHandle: function() {
            this.gridDs.filter(this.formObj);
        },

        // 获取数据 
        getAjaxData: function() {
            utils.ajax({
                url: '/mock/res',
                type: 'get'
            }).done(function(res) {
                fly.alert({
                    content: res.data.mc,
                    type: 'success'
                });
            })
        },

        // 新增部门 
        addDepartment: function() {
            fly.dialog({
                title: '新增部门',
                content: '使用backdropBackground/backdropOpacity属性设置弹窗背景颜色和遮罩透明度',
                backdropBackground: '#27abe0',
                backdropOpacity: 0.2,
                width: '300px',
                height: '100px'
            }).showModal();
        },

        // 查看  
        viewHandle: function(e) {
            fly.dialog({
                title: '查看',
                content: e.handleObj.data.description
            }).show();
        }
    }
});