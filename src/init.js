import Vue from './index'
import {initState} from './state'
import {compileToFunction} from './compile/index'
export function initMixins(options){
  // 初始化Vue
  Vue.prototype._init = function(options){
    const vm = this;
    vm.$options = options;
    // 初始化状态
    initState(vm)
    // 模板编译
    if(vm.$options.el){
      vm.$mount(vm.$options.el)
    }
  }
}
Vue.prototype.$mount = function(el){
  const vm = this;
  const options = vm.$options;
  el = document.querySelector(el);
  // 如果用户没有传递render方法，就去使用template里面的东西
  if(!options.render){
    let template = options.template
    // 如果没有模板但是有el
    if(!template && el){
      template = el.outerHTML;
    }
    const render = compileToFunction(template);
    options.render = render
  }
}