<template lang='pug'>
  div
    highcharts(v-if="items.length > 0" :options="options")
    div(v-loading="loading" v-else style="height: 200px")
    el-carousel(indicator-position="outside" :autoplay="false")
      el-carousel-item(v-for="item in 4" :key="item")
        .area(v-show="item == 1")
          //-五檔
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
        .area(v-show="item == 2")
          //-分價
        .area(v-show="item == 3")
          //-報價明細
        .area(v-show="item == 4")
          //-客製那個 什麼成交買進賣出啥的
</template>

<script>

import { mapState } from 'vuex';

export default {
  name: 'app',
  data() {
    return {
      items: [],
      options: {},
      loading: true,
    }
  },
  methods: {
  },
  computed: mapState([
    'chartData',
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
