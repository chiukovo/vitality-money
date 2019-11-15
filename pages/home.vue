<template lang='pug'>
  .container-fluid
    #header.header
      Header
    #main.main(:style='mainStyles')
      #mainLeft.main-left
        UserInfo
        ItemDetail
      #mainRight.main-right
        MainItem
        #midDragbar(style="height: 10px")
        History
        Operating
    #footer.footer
      Footer
</template>
<script>

import websocketService from '~/mixins/service/websocketService.js'
import Header from "~/components/Header"
import MainItem from "~/components/MainItem"
import ItemDetail from "~/components/ItemDetail"
import UserInfo from "~/components/UserInfo"
import History from "~/components/History"
import Operating from "~/components/Operating"
import Footer from "~/components/Footer"
import { mapState } from 'vuex'
import '@/assets/sass/style.scss'

export default {
	head() {
	  return {
	    htmlAttrs: {
	      class: this.$store.state.customStyle.htmlClass
	    }
	  }
	},
	middleware: 'serverAuth',
	data () {
		return {
			mainStyles: {},
			itemDetailStyles: {},
			ItemDetailTable: 0,
			mainItemTable: 0,
			historyTableMaxH: 0,
			history: 0
		}
	},
	mixins: [websocketService],
	components: {
		Header,
		MainItem,
		ItemDetail,
		UserInfo,
		History,
		Operating,
		Footer,
	},
  beforeMount () {
    window.addEventListener('resize', this.resizeHeight)
  },
  mounted () {
  	this.checkLogin()
	}
}
</script>