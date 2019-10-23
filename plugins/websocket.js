import Vue from 'vue'
import VueNativeSock from 'vue-native-websocket'

export default ({ store }, inject) => {
  Vue.use(VueNativeSock, process.env.NUXT_ENV_API_WEBSOCKET, { store: store })
}