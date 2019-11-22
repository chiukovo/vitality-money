<template lang="pug">
.mainItem
  .mainItem-content
    Dialog(
      :click-type="dialog.clickType",
      :visible.sync="dialog.isOpen"
    )
    client-only
      vxe-table(
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
        //- 上升/下降 td .cell add class: '.text-up || .text-down'
        //- 閃爍效果 td .cell add class: '.border.border-up || .border-down'
        vxe-table-column(title='商品' fixed="left")
          template(slot-scope='scope') {{ scope.row['product_name'] }}
        vxe-table-column(title='倉位' fixed="left" width="50px")
          template(slot-scope='scope' v-if="typeof $store.state.uncoveredCountDetail[scope.row['product_id']] != 'undefined'")
            <span class="bg-red" v-if="$store.state.uncoveredCountDetail[scope.row['product_id']] > 0">{{ $store.state.uncoveredCountDetail[scope.row['product_id']] }}</span>
            <span class="bg-green" v-else>{{ $store.state.uncoveredCountDetail[scope.row['product_id']] }}</span>
        vxe-table-column(title='K線' width="50px")
          template(slot-scope='scope')
            a.btn-Kline(href="#" @click='clickKline(scope.row)') k線
        vxe-table-column(title='走勢' width="50px")
          template(slot-scope='scope')
            a.btn-Chart(href="#" @click='clickChart(scope.row)') 走勢
        vxe-table-column(title='成交')
          template(slot-scope='scope') {{ scope.row['newest_price'] | currency }}
        vxe-table-column(title='買進')
          template(slot-scope='scope') {{ scope.row['bp_price'] | currency }}
        vxe-table-column(title='賣出')
          template(slot-scope='scope') {{ scope.row['sp_price'] | currency}}
        vxe-table-column(title='漲跌')
          template(slot-scope='scope')
            .change-icon
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
        vxe-table-column(title='狀態' fixed="right")
          template(slot-scope='scope') {{ scope.row['state_name'] }}
</template>

<script>

import Dialog from "~/components/Dialog"
import { mapState } from 'vuex'

export default {
	data() {
	  return {
      dialog: {
        clickType: '',
        isOpen: false,
      },
	  }
	},
  computed: mapState([
    'mainItem'
  ]),
  components: {
    Dialog,
  },
  mounted() {
  },
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

      if(columnIndex == 7) {
        if (row.gain >= 0) {
          return 'text-danger'
        } else {
          return 'text-success'
        }
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

      //判斷狀態
      if(columnIndex == 15) {
        if (row.state != 2) {
          return 'text-secondary'
        }
      }
    },
  }
}
</script>