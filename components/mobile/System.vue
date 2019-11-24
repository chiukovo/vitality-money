<template lang='pug'>
.page
  client-only
    include mixins.pug
  .header
    .header__title 系統功能
  .main
    ul.nav-list
      +nav-list-item('handleSystem', '1', '帳戶訊息')
      +nav-list-item('handleSystem', '2', '商品訊息')
      +nav-list-item('handleSystem', '4', '系統公告')
      +nav-list-item('handleSystem', '6', '系統設置')
      +nav-list-item('handleSystem', '8', '更改密碼')
    .nav-button
      el-button(type='danger').logout 登出帳號
    UserInfo(v-if='systemShow == 1')
    UserDetail(v-if='systemShow == 2')
    News(v-if='systemShow == 4')
    Setting(v-if='systemShow == 6')
    ChangPassword(v-if='systemShow == 8')
</template>

<script>

import UserInfo from "~/components/mobile/UserInfo"
import UserDetail from "~/components/mobile/UserDetail"
import News from "~/components/mobile/News"
import Setting from "~/components/mobile/Setting"
import ChangPassword from "~/components/mobile/ChangPassword"

import { mapState } from 'vuex'

export default {
  components: {
		UserInfo,
    UserDetail,
    News,
    Setting,
    ChangPassword
	},
  data () {
    return {
      systemShow: 0,
    };
  },
  methods: {
    handleSystem(e) {
      this.systemShow = e
    }
  }
}
</script>