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
              <li class="nav-item"><a class="nav-link active" data-toggle="tab" role="tab" href="#tab0a" @click="clickType(0)"><span>五檔揭示</span></a></li>
              <li class="nav-item"><a class="nav-link" data-toggle="tab" role="tab" href="#tab1a" @click="clickType(1)"><span>量價分佈</span></a></li>
              <li class="nav-item"><a class="nav-link" data-toggle="tab" role="tab" href="#tab2a" @click="clickType(2)"><span>分價揭示</span></a></li>
            </ul>
            <div class="tab-content">
              <div class="tab-pane fade" :class="type == 0 ? 'show active' : ''" id="tab0a">
                <div class="block2-table" id="block2Table">
                  <table :data-height="this.$parent.block2Table">
                    <thead class="thead-light">
                      <tr>
                        <th>比例</th>
                        <th>委買</th>
                        <th>價格</th>
                        <th>委賣</th>
                        <th>比例</th>
                      </tr>
                    </thead>
                    <tbody v-if="items0.length > 0">
                      <tr v-for="(item, key) in items0" v-if="key <= 4">
                        <td></td>
                        <td></td>
                        <td class="text-danger">{{ item[1] }}</td>
                        <td>{{ item[2] }}</td>
                        <td class="p-0">
                          <div class="progress">
                            <div class="progress-bar bg-success" :style="'width: ' +  item['percent'] + '%'" :aria-valuenow="item['percent']" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </td>
                      </tr>
                      <tr>
                        <td></td>
                        <td></td>
                        <td class="bg-primary text-white">{{ items0[0]['newPrice'] }}</td>
                        <td></td>
                        <td></td>
                      </tr>
                      <tr v-for="(item, key) in items0" v-if="key > 4">
                        <td class="p-0">
                          <div class="progress progress-right">
                            <div class="progress-bar bg-danger" :style="'width: ' +  item['percent'] + '%'" :aria-valuenow="item['percent']" aria-valuemin="0" aria-valuemax="100"></div>
                          </div>
                        </td>
                        <td>{{ item[0] }}</td>
                        <td class="text-danger">{{ item[1] }}</td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                    <tbody v-else>
                      <tr>
                        <td></td>
                        <td></td>
                        <td class="bg-primary text-white">no data</td>
                        <td></td>
                        <td></td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="tab-pane fade" :class="type == 1 ? 'show active' : ''" id="tab1a">
                <div class="block2-table">
                  <table :data-height="this.$parent.block2Table">
                    <thead class="thead-light">
                      <tr>
                        <th data-field="價格">價格</th>
                        <th data-field=""></th>
                        <th data-field="比例">比例</th>
                        <th data-field="口">口</th>
                      </tr>
                    </thead>
                    <tbody v-if="items1.length > 0">
                      <tr v-for="item in items1">
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
                    </tbody>
                  </table>
                </div>
              </div>
              <div class="tab-pane fade" :class="type == 2 ? 'show active' : ''" id="tab2a">
                <div class="block2-table">
                  <table :data-height="this.$parent.block2Table">
                    <thead class="thead-light">
                      <tr>
                        <th data-field="市場時間">市場時間</th>
                        <th data-field="口">口</th>
                        <th data-field="價格">價格</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="item in items2">
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
      items0: [], //五檔揭示
      items1: [], //量價分布
      items2: [], //分價揭示
      type: 0,
      borderName: 'border border-primary'
    }
  },
  computed: mapState([
    'historyPrice',
    'nowFiveMoney',
    'nowVolumeMoney',
    'clickItemId',
  ]),
  watch: {
    historyPrice (history) {
      let itemId = this.$store.state.clickItemId
      this.itemChange(history[itemId])
    },
    nowVolumeMoney (money) {
      let itemId = this.$store.state.clickItemId
      this.volumeChange(money[itemId])
    },
    nowFiveMoney (fiveData) {
      let itemId = this.$store.state.clickItemId

      this.fiveItemChange(fiveData[itemId])
    },
    clickItemId (itemId) {
      let history = this.$store.state.historyPrice[itemId]
      let fiveData = this.$store.state.nowFiveMoney[itemId]
      let volumeMoney = this.$store.state.nowVolumeMoney[itemId]
      this.items0 = []
      this.items1 = []
      this.items2 = []

      this.itemChange(history)
      this.fiveItemChange(fiveData)
      this.volumeChange(volumeMoney)
    }
  },
  methods: {
    fiveItemChange(fiveData) {
      if (typeof fiveData == 'undefined') {
        this.items0 = []
        return
      }

      if (fiveData.length > 0) {
        this.items0 = fiveData
      }
    },
    volumeChange(money) {
      if (typeof money == 'undefined') {
        this.items1 = []
        return
      }

      if (money.length > 0) {
        this.items1 = money
      }
    },
    itemChange(history) {
      if (typeof history == 'undefined') {
        this.items2 = []
        return
      }

      if (history.length > 0) {
        this.items2 = history
      }
    },
    clickType (type) {
      this.type = type
    }
  }
}
</script>