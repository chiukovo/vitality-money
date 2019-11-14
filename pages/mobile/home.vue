<template lang='pug'>
.container-fluid
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
				el-select(placeholder='臺指早' size='mini')
					el-option(label='臺指早' value='1')
		.header(v-if='tabShow == 3')
			.header__title 單據列表
	#main.main
		.main-area(v-if='tabShow == 1')
			el-table(:data='tableData'
			border
			:highlight-current-row='true'
			style='width: 100%')
				el-table-column(prop='th1' label='商品' align='center' fixed)
				el-table-column(prop='th2' label='倉位' align='center' fixed width='50')
				el-table-column(prop='th3' label='成交' align='center' )
				el-table-column(prop='th4' label='漲跌' align='center')
				el-table-column(prop='th5' label='買進' align='center')
		.main-area(v-if='tabShow == 2')
			.area
				.area__header
					el-button(type='primary' size='mini') 一般下單
					el-button(size='mini') 雷電下單
				.area__content
					el-radio(label='0') 市價單
					el-radio(label='1') 限價單
					el-radio(label='2') 收盤單
					el-radio(label='3') 收盤單
			.area
				table.el-table
					thead
						tr
							th: .cell.text-center 商品
							th: .cell.text-center 倉位
							th: .cell.text-center 成交
							th: .cell.text-center 漲跌
					tbody
						tr
							td: .cell.text-center.text-down 臺指早
							td: .cell.text-center 0
							td: .cell.text-center.text-down 11573
							td: .cell.text-center.text-down
								.table-icon
									.icon-arrow(class='icon-arrow-down')
									|23
						tr
							td.limit.limit__1(colspan='4'): .cell.text-center 口數：
								el-input-number(size='small' :min='0')
						tr
							td.limit.limit__2(colspan='4'): .cell.text-center 限價：
								el-input-number(size='small' :min='0')
								el-button 現
						tr
							td.limit.limit__3(colspan='4'): .cell.text-center 停利：
								el-input-number(size='small' :min='0')
						tr
							td.limit.limit__4(colspan='4'): .cell.text-center 停損：
								el-input-number(size='small' :min='0')
			.area
				.area__header
					.area__title(style='color: yellow') 目前下單商品: 臺指早
					el-checkbox(size='mini' label='收盤全平')
				.area__content.text-center
					el-button(type="danger" @click="checkOrder(0)") 下多單
					el-button(type="success" @click="checkOrder(1)") 下空單
			.area
				table.el-table.progress-table
					thead
						tr
							th(colspan='2'): .cell.text-right 委買
							th(colspan='2'): .cell.text-center 價格
							th(colspan='2'): .cell.text-left 委賣
					tbody
						- for (var x = 0; x < 3; x++)
							tr
								td(style='width:20%'): .cell
									.progress-bar
										el-progress(
											:text-inside='true'
											:stroke-width='14'
											:percentage='8'
											:show-text='false'
											status="exception")
								td: .cell.text-center 8
								td: .cell.text-center.text-up 11572
								td: .cell.text-center.text-down 11573
								td: .cell.text-center 33
								td(style='width:20%'): .cell
									.progress-bar
										el-progress(
											:text-inside='true'
											:stroke-width='14'
											:percentage='33'
											:show-text='false'
											status="success")
		.main-area(v-if='tabShow == 3')
			.nav-list
				li: a(@click='handleDocument(1)' href='#') 買賣單據
				li: a(@click='handleDocument(2)' href='#') 未平倉單
				li: a(@click='handleDocument(3)' href='#') 已平倉單
				li: a(href='#') 掛單
				li: a(href='#') 商品統計
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
		.main-area(v-if='tabShow == 4') 4
		.main-area(v-if='tabShow == 5') 5
	#footer.footer
		.nav-tab
			.tabs-list
				.tab-list__item(@click='handleTab(1)' :class="{'current': tabShow == 1 }")
					i.item__icon.el-icon-s-home
					.item__name 主頁
				.tab-list__item(@click='handleTab(2)' :class="{'current': tabShow == 2 }")
					i.item__icon.el-icon-s-claim
					.item__name 下單
				.tab-list__item(@click='handleTab(3)' :class="{'current': tabShow == 3 }")
					i.item__icon.el-icon-s-order
					.item__name 單據
				.tab-list__item(@click='handleTab(4)' :class="{'current': tabShow == 4 }")
					i.item__icon.el-icon-s-marketing
					.item__name 報表
				.tab-list__item(@click='handleTab(5)' :class="{'current': tabShow == 5 }")
					i.item__icon.el-icon-s-tools
					.item__name 系統
	//- .loading(v-loading='loading')
</template>
<script>

// import Header from "~/components/Header"
// import MainItem from "~/components/MainItem"
// import ItemDetail from "~/components/ItemDetail"
// import UserInfo from "~/components/UserInfo"
// import History from "~/components/History"
// import Operating from "~/components/Operating"
// import Footer from "~/components/Footer"
// import { mapState } from 'vuex'
// import { Loading } from 'element-ui';
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
	data() {
		return {
			loading: true,
			tabShow: 3,
			documentShow: 0,
			tableData: [{
				th1: '加權指',
				th2: '0',
				th3: '11586',
				th4: '20',
				th5: '0'
			},{
				th1: '台指早',
				th2: '0',
				th3: '11586',
				th4: '20',
				th5: '0'
			},{
				th1: '恆生期',
				th2: '0',
				th3: '11586',
				th4: '20',
				th5: '0'
			}]
		}
	},
	methods: {
		handleTab(e) {
			this.tabShow = e
		},
		handleDocument(e) {
			this.documentShow = e
			console.log(this.documentShow)
		}
	}
}
</script>