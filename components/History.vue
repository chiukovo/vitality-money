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
              :height='$parent.history',
              border)
              el-table-column(label='操作')
              el-table-column(prop='Serial', label='序號')
              el-table-column(prop='Name', label='商品')
              el-table-column(label='多空')
                template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
              el-table-column(prop='OrderPrice', label='委託價')
              el-table-column(prop='Quantity', label='口數')
              el-table-column(prop='FinalPrice', label='成交價')
              el-table-column(prop='OrderTime', label='下單時間')
              el-table-column(prop='FinalTime', label='完成時間')
              el-table-column(prop='Odtype', label='型別')
              el-table-column(prop='LossPoint', label='損失點數')
              el-table-column(prop='WinPoint', label='獲利點數')
              el-table-column(prop='State', label='狀態')
          el-tab-pane(:label="'未平倉(' + unCoverTotal + ')'", name='tabs2')
            .history-tabs-header
              el-button(size='mini') 全選
              el-button(size='mini') 全不選
            el-table.table(:data='uncovered', min-width='100%', border)
              el-table-column(label='操作')
              el-table-column(prop='Serial', label='序號')
              el-table-column(prop='Name', label='商品')
              el-table-column(label='型別')
                template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
              el-table-column(prop='FinalPrice', label='成交價')
              el-table-column(prop='Quantity', label='口數')
              el-table-column(prop='Fee', label='手續費')
              el-table-column(prop='LossPoint', label='損失點數')
              el-table-column(prop='WinPoint', label='獲利點數')
              el-table-column(prop='invertPoint', label='倒限(利)')
              el-table-column(prop='WinPoint', label='未平損益')
              el-table-column(prop='WinPoint', label='點數')
              el-table-column(prop='Day', label='天數')
              el-table-column(prop='State', label='狀態')
          el-tab-pane(label='已平倉', name='tabs3')
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
          el-tab-pane(label='對帳表' name='tabs5')
            .history-tabs-header
              .row
                .col-lg-auto
                  el-form(ref='form' size='mini' :inline='true')
                    el-form-item(label='開始日期:')
                      el-form-item
                        el-date-picker(type='date' placeholder='開始日期' v-model='valueDateInterval[0]' style="width: 130px;")
                    el-form-item(label='結束日期:')
                      el-form-item
                        el-date-picker(type='date' placeholder='結束日期' v-model='valueDateInterval[1]' style="width: 130px;")
                    el-button(size='mini') 送出
                .col-lg-auto
                  span.label 快速查詢
                  el-button(size='mini') 今日
                  el-button(size='mini') 昨日
                  el-button(size='mini') 本週
                  el-button(size='mini') 上週
                  el-button(size='mini') 上月
          el-tab-pane(label='投顧訊息(0)', name='tabs6')
          el-tab-pane(label='自訂窗口', name='tabs7')
</template>

<script>

import { mapState } from 'vuex';

export default {
  data() {
    return {
      activeName: 'tabs1',
      buySell: [], //下單列表
      uncovered: [], //未平倉
      covered: [], //已平倉
      commodity: [], //商品列表
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
      this.buySell = data.OrderArray
      this.uncovered = data.UncoveredArray
      this.covered = data.CoveredArray
      this.commodity = data.CommodityArray
      this.unCoverBuySum = data.UnCoverSellSum
      this.unCoverSellSum = data.UnCoverBuySum
      this.unCoverTotal = parseInt(data.UnCoverSellSum) + parseInt(data.UnCoverBuySum)
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
    handleClick(tab, event) {}
  }
}
</script>