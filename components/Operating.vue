<template>
  <div>
    <div class="row" id="block5" ref="block5">
      <div class="col block block5">
        <div class="block5row row flex-nowrap">
          <div class="block5col block5-1">
            <div class="productName">恆生期</div>
            <div class="modeSelect">
              <div class="custom-control custom-radio">
                <input class="custom-control-input" type="radio" id="modeRadio1" name="mode" checked="checked"/>
                <label class="custom-control-label" for="modeRadio1">一般</label>
              </div>
              <div class="custom-control custom-radio">
                <input class="custom-control-input" type="radio" id="modeRadio2" name="mode"/>
                <label class="custom-control-label" for="modeRadio2">雷電</label>
              </div>
            </div>
          </div>
          <div class="block5col block5-2">
            <table>
              <tbody>
              <tr>
                <td></td>
                <td>
                  <div class="custom-control custom-radio">
                    <input class="custom-control-input" type="radio" id="orderRadio1" name="order" checked="checked"/>
                    <label class="custom-control-label" for="orderRadio1">市價單</label>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="custom-control custom-radio">
                    <input class="custom-control-input" type="radio" id="orderRadio2" name="order"/>
                    <label class="custom-control-label" for="orderRadio2">收盤單</label>
                  </div>
                </td>
                <td>
                  <div class="custom-control custom-radio">
                    <input class="custom-control-input" type="radio" id="orderRadio3" name="order"/>
                    <label class="custom-control-label" for="orderRadio3">限價單</label>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="block5col block5-3">
            <div class="row">
              <div class="form-group row">
                <label class="col-form-label mr-1">停利:</label>
                <div class="col">
                  <input class="form-control form-control-sm" type="number" value="1"/>
                </div>
              </div>
              <div class="form-group row">
                <label class="col-form-label mr-1">停損:</label>
                <div class="col">
                  <input class="form-control form-control-sm" type="number" value="1"/>
                </div>
              </div>
            </div>
          </div>
          <div class="block5col block5-4">
            <table>
              <tbody>
              <tr>
                <td class="numberBtn">
                  <div class="btn-group">
                    <button class="btn btn-light btn-sm">1</button>
                    <button class="btn btn-light btn-sm">2</button>
                    <button class="btn btn-light btn-sm">3</button>
                    <button class="btn btn-light btn-sm">4</button>
                    <button class="btn btn-light btn-sm">5</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>
                  <div class="form-group row">
                    <label class="col-form-label mr-1">口數:</label>
                    <div class="col">
                      <input class="form-control form-control-sm" type="number" value="1"/>
                    </div>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="editBtn">
                  <div class="btn-group">
                    <button class="btn btn-light btn-sm">編輯</button>
                    <button class="btn btn-light btn-sm">還原</button>
                  </div>
                </td>
              </tr>
              </tbody>
            </table>
          </div>
          <div class="block5col block5-5">
            <table>
              <tbody>
                <tr>
                  <td>
                    <button class="btn-lg btn-danger">下多單</button>
                  </td>
                  <td>
                    <button class="btn-sm" disabled>全平</button>
                  </td>
                  <td>
                    <button class="btn-lg btn-success">下空單</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
          <div class="block5col block5-6">
            <div class="custom-control custom-checkbox">
              <input class="custom-control-input" type="checkbox" id="block5Check1" name="block5Check"/>
              <label class="custom-control-label" for="block5Check1">(恆生期)全盤收平</label>
            </div>
            <div class="custom-control custom-checkbox">
              <input class="custom-control-input" type="checkbox" id="block5Check2" name="block5Check" checked="checked"/>
              <label class="custom-control-label" for="block5Check2">下單不確認</label>
            </div>
            <div class="custom-control custom-checkbox">
              <input class="custom-control-input" type="checkbox" id="block5Check3" name="block5Check"/>
              <label class="custom-control-label" for="block5Check3">限價成交提示</label>
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