import { mapState } from 'vuex'

export default {
  mounted() {
    //檢查是否token過期
    const _this = this

    //檢查是否token過期
    this.$socketOrder.onopen = function(e) {
      const userId = _this.$store.state.localStorage.userAuth.userId
      const token = _this.$store.state.localStorage.userAuth.token
      const isMobile = _this.$store.state.isMobile

      this.send('a:' + userId + ',' + token + ',' + isMobile)
    }

    //order websocket
    this.$socketOrder.onmessage = function(e) {
      _this.orderSendResult(e)
    }
  },
  computed: {
    websocketConnected () {
      return this.$store.state.socket.isConnected
    },
    sendResult () {
      return this.$store.state.socket.message
    }
  },
  watch: {
    websocketConnected () {
      let isConnected = this.$store.state.socket.isConnected

      if (isConnected) {
        //商品列表
        this.$socket.send(this.startToken())
      }
    },
    sendResult () {
      let source = this.$store.state.socket.message.data
      let _this = this

      if (typeof source !== "string") {
        console.log('websock fail')
        return;
      }

      let sourceFormat = source.split("&")

      if (sourceFormat.length > 0) {
        sourceFormat.forEach(function(val) {
          let type = val.substring(0, 1)
          let res
          let result

          if (val.length > 1) {
            res = val.substring(2).split(",")
          }

          switch (type) {
            case "t":
              result = JSON.parse(val.substring(2))
              if (result['code'] > 0) {
                _this.$store.commit('setMainItem', result['data'])

                //取得自定義商品開關
                _this.$store.dispatch('CALL_MEMBER_CUSTOM_ITEM', {
                  defaultData: result['data'],
                  marketInfo: _this.marketInfo()
                })
              }

              //呼叫即時資料
              _this.$socket.send(_this.paramX())
              break
            case "d":
              //商品現價通知
              result = val.substring(2).split(";")

              if(result.length > 1) {
                _this.$store.commit('setUpdateMainItem', result)
              }

              break
            case "b": //註冊商品即時五檔報價
              result = val.substring(2).split(",")

              if(result.length > 1) {
                _this.$store.commit('setNowFiveMoney', result)
              }

              break
            case "c": //下單
              result = val.substring(2).split(",")
              break
          }
        })
      }
    },
  },
  methods: {
    orderSendResult(event) {
      let source = event.data
      let type = 0
      let _this = this
      let sourceFormat

      if (typeof source === "string") {
        type = source.substring(0, 1)
      }

      switch (type) {
        case "c": //下單
          sourceFormat = JSON.parse(event.data.substring(2))

          if (sourceFormat.Code <= 0) {
            _this.$alert(sourceFormat.ErrorMsg)
            return
          }

          if (typeof sourceFormat.EditType == 'undefined') {
            if (_this.$store.state.localStorage.customSetting.orderReport) {
              let buyOrSellName = sourceFormat.BuyOrSell == 0 ? '多' : '空'

              _this.$notify({
                title: '下單回報',
                type: 'success',
                dangerouslyUseHTMLString: true,
                position: 'bottom-right',
                message:
                '<p>序號: ' + sourceFormat.Serial + '</p>' +
                '<p>種類: ' + sourceFormat.Odtype + '</p>' +
                '<p>多空: ' + buyOrSellName + '</p>' +
                '<p>商品: ' + sourceFormat.Name + '</p>' +
                '<p>狀態: 觸發中' +
                '<p>口數: ' + sourceFormat.Quantity + '</p>'
              })
            }
          }

          //call order list
          _this.$store.dispatch('CALL_MEMBER_ORDER_LIST')

          break
        case "d":
          _this.$store.dispatch('CALL_MEMBER_ORDER_LIST')

          break
        case "i": //成交
          //call order list
          _this.$store.dispatch('CALL_MEMBER_ORDER_LIST')

          sourceFormat = JSON.parse(event.data.substring(2))
          //看是否有成交提示
          const customGroup = this.$cookies.get('customGroup')
          //看是否有勾選限價成交提示
          let prompt = false

          customGroup.forEach(function(val){
            if (val == 'prompt') {
              prompt = true
            }
          })

          if (_this.$store.state.localStorage.customSetting.orderReport || _this.$store.state.isMobile) {
            let buyOrSellName = sourceFormat.BuyOrSell == 0 ? '多' : '空'

            _this.$notify({
              title: '成交提示',
              type: 'success',
              dangerouslyUseHTMLString: true,
              position: 'bottom-right',
              message:
              '<p>序號: ' + sourceFormat.Serial + '</p>' +
              '<p>類別: ' + sourceFormat.SubmitType + '</p>' +
              '<p>商品: ' + sourceFormat.Name + '</p>' +
              '<p>狀態: 成交' +
              '<p>口數: ' + sourceFormat.Quantity + '</p>' +
              '<p>價格: ' + sourceFormat.SuccessPrice + '</p>'
            })
          }

          if ((sourceFormat.SubmitType == '限價單' || sourceFormat.SubmitType == '倒限單') && prompt) {
            _this.$notify({
              title: '限價成交提示',
              type: 'success',
              dangerouslyUseHTMLString: true,
              message:
              '<p>序號: ' + sourceFormat.Serial + '</p>' +
              '<p>類別: ' + sourceFormat.SubmitType + '</p>' +
              '<p>商品: ' + sourceFormat.Name + '</p>' +
              '<p>狀態: 成交' +
              '<p>口數: ' + sourceFormat.Quantity + '</p>' +
              '<p>價格: ' + sourceFormat.SuccessPrice + '</p>'
            })
          }

          if (_this.$store.state.localStorage.customSetting.sound) {
            _this.playSuccessSound()
          }

          break
        case "j": //檢查token
          sourceFormat = JSON.parse(event.data.substring(2))

          if (sourceFormat == 0 && process.env.NUXT_ENV_OPEN_REPEAT_LOGOUT != 'true') {
            _this.$alert('重複登入', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                location.href = "/"
              }
            })
          }

          break
      }
    }
  }
}