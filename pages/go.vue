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

			//set user info
			this.$store.commit('setuserAuth', userData)
		}
	},
	methods: {
	},
}
</script>