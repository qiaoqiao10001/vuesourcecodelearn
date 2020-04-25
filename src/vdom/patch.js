export function patch (oldVnode, vnode) {
  // 用来判断是用来渲染还是更新
  const isRealElement = oldVnode.nodeType;
  if (isRealElement) {
    const oldElm = oldVnode;
    const parentElm = oldElm.parentNode;
    let el = createElm(vnode);
    parentElm.insertBefore(el, oldElm.nextSibling);
    parentElm.removeChild(oldVnode)
    return el;
  }
}

function createElm (vnode) {
  let { tag, children, key, data, text } = vnode;
  if (typeof tag === 'string') {
    vnode.el = document.createElement(tag)
    upateProperties(vnode)
    children.forEach(child => {// 有子节点就递归创建子节点
      return vnode.el.appendChild(createElm(child))
    })

  } else {
    vnode.el = document.createTextNode(text)
  }
  return vnode.el;
}

function upateProperties (vnode) {
  let newProps = vnode.data;
  let el = vnode.el;
  for (let key in newProps) {
    if (key === 'style') {
      for (let styleName in newProps.style) {
        el.style[styleName] = newProps.style[styleName];
      }
    } else if (key === 'class') {
      el.className = newProps.class;
    } else {
      el.setAttribute(key, newProps[key]);
    }
  }
}