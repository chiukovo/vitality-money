<template lang='pug'>
    .root
      #header
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
              pane(size="42")
                MainItem
              pane(size="42")
                span history
              pane(size="16")
                span order
      #footer
</template>

<script>

import { mapState } from 'vuex'
import { Splitpanes, Pane } from 'splitpanes'
import websocketService from '~/plugins/service/websocketService.js'
import UserInfo from '~/components/new/UserInfo'
import ItemDetail from '~/components/new/ItemDetail'
import MainItem from '~/components/new/MainItem'
import '@/assets/scss/style.scss'

export default {
  components: {
    Splitpanes,
    Pane,
    UserInfo,
    ItemDetail,
    MainItem
  },
  mixins: [websocketService],
  data () {
    return {
      tableData: [{
        th1: 'th1',
        th2: 'th2'
      },{
        th1: 'th1',
        th2: 'th2'
      },{
        th1: 'th1',
        th2: 'th2'
      },{
        th1: 'th1',
        th2: 'th2'
      },{
        th1: 'th1',
        th2: 'th2'
      },{
        th1: 'th1',
        th2: 'th2'
      }]
    }
  },
  mounted() {
    let _this = this
    this.checkLogin()
  }
}
</script>