<template lang='pug'>
.root
	//- 商品報價
	MainItem(v-if='tabShow == 1')
	//- 商品下單
	Operating(v-if='tabShow == 2')
	//- 單據列表
	Documents(v-if='tabShow == 3')
	//- 報表查詢
	Report(v-if='tabShow == 4')
	//- 系統功能
	System(v-if='tabShow == 5')
	//- 在線客服
	Message(v-if='tabShow == 6' :tabShow="tabShow")
	//-成交回報
	Tips
	#tabs-nav
		.tabs-nav-wrap
			.tabs-list
				.tab-list__item(
					@click='handleTab(1)'
					:class="{'current': tabShow == 1}")
					i.item__icon.el-icon-s-home
					.item__name 主頁
				.tab-list__item(
					@click='handleTab(2)'
					:class="{'current': tabShow == 2}")
					i.item__icon.el-icon-s-claim
					.item__name 下單
				.tab-list__item(
					@click='handleTab(3)'
					:class="{'current': tabShow == 3}")
					i.item__icon.el-icon-s-order
					.item__name 單據
				.tab-list__item(
					@click='handleTab(4)'
					:class="{'current': tabShow == 4}")
					i.item__icon.el-icon-s-marketing
					.item__name 報表
				.tab-list__item(
					@click='handleTab(5)'
					:class="{'current': tabShow == 5}")
					i.item__icon.el-icon-s-tools
					.item__name 系統
				.tab-list__item(
					@click='handleTab(6)'
					:class="{'current': tabShow == 6}")
					i.item__icon.el-icon-s-comment(:class="blink ? 'blink' : ''")
					.item__name 客服
</template>
<script>

import { mapState } from 'vuex'
import websocketService from '~/plugins/service/websocketService.js'
import MainItem from "~/components/mobile/MainItem"
import Operating from "~/components/mobile/Operating"
import Documents from "~/components/mobile/Documents"
import Report from "~/components/mobile/Report"
import System from "~/components/mobile/System"
import Message from "~/components/mobile/Message"
import Tips from "~/components/Tips"
import '@/assets/sass/mobile.scss'

export default {
	head() {
	  return {
	    htmlAttrs: {
	       class: this.$store.state.customStyle.htmlClass + 'mobile'
			},
			meta: [
				{ name: 'viewport', content: 'width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no' }
			]
	  }
	},
	mixins: [websocketService],
	computed: mapState({
	  hasMessage: 'hasMessage',
	}),
	components: {
		MainItem,
		Operating,
		Documents,
		Report,
		System,
		Tips,
		Message
	},
	data() {
		return {
			loading: true,
			tabShow: 1,
			blink: false,
			allHeight: {
				mainItem: 0,
			}
		}
	},
	beforeMount() {
		this.checkDevice()
	},
  mounted() {
  	this.checkLogin()
	},
	watch: {
		hasMessage(type) {
			if (this.tabShow != 6 && type) {
				this.blink = true
			} else {
				this.blink = false
			}

			this.$store.commit('setHasMessage', this.blink)
		}
	},
	methods: {
		handleTab(e) {
			this.tabShow = e
		}
	}
}
</script>