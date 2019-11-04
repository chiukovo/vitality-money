<template lang='pug'>
  el-dialog(
      :visible.sync='visible'
      :fullscreen='dialogFullScreen'
      :before-close="handleClose"
      title='$store.state.itemName'
      :close-on-click-modal="false"
      width="80%"
    )
    .header-custom(slot='title')
      i.el-icon-info
      |  {{ typeof title == 'undefined' ? $store.state.itemName : title }}
      .el-dialog__button-group
        //- 點擊 dialog__screen, dialogFullScreen 變成 true
        button.el-dialog__headerbtn.el-dialog__screen(@click='dialogFullScreen == true')
          i.el-icon.el-icon-top-right(v-if='dialogFullScreen == false')
          i.el-icon.el-icon-bottom-left(v-else)
        //- 點擊 dialog__min, 給 .el-dialog class el-dialog-min
        button.el-dialog__headerbtn.el-dialog__min
          i.el-icon.el-icon-minus
    template
      client-only
        Kchart(v-if="clickType == 'kLine'")
        Chart(v-if="clickType == 'chart'")
        HistoryWinLoss(v-if="clickType == 'historyWinLoss'")
        UserDetail(v-if="clickType == 'userDetail'")
        HistoryPrices(v-if="clickType == 'historyPrices'")
</template>
<script>

import Kchart from "~/components/Kchart"
import Chart from "~/components/Chart"
import UserDetail from "~/components/UserDetail"
import HistoryWinLoss from "~/components/HistoryWinLoss"
import HistoryPrices from "~/components/HistoryPrices"

export default {
  props: ['clickType', 'visible', 'title'],
  data () {
    return {
      dialogFullScreen: false,
    }
  },
  components: {
    Kchart,
    Chart,
    UserDetail,
    HistoryWinLoss,
    HistoryPrices,
  },
  methods: {
    handleClose (done) {
      //clear data
      this.$store.commit('clearModalData')
      this.$emit('update:visible', false)
    }
  }
}
</script>