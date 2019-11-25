<template lang='pug'>
.modals.documents
  .header
    .header__left
      el-link(@click='$parent.systemShow = 0' icon='el-icon-arrow-left' :underline='false') 返回
    .header__title
      .select.header-select
        select(v-model='selectItemId')
          option(v-for="item in mainItem" :value='item.product_id') {{ item.product_name }}
    .header__right
      button.button__primary 正常收單
  .main
    .area
      .collapse(@click="open1 = !open1")
        .collapse__header 最後交易日
        ul.collapse__list(v-if="open1")
          li
            span.label 禁止新單:
            |{{ item.NotNewPercent}}%
          li
            span.label 強制平倉:
            |{{ item.CoverPercent}}%
          li
            span.label 下單時間:
            span(v-html="item.TradeTime")
      .collapse(@click="open2 = !open2")
        .collapse__header 持倉與留倉參數
        ul.collapse__list(v-if="open2")
          li
            span.label 總口數上限(全商品):
            |{{ userInfo.DaySubmitLimit }}
          li
            span.label 總留倉口數(全商品):
            |{{ userInfo.AllRemainingLimit }}
          li
            span.label 總留倉天數(全商品):
            |{{ userInfo.AllDayRemaingDayLimit }}
          li
            span.label 單商品滿倉上限(每手):
            |{{ item.RemaingLimit }}
          li
            span.label 單商品口數上限(每手):
            |{{ item.SubmitMax }}
          li
            span.label 單商品留倉口數:
            |{{ item.StoreLimit }}
      .collapse(@click="open3 = !open3")
        .collapse__header 交易相關參數
        ul.collapse__list(v-if="open3")
          li
            span.label 每點價格:
            |{{ item.PointMoney }}
          li
            span.label 手續費(進/出):
            |{{ item.Fee }}
          li
            span.label 單商品留倉上限:
            |{{ item.RemaingLimit }}
          li
            span.label 開盤最大漲跌:
            |{{ item.OpenMaxPoint }}
          li
            span.label 每口最大漲跌:
            |{{ item.SubmitMaxPoint }}
          li
            span.label 停損利:
            |{{ item.StopPoint }}
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