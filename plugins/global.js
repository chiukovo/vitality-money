import Vue from 'vue'

Vue.mixin({
  methods: {
    testGlobal () {
      return 'success'
    },
    startToken () {
      return 'a:test,test'
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
    updateScroll() {
      //$('.fixed-table-body').slimScroll({height: '100%'})
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
      this.operating = this.$el.querySelector('#operating').offsetHeight
      this.history = this.$el.querySelector('#history').offsetHeight
      // console.log(`operating height: ${this.operating}`)
      // console.log(`history height: ${this.history}`)

      this.mainItemTable = this.main - this.operating - this.history
      // console.log(`mainItem height: ${this.mainItem}`)
    }
  }
})