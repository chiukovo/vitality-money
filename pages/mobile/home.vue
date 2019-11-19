<template lang='pug'>
.container-fluid
	client-only
		include mixins.pug
	#header
	#main
		//- 商品報價
		MainItem(v-if='tabShow == 1')
		//- 商品下單
		Operating(v-if='tabShow == 2')
		//- 單據列表
		Documents(v-if='tabShow == 3')
		//- 報表查詢
		History(v-if='tabShow == 4')
		//- 系統功能
		System(v-if='tabShow == 5')
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
import Documents from "~/components/mobile/Documents"
import History from "~/components/mobile/History"
import System from "~/components/mobile/System"
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
		Documents,
		History,
		System
	},
	data() {
		return {
			loading: true,
			tabShow: 1,
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
		}
	}
}
</script>