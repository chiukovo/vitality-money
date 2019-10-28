<template>
  <div class="container">
    <div>
      <h1 class="title">
        test page
        <br>api: {{ this.$store.state.apiExampleData }}
        <br>websocket: {{ this.$store.state.socket.isConnected }}
      </h1>
      <highcharts v-if="ohlc.length > 0" :constructor-type="'stockChart'" :options="stockOptions"></highcharts>
    </div>
  </div>
</template>

<script>

import testData from '~/static/testData.json'

export default {
  data() {
    return {
      stockOptions: {},
      ohlc: []
    }
  },
  methods: {
    testData () {
      let data = testData.data
      var ohlc = [],
        volume = [],
        dataLength = data.length,
        // set the allowed units for data grouping
        groupingUnits = [[
          'week',                         // unit name
          [1]                             // allowed multiples
        ], [
          'month',
          [1, 2, 3, 4, 6]
        ]],
        i = 0;

      for (i; i < dataLength; i += 1) {
        ohlc.push([
          data[i][0], // the date
          data[i][1], // open
          data[i][2], // high
          data[i][3], // low
          data[i][4] // close
        ]);
        volume.push([
          data[i][0], // the date
          data[i][5] // the volume
        ]);
      }

      this.ohlc = ohlc

      this.stockOptions = {
        rangeSelector: {
          selected: 1,
          inputDateFormat: '%Y-%m-%d'
        },
        lang: {
          rangeSelectorZoom: ''
        },
        title: {
          text: '平安银行历史股价'
        },
        xAxis: {
          dateTimeLabelFormats: {
            millisecond: '%H:%M:%S.%L',
            second: '%H:%M:%S',
            minute: '%H:%M',
            hour: '%H:%M',
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
            text: '股价'
          },
          height: '65%',
          resize: {
            enabled: true
          },
          lineWidth: 2
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
          name: '平安银行',
          color: 'green',
          lineColor: 'green',
          upColor: 'red',
          upLineColor: 'red',
          tooltip: {
          },
          navigatorOptions: {
          },
          data: ohlc,
          dataGrouping: {
            units: groupingUnits
          },
          id: 'sz'
        },{
          type: 'column',
          data: volume,
          yAxis: 1,
          dataGrouping: {
            units: groupingUnits
          }
        }]
      }
    }
  },
  mounted() {
    this.testData()
  },
  computed: {
    websocketConnected () {
      return this.$store.state.socket.isConnected
    },
    sendResult () {
      return this.$store.state.socket.message
    },
  },
  watch: {
    websocketConnected () {
      let isConnected = this.$store.state.socket.isConnected

      if (isConnected) {
        this.$socket.send('a:test,test')
      }
    },
    sendResult () {
      let source = this.$store.state.socket.message
      console.log(source)
    },
  }
}
</script>