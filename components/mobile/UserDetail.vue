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
      button(:class="item.State != '正常' ? 'button__danger' : 'button__success'") {{ item.State }}
  .main
    .area(style="height: calc(100% - 50px); overflow: auto")
      .collapse(@click="open1 = !open1")
        .collapse__header 最後交易日 ({{ nowMainItem.end_date }})
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
            span.label 單商品持倉上限:
            |{{ item.StoreLimit }}
          li
            span.label 單商品每筆上限:
            |{{ item.SubmitMax }}
          li
            span.label 單商品留倉口數:
            |{{ userInfo.RemaingLimit }}
          li
            span.label 單商品留倉天數:
            |{{ item.RemaingDayLimit }}
      .collapse(@click="open3 = !open3")
        .collapse__header 交易相關參數
        ul.collapse__list(v-if="open3")
          li
            span.label 每點價格:
            |{{ item.PointMoney }}
          li
            span.label 開放0.1口:
            |{{ item.DecimalSubmitEnable ? '開啟' : '關閉' }}
          li
            span.label 小於一口手續費:
            |{{ item.DecimalSubmitFee }}
          li
            span.label 60秒平倉手續費:
            |{{ item.SixityFee }}
          li
            span.label 手續費(進/出):
            |{{ item.Fee }}
          li
            span.label 開盤最大漲跌:
            |{{ item.OpenMaxPoint }}
          li
            span.label 每口最大漲跌:
            |{{ item.SubmitMaxPoint }}
          li
            span.label 停損利:
            |{{ item.StopPoint }}
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
    'nowMainItem',
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