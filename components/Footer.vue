<template lang='pug'>
.footer
	.row.d-flex.justify-content-between
		#news
			marquee.news__list(onmouseover='this.stop()' onmouseout='this.start()')
				a.news__item(href='#' v-for="item in items") {{ item }}
		#today
			.today__date
				span {{ dateTime }}
				button 1-伺服器
</template>


<script>

import axios from 'axios'
import qs from 'qs'

export default {
  data() {
    return {
      dateTime: '',
      items: [],
    }
  },
  mounted() {
  	this.showDateTime()
    this.announce()
  },
  methods: {
  	showDateTime() {
  		let now=new Date()//生成日期物件(完整的日期資訊)
  		let y=now.getFullYear()//年份
  		let M=now.getMonth()+1//月份
  		let d=now.getDate()//日期
  		let h=now.getHours()//小時
  		let m=now.getMinutes()//分鐘
  		let s=now.getSeconds()//秒數

  		this.dateTime = y+'年'+M+'月'+d+'日'+h+'時'+m+'分'+s+'秒'
  		setTimeout(this.showDateTime, 1000) //每間隔一秒就呼叫自已一次
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