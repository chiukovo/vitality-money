<template>
  <div id="tdview-container" class="h-100"></div>
</template>

<script>

import { mapState } from 'vuex'
import Vue from 'vue'

export default {
  name: 'app',
  data() {
    return {}
  },
  mounted () {
    const this_vue = this
    const disabled_features = ['use_localstorage_for_settings', 'header_symbol_search', 'border_around_the_chart']
    //判斷是否另開視窗
    if (typeof this.$route.query.id != 'undefined' && typeof this.$route.query.name != 'undefined') {
      this.$store.dispatch('CALL_CHANGE_CHART_SYMBOL', this.$route.query.id)

      setTimeout(() => {
        this.$store.commit('setClickItemId', {
          id: this.$route.query.id,
          name: this.$route.query.name
        })
      }, 3000)
    }

	  const tdChart = window.tvWidget = new TradingView.widget({
      debug: false,
      // 是否全屏
      fullscreen: false,
      // 週期
      interval: 1,
      // 時區
      timezone: 'Asia/Taipei',
      // id屬性為指定要包含widget的DOM元素id
      container_id: "tdview-container",
      // 語言
      locale: "zh_TW",
      // static文檔夾的路徑
      library_path: '/js/charting_library/',
      // JavaScript對象的實現接口 JS API 以反饋圖表及數據
      datafeed: this_vue.createFeed(),
      // datafeed: Datafeed,
      // 自動調節大小
      autosize: true,
      saved_data: JSON.parse(this_vue.$store.state.localStorage.tradingViewUserSaveData),
      // 主題顏色（dark，light）
      custom_css_url: this_vue.$store.state.isMobile ? 'mobi_trading.min.css' : '',
      theme: this_vue.$store.state.isMobile ? 'dark' : 'light',
      auto_save_delay: 5000,
      overrides: {
        "symbolWatermarkProperties.transparency": 90,
        "mainSeriesProperties.candleStyle.wickUpColor": '#7f323f',
        "mainSeriesProperties.candleStyle.wickDownColor": '#336854',
        "mainSeriesProperties.candleStyle.upColor": "#d75442",
        "mainSeriesProperties.candleStyle.downColor": "#6ba583",
        "mainSeriesProperties.candleStyle.borderUpColor": "#d75442",
        "mainSeriesProperties.candleStyle.borderDownColor": "#6ba583"
      },
      disabled_features,
      enabled_features: ['keep_left_toolbar_visible_on_small_screens', 'dont_show_boolean_study_arguments'],
      studies_overrides: {
        "volume.volume.color.0": "#6ba583",
        "volume.volume.color.1": "#d75442"
      },
      // 指標模板
      charts_storage_api_version: '1.1',
      // 定製加載進度條
      loading_screen: { backgroundColor: '#FFFFFF' },
    })

    tdChart.onChartReady(function() {
      function saveTradingChart() {
        tdChart.save(function(data) {
          this_vue.$alert('儲存成功', '圖表')
          const thisData = JSON.stringify(data)
          if (thisData != this_vue.$store.state.localStorage.tradingViewUserSaveData) { 
            this_vue.$store.commit('setTradingViewUserSaveData', thisData)
          }
        })
      }

      function createStudy() {
        tdChart.chart().createStudy('Moving Average', false, false, [20], null, { 'Plot.color': 'rgb(150, 95, 196)' })
        tdChart.chart().createStudy('Moving Average', false, false, [60], null, { 'Plot.color': 'rgb(116,149,187)' })
        if (!this_vue.$store.state.isMobile) {
          tdChart.chart().createStudy('Stochastic', false, false, [14, 9, 9], null, null)
        }
      }

      this_vue.$store.commit('setTradingViewChart', tdChart)
      //設置均線種類 均線樣式

      if (!this_vue.$store.state.localStorage.tradingViewUserSaveData) {
        createStudy()
      }

      try {
        tdChart.chart().setSymbol(this_vue.$store.state.symbol)
      } catch (err) {
      }

      tdChart.createButton({ align: "right" })
        .attr('title', '儲存圖表')
        .text('儲存')
        .on('click', saveTradingChart)
    })
  },
  methods: {
    createFeed: function(){
      const this_vue = this
      const supportedResolutions = ["1", "2", "3", "4", "5", "6", "10", "15", "30", "60", "120", "180", "240", "W", "D", "M"]

      const config = {
        supported_resolutions: supportedResolutions
      }

      const comTradeTime = {
        'TXF': '0845-1345',
        'EXF': '0845-1345',
        'FXF': '0845-1345',
        'TXFAF': '0845-1345,1500-0500|0845-1345:2',
        'TSLQ': '0900-1300',
        'HSI': '0915-1200,1300-1630',
        'HSIAF': '0915-1200,1300-1630,1715-0100|0915-1200,1300-1630:2',
        'CN': '0900-1635',
        'CNAF': '0900-1630,1700-0445|0900-1630:2',
        'NK225': '0745-1425',
        'NK225AF': '0745-1425,1455-0445|0745-1425:2',
        'E7': '24x7',
        'SI': '24x7',
        'GC': '24x7',
        'FDAX': '0815-0500',
        'NQ': '24x7',
        'YM': '24x7',
        'CL': '24x7',
        'CIF': '0930-1130,1300-1500',
      }

      const comDescription = {
        'TXF': '台指期',
        'EXF': '電子期',
        'FXF': '金融期',
        'TXFAF': '台指全',
        'TSLQ': '大盤指數',
        'HSI': '恆生期',
        'HSIAF': '恆生全',
        'CN': 'SGX',
        'CNAF': 'SGX',
        'NK225': '日經期',
        'NK225AF': '日經全',
        'E7': '歐元期',
        'SI': '白銀期',
        'GC': '黃金期',
        'FDAX': '德指',
        'NQ': '那斯達',
        'YM': '道瓊期',
        'CL': '輕油期',
        'CIF': '滬深期',
      }

      const min_name_id = {
        1: "minone",
        2: "mintwo",
        3: "minthree",
        4: "minfour",
        5: "minfive",
        6: "minsix",
        10: "minten",
        15: "minfifteen",
        20: "mintwenty",
        25: "mintwentyfive",
        30: "minthirty",
        60: "onehour",
        120: "twohour",
        180: "threehour",
        240: "fourhour",
        '1D': "day",
        'D': "day",
        '1W': "week",
        'W': "week",
        '1M': "month",
        'M': "month"
      }

      const min_name_resol = {
        1: 2,
        2: 2,
        3: 3,
        4: 3,
        5: 4,
        6: 4,
        10: 6,
        15: 7,
        20: 8,
        25: 9,
        30: 20,
        60: 30,
        120: 40,
        180: 50,
        240: 60,
        '1D': 261,
        'D': 261,
        '1W': 24,
        'W': 24,
        '1M': 24,
        'M': 24
      }

      return {
        onReady: (callback) => {
          setTimeout(() => callback(config), 0)
        },
        searchSymbols: (userInput, exchange, symbolType, onResultReadyCallback) => {
        },
        resolveSymbol: (symbolName, onSymbolResolvedCallback, onResolveErrorCallback) => {
          var split_data = symbolName.split(/[:]/)
          var symbol_stub = {
            name: split_data[1],
            description: comDescription[split_data[1]],
            type: 'crypto',
            session: comTradeTime[split_data[1]],
            timezone: 'Asia/Taipei',
            ticker: symbolName,
            exchange: split_data[0],
            has_weekly_and_monthly: true,
            minmov: 1,
            pricescale: 1,
            has_intraday: true,
            intraday_multipliers: supportedResolutions,
            supported_resolution:  supportedResolutions,
            volume_precision: 8,
            data_status: 'streaming',
          }

          setTimeout(function() {
            onSymbolResolvedCallback(symbol_stub)
          }, 0)
        },
        getBars: function(symbolInfo, resolution, from, to, onHistoryCallback, onErrorCallback, firstDataRequest) {
          var split_symbol = symbolInfo.ticker.split(/[:/]/)
          this_vue.$store.dispatch(
            'CALL_QUERY_NEW_TECH',
            {
              params: split_symbol[1] + ',' + min_name_id[resolution] + ',' + min_name_resol[resolution] + ',kline',
              onHistoryCallback,
              max: to,
            }
          )
        },
        subscribeBars: (symbolInfo, resolution, onRealtimeCallback, subscribeUID, onResetCacheNeededCallback) => {
          this_vue.$store.commit('setOnRealtimeCallback', onRealtimeCallback)
		      this_vue.$store.commit('setSubResolution', resolution)
        },
        unsubscribeBars: subscriberUID => {
        },
        calculateHistoryDepth: (resolution, resolutionBack, intervalBack) => {
          return {
            resolution,
              resolutionBack: 'D',
              intervalBack: 3
            }
        },
        getMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
        },
        getTimeScaleMarks: (symbolInfo, startDate, endDate, onDataCallback, resolution) => {
        },
        getServerTime: (time) => {
        },
      }
    },
  },
}
</script>
