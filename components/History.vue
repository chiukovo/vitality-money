<template lang='pug'>
#history
  .history(id="historyScroll")
    .history-wrap
      .history-header
      .history-content
        el-tabs(
          v-model='activeName',
          type='card',
          @tab-click='handleClick')
          el-tab-pane(:label="'買賣下單(' + buySell.length + ')'", name='tabs1')
            .history-tabs-header
              el-button(size='mini' @click="deleteConfirm = true") 刪單
            el-table.table(
              :data='service.history.buySell'
              min-width='100%'
              :height="$parent.historyTableMaxH - 30"
              @selection-change="selectionChangeDelete"
              border
            )
              el-table-column(type="selection" width="55" :selectable="selectCheckDelete")
              el-table-column(label='操作' width="90px" fixed)
                template(slot-scope='scope')
                  el-button(size='mini' v-if="scope.row.Operation[0]" @click="openEdit(scope.row)") 改
                  //-改單
                  el-button(size='mini' v-if="scope.row.Operation[1]" @click="deleteOrder(scope.row)") 刪
                  el-checkbox(v-if="scope.row.Operation[1]" v-model="service.history.multiDelete[scope.$index].checked")
                  el-button(size='mini' v-if="scope.row.Operation[2]" @click="doCovered(scope.row, 1)") 平倉
              el-table-column(prop='Serial', label='序號')
              el-table-column(prop='Name', label='商品')
              el-table-column(label='多空' width="50px")
                template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
              el-table-column(prop='OrderPrice', label='委託價')
              el-table-column(prop='Quantity', label='口數')
              el-table-column(prop='FinalPrice', label='成交價')
              el-table-column(prop='Odtype', label='型別')
              el-table-column(label='損失點數')
                template(slot-scope='scope')
                  el-button(size='mini' :disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEditPoint('lossPointDialog', scope.row)" type="success") {{ parseInt(scope.row.LossPoint) }}
              el-table-column(label='獲利點數')
                template(slot-scope='scope')
                  el-button(size='mini' :disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEditPoint('winPointDialog', scope.row)" type="danger") {{ parseInt(scope.row.WinPoint) }}
              el-table-column(prop='OrderTime', label='下單時間' width="150px")
              el-table-column(prop='FinalTime', label='完成時間' width="150px")
              el-table-column(label='狀態'  width="150px" fixed="right")
                template(slot-scope='scope')
                  span.blink(v-if="scope.row.State == '未成交'") {{ scope.row.State }}
                  span(v-else) {{ scope.row.State }}
          //-多單平倉
          el-dialog(
            :visible.sync='multiOrderConfirm'
            :modal='false'
            :show-close='false'
            width="400px"
            title='確認平倉'
            v-dialogDrag)
            .header-custom(slot='title')
              i.el-icon-info
              |  確認平倉
            el-table.table(
              :data="multiOrderData"
              min-width='100%'
              height="100px"
              border
            )
              el-table-column(prop="serial" label='序號')
              el-table-column(prop="name" label='目標商品')
              el-table-column(prop="userName" label='用戶名稱')
              el-table-column(prop="buy" label='買賣')
              el-table-column(prop="price" label='價格')
              el-table-column(prop="submit" label='口數')
            .dialog__footer
              el-button(@click="multiOrderConfirm = false") 取消
              el-button(type='primary' @click="doMultiCovered") 確認
          //-刪除
          el-dialog(
            :visible.sync='deleteConfirm'
            :modal='false'
            :show-close='false'
            width="400px"
            title='確認刪除'
            v-dialogDrag)
            .header-custom(slot='title')
              i.el-icon-info
              |  確認刪除
            el-table.table(
              :data="confirmDeleteData"
              min-width='100%'
              height="100px"
              border
            )
              el-table-column(prop="serial" label='序號')
              el-table-column(prop="name" label='目標商品')
              el-table-column(prop="userName" label='用戶名稱')
              el-table-column(prop="buy" label='買賣')
              el-table-column(prop="price" label='價格')
              el-table-column(prop="submit" label='口數')
            .dialog__footer
              el-button(@click="deleteConfirm = false") 取消
              el-button(type='primary' @click="doDelete") 確認
          //-新倒限利點數
          el-dialog(
            :visible.sync='profitPointDialog'
            :modal='false'
            width="400px"
            title='新倒限利點數'
            v-dialogDrag)
            .header-custom(slot='title') 新倒限利點數
            template
              .dialog__body
                p.text-center
                  span [{{ editPoint.name }}]
                  span 報價: 
                    span.text-bold {{ editPoint.nowPrice }}
                  span 類型: 
                    span.text-bold {{ editPoint.buyOrSellName }}
                  span 成交: 
                    span.text-bold {{ editPoint.nowPrice - editPoint.limitPoint }}
                      span(v-if="editPoint.limitPoint >= 0" class="text-danger") (+{{editPoint.limitPoint}})
                      span(v-else class="text-success") ({{editPoint.limitPoint}})
                p.text-center 新倒限利不得大於: 
                  span.text-bold.bg-colr-warring [ {{ editPoint.limitPoint }} ]
                p.text-center 新倒限利需大於會員最低停損點數: 
                  span.text-bold.bg-colr-warring [ {{ editPoint.stopPoint }} ]
                p.text-center 新倒限利
                p.text-center
                  el-button(type="mini" @click="editPoint.price -= 10") -10
                  el-button(type="mini" @click="editPoint.price -= 5") -5
                  el-input-number(v-model="editPoint.price" size="mini" style='margin: 0 4px; width: 100px')
                  el-button(type="mini" @click="editPoint.price += 5") +5
                  el-button(type="mini" @click="editPoint.price += 10") +10
                p.text-center 計算結果: 
                  span.text-bold.bg-colr-danger {{ editPoint.nowPrice - editPoint.limitPoint + editPoint.price }}
              .dialog__footer
                el-button(@click="editPoint.price = 0") 清除設定
                el-button(@click="profitPointDialog = false") 取消
                el-button(type='primary' @click="doEditPoint") 送出
          //-新獲利點數
          el-dialog(
            :visible.sync='winPointDialog'
            :modal='false'
            width="400px"
            title='新獲利點數'
            v-dialogDrag)
            .header-custom(slot='title') 新獲利點數
            template
              .dialog__body
                p.text-center
                  span [{{ editPoint.name }}]
                  span 報價: 
                    span.text-bold {{ editPoint.nowPrice }}
                  span 類型: 
                    span.text-bold {{ editPoint.buyOrSellName }}
                  span 成交: 
                    span.text-bold {{ editPoint.nowPrice - editPoint.limitPoint }}
                      span(v-if="editPoint.limitPoint >= 0" class="text-danger") (+{{editPoint.limitPoint}})
                      span(v-else class="text-success") ({{editPoint.limitPoint}})
                p.text-center 新獲利點需大於: 
                  span.text-bold.bg-colr-warring [ {{ editPoint.limitPoint }} ]
                p.text-center 新獲利點需大於會員最低停損點數: 
                  span.text-bold.bg-colr-warring [ {{ editPoint.stopPoint }} ]
                p.text-center 新獲利點
                p.text-center 
                  el-button(type="mini" @click="editPoint.price -= 10") -10
                  el-button(type="mini" @click="editPoint.price -= 5") -5
                  el-input-number(v-model="editPoint.price" size="mini" style='margin: 0 4px; width: 100px')
                  el-button(type="mini" @click="editPoint.price += 5") +5
                  el-button(type="mini" @click="editPoint.price += 10") +10
                p.text-center 計算結果: 
                  span.text-bold.bg-colr-danger {{ editPoint.nowPrice - editPoint.limitPoint + editPoint.price }}
              .dialog__footer
                el-button(@click="editPoint.price = 0") 清除設定
                el-button(@click="winPointDialog = false") 取消
                el-button(type='primary' @click="doEditPoint") 送出
          //-新損失點數
          el-dialog(
            :visible.sync='lossPointDialog'
            :modal='false'
            width="450px"
            title='新損失點數'
            v-dialogDrag)
            .header-custom(slot='title') 新損失點數
            template
              .dialog__body
                p.text-center
                  span [{{ editPoint.name }}]
                  span 報價: 
                    span.text-bold {{ editPoint.nowPrice }}
                  span 類型: 
                    span.text-bold {{ editPoint.buyOrSellName }}
                  span 成交: 
                    span.text-bold {{ editPoint.nowPrice - editPoint.limitPoint }}
                      span(v-if="editPoint.limitPoint >= 0" class="text-danger") (+{{editPoint.limitPoint}})
                      span(v-else class="text-success") ({{editPoint.limitPoint}})
                p.text-center 新損失點需大於: 
                  span.text-bold.bg-colr-warring [ {{ editPoint.limitPoint }} ]
                p.text-center 新損失點需大於會員最低停損點數: 
                  span.text-bold.bg-colr-warring [ {{ editPoint.stopPoint }} ]
                p.text-center 新損點
                p.text-center
                  el-button(type="mini" @click="editPoint.price -= 10") -10
                  el-button(type="mini" @click="editPoint.price -= 5") -5
                  el-input-number(v-model="editPoint.price" size="mini" style='margin: 0 4px; width: 100px')
                  el-button(type="mini" @click="editPoint.price += 5") +5
                  el-button(type="mini" @click="editPoint.price += 10") +10
                p.text-center 計算結果: 
                  span.text-bold.bg-colr-danger {{ editPoint.nowPrice - editPoint.limitPoint + editPoint.price }}
              .dialog__footer
                el-button(@click="editPoint.price = 0") 清除設定
                el-button(@click="lossPointDialog = false") 取消
                el-button(type='primary' @click="doEditPoint") 送出
          //-改價減量
          el-dialog(
            :visible.sync='editDialog'
            :modal='false'
            width="400px"
            title='改價減量'
            v-dialogDrag)
            .header-custom(slot='title') 改價減量
            template
              .dialog__body
                el-form(ref='form' size='mini' label-width='50px')
                  el-form-item(label="序號")
                    el-input(:value="edit.serial" :disabled="true")
                  el-form-item(label="商品")
                    el-input(:value="edit.itemName" :disabled="true")
                  el-form-item(label="會員")
                    el-input(:value="$store.state.userInfo.Account" :disabled="true")
                  el-form-item(label="買賣")
                    el-input(:value="edit.buyOrSellName" :disabled="true")
                  el-form-item(label="口數")
                    el-input-number(v-model="edit.submit" :min="1" :max="edit.submitMax")
                  el-form-item
                    el-radio(v-model='edit.buyType' label='0') 市價單
                    el-radio(v-model='edit.buyType' label='1') 限價單
                  el-form-item(label="限價" v-if="edit.buyType == '1'")
                    el-input-number(v-model="edit.nowPrice")
              .dialog__footer
                el-button(@click="editDialog = false") 取消
                el-button(type='primary' @click="doEdit") 送出
          el-tab-pane(:label="'未平倉(' + unCoverTotal + ')'", name='tabs2')
            .history-tabs-header
              el-button(size='mini' @click="openMultiOrder") 多單平倉
            el-table.table(
              :data='service.history.uncovered'
              min-width='100%'
              :height="$parent.historyTableMaxH - 30"
              ref="multipleTable"
              border
            )
              el-table-column(width="55px" fixed)
                template(slot="header" slot-scope="scope")
                  el-checkbox(v-model="multiOrderAll" @change="multiOrderAllClick")
                template(slot-scope='scope')
                  el-checkbox(v-model="service.history.multiOrderSelect[scope.row.Serial]" :value="scope.row.Serial")
              el-table-column(label='操作' fixed)
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
                  el-button(size='mini' :disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEditPoint('lossPointDialog', scope.row)" type="success") {{ scope.row.LossPoint }}
              el-table-column(label='獲利點數')
                template(slot-scope='scope')
                  el-button(size='mini' :disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEditPoint('winPointDialog', scope.row)" type="danger") {{ scope.row.WinPoint }}
              el-table-column(label='倒限(利)')
                template(slot-scope='scope')
                  el-button(size='mini' :disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEditPoint('profitPointDialog', scope.row)") {{ scope.row.InvertedPoint }}
              el-table-column(prop='WinPoint', label='未平損益')
              el-table-column(prop='WinPoint', label='點數')
              el-table-column(prop='Day', label='天數')
              el-table-column(prop='State', label='狀態' width="150px" fixed="right")
          el-tab-pane(label='已平倉', name='tabs3')
            .history-tabs-header
              el-button(size='mini') 全選
              el-button(size='mini') 全不選
            el-table.table(
              :data='covered'
              min-width='100%'
              :height="$parent.historyTableMaxH - 30"
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
                span.text-lg.text-bold {{ $store.state.userInfo.TouchPoint }}
              .col 今日損益: 
                //- colors class.text-danger | text-success
                span(v-if="$store.state.userInfo.TodayMoney < 0").text-lg.text-bold.text-danger {{ $store.state.userInfo.TodayMoney }}
                span(v-else).text-lg.text-bold.text-success {{ $store.state.userInfo.TodayMoney }}
              .col 留倉預扣: 
                span.text-lg.text-bold {{ $store.state.userInfo.WithholdingMoney }}
              .col 帳戶餘額: 
                span.text-lg.text-bold.text-infor {{ $store.state.userInfo.Money }}
              .col
                el-checkbox(v-model='checked') 顯示全部
            el-table.table(
              :data='service.history.commodity'
              min-width='100%'
              :height="$parent.historyTableMaxH - 30"
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
                template(slot-scope='scope') {{ uncovered.length }}
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
              :height="$parent.historyTableMaxH - 30"
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
import dataService from '~/plugins/service/dataService.js'

export default {
  data() {
    return {
      isMobile: '',
      userId: '',
      token: '',
      lang: '',
      form: {
        start: '',
        end: '',
      },
      edit: {
        itemId: '',
        serial: '',
        itemName: '',
        submit: 0,
        submitMax: 0,
        buyType: '',
        sourceBuyType: '',
        buyOrSellName: '',
        nowPrice: 0,
      },
      editPoint: {
        name: '',
        type: '',
        itemId: '',
        serial: '',
        price: 0,
        nowPrice: 0,
        limitPoint: 0,
        stopPoint: 0,
        buyOrSellName: '',
        needLimit: true,
      },
      confirmDeleteData: [],
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
      editDialog: false,
      deleteConfirm: false,
      multiOrderConfirm: false,
      lossPointDialog: false,
      winPointDialog: false,
      profitPointDialog: false,
      valueDateInterval: [],
      allCommodity: [],
      openEditPointRow: [],
      selectToDelete: [],
      multiOrderData: [],
      multiOrderAll: false,
    }
  },
  mixins: [dataService],
  computed: mapState([
    'nowMainItem',
  ]),
  watch: {
    nowMainItem(mainItem) {
      //有editPoint資料就要更新更新
      if (this.editPoint.itemId != '') {
        this.udpateEditPointData(this.editPoint.type, this.openEditPointRow)
      }
    }
  },
  mounted() {
    this.selectDayType('today')
    this.userId = this.service.userInfo.userId
    this.token = this.service.userInfo.token
    this.lang = this.service.userInfo.lang
    this.isMobile = this.$store.state.isMobile
  },
  methods: {
    async query() {
      let _this = this

      if (this.form.start != '' && this.form.end != '') {
        const userId = this.service.userInfo.userId
        const token = this.service.userInfo.token
        const lang = this.service.userInfo.lang

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
    openMultiOrder() {
      let _this = this
      this.multiOrderData = []

      _this.service.history.multiOrderSelect.forEach(function(val, serial) {
        _this.uncovered.forEach(function(row) {
          if (row.Serial == serial && val) {
            _this.multiOrderData.push({
              name: _this.$store.state.itemName,
              userName: _this.$store.state.userInfo.Account,
              buy: row.BuyOrSell == 0 ? '多' : '空',
              price: row.Odtype,
              submit: row.Quantity,
              itemId: row.ID,
              serial: row.Serial,
            })
          }
        })
      })

      this.multiOrderConfirm = true
    },
    multiOrderAllClick() {
      let _this = this

      _this.service.history.multiOrderSelect = _this.service.history.multiOrderSelect.map(function() {
        if (!_this.multiOrderAll) {
          return false
        } else {
          return true
        }
        return false
      })
    },
    selectCheckDelete(row) {
      if (row.Operation[0]) {
        return true
      }

      return false
    },
    selectionChangeDelete(target) {
      let _this = this
      this.confirmDeleteData = []

      target.forEach(function(row) {
        _this.confirmDeleteData.push({
          name: _this.$store.state.itemName,
          userName: _this.$store.state.userInfo.Account,
          buy: row.BuyOrSell == 0 ? '多' : '空',
          price: row.Odtype,
          submit: row.Quantity,
          itemId: row.ID,
          serial: row.Serial,
        })
      })
    },
    checkRowShow({row, index}) {
      if (!row.show && !this.checked) {
        return 'hide'
      }
    },
    openEditPoint(type, row) {
      this.openEditPointRow = row
      this.udpateEditPointData(type, row)
      //新損
      if (type == 'lossPointDialog') {
        this.editPoint.price = row.LossPoint
        this.lossPointDialog = true
      } else if (type == 'winPointDialog') {
        this.editPoint.price = row.WinPoint
        this.winPointDialog = true
      } else if (type == 'profitPointDialog') {
        this.editPoint.price = row.InvertedPoint
        this.profitPointDialog = true
      }
    },
    udpateEditPointData(type, row) {
      //商品現價
      const allNowPrices = this.$store.state.nowNewPrice
      let nowPrice = allNowPrices[row.ID]
      //買單or賣單
      const buyOrSell = row.BuyOrSell
      //成交價
      let finalPrice = row.FinalPrice == '' ? row.OrderPrice : row.FinalPrice

      //沒 OrderPrice && 沒 成交價 就不用判斷了
      if (row.OrderPrice == '' && row.FinalPrice == '') {
        finalPrice = 0
        this.editPoint.needLimit = false
      }

      //目前獲利點數
      let nowWin = 0
      //目前損失點數
      let nowLoss = 0
      //會員最低停損點數
      let memberStopPoint = 0

      this.allCommodity.forEach(function(val) {
        if (val.ID == row.ID) {
          memberStopPoint = val.StopPoint
        }
      })

      this.editPoint.name = row.Name
      this.editPoint.type = type
      this.editPoint.itemId = row.ID
      this.editPoint.serial = row.Serial
      this.editPoint.nowPrice = nowPrice
      this.editPoint.stopPoint = memberStopPoint
      this.editPoint.buyOrSellName = row.BuyOrSell == 0 ? '多' : '空'

      //新損
      if (type == 'lossPointDialog') {
        //買單的話：成交點數 - 商品現在價格
        if (buyOrSell == 0) {
          nowLoss = finalPrice - nowPrice
        } else {
          //賣單的話：商品現在價格 - 成交點數
          nowLoss = nowPrice - finalPrice
        }
        //獲利點數
        this.editPoint.limitPoint = nowLoss
      } else if (type == 'winPointDialog') {
        //新獲利
        //買單的話：商品現在價格 - 成交點數
        if (buyOrSell == 0) {
          nowWin = nowPrice - finalPrice
        } else {
          //賣單的話：成交點數 - 商品現在價格
          nowWin = finalPrice - nowPrice
        }
        //獲利點數
        this.editPoint.limitPoint = nowWin
      } else if (type == 'profitPointDialog') {
        //新倒利
        //買單的話：商品現在價格 - 成交點數
        if (buyOrSell == 0) {
          nowWin = nowPrice - finalPrice
        } else {
          //賣單的話：成交點數 - 商品現在價格
          nowWin = finalPrice - nowPrice
        }
        //獲利點數
        this.editPoint.limitPoint = nowWin
      }
    },
    doEditPoint() {
      let sendText = ''

      //判斷限制點數
      if (this.editPoint.price != 0) {
        if (this.editPoint.type == 'profitPointDialog') {
          //倒利限
          if (this.editPoint.price >= this.editPoint.limitPoint && this.editPoint.needLimit) {
            this.$alert('不得大於: ' + this.editPoint.limitPoint + '點', '警告!')
            return
          }
          //損+利
        } else {
          if (this.editPoint.price <= this.editPoint.limitPoint && this.editPoint.needLimit) {
            this.$alert('必須大於: ' + this.editPoint.limitPoint + '點', '警告!')
            return
          }
        }

        //不得小於會員最低停損點數
        if (this.editPoint.price < this.editPoint.stopPoint) {
          this.$alert('必須大於會員最低停損點數: ' + this.editPoint.stopPoint + '點', '警告!')
          return
        }
      }

      sendText = 'e:' + this.userId + ',0,' + this.editPoint.itemId + ','

      if (this.editPoint.type == 'lossPointDialog') {
        sendText += '0,' + this.editPoint.price + ',0,3,'
        this.lossPointDialog = false
      } else if (this.editPoint.type == 'winPointDialog') {
        sendText += this.editPoint.price + ',0,0,1,'
        this.winPointDialog = false
      } else if (this.editPoint.type == 'profitPointDialog') {
        sendText += this.editPoint.price + ',0,0,5,'
        this.profitPointDialog = false
      }

      sendText += this.editPoint.serial + ',' + this.token + ',' + this.isMobile
      this.$socketOrder.send(sendText)
    },
    openEdit(row) {
      this.editDialog = true
      let buyType = '0'

      if (row.Odtype == '限價單' || row.Inverted == '1') {
        buyType = '1'
      }

      this.edit = {
        itemId: row.ID,
        serial: row.Serial,
        itemName: row.Name,
        submit: row.Quantity,
        submitMax: parseInt(row.Quantity),
        buyType: buyType,
        sourceBuyType: buyType,
        buyOrSellName: row.BuyOrSell == 0 ? '多' : '空',
        nowPrice: row.OrderPrice,
      }
    },
    deleteOrder(row) {
      this.confirmDeleteData = [{
        name: this.$store.state.itemName,
        userName: this.$store.state.userInfo.Account,
        buy: row.BuyOrSell == 0 ? '多' : '空',
        price: row.Odtype,
        submit: row.Quantity,
        itemId: row.ID,
        serial: row.Serial,
      }]

      this.deleteConfirm = true
    },
    doDelete() {
      let _this = this

      this.confirmDeleteData.forEach(function(val) {
        //send
        let sendText = 'e:' + _this.userId + ',0,' + val.itemId + ',0,0,0,0,' + val.serial + ',' + _this.token + ',' + _this.isMobile
        _this.$socketOrder.send(sendText)
      })

      this.confirmDeleteData = []
      this.deleteConfirm = false
    },
    doEdit() {
      let sendText

      //限價改市價
      if (this.edit.buyType == '0' && this.edit.sourceBuyType == '1') {
        sendText = 'e:' + this.userId + ',0,' + this.edit.itemId + ',0,0,0,6,' + this.edit.serial + ',' + this.token + ',' + this.isMobile
        this.$socketOrder.send(sendText)
      } else {
        //改數量 + 價格
        sendText = 'e:' + this.userId + ',' + this.edit.submit + ',' + this.edit.itemId + ',0,0,' + this.edit.nowPrice + ',2,' + this.edit.serial + ',' + this.token + ',' + this.isMobile
        this.$socketOrder.send(sendText)
      }

      this.editDialog = false
    },
    handleClick() {},
    doMultiCovered() {
      if (this.multiOrderData.length > 0) {
        let itemIdStr = ''
        let serialStr = ''
        const count = this.multiOrderData.length
        let sendText

        this.multiOrderData.forEach(function(val, key) {
          if (count == key + 1) {
            itemIdStr += val.itemId
            serialStr += val.serial
          } else {
            itemIdStr += val.itemId + ';'
            serialStr += val.serial + ';'
          }
        })

        sendText = 't:' + this.userId + ',' + serialStr + ',' + this.token + ',' + this.isMobile + ',' + itemIdStr
        this.$socketOrder.send(sendText)
      }

      this.multiOrderConfirm = false
    },
    doCovered(row, count) {
      const isMobile = this.isMobile
      const userId = this.userId
      const token = this.token
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