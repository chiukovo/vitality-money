<template lang='pug'>
.dialog
  .dialog__content
    vxe-table(
      :data='items'
      ref="multipleTable"
      @selection-change="handleSelectionChange"
      max-width="100%"
      height="500"
      size="mini"
      border
      auto-resize
      highlight-hover-row)
      vxe-table-column(title='' type="selection" width="30" align="center")
      vxe-table-column(field="name" title='商品')
      vxe-table-column(field="id" title='代碼')
      vxe-table-column(title='可下單時間')
        template(slot-scope="scope") <span v-html="scope.row.trade_time"></span>
      vxe-table-column(field="market_name" title='交易所')
  .dialog__footer
    button.button_light(@click="cancel") 取消
    button.button(type='primary' @click="submit") 確認
</template>
<script>

import { mapState } from 'vuex'
import axios from 'axios'
import qs from 'qs'

export default {
  data () {
    return {
      items: [],
      multipleSelection: [],
    }
  },
  mounted() {
    let _this = this
    let customItemSetting = _this.$store.state.customItemSetting
    customItemSetting = JSON.parse(JSON.stringify(customItemSetting))

    customItemSetting.forEach(function(val) {
      _this.items.push(val)

      if (val.show) {
        _this.multipleSelection.push(val)
        _this.$refs.multipleTable.toggleRowSelection(val)
      }
    })
  },
  methods: {
    async submit() {
      let _this = this
      let result = []
      const mainItem = _this.$store.state.mainItem

      _this.items.forEach(function(val) {
        let show = false
        //確認選擇
        _this.multipleSelection.forEach(function(checkVal) {
          if (val.id == checkVal.id) {
            show = true
          }
        })

        val.show = show
        result.push(val)
      })

      const userId = this.$store.state.localStorage.userAuth.userId
      const token = this.$store.state.localStorage.userAuth.token

      await axios.post("/api/set_member_setting", qs.stringify({
        UserID: userId,
        Token: token,
        UserSettingData: JSON.stringify(result),
      }))
      .then(response => {
        //init
        //取得自定義商品開關
        _this.$store.dispatch('CALL_MEMBER_CUSTOM_ITEM', {
          defaultData: mainItem,
          marketInfo: _this.marketInfo()
        })

        _this.$alert("修改成功")
      })
    },
    cancel() {
      //clear form
      this.items = []
      this.multipleSelection = []

      this.$parent.handleClose()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>