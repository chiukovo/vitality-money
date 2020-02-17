<template lang='pug'>
.modals.quote
  .page
    .header
      .header__left
        el-link(@click='$parent.handleQuote(0)' icon='el-icon-arrow-left' :underline='false') 返回
      .header__title 對帳表
    .main
      .area
        .area__header
          button.button(@click="selectDayType('thisWeek')") 本週
          button.button(@click="selectDayType('beforeWeek')") 上週
          button.button(@click="selectDayType('thisMonth')") 本月
          button.button(@click="selectDayType('beforeMonth')") 上月
      .area(style="height: calc(100% - 40px); overflow-y: scroll;")
        table.custom__table.large
          thead.thead
            tr
              th 日期
              th(style="width: 100px") 預設額度
              th(style="width: 100px") 帳戶餘額
              th(style="width: 100px") 今日損益
              th 口數
              th(style="width: 100px") 留倉預扣
              th(style="width: 100px") 對匯額度
              th 交收
          tbody.tbody(@scroll="tbodyScroll($event)")
            tr(v-for="row in accountMoneyList" @click="trClick($event)")
              td {{ row.Date }}
              td(style="width: 100px") {{ row.TouchPoint }}
              td(style="width: 100px") {{ row.RemainingMoney }}
              td(style="width: 100px")
                span(:class="getMoneyColor(row.TodayMoney)") {{ row.TodayMoney }}
              td {{ row.TotalSubmit }}
              td(style="width: 100px") {{ row.Withholding }}
              td(style="width: 100px") {{ row.Limitpoint }}
              td {{ row.Uppay }}
            tr(class="non-data" v-if="accountMoneyList.length == 0")
              td 無資料
</template>
<script>

import axios from 'axios'
import qs from 'qs'

export default {
  data () {
    return {
      accountMoneyList: [],
      form: {
        start: '',
        end: '',
      },
    }
  },
  mounted() {
    this.userId = this.$store.state.localStorage.userAuth.userId
    this.token = this.$store.state.localStorage.userAuth.token
    this.lang = this.$store.state.localStorage.lang
    this.isMobile = this.$store.state.isMobile

    this.selectDayType('thisWeek')
    this.query()
  },
  methods: {
    async query() {
      let _this = this

      if (this.form.start != '' && this.form.end != '') {
        await axios.post(process.env.NUXT_ENV_API_URL + "/query_moneylist?lang=" + this.lang, qs.stringify({
          UserID: this.userId,
          Token: this.token,
          StartDate: this.form.start,
          EndDate: this.form.end,
          DaySelect: -1,
        }))
        .then(response => {
          const result = response.data

          if (result.Code > 0) {
            _this.accountMoneyList = result.MoneyArray
            _this.computedTableContent()
          }
        })
      }
    },
  }
}
</script>