<template lang='pug'>
.login-wrap
	.login-box
		.login__header
			.logo
		.login__form
			el-form
				el-form-item
					el-input(v-model='account' placeholder='帳號')
				el-form-item
					el-input(v-model='password' type='password' placeholder='密碼')
				el-form-item
					.row
						.col
							el-checkbox(label='記住我' v-model="rememberMe")
						.col
							el-select(placeholder='1-伺服器' v-model='server' style='width: 100%;')
								el-option(label='1-伺服器' value='server1')
				el-form-item
					el-button(type='primary' native-type="submit" @click.native.prevent="doLogin") 登入

	.loading(v-loading='loading' v-if="loading")
</template>

<script>

import axios from 'axios'
import qs from 'qs'
import '@/assets/sass/mobile.scss'

export default {
	head() {
	  return {
	    htmlAttrs: {
	       class: this.$store.state.customStyle.htmlClass + ' login mobile'
		},
		meta: [
			{ name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' }
		]
	  }
	},
	data () {
	  return {
      loading: true,
      account: '',
      password: '',
      rememberMe: '',
	  	server: 'server1'
	  }
	},
	beforeMount() {
		this.checkDevice()
	},
	mounted() {
		this.loading = false

		//remember data
		const remember = this.$store.state.localStorage.remember
		this.rememberMe = remember.me

		if (this.rememberMe) {
			this.account = remember.account
			this.password = remember.password
		}
	},
	methods: {
		nuxt: function() {
			this.$el.querySelector('.login-wrap').style.height = '100%'
		},
		async doLogin() {
			let _this = this

			if (this.account == '' || this.password == '') {
				this.$alert('帳號或密碼不得為空', '注意!')
				return
			}

			await axios.post(process.env.NUXT_ENV_API_URL + "/validation", qs.stringify({
			  LoginAccount: this.account,
			  LoginPassword: this.password,
			  LoginMobile: 0,
			}))
			.then(response => {
				const result = response.data

			  if (result['Code'] <= 0) {
			  	_this.$alert(result['ErrorMsg'], '注意!')
			  	return
			  }

			  //記住我
			  _this.$store.commit('setRemember', {
			  	me: _this.rememberMe,
			  	account: _this.account,
			  	password: _this.password,
			  })

			  //set user info
			  _this.$store.commit('setuserAuth', result);
			})
		}
	},
}
</script>