### Run
```bash
node server
```

#### Dev Installation
```bash
npm install
bower install
```
```bash
gulp task
```
#### Page
`test => http://localhost:3000/index.html`

`SingTel => http://localhost:3000/index.html#/recharge/SingTel`<br/>
`StarHub => http://localhost:3000/index.html#/recharge/StarHub`<br/>
`M1      => http://localhost:3000/index.html#/recharge/M1`

`order(我的订单)   => http://localhost:3000/index.html#/order/order`<br/>
`orderBack(申请退款) => http://localhost:3000/index.html#/order/orderBack`

`policy(退款政策) => http://localhost:3000/index.html#/common/policy`

#### Feat
SingTel,Starhub,M1 目前`在线充值`分三个页面。如微信公众号菜单URL可带参，则可统一在 recharge.html 实现，即：
```javascript
var ty = ['SingTel', 'Starhub', 'M1'];
var url = 'http://localhost:3000/index.html#/recharge/recharge?type='+ ty[0];
```
