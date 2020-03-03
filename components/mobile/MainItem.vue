<template lang="pug">
.page
  .header-userInfo(:class="userInfoHeaderShow ? 'isOpen' : ''")
    UserInfoHeader
  .header
    .header__left
      button.button.header-button(@click="costomShow = true") 自選商品
      .modals.mainItem(v-if="costomShow")
        .header
          .header__left
            el-link(icon='el-icon-arrow-left' :underline='false' @click="costomShow = false") 返回
          .header__title 編輯自選
        CustomItem
    .header__title 商品報價
    .header__right
      button.button.header-button(@click="userInfoHeaderShow = !userInfoHeaderShow")
        i(class="el-icon-user-solid" :class="checkIconColor()")
  .main.mainItem
    Dialog(
      :click-type="dialog.clickType",
      :visible.sync="dialog.isOpen"
      v-if="dialog.isOpen")
    .modals.mainItem(v-if="analysisShow")
      .header
        .header__left
          el-link(icon='el-icon-arrow-left' :underline='false' @click="analysisShow = false") 返回
        .header__right
          button.button.header-button(@click="more = !more") 更多
        .header__title
          .select.header-select
            select(v-model='selectItemId')
              option(v-for="item in mainItem" :value='item.product_id') {{ item.product_name }}
      Analysis(@close-more="more = false")
    table.custom__table.text__right(v-if="!analysisShow")
      thead.thead
        tr
          th(style="width: 80px") 商品
          th(style="width: 60px").text__center 倉位
          th 成交
          th 買進
          th 賣出
          th 漲跌
          th 漲跌幅
          th 總量
          th 開盤
          th 最高
          th 最低
          th 昨收盤
          th 昨結算
          th 狀態
      tbody.tbody(@scroll="tbodyScroll($event, false, true)")
        tr(v-for="row in mainItem" v-show="!row.row_hide" @click="openItemDetail(row)")
          td(style="width: 80px")
            span {{ row['product_name'] }}{{ row['monthday'] }}
          td(style="width: 60px")
            .cell(v-if="typeof $store.state.uncoveredCountDetail[row['product_id']] != 'undefined'")
              span.bg__danger.text__white(v-if="$store.state.uncoveredCountDetail[row['product_id']] > 0") {{ $store.state.uncoveredCountDetail[row['product_id']] }}
              span.bg__success.text__white(v-else) {{ Math.abs($store.state.uncoveredCountDetail[row['product_id']]) }}
          td
            span(:class="[row['newest_price_change'], row.computed_color]") {{ row['newest_price'] }}
          td
            span(:class="[row['bp_price_change'], row.computed_color]") {{ row['bp_price'] }}
          td
            span(:class="[row['sp_price_change'], row.computed_color]") {{ row['sp_price'] }}
          td
            .change-icon
              .icon-arrow(:class="row['gain'] > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
            span(:class="row.computed_color") {{ row['gain'] }}
          td(:class="row.computed_color") {{ row['gain_percent'] }}%
          td
            span(:class="row['total_qty_change']" class="text__info") {{ row['total_qty'] }}
          td(:class="row.computed_color") {{ row['open_price']}}
          td(:class="row.computed_color") {{ row['highest_price']}}
          td(:class="row.computed_color") {{ row['lowest_price']}}
          td(:class="row.computed_color") {{ row['yesterday_last_price'] }}
          td(:class="row.computed_color") {{ row['yesterday_close_price'] }}
          td
            span(:class="row.state_color") {{ row.state_name }}
    table.custom__table.mob__table(v-if="!analysisShow")
      thead.thead
        tr
          th 商品
      tbody.tbody
        tr(v-for="row in mainItem" v-show="!row.row_hide")
          td
            span(class="self-item-color" @click.prevent.stop="clickChart(row)" :class="row.state_color") {{ row['product_name'] }}{{ row['monthday'] }}
  .swiper-scrollbar(slot="scrollbar")
  el-dialog(
    :visible.sync="itemDetail.isOpen"
    :fullscreen='false'
    :close-on-click-modal='false'
    :modal='false'
    v-dialogDrag
    :title='itemDetail.title')
    .header-custom(slot='title')
      i.el-icon-info
      |  {{ itemDetail.title }}
    div(v-for="item in commidyArray" v-if="item.ID == rowId")
      div 商品名稱: {{ item.Name }}
      div 每點價格: {{ item.PointMoney }}
      div 持倉上限: {{ item.StoreLimit }}
      div 開放0.1口: {{ item.DecimalSubmitEnable == 1 ? '是' : '否' }}
      div 小於一口手續費: {{ item.DecimalSubmitFee }}
      div 60秒平倉手續費: {{ item.SixityFee }}
      div 手續費(進/出): {{ item.Fee }}
      div 單商品每筆上限: {{ item.SubmitMax }}
      div 單商品留倉上限: {{ item.RemaingLimit }}
      div 單商品留倉天數: {{ item.RemaingDayLimit }}
      div 開盤最大漲跌: {{ item.OpenMaxPoint }}
      div 每口最大漲跌: {{ item.SubmitMaxPoint }}
      div 停損利: {{ item.StopPoint }}
      div 禁新時間: {{ item.not_new_start_time1 }} ~ {{ item.not_new_end_time1 }}
      div 可下單時間:
        span(v-html="item.TradeTime")
      div 狀態: {{ item.State }}
      div 禁新: {{ item.NotNewPercent }}
      div 強平: {{ item.CoverPercent }}
</template>

<script>

import UserInfoHeader from "~/components/mobile/UserInfoHeader"
import CustomItem from "~/components/mobile/CustomItem"
import Analysis from "~/components/mobile/Analysis"
import Dialog from "~/components/Dialog"

import { mapState } from 'vuex'

export default {
	data () {
	  return {
      selectItemId: '',
      userInfoHeaderShow: false,
      costomShow: false,
      analysisShow: false,
      more: false,
      showItemDetail: false,
      dialog: {
        clickType: '',
        isOpen: false,
      },
      itemDetail: {
        isOpen: false,
        title: '',
      },
      rowId: ''
	  }
	},
  components: {
    UserInfoHeader,
    CustomItem,
    Analysis,
    Dialog
  },
  computed: mapState([
    'mainItem',
    'clickItemId',
    'userInfo',
    'commidyArray',
  ]),
  mounted() {
    this.computedTableContent(true)
  },
  watch: {
    analysisShow(show) {
      if (!show) {
        this.computedTableContent(true)
      }
    },
    clickItemId(id) {
      //目前選擇商品
      this.selectItemId = id
      this.$store.dispatch('CALL_QUERY_TECH', {
        'id': id,
        'type': 'chart',
        'num': 1
      })

      this.$store.dispatch('CALL_CHANGE_CHART_SYMBOL', id);
    },
    mainItem() {
      const _this = this

      setTimeout(function(){
        const success = document.querySelectorAll("#mainItemTable .vxe-cell .border__success")
        const danger = document.querySelectorAll("#mainItemTable .vxe-cell .border__danger")

        success.forEach(function(el) {
          el.classList.remove("border")
          el.classList.remove("border__success")
        })

        danger.forEach(function(el) {
          el.classList.remove("border")
          el.classList.remove("border__danger")
        })
      }, 400)
    },
    selectItemId(id) {
      let name = ''
      //找出名稱
      this.$store.state.mainItem.forEach(function(val) {
        if (val.product_id == id) {
          name = val.product_name
        }
      })

      this.preSetClickItemId(id, name)
    },
  },
  methods: {
    openItemDetail(row) {
      this.rowId = row.product_id
      this.itemDetail.isOpen = true
      this.itemDetail.title = row.product_name + row.monthday
    },
    checkIconColor() {
      if (this.userInfo.State == '正常') {
        return 'text__success'
      }

      if (this.userInfo.State == '凍結') {
        return 'text__info'
      }

      if (this.userInfo.State == '停用') {
        return 'text__danger'
      }
    },
    clickChart(row) {
      this.$store.commit('setClickItemId', {
        id: row.product_id,
        name: row.product_name
      })

      this.analysisShow = true
    },
  }
}
</script>