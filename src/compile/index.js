// 解析html
const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;  
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 标签开头的正则 捕获的内容是标签名
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`); // 匹配标签结尾的 </div>
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性的
const startTagClose = /^\s*(\/?)>/; // 匹配标签结束的 >
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g

function parseHTML(html){
  // 使用while循环不断解析html标签成函数
  while(html){
    let textEnd = html.indexOf('<');
    if(textEnd === 0){
      // 匹配第一个尖括号<
      const startTagMatch = parseStartTag();
      if(startTagMatch){
        // 遇到html标签就插件ast语法树
        start(parseStartTag.tagName,parseStartTag.attrs)
      }
       
    }
  }

  function start(tagName, attrs){

  }

  function parseStartTag(){
    const start = html.match(startTagOpen);
    if(start){
      const match = {
        tagName: start[1],
        attrs: []
      }
      // 匹配到一个之后就删除，继续从头开始匹配
      advance(start[0].length)
      let attr,end;
      // 捕获属性
      while(!(end = html.match(startTagClose)) && (attr = html.match(attribute))){
        advance(attr[0].length);
        match.attrs.push({name: attr[1], value: attr[3]})
      }
      if(end){
        advance(end[0].length);
        return match
      }
    }
  }
  function advance(n){
    // 截取未捕获的
    html = html.substring(n)
  }
}

export function compileToFunction(template){
  // 讲模板解析成函数
  console.log(template)
  parseHTML(template)
  return function(){}
}