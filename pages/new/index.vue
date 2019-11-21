<template lang='pug'>
  .div 123
    //- split-pane
      template(slot='paneL')
        | A
      template(slot='paneR')
        | B
</template>

<script>
// import { mapState } from 'vuex'
import '@/assets/scss/style.scss'

export default {
  components: {
    // splitPane
  }
}
</script>