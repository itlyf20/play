import Vue from 'vue'
import App from './App.vue'
import router from './router'
import {Service} from './api/axios.js'

Vue.config.productionTip = false;
Vue.prototype.$http=Service;
new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
