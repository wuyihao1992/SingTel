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

    exports.jqInit = function (callback) {
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

            console.log($activeItem);

            if ($this.hasClass('active')) {
                return;
            }

            $this.addClass('active');
            $activeItem.removeClass('active');

            // 修改金额
            $('#money').html($this.data('val'));

            $activeItem = $this;
            console.log($activeItem);
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

        });

        // 订单
        $(document).on('click', '.r-head__ul > li', function (e) {
            var $this = $(e.target);

            if ($this.is('a')) {
                $this = $this.parent('li');
            }

            if ($this.hasClass('active')) {
                return false;
            }

            $this.addClass('active').siblings().removeClass('active');

            if (!!callback && typeof callback == 'function') {
                callback.call(this, $this);    // this => <li class="active"><a href="javascript:;">xxx</a></li>
                // callback.apply(this, [$this]);
                // callback.call();
            }
        });
    }
});