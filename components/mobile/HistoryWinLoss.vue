<template lang='pug'>
.modals.HistoryWinLoss
  .page
    .header
      .header__left
        el-link(@click='$parent.handleQuote(0)' icon='el-icon-arrow-left' :underline='false') 返回
      .header__title 歷史損益
        span(:class="totalLossWinPoint < 0 ? 'text__success' : 'text__danger'") ({{ totalLossWinPoint | currency }})
      .header__right
    .main
      .area
        .area__header
          button(@click="changeType('thisWeek')" :class="checkTypeClass('thisWeek')") 本週
          button(@click="changeType('beforeWeek')" :class="checkTypeClass('beforeWeek')") 上週
          button(@click="changeType('thisMonth')" :class="checkTypeClass('thisMonth')") 本月
          button(@click="changeType('beforeMonth')" :class="checkTypeClass('beforeMonth')") 上月
      .area(style="height: calc(100% - 40px); overflow-y: scroll;")
        ul.area-list
          li(@click='getDetailData(name)' v-for="name in allItemsName") [{{ name }}] 口數: {{ items[name].TotalSubmit }} 手續費: {{ items[name].FeeAll }} 
            span(style="padding-left: 5px") 損益: 
            span(:class="items[name].TodayMoney > 0 ? 'text__danger' : 'text__success'") {{ items[name].TodayMoney }}
            i.el-icon-arrow-right
        template(v-if='showDetail')
          .modals.HistoryWinLoss__detail
            .page
              .header
                .header__left
                  el-link(@click='showDetail = false' icon='el-icon-arrow-left' :underline='false') 返回
                .header__title [{{ targetName }}] 歷史損益: {{ totalLossWinPoint | currency }}
              .main
                table.custom__table.large
                  thead.thead
                    tr
                      th 序號
                      th 商品
                      th 手續費
                      th 損益
                  tbody.tbody(@scroll="tbodyScroll($event)")
                    tr(v-for="row in items" @click="trClick($event)")
                      td {{ row.NewSerial }}
                      td {{ row.Name }}
                      td {{ row.TotalFee }}
                      td
                        span(:class="getMoneyColor(row['Money'])") {{ row['Money'] | currency }}
</template>
<script>

import axios from 'axios'
import qs from 'qs'

export default {
  data () {
    return {
      showDetail: false,
      form: {
        start: '',
        end: '',
      },
      items: [],
      targetName: '',
      allItemsName: [],
      detail: [],
      coveredArray: [],
      totalLossWinPoint: 0,
      type: 'thisWeek',
    }
  },
  mounted () {
    this.selectDayType('thisWeek')
  },
  methods: {
    checkTypeClass(type) {
      return this.type == type ? 'button__primary' : 'button'
    },
    changeType(type) {
      this.type = type
      this.selectDayType(type)
    },
    getDetailData(name) {
      let _this = this
      this.showDetail = true
      this.detail = []
      this.targetName = name

      this.coveredArray.forEach(function(val) {
        if (val.Name == name) {
          _this.detail.push(val)
        }
      })
    },
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
          _this.totalLossWinPoint = 0
          const commodityArray = response.data.CommodityArray
          _this.items = []
          _this.allItemsName = []

          commodityArray.forEach(function(val) {
            _this.totalLossWinPoint += parseInt(val.TodayMoney)

            if (typeof _this.items[val.Name] == 'undefined') {
              _this.items[val.Name] = []
              _this.items[val.Name] = val
              val.TotalFee = parseInt(val.TotalFee)
              val.TotalSmallFee = parseInt(val.TotalSmallFee)
              val.FeeAll = parseInt(val.TotalFee) + parseInt(val.TotalSmallFee)
              val.TodayMoney = parseInt(val.TodayMoney)
              _this.allItemsName.push(val.Name)
            } else {
              _this.items[val.Name].TotalFee += parseInt(val.TotalFee)
              _this.items[val.Name].TotalSmallFee += parseInt(val.TotalSmallFee)
              _this.items[val.Name].FeeAll += _this.items[val.Name].TotalFee + _this.items[val.Name].TotalSmallFee
              _this.items[val.Name].TodayMoney += parseInt(val.TodayMoney)
            }
          })

          _this.coveredArray = response.data.CoveredArray
          _this.computedTableContent()
        })
      }
    }
  }
}
</script>