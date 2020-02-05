import Vue from 'vue'

let debounceChart = false
let debounceChartData = []

let debounceKChart = false
let debounceKChartData = []

export default {
  sendMessage (state, message) {
    if (state.socket.isConnected) {
      this._vm.$socket.send(message)
    } else {
      const _this = this;
      setTimeout(() => {
        _this.commit('sendMessage', message);
      }, 500);
    }
  },
  setApiExample(state, data) {
    state.apiExampleData = data
  },
  clearFiveData(state) {
    state.items0 = []
  },
  setTipsContent(state,  {text, type}) {
    state.tipsContent = text
    state.tipsType = type
    state.tipsShow = true
  },
  tipsStateChange(state, data) {
    state.tipsShow = data
  },
  setDoClapping(state, data) {
    state.doClapping = data
  },
  setClapping(state, type) {
    state.localStorage.customSetting.clapping = type
  },
  setOnRealtimeCallback(state, onRealtimeCallback) {
    state.onRealtimeCallback = onRealtimeCallback
  },
  setErrorMsgDate(state, date) {
    state.errorMsgDate = date
  },
  setHasMessage(state, data) {
    state.hasMessage = data
  },
  setSubResolution(state, subResolution) {
    state.subResolution = subResolution
  },
  setTradingViewUserSaveData(state, tradingViewUserSaveData) {
    state.localStorage.tradingViewUserSaveData = tradingViewUserSaveData
  },
  setRemember(state, { me, account, password }) {
    state.localStorage.remember.me = me

    if (me) {
      state.localStorage.remember.account = account
      state.localStorage.remember.password = password
    }
  },
  setMainItemClosedState(state, data) {
    const itemId = data[0]
    let mainItem = state.mainItem

    mainItem = mainItem.map(function(val) {
      if (val.product_id == itemId) {
        if (data[1] == '3') {
          val.state_name = '停止交易'
        } else {
          val.state_name = '未開盤'
        }
      }

      return val
    })
  },
  setMainItemOpenData(state, data) {
    const itemId = data[0]
    let mainItem = state.mainItem

    mainItem = mainItem.map(function(val) {
      if (val.product_id == itemId) {
        val.state_name = '交易中'
        val.yesterday_close_price = Number(data[1])
        val.total_qty = Number(data[2])
        val.open_price = Number(data[5])
        val.highest_price = Number(data[6])
        val.lowest_price = Number(data[7])
      }

      return val
    })
  },
  setMainItemClosedData(state, data) {
    const itemId = data[0]
    let mainItem = state.mainItem

    mainItem = mainItem.map(function(val) {
      if (val.product_id == itemId) {
        val.state_name = '未開盤'
        val.yesterday_last_price = Number(data[1])
        val.open_date_time = data[2]
        val.close_date_time = data[3]
      }

      return val
    })
  },
  setServiceMessages(state, data) {
    state.serviceMessages = data
  },
  setCustomSetting(state, type) {
    state.localStorage.customSetting[type] = !state.localStorage.customSetting[type]
  },
  setTheme(state, type) {
    state.localStorage.customSetting.theme = type
  },
  setMainStyle(state, type) {
    state.localStorage.customSetting.mainStyle = type
  },
  setCustomItemSetting(state, data) {
    state.customItemSetting = data

    //計算mainItem
    this.commit('computedMainItem')
  },
  computedMainItem(state) {
    const _this = this
    const setting = state.customItemSetting
    let mainItem = state.mainItem
    let result = []

    mainItem.forEach(function(val) {
      //確認此筆是否要隱藏
      //使用者設定
      let userHide = false
      setting.forEach(function(custom) {
        if (custom.id == val.product_id && !custom.show) {
          userHide = true
        }
      })

      if (userHide && setting.length > 0) {
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
      val.newest_time_change = ''
      val.newest_qty_change = ''
      val.gain_change = ''
      val.gain_percent_change = ''

      if (val.newest_price > val.yesterday_close_price) {
        val.color = 'text__danger'
      } else {
        val.color = 'text__success'
      }

      val.gain = val.newest_price - val.yesterday_close_price
      //(成交價-昨日收盤)/昨日收盤*100%
      val.gain_percent = ((val.gain / val.yesterday_close_price) * 100).toFixed(2)
      val.state_name = val.state == 2 ? '交易中' : '未開盤'

      //寫入store 目前最新成交價錢
      state.nowNewPrice[val.product_id] = val.newest_price

      result.push(val)
    })

    state.mainItem = result
  },
  clearUserAuth(state, data) {
    state.localStorage.userAuth = []

    //set cookie
    document.cookie = `token=`
  },
  setuserAuth(state, {
    UserId = '',
    Token = '',
    ReturnURL = '',
  }) {
    if (UserId == '' || Token == '') {
        state.localStorage.userAuth = []
    }

    //set localStorage
    state.localStorage.userAuth = {
      userId: UserId,
      token: Token,
      returnURL: ReturnURL
    }

    //set cookie
    document.cookie = `token=${Token}`

    if (state.isMobile) {
      location.href = "/mobile/home"
    } else {
      location.href = "/home"
    }
  },
  setUserInfo(state, data) {
    const _this = this
    //排序跟mainItem 一樣即可
    let formatCommidy = []
    let userArray = data.UserArray
    let firstIn = false
    let firstKey = true

    if (state.commidyArray.length == 0) {
      state.commidyArray = data.CommidyArray
      firstIn = true
    } else {
      state.commidyArray.forEach(function(source) {
        data.CommidyArray.forEach(function(commidy) {
          if (source.ID == commidy.ID) {
            formatCommidy.push(commidy)
          }
        })
      })
      state.commidyArray = formatCommidy
    }

    if (state.commidyArray.length > 0) {
      let newMainItem = []
      state.mainItem.forEach(function(val) {
        //確認此筆是否要隱藏
        let sysHide = true
        //系統設定
        state.commidyArray.forEach(function(commidyArray) {
          if (commidyArray.ID == val.product_id) {
            sysHide = false
          }
        })

        if (sysHide && state.commidyArray.length > 0 && val.product_id != 'TSLQ') {
          return
        }

        //判斷是否首次近來
        if (firstIn && firstKey) {
          if (state.clickItemId == '') {
            //send 第一筆
            _this.commit('sendMessage', 'h:' + val.product_id)
            state.clickItemId = val.product_id
            state.itemName = val.product_name

            firstIn = false
            firstKey = false
          }

          //set default now data
          _this.commit('setNowMainItem', val)
        }

        newMainItem.push(val)
      })

      state.mainItem = newMainItem
    }

    state.userInfo = userArray

    //計算userInfo
    this.commit('computedUserInfo')
  },
  computedUserInfo(state) {
    let userArray = state.userInfo
    //總未平損益
    state.totalUncoverLossWinMoney = Number(state.totalUncoverLossWinMoney)
    //轉number 已防加減錯誤
    userArray.Money = Number(userArray.Money)
    userArray.TodayMoney = Number(userArray.TodayMoney)
    userArray.TouchPoint = Number(userArray.TouchPoint)

    //帳戶餘額 UserArray.Money + 未平損益
    state.nowMoney = userArray.Money + state.totalUncoverLossWinMoney
    //今日損益 TodayMoney + 未平損益
    state.todayLoseWin = userArray.TodayMoney + state.totalUncoverLossWinMoney
  },
  setUserOrder(state, data) {
    state.userOrder = data
    let uncoveredCountDetail = []
    //計算未平倉數量
    data.UncoveredArray = data.UncoveredArray.map(function(val) {
      val.Quantity = Number(val.Quantity)

      if (typeof uncoveredCountDetail[val.ID] == 'undefined') {
        uncoveredCountDetail[val.ID] = val.Quantity
        if (val.BuyOrSell == 0) {
          uncoveredCountDetail[val.ID] = val.Quantity
        } else {
          uncoveredCountDetail[val.ID] = -1 * val.Quantity
        }
      } else {
        if (val.BuyOrSell == 0) {
          uncoveredCountDetail[val.ID] += val.Quantity
        } else {
          uncoveredCountDetail[val.ID] += -1 * val.Quantity
        }
      }

      //default
      val.thisSerialPointDiff = 0
      val.thisSerialTotalMoney = 0

      return val
    })

    state.uncoveredCountDetail = uncoveredCountDetail

    //計算歷史資料
    this.commit('setHistoryData', data)
  },
  setHistoryData(state, data) {
    state.allCommodity = data.CommodityArray
    let _this = this
    state.multiDelete = []
    state.commodity = []
    state.buySell = data.OrderArray
    state.uncovered = data.UncoveredArray
    state.covered = data.CoveredArray
    state.unCoverBuySum = data.UnCoverBuySum
    state.unCoverSellSum = data.UnCoverSellSum == 0 ? 0 : '-' + data.UnCoverSellSum
    state.unCoverTotal = state.uncovered.length
    //計算未平損益
    this.commit('computedUncovered', state.uncovered)
    //加入多檔刪除
    state.buySell = state.buySell.map(function(source) {
      const multiDeleteInfo = {
        itemId: source.ID,
        checked: false
      }

      state.multiDelete.push(multiDeleteInfo)

      //預設顯示全部
      source.show = true

      return source
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
            TodayMoney: target.TodayMoney,
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
  setOpenKchart(state, data) {
    state.openKchart = data
  },
  setTradingViewChart(state, tdChart) {
    state.tdChart = tdChart
  },
  setTradingViewSymbol(state, symbol) {
    state.symbol = symbol
  },
  setClickItemId(state, {id, name}) {
    const _this = this
    //取消before click id
    this._vm.$socket.send(this._vm.paramBcancelclickId(state.clickItemId))
    //註冊
    this._vm.$socket.send(this._vm.paramBclickId(id))
    //change now mainItem
    state.mainItem.forEach(function(val) {
      if (val.product_id == id) {
        _this.commit('setNowMainItem', val)
      }
    })

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

    if (typeof history != 'undefined') {
      this.commit('setItemChange', history)
    } else {
      state.items2 = []
    }

    if (typeof fiveData != 'undefined') {
      this.commit('setFiveItemChange', fiveData)
    } else {
      state.items0 = []
    }

    if (typeof volumeMoney != 'undefined') {
      this.commit('setVolumeChange', volumeMoney)
    } else {
      state.items1 = []
    }
  },
  setMainItem(state, data) {
    const _this = this
    const commidyArray = state.commidyArray

    //計算禁新 強平
    data = data.map(function (val) {
      let setData
      let newPoint = 0,
        cover = 0

      commidyArray.forEach(function (commidy) {
        if (val.product_id == commidy.ID) {
          newPoint = Number(commidy.NotNewPercent)
          cover = Number(commidy.CoverPercent)
        }
      })

      val.yesterday_close_price = Number(val.yesterday_close_price)

      //參考價 +- 參考價*禁新%
      val.new_point1 = val.yesterday_close_price + val.yesterday_close_price * newPoint
      val.new_point2 = val.yesterday_close_price - val.yesterday_close_price * newPoint
      val.cover_point1 = val.yesterday_close_price + val.yesterday_close_price * cover
      val.cover_point2 = val.yesterday_close_price - val.yesterday_close_price * cover

      //只放入有用到的
      setData = {
        bp_price: val.bp_price,
        bp_price_change: val.bp_price_change,
        close_date_time: val.close_date_time,
        color: val.color,
        cover_point1: val.cover_point1,
        cover_point2: val.cover_point2,
        end_date: _this._vm.formatEndDate(val.end_date),
        gain: val.gain,
        gain_change: val.gain_change,
        gain_percent: val.gain_percent,
        gain_percent_change: val.gain_percent_change,
        highest_price: val.highest_price,
        highest_price: val.highest_price,
        highest_price_change: val.highest_price_change,
        highest_price: val.highest_price,
        lowest_price: val.lowest_price,
        lowest_price_change: val.lowest_price_change,
        market: val.market,
        new_point1: val.new_point1,
        new_point2: val.new_point2,
        newest_price: val.newest_price,
        newest_price_change: val.newest_price_change,
        open_date_time: val.open_date_time,
        open_price: val.open_price,
        newest_time: _this._vm.formatTime(val.newest_time),
        newest_time_change: val.newest_time_change,
        product_id: val.product_id,
        product_name: val.product_name,
        sp_price: val.sp_price,
        sp_price_change: val.sp_price_change,
        state: val.state,
        state_name: val.state_name,
        total_qty: val.total_qty,
        newest_qty: val.newest_qty,
        newest_qty_change: val.newest_qty_change,
        total_qty_change: val.total_qty_change,
        yesterday_close_price: val.yesterday_close_price,
        yesterday_last_price: val.yesterday_last_price,
        monthday: val.monthday,
      }

      return setData
    })

    state.mainItem = data
  },
  setUpdateMainItem(state, data) {
    const _this = this

    let borderName
    let itemId = data[0]
    let clickItemId = state.clickItemId
    let nowItems = data[1].split(",").map(function(item) {
      return Number(item)
    })

    //k線圖資料更新判斷
    let kLineData = state.kLineData
    //長條圖更新
    let chartData = state.chartData

    if (kLineData.length > 0 && itemId == clickItemId) {
      _this.commit('doUpdateklLineData', nowItems)
    }

    //if click 長條圖
    if (chartData.length > 0 && itemId == clickItemId) {
      _this.commit('doUpdateChartData', nowItems)
    }

    state.mainItem = state.mainItem.map(function (val) {
      if (itemId == val.product_id) {
        //計算
        let dindex = 0
        let gain = 0
        let prices = []
        let localTime = (nowItems[0] < 10000000) ? "0" + nowItems[0] / 100 : "" + nowItems[0] / 100
        let flocalTime = _this._vm.formatTime(localTime)

        let nowDate = new Date()
        let fullTime = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), nowItems[0] / 1000000, nowItems[0] / 10000 % 100, nowItems[0] / 100 % 100 ).getTime()

        borderName = val.color == 'text__success' ? 'border border__success' : 'border border__danger'

        //最高
        if (val.highest_price < nowItems[1]) {
          val.highest_price = nowItems[1]
          val.highest_price_change = val.highest_price_change == '' ? borderName : ''
        }

        //最低
        if (val.lowest_price > nowItems[1]) {
          val.lowest_price = nowItems[1]
          val.lowest_price_change = val.lowest_price_change == '' ? borderName : ''
        }

        while(dindex < nowItems.length) {
          if(dindex > 0 && dindex + 3 < nowItems.length) {
            nowItems[0] += nowItems[dindex]
            nowItems[1] += nowItems[dindex + 1]
            nowItems[2] += nowItems[dindex + 2]
            nowItems[3] += nowItems[dindex + 3]
          }

          prices.push([nowItems[2], nowItems[1]])

          dindex += 4
        }

        //總量
        val.total_qty += nowItems[2]

        //單量
        val.newest_qty_change = val.newest_qty == nowItems[2] ? '' : borderName
        val.newest_qty = nowItems[2]

        if (val.total_qty_change == '') {
          val.total_qty_change = nowItems[2] == 0 ? '' : borderName
        } else {
          val.total_qty_change = ''
        }

        //成交
        val.newest_price_change = val.newest_price == nowItems[1] ? '' : borderName
        val.newest_price = nowItems[1]

        //寫入store 目前最新成交價錢
        state.nowNewPrice[val.product_id] = val.newest_price

        //漲跌
        gain = val.newest_price - val.yesterday_close_price
        val.gain_change = val.gain == gain ? '' : borderName
        val.gain = gain
        //(成交價-昨日收盤)/昨日收盤*100%
        val.gain_percent = ((val.gain / val.yesterday_close_price) * 100).toFixed(2)
        val.gain_percent_change = val.gain_change
        //時間
        val.newest_time_change = val.newest_time == flocalTime ? '' : borderName
        val.newest_time = flocalTime

        _this.commit('setHistoryPrice', {itemId, prices, gain, flocalTime})
      }

      //now mainItem
      if (clickItemId == val.product_id) {
        _this.commit('setNowMainItem', val)
      }

      return val
    })

    //即時報價更新
    _this.commit('newPriceChange')
  },
  newPriceChange(state) {
    const itemId = state.clickItemId

    if (itemId == '') {
      return
    }

    const newPrice = state.nowNewPrice[itemId]

    if (typeof newPrice == "undefined") {
      return
    }

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
    //總共未平損益
    state.totalUncoverLossWinMoney = 0
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
      let diff = Number(nowPrice) - Number(val.FinalPrice)
      // 如果是買單
      if (val.BuyOrSell == 0) {
          // 此單未平點數
          val.thisSerialPointDiff = diff
          // 總共未平損益
          state.totalUncoverLossWinMoney += diff * Number(val.PointMoney) * Number(val.Quantity)
      } else {
          val.thisSerialPointDiff = diff * -1
          state.totalUncoverLossWinMoney -= diff * Number(val.PointMoney) * Number(val.Quantity)
      }

      // 此單未平損益 (要算手續費)，要更新在未平單上
      val.thisSerialTotalMoney = val.thisSerialPointDiff * Number(val.PointMoney) * Number(val.Quantity)


      //也要計算買賣下單
      state.buySell = state.buySell.map(function(buySell) {
        if (buySell.Serial == val.Serial) {
          buySell.thisSerialTotalMoney = val.thisSerialTotalMoney
          buySell.thisSerialPointDiff = val.thisSerialPointDiff
        }

        return buySell
      })

      result.push(val)
    })

    state.uncovered = result

    //計算userInfo
    this.commit('computedUserInfo')
  },
  setFiveItemChange(state, fiveData) {
    let _this = this
    let itemId = state.clickItemId
    let targetNewPrice = state.nowNewPrice[itemId]

    if (typeof fiveData != "undefined" && typeof targetNewPrice != "undefined") {
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
            state.fiveTotal.more += Number(val[1])
          }

          if (val[3] != '') {
            state.fiveTotal.nullNum += Number(val[3])
          }
        }
      })

      //多勢 %
      state.fiveTotal.morePercent = Number(100 / (state.fiveTotal.more + state.fiveTotal.nullNum) * state.fiveTotal.more)
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
      let buyNum = Number(five[i * 2 + 4])
      if(fiveMax < buyNum) {
        fiveMax = buyNum
      }
      buy += buyNum
    }

    for (let i = 0; i < sellCount; i++) {
      let sellNum = Number(five[i * 2 + 4 + buyCount * 2])
      if(fiveMax < sellNum) {
        fiveMax = sellNum
      }
      sell += sellNum
    }

    let maxNum = five[1] * 2 + five[2] * 2 + 3 - 1
    let fiveData = []

    for (let i = 0; i < sellCount; i++) {
      fiveData.push(['', five[maxNum - i * 2 - 1], five[maxNum - i * 2]])
    }

    for (let i = 0; i < buyCount; i++) {
      fiveData.push([five[i * 2 + 4], five[i * 2 + 3], ''])
    }

    //計算%
    for(let num = 0; num < fiveData.length; num++) {
      if (num <= 4) {
        fiveData[num]['percent'] = Number((fiveData[num][2] / fiveMax) * 100)
      } else {
        fiveData[num]['percent'] = Number((fiveData[num][0] / fiveMax) * 100)
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

    state.nowFiveMoney[itemId] = JSON.parse(JSON.stringify(formatData))

    this.commit('setFiveItemChange', formatData)
    //陣列第[3]：第一筆買價
    //陣列第[13]：第一筆賣價
    state.mainItem = state.mainItem.map(function (val) {
      let borderName = val.color == 'text__success' ? 'border border__success' : 'border border__danger'

      if (itemId == val.product_id) {
        val.bp_price_change = val.bp_price == five[3] ? '' : borderName
        val.bp_price = five[3]

        val.sp_price_change = val.sp_price == five[13] ? '' : borderName
        val.sp_price = five[13]
      }

      return val
    })
  },
  doUpdateklLineData(state, data) {
    const _this = this
    let kLineData = state.kLineData
		let resolution = state.subResolution

		if (!resolution) {
			return
    }

    if (debounceKChart) {
      debounceKChartData = data
      return
    }

    if (!data) {
      data = debounceKChartData
    }

    debounceKChart = true
    setTimeout(() => {
      _this.commit('doUpdateklLineData')
      debounceKChart = false
    }, 500)

    const now_date = new Date()
    const nowTime = new Date(now_date.getFullYear(), now_date.getMonth(), now_date.getDate(), data[0] / 1000000, data[0] / 10000 % 100, data[0] / 100 % 100 ).getTime()
    let the_now_data = {
      time: nowTime,
      high: data[1],
      low: data[1],
      last: data[1],
      volume: data[2]
    }

    let dindex = 0
    while(dindex < data.length) {
      if(dindex > 0 && dindex + 3 < data.length) {
        the_now_data.time += data[dindex]
        the_now_data.last += data[dindex + 1]
        the_now_data.volume += data[dindex + 2]	
        if (the_now_data.high < the_now_data.last) {
          the_now_data.high = the_now_data.last
        }
        if (the_now_data.low > the_now_data.last) {
          the_now_data.low = the_now_data.last
        }
      }
      dindex += 4
    }

		if (resolution.includes('D')) {
			// 1 day in minutes === 1440
			resolution = 1440
		} else if (resolution.includes('W')) {
			// 1 week in minutes === 10080
			resolution = 10080
		}
		var coeff = resolution * 60000
		var rounded = Math.floor((the_now_data.time + 60000) / coeff) * coeff
		var lastBarSec = kLineData[kLineData.length - 1][0]

		const lastK = kLineData[kLineData.length - 1]

		if (!lastK) {
			return
		}

		let lastBar = {
			time: lastK[0],
			open: lastK[1],
			high: lastK[2],
			low: lastK[3],
			close: lastK[4],
			volume: lastK[5]
		}

		if (rounded > lastBarSec) {
			kLineData.push([
				rounded,
				the_now_data.last,
				the_now_data.last,
				the_now_data.last,
				the_now_data.last,
				0
			])
		  // create a new candle, use last close as open **PERSONAL CHOICE**
			lastBar = {
				time: rounded,
				open: the_now_data.last,
				high: the_now_data.last,
				low: the_now_data.last,
				close: the_now_data.last,
				volume: 0
			}
		} else {
			// update lastBar candle!
			if (lastBar.low > the_now_data.low) {
				lastBar.low = the_now_data.low
				lastK[3] = the_now_data.low
			} else if (lastBar.high < the_now_data.high) {
				lastBar.high = the_now_data.high
				lastK[2] = the_now_data.high
			}

			lastK[4] = the_now_data.last
			lastBar.volume = the_now_data.volume
			lastBar.close = the_now_data.last
    }

		state.onRealtimeCallback(lastBar)
  },
  doUpdateChartData(state, data) {
    const _this = this
    if (debounceChart) {
      debounceChartData = data
      return
    }

    if (!data) {
      data = debounceChartData
    }

    debounceChart = true
    setTimeout(() => {
      _this.commit('doUpdateChartData')
      debounceChart = false
    }, 500)

    let chartData = state.chartData
    let chartVolumeData = state.chartVolumeData

    const now_date = new Date()
    const nowTime = new Date(now_date.getFullYear(), now_date.getMonth(), now_date.getDate(), data[0] / 1000000, data[0] / 10000 % 100, data[0] / 100 % 100 ).getTime()
    let the_now_data = {
      time: nowTime,
      last: data[1],
      volume: data[2]
    }

    let dindex = 0
    while(dindex < data.length) {
      if(dindex > 0 && dindex + 3 < data.length) {
        the_now_data.time += data[dindex]
        the_now_data.last += data[dindex + 1]
        the_now_data.volume += data[dindex + 2]	
      }
      dindex += 4
    }

		var lastBarSec = chartData[chartData.length - 1][0]

		const lastPriceData = chartData[chartData.length - 1]
    const lastVolumeData = chartVolumeData[chartVolumeData.length - 1]
		if (!lastPriceData || !lastVolumeData) {
			return
		}

    let isNewPoint = false
		if (the_now_data.time / 1000 % 60 < lastBarSec / 1000 % 60) {
      isNewPoint = true
		} else {
      lastPriceData[0] = the_now_data.time
      lastVolumeData[0] += the_now_data.time
      lastPriceData[1] = the_now_data.last
      lastVolumeData[1] += the_now_data.volume
    }

    if (state.onChatUpdate) {
      let highest
      let lowest
      if (the_now_data.last > state.nowMainItem.highest_price) {
        highest = the_now_data.last
        lowest = state.nowMainItem.lowest_price
      } else if (the_now_data.last < state.nowMainItem.lowest_price) {
        highest = state.nowMainItem.highest_price
        lowest = the_now_data.last
      }

      state.onChatUpdate({
        isNewPoint,
        time: the_now_data.time,
        price: the_now_data.last,
        volume: lastVolumeData[1],
        highest,
        lowest,
      })
    }
  },
  onChatUpdate(state, callback) {
    state.onChatUpdate = callback
  },
  clearModalData(state) {
    state.kLineData = []
    state.chartData = []
  },
  setChartId(state, id) {
    state.chartId = id
  },
  setChartData(state, response) {
    const _this = this;
    if (!state.nowMainItem.open_date_time) {
      setTimeout(() => {
        _this.commit('setChartData', response);
      }, 2000);
      return;
    }
    state.chartData = []
    state.chartCrossData = []
    state.chartVolumeData = []
    
    const reference = state.nowMainItem.yesterday_close_price
    let open_date_time = new Date(state.nowMainItem.open_date_time).getTime()
    let close_date_time = new Date(state.nowMainItem.close_date_time).getTime()

    const code = response.data.Code
    const data = response.data.Tech
    if (code == 1) {
      const items = data.split(",")

      if (items.length > 1) {
        const dateTime = new Date(items[0]).getTime()
        let chartData = Number(items[1])

        state.chartData.push([
          dateTime,
          reference
        ])

        state.chartVolumeData.push([
          dateTime,
          0
        ])

        let last_time = 0
        let pi = parseInt(items.length / 150) * 3;
        if (pi < 3) {
          pi = 3;
        }

        let localHigh = 0;
        let localLow = 9999999;
        for (let i = 3; i < items.length - 1; i += 3) {
          const chartDateTime = dateTime + Number(items[i]) * 60000
          chartData += Number(items[i + 1])

          if (Number(items[i]) > 0) {
            if (i % pi == 0 || !state.isMobile) {
              localHigh = chartData
              localLow = chartData
              state.chartData.push([
                chartDateTime,
                chartData
              ])
              state.chartVolumeData.push([
                chartDateTime,
                Number(items[i + 2])
              ])
            } else {
              if (localHigh < chartData) {
                localHigh = chartData
                state.chartData[state.chartData.length - 1][1] = chartData
              }
              if (localLow > chartData) {
                localLow = chartData
                state.chartData[state.chartData.length - 1][1] = chartData
              }
              state.chartVolumeData[state.chartVolumeData.length - 1][1] += Number(items[i + 2])
            }
            last_time = chartDateTime
          }
        }

        if (state.chartData.length > 0) {
          if(last_time > 0 && open_date_time > last_time) {
            open_date_time = dateTime
            close_date_time = last_time
          }

          state.chartCrossData = [
            [open_date_time, reference],
            [close_date_time, reference]
          ]
        } else {
          state.chartCrossData = [
          ]
        }
      }

      this.commit('setChartId', response.id)
    }
  },
  setkLineData(state, data) {
    state.kLineData = data
  },
  setHistoryPrice(state, {itemId, prices, gain, flocalTime}) {
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
      data.gain = gain

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
        state.nowVolumeMoney[itemId].push({
          amount: val.amount,
          price: val.price,
        })
      } else {
        let needAdd = true

        state.nowVolumeMoney[itemId] = state.nowVolumeMoney[itemId].map(function(dt) {
          if (val.price == dt['price']) {
            dt['amount'] += val.amount
            needAdd = false
          }

          if (dt['amount'] > amountMax) {
            amountMax = dt['amount']
          }

          return dt
        })

        if (needAdd) {
          state.nowVolumeMoney[itemId].push({
            amount: val.amount,
            price: val.price,
          })
        }
      }
    })

    //排序
    state.nowVolumeMoney[itemId] = state.nowVolumeMoney[itemId].sort(function (a, b) {
      return a['price'] > b['price'] ? -1 : 1
    })

    //設定%數
    state.nowVolumeMoney[itemId] = state.nowVolumeMoney[itemId].map(function(dt) {
      dt['isNow'] = dt['price'] == nowPrice ? true : false
      dt['percent'] = Number((dt['amount'] / amountMax) * 100)

      return dt
    })

    //排序historyPrice
    state.historyPrice[itemId] = state.historyPrice[itemId].sort(function (a, b) {
      return a['flocalTime'] < b['flocalTime'] ? -1 : 1
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
    state.socket.reconnectError = true
  },
}