/**
 * 框架模块
 */
require.config(requireConfig);
define(['jquery',
        'fly',
        'common',
        'message',
        'util',
        'nicescroll'
    ],
function($, fly, common, message, util) {
    var navData = [];
    var viewModel = window.viewModel =  fly.observable({
        navWidth:0,

        // 导航是否展开 
        menuOpenCloseFlag: false, 

        // 二级导航是否隐藏  
        clickHideFlag: false,

        // 导航的点击事件 
        menuOpenCloseClick: function() {
            viewModel.set('menuOpenCloseFlag', !viewModel.menuOpenCloseFlag);
            if(viewModel.menuOpenCloseFlag){
                $('.container-content').css('left', '46px');
            }else{
                $('.container-content').css('left', '120px');
            }
        },

        // 设置选中导航状态，并且展示页面路径 
        setNavStateAndSetUrl: function(navArray) {
            if(navArray && navArray.length) {
                navArray[0].isSelect = true;
            }
            for (var i = 0; i < navArray.length; i++) {
                var getChild = navArray[i].item; 
                if(getChild && getChild.length) {
                    getChild = viewModel.setNavStateAndSetUrl(getChild);
                } else {
                    navArray[i].isSelect = true;
                    $('#pageFrame').attr('src', navArray[i].url || '');
                    break;
                }
            }
            return navArray;
        },

        // 左侧导航的数据源 
        navListSource: fly.dataSource({
            data: []
        }),

        initMenu:function(){ //初始化页面菜单
            //顶部菜单数据模拟
            util.mask(message.get('LOADING'));
            $.ajax({
                url: '../../../json/nav.json',
                type: 'POST',
                success: function(res){
                    util.removeMask();
                    if(res.status){
                        var data = res.data;
                        navData = viewModel.setNavStateAndSetUrl(data);
                        
                        viewModel.set('navListSource', navData);
                        setTimeout(function(){
                            viewModel.navScroll();
                        },1000);
                    }
                },
                error: function(){
                    util.removeMask();
                }
            });

        },

        // 递归设置每个节点 
        setEveryNode: function(navArray) {
            for (var i = 0; i < navArray.length; i++) {
                navArray[i].set('isSelect', false);
                if(navArray[i].item && navArray[i].item.length) {
                    viewModel.setEveryNode(navArray[i].item);
                }
            }
        },

        // 全部设置为未选中状态 
        setAllNavSelectFalse: function() {
            viewModel.set('clickHideFlag', true);
            viewModel.setEveryNode(viewModel.navListSource);
            setTimeout(function(){
                viewModel.set('clickHideFlag', false);
            },100);
        },

        // 一级导航的点击事件 
        firstNavClick: function(e) {
            var thisObj = e.data;
            if(!thisObj.item || !thisObj.item.length) {
                viewModel.setAllNavSelectFalse();

                thisObj.set('isSelect', true);
                $('#pageFrame').attr('src', thisObj.url || '');
            }
        },

        // 二级导航的点击事件 
        secondNavClick: function(e) {
            var thisObj = e.data;
            if(thisObj.isSelect) {
                thisObj.set('isSelect', false);
            } else {
                thisObj.parent().forEach(function(item, i){
                    item.set('isSelect', false);
                });
                thisObj.set('isSelect', true);
            }
            return false;
        },

        // 三级导航点击事件 
        thirdNavClick: function(e) {
            var thisObj = e.data;
            viewModel.setAllNavSelectFalse();

            $('#pageFrame').attr('src', thisObj.url || '');

            // 当前节点选中 
            thisObj.set('isSelect', true);
            // 二级导航选中  
            thisObj.parent().parent().set('isSelect', true);
            // 一级导航选中 
            thisObj.parent().parent().parent().parent().set('isSelect', true);

            return false;
        },

        // 用户退出 
        userExit: function() {
            common.sysConfirm('您确定退出吗？', function() {
                util.tip('用户已经退出！', 'success');
            });
        },

        navScroll:function(length){ //头部导航溢出滚动
            $(".child-navwrap").niceScroll({
                cursorwidth: 3,
                cursorcolor: "#c5c5c7",
                cursorborder: "none",
                autohidemode: true,
                enablemousewheel: true,
                horizrailenabled: false,
                horizrailenabled: true,
                rtlmode: "auto"
            });
        }
    });
    fly.bind('body', viewModel);

    $(function(){
        viewModel.initMenu();
    });
});