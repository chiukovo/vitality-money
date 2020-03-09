import { mapState } from 'vuex'

export default {
  mounted() {
    //檢查是否token過期
    const _this = this
    const routeName = this.$nuxt.$route.name

    if (routeName != 'kchart' && routeName != 'chart') {
      //檢查是否token過期
      this.$socketOrder.onopen = function(e) {
        if (_this.$store.state.socket.reconnecting) {
          _this.$msgbox.close()
          _this.$alert('重新連線成功!')
          _this.$store.state.socket.reconnecting = false
          location.reload()
        }

        const userId = _this.$store.state.localStorage.userAuth.userId
        const token = _this.$store.state.localStorage.userAuth.token
        const isMobile = _this.$store.state.isMobile

        this.send('a:' + userId + ',' + token + ',' + isMobile)
      }

      //order websocket
      this.$socketOrder.onmessage = function(e) {
        _this.orderSendResult(e)
      }

      this.$socketOrder.onerror = function(e) {
        _this.$store.state.socket.reconnecting = true
        _this.$alert('連線異常, 重新連線中...')
      }
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
          let closeItems
          let openItems

          if (val.length > 1) {
            res = val.substring(2).split(",")
          }

          switch (type) {
            case "t":
              result = JSON.parse(val.substring(2))
              if (result['code'] > 0) {
                _this.$store.commit('setMainItem', result['data'])
                _this.getUserInfo()
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
            case "i": //收盤
              closeItems = val.substring(2).split(",")

              _this.$store.dispatch('CALL_MEMBER_ORDER_LIST')
              _this.$store.dispatch('CALL_MEMBER_INFO')

              //更新收盤
              _this.$store.commit('setMainItemClosedState', closeItems)
              break
            case "x": //商品close 通知， res[0] = 商品代碼 1=時間 2=開盤價
              //若與現在再看得走勢圖相同，則重啟走勢圖
              closeItems = val.substring(2).split(",")

              //更新收盤資料
              _this.$store.commit('setMainItemClosedData', closeItems)
              break
            case "a": //商品開盤通知， res[0] = 商品代碼 1=時間 2=開盤價
              //若與現在再看得走勢圖相同，則重啟走勢圖
              openItems = val.substring(2).split(",")

              //更新開盤資料
              _this.$store.commit('setMainItemOpenData', openItems)
              break
          }
        })
      }
    },
  },
  methods: {
    orderSendResult(event) {
      let source = event.data
      let type = "z"
      let _this = this
      let sourceFormat
      const isMobile = _this.$store.state.isMobile

      if (typeof source === "string") {
        type = source.substring(0, 1)
      }

      switch (type) {
        case "c": //下單
          const nowDate = new Date().getTime()
          sourceFormat = JSON.parse(event.data.substring(2))

          if (sourceFormat.Code <= 0) {
            if (nowDate - _this.$store.state.errorMsgDate >= 100) {
              _this.$alert(sourceFormat.ErrorMsg)
            }

            _this.$store.commit('setErrorMsgDate', nowDate)
            return
          }

          if (typeof sourceFormat.EditType == 'undefined') {
            if (_this.$store.state.localStorage.customSetting.orderReport) {
              let buyOrSellName = sourceFormat.BuyOrSell == 0 ? '多' : '空'

              //電腦版
              if (!isMobile) {
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

              //手機板
              if (isMobile) {
                let text = '下單完成，等待成交'
                _this.$store.commit('setTipsContent', {text, type: 0})
              }
            }
          }

          //call order list
          _this.$store.dispatch('CALL_MEMBER_ORDER_LIST')

          break
        case "d":
          sourceFormat = JSON.parse(event.data.substring(2))
          let buyOrSellName = sourceFormat.BuyOrSell == 0 ? '多' : '空'

          //電腦版
          if (!isMobile) {
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

          //手機板
          if (isMobile) {
            let text = '掛單成功： ' + sourceFormat.Name + ',' + sourceFormat.OrderPrice + 'x' + sourceFormat.Quantity + '口'
            _this.$store.commit('setTipsContent', {text, type: 1})
          }

          _this.$store.dispatch('CALL_MEMBER_ORDER_LIST')

          break
        //會員編輯
        case "v":
        //轉新單
        case "o":
          _this.getUserInfo()

          break
        //客服
        case "m":
          _this.$store.dispatch('CALL_SERVICE_MESSAGE')

          //閃爍
          _this.$store.commit('setHasMessage', true)
          break
        case "i": //成交
          //call order list
          _this.$store.dispatch('CALL_MEMBER_ORDER_LIST')
          sourceFormat = JSON.parse(event.data.substring(2))

          //看是否有成交提示
          const customGroup = this.$cookies.get('customGroup')
          //看是否有勾選限價成交提示
          let prompt = false

          if (typeof customGroup != 'undefined') {
            customGroup.forEach(function(val){
              if (val == 'prompt') {
                prompt = true
              }
            })
          }

          if (_this.$store.state.localStorage.customSetting.orderReport) {
            //電腦版
            if (!isMobile) {
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

            //手機板
            if (isMobile) {
              let text = '成交： ' + sourceFormat.Name + ',' + sourceFormat.SuccessPrice + 'x' + sourceFormat.Quantity + '口'
              _this.$store.commit('setTipsContent', {text, type: 1})
            }
          }

          if ((sourceFormat.SubmitType == '限價單' || sourceFormat.SubmitType == '倒限單') && prompt) {
            //電腦版
            if (!isMobile) {
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

            //手機板
            if (isMobile) {
              let text = '限價成交： ' + sourceFormat.Name + ',' + sourceFormat.SuccessPrice + 'x' + sourceFormat.Quantity + '口'
              _this.$store.commit('setTipsContent', {text, type: 1})
            }
          }

          if (_this.$store.state.localStorage.customSetting.sound) {
            _this.playSuccessSound()
          }

          if (_this.$store.state.localStorage.customSetting.clapping) {
            _this.$store.commit('setDoClapping', true)
          }

          _this.getUserInfo()

          break
        case "j": //檢查token
          sourceFormat = JSON.parse(event.data.substring(2))

          if (sourceFormat == 0 && process.env.NUXT_ENV_OPEN_REPEAT_LOGOUT != 'true') {
            _this.$alert('驗證參數已過期, 請重新登入', '提示', {
              confirmButtonText: '确定',
              callback: action => {
                _this.logout()
              }
            })
          }

          break
        case "q":
          sourceFormat = JSON.parse(event.data.substring(2))
          const table = '<p>時間: ' + sourceFormat.time + '</p>' +
          '<p>類型: ' + sourceFormat.type + '</p>' +
          '<p>金額: ' + sourceFormat.money + '</p>'

          _this.$alert(table, '儲值', {
            dangerouslyUseHTMLString: true,
            confirmButtonText: '确定',
          })

          break
        case "z":
          var fr = new FileReader();
          fr.onload = function(e) {
            var b_type = new Uint8Array(e.target.result);
            switch (b_type[0]) {
              case 114: //c 交易完成
                if (process.env.NUXT_ENV_OPEN_REPEAT_LOGOUT != 'true') {
                  _this.$alert('重複登入', '提示', {
                    confirmButtonText: '确定',
                    callback: action => {
                      _this.logout()
                    }
                  })
                }
                break;
              default:
                break;
            }
          };
          fr.readAsArrayBuffer(event.data);
          break;
      }
    }
  }
}