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
  	      <tr v-for="item in items" :class="item.state != 2 ? 'text-muted' : ''">
  	        <td class="text-secondary">{{ item.product_name }}</td>
  	        <td>0</td>
  	        <td><a href="#"><img src="images/table_btn_kline.jpg"></a></td>
  	        <td> <a href="#"><img src="images/table_btn_trend.jpg"></a></td>
  	        <td :class="item.newest_price_color">{{ item.newest_price | currency }}</td>
  	        <td :class="item.bp_price_color">{{ item.bp_price | currency }}</td>
  	        <td :class="item.sp_price_color">{{ item.sp_price | currency }}</td>
  	        <td :class="item.gain_color">
  	          <div class="arrow arrow-top" v-if="item.gain_color == 'text-danger'"></div>
              <div class="arrow arrow-down" v-if="item.gain_color == 'text-success'"></div>
              {{ item.gain }}
  	        </td>
  	        <td :class="item.gain_percent_color">{{ item.gain_percent }}%</td>
  	        <td :class="item.total_qty_color">{{ item.total_qty | currency }}</td>
  	        <td :class="item.open_price_color">{{ item.open_price | currency }}</td>
  	        <td :class="item.highest_price_color">{{ item.highest_price | currency }}</td>
  	        <td :class="item.lowest_price_color">{{ item.lowest_price | currency }}</td>
  	        <td :class="item.yesterday_last_price_color">{{ item.yesterday_last_price | currency }}</td>
  	        <td :class="item.yesterday_close_price_color">{{ item.yesterday_close_price | currency }}</td>
  	        <td :class="item.state != 2 ? 'text-muted' : ''">
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
  ]),
	watch:{
    mainItem (res) {
      const _this = this
      //計算
      let result = res.map(function(val) {
        //加入預設顏色
        val.newest_price_color = ''
        val.bp_price_color = ''
        val.sp_price_color = ''
        val.gain_color = ''
        val.gain_percent_color = ''
        val.total_qty_color = ''
        val.open_price_color = ''
        val.highest_price_color = ''
        val.lowest_price_color = ''
        val.yesterday_last_price_color = ''
        val.yesterday_close_price_color = ''

        val.gain = val.newest_price - val.yesterday_close_price
        //(今日收盤-昨日收盤)/昨日收盤*100%
        val.gain_percent = ((val.gain / val.yesterday_close_price) * 100).toFixed(2)
        val.state_name = val.state == 2 ? '交易中' : '未開盤'

        return val
      })

      if (this.items.length > 0) {
        //檢查與上一筆差異
        this.items = this.items.map(function(val) {
          let itemId = val.product_id

          result.forEach(function(nowData) {
            if (itemId == nowData.product_id) {
              val = _this.computedItem(val, nowData)
            }
          })

          return val
        })
      } else {
        this.items = JSON.parse(JSON.stringify(result))
      }
    },
	},
  methods: {
    computedItem (item, nowData) {
      const success = 'text-success'
      const danger = 'text-danger'

      if (item.newest_price != nowData.newest_price) {
        item.newest_price_color = item.newest_price > nowData.newest_price ? success : danger
      }
      item.newest_price = nowData.newest_price

      if (item.bp_price != nowData.bp_price) {
        item.bp_price_color = item.bp_price > nowData.bp_price ? success : danger
      }
      item.bp_price = nowData.bp_price

      if (item.sp_price != nowData.sp_price) {
        item.sp_price_color = item.sp_price > nowData.sp_price ? success : danger
      }
      item.sp_price = nowData.sp_price

      if (item.gain != nowData.gain) {
        item.gain_color = item.gain > nowData.gain ? success : danger
      }
      item.gain = nowData.gain

      if (item.gain_percent != nowData.gain_percent) {
        item.gain_percent_color = item.gain_percent > nowData.gain_percent ? success : danger
      }
      item.gain_percent = nowData.gain_percent

      if (item.total_qty != nowData.total_qty) {
        item.total_qty_color = item.total_qty > nowData.total_qty ? success : danger
      }
      item.total_qty = nowData.total_qty

      if (item.open_price != nowData.open_price) {
        item.open_price_color = item.open_price > nowData.open_price ? success : danger
      }
      item.open_price = nowData.open_price

      if (item.highest_price != nowData.highest_price) {
        item.highest_price_color = item.highest_price > nowData.highest_price ? success : danger
      }
      item.highest_price = nowData.highest_price

      if (item.lowest_price != nowData.lowest_price) {
        item.lowest_price_color = item.lowest_price > nowData.lowest_price ? success : danger
      }
      item.lowest_price = nowData.lowest_price

      if (item.yesterday_last_price != nowData.yesterday_last_price) {
        item.yesterday_last_price_color = item.yesterday_last_price > nowData.yesterday_last_price ? success : danger
      }
      item.yesterday_last_price = nowData.yesterday_last_price

      if (item.yesterday_close_price != nowData.yesterday_close_price) {
        item.yesterday_close_price_color = item.yesterday_close_price > nowData.yesterday_close_price ? success : danger
      }
      item.yesterday_close_price = nowData.yesterday_close_price

      return item
    }
  }
}
</script>