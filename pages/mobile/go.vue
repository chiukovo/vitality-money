<template lang='pug'>
div
</template>

<script>

export default {
	data() {
	  return {

	  }
	},
	mounted() {
		//判斷是否另開視窗
		if (typeof this.$route.query.UserID != 'undefined' && typeof this.$route.query.UserToken != 'undefined') {
			const id = this.$route.query.UserID
			const token = this.$route.query.UserToken

			const userData = {
				UserId: this.$route.query.UserID,
				Token: this.$route.query.UserToken,
			}

			this.$store.commit("setMobile", 1)
			//set user info
			this.$store.commit('setuserAuth', userData)

			//如果有ReturnURL存入cookie
			if (typeof this.$route.query.ReturnURL != 'undefined') {
				document.cookie = `ReturnURL=${this.$route.query.ReturnURL}`
			}
		}
	},
	methods: {
	},
}
</script>