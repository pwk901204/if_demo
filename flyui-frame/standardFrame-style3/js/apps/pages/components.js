/**
 * 组件模块 
 */
require.config(requireConfig);
define(['jquery',
        'fly',
        'common',
        'message',
        'util'
    ],
    function($, fly, common, message, util) {

        var compomemtsModel = window.compomemtsModel = fly.observable({
            
            // 禁用控制 
            enabledFlag: false,

            // 确认提示 
            confirmClick: function() {
                common.sysConfirm('您确定提交该问卷吗？', function() {
                    util.tip('提交成功了哎！','success');
                });
            },

            // 遮罩  
            maskClick: function() {
                // 加载遮罩 
                util.mask(message.get('LOADING'));

                util.tip('遮罩打开后三秒关闭','success');
                setTimeout(function(){
                    // 去掉遮罩 
                    util.removeMask();
                },3000);
            },

            // 顶部提示 
            topTipShow: function() {
                util.tip('成功提示！','success');

                util.tip('警告提示！','danger');

                util.tip('危险提示！','warning');
            },

            // 跟随提示 
            followTipShow: function() {
                $('#followTipShow').flyTooltip({
                    content: '这里是跟随提示！！！'
                });
            },

        });
        fly.bind('body', compomemtsModel);
    });