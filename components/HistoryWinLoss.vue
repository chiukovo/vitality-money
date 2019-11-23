<template lang='pug'>
.dialog
  .dialog__header
    .row
      .col-lg-auto
        el-form(ref='form' size='mini' :inline='true')
          el-form-item(label='開始日期:')
            el-form-item
              el-date-picker(type='date' placeholder='開始日期' v-model="form.start" style="width: 130px;")
          el-form-item(label='結束日期:')
            el-form-item
              el-date-picker(type='date' placeholder='結束日期' v-model="form.end" style="width: 130px;")
          button.button(@click="query") 送出
      .col-lg-auto
        span.label 快速查詢:
        button.button(@click="selectDayType('today')") 今日
        button.button(@click="selectDayType('yesterday')") 昨日
        button.button(@click="selectDayType('thisWeek')") 本週
        button.button(@click="selectDayType('beforeWeek')") 上週
        button.button(@click="selectDayType('thisMonth')") 本月
        button.button(@click="selectDayType('beforeMonth')") 上月
  .dialog__content
    client-only
      vxe-table(
        :data='items'
        max-width="100%"
        height="500"
        column-min-width="74"
        size="mini"
        align="center"
        border
        auto-resize
        highlight-current-row
        highlight-hover-row)
        vxe-table-column(field="CoverSerial" title='序號')
        vxe-table-column(field="Name" title='商品')
        vxe-table-column(field="NewSerial" title='新倉序號')
        vxe-table-column(field="NewDate" title='成交日期' width="150")
        vxe-table-column(field="NewPrice" title='成交價')
        vxe-table-column(field="CoverSerial" title='平倉序號')
        vxe-table-column(field="CoverDate" title='平倉日期' width="150")
        vxe-table-column(field="CoverPrice" title='平倉價')
        vxe-table-column(title='口數')
          template(slot-scope='scope') 1
        vxe-table-column(title='多空')
          template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
        vxe-table-column(field="NewType" title='新倉型別')
        vxe-table-column(field="CoverType" title='種類')
        vxe-table-column(field="Fee" title='手續費')
        vxe-table-column(field="Money" title='損益')
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