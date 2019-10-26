<template>
  <div class="container">
    <div>
      <h1 class="title">
        test page
        <br>api: {{ this.$store.state.apiExampleData }}
        <br>websocket: {{ this.$store.state.socket.isConnected }}
      </h1>
      <trading-vue
        :data="this.$data.items"
      ></trading-vue>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      items: {
        ohlcv: [
            [ 1551128400000, 33,  37.1, 14,  14,  196 ],
            [ 1551132000000, 13.7, 30, 6.6,  30,  206 ],
            [ 1551135600000, 29.9, 33, 21.3, 21.8, 74 ],
            [ 1551139200000, 21.7, 25.9, 18, 24,  140 ],
            [ 1551142800000, 24.1, 24.1, 24, 24.1, 29 ],
        ],
      }
    }
  },
  methods: {
      meta_info() {
          return { author: 'C451', version: '1.0.0' }
      },
      // Here goes your code. You are provided with:
      // { All stuff is reactive }
      // $props.layout -> positions of all chart elements +
      //  some helper functions (see layout_fn.js)
      // $props.interval -> candlestick time interval
      // $props.sub -> current subset of candlestick data
      // $props.data -> your indicator's data subset.
      //  Comes "as is", should have the following format:
      //  [[<timestamp>, ... ], ... ]
      // $props.colors -> colors (see TradingVue.vue)
      // $props.cursor -> current position of crosshair
      // $props.settings -> indicator custom settings
      //  E.g. colors, line thickness, etc. You define it.
      // ~
      // Finally, let's make the canvas dirty!
      draw(ctx) {
          const l = this.$props.layout
          const c = { x : l.width / 2, y : l.height / 2 }
          ctx.lineWidth = 1
          ctx.strokeStyle = 'gray'
          ctx.fillStyle = '#ffea03'
          ctx.beginPath()
          ctx.arc(c.x, c.y, 50, 0, Math.PI * 2, true) // Outer circle
          ctx.fill()
          ctx.stroke()
          ctx.beginPath()
          ctx.strokeStyle = 'black'
          ctx.moveTo(c.x + 35, c.y)
          ctx.arc(c.x, c.y, 35, 0, Math.PI , false)  // Mouth (clockwise)
          ctx.moveTo(c.x - 10, c.y - 10)
          ctx.fillStyle = '#ffea03'
          ctx.arc(c.x - 15, c.y - 10, 5, 0, Math.PI * 2, true)  // Left eye
          ctx.fill()
          ctx.moveTo(c.x + 20, c.y - 10)
          ctx.arc(c.x + 15, c.y - 10, 5, 0, Math.PI * 2, true)  // Right eye
          ctx.fill()
          ctx.stroke()
      },
      // For all data with these types overlay will be
      // added to the renderer list. And '$props.data'
      // will have the corresponding values. If you want to
      // redefine the default behviour for a prticular
      // indicator (let's say EMA),
      // just create a new overlay with the same type:
      // e.g. use_for() { return ['EMA'] }.
      use_for() { return ['GRIN'] },
      data_colors() { return ['yellow'] }
  },
  mounted() {
    this.$store.dispatch('CALL_API_EXAMPLE', { vm: this })
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