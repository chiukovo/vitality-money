<template lang='pug'>
  ul.userInfo-list
    li.text__center
      span.label 狀態:
      |正常收單
    li.text__center
      span.label 帳戶:
      span {{ userInfo.Account }}
    li
      span.label 客戶名稱:
      span {{ userInfo.Name }}
    li
      span.label 服務人員:
    li
      span.label 服務專線:
    li
      span.label 預設額度:
      span {{ userInfo.TouchPoint }}
    li
      span.label 帳戶餘額:
      span.text__info {{ userInfo.Money }}
    li
      span.label 今日損益:
      span(:class="userInfo.TodayMoney > 0 ? 'text__succuss' : 'text__danger'")  {{ userInfo.TodayMoney }}
    li.userInfo__button
      button.button__danger.logout 登出帳號
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState([
    'userInfo',
  ])
}
</script>