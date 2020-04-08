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
        initMenu:function(){ //初始化页面菜单
            //顶部菜单数据模拟
            util.mask(message.get('LOADING'));
            $.ajax({
                url: '../../../json/nav.json',
                type: 'POST',
                success: function(res){
                    if(res.status){
                        var data = res.data;
                        navData = data;
                        if(navData && navData.length){
                            navData[0].isSelect = true;
                        }

                        //方案1/2 加载导航菜单
                        var html = fly.template('navTempl', navData);
                        $('.nav').html(html);

                        var leftMenuData = data[0].item;
                        if(!leftMenuData || !leftMenuData.length){
                            $('.menu-left-content').addClass('hide');
                            $('.container-content').css('left', '0px');
                            $('#pageFrame').attr('src', data[0].url);
                        } else {
                            $('.menu-left-content').removeClass('hide');
                            for (var i = 0; i < leftMenuData.length; i++) {
                                if(leftMenuData[i].item && leftMenuData[i].item.length) {
                                    leftMenuData[i].isSelect = true;
                                    leftMenuData[i].item[0].isSelect = true;
                                    //设置
                                    $('#pageFrame').attr('src', leftMenuData[i].item[0].url);
                                    break;
                                }
                            }

                            //方案1/2左侧菜单数据模拟
                            var html = fly.template('leftMenuTempl', leftMenuData);
                            $('.menu-left-content-fristInfo1').html(html);
                            viewModel.navScroll(navData.length);
                        }
                        
                        setTimeout(function(){
                            viewModel.navScroll(navData.length);
                        },200);
                        util.removeMask();

                    }
                },
                error: function(){
                    
                }
            });

        },

        // 用户退出 
        userExit: function() {
            common.sysConfirm('您确定退出吗？', function() {
                util.tip('用户已经退出！', 'success');
            });
        },

        addEvent:function(){ //添加页面事件
            //头部菜单点击事件
            $(document).on('click', '.nav-content', function(e) {
                //切换选中样式
                $('.nav-item').removeClass('nav-item-selected'); 
                $('.unselected-mark').removeClass('selected-mark');
                var code = "";
                if($(e.target.parentElement.parentElement).hasClass('nav-item')){
                    $(e.target.parentElement.parentElement).addClass('nav-item-selected');
                    $(e.target.parentElement.parentElement).find('.unselected-mark').addClass('selected-mark');
                    code = $(e.target.parentElement.parentElement).attr('data-code');
                }else{
                    $(e.target.parentElement.parentElement.parentElement).addClass('nav-item-selected'); 
                    $(e.target.parentElement.parentElement.parentElement).find('.unselected-mark').addClass('selected-mark');
                    code = $(e.target.parentElement.parentElement.parentElement).attr('data-code');
                }

                var hasLeftChild = false;

                //重新加载菜单
                for(var i=0;i<navData.length;i++){
                    if(code==navData[i].authCode){
                        var leftMenuData = navData[i].item;

                        for (var j = 0; j < leftMenuData.length; j++) {
                            if(leftMenuData[j].item && leftMenuData[j].item.length) {
                                leftMenuData[j].isSelect = true;
                                leftMenuData[j].item[0].isSelect = true;
                                //设置
                                $('#pageFrame').attr('src', leftMenuData[j].item[0].url);
                                break;
                            }
                        }

                        //方案1/2
                        var html = fly.template('leftMenuTempl', leftMenuData);
                        $('.menu-left-content-fristInfo1').html(html);
                        viewModel.navScroll(navData.length);

                        if(leftMenuData.length) {
                            hasLeftChild = true;
                            $('.menu-left-content').removeClass('hide');
                            $('.container-content').css('left', '180px');
                        } else {
                            $('#pageFrame').attr('src', navData[i].url);
                        }
                        
                    }
                }

                if(!hasLeftChild){
                    $('.container-content').css('left', '0px');
                    $('.menu-left-content').addClass('hide');
                }
                
                //$(e.target.parentElement.parentElement).attr('data-url')
                
            });

            //点击左侧一级菜单
            $(document).on('click', '.firstMenu', function(e) {
                if(!$(e.target).hasClass('firstMenu')){
                    e.target = e.target.parentElement;
                }
                var flag = $(e.target).find('.menu-up').hasClass('menu-down');
                if(!$(e.target).find('.menu-up').hasClass('menu-up')){
                    return;
                }
                $('.firstMenu').removeClass('menu-selected');
                $(e.target).addClass('menu-selected');
                $('.menu-left-ul').addClass('ul-show-style');
                $('.menu-up').removeClass('menu-down').addClass('menu-up-left');
               
                if(!flag){
                    $(e.target.nextElementSibling).removeClass('ul-show-style');
                    $(e.target).find('.menu-up').addClass('menu-down').removeClass('menu-up-left');
                }else{
                    $(e.target.nextElementSibling).addClass('ul-show-style');
                     $(e.target).find('.menu-up').removeClass('menu-down').addClass('menu-up-left');
                }
               
            });
            
            //点击左侧二级菜单
            $(document).on('click', '.menu-left-ul-li', function(e) {
                if($(e.target).hasClass('subItem-name')){
                     e.target = e.target.parentElement;
                }
                $('.menu-left-ul-li').removeClass('subItem-selected');
                $(e.target).addClass('subItem-selected');

                var getUrl = $(e.target).attr('data-url');
                if(getUrl) {
                    $('#pageFrame').attr('src', getUrl);
                }

                //alert($(e.target).find('span').eq(0).text());
            });

            //展开左侧一级菜单
            $(document).on('click', '.retract', function(e) {
                var wWidth = $(window).width();
                if(!$(e.target).hasClass('open')){
                    $('.retract').addClass('open');
                    $('.menu-left-content').addClass('menu-left-content-expand');
                    $('.menu-left-content').width(120);
                    $('.container-content').css({'left':"120px",'right':0});
                    $('.firstMenuName').removeClass('hideName');
                }else{
                    $('.retract').removeClass('open');
                    $('.menu-left-content').removeClass('menu-left-content-expand');
                    $('.menu-left-content').width(46);
                    $('.container-content').css({'left':"46px",'right':0});
                    $('.firstMenuName').addClass('hideName');
                }
                // viewModel.setMenuHeigth();
                
                var navWidth = $('.menu-left-content').width();
                $('.container-content').css({'width':wWidth-navWidth+'px'});
            });

            // 鼠标悬浮一级导航展示其下的菜单
            $(document).on('mouseover', '.menu-left-content', function(e) {
                if($(e.target).hasClass('retract')){
                   return;
                }
                if($('.menu-left-content').width()==120){
                    $('.second-menu-content').css({'left':'120px'});
                }else{
                    $('.second-menu-content').css({'left':'46px'});
                }
                $('.second-menu-content').removeClass('ul-show');

                if(!$(e.target).hasClass('firstMenu')){
                    e.target=e.target.parentElement;
                }
                var code = $(e.target).attr('data-code');
                for(var i=0;i<navData.length;i++){
                    if(code==navData[i].authCode){
                        var leftMenuData = navData[i].item;
                        //方案3
                        var html = fly.template('leftMenuTipTempl', leftMenuData);
                        $('.second-menu-content').html(html);
                    }
                }
            }).on('mouseout', '.menu-left-content', function(e) {
                $('.second-menu-content').addClass('ul-show');  
            });

        },
        navScroll:function(length){ //头部导航溢出滚动
            $('.nav-warp').css({'width':120*length});
            var moreLength = $('.logo').width() + $('.user-wrap').width() + 40;
            $('#navId').width($(window).width()- moreLength);
            $(".nav").niceScroll({
                cursorwidth: 3,
                cursorcolor: "#324675",
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
        viewModel.addEvent();
    });
});