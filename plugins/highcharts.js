import Vue from 'vue'
import HighchartsVue from "highcharts-vue";
import Highcharts from "highcharts"
import stockInit from 'highcharts/modules/stock'
import mapInit from 'highcharts/modules/map'

if (typeof Highcharts === 'object') {
	Highcharts.setOptions({
		global: {
			useUTC: false
		}
	})

  stockInit(Highcharts)
  mapInit(Highcharts)
}

Vue.use(HighchartsVue)