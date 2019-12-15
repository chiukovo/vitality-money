<template lang='pug'>
.modals.StoredRecords
  .page
    .header
      .header__left
        el-link(@click='$parent.handleQuote(0)' icon='el-icon-arrow-left' :underline='false') 返回
      .header__title 儲值紀錄
    .main
      .area
        .area__header
          button.button(@click="selectDayType('thisWeek')") 本週
          button.button(@click="selectDayType('beforeWeek')") 上週
          button.button(@click="selectDayType('thisMonth')") 本月
          button.button(@click="selectDayType('beforeMonth')") 上月
      client-only
        vxe-table.table(
          :data='items'
          max-width="100%"
          height="100%"
          column-min-width="90"
          size="mini"
          border
          auto-resize
          highlight-current-row)
          vxe-table-column(prop="SaveMoney" title='儲值金額')
          vxe-table-column(title='類型')
            template(slot-scope='scope') {{ scope.row['MoneyType'] == 0 ? '餘額' : '信用額度' }}
          vxe-table-column(prop="MoneyDate" title='儲值日期')
</template>
<script>

import axios from 'axios'
import qs from 'qs'

export default {
  data () {
    return {
      form: {
        start: '',
        end: '',
      },
      items: []
    }
  },
  mounted () {
    this.selectDayType('today')
  },
  methods: {
    async query() {
      let _this = this

      if (this.form.start != '' && this.form.end != '') {
        const userId = this.$store.state.localStorage.userAuth.userId
        const token = this.$store.state.localStorage.userAuth.token
        const lang = this.$store.state.localStorage.lang

        await axios.post(process.env.NUXT_ENV_API_URL + "/query_savemoneylist?lang=" + lang, qs.stringify({
          UserID: userId,
          Token: token,
          StartDate: this.form.start,
          EndDate: this.form.end,
          DaySelect: -1,
        }))
        .then(response => {
          const result = response.data

          if (result.Code == 1) {
            _this.items = result.MoneyArray
          }
        })
      }
    }
  }
}
</script>