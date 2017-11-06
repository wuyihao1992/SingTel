!define(['conf', 'api', 'fun'], function ($conf, api, fun) {
    "ude strict";

    document.title = 'SingTel 在线充值';
    // $('#favicon').attr('href', 'https://www.baidu.com/favicon.ico');

    return function ($html) {
        var Charge = function () {
            this.fetchData = function () {
                api({class_type: 'SingTel'}, {type: 'GET', url: 'api/item_list'}).then(function (result) {
                    if (result.status == 0){
                        var data = result.data;

                        if (!!data) {
                            var resultList = fun.itemList(data);
                            $('.r-tab__ul', $html).html(resultList.tabStr);
                            $('.r-tabContent > ul', $html).html(resultList.contStr);
                        }else {
                            fun.swal('暂无套餐列表', 'error');
                        }
                    }
                }, function () {
                    fun.swal('获取套餐失败，请稍后重试', 'error');
                });
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
