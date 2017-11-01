!define(['conf', 'api', 'fun'], function ($conf, api, fun) {
    "ude strict";

    document.title = '在线充值';
    // $('#favicon').attr('href', 'https://www.baidu.com/favicon.ico');

    return function ($html) {
        console.log($html);
        // $.get('../../../build/view/common/tips.html').done(function ($tips) {
        //     $html.append($tips);
        // });

        var Charge = function () {
            this.fetchData = function () {
                var tips = '• 价格: ￥111.60\r\n\r\n• 【红利余额不能开通数据计划】\r\n\r\n• 有效期：50天\r\n\r\n• 红利账户：$12\r\n\r\n• 附加账户：\r\n\r\n• ➢本地话费：120分钟\r\n\r\n• 本地短信/流量：500条/350MB\r\n\r\n• 免费接听: 50天拨打 #100*2# 回复对应数字查询MCard$23计划余额';
                tips = tips.replace(/\r\n\r\n/gi, '<br/>');
                $('.r-tips').html(tips);
            };

            this.init = function () {
                fun.jqInit();
                this.fetchData();
            }
        };

        var charge = new Charge();
        charge.init();
    };
});
