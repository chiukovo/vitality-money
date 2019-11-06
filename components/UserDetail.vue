<template lang='pug'>
  .userInfor__content
    el-table.table(
      :data='items'
      style='width: 100%'
      border)
      el-table-column(fixed, prop="Name", label='商品名稱')
      el-table-column(prop="PointMoney" label='每點價格')
      el-table-column(prop="Fee" label='手續費(進/出)')
      el-table-column(prop="SubmitMax" label='單商品每筆上限')
      el-table-column(prop="RemaingLimit" label='單商品留倉上限')
      el-table-column(prop="RemaingDayLimit" label='單商品留倉天數')
      el-table-column(prop="OpenMaxPoint" label='開盤最大漲跌')
      el-table-column(prop="SubmitMaxPoint" label='每口最大漲跌')
      el-table-column(prop="StopPoint" label='停損利')
      el-table-column(label='可下單時間' width="200")
        template(slot-scope="scope") <span v-html="scope.row.TradeTime"></span>
      el-table-column(prop="State" label='狀態')
      el-table-column(prop="NotNewPercent" label='禁新')
      el-table-column(prop="CoverPercent" label='強平')
</template>

<script>
import { mapState } from 'vuex'

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