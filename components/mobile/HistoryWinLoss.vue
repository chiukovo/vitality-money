<template lang='pug'>
  .modals.quote
    .header
      .header__left
        el-link(@click='$parent.handleQuote(0)' icon='el-icon-arrow-left' :underline='false') 返回
      .header__title 歷史損益
        span (<span :class="totalLossWinPoint >= 0 ? 'text-success' : 'text-danger'">{{ totalLossWinPoint }}</span>)
      .header__right
    .main
      .area
        .area__header
          el-button(@click="selectDayType('thisWeek')") 本週
          el-button(@click="selectDayType('beforeWeek')") 上週
          el-button(@click="selectDayType('thisMonth')") 本月
          el-button(@click="selectDayType('beforeMonth')") 上月
        ul.area-list
          li(@click='getDetailData(name)' v-for="name in allItemsName") [{{ name }}] 口數:{{ items[name].TotalSubmit }} 手續費:{{ items[name].TotalFee }} 損益:{{ items[name].TotalPoint }}
            i.el-icon-arrow-right
        template(v-if='showDetail')
          .modals.quote__detail
            #header
              .header
                .header__left
                  el-link(@click='showDetail = false' icon='el-icon-arrow-left' :underline='false') 返回
                .header__title [{{ targetName }}] 歷史損益:{{ totalLossWinPoint }}
            #main.main
              .area
                .area__header
              client-only
                vxe-table.table(
                  :data='detail'
                  max-width="100%"
                  height="100%"
                  column-min-width="74"
                  size="mini"
                  border
                  auto-resize
                  highlight-current-row)
                  vxe-table-column(field="NewSerial" title='序號')
                  vxe-table-column(field='Name' title='商品' align='center' fixed)
                  vxe-table-column(field='SerialCoveredNum' title='口' align='center' )
                  vxe-table-column(field='TotalFee' title='手續費' align='center')
                  vxe-table-column(field='Point' title='損益' align='center')
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
    }
  },
  mounted () {
    this.selectDayType('thisWeek')
  },
  methods: {
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

        await axios.post("/api/query_moneylist_detail?lang=" + lang, qs.stringify({
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
            _this.totalLossWinPoint += parseInt(val.TotalPoint)

            if (typeof _this.items[val.Name] == 'undefined') {
              _this.items[val.Name] = []
              _this.items[val.Name] = val
              val.TotalFee = parseInt(val.TotalFee)
              val.TotalPoint = parseInt(val.TotalPoint)
              _this.allItemsName.push(val.Name)
            } else {
              _this.items[val.Name].TotalFee += parseInt(val.TotalFee)
              _this.items[val.Name].TotalPoint += parseInt(val.TotalPoint)
            }
          })

          _this.coveredArray = response.data.CoveredArray
        })
      }
    }
  }
}
</script>