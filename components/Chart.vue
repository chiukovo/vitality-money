<template lang="pug">
div(class="h-100")
  .linesp-wrap
    .linesp 昨收
      span.number {{ nowMainItem.yesterday_close_price }}
    .linesp 開
      span(:class="checkNumberColor(nowMainItem.open_price)") {{ nowMainItem.open_price }}
    .linesp 高
      span(:class="checkNumberColor(nowMainItem.highest_price)") {{ nowMainItem.highest_price }}
    .linesp 低
      span(:class="checkNumberColor(nowMainItem.lowest_price)") {{ nowMainItem.lowest_price }}
    .linesp 成交
      span(:class="checkNumberColor(nowMainItem.newest_price)") {{ nowMainItem.newest_price }}
    .linesp 漲跌
      span
        .change-icon
          .icon-arrow(:class="nowMainItem.gain > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
        div(style="display: inline" :class="nowMainItem.gain > 0 ? 'text__danger' : 'text__success'") {{ nowMainItem.gain }}
    .linesp
      label
        input(type="checkbox" v-model="newestPriceLineEnable")
        span 成交價線
      label
        input(type="checkbox" v-model="crossEnable")
        span 十字線
  div(id="self-highcharts" class="h-100" :class="{ crossSet: crossEnable }")
  div(v-loading="chartHide" v-show="!chartHide || chartId == ''" class="h-100")
</template>

<script>

import { mapState } from 'vuex'
import Vue from 'vue'
import Highcharts from "highcharts"

if (typeof Highcharts === 'object') {
  Highcharts.setOptions({
    global: {
      useUTC: false
    }
  })
}

export default {
  name: 'app',
  data() {
    return {
      lazyChanged: false,
      chartHide: false,
      selectChartId: '',
      crossEnable: true,
      newestPriceLineEnable: true,
      options: {},
      name: '',
      optionCharts: {
        chart_y_label_aligin: 'right',
        chart_tickLength: 10,
        chart_y_label_x: -3,
        chart_tickPixelInterval: 100,
        chart_background_color: 'rgb(255, 255, 255)',
        chart_plot_background_color: 'rgb(255, 255, 255)',
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
        mouse_line: 'rgb(239, 125, 49)',
        label_font_size: '16px',
        chart_opposite: false,
        chart_formater_x: 48,
        chart_label_x: 22,
      },
      chartLines: {
        chart_formater_label_width: '50px',
        label_x: 0,
        lHeight: '16px',
        crosshairX: null,
        labelY: null,
        circleX: null,
        mouseLabelY: null,
        mouseLabelX: null,
        mouseLabelColumnY: null,
        mouseCrosshairX: null,
        mouseCrosshairColumnX: null,
        gridLeft: null,
        gridRight: null,
      },
      loading: true,
      syncChart: null,
    }
  },
  computed: mapState({
    chartId: 'chartId',
    nowMainItem: 'nowMainItem',
    theme: state => state.localStorage.customSetting.theme,
  }),
  created () {
    //window.addEventListener("resize", this.windowChange);
  },
  mounted () {
    const _this = this;
    window.onresize = () => {
      _this.drawLines(_this.syncChart);
    }

    if (this.theme == 'white') {
      this.whiteTheme()
    } else {
      this.darkTheme()
    }

    //判斷是否另開視窗
    if (typeof this.$route.query.id != 'undefined' && typeof this.$route.query.name != 'undefined') {
      // this.$store.dispatch('CALL_QUERY_TECH', {
      //   'id': this.$route.query.id,
      //   'type': 'chart',
      //   'num': 1
      // })

      setTimeout(() => {
        this.$store.commit('setClickItemId', {
          id: this.$route.query.id,
          name: this.$route.query.name
        })
        this.$store.dispatch('CALL_QUERY_TECH', {
          'id': this.$route.query.id,
          'type': 'chart',
          'num': 1
        })
      }, 3000)

      this.name = this.$route.query.name
    } else {
      setTimeout(() => {
        this.startChart(this.chartId)
      }, 0)
    }
  },
  watch: {
    theme() {
      if (this.theme == 'white') {
        this.whiteTheme()
      } else {
        this.darkTheme()
      }

      this.startChart(this.chartId, true)
    },
    chartId(chartId) {
      if (chartId != '') {
        this.startChart(this.chartId)
      }
    },
    newestPriceLineEnable(value) {
      const _this = this;
      if (value) {
        ['crosshairX', 'labelY', 'circleX'].forEach(val => {
          if (_this.chartLines[val]) {
            _this.chartLines[val].show();
          }
        });
      } else {
        ['crosshairX', 'labelY', 'circleX'].forEach(val => {
          if (_this.chartLines[val]) {
            _this.chartLines[val].hide();
          }
        });
      }
    },
    crossEnable(value) {
      const _this = this;
      if (value) {
        ['mouseLabelY', 'mouseLabelX',
        'mouseCrosshairX'].forEach(val => {
          if (_this.chartLines[val]) {
            _this.chartLines[val].show();
          }
        });
      } else {
        ['mouseLabelY', 'mouseLabelX',
        'mouseCrosshairX'].forEach(val => {
          if (_this.chartLines[val]) {
            _this.chartLines[val].hide();
          }
        });
      }
    },
  },
  methods: {
    updateExtreme(chart, nowMainItem) {
      if (nowMainItem.yesterday_close_price) {
        let maxValue = nowMainItem.yesterday_close_price + parseInt(nowMainItem.yesterday_close_price * 0.001);
        let minValue = nowMainItem.yesterday_close_price - parseInt(nowMainItem.yesterday_close_price * 0.001);
        if (nowMainItem.highest_price > maxValue) {
          maxValue = nowMainItem.highest_price + parseInt(nowMainItem.highest_price * 0.001);
          minValue = nowMainItem.yesterday_close_price - (maxValue - nowMainItem.yesterday_close_price);
        }
        if (nowMainItem.lowest_price < minValue) {
          minValue = nowMainItem.lowest_price - parseInt(nowMainItem.lowest_price * 0.001);
          maxValue = nowMainItem.yesterday_close_price + (nowMainItem.yesterday_close_price - minValue);
        }
        chart.yAxis[0].setExtremes(minValue,maxValue);
      } else {
        setTimeout(() => {
          this.updateExtreme(chart, nowMainItem)
        }, 3000);
      }
    },
    drawLines(chart) {
      const _this = this;
      function clearLine(line) {
        if (_this.chartLines[line]) {
          _this.chartLines[line].destroy()
          _this.chartLines[line] = null
        }
      }

      //initialize the X and Y component of the crosshairs (you can adjust the color and size of the crosshair lines here)
      ['crosshairX', 'labelY', 'circleX',
      'mouseLabelY', 'mouseLabelX',
      'mouseCrosshairX'].forEach(val => clearLine(val));

      _this.chartLines.crosshairX = chart.renderer.path(['M', chart.plotLeft, chart.plotTop , 'L', chart.plotLeft + chart.plotWidth , chart.plotTop ]).attr({
        stroke: 'rgb(91, 206, 250)',
        'stroke-width': 1,
        zIndex: 0
      }).add()
      .hide().toFront()

      _this.chartLines.labelY = chart.renderer.label('<div class="label-fonts" style="text-align:center;width:' + chart.plotLeft - 3 + 'px;height:16px;line-height:16px;background:rgb(91, 206, 250);></div>', -50, -50, 'callout', 520, 64, true)
      .css({
        color: '#000',
        fontSize: _this.optionCharts.label_font_size
      }).add()
      .hide().toFront()

      _this.chartLines.circleX = chart.renderer.circle(3, 3, 4).attr({
        fill: '#F00',
        stroke: 'white',
        'stroke-width': 1
      }).add().toFront().hide()

      _this.chartLines.mouseLabelY = chart.renderer.label('<div style="height:16px;line-height:16px;"></div>', -50, -50, 'callout', 520, 64, true)
        .css({
          color: '#000000',
          fontSize: _this.optionCharts.label_font_size
        })
        .attr({
          zIndex: 25
        }).add()
        .hide().toFront()

      _this.chartLines.mouseLabelX = chart.renderer.label('<div style="height:' + _this.optionCharts.label_font_size + ';line-height:' + _this.optionCharts.label_font_size + ';"></div>', -50, -50, 'callout', 520, 64, true)
        .css({
          color: '#000000',
          fontSize: _this.optionCharts.label_font_size
        })
        .attr({
          zIndex: 25
        }).add()
        .hide().toFront()

      // _this.chartLines.mouseLabelColumnY = chart.renderer.label('<div style="height:' + _this.optionCharts.label_font_size + ';line-height:' + _this.optionCharts.label_font_size + ';"></div>', -50, -50, 'callout', 520, 64, true)
      //   .css({
      //     color: '#000000',
      //     fontSize: _this.optionCharts.label_font_size
      //   })
      //   .attr({
      //     fill: 'rgb(211, 211, 211)',
      //     zIndex: 25
      //   }).add()
      //   .show().toFront()

      // _this.chartLines.mouseCrosshairColumnX = chart.renderer.path(['M', chart.plotLeft, chart.plotTop - 50, 'L', chart.plotLeft + chart.plotWidth - 5, chart.plotTop - 50]).attr({
      //     stroke: _this.optionCharts.mouse_line,
      //     'stroke-width': 1,
      //     zIndex: 20
      //   }).add()
      //   .toFront()

      _this.chartLines.mouseCrosshairX = chart.renderer.path(['M', chart.plotLeft , chart.plotTop - 50, 'L', chart.plotLeft + chart.plotWidth - 5 , chart.plotTop - 50]).attr({
        stroke: _this.optionCharts.mouse_line,
        'stroke-width': 1,
        zIndex: 20
      }).add()
      .hide()
      .toFront()
      if (_this.crossEnable) {
        ['mouseLabelY', 'mouseLabelX',
        'mouseCrosshairX'].forEach(val => {
          if (_this.chartLines[val]) {
            _this.chartLines[val].show();
          }
        });
      }

      // _this.chartLines.gridLeft = chart.renderer.path(['M', chart.plotLeft + chart.plotWidth, chart.plotTop , 'L',chart.plotLeft + chart.plotWidth , chart.plotTop + chart.plotHeight]).attr({
      //   stroke: _this.optionCharts.chart_grid_color,
      //   'stroke-width': 1,
      //   zIndex: 5
      // }).add()

      // _this.chartLines.gridRight = chart.renderer.path(['M', chart.plotLeft, chart.plotTop , 'L',chart.plotLeft , chart.plotTop + chart.plotHeight]).attr({
      //   stroke: _this.optionCharts.chart_grid_color,
      //   'stroke-width': 1,
      //   zIndex: 5
      // }).add()

      const series = chart.series[1]
      const points = series.points

      setTimeout(() => {
        if (_this.newestPriceLineEnable) {
          _this.chartLines.crosshairX.show()
          _this.chartLines.crosshairX.translate(0, points[points.length - 1].plotY)

          _this.chartLines.circleX.show()
          _this.chartLines.circleX.translate(points[points.length - 1].plotX + chart.plotLeft - 2, points[points.length - 1].plotY + chart.plotTop - 2)

          _this.chartLines.labelY.show()
          _this.chartLines.labelY.translate(_this.chartLines.label_x, points[points.length - 1].plotY + chart.plotTop - _this.chartLines.labelY.height / 2)
        }
      }, 500);

      const tra_chart_array = [
        '<div class="label-fonts" style="background:rgb(91, 206, 250);text-align:center;',
        ';width:',
        chart.plotLeft - 3 + 'px',
        ';height:',
        _this.chartLines.lHeight,
        ';line-height:',
        _this.chartLines.lHeight,
        ';">',
        _this.$store.state.nowNewPrice[_this.chartId],
        '</div>'
      ]
      _this.chartLines.labelY.attr({
        text: tra_chart_array.join("")
      })

      this.updateExtreme(chart, _this.nowMainItem);
    },
    windowChange() {
      if (!this.lazyChanged) {
        this.lazyChanged = true
        setTimeout(() => {
          this.$store.dispatch('RESIZE_CHART')
          this.lazyChanged = false
        }, 500);
      }
    },
    darkTheme() {
      Object.assign(this.optionCharts, {
        strock_border_color: 'white',
        table_border_color: '#000000',
        order_color: '#f4e842',
        five_color: '#eee',
        chart_background_color: 'rgb(28, 28, 28)',
        chart_plot_background_color: 'rgb(0, 0, 0)',
        chart_font_color: '#E0E0E3',
        chart_grid_color: '#333333',
        chart_minor_grid_color: '#404043',
        chart_title_color: '#FFFFFF',
        kbun_green: '#00FF00',
        chart_q_background: 'rgb(41, 90, 138)',
        mouse_line: 'rgb(239, 125, 49)',
      });
    },
    whiteTheme() {
      Object.assign(this.optionCharts, {
        chart_background_color: 'rgb(255, 255, 255)',
        chart_plot_background_color: 'rgb(255, 255, 255)',
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
      });
    },
    checkNumberColor(target) {
      if (this.nowMainItem.yesterday_close_price == target) {
        return 'number'
      }

      return this.nowMainItem.yesterday_close_price < target ? 'text__success' : 'text__danger'
    },
    startChart(chartId) {
      if (this.selectChartId == chartId) {
        return;
      }
  
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

        if (_this.crossEnable) {
          _this.chartLines.mouseLabelX.translate(this.point.plotX + _this.optionCharts.chart_label_x, chart.plotHeight + chart.plotTop + 3)
          const time_array = [
            '<div class="label-fonts" style="background:rgb(239, 125, 49);text-shadow: 0 0 0 !important;text-align:center;',
            ';width:',
            _this.chartLines.chart_formater_label_width,
            ';height:',
            _this.chartLines.lHeight,
            ';line-height:',
            _this.chartLines.lHeight,
            ';">',
            Highcharts.dateFormat('%H:%M', this.x) ,
            '</div>'
          ]
          _this.chartLines.mouseLabelX.attr({
              text: time_array.join("")
          })
        }

        s = series[1]
        const thePoint = s.points.find(p => p.x >= x)
        if (thePoint && _this.crossEnable) {
          _this.chartLines.mouseLabelY.translate(_this.chartLines.label_x, thePoint.plotY + chart.plotTop - _this.chartLines.mouseLabelY.height / 2)
          const mouse_array = [
            '<div class="label-fonts" style="background:rgb(239, 125, 49);text-shadow: 0 0 0 !important;text-align:center;',
            'width:',
            chart.plotLeft - 3 + 'px',
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

        // s = series[0]
        // const theMousePoint = s.points.find(p => p.x >= x)
        // if (theMousePoint) {
        //   _this.chartLines.mouseLabelColumnY.translate(chart_label2_x, theMousePoint.plotY + chart.plotTop - _this.chartLines.mouseLabelColumnY.height / 2 + chart.plotHeight * 0.8)
        //   const mouse_array = [
        //     '<div style="text-shadow: 0 0 0 !important;text-align:center',
        //     ';width:',
        //     chart.plotRight + 'px',
        //     ';height:',
        //     _this.chartLines.lHeight,
        //     ';line-height:',
        //     _this.chartLines.lHeight,
        //     ';">',
        //     theMousePoint.y,
        //     '</div>'
        //   ]
        //   _this.chartLines.mouseLabelColumnY.attr({
        //       text: mouse_array.join("")
        //   })

        //   _this.chartLines.mouseCrosshairColumnX.translate(0, theMousePoint.plotY + chart.plotHeight * 0.8 + 50)
        // }

        return ''
      }

      Highcharts.chart('self-highcharts',
      {
        global: {
          useUTC: false
        },
        chart: {
          backgroundColor: this.optionCharts.chart_background_color,
          style: {
            fontFamily: "Signika, serif"
          },
          plotBackgroundColor: this.optionCharts.chart_plot_background_color,
          marginLeft: 54, // Keep all charts left aligned
          marginRight: 10,
          spacingTop: 15,
          plotBorderWidth: 2,
          plotBorderColor: this.optionCharts.chart_grid_color,
          spacingBottom: 7,
          spacingRight: 200,
          spacingLeft: 200,
          zoomType: '',
          events: {
            load: function () {
              _this.syncChart = this
              //load over
              this.loading = false
              const chart = this
              _this.drawLines(chart)
            },
          }
        },
        title: {
          text: ''
        },
        xAxis: {
          tickAmount: 10,
          type: 'datetime',
          gridLineWidth: 1,
          gridLineColor: this.optionCharts.chart_grid_color,
          labels: {
            style: {
              fontSize: this.optionCharts.label_font_size,
              fontWeight: 'normal',
              color: this.optionCharts.chart_font_color,
            },
            y: 20,
            formatter: function () {
              const date = new Date(this.value);
              let hour = date.getHours();
              let min = date.getMinutes();
              hour = (hour < 10 ? "0" : "") + hour;
              min = (min < 10 ? "0" : "") + min;
              const str = hour + ":" + min;
              return `<span class="label-fonts">${str}</span>`;
            },
          },
          lineColor: this.optionCharts.chart_grid_color,
          minorGridLineColor: this.optionCharts.chart_minor_grid_color,
          tickColor: this.optionCharts.chart_grid_color,
          title: {
            style: {
              color: this.optionCharts.strock_border_color
            }
          },
          crosshair: {
            width: 1,
            color: 'rgb(239, 125, 49)'
          },
        },
        yAxis: [{
          tickPositioner: function () {
            var positions = [],
                tick = Math.floor(this.min),
                increment = Math.ceil((this.max - this.min) / 3);

            if (this.max !== null && this.min !== null) {
                for (tick; tick - increment <= this.max && positions.length <= 4; tick += increment) {
                    if (positions.length == 2) {
                      positions.push(_this.nowMainItem.yesterday_close_price);
                    }
                    positions.push(tick);
                }
            }
            return positions;
          },
          height: '80%',
          title: {
            text: ''
          },
          shadow: true,
          gridLineColor: this.optionCharts.chart_grid_color,
          gridLineDashStyle: 'dash',
          labels: {
            style: {
              fontSize: this.optionCharts.label_font_size,
              color: this.optionCharts.chart_font_color,
              fontWeight: 'normal',
              crop: false
            },
            y: 2,
            x:  this.optionCharts.chart_y_label_x,
            align:  this.optionCharts.chart_y_label_aligin,
            formatter: function () {
              const color = _this.nowMainItem.yesterday_close_price > this.value ? '#53AB35'
                : ( _this.nowMainItem.yesterday_close_price < this.value ? '#E61E19' : '#999') ;
              return `<span style="color:${color};" class="label-fonts">${this.value}</span>`;
            },
          },
          lineColor: this.optionCharts.chart_grid_color,
          minorGridLineColor: this.optionCharts.chart_minor_grid_color,
          tickColor: this.optionCharts.chart_grid_color,
          startOnTick: true,
          endOnTick: true,
          opposite: this.optionCharts.chart_opposite,
        }, {
          showFirstLabel: false,
          height: '20%',
          top: '80%',
          labels: {
            format: '<span class="label-fonts">{value}</span>',
            style: {
              fontSize: this.optionCharts.label_font_size,
              color: this.optionCharts.chart_font_color,
              fontWeight: 'normal',
              crop: false
            },
            y: 19,
            x: 44,
            align: 'right',
          },
          title: {
            text: ''
          },
          gridLineWidth: 0,
          tickWidth: 0,
          opposite: this.optionCharts.chart_opposite,
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
            // fillColor: {
            //   linearGradient: {
            //     x1: 0,
            //     y1: 0,
            //     x2: 0,
            //     y2: 0.85
            //   },
            //   stops: [
            //     [0, Highcharts.Color("#E61E19").setOpacity(0).get('rgba')],
            //     [1, Highcharts.Color("#53AB35").setOpacity(0).get('rgba')]
            //   ]
            // },
            fillOpacity: 0.3,
            lineWidth: 2,
            states: {
              inactive: {
                opacity: 1,
              },
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
            animation: false,
            stickyTracking: true,
            lineWidth: 1,
            borderWidth: 0,
            marker: {
              enabled: false,
              fillColor: '#FFFFFF',
              lineColor: 'rgb(32, 150, 216)',
              lineWidth: 2,
              radius: 4
            },
            states: {
              inactive: {
                opacity: 1,
              },
            },
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
          lineWidth: 1,
          yAxis: 0,
          name: '',
          data: this.$store.state.chartCrossData,
          dashStyle: 'Dash'
        }],
        colors: [_this.optionCharts.chart_q_background, "#999", "rgb(32, 150, 216)", "rgb(32, 96, 161)"],
        symbols: ['circle', 'circle', 'circle', 'circle', 'circle']
      });

      // const onChatResize = () => {
      //   const chart = _this.syncChart

      //   if (chart) {
      //     setTimeout(() => {
      //       _this.chartHide = true
      //       chart.reflow()
      //       _this.drawLines(chart)
      //     }, 0);
      //   }
      // };
      // _this.$store.commit('onChatResize', onChatResize)

      const onChatUpdate = ({
        isNewPoint,
        time,
        price,
        volume,
        highest,
        lowest,
      }) => {
        const chart = _this.syncChart
        if (typeof chart.series == 'undefined') {
          return
        }

        if (highest && lowest) {
          let maxValue = _this.nowMainItem.yesterday_close_price + parseInt(_this.nowMainItem.yesterday_close_price * 0.001);
          let minValue = _this.nowMainItem.yesterday_close_price - parseInt(_this.nowMainItem.yesterday_close_price * 0.001);
          if (highest > maxValue) {
            maxValue = highest+ parseInt(highest * 0.001);
            minValue = _this.nowMainItem.yesterday_close_price - (maxValue - _this.nowMainItem.yesterday_close_price);
          }
          if (lowest < minValue) {
            minValue = lowest - parseInt(lowest * 0.001);
            maxValue = _this.nowMainItem.yesterday_close_price + (_this.nowMainItem.yesterday_close_price - minValue);
          }
          chart.yAxis[0].setExtremes(minValue, maxValue);
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

        if (_this.newestPriceLineEnable) {
          _this.chartLines.crosshairX.show()
          _this.chartLines.crosshairX.translate(0, points[points.length - 1].plotY)
          _this.chartLines.circleX.show()
          _this.chartLines.circleX.translate(points[points.length - 1].plotX + chart.plotLeft - 2, points[points.length - 1].plotY + chart.plotTop - 2)
          _this.chartLines.labelY.show()
          _this.chartLines.labelY.translate(_this.chartLines.label_x, points[points.length - 1].plotY + chart.plotTop - _this.chartLines.labelY.height / 2)
          const tra_chart_array = [
            '<div class="label-fonts" style="background:rgb(91, 206, 250);text-align:center;',
            ';width:',
            chart.plotLeft - 3 + 'px',
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
      }
      _this.$store.commit('onChatUpdate', onChatUpdate)
    }
  }
}
</script>

<style>
  .highcharts-crosshair {
    visibility: hidden !important;
  }
  .crossSet .highcharts-crosshair {
    visibility: visible !important;
  }
  .highcharts-credits {
    display: none !important;
  }
  .label-fonts {
    font-family: Lato, Arial, "微軟正黑體", "Microsoft JhengHei", sans-serif;
    width: 140px;
  }
</style>