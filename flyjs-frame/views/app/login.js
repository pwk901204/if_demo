require.async([
    'fly',
    'alert'
], function(fly, alert) {
    var hash = window.location.hash;

    var validateCodeFlag = false;

    var vm = fly({
        valideVisible: false,
        validatecode: '',
        form: {
            userAccount: '',
            password: ''
        },
        actionNextGroup: function(e) {

        },
        // 登录事件
        loginHandle: function() {
            if (vm.form.userAccount && vm.form.password) {
                window.location.href = '/index#/home';
            } else {
                fly.alert({
                    content: '用户名和密码不能为空！',
                    type: 'danger'
                });
            }
        }
    });

    fly.bind(document.body, vm);
});