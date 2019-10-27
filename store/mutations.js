import Vue from 'vue'

export default {
  setApiExample(state, data) {
    state.apiExampleData = data
  },
  setuserAuth(state, data) {
    //set localStorage
    state.localStorage.userAuth = {
      userId: data.UserId,
      token: data.Token,
    }

    location.href = "/home"
  },
  setUserInfo(state, data) {
    if (state.commidyArray.length == 0) {
      state.commidyArray = data.CommidyArray
    }

    state.userInfo = data.UserArray
  },
  setClickItemId(state, {id, name}) {
    state.clickItemId = id
    state.itemName = name
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
  setkLineData(state, response) {
    if (typeof state.kLineData == 'undefined') {
      Vue.set(state.kLineData, response.type, [])
    }

    state.kLineData = []
    state.chartType = response.type

    const code = response.data.Code
    const data = response.data.Tech
    const type = response.type

    if (code == 1) {
      let items = data.split("&")

      for(let num = 0; num < items.length; num++) {
        let historyData = items[num].split(";");
        let historyItem, dateTime

        //日期，時間，開，高，低，收，量；日期，時間，開，高，低，收，量；．．．．
        if (historyData.length > 1) {
          for (let i in historyData) {
            historyItem = historyData[i].split(",");

            if (historyItem.length < 6 || parseInt(historyItem[2]) <= 0 || parseInt(historyItem[3]) <= 0 || parseInt(historyItem[4]) <= 0 || parseInt(historyItem[5]) <= 0) {
              continue
            }

            dateTime = new Date(historyItem[0] + " " + historyItem[1]).getTime();
            if (isNaN(dateTime)) {
              continue
            }

            state.kLineData.push([
              dateTime,
              parseInt(historyItem[2]),
              parseInt(historyItem[3]),
              parseInt(historyItem[4]),
              parseInt(historyItem[5]),
              parseInt(historyItem[6])
            ])
          }
        }
      }
    }
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