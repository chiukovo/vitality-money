import Vue from 'vue'

export default {
  setApiExample(state, data) {
    state.apiExampleData = data
  },
  setClickItemId(state, data) {
    state.clickItemId = data
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
  setHistoryPrice(state, {itemId, prices, flocalTime}) {
    const data = {
      price: 0,
      amount: 0,
      flocalTime: flocalTime,
    }

    if (typeof state.historyPrice[itemId] == 'undefined') {
      Vue.set(state.historyPrice, itemId, [])
    }

    prices.forEach(function(val) {
      //0 量 1 價格
      data.amount = val[0]
      data.price = val[1]

      state.historyPrice[itemId].unshift(data)
    })

    if (state.historyPrice[itemId].length > 30) {
      for (let num = 1; num <= state.historyPrice[itemId].length - 30; num++) {
        state.historyPrice[itemId].pop()
      }
    }
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