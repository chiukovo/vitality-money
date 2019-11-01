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
  setNowNewPrice(state, {itemId, newPrice}) {
    Vue.set(state.nowNewPrice, itemId, 0)

    state.nowNewPrice[itemId] = newPrice
  },
  setNowFiveMoney(state, data) {
    let five = data
    let itemId = five[0]
    let fiveMax = 0
    let buyCount = five[1]
    let sellCount = five[2]
    let buy = 0
    let sell = 0
    let nowPrice = state.nowNewPrice[itemId]
    let formatData = []

    Vue.set(state.nowFiveMoney, itemId, [])

    for (let i = 0; i < buyCount; i++) {
      let buyNum = parseInt(five[i * 2 + 4]);
      if(fiveMax < buyNum) {
        fiveMax = buyNum;
      }
      buy += buyNum;
    }

    for (let i = 0; i < sellCount; i++) {
      let sellNum = parseInt(five[i * 2 + 4 + buyCount * 2]);
      if(fiveMax < sellNum) {
        fiveMax = sellNum;
      }
      sell += sellNum;
    }

    let maxNum = five[1] * 2 + five[2] * 2 + 3 - 1;
    let fiveData = [];

    for (let i = 0; i < sellCount; i++) {
      fiveData.push(['', five[maxNum - i * 2 - 1], five[maxNum - i * 2]]);
    }

    for (let i = 0; i < buyCount; i++) {
      fiveData.push([five[i * 2 + 4], five[i * 2 + 3], '']);
    }

    //計算%
    for(let num = 0; num < fiveData.length; num++) {
      if (num <= 4) {
        fiveData[num]['percent'] = parseInt((fiveData[num][2] / fiveMax) * 100)
      } else {
        fiveData[num]['percent'] = parseInt((fiveData[num][0] / fiveMax) * 100)
      }

      fiveData[num]['newPrice'] = nowPrice
    }

    formatData = fiveData.map(function(val, key) {
      let result

      if (key < 4) {
        result = [
          '',
          '',
          val[1],
          val[2],
          val['percent'],
        ]
      }

      //中間
      if (key == 4) {
        result = [
          '',
          '',
          nowPrice,
          '',
          '',
        ]
      }

      if (key > 4) {
        result = [
          val['percent'],
          val[0],
          val[1],
          '',
          '',
        ]
      }

      return result
    })

    state.nowFiveMoney[itemId] = formatData
  },
  doUpdateklLineData(state, data) {
    let kLineData = state.kLineData
  },
  doUpdateChartData(state, {prices, fullTime}) {
    let chartData = state.chartData

    prices.forEach(function(val) {
      state.chartData.push([
        fullTime,
        val[1] //價格
      ])
    })
  },
  clearModalData(state) {
    state.kLineData = []
    state.chartData = []
  },
  setChartData(state, response) {
    if (typeof state.chartData == 'undefined') {
      Vue.set(state.chartData, response.type, [])
    }

    state.chartData = []

    const code = response.data.Code
    const data = response.data.Tech
    const type = response.type

    if (code == 1) {
      let items = data.split(",")

      if (items.length > 1) {
        let dateTime = new Date(items[0]).getTime()
        let chartData = parseInt(items[1])

        state.chartData.push([
          dateTime,
          chartData
        ])

        for (let i = 3; i < items.length - 1; i += 3) {
          let chartDateTime = dateTime + parseInt(items[i]) * 60000
          chartData += parseInt(items[i + 1])

          if (parseInt(items[i]) > 0) {
            if (state.clickItemId == "TXF" || state.clickItemId == "EXF" || state.clickItemId == "FXF" || state.clickItemId == "TSLQ") {
              let x = chartDateTime / 60000
              let minutes = x % 60
              x = parseInt(chartDateTime / 3600000);
              let hours = x % 24 + 8
              let confirmTime = parseInt(hours * 60 +  minutes);
              if(confirmTime > 825) {
                  continue
              }
            }

            state.chartData.push([
              chartDateTime,
              chartData
            ])
          }
        }
      }
    }
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

            dateTime = new Date(historyItem[0] + " " + historyItem[1]).getTime()

            if (state.clickItemId == "TXF" || state.clickItemId == "EXF" || state.clickItemId == "FXF" || state.clickItemId == "TSLQ") {
              let t = historyData[1].split(":");
              if(parseInt(t[0]) * 60 + parseInt(t[1]) > 825) {
                //continue;
              }
            }

            if (isNaN(dateTime)) {
              continue
            }

            if (state.kLineData.length > 0) {
              if (dateTime <= state.kLineData[state.kLineData.length - 1][0]) {
                continue;
              }
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

    let nowPrice = state.nowNewPrice[itemId]

    if (typeof state.historyPrice[itemId] == 'undefined') {
      Vue.set(state.historyPrice, itemId, [])
    }

    if (typeof state.nowVolumeMoney[itemId] == 'undefined') {
      Vue.set(state.nowVolumeMoney, itemId, [])
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

    let amountMax = 0

    //加入到量價揭示
    state.historyPrice[itemId].forEach(function(val) {
      if (val.amount > amountMax) {
        amountMax = val.amount
      }

      if (state.nowVolumeMoney[itemId].length == 0) {
        state.nowVolumeMoney[itemId].push([
          val.amount,
          val.price,
        ])
      } else {
        let needAdd = true

        state.nowVolumeMoney[itemId] = state.nowVolumeMoney[itemId].map(function(dt) {
          if (val.price == dt[1]) {
            dt[0] += val.amount
            needAdd = false
          }

          if (dt[0] > amountMax) {
            amountMax = dt[0]
          }

          return dt
        })

        if (needAdd) {
          state.nowVolumeMoney[itemId].push([
            val.amount,
            val.price,
          ])
        }
      }
    })

    //排序
    state.nowVolumeMoney[itemId] = state.nowVolumeMoney[itemId].sort(function (a, b) {
      return a[1] > b[1] ? -1 : 1
    })

    //設定%數
    state.nowVolumeMoney[itemId] = state.nowVolumeMoney[itemId].map(function(dt) {
      dt[2] = dt[1] == nowPrice ? true : false
      dt[3] = parseInt((dt[0] / amountMax) * 100)

      return dt
    })
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