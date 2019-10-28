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
      }
    })
	},
}