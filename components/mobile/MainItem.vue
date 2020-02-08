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
    .modals.mainItem(v-show="analysisShow")
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
    client-only
      vxe-table.table(
        ref="xTable"
        :data='mainItem',
        :cell-class-name='tableCellClassName'
        @cell-click="openItemDetail"
        @scroll="vxeTableScrollEvent"
        max-width="100%"
        height="100%"
        column-min-width="90"
        size="mini"
        border
        auto-resize
        highlight-current-row)
        vxe-table-column(title='商品' width='94' fixed="left")
          template(slot-scope='scope')
            span(class="self-item-color" @click.prevent.stop="clickChart(scope.row)") {{ scope.row['product_name'] }}{{ scope.row['monthday'] }}
        vxe-table-column(title='倉位' width='60' fixed="left" align="center")
          template(slot-scope='scope' v-if="typeof $store.state.uncoveredCountDetail[scope.row['product_id']] != 'undefined'")
            <span class="bg__danger" v-if="$store.state.uncoveredCountDetail[scope.row['product_id']] > 0">{{ $store.state.uncoveredCountDetail[scope.row['product_id']] }}</span>
            <span class="bg__success" v-else>{{ Math.abs($store.state.uncoveredCountDetail[scope.row['product_id']]) }}</span>
        vxe-table-column(title='成交')
          template(slot-scope='scope')
            span(:class="scope.row['newest_price_change']") {{ scope.row['newest_price'] }}
        vxe-table-column(title='買進')
          template(slot-scope='scope') {{ scope.row['bp_price'] }}
        vxe-table-column(title='賣出')
          template(slot-scope='scope') {{ scope.row['sp_price'] }}
        vxe-table-column(title='漲跌')
          template(slot-scope='scope')
            .change-icon
              .icon-arrow(:class="scope.row['gain'] > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
            span(:class="scope.row['gain'] > 0 ? 'text__danger' : 'text__success'") {{ scope.row['gain'] }}
        vxe-table-column(title='漲跌幅')
          template(slot-scope='scope') {{ scope.row['gain_percent'] }}%
        vxe-table-column(title='總量')
          template(slot-scope='scope')
            span(:class="scope.row['total_qty_change']") {{ scope.row['total_qty'] }}
        vxe-table-column(title='開盤')
          template(slot-scope='scope') {{ scope.row['open_price'] }}
        vxe-table-column(title='最高')
          template(slot-scope='scope') {{ scope.row['highest_price'] }}
        vxe-table-column(title='最低')
          template(slot-scope='scope') {{ scope.row['lowest_price'] }}
        vxe-table-column(title='昨收盤')
          template(slot-scope='scope') {{ scope.row['yesterday_last_price']  }}
        vxe-table-column(title='昨結算')
          template(slot-scope='scope') {{ scope.row['yesterday_close_price']  }}
        vxe-table-column(title='狀態')
          template(slot-scope='scope') {{ scope.row['state_name'] }}
  .swiper-scrollbar(slot="scrollbar")
  el-dialog(
    :visible.sync="itemDetail.isOpen"
    :fullscreen='false'
    :close-on-click-modal='false'
    :modal='false'
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
  watch: {
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
    openItemDetail({ row }) {
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
    tableCellClassName({ row, column, columnIndex }) {
      //判斷整行顏色
      if(columnIndex >= 2 && columnIndex != 5 && columnIndex != 7 && columnIndex != 13) {
        return row.color
      }

      //判斷狀態
      if(columnIndex == 13 || columnIndex == 0) {
        if (row.state != 2) {
          return 'text__secondary'
        }
      }
    },
  }
}
</script>