import Vue from 'vue'
import axios from 'axios'
import qs from 'qs'

Vue.mixin({
  data() {
    return {
      editType: '',
      changeLossPrice: 0,
      changeWinPrice: 0,
      changeInvertedPrice: 0,
      edit: {
        itemId: '',
        serial: '',
        itemName: '',
        submit: 0,
        submitMax: 0,
        buyType: '',
        sourceBuyType: '',
        buyOrSellName: '',
        nowPrice: 0,
        lossPoint: 0,
        winPoint: 0,
        invertedPoint: 0,
      },
      editPoint: {
        name: '',
        type: '',
        itemId: '',
        serial: '',
        price: 0,
        finalPrice: 0,
        computedPoint: 0,
        nowPrice: 0,
        limitWinPoint: 0,
        limitWinPrice: 0,
        limitLossPoint: 0,
        limitLossPrice: 0,
        stopPoint: 0,
        thisSerialPointDiff: 0,
        thisSerialTotalMoney: 0,
        buyOrSellName: '',
        needLimit: true,
      },
      editDialog: false,
      editDialog: false,
      deleteConfirm: false,
      multiOrderConfirm: false,
      sourceEditData: [],
      selectToDelete: [],
      multiOrderData: [],
      multiOrderSelect: [],
      multiDeleteData: [],
      multiDeleteSelect: [],
    }
  },
  methods: {
    doMultiCovered() {
      if (this.multiOrderData.length > 0) {
        let itemIdStr = ''
        let serialStr = ''
        const count = this.multiOrderData.length
        let sendText

        this.multiOrderData.forEach(function(val, key) {
          if (count == key + 1) {
            itemIdStr += val.itemId
            serialStr += val.serial
          } else {
            itemIdStr += val.itemId + ';'
            serialStr += val.serial + ';'
          }
        })

        sendText = 't:' + this.userId + ',' + serialStr + ',' + this.token + ',' + this.isMobile + ',' + itemIdStr
        this.$socketOrder.send(sendText)
      }

      this.multiOrderConfirm = false
    },
    doCovered(row, count) {
      const isMobile = this.isMobile
      const userId = this.userId
      const token = this.token
      let _this = this
      let sendText

      this.$confirm('確認平倉' + row.Name + ' 序號: ' + row.Serial + '?', '注意! ', {
        confirmButtonText: '確定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        switch (count) {
          case 1:
            sendText = 't:' + userId + ',' + row.Serial + ',' + token + ',' + isMobile + ',' + row.ID
            _this.$socketOrder.send(sendText)
            break
        }
      }).catch(() => {
      })
    },
    deleteOrder(row) {
      this.multiDeleteData = [{
        name: this.$store.state.itemName,
        userName: this.$store.state.userInfo.Account,
        buy: row.BuyOrSell == 0 ? '多' : '空',
        price: row.Odtype,
        submit: row.Quantity,
        itemId: row.ID,
        serial: row.Serial,
      }]

      //如果勾選刪單不確認
      if (this.$store.state.localStorage.customSetting.noConfirmDelete) {
        this.doDelete()
      } else {
        this.deleteConfirm = true
      }
    },
    doDelete() {
      let _this = this

      this.multiDeleteData.forEach(function(val) {
        //send
        let sendText = 'e:' + _this.userId + ',0,' + val.itemId + ',0,0,0,0,' + val.serial + ',' + _this.token + ',' + _this.isMobile
        _this.$socketOrder.send(sendText)
      })

      this.multiDeleteData = []
      this.deleteConfirm = false
    },
    openMultiDelete() {
      let _this = this
      this.multiDeleteData = []

      _this.multiDeleteSelect.forEach(function(serial) {
        _this.$store.state.buySell.forEach(function(row) {
          if (row.Serial == serial) {
            _this.multiDeleteData.push({
              name: row.Name,
              userName: _this.$store.state.userInfo.Account,
              buy: row.BuyOrSell == 0 ? '多' : '空',
              price: row.Odtype,
              submit: row.Quantity,
              itemId: row.ID,
              serial: row.Serial,
            })
          }
        })
      })

      if (this.$store.state.localStorage.customSetting.noConfirmDelete) {
        this.doDelete()
      } else {
        this.deleteConfirm = true
      }
    },
    openMultiOrder() {
      let _this = this
      this.multiOrderData = []

      _this.multiOrderSelect.forEach(function(serial) {
        _this.$store.state.uncovered.forEach(function(row) {
          if (row.Serial == serial) {
            _this.multiOrderData.push({
              name: row.Name,
              userName: _this.$store.state.userInfo.Account,
              buy: row.BuyOrSell == 0 ? '多' : '空',
              price: row.Odtype,
              submit: row.Quantity,
              itemId: row.ID,
              serial: row.Serial,
            })
          }
        })
      })

      this.multiOrderConfirm = true
    },
    multiDeleteAllClick(allChecked) {
      let _this = this

      if (!allChecked) {
        _this.multiDeleteSelect = []
        return
      }

      _this.$store.state.buySell.forEach(function(val) {
        if (val.Operation[1]) {
          _this.multiDeleteSelect.push(val.Serial)
        }
      })
    },
    multiOrderAllClick(allChecked) {
      let _this = this

      if (!allChecked) {
        _this.multiOrderSelect = []
        return
      }

      _this.multiOrderSelect = _this.$store.state.uncovered.map(function(val) {
        if (val.Operation[2]) {
          return val.Serial
        }
      })
    },
    changeDayCover(row) {
      const _this = this
      const setDayCover = row.DayCover ? 0 : 1

      axios.post(process.env.NUXT_ENV_API_URL + "/set_serial_daycover?lang=" + this.lang, qs.stringify({
        UserID: this.userId,
        Token: this.token,
        DayCover: setDayCover,
        DayCoverSerialId: row.Serial,
      }))
      .then(response => {
        _this.$store.dispatch('CALL_MEMBER_ORDER_LIST')
        _this.$store.dispatch('CALL_MEMBER_INFO')
      })
    },
    selectionChangeDelete(target) {
      let _this = this
      this.multiDeleteData = []

      target.forEach(function(row) {
        _this.multiDeleteData.push({
          name: _this.$store.state.itemName,
          userName: _this.$store.state.userInfo.Account,
          buy: row.BuyOrSell == 0 ? '多' : '空',
          price: row.Odtype,
          submit: row.Quantity,
          itemId: row.ID,
          serial: row.Serial,
        })
      })
    },
    computedPointPrice() {
      // 輸入新成交價 計算點數
      this.editPoint.price = this.editPoint.computedPoint - this.editPoint.finalPrice
    },
    openEdit(row, type) {
      this.editType = type
      this.editDialog = true
      let buyType = '0'
      //成交價
      let finalPrice = row.FinalPrice == '' ? row.OrderPrice : row.FinalPrice
      finalPrice = Number(finalPrice)

      if (row.Odtype == '限價單' || row.Inverted == '1') {
        buyType = '1'
      }

      //source data
      row.buyType = buyType
      this.sourceEditData = Object.assign({}, row)

      this.edit = {
        itemId: row.ID,
        serial: row.Serial,
        itemName: row.Name,
        submit: Number(row.Quantity),
        submitMax: Number(row.Quantity),
        buyType: buyType,
        sourceBuyType: buyType,
        buyOrSellName: row.BuyOrSell == 0 ? '多' : '空',
        nowPrice: row.OrderPrice,
        lossPoint: Number(row.LossPoint),
        winPoint: Number(row.WinPoint),
        invertedPoint: Number(row.InvertedPoint),
      }

      //行情
      if (this.edit.winPoint != 0) {
        this.changeWinPrice = this.edit.winPoint + finalPrice
      }

      if (this.edit.lossPoint != 0) {
        this.changeLossPrice = this.edit.lossPoint + finalPrice
      }
      
      if (this.edit.invertedPoint != 0) {
        this.changeInvertedPrice = this.edit.invertedPoint + finalPrice
      }
      
      this.updateEditPointData(this.sourceEditData)
    },
    doEdit() {
      let sendText

      //if 限價改市價 1 改 0
      if (this.sourceEditData.buyType == '1' && this.edit.buyType == '0') {
        sendText = 'e:' + this.userId + ',0,' + this.edit.itemId + ',0,0,0,6,' + this.edit.serial + ',' + this.token + ',' + this.isMobile
        this.$socketOrder.send(sendText)
        this.editDialog = false
      }

      //if 改數量 or 價格
      if (this.edit.submit != this.sourceEditData.Quantity || this.edit.nowPrice != this.sourceEditData.OrderPrice) {
        sendText = 'e:' + this.userId + ',' + this.edit.submit + ',' + this.edit.itemId + ',0,0,' + this.edit.nowPrice + ',2,' + this.edit.serial + ',' + this.token + ',' + this.isMobile
        this.$socketOrder.send(sendText)
        this.editDialog = false
      }

      //檢查點數部分哪些有改
      //獲利點
      if (this.edit.winPoint != this.sourceEditData.WinPoint) {
        this.editPoint.price = this.edit.winPoint
        this.doEditPoint('winPointDialog')
      }
      //損失點
      if (this.edit.lossPoint != this.sourceEditData.LossPoint) {
        this.editPoint.price = this.edit.lossPoint
        this.doEditPoint('lossPointDialog')
      }
      //倒限點
      if (this.edit.invertedPoint != this.sourceEditData.InvertedPoint) {
        this.editPoint.price = this.edit.invertedPoint
        this.doEditPoint('profitPointDialog')
      }
    },
    doEditPoint(type) {
      let sendText = ''
      const userId = this.$store.state.localStorage.userAuth.userId
      const token = this.$store.state.localStorage.userAuth.token
      const lang = this.$store.state.localStorage.lang
      const isMobile = this.$store.state.isMobile

      //判斷限制點數
      if (this.editPoint.price != 0) {
        if (type == 'profitPointDialog') {
          //倒利限
          if (this.edit.invertedPoint >= this.editPoint.limitWinPoint && this.editPoint.needLimit) {
            this.$alert('不得大於: ' + this.editPoint.limitWinPoint + '點', '警告!')
            return
          }
        }

        if (type == 'lossPointDialog') {
          //損
          if (this.edit.lossPoint < this.editPoint.limitLossPoint && this.editPoint.needLimit) {
            this.$alert('不得小於: ' + this.editPoint.limitLossPoint + '點', '警告!')
            return
          }
        }

        if (type == 'winPointDialog') {
          //利
          if (this.edit.winPoint < this.editPoint.limitWinPoint && this.editPoint.needLimit) {
            this.$alert('不得小於: ' + this.editPoint.limitWinPoint + '點', '警告!')
            return
          }
        }

        //不得小於會員最低停損點數
        if (this.editPoint.price < this.editPoint.stopPoint) {
          this.$alert('必須大於會員最低停損點數: ' + this.editPoint.stopPoint + '點', '警告!')
          return
        }
      }

      sendText = 'e:' + userId + ',0,' + this.editPoint.itemId + ','

      if (type == 'lossPointDialog') {
        sendText += '0,' + this.edit.lossPoint + ',0,3,'
      } else if (type == 'winPointDialog') {
        sendText += this.edit.winPoint + ',0,0,1,'
      } else if (type == 'profitPointDialog') {
        sendText += this.edit.invertedPoint + ',0,0,5,'
      }

      sendText += this.editPoint.serial + ',' + token + ',' + isMobile

      this.$socketOrder.send(sendText)
      this.editDialog = false
    },
    computedPointLimit() {
      const row = this.sourceEditData
      //商品現價
      const allNowPrices = this.$store.state.nowNewPrice
      let nowPrice = allNowPrices[row.ID]

      this.editPoint.nowPrice = nowPrice
      this.editPoint.thisSerialPointDiff = row.thisSerialPointDiff
      this.editPoint.thisSerialTotalMoney = row.thisSerialTotalMoney

      //買單or賣單
      const buyOrSell = row.BuyOrSell
      //成交價
      let finalPrice = row.FinalPrice == '' ? row.OrderPrice : row.FinalPrice
      //目前獲利點數
      let nowWin = 0
      //目前損失點數
      let nowLoss = 0

      //新損
      //買單的話：成交點數 - 商品現在價格
      if (buyOrSell == 0) {
        nowLoss = finalPrice - nowPrice
      } else {
        //賣單的話：商品現在價格 - 成交點數
        nowLoss = nowPrice - finalPrice
      }

      finalPrice = Number(finalPrice)

      nowLoss = nowLoss > this.editPoint.stopPoint ? nowLoss : this.editPoint.stopPoint
      nowLoss = Number(nowLoss)

      this.editPoint.limitLossPoint = nowLoss
      this.editPoint.limitLossPrice = nowLoss + finalPrice

      //新獲利
      //買單的話：商品現在價格 - 成交點數
      if (buyOrSell == 0) {
        nowWin = nowPrice - finalPrice
      } else {
        //賣單的話：成交點數 - 商品現在價格
        nowWin = finalPrice - nowPrice
      }

      nowWin = nowWin > this.editPoint.stopPoint ? nowWin : this.editPoint.stopPoint
      nowWin = Number(nowWin)

      this.editPoint.limitWinPoint = nowWin
      this.editPoint.limitWinPrice = nowWin + finalPrice
    },
    updateEditPointData(row) {
      //商品現價
      const allNowPrices = this.$store.state.nowNewPrice
      let nowPrice = allNowPrices[row.ID]

      //成交價
      let finalPrice = row.FinalPrice == '' ? row.OrderPrice : row.FinalPrice

      //沒 OrderPrice && 沒 成交價 就不用判斷了
      if (row.OrderPrice == '' && row.FinalPrice == '') {
        finalPrice = 0
        this.editPoint.needLimit = false
      }

      //目前獲利點數
      let nowWin = 0
      //目前損失點數
      let nowLoss = 0
      //會員最低停損點數
      let memberStopPoint = 0

      this.$store.state.commidyArray.forEach(function(val) {
        if (val.ID == row.ID) {
          memberStopPoint = val.StopPoint
        }
      })

      this.editPoint.name = row.Name
      this.editPoint.itemId = row.ID
      this.editPoint.serial = row.Serial
      this.editPoint.nowPrice = nowPrice
      this.editPoint.finalPrice = finalPrice
      this.editPoint.computedPoint = finalPrice
      this.editPoint.stopPoint = memberStopPoint
      this.editPoint.buyOrSellName = row.BuyOrSell == 0 ? '多' : '空'

      this.computedPointLimit()
    },
  }
})