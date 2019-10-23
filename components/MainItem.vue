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
  	      <tr v-for="item in mainItem">
  	        <td class="text-secondary">{{ item.product_name }}</td>
  	        <td>0</td>
  	        <td><a href="#"><img src="images/table_btn_kline.jpg"></a></td>
  	        <td> <a href="#"><img src="images/table_btn_trend.jpg"></a></td>
  	        <td class="text-success">{{ item.newest_price }}</td>
  	        <td class="text-success">{{ item.bp_price }}</td>
  	        <td class="text-success">{{ item.sp_price }}</td>
  	        <td class="text-success">
  	          <div class="arrow arrow-down"></div
  	        </td>
  	        <td class="text-success"></td>
  	        <td>{{ item.total_qty }}</td>
  	        <td class="text-success">{{ item.open_price }}</td>
  	        <td class="text-success">{{ item.highest_price }}</td>
  	        <td class="text-success">{{ item.lowest_price }}</td>
  	        <td class="text-success">{{ item.yesterday_last_price }}</td>
  	        <td class="text-success">{{ item.yesterday_close_price }}</td>
  	        <td class="text-secondary"></td>
  	      </tr>
  	    </thead>
  	    <tbody>
  	    </tbody>
  	  </table>
  	</div>
  </div>
</template>
<script>

export default {
	data () {
	  return {
	    mainItem: []
	  }
	},
	computed: {
	  doneMainData () {
	    return this.$store.state.mainItem;
	  }
	},
	watch:{
    doneMainData (res) {
      this.mainItem = res
    }
	},
}
</script>