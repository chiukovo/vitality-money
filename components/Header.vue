<template lang='pug'>
  nav.navbar
    ul.navbar-nav
      li.nav-item
        a.nav-link(href="#") 連線
        .dropdown-menu
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
      //- li.nav-item
        .navbar-txt 商品: 壹指早(十月)
        .navbar-txt 最後交易日: 2019-11-19
        .navbar-txt 禁新: 10531, 12151
        .navbar-txt 強平: 10531, 12151
    ul.navbar-nav
      li.nav-item
        a.nav-link(href="#") 皮膚
        .dropdown-menu
          a.dropdown-item(href="#") 傳統
          a.dropdown-item(href="#") 官方
      li.nav-item
        a.nav-link(href="#") 音效
      li.nav-item
        a.nav-link(href="#") 登出
</template>
<script>

export default {
	mounted() {
	}
}
</script>