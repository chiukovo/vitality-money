<template lang='pug'>
	.container-fluid
		#header.header
			.header__left
				el-button 自選商品
			.header__title 商品報價
			.header__right
				el-button(icon='el-icon-user-solid')
		#main.main
			.main-area(v-if='tabShow == 1')
				el-table(:data='tableData'
				border
				size='mini'
				:highlight-current-row='true'
				style='width: 100%')
					el-table-column(prop='th1' label='商品' fixed)
					el-table-column(prop='th2' label='倉位' fixed width='50')
					el-table-column(prop='th3' label='成交' )
					el-table-column(prop='th4' label='漲跌')
					el-table-column(prop='th5' label='買進')
			.main-area(v-if='tabShow == 2') 2
			.main-area(v-if='tabShow == 3') 3
			.main-area(v-if='tabShow == 4') 4
			.main-area(v-if='tabShow == 5') 5
		#footer.footer
			.nav-tab
				.tabs-list
					.tab-list__item(@click="handleTab(1)" :class="{'current': tabShow == 1 }")
						i.item__icon.el-icon-s-home
						.item__name 主頁
					.tab-list__item(@click="handleTab(2)" :class="{'current': tabShow == 2 }")
						i.item__icon.el-icon-s-claim
						.item__name 下單
					.tab-list__item(@click="handleTab(3)" :class="{'current': tabShow == 3 }")
						i.item__icon.el-icon-s-order
						.item__name 單據
					.tab-list__item(@click="handleTab(4)" :class="{'current': tabShow == 4 }")
						i.item__icon.el-icon-s-marketing
						.item__name 報表
					.tab-list__item(@click="handleTab(5)" :class="{'current': tabShow == 5 }")
						i.item__icon.el-icon-s-tools
						.item__name 系統
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
			tabShow: 1,
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
			this.isShow = e,
			console.log(this.isShow)
		},
	}
}
</script>