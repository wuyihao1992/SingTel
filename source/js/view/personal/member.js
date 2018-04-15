!define([], function () {
    document.title = '我的会员';

    return function ($html) {
        "use strict";

        $(function () {
            $html.on('click', '.memberLi' , function (e) {
                debugger;
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

                if ($this.hasClass('opened')) {
                    // 打开的状态
                    $this.find('.memberLi-descWrap').hide();
                    $this.removeClass('opened');
                    $slidIcon.removeClass('opened');
                } else {
                    // 关闭的状态
                    $this.find('.memberLi-descWrap').show();
                    $this.addClass('opened');
                    $slidIcon.addClass('opened');
                }

                $this = null; $slidIcon = null;

            });
        });
    }
});
