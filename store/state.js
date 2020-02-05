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
  chartCrossData: [],
  chartVolumeData: [],
  chatLastData: [],
  chartId: '',
  subResolution: null,
  clickItemId: '',
  itemName: '',
  chartType: '',
  userInfo: [],
  userOrder: [],
  commidyArray: [],
  headerItem: [],
  customItemSetting: [],
  uncoveredCountDetail: [],
  loading: true,
  isMobile: 0, //0桌面 1手機
  customStyle: {
    htmlClass: process.env.NUXT_ENV_WEB ? process.env.NUXT_ENV_WEB : 'gennki'
  },
  buySell: [], //下單列表
  uncovered: [], //未平倉
  covered: [], //已平倉
  commodity: [], //商品統計
  unCoverBuySum: 0, //未平倉多單總數列表
  unCoverSellSum: 0, //未平倉空單總數
  unCoverTotal: 0, //未平倉總數
  allCommodity: [],
  items0: [], //五檔揭示
  items1: [], //量價分布
  items2: [], //分價揭示
  fiveTotal: {
    more: 0,
    morePercent: 0,
    nullNum: 0,
  },
  serviceMessages: [],
  hasMessage: false,
  //帳戶餘額
  nowMoney: 0,
  //總共未平損益
  totalUncoverLossWinMoney: 0,
  //今日損益
  todayLoseWin: 0,
  errorMsgDate: '',
  //成功拍手
  doClapping: false,
  openKchart: false,
  //提示訊息
  tipsShow: false,
  tipsType: 0, //0 等待成交, 1 下單成功
  tipsContent: '',
})
