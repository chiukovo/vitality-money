<template>
  <div>
    <highcharts v-if="items.length > 0" :options="options"></highcharts>
    <div v-loading="loading" v-else style="height: 300px"></div>
  </div>
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
    activeLastPointToolip (chart) {
      const points = chart.series[0].points;
      chart.tooltip.refresh(points[points.length -1]);
    },
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
          text: name
        },
        xAxis: {
          type: 'datetime',
          tickPixelInterval: 150,
          lineColor:'#999',
          lineWidth:1,
          tickColor:'#666',
          tickLength:3,
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
        yAxis: [{
          lineColor:'#999',
          lineWidth: 1,
          tickColor:'#000',
          tickWidth: 1,
          tickLength:3,
          gridLineColor:'#ddd'
        }, {
            linkedTo: 0,
            opposite: true,
            tickPositioner: function(min,max){
              const data = this.chart.yAxis[0].series[0].processedYData;
              //last point
              return [data[data.length-1]];
            }
        }],
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
