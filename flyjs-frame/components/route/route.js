// 初始化路由
var Router = require('router');

var router = new Router(document.getElementById('mainview'));
// 页面
router.route("/:page", function(page, queryStringParams) {
	if (!router.has('/' + page)) {
		page = '404';
	}
	router.load({
		page: '/' + page,
		queryParams: queryStringParams
	});
});

// 主页
router.route('/', function() {
	router.load('/index#/home');
});

// 路由-返回
router.bind('back', function(e) {
	router.back();
});

module.exports = router;