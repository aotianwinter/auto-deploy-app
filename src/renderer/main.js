import Vue from 'vue'

import App from './App'
import router from './router'
import store from './store'
import './core/lazy_use' // use lazy load components
import './styles/init.css' // init css
import './styles/ant.stylus' // init ant design css

if (!process.env.IS_WEB) Vue.use(require('vue-electron'))
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  components: { App },
  router,
  store,
  template: '<App/>'
}).$mount('#app')
