<template lang='pug'>
.footer
	.row.d-flex
		#news
			marquee.news__list(onmouseover='this.stop()', onmouseout='this.start()')
				a.news__item(href='#') 版面D與手機版,新增技術分析版本
				a.news__item(href='#') 手機版與桌面版新增可自選顏色功能
				a.news__item(href='#') 在報價明細區,新增可自選時間壓力支撐指標
				a.news__item(href='#') 新增F G 版面,供黑馬元氣會員下單,B版供RSI DT 會員下單
				a.news__item(href='#') 此版為測試帳號,損益不列入計算,此帳號將不定時刪除交易記錄與強平所有倉位!
		#today
			.today__date
				span {{ dateTime }}
				button 12-伺服器
</template>

<script>

export default {
  data() {
    return {
      dateTime: ''
    }
  },
  mounted() {
  	this.showDateTime()
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
  	}
  }
}
</script>