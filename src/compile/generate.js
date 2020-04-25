// 处理{{}}里面变量的正则
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g
function genChildren (el) {
  let children = el.children
  if (children.length > 0) {
    return `${children.map(c => gen(c)).join(',')}`
  } else {
    return false;
  }
}
// 
function gen (node) {
  if (node.type == 1) {
    // 元素标签
    return generate(node);
  } else {
    // 文本节点
    let text = node.text; // {{name}}
    let tokens = [];
    let match, index;
    // 每次的偏移量 buff.split()
    let lastIndex = defaultTagRE.lastIndex = 0;
    while (match = defaultTagRE.exec(text)) {
      index = match.index;
      if (index > lastIndex) {
        tokens.push(JSON.stringify(text.slice(lastIndex, index)))
      }
      tokens.push(`_s(${match[1].trim()})`);
      lastIndex = index + match[0].index;
    }
    if (lastIndex < text.length) {
      tokens.push(JSON.stringify(text.slice(lastIndex)))
    }
    return `_v(${tokens.join('+')})`;
  }
}

function genprops (attrs) {
  // 处理属性
  let str = '';
  for (let i = 0; i < attrs.length; i++) {
    let attr = attrs[i];
    if (attr.name === 'style') {
      let obj = {}
      attr.value.split(';').forEach(item => {
        let [key, value] = item.split(':');
        obj[key] = value;
      })
      attr.value = obj;
    }
    str += `${attr.name}:${JSON.stringify(attr.value)},`;
  }
  return `{${str.slice(0, -1)}}`;
}

export function generate (el) {
  let children = genChildren(el)
  let code = `_c('${el.tag}',${
    el.attrs.length ? `${genprops(el.attrs)} ` : 'undefined'
    }${
    children ? `,${children}` : ''
    })
  `;
  // console.log(code)
  return code;
}