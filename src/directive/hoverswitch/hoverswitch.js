/*
 * @Author: jsjzh
 * @Email: kimimi_king@163.com
 * @LastEditors: jsjzh
 * @Date: 2019-03-05 15:26:27
 * @LastEditTime: 2019-03-06 14:42:19
 * @Description: 鼠标移入移出状态切换
 */

import { on, off } from '@/utils/dom'

const nodeList = []
const context = '@@clickoutsideContext'

let startClick
let mark = 0
let isClear = true

function handleStart(e) {
  startClick = e
}

function handleEnd(e) {
  nodeList.forEach(node => node[context].handleDom(e, startClick))
}

function handleDomFn(el, binding, vnode) {
  return function(mouseup = {}, mousedown = {}) {
    if (el.contains(mouseup.target) || el.contains(mousedown.target)) return
    binding.value()
  }
}

export default {
  bind(el, binding, vnode) {
    if (isClear) {
      on(document, 'mousedown', handleStart)
      on(document, 'mouseup', handleEnd)
      isClear = false
    }

    el[context] = {
      id: mark++,
      handleDom: handleDomFn(el, binding, vnode)
    }

    nodeList.push(el)
  },

  update(el, binding, vnode) {
    el[context].handleDom = handleDomFn(el, binding, vnode)
  },

  unbind(el) {
    let len = nodeList.length

    for (let i = 0; i < len; i++) {
      if (nodeList[i][context].id === el[context].id) {
        nodeList.splice(i, 1)
        break
      }
    }
    delete el[context]

    if (nodeList.length === 0) {
      off(document, 'mousedown', handleStart)
      off(document, 'mouseup', handleEnd)
      isClear = true
    }
  }
}
