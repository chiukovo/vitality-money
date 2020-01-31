<template lang='pug'>
.header
  nav.navbar
    Dialog(
      :click-type="dialog.clickType",
      :visible.sync="dialog.isOpen"
      :title="dialog.title"
      :size="dialog.size"
      v-if="dialog.isOpen")
    ul.navbar-nav.navbar-nav-left
      li.nav-item
        a.nav-link(href="#") 連線
        .dropdown-menu.animated.fadeInDown
          a.dropdown-item(href="#") 連線登入
          a.dropdown-item(href="#" @click="logout(true)") 中斷連接
      li.nav-item
        a.nav-link(href="#") 檢視
        .dropdown-menu
          a.dropdown-item(href="#" @click="openModal('userDetail', '個人資料')") 個人資料
          a.dropdown-item(href="#" @click="openModal('historyWinLoss', '歷史損益')") 歷史損益
          a.dropdown-item(href="#" @click="openModal('historyPrices', '歷史報價')") 歷史報價
          a.dropdown-item(href="#" @click="openModal('storedRecords', '儲值記錄')") 儲值記錄
          a.dropdown-item(href="#" @click="openModal('actionLog', '動作日誌')") 動作日誌
      li.nav-item
        a.nav-link(href="#") 設定
        .dropdown-menu
          a.dropdown-item(href="#" @click="openModal('changePassword', '變更密碼', '360px')") 變更密碼
          a.dropdown-item(href="#" @click="openModal('customItem', '商品選擇')") 商品選擇
          a.dropdown-item(href="#" @click="openModal('customMainStyle', '版面選擇', '360px')") 版面選擇
          a.dropdown-item(href="#" @click="setCustomSetting('noConfirmDelete')" :class="$store.state.localStorage.customSetting.noConfirmDelete ? 'is-active': ''") 刪單不確認
          a.dropdown-item(href="#" @click="setCustomSetting('orderReport')" :class="$store.state.localStorage.customSetting.orderReport ? 'is-active': ''") 下單回報
          a.dropdown-item(href="#" @click="setCustomSetting('clapping')" :class="$store.state.localStorage.customSetting.clapping ? 'is-active': ''") 拍手動畫
      li.nav-item
        a.nav-link(href="#") 說明
        .dropdown-menu
          a.dropdown-item(href="/rules" target="_blank") 交易規則
          a.dropdown-item(href="#") 相關網站
      li.nav-item.nav-item-text
        .navbar-txt 商品: {{ $store.state.itemName }}
        .navbar-txt 最後交易日: {{ targetItem.end_date }}
        .navbar-txt 禁新:
          span.text__success  {{ targetItem.new_point1 }}
          |,
          span.text__danger  {{ targetItem.new_point2 }}
        .navbar-txt 強平:
          span.text__success  {{ targetItem.cover_point1 }}
          |,
          span.text__danger  {{ targetItem.cover_point2 }}
    ul.navbar-nav.navbar-nav-right
      li.nav-item
        a.nav-link(href="#") 換膚
        .dropdown-menu.dropdown-theme
          a.dropdown-item( :class="theme == 'default' ? 'is-theme' : ''" @click="changeTheme('default')")
            .color.blue
            span 藍色經典
          a.dropdown-item(:class="theme == 'black' ? 'is-theme' : ''" @click="changeTheme('black')")
            .color.black
            span 黑色幽默
      //- 音效關閉時, 添加 class .isShutdown
      li.nav-item(:class="$store.state.localStorage.customSetting.sound ? '': 'isShutdown'")
        a.nav-link(href="#" @click="setCustomSetting('sound')") 提示聲
      li.nav-item
        a.nav-link(href="#" @click="logout(true)") 登出
</template>

<script>

import Dialog from "~/components/Dialog"
import { mapState } from 'vuex'

export default {
  data() {
    return {
      dialog: {
        clickType: '',
        isOpen: false,
        title: '',
        size: '',
      },
      targetItem: {}
    }
  },
  components: {
    Dialog,
  },
  computed: mapState({
    clickItemId: 'clickItemId',
    theme: state => state.localStorage.customSetting.theme,
  }),
  watch: {
    clickItemId (nowItems) {
      let _this = this
      let mainItem = this.$store.state.mainItem
      mainItem.forEach(function(val) {
        if (nowItems == val.product_id) {
          _this.targetItem = val
        }
      })
    }
  },
  methods: {
    openModal (type, title, size) {
      this.dialog.size = ''
      this.dialog.clickType = type
      this.dialog.title = title
      this.dialog.isOpen = true

      if (typeof size != 'undefined') {
        this.dialog.size = size
      }
    },
    setCustomSetting(type) {
      this.$store.commit('setCustomSetting', type)
    },
    changeTheme(type) {
      this.$store.commit('setTheme', type)
    }
  }
}
</script>