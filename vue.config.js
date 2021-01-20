module.exports = {
    //基本路径
    outputDir: process.env.outputDir,
    //css和js等文件目录
    assetsDir:'static',
    //去掉eslink错误的提示
    lintOnSave: false,
    //打包的目录文件
    publicPath: './',
    // 是否使用包含运行时编译器的 Vue 构建版本
    runtimeCompiler: false,
   // 生产环境是否生成 sourceMap 文件
    productionSourceMap: false,
    integrity: false,
     //是否使用包含运行时编译器的 Vue 构建版本
    runtimeCompiler: false,
　　configureWebpack: {
　　　　externals: {
            'vue':"Vue",
            'vue-router': 'VueRouter',
            'ElementUI': 'ELEMENT',
            'axios': 'axios',
            'echarts':'echarts',
            'jQuery':'jQuery',
            'vuex': 'Vuex'
　　　　}
　　},
}
