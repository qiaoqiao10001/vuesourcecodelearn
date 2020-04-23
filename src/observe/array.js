// 重写数组的方法

let oldArrayMethods = Array.prototype;

export const arrayMethods = Object.create(oldArrayMethods);

const methods = [
  'push',
  'shift',
  'unshift',
  'pop',
  'sort',
  'splice',
  'reverse'
]

methods.forEach(method => {
  arrayMethods[method] = function (...args) {
    const result = oldArrayMethods[method].apply(this, args);
    // 当前插入的元素
    let inserted;
    let ob = this.__ob__;
    switch (method) {
      case 'push':
      case 'unshift':
        inserted = args;
        break;
      case 'splice':
        inserted = args.splice(2)
      default:
        break;
    }

    if (inserted) ob.observeArray(inserted);
    return result;

  }
})