<template lang='pug'>
  .container-fluid
    #header.header
      Header
    #main.main()
      #mainLeft.main-left
        UserInfo
        #leftTopDragbar(style="height: 10px" class="horizontal")
          .horizontalLine(
            :class="dragLeftTopStart ? 'show' : ''"
            :style="{top: dragY + 'px'}"
          )
        ItemDetail
      #leftDragbar(style="width: 10px" class="straight")
        .straightLine(
          :class="dragLeftStart ? 'show' : ''"
          :style="{left: dragX + 'px'}"
        )
      #mainRight.main-right
        MainItem
        #midDragbar(style="height: 10px" class="horizontal")
          .horizontalLine(
            :class="dragMidStart ? 'show' : ''"
            :style="{top: dragY + 'px'}"
          )
        History
        Operating
    #footer.footer
      Footer
      Sound
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
import Sound from "~/components/Sound"
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
	data() {
		return {
			mainStyles: {},
			itemDetailStyles: {},
			ItemDetailTable: 0,
      itemDetailTableFive: 314,
			mainItemTable: 0,
			historyTableMaxH: 0,
			history: 0,
      dragMidStart: false,
      dragLeftStart: false,
      dragLeftTopStart: false,
      dragY: 0,
      dragX: 0,
      sumX: 0,
      sumY: 0,
      first: true,
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
    Sound,
	},
  beforeMount() {
    window.addEventListener('resize', this.resizeHeight)
  },
  computed: {
    mainItem() {
      return this.$store.state.mainItem
    }
  },
  watch: {
    mainItem() {
      if (this.first) {
        this.resizeHeight()

        this.first = false
      }
    }
  },
  mounted() {
    let _this = this
  	this.checkLogin()

  	//中間拉霸
  	let midDragbar = document.getElementById('midDragbar')

  	midDragbar.addEventListener('mousedown', (e) => {
      _this.dragMidStart = true
      _this.sumX = e.pageX
      _this.sumY = e.pageY

      document.addEventListener('mousemove', _this.dragMousemove)
  	})

  	document.addEventListener('mouseup', (e) => {
  	  if (_this.dragMidStart) {
        _this.sumX = e.pageX - _this.sumX
        _this.sumY = e.pageY - _this.sumY

        _this.midDragbarMove(e)
      }
      _this.dragMidStart = false
      document.removeEventListener('mousemove', _this.dragMousemove)
  	})

    //左拉霸
    let leftDragbar = document.getElementById('leftDragbar')

    leftDragbar.addEventListener('mousedown', (e) => {
      _this.dragLeftStart = true
      _this.sumX = e.pageX
      _this.sumY = e.pageY

      document.addEventListener('mousemove', _this.dragMousemove)
    })

    document.addEventListener('mouseup', (e) => {
      if (_this.dragLeftStart) {
        _this.sumX = e.pageX - _this.sumX
        _this.sumY = e.pageY - _this.sumY

        _this.leftDragbarMove(e)
      }
      _this.dragLeftStart = false
      document.removeEventListener('mousemove', _this.dragMousemove)
    })

    //左上拉霸
    let leftTopDragbar = document.getElementById('leftTopDragbar')

    leftTopDragbar.addEventListener('mousedown', (e) => {
      _this.dragLeftTopStart = true
      _this.sumX = e.pageX
      _this.sumY = e.pageY

      document.addEventListener('mousemove', _this.dragMousemove)
    })

    document.addEventListener('mouseup', (e) => {
      if (_this.dragLeftTopStart) {
        _this.sumX = e.pageX - _this.sumX
        _this.sumY = e.pageY - _this.sumY

        _this.leftTopDragbarMove(e)
      }
      _this.dragLeftTopStart = false
      document.removeEventListener('mousemove', _this.dragMousemove)
    })
	}
}
</script>