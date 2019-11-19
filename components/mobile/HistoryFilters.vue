<template lang='pug'>
.modals.conditions
  .header
    .header__left
      el-link(@click='handleQuoteConditions = !handleQuoteConditions' icon='el-icon-arrow-left' :underline='false') 取消返回
    .header__title 報價記錄條件設定
    .header__right
      el-button(size='mini') 確定
  .main
    .conditions__content
      .area
          .area__header 日期: 
            input.el-input__inner(type='date' placeholder='請選擇日期' value='2019-11-18' style='width: 60%')
      template(v-if='conditionShow == 1')
        .area.h-100
          .area__content
            .el-form-item
              .el-form-item__label 開始時間
              .el-form-item__content(style='margin-left: 80px;')
                .el-input
                  input.el-input__inner(type='time' placeholder='請選擇開始時間' value='08:45')
            .el-form-item
              .el-form-item__label 開始時間
              .el-form-item__content(style='margin-left: 80px;')
                .el-input
                  input.el-input__inner(type='time' placeholder='請選擇r結束時間' value='13:45')
      template(v-if='conditionShow == 2')
        .area.h-100
          .area__content
            .el-form-item
              .el-form-item__label 價位
              .el-form-item__content(style='margin-left: 80px;')
                .el-input
                  input.el-input__inner(type='text' placeholder='請填寫價位' value='11644')
      template(v-if='conditionShow == 3')
        .area.h-100
          .area__content
            .el-form-item
              .el-form-item__label 次序
              .el-form-item__content(style='margin-left: 80px;')
                .el-input
                  input.el-input__inner(type='text' placeholder='請填寫次序' value='0')
    ul.conditions__tab
      li(@click='handleCondition(1)' :class="{'current': conditionShow == 1}") 時間查找
      li(@click='handleCondition(2)' :class="{'current': conditionShow == 2}") 價位查找
      li(@click='handleCondition(3)' :class="{'current': conditionShow == 3}") 次序查找
</template>

<script>
export default {
  data () {
    return {
      handleQuoteConditions: true,
      conditionShow: '1'
    };
  },
  methods: {
    handleCondition(e) {
			this.conditionShow = e
		}
  }
}
</script>