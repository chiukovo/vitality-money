<template lang='pug'>
.modals.HistoryPrices
  .page
    .header
      .header__left
        el-link(@click='$parent.handleQuote(0)' icon='el-icon-arrow-left' :underline='false') 返回
      .header__title 歷史報價(時間查詢)
    .main
      .area
        .area__header
          el-form(ref='form' label-width="80px")
            el-form-item(label='商品: ')
              el-select(placeholder='請選擇' v-model="form.itemType")
                el-option(
                  v-for="(data, key) in commidy"
                  :key="key"
                  :label="data.name"
                  :value="data.id"
                )
            el-form-item(label='開始日期:')
              el-date-picker(
                v-model='form.start',
                type='date',
                placeholder='開始日期',
                value-format="yyyy-MM-dd"
              )
            el-form-item(label='開始時間: ')
              el-time-picker(
                v-model='form.startDt'
                value-format="HH:mm:ss"
                format="HH:mm:ss"
              )
            el-form-item
              button.button(type="button" @click="query" style="width: 100%") 送出
          el-divider(content-position='left') 時間: {{ form.start }} {{ form.startDt }} ~ {{ form.end }} 23:59:59
      .area(style="height: calc(100% - 234px); overflow-y: scroll;")
        client-only
          vxe-table(
            :data='items'
            max-width="100%"
            height="100%"
            column-min-width="90"
            size="mini"
            border
            auto-resize
            highlight-current-row)
            vxe-table-column(field="time" title='市場時間' min-width='50%')
            vxe-table-column(field="submit" title='口' min-width='15%')
            vxe-table-column(field="price" title='價格' min-width='35%')
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
          _this.items = []
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