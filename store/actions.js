import axios from 'axios'
import Vue from 'vue'
import qs from 'qs'

const createData = function(data_array) {
	//初始化 目前最新的資料
	const k_data = []
	var history_data = data_array.split(";")
	var history_item, the_date_time
	//日期，時間，開，高，低，收，量；日期，時間，開，高，低，收，量；．．．．
	if (history_data.length > 1) {
		for (var i in history_data) {
			history_item = history_data[i].split(",")
			if (history_item.length < 6 || parseInt(history_item[2]) <= 0 || parseInt(history_item[3]) <= 0 || parseInt(history_item[4]) <= 0 || parseInt(history_item[5]) <= 0) {
				continue
			}

			the_date_time = new Date(history_item[0] + " " + history_item[1]).getTime()
			if (isNaN(the_date_time)) {
				continue
			}
			k_data.push([
				the_date_time,
				parseInt(history_item[2]),
				parseInt(history_item[3]),
				parseInt(history_item[4]),
				parseInt(history_item[5]),
				parseInt(history_item[6])
			])
		}
	}

	return k_data
}

export default {
  nuxtServerInit ({ commit, state }, { req, redirect }) {
  },
	async CALL_API_EXAMPLE ({ commit }) {
		await axios.get("/api/apiTest.php", {
      params: {}
    })
    .then(response => {
      commit('setApiExample', response.data)
    })
	},
  async CALL_MEMBER_ORDER_LIST ({ commit, state }) {
    const lang = state.localStorage.lang
    const userId = state.localStorage.userAuth.userId
    const token = state.localStorage.userAuth.token

    await axios.post(process.env.NUXT_ENV_API_URL + "/query_orderlist?lang=" + lang, qs.stringify({
      UserID: userId,
      Token: token,
    }))
    .then(response => {
      const result = response.data

      if (result['Code'] > 0) {
        commit('setUserOrder', result)
      }
    })
  },
  async CALL_MEMBER_CUSTOM_ITEM ({ commit, state }, { defaultData, marketInfo }) {
    const userId = state.localStorage.userAuth.userId
    const token = state.localStorage.userAuth.token

    await axios.post(process.env.NUXT_ENV_API_URL + "//query_member_setting", qs.stringify({
      UserID: userId,
      Token: token,
    }))
    .then(response => {
      const result = response.data

      if (result.Code == 1) {
        //有值
        if (result.UserSettingData != '{}') {
          const customItemSetting = JSON.parse(result.UserSettingData)
          commit('setCustomItemSetting', customItemSetting)

        } else {
          //default
          let newDefaultData = []

          defaultData.forEach(function(val) {
            let newVal = {
              id: val.product_id,
              name: val.product_name,
              trade_time: val.open_date_time.split(' ')[1] + ' ~ ' + val.close_date_time.split(' ')[1],
              market_name: marketInfo[val.market],
              show: true
            }

            newDefaultData.push(newVal)
          })

          commit('setCustomItemSetting', newDefaultData)
        }
      }
    })
  },
  async CALL_SET_CLOSE_OVER_ALL ({ commit, state }, { overall }) {
    const lang = state.localStorage.lang
    const userId = state.localStorage.userAuth.userId
    const token = state.localStorage.userAuth.token
    const itemId = state.clickItemId

    await axios.post(process.env.NUXT_ENV_API_URL + "//set_close_cover_all?lang=" + lang, qs.stringify({
      UserID: userId,
      Token: token,
      SetCloseCover: overall,
      SetCloseCommodity: itemId,
    }))
    .then(response => {
    })
  },
  async CALL_MEMBER_INFO ({ commit, state }) {
    const lang = state.localStorage.lang
    const userId = state.localStorage.userAuth.userId
    const token = state.localStorage.userAuth.token
    const _this = this

    await axios.post(process.env.NUXT_ENV_API_URL + "//query_member_and_commoditylist?lang=" + lang, qs.stringify({
      UserID: userId,
      Token: token,
    }))
    .then(response => {
      const result = response.data

      if (result['Code'] > 0) {
        //錯誤id or token
        if (result.UserArray.length == 0 && result.CommidyArray.length == 0) {
          commit('setuserAuth', [])
          const returnUrl = _this.$cookies.get('ReturnURL')

          if (typeof returnUrl != 'undefined' && returnUrl != '') {
            location.href = returnUrl
          } else {
            location.href = "/"
          }
        }

        commit('setUserInfo', result)
      } else {
        //logout
      }
    })
  },
	async CALL_QUERY_TECH ({ commit, state }, params) {
    commit('setChartId', '')

		await axios.post(process.env.NUXT_ENV_API_URL + "//query_tech?lang=" + state.localStorage.lang, qs.stringify({
        userID: state.localStorage.userAuth.userId,
        Token: state.localStorage.userAuth.token,
      	Params: params.id + ',minone,' + params.num + ',' + params.type,
    }))
    .then(response => {
      if (params.type == 'chart') {
        commit('setChartData', {
          id: params.id,
          data: response.data,
          type: params.type
        })
      }
    })
  },
  async CALL_CHANGE_CHART_SYMBOL ({ commit, state }, id) {
    const comMarket = {
      'TXF': 'TW',
      'EXF': 'TW',
      'FXF': 'TW',
      'TXFAF': 'TW',
      'TSLQ': 'TW',
      'HSI': 'HKEX',
      'HSIAF': 'HKEX',
      'CN': 'SGX',
      'CNAF': 'SGX',
      'NK225': 'SGX',
      'NK225AF': 'SGX',
      'E7': 'CME',
      'SI': 'NYMEX',
      'GC': 'NYMEX',
      'FDAX': 'EURX',
      'NQ': 'CME',
      'YM': 'CBOT',
      'CL': 'NYMEX',
      'CIF': 'CFFE',
    }

    const symbol = `${comMarket[id]}:${id}`
    commit('setTradingViewSymbol', symbol)
    if (state.tdChart) {
      state.tdChart.chart().setSymbol(symbol)
    }
  },
  async CALL_QUERY_NEW_TECH ({ commit, state }, {
    params,
    onHistoryCallback,
    max,
  }) {
		await axios.post(process.env.NUXT_ENV_API_URL + "//query_tech?lang=" + state.localStorage.lang, qs.stringify({
        userID: state.localStorage.userAuth.userId,
        Token: state.localStorage.userAuth.token,
      	Params: params,
    }))
    .then(response => {
      let bars = []
      if (response.data.Tech.length) {
        const barData = createData(response.data.Tech)
        commit('setkLineData', barData)

        bars =  barData.map(el => {
          return {
            time: el[0], //TradingView requires bar time in ms
            low: el[3],
            high: el[2],
            open: el[1],
            close: el[4],
            volume: el[5]
          }
        })
      }


      if (bars.length && bars[0].time / 1000 <= max ) {
        onHistoryCallback(bars, {noData: false})
      } else {
        onHistoryCallback([], {noData: true})
      }
    })
	},
  CALL_SERVICE_MESSAGE ({ commit, state }) {
    const lang = state.localStorage.lang
    const userId = state.localStorage.userAuth.userId
    const token = state.localStorage.userAuth.token

    axios.post(process.env.NUXT_ENV_API_URL + "/query_service_messages?lang=" + lang, qs.stringify({
      UserID: userId,
      Token: token,
    }))
    .then(response => {
      const result = response.data

      if (result.Code == 1) {
        commit('setServiceMessages', result.MessageArray)
      }
    })
  },
}