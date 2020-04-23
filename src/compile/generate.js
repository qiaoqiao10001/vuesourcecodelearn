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
    console.log(`_v(${tokens.join('+')})`)
    return `_v(${tokens.join('+')})`;
  }
}

function genprops (attrs) {
  // 
}

export function generate (el) {
  let children = genChildren(el)
  let code = `_c"${el.tag}", ${
    el.attrs.length ? genprops(el.attrs) : 'undefined'
    }${
    children ? `,${children}` : ''
    }
  `
  console.log(code)
  return code;
}