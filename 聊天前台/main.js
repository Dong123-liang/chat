import App from './App'

// #ifndef VUE3
import Vue from 'vue'
//引入配置文件
import host from './config/index.js'
//引入socket
import io from '@/socket/weapp.socket.io.js'
Vue.prototype.$host=host
// Vue.prototype.$io=io('http://localhost:7000')//本地
// Vue.prototype.$io=io('http://172.16.9.207:7000')//本地有线ip
// Vue.prototype.$io=io('http://192.168.0.102:7000')//本地无线ip
Vue.prototype.$io=io('http://114.132.42.191:7000')//腾讯云
Vue.config.productionTip = false
App.mpType = 'app'
const app = new Vue({
    ...App
})
app.$mount()
// #endif

// #ifdef VUE3
import { createSSRApp } from 'vue'
export function createApp() {
  const app = createSSRApp(App)
  return {
    app
  }
}
// #endif