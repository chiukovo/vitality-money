import { mapState } from 'vuex'

export default {
  data() {
    return {
      service: {
        userInfo: {
          userId: '',
          token: '',
          lang: '',
        },
        mainList: [],
        history: {
          buySell: [], //下單列表
          uncovered: [], //未平倉
          covered: [], //已平倉
          commodity: [], //商品統計
          unCoverBuySum: 0, //未平倉多單總數列表
          unCoverSellSum: 0, //未平倉空單總數
          unCoverTotal: 0, //未平倉總數
          multiOrderSelect: [], //全選
          allCommodity: [],
          multiDelete: [], //多檔刪除
        },
        itemDetail: {
          items0: [], //五檔揭示
          items1: [], //量價分布
          items2: [], //分價揭示
          fiveTotal: {
            more: 0,
            morePercent: 0,
            nullNum: 0,
          },
        }
      },
      borderName: ''
    }
  },
  computed: mapState([
    'userOrder',
    'nowMainItem',
    'mainItem',
    'updateMainItem',
    'nowFiveMoney',
    'clickItemId',
    'customItemSetting',
    'historyPrice',
    'nowVolumeMoney',
  ]),
  mounted() {
    this.service.userInfo.userId = this.$store.state.localStorage.userAuth.userId
    this.service.userInfo.token = this.$store.state.localStorage.userAuth.token
    this.service.userInfo.lang = this.$store.state.localStorage.lang
  },
  watch: {
    historyPrice (history) {
      let itemId = this.$store.state.clickItemId
      this.itemChange(history[itemId])
    },
    nowVolumeMoney (money) {
      let itemId = this.$store.state.clickItemId
      this.volumeChange(money[itemId])
    },
    clickItemId (itemId) {
      this.service.itemDetail.fiveTotal = {
        more: 0,
        morePercent: 0,
        nullNum: 0,
      }

      let history = this.$store.state.historyPrice[itemId]
      let fiveData = this.$store.state.nowFiveMoney[itemId]
      let volumeMoney = this.$store.state.nowVolumeMoney[itemId]
      this.service.itemDetail.items0 = []
      this.service.itemDetail.items1 = []
      this.service.itemDetail.items2 = []

      this.itemChange(history)
      this.fiveItemChange(fiveData)
      this.volumeChange(volumeMoney)
    },
    userOrder(data) {
      this.service.history.allCommodity = this.$store.state.commidyArray
      let _this = this
      this.service.history.multiDelete = []

      this.service.history.buySell = data.OrderArray
      this.service.history.uncovered = data.UncoveredArray
      this.service.history.covered = data.CoveredArray
      this.service.history.unCoverBuySum = data.UnCoverSellSum
      this.service.history.unCoverSellSum = data.UnCoverBuySum
      this.service.history.unCoverTotal = this.service.history.uncovered.length

      //全選
      this.service.history.uncovered.forEach(function(source){
        _this.service.history.multiOrderSelect[source.Serial] = false
      })

      //加入多檔刪除
      this.service.history.buySell.forEach(function(source) {
        const multiDeleteInfo = {
          itemId: source.ID,
          checked: false
        }

        _this.service.history.multiDelete.push(multiDeleteInfo)
      })

      //商品統計 加入其他
      this.service.history.allCommodity.forEach(function(source) {
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

        _this.service.history.commodity.push(pushData)
      })
    },
    nowMainItem(mainItem) {
      //計算
      if (this.service.history.uncovered.length > 0) {
        let uncoverMoney = 0

        this.service.history.uncovered = this.service.history.uncovered.map(function(val) {
          // 取得點數現價差，要更新在未平單上
          let thisSerialPointDiff
          // 此單未平損益 (要算手續費)，要更新在未平單上
          val.thisSerialTotalMoney = 0
          // 取得價格
          let nowPrice = 0

          //Operation ( 0=>可否編輯(改口數、價格), 1 =>可否刪除, 2 => 可否平倉, 3=> 可否更新倒限利, 4=>用不到 )

          mainItem.forEach(function(mainVal) {
            if (val.ID == mainVal.product_id) {
              nowPrice = mainVal.newest_price
            }
          })

          // 取得點數現價差
          let diff = parseInt(nowPrice) - parseInt(val.FinalPrice)

          // 如果是買單
          if(val.BuyOrSell == 0) {
              // 此單未平點數
              thisSerialPointDiff = diff
              // 總共未平損益
              uncoverMoney += diff * parseInt(val.PointMoney) * parseInt(val.Quantity)
          }
          else {
              thisSerialPointDiff = diff * -1;
              uncoverMoney -= diff * parseInt(val.PointMoney) * parseInt(val.Quantity)
          }
          // 此單未平損益 (要算手續費)，要更新在未平單上
          val.thisSerialTotalMoney = thisSerialPointDiff * parseInt(val.PointMoney) * parseInt(val.Quantity) - parseInt(val.TotalFee)

          return val
        })
      }
    },
    customItemSetting (setting) {
      //計算mainList
      this.computedMainList(setting)
    },
    updateMainItem (res) {
      //{商品1 第一筆成交時間} 0
      //{商品1 第一筆成交價格} 1
      //{商品1 第ㄧ筆成交量} 2
      //{商品1 第ㄧ筆成交Uniq Index} 3
      //{商品1 第二筆成交時間-第一筆成交時間} 4
      //{商品1 第二筆成交價格-第一筆成交價格} 5
      //{商品1 第二筆成交量-第一筆成交量} 6
      //{商品1 第二筆成交Uniq Index-第一筆成交Uniq Index} 7
      this.doUpdateMainItem(res)
    },
    nowFiveMoney (five) {
      //陣列第[3]：第一筆買價
      //陣列第[13]：第一筆賣價
      const _this = this
      let fiveMax = 0;
      let itemId = five[0];
      let buyCount = five[1];
      let sellCount = five[2];
      let buy = 0;
      let sell = 0;

      this.service.mainList = this.service.mainList.map(function (val) {
        if (itemId == val.product_id) {
          val.bp_price_change = val.bp_price == five[3] ? '' : _this.borderName
          val.bp_price = five[3]

          val.sp_price_change = val.sp_price == five[13] ? '' : _this.borderName
          val.sp_price = five[13]
        }

        return val
      })

      this.fiveItemChange(five[this.$store.state.clickItemId])
    },
  },
  methods: {
    computedMainList(setting) {
      const _this = this
      const mainItem = _this.$store.state.mainItem

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
        _this.$store.commit('setNowNewPrice', {itemId: val.product_id, newPrice: val.newest_price})

        result.push(val)
      })

      this.service.mainList = JSON.parse(JSON.stringify(result))
    },
    doUpdateMainItem(res) {
      const _this = this
      let itemId = res[0]
      let clickItemId = this.$store.state.clickItemId
      let nowItems = res[1].split(",").map(function(item) {
        return parseInt(item, 10)
      })

      //k線圖資料更新判斷
      let kLineData = _this.$store.state.kLineData
      //長條圖更新
      let chartData = _this.$store.state.chartData

      if (kLineData.length > 0 && itemId == clickItemId) {
        _this.updateKlineData(nowItems, kLineData)
      }

      _this.service.mainList = _this.service.mainList.map(function (val) {
        if (itemId == val.product_id) {
          //計算
          let dindex = 0;
          let prices = []
          let localTime = (nowItems[0] < 10000000) ? "0" + nowItems[0] / 100 : "" + nowItems[0] / 100
          let flocalTime = _this.formatTime(localTime)

          let nowDate = new Date();
          let fullTime = new Date(nowDate.getFullYear(), nowDate.getMonth(), nowDate.getDate(), nowItems[0] / 1000000, nowItems[0] / 10000 % 100, nowItems[0] / 100 % 100 ).getTime()

          _this.borderName = val.color == 'text-up' ? 'border border-up' : 'border border-down'

          //最高
          if (val.highest_price < nowItems[1]) {
            val.highest_price = nowItems[1]
            val.highest_price_change = _this.borderName
          } else {
            val.highest_price_change = ''
          }

          //最低
          if (val.lowest_price > nowItems[1]) {
            val.lowest_price = nowItems[1]
            val.lowest_price_change = _this.borderName
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
            _this.$store.commit('doUpdateChartData', {prices, fullTime})
          }

          //總量
          val.total_qty += nowItems[2]
          val.total_qty_change = nowItems[2] == 0 ? '' : _this.borderName
          //成交
          val.newest_price_change = val.newest_price == nowItems[1] ? '' : _this.borderName
          val.newest_price = nowItems[1]

          //寫入store 目前最新成交價錢
          _this.$store.commit('setNowNewPrice', {itemId, newPrice: nowItems[1]})

          //漲跌
          val.gain = val.newest_price - val.yesterday_close_price
          //(成交價-昨日收盤)/昨日收盤*100%
          val.gain_percent = ((val.gain / val.yesterday_close_price) * 100).toFixed(2)

          _this.$store.commit('setHistoryPrice', {itemId, prices, flocalTime})
        }

        return val
      })

      //現在items 加入store
      _this.$store.commit('setNowMainItem', _this.service.mainList)

      //store out
      _this.service.mainList = JSON.parse(JSON.stringify(_this.service.mainList))

      //remove border
      setTimeout(function() {
        _this.service.mainList = _this.service.mainList.map(function (val) {
          if (itemId == val.product_id) {
            val.highest_price_change = ''
            val.lowest_price_change = ''
            val.total_qty_change = ''
            val.newest_price_change = ''
          }

          return val
        })
      }, 500)
    },
    fiveItemChange(fiveData) {
      let _this = this

      if (typeof fiveData == 'undefined') {
        this.items0 = []
        return
      }

      if (fiveData.length > 0) {
        this.service.itemDetail.items0 = fiveData
        //計算total
        this.service.itemDetail.items0.forEach(function(val, key) {

          if (key != 5) {
            if (val[1] != '') {
              _this.service.itemDetail.fiveTotal.more += parseInt(val[1])
            }

            if (val[3] != '') {
              _this.service.itemDetail.fiveTotal.nullNum += parseInt(val[3])
            }
          }
        })

        //多勢 %
        _this.service.itemDetail.fiveTotal.morePercent = parseInt(100 / (_this.service.itemDetail.fiveTotal.more +_this.service.itemDetail.fiveTotal.nullNum) * _this.service.itemDetail.fiveTotal.more)
      }
    },
    volumeChange(money) {
      if (typeof money == 'undefined') {
        this.service.itemDetail.items1 = []
        return
      }

      if (money.length > 0) {
        this.service.itemDetail.items1 = money
      }
    },
    itemChange(history) {
      if (typeof history == 'undefined') {
        this.service.itemDetail.items2 = []
        return
      }

      if (history.length > 0) {
        this.service.itemDetail.items2 = history
      }
    },
  }
}