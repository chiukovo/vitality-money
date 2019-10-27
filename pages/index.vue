<template>
  <div>
    <div style="background: #fff">
			帳號<input type="text" v-model="account">
			密碼<input type="password" v-model="password">
			<button @click="doLogin">登入</button>
			{{ $store.state.sessionStorage.userAuth }}
    </div>
  </div>
</template>

<script>

import axios from 'axios'
import qs from 'qs'

export default {
	data () {
	  return {
      account: '',
      password: '',
	  }
	},
	mounted() {
	},
	methods: {
		async doLogin() {
			if (this.account == '' || this.password == '') {
				return
			}

			await axios.post("/api/validation", qs.stringify({
			  LoginAccount: this.account,
			  LoginPassword: this.password,
			  LoginMobile: 0,
			}))
			.then(response => {
				const result = response.data

			  if (result['Code'] <= 0) {
			  	console.log(result['ErrorMsg'])
			  	return
			  }

			  //set user info
			  this.$store.commit('setuserAuth', result);
			})
		}
	},
}
</script>