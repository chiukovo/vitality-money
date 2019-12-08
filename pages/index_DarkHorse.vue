<template lang='pug'>
.index
	.backsite 新元氣理財【客戶端】備用站點：
		a(href="#") http://xxx.xxx.cc
		a(href="#") 加入最愛
	.index-wrap
		button.button-login(@click="loginShow = !loginShow") 網頁版登入
	.login-wrap(v-if="loginShow == true")
		.login-wrap_inner
			.login-nav
				a(href="#") 遠端協助
				a(href="#") html5
				a(href="#") 網頁版登入
				a(href="#") 意見留言
			.login-box
				.login__header 登入
				.login__form
					el-form(label-width='40px')
						el-form-item(label='線路')
							el-select(placeholder='伺服器' v-model='server' style='width: 100%;')
								el-option(label='1-伺服器' value='server1')
						el-form-item(label='帳號')
							el-input(v-model='account' placeholder='請输入帳號')
						el-form-item(label='密碼')
							el-input(v-model='password' type='password' placeholder='請输入密碼')
						el-form-item
							el-checkbox(v-model="rememberMe") 記住我
						el-form-item
							el-button(type='primary' native-type="submit" @click.native.prevent="doLogin") 登入
	.loading(v-loading='loading' v-if="loading")
</template>

<script>

import axios from 'axios'
import qs from 'qs'
import '@/assets/sass/style.scss'

export default {
	head() {
	  return {
	    htmlAttrs: {
	       class: this.$store.state.customStyle.htmlClass + ' login'
	    }
	  }
	},
	data () {
	  return {
			loading: true,
			loginShow: false,
			account: '',
			password: '',
			rememberMe: '',
			server: 'server1',
	  }
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
		async doLogin() {
			let _this = this

			if (this.account == '' || this.password == '') {
				this.$alert('帳號或密碼不得為空', '注意!')
				return
			}

			this.loading = true

			await axios.post("/api/validation", qs.stringify({
			  LoginAccount: this.account,
			  LoginPassword: this.password,
			  LoginMobile: 0,
			}))
			.then(response => {
				const result = response.data

			  if (result['Code'] <= 0) {
			  	this.$alert(result['ErrorMsg'], '注意!')
			  	_this.loading = false
			  	return
			  }

			  //記住我
			  _this.$store.commit('setRemember', {
			  	me: _this.rememberMe,
			  	account: _this.account,
			  	password: _this.password,
			  })

			  //set user info
			  _this.$store.commit('setuserAuth', result)
			})
		}
	},
}
</script>