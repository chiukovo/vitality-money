<template lang='pug'>
.modals.ActionLog
  .page
    .header
      .header__left
        el-link(@click='$parent.handleQuote(0)' icon='el-icon-arrow-left' :underline='false') 返回
      .header__title 動作日誌
    .main
      .area
        .area__header
          button.button(@click="selectDayType('thisWeek')") 本週
          button.button(@click="selectDayType('beforeWeek')") 上週
          button.button(@click="selectDayType('thisMonth')") 本月
          button.button(@click="selectDayType('beforeMonth')") 上月
      .area(style="height: calc(100% - 40px); overflow-y: scroll;")
        ul.area-data-list(v-loading="loading")
          li(v-for="item in items")
            .area-data__title {{ item.ActionType }}
            .area-data__infor {{ item.ActionData }}
              .area-data__date {{ item.ActionTime }}
</template>
<script>

import axios from 'axios'
import qs from 'qs'

export default {
  data () {
    return {
      form: {
        start: '',
        end: '',
      },
      items: [],
      loading: true
    }
  },
  mounted () {
    this.selectDayType('thisWeek')
  },
  methods: {
    async query() {
      let _this = this
      _this.loading = true

      if (this.form.start != '' && this.form.end != '') {
        const userId = this.$store.state.localStorage.userAuth.userId
        const token = this.$store.state.localStorage.userAuth.token
        const lang = this.$store.state.localStorage.lang

        await axios.post("/api/query_actionlist?lang=" + lang, qs.stringify({
          UserID: userId,
          Token: token,
          StartDate: this.form.start,
          EndDate: this.form.end,
          DaySelect: -1,
        }))
        .then(response => {
          _this.loading = false
          const result = response.data
          _this.items = result.ActionArray
        })
      }
    }
  }
}
</script>