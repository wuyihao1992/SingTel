!define(['api', 'fun'], function (api, fun) {
    document.title = 'SG易乐充';

    return function ($html) {
        "use strict";
        
        $(function () {
            /*api({text_name: 'refund_policy'}, {url: 'api/text', type: 'GET'}).then(function (result) {
                if (result.status == 0) {
                    var data = fun.formTips(result.data);
                    $('#policy', $html).html(data);
                }
            }, function (err) {

            });*/

            var tips = '';

            // 获取积分的方式
            api({}, {type: 'GET', url: '/api/text?text_name=credit_rule'}).then(function (result) {
                if (!!result && result.status == 0) {
                    tips= fun.formTips(result.data);
                }
            });

            $('#showDetail', $html).on('click', function (e) {
                if (!tips) {
                    fun.swal('正在获取积分规则，请稍后！', 'info');
                    return false;
                }

                layer.open({
                    title: false,
                    btn: false,
                    area: ['88%', '88%'],
                    anim: 4,
                    scrollbar: false,
                    content: tips
                });
            });

        });
    }
});
