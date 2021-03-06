module.exports=[
    {
        name:"玩家管理",
        id:"player",
        icon:"el-icon-s-check",
        submenu:[
            {
                name:"玩家信息查询",
                to:"/playerinfo"
            },
            {
                name:"新手引导",
                to:"/noviceguide"
            }
        ]
    },
    {
        name:"角色管理",
        id:"rolegl",
        icon:"el-icon-guide",
        submenu:[
            { 
                name:"角色阵容练度",
                to:"/rolezr"
            },
            {
                name:"玩家充值查询",
                to:"/recharge"
            },
            {
                name:"挂机关卡",
                to:"/hangup"
            }
        ]
    },
    {
        name:"付费与货币",
        id:"feelhuobi",
        icon:"el-icon-coin",
        submenu:[
            {
                name:"种族抽",
                to:"/race"
            },
            {
                name:"每日礼包统计",
                to:"/gift"
            },
            {
                name:"档位充值",
                to:"/gearecharge"
            },
            {
                name:"玩家充值分布",
                to:"/playrecharge"
            },
            {
                name:"商城购买",
                to:"/shopbuy"
            },
            {
                name:"抽卡统计",
                to:"/lottery"
            },
            {
                name:"付费角色排行",
                to:"/feeroleph"
            }
        ]
    },
    {
        name:"留存率",
        id:"liucunlv",
        icon:"el-icon-user",
        submenu:[
            {
                name:"留存率查询",
                to:"/retention"
            },
        ]
    },
    {
        name:"GM工具",
        id:"ggpmd",
        icon:"el-icon-suitcase",
        submenu:[
            {
                name:"公告",
                to:"/notice"
            },
            {
                name:"跑马灯",
                to:"/pmd"
            },
            {
                name:"邮件",
                to:"/mail"
            },
        ]
    },
    {
        name:"龙平衡",
        id:"longph",
        icon:"el-icon-ship",
        submenu:[
            {
                name:"龙平衡统计",
                to:"/dragonbalance"
            },
        ]
    },
    {
        name:"激活码",
        id:"jihuoma",
        icon:"el-icon-pie-chart",
        submenu:[
            {
                name:"激活码查询",
                to:"/activationcode"
            },
        ]
    },
    {
        name:"物品流水",
        id:"wupin",
        icon:"el-icon-present",
        submenu:[
            {
                name:"角色物品流水",
                to:"/rolegift"
            },
        ]
    },
    {
        name:"封禁",
        id:"fengjin",
        icon:"el-icon-key",
        submenu:[
            {
                name:"封禁查询",
                to:"/ban"
            },
        ]
    },
]