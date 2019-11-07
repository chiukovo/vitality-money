<template lang='pug'>
#operating.operating
  .operating-header
    .header__title 恆生期
    .header__mode
      el-radio(v-model='radioA' label='1') 一般
      el-radio(v-model='radioA' label='2') 雷電
  .operating-content
    .operating-1
      table
        tbody
          tr
            td
            td: el-radio(v-model='radioB' label='2') 市價單
          tr
            td: el-radio(v-model='radioB' label='3') 收盤單
            td: el-radio(v-model='radioB' label='4') 限價單
    .operating-2
      el-form(ref='form' size='mini' label-width='50px')
        el-form-item(label='停利:')
          el-input-number(v-model='num1' controls-position='right' :min='1' :max='10')
        el-form-item(label='停損:')
          el-input-number(v-model='num2' controls-position='right' :min='1' :max='10')
    .operating-3
      .numberbtn
        el-form(ref='form' size='mini' label-width='50px')
          el-button-group
            el-button(type='primary' size='mini') 1
            el-button(type='primary' size='mini') 2
            el-button(type='primary' size='mini') 3
            el-button(type='primary' size='mini') 4
            el-button(type='primary' size='mini') 5
      .numberinput
        el-form(ref='form' size='mini' label-width='50px')
          el-form-item(label='口數:' style='margin: 6px 0 0 0;')
            el-input-number(v-model='num3' controls-position='right' :min='1' :max='10')
      .editbtn
        el-button-group
          el-button(type='primary' size='mini') 編輯
          el-button(type='primary' size='mini') 還原
    .operating-4
        el-button(type="danger") 下多單
        el-button(size='mini') 全平
        el-button(type="success") 下空單
    .operating-5
      el-checkbox-group(v-model='checkList')
        el-checkbox(label='(恆生期)全盤收平')
        el-checkbox(label='下單不確認')
        el-checkbox(label='限價成交提示')
</template>

<script>
export default {
  data () {
    return {
      radioA: '1',
      radioB: '2',
      num1: 1,
      num2: 1,
      num3: 1,
      checkList: ['下單不確認']
    };
  }
}
</script>