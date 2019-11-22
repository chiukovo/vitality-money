<template lang="pug">
.page
  template(v-if='UserInfoHeaderShow')
    .header-userInfo-wrap(:class="UserInfoHeaderShow ? 'isOpen' : ''")
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
        client-only
          vxe-table.table(
          :data='mainItem',
          :cell-class-name='tableCellClassName',
          @current-change="clickItem"
          max-width="100%"
          height="100%"
          size="mini"
          column-min-width="74"
          border
          auto-resize
          highlight-current-row)
            vxe-table-column(title='商品' width='86' fixed)
              template(slot-scope='scope') {{ scope.row['product_name'] }}
            vxe-table-column(title='倉位' width='50' fixed)
            //- vxe-table-column(title='K線')
              template(slot-scope='scope')
                a(href="#" @click='clickKline(scope.row)') k線
            //- vxe-table-column(title='走勢')
              template(slot-scope='scope')
                a(href="#" @click='clickChart(scope.row)') 走勢
            vxe-table-column(title='成交')
              template(slot-scope='scope') {{ scope.row['newest_price'] | currency }}
            vxe-table-column(title='買進')
              template(slot-scope='scope') {{ scope.row['bp_price'] | currency }}
            vxe-table-column(title='賣出')
              template(slot-scope='scope') {{ scope.row['sp_price'] | currency}}
            vxe-table-column(title='漲跌')
              template(slot-scope='scope')
                .table-icon
                  .icon-arrow(:class="scope.row['gain'] > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
                span {{ scope.row['gain'] }}
            vxe-table-column(title='漲跌幅')
              template(slot-scope='scope') {{ scope.row['gain_percent'] }}%
            vxe-table-column(title='總量')
              template(slot-scope='scope') {{ scope.row['total_qty'] | currency}}
            vxe-table-column(title='開盤')
              template(slot-scope='scope') {{ scope.row['open_price'] | currency}}
            vxe-table-column(title='最高')
              template(slot-scope='scope') {{ scope.row['highest_price'] | currency}}
            vxe-table-column(title='最低')
              template(slot-scope='scope') {{ scope.row['lowest_price'] | currency}}
            vxe-table-column(title='昨收盤')
              template(slot-scope='scope') {{ scope.row['yesterday_last_price'] | currency }}
            vxe-table-column(title='昨結算')
              template(slot-scope='scope') {{ scope.row['yesterday_close_price'] | currency }}
            vxe-table-column(title='狀態')
              template(slot-scope='scope') {{ scope.row['state_name'] }}
</template>

<script>

import UserInfoHeader from "~/components/mobile/UserInfoHeader"
import Dialog from "~/components/Dialog"

import { mapState } from 'vuex'

export default {
	data () {
	  return {
      UserInfoHeaderShow: true,
      dialog: {
        clickType: '',
        isOpen: false,
      },
	  }
	},
  components: {
    UserInfoHeader,
    Dialog
  },
  computed: mapState([
    'mainItem'
  ]),
  methods: {
    clickItem({ row }) {
      this.$store.commit('setClickItemId', {
        id: row.product_id,
        name: row.product_name
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