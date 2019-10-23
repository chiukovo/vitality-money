<template>
  <div>
    <div class="block-two mt-1 mx-1 border border-primary rounded">
      <ul class="nav tablist" role="tablist">
        <li><a class="active" data-toggle="tab" href="#tabs1" role="tab"><span>買賣下單(0)</span></a></li>
        <li><a data-toggle="tab" href="#tabs2" role="tab"><span>未平倉(0)</span></a></li>
        <li><a data-toggle="tab" href="#tabs3" role="tab"><span>已平倉</span></a></li>
        <li><a data-toggle="tab" href="#tabs4" role="tab"><span>商品統計</span></a></li>
        <li><a data-toggle="tab" href="#tabs5" role="tab"><span>對帳表</span></a></li>
        <li><a data-toggle="tab" href="#tabs6" role="tab"><span>投顧訊息(0)</span></a></li>
        <li><a data-toggle="tab" href="#tabs7" role="tab"><span>自訂窗口</span></a></li>
      </ul>
      <div class="tab-content">
        <div class="tab-pane fade show active" id="tabs1">
          <div class="tabs1-header">
            <div class="tabs1-header-left">
              <button class="btn-sm">刪單</button>
              <button class="btn-sm">全選</button>
              <button class="btn-sm">全不選</button>
            </div>
            <div class="tabs1-header-right"></div>
          </div>
          <div class="tabs-table">
            <table class="table">
              <thead>
                <tr>
                  <th>操作</th>
                  <th>序號</th>
                  <th>商品</th>
                  <th>倒</th>
                  <th>多空</th>
                  <th>委託價</th>
                  <th>口數</th>
                  <th>成交價</th>
                  <th>下單時間</th>
                  <th>完成時間</th>
                  <th>型別</th>
                  <th>損失點數</th>
                  <th>獲利點數</th>
                  <th>狀態</th>
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
              </thead>
            </table>
          </div>
        </div>
        <div class="tab-pane fade" id="tabs2">...2</div>
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