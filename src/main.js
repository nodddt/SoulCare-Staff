import Vue from 'vue'
import App from './App.vue'
import axios from 'axios'
import './plugins/element.js'
import ElementUI from "element-ui";
import "element-ui/lib/theme-chalk/index.css"
import router from './router/index.js'
import "./assets/css/common.css";
import "./router/permession.js"

import store from './store';
import Axios from 'axios'
Axios.defaults.baseURL = '/api'
Axios.defaults.headers.post['Content-Type'] = 'application/json'
Vue.prototype.$axios = axios;
axios.defaults.baseURL = '/proxy_url'

Vue.use(ElementUI);
Vue.config.productionTip = false

new Vue({
  router,//·������
  store, // ʹ��store
  render: h => h(App),
}).$mount('#app')

