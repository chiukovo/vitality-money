<template lang='pug'>
  el-dialog(
      :visible.sync='visible'
      :fullscreen='dialogFullScreen'
      :before-close='handleClose'
      title='$store.state.itemName'
      :close-on-click-modal='false'
      width='80%'
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
        ActionLog(v-if="clickType == 'actionLog'")
        ChangPassword(v-if="clickType == 'changePassword'")
        CustomItem(v-if="clickType == 'customItem'")
</template>
<script>

import Kchart from "~/components/Kchart"
import Chart from "~/components/Chart"
import UserDetail from "~/components/UserDetail"
import HistoryWinLoss from "~/components/HistoryWinLoss"
import HistoryPrices from "~/components/HistoryPrices"
import StoredRecords from "~/components/StoredRecords"
import ActionLog from "~/components/ActionLog"
import ChangPassword from "~/components/ChangPassword"
import CustomItem from "~/components/CustomItem"

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
    ActionLog,
    ChangPassword,
    CustomItem,
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