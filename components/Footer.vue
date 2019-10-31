<template lang='pug'>
	.row.d-flex
		#news.col
			marquee.news__list(onmouseover='this.stop()', onmouseout='this.start()')
				a.news__item(href='#') 版面D與手機版,新增技術分析版本
				a.news__item(href='#') 手機版與桌面版新增可自選顏色功能
				a.news__item(href='#') 在報價明細區,新增可自選時間壓力支撐指標
				a.news__item(href='#') 新增F G 版面,供黑馬元氣會員下單,B版供RSI DT 會員下單
				a.news__item(href='#') 此版為測試帳號,損益不列入計算,此帳號將不定時刪除交易記錄與強平所有倉位!
		#today.col-auto
			.today__date 2019年10月24日11時57分32秒
				el-button(size='mini') 12-伺服器
</template>