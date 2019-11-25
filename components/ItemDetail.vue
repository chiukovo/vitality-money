<template lang='pug'>
.itemDetail
  .itemDetail-wrap
    template(v-if='itemDetailTabShow == 1')
      .itemDetail-header
        .header__title 五檔揭示[{{ $store.state.itemName }}]
      .itemDetail-content
        .itemDetail__TotalTable
          client-only
            vxe-table(
              :data="$store.state.items0"
              :row-class-name="tableCenterHeightLight"
              max-width="100%"
              height="100%"
              size="mini"
              align="center"
              border
              auto-resize)
              vxe-table-column(title="比例")
                template(slot-scope='scope')
                  template(v-if="scope.row[0] == ''")
                  template(v-else)
                    .progress-bar.progress-bar__right
                      .progress-bar__inner(:style="'width: ' + scope.row[0] + '%'")
              vxe-table-column(title="委買" width="20%")
                template(slot-scope="scope") {{ scope.row[1] }}
              vxe-table-column(title="價格")
                template(slot-scope="scope") {{ scope.row[2] }}
              vxe-table-column(title="委賣" width="20%")
                template(slot-scope="scope") {{ scope.row[3] }}
              vxe-table-column(title="比例")
                template(slot-scope="scope")
                  template(v-if="scope.row[4] == ''")
                  template(v-else)
                    .progress-bar
                      .progress-bar__inner(:style="'width: ' + scope.row[4] + '%'")
        .itemDetail__Total
          .row
            .col {{ $store.state.fiveTotal.more }}
            .col 總計
            .col {{ $store.state.fiveTotal.nullNum }}
          .row
            .col.text-danger 多勢
            .col
              .progress-bar.progress-bar__total
                .progress-bar__inner(:style="'width: ' + $store.state.fiveTotal.morePercent + '%'")
            .col.text-success 空勢

    template(v-if='itemDetailTabShow == 2')
      .itemDetail-header
        .header__title 量價分佈[{{ $store.state.itemName }}]
      .itemDetail-content
        client-only
          vxe-table(
            :data="$store.state.items1"
            max-width="100%"
            height="100%"
            size="mini"
            align="center"
            border
            auto-resize)
            vxe-table-column(title='價格' width='30%')
              template(slot-scope='scope') {{ scope.row[1] }}
            vxe-table-column(title='' width='20%')
              template(slot-scope='scope' v-if="scope.row[2]") 現價
            vxe-table-column(title='比例' width='28%')
              template(slot-scope='scope')
                .progress-bar(v-if="scope.row[3] == ''")
                .progress-bar(v-else)
                  el-progress(
                    :text-inside='true'
                    :stroke-width='14'
                    :percentage='scope.row[3]'
                    :show-text='false'
                    status="success")
            vxe-table-column(title='口' width='22%')
              template(slot-scope='scope') {{ scope.row[0] }}
    template(v-if='itemDetailTabShow == 3')
      .itemDetail-header
        .header__title
          |報價明細[{{ $store.state.itemName }}]
          button.button(@click="openModal('historyPrices', '歷史報價查詢')") 查詢
          label.checkbox
            input.checkbox__input(type="checkbox" checked)
            span.checkbox__label 置底
      .itemDetail-content
        client-only
          vxe-table(
            :data="$store.state.items2"
            :cell-class-name="tableCellClassName"
            max-width="100%"
            height="100%"
            size="mini"
            align="center"
            border
            auto-resize)
            vxe-table-column(title='市場時間')
              template(slot-scope='scope') {{ scope.row['flocalTime'] }}
            vxe-table-column(title='口')
              template(slot-scope='scope') {{ scope.row['amount'] }}
            //- vxe-table-column(title='漲跌' width='28%')
              template(slot-scope='scope')
                .change-icon
                  .icon-arrow(:class="scope.row.change === 'up' ? 'icon-arrow-up' : 'icon-arrow-down'")
                span
            vxe-table-column(title='價格')
              template(slot-scope='scope') {{ scope.row['price'] }}
  .itemDetail-tabs.tabs-nav
    .tabs__item(@click='handleItemDetailTabs(1)' :class="{'is-active' : itemDetailTabShow == 1}") 五檔揭示
    .tabs__item(@click='handleItemDetailTabs(2)' :class="{'is-active' : itemDetailTabShow == 2}") 量價分佈
    .tabs__item(@click='handleItemDetailTabs(3)' :class="{'is-active' : itemDetailTabShow == 3}") 分價揭示
  Dialog(
    :click-type="dialog.clickType",
    :visible.sync="dialog.isOpen"
    :title="dialog.title")
</template>
<script>
import Dialog from "~/components/Dialog"

export default {
  components: {
    Dialog,
  },
  data() {
    return {
      itemDetailTabShow: 3,
      dialog: {
        clickType: '',
        isOpen: false,
        title: ''
      }
    }
  },
  methods: {
    handleItemDetailTabs(e) {
			this.itemDetailTabShow = e
    },
    tableCenterHeightLight({ row, rowIndex }) {
      // 在列表垂置置中的位置加入 border-tr
      if(rowIndex == 5) {
        return 'border-tr';
      }
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
    openModal (type, title) {
      this.dialog.clickType = type
      this.dialog.title = title
      this.dialog.isOpen = true
    }
  }
}
</script>