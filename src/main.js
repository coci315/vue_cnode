// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './store'
import axios from 'axios'
import iView from 'iview'
import 'iview/dist/styles/iview.css'
import './my-theme/index.less'

import './common/scss/base.scss'
import {
  formatDate,
  fromNow
} from './common/js/date'

Vue.use(iView)

// import axios from 'axios'
// import VueAxios from 'vue-axios'

// Vue.use(VueAxios, axios)

Vue.prototype.$http = axios

Vue.filter('formatDate', function (dateString) {
  return formatDate(new Date(dateString), 'yyyy-MM-dd hh:mm:ss')
})

Vue.filter('fromNow', function (dateString) {
  return fromNow(new Date(dateString))
})

Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: {
    App
  }
})
