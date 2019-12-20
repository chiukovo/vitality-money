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
          input.radio__input(type="radio" v-model='buyType' value='2')
          span.radio__label 收盤單
        label.radio.inline
          input.radio__input(type="radio" v-model='buyType' value='1')
          span.radio__label 限價單
    .area
      table.table
        thead
          tr
            th: .cell.text__center 商品
            th: .cell.text__center 倉位
            th: .cell.text__center 成交
            th: .cell.text__center 漲跌
            th: .cell.text__center 狀態
        tbody
          tr
            td: .cell.text__center.text__success {{ nowMainItem.product_name }}
            td: .cell.text__center
              template(v-if="typeof $store.state.uncoveredCountDetail[nowMainItem.product_id] != 'undefined'")
                <span class="bg__danger" v-if="$store.state.uncoveredCountDetail[nowMainItem.product_id] > 0">{{ $store.state.uncoveredCountDetail[nowMainItem.product_id] }}</span>
                <span class="bg__success" v-else>{{ $store.state.uncoveredCountDetail[nowMainItem.product_id] }}</span>
            td: .cell.text__center.text__success {{ nowMainItem.newest_price }}
            td: .cell.text__center.text__success
              template
                .change-icon
                  .icon-arrow(:class="nowMainItem.gain > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
                span(:class="nowMainItem.gain > 0 ? 'text__danger' : 'text__success'") {{ nowMainItem.gain }}
            td: .cell.text__center {{ nowMainItem.state_name }}
          tr
            td.limit.limit__1(colspan='5'): .cell.text__center 口數：
              .number-input
                input(type="text" value="1")
                .number-button-group
                  button.button__increase
                  button.button__decrease
              //- el-input-number(v-model='submitNum' :min="0")
          tr(v-if="buyType == 1")
            td.limit.limit__2(colspan='5'): .cell.text__center 限價：
              //- el-input-number(v-model='nowPrice' :min="0")
              .number-input
                input(type="text" value="1")
                .number-button-group
                  button.button__increase
                  button.button__decrease
              button.button(@click="getNowPrice") 現
          tr
            td.limit.limit__3(colspan='5'): .cell.text__center 停利：
              .number-input
                input(type="text" value="1")
                .number-button-group
                  button.button__increase
                  button.button__decrease
              //- el-input-number(v-model='profit' :min="0")
          tr
            td.limit.limit__4(colspan='5'): .cell.text__center 停損：
              .number-input
                input(type="text" value="1")
                .number-button-group
                  button.button__increase
                  button.button__decrease
              //- el-input-number(v-model='damage' :min="0")
    .area
      .area__header
        .area__title(style='color: yellow') 目前下單商品: {{ $store.state.itemName }}
        label.checkbox.inline(style="margin-left: 5px;")
          input.checkbox__input(type="checkbox" v-model='customGroup' value='overall')
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
      buyType: '0',
      profit: 0,
      damage: 0,
      submitNum: 1,
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

      this.$store.commit('setClickItemId', {
        id: id,
        name: name
      })
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

      //修改收盤全平
      let overall = 0

      this.customGroup.forEach(function(val){
        if (val == 'overall') {
          overall = 1
        }
      })

      this.$store.dispatch('CALL_SET_CLOSE_OVER_ALL', { overall })
      this.$store.dispatch('CALL_MEMBER_ORDER_LIST')
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
  },
  methods: {
    getNowOverall() {
      //使用者設定
      const commidyArray = this.$store.state.commidyArray
      const clickItem = this.$store.state.clickItemId
      let newCustomGroup = []
      let dayCover = ''

      commidyArray.forEach(function(val) {
        if (val.ID == clickItem) {
          dayCover = val.DayCover
        }
      })

      let has = false

      this.customGroup.forEach(function(val) {
        if (val == 'overall') {
          has = true

          if (dayCover == '1') {
            newCustomGroup.push(val)
          }
        } else {
          newCustomGroup.push(val)
        }
      })

      if (!has && dayCover == '1') {
        newCustomGroup.push('overall')
      }

      this.customGroup = newCustomGroup
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