import {parseHTML} from './parse-html'
import {generate} from './generate'
export function compileToFunction(template){
  // 讲模板解析成函数
  
  // 1 将模板生成ast语法树
  let root = parseHTML(template); 
  // 2 将ast语法树生成render 函数() 核心思路就是将模板转化成 下面这段字符串
  //  <div id="app"><p>hello {{name}}</p> hello</div>
  // 将ast树 再次转化成js的语法
  //  _c("div",{id:app},_c("p",undefined,_v('hello' + _s(name) )),_v('hello'))
  let code = generate(root)
  // console.dir(root)
  // let renderFn = new Function(`with`)

  // return function(){}
}