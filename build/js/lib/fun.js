define(function (require, exports, module) {
    "use strict";

    // 配置
    var bill_status = {1: '创建成功', 2: '支付成功', 3: '充值成功', 4: '支付失败', 5: '充值失败', 6: '退款成功', 7: '退款失败', 8: '退款处理中', 9: '充值处理中'};  // {3: '充值成功', 4: '支付失败', 5: '充值失败', 6: '退款成功', 7: '退款失败', 8: '退款处理中'}

    var storageKey = 'telList'; // 缓存字段

    /**
     * 校验规则
     * @param type 校验类型
     * @param v    当前值
     * @returns {{rule: boolean, msg: string}}
     */
    exports.available = function (type, v) {
        var result = {rule: false, msg: ''};

        if (!!type) {
            var rules = {
                phone: {
                    rule: function(v) {
                        if (v.length > 8) return false;
                        return /^[8|9][0-9]{7}$/i.test(v.trim());
                    },
                    msg: "请输入正确的手机号码"
                },
                newCalls: {
                    rule: function(v) {
                        if (v === '' || v.length > 10) return false;
                        return /^[0-9]{9,10}$/i.test(v.trim());
                    },
                    msg: "请输入9位或10位的手机号码"
                },
                chinaPhone: {
                    rule: function(v) {
                        if(v.length>11) return false;
                        return /((\d{11})|^((\d{7,8})|(\d{4}|\d{3})-(\d{7,8})|(\d{4}|\d{3})-(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1})|(\d{7,8})-(\d{4}|\d{3}|\d{2}|\d{1}))$)/i.test(v.trim());
                    },
                    msg: "请输入正确的手机号码"
                }
            };

            result.rule = rules[type].rule(v);
            result.msg = rules[type].msg;

            rules = null;
        }

        return result;
    };

    /** layer loading */
    exports.layerLoad = function () {
        return layer.load(1, {shade: [0.1, '#fff']});
    };

    /**
     *
     * @param txt message
     * @param type 提示类型 ['success', 'error', 'warning', 'info', 'question']
     * @param callback 确定回调
     */
    exports.swal = function (txt = '提示', type = 'success', callback) {
        swal({
            title: "",
            text: txt,
            type: type,                     // 'error', 'success'
            showCancelButton: false,
            // closeOnConfirm: false,
            confirmButtonText: "确定",
            confirmButtonColor: "#00b1a5",  // #ec6c62
            animation: "slide-from-top"     // animation: false
        }, function(){
            swal.close();

            if (!!callback && typeof callback == 'function') {
                callback.call();
            }
        });

        /*swal({
            title: 'Are you sure?',
            text: 'You will not be able to recover this imaginary file!',
            type: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Yes, delete it!',
            cancelButtonText: 'No, keep it'
        }).then(function() {
            swal('Deleted!', 'Your imaginary file has been deleted.', 'success')
        }, function(dismiss) { // dismiss can be 'overlay', 'cancel', 'close', 'esc', 'timer'
            if (dismiss === 'cancel') {
                swal('Cancelled', 'Your imaginary file is safe :)', 'error')
            }
        });*/
    };

    /**
     * 缓存电话号码
     * @param telNum 电话号码
     */
    exports.setSingTelStorage = function (telNum) {
        var telList = new LocalData().get(storageKey);
        if (telList) {
            // 去重
            var flag = false;
            for (var i = 0, len = telList.length; i< len; i++) {
                if (telNum == telList[i]) {
                    flag = true;
                    break;
                }
            }

            if (!flag) {
                telList.push(telNum);
                new LocalData().set(storageKey, telList);
            }
        } else {
            new LocalData().set(storageKey, [telNum]);
        }
    };
    /**
     * 渲染缓存电话号码下拉列表
     * @param telList 电话号码列表
     * @param type {1: 返回下拉列表即其container，2：只返回下拉列表}
     * @returns {string|*}
     */
    function renderStorageList(telList, type = 1) {
        var storageWrap,
            liStr = '';

        for (var i = 0; i < telList.length; i++) {
            liStr += '<li data-name="telNum" data-value="'+ telList[i] +'">' + telList[i] + '</li>';
        }

        storageWrap = '' +
            '<div class="storageWrap">' +
            '<ul class="storageUl">' + liStr + '</ul>' +
            '</div>';

        if (type === 1) {
            return storageWrap;
        } else {
            return '<ul class="storageUl">' + liStr + '</ul>';
        }
    }

    /**
     * 套餐支付
     * @param id 当前选中套餐id
     * @param telNum 手机号码
     */
    exports.pay = function (id, telNum) {
        var layerIndex = module.exports.layerLoad();

        module.exports.setSingTelStorage(telNum);   // 缓存手机号码

        $.ajax({
            url: 'api/pay/create',
            contentType: 'application/x-www-form-urlencoded',
            data: {item_id: id, phone: telNum},
            type: 'post'
        }).then(function (result) {
            layer.close(layerIndex);

            if (!!result && !!result.appId) {
                WeixinJSBridge.invoke("getBrandWCPayRequest", {
                    "appId": result.appId,          //公众号名称，由商户传入
                    "timeStamp": result.timeStamp,  //时间戳，自1970年以来的秒数
                    "nonceStr": result.nonceStr,    //随机串
                    "package": result.package,
                    "signType": 'MD5',              //微信签名方式
                    "paySign": result.sign          //微信签名
                }, function (res) {
                    WeixinJSBridge.log(res.err_msg);
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        module.exports.swal("恭喜您，支付成功", 'success', function () {
                            location.href = "#/order/order";
                            location.reload();
                        });
                    }else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                        module.exports.swal("支付已取消", 'info');
                    }else if (res.err_msg == "get_brand_wcpay_request:fail") {
                        module.exports.swal("支付失败", 'warning');
                    }
                });
            }else {
                module.exports.swal('签名失败，请稍后重试', 'error');
            }
        }, function () {
            layer.close(layerIndex);
            module.exports.swal('请求失败，请稍后重试', 'error');
        });

        /*api({item_id: id, phone: telNum}, {url: 'api/pay/create', contentType: 'application/x-www-form-urlencoded'}).then(function (result) {
            layer.close(layerIndex);

            if (!!result && !!result.appId) {
                WeixinJSBridge.invoke("getBrandWCPayRequest", {
                    "appId": result.appId,          //公众号名称，由商户传入
                    "timeStamp": result.timeStamp,  //时间戳，自1970年以来的秒数
                    "nonceStr": result.nonceStr,    //随机串
                    "package": result.package,
                    "signType": 'MD5',              //微信签名方式
                    "paySign": result.sign          //微信签名
                }, function (res) {
                    WeixinJSBridge.log(res.err_msg);
                    if (res.err_msg == "get_brand_wcpay_request:ok") {
                        module.exports.swal("恭喜您，支付成功", 'success', function () {
                            location.href = "#/order/order";
                            location.reload();
                        });
                    }else if (res.err_msg == "get_brand_wcpay_request:cancel") {
                        module.exports.swal("支付已取消", 'info');
                    }else if (res.err_msg == "get_brand_wcpay_request:fail") {
                        module.exports.swal("支付失败", 'warning');
                    }
                });
            }else {
                module.exports.swal('签名失败，请稍后重试', 'error');
            }
        }, function () {
            layer.close(layerIndex);
            module.exports.swal('请求失败，请稍后重试', 'error');
        });*/
    };

    /**
     * 退款
     * @param $this $('.r-click')
     * @param cb 成功回调
     */
    exports.payBack = function ($this, cb) {
        var data = $this.data(),
            $parent = $this.parent();

        // test delete
        /*if (data.test == 'success') {
            fun.swal('退款成功');
            $parent.siblings('.r-article__ul--head').find('.r-status').html('退款成功');
            $parent.remove();
        }else {
            fun.swal('退款失败，请稍后重试', 'error');
        }*/

        if (!!data.id) {
            var layerIndex = module.exports.layerLoad();

            $.ajax({
                url: 'api/refund',
                contentType: 'application/x-www-form-urlencoded',
                data: {trade_num: data.id},
                type: 'post'
            }).then(function (result) {
                layer.close(layerIndex);
                if (!!result && result.status == 0) {
                    module.exports.swal('退款申请已提交，将在1-3个工作日内退还', 'success', function () {
                        if (!!cb && typeof cb == 'function') {
                            cb();
                        }

                        location.reload();
                    });

                    $parent = $parent.parent();     // 按钮移到里面了
                    $parent.siblings('.r-article__ul--head').find('.r-status').html('退款处理中');
                    $this.remove();
                }else {
                    module.exports.swal('退款失败，请稍后重试', 'error');
                }
            }, function () {
                layer.close(layerIndex);
                module.exports.swal('请求失败，请稍后重试', 'error');
            });

            /*api({trade_num: data.id}, {url: 'api/refund', contentType: 'application/x-www-form-urlencoded'}).then(function (result) {
                layer.close(layerIndex);
                if (!!result && result.status == 0) {
                    module.exports.swal('退款申请已提交，将在1-3个工作日内退还', 'success', function () {
                        if (!!cb && typeof cb == 'function') {
                            cb();
                        }

                        location.reload();
                    });

                    $parent = $parent.parent();     // 按钮移到里面了
                    $parent.siblings('.r-article__ul--head').find('.r-status').html('退款处理中');
                    $this.remove();
                }else {
                    module.exports.swal('退款失败，请稍后重试', 'error');
                }
            }, function () {
                layer.close(layerIndex);
                module.exports.swal('请求失败，请稍后重试', 'error');
            });*/
        }
    };

    /**
     * 订单列表
     * @param data 后台列表
     * @returns {string}
     */
    exports.orderList = function (data) {
        var str = '';

        for (var i in data) {
            var item = data[i];

            var num = (item.trade_num.length > 16 ? item.trade_num.substring(0, 16) : item.trade_num),
                status = bill_status[item.bill_status] || '';

            str += ''+
            '<li data-id="" data-status="">'+
                '<div class="r-article__ul--head"><i class="r-icon"></i><span class="r-code">订单号：'+ num +'</span><span class="r-status">'+ status +'</span></div>'+
                '<div class="r-article__ul--center">'+
                    '<table class="r-marBot r-fullWidth">'+
                        '<tr><td row="1">手机号</td><td row="2">产品类型</td><td row="3">价格</td></tr>'+
                        '<tr class="font-bold"><td row="1">'+ item.phone_number +'</td><td row="2">'+ item.item +'</td><td row="3">¥'+ item.price +'</td></tr>'+
                    '</table>'+
                    '<p class="r-time">'+ item.created_at +'</p>'+
                    (status.match(/失败/gi) != null ? '<div class="parentFlex r-btnWrap"><span class="r-click" data-id="'+ item.trade_num +'" data-test="error">申请退款</span></div>' : '') +
                '</div>'+
                // '<!--<div class="r-article__ul&#45;&#45;foot parentFlex"><span class="r-click" data-id="2" data-test="error">申请退款</span></div>-->'+
            '</li>';

            item = null; num = null; status = null;
        }

        return str;
    };

    /**
     * 是否显示底部loading
     * @param $obj 滚动元素
     * @param $load loading元素
     */
    exports.isShowLoading = function ($obj, $load) {
        var $this = $obj.get(0);
        var scrollHeight = $this.scrollHeight,
            clientHeight = $this.clientHeight;

        $load.show();
        if (scrollHeight > clientHeight) {
        	$load.html('<div class="load6"><div class="bounce1"></div><div class="bounce2"></div><div class="bounce3"></div></div>');
        }else{
        	$load.html('没有更多数据');
        }
    };

    /**
     * 获取URL请求参数 (适用于report单页面url, http://localhost:8062/pms-report/html/main.html#/openDoor?userId=1537)
     * @param name
     * @returns {null}
     */
    exports.getReportQueryString = function(name) {
        var url = window.location.href;

        var arr = url.split('?');
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');

        if (!arr[1]) {
            return null;
        }

        var result = arr[1].match(reg);
        if (result != null) {
            return unescape(result[2]);
        }
        return null;
    };

    /**
     * scroll 下拉刷新
     * @param $obj
     */
    exports.$scroll = function ($obj) {
        $obj.on('scroll', function () {
            var $this = $obj.get(0);
            var scrollTop = $this.scrollTop,        // 当前滚动距离
                clientHeight = $this.clientHeight,  // 元素可见区域高度
                scrollHeight = $this.scrollHeight;  // 元素文档内容总高度

            // 如果底部有loading，则需减去loading高度
            // var loadHeight = $('.m-idWrap__ul li.m-liMore').height();
            // scrollHeight = scrollHeight - loadHeight;
            if ((scrollTop + clientHeight) >= scrollHeight) {
                // ajax
            }

            $this = null; scrollTop = null; clientHeight = null; scrollHeight = null;
        });
    };

    /**
     * 格式化tips
     * @param tips
     * @returns {*}
     */
    exports.formTips = function (tips) {
        if (!!tips) {
            // tips = tips.replace(/\\r/gi, '');    // FIXME **\n 或者直接不处理
            // tips = tips.replace(/\\n/gi, '<br>');
            tips = tips.replace(/\r|\\r/mg, ' ');
            tips = tips.replace(/\n|\\n/gi, '<br>');
        }else {
            tips = '';
        }

        return tips;
    };

    /**
     * tips按钮
     * @param $html 父级html节点，即$('#app')
     */
    exports.getTips = function ($html) {
        $.get('../../../build/view/common/tips.html').done(function ($tips) {
            $html.append($tips);
        });
    };

    /**
     * 套餐类型
     * @param data JSON {calls: [{}], package: [{}], flow: [{}]} => {话费: [{}], 套餐: [{}], 流量: [{}]}
     * @returns {{tabStr: string, contStr: string}}
     */
    exports.itemList = function (data) {
        var tabStr = '', contStr = '', index = 0;

        var tempKey = {calls: 0, package: 1, flow: 2},
            tempType = {0: 'calls', 1: 'package', 2: 'flow'};
        var class_name = {calls: '话费', package: '套餐', flow: '流量'};

        // 排序
        // i = 话费 套餐 流量
        for (var i in data) {
            data[tempKey[i]] = data[i];
            delete data[i];
        }

        for (var i in data) {
            var item = data[i];

            var tabClass =  '', contClass = 'r-hide';
            if (index == 0) {
                tabClass = 'active';
                contClass = '';
            }

            tabStr += '<li class="'+ tabClass +'" data-type="'+ tempType[i] +'"><a href="javascript:;">'+ class_name[tempType[i]] +'</a></li>';
            // tabStr += '<li class="'+ tabClass +'" data-type="'+ tempType[i] +'"><a href="javascript:;">'+ i +'</a></li>';

            var contItemStr = '';
            for (var j in item) {
                var subItem = item[j];

                // var tips = '• 价格: ￥111.60\r\n\r\n• 【红利余额不能开通数据计划】\r\n\r\n• 有效期：50天\r\n\r\n• 红利账户：$12\r\n\r\n• 附加账户：\r\n\r\n• ➢本地话费：120分钟\r\n\r\n• 本地短信/流量：500条/350MB\r\n\r\n• 免费接听: 50天拨打 #100*2# 回复对应数字查询MCard$23计划余额';
                var tips = subItem.item_content;
                tips = module.exports.formTips(tips);

                contItemStr += '<span class="r-item" data-id="'+ subItem.item_id +'" data-val="'+ subItem.item_price +'" data-tips="'+ tips +'">'+ subItem.item_name +'</span>';

                tips= null; subItem = null;
            }
            contStr += '<li class="'+ contClass +'">'+ contItemStr +'</li>';

            index++;

            item = null; tabClass = null; contClass = null; contItemStr = null;
        }

        index = null; tempKey = null; tempType = null;

        return {tabStr: tabStr, contStr: contStr};
    };

    /**
     * 初始化
     * @param buyCb 套餐支付回调
     * @param orderCb 订单列表回调
     */
    exports.jqInit = function (buyCb, orderCb) {
        // recharge.html
        var $activeItem = $('.r-item.active');
        $(document).on('click', '.r-tab > ul > li', function (e) {
            var $this = $(e.target);

            if ($this.is('a')) {
                $this = $this.parent('li');
            }

            if ($this.hasClass('active')) {
                return;
            }

            var activeIndex = $('.r-tab > ul > li').index($this);
            var $tabContent = $('.r-tabContent > ul > li');

            $this.addClass('active').siblings().removeClass('active');
            $tabContent.eq(activeIndex).show().siblings().hide();

            $this = null; activeIndex = null; $tabContent = null;
        }).on('click', '.r-item', function (e) {
            var $this = $(e.target);

            if ($this.hasClass('active')) {
                return;
            }

            $this.addClass('active');
            $activeItem.removeClass('active');

            // 修改金额 & tips
            $('#money').html($this.data('val'));
            $('.r-tips').html($this.data('tips') || '');

            /*if (!!itemCb && typeof itemCb == 'function') {
                itemCb.call(this, $this);
            }*/

            $activeItem = $this;

            $this = null;

        }).on('click', '#buy', function (e) {
            if ($('.r-tab > ul > li').length <= 0) {
                return false;
            }

            var $this = $(this);
            var telNum = $('input[name="telNum"]').val();

            var availableType = $this.data('phone');
            if (!availableType) {
                availableType = 'phone';
            }

            var result = module.exports.available(availableType, telNum);
            if (result.rule == false) {
                module.exports.swal(result.msg, 'warning');
                return false;
            }

            if ($activeItem.length <= 0) {
                module.exports.swal('请选择产品', 'warning');
                return false;
            }

            /*if (!!buyCb && typeof buyCb == 'function') {
                buyCb.call(this, $activeItem);
            }*/

            var id = $activeItem.data('id');
            module.exports.pay(id, telNum);
        });

        // order.html
        $(document).on('click', '.r-head__ul > li', function (e) {
            var $this = $(e.target);

            if ($this.is('a')) {
                $this = $this.parent('li');
            }

            if ($this.hasClass('active')) {
                return false;
            }

            $this.addClass('active').siblings().removeClass('active');

            if (!!orderCb && typeof orderCb == 'function') {
                orderCb.call(this, $this);    // this => <li class="active"><a href="javascript:;">xxx</a></li>
                // callback.apply(this, [$this]);
                // callback.call();
                // orderCb($this);
            }
        });

        // 手机号码缓存下拉
        $(document).on('focus', '[name="telNum"]',  function (e) {
            var $this = $(e.target);

            var telList = new LocalData().get(storageKey);
            if (telList) {
                var $storageWrap = $('.storageWrap');

                if ($storageWrap.length > 0) {
                    var $li = $('li', $storageWrap);
                    if ($li.length !== telList.length) {
                        $storageWrap.html(renderStorageList(telList, 2));
                    }
                    $storageWrap.fadeIn();
                    $li = null;
                } else {
                    var $storage = $(renderStorageList(telList));
                    var inputHeight = $this.outerHeight(true),
                        inputWidth = $this.outerWidth(true),
                        offsetTop = $this.offset().top;

                    $storage.css({
                        'top': inputHeight + offsetTop,
                        'min-width': inputWidth * 0.6 + 'px'
                    });

                    $('body').append($storage);
                    $storage.fadeIn();

                    $storage = null; inputHeight = null; inputWidth = null; offsetTop = null;
                }

                $storageWrap = null;
            }

            $this = null; telList = null;
        }).on('blur', '[name="telNum"]', function (e) {
            var $storageWrap = $('.storageWrap');
            if ($storageWrap.length > 0) {
                $storageWrap.fadeOut();
            }
            $storageWrap = null;
        });

        $(document).on('click', '[data-name="telNum"]', function (e) {
            var $this = $(e.target);
            var $telNum = $('[name="telNum"]');

            if ($telNum.length > 0) {
                $telNum.val($this.data('value'));
            }

            $this = null; $telNum = null;
        });
    };

    /**
     * 设置缓存值
     * @param key 主键
     * @param value 值
     * @param storageType 缓存类型，{1: sessionStorage , 2: localStorage }
     */
    function setStorage(key, value, storageType) {
        if (Object.prototype.toString.call(value) === '[object Object]' || Object.prototype.toString.call(value) === '[object Array]') {
            value = JSON.stringify(value);
        }

        if (!!storageType && storageType === 1) {
            sessionStorage.setItem(key, value);
        } else {
            localStorage.setItem(key, value);
        }
    }

    /**
     * 获取缓存
     * @param key 主键
     * @param storageType 缓存类型，{1: sessionStorage , 2: localStorage }
     * @param isJSON 是否返回JSON，{true: 返回JSON , false: 返回String }
     * @returns {*}
     */
    function getStorage(key, storageType, isJSON) {
        var value;

        if (!!storageType && storageType === 1) {
            value = sessionStorage.getItem(key);
        } else {
            value = localStorage.getItem(key);
        }

        if (!!isJSON) {
            try {
                value = JSON.parse(value);
            } catch (err) {
                console.warn('value is not a JSON string =>', err);
            }
        }

        return value;
    }

    /**
     * 删除缓存
     * @param key 主键
     * @param storageType 缓存类型，{1: sessionStorage , 2: localStorage }
     */
    function removeStorage(key, storageType) {
        if (!!storageType && storageType === 1) {
            sessionStorage.removeItem(key);
        } else {
            localStorage.removeItem(key);
        }
    }

    /**
     * 兼容性本地化存储方案封装
     * 调用:
     * new LocalData().set('xxx', 123)
     * new LocalData().get('xxx')
     * new LocalData().remove('xxx')
     */
    function LocalData() {
        this.hname = location.hostname ? location.hostname : 'localStatus';

        this.isLocalStorage = !!window.sessionStorage;              // 用于判断sessionStorage是否可用

        this.dataDom = null;

        /**
         * 当window.sessionStorage和window.localStorage不可用，则将数据存在dom节点
         * @param key 主键，由set()或get()方法传入
         * @returns {boolean}
         */
        this.initDom = function (key) {
            if (!this.dataDom) {
                try {
                    this.dataDom = document.createElement('input'); // 这里使用hidden的input元素
                    this.dataDom.type = 'hidden';
                    this.dataDom.style.display = 'none';
                    this.dataDom.setAttribute('id', key);

                    document.body.appendChild(this.dataDom);

                    return true;
                } catch (err) {
                    return false;
                }
            } else {
                return true;
            }
        };

        /**
         * 存储
         * @param key 主键
         * @param value 值
         * @param storageType 缓存类型，{1: sessionStorage , 2: localStorage }, 默认为2
         */
        this.set = function (key, value, storageType = 2) {
            if (this.isLocalStorage) {
                setStorage(key, value, storageType);
            } else {
                if (this.initDom(key)) {
                    if (Object.prototype.toString.call(value) === '[object Object]' || Object.prototype.toString.call(value) === '[object Array]') {
                        value = JSON.stringify(value);
                    }

                    this.dataDom.value = value;
                }
            }
        };

        /**
         * 获取
         * @param key 主键
         * @param storageType 缓存类型，{1: sessionStorage , 2: localStorage }, 默认为2
         * @param isJSON 是否返回JSON，{true: 返回JSON , false: 返回String }, 默认为true
         * @returns {string | *}
         */
        this.get = function (key, storageType = 2, isJSON = true) {
            if (this.isLocalStorage) {
                return getStorage(key, storageType, isJSON);
            } else {
                if (this.initDom(key)) {
                    var value = this.dataDom.value;

                    if (isJSON) {
                        try {
                            value = JSON.parse(value);
                        } catch (err) {
                            console.warn('value is not a JSON string =>', err);
                        }
                    }

                    return value;
                }
            }
        };

        /**
         * 删除存储
         * @param key 主键
         * @param storageType 缓存类型，{1: sessionStorage , 2: localStorage }
         */
        this.remove = function (key, storageType) {
            if (this.isLocalStorage) {
                removeStorage(key, storageType);
            } else {
                if (this.initDom(key)) {
                    document.body.removeChild(this.dataDom);
                    this.dataDom = null;
                }
            }
        };
    }

    /** * 对Date的扩展，将 Date 转化为指定格式的String * 月(M)、日(d)、12小时(h)、24小时(H)、分(m)、秒(s)、周(E)、季度(q)
     可以用 1-2 个占位符 * 年(y)可以用 1-4 个占位符，毫秒(S)只能用 1 个占位符(是 1-3 位的数字) * eg: * (new
     Date()).pattern("yyyy-MM-dd hh:mm:ss.S")==> 2006-07-02 08:09:04.423
     * (new Date()).pattern("yyyy-MM-dd E HH:mm:ss") ==> 2009-03-10 二 20:09:04
     * (new Date()).pattern("yyyy-MM-dd EE hh:mm:ss") ==> 2009-03-10 周二 08:09:04
     * (new Date()).pattern("yyyy-MM-dd EEE hh:mm:ss") ==> 2009-03-10 星期二 08:09:04
     * (new Date()).pattern("yyyy-M-d h:m:s.S") ==> 2006-7-2 8:9:4.18
     */
    Date.prototype.pattern = function(fmt) {
        var o = {
            "M+" : this.getMonth()+1,                                   //月份
            "d+" : this.getDate(),                                      //日
            "h+" : this.getHours()%12 == 0 ? 12 : this.getHours()%12,   //小时
            "H+" : this.getHours(),                                     //小时
            "m+" : this.getMinutes(),                                   //分
            "s+" : this.getSeconds(),                                   //秒
            "q+" : Math.floor((this.getMonth()+3)/3),                   //季度
            "S" : this.getMilliseconds()                                //毫秒
        };
        var week = {
            "0" : "/u65e5",
            "1" : "/u4e00",
            "2" : "/u4e8c",
            "3" : "/u4e09",
            "4" : "/u56db",
            "5" : "/u4e94",
            "6" : "/u516d"
        };

        if(/(y+)/.test(fmt)){
            fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
        }

        if(/(E+)/.test(fmt)){
            fmt = fmt.replace(RegExp.$1, ((RegExp.$1.length > 1) ? (RegExp.$1.length > 2 ? "/u661f/u671f" : "/u5468") : "")+week[this.getDay() + ""]);
        }

        for(var k in o){
            if(new RegExp("("+ k +")").test(fmt)){
                fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            }
        }

        return fmt;
    };

});
