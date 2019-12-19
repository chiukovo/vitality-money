<template lang='pug'>
  el-dialog(
      :visible.sync='visible'
      :fullscreen='dialogFullScreen'
      :before-close='handleClose'
      :close-on-click-modal='false'
      :width='diaiogSize'
      :modal='false'
      title='$store.state.itemName'
      v-dialogDrag)
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
        //-版面選擇
        div(v-if="clickType == 'customMainStyle'")
          label.radio
            input.radio__input(type="radio" v-model="clickMainStyle" value="A")
            span.radio__label 版面A
          label.radio
            input.radio__input(type="radio" v-model="clickMainStyle" value="B")
            span.radio__label 版面B
          button.button__light(@click="handleClose") 取消
          button.button(type='primary' @click="setMainStyle") 確認
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
import { mapState } from 'vuex'

export default {
  props: ['clickType', 'visible', 'title', 'size'],
  data () {
    return {
      dialogFullScreen: false,
      diaiogSize: '86%',
      clickMainStyle: 'A'
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
  computed: mapState({
    mainStyle: state => state.localStorage.customSetting.mainStyle
  }),
  watch: {
    visible(isOpen) {
      if (isOpen) {
        if (this.size != '' && typeof this.size != 'undefined') {
          this.diaiogSize = this.size
        } else {
          this.diaiogSize = '86%'
        }
      }
    }
  },
  mounted() {
    this.clickMainStyle = this.mainStyle
  },
  methods: {
    handleClose (done) {
      //clear data
      this.$store.commit('clearModalData')
      this.$emit('update:visible', false)
    },
    setMainStyle() {
      this.$store.commit('setMainStyle', this.clickMainStyle)
    }
  }
}
</script>