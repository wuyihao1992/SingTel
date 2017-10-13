!define(['conf', 'api', 'fun'], function ($conf, api, fun) {
    "ude strict";

    document.title = '在线充值';
    // $('#favicon').attr('href', 'https://www.baidu.com/favicon.ico');

    return function ($html) {
        console.log($html);

        var Charge = function () {
            this.init = function () {
                fun.jqInit();
            }
        };

        var charge = new Charge();
        charge.init();

    };
});
