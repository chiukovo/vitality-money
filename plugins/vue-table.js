import Vue from 'vue'
import 'xe-utils'
import {
  // 实例
  VXETable,
  // 依赖
  Column,
  Header,
  Resize,
  // 核心
  Table
} from 'vxe-table'

// 先安装依赖模块
Vue.use(Column)
Vue.use(Header)
Vue.use(Resize)

// 再安装核心库
Vue.use(Table)