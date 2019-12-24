<template lang="pug">
.highcharts
  h1(style="text-align: center" v-if="name != ''") {{ name }}
  highcharts(v-if="selectChartId.length > 0" :options="options")
  div(v-loading="loading" v-else class="h-100")
</template>

<script>

import { mapState } from 'vuex'
import Vue from 'vue'
import HighchartsVue from "highcharts-vue"
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
      selectChartId: '',
      options: {},
      name: '',
      optionCharts: {
        chart_y_label_aligin: 'right',
        chart_tickLength: 10,
        chart_y_label_x: -8,
        chart_tickPixelInterval: 100,
        chart_background_color: 'rgb(255, 255, 255)',
        chart_grid_color: 'rgb(215,235,240)',
        strock_border_color: 'black',
        table_border_color: '#EEE',
        order_color: '#000',
        five_color: '#000',
        chart_font_color: '#4E4E50',
        chart_minor_grid_color: 'rgb(200,215,230)',
        chart_title_color: '#4E4E50',
        kbun_green: '#53AB35',
        chart_q_background: '#d1e9f3',
        mouse_line: 'black',
        label_font_size: '16px',
        chart_opposite: false,
        chart_label_formatter: {
          x: 20,
          align: 'center',
          style: {
              fontSize: '16px',
              color: '#4E4E50',
              fontWeight: 'normal',
          },
        },
        chart_formater_x: 48,
        chart_label_x: 20,
      },
      chartLines: {
        chart_formater_label_width: '80px',
        label_x: 0,
        lHeight: '20px',
        crosshairX: null,
        labelY: null,
        circleX: null,
        mouseLabelY: null,
        mouseLabelX: null,
        mouseLabelColumnY: null,
        mouseCrosshairX: null,
        mouseCrosshairColumnX: null,
      },
      loading: true,
      syncChart: null,
    }
  },
  props: ['theme'],
  methods: {
    activeLastPointToolip (chart) {
      const points = chart.series[0].points
      chart.tooltip.refresh(points[points.length -1])
    },
  },
  computed: mapState([
    'chartId',
  ]),
  mounted () {
    if (this.theme === 'black') {
      Object.assign(this.optionCharts, {
        strock_border_color: 'white',
        table_border_color: '#000000',
        order_color: '#f4e842',
        five_color: '#eee',
        chart_background_color: 'rgb(28, 28, 28)',
        chart_font_color: '#E0E0E3',
        chart_grid_color: '#555555',
        chart_minor_grid_color: '#505053',
        chart_title_color: '#FFFFFF',
        kbun_green: '#00FF00',
        chart_q_background: 'rgb(41, 90, 138)',
        mouse_line: 'white',
      });
    }

    //判斷是否另開視窗
    if (typeof this.$route.query.id != 'undefined' && typeof this.$route.query.name != 'undefined') {
      this.$store.dispatch('CALL_QUERY_TECH', {
        'id': this.$route.query.id,
        'type': 'chart',
        'num': 1
      })

      setTimeout(() => {
        this.$store.commit('setClickItemId', {
          id: this.$route.query.id,
          name: this.$route.query.name
        })
      }, 3000)

      this.name = this.$route.query.name
    } else {
      this.startChart(this.chartId)
    }
  },
  watch: {
    chartId(chartId) {
      this.startChart(chartId)
    }
  },
  methods: {
    startChart(chartId) {
      const _this = this
      this.selectChartId = chartId
      if (this.$store.state.chartData.length == 0) {
        return
      }

      function chart_formatter() {
        var x = this.x,
          chart = this.series.chart,
          series = this.series.chart.series,
          ret = '',
          s

        _this.chartLines.mouseLabelX.translate(this.point.plotX + _this.optionCharts.chart_label_x, chart.plotHeight + chart.plotTop + 3)
        const time_array = [
          '<div style="text-shadow: 0 0 0 !important;text-align:center;',
          ';width:',
          _this.chartLines.chart_formater_label_width,
          ';height:',
          _this.chartLines.lHeight,
          ';line-height:',
          _this.chartLines.lHeight,
          ';">',
          Highcharts.dateFormat('%H:%M:%S', this.x) ,
          '</div>'
        ]
        _this.chartLines.mouseLabelX.attr({
            text: time_array.join("")
        })

        s = series[1]
        const thePoint = s.points.find(p => p.x >= x)
        if (thePoint) {
          _this.chartLines.mouseLabelY.translate(_this.chartLines.label_x, thePoint.plotY + chart.plotTop - _this.chartLines.mouseLabelY.height / 2)
          const mouse_array = [
            '<div style="text-shadow: 0 0 0 !important;text-align:center;',
            'width:',
            chart.plotLeft - 10 + 'px',
            ';height:',
            _this.chartLines.lHeight,
            ';line-height:',
            _this.chartLines.lHeight,
            ';">',
            thePoint.y,
            '</div>'
          ]
          _this.chartLines.mouseLabelY.attr({
              text: mouse_array.join("")
          })

          _this.chartLines.mouseCrosshairX.translate(0, thePoint.plotY + 50)
        }

        const chart_label2_x = chart.plotLeft + chart.plotWidth

        s = series[0]
        const theMousePoint = s.points.find(p => p.x >= x)
        if (theMousePoint) {
          _this.chartLines.mouseLabelColumnY.translate(chart_label2_x, theMousePoint.plotY + chart.plotTop - _this.chartLines.mouseLabelColumnY.height / 2)
          const mouse_array = [
            '<div style="text-shadow: 0 0 0 !important;text-align:center',
            ';width:',
            chart.plotRight + 'px',
            ';height:',
            _this.chartLines.lHeight,
            ';line-height:',
            _this.chartLines.lHeight,
            ';">',
            theMousePoint.y,
            '</div>'
          ]
          _this.chartLines.mouseLabelColumnY.attr({
              text: mouse_array.join("")
          })

          _this.chartLines.mouseCrosshairColumnX.translate(0, theMousePoint.plotY + 50)
        }

        return ''
      }

      this.options = {
        global: {
          useUTC: false
        },
        chart: {
          backgroundColor: this.optionCharts.chart_background_color,
          style: {
            fontFamily: "Signika, serif"
          },
          marginLeft: 65, // Keep all charts left aligned
          marginRight: 50,
          spacingTop: 15,
          spacingBottom: 7,
          spacingRight: 10,
          spacingLeft: 0,
          zoomType: '',
          events: {
            load: function () {
              _this.syncChart = this
              //load over
              this.loading = false
              const chart = this
              //initialize the X and Y component of the crosshairs (you can adjust the color and size of the crosshair lines here)
              _this.chartLines.crosshairX = chart.renderer.path(['M', chart.plotLeft, chart.plotTop , 'L', chart.plotLeft + chart.plotWidth , chart.plotTop ]).attr({
                stroke: 'red',
                'stroke-width': 1,
                zIndex: 0
              }).add()
              .hide().toFront()

              _this.chartLines.labelY = chart.renderer.label('<div style="text-align:center;width:' + chart.plotLeft - 10 + 'px;height:25px;line-height:25px;></div>', _this.chartLines.label_x, 50, 'callout', 520, 64, true)
              .css({
                color: '#FFFFFF',
                fontSize: _this.optionCharts.label_font_size
              })
              .attr({
                fill: 'rgb(233, 0, 0)'
              }).add()
              .hide().toFront()

              _this.chartLines.circleX = chart.renderer.circle(3, 3, 4).attr({
                fill: '#F00',
                stroke: 'white',
                'stroke-width': 1
              }).add().toFront().hide()

              _this.chartLines.mouseLabelY = chart.renderer.label('<div style="height:' + _this.optionCharts.label_font_size + ';line-height:' + _this.optionCharts.label_font_size + ';"></div>', -50, -50, 'callout', 520, 64, true)
                .css({
                  color: '#000000',
                  fontSize: _this.optionCharts.label_font_size
                })
                .attr({
                  fill: 'rgb(211, 211, 211)',
                  zIndex: 25
                }).add()
                .show().toFront()

              _this.chartLines.mouseLabelX = chart.renderer.label('<div style="height:' + _this.optionCharts.label_font_size + ';line-height:' + _this.optionCharts.label_font_size + ';"></div>', -50, -50, 'callout', 520, 64, true)
                .css({
                  color: '#000000',
                  fontSize: _this.optionCharts.label_font_size
                })
                .attr({
                  fill: 'rgb(211, 211, 211)',
                  zIndex: 25
                }).add()
                .show().toFront()

              _this.chartLines.mouseLabelColumnY = chart.renderer.label('<div style="height:' + _this.optionCharts.label_font_size + ';line-height:' + _this.optionCharts.label_font_size + ';"></div>', -50, -50, 'callout', 520, 64, true)
                .css({
                  color: '#000000',
                  fontSize: _this.optionCharts.label_font_size
                })
                .attr({
                  fill: 'rgb(211, 211, 211)',
                  zIndex: 25
                }).add()
                .show().toFront()

              _this.chartLines.mouseCrosshairColumnX = chart.renderer.path(['M', chart.plotLeft, chart.plotTop - 50, 'L', chart.plotLeft + chart.plotWidth - 5, chart.plotTop - 50]).attr({
                  stroke: _this.optionCharts.mouse_line,
                  'stroke-width': 1,
                  zIndex: 20
                }).add()
                .toFront()

              _this.chartLines.mouseCrosshairX = chart.renderer.path(['M', chart.plotLeft , chart.plotTop - 50, 'L', chart.plotLeft + chart.plotWidth - 5 , chart.plotTop - 50]).attr({
                stroke: _this.optionCharts.mouse_line,
                'stroke-width': 1,
                zIndex: 20
              }).add()
              .toFront()

              chart.renderer.path(['M', chart.plotLeft + chart.plotWidth, chart.plotTop , 'L',chart.plotLeft + chart.plotWidth , chart.plotTop + chart.plotHeight]).attr({
                stroke: _this.optionCharts.chart_grid_color,
                'stroke-width': 1,
                zIndex: 5
              }).add()

              chart.renderer.path(['M', chart.plotLeft, chart.plotTop , 'L',chart.plotLeft , chart.plotTop + chart.plotHeight]).attr({
                stroke: _this.optionCharts.chart_grid_color,
                'stroke-width': 1,
                zIndex: 5
              }).add()

              const series = this.series[1]
              const points = series.points
              _this.chartLines.crosshairX.show()
              _this.chartLines.crosshairX.translate(0, points[points.length - 1].plotY)

              _this.chartLines.circleX.show()
              _this.chartLines.circleX.translate(points[points.length - 1].plotX + chart.plotLeft - 2, points[points.length - 1].plotY + chart.plotTop - 2)

              _this.chartLines.labelY.show()
              _this.chartLines.labelY.translate(_this.chartLines.label_x, points[points.length - 1].plotY + chart.plotTop - _this.chartLines.labelY.height / 2)

              const tra_chart_array = [
                '<div style="text-align:center;',
                ';width:',
                chart.plotLeft - 10 + 'px',
                ';height:',
                _this.chartLines.lHeight,
                ';line-height:',
                _this.chartLines.lHeight,
                ';">',
                _this.$store.state.nowNewPrice[chartId],
                '</div>'
              ]
              _this.chartLines.labelY.attr({
                text: tra_chart_array.join("")
              })
            },
            redraw: function() {
            },
          }
        },
        title: {
          text: ''
        },
        xAxis: {
          tickPixelInterval: this.optionCharts.chart_tickPixelInterval,
          type: 'datetime',
          gridLineWidth: 1,
          gridLineColor: this.optionCharts.chart_grid_color,
          gridLineDashStyle: 'dash',
          labels: {
            style: {
              fontSize: this.optionCharts.label_font_size,
              fontWeight: 'normal',
              color: this.optionCharts.chart_font_color,
            },
            y: 20,
          },
          lineColor: this.optionCharts.chart_grid_color,
          minorGridLineColor: this.optionCharts.chart_minor_grid_color,
          tickColor: this.optionCharts.chart_grid_color,
          tickLength: this.optionCharts.chart_tickLength,
          title: {
            style: {
              color: this.optionCharts.strock_border_color
            }
          },
          crosshair: {
            width: 1,
            color: this.optionCharts.strock_border_color
          },
        },
        yAxis: [{
          title: {
            text: ''
          },
          shadow: true,
          gridLineColor: this.optionCharts.chart_grid_color,
          labels: {
            style: {
              fontSize: this.optionCharts.label_font_size,
              color: this.optionCharts.chart_font_color,
              fontWeight: 'normal',
              crop: false
            },
            x:  this.optionCharts.chart_y_label_x,
            align:  this.optionCharts.chart_y_label_aligin
          },
          tickLength: 0,
          lineColor: this.optionCharts.chart_grid_color,
          minorGridLineColor: this.optionCharts.chart_minor_grid_color,
          tickColor: this.optionCharts.chart_grid_color,
          tickPixelInterval: 70,
          maxPadding: 0,
          minPadding: 0.1,
          startOnTick: false,
          endOnTick: true,
          tickWidth: 1,
          opposite: this.optionCharts.chart_opposite
        }, {
          title: {
            text: ''
          },
          gridLineWidth: 0,
          tickWidth: 0,
          opposite: !this.optionCharts.chart_opposite,
          labels: this.optionCharts.chart_label_formatter,
          lineColor: this.optionCharts.chart_grid_color,
          minorGridLineColor: this.optionCharts.chart_minor_grid_color
        }],
        legend: {
          enabled: false
        },
        tooltip: {
          positioner: function() {
            return {
              x: _this.optionCharts.chart_formater_x,
              y: -7 // align to title
            }
          },
          shared: false,
          split: false,
          borderWidth: 0,
          backgroundColor: 'none',
          shadow: false,
          useHTML: true,
          style: {
            fontSize: this.optionCharts.label_font_size
          },
          headerFormat: '',
          pointFormat: '<span style="color:{point.color}">\u25CF</span> <b style="color:#FFF;">{point.y}</b>',
          formatter: chart_formatter
        },
        plotOptions: {
          area: {
            fillColor: {
              linearGradient: {
                x1: 0,
                y1: 0,
                x2: 0,
                y2: 0.85
              },
              stops: [
                [0, Highcharts.Color("#E61E19").setOpacity(0).get('rgba')],
                [1, Highcharts.Color("#53AB35").setOpacity(0).get('rgba')]
              ]
            },

            lineWidth: 2,
            states: {
              hover: {
                lineWidth: 2
              }
            },
            dataLabels: {
              enabled: false
            },
            color: "#E61E19",
            negativeColor: '#53AB35',
            threshold: this.$store.state.chartCrossData[0][1]
          },

          series: {
            stickyTracking: true,
            lineWidth: 1,
            animation: false,
            borderWidth: 0,
            marker: {
              enabled: false,
              fillColor: '#FFFFFF',
              lineColor: 'rgb(32, 150, 216)',
              lineWidth: 2,
              radius: 4
            },
            dataLabels: {
              style: {
                fontSize: this.optionCharts.label_font_size,
                color: '#FFF',
                fontWeight: 'normal',
                textOutline: 'none',
                textShadow: false
              },
              shadow: false,
              borderRadius: 5,
              //backgroundColor: 'rgb(32, 150, 216)',
              zIndex: 9999,
              y: 15,
              x: -35
            }
          }
        },
        series: [{
          type: 'column',
          //enableMouseTracking: false,
          yAxis: 1,
          name: '量',
          data: this.$store.state.chartVolumeData
        }, {
          type: 'area',
          yAxis: 0,
          name: '價格',
          lineWidth: 2,
          data: this.$store.state.chartData,
          states: {
            hover: {
              enabled: false
            }
          }
        }, {
          type: 'line',
          enableMouseTracking: false,
          lineWidth: 2,
          yAxis: 0,
          name: '',
          data: this.$store.state.chartCrossData,
          dashStyle: 'Dash'
        }],
        colors: [_this.optionCharts.chart_q_background, "rgb(45, 170, 230)", "rgb(32, 150, 216)", "rgb(32, 96, 161)"],
        symbols: ['circle', 'circle', 'circle', 'circle', 'circle']
      }

      const onChatUpdate = ({
        isNewPoint,
        time,
        price,
        volume,
      }) => {
        const chart = _this.syncChart
        if (typeof chart.series == 'undefined') {
          return
        }

        const series = chart.series[1]
        const series2 = chart.series[0]

        //前後時間有更新才做更新
        //分鐘線不刪掉
        if (series.data[series.data.length - 1].x % 60000 != 0) {
          series.removePoint(series.data.length - 1, false, false)
        }

        if (time[0] % 60000 != 0) {
          //固定新增最後一個點，僅新增非分鐘線
          series.addPoint([time, price], false, false)
        }

        //量
        //分鐘線不刪掉
        if (series2.data[series2.data.length - 1].x % 60000 != 0) {
          series2.removePoint(series2.data.length - 1, false, false)
        }

        //同步更新分鐘線資料
        series2.data[series2.data.length - 1].y = volume

        //量
        if (time % 60000 != 0) {
          series2.addPoint([time, volume], false, false)
        }

        if (isNewPoint) {
            //固定新增最後一個點，分鐘線，所以要整點
            const ontime =  time - (time % 60000)
            series.addPoint([ontime, price], false, false)
            series2.addPoint([ontime, 0], false, false)
        }

        chart.redraw()

        //將點移到最後一個點位
        var points = series.points

        _this.chartLines.crosshairX.show()
        _this.chartLines.crosshairX.translate(0, points[points.length - 1].plotY)
        _this.chartLines.circleX.show()
        _this.chartLines.circleX.translate(points[points.length - 1].plotX + chart.plotLeft - 2, points[points.length - 1].plotY + chart.plotTop - 2)
        _this.chartLines.labelY.show()
        _this.chartLines.labelY.translate(_this.chartLines.label_x, points[points.length - 1].plotY + chart.plotTop - _this.chartLines.labelY.height / 2)
        const tra_chart_array = [
          '<div style="text-align:center;',
          ';width:',
          chart.plotLeft - 10 + 'px',
          ';height:',
          _this.chartLines.lHeight,
          ';line-height:',
          _this.chartLines.lHeight,
          ';">',
          price,
          '</div>'
        ]
        _this.chartLines.labelY.attr({
          text: tra_chart_array.join("")
        })
      }
      _this.$store.commit('onChatUpdate', onChatUpdate)
    }
  }
}
</script>

<style>
  .highcharts-crosshair {
    visibility: visible !important;
  }
</style>