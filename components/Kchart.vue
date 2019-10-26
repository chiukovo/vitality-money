<template>
  <trading-vue v-if="chart.ohlcv.length > 0" :data="chart" :width="this.width" :height="this.height"
      :color-back="colors.colorBack"
      :color-grid="colors.colorGrid"
      :color-text="colors.colorText"
      :titleTxt="'test'"
    >
  </trading-vue>
</template>

<script>

import { mapState } from 'vuex';

export default {
  name: 'app',
  data() {
    return {
      chart: {
        ohlcv: []
      },
      width: 0,
      height: 0,
      colors: {
        colorBack: '#fff',
        colorGrid: '#eee',
        colorText: '#333',
      }
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
      this.chart.ohlcv = JSON.parse(JSON.stringify(res))
    }
  },
  mounted () {
    this.width = window.innerWidth
    this.height = window.innerHeight

    window.addEventListener('resize', this.onResize)
  },
}
</script>
