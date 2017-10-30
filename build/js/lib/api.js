/**
 * @author by wuyihao
 * @method ajax封装
 * @param object param 请求参数
 * @param string url 请求结果
 * @param type 请求类型
 * 调用实例 api(param).then(successCallback, errorCallback);
 *          api(param, {url: 'xxx/xxx'}, function()).then(successCallback, errorCallback);
 */
define(['conf'], function ($conf) {
    "use strict";

    return function (params, option, bfs) {
        var apiUrl = location.origin + '/api/gateway';  // FIXME

        var defaultOption = $.extend(true, {
            url: apiUrl,
            type: 'post',
            dataType: 'json',
            data: JSON.stringify(params || {}),
            contentType: 'application/json',
            beforeSend: function () {
                !!bfs ? bfs() : (function () {})();
            }
        }, option || {});

        return $.ajax(defaultOption).then(function (result) {
            if (!!result) {
                return result;
            }

            console.warn('ajax error!', apiUrl, params, result);
            return $.Deferred().reject(result);
        });
    }
});