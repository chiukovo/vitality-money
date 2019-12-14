import axios from 'axios'
import Vue from 'vue'
import qs from 'qs'

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

    await axios.post("/api/query_orderlist?lang=" + lang, qs.stringify({
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

    await axios.post("/api/query_member_setting", qs.stringify({
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

    await axios.post("/api/set_close_cover_all?lang=" + lang, qs.stringify({
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

    await axios.post("/api/query_member_and_commoditylist?lang=" + lang, qs.stringify({
      UserID: userId,
      Token: token,
    }))
    .then(response => {
      const result = response.data

      if (result['Code'] > 0) {
        commit('setUserInfo', result)
      } else {
        //logout
      }
    })
  },
	async CALL_QUERY_TECH ({ commit, state }, params) {
		await axios.post("/api/query_tech?lang=" + state.localStorage.lang, qs.stringify({
        userID: state.localStorage.userAuth.userId,
        Token: state.localStorage.userAuth.token,
      	Params: params.id + ',minone,' + params.num + ',' + params.type,
    }))
    .then(response => {
      if (params.type == 'kline') {
        commit('setkLineData', {
          data: response.data,
          type: params.type
        })
      } else if (params.type == 'chart') {
        commit('setChartData', {
          data: response.data,
          type: params.type
        })
      }
    })
	},
}