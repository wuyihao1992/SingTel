!define(['api', 'fun'], function (api, fun) {
    document.title = '在线充值退款政策';

    return function ($html) {
        "use strict";

        /*var test = '退款时效：成功申请退款后，款额通常是即时退到您的微信零钱包的，如果未能即时到账，请勿担心，微信支付承诺的是3天内到到账，联系客服微信 xxx 帮您核实，客服在线时间 早上9:30-晚上10:00 \\r\\n\\r\\n退款范围：\\r\\n1. 如果您成功购买后，充值状态【失败】，请去输入栏“退款和订单”-> “申请退款”\\r\\n    • 充值失败的原因有可能是手机营运商选错，手机号码输错，手机号码过期，手机号码非新加坡预付卡，充值服务器更新等等，请确认后再次下单\\r\\n2. 如果您成功购买后，发现手机号码输错，请去输入栏“退款和订单”->“订单查询”查看充值状态，如果状态是【充值成功】，这说明您输入的手机号码刚好有其他客户使用并且是被激活的状态，此种情况我们无法退款\\r\\n    • 温馨提示：下单时请确认手机号码，号码输入错误而造成的损失只能您自己承担\\r\\n3. 如果您无意中误买了商品，或者该商品不符合您的预期 (比如您想购买主卡后开通流量包，但购买了套餐而无法开通流量包)，充值成功后，我们无法退款\\r\\n4. 如果您购买成功后，发现红利账户没有赠送，此种情况下，我们无法退款，在线充值充的是主账户，红利是营运商赠送的，如有变化，恕不另行通知\\r\\n5. 如果您成功购买主卡充值后，蜂窝移动网络开启着却没有及时开通流量包，而导致主卡里的余额迅速耗光，此种情况我们无法退款，没有开通流量包而直接使用流量，您是土豪，联系客服微信 xxx 帮您核实充值详情 \\r\\n\\r\\n特别注意：\\r\\n如发生以下2种情况，请勿担心，请联系客服微信 xxx 帮您解决问题：\\r\\n1. 成功购买后，发现手机营运商选错，充值状态却是【充值成功】\\r\\n2. 成功购买后，输入的手机号码正确，选择的手机营运商也正确，充值状态是【充值成功】，但超过2分钟还未收到充值';
        test = fun.formTips(test);
        $('#test').html(test);*/
        
        $(function () {
            api({text_name: 'refund_policy'}, {url: 'api/text', type: 'GET'}).then(function (result) {
                if (result.status == 0) {
                    var data = fun.formTips(result.data);
                    $('#policy', $html).html(data);
                }
            }, function (err) {

            });
        });
    }
});