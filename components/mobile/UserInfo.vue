<template lang='pug'>
//- 顏色未調整
.modals.documents
  client-only
    include mixins.pug
  .header
    .header__left
      el-link(icon='el-icon-arrow-left' :underline='false') 返回
    .header__title 帳戶訊息
  .main
    .area
      .area-infor__header 帳號: {{userInfo.Account}}
      ul.area-infor-list
        +area-infor-list-item('客戶名稱', 'account_circle', '{{userInfo.Name}}')
        +area-infor-list-item('服務人員', 'headset_mic')
        +area-infor-list-item('服務專線', 'perm_phone_msg')
        +area-infor-list-item('預設額度', 'money', '{{userInfo.TouchPoint}}')
        //- 數值判斷 .text-up / text-down
        +area-infor-list-item('帳戶餘額', 'money', '{{userInfo.Money}}').text-down
        +area-infor-list-item('今日損益', 'bar_chart', '{{userInfo.TodayMoney}}').text-down
</template>

<script>
import { mapState } from 'vuex'

export default {
  data () {
    return {
    };
  },
  computed: mapState([
    'userInfo',
  ])
}
</script>