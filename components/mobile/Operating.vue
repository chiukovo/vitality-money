<template lang='pug'>
  div
    .area
      .area__header
        el-button(v-model='radioA' label='0') 一般下單
      .area__content
        el-radio(v-model='buyType' label='0') 市價單
        el-radio(v-model='buyType' label='2') 收盤單
        el-radio(v-model='buyType' label='1') 限價單
    .area
      table.el-table
        thead
          tr
            th: .cell.text-center 商品
            th: .cell.text-center 倉位
            th: .cell.text-center 成交
            th: .cell.text-center 漲跌
        tbody
          tr
            td: .cell.text-center.text-down 臺指早
            td: .cell.text-center 0
            td: .cell.text-center.text-down 11573
            td: .cell.text-center.text-down
              .table-icon
                .icon-arrow(class='icon-arrow-down')
                |23
          tr
            td.limit.limit__1(colspan='4'): .cell.text-center 口數：
              el-input-number(v-model='submitNum' :min="0")
          tr(v-if="buyType == 1")
            td.limit.limit__2(colspan='4'): .cell.text-center 限價：
              el-input-number(v-model='nowPrice' :min="0")
              el-button 現
          tr
            td.limit.limit__3(colspan='4'): .cell.text-center 停利：
              el-input-number(v-model='profit' :min="0")
          tr
            td.limit.limit__4(colspan='4'): .cell.text-center 停損：
              el-input-number(v-model='damage' :min="0")
    .area
      .area__header
        .area__title(style='color: yellow') 目前下單商品: {{ $store.state.itemName }}
        el-checkbox-group(v-model="customGroup")
          el-checkbox(label="overall") 全盤收平
          el-checkbox(label='noConfirm') 下單不確認
          el-checkbox(label='prompt') 限價成交提示
      .area__content.text-center
        el-button(type="danger" @click="checkOrder(0)") 下多單
        el-button(type="success" @click="checkOrder(1)") 下空單
    .area
      table.el-table.progress-table
        thead
          tr
            th(colspan='2'): .cell.text-right 委買
            th(colspan='2'): .cell.text-center 價格
            th(colspan='2'): .cell.text-left 委賣
        tbody(v-if="service.itemDetail.items0.length > 0")
            tr(v-for="(val, key) in service.itemDetail.items0" v-if="key <= 4")
              td(style='width:20%'): .cell
                .progress-bar
                  el-progress(
                    :text-inside='true'
                    :stroke-width='14'
                    :percentage='service.itemDetail.items0[key + 6][0]'
                    :show-text='false'
                    status="exception")
              td: .cell.text-center {{ service.itemDetail.items0[key + 6][1] }}
              td: .cell.text-center.text-up {{ service.itemDetail.items0[key + 6][2] }}
              td: .cell.text-center.text-down {{ val[2] }}
              td: .cell.text-center {{ val[3] }}
              td(style='width:20%'): .cell
                .progress-bar
                  el-progress(
                    :text-inside='true'
                    :stroke-width='14'
                    :percentage='val[4]'
                    :show-text='false'
                    status="success")
      .itemDetailTabTotal
        .row
          .col {{ service.itemDetail.fiveTotal.more }}
          .col 總計
          .col {{ service.itemDetail.fiveTotal.nullNum }}
        .row
          .col.text-up 多勢
          .col.progress-bar
            el-progress(
              :text-inside='true'
              :stroke-width='10'
              :show-text='false'
              :percentage='service.itemDetail.fiveTotal.morePercent'
              status='exception')
          .col.text-down 空勢
</template>

<script>

import dataService from '~/plugins/service/dataService.js'
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
  mixins: [dataService],
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