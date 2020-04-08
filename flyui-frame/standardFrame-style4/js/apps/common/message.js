/**
 * 统一提示语信息 
 *组件库
 */

(function(factory) {
    if (typeof define === "function" && define.amd) {
        define([], factory);
    } else {
        factory();
    }
}(function() {

    var data = {
        "EXIT_CONFIRM": "确定退出？",
        "DELETE_TIP":"确定删除？",
        'DELETE_TIP_CONTENT':'数据不可逆，请谨慎操作',
        "DEFAULT": "数据加载失败",
        "LOADING_ERROR": "数据加载失败",
        "LOADING": "数据加载中...",
        "LOADING_SUCCESS": "数据加载成功",
        "LOADING_EXPORTS": "正在导出...",
        "SAVE_SUCCESS" :"保存成功" ,
        "SAVE_ERROR" : "保存失败",
        "SAVE_FAIL" : "保存失败",
        "DELETE_SUCCESS":"删除成功",
        "DELETE_ERROR":"删除失败",
        "EXPORT_EMPTY":"没有导出数据",
        "NODATA":"没有数据",
        "DIALOG_TITLE":"查看详细",
        "CLOSE":"关闭",
        "QUIT_INFO":"确定退出？",
        "QUIT_INFO_TIP":"退出之后,需要重新登录",
        "OPERATE_SUCCESS":"操作成功！"
    };

    var message = {
        get: function(key) {
            if (!key) {
                return data['DEFAULT'];
            }

            var keys = key.split(','),
                msg = [];
            for (var i = 0, l = keys.length; i < l; i++) {
                if (data[keys[i]]) {
                    msg.push(data[keys[i]]);
                }
            }

            if (msg.length == 0)
                return data['DEFAULT'];

            return msg.join('<br/>');
        }
    };

    window.message = message;
    return message;
}));