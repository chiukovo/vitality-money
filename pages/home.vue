<template lang='pug'>
.root
  #header
    Header
  #main
    splitpanes(class="default-theme")
      pane(size="18")
        splitpanes(horizontal)
          pane(size="33")
            UserInfo
          pane(size="67")
            ItemDetail
      pane(size="82")
        splitpanes(horizontal)
          pane(size="42")
            MainItem
          pane(size="44")
            History
          pane(size="14")
            Operating
  #footer
    Footer
</template>

<script>

import { mapState } from 'vuex'
import { Splitpanes, Pane } from 'splitpanes'
import websocketService from '~/plugins/service/websocketService.js'
import Header from '~/components/Header'
import Footer from '~/components/Footer'
import UserInfo from '~/components/UserInfo'
import ItemDetail from '~/components/ItemDetail'
import MainItem from '~/components/MainItem'
import History from '~/components/History'
import Operating from '~/components/Operating'
import '@/assets/scss/theme1.scss'

export default {
  components: {
    Splitpanes,
    Pane,
    Header,
    Footer,
    UserInfo,
    ItemDetail,
    MainItem,
    History,
    Operating
  },
  mixins: [websocketService],
  head() {
    return {
      htmlAttrs: {
         class: this.$store.state.customStyle.htmlClass + ' login'
      }
    }
  },
  mounted() {
    let _this = this
    this.checkLogin()
  }
}
</script>