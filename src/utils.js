class Utils {
  $$(el, parent) {
    if (!parent) {
      return document.querySelectorAll(el);
    } else {
      return parent.querySelectorAll(el);
    }
  }

  setCss(el, props) {
    let prop;
    for (prop in props) {
      if (props.hasOwnProperty(prop)) {
        el.style[prop] = props[prop];
      }
    }
    return el;
  }

  translate(el, value, direction) {
    if (direction === 'y') {
      this.setCss(el, {
        'transform': "translate3d(0," + value + "px,0)",
        '-webkit-transform': "translate3d(0," + value + "px,0)"
      });
      //console.log('setAttr Done');
    } else if (direction === 'x') {
      this.setCss(el, {
        "transform": "translate3d(" + value + "px,0,0)",
        "-webkit-transform": "translate3d(" + value + "px,0,0)"
      });
    }
  }
}
Utils.transisitonEvent = whichTransitionEvent();


function whichTransitionEvent() {
  let t;
  let el = document.createElement('fakeelement');
  let transitions = {
    'transition': 'transitionend',
    'OTransition': 'oTransitionEnd',
    'MozTransition': 'transitionend',
    'WebkitTransition': 'webkitTransitionEnd',
    'MsTransition': 'msTransitionEnd'
  };

  for (t in transitions) {
    if (el.style[t] !== undefined) {
      return transitions[t];
    }
  }
}

export default new Utils()