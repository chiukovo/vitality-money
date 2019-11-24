<template lang='pug'>
.modals.documents
  .header
    .header__left
      el-link(@click='$parent.systemShow = 0' icon='el-icon-arrow-left' :underline='false') 返回
    .header__title
      select(v-model='selectItemId' size='mini')
        option(v-for="item in mainItem" :value='item.product_id') {{ item.product_name }}
    .header__right 正常收單
  .main
    .area
      div(@click="open1 = !open1") 最後交易日
        ul(v-if="open1")
          li 禁止新單: {{ item.NotNewPercent}}%
          li 強制平倉: {{ item.CoverPercent}}%
          li 下單時間:
            span(v-html="item.TradeTime")
      div(@click="open2 = !open2") 持倉與留倉參數
        ul(v-if="open2")
          li 總口數上限(全商品): {{ userInfo.DaySubmitLimit }}
          li 總留倉口數(全商品): {{ userInfo.AllRemainingLimit }}
          li 總留倉天數(全商品): {{ userInfo.AllDayRemaingDayLimit }}
          li 單商品滿倉上限(每手): {{ item.RemaingLimit }}
          li 單商品口數上限(每手): {{ item.SubmitMax }}
          li 單商品留倉口數: {{ item.StoreLimit }}
      div(@click="open3 = !open3") 交易相關參數
        ul(v-if="open3")
          li 每點價格: {{ item.PointMoney }}
          li 手續費(進/出): {{ item.Fee }}
          li 單商品留倉上限: {{ item.RemaingLimit }}
          li 開盤最大漲跌: {{ item.OpenMaxPoint }}
          li 每口最大漲跌: {{ item.SubmitMaxPoint }}
          li 停損利: {{ item.StopPoint }}
//- .dialog
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
        vxe-table-column(field="Fee" title='手續費(進/出)')
        vxe-table-column(field="SubmitMax" title='單商品每筆上限')
        vxe-table-column(field="RemaingLimit" title='單商品留倉上限')
        vxe-table-column(field="RemaingDayLimit" title='單商品留倉天數')
        vxe-table-column(field="OpenMaxPoint" title='開盤最大漲跌')
        vxe-table-column(field="SubmitMaxPoint" title='每口最大漲跌')
        vxe-table-column(field="StopPoint" title='停損利')
        vxe-table-column(title='可下單時間' width="200")
          template(slot-scope="scope")
            span(v-html="scope.row.TradeTime")
        vxe-table-column(field="State" title='狀態')
        vxe-table-column(field="NotNewPercent" title='禁新')
        vxe-table-column(field="CoverPercent" title='強平')
</template>

<script>
import { mapState } from 'vuex'

export default {
  data() {
    return {
      item: {},
      open1: true,
      open2: true,
      open3: true,
      selectItemId: 'TXF'
    }
  },
  mounted() {
    this.getUserInfo()
  },
  computed: mapState([
    'commidyArray',
    'mainItem',
    'userInfo',
  ]),
  watch: {
    commidyArray(sourceCommidyArray) {
      this.getUserInfo(sourceCommidyArray)
    },
    selectItemId() {
      this.getUserInfo()
    },
  },
  methods: {
    getUserInfo() {
      const commidyArray = JSON.parse(JSON.stringify(this.$store.state.commidyArray))
      const _this = this
      commidyArray.forEach(function(val) {
        if (val.ID == _this.selectItemId) {
          _this.item = val
        }
      })
    }
  }
}
</script>