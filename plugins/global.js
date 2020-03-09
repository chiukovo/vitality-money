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
      let isMobile = this.$device.isMobileOrTablet
      const name = this.$nuxt.$route.name.split('-')
      const UA = navigator.userAgent

      //ipad判斷為手機板
      if (/iPad|iPod/i.test(UA)) {
        isMobile = true
      }

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
        let targetUrl = '/'

        if (this.$store.state.isMobile) {
          targetUrl = '/mobile'
        }

        location.href = targetUrl
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
      return target < 0 ? 'text__danger' : 'text__info'
    },
    getSourceMoneyColor(target) {
      return target < 0 ? 'text__success' : 'text__danger'
    },
    dateOnlyHis(date) {
      const format = date.split(" ")

      if (typeof format[1] != "undefined") {
        return format[1]
      } else {
        return date
      }
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
    },
    preSetClickItemId(id, name) {
      //開始新的
      this.$store.commit('setClickItemId', {
        id: id,
        name: name
      })

      this.$store.dispatch('CALL_QUERY_TECH', {
        'id': id,
        'type': 'chart',
        'num': 1
      })

      this.$store.dispatch('CALL_CHANGE_CHART_SYMBOL', id)

      //計算
      this.computedTableContent()
    },
    checkBuySellColor(row) {
      return row['BuyOrSell'] == 0 ? 'text__danger' : 'text__success'
    },
    showErrorMsg(msg) {
      this.$alert(msg, 'Api Server Error', {
        type: 'error'
      })
    },
    trClick(event) {
      const target = event.target.closest('tr')

      let other = target.parentNode.querySelectorAll('tr')

      //other rm class
      for (let num = 0; num < other.length; num++) {
        other[num].classList.remove("current")
      }

      target.classList.add("current")
    },
    tbodyScroll(event, fixedLeft, mobMain) {
      const target = event.target.parentNode

      if (target == null) {
        return
      }

      //tbody scrollleft
      let tbody = target.querySelector('.custom__table .tbody')
      let thead = target.querySelector('.custom__table .thead')
      let tbodyFirst = target.querySelectorAll('.custom__table .tbody td:nth-child(1)')
      let theadFirst = target.querySelector('.custom__table .thead th:nth-child(1)')

      if (tbody == null) {
        return
      }

      if (mobMain) {
        let fakeTbody = document.querySelector('.mob__table .tbody')
        let realTbody = document.querySelector('.custom__table .tbody')

        fakeTbody.scrollTop = tbody.scrollTop
        realTbody.scrollTop = tbody.scrollTop
      }

      const scrollLeft = tbody.scrollLeft

      thead.style.left = '-' + scrollLeft + 'px'

      if (fixedLeft) {
        theadFirst.style.left = scrollLeft + 'px'
        for (let num = 0; num < tbodyFirst.length; num++) {
          tbodyFirst[num].style.left = scrollLeft + 'px'
        }
      }
    },
    computedTableContent(isMobMain) {
      const _this = this

      setTimeout(function() {
        let target = document.querySelectorAll('.custom__table')
        let content = null
        let tbody
        let thead
        let w = 0
        let h = 0
        let fontStyle = 0

        if (target.length > 0) {
          target.forEach(function(el) {
            let num = 0
            content = el.parentNode
            tbody = content.querySelector('.custom__table .tbody')
            thead = content.querySelector('.custom__table .thead')

            if (content == null || tbody == null || thead == null) {
              return
            }

            w = content.offsetWidth
            h = content.offsetHeight

            if (w == 0 && h == 0) {
              return
            }

            //only scrollY
            if (tbody.scrollHeight > content.clientHeight && tbody.scrollWidth < content.clientWidth) {
              num = 16
            }

            if (isMobMain) {
              let fakeTable = document.querySelector('.mob__table')
              let fakeTbody = fakeTable.querySelector('.tbody')

              fakeTable.style.top = el.offsetTop + 'px'
              fakeTbody.style.height = h - thead.offsetHeight + 'px'
            }

            if (w + 'px' == tbody.style.width && (w - num) + 'px' == thead.style.width) {
              if (tbody.style.height == h - thead.offsetHeight + 'px' && num == 0) {
                return
              }
            }

            tbody.style.width = w + 'px'
            thead.style.width = (w - num) + 'px'
            tbody.style.height = h - thead.offsetHeight + 'px'
          })
        }
       }, 200)
    },
  }
})