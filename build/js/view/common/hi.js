!define(['conf', 'api', 'fun'], function ($conf, api, fun) {
    console.log($conf);
    document.title = 'Hi';

    return function ($html) {
        var origin = location.origin;
        var urlObj = {
            test: '',
            SingTel: '/recharge/SingTel',
            StarHub: '/recharge/StarHub',
            M1: '/recharge/M1',
            recharge: '/recharge/recharge',
            order: '/order/order',
            orderBack: '/order/orderBack',
            policy: '/common/policy',
            update: '/common/update'
        };

        $('[data-type="url"]', $html).each(function () {
            var $this = $(this);
            var data = $this.data(), url;

            url = origin + location.pathname + '#' + urlObj[data.key];
            // url = '../../../../index.html#' + urlObj[data.key];
            if (data.key == 'recharge') {
                url += '?type=' + data.url;
            }

            $this.attr('href', url);
            // $this.attr('target', '_self');
        });

        // 获取微信签名
        /*api({url: location.href.split('#')[0]}, {type:'GET', url:'api/sign'}).then(function (result) {
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
            
        });*/

        $('#payTest', $html).click(function () {
            api({item_id: '1234567890n', phone: '13800138000'}, {url: 'api/pay/create', contentType: 'application/x-www-form-urlencoded'}).then(function (result) {
                if (result && result.appId) {
                    WeixinJSBridge.invoke("getBrandWCPayRequest", {
                        "appId": result.appId,          //公众号名称，由商户传入
                        "timeStamp": result.timeStamp,  //时间戳，自1970年以来的秒数
                        "nonceStr": result.nonceStr,    //随机串
                        "package": result.package,
                        "signType": 'MD5',              //微信签名方式
                        "paySign": result.sign          //微信签名
                    }, function (res) {
                        WeixinJSBridge.log(res.err_msg);
                        if (res.err_msg == "get_brand_wcpay_request:ok") {
                            fun.swal("恭喜您，支付成功", 'success', function () {
                                location.href = "#/order/order";
                                location.reload();
                            });
                        }else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                            module.exports.swal("支付已取消", 'info');
                        }else if (res.err_msg == "get_brand_wcpay_request:fail") {
                            module.exports.swal("支付失败", 'warning');
                        }
                    });
                }else {
                    fun.swal('签名失败，请稍后重试', 'error');
                }
            }, function () {
                module.exports.swal('请求失败，请稍后重试', 'error');
            });
        });

    };
});
