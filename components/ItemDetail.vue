<template>
  <div>
    <div class="row" id="block2">
      <div class="col block block2" :style="this.$parent.block2Styles">
        <div class="row" id="block2head">
          <div class="col" v-if="$store.state.itemName != ''">
            <div class="title">報價明細[{{ $store.state.itemName }}]
              <button class="btn-sm">查詢</button>
              <div class="custom-control custom-checkbox custom-control-inline">
                <input class="custom-control-input" type="checkbox" id="customCheck1" name="namecheck1" checked="checked"/>
                <label class="custom-control-label" for="customCheck1">置底</label>
              </div>
            </div>
          </div>
        </div>
        <div class="row block2row2" :style="this.$parent.block2rowStyles">
          <div class="col" :style="this.$parent.block2rowStyles">
            <ul class="nav nav-pills tab-navlist" role="tablist" id="block2tabs" :style="this.$parent.block2tabStyles">
              <li class="nav-item"><a class="nav-link" data-toggle="tab" role="tab" href="#tab1a"><span>五檔揭示</span></a></li>
              <li class="nav-item"><a class="nav-link" data-toggle="tab" role="tab" href="#tab2a"><span>量價分佈</span></a></li>
              <li class="nav-item"><a class="nav-link active" data-toggle="tab" role="tab" href="#tab3a"><span>分價揭示</span></a></li>
            </ul>
            <div class="tab-content">
              <div class="tab-pane fade" id="tab1a">
                <div class="block2-table" id="block2Table">
                  <table data-toggle="table" :data-height="this.$parent.block2Table">
                    <thead class="thead-light">
                      <tr>
                        <th>比例</th>
                        <th>委買</th>
                        <th>價格</th>
                        <th>委賣</th>
                        <th>比例</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td></td>
                        <td></td>
                        <td class="text-danger">11286</td>
                        <td>44</td>
                        <td class="p-0">
                          <div class="progress">
                            <div class="progress-bar bg-success" style="width: 44%" aria-valuenow="44" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td class="text-danger">11286</td>
                        <td>59</td>
                        <td class="p-0">
                          <div class="progress">
                            <div class="progress-bar bg-success" style="width: 59%" aria-valuenow="59" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td class="bg-primary text-white">11282</td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr>
                        <td class="p-0">
                          <div class="progress progress-right">
                            <div class="progress-bar bg-danger" style="width: 57%" aria-valuenow="57" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </td>
                        <td>61</td>
                        <td class="text-danger">11282</td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="tab-pane fade" id="tab2a">
                <div class="block2-table">
                  <table data-toggle="table" :data-height="this.$parent.block2Table">
                    <thead class="thead-light">
                      <tr>
                        <th data-field="價格">價格</th>
                        <th data-field=""></th>
                        <th data-field="比例">比例</th>
                        <th data-field="口">口</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="text-success">11303</td>
                        <td>現價</td>
                        <td class="p-0">
                          <div class="progress">
                            <div class="progress-bar bg-success" style="width: 50%" aria-valuenow="50" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </td>
                        <td>151</td>
                      </tr>
                      <tr>
                        <td class="text-danger">15103</td>
                        <td> </td>
                        <td class="p-0">
                          <div class="progress">
                            <div class="progress-bar bg-success" style="width: 70%" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </td>
                        <td class="text-danger">231</td>
                      </tr>
                      <tr>
                        <td class="text-danger">15103</td>
                        <td> </td>
                        <td class="p-0">
                          <div class="progress">
                            <div class="progress-bar bg-success" style="width: 70%" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </td>
                        <td class="text-danger">231</td>
                      </tr>
                      <tr>
                        <td class="text-danger">15103</td>
                        <td> </td>
                        <td class="p-0">
                          <div class="progress">
                            <div class="progress-bar bg-success" style="width: 70%" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </td>
                        <td class="text-danger">231</td>
                      </tr>
                      <tr>
                        <td class="text-danger">15103</td>
                        <td> </td>
                        <td class="p-0">
                          <div class="progress">
                            <div class="progress-bar bg-success" style="width: 70%" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </td>
                        <td class="text-danger">231</td>
                      </tr>
                      <tr>
                        <td class="text-danger">15103</td>
                        <td> </td>
                        <td class="p-0">
                          <div class="progress">
                            <div class="progress-bar bg-success" style="width: 70%" aria-valuenow="70" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </td>
                        <td class="text-danger">231</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="tab-pane fade show active" id="tab3a">
                <div class="block2-table">
                  <table data-toggle="table" :data-height="this.$parent.block2Table">
                    <thead class="thead-light">
                      <tr>
                        <th data-field="市場時間">市場時間</th>
                        <th data-field="口">口</th>
                        <th data-field="價格">價格</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in items">
                        <td>{{ item.flocalTime }}</td>
                        <td>{{ item.amount }}</td>
                        <td>{{ item.price }}</td>
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
  </div>
</template>
<script>

import { mapState } from 'vuex';

export default {
  data () {
    return {
      items: [],
      borderName: 'border border-primary'
    }
  },
  computed: mapState([
    'historyPrice',
    'clickItemId',
  ]),
  watch: {
    historyPrice (history) {
      let itemId = this.$store.state.clickItemId
      this.itemChange(history, itemId)
    },
    clickItemId (itemId) {
      let history = this.$store.state.historyPrice

      this.itemChange(history, itemId)
    }
  },
  methods: {
    itemChange(history, itemId) {
      if (typeof history[itemId] == 'undefined') {
        this.items = []
        return
      }

      if (history[itemId].length > 0) {
        this.items = history[itemId]
      }
    }
  }
}
</script>