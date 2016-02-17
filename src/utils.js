let utils = {
  $$ (el, parent) {
    if (!parent) {
      return document.querySelectorAll(el)
    } else {
      return parent.querySelectorAll(el)
    }
  },

  setCss (el, props) {
    let prop
    for (prop in props) {
      if (props.hasOwnProperty(prop)) {
        el.style[prop] = props[prop]
      }
    }
    return el
  },

  translate (el, value, direction) {
    if (direction === 'y') {
      this.setCss(el, {
        'transform': 'translate3d(0,' + value + 'px,0)',
        '-webkit-transform': 'translate3d(0,' + value + 'px,0)'
      })
      // console.log('setAttr Done')
    } else if (direction === 'x') {
      this.setCss(el, {
        'transform': 'translate3d(' + value + 'px,0,0)',
        '-webkit-transform': 'translate3d(' + value + 'px,0,0)'
      })
    }
  },

  /**
   * 只给一组元素中的某一个元素添加class
   * @param els 一组元素
   * @param theOne 要添加元素的index值
   */
  addClassToOneEle (els, theOne) {
    for (let j = els.length - 1; j >= 0; j--) {
      els[j].classList.remove('active')
    }
    els[theOne].classList.add('active')
  },
  transitionEvent: whichTransitionEvent()

}

function whichTransitionEvent () {
  let t
  let el = document.createElement('fakeelement')
  let transitions = {
    'transition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'MozTransition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd',
    'MsTransition': 'msTransitionEnd'
  }

  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t]
    }
  }
}

export default Object.create(utils)
