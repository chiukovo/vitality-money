<template lang="pug">
.page
  .header
    .header__title 在線客服
    .header__right
      button.button.header-button 清除訊息
  .main
    .chat
      //- .no-service 尚未啟用線上客服，請洽管理員開通。
      .chat-area
        ul
          li.from-service 客服:
          li.from-service.chat-content 歡迎您使用線上客服，請問有什麼可以幫助您的？
          li.from-customer 我
            span (2019-12-18 11:20:17)
            |:
          li.from-customer.chat-content 測試
      .chat-input-wrap
        input.chat-input(placeholder="請在此輸入文字")
        button.button 送出
</template>

<script>

import UserInfoHeader from "~/components/mobile/UserInfoHeader"
import CustomItem from "~/components/mobile/CustomItem"
import Analysis from "~/components/mobile/Analysis"
import Dialog from "~/components/Dialog"

import { mapState } from 'vuex'

export default {
	data () {
	  return {
      selectItemId: '',
      userInfoHeaderShow: false,
      costomShow: false,
      analysisShow: false,
      more: false,
      dialog: {
        clickType: '',
        isOpen: false,
      },
	  }
	},
  components: {
    UserInfoHeader,
    CustomItem,
    Analysis,
    Dialog
  },
  computed: mapState([
    'mainItem',
    'clickItemId'
  ]),
  watch: {
    clickItemId(id) {
      //目前選擇商品
      this.selectItemId = id
      this.$store.dispatch('CALL_QUERY_TECH', {
        'id': id,
        'type': 'chart',
        'num': 1
      })

      this.$store.dispatch('CALL_QUERY_TECH', {
        'id': id,
        'type': 'kline',
        'num': 2
      })
    },
    mainItem() {
      const _this = this

      setTimeout(function(){
        const success = document.querySelectorAll("#mainItemTable .vxe-cell .border__success")
        const danger = document.querySelectorAll("#mainItemTable .vxe-cell .border__danger")

        success.forEach(function(el) {
          el.classList.remove("border")
          el.classList.remove("border__success")
        })

        danger.forEach(function(el) {
          el.classList.remove("border")
          el.classList.remove("border__danger")
        })
      }, 400)
    },
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
  },
  mounted() {

  },
  methods: {
    clickItem({ row }) {
      this.$store.commit('setClickItemId', {
        id: row.product_id,
        name: row.product_name
      })
    },
    clickChart({ row, column, columnIndex }) {
      if (columnIndex == 0) {
        this.$store.dispatch('CALL_QUERY_TECH', {
          'id': row.product_id,
          'type': 'chart',
          'num': 1
        })

        this.analysisShow = true
      }
    },
    tableCellClassName({ row, column, columnIndex }) {
      //判斷整行顏色
      if(columnIndex >= 2 && columnIndex != 5 && columnIndex != 7 && columnIndex != 13) {
        return row.color
      }

      //判斷狀態
      if(columnIndex == 13) {
        if (row.state != 2) {
          return 'text__secondary'
        }
      }
    },
  }
}
</script>