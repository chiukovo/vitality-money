<template>
  <div>
    <div class="row" id="block4" ref="block4">
      <div class="col block block4">
        <ul class="nav nav-tabs tab-navlist d-flex align-items-end" role="tablist">
          <li class="nav-item"><a class="nav-link active" data-toggle="tab" role="tab" href="#tab1b"><span>買賣下單(0)</span></a></li>
          <li class="nav-item"><a class="nav-link" data-toggle="tab" role="tab" href="#tab2b"><span>未平倉(0)</span></a></li>
          <li class="nav-item"><a class="nav-link" data-toggle="tab" role="tab" href="#tab3b"><span>已平倉</span></a></li>
          <li class="nav-item"><a class="nav-link" data-toggle="tab" role="tab" href="#tab4b"><span>商品統計</span></a></li>
          <li class="nav-item"><a class="nav-link" data-toggle="tab" role="tab" href="#tab5b"><span>對帳表</span></a></li>
          <li class="nav-item"><a class="nav-link" data-toggle="tab" role="tab" href="#tab6b"><span>投顧訊息(0)</span></a></li>
          <li class="nav-item"><a class="nav-link" data-toggle="tab" role="tab" href="#tab7b"><span>自訂窗口</span></a></li>
        </ul>
        <div class="tab-content">
          <div class="tab-pane fade show active" id="tab1b">
            <div class="tabs1-header d-flex justify-content-between p-1">
              <div class="tabs1-header-left">
                <button class="btn-sm">刪單</button>
                <button class="btn-sm">全選</button>
                <button class="btn-sm">全不選</button>
              </div>
              <div class="tabs1-header-right mt-1">
                <div class="custom-control custom-radio custom-control-inline">
                  <input class="custom-control-input" type="radio" id="showOrderRadio1" name="showOrder" checked="checked"/>
                  <label class="custom-control-label" for="showOrderRadio1">全部單據</label>
                </div>
                <div class="custom-control custom-radio custom-control-inline">
                  <input class="custom-control-input" type="radio" id="showOrderRadio2" name="showOrder"/>
                  <label class="custom-control-label" for="showOrderRadio2">為成交單據</label>
                </div>
                <div class="custom-control custom-checkbox custom-control-inline">
                  <input class="custom-control-input" type="checkbox" id="showOrderCheck2" name="showOrder" checked="checked"/>
                  <label class="custom-control-label" for="showOrderCheck2">顯示全部商品單據</label>
                </div>
                <div class="custom-control custom-checkbox custom-control-inline">
                  <input class="custom-control-input" type="checkbox" id="showOrderCheck2" name="showOrder" checked="checked"/>
                  <label class="custom-control-label" for="showOrderCheck2">自動置底</label>
                </div>
              </div>
            </div>
            <div class="tabs1-content">
              <div class="tabs1-table">
                <table data-toggle="table" data-height="183">
                  <thead class="thead-light">
                    <tr>
                      <th data-field="操作">操作</th>
                      <th data-field="序號">序號</th>
                      <th data-field="商品">商品</th>
                      <th data-field="倒">倒</th>
                      <th data-field="多空">多空</th>
                      <th data-field="委託價">委託價</th>
                      <th data-field="口數">口數</th>
                      <th data-field="成交價">成交價</th>
                      <th data-field="下單時間">下單時間</th>
                      <th data-field="完成時間">完成時間</th>
                      <th data-field="型別">型別</th>
                      <th data-field="損失點數">損失點數</th>
                      <th data-field="獲利點數">獲利點數</th>
                      <th data-field="狀態">狀態</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                      <td>-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="tab2b">
            <div class="tabs2-header d-flex justify-content-between p-1">
              <div class="tabs1-header-left">
                <button class="btn-sm">市價平倉</button>
                <button class="btn-sm">設定損利點</button>
                <button class="btn-sm">全選</button>
                <button class="btn-sm">全不選</button>
              </div>
            </div>
            <div class="tabs2-content">
              <div class="tabs2-table">
                <table data-toggle="table" data-height="183">
                  <thead class="thead-light">
                    <tr>
                      <th data-field="table">table</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="tab3b">
            <div class="tabs3-header"></div>
            <div class="tabs3-content">
              <div class="tabs3-table">
                <table data-toggle="table" data-height="219">
                  <thead class="thead-light">
                    <tr>
                      <th data-field="table">table</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="tab4b">
            <div class="tab4-header d-flex justify-content-around">
              <div class="p-2">預設額度:<span class="text-lg">0</span></div>
              <div class="p-2">今日損益:<span class="text-lg">0</span></div>
              <div class="p-2">留倉預扣:<span class="text-lg">0</span></div>
              <div class="p-2">帳戶餘額:<span class="text-lg text-primary">96,400</span></div>
              <div class="p-2 d-flex align-items-center">
                <div class="custom-control custom-checkbox">
                  <input class="custom-control-input" type="checkbox" id="showAll2" name="showAll"/>
                  <label class="custom-control-label" for="showAll2">顯示全部</label>
                </div>
              </div>
            </div>
            <div class="tabs4-content">
              <div class="tabs4-table">
                <table data-toggle="table" data-height="176">
                  <thead class="thead-light">
                    <tr>
                      <th data-field="商品名稱">商品名稱</th>
                      <th data-field="總多">總多</th>
                      <th data-field="總空">總空</th>
                      <th data-field="未倉平">未倉平</th>
                      <th data-field="總口數">總口數</th>
                      <th data-field="手續費合計">手續費合計</th>
                      <th data-field="損益">損益</th>
                      <th data-field="留倉預扣">留倉預扣</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                    <tr>
                      <td>-</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div class="tab-pane fade" id="tab5b">
            <div class="tab5-header p-2">
              <div class="d-flex justify-content-start">
                <div class="d-flex align-items-start">
                  <label class="col-3 col-form-label">開始日期:</label>
                  <div class="input-group">
                    <input class="form-control" type="tel" value="2019-10-14"/>
                    <div class="input-group-append">
                      <button class="btn-sm"><i class="far fa-calendar-alt"></i></button>
                    </div>
                  </div>
                </div>
                <div class="pl-1 d-flex align-items-start">
                  <label class="col-3 col-form-label">結束日期:</label>
                  <div class="input-group">
                    <input class="form-control" type="tel" value="2019-10-20"/>
                    <div class="input-group-append">
                      <button class="btn-sm"><i class="far fa-calendar-alt"></i></button>
                    </div>
                  </div>
                </div>
                <div class="pl-1">
                  <button class="btn btn-primary">送出</button>
                </div>
                <div class="pl-3">快速查詢:
                  <button class="btn-sm">今日</button>
                  <button class="btn-sm">昨日</button>
                  <button class="btn-sm">本週</button>
                  <button class="btn-sm">上週</button>
                  <button class="btn-sm">本月</button>
                </div>
              </div>
            </div>
            <div class="tabs5-content">
              <div class="tabs5-table">
                <table data-toggle="table" data-height="169">
                  <thead class="thead-light">
                    <tr>
                      <th data-field="日期">日期</th>
                      <th data-field="預設額度">預設額度</th>
                      <th data-field="帳戶餘額">帳戶餘額</th>
                      <th data-field="今日損益">今日損益</th>
                      <th data-field="口數">口數</th>
                      <th data-field="對匯額度">對匯額度</th>
                      <th data-field="留倉預扣">留倉預扣</th>
                      <th data-field="交收">交收</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>2019-10-14</td>
                      <td>0</td>
                      <td>96050</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>100000</td>
                      <td class="text-lg text-primary">96,050</td>
                    </tr>
                    <tr>
                      <td>2019-10-14</td>
                      <td>0</td>
                      <td>96050</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>100000</td>
                      <td class="text-lg text-primary">96,050</td>
                    </tr>
                    <tr>
                      <td>2019-10-14</td>
                      <td>0</td>
                      <td>96050</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>100000</td>
                      <td class="text-lg text-primary">96,050</td>
                    </tr>
                    <tr>
                      <td>2019-10-14</td>
                      <td>0</td>
                      <td>96050</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>100000</td>
                      <td class="text-lg text-primary">96,050</td>
                    </tr>
                    <tr>
                      <td>2019-10-14</td>
                      <td>0</td>
                      <td>96050</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>100000</td>
                      <td class="text-lg text-primary">96,050</td>
                    </tr>
                    <tr>
                      <td>2019-10-14</td>
                      <td>0</td>
                      <td>96050</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>100000</td>
                      <td class="text-lg text-primary">96,050</td>
                    </tr>
                    <tr>
                      <td>2019-10-14</td>
                      <td>0</td>
                      <td>96050</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>100000</td>
                      <td class="text-lg text-primary">96,050</td>
                    </tr>
                    <tr>
                      <td>2019-10-14</td>
                      <td>0</td>
                      <td>96050</td>
                      <td>0</td>
                      <td>0</td>
                      <td>0</td>
                      <td>100000</td>
                      <td class="text-lg text-primary">96,050</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>

export default {
	mounted() {
	}
}
</script>