import Vue from 'vue'

Vue.mixin({
  methods: {
    testGlobal () {
      return 'success'
    },
    startToken () {
      return 'a:test,test'
    },
    midDragbarMove (e) {
      document.selection
              ? document.selection.empty()
              : window.getSelection().removeAllRanges()
      const windowHeight = window.innerHeight
      let midDragbar = document.getElementById('midDragbar');
      let mainTable = document.getElementById('mainTable')
      let historyScroll = document.getElementById('historyScroll')
      let footer = document.getElementById('footer')
      let operating = document.getElementById('operating')

      mainTable.style.height = e.pageY - midDragbar.offsetHeight - 44 + 'px'

      const historyH = windowHeight - (operating.offsetHeight + footer.offsetHeight + e.pageY + 20)
      historyScroll.style.height = historyH + 'px'
      this.historyTableMaxH = historyH - 45
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
    paramX () {
    	return 'x:TXF,TXFAF,EXF,FXF,TSLQ,HSI,HSIAF,E7,NK225,NK225AF,FDAX,YM,NQ,CL,GC,SI,CN,CNAF,CIF'
    },
    paramB () {
    	return 'h:TXF,TXFAF,EXF,FXF,TSLQ,HSI,HSIAF,E7,NK225,NK225AF,FDAX,YM,NQ,CL,GC,SI,CN,CNAF,CIF'
    },
    formatTime (time) {
      return time.substring(0, 2) + ":" + time.substring(2, 4) + ":" + time.substring(4, 6)
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
    resizeHeight () {
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
      this.itemDetail = this.main - this.userInfo
      this.$set(this.itemDetailStyles, 'height', this.itemDetail + 'px')
      // console.log(`itemDetailStyles height: ${this.itemDetail}`)

      //- for itemDetail table height
      this.itemDetailHeader = this.$el.querySelector('#itemDetailHeader').offsetHeight
      this.itemDetailTabs = this.$el.querySelector('#itemDetail .el-tabs__header').offsetHeight
      this.itemDetailTable = this.itemDetail - this.itemDetailHeader - this.itemDetailTabs
      // console.log(`itemDetailTable height: ${this.itemDetailTable}`)
      this.itemDetailRow = this.itemDetail - this.itemDetailHeader
      // console.log(`itemDetailRow height: ${this.itemDetailRow}`)
      this.$el.querySelector('#itemDetail .el-tabs').style.height = this.itemDetailRow + 'px'

      //- *** mainItem ***
      //this.operating = this.$el.querySelector('#operating').offsetHeight
      //this.history = this.$el.querySelector('#history').offsetHeight - this.operating
      // console.log(`operating height: ${this.operating}`)
      // console.log(`history height: ${this.history}`)

      //this.mainItemTable = this.main - this.operating - this.history - this.operating

      const operatingH = this.$el.querySelector('#operating').offsetHeight

      this.mainItemTable = (this.main - operatingH) * 0.4 + 'px'

      const historyH = (this.main - operatingH) * 0.6
      this.$el.querySelector('#history .history').style.height =  historyH - 21 + 'px'

      this.historyTableMaxH = historyH - 65
    }
  }
})