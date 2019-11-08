import Vue from 'vue'
import VueNativeSock from 'vue-native-websocket'

export default ({ store }, inject) => {
  Vue.use(VueNativeSock, process.env.NUXT_ENV_API_WEBSOCKET, {
  	store: store
  })

  Vue.prototype.$socketOrder = new WebSocket(process.env.NUXT_ENV_API_ORDER_WEBSOCKET)
}