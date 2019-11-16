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
        clickItemData: {
          id: '',
          name: '',
        },
        mainList: []
      }
    }
  },
  computed: mapState([
    'mainItem',
    'updateMainItem',
    'nowFiveMoney',
    'clickItemId',
    'customItemSetting',
  ]),
  mounted() {
    this.service.userInfo.userId = this.$store.state.localStorage.userAuth.userIdD
    this.service.userInfo.token = this.$store.state.localStorage.userAuth.token
    this.service.userInfo.lang = this.$store.state.localStorage.userAuth.lang
  },
  watch: {
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
    },
  },
  methods: {
    computedMainList(setting) {
      const _this = this
      const mainItem = _this.$store.state.mainItem

      let result = []
      _this.service.clickItemData.id = _this.$store.state.clickItemId

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

        if (val.state == 2) {
          if (val.newest_price > val.yesterday_close_price) {
            val.color = 'text-up'
            _this.borderName = 'border border-up'
          } else if (val.newest_price < val.yesterday_close_price) {
            val.color = 'text-down'
            _this.borderName = 'border border-down'
          }
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
    }
  }
}