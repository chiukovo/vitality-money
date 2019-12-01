<template lang='pug'>
  .main
    highcharts(v-if="items.length > 0" :options="options" style="height: 360px")
    div(v-loading="loading" v-else style="height: 360px")
    .area(style="height: calc(100% - 420px); overflow-y: scroll;")
      client-only
        div(v-swiper:myswiper='swiperOption')
          .swiper-wrapper
            .swiper-slide
              .area
                ul.area-analysis-list
                  li
                    span.label 成交
                    span(:class="nowMainItem.color") {{ nowMainItem.newest_price }}
                  li
                    span.label 買進
                    span(:class="nowMainItem.color") {{ nowMainItem.bp_price }}
                  li
                    span.label 賣出
                    span(:class="nowMainItem.color") {{ nowMainItem.sp_price }}
                  li
                    span.label 漲跌
                    span(:class="nowMainItem.color") {{ nowMainItem.gain }}
                  li
                    span.label 漲幅
                    span(:class="nowMainItem.color") {{ nowMainItem.gain_percent }}%
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
              .area
                //- 分價揭示
                client-only
                  vxe-table(
                    :data="$store.state.items2"
                    :cell-class-name="tableCellClassName"
                    max-width="100%"
                    max-height="100%"
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
              .area
                //- 量價分佈
                client-only
                  vxe-table(
                    :data="$store.state.items1"
                    max-width="100%"
                    max-height="100%"
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
          .swiper-pagination
</template>

<script>

import { mapState } from 'vuex';
import Vue from 'vue';
import 'swiper/dist/css/swiper.css'
import HighchartsVue from "highcharts-vue"
import darkUnica from "highcharts/themes/dark-unica"
import Highcharts from "highcharts"
import stockInit from 'highcharts/modules/stock'
import mapInit from 'highcharts/modules/map'

if (typeof Highcharts === 'object') {
  Highcharts.setOptions({
    global: {
      useUTC: false
    }
  })

  darkUnica(Highcharts)
  stockInit(Highcharts)
  mapInit(Highcharts)
}

Vue.use(HighchartsVue)

if (process.browser) {
  const VueAwesomeSwiper = require('vue-awesome-swiper/dist/ssr')
  Vue.use(VueAwesomeSwiper)
}

export default {
  name: 'app',
  data() {
    return {
      items: [],
      options: {},
      loading: true,
      swiperOption: {
        pagination: {
          el: '.swiper-pagination'
        },
      }
    }
  },
  methods: {
    tableCellClassName({ row, column, columnIndex }) {
      if(columnIndex >= 2) {
        if(row.change == 'up') {
          return 'text__up';
        } else {
          return 'text__down';
        }
      }
    },
  },
  computed: mapState([
    'chartData',
    'nowMainItem',
  ]),
  watch: {
    chartData (res) {
      const _this = this
      let name = this.$store.state.itemName
      this.items = JSON.parse(JSON.stringify(res))

      this.options = {
        chart: {
          marginRight: 50,
          events: {
            load: function () {
              //load over
              this.loading = false
            }
          }
        },
        title: {
          text: null
        },
        plotOptions: {
          series: {
            shadow: false,
            borderWidth: 0,
            dataLabels: {
              align:'right',
              x:25,
              y:10,
            }
          }
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 150
        },
        yAxis: {
          title: {
            text: null
          }
        },
        chart: {
          type: 'spline',
          marginRight: 10,
        },
        series: [{
          name: name,
          tooltip: {
          },
          data: this.items,
        }]
      }
    }
  },
  mounted () {
  },
}
</script>