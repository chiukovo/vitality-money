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
    let _this = this

    if (data.length > 0) {
      data.forEach(function(val){
        if (val.show && first) {
          state.clickItemId = val['id']
          state.itemName = val['name']

          _this._vm.$socket.send(_this._vm.paramBclickId(val['id']))

          first = false
        }
      })
    }
    state.customItemSetting = data

    //計算mainItem
    this.commit('computedMainItem', data)
  },
  computedMainItem(state, setting) {
    const _this = this
    const mainItem = state.mainItem

    let result = []

    mainItem.forEach(function(val) {
      //確認此筆是否要隱藏
      let hide = false
      setting.forEach(function(custom) {
        if (custom.id == val.product_id && !custom.show) {
          hide = true
        }
      })

      if (hide) {
        return
      }

      //顏色 昨收價 < 成交價 紅
      val.color = ''
      val.newest_price_change = ''
      val.bp_price_change = ''
      val.sp_price_change = ''
      val.total_qty_change = ''
      val.highest_price_change = ''
      val.lowest_price_change = ''

      if (val.newest_price > val.yesterday_close_price) {
        val.color = 'text-up'
        _this.borderName = 'border border-up'
      } else if (val.newest_price < val.yesterday_close_price) {
        val.color = 'text-down'
        _this.borderName = 'border border-down'
      }

      val.gain = val.newest_price - val.yesterday_close_price
      //(成交價-昨日收盤)/昨日收盤*100%
      val.gain_percent = ((val.gain / val.yesterday_close_price) * 100).toFixed(2)
      val.state_name = val.state == 2 ? '交易中' : '未開盤'

      //寫入store 目前最新成交價錢
      state.nowNewPrice[val.product_id] = val.newest_price

      result.push(val)
    })

    //即時報價更新
    _this.commit('newPriceChange')

    state.mainList = result
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

    state.uncoveredCountDetail = uncoveredCountDetail

    //計算歷史資料
    this.commit('setHistoryData', data)
  },
  setHistoryData(state, data) {
    state.allCommodity = state.commidyArray
    let _this = this
    state.multiDelete = []
    state.commodity = []

    state.buySell = data.OrderArray
    state.uncovered = data.UncoveredArray
    state.covered = data.CoveredArray
    state.unCoverBuySum = data.UnCoverBuySum
    state.unCoverSellSum = data.UnCoverSellSum == 0 ? 0 : '-' + data.UnCoverSellSum
    state.unCoverTotal = state.uncovered.length

    //加入多檔刪除
    state.buySell.forEach(function(source) {
      const multiDeleteInfo = {
        itemId: source.ID,
        checked: false
      }

      state.multiDelete.push(multiDeleteInfo)
    })

    //商品統計 加入其他
    state.allCommodity.forEach(function(source) {
      let pushData = {
        Name: source.Name,
        TotalBuySubmit: 0,
        TotalSellSubmit: 0,
        RemainingBuyStock: 0,
        RemainingSellStock: 0,
        TotalSubmit: 0,
        TotalFee: 0,
        TotalPoint: 0,
        RemainingWithholding: 0,
        show: false,
      }

      data.CommodityArray.forEach(function(target) {
        if (source.ID == target.ID) {
          pushData = {
            Name: target.Name,
            TotalBuySubmit: target.TotalBuySubmit,
            TotalSellSubmit: target.TotalSellSubmit,
            RemainingBuyStock: target.RemainingBuyStock,
            RemainingSellStock: target.RemainingSellStock,
            TotalSubmit: target.TotalSubmit,
            TotalFee: target.TotalFee,
            TotalPoint: target.TotalPoint,
            RemainingWithholding: target.RemainingWithholding,
            show: true,
          }
        }
      })

      state.commodity.push(pushData)
    })
  },
  setNowMainItem(state, data) {
    state.nowMainItem = data
  },
  setMobile(state, data) {
    state.isMobile = data
  },
  setClickItemId(state, {id, name}) {
    //取消before click id
    this._vm.$socket.send(this._vm.paramBcancelclickId(state.clickItemId))
    //註冊
    this._vm.$socket.send(this._vm.paramBclickId(id))

    state.clickItemId = id
    state.itemName = name

    state.fiveTotal = {
      more: 0,
      morePercent: 0,
      nullNum: 0,
    }
    let history = state.historyPrice[id]
    let fiveData = state.nowFiveMoney[id]
    let volumeMoney = state.nowVolumeMoney[id]
    state.items0 = []
    state.items1 = []
    state.items2 = []

    this.commit('setItemChange', history)
    this.commit('setFiveItemChange', fiveData)
    this.commit('setVolumeChange', volumeMoney)
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
        state.nowNewPrice[val.product_id] = val.newest_price

        //漲跌
        val.gain = val.newest_price - val.yesterday_close_price
        //(成交價-昨日收盤)/昨日收盤*100%
        val.gain_percent = ((val.gain / val.yesterday_close_price) * 100).toFixed(2)

        _this.commit('setHistoryPrice', {itemId, prices, flocalTime})
      }

      return val
    })

    //即時報價更新
    _this.commit('newPriceChange')

    //remove border
    setTimeout(function() {
      _this.commit('rmMainItemBorder')
    }, 800)
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
  newPriceChange(state) {
    const itemId = state.clickItemId

    if (itemId == '') {
      return
    }

    const newPrice = state.nowNewPrice[itemId]

    //計算未平損益
    this.commit('computedUncovered', state.uncovered)
    //更新五檔
    //量價分布
    //分價揭示
    let fiveData = state.nowFiveMoney[itemId]
    let targetNewPrice = newPrice[itemId]
    let history = state.historyPrice[itemId]
    let volumeMoney = state.nowVolumeMoney[itemId]

    if (typeof fiveData != "undefined") {
      if (fiveData[5][2] != targetNewPrice && itemId == state.clickItemId) {
        //改五檔限價
        this.commit('setFiveItemChange', fiveData)
      }
    }

    if (itemId == state.clickItemId) {
      this.commit('setItemChange', history)
      this.commit('setVolumeChange', volumeMoney)
    }
  },
  computedUncovered(state, data) {
    let nowNewPrice = state.nowNewPrice
    let uncoverMoney = 0
    let result = []
    let needAdd = true

    if (data.length == 0) {
      return
    }

    data.forEach(function(val) {
      // 取得點數現價差，要更新在未平單上
      val.thisSerialPointDiff = 0
      // 取得價格
      let nowPrice = nowNewPrice[val.ID]

      if (typeof nowPrice == 'undefined') {
        needAdd = false
      }

      // 取得點數現價差
      let diff = parseInt(nowPrice) - parseInt(val.FinalPrice)
      // 如果是買單
      if (val.BuyOrSell == 0) {
          // 此單未平點數
          val.thisSerialPointDiff = diff
          // 總共未平損益
          uncoverMoney += diff * parseInt(val.PointMoney) * parseInt(val.Quantity)
      } else {
          val.thisSerialPointDiff = diff * -1;
          uncoverMoney -= diff * parseInt(val.PointMoney) * parseInt(val.Quantity)
      }

      // 此單未平損益 (要算手續費)，要更新在未平單上
      val.thisSerialTotalMoney = val.thisSerialPointDiff * parseInt(val.PointMoney) * parseInt(val.Quantity) - parseInt(val.TotalFee)

      result.push(val)
    })

    state.uncovered = result
  },
  setFiveItemChange(state, fiveData) {
    let _this = this
    let itemId = state.clickItemId
    let targetNewPrice = state.nowNewPrice[itemId]

    if (typeof fiveData != "undefined") {
      if (fiveData[5][2] != targetNewPrice) {
        fiveData[5][2] = targetNewPrice
      }
    }

    if (typeof fiveData == 'undefined') {
      state.items0 = []
      return
    }

    if (fiveData.length > 0) {
      state.items0 = fiveData
      //計算total
      state.items0.forEach(function(val, key) {

        if (key != 5) {
          if (val[1] != '') {
            state.fiveTotal.more += parseInt(val[1])
          }

          if (val[3] != '') {
            state.fiveTotal.nullNum += parseInt(val[3])
          }
        }
      })

      //多勢 %
      state.fiveTotal.morePercent = parseInt(100 / (state.fiveTotal.more +state.fiveTotal.nullNum) * state.fiveTotal.more)
    }
  },
  setItemChange(state, history) {
    if (typeof history == 'undefined') {
      state.items2 = []
      return
    }

    if (history.length > 0) {
      state.items2 = history
    }
  },
  setVolumeChange(state, money) {
    if (typeof money == 'undefined') {
      state.items1 = []
      return
    }

    if (money.length > 0) {
      state.items1 = money
    }
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

    this.commit('setFiveItemChange', formatData)
    //陣列第[3]：第一筆買價
    //陣列第[13]：第一筆賣價
    state.mainItem = state.mainItem.map(function (val) {
      if (itemId == val.product_id) {
        val.bp_price = five[3]
        val.sp_price = five[13]
      }

      return val
    })
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

    this.commit('setItemChange', state.historyPrice[itemId])
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