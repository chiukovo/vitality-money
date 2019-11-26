export const state = () => ({
  userAuth: [],
  lang: 'zh_TW',
  customSetting: {
  	noConfirmDelete: false, //刪單不確認
  	orderReport: false, //下單回報
  	clapping: false, //拍手動畫
  	sound: false, //音效
  	operatingCustomGroup: [], //下單三項自訂選項
  },
  remember: {
  	me: false,
  	account: '123',
  	password: '123',
  }
})
