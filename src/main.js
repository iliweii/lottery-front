import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import VueStorage from "vue-ls";
import './plugins/vant.js'
import axios from "axios";
import WebSocketService from "@/utils/websocket.js";

// 初始化 WebSocket
const wsService = WebSocketService.getInstance();
wsService.connect();

Vue.config.productionTip = false
Vue.use(VueStorage, {
  namespace: "pro__", // key prefix
  name: "ls", // name variable Vue.[ls] or this.[$ls],
  storage: "local", // storage name session, local, memory
});

if (process.env.NODE_ENV === "development") {
  Vue.prototype.API_BASE_URL = "http://192.168.199.149:8080/api";
} else {
  Vue.prototype.API_BASE_URL = "https://lottery.lucki.top/api";
}
window._CONFIG["domianURL"] = Vue.prototype.API_BASE_URL
axios.defaults.baseURL = Vue.prototype.API_BASE_URL

new Vue({
  router,
  store,
  render: h => h(App)
}).$mount('#app')