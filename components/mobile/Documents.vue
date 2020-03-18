<template lang='pug'>
.page
  client-only
    include mixins.pug
  .header
    .header__title 單據列表
  .main
    ul.nav-list
      +nav-list-item('handleDocument', '1', '買賣單據', 'list_alt')
      +nav-list-item('handleDocument', '2', '未平倉單', 'format_indent_decrease')
      +nav-list-item('handleDocument', '3', '已平倉單', 'format_indent_increase')
      +nav-list-item('handleDocument', '4', '掛單', 'format_indent_increase')
      +nav-list-item('handleDocument', '5', '商品統計', 'table_chart')
    template(v-if='documentShow == 1')
      .modals.documents
        .page
          .header
            .header__left
              el-link(@click='handleDocument(0)' icon='el-icon-arrow-left' :underline='false') 返回
            .header__title 買賣單據
          .main
            .area
              .area__header
                button.button(@click="multiDeleteAllClick(true)") 全選
                button.button(@click="multiDeleteAllClick(false)") 全不選
                button.button(@click="openMultiDelete") 刪單
            .area(style="height: calc(100% - 40px); overflow-y: scroll;")
              table.custom__table
                thead.thead
                  tr
                    th
                    th(style="width: 100px;").text__center 操作
                    th 不留倉
                    th 序號
                    th(style="width: 100px;") 商品
                    th 多空
                    th 委託價
                    th 口數
                    th 成交價
                    th 型別
                    th 損失點數
                    th 獲利點數
                    th(style="width: 180px;") 下單時間
                    th(style="width: 180px;") 完成時間
                    th(style="width: 130px;") 狀態
                tbody.tbody(@scroll="tbodyScroll($event)")
                  tr(v-for="row in $store.state.buySell" @click="trClick($event)")
                    td
                      input(class="m-0" type="checkbox" v-model="multiDeleteSelect" :value="row.Serial" v-if="row.Operation[1]")
                    td(title='操作' style="width: 100px;").text__center
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
                    td(:class="checkBuySellColor(row)") {{ row['BuyOrSell'] == 0 ? '多' : '空' }}
                    td(:class="checkBuySellColor(row)") {{ row.OrderPrice }}
                    td(:class="checkBuySellColor(row)") {{ row.Quantity }}
                    td(:class="checkBuySellColor(row)") {{ row.FinalPrice }}
                    td(:class="checkBuySellColor(row)") {{ row.Odtype }}
                    td
                      button.button.button__success(:disabled="cantSetWinLoss(row.Operation)" @click="openEdit(row, 'loss')") {{ Number(row.LossPoint) }}
                    td
                      button.button.button__danger(:disabled="cantSetWinLoss(row.Operation)" @click="openEdit(row, 'win')") {{ Number(row.WinPoint) }}
                    td(:class="checkBuySellColor(row)" style="width: 180px;") {{ row.OrderTime }}
                    td(:class="checkBuySellColor(row)" style="width: 180px;") {{ row.FinalTime }}
                    td(style="width: 130px;")
                      span.blink(v-if="row.State == '未成交'") {{ row.State }}
                      span(v-else) {{ row.State }}
                  tr(class="non-data" v-if="$store.state.buySell.length == 0")
                    td 無資料
    template(v-if='documentShow == 2')
      .modals.documents
        .page
          .header
            .header__left
              el-link(@click='handleDocument(0)' icon='el-icon-arrow-left' :underline='false') 返回
            .header__title 未平倉單
          .main
            .area
              .area__header
                button.button(@click="multiOrderAllClick(true)") 全選
                button.button(@click="multiOrderAllClick(false)") 全不選
                button.button(@click="openMultiOrder") 平倉
                div(style="margin: 10px") 損益設定
                  label.radio.inline
                    input.radio__input(type="radio" v-model='pointInputType' value='1')
                    span.radio__label 點數輸入
                  label.radio.inline
                    input.radio__input(type="radio" v-model='pointInputType' value='2')
                    span.radio__label 行情輸入
            .area(style="height: calc(100% - 40px); overflow-y: scroll;")
              table.custom__table
                thead.thead
                  tr
                    th(style="width: 40px;")
                    th(style="width: 60px;").text__center 操作
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
                    th(style="width: 110px;") 昨日損益
                tbody.tbody(@scroll="tbodyScroll($event)")
                  tr(v-for="row in $store.state.uncovered" @click="trClick($event)")
                    td(style="width: 40px;").text__center
                      input(class="m-0" type="checkbox" v-model="multiOrderSelect" :value="row.Serial" :disabled="!row.Operation[2]")
                    td(style="width: 60px;")
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
                    td(style="width: 110px;")
                      div(v-if="row.OriginalMoney > 0")
                        span(:class="getMoneyColor(row.OriginalMoney)" style="text-decoration:underline;" @click="openDetail(row)") {{ row.OriginalMoney | currency }}
                  tr(class="non-data" v-if="$store.state.uncovered.length == 0")
                    td 無資料
    template(v-if='documentShow == 3')
      .modals.documents
        .page
          .header
            .header__left
              el-link(@click='handleDocument(0)' icon='el-icon-arrow-left' :underline='false') 返回
            .header__title 已平倉單
          .main
            table.custom__table
              thead.thead
                tr
                  th(style="width: 100px;") 商品
                  th(style="width: 110px;") 新倉序號
                  th(style="width: 110px;") 平倉序號
                  th(style="width: 100px;") 新倉型別
                  th 口數
                  th 多空
                  th 成交價
                  th 平倉價
                  th(style="width: 180px;") 成交日期
                  th(style="width: 180px;") 平倉日期
                  th 點數
                  th 種類
                  th 手續費
                  th 損益
              tbody.tbody(@scroll="tbodyScroll($event)")
                tr(v-for="row in $store.state.covered" @click="trClick($event)")
                  td(style="width: 100px;") {{ row.Name }}
                  td(style="width: 110px;") {{ row.NewSerial }}
                  td(style="width: 110px;") {{ row.CoverSerial }}
                  td(style="width: 100px;")
                    span(:class="row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ row['NewType'] }}
                  td
                    span(:class="row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ row['SerialCoveredNum'] }}
                  td
                    span(:class="row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ row['BuyOrSell'] == 0 ? '多' : '空' }}
                  td
                    span(:class="row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ row['NewPrice'] }}
                  td
                    span(:class="row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'") {{ row['CoverPrice'] }}
                  td(style="width: 180px;") {{ row.NewDate }}
                  td(style="width: 180px;") {{ row.CoverDate }}
                  td
                    .change-icon
                      .icon-arrow(:class="row['Point'] > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
                    span(:class="row['Point'] > 0 ? 'text__danger' : 'text__success'") {{ row['Point'] }}
                  td {{ row.CoverType }}
                  td {{ row.TotalFee }}
                  td
                    span(:class="getMoneyColor(row.Money)") {{ row['Money'] }}
                tr(class="non-data" v-if="$store.state.covered.length == 0")
                  td 無資料
    template(v-if='documentShow == 4')
      .modals.documents
        .page
          .header
            .header__left
              el-link(@click='handleDocument(0)' icon='el-icon-arrow-left' :underline='false') 返回
            .header__title 掛單
          .main
            .area
              .area__header
                button.button(@click="multiDeleteAllClick(true)") 全選
                button.button(@click="multiDeleteAllClick(false)") 全不選
                button.button(@click="openMultiDelete") 刪單
            .area(style="height: calc(100% - 40px); overflow-y: scroll;")
              table.custom__table
                thead.thead
                  tr
                    th(style="width: 40px;")
                    th(style="width: 100px;").text__center 操作
                    th 不留倉
                    th 序號
                    th(style="width: 100px;") 商品
                    th 多空
                    th 委託價
                    th 口數
                    th 成交價
                    th 型別
                    th 損失點數
                    th 獲利點數
                    th(style="width: 180px;") 下單時間
                    th(style="width: 180px;") 完成時間
                    th(style="width: 130px;") 狀態
                tbody.tbody(@scroll="tbodyScroll($event)")
                  tr(v-for="row in $store.state.buySell" @click="trClick($event)" v-if="checkBuySell(row)")
                    td(style="width: 40px;").text__center
                      input(class="m-0" type="checkbox" v-model="multiDeleteSelect" :value="row.Serial" v-if="row.Operation[1]")
                    td(title='操作' style="width: 100px;").text__center
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
                    td(:class="checkBuySellColor(row)") {{ row['BuyOrSell'] == 0 ? '多' : '空' }}
                    td(:class="checkBuySellColor(row)") {{ row.OrderPrice }}
                    td(:class="checkBuySellColor(row)") {{ row.Quantity }}
                    td(:class="checkBuySellColor(row)") {{ row.FinalPrice }}
                    td(:class="checkBuySellColor(row)") {{ row.Odtype }}
                    td
                      button.button.button__success(:disabled="cantSetWinLoss(row.Operation)" @click="openEdit(row, 'loss')") {{ Number(row.LossPoint) }}
                    td
                      button.button.button__danger(:disabled="cantSetWinLoss(row.Operation)" @click="openEdit(row, 'win')") {{ Number(row.WinPoint) }}
                    td(:class="checkBuySellColor(row)" style="width: 180px;") {{ row.OrderTime }}
                    td(:class="checkBuySellColor(row)" style="width: 180px;") {{ row.FinalTime }}
                    td(style="width: 130px;")
                      span.blink(v-if="row.State == '未成交'") {{ row.State }}
                      span(v-else) {{ row.State }}
                  tr(class="non-data" v-if="$store.state.buySell.length == 0")
                    td 無資料
    template(v-if='documentShow == 5')
      .modals.documents
        .page
          .header
            .header__left
              el-link(@click='handleDocument(0)' icon='el-icon-arrow-left' :underline='false') 返回
            .header__title 商品統計
          .main
            table.custom__table
              thead.thead
                tr
                  th(style="width: 100px;") 商品名稱
                  th.text__center 總多
                  th.text__center 總空
                  th.text__center 未平倉
                  th.text__center 總口數
                  th(style="width: 120px;") 手續費合計
                  th 損益
                  th 留倉預扣
              tbody.tbody(@scroll="tbodyScroll($event)")
                tr(v-for="row in $store.state.commodity" @click="trClick($event)")
                  td(field="Name" title='商品名稱' style="width: 100px;") {{ row.Name }}
                  td.text__center
                    span.text__danger {{ row.TotalBuySubmit }}
                  td.text__center
                    span.text__success {{ row.TotalSellSubmit }}
                  td
                    span(class="cell text__center bg__danger" v-if="row.RemainingBuyStock - row.RemainingSellStock > 0") {{ row.RemainingBuyStock - row.RemainingSellStock }}
                    span(class="cell text__center bg__success" v-else) {{ Math.abs(row.RemainingBuyStock - row.RemainingSellStock) }}
                  td.text__center {{ row.TotalSubmit }}
                  td(style="width: 120px;")  {{ row.TotalFee }}
                  td
                    span(:class="getMoneyColor(row.TodayMoney)") {{ row.TodayMoney }}
                  td
                    span(:class="getMoneyColor(row.RemainingWithholding)") {{ row.RemainingWithholding }}
                tr(class="non-data" v-if="$store.state.commodity.length == 0")
                  td 無資料
    //-改價減量
    el-dialog(
      :visible.sync='editDialog'
      :modal='false'
      v-dialogDrag
      width="300px"
      title='改價減量')
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
      width="200px"
      title='確認平倉')
      .header-custom(slot='title')
        i.el-icon-info
        |  確認平倉
      table.popupAllSingleSelectNo.my-2(v-for="item in multiOrderData")
        tbody
          tr
            td.title 序號
            td {{ item.serial }}
          tr
            td.title 商品
            td {{ item.name }}
          tr
            td.title 委託
            td {{ item.price }}
          tr
            td.title 多空
            td
              span(:class="item.buy == 0 ? 'text__danger' : 'text__success'") {{ item.buy == 0 ? '多' : '空' }}
          tr
            td.title 口數
            td {{ item.submit }}
      .dialog__footer
        el-button(@click="multiOrderConfirm = false") 取消
        el-button(type='primary' @click="doMultiCovered") 確認
    //-刪除
    el-dialog(
      :visible.sync='deleteConfirm'
      :modal='false'
      v-dialogDrag
      :show-close='false'
      width="200px"
      title='確認刪除')
      .header-custom(slot='title')
        |  確認刪除
      table.popupAllSingleSelectNo.my-2(v-for="item in multiDeleteData")
        tbody
          tr
            td.title 序號
            td {{ item.serial }}
          tr
            td.title 商品
            td {{ item.name }}
          tr
            td.title 委託
            td {{ item.price }}
          tr
            td.title 多空
            td
              span(:class="item.buy == 0 ? 'text__danger' : 'text__success'") {{ item.buy == 0 ? '多' : '空' }}
          tr
            td.title 口數
            td {{ item.submit }}
      .dialog__footer
        button.button(@click="deleteConfirm = false") 取消
        button.button(type='primary' @click="doDelete") 確認
</template>

<script>

import { mapState } from 'vuex'
//-改單用
import "@/plugins/betListPoint.js"

export default {
  data () {
    return {
      //點數1 行情2
      pointInputType: 1,
      documentShow: 0,
      checked: false,
      isMobile: '',
      userId: '',
      token: '',
      lang: '',
      form: {
        start: '',
        end: '',
      },
      activeName: 'tabs1',
    };
  },
  mounted() {
    this.userId = this.$store.state.localStorage.userAuth.userId
    this.token = this.$store.state.localStorage.userAuth.token
    this.lang = this.$store.state.localStorage.lang
    this.isMobile = this.$store.state.isMobile

    this.computedTableContent()
  },
  computed: mapState({
    mainItem: 'mainItem',
  }),
  watch: {
    documentShow() {
      const _this = this

      setTimeout(function() {
        _this.computedTableContent()
      }, 0)
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

        if (limit == 0) {
          return
        }

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

        if (limit == 0) {
          return
        }

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
    handleDocument(e) {
			this.documentShow = e

      if (this.documentShow != 2) {
        //reset
        this.pointInputType = 1
      }
    },
    cantSetWinLoss(operation) {
      return operation[0] == 0 && operation[1] == 0 && operation[2] == 0 && operation[4] == 0
    },
    handleClick() {},
    checkBuySell(row) {
      //限價單 or 未成交
      if (row.OrderPrice <= 0 && row.State != '未成交') {
        return false
      } else {
        return true
      }
    },
  }
}
</script>