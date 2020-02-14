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
        span.label 快速查詢
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
          th 序號
          th 帳號
          th 動作類別
          th(style="width: 200px;") 說明
          th(style="width: 130px;") 日期
          th(style="width: 130px;") IP紀錄
      tbody.tbody(@scroll="tbodyScroll($event)")
        tr(v-for="row in items" @click="trClick($event)")
          td {{ row.Index }}
          td {{ row.ActionUserAccount }}
          td {{ row.ActionType }}
          td(style="width: 200px;") {{ row.ActionData }}
          td(style="width: 130px;") {{ row.ActionTime }}
          td(style="width: 130px;") {{ row.ActionIP }}
        tr(class="non-data" v-if="items.length == 0")
          td 無資料
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
      items: [],
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

        await axios.post(process.env.NUXT_ENV_API_URL + "/query_actionlist?lang=" + lang, qs.stringify({
          UserID: userId,
          Token: token,
          StartDate: this.form.start,
          EndDate: this.form.end,
          DaySelect: -1,
        }))
        .then(response => {
          const result = response.data
          _this.items = result.ActionArray
          _this.computedTableContent()
        })
      }
    }
  }
}
</script>