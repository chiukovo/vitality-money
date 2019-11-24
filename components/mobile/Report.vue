<template lang='pug'>
.page
  .header
    .header__title 報表查詢
  .main
    ul.nav-list
      li(@click='handleQuote(1)') 對帳表
      li(@click='handleQuote(2)') 歷史損益
      li(@click='handleQuote(3)') 儲值記錄
      li(@click='handleQuote(4)') 動作日誌
      li(@click='handleQuote(5)') 歷史報價
    //- 對帳表
    Accounting(v-if='quoteShow == 1')
    //- 歷史損益
    HistoryWinLoss(v-if='quoteShow == 2')
    //- 儲值紀錄
    StoredRecords(v-if='quoteShow == 3')
    //- 動作日誌
    ActionLog(v-if='quoteShow == 4')
    //- 歷史報價
    HistoryPrices(v-if='quoteShow == 5')
</template>

<script>

import Accounting from "~/components/mobile/Accounting"
import ActionLog from "~/components/mobile/ActionLog"
import HistoryPrices from "~/components/mobile/HistoryPrices"
import StoredRecords from "~/components/mobile/StoredRecords"
import HistoryFilters from "~/components/mobile/HistoryFilters"
import HistoryWinLoss from "~/components/mobile/HistoryWinLoss"
import { mapState } from 'vuex'
import axios from 'axios'
import qs from 'qs'

export default {
  components: {
		HistoryFilters,
    Accounting,
    ActionLog,
    HistoryPrices,
    StoredRecords,
    HistoryWinLoss
	},
  data () {
    return {
      quoteShow: 0,
			quoteShowDetail: false,
      handleQuoteConditions: false,
      product: '1',
    };
  },
  mounted() {
  },
  methods: {
    handleQuote(e) {
			this.quoteShow = e
		},
  }
}
</script>