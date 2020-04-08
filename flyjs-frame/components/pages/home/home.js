var fly = require('fly');

module.exports = fly.Component.extend({

	template: __inline('./home.html'),

	// 方法  
	methods: {
		// 点击事件 
		pageClick: function(e) {
			window.open('http://www.flyui.cn/');
		}
	}



});