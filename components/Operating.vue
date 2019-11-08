<template lang='pug'>
#operating.operating
  .operating-header
    .header__title {{ $store.state.itemName }}
    .header__mode
      el-radio(v-model='radioA' label='0') 一般
  .operating-content
    .operating-1
      table
        tbody
          tr
            td
            td: el-radio(v-model='buyType' label='0') 市價單
          tr
            td: el-radio(v-model='buyType' label='2') 收盤單
            td: el-radio(v-model='buyType' label='1') 限價單
    .operating-2
      el-form(ref='form' size='mini' label-width='50px')
        el-form-item(label='停利:')
          el-input-number(v-model='profit' controls-position='right')
        el-form-item(label='停損:')
          el-input-number(v-model='damage' controls-position='right')
    .operating-3
      .numberbtn
        el-form(ref='form' size='mini' label-width='50px')
          el-button-group
            el-button(type='primary' size='mini' v-for="(customSubmitNum, key) in customSubmitNums" :key="key") {{ customSubmitNum }}
      .numberinput
        el-form(ref='form' size='mini' label-width='50px')
          el-form-item(label='口數:' style='margin: 6px 0 0 0;')
            el-input-number(v-model='submitNum' controls-position='right')
      .editbtn
        el-button-group
          el-button(type='primary' size='mini' @click="dialogVisible = true") 編輯
          el-button(type='primary' size='mini' @click="resetNum") 還原
        el-dialog(
          :visible.sync='dialogVisible'
          :modal='false'
          width="400px"
          title='調整數量'
          v-dialogDrag)
            .header-custom(slot='title') 調整數量
            template
              .row
                .col(v-for="(customSubmitNum, key) in customSubmitNums" :key="key")
                  el-input-number(controls-position='right' width="10px" v-model="customSubmitNums[key]")
              .row
                el-button(type='primary' size='mini' @click="setNum") 送出
                el-button(type='primary' size='mini' @click="dialogVisible = false") 取消
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
      dialogVisible: false,
      radioA: '0',
      buyType: '0',
      profit: 0,
      damage: 0,
      submitNum: 1,
      checkList: ['下單不確認'],
      defaultAllSubmit: [1, 2, 3, 4, 5],
      customSubmitNums: []
    };
  },
  mounted() {
    const customSubmitNums = this.$cookies.get('customSubmitNums')

    if (typeof customSubmitNums == 'undefined') {
      this.customSubmitNums = this.defaultAllSubmit
    } else {
      this.customSubmitNums = customSubmitNums
    }
  },
  methods: {
    setNum() {
      //set cookie
      this.$cookies.set('customSubmitNums', this.customSubmitNums)
      this.dialogVisible = false
    },
    resetNum() {
      this.customSubmitNums = this.defaultAllSubmit
      this.$cookies.set('customSubmitNums', this.defaultAllSubmit)
    }
  }
}
</script>