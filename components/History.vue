<template lang='pug'>
.history
  .history-header
    .history-tabs.tabs-nav
      #tab-item1.tabs__item(@click='handleHistoryTabs(1)' :class="{'is-active' : historyTabShow == 1}") 買賣下單({{ $store.state.buySell.length }})
      #tab-item2.tabs__item(@click='handleHistoryTabs(2)' :class="{'is-active' : historyTabShow == 2}") 未平倉 (
        span.text__danger {{ $store.state.unCoverBuySum }}
        |,
        span.text__success {{ Math.abs($store.state.unCoverSellSum) }}
        |)
      #tab-item3.tabs__item(@click='handleHistoryTabs(3)' :class="{'is-active' : historyTabShow == 3}") 已平倉
      #tab-item4.tabs__item(@click='handleHistoryTabs(4)' :class="{'is-active' : historyTabShow == 4}") 商品統計
      #tab-item5.tabs__item(@click='handleHistoryTabs(5)' :class="{'is-active' : historyTabShow == 5}") 對帳表
      #tab-item5.tabs__item(@click='handleHistoryTabs(6)' :class="{'is-active' : historyTabShow == 6}")
        span(:class="blink ? 'blink' : ''") 線上客服
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
          label.checkbox.inline(v-else style="width: 121px")
    .history-content__body(:style="{height: height.buySell}")
      table.custom__table
        thead.thead
          tr
            th(style="width: 30px").text__center
            th(style="width: 80px").text__center 操作
            th 不留倉
            th 序號
            th(style="width: 100px;") 商品
            th(style="width: 40px").text__center 多空
            th 委託價
            th(style="width: 40px").text__center 口數
            th 成交價
            th 型別
            th.text__center 損失點數
            th.text__center 獲利點數
            th(style="width: 160px;") 下單時間
            th(style="width: 160px;") 完成時間
            th(style="width: 130px;") 狀態
        tbody.tbody(@scroll="tbodyScroll($event)")
          tr(v-for="row in $store.state.buySell" v-if="checkRowShow(row)" @click="trClick($event)")
            td(style="width: 30px").text__center
              input(class="m-0" type="checkbox" v-model="multiDeleteSelect" :value="row.Serial" v-if="row.Operation[1]")
            td(title='操作' style="width: 80px").text__center
              button.button(v-if="row.Operation[1]" @click="deleteOrder(row)") 刪
              button.button(v-if="row.Operation[2]" @click="doCovered(row, 1)") 平
              button.button(v-if="row.Operation[0] || !cantSetWinLoss(row.Operation)" @click="openEdit(row, 'edit')") 改
            td
              div(v-if="row.Operation[2]")
                label.checkbox
                  input.checkbox__input(type="checkbox" style="margin: 0" :checked="row.DayCover" @click="changeDayCover(row, $event)" :disabled="dayCoverIsDisabled(row.ID)")
                  span.checkbox__label 不留倉
            td(:class="checkBuySellColor(row)") {{ row.Serial }}
            td(:class="checkBuySellColor(row)" style="width: 100px;")
              span(v-if="row.State != '已刪除'") {{ row.Name }}
              s(v-else) {{ row.Name }}
            td.text__center(:class="checkBuySellColor(row)" style="width: 40px") {{ row['BuyOrSell'] == 0 ? '多' : '空' }}
            td(:class="checkBuySellColor(row)") {{ row.OrderPrice }}
            td.text__center(:class="checkBuySellColor(row)" style="width: 40px") {{ row.Quantity }}
            td(:class="checkBuySellColor(row)") {{ row.FinalPrice }}
            td(:class="checkBuySellColor(row)") {{ row.Odtype }}
            td.text__center
              button.button.button__success(:disabled="cantSetWinLoss(row.Operation)" @click="openEdit(row, 'loss')") {{ Number(row.LossPoint) }}
            td.text__center
              button.button.button__danger(:disabled="cantSetWinLoss(row.Operation)" @click="openEdit(row, 'win')") {{ Number(row.WinPoint) }}
            td(:class="checkBuySellColor(row)" style="width: 160px;") {{ row.OrderTime }}
            td(:class="checkBuySellColor(row)" style="width: 160px;") {{ row.FinalTime }}
            td(style="width: 130px;")
              span.blink(v-if="row.State == '未成交'") {{ row.State }}
              span(v-else) {{ row.State }}
          tr(class="non-data" v-if="$store.state.buySell.length == 0")
            td 無資料
  .history-content(v-show='historyTabShow == 2')
    .history-content__header(id="uncoveredHeader")
      div(style="padding: 2px 0")
        button.button(@click="openMultiOrder") 平倉
        button.button(@click="multiOrderAllClick(true)") 全選
        button.button(@click="multiOrderAllClick(false)") 全不選
        span(style="padding: 0 10px") 損益設定
        label.radio.inline
          input.radio__input(type="radio" v-model='pointInputType' value='1')
          span.radio__label 點數輸入
        label.radio.inline
          input.radio__input(type="radio" v-model='pointInputType' value='2')
          span.radio__label 行情輸入
    .history-content__body(:style="{height: height.uncovered}")
      table.custom__table
        thead.thead
          tr
            th(style="width: 30px").text__center
            th(style="width: 50px;") 操作
            th 序號
            th(style="width: 100px;") 商品
            th 不留倉
            th 買賣
            th 成交價
            th 口數
            th 手續費
            th 損失點
            th 獲利點
            th 倒限(利)
            th 報價
            th 浮動損益
            th 點數
            th 天數
            th(style="width: 130px;") 狀態
            th 昨日損益
        tbody.tbody(@scroll="tbodyScroll($event)")
          tr(v-for="row in $store.state.uncovered" @click="trClick($event)")
            td(style="width: 30px").text__center
              input(class="m-0" type="checkbox" v-model="multiOrderSelect" :value="row.Serial" :disabled="!row.Operation[2]")
            td(style="width: 50px;")
              button.button(v-if="row.Operation[2]" @click="doCovered(row, 1)") 平
            td {{ row.Serial }}
            td(style="width: 100px;") {{ row.Name }}
            td
              div(v-if="row.Operation[2]")
                label.checkbox
                  input.checkbox__input(type="checkbox" style="margin: 0" :checked="row.DayCover" @click="changeDayCover(row, $event)" :disabled="dayCoverIsDisabled(row.ID)")
                  span.checkbox__label 不留倉
            td
              span(:class="checkBuySellColor(row)") {{ row['BuyOrSell'] == 0 ? '多' : '空' }}
            td {{ row.FinalPrice }}
            td {{ row.Quantity }}
            td {{ row.TotalFee }}
            td
              button.button.button__success(:disabled="cantSetWinLoss(row.Operation)" @click="openEdit(row, 'loss')") {{ Number(row.LossPoint) }}
            td
              button.button.button__danger(:disabled="cantSetWinLoss(row.Operation)" @click="openEdit(row, 'win')") {{ Number(row.WinPoint) }}
            td
              button.button(:disabled="row.Operation[3] == 0 ? true : false" @click="openEdit(row, 'inverted')") {{ Number(row.InvertedPoint) }}
            td
              span(v-if="findMainItemById(row.ID) != ''") {{ findMainItemById(row.ID).newest_price }}
            td
              span(v-if="row['thisSerialTotalMoney'] == 0" class="text__black") {{ row['thisSerialTotalMoney'] }}
              span(v-else :class="getMoneyColor(row.thisSerialTotalMoney)") {{ row['thisSerialTotalMoney'] }}
            td
              .change-icon(v-if="typeof row['thisSerialPointDiff'] != 'undefined'")
                .icon-arrow(v-if="row['thisSerialPointDiff'] != 0" :class="row['thisSerialPointDiff'] > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
              span(v-if="row['thisSerialPointDiff'] == 0" class="text__black") {{ row['thisSerialPointDiff'] }}
              span(v-else :class="getSourceMoneyColor(row.thisSerialPointDiff)") {{ row['thisSerialPointDiff'] }}
            td {{ row.Day }}
            td(style="width: 130px;") {{ row.State }}
            td
              div(v-if="row.OriginalMoney > 0")
                span(:class="getMoneyColor(row.OriginalMoney)" style="text-decoration:underline;" @click="openDetail(row)") {{ row.OriginalMoney | currency }}
          tr(class="non-data" v-if="$store.state.uncovered.length == 0")
            td 無資料
  .history-content(v-show="historyTabShow == 3")
    .history-content__header(id="coveredHeader")
    .history-content__body(:style="{height: height.covered}")
      table.custom__table
        thead.thead
          tr
            th(style="width: 100px;") 商品
            th 新倉序號
            th 平倉序號
            th 新倉型別
            th 口數
            th 多空
            th 成交價
            th 平倉價
            th(style="width: 160px;") 成交日期
            th(style="width: 160px;") 平倉日期
            th 點數
            th 種類
            th 手續費
            th 損益
        tbody.tbody(@scroll="tbodyScroll($event)")
          tr(v-for="row in $store.state.covered" @click="trClick($event)")
            td(style="width: 100px;") {{ row.Name }}
            td {{ row.NewSerial }}
            td {{ row.CoverSerial }}
            td
              span(:class="row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ row['NewType'] }}
            td
              span(:class="row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ row['SerialCoveredNum'] }}
            td
              span(:class="row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ row['BuyOrSell'] == 0 ? '多' : '空' }}
            td
              span(:class="row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ row['NewPrice'] }}
            td
              span(:class="row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ row['CoverPrice'] }}
            td(style="width: 160px;") {{ row.NewDate }}
            td(style="width: 160px;") {{ row.CoverDate }}
            td
              .change-icon
                .icon-arrow(:class="row['Point'] > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
              span(:class="getSourceMoneyColor(row['Point'])" ) {{ row['Point'] }}
            td {{ row.CoverType }}
            td {{ row.TotalFee }}
            td
              span(:class="getMoneyColor(row.Money)") {{ row['Money'] }}
          tr(class="non-data" v-if="$store.state.covered.length == 0")
            td 無資料
  .history-content(v-show="historyTabShow == 4")
    .history-content__header(id="commodityHeader")
      .row
        .col-auto 預設額度:
          span.text__lg.text__bold {{ $store.state.userInfo.TouchPoint | currency }}
        .col-auto 今日損益:
          //- colors class.text__danger | text__success
          span(v-if="$store.state.userInfo.TodayMoney < 0").text__lg.text__bold.text__danger {{ $store.state.userInfo.TodayMoney | currency }}
          span(v-else).text__lg.text__bold.text__success {{ $store.state.userInfo.TodayMoney | currency }}
        .col-auto 留倉預扣:
          span.text__lg.text__bold {{ $store.state.userInfo.WithholdingMoney | currency }}
        .col-auto 帳戶餘額:
          span.text__lg.text__bold.text__info {{ $store.state.userInfo.Money | currency }}
        .col-auto
          label.checkbox
            input.checkbox__input(type="checkbox" checked)
            span.checkbox__label 顯示全部
    .history-content__body(:style="{height: height.commodity}")
      table.custom__table
        thead.thead
          tr
            th 商品名稱
            th 總多
            th 總空
            th 未平倉
            th 總口數
            th 手續費合計
            th 損益
            th 留倉預扣
        tbody.tbody(@scroll="tbodyScroll($event)")
          tr(v-for="row in $store.state.commodity" @click="trClick($event)")
            td(field="Name" title='商品名稱') {{ row.Name }}
            td
              span.text__danger {{ row.TotalBuySubmit }}
            td
              span.text__success {{ row.TotalSellSubmit }}
            td
              span(class="cell text__center bg__danger" v-if="row.RemainingBuyStock - row.RemainingSellStock > 0") {{ row.RemainingBuyStock - row.RemainingSellStock }}
              span(class="cell text__center bg__success" v-else) {{ Math.abs(row.RemainingBuyStock - row.RemainingSellStock) }}
            td {{ row.TotalSubmit }}
            td {{ row.TotalFee }}
            td
              span(:class="getMoneyColor(row.TodayMoney)") {{ row.TodayMoney }}
            td
              span(:class="getMoneyColor(row.RemainingWithholding)") {{ row.RemainingWithholding }}
          tr(class="non-data" v-if="$store.state.commodity.length == 0")
            td 無資料
  .history-content(v-show="historyTabShow == 5")
    .history-content__header(id="accountHeader")
        el-form(ref='form' size="mini" :inline='true' style="padding: 2px 0"
        )
          el-form-item(label='開始日期:')
            el-form-item
              el-date-picker(type='date' placeholder='開始日期' v-model="form.start" style="width: 150px;")
          el-form-item(label='結束日期:')
            el-form-item
              el-date-picker(type='date' placeholder='結束日期' v-model="form.end" style="width: 150px;")
          button.button(type="button" @click="query") 送出
        span.label 快速查詢
        button.button(@click="selectDayType('today')") 今日
        button.button(@click="selectDayType('yesterday')") 昨日
        button.button(@click="selectDayType('thisWeek')") 本週
        button.button(@click="selectDayType('beforeWeek')") 上週
        button.button(@click="selectDayType('thisMonth')") 本月
        button.button(@click="selectDayType('beforeMonth')") 上月
    .history-content__body(:style="{height: height.account}")
      table.custom__table
        thead.thead
          tr
            th 日期
            th 預設額度
            th 帳戶餘額
            th 今日損益
            th 口數
            th 留倉預扣
            th 對匯額度
            th 交收
        tbody.tbody(@scroll="tbodyScroll($event)")
          tr(v-for="row in accountMoneyList" @click="trClick($event)")
            td {{ row.Date }}
            td {{ row.TouchPoint | currency }}
            td {{ row.RemainingMoney | currency }}
            td
              span.text__success(v-if="row.TodayMoney >= 0") {{ row.TodayMoney | currency }}
              span.text__danger(v-else) {{ row.TodayMoney | currency }}
            td {{ row.TotalSubmit }}
            td {{ row.Withholding | currency }}
            td {{ row.Limitpoint | currency }}
            td {{ row.Uppay | currency }}
          tr(class="non-data" v-if="accountMoneyList.length == 0")
            td 無資料
  Message(v-show='historyTabShow == 6' :tabShow="historyTabShow")
  //-改價減量
  el-dialog(
    :visible.sync='editDialog'
    :modal='false'
    v-dialogDrag
    width="330px")
    .header-custom(slot='title')
      span {{ editTitle }}
      span.badge.badge-warning ({{ pointInputType == 1 ? '點數' : '行情' }})
    template
      .dialog__body
        .d-flex.justify-content-around.mb-3
          ul.flex-fill.fistrtitle
            li
              .label 序號
              span {{ edit.serial }}
            li
              .label 商品
              span {{ edit.itemName }}
            li
              .label 成交
              span {{ editPoint.finalPrice }}
            li
              .label 多空
              span(:class="edit.BuyOrSell == 0 ? 'bg__danger' : 'bg__success'" class="text__white") {{ edit.BuyOrSell == 0 ? '多' : '空' }}
          //-這個是右邊那個大框框 有紅色or綠色的
          .PriceBox.flex-fill(v-if="findMainItemById(edit.itemId) != ''" :class="findMainItemById(edit.itemId).gain > 0 ? 'bg__danger' : 'bg__success'")
            //-成交價
            .title {{ findMainItemById(edit.itemId).newest_price }}
            //-帳跌
            div
              span
                .change-icon
                  .icon-arrow(:class="findMainItemById(edit.itemId).gain > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
                div(style="display: inline") {{ findMainItemById(edit.itemId).gain }}
              //-帳跌%
              span.ml-2 {{ findMainItemById(edit.itemId).gain_percent }}%
        el-form(ref='form' size='mini' label-width='94px')
          .edit-base(v-if="editType == 'edit' && edit.operation[0]")
            el-form-item(label="口數")
              el-input-number(v-model="edit.submit" :max="edit.submitMax" :step="0.25")
            el-form-item
              label.radio.inline
                input.radio__input(type="radio" v-model='edit.buyType' value='1')
                span.radio__label 限價單
              label.radio.inline
                input.radio__input(type="radio" v-model='edit.buyType' value='0')
                span.radio__label 市價單
            el-form-item(label="限價" v-if="edit.buyType == '1'")
              el-input-number(v-model="edit.nowPrice")
          //-點數輸入
          .point-input(v-show="pointInputType == 1")
            .win-point.text__center(v-if="checkUncoveredEdit('win')")
              p.pl-15 新獲利點需大於:
                span.text__bold.bg-colr-warring [ {{ editPoint.limitWinPoint }} ]
              el-form-item(label="獲利點")
                el-input-number(v-model="edit.winPoint")
            .loss-point.text__center(v-if="checkUncoveredEdit('loss')")
              p.pl-15 新損失點需大於:
                span.text__bold.bg-colr-warring [ {{ editPoint.limitLossPoint }} ]
              el-form-item(label="損失點")
                el-input-number(v-model="edit.lossPoint")
            .inverted-point.text__center(v-if="checkUncoveredEdit('inverted')")
              p.pl-15 新倒限利不得大於:
                span.text__bold.bg-colr-warring [ {{ editPoint.limitWinPoint }} ]
              el-form-item(label="倒限點")
                el-input-number(v-model="edit.invertedPoint")
          //-行情輸入
          .money-input(v-show="pointInputType == 2")
            .win-point.text__center(v-if="checkUncoveredEdit('win')")
              p.pl-15 新獲利點需大於:
                span.text__bold.bg-colr-warring [ {{ editPoint.limitWinPrice }} ]
              el-form-item(label="獲利點")
                el-input-number(v-model="changeWinPrice")
            .loss-point.text__center(v-if="checkUncoveredEdit('loss')")
              p.pl-15 新損失點需大於:
                span.text__bold.bg-colr-warring [ {{ editPoint.limitLossPrice }} ]
              el-form-item(label="損失點")
                el-input-number(v-model="changeLossPrice")
            .inverted-point.text__center(v-if="checkUncoveredEdit('inverted')")
              p.pl-15 新倒限利不得大於:
                span.text__bold.bg-colr-warring [ {{ editPoint.limitWinPrice }} ]
              el-form-item(label="倒限點")
                el-input-number(v-model="changeInvertedPrice")
        .badge.badge-warning(v-show="editType == 'edit'") 口數只能減少或不變，損失點/獲利點/倒限點 為
          span.badge-rr 點數
          | 設定
      .dialog__footer
        button.button__light(@click="editDialog = false") 取消
        button.button(type='primary' @click="doEdit") 送出
  //-多單平倉
  el-dialog(
    :visible.sync='multiOrderConfirm'
    :modal='false'
    v-dialogDrag
    :show-close='false'
    width="600px"
    title='確認平倉')
    .header-custom(slot='title')
      i.el-icon-info
      |  確認平倉
    div
      table.custom__table.general
        thead.thead
          tr
            th 序號
            th(style="width: 100px") 目標商品
            th 用戶名稱
            th 買賣
            th 價格
            th 口數
        tbody.tbody
          tr(v-for="row in multiOrderData")
            td {{ row.serial }}
            td(style="width: 100px") {{ row.name }}
            td {{ row.userName }}
            td
              div
                span(:class="row.buy == 0 ? 'text__danger' : 'text__success'") {{ row.buy == 0 ? '多' : '空' }}
            td {{ row.price }}
            td {{ row.submit }}
          tr(class="non-data" v-if="multiOrderData.length == 0")
            td 無資料
    .dialog__footer
      button.button__light(@click="multiOrderConfirm = false") 取消
      button.button(type='primary' @click="doMultiCovered") 確認
  //-刪除
  el-dialog(
    :visible.sync='deleteConfirm'
    :modal='false'
    v-dialogDrag
    :show-close='false'
    width="600px"
    title='確認刪除')
    .header-custom(slot='title')
      i.el-icon-info
      |  確認刪除
    div
      table.custom__table.general
        thead.thead
          tr
            th 序號
            th(style="width: 100px") 目標商品
            th 用戶名稱
            th 買賣
            th 價格
            th 口數
            th 時間
        tbody.tbody
          tr(v-for="row in multiDeleteData")
            td {{ row.serial }}
            td(style="width: 100px") {{ row.name }}
            td {{ row.userName }}
            td
              div
                span(:class="row.buy == 0 ? 'text__danger' : 'text__success'") {{ row.buy == 0 ? '多' : '空' }}
            td {{ row.price }}
            td {{ row.submit }}
            td {{ dateOnlyHis(row.orderTime) }}
          tr(class="non-data" v-if="multiDeleteData.length == 0")
            td 無資料
    .dialog__footer
      button.button(@click="deleteConfirm = false") 取消
      button.button(type='primary' @click="doDelete") 確認
</template>

<script>

import { mapState } from 'vuex'
import Message from "~/components/Message"
import axios from 'axios'
import qs from 'qs'
//-改單用
import "@/plugins/betListPoint.js"

export default {
  data() {
    return {
      //點數1 行情2
      pointInputType: 1,
      autoGoButtom: 1,
      showAllOrder: 1,
      seeAllOrder: 1,
      historyTabShow: 1,
      blink: false,
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
      accountMoneyList: [],
      activeName: 'tabs1',
      checked: false,
    }
  },
  components: {
    Message,
  },
  computed: mapState({
    hasMessage: 'hasMessage',
    mainItem: 'mainItem',
  }),
  mounted() {
    this.userId = this.$store.state.localStorage.userAuth.userId
    this.token = this.$store.state.localStorage.userAuth.token
    this.lang = this.$store.state.localStorage.lang
    this.isMobile = this.$store.state.isMobile

    this.selectDayType('today')
    this.computedHeight()
    window.addEventListener('resize', this.computedHeight)
  },
  watch: {
    historyTabShow() {
      const _this = this

      setTimeout(function() {
        _this.computedHeight()
        _this.computedTableContent()
      }, 0)
    },
    hasMessage(type) {
      if (this.historyTabShow != 6 && type) {
        this.blink = true
      } else {
        this.blink = false
      }

      this.$store.commit('setHasMessage', this.blink)
    },
    mainItem() {
      if (this.editDialog) {
        this.computedPointLimit()
      }
    },
    changeWinPrice(newData, oldData) {
      const limitPoint = this.editPoint.limitWinPoint
      const limitPrice = this.editPoint.limitWinPrice

      //0案增加
      if (oldData == 0 && newData == 1) {
        //強制加到大於數值
        this.edit.winPoint = limitPoint
        this.changeWinPrice = limitPrice
      } else if (oldData == limitPrice && newData == limitPrice - 1) {
        this.edit.winPoint = 0
        this.changeWinPrice = 0
      } else if (Math.abs(newData - oldData) == 1) {
        this.edit.winPoint += newData - oldData
      }
    },
    'edit.winPoint': {
      handler(newData, oldData) {
        const limit = this.editPoint.limitWinPoint

        //0案增加
        if (oldData == 0 && newData == 1) {
          //強制加到大於數值
          this.edit.winPoint = limit
        }

        if (oldData == limit && newData == limit - 1) {
          this.edit.winPoint = 0
        }
      },
      immediate: true,
    },
    changeLossPrice(newData, oldData) {
      const limitPoint = this.editPoint.limitLossPoint
      const limitPrice = this.editPoint.limitLossPrice

      //0案增加
      if (oldData == 0 && newData == 1) {
        //強制加到大於數值
        this.edit.lossPoint = limitPoint
        this.changeLossPrice = limitPrice
      } else if (oldData == limitPrice && newData == limitPrice - 1) {
        this.edit.lossPoint = 0
        this.changeLossPrice = 0
      } else if (Math.abs(newData - oldData) == 1) {
        this.edit.lossPoint += newData - oldData
      }
    },
    'edit.lossPoint': {
      handler(newData, oldData) {
        const limit = this.editPoint.limitLossPoint

        //0案增加
        if (oldData == 0 && newData == 1) {
          //強制加到大於數值
          this.edit.lossPoint = limit
        }

        if (oldData == limit && newData == limit - 1) {
          //強制加到大於數值
          this.edit.lossPoint = 0
        }
      },
      immediate: true,
    },
    changeInvertedPrice(newData, oldData) {
      this.edit.invertedPoint += newData - oldData
    },
  },
  methods: {
    cantSetWinLoss(operation) {
      return operation[0] == 0 && operation[1] == 0 && operation[2] == 0 && operation[4] == 0
    },
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

      if (this.historyTabShow != 2) {
        //reset
        this.pointInputType = 1
      }
		},
    async query() {
      let _this = this

      if (this.form.start != '' && this.form.end != '') {
        await axios.post(process.env.NUXT_ENV_API_URL + "/query_moneylist?lang=" + this.lang, qs.stringify({
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
    checkRowShow(row) {
      //判斷是否顯示
      if (this.seeAllOrder == 0 && row.State != '未成交') {
        return false
      }

      if (this.seeAllOrder == 2 && row.State == '未成交') {
        return false
      }

      return true
    },
    handleClick() {},
  }
}
</script>