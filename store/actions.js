import axios from 'axios'
import Vue from 'vue'
import qs from 'qs'

export default {
  nuxtServerInit ({ commit, state }) {
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
      } else if (params.type == 'minone') {
        commit('setChartData', {
          data: response.data,
          type: params.type
        })
      }
    })
	},
}