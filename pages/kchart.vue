<template lang='pug'>
.root
  .open.h-100
    Kchart
</template>

<script>
import { mapState } from 'vuex'
import websocketService from '~/plugins/service/websocketService.js'
import Kchart from "~/components/Kchart"
import '@/assets/sass/style.scss'
export default {
  components: {
    Kchart,
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