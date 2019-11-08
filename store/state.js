export default () => ({
  apiExampleData: [],
  socket: {
    isConnected: false,
    message: '',
    reconnectError: false,
  },
  mainItem: [],
  nowMainItem: [],
  updateMainItem: [],
  nowFiveMoney: [],
  nowVolumeMoney: [],
  nowNewPrice: [],
  historyPrice: [],
  kLineData: [],
  chartData: [],
  clickItemId: '',
  itemName: '',
  chartType: '',
  userInfo: [],
  userOrder: [],
  commidyArray: [],
  headerItem: [],
  customItemSetting: [],
  loading: true,
  isMobile: 0, //0桌面 1手機
  customStyle: {
    htmlClass: 'gennki'
  },
})
