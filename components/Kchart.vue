<template>
  <div>
    <highcharts v-if="ohlcv.length > 0" :constructor-type="'stockChart'" :options="stockOptions"></highcharts>
    <div v-loading="loading" v-else style="height: 300px"></div>
  </div>
</template>

<script>

import { mapState } from 'vuex';
import Vue from 'vue'
import HighchartsVue from "highcharts-vue";
import Highcharts from "highcharts"
import stockInit from 'highcharts/modules/stock'
import mapInit from 'highcharts/modules/map'

if (typeof Highcharts === 'object') {
  Highcharts.setOptions({
    global: {
      useUTC: false
    }
  })

  stockInit(Highcharts)
  mapInit(Highcharts)
}

Vue.use(HighchartsVue)

export default {
  name: 'app',
  data() {
    return {
      ohlcv: [],
      volume: [],
      stockOptions: {},
      loading: true,
    }
  },
  methods: {
    onResize(event) {
      this.width = window.innerWidth
      this.height = window.innerHeight
    }
  },
  computed: mapState([
    'kLineData',
  ]),
  watch: {
    kLineData (res) {
      let name = this.$store.state.itemName
      let _this = this
      this.volume = []

      this.ohlcv = JSON.parse(JSON.stringify(res))
      this.ohlcv.forEach(function(val) {
        _this.volume.push([
          val[0],
          val[5]
        ])
      })

      this.stockOptions = {
        chart: {
          events: {
            load: function () {
              //load over
              this.loading = false
            }
          }
        },
        rangeSelector: {
          selected: 2,
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
          data: this.ohlcv,
        }, {
          name: '成交量',
          type: 'column',
          data: this.volume,
          tooltip: {
            split: false,
            shared: true,
          },
          yAxis: 1,
        }]
      }
    }
  },
  mounted () {
  },
}
</script>
