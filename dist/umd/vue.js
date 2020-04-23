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

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*"; // abc-aaa

  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")"); // <aaa:asdads>

  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 标签开头的正则 捕获的内容是标签名

  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配标签结尾的 </div>

  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的

  var startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >  <div>
  function parseHTML(html) {
    var root = null; // ast语法树的树根

    var currentParent; // 标识当前父亲是谁

    var stack = [];
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;

    function createASTElement(tagName, attrs) {
      return {
        tag: tagName,
        type: ELEMENT_TYPE,
        children: [],
        attrs: attrs,
        parent: null
      };
    }

    function start(tagName, attrs) {
      // 遇到开始标签 就创建一个ast元素s
      var element = createASTElement(tagName, attrs);

      if (!root) {
        root = element;
      }

      currentParent = element; // 把当前元素标记成父ast树

      stack.push(element); // 将开始标签存放到栈中
    }

    function chars(text) {
      text = text.replace(/\s/g, '');

      if (text) {
        currentParent.children.push({
          text: text,
          type: TEXT_TYPE
        });
      }
    }

    function end(tagName) {
      var element = stack.pop(); // 拿到的是ast对象
      // 我要标识当前这个p是属于这个div的儿子的

      currentParent = stack[stack.length - 1];

      if (currentParent) {
        element.parent = currentParent;
        currentParent.children.push(element); // 实现了一个树的父子关系
      }
    } // 不停的去解析html字符串


    while (html) {
      var textEnd = html.indexOf('<');

      if (textEnd == 0) {
        // 如果当前索引为0 肯定是一个标签 开始标签 结束标签
        var startTagMatch = parseStartTag(); // 通过这个方法获取到匹配的结果 tagName,attrs

        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs); // 1解析开始标签

          continue; // 如果开始标签匹配完毕后 继续下一次 匹配
        }

        var endTagMatch = html.match(endTag);

        if (endTagMatch) {
          advance(endTagMatch[0].length);
          end(endTagMatch[1]); // 2解析结束标签

          continue;
        }
      }

      var text = void 0;

      if (textEnd >= 0) {
        text = html.substring(0, textEnd);
      }

      if (text) {
        advance(text.length);
        chars(text); // 3解析文本
      }
    }

    function advance(n) {
      html = html.substring(n);
    }

    function parseStartTag() {
      var start = html.match(startTagOpen);

      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length); // 将标签删除

        var _end, attr;

        while (!(_end = html.match(startTagClose)) && (attr = html.match(attribute))) {
          // 将属性进行解析
          advance(attr[0].length); // 将属性去掉

          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }

        if (_end) {
          // 去掉开始标签的 >
          advance(_end[0].length);
          return match;
        }
      }
    }

    return root;
  }

  // 处理{{}}里面变量的正则
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g;

  function genChildren(el) {
    var children = el.children;

    if (children.length > 0) {
      return "".concat(children.map(function (c) {
        return gen(c);
      }).join(','));
    } else {
      return false;
    }
  } // 


  function gen(node) {
    if (node.type == 1) {
      // 元素标签
      return generate(node);
    } else {
      // 文本节点
      var text = node.text; // {{name}}

      var tokens = [];
      var match, index; // 每次的偏移量 buff.split()

      var lastIndex = defaultTagRE.lastIndex = 0;

      while (match = defaultTagRE.exec(text)) {
        index = match.index;

        if (index > lastIndex) {
          tokens.push(JSON.stringify(text.slice(lastIndex, index)));
        }

        tokens.push("_s(".concat(match[1].trim(), ")"));
        lastIndex = index + match[0].index;
      }

      if (lastIndex < text.length) {
        tokens.push(JSON.stringify(text.slice(lastIndex)));
      }

      console.log("_v(".concat(tokens.join('+'), ")"));
      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function genprops(attrs) {// 
  }

  function generate(el) {
    var children = genChildren(el);
    var code = "_c\"".concat(el.tag, "\", ").concat(el.attrs.length ? genprops(el.attrs) : 'undefined').concat(children ? ",".concat(children) : '', "\n  ");
    console.log(code);
    return code;
  }

  function compileToFunction(template) {
    // 讲模板解析成函数
    // 1 将模板生成ast语法树
    var root = parseHTML(template); // 2 将ast语法树生成render 函数() 核心思路就是将模板转化成 下面这段字符串
    //  <div id="app"><p>hello {{name}}</p> hello</div>
    // 将ast树 再次转化成js的语法
    //  _c("div",{id:app},_c("p",undefined,_v('hello' + _s(name) )),_v('hello'))

    var code = generate(root); // console.dir(root)
    // let renderFn = new Function(`with`)
    // return function(){}
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
    var vm = this;
    var options = vm.$options;
    el = document.querySelector(el); // 如果用户没有传递render方法，就去使用template里面的东西

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
