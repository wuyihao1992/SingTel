!define(['api', 'fun', 'conf'], function (api, fun, $conf) {
    document.title = 'SG易乐充';

    return function ($html) {
        "use strict";
        
        $(function () {
            var conPath = $conf.dev ? '/test' : '';

            $('#QRCode', $html).prop('src', conPath + '/build/img/QRCode.jpg');

            var tips = '', swalTips = '正在获取积分规则，请稍后！';

            // 获取积分的方式
            api({}, {type: 'GET', url: '/api/text?text_name=credit_rule'}).then(function (result) {
                if (!!result && result.status == 0) {
                    tips= fun.formTips(result.data);
                } else {
                    swalTips = '暂无积分规则';
                }
            });

            api({}, {type: 'GET', url: 'api/user_info'}).then(function (result) {
                if (!!result && result.status == 0) {
                    var data = result.data;
                    // 微信配置
                    wx.config({
                        debug: false,
                        appId: data.app_id || '',
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
                            imgUrl: conPath + '/build/img/card.jpg',
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

            $('#showDetail', $html).on('click', function (e) {
                if (!tips) {
                    fun.swal(swalTips, 'info');
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
