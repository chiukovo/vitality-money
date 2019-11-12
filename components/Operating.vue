<template lang='pug'>
#operating.operating
  .operating-header
    .header__title {{ $store.state.itemName }}
    .header__mode
      el-radio(v-model='radioA' label='0') 一般
  .operating-content
    .operating-1
      table
        tbody
          tr
            td
            td: el-radio(v-model='buyType' label='0') 市價單
          tr
            td: el-radio(v-model='buyType' label='2') 收盤單
            td: el-radio(v-model='buyType' label='1') 限價單
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
        el-form(ref='form' size='mini' label-width='50px')
          el-button-group
            el-button(type='primary' size='mini' v-for="(customSubmitNum, key) in customSubmitNums" :key="key" @click="submitNum = customSubmitNum") {{ customSubmitNum }}
      .numberinput
        el-form(ref='form' size='mini' label-width='50px')
          el-form-item(label='口數:' style='margin: 2px 0 2px 0;')
            el-input-number(v-model='submitNum' controls-position='right' :min="0")
      .editbtn
        el-button-group
          el-button(type='primary' size='mini' @click="dialogVisible = true") 編輯
          el-button(type='primary' size='mini' @click="resetNum") 還原
        el-dialog(
          :visible.sync='dialogVisible'
          :modal='false'
          width="400px"
          title='調整數量'
          v-dialogDrag)
            .header-custom(slot='title') 調整數量
            template
              .dialog__body
                  .numberBtn-box(v-for="(customSubmitNum, key) in customSubmitNums" :key="key")
                    el-input-number(size="mini" controls-position='right' v-model="customSubmitNums[key]" :min="0")
              .dialog__footer
                el-button(@click="dialogVisible = false") 取消
                el-button(type='primary' @click="setNum") 送出
    .operating-4
        el-button(type="danger" @click="checkOrder(0)") 下多單
        el-button(size='mini' @click="checkOrderAll()") 全平
        el-button(type="success" @click="checkOrder(1)") 下空單
        el-dialog(
          :visible.sync='orderConfirm'
          :modal='false'
          width="400px"
          title='確認下單'
          v-dialogDrag)
          .header-custom(slot='title')
            i.el-icon-info
            |  確認下單
          el-table.table(
            :data="confirmData"
            min-width='100%'
            height="200px"
            border
          )
            el-table-column(prop="name" label='目標商品')
            el-table-column(prop="userName" label='用戶名稱')
            el-table-column(prop="buy" label='買賣')
            el-table-column(prop="price" label='價格')
            el-table-column(prop="submit" label='口數')
          .dialog__footer
              el-button(@click="cancel") 取消
              el-button(type='primary' @click="doOrder") 確認

    .operating-5
      el-checkbox-group(v-model="customGroup")
        el-checkbox(label="overall") ({{ $store.state.itemName }})全盤收平
        el-checkbox(label='noConfirm') 下單不確認
        el-checkbox(label='prompt') 限價成交提示
</template>

<script>

import { mapState } from 'vuex'

export default {
  data () {
    return {
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

    if (typeof customSubmitNums == 'undefined') {
      this.customSubmitNums = this.defaultAllSubmit
    } else {
      this.customSubmitNums = customSubmitNums
    }

    if (typeof customGroup != 'undefined') {
      this.customGroup = customGroup
    }
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