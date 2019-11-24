<template lang='pug'>
.dialog
  .dialog__header
    el-button(size='mini' @click="allChecked(true)") 全選
    el-button(size='mini' @click="allChecked(false)") 全不選
  .dialog__content
    vxe-table(
      :data='items'
      ref="multipleTable"
      @checkbox-change="handleSelectionChange"
      max-width="100%"
      height="500"
      size="mini"
      border
      auto-resize
      highlight-hover-row
      :checkbox-config="{checkStrictly: true}")
      vxe-table-column(width="55px" fixed)
        template(slot-scope='scope')
          input(type="checkbox" v-model="multipleSelection" :value="scope.row.id")
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
        _this.multipleSelection.push(val.id)
      }
    })
  },
  methods: {
    allChecked(allChecked) {
      let _this = this
      _this.multipleSelection = []

      if (allChecked) {
        _this.multipleSelection = _this.$store.state.customItemSetting.map(function(val) {
          return val.id
        })
      }
    },
    async submit() {
      let _this = this
      let result = []
      const mainItem = _this.$store.state.mainItem

      _this.items.forEach(function(val) {
        let show = false
        //確認選擇
        _this.multipleSelection.forEach(function(checkVal) {
          if (val.id == checkVal) {
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
        _this.$alert("修改成功")
        location.reload()
      })
    },
    cancel() {
      //clear form
      this.$parent.handleClose()
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    }
  }
}
</script>