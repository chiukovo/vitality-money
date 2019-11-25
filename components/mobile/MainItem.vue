<template lang="pug">
.page
  .header-userInfo(:class="UserInfoHeaderShow ? 'isOpen' : ''")
    UserInfoHeader
  .header
    .header__left
      button.button.header-button 自選商品
    .header__title 商品報價
    .header__right
      button.button.header-button(@click="UserInfoHeaderShow = !UserInfoHeaderShow")
        i.el-icon-user-solid
  .main.mainItem
    Dialog(
      :click-type="dialog.clickType",
      :visible.sync="dialog.isOpen")
    client-only
      vxe-table.table(
      :data='mainItem',
      :cell-class-name='tableCellClassName',
      @current-change="clickItem"
      max-width="100%"
      height="100%"
      column-min-width="90"
      size="mini"
      border
      auto-resize
      highlight-current-row)
        vxe-table-column(title='商品' width='86' fixed="left")
          template(slot-scope='scope') {{ scope.row['product_name'] }}
        vxe-table-column(title='倉位' width='60' fixed="left" align="center")
          template(slot-scope='scope' v-if="typeof $store.state.uncoveredCountDetail[scope.row['product_id']] != 'undefined'")
            <span class="bg__danger" v-if="$store.state.uncoveredCountDetail[scope.row['product_id']] > 0">{{ $store.state.uncoveredCountDetail[scope.row['product_id']] }}</span>
            <span class="bg__success" v-else>{{ $store.state.uncoveredCountDetail[scope.row['product_id']] }}</span>
        vxe-table-column(title='成交')
          template(slot-scope='scope')
            span(:class="scope.row['newest_price_change']") {{ scope.row['newest_price'] | currency }}
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
          template(slot-scope='scope')
            span(:class="scope.row['total_qty_change']") {{ scope.row['total_qty'] | currency }}
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
      UserInfoHeaderShow: false,
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
  watch: {
    mainItem() {
      const _this = this

      setTimeout(function(){
        const success = document.querySelectorAll("#mainItemTable .vxe-cell .border__success")
        const danger = document.querySelectorAll("#mainItemTable .vxe-cell .border__danger")

        success.forEach(function(el) {
          el.classList.remove("border")
          el.classList.remove("border__success")
        })

        danger.forEach(function(el) {
          el.classList.remove("border")
          el.classList.remove("border__danger")
        })
      }, 400)
    }
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