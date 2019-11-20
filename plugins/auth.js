import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'

Vue.mixin({
  methods: {
  	checkLogin () {
  		let _this = this

      setTimeout(function() {
        //for firfox
        _this.LoginLoopCheck()
        _this.$store.dispatch('CALL_MEMBER_ORDER_LIST')
      }, 1500)

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