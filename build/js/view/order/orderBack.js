!define(['conf', 'api', 'fun'], function ($conf, api, fun) {
    "ude strict";

    document.title = '申请退款';
    // $('#favicon').attr('href', 'https://www.baidu.com/favicon.ico');

    return function ($html) {
        var Order = function () {
            var $article = $('.r-article', $html), $ul = $('.r-article__ul', $html), $load = $('#loadMore', $html);
            var loadHeight = $load.outerHeight(true);

            var _this = this;

            this.bizCont = {page: 1, type: 0};  // type 为不变
            this.canLoadPage = true;

            // FIXME: 获取数据
            this.fetchData = function () {
                console.log('now page', _this.bizCont);
                // api(_this.bizCont, {type: 'GET', url: ''}).then();

                // _this.canLoadPage = false;

                // TODO: test 应在ajax里面实现
                if (_this.bizCont.page > 5) {
                    _this.canLoadPage = false;
                    $load.html('没有更多数据');
                }else {
                    var testDada = [1,2,3,4,5,6,7,8,9,0];
                    var onePageLi = fun.orderList(testDada);
                    $ul.append(onePageLi);

                    _this.bizCont.page += 1;
                }

                console.info('next page', $.extend(true, {}, {}, _this.bizCont));
                var msg = '调试信息：<br>' + '当前页：' + (_this.bizCont.page - 1) + '<br>' + '下一页：' + _this.bizCont.page;
                layer.msg(msg, {time: 500});

                fun.isShowLoading($article, $load);
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

                $article.on('scroll', function () {
                    if (_this.canLoadPage == false) {
                        return false;
                    }

                    var $this = $article.get(0);
                    var scrollHeight = $this.scrollHeight,
                        clientHeight = $this.clientHeight,
                        scrollTop = $this.scrollTop;

                    // console.log(scrollHeight, clientHeight, scrollTop);

                    scrollHeight = scrollHeight - loadHeight;
                    if ((scrollTop + clientHeight) >= scrollHeight) {
                        _this.fetchData();
                    }

                    $this = null; scrollHeight = null; clientHeight = null; scrollTop = null;
                });

                // 初始化数据
                _this.fetchData();
            };
        };

        var order = new Order();
        order.init();
    };
});