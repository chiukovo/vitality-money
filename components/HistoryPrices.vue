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
            el-form-item(label='開始日期:')
              el-form-item
                el-date-picker(
                  v-model='form.start',
                  type='date',
                  placeholder='開始日期',
                  value-format="yyyy-MM-dd"
                  style="width: 130px;",
                )
            el-form-item(label='開始時間: ' size='mini')
              el-time-picker(
                v-model='form.startDt'
                style="width: 132px;"
                value-format="HH:mm:ss"
                format="HH:mm:ss"
              )
            el-button(size='mini' @click="query") 送出
          el-divider(content-position='center') 時間: {{ form.start }} {{ form.startDt }} ~ {{ form.end }} 23:59:59
    .itemDetailtabs__content
      .row
        el-table.table(
          :data='items.slice((currentPage-1)*pagesize,currentPage*pagesize)'
          min-width='100%'
          border)
          el-table-column(prop="time" label='市場時間' min-width='30%')
          el-table-column(prop="submit" label='口' min-width='14%')
          el-table-column(prop="price" label='價格' min-width='28%')
      .row
        el-pagination(
          background
          layout="prev, pager, next"
          :total="total"
          @current-change="currentChange"
        )
</template>
<script>

import axios from 'axios'
import qs from 'qs'

export default {
  data () {
    return {
      form: {
        start: '',
        startDt: '00:00:00',
        end: '',
        itemType: 'TXF', //default
      },
      items: [],
      commidy: [],
      total: 0,
      pagesize: 10,
      currentPage: 1
    }
  },
  mounted () {
    //end date
    this.form.start = this.formatDate(new Date())
    this.form.end = this.formatDate(new Date())
    this.getItems()
  },
  methods: {
    currentChange(currentPage) {
      this.currentPage = currentPage;
    },
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
    },
    async query() {
      let _this = this

      if (this.form.start != '' && this.form.startDt != '') {
        const userId = this.service.userInfo.userId
        const token = this.service.userInfo.token
        const lang = this.service.userInfo.lang

        await axios.post("/api/query_com_history_data?lang=" + lang, qs.stringify({
          UserID: userId,
          Token: token,
          queryLen: 3,
          queryComId: this.form.itemType,
          queryTime: this.form.start + ' ' + this.form.startDt,
        }))
        .then(response => {
          const result = response.data

          if (result.Code == 1) {
            //計算
            let history = result.ComDataArray.split(",");
            if(history.length < 3) {
              return;
            }

            for(let i = 0; i < history.length; i += 3) {
              for(let j = i + 3;j < history.length; j += 3) {
                if(history[i] > history[j]) {
                  let temp = history[i];
                  let temp1 = history[i+1];
                  let temp2 = history[i+2];
                  history[i] = history[j];
                  history[i+1] = history[j+1];
                  history[j+2] = history[j+2];
                  history[j] = temp;
                  history[j+1] = temp1;
                  history[j+2] = temp2;
                }
              }
            }

            for(let i = 0;i < history.length; i += 3) {
              if(parseInt(history[i + 2]) > 0) {
                _this.items.push({
                  time: _this.form.start + ' ' + _this.formatTime(history[i]),
                  submit: history[i + 2],
                  price: history[i + 1],
                })
              }
            }

            _this.total= _this.items.length;
          }
        })
      }
    }
  }
}
</script>