
var fly = require('fly');

module.exports = fly.Component.extend({
	// 组件名称 
	name: '404',

	// 模板 
	template: __inline('./404.html'),

	refreshHandle: function() {
        window.location.reload();
    },
    backHandle: function() {
        window.history.go(-1);
    }
});