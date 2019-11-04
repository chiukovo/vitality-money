<template lang='pug'>
  .itemDetai__history
    .itemDetailtabs__header
      .row
        .col-lg-auto
          el-form(ref='form' size='mini' :inline='true')
            el-form-item(label='開始日期:')
              el-form-item
                el-date-picker(type='date' placeholder='開始日期' v-model="form.start" style="width: 130px;")
            el-form-item(label='結束日期:')
              el-form-item
                el-date-picker(type='date' placeholder='結束日期' v-model="form.end" style="width: 130px;")
            el-button(size='mini' @click="query") 送出
        .col-lg-auto
          span.label 快速查詢
          el-button(size='mini' @click="selectDayType('today')") 今日
          el-button(size='mini' @click="selectDayType('yesterday')") 昨日
          el-button(size='mini' @click="selectDayType('thisWeek')") 本週
          el-button(size='mini' @click="selectDayType('beforeWeek')") 上週
          el-button(size='mini' @click="selectDayType('thisMonth')") 本月
          el-button(size='mini' @click="selectDayType('beforeMonth')") 上月
    .itemDetailtabs__content
      .row
        .col
          el-table.table(
            :data='items'
            style='width: 100%'
            border)
            el-table-column(prop="CoverSerial" label='序號')
            el-table-column(prop="Name" label='商品')
            el-table-column(prop="NewSerial" label='新倉序號')
            el-table-column(prop="NewDate" label='成交日期' width="150")
            el-table-column(prop="NewPrice" label='成交價')
            el-table-column(prop="CoverSerial" label='平倉序號')
            el-table-column(prop="CoverDate" label='平倉日期' width="150")
            el-table-column(prop="CoverPrice" label='平倉價')
            el-table-column(label='口數')
              template(slot-scope='scope') 1
            el-table-column(label='多空')
              template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
            el-table-column(prop="NewType" label='新倉型別')
            el-table-column(prop="CoverType" label='種類')
            el-table-column(prop="Fee" label='手續費')
            el-table-column(prop="Money" label='損益')
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
    selectDayType(type) {
      let start
      let end
      const date = new Date()
      const weekday = date.getDay() || 7

      switch (type) {
        case "today":
          end = new Date()
          end.setHours(23, 59, 59)
          start = new Date(end)
          start.setTime(end.getTime() - 3600 * 1000 * 24 + 1000)
          break
        case "yesterday":
          start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
          end = start
          break
        case "thisWeek":
          end = date.getTime()
          date.setDate(date.getDate() - weekday + 1)
          start = date.getTime()
          break
        case "beforeWeek":
          date.setDate(date.getDate() - weekday + 1)
          end = date.getTime()
          date.setDate(date.getDate() - 7)
          start = date.getTime()
          break
        case "thisMonth":
          end = date.getTime()
          date.setDate(1)
          start = date.getTime()
          break
        case "beforeMonth":
          const oneDaySeconds = 3600 * 1000 * 24
          date.setDate(1)
          end = date.getTime() - oneDaySeconds
          start = end - oneDaySeconds * 30
          break
      }

      this.form.start = this.formatDate(start)
      this.form.end = this.formatDate(end)

      this.query()
    },
    async query() {
      let _this = this

      if (this.form.start != '' && this.form.end != '') {
        const userId = this.$store.state.localStorage.userAuth.userId
        const token = this.$store.state.localStorage.userAuth.token
        const lang = this.$store.state.localStorage.lang

        await axios.post("/api/query_moneylist_detail?lang=" + lang, qs.stringify({
          UserID: userId,
          Token: token,
          StartDate: this.form.start,
          EndDate: this.form.end,
          DaySelect: -1,
        }))
        .then(response => {
          const result = response.data

          _this.items = result.CoveredArray
        })
      }
    }
  }
}
</script>