<template lang='pug'>
  el-dialog(
    :visible.sync='show'
    :before-close='handleClose'
    :close-on-click-modal='false'
    width='300px'
    v-dialogDrag
    :modal='false')
    .header-custom(slot='title')
      |  訊息
    template
     .p-3(style="font-size: 16px")
      span(:class="$store.state.tipsType == 1 ? 'text__danger' : ''") {{ $store.state.tipsContent }}
</template>
<script>

import { mapState } from 'vuex'

export default {
  data () {
    return {
      show: false
    }
  },
  computed: mapState({
    tipsShow: 'tipsShow',
  }),
  watch: {
    tipsShow(show) {
      this.show = show
    }
  },
  methods: {
    handleClose (done) {
      this.$store.commit('tipsStateChange', false)
    }
  }
}
</script>