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
    div(v-show="type == 1" class="h-100")
      highcharts(v-if="chart.items.length > 0" :options="chart.options" style="height: 210px")
      div(v-loading="loading" v-else style="height: 100%")
      .area(style="height: calc(100% - 270px); overflow: scroll;")
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
                      width="100%"
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
                      width="100%"
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
            .swiper-pagination
    //-K線圖表
    div(v-show="type == 2" class="h-100")
      highcharts(v-if="kChart.ohlcv.length > 0" :constructor-type="'stockChart'" :options="kChart.stockOptions")
    //-五檔數據
    div(v-show="type == 3" class="h-100")
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
    div(v-show="type == 4" class="h-100")
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
    //-即時報價
    div(v-show="type == 5" class="h-100")
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
      chart: {
        items: [],
        options: {},
      },
      kChart: {
        ohlcv: [],
        stockOptions: {},
      },
      loading: true,
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
    'kLineData',
  ]),
  watch: {
    kLineData(res) {
      let name = this.$store.state.itemName
      let _this = this
      let volume = []

      this.kChart.ohlcv = JSON.parse(JSON.stringify(res))
      this.kChart.ohlcv.forEach(function(val) {
        volume.push([
          val[0],
          val[5]
        ])
      })

      this.kChart.stockOptions = {
        chart: {
          events: {
            load: function () {
              //load over
              this.loading = false
            }
          }
        },
        rangeSelector: {
          selected: 1,
          buttons: [
          {
            type: 'minute',
            count: 20,
            text: '分'
          },
          {
            type: 'hour',
            text: '時'
          },
          {
            type: 'day',
            text: '天'
          },
          {
            type: 'week',
            text: '周'
          },
          {
              type: 'all',
              text: '全部'
          }],
          inputDateFormat: '%Y-%m-%d'
        },
        title: {
          text: name
        },
        xAxis: {
          type: 'datetime',
          gridLineWidth: 1,
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%i',
            day: '%m-%d',
            week: '%m-%d',
            month: '%y-%m',
            year: '%Y'
          }
        },
        tooltip: {
          split: false,
          shared: true,
        },
        yAxis: [{
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: name
          },
          height: '65%',
          resize: {
            enabled: true
          },
          lineWidth: 2,
          crosshair: {
            label: {
              enabled: true,
              format: '{value:.2f}'
            }
          },
          labels: {
            align: 'left',
            format: '{value:.2f}',
            y: 6,
            x: 2
          }
        }, {
          labels: {
            align: 'right',
            x: -3
          },
          title: {
            text: '成交量'
          },
          top: '65%',
          height: '35%',
          offset: 0,
          lineWidth: 2
        }],
        series: [{
          type: 'candlestick',
          name: name,
          color: 'green',
          lineColor: 'green',
          upColor: 'red',
          upLineColor: 'red',
          tooltip: {
            pointFormat: '<span style="color:{point.color}">\u25CF</span> <b> {series.name}</b><br/>' +
                '開盤: {point.open}<br/>' +
                '最高: {point.high}<br/>' +
                '最低: {point.low}<br/>' +
                '收盤: {point.close}<br/>'
          },
          data: this.kChart.ohlcv,
        }, {
          name: '成交量',
          type: 'column',
          data: volume,
          tooltip: {
            split: false,
            shared: true,
          },
          yAxis: 1,
        }]
      }
    },
    chartData (res) {
      const _this = this
      let name = this.$store.state.itemName
      this.chart.items = JSON.parse(JSON.stringify(res))

      this.chart.options = {
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
          data: this.chart.items,
        }]
      }
    }
  },
  mounted () {
  },
}
</script>