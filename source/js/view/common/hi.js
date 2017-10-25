!define(['conf'], function ($conf) {
    console.log($conf);
    document.title = 'Hi';
    // document.getElementById('app').innerHTML = 'Start Success! Welcome To hi.html!';

    return function ($html) {
        console.log($html);
        layer.msg('layer start success!');

        var origin = location.origin;
        var url = {
            test: '/index.html',
            SingTel: '/index.html#/recharge/SingTel',
            Starhub: '/index.html#/recharge/Starhub',
            M1: '/index.html#/recharge/M1',
            order: '/index.html#/order/order',
            orderBack: '/index.html#/order/orderBack',
            policy: '/index.html#/common/policy'
        };

        $('[data-type="url"]').each(function () {
            var $this = $(this);
            $this.attr('href', origin + url[$this.data('key')]);
            $this.attr('target', '_blank');
        });
    };
});
