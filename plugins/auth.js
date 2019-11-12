import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'

Vue.mixin({
  methods: {
  	checkLogin () {
  		let _this = this
  		_this.LoginLoopCheck()

      //取得一次初始訂單資料 (預設10秒call一次)
      _this.$store.dispatch('CALL_MEMBER_ORDER_LIST')

  		window.setInterval(function() {
  			_this.LoginLoopCheck()
  		}, 5000)
  	},
  	LoginLoopCheck () {
			const userAuth = this.$store.state.localStorage.userAuth

			if (typeof userAuth.token == 'undefined' || typeof userAuth.userId == 'undefined') {
				location.href = "/"
			} else {
				this.getUserInfo()
			}
  	},
		async getUserInfo () {
			this.$store.dispatch('CALL_MEMBER_INFO')
		},
  }
})