<template lang='pug'>
.userInfo
  .userInfo-header {{ userInfo.Account }} (正常收單)
  .userInfo-content
    client-only
      vxe-table(
        :data="tableData"
        :show-header='false'
        :cell-class-name='tableCellClassName'
        max-width="100%"
        height="100%"
        size="small"
        column-min-width="74"
        border
        auto-resize)
        vxe-table-column(title='標題' field='title' show-overflow)
        vxe-table-column(title='資訊' field='info' show-overflow)
</template>
<script>
import { mapState } from 'vuex';
export default {
  data () {
    return {
      tableData: []
    }
  },
  computed: mapState([
    'userInfo',
  ]),
  watch: {
    userInfo(userInfo) {
      this.tableData = [{
          title: '客戶名稱:',
          info: userInfo.Name,
        }, {
          title: '服務人員:',
          info: '',
        }, {
          title: '服務專線:',
          info: '',
        }, {
          title: '預設額度:',
          info: userInfo.TouchPoint,
        }, {
          title: '今日餘額:',
          info: userInfo.Money,
        }, {
          title: '今日損益:',
          info: userInfo.TodayMoney,
        }]
    }
  },
  methods: {
    tableCellClassName({ row, column, columnIndex }) {
      if(row.title == '今日餘額:') {
        if(columnIndex == 1) {
          return 'text__info'
        }
      }
      if(row.title == '今日損益:') {
        if(columnIndex == 1) {
          if(row.info < 0) {
            return 'text__danger'
          }
        }
      }
    }
  }
}
</script>