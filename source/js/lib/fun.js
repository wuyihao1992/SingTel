define(function (require, exports, module) {
    "use strict";

    /**
     * 获取URL请求参数 (适用于report单页面url, http://localhost:8062/pms-report/html/main.html#/openDoor?userId=1537)
     * @param name
     * @returns {null}
     */
    exports.getReportQueryString = function(name) {
        var url = window.location.href;

        var arr = url.split('?');
        var reg = new RegExp('(^|&)' + name + '=([^&]*)(&|$)', 'i');

        var result = arr[1].match(reg);
        if (result != null) {
            return unescape(result[2]);
        }
        return null;
    };

    exports.available = function (type, v) {
        var result = {rule: false, msg: ''};

        if (!!type) {
            var rules = {
                "phone": {
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

    exports.jqInit = function (buyCb, orderCb) {
        // 充值页面
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
            var telNum = $('input[name="telNum"]').val();

            var result = module.exports.available('phone', telNum);
            console.log(result);
            if (result.rule == false) {
                module.exports.swal(result.msg, 'warning');
                return false;
            }

            console.log($activeItem);
            if ($activeItem.length <= 0) {
                module.exports.swal('请选择套餐类型', 'warning');
                return false;
            }

            // FIXME
            if (!!buyCb && typeof buyCb == 'function') {
                buyCb.call(this);
            }

        });

        // 订单列表
        $(document).on('click', '.r-head__ul > li', function (e) {
            var $this = $(e.target);

            if ($this.is('a')) {
                $this = $this.parent('li');
            }

            if ($this.hasClass('active')) {
                return false;
            }

            $this.addClass('active').siblings().removeClass('active');

            // FIXME
            if (!!orderCb && typeof orderCb == 'function') {
                // callback.call(this, $this);    // this => <li class="active"><a href="javascript:;">xxx</a></li>
                // callback.apply(this, [$this]);
                // callback.call();
                orderCb($this);
            }
        });
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

    // tips按钮
    exports.getTips = function ($html) {
        $.get('../../../build/view/common/tips.html').done(function ($tips) {
            $html.append($tips);
        });
    };

    /**
     * 套餐类型
     * @param data
     * @returns {{tabStr: string, contStr: string}}
     */
    exports.itemList = function (data) {
        var tabStr = '', contStr = '', index = 0;
        for (var i in data) {
            var item = data[i];

            var tabClass =  '', contClass = 'r-hide';
            if (index == 0) {
                tabClass = 'active';
                contClass = '';
            }

            tabStr += '<li class="'+ tabClass +'" data-type="'+ i +'"><a href="javascript:;">'+ i +'</a></li>';

            var contItemStr = '';
            for (var j in item) {
                var subItem = item[j];

                // var tips = '• 价格: ￥111.60\r\n\r\n• 【红利余额不能开通数据计划】\r\n\r\n• 有效期：50天\r\n\r\n• 红利账户：$12\r\n\r\n• 附加账户：\r\n\r\n• ➢本地话费：120分钟\r\n\r\n• 本地短信/流量：500条/350MB\r\n\r\n• 免费接听: 50天拨打 #100*2# 回复对应数字查询MCard$23计划余额';
                var tips = subItem.item_content;
                // tips = tips.replace(/\r/gi, '');
                // tips = tips.replace(/\n/gi, '<br>');    // FIXME **\n 或者直接不处理

                contItemStr += '<span class="r-item" data-id="'+ subItem.item_id +'" data-val="'+ subItem.item_price +'" data-tips="'+ tips +'">'+ subItem.item_name +'</span>';

                tips= null; subItem = null;
            }
            contStr += '<li class="'+ contClass +'">'+ contItemStr +'</li>';

            index++;

            item = null; tabClass = null; contClass = null; contItemStr = null;
        }

        index = null;

        return {tabStr: tabStr, contStr: contStr};
    };

    // order list
    exports.orderList = function (data) {

    };

    // orderBack List
    exports.orderBackList = function () {

    };

});