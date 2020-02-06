<template lang='pug'>
  el-dialog(
    :visible.sync='visible'
    :fullscreen='dialogFullScreen'
    :before-close='handleClose'
    :close-on-click-modal='false'
    :width='diaiogSize'
    :height='diaiogHeight'
    :modal='false')
    .header-custom(slot='title')
      i.el-icon-info
      |  {{ typeof title == 'undefined' ? $store.state.itemName : title }}
      div(class="resize-group" v-if="openKchart || openChart")
        i(class="el-icon-circle-plus-outline" @click="reSize('+')" style="padding-right: 5px")
        i(class="el-icon-remove-outline" @click="reSize('-')")
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
        Chart(v-if="openChart" class="chart" ref="chart")
        HistoryWinLoss(v-if="clickType == 'historyWinLoss'")
        UserDetail(v-if="clickType == 'userDetail'" :itemId="itemId")
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
  props: ['clickType', 'visible', 'title', 'size', 'itemId'],
  data () {
    return {
      dialogFullScreen: false,
      diaiogSize: '86%',
      diaiogHeight: '100%',
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
    mainStyle: state => state.localStorage.customSetting.mainStyle,
    chartId: 'chartId'
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
    reSize(type) {
      let size = this.diaiogSize
      let sizeNumber = size.split('%')[0]
      let last = size.substr(-1, 1)
      let nowHeight = this.$el.querySelector('.el-dialog__body')

      if (type == '+') {
        if (sizeNumber >= 100) {
          return
        }

        if (last == '%') {
          size = parseInt(sizeNumber) + 5
        }

        nowHeight.style.height = parseInt(nowHeight.offsetHeight) + 50 + 'px'
      } else {
        if (sizeNumber <= 60) {
          return
        }

        if (last == '%') {
          size = parseInt(sizeNumber) - 5
        }

        nowHeight.style.height = parseInt(nowHeight.offsetHeight) - 50 + 'px'
      }

      if (this.openKchart) {
        this.$el.querySelector('.kchart').style.height = '100%'
      }

      if (this.openChart) {
        this.$el.querySelector('.chart').style.height = '100%'
        const el = document
        const event = document.createEvent('HTMLEvents')
        event.initEvent('resize', true, false)
        el.dispatchEvent(event)
      }

      if (size > 100) {
        size = 100
      }

      if (size < 60) {
        size = 60
      }

      this.diaiogSize = size + '%'
    },
    clickOpenChart() {
      if (this.chartType == '1') {
        this.diaiogSize = '86%'
        this.openChart = true
        this.$el.querySelector('.el-dialog__body').style.height = '400px'
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
        this.$el.querySelector('.el-dialog__body').style.height = '400px'
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

      this.$el.querySelector('.el-dialog__body').style.height = ''
    },
    setMainStyle() {
      this.$store.commit('setMainStyle', this.clickMainStyle)
    }
  }
}
</script>