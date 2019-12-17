<template lang='pug'>
.modals.Setting
  .page
    .header
      .header__left
        el-link(@click='$parent.systemShow = 0' icon='el-icon-arrow-left' :underline='false') 返回
      .header__title 系統設置
    .main
      .area
        .area-switch-list
          li
            .area-switch__title 聲音
            .area-switch__content
              .area-switch__label 音效開關
              .area-switch__button
                el-switch(v-model="sound")
          li
            .area-switch__title 提示
            .area-switch__content
              .area-switch__label 限價單成交提示
              .area-switch__button
                el-switch(v-model="prompt" @change="changeValue('prompt')")
          li
            .area-switch__title 下單提示
            .area-switch__content
              .area-switch__label 下單不確認
              .area-switch__button
                el-switch(v-model="noConfirm" @change="changeValue('noConfirm')")
          li
            .area-switch__title 下單提示
            .area-switch__content
              .area-switch__label 成交不回報
              .area-switch__button
                el-switch(v-model="orderReport" @change="setCustomSetting('orderReport')")
</template>

<script>
export default {
  data() {
    return {
      systemShow: 8,
      sound: true,
      prompt: false,
      noConfirm: false,
      orderReport: false
    }
  },
  mounted() {
    const _this = this
    let customGroup = this.$cookies.get('customGroup')
    this.value1 = this.$store.state.localStorage.customSetting.sound
    this.orderReport = ! this.$store.state.localStorage.customSetting.orderReport

    if (typeof customGroup == 'undefined') {
      customGroup = []
    }

    customGroup.forEach(function(val) {
      if (val == 'noConfirm') {
        _this.noConfirm = true
      }
      if (val == 'prompt') {
        _this.prompt = true
      }
    })
  },
  methods: {
    changeValue(type) {
      let result = []
      let customGroup = this.$cookies.get('customGroup')
      let newType = type == 'prompt' ? this.prompt : this.noConfirm

      if (newType) {
        customGroup.push(type)
        this.$cookies.set('customGroup', customGroup)
      } else {
        customGroup.forEach(function(val) {
          if (val != type) {
            result.push(val)
          }
        })

        this.$cookies.set('customGroup', result)
      }
    },
    setCustomSetting(type) {
      this.$store.commit('setCustomSetting', type)
    },
  },
  watch: {
    sound() {
      this.$store.commit('setCustomSetting', 'sound')
    }
  }
}
</script>