var utils = {};

var fly = require('fly');
var mask = require('common/mask');

//个数前面加0
utils.decadeChange = function(num) {
	num = num > 9 ? num : ('0' + num);
	return num;
};

//获取请求参数
utils.getQueryString = function(name) {
	var getSearparm = {};
	if (typeof name == 'string') {
		getSearparm[name] = null;
	} else {
		for (var i = 0; i < name.length; i++) {
			getSearparm[name[i]] = null
		}
	}
	var b = [];
	var temp = location.hash.split('?')[1];
	if (!temp) {
		return getSearparm;
	}
	b = temp.split('&');
	for (var i = 0; i < b.length; i++) {
		for (var key in getSearparm) {
			if (key == b[i].split('=')[0]) {
				getSearparm[key] = b[i].split('=')[1];
			}
		}
	}
	return getSearparm;
};

// 请求 
utils.ajax = function(options) {
	var obj = {};
	obj.done = function(callback) {
		if (callback) this._done = callback;
		return this;
	};

	obj.fail = function(callback) {
		if (callback) this._fail = callback;
		return this;
	};

	obj.empty = function(callback) {
		if (callback) this._empty = callback;
		return this;
	};
	fly.$.ajax(options).done(function(data) {

			data = fly.evalJSON(data || '{}');
			if (data.flag == true || data.data) {
				obj._done && obj._done(data);
			} else {
				obj._fail && obj._fail(data);
				fly.alert({
					content: data.msg || '请求失败',
					type: 'danger'
				});
			};
			mask.removeAll();
		})
		.fail(function(data) {
			fly.alert({
				content: data.msg || '请求失败',
				type: 'danger'
			});
			obj._fail && obj._fail(data);
			mask.removeAll();
		});
	return obj;
}

// 添加遮罩 
utils.mask = function(option) {
	mask.init(option);
};

// 删除遮罩 
utils.removeMask = function() {
	mask.remove();
};

// 删除所有的遮罩 
utils.removeAllMask = function() {
	mask.removeAll();
}

module.exports = window.utils = utils;