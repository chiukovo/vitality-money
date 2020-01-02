<template lang='pug'>
.userInfo
  .userInfo-header {{ userInfo.Account }} (正常收單)
  .userInfo-content
    client-only
      vxe-table(
        :data="tableData"
        :show-header='false'
        :cell-class-name='tableCellClassName'
        max-width="100%"
        height="100%"
        size="small"
        column-min-width="74"
        border
        auto-resize)
        vxe-table-column(field='title' show-overflow)
        vxe-table-column(field='info' show-overflow width="130")
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
      tableData: []
    }
  },
  computed: mapState([
    'userInfo',
  ]),
  watch: {
    userInfo(userInfo) {
      const _this = this

      this.tableData = [{
          title: '客戶名稱:',
          info: userInfo.Name,
        }, {
          title: '服務人員:',
          info: '',
        }, {
          title: '服務專線:',
          info: '',
        }, {
          title: '帳戶餘額:',
          info: _this.$options.filters.currency(userInfo.Money),
        }, {
          title: '今日損益:',
          info: _this.$options.filters.currency(userInfo.TodayMoney),
        }, {
          title: '信用額度:',
          info: _this.$options.filters.currency(userInfo.TouchPoint),
        }, {
          title: '對匯額度:',
          info: _this.$options.filters.currency(userInfo.ContrastPoint),
        }, {
          title: '極贏額度:',
          info: _this.$options.filters.currency(userInfo.SuperPoint),
        }, {
          title: '全商品持倉上限:',
          info: userInfo.AllStoreLimit,
        }, {
          title: '全商品每筆上限:',
          info: userInfo.DaySubmitLimit,
        }, {
          title: '全商品留倉上限:',
          info: userInfo.AllRemainingLimit,
        }, {
          title: '全商品留倉天數:',
          info: userInfo.AllDayRemaingDayLimit,
        }, {
          title: '下單前是否確認:',
          info: userInfo.SubmitConfirm ? '是' : '否',
        }, {
          title: '成交是否回報:',
          info: userInfo.SuccessConfirm ? '是' : '否',
        }, {
          title: '結算時間:',
          info: userInfo.EndTime,
        }, {
          title: '報價模式:',
          info: userInfo.PriceMode == 0 ? '整數報價' : '完整報價',
        }]
    }
  },
  methods: {
    tableCellClassName({ row, column, columnIndex }) {
      if(row.title == '帳戶餘額:' || row.title == '信用額度:' || row.title == '對匯額度:' || row.title == '極贏額度:') {
        if(columnIndex == 1) {
          return 'text__info'
        }
      }
      if(row.title == '今日損益:') {
        if(columnIndex == 1) {
          if(row.info < 0) {
            return 'text__success'
          } else {
            return 'text__danger'
          }
        }
      }
    }
  }
}
</script>