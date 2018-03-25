/**
 * 程序主入口
 * 如访问页面: view/common/hi.html
 * 即访问页面地址：index.html#/view/common/hi?id=xxx&name=xxx
 * 完整地址：http://localhost:3000/index.html#/view/common/hi?id=xxx&name=xxx
 */
!require(['conf'], function ($conf) {
    require.config({
        // baseUrl: '../',
        // basePath: '../html',
        urlArgs: $conf.version,
        paths: {
            "text": "//cdn.bootcss.com/require-text/2.0.12/text.min",
            "json": "//cdn.bootcss.com/requirejs-plugins/1.0.3/json.min",
            // "css": "//cdn.bootcss.com/require-css/0.1.8/css.min",

            "css": "../assets/js/css.min",

            "api": "lib/API.min",
            "fun": "lib/fun"                // FIXME
        },
        shim: {}
    });

    require([], function (){
        var testPath = $conf.dev ? 'test/' : '';

        var url = location.hash.replace(/#/, '').split('?'),
            htmlUrl = '',
            jsUrl = '',
            cssUrl = '';

        // console.info(url);  // [""] || ["/order/order"] || ["/order/order", "id=1"]

        if (!!url.length){
            if (url[0] == '') {
                url[0] = '/common/hi';
            }

            if (url.length > 1){
                htmlUrl = '../../' + testPath + 'build/view' + url[0] + '.html?' + url[1];
            }else {
                htmlUrl = '../../' + testPath + 'build/view' + url[0] + '.html';
            }
            jsUrl = '../../' + testPath + 'build/js/view' + url[0] + '.min.js';
            cssUrl = '../../build/css/view' + url[0] + '.css';

            /*if (url.length > 1){
                htmlUrl = $conf.view + url[0] + '.html?' + url[1];
            }else {
                htmlUrl = $conf.view + url[0] + '.html';
            }
            jsUrl = $conf.source + '/js/view' + url[0] + '.js';
            cssUrl = $conf.build + '/css/view' + url[0] + '.css';*/

            NProgress.count = 0;
            NProgress.configure({
                trickleRate: 0.01,
                trickleSpeed: 800,
                showSpinner: false
            });

            $(document).on('click', '[data-url]', function() {
                // controller.request($(this).data());
            }).on('ajaxStart', function(){
                NProgress.start();
                NProgress.count++;
            }).on('ajaxStop', function(){
                NProgress.count--;
                NProgress.count < 0 && (NProgress.count = 0);
                NProgress.count == 0 && NProgress.done();
            });

            require(['css!' + cssUrl]);
            $.get(htmlUrl).done(function(html) {
                var $html = $(html);

                var reg = /recharge/gi;
                if (url[0].match(reg)) {
                    $.get('../../' + testPath + 'build/view/common/tips.html').done(function ($tips) {
                        $html.append($tips);
                    });
                }

                /*$html.on('click', 'a', function (e) {
                    var $this = $(e.target);
                    var thisHref = $this.attr('href');
                    if (!!thisHref && !thisHref.match(/javascript/gi)) {
                        location.reload();
                    }
                });*/

                window.onhashchange = function () {
                    if (window.innerDocClick) {
                        //Your own in-page mechanism triggered the hash change
                        //alert('You click a link');
                    } else {
                        //Browser back button was clicked
                        //alert('You click browser button');
                    }

                    location.reload();
                };

                $('#mainContainer').html($html);    // $html 即为 $('#app')

                require([jsUrl], function(func){
                    func && func.call(this, $html);
                });
            });
        }
    });
});