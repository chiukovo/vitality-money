<template lang='pug'>
.dialog
  .dialog__content
    client-only
      vxe-table(
        :data='items'
        max-width="100%"
        height="500px"
        column-min-width="74"
        size="mini"
        align="center"
        border
        auto-resize
        highlight-current-row
        highlight-hover-row)
        vxe-table-column(fixed="left" prop="Name" title='商品名稱')
        vxe-table-column(field="PointMoney" title='每點價格')
        vxe-table-column(field="StoreLimit" title='持倉上限')
        vxe-table-column(field="DecimalSubmitEnable" title='開放0.1口')
        vxe-table-column(field="DecimalSubmitFee" title='小於一口手續費' width="100")
        vxe-table-column(field="SixityFee" title='60秒平倉手續費' width="100")
        vxe-table-column(field="Fee" title='手續費(進/出)' width="100")
        vxe-table-column(field="SubmitMax" title='單商品每筆上限' width="100")
        vxe-table-column(field="RemaingLimit" title='單商品留倉上限' width="100")
        vxe-table-column(field="RemaingDayLimit" title='單商品留倉天數' width="100")
        vxe-table-column(field="OpenMaxPoint" title='開盤最大漲跌' width="90")
        vxe-table-column(field="SubmitMaxPoint" title='每口最大漲跌' width="90")
        vxe-table-column(field="StopPoint" title='停損利')
        vxe-table-column(title='禁新時間')
          template(slot-scope="scope") {{ scope.row.not_new_start_time1}} ~ {{ scope.row.not_new_end_time1 }}
        vxe-table-column(title='可下單時間' width="200")
          template(slot-scope="scope")
            span(v-html="scope.row.TradeTime")
        vxe-table-column(field="State" title='狀態')
        vxe-table-column(field="NotNewPercent" title='禁新')
        vxe-table-column(field="CoverPercent" title='強平')
</template>

<script>
import { mapState } from 'vuex';
export default {
  data() {
    return {
      items: [],
    }
  },
  mounted() {
    const sourceCommidyArray = this.$store.state.commidyArray
    this.getUserInfo(sourceCommidyArray)
  },
  computed: mapState([
    'commidyArray',
  ]),
  watch: {
    commidyArray(sourceCommidyArray) {
      this.getUserInfo(sourceCommidyArray)
    }
  },
  methods: {
    getUserInfo(sourceCommidyArray) {
      this.items = JSON.parse(JSON.stringify(sourceCommidyArray))
    }
  }
}
</script>