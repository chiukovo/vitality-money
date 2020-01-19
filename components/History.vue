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
          label.checkbox.inline
            input.checkbox__input(v-model="autoGoButtom" type="checkbox" value="1")
            span.checkbox__label 自動置底
    .history-content__body(:style="{height: height.buySell}")
      client-only
        vxe-table(
          ref="buySellxTable"
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
              input(class="m-0" type="checkbox" v-model="multiDeleteSelect" :value="scope.row.Serial" v-if="scope.row.Operation[1]")
          vxe-table-column(title='操作' width="80" align="center")
            template(slot-scope='scope')
              button.button(v-if="scope.row.Operation[0] || !cantSetWinLoss(scope.row.Operation)" @click="openEdit(scope.row, 'edit')") 改
              //-改單
              button.button(v-if="scope.row.Operation[1]" @click="deleteOrder(scope.row)") 刪
              button.button(v-if="scope.row.Operation[2]" @click="doCovered(scope.row, 1)") 平
          vxe-table-column(title='不留倉')
            template(slot-scope='scope' v-if="scope.row.Operation[2]")
              label.checkbox
                input.checkbox__input(type="checkbox" style="margin: 0" :checked="scope.row.DayCover" @click="changeDayCover(scope.row)" :disabled="dayCoverIsDisabled(scope.row.ID)")
                span.checkbox__label 不留倉
          vxe-table-column(field='Serial' title='序號')
          vxe-table-column(field='Name' title='商品' width="94")
          vxe-table-column(title='多空' width="40px" align="center")
            template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
          vxe-table-column(field='OrderPrice' title='委託價')
          vxe-table-column(field='Quantity' title='口數' width="40px" align="center")
          vxe-table-column(field='FinalPrice' title='成交價')
          vxe-table-column(field='Odtype' title='型別')
          vxe-table-column(title='損失點數' align="center")
            template(slot-scope='scope')
              button.button.button__success(:disabled="cantSetWinLoss(scope.row.Operation)" @click="openEdit(scope.row, 'loss')") {{ Number(scope.row.LossPoint) }}
          vxe-table-column(title='獲利點數' align="center")
            template(slot-scope='scope')
              button.button.button__danger(:disabled="cantSetWinLoss(scope.row.Operation)" @click="openEdit(scope.row, 'win')") {{ Number(scope.row.WinPoint) }}
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
        span(style="padding: 0 10px") 損益設定
        label.radio.inline
          input.radio__input(type="radio" v-model='pointInputType' value='1')
          span.radio__label 點數輸入
        label.radio.inline
          input.radio__input(type="radio" v-model='pointInputType' value='2')
          span.radio__label 行情輸入
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
          vxe-table-column(width="50" align="center")
            template(slot-scope='scope')
              input(class="m-0" type="checkbox" v-model="multiOrderSelect" :value="scope.row.Serial" :disabled="!scope.row.Operation[2]")
          vxe-table-column(title='操作' align="center")
            template(slot-scope='scope')
              button.button(v-if="scope.row.Operation[2]" @click="doCovered(scope.row, 1)") 平
          vxe-table-column(title='不留倉')
            template(slot-scope='scope' v-if="scope.row.Operation[2]")
              label.checkbox
                input.checkbox__input(type="checkbox" style="margin: 0" :checked="scope.row.DayCover" @click="changeDayCover(scope.row)" :disabled="dayCoverIsDisabled(scope.row.ID)")
                span.checkbox__label 不留倉
          vxe-table-column(field='Serial' title='序號')
          vxe-table-column(field='Name' title='商品' width="94")
          vxe-table-column(title='買賣' width="40")
            template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
          vxe-table-column(field='Odtype', title='型別')
          vxe-table-column(field='FinalPrice' title='成交價')
          vxe-table-column(field='Quantity' title='口數')
          vxe-table-column(field='TotalFee' title='手續費')
          vxe-table-column(title='損失點數' align="center")
            template(slot-scope='scope')
              button.button.button__success(:disabled="cantSetWinLoss(scope.row.Operation)" @click="openEdit(scope.row, 'loss')") {{ Number(scope.row.LossPoint) }}
          vxe-table-column(title='獲利點數' align="center")
            template(slot-scope='scope')
              button.button.button__danger(:disabled="cantSetWinLoss(scope.row.Operation)" @click="openEdit(scope.row, 'win')") {{ Number(scope.row.WinPoint) }}
          vxe-table-column(title='倒限(利)' align="center")
            template(slot-scope='scope')
              button.button(:disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEdit(scope.row, 'inverted')") {{ Number(scope.row.InvertedPoint) }}
          vxe-table-column(title='未平損益')
            template(slot-scope='scope')
              span(v-if="scope.row['thisSerialTotalMoney'] == 0" class="text__black") {{ scope.row['thisSerialTotalMoney'] }}
              span(v-else :class="scope.row['thisSerialTotalMoney'] > 0 ? 'text__danger' : 'text__success'") {{ scope.row['thisSerialTotalMoney'] }}
          vxe-table-column(title='點數')
            template(slot-scope='scope')
              .change-icon
                .icon-arrow(v-if="scope.row['thisSerialPointDiff'] != 0" :class="scope.row['thisSerialPointDiff'] > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
              span(v-if="scope.row['thisSerialPointDiff'] == 0" class="text__black") {{ scope.row['thisSerialPointDiff'] }}
              span(v-else :class="scope.row['thisSerialPointDiff'] > 0 ? 'text__danger' : 'text__success'") {{ scope.row['thisSerialPointDiff'] }}
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
          vxe-table-column(field="Name" title='商品' width="94")
          vxe-table-column(field="NewSerial" title='新倉序號')
          vxe-table-column(field="CoverSerial" title='平倉序號')
          vxe-table-column(title='新倉型別')
            template(slot-scope='scope')
              span(:class="scope.row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ scope.row['NewType'] }}
          vxe-table-column(title='口數')
            template(slot-scope='scope')
              span(:class="scope.row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ scope.row['SerialCoveredNum'] }}
          vxe-table-column(title='多空')
            template(slot-scope='scope')
              span(:class="scope.row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
          vxe-table-column(title='成交價')
            template(slot-scope='scope')
              span(:class="scope.row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ scope.row['NewPrice'] }}
          vxe-table-column(title='平倉價')
            template(slot-scope='scope')
              span(:class="scope.row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ scope.row['CoverPrice'] }}
          vxe-table-column(field="NewDate" title='成交日期' width="150px")
          vxe-table-column(field="CoverDate" title='平倉日期' width="150px")
          vxe-table-column(title='點數')
            template(slot-scope='scope')
              .change-icon
                .icon-arrow(:class="scope.row['Point'] > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
              span(:class="scope.row['Point'] > 0 ? 'text__danger' : 'text__success'") {{ scope.row['Point'] }}
          vxe-table-column(field="CoverType" title='種類')
          vxe-table-column(field="TotalFee" title='手續費')
          vxe-table-column(title='損益')
            template(slot-scope='scope')
              span(:class="scope.row['Money'] > 0 ? 'text__danger' : 'text__success'") {{ scope.row['Money'] }}
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
      client-only
        vxe-table(
          :data='$store.state.commodity'
          :row-class-name="checkRowShow"
          max-width="100%"
          height="100%"
          size="mini"
          column-min-width="60"
          align="center"
          border
          auto-resize
          highlight-current-row)
          vxe-table-column(field="Name" title='商品名稱')
          vxe-table-column(title='總多')
            template(slot-scope='scope')
              span.text__danger {{ scope.row.TotalBuySubmit }}
          vxe-table-column(title='總空')
            template(slot-scope='scope')
              span.text__success {{ scope.row.TotalSellSubmit }}
          vxe-table-column(title='未平倉')
            template(slot-scope='scope')
              <span class="bg__danger" v-if="scope.row.RemainingBuyStock - scope.row.RemainingSellStock > 0">{{ scope.row.RemainingBuyStock - scope.row.RemainingSellStock }}</span>
              <span class="bg__success" v-else>{{ Math.abs(scope.row.RemainingBuyStock - scope.row.RemainingSellStock) }}</span>
          vxe-table-column(field="TotalSubmit" title='總口數')
          vxe-table-column(field="TotalFee" title='手續費合計')
          vxe-table-column(title='損益')
            template(slot-scope='scope')
              span.text__success(v-if="scope.row.TodayMoney < 0") {{ scope.row.TodayMoney }}
              span.text__danger(v-else) {{ scope.row.TodayMoney }}
          vxe-table-column(title='留倉預扣')
            template(slot-scope='scope')
              span.text__success(v-if="scope.row.RemainingWithholding < 0") {{ scope.row.RemainingWithholding}}
              span.text__danger(v-else) {{ scope.row.RemainingWithholding}}
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
          vxe-table-column(title='預設額度')
            template(slot-scope='scope') {{ scope.row.TouchPoint | currency }}
          vxe-table-column(title='帳戶餘額')
            template(slot-scope='scope') {{ scope.row.RemainingMoney | currency }}
          vxe-table-column(title='今日損益')
            template(slot-scope='scope')
              span.text__success(v-if="scope.row.TodayMoney >= 0") {{ scope.row.TodayMoney | currency }}
              span.text__danger(v-else) {{ scope.row.TodayMoney | currency }}
          vxe-table-column(field="TotalSubmit" title='口數')
          vxe-table-column(title='留倉預扣')
            template(slot-scope='scope') {{ scope.row.Withholding | currency }}
          vxe-table-column(title='對匯額度')
            template(slot-scope='scope') {{ scope.row.Limitpoint | currency }}
          vxe-table-column(title='交收')
            template(slot-scope='scope') {{ scope.row.Uppay | currency }}
    //-el-tab-pane(title='投顧訊息(0)', name='tabs6')
    //-el-tab-pane(title='自訂窗口', name='tabs7')
  Message(v-show='historyTabShow == 6' :tabShow="historyTabShow")
  //-改價減量
  el-dialog(
    :visible.sync='editDialog'
    :modal='false'
    width="320px"
    v-dialogDrag)
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
              span.ml-2 {{ findMainItemById(edit.itemId).gain_percent }}
        el-form(ref='form' size='mini' label-width='70px')
          .edit-base(v-if="editType == 'edit'")
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
            .win-point(v-if="editType == 'win' || editType == 'edit'")
              p.pl-15 新獲利點需大於:
                span.text__bold.bg-colr-warring [ {{ editPoint.limitWinPoint }} ]
              el-form-item(label="獲利點")
                el-input-number(v-model="edit.winPoint")
            .loss-point(v-if="editType == 'loss' || editType == 'edit'")
              p.pl-15 新損失點需大於:
                span.text__bold.bg-colr-warring [ {{ editPoint.limitLossPoint }} ]
              el-form-item(label="損失點")
                el-input-number(v-model="edit.lossPoint")
            .inverted-point(v-if="editType == 'inverted' || editType == 'edit'")
              p.pl-15 新倒限利不得大於:
                span.text__bold.bg-colr-warring [ {{ editPoint.limitWinPoint }} ]
              el-form-item(label="倒限點")
                el-input-number(v-model="edit.invertedPoint")
          //-行情輸入
          .money-input(v-show="pointInputType == 2")
            .win-point(v-if="editType == 'win' || editType == 'edit'")
              p.pl-15 新獲利點需大於:
                span.text__bold.bg-colr-warring [ {{ editPoint.limitWinPrice }} ]
              el-form-item(label="獲利點")
                el-input-number(v-model="changeWinPrice")
            .loss-point(v-if="editType == 'loss' || editType == 'edit'")
              p.pl-15 新損失點需大於:
                span.text__bold.bg-colr-warring [ {{ editPoint.limitLossPrice }} ]
              el-form-item(label="損失點")
                el-input-number(v-model="changeLossPrice")
            .inverted-point(v-if="editType == 'inverted' || editType == 'edit'")
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
      window.setTimeout(( () => this.computedHeight() ), 100)
    },
    seeAllOrder() {
      this.$refs.buySellxTable.refreshColumn()
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
    checkRowShow({row, index}) {
      if (!row.show && !this.checked) {
        return 'hide'
      }
    },
    handleClick() {},
    buySelltableCellClassName({ row, column, columnIndex }) {
      //判斷是否顯示
      if (this.seeAllOrder == 0 && row.State != '未成交') {
        return 'hide'
      }

      if (columnIndex >= 3 && columnIndex <= 12) {
        if (row.BuyOrSell == 0) {
          return 'text__danger'
        } else {
          return 'text__success'
        }
      }
    },
    uncoveredTableCellClassName({ row, column, columnIndex }) {
      if (columnIndex >= 1 && columnIndex <= 13) {
        if (row.BuyOrSell == 0) {
          return 'text__danger'
        } else {
          return 'text__success'
        }
      }
    }
  }
}
</script>