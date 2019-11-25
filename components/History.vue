<template lang='pug'>
.history
  .history-header
    .history-tabs.tabs-nav
      #tab-item1.tabs__item(@click='handleHistoryTabs(1)' :class="{'is-active' : historyTabShow == 1}") 買賣下單({{ $store.state.buySell.length }})
      #tab-item2.tabs__item(@click='handleHistoryTabs(2)' :class="{'is-active' : historyTabShow == 2}") 未平倉 ({{ $store.state.unCoverBuySum }},{{ $store.state.unCoverSellSum }})
      #tab-item3.tabs__item(@click='handleHistoryTabs(3)' :class="{'is-active' : historyTabShow == 3}") 已平倉
      #tab-item4.tabs__item(@click='handleHistoryTabs(4)' :class="{'is-active' : historyTabShow == 4}") 商品統計
      #tab-item5.tabs__item(@click='handleHistoryTabs(5)' :class="{'is-active' : historyTabShow == 5}") 對帳表
  .history-content(v-show='historyTabShow == 1')
    .history-content__header(id="buySellHeader")
      .d-flex.justify-content-between.align-items-center(style="width: 100%; padding: 2px 0")
        .div
          button.button(@click="openMultiDelete") 刪單
          button.button(@click="multiDeleteAllClick(true)") 全選
          button.button(@click="multiDeleteAllClick(false)") 全不選
        .div(style="margin-left: 10px;")
          label.radio.inline
            input.radio__input(type="radio" v-model='seeAllOrder' value='1')
            span.radio__label 全部單據
          label.radio.inline
            input.radio__input(type="radio" v-model='seeAllOrder' value='0')
            span.radio__label 未成交單據
          label.checkbox.inline(v-if="seeAllOrder == 0")
            input.checkbox__input(v-model="showAllOrder" type="checkbox" value="1")
            span.checkbox__label 顯示全部商品單據
          label.checkbox.inline
            input.checkbox__input(v-model="autoGoButtom" type="checkbox" value="1")
            span.checkbox__label 自動置底
    .history-content__body(:style="{height: height.buySell}")
      client-only
        vxe-table(
          :data='$store.state.buySell'
          :cell-class-name='buySelltableCellClassName',
          max-width="100%"
          height="100%"
          size="mini"
          column-min-width="60"
          border
          auto-resize
          highlight-current-row)
          vxe-table-column(width="30" align="center")
            template(slot-scope='scope')
              input(type="checkbox" v-model="multiDeleteSelect" :value="scope.row.Serial" :disabled="!scope.row.Operation[1]")
          vxe-table-column(title='操作' width="120" align="center")
            template(slot-scope='scope')
              button.button(v-if="scope.row.Operation[0]" @click="openEdit(scope.row)") 改
              //-改單
              button.button(v-if="scope.row.Operation[1]" @click="deleteOrder(scope.row)") 刪
              button.button(v-if="scope.row.Operation[2]" @click="doCovered(scope.row, 1)") 平倉
          vxe-table-column(field='Serial' title='序號')
          vxe-table-column(field='Name' title='商品')
          vxe-table-column(title='多空' width="40px" align="center")
            template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
          vxe-table-column(field='OrderPrice' title='委託價')
          vxe-table-column(field='Quantity' title='口數' width="40px" align="center")
          vxe-table-column(field='FinalPrice' title='成交價')
          vxe-table-column(field='Odtype' title='型別')
          vxe-table-column(title='損失點數' align="center")
            template(slot-scope='scope')
              button.button.button_border__success(:disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEditPoint('lossPointDialog', scope.row)") {{ parseInt(scope.row.LossPoint) }}
          vxe-table-column(title='獲利點數' align="center")
            template(slot-scope='scope')
              button.button.button_border__danger(:disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEditPoint('winPointDialog', scope.row)") {{ parseInt(scope.row.WinPoint) }}
          vxe-table-column(field='OrderTime' width='150' title='下單時間')
          vxe-table-column(field='FinalTime' width='150' title='完成時間')
          vxe-table-column(title='狀態' width='110' fixed="right")
            template(slot-scope='scope')
              span.blink(v-if="scope.row.State == '未成交'") {{ scope.row.State }}
              span(v-else) {{ scope.row.State }}
  .history-content(v-show='historyTabShow == 2')
    .history-content__header(id="uncoveredHeader")
      div(style="padding: 2px 0")
        button.button(@click="openMultiOrder") 平倉
        button.button(@click="multiOrderAllClick(true)") 全選
        button.button(@click="multiOrderAllClick(false)") 全不選
    .history-content__body(:style="{height: height.uncovered}")
      client-only
        vxe-table(
          :data='$store.state.uncovered'
          :cell-class-name='uncoveredTableCellClassName',
          ref="multipleTable"
          max-width="100%"
          height="100%"
          size="mini"
          column-min-width="60"
          border
          auto-resize
          highlight-current-row)
          vxe-table-column(width="30" align="center")
            template(slot-scope='scope')
              input(type="checkbox" v-model="multiOrderSelect" :value="scope.row.Serial" :disabled="!scope.row.Operation[2]")
          vxe-table-column(title='操作' align="center")
            template(slot-scope='scope')
              button.button(v-if="scope.row.Operation[2]" @click="doCovered(scope.row, 1)") 平倉
          vxe-table-column(field='Serial' title='序號')
          vxe-table-column(field='Name' title='商品')
          vxe-table-column(title='型別')
            template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
          vxe-table-column(field='FinalPrice' title='成交價')
          vxe-table-column(field='Quantity' title='口數')
          vxe-table-column(field='Fee' title='手續費')
          vxe-table-column(title='損失點數' align="center")
            template(slot-scope='scope')
              button.button.button_border__success(:disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEditPoint('lossPointDialog', scope.row)") {{ scope.row.LossPoint }}
          vxe-table-column(title='獲利點數' align="center")
            template(slot-scope='scope')
              button.button.button_border__danger(:disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEditPoint('winPointDialog', scope.row)") {{ scope.row.WinPoint }}
          vxe-table-column(title='倒限(利)' align="center")
            template(slot-scope='scope')
              button.button(:disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEditPoint('profitPointDialog', scope.row)") {{ scope.row.InvertedPoint }}
          vxe-table-column(field='thisSerialTotalMoney', title='未平損益')
            template(slot-scope='scope')
              span(v-if="scope.row['thisSerialTotalMoney'] == 0" class="text-black") {{ scope.row['thisSerialTotalMoney'] }}
              span(v-else :class="scope.row['thisSerialTotalMoney'] > 0 ? 'text-up' : 'text-down'") {{ scope.row['thisSerialTotalMoney'] }}
          vxe-table-column(title='點數')
            template(slot-scope='scope')
              .change-icon
                .icon-arrow(v-if="scope.row['thisSerialPointDiff'] != 0" :class="scope.row['thisSerialPointDiff'] > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
              span(v-if="scope.row['thisSerialPointDiff'] == 0" class="text-black") {{ scope.row['thisSerialPointDiff'] }}
              span(v-else :class="scope.row['thisSerialPointDiff'] > 0 ? 'text-up' : 'text-down'") {{ scope.row['thisSerialPointDiff'] }}
          vxe-table-column(field='Day', title='天數')
          vxe-table-column(field='State', title='狀態' width="150px" fixed="right")
  .history-content(v-show="historyTabShow == 3")
    .history-content__header(id="coveredHeader")
    .history-content__body(:style="{height: height.covered}")
      client-only
        vxe-table(
          :data='$store.state.covered'
          max-width="100%"
          height="100%"
          size="mini"
          column-min-width="60"
          border
          auto-resize
          highlight-current-row)
          vxe-table-column(field="Name" title='商品')
          vxe-table-column(field="NewSerial" title='新倉序號')
          vxe-table-column(field="CoverSerial" title='平倉序號')
          vxe-table-column(field="NewType" title='新倉型別')
          vxe-table-column(field="SerialCoveredNum" title='口數')
          vxe-table-column(title='多空')
            template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
          vxe-table-column(field="NewPrice" title='成交價')
          vxe-table-column(field="CoverPrice" title='平倉價')
          vxe-table-column(field="NewDate" title='成交日期' width="150px")
          vxe-table-column(field="CoverDate" title='平倉日期' width="150px")
          vxe-table-column(field="WinPoint" title='點數')
          vxe-table-column(field="CoverType" title='種類')
          vxe-table-column(field="Fee" title='手續費')
          vxe-table-column(field="WinMoney" title='損益')
  .history-content(v-show="historyTabShow == 4")
    .history-content__header(id="commodityHeader")
      .row
        .col-auto 預設額度:
          span.text-lg.text-bold {{ $store.state.userInfo.TouchPoint }}
        .col-auto 今日損益:
          //- colors class.text-danger | text-success
          span(v-if="$store.state.userInfo.TodayMoney < 0").text-lg.text-bold.text-danger {{ $store.state.userInfo.TodayMoney }}
          span(v-else).text-lg.text-bold.text-success {{ $store.state.userInfo.TodayMoney }}
        .col-auto 留倉預扣:
          span.text-lg.text-bold {{ $store.state.userInfo.WithholdingMoney }}
        .col-auto 帳戶餘額:
          span.text-lg.text-bold.text-info {{ $store.state.userInfo.Money }}
        .col-auto
          label.checkbox
            input.checkbox__input(type="checkbox" checked)
            span.checkbox__label 顯示全部
    .history-content__body(:style="{height: height.commodity}")
      client-only
        vxe-table(
          :data='$store.state.commodity'
          :row-class-name="checkRowShow"
          max-width="100%"
          height="100%"
          size="mini"
          column-min-width="60"
          border
          auto-resize
          highlight-current-row)
          vxe-table-column(field="Name" title='商品名稱')
          vxe-table-column(title='總多')
            template(slot-scope='scope')
              span.text-danger {{ scope.row.TotalBuySubmit　}}
          vxe-table-column(title='總空')
            template(slot-scope='scope')
              span.text-success {{ scope.row.TotalSellSubmit}}
          vxe-table-column(title='未平倉')
            template(slot-scope='scope') {{ scope.row.RemainingBuyStock - scope.row.RemainingSellStock }}
          vxe-table-column(field="TotalSubmit" title='總口數')
          vxe-table-column(field="TotalFee" title='手續費合計')
          vxe-table-column(title='損益')
            template(slot-scope='scope')
              span.text-success(v-if="scope.row.TotalPoint >= 0") {{ scope.row.TotalPoint}}
              span.text-danger(v-else) {{ scope.row.TotalPoint}}
          vxe-table-column(title='留倉預扣')
            template(slot-scope='scope')
              span.text-success(v-if="scope.row.RemainingWithholding >= 0") {{ scope.row.RemainingWithholding}}
              span.text-danger(v-else) {{ scope.row.RemainingWithholding}}
  .history-content(v-show="historyTabShow == 5")
    .history-content__header(id="accountHeader")
        el-form(ref='form' size="mini" :inline='true' style="padding: 2px 0"
        )
          el-form-item(label='開始日期:')
            el-form-item
              el-date-picker(type='date' placeholder='開始日期' v-model="form.start" style="width: 130px;")
          el-form-item(label='結束日期:')
            el-form-item
              el-date-picker(type='date' placeholder='結束日期' v-model="form.end" style="width: 130px;")
          button.button(type="button" @click="query") 送出
        span.label 快速查詢
        button.button(@click="selectDayType('today')") 今日
        button.button(@click="selectDayType('yesterday')") 昨日
        button.button(@click="selectDayType('thisWeek')") 本週
        button.button(@click="selectDayType('beforeWeek')") 上週
        button.button(@click="selectDayType('thisMonth')") 本月
        button.button(@click="selectDayType('beforeMonth')") 上月
    .history-content__body(:style="{height: height.account}")
      client-only
        vxe-table(
          :data='accountMoneyList'
          max-width="100%"
          height="100%"
          size="mini"
          column-min-width="60"
          border
          auto-resize
          highlight-current-row)
          vxe-table-column(field="Date" title='日期')
          vxe-table-column(field="TouchPoint" title='預設額度')
          vxe-table-column(field="RemainingMoney" title='帳戶餘額')
          vxe-table-column(title='今日損益')
            template(slot-scope='scope')
              span.text-success(v-if="scope.row.TodayMoney >= 0") {{ scope.row.TodayMoney}}
              span.text-danger(v-else) {{ scope.row.TodayMoney}}
          vxe-table-column(field="TotalSubmit" title='口數')
          vxe-table-column(field="Withholding" title='留倉預扣')
          vxe-table-column(field="Limitpoint" title='對匯額度')
          vxe-table-column(field="Uppay" title='交收')
    //-el-tab-pane(title='投顧訊息(0)', name='tabs6')
    //-el-tab-pane(title='自訂窗口', name='tabs7')
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
          button.button(@click="editPoint.price -= 10") -10
          button.button(@click="editPoint.price -= 5") -5
          el-input-number.changeNumButton(v-model="editPoint.price" size="mini" style='margin: 0 4px; width: 100px')
          button.button(@click="editPoint.price += 5") +5
          button.button(@click="editPoint.price += 10") +10
        p.text-center 計算結果:
          span.text-bold.bg-colr-danger {{ editPoint.nowPrice - editPoint.limitPoint + editPoint.price }}
      .dialog__footer
        button.button__light(@click="editPoint.price = 0") 清除設定
        button.button__light(@click="profitPointDialog = false") 取消
        button.button(type='primary' @click="doEditPoint") 送出
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
          button.button(@click="editPoint.price -= 10") -10
          button.button(@click="editPoint.price -= 5") -5
          el-input-number.changeNumButton(v-model="editPoint.price" size="mini" style='margin: 0 4px; width: 100px')
          button.button(@click="editPoint.price += 5") +5
          button.button(@click="editPoint.price += 10") +10
        p.text-center 計算結果:
          span.text-bold.bg-colr-danger {{ editPoint.nowPrice - editPoint.limitPoint + editPoint.price }}
      .dialog__footer
        button.button__light(@click="editPoint.price = 0") 清除設定
        button.button__light(@click="winPointDialog = false") 取消
        button.button(type='primary' @click="doEditPoint") 送出
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
          button.button(@click="editPoint.price -= 10") -10
          button.button(@click="editPoint.price -= 5") -5
          el-input-number.changeNumButton(v-model="editPoint.price" size="mini" style='margin: 0 4px; width: 100px')
          button.button(@click="editPoint.price += 5") +5
          button.button(@click="editPoint.price += 10") +10
        p.text-center 計算結果:
          span.text-bold.bg-colr-danger {{ editPoint.nowPrice - editPoint.limitPoint + editPoint.price }}
      .dialog__footer
        button.button__light(@click="editPoint.price = 0") 清除設定
        button.button__light(@click="lossPointDialog = false") 取消
        button.button(type='primary' @click="doEditPoint") 送出
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
        el-form(ref='form' title-width='50px')
          el-form-item(title="序號")
            el-input(:value="edit.serial" :disabled="true")
          el-form-item(title="商品")
            el-input(:value="edit.itemName" :disabled="true")
          el-form-item(title="會員")
            el-input(:value="$store.state.userInfo.Account" :disabled="true")
          el-form-item(title="買賣")
            el-input(:value="edit.buyOrSellName" :disabled="true")
          el-form-item(title="口數")
            el-input-number(v-model="edit.submit" :min="1" :max="edit.submitMax")
          el-form-item
            el-radio(v-model='edit.buyType' title='0') 市價單
            el-radio(v-model='edit.buyType' title='1') 限價單
          el-form-item(title="限價" v-if="edit.buyType == '1'")
            el-input-number(v-model="edit.nowPrice")
      .dialog__footer
        button.button__light(@click="editDialog = false") 取消
        button.button(type='primary' @click="doEdit") 送出
  //-多單平倉
  el-dialog(
    :visible.sync='multiOrderConfirm'
    :modal='false'
    :show-close='false'
    width="600px"
    title='確認平倉'
    v-dialogDrag)
    .header-custom(slot='title')
      i.el-icon-info
      |  確認平倉
    client-only
      vxe-table(
        :data="multiOrderData"
        height="100px"
        size="mini"
        column-min-width="60"
        border)
        vxe-table-column(field="serial" title='序號')
        vxe-table-column(field="name" title='目標商品')
        vxe-table-column(field="userName" title='用戶名稱')
        vxe-table-column(field="buy" title='買賣')
        vxe-table-column(field="price" title='價格')
        vxe-table-column(field="submit" title='口數')
      .dialog__footer
        button.button__light(@click="multiOrderConfirm = false") 取消
        button.button(type='primary' @click="doMultiCovered") 確認
  //-刪除
  el-dialog(
    :visible.sync='deleteConfirm'
    :modal='false'
    :show-close='false'
    width="600px"
    title='確認刪除'
    v-dialogDrag)
    .header-custom(slot='title')
      i.el-icon-info
      |  確認刪除
    vxe-table(
      :data="multiDeleteData"
      max-width="100%"
      height="100px"
      size="mini"
      column-min-width="60"
      borde)
      vxe-table-column(field="serial" title='序號')
      vxe-table-column(field="name" title='目標商品')
      vxe-table-column(field="userName" title='用戶名稱')
      vxe-table-column(field="buy" title='買賣')
      vxe-table-column(field="price" title='價格')
      vxe-table-column(field="submit" title='口數')
    .dialog__footer
      button.button(@click="deleteConfirm = false") 取消
      button.button(type='primary' @click="doDelete") 確認
</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'
import qs from 'qs'

export default {
  data() {
    return {
      autoGoButtom: 1,
      showAllOrder: 1,
      seeAllOrder: 1,
      historyTabShow: 1,
      isMobile: '',
      userId: '',
      token: '',
      lang: '',
      height: {
        buySell: '',
        uncovered: '',
        covered: '',
        commodity: '',
        account: '',
      },
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
      accountMoneyList: [],
      activeName: 'tabs1',
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
      multiOrderSelect: [],
      multiDeleteData: [],
      multiDeleteSelect: [],
    }
  },
  mounted() {
    this.selectDayType('today')
    this.userId = this.$store.state.localStorage.userAuth.userId
    this.token = this.$store.state.localStorage.userAuth.token
    this.lang = this.$store.state.localStorage.lang
    this.isMobile = this.$store.state.isMobile
    this.computedHeight()
    window.addEventListener('resize', this.computedHeight)
  },
  watch: {
    historyTabShow() {
      window.setTimeout(( () => this.computedHeight() ), 100)
    }
  },
  methods: {
    computedHeight() {
      const buySellHeader = document.getElementById('buySellHeader').offsetHeight
      const uncoveredHeader = document.getElementById('uncoveredHeader').offsetHeight
      const coveredHeader = document.getElementById('coveredHeader').offsetHeight
      const commodityHeader = document.getElementById('commodityHeader').offsetHeight
      const accountHeader = document.getElementById('accountHeader').offsetHeight

      this.height = {
        buySell: 'calc(100% - ' + buySellHeader + 'px)',
        uncovered: 'calc(100% - ' + uncoveredHeader + 'px)',
        covered: 'calc(100% - ' + coveredHeader + 'px)',
        commodity: 'calc(100% - ' + commodityHeader + 'px)',
        account: 'calc(100% - ' + accountHeader + 'px)',
      }
    },
    handleHistoryTabs(e) {
			this.historyTabShow = e
		},
    async query() {
      let _this = this

      if (this.form.start != '' && this.form.end != '') {
        await axios.post("/api/query_moneylist?lang=" + this.lang, qs.stringify({
          UserID: this.userId,
          Token: this.token,
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
    openMultiDelete() {
      let _this = this
      this.multiDeleteData = []

      _this.multiDeleteSelect.forEach(function(serial) {
        _this.$store.state.buySell.forEach(function(row) {
          if (row.Serial == serial) {
            _this.multiDeleteData.push({
              name: row.Name,
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

      if (this.$store.state.localStorage.customSetting.noConfirmDelete) {
        this.doDelete()
      } else {
        this.deleteConfirm = true
      }
    },
    openMultiOrder() {
      let _this = this
      this.multiOrderData = []

      _this.multiOrderSelect.forEach(function(serial) {
        _this.$store.state.uncovered.forEach(function(row) {
          if (row.Serial == serial) {
            _this.multiOrderData.push({
              name: row.Name,
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
    multiDeleteAllClick(allChecked) {
      let _this = this

      if (!allChecked) {
        _this.multiDeleteSelect = []
        return
      }

      _this.multiDeleteSelect = _this.$store.state.buySell.map(function(val) {
        if (val.Operation[1]) {
          return val.Serial
        }
      })
    },
    multiOrderAllClick(allChecked) {
      let _this = this

      if (!allChecked) {
        _this.multiOrderSelect = []
        return
      }

      _this.multiOrderSelect = _this.$store.state.uncovered.map(function(val) {
        if (val.Operation[2]) {
          return val.Serial
        }
      })
    },
    selectCheckDelete(row) {
      if (row.Operation[0]) {
        return true
      }

      return false
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
      this.multiDeleteData = [{
        name: this.$store.state.itemName,
        userName: this.$store.state.userInfo.Account,
        buy: row.BuyOrSell == 0 ? '多' : '空',
        price: row.Odtype,
        submit: row.Quantity,
        itemId: row.ID,
        serial: row.Serial,
      }]

      //如果勾選刪單不確認
      if (this.$store.state.localStorage.customSetting.noConfirmDelete) {
        this.doDelete()
      } else {
        this.deleteConfirm = true
      }
    },
    doDelete() {
      let _this = this

      this.multiDeleteData.forEach(function(val) {
        //send
        let sendText = 'e:' + _this.userId + ',0,' + val.itemId + ',0,0,0,0,' + val.serial + ',' + _this.token + ',' + _this.isMobile
        _this.$socketOrder.send(sendText)
      })

      this.multiDeleteData = []
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
    },
    buySelltableCellClassName({ row, column, columnIndex }) {
      //判斷是否顯示
      if (this.seeAllOrder == 0 && row.State == '未成交') {
        return 'hide'
      }

      if (columnIndex >= 3 && columnIndex <= 8) {
        if (row.BuyOrSell == 0) {
          return 'text-up'
        } else {
          return 'text-down'
        }
      }
    },
    uncoveredTableCellClassName({ row, column, columnIndex }) {
      if (columnIndex >= 1 && columnIndex <= 13) {
        if (row.BuyOrSell == 0) {
          return 'text-up'
        } else {
          return 'text-down'
        }
      }
    }
  }
}
</script>