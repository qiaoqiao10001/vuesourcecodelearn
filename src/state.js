import {proxy} from './util/index'
import {observe} from './observe/index'
export function initState(vm){
  const opts = vm.$options;
  if(opts.props){
    initProps(vm)
  }
  if(opts.methods){
    initMethod(vm)
  }
  if(opts.data){
    initData(vm)
  }
  if(opts.computed){
    initComputed(vm)
  }
  if(opts.watch){
    initWatch(vm)
  }
}

function initData(vm){
  let data = vm.$options.data; //用户传递的data
  // console.log(data,'===')
  // 用户选项data传递函数或者对象过来
  data = vm._data = typeof data === 'function' ? data.call(vm) : data
  // 判断数据类型，如果改变了数据，我要得到通知，去刷新页面；
  // console.log(data)
  for(let key in data){
    proxy(vm,'_data',key)
  }
  observe(data); // 实现数据响应式
}