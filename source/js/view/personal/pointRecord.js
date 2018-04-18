!define(['conf', 'api', 'fun'], function ($conf, api, fun) {
    "use strict";

    document.title = '积分记录';

    return function ($html) {
        $(function () {
            var Record = function () {
                var $article = $('#app'), $ul = $('#pointRecord', $html), $load = $('#loadMore', $html);
                var loadHeight = $load.outerHeight(true);

                var _this = this;

                this.bizCont = {page: 1};
                this.canLoadPage = true;

                this.fetchData = function () {
                    _this.canLoadPage = false;

                    api(_this.bizCont, {type: 'GET', url: 'api/bill'}).then(function (result) {
                        if (!!result && result.status == 0) {
                            var data = result.data;

                            if (data.length > 0) {
                                _this.canLoadPage = true;
                                _this.bizCont.page += 1;

                                var onePageLi = _this.renderList(data);
                                $ul.append(onePageLi);

                                onePageLi = null;

                                fun.isShowLoading($article, $load);
                            } else {
                                _this.canLoadPage = false;
                                $load.show();

                                if (_this.bizCont.page === 1) {
                                    $load.html('您暂时没有积分记录。');
                                }else {
                                    $load.html('没有更多数据');
                                }
                            }
                        } else {
                            _this.canLoadPage = true;
                            $load.show();
                            $load.html('没有更多数据');
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
                            var onePageLi = _this.renderList(testDada);
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

                this.renderList = function (data) {
                    var str = '';
                    for (var i in data) {
                        var item = data[i];

                        var pointStr = '<div class="record__point r-colorBlue">-100</div>';

                        str += '<li>' +
                            '<p class="record__tit">'+ item.phone_number +'</p>' +
                            '<p class="record__time">'+ item.created_at +'</p>' +
                            pointStr +
                            '</li>';

                        item = null; pointStr = null;
                    }
                    return str;
                };

                this.init = function () {
                    $article.on('scroll', function () {
                        if (_this.canLoadPage === false) {
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
                    _this.fetchData();
                };
            };

            var record = new Record();
            record.init();
        });
    }
});
