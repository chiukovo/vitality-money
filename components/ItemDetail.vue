<template lang='pug'>
#itemDetail.itemDetail(:style='this.$parent.itemDetailStyles')
  #itemDetailHeader
    .itemDetail-header(v-if="activeName === 'tabs1'" @click="clickType(0)")
      .header__title 五檔揭示[{{ $store.state.itemName }}]
    .itemDetail-header(v-if="activeName === 'tabs2'" @click="clickType(1)")
      .header__title 量價分佈[{{ $store.state.itemName }}]
      el-button(@click='dialogVisible2 = true' size='mini') 歷史
    .itemDetail-header(v-if="activeName === 'tabs3'" @click="clickType(2)")
      .header__title 報價明細[{{ $store.state.itemName }}]
      el-button(@click='dialogVisible3 = true' size='mini') 查詢
      el-checkbox(checked) 置底
  .itemDetail-content
    el-tabs(
      v-model='activeName'
      type='card'
      stretch=true
      tabPosition='bottom')
      //- tabs1
      el-tab-pane(label='五檔揭示' name='tabs1')
        el-table.table.itemDetailTab1table(
          :data="items0"
          :row-class-name='tableCenterHeightLight'
          min-width='50%'
          width='50%'
          border)
          el-table-column(label='比例' min-width='20%' align='center' )
            //- 當無資料時, 應不顯示
            //- 目前使用 css 隱藏 QAQ..
            template(slot-scope='scope')
              .progress-bar(v-if="scope.row[0] == ''")
              .progress-bar(v-else)
                el-progress(
                  :class="scope.row[0] === '' ? 'none' : ''"
                  :text-inside='true'
                  :stroke-width='14'
                  :percentage="scope.row[0]"
                  :show-text='false'
                  status='exception')
          el-table-column(label='委買' min-width='18%' align='center')
            template(slot-scope='scope') {{ scope.row[1] }}
          el-table-column(label='價格' min-width='24%' align='center')
            template(slot-scope='scope') {{ scope.row[2] }}
          el-table-column(label='委賣' min-width='18%' align='center')
            template(slot-scope='scope') {{ scope.row[3] }}
          el-table-column(label='比例' min-width='20%' align='center')
            template(slot-scope='scope')
              .progress-bar(v-if="scope.row[4] == ''")
              .progress-bar(v-else)
                el-progress(
                  :class="scope.row[4] === '' ? 'none' : ''"
                  :text-inside='true'
                  :stroke-width='14'
                  :percentage='scope.row[4]'
                  :show-text='false'
                  status="success")
        .itemDetailTabTotal
          .row
            .col {{ fiveTotal.more }}
            .col 總計
            .col {{ fiveTotal.nullNum }}
          .row
            .col.text-up 多勢
            .col.progress-bar
              el-progress(
                :text-inside='true'
                :stroke-width='10'
                :show-text='false'
                :percentage='fiveTotal.morePercent'
                status='exception')
            .col.text-down 空勢

      //- tabs2
      el-tab-pane(label='量價分佈' name='tabs2')
        el-table.table.itemDetailTab2table(:data='items1' min-width='100%' :height='this.$parent.itemDetailTable' border)
          el-table-column(label='價格' min-width='30%')
            template(slot-scope='scope') {{ scope.row[1] }}
          el-table-column(label='' min-width='20%')
            template(slot-scope='scope' v-if="scope.row[2]") 現價
          el-table-column(label='比例' min-width='28%')
            template(slot-scope='scope')
              .progress-bar(v-if="scope.row[3] == ''")
              .progress-bar(v-else)
                el-progress(
                  :text-inside='true'
                  :stroke-width='14'
                  :percentage='scope.row[3]'
                  :show-text='false'
                  status="success")
          el-table-column(label='口' min-width='22%')
            template(slot-scope='scope') {{ scope.row[0] }}

      //- tabs3
      el-tab-pane(label='分價揭示' name='tabs3')
        el-table.table(
          :data='items2'
          :height='this.$parent.itemDetailTable'
          :cell-class-name='tableCellClassName'
          min-width='100%'
          border)
          el-table-column(label='市場時間' min-width='30%')
            template(slot-scope='scope') {{ scope.row['flocalTime'] }}
          el-table-column(label='口' min-width='14%')
            template(slot-scope='scope') {{ scope.row['amount'] }}
          //-el-table-column(label='漲跌' min-width='28%')
            template(slot-scope='scope')
              .table-icon
                .icon-arrow(:class="scope.row.change === 'up' ? 'icon-arrow-up' : 'icon-arrow-down'")
              span
          el-table-column(label='價格' min-width='28%')
            template(slot-scope='scope') {{ scope.row['price'] }}
  el-dialog(
  :visible.sync='dialogVisible3'
  :modal='false'
  width="80%"
  title='歷史報價'
  v-dialogDrag)
    .header-custom(slot='title') 歷史報價
    template
      .itemDetai__history
        .itemDetailtabs__header
          .row
            .col
              el-form(ref='form' size='mini' :inline='true')
                el-form-item(label='商品: ' size='mini')
                  el-select(v-model='valueSelect1' placeholder='請選擇' style="width: 90px;")
                    el-option(label='加權指' value='val')
                el-form-item(label='日期:')
                  el-form-item
                    el-date-picker(type='date' placeholder='日期' v-model='valueDate' style="width: 130px;")
                el-form-item(label='條件: ' size='mini')
                  el-select(v-model='valueSelect2' placeholder='請選擇' style="width: 90px;")
                    el-option(label='時間' value='val')
                el-button(size='mini') 送出
          .row
            .col
              el-form(ref='form' size='mini' :inline='true')
                //- 條件篩選: 時間
                //- endTime placeholder 預設為當前時間
                //- 範圍為 9:00 - 24:00
                el-form-item(label='時間: ' size='mini')
                  el-time-picker(placeholder='9:00:00' v-model='startTime' :picker-options="{selectableRange: '9:00:00 - 20:30:00'}" style="width: 132px;")
                  el-time-picker(placeholder='13:30:05' v-model='endTime' :picker-options="{selectableRange: '9:00:00 - 24:00:00'}" style="width: 132px;")
                //- 條件篩選: 價錢
                //- el-form-item(label='價錢: ' size='mini')
                  el-input-number(v-model='num1' controls-position='right' :min='1' :max='10')
                //- 條件篩選: 次序
                //- 請把第一個條件時間也開啟
                el-form-item(label='序號: ' size='mini')
                  el-input-number(v-model='num1' controls-position='right' :min='1' :max='10')
          .row
            .col
              //- 很奇怪的顯示? 切換時間也不會換? 不知道幹嘛用的
              el-divider(content-position='center') 時間: 2019-10-28 09:00:00 ~ 2019-10-28 13:30:05
        .itemDetailtabs__content
          .row
            .col-6
              el-table.table(
                :data='items2'
                min-width='100%'
                border)
                el-table-column(prop='data1' label='市場時間' min-width='30%')
                el-table-column(prop='data2' label='口' min-width='14%')
                el-table-column(prop='data3' label='價格' min-width='28%')
                el-table-column(prop='data4' label='次序' min-width='28%')
            .col-6
              el-table.table(
                :data='items2'
                min-width='100%'
                border)
                el-table-column(prop='data1' label='市場時間' min-width='30%')
                el-table-column(prop='data2' label='口' min-width='14%')
                el-table-column(prop='data3' label='價格' min-width='28%')
                el-table-column(prop='data4' label='次序' min-width='28%')
  el-dialog(
  :visible.sync='dialogVisible2'
  :modal='false'
  width="80%"
  title='量價分佈歷史查詢'
  v-dialogDrag)
    .header-custom(slot='title') 歷史報價
    template
      .itemDetai__history
        .itemDetailtabs__header
          .row
            .col-lg-auto
              el-form(ref='form' size='mini' :inline='true')
                el-form-item(label='商品: ' size='mini')
                  el-select(v-model='valueSelect1' placeholder='請選擇' style="width: 90px;")
                    el-option(label='加權指' value='val')
                el-form-item(label='開始日期:')
                  el-form-item
                    el-date-picker(type='date' placeholder='開始日期' v-model='valueDateInterval[0]' style="width: 130px;")
                el-form-item(label='結束日期:')
                  el-form-item
                    el-date-picker(type='date' placeholder='結束日期' v-model='valueDateInterval[1]' style="width: 130px;")
                el-button(size='mini') 送出
            .col-lg-auto
              span.label 快速查詢
              el-button(size='mini') 今日
              el-button(size='mini') 昨日
              el-button(size='mini') 本週
              el-button(size='mini') 上週
              el-button(size='mini') 上月
        .itemDetailtabs__content
          .row
            .col
              |table
</template>
<script>

import { mapState } from 'vuex';

export default {
  data () {
    return {
      items0: [], //五檔揭示
      items1: [], //量價分布
      items2: [], //分價揭示
      fiveTotal: {
        more: 0,
        morePercent: 0,
        nullNum: 0,
      },
      type: 0,
      borderName: 'border border-primary',
      activeName: 'tabs1',
      dialogVisible2: false,
      dialogVisible3: false,
      options: [{
        value: '选项1',
        label: '黄金糕'
      }],
      valueDate: new Date(2000, 10, 10, 10, 10),
      valueSelect1: 'val',
      valueSelect2: 'val',
      startTime: new Date(2016, 9, 10, 18, 40),
      endTime: new Date(2016, 9, 10, 18, 40),
      num1: 1,
      valueDateInterval: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 10, 10, 10)]
    }
  },
  computed: mapState([
    'historyPrice',
    'nowFiveMoney',
    'nowVolumeMoney',
    'clickItemId',
  ]),
  watch: {
    historyPrice (history) {
      let itemId = this.$store.state.clickItemId
      this.itemChange(history[itemId])
    },
    nowVolumeMoney (money) {
      let itemId = this.$store.state.clickItemId
      this.volumeChange(money[itemId])
    },
    nowFiveMoney (fiveData) {
      let itemId = this.$store.state.clickItemId

      this.fiveItemChange(fiveData[itemId])
    },
    clickItemId (itemId) {
      this.fiveTotal = {
        more: 0,
        morePercent: 0,
        nullNum: 0,
      }

      let history = this.$store.state.historyPrice[itemId]
      let fiveData = this.$store.state.nowFiveMoney[itemId]
      let volumeMoney = this.$store.state.nowVolumeMoney[itemId]
      this.items0 = []
      this.items1 = []
      this.items2 = []

      this.itemChange(history)
      this.fiveItemChange(fiveData)
      this.volumeChange(volumeMoney)
    }
  },
  methods: {
    fiveItemChange(fiveData) {
      let _this = this

      if (typeof fiveData == 'undefined') {
        this.items0 = []
        return
      }

      if (fiveData.length > 0) {
        this.items0 = fiveData

        //計算total
        this.items0.forEach(function(val) {
          if (val[1] != '') {
            _this.fiveTotal.more += parseInt(val[1])
          }

          if (val[3] != '') {
            _this.fiveTotal.nullNum += parseInt(val[3])
          }
        })

        //多勢 %
        _this.fiveTotal.morePercent = parseInt(100 / (_this.fiveTotal.more + _this.fiveTotal.nullNum) * _this.fiveTotal.more)
      }
    },
    volumeChange(money) {
      if (typeof money == 'undefined') {
        this.items1 = []
        return
      }

      if (money.length > 0) {
        this.items1 = money
      }
    },
    itemChange(history) {
      if (typeof history == 'undefined') {
        this.items2 = []
        return
      }

      if (history.length > 0) {
        this.items2 = history
      }
    },
    clickType (type) {
      this.type = type
    },
    tableCellClassName({ row, column, columnIndex }) {
      if(columnIndex >= 2) {
        if(row.change == 'up') {
          return 'text-up';
        } else {
          return 'text-down';
        }
      }
    },
    tableCenterHeightLight({ row, rowIndex }) {
      // 在列表垂置置中的位置加入 border-tr
      if(rowIndex == 4) {
        return 'border-tr';
      }
    }
  }
}
</script>