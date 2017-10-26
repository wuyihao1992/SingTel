!define(['conf', 'api', 'fun'], function ($conf, api, fun) {
    "ude strict";

    document.title = '我的订单';
    // $('#favicon').attr('href', 'https://www.baidu.com/favicon.ico');

    return function ($html) {
        var Order = function () {
            var _this = this;

            this.bizCont = {page: 1};
            this.canLoadPage = true;
            // TODO: test
            this.$onePageLi = $('.r-article__ul').html();

            // FIXME: 获取数据
            this.fetchData = function ($obj) {
                console.log($obj);
            };

            this.tabClick = function () {
                _this.bizCont.page = 1;
                _this.canLoadPage = true;

                $('.r-article__ul').html(_this.$onePageLi); // 清空
            };

            this.init = function () {
                fun.jqInit(_this.tabClick);

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

                var $article = $('.r-article'), $ul = $('.r-article__ul'), $load = $('#loadMore');
                var loadHeight = $load.height();
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
                        if (_this.canLoadPage) {
                            $ul.append(_this.$onePageLi);

                            _this.bizCont.page += 1;
                            layer.msg('page:' + _this.bizCont.page);

                            if (_this.bizCont.page >= 10) {
                                _this.canLoadPage = false;
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