<template lang='pug'>
#history
  .history
    .history-wrap
      .history-header
      .history-content
        el-tabs(
          v-model='activeName',
          type='card',
          @tab-click='handleClick')
          el-tab-pane(:label="'買賣下單(' + buySell.length + ')'", name='tabs1')
            .history-tabs-header
              el-button(size='mini') 刪單
              el-button(size='mini') 全選
              el-button(size='mini') 全不選
            el-table.table(
              :data='buySell'
              min-width='100%'
              :height="$parent.historyTableMaxH"
              border
            )
              el-table-column(label='操作' width="150px")
                template(slot-scope='scope')
                  el-button(size='mini' v-if="scope.row.Operation[0]") 改
                  el-button(size='mini' v-if="scope.row.Operation[1]") 刪
                  el-button(size='mini' v-if="scope.row.Operation[2]" @click="doCovered(scope.row, 1)") 平倉
              el-table-column(prop='Serial', label='序號')
              el-table-column(prop='Name', label='商品')
              el-table-column(label='多空')
                template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
              el-table-column(prop='OrderPrice', label='委託價')
              el-table-column(prop='Quantity', label='口數')
              el-table-column(prop='FinalPrice', label='成交價')
              el-table-column(prop='OrderTime', label='下單時間' width="150px")
              el-table-column(prop='FinalTime', label='完成時間' width="150px")
              el-table-column(prop='Odtype', label='型別')
              el-table-column(label='損失點數')
                template(slot-scope='scope')
                  el-button(size='mini' :disabled="scope.row.Operation[0] == 0 ? true : false") {{ scope.row.LossPoint }}
              el-table-column(label='獲利點數')
                template(slot-scope='scope')
                  el-button(size='mini' :disabled="scope.row.Operation[0] == 0 ? true : false") {{ scope.row.WinPoint }}
              el-table-column(prop='State', label='狀態')
          el-tab-pane(:label="'未平倉(' + unCoverTotal + ')'", name='tabs2')
            .history-tabs-header
              el-button(size='mini') 全選
              el-button(size='mini') 全不選
            el-table.table(
              :data='uncovered'
              min-width='100%'
              :height="$parent.historyTableMaxH"
              border
            )
              el-table-column(label='操作')
                template(slot-scope='scope')
                  el-button(size='mini' v-if="scope.row.Operation[2]" @click="doCovered(scope.row, 1)") 平倉
              el-table-column(prop='Serial', label='序號')
              el-table-column(prop='Name', label='商品')
              el-table-column(label='型別')
                template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
              el-table-column(prop='FinalPrice', label='成交價')
              el-table-column(prop='Quantity', label='口數')
              el-table-column(prop='Fee', label='手續費')
              el-table-column(label='損失點數')
                template(slot-scope='scope')
                  el-button(size='mini' :disabled="scope.row.Operation[0] == 0 ? true : false") {{ scope.row.LossPoint }}
              el-table-column(label='獲利點數')
                template(slot-scope='scope')
                  el-button(size='mini' :disabled="scope.row.Operation[0] == 0 ? true : false") {{ scope.row.WinPoint }}
              el-table-column(label='倒限(利)')
                template(slot-scope='scope')
                  el-button(size='mini' :disabled="scope.row.Operation[3] == 0 ? true : false") {{ scope.row.InvertedPoint }}
              el-table-column(prop='WinPoint', label='未平損益')
              el-table-column(prop='WinPoint', label='點數')
              el-table-column(prop='Day', label='天數')
              el-table-column(prop='State', label='狀態')
          el-tab-pane(label='已平倉', name='tabs3')
            .history-tabs-header
              el-button(size='mini') 全選
              el-button(size='mini') 全不選
            el-table.table(
              :data='covered'
              min-width='100%'
              :height="$parent.historyTableMaxH"
              border
            )
              el-table-column(prop="Name" label='商品')
              el-table-column(prop="NewSerial" label='新倉序號')
              el-table-column(prop="CoverSerial" label='平倉序號')
              el-table-column(prop="NewType" label='新倉型別')
              el-table-column(prop="SerialCoveredNum" label='口數')
              el-table-column(label='多空')
                template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
              el-table-column(prop="NewPrice" label='成交價')
              el-table-column(prop="CoverPrice" label='平倉價')
              el-table-column(prop="NewDate" label='成交日期' width="150px")
              el-table-column(prop="CoverDate" label='平倉日期' width="150px")
              el-table-column(prop="WinPoint" label='點數')
              el-table-column(prop="CoverType" label='種類')
              el-table-column(prop="Fee" label='手續費')
              el-table-column(prop="WinMoney" label='損益')
          el-tab-pane(label='商品統計', name='tabs4')
            .history-tabs-header
              .col 預設額度: 
                span.text-lg.text-bold 0
              .col 今日損益: 
                //- colors class.text-danger | text-success
                span.text-lg.text-bold.text-danger -50
              .col 留倉預扣: 
                span.text-lg.text-bold 0
              .col 帳戶餘額: 
                span.text-lg.text-bold.text-infor 96,350
              .col
                el-checkbox(v-model='checked') 顯示全部
            el-table.table(
              :data='commodity'
              min-width='100%'
              :height="$parent.historyTableMaxH"
              :row-class-name="checkRowShow"
              border
            )
              el-table-column(prop="Name" label='商品名稱')
              el-table-column(label='總多')
                template(slot-scope='scope')
                  span.text-danger {{ scope.row.TotalBuySubmit　}}
              el-table-column(label='總空')
                template(slot-scope='scope')
                  span.text-success {{ scope.row.TotalSellSubmit}}
              el-table-column(label='未平倉')
                template(slot-scope='scope') {{ scope.row.RemainingBuyStock + scope.row.RemainingSellStock }}
              el-table-column(prop="TotalSubmit" label='總口數')
              el-table-column(prop="TotalFee" label='手續費合計')
              el-table-column(label='損益')
                template(slot-scope='scope')
                  span.text-success(v-if="scope.row.TotalPoint >= 0") {{ scope.row.TotalPoint}}
                  span.text-danger(v-else) {{ scope.row.TotalPoint}}
              el-table-column(label='留倉預扣')
                template(slot-scope='scope')
                  span.text-success(v-if="scope.row.RemainingWithholding >= 0") {{ scope.row.RemainingWithholding}}
                  span.text-danger(v-else) {{ scope.row.RemainingWithholding}}
          el-tab-pane(label='對帳表' name='tabs5')
            .history-tabs-header
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
            el-table.table(
              :data='accountMoneyList'
              min-width='100%'
              :height="$parent.historyTableMaxH"
              border
            )
              el-table-column(prop="Date" label='日期')
              el-table-column(prop="TouchPoint" label='預設額度')
              el-table-column(prop="RemainingMoney" label='帳戶餘額')
              el-table-column(label='今日損益')
                template(slot-scope='scope')
                  span.text-success(v-if="scope.row.TodayMoney >= 0") {{ scope.row.TodayMoney}}
                  span.text-danger(v-else) {{ scope.row.TodayMoney}}
              el-table-column(prop="TotalSubmit" label='口數')
              el-table-column(prop="Withholding" label='留倉預扣')
              el-table-column(prop="Limitpoint" label='對匯額度')
              el-table-column(prop="Uppay" label='交收')
          //-el-tab-pane(label='投顧訊息(0)', name='tabs6')
          //-el-tab-pane(label='自訂窗口', name='tabs7')
</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'
import qs from 'qs'

export default {
  data() {
    return {
      form: {
        start: '',
        end: '',
      },
      accountMoneyList: [],
      activeName: 'tabs1',
      buySell: [], //下單列表
      uncovered: [], //未平倉
      covered: [], //已平倉
      commodity: [], //商品統計
      unCoverBuySum: 0, //未平倉多單總數列表
      unCoverSellSum: 0, //未平倉空單總數
      unCoverTotal: 0, //未平倉總數
      checked: false,
      valueDateInterval: [],
    }
  },
  computed: mapState([
    'userOrder',
    'nowMainItem',
  ]),
  watch: {
    userOrder(data) {
      const allCommodity = this.$store.state.commidyArray
      let _this = this

      this.selectDayType('today')
      this.buySell = data.OrderArray
      this.uncovered = data.UncoveredArray
      this.covered = data.CoveredArray
      this.unCoverBuySum = data.UnCoverSellSum
      this.unCoverSellSum = data.UnCoverBuySum
      this.unCoverTotal = parseInt(data.UnCoverSellSum) + parseInt(data.UnCoverBuySum)

      //商品統計 加入其他
      allCommodity.forEach(function(source) {
        let pushData = {
          Name: source.Name,
          TotalBuySubmit: 0,
          TotalSellSubmit: 0,
          RemainingBuyStock: 0,
          RemainingSellStock: 0,
          TotalSubmit: 0,
          TotalFee: 0,
          TotalPoint: 0,
          RemainingWithholding: 0,
          show: false,
        }

        data.CommodityArray.forEach(function(target) {
          if (source.ID == target.ID) {
            pushData = {
              Name: target.Name,
              TotalBuySubmit: target.TotalBuySubmit,
              TotalSellSubmit: target.TotalSellSubmit,
              RemainingBuyStock: target.RemainingBuyStock,
              RemainingSellStock: target.RemainingSellStock,
              TotalSubmit: target.TotalSubmit,
              TotalFee: target.TotalFee,
              TotalPoint: target.TotalPoint,
              RemainingWithholding: target.RemainingWithholding,
              show: true,
            }
          }
        })

        _this.commodity.push(pushData)
      })
    },
    nowMainItem(mainItem) {
      //計算
      if (this.uncovered.length > 0) {
        let uncoverMoney = 0

        this.uncovered = this.uncovered.map(function(val) {
          // 取得點數現價差，要更新在未平單上
          let thisSerialPointDiff
          // 此單未平損益 (要算手續費)，要更新在未平單上
          val.thisSerialTotalMoney = 0
          // 取得價格
          let nowPrice = 0

          //Operation ( 0=>可否編輯(改口數、價格), 1 =>可否刪除, 2 => 可否平倉, 3=> 可否更新倒限利, 4=>用不到 )

          mainItem.forEach(function(mainVal) {
            if (val.ID == mainVal.product_id) {
              nowPrice = mainVal.newest_price
            }
          })

          // 取得點數現價差
          let diff = parseInt(nowPrice) - parseInt(val.FinalPrice)

          // 如果是買單
          if(val.BuyOrSell == 0) {
              // 此單未平點數
              thisSerialPointDiff = diff
              // 總共未平損益
              uncoverMoney += diff * parseInt(val.PointMoney) * parseInt(val.Quantity)
          }
          else {
              thisSerialPointDiff = diff * -1;
              uncoverMoney -= diff * parseInt(val.PointMoney) * parseInt(val.Quantity)
          }
          // 此單未平損益 (要算手續費)，要更新在未平單上
          val.thisSerialTotalMoney = thisSerialPointDiff * parseInt(val.PointMoney) * parseInt(val.Quantity) - parseInt(val.TotalFee)

          return val
        })
      }
    }
  },
  methods: {
    async query() {
      let _this = this

      if (this.form.start != '' && this.form.end != '') {
        const userId = this.$store.state.localStorage.userAuth.userId
        const token = this.$store.state.localStorage.userAuth.token
        const lang = this.$store.state.localStorage.lang

        await axios.post("/api/query_moneylist?lang=" + lang, qs.stringify({
          UserID: userId,
          Token: token,
          StartDate: this.form.start,
          EndDate: this.form.end,
          DaySelect: -1,
        }))
        .then(response => {
          const result = response.data

          if (result.Code > 0) {
            _this.accountMoneyList = result.MoneyArray
          }
        })
      }
    },
    checkRowShow({row, index}){
      if (!row.show && !this.checked) {
        return 'hide'
      }
    },
    handleClick() {

    },
    doCovered(row, count) {
      const isMobile = this.$store.state.isMobile
      const userId = this.$store.state.localStorage.userAuth.userId
      const token = this.$store.state.localStorage.userAuth.token
      let _this = this
      let sendText

      switch (count) {
        case 1:
          sendText = 't:' + userId + ',' + row.Serial + ',' + token + ',' + isMobile + ',' + row.ID
          _this.$socketOrder.send(sendText)
          break
      }
    }
  }
}
</script>