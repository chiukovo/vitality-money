<template lang='pug'>
.itemDetail
  .itemDetail-wrap
    div(v-show='itemDetailTabShow == 1' class="h-100")
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
            .col.text__danger 多勢
            .col
              .progress-bar.progress-bar__total
                .progress-bar__inner(:style="'width: ' + $store.state.fiveTotal.morePercent + '%'")
            .col.text__success 空勢
    div(v-show='itemDetailTabShow == 2' class="h-100")
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
            vxe-table-column(field="price" title='價格' width='30%')
            vxe-table-column(width='20%')
              template(slot-scope='scope' v-if="scope.row['isNow']") 現價
            vxe-table-column(title='比例' width='28%')
              template(slot-scope='scope')
                template(v-if="scope.row['percent'] == ''")
                template(v-else)
                  .progress-bar
                    .progress-bar__inner(:style="'width: ' + scope.row['percent'] + '%'")
            vxe-table-column(field="amount" title='口' width='22%')
    div(v-show='itemDetailTabShow == 3' class="h-100")
      .itemDetail-header
        .header__title
          |報價明細[{{ $store.state.itemName }}]
          button.button(@click="openModal('historyPrices', '歷史報價查詢')") 查詢
          label.checkbox
            input.checkbox__input(type="checkbox" v-model="autoScroll")
            span.checkbox__label 置底
      .itemDetail-content
        client-only
          vxe-table(
            ref="xTable"
            :data="items2"
            :cell-class-name="tableCellClassName"
            max-width="100%"
            height="100%"
            size="mini"
            align="center"
            border
            auto-resize)
            vxe-table-column(field="flocalTime" title='市場時間' width='30%')
            vxe-table-column(field="amount" title='口' width='14%')
            vxe-table-column(title='漲跌' width='28%')
              template(slot-scope='scope')
                .change-icon
                  .icon-arrow(:class="scope.row['gain'] >= 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
                span {{ scope.row['gain'] }}
            vxe-table-column(field="price" title='價格' width='28%')
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

import { mapState } from 'vuex'
import Dialog from "~/components/Dialog"

export default {
  components: {
    Dialog,
  },
  data() {
    return {
      itemDetailTabShow: 3,
      autoScroll: true,
      dialog: {
        clickType: '',
        isOpen: false,
        title: ''
      }
    }
  },
  computed: mapState([
    'items2',
    'clickItemId',
  ]),
  watch: {
    clickItemId() {
      this.setAutoScroll()
    },
    items2(items) {
      this.setAutoScroll()
    }
  },
  methods: {
    setAutoScroll() {
      if (this.autoScroll) {
        //自動置底
        this.$refs.xTable.scrollTo(0, 99999)
      }
    },
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
          return 'text__success';
        } else {
          return 'text__danger';
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