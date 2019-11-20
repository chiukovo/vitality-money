<template lang="pug">
.page
  template(v-if='UserInfoHeader')
    .header-userInfo-wrap(:class="UserInfoHeader ? 'isOpen' : ''")
      UserInfoHeader
  .header
    .header__left
      el-button(size='mini') 自選商品
    .header__title 商品報價
    .header__right
      el-button( size='mini' icon='el-icon-user-solid')
  .main
    #mainItem.mainItem
      .mainItem-content
        Dialog(
          :click-type="dialog.clickType",
          :visible.sync="dialog.isOpen"
        )
        el-table.table(
        id="mainTable"
        :data='$store.state.mainItem',
        :height='$parent.allHeight.mainItem',
        :cell-class-name='tableCellClassName',
        @row-click="clickItem",
        :row-class-name="getTrClass"
        style="width: 100%"
        border)
          el-table-column(label='商品' width='86' fixed)
            template(slot-scope='scope') {{ scope.row['product_name'] }}
          el-table-column(label='倉位' width='50' fixed)
          //- el-table-column(label='K線')
            template(slot-scope='scope')
              a(href="#" @click='clickKline(scope.row)') k線
          //- el-table-column(label='走勢')
            template(slot-scope='scope')
              a(href="#" @click='clickChart(scope.row)') 走勢
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

import UserInfoHeader from "~/components/mobile/UserInfoHeader"
import Dialog from "~/components/Dialog"

import { mapState } from 'vuex'

export default {
	data () {
	  return {
      dialog: {
        UserInfoHeader: true,
        clickType: '',
        isOpen: false,
      },
	  }
	},
  components: {
    UserInfoHeader,
    Dialog
  },
  mounted() {
  },
  methods: {
    getTrClass({ row, rowIndex }) {
      if (row.product_id == this.$store.state.clickItemId) {
        return 'current-row'
      }
    },
    clickItem(item) {
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
      if(columnIndex == 2) {
        return row.color + ' ' + row.newest_price_change
      }

      if(columnIndex == 3) {
        return row.color + ' ' + row.bp_price_change
      }

      if(columnIndex == 4) {
        return row.color + ' ' + row.sp_price_change
      }

      if(columnIndex == 7) {
        return row.total_qty_change
      }

      if(columnIndex == 9) {
        return row.color + ' ' + row.highest_price_change
      }

      if(columnIndex == 10) {
        return row.color + ' ' + row.lowest_price_change
      }

      //判斷整行顏色
      if(columnIndex >= 2 && columnIndex != 7 && columnIndex != 13) {
        return row.color
      }

      //判斷狀態
      if(columnIndex == 13) {
        if (row.state != 2) {
          return 'text-secondary'
        }
      }
    },
  }
}
</script>