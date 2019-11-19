<template lang='pug'>
.modals.changPassword
  .header
    .header__left
      el-link(icon='el-icon-arrow-left' :underline='false') 返回
    .header__title 系統設置
  .main
    .area
      .area-switch-list
        li
          .area-switch__title 聲音
          .area-switch__content
            .area-switch__label 音效開關
            .area-switch__button
              el-switch(v-model="value1")
        li
          .area-switch__title 提示
          .area-switch__content
            .area-switch__label 限價單成交提示
            .area-switch__button
              el-switch(v-model="value2")
        li
          .area-switch__title 下單提示
          .area-switch__content
            .area-switch__label 下單不確認
            .area-switch__button
              el-switch(v-model="value3")
</template>

<script>
export default {
  data () {
    return {
      systemShow: 8,
      value1: true,
      value2: true,
      value3: false
    }
  }
}
</script>