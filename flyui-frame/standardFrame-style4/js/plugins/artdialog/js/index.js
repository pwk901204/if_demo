$(function(){
	//代码高亮
	SyntaxHighlighter.all();
});
/**
 * 正常加载
 * @return {[type]} [description]
 */
function normalPop(){
	addContent();
	createDialog('','syncPop');
}
/**
 * 含有异步加载
 * @return {[type]} [description]
 */
function syncPop(){
	createDialog('','syncPop');
	setTimeout(function(){
		addContent();
	},300);
}
/**
 * 给异步加上调用弹出层的callback
 * @return {[type]} [description]
 */
function fixSyncPop(){
	setTimeout(function(){
		addContent();
		createDialog('','syncPop');
	},300);
}
/**
 * 给异步加上调用弹出层的callback
 * @return {[type]} [description]
 */
function fixSyncPopByClick(){
	createDialog('','syncPop');
	setTimeout(function(){
		addContent(function(){
			$('body>div:last div').click();
		});
	},300);
}
/**
 * 给模板加载内容
 */
function addContent(callback){
	var html='';
	for (var i = 10 - 1; i >= 0; i--) {
		html+='<p>这里面的内容是动态生成的</p>'
	};
	$('#sync_content').html(html);
	callback&&callback();
}
/**
 * 创建dialog
 * @param  {[type]} title     [description]
 * @param  {[type]} id        [description]
 * @param  {[type]} okVal     [description]
 * @param  {[type]} okCb      [description]
 * @param  {[type]} cancelVal [description]
 * @param  {[type]} cancelCb  [description]
 * @return {[type]}           [description]
 */
function createDialog(title,id,okVal,okCb,cancelVal,cancelCb){
	var d = $.dialog({
		id:id,
		lock:true,
		drag:false,
	    title: title||'提示',
	    content: document.getElementById(id),
	    okValue: okVal||'确定',
	    top:'50%',
	    left:'50%',
	    ok: function () {
	        okCb&&okCb();
	    },
	    cancelValue: cancelVal||'取消',
	    cancel: function () {
			cancelCb&&cancelCb();
	    },
	    close:function(){
	    	$('#sync_content').html('');
	    }
	});
	d.show()
	return d;
}
var DIALOG='';
function createIframeDialog (argument) {
	DIALOG= $.dialog.open(argument.url,{
		id: argument.id,	
		title: argument.title||"提示",
		okValue: argument.okVal||'确定',
		cancelValue: argument.cancelVal||'取消',
		lock:true,
		resize:false,
		drag:false,
		width:argument.width||'',
		height:argument.height||'',
		padding:'10px 10px',
		fixed:true,
		opacity : 0.3,
		zIndex:100,
		close:function(){
			
		}
	});
	DIALOG.show();
}
var isFix=false;
function popIframe1(){
	createIframeDialog({url:'iframe_content.html',id:'iframePop'});
}
function popIframe2(){
	isFix=true;
	createIframeDialog({url:'iframe_content.html',id:'iframePop'});
}