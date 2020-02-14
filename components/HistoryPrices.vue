<template lang='pug'>
.dialog
  .dialog__header
    .row
      .col
        el-form(ref='form' size='mini' :inline='true')
          el-form-item(label='商品: ' size='mini')
            el-select(placeholder='請選擇' style="width: 90px;" v-model="form.itemType")
              el-option(
                v-for="(data, key) in $store.state.commidyArray"
                :key="key"
                :label="data.Name"
                :value="data.ID"
              )
          el-form-item(label='開始時間: ' size='mini')
            el-time-picker(
              v-model='form.startDt'
              style="width: 132px;"
              value-format="HH:mm:ss"
              format="HH:mm:ss")
          button.button(type="button" @click="query") 查詢
          .badge.badge-warning(style="margin-left: 10px;position: relative;bottom: 6px;") *3 分鐘
  .dialog__content
    .m-10
      table.custom__table.large
        thead.thead
          tr
            th 時間
            th 成交價
            th 單量
        tbody.tbody(@scroll="tbodyScroll($event)")
          tr(v-for="row in items" @click="trClick($event)")
            td {{ row.time }}
            td {{ row.price }}
            td {{ row.submit }}
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
  mounted() {
    //end date
    this.form.start = this.formatDate(new Date())
    this.form.end = this.formatDate(new Date())
  },
  watch: {
    items() {
      this.computedTableContent()
    }
  },
  methods: {
    currentChange(currentPage) {
      this.currentPage = currentPage;
    },
    async query() {
      let _this = this

      if (this.form.start != '' && this.form.startDt != '') {
        const userId = this.$store.state.localStorage.userAuth.userId
        const token = this.$store.state.localStorage.userAuth.token
        const lang = this.$store.state.localStorage.lang

        await axios.post(process.env.NUXT_ENV_API_URL + "/query_com_history_data?lang=" + lang, qs.stringify({
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

            _this.total = _this.items.length
          }
        })
      }
    }
  }
}
</script>