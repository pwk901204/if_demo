(this.nativeLog || function(s) {console.log(s)})('WELCOME START CROODS JS FRAMEWORK 2.0.1, Build 2017-12-20 12:40.');
;(this.getJSFMVersion = function(){return '2.0.1'});

(function (window, factory) {
	typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
	typeof define === 'function' && define.amd ? define(factory) :
	(window.croods = factory());
}(window, (
  function () {
    'use strict';

var KEY_TYPE_ARR = ['volumedownbutton', 'volumeupbutton', 'searchbutton', 'menubutton', 'backbutton', 'homebutton'];
var API_NAMES = {
    copy: 'BasePlugin.copy',
    loadUrl: 'BasePlugin.loadUrl',
    close: 'BasePlugin.close',
    goBack: 'BasePlugin.goBack',
    exit: 'BasePlugin.exit',
    ajax: 'RoutePlugin.request',
    networkType: 'BasePlugin.getNetworkType',
    bindButton: 'BasePlugin.bindButton',
    unbindButton: 'BasePlugin.unbindButton',
    appInfo: 'BasePlugin.getAppInfo',
    deviceInfo: 'BasePlugin.getDeviceInfo',
    getContact: 'ContactsPlugin.get',
    request: 'ShieldPlugin.request'

};

var networkconfig = '综合执法'
/**
 * 请求API网关
 * @param {*} opt
 * opt{
 *  path:'', 传递请求path
 *  params:{}, 请求参数
 *  success: function(res){}, 成功回调
 *  fail: function(res){} 失败回调
 * }
 */
var request = function (opt) {
    var obj = checkParam(opt);
    var args = {};

    if (!obj.path) {
        throw new Error('The arguments "path" is required and cannot be null!')
    }

    checkParamsType({ name: 'path', value: obj.path, type: GLOBAL_STR.STRING });
    args.path = opt.path;

    if (obj.params && isNotObject(obj.params)) {
        throw new Error('The arguments "params" type must be object!')
    }

    if (!isEmptyObject(obj.params)) {
        args.parameter = obj.params;
    }

    obj.params = args;
    return exec(API_NAMES.request, obj)
};

/**
 * 请求统一路由
 * @param {Object} opt
 * opt{
 * 	method:'', 请求方法
 *  params:{}, 请求参数
 *  success: function(res){}, 成功回调
 *  fail: function(res){} 失败回调
 * }
 */
var ajax = function (opt) {
    var obj = checkParam(opt);
    var args = {};

    if (!obj.method) {
        throw new Error('The arguments "method" is required and cannot be null!')
    }

    checkParamsType({ name: 'method', value: obj.method, type: GLOBAL_STR.STRING });
    checkParamsType({ name: 'timeout', value: obj.timeout, type: GLOBAL_STR.NUMBER });

    args.t = obj.timeout || 8000;
    args.m = obj.method;

    if (obj.params && isNotObject(obj.params)) {
        throw new Error('The arguments "params" type must be object!')
    }

    if (!isEmptyObject(obj.params)) {
        args.p = obj.params;
    }

    obj.params = args;
    return exec(API_NAMES.ajax, obj)
};

/**
 * 调用自定义插件方法
 * @param {Object} opt
 * opt {
 *   action: xxx.xx 自定义插件名称
 * 	 params: {}可选  自定义插件参数
 * 	 success： function(){} 可选 自定义插件成功回调
 * }
 */
var customPlugin = function (opt) {
    var obj = checkParam(opt);
    if (!obj.action) {
        throw new Error('The arguments "action" is required!')
    }

    if (typeof obj.action !== GLOBAL_STR.STRING || obj.action.indexOf('.') === -1) {
        throw new Error('The arguments "action" type must be string, like:"PluginName.ActionName"!')
    }

    if (obj.params && isNotObject(obj.params)) {
        throw new Error('The arguments "params" type must be object!')
    }

    return exec(obj.action, obj)
};

var invoke = function (opt) {
    var obj = checkParam(opt);

    if (!obj.service) {
        throw new Error('The arguments "service " is required!')
    }

    if (!obj.action) {
        throw new Error('The arguments "action" is required!')
    }

    if (typeof obj.service != GLOBAL_STR.STRING) {
        throw new Error('The arguments "service" type must be string, like:"PluginName.ActionName"!')
    }

    if (typeof obj.action != GLOBAL_STR.STRING) {
        throw new Error('The arguments "action" type must be string, like:"PluginName.ActionName"!')
    }

    if (obj.params && isNotObject(obj.params)) {
        throw new Error('The arguments "params" type must be object!')
    }

    obj.action = obj.service + '.' + obj.action;

    return exec(obj.action, obj)
};

/**
 * 复制
 * @param {Object} opt
 * opt{
 * 	content:'', 复制内容
 * }
 */
var copy = function (opt) {
    var obj = checkParam(opt);

    if (!obj.content) {
        throw new Error('The arguments "content" is required!')
    }
    checkParamsType({ name: 'content', value: obj.content, type: GLOBAL_STR.STRING });

    obj.params = {
        content: obj.content
    };
    return exec(API_NAMES.copy, obj)
};

/**
 * 页面跳转
 * @param  url 跳转地址
 * @param  isClose 是否关闭当前页，默认false
 */
var loadUrl = function (opt) {
    var obj = checkParam(opt);
    checkParamsType({ name: 'url', value: obj.url, type: GLOBAL_STR.STRING });

    obj.params = {
        url: obj.url,
        close: obj.close || false
    };
    return exec(API_NAMES.loadUrl, obj)
};

/**
 * 页面关闭(建议使用closePage，此方法名称过时)
 */
var pageClose = function (opt) {
    var obj = checkParam(opt);
    obj.params = {};

    checkParamsType({ name: 'callback', value: obj.callback, type: GLOBAL_STR.STRING });

    obj.params.callback = obj.callback || GLOBAL_STR.NULL_STR;
    return exec(API_NAMES.close, obj)
};

var closePage = function (opt) {
    return pageClose(opt)
};

/**
 * 页面退出
 */
var exit = function () {
    return exec(API_NAMES.exit, {})
};

/**
 * 页面返回
 */
var goBack = function () {
    exec(API_NAMES.goBack, {});
    history.back();
};

/**
 * 检查API是否存在
 * @param {Object} opt
 */
var checkJsApi = function (opt) {
    var obj = checkParam(opt);

    var apis = obj.jsApiList;
    var result = {};

    if (!(apis instanceof Array)) {
        throw new Error('The arguments "jsApiList" type must be array!')
    }

    result = inArrayMap(apis, hydra);

    typeof obj.success === GLOBAL_STR.FUNCTION && obj.success(result);
};

/**
 * 获取网络类型
 */
var getNetworkType = function (opt) {
    return exec(API_NAMES.networkType, checkParam(opt))
};
/**
 * 获取应用信息
 */
var getAppInfo = function (opt) {
    return exec(API_NAMES.appInfo, checkParam(opt))
};
/**
 * 获取设备信息
 */
var getDeviceInfo = function (opt) {
    return exec(API_NAMES.deviceInfo, checkParam(opt))
};
/**
 * 绑定android物理按键
 * opt：{
 *   keycode: ['volumedownbutton', 'volumeupbutton',
 *				'searchbutton', 'menubutton',
 *					'backbutton', 'homebutton'],
 * 	 success: function(res){
 *		res.action: 指定某个按钮
 *   }
 * }
 */

var bindButton = function (opt) {
    return buttonEventTrigger(API_NAMES.bindButton, opt)
};

/**
 * 解绑物理按键
 * opt：{
 *   keycode: ['volumedownbutton', 'volumeupbutton',
 *				'searchbutton', 'menubutton',
 *					'backbutton', 'homebutton'],
 * 	 success: function(res){
 *		res.action: 指定某个按钮
 *	 }
 * }
 */
var unbindButton = function (opt) {
    return buttonEventTrigger(API_NAMES.unbindButton, opt)
};

/**
 * 物理按键事件触发
 */
var buttonEventTrigger = function (eventName, opt) {
    var obj = checkParam(opt);
    obj.params = {};

    if (!obj.keycode) {
        throw new Error('The arguments "keycode" is required and cannot be null!')
    }

    if (obj.keycode instanceof Array) {
        if (obj.keycode.length === 0) {
            throw new Error('The arguments "keycode" cannot be null!')
        }

        obj.keycode = obj.keycode.unique();
        for (var i = 0, len = obj.keycode.length; i < len; i++) {
            if (!inArray(obj.keycode[i], KEY_TYPE_ARR)) {
                throw new Error(("The arguments \"keycode\" value " + (obj.keycode[i]) + " invalid!"))
            }
        }
    }
    else {
        throw new Error('The arguments "keycode" type must be array !')
    }

    obj.params.keycode = obj.keycode;
    return exec(eventName, obj)
};

/**
 * 获取联系人信息
 * @param {Object} opt
 *  success: function(res){
 * 	res.name : xx 返回联系人姓名
 *  res.phoneNum: xx 返回联系人号码
 * }
 */
var getContact = function (opt) {
    return exec(API_NAMES.getContact, checkParam(opt))
};

var CONFIG_INFO = {};
/**
 * 配置
 * @param {Object} opt
 */
var config = function (opt) {
    CONFIG_INFO = checkParam(opt);
};

/**
 * croods 工具包
 * @author jingli12
 */
var GLOBAL_STR = {
	ANDROID: 'android',
	IOS: 'ios',
	IPHONE: 'iPhone',
	IPAD: 'iPad',
	OBJECT: 'object',
	STRING: 'string',
	BOOLEAN: 'boolean',
	NUMBER: 'number',
	FUNCTION: 'function',
	TIMEOUT: 'TIMEOUT',
	NULL_STR: ''
};

/**
 * check e is in arr
 * @param {Object} e
 * @param {Object} arr
 */
var inArray = function (e, arr) {
	if (arr && arr instanceof Array) {
		for (var i = 0; i < arr.length; i++) {
			if (e === arr[i]) {
				return true
			}
		}
		return false
	}
	return false
};

var inArrayMap = function (arr, hydra) {
	var result = {};
	var api = null;

	if (arr && arr instanceof Array) {
		for (var i = 0; i < arr.length; i++) {
			api = arr[i].split('.');
			result[arr[i]] = false;

			for (var o in hydra) {
				if (o === api[0]) {
					// 判断是否子方法
					if (typeof hydra[o] === GLOBAL_STR.OBJECT && api[1]) {
						for (var c in hydra[o]) {
							if (c === api[1]) {
								result[arr[i]] = true;
							}
						}
					}
					else {
						result[arr[i]] = true;
					}
				}
			}
		}
	}
	return result
};

/**
 * check array unique
 */
Array.prototype.unique = function () {
	var this$1 = this;

	var arr = [];
	var obj = {};

	for (var i = 0; i < this.length; i++) {
		if (!obj[this$1[i]]) {
			arr.push(this$1[i]);
			obj[this$1[i]] = 1;
		}
	}
	return arr
};

/**
 * check object is empty
 * @param {Object} o
 */
var isEmptyObject = function (o) {
	for (var t in o) { return false }
	return true
};

/**
 * check isNotObject
 * @param {Object} o
 */
var isNotObject = function (o) {
	if (typeof o !== GLOBAL_STR.OBJECT || o instanceof Array) {
		return true
	}
	return false
};

/**
 * check request param
 * @param {Object} opt
 */
var checkParam = function (opt) {
	var obj = opt || {};
	if (isNotObject(obj)) {
		throw new Error('The arguments type must be object!')
	}
	return obj
};

/**
 * checkParamsType
 * @param value
 * @param type
 */
var checkParamsType = function (obj) {
	if (obj.value && obj.type && typeof obj.value !== obj.type) {
		throw new Error('The arguments "' + obj.name + '" type must be ' + obj.type + '!')
	}
};

/**
 * check userAgent
 */
var userAgent = function () {
	var agent = navigator.userAgent;
	var os = GLOBAL_STR.ANDROID;
	if (agent.indexOf(GLOBAL_STR.IPHONE) !== -1 ||
		agent.indexOf(GLOBAL_STR.IPAD) !== -1) {
		os = GLOBAL_STR.IOS;
	}
	return os
};

/**
 * setAndroidJsToNativeMode
 * @param obj
 */
var setAndroidJsToNativeMode = function (obj) {
	window.prompt('iflytek:' + JSON.stringify(obj));
	// Annotation this
	// const agent = navigator.userAgent
	// const index = agent.indexOf(GLOBAL_STR.ANDROID)
	// let version = 4.4
	// if (index !== -1) {
	// 	version = parseFloat(agent.slice(index + 8, index + 13))
	// }
	// if (version < 4.4) {
		// setAndroidJsToNativeMode = (obj) => {
			// window.prompt('iflytek:' + JSON.stringify(obj))
		// }
	// }
	// else {
	// 	setAndroidJsToNativeMode = (obj) => {
	// 		croodsBridge.exec('iflytek:' + JSON.stringify(obj))
	// 	}
	// }
	// setAndroidJsToNativeMode(obj)
};

/**
 * create iframe for ios invoke
 */
var createExecIframe = function () {
	var iframe = document.createElement('iframe');
	iframe.style.display = 'none';
	iframe.src = '';
	document.body.appendChild(iframe);
	return iframe
};

/**
 * 调试输出
 */
var debug = {
	log: function (msg) {
		if (CONFIG_INFO.debug) {
			console.log(msg);
		}
	},
	alert: function (msg) {
		if (CONFIG_INFO.debug) {
			window.alert(msg);
		}
	}
};

var ExecIframe;
var callbackObj = {

    // Generate callbackId for call api callback function name
    callbackId: Math.floor(Math.random() * 10000000000),

    // Queue for ios request
    commandQueue: [],

    // Object for call api callbacks.
    callbacks: {},

    // promise style call.
    $deferred: function () {
        var obj = {};

        obj.success = function (callback) {
            if (typeof callback === GLOBAL_STR.FUNCTION) {
                this._success = callback;
            }
            return this
        };

        obj.fail = function (callback) {
            if (typeof callback === GLOBAL_STR.FUNCTION) {
                this._fail = callback;
            }
            return this
        };

        obj.complete = function (callback) {
            if (typeof callback === GLOBAL_STR.FUNCTION) {
                this._complete = callback;
            }
            return this
        };

        obj.cancel = function (callback) {
            if (typeof callback === GLOBAL_STR.FUNCTION) {
                this._cancel = callback;
            }
            return this
        };

        return obj
    },

    // callback status code
    callbackStatus: {
        OK: 10000, // plugin success code
        CANCEL: 10007, // plugin cancel code
        TIMEOUT: 10012, // plugin request timeout
        TIMEOUT_ROUTER: 40001, // plugin request timeout for router
        OK_ROUTER: 1, // router request success
        FAIL_ROUTER: 0 // router request fail
    },

    // create callback for invoke
    create: function (callbackId, $deferred) {
        window[callbackId] = function (result) {
            var c = callbackObj.callbacks[callbackId];
            callbackHandler(c, result, $deferred);
        };
    }
};

/**
 * 回调处理函数
 */
var callbackHandler = function (c, result, $deferred) {
    var s = callbackObj.callbackStatus;
    var e = result.code;
    var m = result.message;
    switch (e) {
        case s.OK:
            var o = m ? JSON.parse(m) : {};

            if (o.status == undefined) {
                c.success && c.success(o);
                setTimeout(function () {
                    $deferred && $deferred._success && $deferred._success(o);
                }, 0);
                break
            }

            // 打开统一路由请求调试
            // debug.alert(JSON.stringify(result));

            if (o.status == s.OK_ROUTER) {
                c.success && c.success(o.result);
                setTimeout(function () {
                    $deferred && $deferred._success && $deferred._success(o.result);
                }, 0);
                break
            }

            if (o.status == s.FAIL_ROUTER) {
                c.fail && c.fail(o.errorCode + ': ' + o.errorMessage);
                setTimeout(function () {
                    $deferred && $deferred._fail && $deferred._fail(o.errorCode + ': ' + o.errorMessage);
                }, 0);
            }
            break

        case s.CANCEL:
            c.cancel && c.cancel(result);
            setTimeout(function () {
                $deferred && $deferred._cancel && $deferred._cancel(result);
            }, 0);
            break

        case s.TIMEOUT_ROUTER:
            result.status = GLOBAL_STR.TIMEOUT;
            break

        default:
            c.fail && c.fail(e + ': ' + m);
            setTimeout(function () {
                $deferred && $deferred._fail && $deferred._fail(e + ': ' + m);
            }, 0);
    }

    c.complete && c.complete(result);
    setTimeout(function () {
        $deferred && $deferred._complete && $deferred._complete(result);
    }, 0);
};

/**
 * croods ExecObj obj
 */
var ExecObj = {
	/**
	 * Format params for call api.
	 * @param {Object} action
	 * @param {Object} obj
	 */
    args: function (_action, obj) {
        var action = _action.split('.');
        var callbackId = action[0] + callbackObj.callbackId++;

        var callback = {};
        var param = {
            service: action[0],
            action: action[1]
        };

        if (typeof obj.success === GLOBAL_STR.FUNCTION) {
            callback.success = obj.success;
        }

        if (typeof obj.fail === GLOBAL_STR.FUNCTION) {
            callback.fail = obj.fail;
        }

        if (typeof obj.complete === GLOBAL_STR.FUNCTION) {
            callback.complete = obj.complete;
        }

        if (typeof obj.cancel === GLOBAL_STR.FUNCTION) {
            callback.cancel = obj.cancel;
        }

        callbackObj.callbacks[callbackId] = callback;
        param.callback = callbackId;
        param.params = obj.params || {};

        return param
    },

	/**
	 * Android invoke
	 * @param {Object} obj
	 */
    android: function (obj) {
        debug.log(JSON.stringify(obj));
        // window.prompt('iflytek:' + JSON.stringify(obj))
        obj.params.networkconfig = networkconfig;
        setAndroidJsToNativeMode(obj);
    },

	/**
	 * IOS invoke
	 * @param {Object} obj
	 */
    ios: function (obj) {
        callbackObj.commandQueue.push(obj);
        ExecIframe = ExecIframe || createExecIframe();
        ExecIframe.src = 'iflytek://ready';
    }
};

/**
 * invoke api .
 * @param {Object} action
 * @param {Object} obj
 */
var exec = function (action, obj) {
    var params = ExecObj.args(action, obj);
    var callbackId = params.callback;
    var callback = callbackObj.callbacks[callbackId];
    var $deferred = isEmptyObject(callback) ? new callbackObj.$deferred() : null;

    callbackObj.create(callbackId, $deferred);
    ExecObj[userAgent()](params);

    return $deferred
};

/**
 * 获取队列中请求信息
 */
var nativeFetchQueue = function () {
    var commandStr = JSON.stringify(callbackObj.commandQueue);
    callbackObj.commandQueue = [];

    debug.log(commandStr);
    return commandStr
};

/**
 * 销毁回调
 * @param {Object} callbackId
 */
var callbackDestroy = function (callbackId) {
    delete window[callbackId];
    delete callbackObj.callbacks[callbackId];
    debug.log('Destroy Function: ' + callbackId);
};

var API_NAMES$1 = {
    open: 'GeoPlugin.open',
    close: 'GeoPlugin.close',
    get: 'GeoPlugin.getLocation'
};

/**
 * 打开定位
 * @param {Object} opt
 * opt {
 *   interval: 代表每隔n秒进行一次定位，默认5000
 *   success: function(res){
 * 	   res.acc: 精度,
 *     res.lng: 经度,
 *     res.lat: 纬度,
 *     res.alt: 海拔,
 *   }
 * }
 */
var openLocation = function (opt) {
    var obj = checkParam(opt);
    obj.params = {};
    checkParamsType({ name: 'interval', value: obj.interval, type: GLOBAL_STR.NUMBER });

    obj.params.interval = obj.interval || 5000;
    return exec(API_NAMES$1.open, obj)
};

/**
 * 关闭定位
 */
var closeLocation = function (opt) {
    return exec(API_NAMES$1.close, checkParam(opt))
};

/**
 * 获取地理位置信息
 * @param {Object} opt
 * opt {
 *   lng: 经度
 *   lat: 纬度
 *   success: function(res){
 *   res:{
 * 	    nation: xxx,
 *		province: xxxx,
 *		city: xxxxx,
 *		district: xxxxx,
 *		street: xxxxx,
 *		streetNum: xxxxx
 *	}
 * }
 */
var getLocation = function (opt) {
    var obj = checkParam(opt);

    if (!obj.lng) {
        throw new Error('The arguments "lng" is required!')
    }
    checkParamsType({ name: 'lng', value: obj.lng, type: GLOBAL_STR.NUMBER });

    if (!obj.lat) {
        throw new Error('The arguments "lat" is required!')
    }
    checkParamsType({ name: 'lat', value: obj.lat, type: GLOBAL_STR.NUMBER });

    obj.params = {
        lng: obj.lng,
        lat: obj.lat
    };

    return exec(API_NAMES$1.get, obj)
};

var API_NAMES$2 = {
    shareContent: 'SharePlugin.shareContent',
    setPlatformConfig: 'SharePlugin.setPlatformConfig',
    thirdpartyLogin: 'SharePlugin.thirdpartyLogin'
};

/**
 * 分享平台类型
 * @type {object}
 */
var sharePlatform = {
    QQ: 1,
    QZone: 2,
    SinaWeibo: 3,
    WeChatSession: 4,
    WeChatTimeline: 5,
    WeChatFav: 6
};

/**
 * 第三方登录平台类型
 * @type {object}
 */
var loginPlatform = {
    QQ: 0,
    WeChat: 1,
    SinaWeibo: 2
};

/**
 * 内容分享类型
 * @type {object}
 */
var shareType = {
    Text: 0,
    Image: 1,
    WebPage: 2,
    Music: 3,
    Video: 4,
    Apps: 5,
    File: 6
};

/**
 * 分享内容
 * @param {Object} opt
 * {
 * 	platform: croods.sharePlatform.SinaWeibo,
	shareParams: {
		type: croods.shareType.Text,
		text: '测试一下分享',
		url: 'http://www.baidu.com',
		title: '测试',
		titleUrl: '',
		site: ''
		siteUrl:''
		imageUrl: ''
	},
	success: function(res){
	}
}
 */
var shareContent = function (opt) {
    var obj = checkParam(opt);

    if (!obj.platform) {
        throw new Error('The arguments "platform" is required !')
    }
    checkParamsType({ name: 'platform', value: obj.platform, type: GLOBAL_STR.NUMBER });

    if (!obj.shareParams) {
        throw new Error('The arguments "shareParams" is required!')
    }

    if (isNotObject(obj.shareParams)) {
        throw new Error('The arguments "shareParams" type must be object!')
    }

    if (typeof obj.shareParams.type !== GLOBAL_STR.NUMBER) {
        throw new Error('The arguments "shareParams.type" is required and type must be number!')
    }

    if (!obj.shareParams.text) {
        throw new Error('The arguments "shareParams.text" is required!')
    }
    checkParamsType({ name: 'shareParams.text', value: obj.shareParams.text, type: GLOBAL_STR.STRING });

    obj.params = {
        platform: obj.platform,
        shareParams: obj.shareParams
    };
    return exec(API_NAMES$2.shareContent, obj)
};

/**
 * 第三方登录
 * @param {Object} opt
 * {
 * 	platform: croods.loginPlatform.SinaWeibo,
	success: function(res){
        platformType: '2' // 平台类型
        uid: '' // 用户在平台的uid
        nickname: '' // 用户昵称
        imageUrl: '' // 头像url地址
        gender: 0 // 性别
        homePage: '' // 用户主页
        about: '' // 用户简介
        birthday: '' // 生日，毫秒数
        followerCount: '' // 粉丝数
        friendCount: '' // 好友数
        shareCount: '' //分享数
	}
}
 */
var thirdpartyLogin = function (opt) {
    var obj = checkParam(opt);

    if (typeof obj.platform !== GLOBAL_STR.NUMBER) {
        throw new Error('The arguments "platform" is required and type must be number!')
    }

    obj.params = {
        platform: obj.platform
    };

    return exec(API_NAMES$2.thirdpartyLogin, obj)
};

/**
 * 设置平台配置
 * @param {Object} opt
 */
var setPlatformConfig = function (opt) {
    var obj = checkParam(opt);

    if (typeof obj.platform !== GLOBAL_STR.NUMBER) {
        throw new Error('The arguments "platform" is required and type must be number!')
    }

    if (!obj.config) {
        throw new Error('The arguments "config" is required!')
    }

    if (isNotObject(obj.config)) {
        throw new Error('The arguments "config" type must be object!')
    }

    obj.params = {
        platform: obj.platform,
        config: obj.config
    };
    return exec(API_NAMES$2.setPlatformConfig, obj)
};

var API_NAMES$3 = {
    start: 'DownloadPlugin.start',
    listener: 'DownloadPlugin.listener',
    download: 'DownloadPlugin.download',
    cancel: 'DownloadPlugin.cancel',
    open: 'FilePlugin.open',
    choose: 'FilePlugin.choose',
    chooseSystem: 'FilePlugin.chooseSystem',
    upload: 'UploadPlugin.upload',
    unzip: 'FilePlugin.unzip'
};

/**
 * 开始下载文件 *注 1.3.2后弃用
 * @param {Object} opt
 * opt {
 * 	url: "xx",
 *  success: function(e){
 *  }
 * }
 */
var startDownload = function (opt) {
    var obj = checkParam(opt);
    obj.params = {};

    if (!obj.url) {
        throw new Error('The arguments "url" is required and cannot be null!')
    }
    checkParamsType({ name: 'url', value: obj.url, type: GLOBAL_STR.STRING });

    obj.params.url = obj.url;
    return exec(API_NAMES$3.start, obj)
};

/**
 * 下载文件监听  *注 1.3.2后弃用
 * @param {Object} opt
 * opt {
 * 	success: function(msg){
 *    msg.process: "xx",//进度
 *    msg.speed: "xx", //速度
 *    msg.size: "", //文件大小
 *    msg.hasDownSize: "", //已经下载大小
 *    msg.path: "xx"//文件位置
 *  },
 *  fail: function(msg){
 *  }
 * }
 */
var downloadListener = function (opt) {
    return exec(API_NAMES$3.listener, checkParam(opt))
};
/**
 * 下载文件
 * @param {Object} opt
 * opt {
 * 	url: "xx",
 *  success: function(e){
 *  }
 * }
 */
var download = function (opt) {
    var obj = checkParam(opt);
    obj.params = {};

    if (!obj.url) {
        throw new Error('The arguments "url" is required and cannot be null!')
    }
    checkParamsType({ name: 'url', value: obj.url, type: GLOBAL_STR.STRING });

    obj.params.url = obj.url;
    return exec(API_NAMES$3.download, obj)
};

/**
 * 取消下载
 * @param {Object} opt
 */
var cancelDownload = function (opt) {
    return exec(API_NAMES$3.cancel, checkParam(opt))
};

/**
 * 打开文件
 * @param {Object} opt
 * opt {
 * 	 filePath：文件路径
 * }
 */
var openFile = function (opt) {
    var obj = checkParam(opt);
    obj.params = {};

    if (!obj.filePath) {
        throw new Error('The arguments "filePath" is required and cannot be null!')
    }
    checkParamsType({ name: 'filePath', value: obj.filePath, type: GLOBAL_STR.STRING });

    obj.params.filePath = obj.filePath;
    return exec(API_NAMES$3.open, obj)
};

/**
 * 选择文件
 * @param {Object} opt
 * opt {
 *   path:'/sdcard',  指定查找目录
 *   reg: '/.jpg$/', 指定查找规则，正则表示
 *   recursive: true/false 是否递归查找
 * 	 success: function(res){
 * 		res: 文件对象信息，包含文件大小、路径、类型等
 *   }
 * }
 */
var chooseFile = function (opt) {
    var obj = checkParam(opt);

    obj.params = {};
    checkParamsType({ name: 'path', value: obj.path, type: GLOBAL_STR.STRING });
    checkParamsType({ name: 'reg', value: obj.reg, type: GLOBAL_STR.STRING });
    checkParamsType({ name: 'recursive', value: obj.recursive, type: GLOBAL_STR.BOOLEAN });

    obj.params.recursive = typeof obj.recursive === GLOBAL_STR.BOOLEAN ? obj.recursive : false;
    obj.params.path = obj.path ? obj.path : undefined;
    obj.params.reg = obj.reg ? obj.reg : undefined;
    return exec(API_NAMES$3.choose, obj)
};

var chooseSystem = function (opt) {
    return exec(API_NAMES$3.chooseSystem, checkParam(opt))
};

/**
 * 文件上传
 */
var upload = function (opt) {
    var obj = checkParam(opt);
    obj.params = {};

    if (!obj.method) {
        throw new Error('The arguments "method" is required and cannot be null!')
    }

    checkParamsType({ name: 'method', value: obj.method, type: GLOBAL_STR.STRING });
    checkParamsType({ name: 'fileSizeLimit', value: obj.fileSizeLimit, type: GLOBAL_STR.NUMBER });
    obj.params.method = obj.method;

    if (obj.fileSizeLimit) {
        obj.params.fileSizeLimit = obj.fileSizeLimit;
    }

    if (obj.files && isNotObject(obj.files)) {
        throw new Error('The arguments "files" type must be object!')
    }

    if (isEmptyObject(obj.files)) {
        throw new Error('The arguments "files" is required and cannot be null!!')
    }
    obj.params.files = obj.files;

    if (obj.formData && isNotObject(obj.formData)) {
        throw new Error('The arguments "formData" type must be object!')
    }

    if (!isEmptyObject(obj.formData)) {
        obj.params.formData = obj.formData;
    }

    return exec(API_NAMES$3.upload, obj)
};

/**
 * 解压文件
 * @param {Object} opt
 * opt {
 * 	 filePath：文件路径
 * }
 */
var unzip = function (opt) {
    var obj = checkParam(opt);
    obj.params = {};

    if (!obj.filePath) {
        throw new Error('The arguments "filePath" is required and cannot be null!')
    }
    checkParamsType({ name: 'filePath', value: obj.filePath, type: GLOBAL_STR.STRING });

    obj.params.filePath = obj.filePath;
    return exec(API_NAMES$3.unzip, obj)
};

var API_NAMES$4 = {
    add: 'StoragePlugin.add',
    get: 'StoragePlugin.get',
    getAll: 'StoragePlugin.getAll',
    remove: 'StoragePlugin.remove',
    removeAll: 'StoragePlugin.removeAll'
};

var storage = {
	/**
	 * add data
	 * @param {Object} opt
	 */
    add: function (opt) {
        var obj = checkParam(opt);

        if (!obj.params || isEmptyObject(obj.params)) {
            throw new Error('The arguments "params" is required!')
        }

        if (isNotObject(obj.params)) {
            throw new Error('The arguments "params" type must be object!')
        }

        return exec(API_NAMES$4.add, obj)
    },

	/**
	 * get data
	 * @param {Object} opt
	 */
    get: function (opt) {
        var obj = checkParam(opt);
        obj.params = {};

        if (!obj.key) {
            throw new Error('The arguments "key" is required!')
        }
        checkParamsType({ name: 'key', value: obj.key, type: GLOBAL_STR.STRING });

        obj.params.key = obj.key;
        return exec(API_NAMES$4.get, obj)
    },

	/**
	 * get all
	 * @param {Object} opt
	 */
    getAll: function (opt) {
        return exec(API_NAMES$4.getAll, checkParam(opt))
    },

	/**
	 * remove data
	 * @param {Object} opt
	 */
    remove: function (opt) {
        var obj = checkParam(opt);
        obj.params = {};

        if (!obj.key) {
            throw new Error('The arguments "key" is required!')
        }
        checkParamsType({ name: 'key', value: obj.key, type: GLOBAL_STR.STRING });

        obj.params.key = obj.key;
        return exec(API_NAMES$4.remove, obj)
    },

	/**
	 * remove all
	 * @param {Object} opt
	 */
    removeAll: function (opt) {
        return exec(API_NAMES$4.removeAll, checkParam(opt))
    }
};

var LD_ACTIONS = ['blink', 'mouth', 'yaw', 'nod'];
var IAT_DOMAINS = ['iat', 'search', 'video', 'poi', 'music', 'asr'];
var IAT_LANGUAGES = ['zh_cn', 'en_us'];
var IAT_ACCENTS = ['mandarin', 'cantonese', 'henanese'];

var API_NAMES$5 = {
    take: 'ImagePlugin.takePhoto',
    choose: 'ImagePlugin.choose',
    previewImage: 'ImagePlugin.preview',
    start: 'AudioPlugin.startRecord',
    listener: 'AudioPlugin.recordListener',
    stop: 'AudioPlugin.stopRecord',
    play: 'AudioPlugin.startPlay',
    playListener: 'AudioPlugin.playListener',
    stopVoice: 'AudioPlugin.stopPlay',
    livenessDetect: 'LivenessPlugin.detect',
    scanning: 'QRCodePlugin.scanCode',
    generate: 'QRCodePlugin.generate',
    startIat: 'SpeechPlugin.startIat',
    stopIat: 'SpeechPlugin.stopIat',
    playVideo: 'VideoPlugin.play'
};

/**
 * 调用摄像头
 * @param {Object} opt
 * opt {
 * 	 success: function(res){
 * 	   res.filePath: 照片路径
 *   }
 * }
 */
var takePhoto = function (opt) {
    return exec(API_NAMES$5.take, checkParam(opt))
};

/**
 * 选择图片
 * @param {Object} opt
 * opt {
 * 	 count: 选择图片数量，默认为1
 *   success: function(res){
 *     res: [{...}] //图片数组，包含图片url等信息
 *   }
 * }
 */
var chooseImage = function (opt) {
    var obj = checkParam(opt);
    checkParamsType({ name: 'count', value: obj.count, type: GLOBAL_STR.NUMBER });

    obj.params = {
        count: obj.count || 1
    };
    return exec(API_NAMES$5.choose, obj)
};

/**
 * 查看图片
 * @param {Object} opt
 * opt {
 * 	 paths:[] 页面中所有图片路径，array，首次调用必填
 * 	 index：当前点击图片的索引，number,必填
 *   success: function(res){
 *     res: [{...}] //
 *   }
 * }
 */
var previewImage = function (opt) {
    var obj = checkParam(opt);
    if (obj.paths && !(obj.paths instanceof Array)) {
        throw new Error('The arguments "paths" type must be array!')
    }
    if (obj.index === '' || obj.index === undefined || obj.index === null) {
        throw new Error('The arguments "index" is required!')
    }
    checkParamsType({ name: 'index', value: obj.index, type: GLOBAL_STR.NUMBER });

    obj.params = {
        paths: obj.paths,
        index: obj.index
    };
    return exec(API_NAMES$5.previewImage, obj)
};

/**
 * 活体检测
 * @param {Object} opt
 * success: function(res){
 * 	res.photo : xx返回图片地址
 * }
 */
var livenessDetect = function (opt) {
    var obj = checkParam(opt);

    if (obj.actions) {
        if (obj.actions instanceof Array) {
            obj.actions = obj.actions.unique();

            if (!inArray(LD_ACTIONS[0], obj.actions)) {
                throw new Error(("The arguments 'actions' value must has " + (obj.actions[0]) + " !"))
            }

            for (var i = 0, len = obj.actions.length; i < len; i++) {
                if (!inArray(obj.actions[i], LD_ACTIONS)) {
                    throw new Error(("The arguments 'actions' value " + (obj.actions[i]) + " invalid!"))
                }
            }
        }
        else {
            throw new Error('The arguments "actions" type must be array!')
        }
    }

    checkParamsType({ name: 'soundNotice', value: obj.soundNotice, type: GLOBAL_STR.BOOLEAN });

    obj.params = {
        actions: obj.actions || LD_ACTIONS,
        soundNotice: typeof obj.soundNotice === GLOBAL_STR.BOOLEAN ? obj.soundNotice : true
    };
    return exec(API_NAMES$5.livenessDetect, obj)
};

/**
 * 二维码扫描
 * @param {Object} opt
 * success: function(res){
 * 	res : xx返回扫描内容
 * }
 */
var scanQRCode = function (opt) {
    return exec(API_NAMES$5.scanning, checkParam(opt))
};

/**
 * 二维码生成
 * @param {Object} opt
 * opt{
 *	content: 需要生成二维码的内容
 *  size:二维码的大小，默认为200
 * 	success: function(res){
 * 		res.: xx
 * 	}
 * }
 */
var createQRCode = function (opt) {
    var obj = checkParam(opt);
    checkParamsType({ name: 'content', value: obj.content, type: GLOBAL_STR.STRING });
    checkParamsType({ name: 'size', value: obj.size, type: GLOBAL_STR.NUMBER });
    obj.params = {
        content: obj.content || '',
        size: obj.size || 200
    };
    return exec(API_NAMES$5.generate, obj)
};

/**
 * 开始录音
 * @param {Object} opt
 */
var startRecord = function (opt) {
    return exec(API_NAMES$5.start, checkParam(opt))
};

/**
 * 录音监听
 * @param {Object} opt
 * opt {
 * 	 success: function(res){
 * 	   res.volume: 音量大小
 * 	   res.voiceLen: 录音长度s
 *   },
 *   error: function(res){
 *
 *   }
 * }
 */
var recordListener = function (opt) {
    return exec(API_NAMES$5.listener, checkParam(opt))
};

/**
 * 停止录音
 * @param {Object} opt
 * 	 success: function(res){
 * 	   res.filePath: 录音位置
 *   },
 *   error: function(res){
 *
 *   }
 * }
 *
 */
var stopRecord = function (opt) {
    return exec(API_NAMES$5.stop, checkParam(opt))
};

/**
 * 播放录音
 * @param {Object} opt
 * opt {
 *   filePath:录音文件路径
 * }
 */
var playVoice = function (opt) {
    var obj = checkParam(opt);
    obj.params = {};

    if (!obj.filePath) {
        throw new Error('The arguments "filePath" is required!')
    }
    checkParamsType({ name: 'filePath', value: obj.filePath, type: GLOBAL_STR.STRING });

    obj.params.filePath = obj.filePath;
    return exec(API_NAMES$5.play, obj)
};

/**
 * 播放监听
 * @param {Object} opt
 * success: function(res){
 * 	res.currentPosition //当前播放时间点，单位为毫秒
 * }
 */
var playListener = function (opt) {
    return exec(API_NAMES$5.playListener, checkParam(opt))
};

/**
 * 停止播放
 */
var stopVoice = function (opt) {
    return exec(API_NAMES$5.stopVoice, checkParam(opt))
};

/**
 * 播放视频
 * @param {Object} opt
 * opt {
 *   url:'xxx' 视频文件路径 string 必填
 *   isFullScreen:false 是否全屏 boolean 默认为false 可选
 *   title:''视频名称 string 可选
 * }
 */
var playVideo = function (opt) {
    var obj = checkParam(opt);
    obj.params = {};

    if (!obj.url) {
        throw new Error('The arguments "url" is required!')
    }
    checkParamsType({ name: 'url', value: obj.url, type: GLOBAL_STR.STRING });
    checkParamsType({ name: 'isFullScreen', value: obj.isFullScreen, type: GLOBAL_STR.BOOLEAN });
    checkParamsType({ name: 'title', value: obj.title, type: GLOBAL_STR.STRING });

    obj.params.url = obj.url;
    obj.params.isFullScreen = obj.isFullScreen || false;

    if (obj.title) {
        obj.params.title = obj.title;
    }

    return exec(API_NAMES$5.playVideo, obj)
};
/**
 * 语音合成
 * @params opt
 * opt {
 *   //应用领域 'iat'(普通文本听写)、'search'(热词搜索)、'video'(视频搜索)、'poi'、'music'、'asr'(关键词识别) string 选填
 *   domain: 'iat',
 *   //返回结果的语言 'zh_cn'(中文)、'en_us'(英文) string 选填
 *   language: 'zh_cn',
 *   //语言区域 'mandarin'(中文)、'cantonese'(粤语)、'henanese'(河南话) string 选填 language为英文时，忽略此参数
 *   accent: 'mandarin',
 *   //前端点超时时间（用户多长时间不说话） 0-10000 ms number 选填
 * 	 vadBos: 5000,
 *   //后断点超时时间（用户停止说话多长时间） 1000-10000 ms number 选填
 *   vadEos: 3000,
 *   //是否保存录音 true or false, boolean 选填
 *   isSave: true,
 *   //是否需要标点符号 true or false, boolean 选填
 *   isDot: true,
 * 	 //回调结果
 *   success: function(res) {
 *     res.audioPath: 录音路径,
 *     res.result: 转化文字,
 *     res.volum: 音量大小
 *   }
 * }
 */
var iflyIat = function (opt) {
    var obj = checkParam(opt);

    checkParamsType({ name: 'domain', value: obj.domain, type: GLOBAL_STR.STRING });

    if (obj.domain && !inArray(obj.domain, IAT_DOMAINS)) {
        throw new Error('The arguments "domain" value invalid!')
    }

    checkParamsType({ name: 'language', value: obj.language, type: GLOBAL_STR.STRING });

    if (obj.language && !inArray(obj.language, IAT_LANGUAGES)) {
        throw new Error('The arguments "language" value invalid!')
    }

    checkParamsType({ name: 'accent', value: obj.accent, type: GLOBAL_STR.STRING });

    if (obj.accent && !inArray(obj.accent, IAT_ACCENTS)) {
        throw new Error('The arguments "accent" value invalid!')
    }

    checkParamsType({ name: 'vadBos', value: obj.vadBos, type: GLOBAL_STR.NUMBER });

    if (obj.vadBos && (obj.vadBos < 1000 || obj.vadBos > 10000)) {
        throw new Error('The arguments "vadBos" value between 1000 and 10000!')
    }

    checkParamsType({ name: 'vadEos', value: obj.vadEos, type: GLOBAL_STR.NUMBER });

    if (obj.vadEos && (obj.vadEos < 0 || obj.vadEos > 10000)) {
        throw new Error('The arguments "vadEos" value between 0 and 10000!')
    }

    checkParamsType({ name: 'isSave', value: obj.isSave, type: GLOBAL_STR.BOOLEAN });
    checkParamsType({ name: 'hasDot', value: obj.hasDot, type: GLOBAL_STR.BOOLEAN });

    obj.params = {
        domain: obj.domain ? obj.domain : undefined,
        language: obj.language ? obj.language : undefined,
        accent: obj.accent ? obj.accent : undefined,
        vadBos: obj.vadBos && String(obj.vadBos),
        vadEos: obj.vadEos && String(obj.vadEos),
        isSave: obj.isSave,
        hasDot: obj.hasDot
    };
    return exec(API_NAMES$5.startIat, obj)
};

// core api



var Cross = Object.freeze({
	nativeFetchQueue: nativeFetchQueue,
	callbackDestroy: callbackDestroy,
	openLocation: openLocation,
	closeLocation: closeLocation,
	getLocation: getLocation,
	sharePlatform: sharePlatform,
	shareType: shareType,
	shareContent: shareContent,
	setPlatformConfig: setPlatformConfig,
	loginPlatform: loginPlatform,
	thirdpartyLogin: thirdpartyLogin,
	upload: upload,
	startDownload: startDownload,
	downloadListener: downloadListener,
	cancelDownload: cancelDownload,
	download: download,
	openFile: openFile,
	chooseFile: chooseFile,
	unzip: unzip,
	chooseSystem: chooseSystem,
	storage: storage,
	config: config,
	ajax: ajax,
	request: request,
	customPlugin: customPlugin,
	invoke: invoke,
	copy: copy,
	loadUrl: loadUrl,
	pageClose: pageClose,
	closePage: closePage,
	goBack: goBack,
	exit: exit,
	checkJsApi: checkJsApi,
	getNetworkType: getNetworkType,
	getAppInfo: getAppInfo,
	getDeviceInfo: getDeviceInfo,
	bindButton: bindButton,
	unbindButton: unbindButton,
	getContact: getContact,
	takePhoto: takePhoto,
	chooseImage: chooseImage,
	previewImage: previewImage,
	livenessDetect: livenessDetect,
	scanQRCode: scanQRCode,
	createQRCode: createQRCode,
	startRecord: startRecord,
	recordListener: recordListener,
	stopRecord: stopRecord,
	playVoice: playVoice,
	playListener: playListener,
	stopVoice: stopVoice,
	playVideo: playVideo,
	iflyIat: iflyIat
});

// import { isWXAgent } from './cross/utils'
// import * as WX from './wx/index'

var FrameWork = Cross;

return FrameWork;

}
)
  )
);
