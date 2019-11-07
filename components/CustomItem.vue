<template lang='pug'>
  .itemDetai__history
    .itemDetailtabs__header
    .itemDetailtabs__content
      .row
        .col
          el-table.table(
            :data='items'
            ref="multipleTable"
            style='width: 100%'
            height="500"
            @selection-change="handleSelectionChange"
            border)
            el-table-column(label='選取' type="selection")
            el-table-column(prop="name" label='商品')
            el-table-column(prop="id" label='代碼')
            el-table-column(label='可下單時間')
              template(slot-scope="scope") <span v-html="scope.row.trade_time"></span>
            el-table-column(prop="market_name" label='交易所')
      .row
        el-button(type='primary' @click="submit") 確認
        el-button(@click="cancel") 取消
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