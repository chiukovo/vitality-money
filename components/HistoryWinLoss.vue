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
          button.button(type="button" @click="query") 送出
      .col-lg-auto
        span.label 快速查詢:
        button.button(@click="selectDayType('today')") 今日
        button.button(@click="selectDayType('yesterday')") 昨日
        button.button(@click="selectDayType('thisWeek')") 本週
        button.button(@click="selectDayType('beforeWeek')") 上週
        button.button(@click="selectDayType('thisMonth')") 本月
        button.button(@click="selectDayType('beforeMonth')") 上月
  .dialog__content
    table.custom__table.large
      thead.thead
        tr
          th 新倉序號
          th(style="width: 100px;") 商品
          th 平倉序號
          th(style="width: 160px;") 成交日期
          th 成交價
          th(style="width: 160px;") 平倉日期
          th 平倉價
          th 口數
          th 多空
          th 新倉型別
          th 種類
          th 手續費
          th 損益
      tbody.tbody(@scroll="tbodyScroll($event)")
        tr(v-for="row in items" @click="trClick($event)")
          td {{ row.NewSerial }}
          td(style="width: 100px;") {{ row.Name }}
          td {{ row.CoverSerial }}
          td(style="width: 160px;") {{ row.NewDate }}
          td {{ row.NewPrice }}
          td(style="width: 160px;") {{ row.CoverDate }}
          td {{ row.CoverPrice }}
          td
            span {{ row['SerialCoveredNum'] }}
          td
            span(:class="checkBuySellColor(row)") {{ row['BuyOrSell'] == 0 ? '多' : '空' }}
          td {{ row.NewType }}
          td {{ row.CoverType }}
          td {{ row.TotalFee }}
          td
            span(:class="getMoneyColor(row['Money'])") {{ row['Money'] }}
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

        await axios.post(process.env.NUXT_ENV_API_URL + "/query_moneylist_detail?lang=" + lang, qs.stringify({
          UserID: userId,
          Token: token,
          StartDate: this.form.start,
          EndDate: this.form.end,
          DaySelect: -1,
        }))
        .then(response => {
          const result = response.data

          _this.items = result.CoveredArray
          _this.computedTableContent()
        })
      }
    }
  }
}
</script>