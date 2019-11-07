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
        History
        Operating
    #footer.footer
      Footer
</template>
<script>

import Header from "~/components/Header"
import MainItem from "~/components/MainItem"
import ItemDetail from "~/components/ItemDetail"
import UserInfo from "~/components/UserInfo"
import History from "~/components/History"
import Operating from "~/components/Operating"
import Footer from "~/components/Footer"
import { mapState } from 'vuex'
import { Loading } from 'element-ui';

export default {
	data () {
		return {
			mainStyles: {},
			itemDetailStyles: {},
			ItemDetailTable: 0,
			mainItemTable: 0
		}
	},
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
	},
	computed: {
	  websocketConnected () {
	    return this.$store.state.socket.isConnected
	  },
	  sendResult () {
	    return this.$store.state.socket.message
	  },
	  mainItem () {
	  	return this.$store.state.mainItem
	  }
	},
	watch: {
		mainItem () {
			this.resizeHeight()
		},
	  websocketConnected () {
	    let isConnected = this.$store.state.socket.isConnected

	    if (isConnected) {
	    	//商品列表
	      this.$socket.send(this.startToken())
	    }
	  },
	  sendResult () {
	    let source = this.$store.state.socket.message.data
	    let _this = this

	    if (typeof source !== "string") {
	    	console.log('websock fail')
	    	return;
	    }

	    let sourceFormat = source.split("&")

	    if (sourceFormat.length > 0) {
	    	sourceFormat.forEach(function(val) {
	    		let type = val.substring(0, 1)
	    		let res
	    		let result

	    		if (val.length > 1) {
	    			res = val.substring(2).split(",")
	    		}

	    		switch (type) {
	    			case "t":
	    				result = JSON.parse(val.substring(2))

	    				if (result['code'] > 0) {
	    					_this.$store.commit('setMainItem', result['data'])

	    					//取得自定義商品開關
	    					_this.$store.dispatch('CALL_MEMBER_CUSTOM_ITEM', {
	    						defaultData: result['data'],
	    						marketInfo: _this.marketInfo()
	    					})
	    				}

	    				//呼叫即時資料
	    				_this.$socket.send(_this.paramX())
	    				_this.$socket.send(_this.paramB())

	    				break
	    			case "d":
	    				//商品現價通知
	    				result = val.substring(2).split(";")

	    				if(result.length > 1) {
	    					_this.$store.commit('setUpdateMainItem', result)
	    				}

	    				break
	    			case "b": //註冊商品即時五檔報價
	    				result = val.substring(2).split(",")

	    				if(result.length > 1) {
	    					_this.$store.commit('setNowFiveMoney', result)
	    				}

	    				break
	    		}
	    	})
	    }
	  }
	}
}
</script>