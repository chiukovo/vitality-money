<template lang='pug'>
#userInfo
  .userInfo
    .userInfo-header {{ userInfo.Account }} (正常收單)
    .userInfo-content
      el-table.table(
        :data='tableData'
        :show-header='false'
        :cell-class-name='tableCellClassName',
        style='width: 100%'
        border)
        el-table-column(prop='title', label='標題')
        el-table-column(prop='infor',label='資訊')
          //- 今日餘額需加入class .text-primary
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
          infor: userInfo.Name,
        }, {
          title: '服務人員:',
          infor: '',
        }, {
          title: '服務專線:',
          infor: '',
        }, {
          title: '預設額度:',
          infor: userInfo.TouchPoint,
        }, {
          title: '今日餘額:',
          infor: userInfo.Money,
        }, {
          title: '今日損益:',
          infor: userInfo.TodayMoney,
        }]
    }
  },
  methods: {
    tableCellClassName({ row, column, columnIndex }) {
      if(row.title == '今日餘額:') {
        if(columnIndex == 1) {
          return 'text-infor'
        }
      }
      if(row.title == '今日損益:') {
        if(columnIndex == 1) {
          if(row.infor < 0) {
            return 'text-danger'
          }
        }
      }
    }
  }
}
</script>