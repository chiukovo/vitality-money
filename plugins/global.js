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
      $('.fixed-table-body').slimScroll({height: '100%'})
    },
    resizeHeight () {
      this.windowHeight = window.innerHeight
      this.headHeight = this.$el.querySelector('#header').clientHeight
      this.fooHeight = this.$el.querySelector('#footer').clientHeight
      console.log(`windowHeight: ${this.windowHeight}`)
      console.log(`headHeight: ${this.headHeight}`)
      console.log(`fooHeight: ${this.fooHeight}`)
      //- *** main height ***
      this.mainHeight = this.windowHeight - this.headHeight - this.fooHeight
      this.$set(this.mainStyles, 'height', this.mainHeight + 'px')
      console.log(`main: ${this.mainHeight}`)
      //- *** block1、block4、block5 ***
      this.block1 = this.$el.querySelector('#block1').clientHeight
      this.block4 = this.$el.querySelector('#block4').clientHeight
      this.block5 = this.$el.querySelector('#block5').clientHeight
      //- *** block2 ***
      this.block2 = this.mainHeight - this.block1 - 20
      this.$set(this.block2Styles, 'height', this.block2 + 'px')
      //- console.log(this.block2)
      this.block2tabs = this.$el.querySelector('#block2tabs').clientHeight
      this.$set(this.block2tabStyles, 'bottom', - this.block2tabs + 'px')
      //- console.log(this.block2tabs)
      //- for block2 tabs
      this.block2row2 = this.block2 - this.block2tabs - this.$el.querySelector('#block2head').clientHeight
      this.$set(this.block2rowStyles, 'height', this.block2row2 + 'px')
      //- for block2 table
      this.block2Table = this.block2row2
      //- *** block3 ***
      this.block3 = this.mainHeight - this.block4 - this.block5 - 20
      this.block3Table = this.block3
    }
  }
})