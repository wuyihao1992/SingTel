!define(['api', 'fun'], function (api, fun) {
    document.title = '我的会员';

    return function ($html) {
        "use strict";

        $(function () {
            $html.on('click', '.memberLi' , function (e) {
                var $this = $(e.target);

                if ($this.is('p')) {
                    return false;
                }

                if ($this.is('span')) {
                    $this = $this.parent('li');
                }

                if ($this.data('type') === 'link') {
                    return false;
                }

                var $slidIcon = $('.memberLi-icon-slid', $this);

                // 当前状态=》打开的
                if ($this.hasClass('opened')) {
                    $this.find('.memberLi-descWrap').hide();
                    $this.removeClass('opened');
                    $slidIcon.removeClass('opened').addClass('closed');
                } else {    // 当前状态=》关闭的
                    $this.find('.memberLi-descWrap').show();
                    $this.addClass('opened');
                    $slidIcon.removeClass('closed').addClass('opened');
                }

                $this = null; $slidIcon = null;

            }).on('click', '[data-btn="signIn"]', function (e) {
                var $this = $(e.target);

                if ($this.data('disabled') == true) {
                    return false;   // 未初始化完
                }

                if ($this.text() === '已签到' || $this.data('signIn') == true) {
                    return false;   // 已经签过到
                }

                // 签到
                api({}, {type: 'GET', url: 'api/sign_in'}).then(function (result) {
                    if (!!result && result.status == 0) {
                        $this.html('已签到');
                        $this.data('signIn', true);
                        $('[data-name="credit"]', $html).html(result.data.credit);  // 新的积分
                    }
                });
            });
            
            function Member() {
                this.getUserInfo = function () {
                    api({}, {type: 'GET', url: 'api/user_info'}).then(function (result) {
                        if (!!result && result.status == 0) {
                            var data = result.data;
                            $('[data-name="headimg_url"]', $html).css('background-image', data.headimg_url);
                            $('[data-name="nick_name"]', $html).html(data.nick_name);
                            $('[data-name="credit"]', $html).html(data.credit);

                            // 是否已经签到
                            var $signIn = $('[data-btn="signIn"]', $html);
                            $signIn.data('disabled', false);    // 初始化完成，允许点击
                            if (data.sign_in == true) {
                                $signIn.html('已签到');
                                $signIn.data('signIn', true);
                            }
                        }
                    });
                };

                this.getCreditRule = function () {
                    // 获取积分的方式
                    api({}, {type: 'GET', url: '/api/text?text_name=credit_rule'}).then(function (result) {
                        if (!!result && result.status == 0) {
                            var data = fun.formTips(result.data);
                            $('[data-name="creditRule"]', $html).html(data);
                        }
                    });

                    // 积分抵扣规则
                    api({}, {type: 'GET', url: '/api/text?text_name=comsume_credit_rule'}).then(function (result) {
                        if (!!result && result.status == 0) {
                            var data = fun.formTips(result.data);
                            $('[data-name="comsumeCreditRule"]', $html).html(data);
                        }
                    });
                };
            }

            var member = new Member();
            member.getUserInfo();
            member.getCreditRule();
            
        });
    }
});
