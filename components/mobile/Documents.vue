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
              client-only
                vxe-table(
                  :data='$store.state.buySell'
                  :cell-class-name='buySelltableCellClassName'
                  @checkbox-change="selectionChangeDelete"
                  ref="xTableBuySell"
                  max-width="100%"
                  height="100%"
                  column-min-width="90"
                  size="mini"
                  border
                  auto-resize
                  :checkbox-config="{checkStrictly: true}")
                  vxe-table-column(field='Name' title='商品' fixed="left" width="110")
                  vxe-table-column(title='操作' align="center" width="142")
                    template(slot-scope='scope')
                      input(type="checkbox" v-model="multiDeleteSelect" :value="scope.row.Serial" v-if="scope.row.Operation[1]")
                      button.button(v-if="scope.row.Operation[0] || !notSetWinLoss(scope.row.Operation)" @click="openEdit(scope.row, 'edit')") 改
                      button.button(v-if="scope.row.Operation[1]" @click="deleteOrder(scope.row)") 刪
                      button.button(v-if="scope.row.Operation[2]" @click="doCovered(scope.row, 1)") 平
                  vxe-table-column(title='不留倉')
                    template(slot-scope='scope' v-if="scope.row.Operation[2]")
                      label.checkbox
                        input.checkbox__input(type="checkbox" style="margin: 0" :checked="scope.row.DayCover" @click="changeDayCover(scope.row)" :disabled="dayCoverIsDisabled(scope.row.ID)")
                        span.checkbox__label 不留倉
                  vxe-table-column(title='多空' width="60px"  align="center")
                    template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
                  vxe-table-column(field='OrderPrice' title='委託價')
                  vxe-table-column(field='Quantity' title='口數' align="center")
                  vxe-table-column(field='FinalPrice' title='成交價')
                  vxe-table-column(field='Odtype' title='型別')
                  vxe-table-column(title='損失點數' align="center")
                    template(slot-scope='scope')
                      button.button.button__success(:disabled="canSetWinLoss(scope.row.Operation)" @click="openEdit(scope.row, 'loss')") {{ Number(scope.row.LossPoint) }}
                  vxe-table-column(title='獲利點數' align="center")
                    template(slot-scope='scope')
                      button.button.button__danger(:disabled="canSetWinLoss(scope.row.Operation)" @click="openEdit(scope.row, 'win')") {{ Number(scope.row.WinPoint) }}
                  vxe-table-column(title='倒限(利)' align="center")
                    template(slot-scope='scope')
                      button.button(:disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEdit(scope.row, 'inverted')") {{ Number(scope.row.InvertedPoint) }}
                  vxe-table-column(field='OrderTime' width="180px" title='下單時間')
                  vxe-table-column(field='FinalTime' width="180px" title='完成時間')
                  vxe-table-column(title='狀態' width='150px')
                    template(slot-scope='scope')
                      span.blink(v-if="scope.row.State == '未成交'") {{ scope.row.State }}
                      span(v-else) {{ scope.row.State }}
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
            .area(style="height: calc(100% - 40px); overflow-y: scroll;")
              client-only
                vxe-table(
                  :data='$store.state.uncovered'
                  :cell-class-name='uncoveredTableCellClassName',
                  ref="multipleTable"
                  max-width="100%"
                  height="auto"
                  column-min-width="90"
                  size="mini"
                  border
                  auto-resize)
                  vxe-table-column(field='Name' fixed="left" title='商品' width="150")
                    template(slot-scope='scope')
                      input(type="checkbox" v-model="multiOrderSelect" :value="scope.row.Serial" v-if="scope.row.Operation[2]")
                      span {{ scope.row.Name }}
                  vxe-table-column(title='操作' align="center" width="70")
                    template(slot-scope='scope')
                      button.button(v-if="scope.row.Operation[2]" @click="doCovered(scope.row, 1)") 平
                  vxe-table-column(title='不留倉')
                    template(slot-scope='scope' v-if="scope.row.Operation[2]")
                      label.checkbox
                        input.checkbox__input(type="checkbox" style="margin: 0" :checked="scope.row.DayCover" @click="changeDayCover(scope.row)" :disabled="dayCoverIsDisabled(scope.row.ID)")
                        span.checkbox__label 不留倉
                  vxe-table-column(field='Serial', title='序號')
                  vxe-table-column(title='買賣')
                    template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
                  vxe-table-column(field='Odtype', title='型別')
                  vxe-table-column(field='FinalPrice', title='成交價')
                  vxe-table-column(field='Quantity', title='口數')
                  vxe-table-column(field='TotalFee', title='手續費')
                  vxe-table-column(title='損失點數' align="center")
                    template(slot-scope='scope')
                      button.button.button__success(:disabled="canSetWinLoss(scope.row.Operation)" @click="openEdit(scope.row, 'loss')") {{ Number(scope.row.LossPoint) }}
                  vxe-table-column(title='獲利點數' align="center")
                    template(slot-scope='scope')
                      button.button.button__danger(:disabled="canSetWinLoss(scope.row.Operation)" @click="openEdit(scope.row, 'win')") {{ Number(scope.row.WinPoint) }}
                  vxe-table-column(title='倒限(利)' align="center")
                    template(slot-scope='scope')
                      button.button(:disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEdit(scope.row, 'inverted')") {{ Number(scope.row.InvertedPoint) }}
                  vxe-table-column(field='thisSerialTotalMoney', title='未平損益')
                    template(slot-scope='scope')
                      span(v-if="scope.row['thisSerialTotalMoney'] == 0" class="text__black") {{ scope.row['thisSerialTotalMoney'] }}
                      span(v-else :class="scope.row['thisSerialTotalMoney'] < 0 ? 'text__success' : 'text__danger'") {{ scope.row['thisSerialTotalMoney'] }}
                  vxe-table-column(title='點數')
                    template(slot-scope='scope')
                      .change-icon
                        .icon-arrow(v-if="scope.row['thisSerialPointDiff'] != 0" :class="scope.row['thisSerialPointDiff'] > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
                      span(v-if="scope.row['thisSerialPointDiff'] == 0" class="text__black") {{ scope.row['thisSerialPointDiff'] }}
                      span(v-else :class="scope.row['thisSerialPointDiff'] < 0 ? 'text__success' : 'text__danger'") {{ scope.row['thisSerialPointDiff'] }}
                  vxe-table-column(field='Day', title='天數')
                  vxe-table-column(field='State', title='狀態' width="150px")
    template(v-if='documentShow == 3')
      .modals.documents
        .page
          .header
            .header__left
              el-link(@click='handleDocument(0)' icon='el-icon-arrow-left' :underline='false') 返回
            .header__title 已平倉單
          .main
            client-only
              vxe-table.table(
                :data='$store.state.covered'
                :cell-class-name='coveredTableCellClassName'
                max-width="100%"
                height="100%"
                column-min-width="90"
                size="mini"
                border
                auto-resize)
                vxe-table-column(field="Name" title='商品' fixed="left" width="130")
                vxe-table-column(field="NewSerial" title='新倉序號')
                vxe-table-column(field="CoverSerial" title='平倉序號')
                vxe-table-column(field="NewType" title='新倉型別')
                vxe-table-column(field="SerialCoveredNum" title='口數')
                vxe-table-column(title='多空')
                  template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
                vxe-table-column(field="NewPrice" title='成交價')
                vxe-table-column(field="CoverPrice" title='平倉價')
                vxe-table-column(field="NewDate" title='成交日期' width="180px")
                vxe-table-column(field="CoverDate" title='平倉日期' width="180px")
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
              client-only
                vxe-table(
                  :data='$store.state.buySell'
                  :cell-class-name='buySellDetailtableCellClassName'
                  @checkbox-change="selectionChangeDelete"
                  ref="xTableBuySell"
                  max-width="100%"
                  height="100%"
                  column-min-width="90"
                  size="mini"
                  border
                  auto-resize
                  :checkbox-config="{checkStrictly: true}")
                  vxe-table-column(field='Name' title='商品' fixed="left" width="110")
                  vxe-table-column(title='操作' align="center" width="142")
                    template(slot-scope='scope')
                      input(type="checkbox" v-model="multiDeleteSelect" :value="scope.row.Serial" v-if="scope.row.Operation[1]")
                      button.button(v-if="scope.row.Operation[0]" @click="openEdit(scope.row)") 改
                      button.button(v-if="scope.row.Operation[1]" @click="deleteOrder(scope.row)") 刪
                      button.button(v-if="scope.row.Operation[2]" @click="doCovered(scope.row, 1)") 平
                  vxe-table-column(title='多空' width="60px"  align="center")
                    template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
                  vxe-table-column(field='OrderPrice' title='委託價')
                  vxe-table-column(field='Quantity' title='口數' align="center")
                  vxe-table-column(field='FinalPrice' title='成交價')
                  vxe-table-column(field='Odtype' title='型別')
                  vxe-table-column(title='損失點數' align="center")
                    template(slot-scope='scope')
                      button.button__success(:disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEditPoint('lossPointDialog', scope.row)") {{ Number(scope.row.LossPoint) }}
                  vxe-table-column(title='獲利點數' align="center")
                    template(slot-scope='scope')
                      button.button__danger(:disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEditPoint('winPointDialog', scope.row)") {{ Number(scope.row.WinPoint) }}
                  vxe-table-column(field='OrderTime' width="180px" title='下單時間')
                  vxe-table-column(field='FinalTime' width="180px" title='完成時間')
                  vxe-table-column(title='狀態' width='150px')
                    template(slot-scope='scope')
                      span.blink(v-if="scope.row.State == '未成交'") {{ scope.row.State }}
                      span(v-else) {{ scope.row.State }}
    template(v-if='documentShow == 5')
      .modals.documents
        .page
          .header
            .header__left
              el-link(@click='handleDocument(0)' icon='el-icon-arrow-left' :underline='false') 返回
            .header__title 商品統計
          .main
            client-only
            vxe-table.table(
              :data='$store.state.commodity'
              :row-class-name="checkRowShow"
              max-width="100%"
              height="100%"
              column-min-width="90"
              size="mini"
              border
              auto-resize)
              vxe-table-column(field="Name" title='商品名稱' width="130")
              vxe-table-column(title='總多')
                template(slot-scope='scope')
                  span.text__danger {{ scope.row.TotalBuySubmit　}}
              vxe-table-column(title='總空')
                template(slot-scope='scope')
                  span.text__success {{ scope.row.TotalSellSubmit}}
              vxe-table-column(title='未平倉')
                template(slot-scope='scope') {{ scope.row.RemainingBuyStock - scope.row.RemainingSellStock }}
              vxe-table-column(field="TotalSubmit" title='總口數')
              vxe-table-column(field="TotalFee" title='手續費合計' width="130")
              vxe-table-column(title='損益')
                template(slot-scope='scope')
                  span.text__success(v-if="scope.row.TodayMoney < 0") {{ scope.row.TodayMoney }}
                  span.text__danger(v-else) {{ scope.row.TodayMoney }}
              vxe-table-column(title='留倉預扣')
                template(slot-scope='scope')
                  span.text__success(v-if="scope.row.RemainingWithholding < 0") {{ scope.row.RemainingWithholding}}
                  span.text__danger(v-else) {{ scope.row.RemainingWithholding}}
    //-改價減量
    el-dialog(
      :visible.sync='editDialog'
      :modal='false'
      width="320px"
      title='改價減量'
      v-dialogDrag)
      .header-custom(slot='title') 改價減量
        .badge.badge-warning (點數)
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
                  input.radio__input(type="radio" v-model='edit.buyType' value='0')
                  span.radio__label 市價單
                label.radio.inline
                  input.radio__input(type="radio" v-model='edit.buyType' value='1')
                  span.radio__label 限價單
              el-form-item(label="限價" v-if="edit.buyType == '1'")
                el-input-number(v-model="edit.nowPrice")
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
          .badge.badge-warning 口數只能減少或不變， 損失點/ 獲利點 為
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
      width="96%"
      title='確認平倉'
      v-dialogDrag)
      .header-custom(slot='title')
        i.el-icon-info
        |  確認平倉
      client-only
        vxe-table.table(
          :data="multiOrderData"
          height="300px"
          borde
        )
          vxe-table-column(field="serial" title='序號')
          vxe-table-column(field="name" title='目標商品')
          vxe-table-column(field="userName" title='用戶名稱')
          vxe-table-column(field="buy" title='買賣')
          vxe-table-column(field="price" title='價格')
          vxe-table-column(field="submit" title='口數')
        .dialog__footer
          el-button(@click="multiOrderConfirm = false") 取消
          el-button(type='primary' @click="doMultiCovered") 確認
    //-刪除
    el-dialog(
      :visible.sync='deleteConfirm'
      :modal='false'
      :show-close='false'
      width="96%"
      title='確認刪除'
      v-dialogDrag)
      .header-custom(slot='title')
        i.el-icon-info
        |  確認刪除
      vxe-table.table(
        :data="multiDeleteData"
        style="width: 100%"
        height="300px"
        borde
      )
        vxe-table-column(field="serial" title='序號')
        vxe-table-column(field="name" title='目標商品')
        vxe-table-column(field="userName" title='用戶名稱')
        vxe-table-column(field="buy" title='買賣')
        vxe-table-column(field="price" title='價格')
        vxe-table-column(field="submit" title='口數')
      .dialog__footer
        el-button(@click="deleteConfirm = false") 取消
        el-button(type='primary' @click="doDelete") 確認
</template>

<script>

import { mapState } from 'vuex'
//-改單用
import "@/plugins/betListPoint.js"

export default {
  data () {
    return {
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
      checked: false,
      editDialog: false,
      deleteConfirm: false,
      multiOrderConfirm: false,
      selectToDelete: [],
      multiOrderData: [],
      multiOrderSelect: [],
      multiOrderAll: false,
      multiDeleteData: [],
      multiDeleteSelect: [],
    };
  },
  mounted() {
    this.userId = this.$store.state.localStorage.userAuth.userId
    this.token = this.$store.state.localStorage.userAuth.token
    this.lang = this.$store.state.localStorage.lang
    this.isMobile = this.$store.state.isMobile
  },
  computed: mapState({
    mainItem: 'mainItem',
  }),
  watch: {
    mainItem() {
      if (this.lossPointDialog || this.winPointDialog || this.profitPointDialog) {
        this.computedPointLimit()
      }
    },
  },
  methods: {
    notSetWinLoss(operation) {
      return operation[0] == 0 && operation[1] == 0 && operation[2] == 0 && operation[4] == 0
    },
    computedPointPrice() {
      this.editPoint.price = this.editPoint.computedPoint - this.editPoint.finalPrice
    },
    changeDayCover(row) {
      const _this = this
      const setDayCover = row.DayCover ? 0 : 1

      axios.post(process.env.NUXT_ENV_API_URL + "/set_serial_daycover?lang=" + this.lang, qs.stringify({
        UserID: this.userId,
        Token: this.token,
        DayCover: setDayCover,
        DayCoverSerialId: row.Serial,
      }))
      .then(response => {
        _this.$store.dispatch('CALL_MEMBER_ORDER_LIST')
        _this.$store.dispatch('CALL_MEMBER_INFO')
      })
    },
    handleDocument(e) {
			this.documentShow = e
    },
    canSetWinLoss(operation) {
      return operation[0] == 0 && operation[1] == 0 && operation[2] == 0 && operation[4] == 0
    },
    openMultiOrder() {
      let _this = this
      this.multiOrderData = []

      _this.multiOrderSelect.forEach(function(serial) {
        _this.$store.state.uncovered.forEach(function(row) {
          if (row.Serial == serial) {
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
    multiDeleteAllClick(allChecked) {
      let _this = this

      if (!allChecked) {
        _this.multiDeleteSelect = []
        return
      }

      _this.$store.state.buySell.forEach(function(val) {
        if (val.Operation[1]) {
          _this.multiDeleteSelect.push(val.Serial)
        }
      })
    },
    selectCheckDelete(row) {
      if (row.Operation[0]) {
        return true
      }

      return false
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
    selectionChangeDelete(target) {
      let _this = this
      this.multiDeleteData = []

      target.forEach(function(row) {
        _this.multiDeleteData.push({
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
        //return 'hide'
      }
    },
    deleteOrder(row) {
      this.multiDeleteData = []

      this.multiDeleteData.push({
        name: this.$store.state.itemName,
        userName: this.$store.state.userInfo.Account,
        buy: row.BuyOrSell == 0 ? '多' : '空',
        price: row.Odtype,
        submit: row.Quantity,
        itemId: row.ID,
        serial: row.Serial,
      })

      this.deleteConfirm = true
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
      //red
      if (columnIndex >= 0 && columnIndex <= 12) {
        if (row.BuyOrSell == 0) {
          return 'text__danger'
        } else {
          return 'text__success'
        }
      }
    },
    buySellDetailtableCellClassName({ row, column, columnIndex }) {
      //限價單 or 未成交
      if (row.OrderPrice <= 0 && row.State != '未成交') {
        return 'hide'
      }

      //red
      if (columnIndex >= 0 && columnIndex <= 12) {
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
    },
    coveredTableCellClassName({ row, column, columnIndex }) {
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