<template lang='pug'>
  .itemDetai__history
    .itemDetailtabs__header
      .row
        .col
          el-form(ref='form' size='mini' :inline='true')
            el-form-item(label='商品: ' size='mini')
              el-select(placeholder='請選擇' style="width: 90px;" v-model="form.itemType")
                el-option(
                  v-for="(data, key) in commidy"
                  :key="key"
                  :label="data.name"
                  :value="data.id"
                )
      .row
        .col
          el-form(ref='form' size='mini' :inline='true')
            el-form-item(label='開始日期:')
              el-form-item
                el-date-picker(v-model='form.start' type='date' placeholder='開始日期' style="width: 130px;")
            el-form-item(label='開始時間: ' size='mini')
              el-time-picker(v-model='form.startDt' style="width: 132px;")
            el-button(size='mini') 送出
          el-divider(content-position='center') 時間: {{ form.start }} {{ form.startDt }} ~ {{ form.end }} 23:59:59
    .itemDetailtabs__content
      .row
        .col-6
          el-table.table(
            :data='items'
            min-width='100%'
            border)
            el-table-column(label='市場時間' min-width='30%')
            el-table-column(label='口' min-width='14%')
            el-table-column(label='價格' min-width='28%')
            el-table-column(label='次序' min-width='28%')
        .col-6
          el-table.table(
            :data='items'
            min-width='100%'
            border)
            el-table-column(label='市場時間' min-width='30%')
            el-table-column(label='口' min-width='14%')
            el-table-column(label='價格' min-width='28%')
            el-table-column(label='次序' min-width='28%')
</template>
<script>

import axios from 'axios'
import qs from 'qs'

export default {
  data () {
    return {
      form: {
        start: '',
        startDt: '',
        end: '',
        itemType: 'TXF', //default
      },
      items: [],
      commidy: [],
    }
  },
  mounted () {
    //end date
    this.form.end = this.formatDate(new Date())
    this.getItems()
  },
  methods: {
    getItems() {
      //取得商品列表
      let commidyArray = this.$store.state.commidyArray
      commidyArray = JSON.parse(JSON.stringify(commidyArray))
      let _this = this

      commidyArray.forEach(function (val) {
        _this.commidy.push({
          name: val.Name,
          id: val.ID,
        })
      })

      console.log(_this.commidy)
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