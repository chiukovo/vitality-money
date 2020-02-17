<template lang='pug'>
.itemDetail
  .itemDetail-wrap
    div(v-show='itemDetailTabShow == 1' class="h-100")
      .itemDetail-header
        .header__title 五檔揭示[{{ $store.state.itemName }}]
      .itemDetail-content
        .itemDetail__TotalTable
          table.custom__table.itemDetail_FirstTable
            thead
              tr
                th 比例
                th 委買
                th 價格
                th 委賣
                th 比例
            tbody
              tr(v-for="row in items0")
                td
                  div(v-if="row[0] == ''")
                  div(v-else)
                    .progress-bar.progress-bar__right
                      .progress-bar__inner(:style="'width: ' + row[0] + '%'")
                td {{ row[1] }}
                td {{ row[2] }}
                td {{ row[3] }}
                td
                  div(v-if="row[4] == ''")
                  div(v-else)
                    .progress-bar
                      .progress-bar__inner(:style="'width: ' + row[4] + '%'")
              tr(class="non-data" v-if="items0.length == 0")
                td 無資料
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
        table.custom__table.custom__table.itemDetail_secTable
          thead
            tr
              th 價格
              th(style="width: 40px")
              th 比例
              th(style="width: 40px") 口
          tbody
            tr(v-for="row in items1")
              td {{ row.price }}
              td(style="width: 40px")
                span(v-if="row['isNow']") 現價
              td
                div(v-if="row['percent'] == ''")
                div(v-else)
                  .progress-bar
                    .progress-bar__inner(:style="'width: ' + row['percent'] + '%'")
              td(style="width: 40px") {{ row.amount }}
            tr(class="non-data" v-if="items1.length == 0")
              td 無資料
    div(v-show='itemDetailTabShow == 3' class="h-100")
      .itemDetail-header
        .header__title
          |報價明細[{{ $store.state.itemName }}]
          button.button(@click="openModal('historyPrices', '歷史報價查詢')") 查詢
          label.checkbox
            input.checkbox__input(type="checkbox" v-model="autoScroll")
            span.checkbox__label 置底
      #item2.itemDetail-content
        table.custom__table
          thead.thead
            tr
              th(style="width: 64px") 市場時間
              th(style="width: 40px") 口
              th 漲跌
              th 價格
          tbody.tbody(@scroll="tbodyScroll($event)")
            tr(v-for="row in items2" @click="trClick($event)")
              td(style="width: 64px")  {{ row.flocalTime }}
              td(style="width: 40px") {{ row.amount }}
              td( :class="nowMainItem.computed_color")
                .change-icon
                  .icon-arrow(:class="row['gain'] >= 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
                span {{ row['gain'] }}
              td(:class="nowMainItem.computed_color") {{ row.price }}
            tr(class="non-data" v-if="items2.length == 0")
              td 無資料
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
    'items0',
    'items1',
    'items2',
    'clickItemId',
    'nowMainItem',
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
         document.querySelector('#item2 tbody').scrollTop = 9999
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