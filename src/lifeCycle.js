import Watcher from './observe/watcher'
import {patch} from './vdom/patch'
export function lifecycleMixin(Vue){
  Vue.prototype._update = function(vnode){
    const vm = this;
    vm.$el = patch(vm.$el, vnode)
    console.log(vm.$el)
  }
}
export function mountComponent (vm, el) {
  const options = vm.$options;
  vm.$el = el;
  console.log(el, vm)
  // 渲染页面  
  let updateComponent = () => {  // 渲染和更新都会调用这个方法
    // vm._render() 通过解析的render方法来渲染虚拟dom
    // vm._update 通过虚拟dom创建真实dom
    vm._update(vm._render()); 
    
  }

  // 通过watcher去渲染，每个组件都有一个watcher;
  new Watcher(vm, updateComponent, () => {}, true)
}

