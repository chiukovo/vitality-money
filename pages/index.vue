<template lang='pug'>
.login-wrap
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
						el-option(label='10-伺服器' value='server10')
						el-option(label='11-伺服器' value='server11')
				el-form-item(label='帳號')
					el-input(v-model='account' placeholder='请输入帳號')
				el-form-item(label='密碼')
					el-input(v-model='password' type='password' placeholder='请输入密碼')
				el-form-item
					el-checkbox 記住我
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
			account: '',
			password: '',
			server: 'server10',
	  }
	},
	mounted() {
		this.loading = false
	},
	methods: {
		async doLogin() {

			if (this.account == '' || this.password == '') {
				this.$alert('帳號或密碼不得為空', '注意!')
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
			  	this.$alert(result['ErrorMsg'], '注意!')
			  	return
			  }

			  //set user info
			  this.$store.commit('setuserAuth', result)
			})
		}
	},
}
</script>