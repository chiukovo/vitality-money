import Vue from 'vue'

export default {
  setApiExample(state, data) {
    state.apiExampleData = data
  },
  setMainItem(state, data) {
    state.mainItem = data
  },
  setNowMainItem(state, data) {
    state.nowMainItem = data
  },
  setNowFiveMoney(state, data) {
    state.nowFiveMoney = data
  },
  SOCKET_ONOPEN (state, event)  {
    Vue.prototype.$socket = event.currentTarget
    state.socket.isConnected = true
  },
  SOCKET_ONCLOSE (state, event)  {
    state.socket.isConnected = false
  },
  SOCKET_ONERROR (state, event)  {
    console.error(state, event)
  },
  SOCKET_ONMESSAGE (state, message)  {
    state.socket.message = message
  },
  SOCKET_RECONNECT(state, count) {
    console.info(state, count)
  },
  SOCKET_RECONNECT_ERROR(state) {
    state.socket.reconnectError = true;
  },
}