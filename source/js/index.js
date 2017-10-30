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

            "css": "../../build/assets/js/css.min",

            "api": "lib/api",
            "fun": "lib/fun"
        },
        shim: {}
    });

    require([], function (){
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
                htmlUrl = '../../view' + url[0] + '.html?' + url[1];
            }else {
                htmlUrl = '../../view' + url[0] + '.html';
            }
            jsUrl = '../../source/js/view' + url[0] + '.js';
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
                $('#mainContainer').html($html);    // $html 即为 $('#app')

                require([jsUrl], function(func){
                    func && func.call(this, $html);
                });
            });
        }
    });
});