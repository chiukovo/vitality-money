<template>
  <div>
  	<div class="block-one mt-1 mx-1 border border-primary rounded">
  	  <table class="table">
  	    <thead>
  	      <tr>
  	        <th>商品</th>
  	        <th>倉位</th>
  	        <th>K線</th>
  	        <th>走勢</th>
  	        <th>成交</th>
  	        <th>買進</th>
  	        <th>賣出</th>
  	        <th>漲跌</th>
  	        <th>漲跌幅</th>
  	        <th>總量</th>
  	        <th>開盤</th>
  	        <th>最高</th>
  	        <th>最低</th>
  	        <th>昨收盤</th>
  	        <th>昨結算</th>
  	        <th>狀態</th>
  	      </tr>
          <tr v-for="item in items" :class="item.color" @click="clickItem(item)">
  	        <td class="text-secondary">{{ item.product_name }}</td>
  	        <td>0</td>
  	        <td><a href="#"><img src="images/table_btn_kline.jpg"></a></td>
  	        <td> <a href="#"><img src="images/table_btn_trend.jpg"></a></td>
            <td :class="item.newest_price_change">{{ item.newest_price | currency }}</td>
            <td :class="item.bp_price_change">{{ item.bp_price | currency }}</td>
            <td :class="item.sp_price_change">{{ item.sp_price | currency }}</td>
            <td>
              <div class="arrow arrow-top" v-if="item.gain_color == 'text-danger'"></div>
              <div class="arrow arrow-down" v-if="item.gain_color == 'text-success'"></div>
              {{ item.gain }}
            </td>
            <td>{{ item.gain_percent }}%</td>
            <td :class="item.total_qty_change">{{ item.total_qty | currency }}</td>
            <td>{{ item.open_price | currency }}</td>
            <td :class="item.highest_price_change">{{ item.highest_price | currency }}</td>
            <td :class="item.lowest_price_change">{{ item.lowest_price | currency }}</td>
            <td>{{ item.yesterday_last_price | currency }}</td>
            <td>{{ item.yesterday_close_price | currency }}</td>
  	        <td>
              {{ item.state_name }}
            </td>
  	      </tr>
  	    </thead>
  	    <tbody>
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
    'mainItem',
    'nowMainItem',
    'nowFiveMoney',
    'clickItemId',
  ]),
	watch: {
    clickItemId (id) {

    },
    mainItem (res) {
      const _this = this
      let result = []
      //計算
      res.forEach(function(val) {
        //顏色 昨收價 < 成交價 紅
        val.color = ''
        val.newest_price_change = ''
        val.bp_price_change = ''
        val.sp_price_change = ''
        val.total_qty_change = ''
        val.highest_price_change = ''
        val.lowest_price_change = ''

        if (val.state == 2) {
          if (val.newest_price > val.yesterday_close_price) {
            val.color = 'text-danger'
          } else if (val.newest_price < val.yesterday_close_price) {
            val.color = 'text-success'
          }

        } else {
          val.color = 'text-muted'
        }

        val.gain = val.newest_price - val.yesterday_close_price
        //(成交價-昨日收盤)/昨日收盤*100%
        val.gain_percent = ((val.gain / val.yesterday_close_price) * 100).toFixed(2)
        val.state_name = val.state == 2 ? '交易中' : '未開盤'

        result.push(val)
      })

      this.items = JSON.parse(JSON.stringify(result))
    },
    nowMainItem (res) {
      //{商品1 第一筆成交時間} 0
      //{商品1 第一筆成交價格} 1
      //{商品1 第ㄧ筆成交量} 2
      //{商品1 第ㄧ筆成交Uniq Index} 3
      //{商品1 第二筆成交時間-第一筆成交時間} 4
      //{商品1 第二筆成交價格-第一筆成交價格} 5
      //{商品1 第二筆成交量-第一筆成交量} 6
      //{商品1 第二筆成交Uniq Index-第一筆成交Uniq Index} 7
      const _this = this
      let itemId = res[0];
      let nowItems = res[1].split(",").map(function(item) {
        return parseInt(item, 10)
      })

      this.items = this.items.map(function (val) {
        if (itemId == val.product_id) {
          //計算
          let dindex = 0;
          let prices = []
          let localTime = (nowItems[0] < 10000000) ? "0" + nowItems[0] / 100 : "" + nowItems[0] / 100
          let flocalTime = _this.formatTime(localTime)

          //最高
          if (val.highest_price < nowItems[1]) {
            val.highest_price = nowItems[1]
            val.highest_price_change = _this.borderName
          } else {
            val.highest_price_change = ''
          }

          //最低
          if (val.lowest_price > nowItems[1]) {
            val.lowest_price = nowItems[1]
            val.lowest_price_change = _this.borderName
          } else {
            val.lowest_price_change = ''
          }

          while(dindex < nowItems.length) {
            if(dindex > 0 && dindex + 3 < nowItems.length) {
              nowItems[0] += nowItems[dindex]
              nowItems[1] += nowItems[dindex + 1]
              nowItems[2] += nowItems[dindex + 2]
              nowItems[3] += nowItems[dindex + 3]
            }

            prices.push([nowItems[2], nowItems[1]])

            dindex += 4;
          }
          //總量
          val.total_qty += nowItems[2]
          val.total_qty_change = nowItems[2] == 0 ? '' : _this.borderName
          //成交
          val.newest_price_change = val.newest_price == nowItems[1] ? '' : _this.borderName
          val.newest_price = nowItems[1]
          //漲跌
          val.gain = val.newest_price - val.yesterday_close_price
          //(成交價-昨日收盤)/昨日收盤*100%
          val.gain_percent = ((val.gain / val.yesterday_close_price) * 100).toFixed(2)

          _this.$store.commit('setHistoryPrice', {itemId, prices, flocalTime});
        }

        return val
      })
    },
    nowFiveMoney (five) {
      //陣列第[3]：第一筆買價
      //陣列第[13]：第一筆賣價
      const _this = this
      let fiveMax = 0;
      let itemId = five[0];
      let buyCount = five[1];
      let sellCount = five[2];
      let buy = 0;
      let sell = 0;

      this.items = this.items.map(function (val) {
        if (itemId == val.product_id) {

          val.bp_price_change = val.bp_price == five[3] ? '' : _this.borderName
          val.bp_price = five[3]

          val.sp_price_change = val.sp_price == five[13] ? '' : _this.borderName
          val.sp_price = five[13]
        }

        return val
      })
    }
	},
  methods: {
    clickItem(item) {
      this.$store.commit('setClickItemId', item.product_id)
    }
  }
}
</script>