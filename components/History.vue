<template lang='pug'>
#history.history
  .history-wrap
    .history-header
    .history-content
      el-tabs(
        v-model='activeName',
        type='card',
        @tab-click='handleClick')
        el-tab-pane(label='買賣下單(0)', name='tabs1')
          .history-tabs-header
            el-button(size='mini') 刪單
            el-button(size='mini') 全選
            el-button(size='mini') 全不選
          el-table.table(:data='tableData', min-width='100%', border)
            el-table-column(prop='th1', label='操作')
            el-table-column(prop='th2', label='序號')
            el-table-column(prop='th3', label='商品')
            el-table-column(prop='th4', label='倒')
            el-table-column(prop='th5', label='多空')
            el-table-column(prop='th6', label='委託價')
            el-table-column(prop='th7', label='口數')
            el-table-column(prop='th8', label='成交價')
            el-table-column(prop='th9', label='下單時間')
            el-table-column(prop='th10', label='完成時間')
            el-table-column(prop='th11', label='型別')
            el-table-column(prop='th12', label='損失點數')
            el-table-column(prop='th13', label='獲利點數')
            el-table-column(prop='th14', label='狀態')
        el-tab-pane(label='未平倉(0)', name='tabs2')
        el-tab-pane(label='已平倉', name='tabs3')
        el-tab-pane(label='商品統計', name='tabs4')
          .history-tabs-header
            .col 預設額度: 
              span.text-lg.text-bold 0
            .col 今日損益: 
              //- colors class.text-danger | text-success
              span.text-lg.text-bold.text-danger -50
            .col 留倉預扣: 
              span.text-lg.text-bold 0
            .col 帳戶餘額: 
              span.text-lg.text-bold.text-infor 96,350
            .col
              el-checkbox(v-model='checked') 顯示全部
        el-tab-pane(label='對帳表' name='tabs5')
          .history-tabs-header
            .row
              .col-lg-auto
                el-form(ref='form' size='mini' :inline='true')
                  el-form-item(label='開始日期:')
                    el-form-item
                      el-date-picker(type='date' placeholder='開始日期' v-model='valueDateInterval[0]' style="width: 130px;")
                  el-form-item(label='結束日期:')
                    el-form-item
                      el-date-picker(type='date' placeholder='結束日期' v-model='valueDateInterval[1]' style="width: 130px;")
                  el-button(size='mini') 送出
              .col-lg-auto
                span.label 快速查詢
                el-button(size='mini') 今日
                el-button(size='mini') 昨日
                el-button(size='mini') 本週
                el-button(size='mini') 上週
                el-button(size='mini') 上月




        el-tab-pane(label='投顧訊息(0)', name='tabs6')
        el-tab-pane(label='自訂窗口', name='tabs7')
</template>

<script>
export default {
  data() {
    let data = []
    for (let num = 1; num <= 3; num++) {
      data.push({
          th1: '-',
          th2: '-',
          th3: '-',
          th4: '-',
          th5: '-',
          th6: '-',
          th7: '-',
          th8: '-',
          th9: '-',
          th10: '-',
          th11: '-',
          th12: '-',
          th13: '-',
          th14: '-',
      })
    }
    return {
      activeName: 'tabs1',
      tableData: data,
      checked: false,
      valueDateInterval: [new Date(2000, 10, 10, 10, 10), new Date(2000, 10, 11, 10, 10)],
    }
  },
  methods: {
    handleClick(tab, event) {}
  }
}
</script>