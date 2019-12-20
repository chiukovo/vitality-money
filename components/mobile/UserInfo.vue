<template lang='pug'>
//- 顏色未調整
.modals.UserInfo
  client-only
    include mixins.pug
  .header
    .header__left
      el-link(@click='$parent.systemShow = 0' icon='el-icon-arrow-left' :underline='false') 返回
    .header__title 帳戶訊息
  .main
    .area(style="height: calc(100% - 58px); overflow-y: scroll;")
      .area-infor__header(:style="checkAcctColor()") 帳號: {{ userInfo.Account }}
      ul.area-infor-list
        +area-infor-list-item('客戶名稱', 'account_circle', '{{ userInfo.Name }}')
        +area-infor-list-item('服務人員', 'headset_mic')
        +area-infor-list-item('服務專線', 'perm_phone_msg')
        +area-infor-list-item('預設額度', 'money', '{{ userInfo.TouchPoint | currency }}')
        li
          i.material-icons money
          .area-infor__title 帳戶餘額
          .area-infor__content(:class="userInfo.Money < userInfo.TouchPoint ? 'text__danger' : 'text__success'") {{ userInfo.Money | currency }}
        li
          i.material-icons bar_chart
          .area-infor__title 今日損益
          .area-infor__content(:class="userInfo.TodayMoney < 0 ? 'text__success' : 'text__danger'") {{ userInfo.TodayMoney | currency }}
        li
          i.material-icons attach_money
          .area-infor__title 信用額度
          .area-infor__content {{ userInfo.TouchPoint | currency }}
        li
          i.material-icons attach_money
          .area-infor__title 對匯額度
          .area-infor__content {{ userInfo.ContrastPoint | currency }}
        li
          i.material-icons attach_money
          .area-infor__title 極贏額度
          .area-infor__content {{ userInfo.SuperPoint | currency }}
        li
          i.material-icons trending_up
          .area-infor__title 全商品持倉上限
          .area-infor__content {{ userInfo.AllStoreLimit }}
        li
          i.material-icons trending_up
          .area-infor__title 全商品每筆上限
          .area-infor__content {{ userInfo.DaySubmitLimit }}
        li
          i.material-icons trending_up
          .area-infor__title 全商品留倉上限
          .area-infor__content {{ userInfo.AllRemainingLimit }}
        li
          i.material-icons today
          .area-infor__title 全商品留倉天數
          .area-infor__content {{ userInfo.SubmitConfirm ? '是' : '否' }}
        li
          i.material-icons check_box
          .area-infor__title 下單前是否確認
          .area-infor__content {{ userInfo.SubmitConfirm ? '是' : '否' }}
        li
          i.material-icons access_time
          .area-infor__title 結算時間
          .area-infor__content {{ userInfo.EndTime }}
        li
          i.material-icons description
          .area-infor__title 報價模式
          .area-infor__content {{ userInfo.PriceMode == 0 ? '整數報價' : '完整報價' }}
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
  ]),
  methods: {
    checkAcctColor() {
      if (this.userInfo.State == '正常') {
        return 'background: #28a745'
      }

      if (this.userInfo.State == '凍結') {
        return 'background: #0062cc'
      }

      if (this.userInfo.State == '停用') {
        return 'background: #dc3545'
      }
    },
  }
}
</script>