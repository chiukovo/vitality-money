import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'

Vue.mixin({
  methods: {
  	checkLogin () {
  		let _this = this
  		_this.LoginLoopCheck()

  		window.setInterval(function() {
  			_this.LoginLoopCheck()
  		}, 5000)
  	},
  	LoginLoopCheck () {
  			const userAuth = this.$store.state.sessionStorage.userAuth

  			if (typeof userAuth.token == 'undefined' || typeof userAuth.userId == 'undefined') {
  				location.href = "/"
  			} else {
  				this.getUserInfo()
  			}
  	},
		async getUserInfo () {
			const lang = this.$store.state.sessionStorage.lang
			const userId = this.$store.state.sessionStorage.userAuth.userId
			const token = this.$store.state.sessionStorage.userAuth.token

			await axios.post("/api/query_member_and_commoditylist?lang=" + lang, qs.stringify({
			  UserID: userId,
			  Token: token,
			}))
			.then(response => {
				const result = response.data

				if (result['Code'] > 0) {
					this.$store.commit('setUserInfo', result)
				}
			})
		},
  }
})