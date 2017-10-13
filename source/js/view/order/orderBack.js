!define(['conf', 'api', 'fun'], function ($conf, api, fun) {
    "ude strict";

    document.title = '申请退款';
    // $('#favicon').attr('href', 'https://www.baidu.com/favicon.ico');

    return function ($html) {
        var Order = function () {
            var _this = this;

            // FIXME: 获取数据
            this.fetchData = function ($obj) {
                console.log($obj);
                layer.msg('msg');
            };

            this.init = function () {
                $(document).on('click', '.r-click', function (e) {
                    var $this = $(e.target);
                    var data = $this.data(),
                        $parent = $this.parent();

                    // FIXME: 退款操作
                    // TODO: test
                    if (data.test == 'success') {
                        fun.swal('退款成功');
                        $parent.siblings('.r-article__ul--head').find('.r-status').html('退款成功');
                        $parent.remove();
                    }else {
                        fun.swal('退款失败，请稍后重试', 'error');
                    }
                });
            };
        };

        var order = new Order();
        order.init();

    };
});