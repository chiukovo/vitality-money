<template>
  <div>
    <div>
      <table>
        <thead>
        <tr>
          <th>商品/屬性</th>
          <th v-for="header in headers">{{ header.Name }}</th>
        </tr>
        </thead>
        <tbody>
          <tr v-for="(item, key) in items">
            <td v-for="dt in item">
              {{ dt }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
<script>

import { mapState } from 'vuex'

export default {
  data() {
    return {
      items: [],
      headers: [],
      fields: [
        '每點價格',
        '手續費(進/出)',
        '單商品每筆上限',
        '單商品留倉上限',
        '單商品留倉天數',
        '開盤最大漲跌',
        '每口最大漲跌',
        '停損利',
        '可下單時間',
        '狀態',
        '禁新',
        '強平',
      ]
    }
  },
  mounted() {
    const sourceCommidyArray = this.$store.state.commidyArray
    this.getUserInfo(sourceCommidyArray)
  },
  computed: mapState([
    'commidyArray',
  ]),
  watch: {
    commidyArray(sourceCommidyArray) {
      this.getUserInfo(sourceCommidyArray)
    }
  },
  methods: {
    getUserInfo(sourceCommidyArray) {
      let commidyArray = JSON.parse(JSON.stringify(sourceCommidyArray))

      let _this = this
      _this.items = []
      _this.headers = commidyArray

      _this.fields.forEach(function(field, key) {
        if (typeof _this.items[key] == 'undefined') {
          _this.items[key] = []
        }

        _this.items[key].push(field)

        commidyArray.forEach(function(val) {
          switch (key) {
            case 0:
              _this.items[key].push(val.Fee)
              break
            case 1:
              _this.items[key].push(val.SubmitMax)
              break
            case 2:
              _this.items[key].push(val.RemaingLimit)
              break
            case 3:
              _this.items[key].push(val.RemaingDayLimit)
              break
            case 4:
              _this.items[key].push(val.OpenMaxPoint)
              break
            case 5:
              _this.items[key].push(val.SubmitMaxPoint)
              break
            case 6:
              _this.items[key].push(val.StopPoint)
              break
            case 7:
              _this.items[key].push(val.TradeTime)
            case 8:
              _this.items[key].push(val.State)
              break
            case 9:
              _this.items[key].push(val.NotNewPercent)
              break
            case 10:
              _this.items[key].push(val.CoverPercent)
              break
          }
        })
      })
    }
  }
}
</script>