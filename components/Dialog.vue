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
        //-k線圖 版面選擇
        div(v-if="clickType == 'kLine' && !openKchart")
          .dialog__body.text__center
            label.radio
              input.radio__input(type="radio" v-model="kchartType" value="1")
              span.radio__label 本頁開啟
            label.radio
              input.radio__input(type="radio" v-model="kchartType" value="2")
              span.radio__label 另開視窗
          .dialog__footer
            button.button__light(@click="handleClose") 取消
            button.button(type='primary' @click="clickOpenKchart") 確認
        Kchart(v-if="openKchart" class="kchart")
        //-走勢圖 版面選擇
        div(v-if="clickType == 'chart' && !openChart")
          .dialog__body.text__center
            label.radio
              input.radio__input(type="radio" v-model="chartType" value="1")
              span.radio__label 本頁開啟
            label.radio
              input.radio__input(type="radio" v-model="chartType" value="2")
              span.radio__label 另開視窗
          .dialog__footer
            button.button__light(@click="handleClose") 取消
            button.button(type='primary' @click="clickOpenChart") 確認
        Chart(v-if="openChart" class="chart")
        HistoryWinLoss(v-if="clickType == 'historyWinLoss'")
        UserDetail(v-if="clickType == 'userDetail'")
        HistoryPrices(v-if="clickType == 'historyPrices'")
        StoredRecords(v-if="clickType == 'storedRecords'")
        ActionLog(v-if="clickType == 'actionLog'")
        ChangPassword(v-if="clickType == 'changePassword'")
        CustomItem(v-if="clickType == 'customItem'")
        //-版面選擇
        div(v-if="clickType == 'customMainStyle'")
          .dialog__body.text__center
            label.radio
              input.radio__input(type="radio" v-model="clickMainStyle" value="A")
              span.radio__label 版面A
            label.radio
              input.radio__input(type="radio" v-model="clickMainStyle" value="B")
              span.radio__label 版面B
          .dialog__footer
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
      clickMainStyle: 'A',
      kchartType: 1,
      chartType: 1,
      openKchart: false,
      openChart: false,
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
    clickOpenChart() {
      if (this.chartType == '1') {
        this.diaiogSize = '86%'
        this.openChart = true
      } else if (this.chartType == '2') {
        const name = this.$store.state.itemName
        const id = this.$store.state.clickItemId
        window.open('/chart?id=' + id + '&name=' + name)
        this.handleClose()
      }
    },
    clickOpenKchart() {
      if (this.kchartType == '1') {
        this.diaiogSize = '86%'
        this.openKchart = true
      } else if (this.kchartType == '2') {
        const name = this.$store.state.itemName
        const id = this.$store.state.clickItemId
        window.open('/kchart?id=' + id + '&name=' + name)
        this.handleClose()
      }
    },
    handleClose(done) {
      //clear data
      this.kchartType = 1
      this.chartType = 1
      this.openKchart = false
      this.openChart = false

      this.$store.commit('clearModalData')
      this.$emit('update:visible', false)
    },
    setMainStyle() {
      this.$store.commit('setMainStyle', this.clickMainStyle)
    }
  }
}
</script>

<style scoped>
  .kchart {
    height: 400px;
  }
  .chart {
    height: 400px;
  }
</style>