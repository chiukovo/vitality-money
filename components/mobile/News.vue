<template lang='pug'>
.modals.documents
  .header
    .header__left
      el-link(@click='$parent.systemShow = 0' icon='el-icon-arrow-left' :underline='false') 返回
    .header__title 系統公告
  .main
    .area
      ul.area-data-list
        li
          .area-data__title.hasDate
            .area-data__name 系統公告
            .area-data__date 2019-11-11
          .area-data__infor 版面D與手機版,新增技術分析版本
        li
          .area-data__title.hasDate
            .area-data__name 系統公告
            .area-data__date 2019-11-11
          .area-data__infor 此版為測試帳號,損益不列入計算,此帳號將不定時刪除交易記錄與強平
</template>

<script>

import { mapState } from 'vuex'

export default {
  data () {
    return {
      systemShow: 0,
    };
  },
  computed: mapState([
    'userInfo',
  ]),
  methods: {
    handleSystem(e) {
			this.systemShow = e
    }
  }
}
</script>