<template lang='pug'>
.page
  .header
    .header__title 報表查詢
  .main
    ul.nav-list
      li(@click='handleQuote(1)') 對帳表
      li(@click='handleQuote(2)') 歷史損益
      li 儲值記錄
      li(@click='handleQuote(4)') 動作日誌
      li(@click='handleQuote(5)') 歷史報價
    //- 對帳表
    template(v-if='quoteShow == 1')
      .modals.quote
        .header
          .header__left
            el-link(@click='handleQuote(0)' icon='el-icon-arrow-left' :underline='false') 返回
          .header__title 對帳表
          .header__right
            el-button(size='mini' icon='el-icon-refresh-left') 刷新
        .main
          .area
            .area__header
              el-radio(label='0') 本週
              el-radio(label='1') 上週
              el-radio(label='2') 本月
              el-radio(label='3') 上月
          el-table(:highlight-current-row='true' borderstyle='width: 100%')
            el-table-column(prop='th1' label='日期' align='center' fixed)
            el-table-column(prop='th2' label='餘額' align='center')
            el-table-column(prop='th3' label='今日損益' align='center' )
            el-table-column(prop='th4' label='交收' align='center')
    //- 歷史損益
    template(v-if='quoteShow == 2')
      .modals.quote
        .header
          .header__left
            el-link(@click='handleQuote(0)' icon='el-icon-arrow-left' :underline='false') 返回
          .header__title 歷史損益
            span (-41450)
          .header__right
            el-button(size='mini' icon='el-icon-refresh-left') 刷新
        .main
          .area
            ul.area__list
              li(@click='quoteShowDetail = !quoteShowDetail') [臺指早] 口數:2 手續費:0 損益:-54800
                i.el-icon-arrow-right
              li(@click='quoteShowDetail = !quoteShowDetail') [道瓊期] 口數:1 手續費:50 損益:16300
                i.el-icon-arrow-right
            template(v-if='quoteShowDetail')
              .modals.quote__detail
                #header
                  .header
                    .header__left
                      el-link(@click='quoteShowDetail = !quoteShowDetail' icon='el-icon-arrow-left' :underline='false') 返回
                    .header__title [臺指早] 歷史損益:250
                #main.main
                  .area
                    .area__header 時間 [2019-11-11]->[2019-11-17]
                  el-table(:highlight-current-row='true' border style='width: 100%')
                    el-table-column(prop='th1' label='ID' align='center' fixed)
                    el-table-column(prop='th2' label='商品' align='center' fixed)
                    el-table-column(prop='th3' label='口' align='center' )
                    el-table-column(prop='th4' label='手續費' align='center')
                    el-table-column(prop='th5' label='損益' align='center')
    
    //- 動作日誌
    template(v-if='quoteShow == 4')
      .modals.quote
        .header
          .header__left
            el-link(@click='handleQuote(0)' icon='el-icon-arrow-left' :underline='false') 返回
          .header__title 動作日誌
          .header__right
            el-button(size='mini' icon='el-icon-refresh-left') 刷新
        .main
          .area
            ul.area-data__list
              li
                .area-data__title 登入系統
                .area-data__infor 登入系統
                .area-data__date 2019-11-11 08:44:01(39.10.99.104)
              li
                .area-data__title 取消打勾收盤平倉
                .area-data__infor 台指全
                .area-data__date 2019-11-11 06:44:01(39.10.99.104)
    //- 歷史報價
    template(v-if='quoteShow == 5')
      .modals.quote
        .header
          .header__left
            el-link(@click='handleQuote(0)' icon='el-icon-arrow-left' :underline='false') 返回
          .header__title 歷史報價(時間查詢)
          .header__right
            el-button(@click='handleQuoteConditions = !handleQuoteConditions' size='mini') 條件
        .main
          .area
            el-select(placeholder='臺指早' v-model='product' style='width: 100%;')
                el-option(label='臺指早' value='1')
          el-table(:highlight-current-row='true' border style='width: 100%')
            el-table-column(prop='th1' label='時間' align='center')
            el-table-column(prop='th2' label='口' align='center')
            el-table-column(prop='th3' label='價格' align='center' )
            el-table-column(prop='th4' label='次序' align='center')
      HistoryFilters(v-if='handleQuoteConditions == 1')
</template>

<script>

import HistoryFilters from "~/components/mobile/HistoryFilters"

import dataService from '~/plugins/service/dataService.js'
import { mapState } from 'vuex'

export default {
  components: {
		HistoryFilters
	},
  data () {
    return {
      quoteShow: 0,
			quoteShowDetail: false,
      handleQuoteConditions: false,
      product: '1'
    };
  },
  methods: {
    handleQuote(e) {
			this.quoteShow = e
		}
  }
}
</script>