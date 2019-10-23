import axios from 'axios'
import Vue from 'vue'

export default {
	async CALL_API_EXAMPLE ({ commit }) {
		await axios.get("/api/apiTest.php", {
      params: {}
    })
    .then(response => {
      commit('setApiExample', response.data);
    })
	}
}