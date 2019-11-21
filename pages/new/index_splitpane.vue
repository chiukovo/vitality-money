<template lang='pug'>
    .root
      #header
      #main
        client-only
          split-pane(:default='200' split="vertical")
            template(slot='paneL')
              span A
            template(slot='paneR')
              span B
      #footer
</template>

<script>
import { mapState } from 'vuex'
import '@/assets/scss/style.scss'

export default {
  methods: {
    resize() {
    }
  }
}
</script>