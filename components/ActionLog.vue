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
            height="500"
            border)
            el-table-column(prop="Index" label='序號')
            el-table-column(prop="ActionUserAccount" label='帳號')
            el-table-column(prop="ActionType" label='動作類別')
            el-table-column(prop="ActionData" label='說明')
            el-table-column(prop="ActionTime" label='日期')
            el-table-column(prop="ActionIP" label='IP紀錄')
</template>
<script>

import dataService from '~/plugins/service/dataService.js'
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
  mixins: [dataService],
  methods: {
    async query() {
      let _this = this

      if (this.form.start != '' && this.form.end != '') {
        const userId = this.service.userInfo.userId
        const token = this.service.userInfo.token
        const lang = this.service.userInfo.lang

        await axios.post("/api/query_actionlist?lang=" + lang, qs.stringify({
          UserID: userId,
          Token: token,
          StartDate: this.form.start,
          EndDate: this.form.end,
          DaySelect: -1,
        }))
        .then(response => {
          const result = response.data

          _this.items = result.ActionArray
        })
      }
    }
  }
}
</script>