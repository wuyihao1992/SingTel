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

            });
        });
    }
});
