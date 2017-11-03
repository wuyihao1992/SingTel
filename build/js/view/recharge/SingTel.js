!define(['conf', 'api', 'fun'], function ($conf, api, fun) {
    "ude strict";

    document.title = '在线充值';
    // $('#favicon').attr('href', 'https://www.baidu.com/favicon.ico');

    return function ($html) {
        console.log($html);

        var Charge = function () {
            this.fetchData = function () {
                api({class_type: 'SingTel'}, {url: 'api/item_list'}).then(function (result) {
                    if (result.status == 0){
                        var data = result.data;

                        if (!!data) {
                            var resultList = fun.itemList(data);

                        }
                    }

                }, function () {
                    
                });
            };

            this.init = function () {
                fun.jqInit();
                // this.fetchData();
            }
        };

        var charge = new Charge();
        charge.init();
    };
});
