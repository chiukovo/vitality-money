import Vue from 'vue'

export default {
  setApiExample(state, data) {
    state.apiExampleData = data
  },
  setCustomSetting(state, type) {
    state.localStorage.customSetting[type] = !state.localStorage.customSetting[type]
  },
  setCustomItemSetting(state, data) {
    //default item 選擇第一筆
    let first = true

    if (data.length > 0) {
      data.forEach(function(val){
        if (val.show && first) {
          state.clickItemId = val['id']
          state.itemName = val['name']

          first = false
        }
      })
    }
    state.customItemSetting = data
  },
  setuserAuth(state, data) {
    //set localStorage
    state.localStorage.userAuth = {
      userId: data.UserId,
      token: data.Token,
    }

    //set cookie
    document.cookie = `token=${data.Token}`

    if (state.isMobile) {
      location.href = "/mobile/home"
    } else {
      location.href = "/home"
    }
  },
  setUserInfo(state, data) {
    if (state.commidyArray.length == 0) {
      state.commidyArray = data.CommidyArray
    }

    state.userInfo = data.UserArray
  },
  setUserOrder(state, data) {
    state.userOrder = data

    let uncoveredCountDetail = []

    //計算未平倉數量
    data.UncoveredArray.forEach(function(val) {
      if (typeof uncoveredCountDetail[val.ID] == 'undefined') {
        uncoveredCountDetail[val.ID] = 1
        if (val.BuyOrSell == 0) {
          uncoveredCountDetail[val.ID] = 1
        } else {
          uncoveredCountDetail[val.ID] = -1
        }
      } else {
        if (val.BuyOrSell == 0) {
          uncoveredCountDetail[val.ID] += 1
        } else {
          uncoveredCountDetail[val.ID] += -1
        }
      }
    })

    state.uncoveredCountDetail = Object.assign({}, uncoveredCountDetail)
  },
  setNowMainItem(state, data) {
    state.nowMainItem = data
  },
  setMobile(state, data) {
    state.isMobile = data
  },
  setClickItemId(state, {id, name}) {
    state.clickItemId = id
    state.itemName = name
  },
  setMainItem(state, data) {
    const commidyArray = state.commidyArray
    //計算禁新 強平
    data = data.map(function (val) {
      let newPoint = 0,
        cover = 0

      commidyArray.forEach(function (commidy) {
        if (val.product_id == commidy.ID) {
          newPoint = parseInt(commidy.NotNewPercent)
          cover = parseInt(commidy.CoverPercent)
        }
      })

      val.yesterday_close_price = parseInt(val.yesterday_close_price)

      //參考價 +- 參考價*禁新%
      val.new_point1 = val.yesterday_close_price + val.yesterday_close_price * newPoint
      val.new_point2 = val.yesterday_close_price - val.yesterday_close_price * newPoint
      val.cover_point1 = val.yesterday_close_price + val.yesterday_close_price * cover
      val.cover_point2 = val.yesterday_close_price - val.yesterday_close_price * cover

      return val
    })

    state.mainItem = data
  },
  setUpdateMainItem(state, data) {
    const _this = this

    let borderName
    let itemId = data[0]
    let clickItemId = state.clickItemId
    let nowItems = data[1].split(",").map(function(item) {
      return parseInt(item, 10)
    })

    //k線圖資料更新判斷
    let kLineData = state.kLineData
    //長條圖更新
    let chartData = state.chartData

    if (kLineData.length > 0 && itemId == clickItemId) {
      _this.commit('doUpdateklLineData', nowItems)
    }

    state.mainItem = state.mainItem.map(function (val) {
      if (itemId == val.product_id) {
        //計算
        let dindex = 0;
        let prices = []
        let localTime = (nowItems[0] < 10000000) ? "0" + nowItems[0] / 100 : "" + nowItems[0] / 100
        let flocalTime = _this._vm.formatTime(localTime)

        let nowDate = new Date();
        let fullTime = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), nowItems[0] / 1000000, nowItems[0] / 10000 % 100, nowItems[0] / 100 % 100 ).getTime()

        borderName = val.color == 'text-up' ? 'border border-up' : 'border border-down'

        //最高
        if (val.highest_price < nowItems[1]) {
          val.highest_price = nowItems[1]
          val.highest_price_change = borderName
        } else {
          val.highest_price_change = ''
        }

        //最低
        if (val.lowest_price > nowItems[1]) {
          val.lowest_price = nowItems[1]
          val.lowest_price_change = borderName
        } else {
          val.lowest_price_change = ''
        }

        while(dindex < nowItems.length) {
          if(dindex > 0 && dindex + 3 < nowItems.length) {
            nowItems[0] += nowItems[dindex]
            nowItems[1] += nowItems[dindex + 1]
            nowItems[2] += nowItems[dindex + 2]
            nowItems[3] += nowItems[dindex + 3]
          }

          prices.push([nowItems[2], nowItems[1]])

          dindex += 4;
        }

        //if click 長條圖
        if (chartData.length > 0 && itemId == clickItemId) {
          _this.commit('doUpdateChartData', {prices, fullTime})
        }

        //總量
        val.total_qty += nowItems[2]
        val.total_qty_change = nowItems[2] == 0 ? '' : borderName
        //成交
        val.newest_price_change = val.newest_price == nowItems[1] ? '' : borderName
        val.newest_price = nowItems[1]

        //寫入store 目前最新成交價錢
        _this.commit('setNowNewPrice', {itemId, newPrice: nowItems[1]})

        //漲跌
        val.gain = val.newest_price - val.yesterday_close_price
        //(成交價-昨日收盤)/昨日收盤*100%
        val.gain_percent = ((val.gain / val.yesterday_close_price) * 100).toFixed(2)

        _this.commit('setHistoryPrice', {itemId, prices, flocalTime})
      }

      return val
    })
    //現在items 加入store
    _this.commit('setNowMainItem', state.mainItem)
    //remove border
    setTimeout(function() {
      _this.commit('rmMainItemBorder')
    }, 600)
  },
  rmMainItemBorder(state, data) {
    state.mainItem = state.mainItem.map(function (val) {
      val.highest_price_change = ''
      val.lowest_price_change = ''
      val.total_qty_change = ''
      val.newest_price_change = ''

      return val
    })
  },
  setNowNewPrice(state, {itemId, newPrice}) {
    state.nowNewPrice[itemId] = newPrice
    state.nowNewPrice = Object.assign({}, state.nowNewPrice)
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

    fiveData.splice(5, 0, [
      '',
      '',
      nowPrice,
      '',
      '',
    ])

    formatData = fiveData.map(function(val, key) {
      let result

      if (key < 5) {
        result = [
          '',
          '',
          val[1],
          val[2],
          val['percent'],
        ]
      }

      if (key > 5) {
        result = [
          val['percent'],
          val[0],
          val[1],
          '',
          '',
        ]
      }

      if (key == 5) {
        result = val
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