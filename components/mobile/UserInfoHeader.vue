<template lang='pug'>
ul.userInfo-list
  li.text-center 狀態: 正常收單
  li.text-center 帳戶: {{ userInfo.Account }}
  li 客戶名稱: {{ userInfo.Name }}
  li 服務人員:
  li 服務專線:
  li 預設額度: {{ userInfo.TouchPoint }}
  li 帳戶餘額:
    span.text-up  {{ userInfo.Money }}
  li 今日損益:
    span.text-up  {{ userInfo.TodayMoney }}
  li.userInfo__button
    el-button(type='danger').logout 登出帳號
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState([
    'userInfo',
  ])
}
</script>