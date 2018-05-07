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

            var tips = '';  // FIXME
            $('#showDetail', $html).on('click', function (e) {
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
