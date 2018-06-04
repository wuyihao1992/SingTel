!define(['api', 'fun', 'conf', 'qrcode'], function (api, fun, $conf, qrcode) {
    document.title = $conf.title;

    return function ($html) {
        "use strict";

        $(function () {
            var conPath = $conf.dev ? '/test' : '';
            var tips = '', swalTips = '正在获取积分规则，请稍后！';

            var Share = function () {
                var _this = this;

                this.userTicket = '';                                       // 当前用户的ticket
                this.sharedTicket = fun.getReportQueryString('ticket');     // 上一个分享用户的ticket

                // 无用
                this.testQRCode = function (type) {
                    var $shareQRCodes = $('#shareQRCodes', $html);

                    if (!type) {
                        $('#qrDiv', $shareQRCodes).qrcode({
                            render: 'canvas',
                            width: $shareQRCodes.height(),
                            height: $shareQRCodes.height(),
                            text: 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='
                        });

                        var mycanvas1 = document.getElementsByTagName('canvas')[0];
                        var img = convertCanvasToImage(mycanvas1);  // 将转换后的img标签插入到html中
                        $('#qrcodeImg', $shareQRCodes).append(img);                   // imagQrDiv表示你要插入的容器id
                    } else {
                        $('#qrcodeImg', $shareQRCodes).append('<img class="qrCodeImg" id="QRCode" src="'+ conPath +'/build/img/QRCode.jpg" />');
                    }
                };

                // 获取qrcode（无用）
                this.getQRCode = function () {
                    var $shareQRCodes = $('#shareQRCodes', $html);

                    api({}, {type: 'GET', url: 'api/qrcode'}).then(function (result) {
                        if (!!result && result.status == 0) {
                            _this.userTicket = result.data.ticket;

                            // 如果是被分享的连接，则使用分享人的二维码
                            $('#qrDiv', $shareQRCodes).qrcode({
                                render: 'canvas',
                                width: $shareQRCodes.height(),
                                height: $shareQRCodes.height(),
                                text: 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+ (!!_this.sharedTicket ? _this.sharedTicket : _this.userTicket)
                            });

                            var mycanvas1 = document.getElementsByTagName('canvas')[0];
                            var img = convertCanvasToImage(mycanvas1);          // 将转换后的img标签插入到html中
                            $('#qrcodeImg', $shareQRCodes).append(img);         // imagQrDiv表示你要插入的容器id
                        } else {
                            $('#qrcodeImg', $shareQRCodes).append('<img class="qrCodeImg" id="QRCode" src="'+ conPath +'/build/img/QRCode.jpg" />');
                        }
                    });
                };

                /**
                 * 直接获取图片
                 */
                this.getQRCodeImg = function () {
                    var $shareQRCodes = $('#shareQRCodes', $html);

                    $.ajax({
                        type: 'GET',
                        url: 'api/qrcode',
                        success: function (result) {
                            $('[data-type="shareCover"]', $html).show();    // 会员则打开遮罩

                            if (!!result && result.status == 0) {
                                _this.userTicket = result.data.ticket;
                                // 如果是被分享的连接，则使用分享人的二维码
                                var src = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+ (!!_this.sharedTicket ? _this.sharedTicket : _this.userTicket);
                                $('#qrcodeImg', $shareQRCodes).append('<img class="qrCodeImg" id="QRCode" src="'+src+'" />');
                            } else {
                                $('#qrcodeImg', $shareQRCodes).append('<img class="qrCodeImg" id="QRCode" src="'+ conPath +'/build/img/QRCode.jpg" />');
                            }
                        },
                        error: function (err) {
                            if (!!_this.sharedTicket) {
                                // 如果是被分享的连接，则使用分享人的二维码
                                var src = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+ _this.sharedTicket;
                                $('#qrcodeImg', $shareQRCodes).append('<img class="qrCodeImg" id="QRCode" src="'+src+'" />');
                            } else {
                                $('#qrcodeImg', $shareQRCodes).append('<img class="qrCodeImg" id="QRCode" src="'+ conPath +'/build/img/QRCode.jpg" />');
                            }
                        }
                    });
                    /*api({}, {type: 'GET', url: 'api/qrcode'}).then(function (result) {
                        if (!!result && result.status == 0) {
                            _this.userTicket = result.data.ticket;
                            // 如果是被分享的连接，则使用分享人的二维码
                            var src = 'https://mp.weixin.qq.com/cgi-bin/showqrcode?ticket='+ (!!_this.sharedTicket ? _this.sharedTicket : _this.userTicket);
                            $('#qrcodeImg', $shareQRCodes).append('<img class="qrCodeImg" id="QRCode" src="'+src+'" />');
                        } else {
                            $('#qrcodeImg', $shareQRCodes).append('<img class="qrCodeImg" id="QRCode" src="'+ conPath +'/build/img/QRCode.jpg" />');
                        }
                    });*/
                };

                /**
                 * 获取积分的方式
                 */
                this.getCredit = function () {
                    api({}, {type: 'GET', url: 'api/text?text_name=credit_rule'}).then(function (result) {
                        if (!!result && result.status == 0) {
                            tips= fun.formTips(result.data);
                        } else {
                            swalTips = '暂无积分规则';
                        }
                    });
                };

                this.weChatShare = function () {
                    api({url: location.href}, {type: 'GET', url: 'api/js_data'}).then(function (result) {
                        if (!!result && result.status == 0) {
                            var data = result.data;
                            // 微信配置
                            wx.config({
                                debug: false,
                                appId: data.app_id,
                                timestamp: data.timestamp,
                                nonceStr: data.noncestr,
                                signature: data.sign,
                                jsApiList: ['onMenuShareAppMessage', 'onMenuShareTimeline', 'onMenuShareQQ', 'onMenuShareWeibo', 'onMenuShareQZone', 'hideMenuItems']
                            });

                            wx.error(function(res){
                                fun.swal('微信签名失败', 'error');
                            });

                            wx.ready(function () {
                                var getOption = function (type) {
                                    var option = {
                                        title: $conf.title,
                                        desc: 'SG易乐充,您的充值管家!',
                                        link: location.origin + location.pathname + 'share' + '?ticket=' + _this.userTicket,   // 分享时带上当前用户的ticket
                                        imgUrl: location.origin + conPath + '/build/img/card.jpg',
                                        type: 'link',
                                        success: function (res) {
                                            if (!!type) {
                                                api({}, {type: 'GET', url: 'api/share'}).then(function (response) {
                                                    if (!!response && response.status == 0) {
                                                        fun.swal('分享成功', 'success');
                                                    }
                                                });
                                            }
                                        }
                                    };

                                    return option;
                                };

                                wx.onMenuShareAppMessage(getOption());
                                wx.onMenuShareTimeline(getOption(true));
                                wx.onMenuShareQQ(getOption());
                                wx.onMenuShareWeibo(getOption());
                                wx.onMenuShareQZone(getOption());
                                wx.hideMenuItems({
                                    menuList: ['menuItem:openWithQQBrowser', 'menuItem:openWithSafari', 'menuItem:copyUrl']
                                });
                            });
                        }
                    });
                };

                this.init = function () {
                    // this.getQRCode();
                    // this.testQRCode();
                    this.getQRCodeImg();
                    this.getCredit();
                    this.weChatShare();
                };
            };
            var share = new Share();
            share.init();

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

            $(document).on('click', '[data-type="shareCover"]', function (e) {
                $(e.target).hide();
            });

            //从 canvas 提取图片 image
            function convertCanvasToImage(canvas) {
                var image = new Image();    // 新Image对象，可以理解为DOM
                // canvas.toDataURL 返回的是一串Base64编码的URL，当然,浏览器自己肯定支持
                image.src = canvas.toDataURL("image/png");  // 指定格式 PNG
                return image;
            }

        });
    }
});
