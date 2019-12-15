<template lang='pug'>
.main
  .area
    .area__header
      button.button(@click="allChecked(true)") 全選
      button.button(@click="allChecked(false)") 全不選
      button.button(@click="submit") 保存
  .area(style="height: calc(100% - 100px); overflow-y: scroll;")
    ul.area-select-list
        li(v-for="item in items"): label.checkbox
          input.checkbox__input(type="checkbox" v-model="multipleSelection" :value="item.id")
          span.checkbox__label {{ item.name }}
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

      await axios.post(process.env.NUXT_ENV_API_URL + "/set_member_setting", qs.stringify({
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