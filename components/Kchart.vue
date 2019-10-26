<template>
  <trading-vue v-if="chart.ohlcv.length > 0" :data="chart.ohlcv" :width="this.width" :height="this.height"
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
  methods: {
    onResize(event) {
      this.width = window.innerWidth
      this.height = window.innerHeight
    }
  },
  computed: mapState([
    'historyPrice',
  ]),
  mounted() {
    this.width = window.innerWidth
    this.height = window.innerHeight

    window.addEventListener('resize', this.onResize)
  },
  beforeDestroy() {
      window.removeEventListener('resize', this.onResize)
  },
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
  }
}
</script>
