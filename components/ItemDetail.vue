<template lang='pug'>
#itemDetail.itemDetail(:style='this.$parent.itemDetailStyles')
  Dialog(
    :click-type="dialog.clickType",
    :visible.sync="dialog.isOpen"
    :title="dialog.title"
  )
  #itemDetailHeader
    .itemDetail-header(v-if="activeName === 'tabs1'" @click="clickType(0)")
      .header__title 五檔揭示[{{ $store.state.itemName }}]
    .itemDetail-header(v-if="activeName === 'tabs2'" @click="clickType(1)")
      .header__title 量價分佈[{{ $store.state.itemName }}]
    .itemDetail-header(v-if="activeName === 'tabs3'" @click="clickType(2)")
      .header__title 報價明細[{{ $store.state.itemName }}]
      el-button(@click="openModal('historyPrices', '歷史報價查詢')" type='primary' size='mini') 查詢
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
          :data="$store.state.items0"
          :row-class-name='tableCenterHeightLight'
          min-width='50%'
          width='50%'
          :height="$parent.itemDetailTableFive"
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
            .col {{ $store.state.fiveTotal.more }}
            .col 總計
            .col {{ $store.state.fiveTotal.nullNum }}
          .row
            .col.text-up 多勢
            .col.progress-bar
              el-progress(
                :text-inside='true'
                :stroke-width='10'
                :show-text='false'
                :percentage='$store.state.fiveTotal.morePercent'
                status='exception')
            .col.text-down 空勢

      //- tabs2
      el-tab-pane(label='量價分佈' name='tabs2')
        el-table.table.itemDetailTab2table(:data='$store.state.items1' min-width='100%' :height='$parent.itemDetailTable' border)
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
          :data='$store.state.items2'
          :height='$parent.itemDetailTable'
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
</template>
<script>

import Dialog from "~/components/Dialog"

export default {
  data () {
    return {
      dialog: {
        clickType: '',
        isOpen: false,
        title: '',
      },
      activeName: 'tabs1',
      num1: 1,
    }
  },
  components: {
    Dialog,
  },
  methods: {
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
      if(rowIndex == 5) {
        return 'border-tr';
      }
    },
    openModal (type, title) {
      this.dialog.clickType = type
      this.dialog.title = title
      this.dialog.isOpen = true
    }
  }
}
</script>