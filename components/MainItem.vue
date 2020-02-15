<template lang="pug">
.mainItem
  .mainItem-content
    Dialog(
      :click-type="dialog.clickType"
      :visible.sync="dialog.isOpen"
      :size="dialog.size"
      :itemId="dialog.itemId"
    )
    table.custom__table
      thead.thead
        tr
          th 商品
          th 倉位
          th K線
          th 走勢
          th 成交
          th 買進
          th 賣出
          th 漲跌
          th 漲跌幅
          th 總量
          th 開盤
          th 最高
          th 最低
          th 昨收盤
          th 昨結算
          th 狀態
      tbody.tbody(@scroll="tbodyScroll($event, true)")
        tr(v-for="row in mainItem" v-show="!row.row_hide" @click="trClick($event); clickItem(row)")
          td
            span(class="self-item-color" @click="clickSelfItem(row)" :class="row.state_color") {{ row['product_name'] }}{{ row['monthday'] }}
          td
            .cell(v-if="typeof $store.state.uncoveredCountDetail[row['product_id']] != 'undefined'")
              span.bg__danger(v-if="$store.state.uncoveredCountDetail[row['product_id']] > 0") {{ $store.state.uncoveredCountDetail[row['product_id']] }}
              span.bg__success(v-else) {{ Math.abs($store.state.uncoveredCountDetail[row['product_id']]) }}
          td
            a.btn-Kline(href="#" @click='clickKline(row)') k線
          td
            a.btn-Chart(href="#" @click='clickChart(row)') 走勢
          td
            span(:class="[row['newest_price_change'], row.computed_color]") {{ row['newest_price'] }}
          td
            span(:class="[row['bp_price_change'], row.computed_color]") {{ row['bp_price'] }}
          td
            span(:class="[row['sp_price_change'], row.computed_color]") {{ row['sp_price'] }}
          td
            .change-icon
              .icon-arrow(:class="row['gain'] > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
            span(:class="row.computed_color") {{ row['gain'] }}
          td(:class="row.computed_color") {{ row['gain_percent'] }}%
          td
            span(:class="[row['total_qty_change'], row.computed_color]") {{ row['total_qty'] }}
          td {{ row['open_price']}}
          td {{ row['highest_price']}}
          td {{ row['lowest_price']}}
          td {{ row['yesterday_last_price'] }}
          td {{ row['yesterday_close_price'] }}
          td
            span(:class="row.state_color") {{ row.state_name }}
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
        size: '360px',
        itemId: '',
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
    const _this = this

    setTimeout(function() {
      _this.computedTableContent()
    }, 0)
  },
  methods: {
    clickItem(row) {
      //開始新的
      this.preSetClickItemId(row.product_id, row.product_name)
    },
    clickSelfItem(row) {
      this.dialog.clickType = 'userDetail'
      this.dialog.size = '86%'
      this.dialog.itemId = row.product_id
      this.dialog.isOpen = true
    },
    clickKline(row) {
      this.dialog.clickType = 'kLine'
      this.dialog.size = '360px'
      this.dialog.isOpen = true
    },
    clickChart(row) {
      //dialog
      this.dialog.clickType = 'chart'
      this.dialog.size = '360px'
      this.dialog.isOpen = true
    },
  }
}
</script>