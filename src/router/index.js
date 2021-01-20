export default new VueRouter({
    mode:"history",
    routes: [
      {
        path: '/',
        name:"index",
        component:  resolve => require.ensure([], () => resolve(require('../views/Index.vue')), 'Index'),
        children:[
          {
            path: '/playerinfo',
            name:"playerinfo",
            component: resolve => require.ensure([], () => resolve(require('../views/index/PlayerInfo.vue')), 'PlayerInfo'),
            meta: { title: '玩家信息' }
          },
          {
            path: '/noviceguide',
            name:"noviceguide",
            component: resolve => require.ensure([], () => resolve(require('../views/index/Noviceguide.vue')), 'Noviceguide'),
            meta: { title: '新手引导' }
          },
          {
            path:'/recharge',
            name:"recharge",
            component: resolve => require.ensure([], () => resolve(require('../views/index/Recharge.vue')), 'Recharge'),
            meta: { title: '充值查询' }
          },
          {
            path:'/gift',
            name:"gift",
            component: resolve => require.ensure([], () => resolve(require('../views/index/Gift.vue')), 'Gift'),
            meta: { title: '每日礼包' }
          },
          {
            path:'/hangup',
            name:"hangup",
            component: resolve => require.ensure([], () => resolve(require('../views/index/HangUp.vue')), 'HangUp'),
            meta: { title: '挂机关卡' }
          },
          {
            path:'/playrecharge',
            name:"playrecharge",
            component: resolve => require.ensure([], () => resolve(require('../views/index/PlayRecharge.vue')), 'PlayRecharge'),
            meta: { title: '充值分布' }
          },
          {
            path:'/gearecharge',
            name:"gearecharge",
            component: resolve => require.ensure([], () => resolve(require('../views/index/Gearecharge.vue')), 'Gearecharge'),
            meta: { title: '档位充值' }
          },
          {
            path:'/lottery',
            name:"lottery",
            component: resolve => require.ensure([], () => resolve(require('../views/index/Lottery.vue')), 'Lottery'),
            meta: { title: '抽卡统计' }
          },
          {
            path:'/rolezr',
            name:"rolezr",
            component: resolve => require.ensure([], () => resolve(require('../views/index/RoleZR.vue')), 'RoleZR'),
            meta: { title: '角色阵容' }
          },
          {
            path:'/retention',
            name:"retention",
            component: resolve => require.ensure([], () => resolve(require('../views/index/Retention.vue')), 'Retention'),
            meta: { title: '留存率' }
          },
          {
            path:'/race',
            name:"race",
            component: resolve => require.ensure([], () => resolve(require('../views/index/Race.vue')), 'Race'),
            meta: { title: '种族抽' }
          },
          {
            path:'/shopbuy',
            name:"shopbuy",
            component: resolve => require.ensure([], () => resolve(require('../views/index/ShopBuy.vue')), 'ShopBuy'),
            meta: { title: '商城购买' }
          },
          {
            path:'/feeroleph',
            name:"feeroleph",
            component: resolve => require.ensure([], () => resolve(require('../views/index/FeeRolePh.vue')), 'FeeRolePh'),
            meta: { title: '付费角色' }
          },
          {
            path:'/rolegift',
            name:"rolegift",
            component: resolve => require.ensure([], () => resolve(require('../views/index/RoleGift.vue')), 'RoleGift'),
            meta: { title: '角色物品' }
          },
          {
            path:'/activationcode',
            name:"activationcode",
            component: resolve => require.ensure([], () => resolve(require('../views/index/ActivationCode.vue')), 'ActivationCode'),
            meta: { title: '激活码' }
          },
          {
            path:'/notice',
            name:"notice",
            component: resolve => require.ensure([], () => resolve(require('../views/index/Notice.vue')), 'Notice'),
            meta: { title: '公告' }
          },
          {
            path:'/pmd',
            name:"pmd",
            component: resolve => require.ensure([], () => resolve(require('../views/index/Pmd.vue')), 'Pmd'),
            meta: { title: '跑马灯' }
          },
          {
            path:'/mail',
            name:"mail",
            component: resolve => require.ensure([], () => resolve(require('../views/index/Mail.vue')), 'Mail'),
            meta: { title: '邮件' }
          },
          {
            path:'/ban',
            name:"ban",
            component: resolve => require.ensure([], () => resolve(require('../views/index/Ban.vue')), 'Ban'),
            meta: { title: '封禁' }
          },
          {
            path:'/dragonbalance',
            name:"dragonbalance",
            component: resolve => require.ensure([], () => resolve(require('../views/index/DragonBalance.vue')), 'DragonBalance'),
            meta: { title: '龙平衡' }
          }
        ]
     },
     {
      path:'/login',
      name:"login",
      component: resolve => require.ensure([], () => resolve(require('../views/Login.vue')), 'Login')
     }
    ]
  })