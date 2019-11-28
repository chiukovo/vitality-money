<template lang='pug'>
.page
  client-only
    include mixins.pug
  .header
    .header__title 單據列表
  .main
    ul.nav-list
      +nav-list-item('handleDocument', '1', '買賣單據')
      +nav-list-item('handleDocument', '2', '未平倉單')
      +nav-list-item('handleDocument', '3', '已平倉單')
      +nav-list-item('handleDocument', '4', '商品統計')
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
                  highlight-current-row
                  :checkbox-config="{checkStrictly: true}")
                  vxe-table-column(title='操作' width="166" align="center")
                    template(slot-scope='scope')
                      input(type="checkbox" v-model="multiDeleteSelect" :value="scope.row.Serial" v-if="scope.row.Operation[1]")
                      button.button(v-if="scope.row.Operation[0]" @click="openEdit(scope.row)") 改
                      button.button(v-if="scope.row.Operation[1]" @click="deleteOrder(scope.row)") 刪
                      button.button(v-if="scope.row.Operation[2]" @click="doCovered(scope.row, 1)") 平倉
                  vxe-table-column(field='Serial' title='序號')
                  vxe-table-column(field='Name' title='商品')
                  vxe-table-column(title='多空' width="60px"  align="center")
                    template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
                  vxe-table-column(field='OrderPrice' title='委託價')
                  vxe-table-column(field='Quantity' title='口數' align="center")
                  vxe-table-column(field='FinalPrice' title='成交價')
                  vxe-table-column(field='Odtype' title='型別')
                  vxe-table-column(title='損失點數' align="center")
                    template(slot-scope='scope')
                      button.button__success(:disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEditPoint('lossPointDialog', scope.row)") {{ parseInt(scope.row.LossPoint) }}
                  vxe-table-column(title='獲利點數' align="center")
                    template(slot-scope='scope')
                      button.button__danger(:disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEditPoint('winPointDialog', scope.row)") {{ parseInt(scope.row.WinPoint) }}
                  vxe-table-column(field='OrderTime' width='150' title='下單時間')
                  vxe-table-column(field='FinalTime' width='150' title='完成時間')
                  vxe-table-column(title='狀態' width='110')
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
                  auto-resize
                  highlight-current-row)
                  vxe-table-column(title='操作' align="center")
                    template(slot-scope='scope')
                      input(type="checkbox" v-model="multiOrderSelect" :value="scope.row.Serial" v-if="scope.row.Operation[2]")
                      button.button(v-if="scope.row.Operation[2]" @click="doCovered(scope.row, 1)") 平倉
                  vxe-table-column(field='Serial', title='序號')
                  vxe-table-column(field='Name', title='商品')
                  vxe-table-column(title='型別')
                    template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
                  vxe-table-column(field='FinalPrice', title='成交價')
                  vxe-table-column(field='Quantity', title='口數')
                  vxe-table-column(field='Fee', title='手續費')
                  vxe-table-column(title='損失點數')
                    template(slot-scope='scope')
                      button.button__success(:disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEditPoint('lossPointDialog', scope.row)") {{ scope.row.LossPoint }}
                  vxe-table-column(title='獲利點數')
                    template(slot-scope='scope')
                      button.button__danger(:disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEditPoint('winPointDialog', scope.row)") {{ scope.row.WinPoint }}
                  vxe-table-column(title='倒限(利)')
                    template(slot-scope='scope')
                      button.button(:disabled="scope.row.Operation[3] == 0 ? true : false" @click="openEditPoint('profitPointDialog', scope.row)") {{ scope.row.InvertedPoint }}
                  vxe-table-column(field='thisSerialTotalMoney', title='未平損益')
                    template(slot-scope='scope')
                      span(v-if="scope.row['thisSerialTotalMoney'] == 0" class="text__black") {{ scope.row['thisSerialTotalMoney'] }}
                      span(v-else :class="scope.row['thisSerialTotalMoney'] > 0 ? 'text__up' : 'text__down'") {{ scope.row['thisSerialTotalMoney'] }}
                  vxe-table-column(title='點數')
                    template(slot-scope='scope')
                      .table-icon
                        .icon-arrow(v-if="scope.row['thisSerialPointDiff'] != 0" :class="scope.row['thisSerialPointDiff'] > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
                      span(v-if="scope.row['thisSerialPointDiff'] == 0" class="text__black") {{ scope.row['thisSerialPointDiff'] }}
                      span(v-else :class="scope.row['thisSerialPointDiff'] > 0 ? 'text__up' : 'text__down'") {{ scope.row['thisSerialPointDiff'] }}
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
                auto-resize
                highlight-current-row)
                vxe-table-column(field="Name" title='商品' fixed="left")
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
    template(v-if='documentShow == 4')
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
              auto-resize
              highlight-current-row)
              vxe-table-column(field="Name" title='商品名稱')
              vxe-table-column(title='總多')
                template(slot-scope='scope')
                  span.text__danger {{ scope.row.TotalBuySubmit　}}
              vxe-table-column(title='總空')
                template(slot-scope='scope')
                  span.text__success {{ scope.row.TotalSellSubmit}}
              vxe-table-column(title='未平倉')
                template(slot-scope='scope') {{ scope.row.RemainingBuyStock - scope.row.RemainingSellStock }}
              vxe-table-column(field="TotalSubmit" title='總口數')
              vxe-table-column(field="TotalFee" title='手續費合計')
              vxe-table-column(title='損益')
                template(slot-scope='scope')
                  span.text__success(v-if="scope.row.TotalPoint >= 0") {{ scope.row.TotalPoint}}
                  span.text__danger(v-else) {{ scope.row.TotalPoint}}
              vxe-table-column(title='留倉預扣')
                template(slot-scope='scope')
                  span.text__success(v-if="scope.row.RemainingWithholding >= 0") {{ scope.row.RemainingWithholding}}
                  span.text__danger(v-else) {{ scope.row.RemainingWithholding}}
    //-新倒限利點數
    el-dialog(
      :visible.sync='profitPointDialog'
      :modal='false'
      width="96%"
      title='新倒限利點數'
      v-dialogDrag)
      .header-custom(slot='title') 新倒限利點數
      template
        .dialog__body
          p.text__center
            span [{{ editPoint.name }}]
            span 報價:
              span.text__bold {{ editPoint.nowPrice }}
            span 類型:
              span.text__bold {{ editPoint.buyOrSellName }}
            span 成交:
              span.text__bold {{ editPoint.nowPrice - editPoint.limitPoint }}
                span(v-if="editPoint.limitPoint >= 0" class="text__danger") (+{{editPoint.limitPoint}})
                span(v-else class="text__success") ({{editPoint.limitPoint}})
          p.text__center 新倒限利不得大於:
            span.text__bold.bg-colr-warring [ {{ editPoint.limitPoint }} ]
          p.text__center 新倒限利需大於會員最低停損點數:
            span.text__bold.bg-colr-warring [ {{ editPoint.stopPoint }} ]
          p.text__center 新倒限利
          p.text__center
            el-button(type="mini" @click="editPoint.price -= 10") -10
            el-button(type="mini" @click="editPoint.price -= 5") -5
            el-input-number(v-model="editPoint.price" size="mini" style='margin: 0 4px; width: 100px')
            el-button(type="mini" @click="editPoint.price += 5") +5
            el-button(type="mini" @click="editPoint.price += 10") +10
          p.text__center 計算結果:
            span.text__bold.bg-colr-danger {{ editPoint.nowPrice - editPoint.limitPoint + editPoint.price }}
        .dialog__footer
          el-button(@click="editPoint.price = 0") 清除設定
          el-button(@click="profitPointDialog = false") 取消
          el-button(type='primary' @click="doEditPoint") 送出
    //-新獲利點數
    el-dialog(
      :visible.sync='winPointDialog'
      :modal='false'
      width="96%"
      title='新獲利點數'
      v-dialogDrag)
      .header-custom(slot='title') 新獲利點數
      template
        .dialog__body
          p.text__center
            span [{{ editPoint.name }}]
            span 報價:
              span.text__bold {{ editPoint.nowPrice }}
            span 類型:
              span.text__bold {{ editPoint.buyOrSellName }}
            span 成交:
              span.text__bold {{ editPoint.nowPrice - editPoint.limitPoint }}
                span(v-if="editPoint.limitPoint >= 0" class="text__danger") (+{{editPoint.limitPoint}})
                span(v-else class="text__success") ({{editPoint.limitPoint}})
          p.text__center 新獲利點需大於:
            span.text__bold.bg-colr-warring [ {{ editPoint.limitPoint }} ]
          p.text__center 新獲利點需大於會員最低停損點數:
            span.text__bold.bg-colr-warring [ {{ editPoint.stopPoint }} ]
          p.text__center 新獲利點
          p.text__center
            el-button(type="mini" @click="editPoint.price -= 10") -10
            el-button(type="mini" @click="editPoint.price -= 5") -5
            el-input-number(v-model="editPoint.price" size="mini" style='margin: 0 4px; width: 100px')
            el-button(type="mini" @click="editPoint.price += 5") +5
            el-button(type="mini" @click="editPoint.price += 10") +10
          p.text__center 計算結果:
            span.text__bold.bg-colr-danger {{ editPoint.nowPrice - editPoint.limitPoint + editPoint.price }}
        .dialog__footer
          el-button(@click="editPoint.price = 0") 清除設定
          el-button(@click="winPointDialog = false") 取消
          el-button(type='primary' @click="doEditPoint") 送出
    //-新損失點數
    el-dialog(
      :visible.sync='lossPointDialog'
      :modal='false'
      width="96%"
      title='新損失點數'
      v-dialogDrag)
      .header-custom(slot='title') 新損失點數
      template
        .dialog__body
          p.text__center
            span [{{ editPoint.name }}]
            span 報價:
              span.text__bold {{ editPoint.nowPrice }}
            span 類型:
              span.text__bold {{ editPoint.buyOrSellName }}
            span 成交:
              span.text__bold {{ editPoint.nowPrice - editPoint.limitPoint }}
                span(v-if="editPoint.limitPoint >= 0" class="text__danger") (+{{editPoint.limitPoint}})
                span(v-else class="text__success") ({{editPoint.limitPoint}})
          p.text__center 新損失點需大於:
            span.text__bold.bg-colr-warring [ {{ editPoint.limitPoint }} ]
          p.text__center 新損失點需大於會員最低停損點數:
            span.text__bold.bg-colr-warring [ {{ editPoint.stopPoint }} ]
          p.text__center 新損點
          p.text__center
            el-button(type="mini" @click="editPoint.price -= 10") -10
            el-button(type="mini" @click="editPoint.price -= 5") -5
            el-input-number(v-model="editPoint.price" size="mini" style='margin: 0 4px; width: 100px')
            el-button(type="mini" @click="editPoint.price += 5") +5
            el-button(type="mini" @click="editPoint.price += 10") +10
          p.text__center 計算結果:
            span.text__bold.bg-colr-danger {{ editPoint.nowPrice - editPoint.limitPoint + editPoint.price }}
        .dialog__footer
          el-button(@click="editPoint.price = 0") 清除設定
          el-button(@click="lossPointDialog = false") 取消
          el-button(type='primary' @click="doEditPoint") 送出
    //-改價減量
    el-dialog(
      :visible.sync='editDialog'
      :modal='false'
      width="96%"
      title='改價減量'
      v-dialogDrag)
      .header-custom(slot='title') 改價減量
      template
        .dialog__body
          el-form(ref='form' size='mini' title-width='50px')
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
          el-button(@click="editDialog = false") 取消
          el-button(type='primary' @click="doEdit") 送出
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
  methods: {
    handleDocument(e) {
			this.documentShow = e
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
      //red
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