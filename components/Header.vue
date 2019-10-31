<template lang='pug'>
  nav.navbar
    ul.navbar-nav
      li.nav-item
        a.nav-link(href="#") 連線
        .dropdown-menu.animated.fadeInDown
          a.dropdown-item(href="#") 連線登入
          a.dropdown-item(href="#") 中斷連接
      li.nav-item
        a.nav-link(href="#") 檢視
        .dropdown-menu
          a.dropdown-item(href="#") 個人資料
          a.dropdown-item(href="#") 歷史損益
          a.dropdown-item(href="#") 歷史報價
          a.dropdown-item(href="#") 儲值記錄
          a.dropdown-item(href="#") 動作日誌
      li.nav-item
        a.nav-link(href="#") 設定
        .dropdown-menu
          a.dropdown-item(href="#") 變更密碼
          a.dropdown-item(href="#") 商品選擇
          a.dropdown-item(href="#") 版面選擇
          a.dropdown-item(href="#") 視覺下單
          a.dropdown-item(href="#") 刪單不確認
          a.dropdown-item(href="#") 下單回報
          a.dropdown-item(href="#") 拍手動畫
      li.nav-item
        a.nav-link(href="#") 說明
        .dropdown-menu
          a.dropdown-item(href="#") 交易規則
          a.dropdown-item(href="#") 相關網站
      li.nav-item.nav-item-text
        .navbar-txt 商品: {{ $store.state.itemName }}
        .navbar-txt 最後交易日: {{ endDate }}
        .navbar-txt 禁新: 
          span.text-success 10531
          |, 
          span.text-danger 12151
        .navbar-txt 強平: 
          span.text-success 10531
          |, 
          span.text-danger 12151
    ul.navbar-nav
      li.nav-item
        a.nav-link.material-icons(href="#") color_lens
        .dropdown-menu
          a.dropdown-item(href="#") 傳統
          a.dropdown-item(href="#") 官方
      li.nav-item
        a.nav-link.material-icons(href="#") notifications
      li.nav-item
        a.nav-link.material-icons(href="#") exit_to_app
</template>

<script>

import { mapState } from 'vuex'

export default {
  data() {
    return {
      endDate: ''
    }
  },
  computed: mapState([
    'mainItem',
  ]),
  watch: {
    mainItem (res) {
      let _this = this
      let nowItems = this.$store.state.clickItemId
      let mainItem = this.$store.state.mainItem

      res.forEach(function(val) {
        if (nowItems == val.product_id) {
          _this.endDate = val.end_date
        }
      })
    }
  }
}
</script>