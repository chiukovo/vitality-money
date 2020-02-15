<template lang='pug'>
.userInfo
  .userInfo-header {{ userInfo.Account }} ({{ userInfo.State }})
  .userInfo-content
    table.custom__table.large
      thead.thead(style="display: none")
        tr
          th
          th
      tbody.tbody(@scroll="tbodyScroll($event)")
        tr(v-for="row in items" @click="trClick($event)")
         td(style="width: 130px") {{ row.title }}
         td(:class="checkColor(row)" style="width: 110px") {{ row.info }}
        tr(class="non-data" v-if="items.length == 0")
          td 無資料
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
      items: []
    }
  },
  computed: mapState([
    'userInfo',
    'nowMoney',
    'todayLoseWin',
  ]),
  watch: {
    userInfo() {
      this.initData()
    },
    nowMoney() {
      this.initData()
    },
    todayLoseWin() {
      this.initData()
    },
  },
  methods: {
    initData() {
      const _this = this
      const userInfo = this.userInfo

      this.items = [{
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
          info: _this.$options.filters.currency(_this.nowMoney),
        }, {
          title: '今日損益:',
          info: _this.$options.filters.currency(_this.todayLoseWin),
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
    },
    checkColor(row) {
      if(row.title == '帳戶餘額:' || row.title == '信用額度:' || row.title == '對匯額度:' || row.title == '極贏額度:') {
        return 'text__info'
      }

      if(row.title == '今日損益:') {
        if(row.info < 0) {
          return 'text__success'
        } else {
          return 'text__danger'
        }
      }
    }
  }
}
</script>