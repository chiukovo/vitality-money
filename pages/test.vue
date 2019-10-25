<template>
  <div class="container">
    <div>
      <h1 class="title">
        test page
        <br>api: {{ this.$store.state.apiExampleData }}
        <br>websocket: {{ this.$store.state.socket.isConnected }}
        <br>{{ test.highest_price }}
        <br>{{ test.lowest_price }}
      </h1>
      <trading-vue :data="this.$data"></trading-vue>
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      'test': '',
      ohlcv: [
          [ 1551128400000, 33,  37.1, 14,  14,  196 ],
          [ 1551132000000, 13.7, 30, 6.6,  30,  206 ],
          [ 1551135600000, 29.9, 33, 21.3, 21.8, 74 ],
          [ 1551139200000, 21.7, 25.9, 18, 24,  140 ],
          [ 1551142800000, 24.1, 24.1, 24, 24.1, 29 ],
      ]
    }
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