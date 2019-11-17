<template lang='pug'>
  .container-fluid
    #header.header
      Header
      <audio src="@/assets/sound/order_success.mp3" controls></audio>
    #main.main(:style='mainStyles')
      #mainLeft.main-left
        UserInfo
        #leftTopDragbar(style="height: 10px" class="horizontal" :class="dragLeftTopStart ? 'dragLeftTopStart' : ''")
        ItemDetail
      #leftDragbar(style="width: 10px" class="straight" :class="dragLeftStart ? 'dragLeftStart' : ''")
      #mainRight.main-right
        MainItem
        #midDragbar(style="height: 10px" class="straight" :class="dragMidStart ? 'dragMidStart' : ''")
        History
        Operating
    #footer.footer
      Footer
</template>
<script>

import websocketService from '~/plugins/service/websocketService.js'
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
			history: 0,
      dragMidStart: false,
      dragLeftStart: false,
      dragLeftTopStart: false,
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
  computed: {
    mainItem () {
      return this.$store.state.mainItem
    }
  },
  watch: {
    mainItem () {
      this.resizeHeight()
    },
  },
  mounted () {
    let _this = this
  	this.checkLogin()

  	//中間拉霸
  	let midDragbar = document.getElementById('midDragbar')

  	midDragbar.addEventListener('mousedown', () => {
      _this.dragMidStart = true
  	})

  	document.addEventListener('mouseup', (e) => {
  	  if (_this.dragMidStart) {
        _this.midDragbarMove(e)
      }
      _this.dragMidStart = false
  	})

    //左拉霸
    let leftDragbar = document.getElementById('leftDragbar')

    leftDragbar.addEventListener('mousedown', () => {
      _this.dragLeftStart = true
    })

    document.addEventListener('mouseup', (e) => {
      if (_this.dragLeftStart) {
        _this.leftDragbarMove(e)
      }
      _this.dragLeftStart = false
    })

    //左上拉霸
    let leftTopDragbar = document.getElementById('leftTopDragbar')

    leftTopDragbar.addEventListener('mousedown', () => {
      _this.dragLeftTopStart = true
    })

    document.addEventListener('mouseup', (e) => {
      if (_this.dragLeftTopStart) {
        _this.leftTopDragbarMove(e)
      }
      _this.dragLeftTopStart = false
    })
	}
}
</script>