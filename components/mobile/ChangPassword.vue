<template lang='pug'>
.modals.changPassword
  .header
    .header__left
      el-link(@click='$parent.systemShow = 0' icon='el-icon-arrow-left' :underline='false') 取消
    .header__title 修改密碼
  .main
    .area
      .area__content
        el-form(label-width="80px")
          el-form-item(label="舊密碼")
            el-input(type="password" v-model="form.oldPassword" placeholder='請輸入舊密碼')
          el-form-item(label="新密碼")
            el-input(type="password" v-model="form.newPassword" placeholder='請輸入新密碼')
          el-form-item(label="確認密碼")
            el-input(type="password" v-model="form.checkPassword" placeholder='請再次新入舊密碼')
          el-form-item
            button.button__primary(type="button" @click="submit") 確定更改密碼
    ul.rules-list
      li 密碼規則:
      li 1.必須6位長度;
      li 2.需要數字和非數字組合;
      li 3.不能有４位或以上連續數字或字母(比如1111,aaaa,1234,abcd)
</template>

<script>

import axios from 'axios'
import qs from 'qs'

export default {
  data () {
    return {
      systemShow: 8,
      form: {
        oldPassword: '',
        newPassword: '',
        checkPassword: '',
      },
    }
  },
  mounted () {

  },
  methods: {
    cancel() {
      //clear form
      this.form = {
        oldPassword: '',
        newPassword: '',
        checkPassword: '',
      }
    },
    async submit() {
      let _this = this
      const form = this.form

      if (form.oldPassword == '' || form.newPassword == '' || form.checkPassword == '') {
        this.$alert('新舊密碼不得為空', '注意!')
        return
      }

      if (form.newPassword != form.checkPassword) {
        this.$alert('兩次輸入的密碼不相同', '注意!')
        return
      }

      const userId = this.$store.state.localStorage.userAuth.userId
      const token = this.$store.state.localStorage.userAuth.token

      await axios.post("/api/set_password", qs.stringify({
        UserID: userId,
        Token: token,
        OldPassword: form.oldPassword,
        NewPassword: form.newPassword,
      }))
      .then(response => {
        const code = response.data.Code

        if (code != 1) {
          _this.$alert(response.data.ErrorMsg, '注意!')
          return
        } else {
          _this.$alert("密碼更改成功")
        }
      })
    }
  }
}
</script>