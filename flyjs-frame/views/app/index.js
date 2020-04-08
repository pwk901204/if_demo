require.config(__FRAMEWORK_CONFIG__);

require.async([
    'jquery',
    'fly',
    'route',
    'common/nicescroll'
], function($, fly, route, nicescroll) {

    var sidebarData = [{
        "cloumn": "系统首页",
        "event": "/index#/home",
        "icon": "home",
        "flag": true,
        "active": true
    }, {
        "cloumn": "列表页面",
        "event": "/index#/list",
        "icon": "department"
    }, {
        "cloumn": "404",
        "event": "/index#/404",
        "icon": "host"
    }];

    $("#mainview").niceScroll({
        cursorcolor: "#e5e5e5"
    });

    var vm = fly({
        navCollapse: false,
        userName: 'Hi,芜湖',


        // 退出
        logoutHandle: function() {
            window.location.href = window.location.protocol + '//' + window.location.host + '/login?_=' + (new Date()).getTime();
        },

        sidebarDs: fly.data(sidebarData),
        clickHandle: function(e) {
            e = e || window.event;
            fly.preventDefault(e);
            var _new = e.handleObj.data;

            if (_new.flag) {
                return false;
            }

            var _old = this.sidebarDs.get(true, 'flag');
            _old && _old.set('active', false);
            _old && _old.set('flag', false);


            _new.set('active', true);
            _new.set('flag', true);

            window.location.href = window.location.protocol + '//' + window.location.host + _new.event + '?_=' + (new Date()).getTime();
        }

    });

    // 注册
    route.register('/home');
    route.register('/list');
    route.register('/404');

    fly.bind(document.body, vm);

    route.start();

});