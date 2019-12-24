import Vue from 'vue'

console.log('v1.0.2')

Vue.mixin({
  methods: {
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
    startToken() {
      return 'a:test,test'
    },
    playSuccessSound() {
      let audio = document.getElementById('successSound')
      audio.play()
    },
    dragMousemove(e) {
      this.dragY = e.pageY
      this.dragX = e.pageX
    },
    leftTopDragbarMove(e) {
      const windowHeight = window.innerHeight
      const headHeight = this.$el.querySelector('#header').offsetHeight
      const footHeight = this.$el.querySelector('#footer').offsetHeight
      const main = windowHeight - headHeight - footHeight - 20
      let leftTopDragbar = document.getElementById('leftTopDragbar')

      let userInfo = document.getElementById('userInfo')
      let itemDetail = document.getElementById('itemDetail')

      //限制最小高度
      let resultUserInfo = e.pageY - headHeight - leftTopDragbar.offsetHeight
      let source = windowHeight - headHeight - footHeight - 80
      resultUserInfo = resultUserInfo < 194 ? 194 : resultUserInfo
      let resultItemDetail = source - resultUserInfo

      if (this.windowHeight > 750) {
        resultUserInfo = resultUserInfo > 362 ? 362 : resultUserInfo
        resultItemDetail = source - resultUserInfo
      }

      resultItemDetail = resultItemDetail > 601 ? 601 : resultItemDetail

      this.$el.querySelector('#userInfo .userInfo').style.height = resultUserInfo + 'px'
      this.$el.querySelector('#itemDetail .el-tabs').style.height = resultItemDetail + 'px'
      this.$el.querySelector('#itemDetail').style.height = resultItemDetail + 40 + 'px'

      if (this.windowHeight <= 755) {
        this.$el.querySelector('#itemDetail .itemDetailTab1table').style.height = resultItemDetail - 105 + 'px'
      }
    },
    leftDragbarMove(e) {
      const windowWidth = window.innerWidth
      let left = document.getElementById('mainLeft')
      let right = document.getElementById('mainRight')

      right.style.width = right.offsetWidth - this.sumX + 'px'
      left.style.width = left.offsetWidth + this.sumX + 'px'
    },
    midDragbarMove(e) {
      document.selection
              ? document.selection.empty()
              : window.getSelection().removeAllRanges()
      const windowHeight = window.innerHeight
      let midDragbar = document.getElementById('midDragbar')
      let mainTable = document.getElementById('mainTable')
      let historyScroll = document.getElementById('historyScroll')
      let footer = document.getElementById('footer')
      let operating = document.getElementById('operating')

      mainTable.style.height = mainTable.offsetHeight + this.sumY + 'px'
      historyScroll.style.height = historyScroll.offsetHeight - this.sumY + 'px'

      this.historyTableMaxH = windowHeight - (operating.offsetHeight + footer.offsetHeight + e.pageY + 20) - 40
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
    // mobileAllHeight() {
    //   const windowHeight = window.innerHeight
    //   const headH = this.$el.querySelector('#header').offsetHeight
    //   const footH = this.$el.querySelector('#footer').offsetHeight

    //   this.allHeight.mainItem = windowHeight - (headH + footH)
    // },
    resizeHeight () {
      document.body.addEventListener('touchmove', function (e) {
        e.preventDefault(); //阻止默认的处理方式(阻止下拉滑动的效果)
      }, {passive: false});

      this.windowHeight = window.innerHeight
      this.headHeight = this.$el.querySelector('#header').offsetHeight
      this.footHeight = this.$el.querySelector('#footer').offsetHeight
      // console.log(`windowHeight: ${this.windowHeight}`)
      // console.log(`headHeight: ${this.headHeight}`)
      // console.log(`footHeight: ${this.footHeight}`)

      //- *** main height ***
      this.main = this.windowHeight - this.headHeight - this.footHeight - 20
      this.$set(this.mainStyles, 'height', this.main + 'px')
      // console.log(`mainHeight height: ${this.main}`)

      //- *** UserInfo ***
      this.userInfo = this.$el.querySelector('#userInfo').offsetHeight
      // console.log(`UserInfo height: ${this.userInfo}`)

      //- *** itemDetail ***
      this.itemDetail = this.main - this.userInfo - 18
      this.$set(this.itemDetailStyles, 'height', this.itemDetail + 'px')

      //- for itemDetail table height
      this.itemDetailHeader = this.$el.querySelector('#itemDetailHeader').offsetHeight
      this.itemDetailTabs = this.$el.querySelector('#itemDetail .el-tabs__header').offsetHeight
      this.itemDetailTable = this.itemDetail - this.itemDetailHeader - this.itemDetailTabs

      if (this.windowHeight <= 755) {
        this.itemDetailTableFive = this.itemDetail - 143
      } else {
        this.itemDetailTableFive = 314
      }

      this.itemDetailRow = this.itemDetail - this.itemDetailHeader
      this.$el.querySelector('#itemDetail .el-tabs').style.height = this.itemDetailRow + 'px'

      //- *** mainItem ***
      //this.operating = this.$el.querySelector('#operating').offsetHeight
      //this.history = this.$el.querySelector('#history').offsetHeight - this.operating
      // console.log(`operating height: ${this.operating}`)
      // console.log(`history height: ${this.history}`)

      //this.mainItemTable = this.main - this.operating - this.history - this.operating
      const sourceMainTable = this.$el.querySelector('#mainTable').offsetHeight
      const operatingH = this.$el.querySelector('#operating').offsetHeight

      this.mainItemTable = (this.main - operatingH) * 0.4 + 'px'
      const historyH = (this.main - operatingH) * 0.6

      this.$el.querySelector('#history .history').style.height =  historyH - 30 + 'px'
      this.historyTableMaxH = historyH - 99 + 'px'
    }
  }
})