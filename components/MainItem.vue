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
          <tr v-for="item in items" :class="item.color">
  	        <td class="text-secondary">{{ item.product_name }}</td>
  	        <td>0</td>
  	        <td><a href="#"><img src="images/table_btn_kline.jpg"></a></td>
  	        <td> <a href="#"><img src="images/table_btn_trend.jpg"></a></td>
            <td>{{ item.newest_price | currency }}</td>
            <td>{{ item.bp_price | currency }}</td>
            <td>{{ item.sp_price | currency }}</td>
            <td>
              <div class="arrow arrow-top" v-if="item.gain_color == 'text-danger'"></div>
              <div class="arrow arrow-down" v-if="item.gain_color == 'text-success'"></div>
              {{ item.gain }}
            </td>
            <td>{{ item.gain_percent }}%</td>
            <td>{{ item.total_qty | currency }}</td>
            <td>{{ item.open_price | currency }}</td>
            <td >{{ item.highest_price | currency }}</td>
            <td>{{ item.lowest_price | currency }}</td>
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
      items: []
	  }
	},
  computed: mapState([
    'mainItem',
    'nowMainItem',
  ]),
	watch: {
    mainItem (res) {
      const _this = this

      //計算
      let result = res.map(function(val) {
        //顏色 昨收價 < 成交價 紅
        val.color = ''

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

        return val
      })

      this.items = JSON.parse(JSON.stringify(result))
    },
    nowMainItem (res) {
      //{商品1代號} 0
      //{商品1 第一筆成交時間} 1
      //{商品1 第一筆成交價格} 2
      //{商品1 第ㄧ筆成交量} 3
      //{商品1 第ㄧ筆成交Uniq Index} 4
      //{商品1 第二筆成交時間-第一筆成交時間} 5
      //{商品1 第二筆成交價格-第一筆成交價格} 6
      //{商品1 第二筆成交量-第一筆成交量} 7
      //{商品1 第二筆成交Uniq Index-第一筆成交Uniq Index} 8
      var itemid = res[0];
      var nowItems = res[1].split(",").map(function(item) {
        return parseInt(item, 10)
      })
    }
	},
  methods: {
  }
}
</script>