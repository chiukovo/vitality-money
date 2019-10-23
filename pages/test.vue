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
    </div>
  </div>
</template>

<script>

export default {
  data() {
    return {
      'test': '',
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