!define(['conf', 'api', 'fun'], function ($conf, api, fun) {
    console.log($conf);
    document.title = 'Hi';
    // document.getElementById('app').innerHTML = 'Start Success! Welcome To hi.html!';

    return function ($html) {
        console.log($html);
        // layer.msg('layer start success!');
        // fun.swal('Run Success!');

        var origin = location.origin;
        var urlObj = {
            test: '',
            SingTel: '/recharge/SingTel',
            Starhub: '/recharge/Starhub',
            M1: '/recharge/M1',
            recharge: '/recharge/recharge',
            order: '/order/order',
            orderBack: '/order/orderBack',
            policy: '/common/policy'
        };

        $('[data-type="url"]').each(function () {
            var $this = $(this);
            var data = $this.data(), url = '';

            url = origin + location.pathname + '#' + urlObj[data.key];
            // url = '../../../../index.html#' + urlObj[data.key];
            if (data.key == 'recharge') {
                url += '?type=' + data.url;
            }

            $this.attr('href', url);
            $this.attr('target', '_blank');
        });

        // 获取微信签名
        api({url: location.href.split('#')[0]}, {type:'GET', url:'api/sign'}).then(function (result) {
            wx.config({
                debug: true,
                appId: result.appId,
                timestamp: result.timestamp,
                nonceStr: result.nonceStr,
                signature: result.sign,
                jsApiList: ["onMenuShareAppMessage", "onMenuShareTimeline", "onMenuShareQQ", "onMenuShareWeibo", "onMenuShareQZone", "hideMenuItems"]
            });
            wx.ready(function () {
                var option = {
                    title: 'xxx',
                    desc: 'xxs',
                    link: 'index.html',
                    imgUrl: 'images/logo.png',
                    type: 'link'
                };

                wx.onMenuShareAppMessage(option);
                wx.onMenuShareTimeline(option);
                wx.onMenuShareQQ(option);
                wx.onMenuShareWeibo(option);
                wx.onMenuShareQZone(option);
                wx.hideMenuItems({
                    menuList: ["menuItem:openWithQQBrowser", "menuItem:openWithSafari", "menuItem:copyUrl"]
                });
            });
            wx.error(function(res){
                // config信息验证失败会执行error函数，如签名过期导致验证失败，具体错误信息可以打开config的debug模式查看，也可以在返回的res参数中查看，对于SPA可以在这里更新签名。
                console.log(res);
            });
        }, function () {
            
        });
    };
});
