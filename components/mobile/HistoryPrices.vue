<template lang='pug'>
div
  .modals.conditions(v-show="conditions")
    .header
      .header__left
        el-link(@click='conditions = false' icon='el-icon-arrow-left' :underline='false') 取消返回
      .header__title 報價記錄條件設定
      .header__right
        el-button(size='mini') 確定
    .main
      .area
        .area__header
          el-form(ref='form' label-width="80px")
            el-form-item(label='開始日期:')
              input.el-input__inner(type='text' placeholder='日期' v-model="form.start")
            el-form-item(label='開始時間: ')
              input.el-input__inner(type='text' placeholder='開始時間' v-model="form.startDt")
            el-form-item(label='時間間隔: ')
              span(class='text__info') 3分鐘
            el-form-item
              button.button(type="button" @click="query" style="width: 100%") 送出
  .modals.HistoryPrices(v-show="!conditions")
    .page
      .header
        .header__left
          el-link(@click='$parent.handleQuote(0)' icon='el-icon-arrow-left' :underline='false') 返回
        .header__title 歷史報價(時間查詢)
        .header__right
          el-link(@click='conditions = true' icon='el-icon-arrow-right' :underline='false') 條件
      .main
        .area
          .area__header
            el-form(ref='form' label-width="80px")
              el-form-item(label='商品: ')
                el-select(placeholder='請選擇' v-model="form.itemType" @change="query")
                  el-option(
                    v-for="(data, key) in commidy"
                    :key="key"
                    :label="data.name"
                    :value="data.id"
                  )
        .area(style="height: calc(100% - 50px);")
          table.custom__table
            thead.thead
              tr
                th(style="width: 150px") 時間
                th 成交價
                th 單量
            tbody.tbody(@scroll="tbodyScroll($event)")
              tr(v-for="row in items" @click="trClick($event)")
                td(style="width: 150px") {{ row.time }}
                td {{ row.price }}
                td {{ row.submit }}
              tr(class="non-data" v-if="items.length == 0")
                td 無資料
</template>
<script>

import axios from 'axios'
import qs from 'qs'
import HistoryFilters from "~/components/mobile/HistoryFilters"

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
      currentPage: 1,
      conditions: false
    }
  },
  mounted () {
    //end date
    this.form.start = this.formatDate(new Date())
    this.form.end = this.formatDate(new Date())
    this.getItems()
  },
  components: {
    HistoryFilters
  },
  methods: {
    handleQuote(e) {
      this.conditions = e
    },
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
      this.conditions = false

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
            _this.computedTableContent()
          }
        })
      }
    }
  }
}
</script>