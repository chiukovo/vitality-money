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
		const {
			UserID,
			UserToken,
			ReturnURL,
		} = this.$route.query;
		
		if (UserID && UserToken && ReturnURL) {
			this.$store.commit("setMobile", 1)
			//set user info
			this.$store.commit('setuserAuth', {
				UserId: UserID,
				Token: UserToken,
				ReturnURL: ReturnURL,
			})
		}
	},
	methods: {
	},
}
</script>