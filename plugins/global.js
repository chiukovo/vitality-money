import Vue from 'vue'

Vue.mixin({
  data() {
    return {
      beforeScrollY: 0,
      beforeScrollX: 0,
    }
  },
  methods: {
    numberToPrecision(num) {
      return parseFloat(num.toPrecision(12))
    },
    vxeTableScrollEvent({ scrollTop, scrollLeft, isX, isY }) {
      if (isY) {
        this.beforeScrollY = scrollTop
      }

      if (isX) {
        this.beforeScrollX = scrollLeft
      }

      if (!isX && !isY && scrollTop == 0 && scrollLeft == 0) {
        this.$refs.xTable.scrollTo(this.beforeScrollX, this.beforeScrollY)
      }
    },
    checkDevice() {
      const isMobile = this.$device.isMobile
      const name = this.$nuxt.$route.name.split('-')

      //pc
      if (!isMobile) {
        this.$store.commit("setMobile", 0)
        this.$cookies.set('isMobile', 0)

        if (name[0] == 'mobile') {
          location.href = '/'
        }
      } else {
        this.$store.commit("setMobile", 1)
        this.$cookies.set('isMobile', 1)

        if (name[0] != 'mobile') {
          location.href = '/mobile'
        }
      }
    },
    testGlobal() {
      return 'success'
    },
    logout(isClick) {
      const returnUrl = this.$store.state.localStorage.userAuth.returnURL

      if (typeof isClick != 'undefined' && isClick) {
        //unset cookie
        this.$cookies.remove('token')
        //unset user info
        this.$store.commit('clearUserAuth')
      }

      if (returnUrl && returnUrl !== '') {
        location.href = returnUrl
      } else {
        location.href = "/"
      }
    },
    startToken() {
      const userAuth = this.$store.state.localStorage.userAuth

      if (typeof userAuth.token != 'undefined' && typeof userAuth.userId != 'undefined') {
        return 'a:' + userAuth.userId + ',' + userAuth.token
      }

      return
    },
    playSuccessSound() {
      let audio = document.getElementById('successSound')
      audio.play()
    },
    marketInfo () {
      return {
        "TW": "台灣期貨交易所",
        "SGX": "新加坡交易所",
        "CME": "芝加哥商品交易所",
        "JPX": "日本交易所集團",
        "CBOT": "芝加哥期貨交易所",
        "NYMEX": "紐約商品期貨交易所",
        "EURX": "歐洲期貨交易所",
        "HKEX": "香港交易所",
        "CFFE": "中國金融期貨交易所"
      }
    },
    allItemIds () {
      return [
        'TXF',
        'TXFAF',
        'EXF',
        'FXF',
        'TSLQ',
        'HSI',
        'HSIAF',
        'E7',
        'NK225',
        'NK225AF',
        'FDAX',
        'NQ',
        'CL',
        'GC',
        'GC',
        'SI',
        'CNAF',
        'CIF',
      ]
    },
    paramX() {
    	return 'x:TXF,TXFAF,EXF,FXF,TSLQ,HSI,HSIAF,E7,NK225,NK225AF,FDAX,YM,NQ,CL,GC,SI,CN,CNAF,CIF'
    },
    paramB() {
    	return 'h:TXF,TXFAF,EXF,FXF,TSLQ,HSI,HSIAF,E7,NK225,NK225AF,FDAX,YM,NQ,CL,GC,SI,CN,CNAF,CIF'
    },
    paramBcancelclickId(clickItemId) {
      return 'f:' + clickItemId
    },
    paramBclickId(clickItemId) {
      return 'h:' + clickItemId
    },
    formatTime (time) {
      return time.substring(0, 2) + ":" + time.substring(2, 4) + ":" + time.substring(4, 6)
    },
    formatEndDate(date) {
      return date.substring(4, 6) + "/" + date.substring(6, 8)
    },
    objectIsEmpty (obj) {
      for(let key in obj) {
        if(this.hasOwnProperty(key))
            return false;
      }
      return true;
    },
    selectDayType(type) {
      let start
      let end
      const date = new Date()
      const weekday = date.getDay() || 7

      switch (type) {
        case "today":
          end = new Date()
          end.setHours(23, 59, 59)
          start = new Date(end)
          start.setTime(end.getTime() - 3600 * 1000 * 24 + 1000)
          break
        case "yesterday":
          start = new Date()
          start.setTime(start.getTime() - 3600 * 1000 * 24 * 1)
          end = start
          break
        case "thisWeek":
          end = date.getTime()
          date.setDate(date.getDate() - weekday + 1)
          start = date.getTime()
          break
        case "beforeWeek":
          date.setDate(date.getDate() - weekday + 1)
          end = date.getTime()
          date.setDate(date.getDate() - 7)
          start = date.getTime()
          break
        case "thisMonth":
          end = date.getTime()
          date.setDate(1)
          start = date.getTime()
          break
        case "beforeMonth":
          const oneDaySeconds = 3600 * 1000 * 24
          date.setDate(1)
          end = date.getTime() - oneDaySeconds
          start = end - oneDaySeconds * 30
          break
      }

      this.form.start = this.formatDate(start)
      this.form.end = this.formatDate(end)

      this.query()
    },
    formatDate(date) {
      var d = new Date(date),
          month = '' + (d.getMonth() + 1),
          day = '' + d.getDate(),
          year = d.getFullYear()

      if (month.length < 2)
          month = '0' + month
      if (day.length < 2)
          day = '0' + day

      return [year, month, day].join('-')
    },
    getMoneyColor(target) {
      return target < 0 ? 'text__success' : 'text__danger'
    },
    findMainItemById(id) {
      const mainItem = this.$store.state.mainItem
      let target = ''

      mainItem.forEach(function(val) {
        if (id == val.product_id) {
          target = val
        }
      })

      return target
    },
    dayCoverIsDisabled(id) {
      const mainItem = this.$store.state.mainItem
      let disabled = false

      mainItem.forEach(function(val) {
        if (id == val.product_id) {
          if (val.state != 2) {
            disabled = true
          }
        }
      })

      return disabled
    }
  }
})