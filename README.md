# play项目
## 项目页面
```
activationcode:激活码页面
ban:封禁页面
feeroleph:付费角色排行
gearrechargescatter:档位充值分布
gift:每日礼包统计查询
hangup:挂机关卡
login:登录页面
lottery:抽卡统计
mail:邮件管理
noticepmd:公告/跑马灯
noviceguidance:新手引导
playerinformation:玩家信息查询
racedrawtimes:种族抽
recharge:玩家充值查询
retention:留存率
rolegift:角色物品流水查询
rolezr:角色阵容练度
shopbuy:商城购买
topupplayerscatter：充值玩家分布
```
## 所用插件
```
vue
element-ui 页面布局ui组件库
echarts echarts统计图插件
file-saver  表单导出excel插件
xlsx  表单导出excel插件
table2excel echarts导出excel插件，需要用到jquery
vue-router 路由
axios  网络请求
```
## 技术点
```
整个开发阶段所要求的基本是构造出对应的数据，同时运用map比较多，基本上都是forEach循环遍历获取数据并存为想要的
obj对象，用arr.push(obj)接收对象后传给tabledata数组，方便渲染数据。
```
## 后端
```
nodejs： 后台服务器语言
express：web应用框架
mongoose：连接mongodb数据库运用的插件
fs：读取本地json文件中的数据
body-parser：获取表单所用到的插件
jsonwebtoken：生成token的插件
cookie-parser：将token运用cookie的方式传给前端
cors：允许跨域请求
promise:通过promise封装多接口请求
```
## 注意点
```
前端没有做太多处理，大部分都是nodejs服务器端做数据遍历后获取数据并存为对象，这样直接发送arr给前端接收,
前端只是获取接口中发送过来的数据
留存率部分主要请求的接口有2个，如果同步在一个函数中会出现请求时间过长的问题
```
## 知识点
- 通过watch监听属性判断导航栏点击情况并封装tabs组件
- 通过computed计算属性存储router.js中meta下name属性便于保存标签栏
- 将公共组件封装出来方便复用（页面中右侧tag栏，单选和全选的下拉选项，分页，头部组件，左侧菜单栏）
- js中forEach方法遍历较多，使用循环来遍历出想要的数据
- dialog组件封装，通过子传值给父($emit()方法)，父传子(props,$refs+id属性值)
- 通过v-show的方法实现组件的显示与隐藏并且实现table中编辑和删除操作等功能
- 通过map方法通过后台传过来的方法遍历出想要的数据名称