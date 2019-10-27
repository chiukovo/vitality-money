<template>
  <div>
    <div class="row scroll" id="block1" ref="block1">
      <div class="col block block1">
        <table class="table table-bordered">
          <thead class="thead-light">
            <tr>
              <th colspan="2">{{ userInfo.Account }} ({{ userInfo.State }})</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td class="text-right" width="100">客戶名稱:</td>
              <td>{{ userInfo.Name }}</td>
            </tr>
            <tr>
              <td class="text-right">服務人員:</td>
              <td>QAQ</td>
            </tr>
            <tr>
              <td class="text-right">服務專線:</td>
              <td>23939889</td>
            </tr>
            <tr>
              <td class="text-right">預設額度:</td>
              <td>{{ userInfo.TouchPoint | currency }}</td>
            </tr>
            <tr>
              <td class="text-right">帳戶餘額:</td>
              <td class="text-primary">{{ userInfo.Money | currency }}</td>
            </tr>
            <tr>
              <td class="text-right">今日損益:</td>
              <td>{{ userInfo.TodayMoney | currency }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
<script>

import { mapState } from 'vuex';

export default {
  data () {
    return {
    }
  },
  computed: mapState([
    'userInfo',
  ]),
}
</script>