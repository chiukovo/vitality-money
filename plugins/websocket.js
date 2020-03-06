import Vue from 'vue'
import VueNativeSock from 'vue-native-websocket'

export default ({ store }, inject) => {
  const url = process.env.NUXT_ENV_API_WEBSOCKET.replace('redirect', window.location.host);
  Vue.use(VueNativeSock, url, {
		store: store,
		reconnection: true,
		reconnectionDelay: 2000
  })

  const orderUrl = process.env.NUXT_ENV_API_ORDER_WEBSOCKET.replace('redirect', window.location.host);

  Vue.prototype.$socketOrder = new WebSocket(orderUrl)
}