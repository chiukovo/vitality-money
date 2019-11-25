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
        client-only
          vxe-table(
            :data='accountMoneyList'
            max-width="100%"
            height="100%"
            column-min-width="90"
            size="mini"
            border
            auto-resize
            highlight-current-row)
            vxe-table-column(field="Date" title='日期' width="120" fixed="left")
            vxe-table-column(field="TouchPoint" title='預設額度')
            vxe-table-column(field="RemainingMoney" title='帳戶餘額')
            vxe-table-column(title='今日損益')
              template(slot-scope='scope')
                span.text__success(v-if="scope.row.TodayMoney >= 0") {{ scope.row.TodayMoney}}
                span.text__danger(v-else) {{ scope.row.TodayMoney}}
            vxe-table-column(field="TotalSubmit" title='口數')
            vxe-table-column(field="Withholding" title='留倉預扣')
            vxe-table-column(field="Limitpoint" title='對匯額度')
            vxe-table-column(field="Uppay" title='交收')
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
        await axios.post("/api/query_moneylist?lang=" + this.lang, qs.stringify({
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
          }
        })
      }
    },
  }
}
</script>