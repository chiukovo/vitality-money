<template lang='pug'>
.page
  #header.header
    .header__title 單據列表
  #main.main
    ul.nav-list
      li(@click='handleDocument(1)') 買賣單據
      li(@click='handleDocument(2)') 未平倉單
      li() 已平倉單
      li 掛單
      li 商品統計
    template(v-if='documentShow == 1')
      .modals.documents
        #header
          .header
            .header__left
              el-link(@click='handleDocument(0)' icon='el-icon-arrow-left' :underline='false') 返回
            .header__title 買賣單據
            .header__right
              el-button(size='mini' icon='el-icon-refresh-left') 刷新
        #main.main
          el-table(:highlight-current-row='true' borderstyle='width: 100%')
            el-table-column(prop='th1' label='商品' align='center' fixed)
            el-table-column(prop='th2' label='操作' align='center' width='80')
              template
                .hsbutton
                  el-button(size='mini') 改
                  el-button(size='mini') 刪
            el-table-column(prop='th3' label='多空' align='center' )
            el-table-column(prop='th4' label='委託價' align='center')
            el-table-column(prop='th5' label='口數' align='center')
    template(v-if='documentShow == 2')
      .modals.documents
        #header
          .header
            .header__left
              el-link(@click='handleDocument(0)' icon='el-icon-arrow-left' :underline='false') 返回
            .header__title 未平倉單
            .header__right
              el-button(size='mini' icon='el-icon-refresh-left') 刷新
        #main.main
          .area
            .area__header
              el-button(size='mini') 全選
              el-button(size='mini') 全不選
              el-button(size='mini') 平倉
          el-table(:highlight-current-row='true' borderstyle='width: 100%')
            el-table-column(prop='th1' label='商品' align='center' fixed)
            el-table-column(prop='th2' label='操作' align='center' width='80')
              template
                .hsbutton
                  el-button(size='mini') 平倉
            el-table-column(prop='th3' label='多空' align='center' )
            el-table-column(prop='th4' label='委託價' align='center')
            el-table-column(prop='th5' label='口數' align='center')
</template>

<script>

import dataService from '~/plugins/service/dataService.js'
import { mapState } from 'vuex'

export default {
  data () {
    return {
      documentShow: 0,
    };
  },
  methods: {
    handleDocument(e) {
			this.documentShow = e
    }
  }
}
</script>