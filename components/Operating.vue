<template lang='pug'>
#operating.operating
  .operating-header
    .header__title {{ $store.state.itemName }}
    .header__mode
      label.radio
        input.radio__input(type="radio" checked)
        span.radio__label 一般
  .operating-content
    .operating-1
      table
        tbody
          tr
            td
            td
              label.radio
                input.radio__input(type="radio" v-model='buyType' value='0')
                span.radio__label 市價單
          tr
            td
              label.radio
                input.radio__input(type="radio" v-model='buyType' value='2')
                span.radio__label 收盤單
            td
              label.radio
                input.radio__input(type="radio" v-model='buyType' value='1')
                span.radio__label 限價單
    .operating-2
      el-form(ref='form' size='mini' label-width='50px')
        el-form-item(label='限價:' v-if="buyType == 1")
          el-input-number(v-model='nowPrice' controls-position='right' :min="0")
        el-form-item(label='停利:')
          el-input-number(v-model='profit' controls-position='right' :min="0")
        el-form-item(label='停損:')
          el-input-number(v-model='damage' controls-position='right' :min="0")
    .operating-3
      .numberbtn
        el-form(ref='form' size='mini' label-width='30px')
          button.button(type="button" v-for="(customSubmitNum, key) in customSubmitNums" :key="key" @click="submitNum = customSubmitNum") {{ customSubmitNum }}
      .numberinput
        el-form(ref='form' size='mini' label-width='50px')
          el-form-item(label='口數:' style='margin: 2px 0;')
            el-input-number(v-model='submitNum' controls-position='right' :min="0" :step="submitStep")
      .editbtn
        button.button(@click="dialogVisible = true") 編輯
        button.button(@click="resetNum") 還原
        el-dialog(
          :visible.sync='dialogVisible'
          :modal='false'
          width="400px"
          title='調整數量'
          v-dialogDrag)
            .header-custom(slot='title') 調整數量
            template
              .dialog__body
                .numberBtn-wrap
                  .numberBtn-box(v-for="(customSubmitNum, key) in customSubmitNums" :key="key")
                    el-input-number(size="mini" controls-position='right' v-model="customSubmitNums[key]" :min="0")
              .dialog__footer
                button.button__light(@click="dialogVisible = false") 取消
                button.button(@click="setNum") 送出
    .operating-4
        button.button__danger.button__lg.text__bold(@click="checkOrder(0)") 下多單
        button(@click="checkOrderAll()") 全平
        button.button__success.button__lg.text__bold(@click="checkOrder(1)") 下空單
        el-dialog(
          :visible.sync='orderConfirm'
          :modal='false'
          width="400px"
          title='確認下單'
          v-dialogDrag)
          .header-custom(slot='title')
            i.el-icon-info
            |  確認下單
          client-only
            vxe-table(
              :data="confirmData"
              max-width="100%"
              height="200px"
              size="mini"
              border
              auto-resize)
              vxe-table-column(field="name" title='目標商品')
              vxe-table-column(field="userName" title='用戶名稱')
              vxe-table-column(field="buy" title='買賣')
              vxe-table-column(field="price" title='價格')
              vxe-table-column(field="submit" title='口數')
            .dialog__footer
              button.button__light(@click="cancel") 取消
              button.button(@click="doOrder") 確認
    .operating-5
      label.checkbox
        input.checkbox__input(type="checkbox" :checked="noRemaining == 1" @click="setNoRemaining")
        span.checkbox__label 該筆不留倉
      label.checkbox
        input.checkbox__input(type="checkbox" :disabled="dayCoverIsDisabled(clickItemId)" :checked="dayCover == 1" @click="clickOverAll()")
        span.checkbox__label ({{ $store.state.itemName }})收盤全平
      label.checkbox
        input.checkbox__input(v-model="customGroup" type="checkbox" value="noConfirm")
        span.checkbox__label 下單不確認
      label.checkbox
        input.checkbox__input(v-model="customGroup" type="checkbox" value="prompt")
        span.checkbox__label 限價成交提示
    //-全平提示
    el-dialog(
      :visible.sync='overAllConfirm'
      :modal='false'
      :show-close='false'
      width="600px"
      title='全部平倉'
      v-dialogDrag)
      .header-custom(slot='title')
        i.el-icon-info
        |  全部平倉
      client-only
        vxe-table(
          :data="overAllList"
          height="100px"
          size="mini"
          column-min-width="60"
          border)
          vxe-table-column(field="Serial" title='序號')
          vxe-table-column(field="Name" title='商品')
          vxe-table-column(field="FinalPrice" title='成交價')
          vxe-table-column(title='多空')
            template(slot-scope='scope') {{ scope.row['BuyOrSell'] == 0 ? '多' : '空' }}
          vxe-table-column(field="Quantity" title='口數')
        .dialog__footer
          button.button__light(@click="overAllConfirm = false") 取消
          button.button(type='primary' @click="doSendOverAll") 確認
</template>

<script>
import { mapState } from 'vuex'
import axios from 'axios'
import qs from 'qs'

export default {
  data () {
    return {
      sendText: '',
      nowPrice: 0,
      dialogVisible: false,
      orderConfirm: false,
      overAllConfirm: false,
      overAllList: [],
      customGroup: [],
      confirmData: [],
      radioA: '0',
      buyType: '0',
      noRemaining: 0,
      dayCover: 0,
      profit: 0,
      damage: 0,
      submitNum: 1,
      submitStep: 1,
      checkList: ['下單不確認'],
      customSubmitNums: [1, 2, 3, 4, 5],
    };
  },
  computed: mapState([
    'clickItemId',
    'commidyArray',
    'commidyArray',
  ]),
  watch: {
    commidyArray() {
      this.getNowOverall()
    },
    clickItemId(itemId) {
      this.getNowPrice(itemId)
      this.getNowOverall()
    },
    customGroup(data) {
      this.$cookies.set('customGroup', this.customGroup)
    },
    submitNum(newNum, oldNum) {
      if (newNum == 0 && oldNum == 1) {
        this.submitNum = 0.9
        this.submitStep = 0.1
      }

      if (newNum == 1.1 && oldNum == 1) {
        this.submitNum = 2
        this.submitStep = 1
      }
    }
  },
  mounted() {
    const customSubmitNums = this.$cookies.get('customSubmitNums')
    const customGroup = this.$cookies.get('customGroup')

    if (typeof customSubmitNums != 'undefined') {
      this.customSubmitNums = customSubmitNums
    }

    if (typeof customGroup != 'undefined') {
      this.customGroup = customGroup
    }
  },
  methods: {
    setNoRemaining() {
      //設定不留倉
      const _this = this
      const lang = this.$store.state.localStorage.lang
      const userId = this.$store.state.localStorage.userAuth.userId
      const token = this.$store.state.localStorage.userAuth.token
      const setNoRemaining = this.noRemaining == 0 ? 1 : 0

      axios.post(process.env.NUXT_ENV_API_URL + "/set_close_cover_all?lang=" + lang, qs.stringify({
        UserID: userId,
        Token: token,
        SetNoRemaining: setNoRemaining,
        SetCloseCommodity: _this.clickItemId,
      }))
      .then(response => {
        if (response.data.Code != 1) {
          _this.$alert(response.data.ErrorMsg)
        }

        this.$store.dispatch('CALL_MEMBER_ORDER_LIST')
      })
    },
    clickOverAll() {
      //修改收盤全平
      const _this = this
      _this.dayCover = _this.dayCover == 0 ? 1 : 0
      const lang = this.$store.state.localStorage.lang
      const userId = this.$store.state.localStorage.userAuth.userId
      const token = this.$store.state.localStorage.userAuth.token

      //確認視窗
      const confirmText = _this.dayCover ? '確認勾選收盤全平?' : '確認取消勾選收盤全平?'

      this.$confirm(confirmText, '注意! ', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        axios.post(process.env.NUXT_ENV_API_URL + "/set_close_cover_all?lang=" + lang, qs.stringify({
          UserID: userId,
          Token: token,
          SetCloseCover: _this.dayCover,
          SetCloseCommodity: _this.clickItemId,
        }))
        .then(response => {
          if (response.data.Code != 1) {
            _this.$alert(response.data.ErrorMsg)
            _this.dayCover = !_this.dayCover
          }

          this.$store.dispatch('CALL_MEMBER_ORDER_LIST')
          this.$store.dispatch('CALL_MEMBER_INFO')
        }).catch(() => {
        })
      }).catch(() => {
        _this.dayCover = !_this.dayCover
      })
    },
    getNowOverall() {
      //使用者設定
      const _this = this
      const commidyArray = this.commidyArray
      const clickItemId = this.clickItemId

      commidyArray.forEach(function(val) {
        if (val.ID == clickItemId) {
          _this.dayCover = val.DayCover
          _this.noRemaining = val.NoRemaining
        }
      })
    },
    getNowPrice(itemId) {
      const nowNewPrice = this.$store.state.nowNewPrice

      this.nowPrice = nowNewPrice[itemId]
    },
    setNum() {
      //set cookie
      this.$cookies.set('customSubmitNums', this.customSubmitNums)
      this.dialogVisible = false
    },
    resetNum() {
      this.customSubmitNums = [1, 2, 3, 4, 5]
      this.$cookies.set('customSubmitNums', [1, 2, 3, 4, 5])
      this.submitNum = 1
      this.submitStep = 1
    },
    checkOrderAll() {
      const _this = this
      //看是否有勾選下單不確認
      let noConfirm = false
      this.overAllList = []

      this.customGroup.forEach(function(val){
        if (val == 'noConfirm') {
          noConfirm = true
        }
      })

      if (noConfirm) {
        //全平
        this.doSendOverAll()
      } else {
        //確認
        const uncovered = this.$store.state.uncovered

        uncovered.forEach(function(val) {
          if (val.Operation[2] && val.ID == _this.$store.state.clickItemId) {
            _this.overAllList.push(val)
          }
        })

        this.overAllConfirm = true
      }
    },
    doSendOverAll() {
      const clickItem = this.$store.state.clickItemId
      const isMobile = this.$store.state.isMobile
      const userId = this.$store.state.localStorage.userAuth.userId
      const token = this.$store.state.localStorage.userAuth.token
      const sendText = 't:' + userId + ',0,' + token + ',' + isMobile + ',' + clickItem

      this.$socketOrder.send(sendText)

      this.overAllConfirm = false
    },
    checkOrder(type) {
      const clickItem = this.$store.state.clickItemId
      const isMobile = this.$store.state.isMobile
      const userId = this.$store.state.localStorage.userAuth.userId
      const token = this.$store.state.localStorage.userAuth.token
      const nowPrice = this.buyType == 1 ? this.nowPrice : 0

      this.sendText = 's:' + userId + ',' + type + ',' + this.submitNum + ',' + clickItem + ',' + this.profit + ',' + this.damage + ',' + nowPrice + ',' + this.buyType + ',' + token + ',' + isMobile

      let buyTypeName

      if (this.buyType == 0) {
        buyTypeName = '市價單'
      } else if (this.buyType == 1) {
        buyTypeName = '限價單'
      } else if (this.buyType == 2) {
        buyTypeName = '收盤單'
      }

      this.confirmData = [{
        name: this.$store.state.itemName,
        userName: this.$store.state.userInfo.Account,
        buy: type == 1 ? '空' : '多',
        price: buyTypeName,
        submit: this.submitNum,
      }]

      //看是否有勾選下單不確認
      let noConfirm = false

      this.customGroup.forEach(function(val){
        if (val == 'noConfirm') {
          noConfirm = true
        }
      })

      if (noConfirm) {
        this.doOrder()
      } else {
        this.orderConfirm = true
      }
    },
    cancel() {
      this.orderConfirm = false
    },
    doOrder() {
      this.orderConfirm = false

      this.$socketOrder.send(this.sendText)
    },
  }
}
</script>