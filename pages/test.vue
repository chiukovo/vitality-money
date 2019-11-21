<template lang='pug'>
  .container-fluid
    #header.header
    #main.main()
      #mainRight.main-right
        client-only
          vxe-table(
            :data="$store.state.mainItem"
            :cell-class-name='tableCellClassName'
            border
            max-width="100%"
            max-height="500px"
            resizable
            highlight-current-row
          )
            vxe-table-column(title='商品', fixed)
              template(slot-scope='scope') {{ scope.row['product_name'] }}
            vxe-table-column(title='倉位', fixed width="50px")
              template(slot-scope='scope' v-if="typeof $store.state.uncoveredCountDetail[scope.row['product_id']] != 'undefined'")
                <span class="bg-red" v-if="$store.state.uncoveredCountDetail[scope.row['product_id']] > 0">{{ $store.state.uncoveredCountDetail[scope.row['product_id']] }}</span>
                <span class="bg-green" v-else>{{ $store.state.uncoveredCountDetail[scope.row['product_id']] }}</span>
            vxe-table-column(title='成交')
              template(slot-scope='scope') {{ scope.row['newest_price'] | currency }}
            vxe-table-column(title='買進')
              template(slot-scope='scope') {{ scope.row['bp_price'] | currency }}
            vxe-table-column(title='賣出')
              template(slot-scope='scope') {{ scope.row['sp_price'] | currency}}
            vxe-table-column(title='漲跌')
              template(slot-scope='scope')
                .table-icon
                  .icon-arrow(:class="scope.row['gain'] > 0 ? 'icon-arrow-up' : 'icon-arrow-down'")
                span {{ scope.row['gain'] }}
            vxe-table-column(title='漲跌幅')
              template(slot-scope='scope') {{ scope.row['gain_percent'] }}%
            vxe-table-column(title='總量')
              template(slot-scope='scope') {{ scope.row['total_qty'] | currency}}
            vxe-table-column(title='開盤')
              template(slot-scope='scope') {{ scope.row['open_price'] | currency}}
            vxe-table-column(title='最高')
              template(slot-scope='scope') {{ scope.row['highest_price'] | currency}}
            vxe-table-column(title='最低')
              template(slot-scope='scope') {{ scope.row['lowest_price'] | currency}}
            vxe-table-column(title='昨收盤')
              template(slot-scope='scope') {{ scope.row['yesterday_last_price'] | currency }}
            vxe-table-column(title='昨結算')
              template(slot-scope='scope') {{ scope.row['yesterday_close_price'] | currency }}
            vxe-table-column(title='狀態' fixed="right")
              template(slot-scope='scope') {{ scope.row['state_name'] }}
</template>
<script>

import websocketService from '~/plugins/service/websocketService.js'
import MainItem from "~/components/MainItem"
import { mapState } from 'vuex'
import '@/assets/sass/style.scss'
import '@/assets/scss/style.scss'

export default {
	head() {
	  return {
	    htmlAttrs: {
	      class: this.$store.state.customStyle.htmlClass
	    }
	  }
	},
	middleware: 'serverAuth',
	data() {
		return {
			mainStyles: {},
			itemDetailStyles: {},
			ItemDetailTable: 0,
      itemDetailTableFive: 314,
			mainItemTable: '400px',
			historyTableMaxH: 0,
			history: 0,
      dragMidStart: false,
      dragLeftStart: false,
      dragLeftTopStart: false,
      dragY: 0,
      dragX: 0,
      sumX: 0,
      sumY: 0,
      first: true,
		}
	},
	mixins: [websocketService],
	components: {
		MainItem,
	},
  computed: {
    items0() {
      return this.$store.state.items0
    }
  },
  watch: {
    items0(items0) {
      if (this.first) {

        this.first = false
      }
    }
  },
  mounted() {
    let _this = this
	},
  methods: {
    tableCellClassName({ row, column, columnIndex }) {
      //判斷個別顏色
      if(columnIndex == 4) {
        return row.color + ' ' + row.newest_price_change
      }

      if(columnIndex == 5) {
        return row.color + ' ' + row.bp_price_change
      }

      if(columnIndex == 6) {
        return row.color + ' ' + row.sp_price_change
      }

      if(columnIndex == 9) {
        return row.total_qty_change
      }

      if(columnIndex == 11) {
        return row.color + ' ' + row.highest_price_change
      }

      if(columnIndex == 12) {
        return row.color + ' ' + row.lowest_price_change
      }

      //判斷整行顏色
      if(columnIndex >= 4 && columnIndex != 9 && columnIndex != 15) {
        return row.color
      }

      //判斷狀態
      if(columnIndex == 15) {
        if (row.state != 2) {
          return 'text-secondary'
        }
      }
    },
  }
}
</script>