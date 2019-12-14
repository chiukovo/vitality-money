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
          button.button(v-for="(customSubmitNum, key) in customSubmitNums" :key="key" @click="submitNum = customSubmitNum") {{ customSubmitNum }}
      .numberinput
        el-form(ref='form' size='mini' label-width='50px')
          el-form-item(label='口數:' style='margin: 2px 0;')
            el-input-number(v-model='submitNum' controls-position='right' :min="0")
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
        input.checkbox__input(v-model="customGroup" type="checkbox" value="overall")
        span.checkbox__label ({{ $store.state.itemName }})全盤收平
      label.checkbox
        input.checkbox__input(v-model="customGroup" type="checkbox" value="noConfirm")
        span.checkbox__label 下單不確認
      label.checkbox
        input.checkbox__input(v-model="customGroup" type="checkbox" value="prompt")
        span.checkbox__label 限價成交提示
</template>

<script>
import { mapState } from 'vuex';
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