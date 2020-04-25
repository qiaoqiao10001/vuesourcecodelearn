let id = 0;
class Watcher {
  constructor(vm, exprOrFn, cb, options) {
    this.vm = vm;
    this.exprOrFn = exprOrFn;
    if (typeof exprOrFn === 'function') {
      this.getter = exprOrFn;
    }
    this.options = options;
    this.cb = cb;
    this.id = id++;

    this.get();
  }
  get() {
    this.getter();
  }
}


export default Watcher;