(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = global || self, global.Vue = factory());
}(this, (function () { 'use strict';

  function _typeof(obj) {
    "@babel/helpers - typeof";

    if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
      _typeof = function (obj) {
        return typeof obj;
      };
    } else {
      _typeof = function (obj) {
        return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
      };
    }

    return _typeof(obj);
  }

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    return Constructor;
  }

  function proxy(vm, source, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[source][key];
      },
      set: function set(newValue) {
        vm[source][key] = newValue;
      }
    });
  }
  function isObject(data) {
    return _typeof(data) === 'object' && data !== null;
  }

  var Observe = /*#__PURE__*/function () {
    function Observe(value) {
      _classCallCheck(this, Observe);

      // 如果数据层次过多，需要递归解析属性，依次增加set和get方法；
      // def
      if (Array.isArray(value)) {
        value.__proto__ = arrayMethods; // 数组里面有对象我再次监控

        this.observerArray(value);
      } else {
        this.walk(value); // 对对象进行观测
      }
    }

    _createClass(Observe, [{
      key: "walk",
      value: function walk(data) {
        var keys = Object.keys(data); // [name,age,address] 

        keys.forEach(function (key) {
          // 定义响应
          defineReactive(data, key, data[key]);
        });
      }
    }]);

    return Observe;
  }();

  function defineReactive(data, key, value) {
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: false,
      get: function get() {
        // 取值的时候操作
        return value;
      },
      set: function set(newValue) {
        console.log('更新数据');
        if (newValue === value) return; // 如果用户设置的值是一个对象，我也要进行劫持，给他设置响应

        observe(value);
        value = newValue;
      }
    });
  }

  function observe(data) {
    var isObj = isObject(data);

    if (!isObj) {
      return;
    }

    return new Observe(data);
  }

  function initState(vm) {
    var opts = vm.$options;

    if (opts.props) {
      initProps(vm);
    }

    if (opts.methods) {
      initMethod(vm);
    }

    if (opts.data) {
      initData(vm);
    }

    if (opts.computed) {
      initComputed(vm);
    }

    if (opts.watch) {
      initWatch(vm);
    }
  }

  function initData(vm) {
    var data = vm.$options.data; //用户传递的data
    // console.log(data,'===')
    // 用户选项data传递函数或者对象过来

    data = vm._data = typeof data === 'function' ? data.call(vm) : data; // 判断数据类型，如果改变了数据，我要得到通知，去刷新页面；
    // console.log(data)

    for (var key in data) {
      proxy(vm, '_data', key);
    }

    observe(data); // 实现数据响应式
  }

  // 解析html
  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >

  function parseHTML(html) {
    // 使用while循环不断解析html标签成函数
    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd === 0) {
        // 匹配第一个尖括号<
        var startTagMatch = parseStartTag();
      }
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        }; // 匹配到一个之后就删除，继续从头开始匹配

        advance(start[0].length);
        var attr, end; // 捕获属性

        while (!(end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3]
          });
        }

        if (end) {
          advance(end[0].length);
          return match;
        }
      }
    }

    function advance(n) {
      // 截取未捕获的
      html = html.substring(n);
    }
  }

  function compileToFunction(template) {
    // 讲模板解析成函数
    console.log(template);
    parseHTML(template);
    return function () {};
  }

  function initMixins(options) {
    // 初始化Vue
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options; // 初始化状态

      initState(vm); // 模板编译

      if (vm.$options.el) {
        vm.$mount(vm.$options.el);
      }
    };
  }

  Vue.prototype.$mount = function (el) {
    console.log(el);
    var vm = this;
    var options = vm.$options;
    el = document.querySelector(el);
    console.log(el); // 如果用户没有传递render方法，就去使用template里面的东西

    if (!options.render) {
      var template = options.template; // 如果没有模板但是有el

      if (!template && el) {
        template = el.outerHTML;
      }

      var render = compileToFunction(template);
      options.render = render;
    }
  };

  function Vue(options) {
    this._init(options);
  }

  initMixins();

  return Vue;

})));
//# sourceMappingURL=vue.js.map
