<template lang='pug'>
  .container-fluid
    #header.header
    #main.main()
      #mainRight.main-right
        MainItem
</template>
<script>

import websocketService from '~/plugins/service/websocketService.js'
import MainItem from "~/components/MainItem"
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
			mainItemTable: '400px',
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
		MainItem,
	},
  beforeMount() {
  },
  computed: {
    items0() {
      return this.$store.state.items0
    }
  },
  watch: {
    items0(items0) {
      if (this.first) {

        this.first = false
      }
    }
  },
  mounted() {
    let _this = this
	},
  methods: {
  }
}
</script>