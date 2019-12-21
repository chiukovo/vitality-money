export const state = () => ({
  userAuth: [],
  lang: 'zh_TW',
  tradingViewUserSaveData: null,
  customSetting: {
  	noConfirmDelete: false, //刪單不確認
  	orderReport: true, //下單回報
  	clapping: false, //拍手動畫
  	sound: false, //音效
    mainStyle: 'A',
  	operatingCustomGroup: [], //下單三項自訂選項
  },
  remember: {
  	me: false,
  	account: '123',
  	password: '123',
  }
})
