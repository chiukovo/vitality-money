<template lang="pug">
#mainItem.mainItem
  .mainItem-content
    Dialog(
      :click-type="dialog.clickType",
      :visible.sync="dialog.isOpen"
    )
    el-table.table(
      :data='items',
      :height='this.$parent.mainItemTable',
      :cell-class-name='tableCellClassName',
      @row-click="clickItem",
      highlight-current-row
      min-width='100%'
      border)
        //- 上升/下降 td .cell add class: '.text-up || .text-down'
        //- 閃爍效果 td .cell add class: '.border.border-up || .border-down'
        el-table-column(label='商品', fixed)
          template(slot-scope='scope') {{ scope.row['product_name'] }}
        el-table-column(label='倉位', fixed, width='50')
        el-table-column(label='K線', width='50')
          template(slot-scope='scope')
            el-button(type='text', @click='clickKline(scope.row)' size='mini') k線
        el-table-column(label='走勢', width='50')
          template(slot-scope='scope')
            el-button(type='text', @click="clickChart(scope.row)" size='mini') 走勢
        el-table-column(label='成交')
          template(slot-scope='scope') {{ scope.row['newest_price'] | currency }}
        el-table-column(label='買進')
          template(slot-scope='scope') {{ scope.row['bp_price'] | currency }}
        el-table-column(label='賣出')
          template(slot-scope='scope') {{ scope.row['sp_price'] | currency}}
        el-table-column(label='漲跌')
          template(slot-scope='scope')
            .table-icon
              .icon-arrow(:class="scope.row['gain'] > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
            span {{ scope.row['gain'] }}
        el-table-column(label='漲跌幅')
          template(slot-scope='scope') {{ scope.row['gain_percent'] }}%
        el-table-column(label='總量')
          template(slot-scope='scope') {{ scope.row['total_qty'] | currency}}
        el-table-column(label='開盤')
          template(slot-scope='scope') {{ scope.row['open_price'] | currency}}
        el-table-column(label='最高')
          template(slot-scope='scope') {{ scope.row['highest_price'] | currency}}
        el-table-column(label='最低')
          template(slot-scope='scope') {{ scope.row['lowest_price'] | currency}}
        el-table-column(label='昨收盤')
          template(slot-scope='scope') {{ scope.row['yesterday_last_price'] | currency }}
        el-table-column(label='昨結算')
          template(slot-scope='scope') {{ scope.row['yesterday_close_price'] | currency }}
        el-table-column(label='狀態')
          template(slot-scope='scope') {{ scope.row['state_name'] }}
</template>
<script>

import Dialog from "~/components/Dialog"
import { mapState } from 'vuex'

export default {
	data () {
	  return {
      dialog: {
        clickType: '',
        isOpen: false,
      },
      items: [],
      itemId: '',
      borderName: ''
	  }
	},
  components: {
    Dialog,
  },
  computed: mapState([
    'mainItem',
    'nowMainItem',
    'nowFiveMoney',
    'clickItemId',
  ]),
	watch: {
    clickItemId (id) {

    },
    mainItem (res) {
      const _this = this
      let result = []
      //計算
      res.forEach(function(val) {
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

      this.items = JSON.parse(JSON.stringify(result))
    },
    nowMainItem (res) {
      //{商品1 第一筆成交時間} 0
      //{商品1 第一筆成交價格} 1
      //{商品1 第ㄧ筆成交量} 2
      //{商品1 第ㄧ筆成交Uniq Index} 3
      //{商品1 第二筆成交時間-第一筆成交時間} 4
      //{商品1 第二筆成交價格-第一筆成交價格} 5
      //{商品1 第二筆成交量-第一筆成交量} 6
      //{商品1 第二筆成交Uniq Index-第一筆成交Uniq Index} 7
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

      _this.items = _this.items.map(function (val) {
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

      //remove border
      setTimeout(function() {
        _this.items = _this.items.map(function (val) {
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

      this.items = this.items.map(function (val) {
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
    clickItem(item) {
      this.itemId = item.product_id
      this.$store.commit('setClickItemId', {
        id: item.product_id,
        name: item.product_name
      })
    },
    clickKline(item) {
      this.$store.dispatch('CALL_QUERY_TECH', {
        'id': item.product_id,
        'type': 'kline',
        'num': 2
      })

      //dialog
      this.dialog.clickType = 'kLine'
      this.dialog.isOpen = true
    },
    clickChart(item) {
      this.$store.dispatch('CALL_QUERY_TECH', {
        'id': item.product_id,
        'type': 'minone',
        'num': 1
      })

      //dialog
      this.dialog.clickType = 'chart'
      this.dialog.isOpen = true
    },
    updateKlineData(items, kLineData) {
      const _this = this
      let clickItemId = this.$store.state.clickItemId

      _this.$store.commit('doUpdateklLineData', items)
    },
    updateChartData(items, kLineData) {
      const _this = this
      let clickItemId = this.$store.state.clickItemId

      _this.$store.commit('doUpdateChartData', items)
    },
    tableCellClassName({ row, column, columnIndex }) {
      //判斷個別顏色
      if(columnIndex == 4) {
        return row.color + ' ' + row.newest_price_change
      }

      if(columnIndex == 5) {
        return row.color + ' ' + row.bp_price_change
      }

      if(columnIndex == 6) {
        return row.color + ' ' + row.sp_price_change
      }

      if(columnIndex == 9) {
        return row.total_qty_change
      }

      if(columnIndex == 11) {
        return row.color + ' ' + row.highest_price_change
      }

      if(columnIndex == 12) {
        return row.color + ' ' + row.lowest_price_change
      }

      //判斷整行顏色
      if(columnIndex >= 4 && columnIndex != 9 && columnIndex != 15) {
        return row.color
      }
    },
  }
}
</script>