<template lang='pug'>
.root
  Chart
</template>

<script>
import { mapState } from 'vuex'
import websocketService from '~/plugins/service/websocketService.js'
import Chart from "~/components/Chart"
import '@/assets/sass/style.scss'
export default {
  components: {
    Chart,
  },
  mixins: [websocketService],
  head() {
    return {
      htmlAttrs: {
        class: 'gennki'
      }
    }
  },
  beforeMount() {
    this.checkDevice()
  },
  mounted() {
    let _this = this
    this.checkLogin()
  },
  methods: {
  }
}
</script>