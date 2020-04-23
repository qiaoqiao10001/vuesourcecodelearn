import {isObject} from '../util/index'

class Observe{
  constructor(value){
    // 如果数据层次过多，需要递归解析属性，依次增加set和get方法；
    // def
    if(Array.isArray(value)){
      value.__proto__ = arrayMethods;
      // 数组里面有对象我再次监控
      this.observerArray(value);
    }else{
      this.walk(value);  // 对对象进行观测
    }
  }
  walk(data){
    let keys = Object.keys(data); // [name,age,address] 
    keys.forEach(key => {
      // 定义响应
      defineReactive(data,key,data[key])
    })
  }
}

function defineReactive(data,key,value){
  Object.defineProperty(data,key,{
    configurable: true,
    enumerable: false,
    get(){
      // 取值的时候操作
      return value;
    },
    set(newValue){
      console.log('更新数据')
      if(newValue === value) return;
      // 如果用户设置的值是一个对象，我也要进行劫持，给他设置响应
      observe(value)
      value = newValue;
    }
  })
}

export function observe(data){
  let isObj = isObject(data);
  if(!isObj){
    return
  }
  return new Observe(data)
}