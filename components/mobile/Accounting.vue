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
          button(@click="changeType('thisWeek')" :class="checkTypeClass('thisWeek')") 本週
          button(@click="changeType('beforeWeek')" :class="checkTypeClass('beforeWeek')") 上週
          button(@click="changeType('thisMonth')" :class="checkTypeClass('thisMonth')") 本月
          button(@click="changeType('beforeMonth')" :class="checkTypeClass('beforeMonth')") 上月
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
            vxe-table-column(title='預設額度')
              template(slot-scope='scope') {{ scope.row.TouchPoint | currency }}
            vxe-table-column(title='帳戶餘額' width="130")
              template(slot-scope='scope') {{ scope.row.RemainingMoney | currency }}
            vxe-table-column(title='今日損益' width="130")
              template(slot-scope='scope')
                span.text__success(v-if="scope.row.TodayMoney < 0") {{ scope.row.TodayMoney | currency }}
                span.text__danger(v-else) {{ scope.row.TodayMoney | currency }}
            vxe-table-column(field="TotalSubmit" title='口數')
            vxe-table-column(field="Withholding" title='留倉預扣')
            vxe-table-column(title='對匯額度')
              template(slot-scope='scope') {{ scope.row.Limitpoint | currency }}
            vxe-table-column(title='交收')
              template(slot-scope='scope') {{ scope.row.Uppay | currency }}
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
      type: 'thisWeek',
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
    checkTypeClass(type) {
      return this.type == type ? 'button__primary' : 'button'
    },
    changeType(type) {
      this.type = type
      this.selectDayType(type)
    },
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
          }
        })
      }
    },
  }
}
</script>