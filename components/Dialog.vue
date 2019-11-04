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
    template
      client-only
        Kchart(v-if="clickType == 'kLine'")
        Chart(v-if="clickType == 'chart'")
        HistoryWinLoss(v-if="clickType == 'historyWinLoss'")
        UserDetail(v-if="clickType == 'userDetail'")
        HistoryPrices(v-if="clickType == 'historyPrices'")
        StoredRecords(v-if="clickType == 'storedRecords'")
</template>
<script>

import Kchart from "~/components/Kchart"
import Chart from "~/components/Chart"
import UserDetail from "~/components/UserDetail"
import HistoryWinLoss from "~/components/HistoryWinLoss"
import HistoryPrices from "~/components/HistoryPrices"
import StoredRecords from "~/components/StoredRecords"

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
    StoredRecords,
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