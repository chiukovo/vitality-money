<template lang='pug'>
    .root
      #header
      #main
        splitpanes(class="default-theme")
          pane(size="14")
            splitpanes(horizontal)
              pane(size="30")
                vxe-table(:data="tableData" size="mini" max-height="100%" max-width="100%")
                  vxe-table-column(title='th1' field='th1' )
                  vxe-table-column(title='th2' field='th2')
              pane(size="70")
                span left down
          pane(size="86")
            splitpanes(horizontal)
              pane(size="42")
                span mainitem
              pane(size="42")
                span history
              pane(size="16")
                span order
      #footer
</template>

<script>

import { mapState } from 'vuex'
import { Splitpanes, Pane } from 'splitpanes'

import '@/assets/scss/style.scss'

export default {
  components: { Splitpanes, Pane },
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
  }
}
</script>