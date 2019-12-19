<template lang='pug'>
.history-content
  .history-content__header
    div(style="padding: 2px 0px;")
      button(@click="clearConfirmMsg").button 清除訊息
  .history-content__body(style="height: calc(100% - 30px)")
    .chat
      //- .chat-area.no-service 尚未啟用線上客服，請洽管理員開通。
      #chat-area.chat-area
        .message-list(v-for="message in messages")
          .from-service-group(v-if="message.FromService")
            .from-service {{ message.UserName }}:
            .from-service.chat-content {{ message.Content }}
          .from-customer-group(v-if="message.FromCustomer")
            .from-customer {{ message.UserName }}:
              span ({{ message.MessageTime }})
              |:
            .from-customer.chat-content {{ message.Content }}
      .chat-input-wrap
        input.chat-input(v-model="sendMsg" placeholder="請在此輸入文字後，點擊ENTER送出"
        @keyup.enter="send")
</template>

<script>

import { mapState } from 'vuex'
import axios from 'axios'
import qs from 'qs'

export default {
  data() {
    return {
      messages: [],
      sendMsg: '',
    }
  },
  props: ['tabShow'],
  computed: mapState({
    userAuth: state => state.localStorage.userAuth,
    lang: state => state.localStorage.lang,
    serviceMessages: 'serviceMessages'
  }),
  mounted() {
    this.$store.dispatch('CALL_SERVICE_MESSAGE')
  },
  watch: {
    serviceMessages(messages) {
      this.messages = messages
      this.scrollBottom()
    },
    tabShow() {
      this.scrollBottom()
    }
  },
  methods: {
    scrollBottom() {
      //置底
      this.$nextTick(() => {
        let content = this.$el.querySelector('#chat-area')
        if (content.scrollHeight > 0) {
          content.scrollTop = content.scrollHeight
        }
      })
    },
    clearConfirmMsg() {
      const _this = this

      this.$confirm('此操作將清除所有對話紀錄 是否繼續?', '提示', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        _this.doClear()
      }).catch(() => {
        //cancel
      })
    },
    doClear() {
      axios.post(process.env.NUXT_ENV_API_URL + "/clear_service_messages?lang=" + this.lang, qs.stringify({
        UserID: this.userAuth.userId,
        Token: this.userAuth.token,
      }))
      .then(response => {

      })
    },
    send() {
      if (this.sendMsg != '') {
        const _this = this

        axios.post(process.env.NUXT_ENV_API_URL + "/add_service_messages?lang=" + this.lang, qs.stringify({
          UserID: this.userAuth.userId,
          Token: this.userAuth.token,
          Message: this.sendMsg,
        }))
        .then(response => {
          _this.sendMsg = ''
        })
      }
    }
  }
}
</script>