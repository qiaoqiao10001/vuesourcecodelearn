import {parseHTML} from './parse-html'
import {generate} from './generate'
export function compileToFunction(template){
  // 讲模板解析成函数
  
// ast语法树和虚拟dom 为什么要转render呢：
// 为了解析其他指令来 ，ast语法树不能生成事件等， 需要转虚拟dom来解析指令

  // 1 将模板生成ast语法树
  let root = parseHTML(template); 
  console.log(root)
  // 将ast语法树生成render 函数() 核心思路就是将模板转化成 下面这段字符串
  //  <div id="app"><p>hello {{name}}</p> hello</div>
  // 2 将ast树 再次转化成js的语法
  let code = generate(root)
  console.log(code)
  // 这一步生成的code
  /*
  _c("div", {id:"app},_c("h2", {style:{"color":"red","fontSize":"16px"},_v("compile函数"))
  ,_c("p", undefined,_v(_s(name)))
  ,_c("span", undefined,_v(_s(age)))
  )  
  */
  // 3 生成render函数
  // let renderFn = new Function(`with(this){return ${code}}`);
  let renderFn = new Function(`with(this){ return ${code}}`);
  console.log(renderFn)
  return renderFn;
}