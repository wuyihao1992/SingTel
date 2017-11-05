!define(['conf', 'api', 'fun'], function ($conf, api, fun) {
    "ude strict";

    document.title = '我的订单';
    // $('#favicon').attr('href', 'https://www.baidu.com/favicon.ico');

    return function ($html) {
        var Order = function () {
            var $article = $('.r-article', $html), $ul = $('.r-article__ul', $html), $load = $('#loadMore', $html);
            var loadHeight = $load.outerHeight(true);

            var _this = this;

            // class_type: M1, StarHub, SingTel
            // class_name: 话费，套餐，流量
            this.bizCont = {page: 1, class_name: 'calls'};
            // this.bizCont = {page: 1, class_type: '', class_name: 'calls/package/flow', bill_status: []};    // 这是 我的订单 页面的报文
            // this.bizCont = {page: 1, class_type: '', class_name: '', bill_status: [4, 5, 7]}; // 这是 申请退款 页面的报文

            this.canLoadPage = true;

            this.fetchData = function () {
                _this.canLoadPage = false;
                api(_this.bizCont, {type: 'GET', url: 'api/bill'}).then(function (result) {
                    if (!!result && result.status == 0) {
                        var data = result.data;
                        if (data.length > 0) {
                            _this.canLoadPage = true;
                            _this.bizCont.page += 1;

                            var onePageLi = fun.orderList(data);
                            $ul.append(onePageLi);

                            onePageLi = null;

                            fun.isShowLoading($article, $load);
                        }else {
                            _this.canLoadPage = false;

                            $load.html('没有更多数据');
                        }
                    }else {
                        _this.canLoadPage = true;
                    }
                }, function () {
                    _this.canLoadPage = true;
                });

                // TODO: test 应在ajax里面实现
                var testFun = function () {
                    console.log('now page', _this.bizCont);

                    if (_this.bizCont.page > 5) {
                        _this.canLoadPage = false;
                        $load.html('没有更多数据');
                    }else {
                        var testDada =  [{
                            "phone_number": "18826418589",
                            "price": 49.1,
                            "item": "主账户$10",
                            "trade_num": "20171104121536401452152149395274",
                            "bill_status": "3",
                            "created_at": "2017-11-04 18:14:10"
                        }, {
                            "phone_number": "18826418589",
                            "price": 49.1,
                            "item": "主账户$10",
                            "trade_num": "20171104150896063798100686103758",
                            "bill_status": "3",
                            "created_at": "2017-11-04 15:08:40"
                        }, {
                            "phone_number": "18826418589",
                            "price": 49.1,
                            "item": "主账户$10",
                            "trade_num": "20171104150896063798100686103758",
                            "bill_status": "3",
                            "created_at": "2017-11-04 15:08:40"
                        }, {
                            "phone_number": "18826418589",
                            "price": 49.1,
                            "item": "主账户$10",
                            "trade_num": "20171104150896063798100686103758",
                            "bill_status": "3",
                            "created_at": "2017-11-04 15:08:40"
                        }, {
                            "phone_number": "18826418589",
                            "price": 49.1,
                            "item": "主账户$10",
                            "trade_num": "20171104150896063798100686103758",
                            "bill_status": "3",
                            "created_at": "2017-11-04 15:08:40"
                        }];
                        var onePageLi = fun.orderList(testDada);
                        $ul.append(onePageLi);

                        _this.bizCont.page += 1;
                    }

                    console.info('next page', $.extend(true, {}, {}, _this.bizCont));
                    var msg = '调试信息：<br>' + '当前页：' + (_this.bizCont.page - 1) + '<br>' + '下一页：' + _this.bizCont.page;
                    layer.msg(msg, {time: 500});

                    fun.isShowLoading($article, $load);
                };
                // testFun();
            };

            this.tabClick = function ($this) {
                _this.bizCont.page = 1;
                _this.canLoadPage = true;

                $('.r-article').animate({scrollTop: '0px'}, 1);
                $('.r-article__ul').html('');                       // 清空
                // _this.bizCont.class_type = $this.data('type');
                _this.bizCont.class_name = $this.data('name');
                _this.fetchData();
            };

            this.init = function () {
                fun.jqInit(null, _this.tabClick);

                $(document).on('click', '.r-click', function (e) {
                    var $this = $(e.target);
                    var data = $this.data(),
                        $parent = $this.parent();

                    // FIXME: 退款操作 TODO: tests
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

                    scrollHeight = scrollHeight - loadHeight;
                    if ((scrollTop + clientHeight) >= scrollHeight) {
                        _this.fetchData();
                    }

                    $this = null; scrollHeight = null; clientHeight = null; scrollTop = null;
                });

                // 初始化数据
                var $activeTab = $('.r-head__ul .active', $html);
                // _this.bizCont.class_type = $activeTab.data('type');
                _this.bizCont.class_name = $activeTab.data('name');
                $activeTab = null;
                _this.fetchData();

            };
        };

        var order = new Order();
        order.init();

    };
});