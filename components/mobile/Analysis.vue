<template lang='pug'>
  .main
    //-更多下拉框
    ul.moreSelect(v-if="$parent.more")
      li(@click="closeMore(1)") 走勢圖表
      li(@click="closeMore(2)") K線圖表
      li(@click="closeMore(3)") 五檔數據
      li(@click="closeMore(4)") 量價分布
      li(@click="closeMore(5)") 即時報價
      li.close(@click="closeMore('')") 取消

    //-走勢圖表
    div(v-if="type == 1" class="h-100")
      Chart(theme="black" style="height: calc(100% - 280px);")
      .area(style="height: 280px;")
        div(v-swiper:myswiper='swiperOption')
          .swiper-wrapper
            .swiper-slide
              .area
                ul.area-analysis-list
                  li
                    span.label 成交
                    span(:class="nowMainItem.color") {{ nowMainItem.newest_price }}
                  li
                    span.label 漲跌
                    span(:class="nowMainItem.color") {{ nowMainItem.gain }}
                  li
                    span.label 漲幅
                    span(:class="nowMainItem.color") {{ nowMainItem.gain_percent }}%
                  li
                    span.label 買進
                    span(:class="nowMainItem.color") {{ nowMainItem.bp_price }}
                  li
                    span.label 賣出
                    span(:class="nowMainItem.color") {{ nowMainItem.sp_price }}
                  li
                    span.label 總量
                    span(:class="nowMainItem.color") {{ nowMainItem.total_qty }}
                  li
                    span.label 開盤
                    span(:class="nowMainItem.color") {{ nowMainItem.open_price }}
                  li
                    span.label 最高
                    span(:class="nowMainItem.color") {{ nowMainItem.highest_price }}
                  li
                    span.label 最低
                    span(:class="nowMainItem.color") {{ nowMainItem.lowest_price }}
                  li
                    span.label 昨收
                    span(:class="nowMainItem.color") {{ nowMainItem.yesterday_last_price }}
                  li
                    span.label 昨結
                    span(:class="nowMainItem.color") {{ nowMainItem.yesterday_close_price }}
            .swiper-slide
              .area(style="height: 230px;")
                table.custom__table
                  thead.thead
                    tr
                      th 市場時間
                      th 口
                      th 漲跌
                      th 價格
                  tbody.tbody(@scroll="tbodyScroll($event)")
                    tr(v-for="row in items2" @click="trClick($event)")
                      td {{ row.flocalTime }}
                      td {{ row.amount }}
                      td
                        .change-icon
                          .icon-arrow(:class="row['gain'] >= 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
                        span {{ row['gain'] }}
                      td {{ row.price }}
                    tr(class="non-data" v-if="items2.length == 0")
                      td 無資料
            .swiper-slide
              .area
                //- 五檔揭示
                table.table.progress-table
                  thead
                    tr
                      th(colspan='2'): .cell.text__right 委買
                      th(colspan='2'): .cell.text__center 價格
                      th(colspan='2'): .cell.text__left 委賣
                  tbody
                    tr(v-for="(val, key) in $store.state.items0" v-if="key <= 4")
                      td(style='width:20%'): .cell
                        .progress-bar.progress-bar__right
                          .progress-bar__inner(:style="'width: ' + $store.state.items0[key + 6][0] + '%'")
                      td: .cell.text__center {{ $store.state.items0[key + 6][1] }}
                      td: .cell.text__center.text__danger {{ $store.state.items0[key + 6][2] }}
                      td: .cell.text__center.text__success {{ val[2] }}
                      td: .cell.text__center {{ val[3] }}
                      td(style='width:20%'): .cell
                        .progress-bar
                          .progress-bar__inner(:style="'width: ' + val[4] + '%'")
                .itemDetail__Total.text__center
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
            .swiper-slide
              .area(style="height: 230px;")
                //- 量價分佈
                table.custom__table
                  thead.thead
                    tr
                      th(width='30%') 價格
                      th(width='20%')
                      th(width='28%') 比例
                      th(width='22%') 口
                  tbody.tbody(@scroll="tbodyScroll($event)")
                    tr(v-for="row in items1" @click="trClick($event)")
                      td(width='30%') {{ row.price }}
                      td(width='20%')
                        span(v-if="row['isNow']") 現價
                      td(width='28%')
                        div(v-if="row['percent'] == ''")
                        div(v-else)
                          .progress-bar
                            .progress-bar__inner(:style="'width: ' + row['percent'] + '%'")
                      td(width='22%') {{ row.amount }}
                    tr(class="non-data" v-if="items1.length == 0")
                      td 無資料
          .swiper-pagination
    //-K線圖表
    div(v-if="type == 2" style="height: calc(100% - 50px)")
      Kchart
    //-五檔數據
    div(v-if="type == 3" class="h-100")
      .area
        //- 五檔揭示
        table.table.progress-table
          thead
            tr
              th(colspan='2'): .cell.text__right 委買
              th(colspan='2'): .cell.text__center 價格
              th(colspan='2'): .cell.text__left 委賣
          tbody
            tr(v-for="(val, key) in $store.state.items0" v-if="key <= 4")
              td(style='width:20%'): .cell
                .progress-bar.progress-bar__right
                  .progress-bar__inner(:style="'width: ' + $store.state.items0[key + 6][0] + '%'")
              td: .cell.text__center {{ $store.state.items0[key + 6][1] }}
              td: .cell.text__center.text__danger {{ $store.state.items0[key + 6][2] }}
              td: .cell.text__center.text__success {{ val[2] }}
              td: .cell.text__center {{ val[3] }}
              td(style='width:20%'): .cell
                .progress-bar
                  .progress-bar__inner(:style="'width: ' + val[4] + '%'")
        .itemDetail__Total.text__center
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
    //-量價分布
    div(v-if="type == 4" class="h-100")
      table.custom__table
        thead.thead
          tr
            th(width='30%') 價格
            th(width='20%')
            th(width='28%') 比例
            th(width='22%') 口
        tbody.tbody(@scroll="tbodyScroll($event)")
          tr(v-for="row in items1" @click="trClick($event)")
            td(width='30%') {{ row.price }}
            td(width='20%')
              span(v-if="row['isNow']") 現價
            td(width='28%')
              div(v-if="row['percent'] == ''")
              div(v-else)
                .progress-bar
                  .progress-bar__inner(:style="'width: ' + row['percent'] + '%'")
            td(width='22%') {{ row.amount }}
    //-即時報價
    div(v-if="type == 5" class="h-100")
      table.custom__table
        thead.thead
          tr
            th 市場時間
            th 口
            th 漲跌
            th 價格
        tbody.tbody(@scroll="tbodyScroll($event)")
          tr(v-for="row in items2" @click="trClick($event)")
            td {{ row.flocalTime }}
            td {{ row.amount }}
            td
              .change-icon
                .icon-arrow(:class="row['gain'] >= 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
              span {{ row['gain'] }}
            td {{ row.price }}
          tr(class="non-data" v-if="items2.length == 0")
            td 無資料
</template>

<script>

import { mapState } from 'vuex';
import Vue from 'vue';
import 'swiper/dist/css/swiper.css'
import Kchart from "~/components/Kchart"
import Chart from "~/components/Chart"

if (process.browser) {
  const VueAwesomeSwiper = require('vue-awesome-swiper/dist/ssr')
  Vue.use(VueAwesomeSwiper)
}

export default {
  name: 'app',
  data() {
    return {
      swiperOption: {
        scrollbar: {
          el: '.swiper-scrollbar'
        },
        autoHeight: true,
        mousewheel: true
      },
      type: 1,
    }
  },
  components: {
    Kchart,
    Chart,
  },
  methods: {
    closeMore(type) {
      if (type != '') {
        this.type = type
      }

      this.$emit('close-more', false)
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
  },
  computed: mapState([
    'nowMainItem',
    'items2',
    'items1',
    'items0',
  ]),
  watch: {
  },
  mounted() {
    this.computedTableContent()
  },
}
</script>