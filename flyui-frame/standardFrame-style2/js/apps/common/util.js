/**
 * @description: 常用工具方法
 * 组件库
 */
define([
	'jquery',
	'fly',
	'mask',
	'tip'
], function($, fly, mask, tip) {

	var utils = {};

	/**
	 * [添加遮罩]
	 * @param {[String]} content [显示的内容]
	 */
	utils.mask = function(content, $ele) {
		mask.init({
			content: content || '数据加载中...',
			ele: $ele
		});
	};
	utils.maskImg = function(content) {
		mask.initImg({
			content: content,
		});
	};
	/**
	 * [删除遮罩]
	 */
	utils.removeMask = function() {
		mask.remove();
	};

	/**
	 * [添加tip]
	 * @param  {[String]} text [提示的内容]
	 * @param  {[String]} cssType [提示的类型]info、success、warning、danger
	 */
	utils.tip = function(content, cssType) {
		fly.top.fly.tip({
			content: content,
			css: cssType
		});
	};

	/**
	 * [对字节的文件大小进行格式化]
	 * @param  {[Number]} text [文件的字节大小]
	 */
	utils.formatSize = function(bytes) {
		if (bytes === 0) return '0 B';
		var k = 1024;
		sizes = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
		i = Math.floor(Math.log(bytes) / Math.log(k));
		return (bytes / Math.pow(k, i)).toFixed(2) + ' ' + sizes[i];
	};
	$(window).unload(function(){
        utils.removeMask();
    })

	window.util = utils;
	return utils;
});