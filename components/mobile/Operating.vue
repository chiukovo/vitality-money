<template lang='pug'>
.page
  .header
    .header__title 商品下單
    .header__right
      .select.header-select
        select(v-model='selectItemId')
          option(v-for="item in mainItem" :value='item.product_id') {{ item.product_name }}
  .main(style="overflow: auto;")
    .area
      .area__header
        button.button(v-model='radioA' label='0') 一般下單
      .area__content.d-flex.justify-content-around
        label.radio.inline
          input.radio__input(type="radio" v-model='buyType' value='0')
          span.radio__label 市價單
        label.radio.inline
          input.radio__input(type="radio" v-model='buyType' value='1')
          span.radio__label 限價單
        label.radio.inline
          input.radio__input(type="radio" v-model='buyType' value='2')
          span.radio__label 收盤單
    .area
      table.table
        thead
          tr
            th: .cell.text__center 商品
            th: .cell.text__center 倉位
            th: .cell.text__center 成交
            th: .cell.text__center 漲跌
        tbody
          tr
            td: .cell.text__center.text__success {{ nowMainItem.product_name }}
            td: .cell.text__center
              template(v-if="typeof $store.state.uncoveredCountDetail[nowMainItem.product_id] != 'undefined'")
                <span class="bg__danger" v-if="$store.state.uncoveredCountDetail[nowMainItem.product_id] > 0">{{ $store.state.uncoveredCountDetail[nowMainItem.product_id] }}</span>
                <span class="bg__success" v-else>{{ Math.abs($store.state.uncoveredCountDetail[nowMainItem.product_id]) }}</span>
            td: .cell.text__center.text__success {{ nowMainItem.newest_price }}
            td: .cell.text__center.text__success
              template
                .change-icon
                  .icon-arrow(:class="nowMainItem.gain > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
                span(:class="nowMainItem.gain > 0 ? 'text__danger' : 'text__success'") {{ nowMainItem.gain }}
          tr
            td.limit.limit__1(colspan='5'): .cell.text__center 口數：
              .number-input
                input(type="text" v-model="submitNum" :min="0")
                .number-button-group
                  button.button__increase(@click="changeSubmitNum('+')")
                  button.button__decrease(@click="changeSubmitNum('-')")
              //- el-input-number(v-model='submitNum' :min="0")
          tr(v-if="buyType == 1")
            td.limit.limit__2(colspan='5'): .cell.text__center 限價：
              //- el-input-number(v-model='nowPrice' :min="0")
              .number-input
                input(type="text" v-model='nowPrice' :min="0")
                .number-button-group
                  button.button__increase(@click="nowPrice++")
                  button.button__decrease(@click="nowPrice--")
              button.button(@click="getNowPrice") 現
          tr
            td.limit.limit__3(colspan='5'): .cell.text__center 停利：
              .number-input
                input(type="text" v-model='profit' :min="0")
                .number-button-group
                  button.button__increase(@click="profit++")
                  button.button__decrease(@click="profit--")
              //- el-input-number(v-model='profit' :min="0")
          tr
            td.limit.limit__4(colspan='5'): .cell.text__center 停損：
              .number-input
                input(type="text" v-model='damage' :min="0")
                .number-button-group
                  button.button__increase(@click="damage++")
                  button.button__decrease(@click="damage--")
              //- el-input-number(v-model='damage' :min="0")
    .area
      .area__header
        .area__title(style='color: yellow') 目前下單商品: {{ $store.state.itemName }}
        div
          label.checkbox.inline(style="margin-left: 5px;")
            input.checkbox__input(type="checkbox" :checked="noRemaining == 1" @click="setNoRemaining")
            span.checkbox__label 該筆不留倉
          label.checkbox.inline(style="margin-left: 5px;")
            input.checkbox__input(type="checkbox" :checked="dayCover == 1" @click="clickOverAll()")
            span.checkbox__label 全盤收平
      .area__content.text__center
        button.button__danger.button__lg(@click="checkOrder(0)") 下多單
        button.button__success.button__lg(@click="checkOrder(1)") 下空單
    .area
      table.table.progress-table
        thead
          tr
            th(colspan='2'): .cell.text__right 委買
            th(colspan='2'): .cell.text__center 價格
            th(colspan='2'): .cell.text__left 委賣
        tbody
          tr(v-for="(val, key) in $store.state.items0" v-if="key <= 4")
            td(style='width:20%'): .cell
              .progress-bar.progress-bar__right
                .progress-bar__inner(:style="'width: ' + $store.state.items0[key + 6][0] + '%'")
            td: .cell.text__center {{ $store.state.items0[key + 6][1] }}
            td: .cell.text__center.text__danger {{ $store.state.items0[key + 6][2] }}
            td: .cell.text__center.text__success {{ val[2] }}
            td: .cell.text__center {{ val[3] }}
            td(style='width:20%'): .cell
              .progress-bar
                .progress-bar__inner(:style="'width: ' + val[4] + '%'")
      .itemDetail__Total.text__center
        .row
          .col {{ $store.state.fiveTotal.more }}
          .col 總計
          .col {{ $store.state.fiveTotal.nullNum }}
        .row
          .col.text__danger 多勢
          .col
            .progress-bar.progress-bar__total
              .progress-bar__inner(:style="'width: ' + $store.state.fiveTotal.morePercent + '%'")
          .col.text__success 空勢
</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'
import qs from 'qs'

export default {
  data () {
    return {
      selectItemId: '',
      sendText: '',
      nowPrice: 0,
      dialogVisible: false,
      orderConfirm: false,
      customGroup: [],
      confirmData: [],
      radioA: '0',
      noRemaining: 0,
      buyType: '0',
      dayCover: 0,
      profit: 0,
      damage: 0,
      submitNum: 1,
      submitStep: 1,
      checkList: ['下單不確認'],
      defaultAllSubmit: [1, 2, 3, 4, 5],
      customSubmitNums: []
    };
  },
  computed: mapState([
    'clickItemId',
    'nowMainItem',
    'mainItem',
    'commidyArray',
  ]),
  watch: {
    selectItemId(id) {
      let name = ''
      //找出名稱
      this.$store.state.mainItem.forEach(function(val) {
        if (val.product_id == id) {
          name = val.product_name
        }
      })

      this.preSetClickItemId(id, name)
    },
    commidyArray() {
      this.getNowOverall()
    },
    clickItemId(itemId) {
      this.getNowPrice()
      this.getNowOverall()
    },
    customGroup(data) {
      this.$cookies.set('customGroup', this.customGroup)
      this.$store.dispatch('CALL_MEMBER_ORDER_LIST')
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

      if (newNum < 0) {
        this.submitNum = 0
      }
    }
  },
  mounted() {
    const customSubmitNums = this.$cookies.get('customSubmitNums')
    const customGroup = this.$cookies.get('customGroup')
    let _this = this

    if (typeof customSubmitNums == 'undefined') {
      this.customSubmitNums = this.defaultAllSubmit
    } else {
      this.customSubmitNums = customSubmitNums
    }

    if (typeof customGroup != 'undefined') {
      this.customGroup = customGroup
    }

    //目前選擇商品
    this.selectItemId = this.$store.state.clickItemId
    this.getNowPrice()
    this.getNowOverall()
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
    changeSubmitNum(type) {
      if (type == '+') {
        this.submitNum = parseFloat((this.submitNum + this.submitStep).toFixed(10))
      } else {
        this.submitNum = parseFloat((this.submitNum - this.submitStep).toFixed(10))
      }
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
    getNowPrice() {
      const itemId = this.$store.state.clickItemId
      const nowNewPrice = this.$store.state.nowNewPrice

      this.nowPrice = nowNewPrice[itemId]
    },
    setNum() {
      //set cookie
      this.$cookies.set('customSubmitNums', this.customSubmitNums)
      this.dialogVisible = false
    },
    resetNum() {
      this.customSubmitNums = this.defaultAllSubmit
      this.$cookies.set('customSubmitNums', this.defaultAllSubmit)
    },
    checkOrderAll() {
      //看是否有勾選下單不確認
      let noConfirm = false
      const clickItem = this.$store.state.clickItemId
      const isMobile = this.$store.state.isMobile
      const userId = this.$store.state.localStorage.userAuth.userId
      const token = this.$store.state.localStorage.userAuth.token

      let sendText = 't:' + userId + ',0,' + token + ',' + isMobile + ',' + clickItem

      this.customGroup.forEach(function(val){
        if (val == 'noConfirm') {
          noConfirm = true
        }
      })

      if (noConfirm) {
        //全平
        this.$socketOrder.send(sendText)
      } else {
        //確認
        this.$confirm('確認要全平 (' + this.$store.state.itemName + ') ?', '注意! ', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$socketOrder.send(sendText)
        }).catch(() => {
        })
      }
    },
    checkOrder(type) {
      const clickItem = this.$store.state.clickItemId
      const isMobile = this.$store.state.isMobile
      const userId = this.$store.state.localStorage.userAuth.userId
      const token = this.$store.state.localStorage.userAuth.token
      const nowPrice = this.buyType == 1 ? this.nowPrice : 0

      this.sendText = 's:' + userId + ',' + type + ',' + this.submitNum + ',' + clickItem + ',' + this.profit + ',' + this.damage + ',' + nowPrice + ',' + this.buyType + ',' + token + ',' + isMobile

      let buyTypeName
      let typeName = type == 1 ? '空' : '多'

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
        buy: typeName,
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
        //確認
        this.$confirm('確認下' + typeName + ' (' + this.$store.state.itemName + ') ?', '注意! ', {
          confirmButtonText: '確定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.doOrder()
        }).catch(() => {
        })
      }
    },
    cancel() {
      this.orderConfirm = false
    },
    doOrder() {
      const _this = this
      setTimeout(function(){ _this.$socketOrder.send(_this.sendText) }, 500)
    },
  }
}
</script>