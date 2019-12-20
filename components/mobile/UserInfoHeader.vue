<template lang='pug'>
  ul.userInfo-list
    li.text__center
      span.label 狀態:
      span {{ userInfo.State }}
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
      span {{ userInfo.TouchPoint | currency }}
    li
      span.label 帳戶餘額:
      span(:class="userInfo.Money < userInfo.TouchPoint ? 'text__danger' : 'text__success'") {{ userInfo.Money | currency}}
    li
      span.label 今日損益:
      span(:class="userInfo.TodayMoney < 0 ? 'text__success' : 'text__danger'")  {{ userInfo.TodayMoney | currency }}
    li.userInfo__button
      button.button__danger.logout(@click="logout") 登出帳號
</template>

<script>
import { mapState } from 'vuex'

export default {
  computed: mapState([
    'userInfo',
  ]),
  methods: {
    logout() {
      //unset cookie
      let token = this.$cookies.remove('token')

      location.href = "/"
    }
  }
}
</script>