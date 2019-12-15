<template lang='pug'>
.modals.News
  .header
    .header__left
      el-link(@click='$parent.systemShow = 0' icon='el-icon-arrow-left' :underline='false') 返回
    .header__title 系統公告
  .main
    .area
      ul.area-data-list(v-if="items.length > 0")
        li(v-for="item in items")
          .area-data__title.hasDate
            .area-data__name 系統公告
          .area-data__infor {{ item }}
      ul.area-data-list(v-else)
        li
          .area-data__title.hasDate
            .area-data__name 系統公告
          .area-data__infor 暫無公告

</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'
import qs from 'qs'

export default {
  data () {
    return {
      systemShow: 0,
      items: [],
    };
  },
  computed: mapState([
    'userInfo',
  ]),
  mounted() {
    this.announce()
  },
  methods: {
    handleSystem(e) {
			this.systemShow = e
    },
    async announce() {
      const _this = this
      const userId = this.$store.state.localStorage.userAuth.userId
      const token = this.$store.state.localStorage.userAuth.token
      const lang = this.$store.state.localStorage.lang

      await axios.post(process.env.NUXT_ENV_API_URL + "/query_announce?lang=" + lang, qs.stringify({
        UserID: userId,
        Token: token,
      }))
      .then(response => {
        const result = response.data

        if (result.Code > 0) {
          _this.items = result.AnnounceList
        }
      })
    }
  }
}
</script>