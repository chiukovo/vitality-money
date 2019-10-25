<template>
  <div>
  	<div class="block-two mt-1 border border-primary rounded">
  	  <div class="title">報價明細[臺指早]
  	    <button class="btn-sm">查詢</button>
  	    <input type="checkbox" checked>
  	    <label>置底</label>
  	  </div>
  	  <table class="table">
  	    <thead>
  	      <tr>
  	        <th>市場時間</th>
  	        <th>口</th>
  	        <th>價格</th>
  	      </tr>
  	    </thead>
  	    <tbody>
  	    <tr v-for="item in items">
  	      <td>{{ item.flocalTime }}</td>
  	      <td>{{ item.amount }}</td>
  	      <td>{{ item.price }}</td>
  	    </tr>
  	    </tbody>
  	  </table>
  	</div>
  </div>
</template>
<script>

import { mapState } from 'vuex';

export default {
  data () {
    return {
      items: [],
      borderName: 'border border-primary'
    }
  },
  computed: mapState([
    'historyPrice',
    'clickItemId',
  ]),
  watch: {
    historyPrice (history) {
      let itemId = this.$store.state.clickItemId
      
      this.itemChange(history, itemId)
    },
    clickItemId (itemId) {
      let history = this.$store.state.historyPrice

      this.itemChange(history, itemId)
    }
  },
  methods: {
    itemChange(history, itemId) {
      if (typeof history[itemId] == 'undefined') {
        this.items = []
        return
      }

      if (history[itemId].length > 0) {
        this.items = history[itemId]
      }
    }
  }
}
</script>