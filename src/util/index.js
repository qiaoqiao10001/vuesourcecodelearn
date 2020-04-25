export function proxy(vm,source,key){
  Object.defineProperty(vm,key,{
    get(){
      return vm[source][key]
    },
    set(newValue){
      vm[source][key] = newValue;
    }
  })
}
export function isObject(data){
  return typeof data === 'object' && data !== null;
}

export function def(data,key,value){
  Object.defineProperty(data,key,{
    enumerable:false,
    configurable: false,
    value
  })
}

const LIFECYCLE_HOOKS = [
  'beforeCreate',
  'created',
  'mounted',
  'beforeMount',
  'updated',
  'beforeUpdated',
  'destroyed',
  'beforeDestroy'
]

let strats = {}
// 生命周期需要合并成一个数组
LIFECYCLE_HOOKS.forEach(hook => {
  strats[hook] = mergeHook
})

function mergeHook(parentVal, childVal){
  if(childVal){
    if(parentVal){
      return parentVal.concat(childVal)
    }else{
      return [childVal]
    }
  }else{
    return parentVal
  }
}

export function mergeOptions (parent,child){
  const options = {}
  for(let key in parent){
    mergeField(key)
  }
  for(let key in child){ // 已经合并过就不需要多次合并了
    if(!parent.hasOwnProperty(key)){
      mergeField(key);
    }
  }
  // 默认的合并策略 : 生命周期， data等的合并
  function mergeField(key){
    // 同时是对象，就需要合并
    if(strats[key]){
      return options[key] = strats[key](parent[key], child[key])
    }
    if(typeof parent[key] === 'object' && typeof child[key] === 'object'){
      options[key] = {
        ...parent[key],
        ...child[key]
      }
    }else if(child[key] === null){
      options[key] = parent[key]
    }else{
      options[key] = child[key]
    }
  }

  return options;
}