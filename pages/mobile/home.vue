<template lang='pug'>
.container-fluid
	include mixins.pug
	#header
		.header(v-if='tabShow == 1')
			.header__left
				el-button(size='mini') 自選商品
			.header__title 商品報價
			.header__right
				el-button(size='mini' icon='el-icon-user-solid')
		.header(v-if='tabShow == 2')
			.header__title 商品報價
			.header__right
				el-select(v-model='product' placeholder='臺指早' size='mini')
					el-option(label='臺指早' value='1')
		.header(v-if='tabShow == 3')
			.header__title 單據列表
		.header(v-if='tabShow == 4')
			.header__title 報表查詢
	#main.main
		.main-area(v-show='tabShow == 1')
			MainItem
		.main-area(v-show='tabShow == 2')
			Operating
		.main-area(v-if='tabShow == 3')
			ul.nav-list
				li(@click='handleDocument(1)') 買賣單據
				li(@click='handleDocument(2)') 未平倉單
				li(@click='handleDocument(3)') 已平倉單
				li 掛單
				li 商品統計
			template(v-if='documentShow == 1')
				.modals.documents
					#header
						.header
							.header__left
								el-link(@click='handleDocument(0)' icon='el-icon-arrow-left' :underline='false') 返回
							.header__title 買賣單據
							.header__right
								el-button(size='mini' icon='el-icon-refresh-left') 刷新
					#main.main
						el-table(:data='tableData'
						border
						:highlight-current-row='true'
						style='width: 100%')
							el-table-column(prop='th1' label='商品' align='center' fixed)
							el-table-column(prop='th2' label='操作' align='center' width='80')
								template
									.hsbutton
										el-button(size='mini') 改
										el-button(size='mini') 刪
							el-table-column(prop='th3' label='多空' align='center' )
							el-table-column(prop='th4' label='委託價' align='center')
							el-table-column(prop='th5' label='口數' align='center')
			template(v-if='documentShow == 2')
				.modals.documents
						#header
							.header
								.header__left
									el-link(@click='handleDocument(0)' icon='el-icon-arrow-left' :underline='false') 返回
								.header__title 未平倉單
								.header__right
									el-button(size='mini' icon='el-icon-refresh-left') 刷新
						#main.main
							.area
								.area__header
									el-button(size='mini') 全選
									el-button(size='mini') 全不選
									el-button(size='mini') 平倉
							el-table(:data='tableData'
							border
							:highlight-current-row='true'
							style='width: 100%')
								el-table-column(prop='th1' label='商品' align='center' fixed)
								el-table-column(prop='th2' label='操作' align='center' width='80')
									template
										.hsbutton
											el-button(size='mini') 平倉
								el-table-column(prop='th3' label='多空' align='center' )
								el-table-column(prop='th4' label='委託價' align='center')
								el-table-column(prop='th5' label='口數' align='center')
			template(v-if='documentShow == 3')
				.documents
					.mask-wrap 已平倉單
			template(v-if='documentShow == 4')
				.documents
					.mask-wrap 掛單
			template(v-if='documentShow == 5')
				.documents
					.mask-wrap 商品統計
		.main-area(v-if='tabShow == 4')
			ul.nav-list
				li(@click='handleQuote(1)') 對帳表
				li(@click='handleQuote(2)') 歷史損益
				li 儲值記錄
				li(@click='handleQuote(4)') 動作日誌
				li 歷史報價
			template(v-if='quoteShow == 1')
				.modals.quote
					#header
						.header
							.header__left
								el-link(@click='handleQuote(0)' icon='el-icon-arrow-left' :underline='false') 返回
							.header__title 對帳表
							.header__right
								el-button(size='mini' icon='el-icon-refresh-left') 刷新
					#main.main
						.area
							.area__header
								el-radio(label='0') 本週
								el-radio(label='1') 上週
								el-radio(label='2') 本月
								el-radio(label='3') 上月
						el-table(:data='tableData'
						border
						:highlight-current-row='true'
						style='width: 100%')
							el-table-column(prop='th1' label='日期' align='center' fixed)
							el-table-column(prop='th2' label='餘額' align='center')
							el-table-column(prop='th3' label='今日損益' align='center' )
							el-table-column(prop='th4' label='交收' align='center')
			template(v-if='quoteShow == 2')
				.modals.quote
					#header
						.header
							.header__left
								el-link(@click='handleQuote(0)' icon='el-icon-arrow-left' :underline='false') 返回
							.header__title 歷史損益
								span (-41450)
							.header__right
								el-button(size='mini' icon='el-icon-refresh-left') 刷新
					#main.main
							.area
								ul.area__list
									li(@click='quoteShowDetail = !quoteShowDetail') [臺指早] 口數:2 手續費:0 損益:-54800
										i.el-icon-arrow-right
									li(@click='quoteShowDetail = !quoteShowDetail') [道瓊期] 口數:1 手續費:50 損益:16300
										i.el-icon-arrow-right
								template(v-if='quoteShowDetail')
									.modals.quote__detail
										#header
											.header
												.header__left
													el-link(@click='quoteShowDetail = !quoteShowDetail' icon='el-icon-arrow-left' :underline='false') 返回
												.header__title [臺指早] 歷史損益:250
										#main.main
											.area
												.area__header 時間 [2019-11-11]->[2019-11-17]
											el-table(:data='tableData'
											border
											:highlight-current-row='true'
											style='width: 100%')
												el-table-column(prop='th1' label='ID' align='center' fixed)
												el-table-column(prop='th2' label='商品' align='center' fixed)
												el-table-column(prop='th3' label='口' align='center' )
												el-table-column(prop='th4' label='手續費' align='center')
												el-table-column(prop='th5' label='損益' align='center')
			template(v-if='quoteShow == 4')
				.modals.quote
					+header__Back_Reload('動作日誌')
					#main.main
						|123
		.main-area(v-if='tabShow == 5') 5
	#footer.footer
		.nav-tab
			.tabs-list
				+tab-list__item('tab', 'handleTab', '1', '主頁', 'el-icon-s-home')
				+tab-list__item('tab', 'handleTab', '2', '下單', 'el-icon-s-claim')
				+tab-list__item('tab', 'handleTab', '3', '單據', 'el-icon-s-order')
				+tab-list__item('tab', 'handleTab', '4', '報表', 'el-icon-s-marketing')
				+tab-list__item('tab', 'handleTab', '5', '系統', 'el-icon-s-tools')
</template>
<script>

import websocketService from '~/plugins/service/websocketService.js'
import MainItem from "~/components/mobile/MainItem"
import Operating from "~/components/mobile/Operating"
import '@/assets/sass/mobile.scss'

export default {
	head() {
	  return {
	    htmlAttrs: {
	       class: this.$store.state.customStyle.htmlClass + 'mobile'
			},
			meta: [
				{ name: 'viewport', content: 'width=device-width, initial-scale=1, user-scalable=no' }
			]
	  }
	},
	mixins: [websocketService],
	components: {
		MainItem,
		Operating,
	},
	data() {
		return {
			loading: true,
			tabShow: 1,
	  	product: '1',
			documentShow: 0,
			quoteShow: 0,
			quoteShowDetail: true,
			allHeight: {
				mainItem: 0,
			}
		}
	},
	beforeMount () {
	  //算好所有手機板高度
	  this.mobileAllHeight()
  },
  mounted () {
  	this.checkLogin()
	},
	methods: {
		handleTab(e) {
			this.tabShow = e
		},
		handleDocument(e) {
			this.documentShow = e
		},
		handleQuote(e) {
			this.quoteShow = e
		}
	}
}
</script>