<template lang='pug'>
.dialog
  .dialog__header
    el-button(size='mini' @click="allChecked(true)") 全選
    el-button(size='mini' @click="allChecked(false)") 全不選
  .dialog__content
    table.custom__table.large
      thead.thead
        tr
          th
          th 商品
          th 代碼
          th 可下單時間
          th 交易所
      tbody.tbody(@scroll="tbodyScroll($event)")
        tr(v-for="row in items" @click="trClick($event)")
          td
            input(type="checkbox" v-model="multipleSelection" :value="row.id")
          td {{ row.name }}
          td {{ row.id }}
          td
            span(v-html="row.trade_time")
          td {{ row.market_name }}
        tr(class="non-data" v-if="items.length == 0")
          td 無資料
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

    this.computedTableContent()
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

      await axios.post(process.env.NUXT_ENV_API_URL + "/set_member_setting", qs.stringify({
        UserID: userId,
        Token: token,
        UserSettingData: JSON.stringify(result),
      }))
      .then(response => {
        _this.$alert("修改成功")

        //取得自定義商品開關
        _this.$store.dispatch('CALL_MEMBER_CUSTOM_ITEM', {
          defaultData: _this.$store.state.mainItem,
          marketInfo: _this.marketInfo()
        })
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