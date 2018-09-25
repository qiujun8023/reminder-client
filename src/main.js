import 'weui/dist/style/weui.css'
import 'font-awesome/css/font-awesome.min.css'

import Vue from 'vue'
import App from '@/App'
import router from '@/router'

Vue.config.productionTip = false

new Vue({
  router,
  render: h => h(App)
}).$mount('#app')
