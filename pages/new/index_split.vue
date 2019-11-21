<template lang='pug'>
    #app.root
      #header
      #main
        client-only
          split(style='height: 500px;')
            splitarea panel left
            splitarea panel right
      #footer
</template>

<script>
import { mapState } from 'vuex'
import '@/assets/scss/style.scss'

export default {
}
</script>