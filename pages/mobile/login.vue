<template lang='pug'>
.login-wrap
	.login-box
		//- .login__header 登入
		.login__form
			el-form
				el-form-item
					el-input(v-model='account' placeholder='帳號')
				el-form-item
					el-input(v-model='password' type='password' placeholder='密碼')
				el-form-item
					el-row
						el-col(:span='12')
							el-checkbox(label='記住我')
						el-col(:span='12')
							el-select(placeholder='12-伺服器' v-model='server' style='width: 100%;')
								el-option(label='10-伺服器' value='server10')
								el-option(label='11-伺服器' value='server11')
				el-form-item
					el-button(type='primary' @click="doLogin") 登入
					
	.loading(v-loading='loading')
	//- el-dialog(title='提示' :visible.sync='doLogin' width="90%" :modal='false')
		span 登入訊息改這個大小
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
      account: '',
      password: '',
	  server: 'server10'
	  }
	},
	mounted() {
	},
	methods: {
		nuxt: function() {
			this.$el.querySelector('.login-wrap').style.height = '100%'
		},
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
			  this.$store.commit('setuserAuth', result);
			})
		}
	},
}
</script>