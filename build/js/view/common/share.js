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

            api({}, {type: 'GET', url: 'api/user_info'}).then(function (result) {
                if (!!result && result.status == 0) {
                    var data = result.data;
                    // 微信配置
                    wx.config({
                        debug: false,
                        appId: data.appId || '',
                        timestamp: data.timestamp,
                        nonceStr: data.nonceStr,
                        signature: data.sign,
                        jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems']
                    });
                    wx.ready(function () {
                        var option = {
                            title: 'SG易乐充',
                            desc: 'SG易乐充,您的充值管家!',
                            // link: 'mainManage.do',
                            imgUrl: '/build/img/card.jpg',
                            type: 'link'
                        };

                        wx.onMenuShareAppMessage(option);
                        wx.onMenuShareTimeline(option);
                        wx.onMenuShareQQ(option);
                        wx.onMenuShareWeibo(option);
                        wx.onMenuShareQZone(option);
                        wx.hideMenuItems({
                            menuList: ['menuItem:openWithQQBrowser', 'menuItem:openWithSafari', 'menuItem:copyUrl']
                        });
                    });
                }
            });

        });
    }
});
