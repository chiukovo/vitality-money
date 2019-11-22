<template lang='pug'>
    .root
      #header
        Header
      #main
        splitpanes(class="default-theme")
          pane(size="18")
            splitpanes(horizontal)
              pane(size="40")
                UserInfo
              pane(size="60")
                ItemDetail
          pane(size="82")
            splitpanes(horizontal)
              pane(size="44")
                MainItem
              pane(size="44")
                History
              pane(size="12")
                Operating
      #footer
        Footer
</template>

<script>

import { mapState } from 'vuex'
import { Splitpanes, Pane } from 'splitpanes'
import websocketService from '~/plugins/service/websocketService.js'
import Header from '~/components/new/Header'
import Footer from '~/components/new/Footer'
import UserInfo from '~/components/new/UserInfo'
import ItemDetail from '~/components/new/ItemDetail'
import MainItem from '~/components/new/MainItem'
import History from '~/components/new/History'
import Operating from '~/components/new/Operating'
import '@/assets/scss/style.scss'

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
  mounted() {
    let _this = this
    this.checkLogin()
  }
}
</script>