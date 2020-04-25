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

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function ownKeys(object, enumerableOnly) {
    var keys = Object.keys(object);

    if (Object.getOwnPropertySymbols) {
      var symbols = Object.getOwnPropertySymbols(object);
      if (enumerableOnly) symbols = symbols.filter(function (sym) {
        return Object.getOwnPropertyDescriptor(object, sym).enumerable;
      });
      keys.push.apply(keys, symbols);
    }

    return keys;
  }

  function _objectSpread2(target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i] != null ? arguments[i] : {};

      if (i % 2) {
        ownKeys(Object(source), true).forEach(function (key) {
          _defineProperty(target, key, source[key]);
        });
      } else if (Object.getOwnPropertyDescriptors) {
        Object.defineProperties(target, Object.getOwnPropertyDescriptors(source));
      } else {
        ownKeys(Object(source)).forEach(function (key) {
          Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key));
        });
      }
    }

    return target;
  }

  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }

  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }

  function _iterableToArrayLimit(arr, i) {
    if (typeof Symbol === "undefined" || !(Symbol.iterator in Object(arr))) return;
    var _arr = [];
    var _n = true;
    var _d = false;
    var _e = undefined;

    try {
      for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
        _arr.push(_s.value);

        if (i && _arr.length === i) break;
      }
    } catch (err) {
      _d = true;
      _e = err;
    } finally {
      try {
        if (!_n && _i["return"] != null) _i["return"]();
      } finally {
        if (_d) throw _e;
      }
    }

    return _arr;
  }

  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(n);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }

  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;

    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

    return arr2;
  }

  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
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
  var LIFECYCLE_HOOKS = ['beforeCreate', 'created', 'mounted', 'beforeMount', 'updated', 'beforeUpdated', 'destroyed', 'beforeDestroy'];
  var strats = {}; // 生命周期需要合并成一个数组

  LIFECYCLE_HOOKS.forEach(function (hook) {
    strats[hook] = mergeHook;
  });

  function mergeHook(parentVal, childVal) {
    if (childVal) {
      if (parentVal) {
        return parentVal.concat(childVal);
      } else {
        return [childVal];
      }
    } else {
      return parentVal;
    }
  }

  function mergeOptions(parent, child) {
    var options = {};

    for (var key in parent) {
      mergeField(key);
    }

    for (var _key in child) {
      // 已经合并过就不需要多次合并了
      if (!parent.hasOwnProperty(_key)) {
        mergeField(_key);
      }
    } // 默认的合并策略 : 生命周期， data等的合并


    function mergeField(key) {
      // 同时是对象，就需要合并
      if (strats[key]) {
        return options[key] = strats[key](parent[key], child[key]);
      }

      if (_typeof(parent[key]) === 'object' && _typeof(child[key]) === 'object') {
        options[key] = _objectSpread2({}, parent[key], {}, child[key]);
      } else if (child[key] === null) {
        options[key] = parent[key];
      } else {
        options[key] = child[key];
      }
    }

    return options;
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
    observe(value);
    Object.defineProperty(data, key, {
      configurable: true,
      enumerable: false,
      get: function get() {
        // 取值的时候操作
        return value;
      },
      set: function set(newValue) {
        console.log(newValue);
        console.log(value);
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

      return "_v(".concat(tokens.join('+'), ")");
    }
  }

  function genprops(attrs) {
    // 处理属性
    var str = '';

    for (var i = 0; i < attrs.length; i++) {
      var attr = attrs[i];

      if (attr.name === 'style') {
        (function () {
          var obj = {};
          attr.value.split(';').forEach(function (item) {
            var _item$split = item.split(':'),
                _item$split2 = _slicedToArray(_item$split, 2),
                key = _item$split2[0],
                value = _item$split2[1];

            obj[key] = value;
          });
          attr.value = obj;
        })();
      }

      str += "".concat(attr.name, ":").concat(JSON.stringify(attr.value), ",");
    }

    return "{".concat(str.slice(0, -1), "}");
  }

  function generate(el) {
    var children = genChildren(el);
    var code = "_c('".concat(el.tag, "',").concat(el.attrs.length ? "".concat(genprops(el.attrs), " ") : 'undefined').concat(children ? ",".concat(children) : '', ")\n  "); // console.log(code)

    return code;
  }

  function compileToFunction(template) {
    // 讲模板解析成函数
    // ast语法树和虚拟dom 为什么要转render呢：
    // 为了解析其他指令来 ，ast语法树不能生成事件等， 需要转虚拟dom来解析指令
    // 1 将模板生成ast语法树
    var root = parseHTML(template);
    console.log(root); // 将ast语法树生成render 函数() 核心思路就是将模板转化成 下面这段字符串
    //  <div id="app"><p>hello {{name}}</p> hello</div>
    // 2 将ast树 再次转化成js的语法

    var code = generate(root);
    console.log(code); // 这一步生成的code

    /*
    _c("div", {id:"app},_c("h2", {style:{"color":"red","fontSize":"16px"},_v("compile函数"))
    ,_c("p", undefined,_v(_s(name)))
    ,_c("span", undefined,_v(_s(age)))
    )  
    */
    // 3 生成render函数
    // let renderFn = new Function(`with(this){return ${code}}`);

    var renderFn = new Function("with(this){ return ".concat(code, "}"));
    console.log(renderFn);
    return renderFn;
  }

  var id = 0;

  var Watcher = /*#__PURE__*/function () {
    function Watcher(vm, exprOrFn, cb, options) {
      _classCallCheck(this, Watcher);

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

    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        this.getter();
      }
    }]);

    return Watcher;
  }();

  function patch(oldVnode, vnode) {
    // 用来判断是用来渲染还是更新
    var isRealElement = oldVnode.nodeType;

    if (isRealElement) {
      var oldElm = oldVnode;
      var parentElm = oldElm.parentNode;
      var el = createElm(vnode);
      parentElm.insertBefore(el, oldElm.nextSibling);
      parentElm.removeChild(oldVnode);
      return el;
    }
  }

  function createElm(vnode) {
    var tag = vnode.tag,
        children = vnode.children,
        key = vnode.key,
        data = vnode.data,
        text = vnode.text;

    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);
      upateProperties(vnode);
      children.forEach(function (child) {
        // 有子节点就递归创建子节点
        return vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }

    return vnode.el;
  }

  function upateProperties(vnode) {
    var newProps = vnode.data;
    var el = vnode.el;

    for (var key in newProps) {
      if (key === 'style') {
        for (var styleName in newProps.style) {
          el.style[styleName] = newProps.style[styleName];
        }
      } else if (key === 'class') {
        el.className = newProps["class"];
      } else {
        el.setAttribute(key, newProps[key]);
      }
    }
  }

  function lifecycleMixin(Vue) {
    Vue.prototype._update = function (vnode) {
      var vm = this;
      vm.$el = patch(vm.$el, vnode);
      console.log(vm.$el);
    };
  }
  function mountComponent(vm, el) {
    var options = vm.$options;
    vm.$el = el;
    console.log(el, vm); // 渲染页面  

    var updateComponent = function updateComponent() {
      // 渲染和更新都会调用这个方法
      // vm._render() 通过解析的render方法来渲染虚拟dom
      // vm._update 通过虚拟dom创建真实dom
      vm._update(vm._render());
    }; // 通过watcher去渲染，每个组件都有一个watcher;


    new Watcher(vm, updateComponent, function () {}, true);
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
    } // 渲染当前组件，挂载组件


    mountComponent(vm, el);
  };

  // 创建虚拟节点
  function createTextNode(text) {
    return vnode(undefined, undefined, undefined, undefined, text);
  }
  function createElement(tag) {
    var data = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var key = data.key;

    if (key) {
      delete data.key;
    }

    for (var _len = arguments.length, children = new Array(_len > 2 ? _len - 2 : 0), _key = 2; _key < _len; _key++) {
      children[_key - 2] = arguments[_key];
    }

    return vnode(tag, data, key, children, undefined);
  }

  function vnode(tag, data, key, children, text) {
    return {
      tag: tag,
      data: data,
      key: key,
      children: children,
      text: text
    };
  }

  function renderMixin(Vue) {
    // _c 创建元素的虚拟节点
    // _v 创建文本的虚拟节点
    // _s JSON.stringify
    Vue.prototype._c = function () {
      return createElement.apply(void 0, arguments); // tag,data,children1,children2
    };

    Vue.prototype._v = function (text) {
      return createTextNode(text);
    };

    Vue.prototype._s = function (val) {
      return val == null ? '' : _typeof(val) === 'object' ? JSON.stringify(val) : val;
    };

    Vue.prototype._render = function () {
      var vm = this;
      var render = vm.$options.render;
      var vnode = render.call(vm); // 去实例上 取值

      return vnode;
    };
  }

  // mixin 合并所有选项
  function initGlobalApi(Vue) {
    Vue.options = {};

    Vue.mixin = function (mixin) {
      // 实现2个对象的合并
      this.options = mergeOptions(this.options, mixin);
    };
  }

  function Vue(options) {
    this._init(options);
  }

  initMixins();
  renderMixin(Vue);
  lifecycleMixin(Vue);
  initGlobalApi(Vue);

  return Vue;

})));
//# sourceMappingURL=vue.js.map
