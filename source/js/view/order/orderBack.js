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
            };

            this.init = function () {
                $(document).on('click', '.r-click', function (e) {
                    var $this = $(e.target);
                    var data = $this.data(),
                        $parent = $this.parent();

                    // FIXME: 退款操作 ajax
                    // TODO: test
                    if (data.test == 'success') {
                        fun.swal('退款成功');
                        $parent.siblings('.r-article__ul--head').find('.r-status').html('退款成功');
                        $parent.remove();
                    }else {
                        fun.swal('退款失败，请稍后重试', 'error');
                    }
                });

                var page = 1, $article = $('.r-article'), $ul = $('.r-article__ul'), $load = $('#loadMore');
                var $onePageLi = $ul.html(), loadHeight = $load.height();
                var canLoadPage = true;
                $article.on('scroll', function () {
                    var $this = $article.get(0);
                    var scrollHeight = $this.scrollHeight,
                        clientHeight = $this.clientHeight,
                        scrollTop = $this.scrollTop;

                    console.log(scrollHeight, clientHeight, scrollTop);

                    // scrollHeight = scrollHeight - loadHeight;
                    if ((scrollTop + clientHeight) >= scrollHeight) {
                        _this.fetchData();

                        // TODO: test
                        if (canLoadPage) {
                            $ul.append($onePageLi);

                            page += 1;
                            layer.msg('page:' + page);

                            if (page >= 10) {
                                canLoadPage = false;
                                $load.html('没有更多数据');
                            }
                        }
                    }

                    $this = null; scrollHeight = null; clientHeight = null; scrollTop = null;
                });
            };
        };

        var order = new Order();
        order.init();

    };
});