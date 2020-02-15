<template lang='pug'>
.dialog
  .dialog__content
    table.custom__table.large
      thead.thead
        tr
          th 商品名稱
          th 每點價格
          th 持倉上限
          th 開放0.1口
          th(style="width: 130px") 小於一口手續費
          th(style="width: 130px") 60秒平倉手續費
          th(style="width: 110px") 手續費(進/出)
          th(style="width: 130px") 單商品每筆上限
          th(style="width: 130px") 單商品留倉上限
          th(style="width: 130px") 單商品留倉天數
          th(style="width: 130px") 開盤最大漲跌
          th(style="width: 130px") 每口最大漲跌
          th 停損利
          th(style="width: 150px") 禁新時間
          th(style="width: 150px") 可下單時間
          th 狀態
          th 禁新
          th 強平
      tbody.tbody(@scroll="tbodyScroll($event)")
        tr(v-for="row in commidyArray" @click="trClick($event)")
          td {{ row.Name }}
          td {{ row.PointMoney }}
          td {{ row.StoreLimit }}
          td {{ row.DecimalSubmitEnable == 1 ? '是' : '否' }}
          td(style="width: 130px") {{ row.DecimalSubmitEnable == 1 ? row.DecimalSubmitFee : 0 }}
          td(style="width: 130px") {{ row.SixityFee }}
          td(style="width: 110px") {{ row.Fee }}
          td(style="width: 130px") {{ row.SubmitMax }}
          td(style="width: 130px") {{ row.RemaingLimit }}
          td(style="width: 130px") {{ row.RemaingDayLimit }}
          td(style="width: 130px") {{ row.OpenMaxPoint }}
          td(style="width: 130px") {{ row.SubmitMaxPoint }}
          td {{ row.StopPoint }}
          td(style="width: 150px") {{ row.not_new_start_time1 }} ~ {{ row.not_new_end_time1 }}
          td(style="width: 150px")
            span(v-html="row.TradeTime")
          td {{ row.State }}
          td {{ row.NotNewPercent }}
          td {{ row.CoverPercent }}
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      items: [],
    }
  },
  props: ['itemId'],
  mounted() {
    this.computedTableContent()
  },
  computed: mapState([
    'commidyArray',
  ]),
  methods: {
    tableCellClassName({ row, column, columnIndex }) {
      if (typeof this.itemId != 'undefined') {
        if (row.ID != this.itemId) {
          return 'hide'
        }
      }
    },
    checkHeight() {
      if (typeof this.itemId != 'undefined') {
        return ''
      } else {
        return 450
      }
    }
  }
}
</script>