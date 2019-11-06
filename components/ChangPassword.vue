<template lang='pug'>
  el-form
    el-form-item(label="帳號")
      el-input(:value="$store.state.userInfo.Account" :disabled="true")
    el-form-item(label="舊密碼")
      el-input(type="password" v-model="form.oldPassword")
    el-form-item(label="新密碼")
      el-input(type="password" v-model="form.newPassword")
    el-form-item(label="確認密碼")
      el-input(type="password" v-model="form.checkPassword")
    el-form-item
      el-button(type='primary' @click="submit") 確認
      el-button(@click="cancel") 取消
</template>
<script>

import axios from 'axios'
import qs from 'qs'

export default {
  data () {
    return {
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

      this.$parent.handleClose()
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
          _this.cancel()
        }
      })
    }
  }
}
</script>