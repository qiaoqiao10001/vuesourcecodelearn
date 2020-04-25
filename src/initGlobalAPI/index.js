// mixin 合并所有选项
import {mergeOptions} from '../util/index'
export function initGlobalApi(Vue){
  Vue.options = {}
  Vue.mixin = function (mixin){
    // 实现2个对象的合并
    this.options = mergeOptions(this.options, mixin)
  }
}