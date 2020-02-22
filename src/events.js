function bindEvent (options, page, el) {
  const Events = []

  /**
   * 绑定触摸事件
   */
  function bindTouchMove () {
    let startPos = {}
    let movePos = {}
    let diffX
    let diffY
    let touch
    let onceTouch = false                  //  判断是否为一次触摸，保证一次触摸只触发一次事件

    let threshold = options.threshold      //  阈值,灵敏度，越小越灵敏
    let isVertical                         //  是否为垂直滚动事件

    function touchstartHandle (event) {
      //  onceTouch首先置为true，表明开始了一次触摸
      onceTouch = true
      //  初始化 x,y 值，防止点击一次后出现假 move 事件
      startPos = {}
      if (event.target.tagName.toLowerCase() !== 'a') {
        event.preventDefault()
      }
      touch = event.touches[0]
      startPos.x = touch.pageX
      startPos.y = touch.pageY
    }

    function touchmoveHandle (event) {
      event.preventDefault()
      touch = event.touches[0]
      movePos.x = touch.pageX
      movePos.y = touch.pageY
      diffX = startPos.x - movePos.x
      diffY = startPos.y - movePos.y

      // 如果页面正在滚动或者不是一次滚动事件，则直接return掉
      if (page.isScrolling || !onceTouch) {
        return false
      }

      isVertical = Math.abs(diffX) - Math.abs(diffY) <= 0
      // 如果diff大于阈值，则事件触发，将onceTouch置为false
      onceTouch = Math.max(diffX, diffY) <= threshold
      if (!isVertical) {
        if (diffX > threshold) {
          // Move to left
          page.slide.next()
        } else if (diffX < -threshold) {
          // Move to right
          page.slide.pre()
        }
      } else {
        // isVertical = true
        if (diffY > threshold) {
          // Move to top
          page.move.next()
        } else if (diffY < -threshold) {
          // Move to bottom
          page.move.pre()
        }
      }
    }

    function touchendHandle (event) {
      if (event.target.tagName.toLowerCase() !== 'a') {
        event.preventDefault()
      }
      // 重置onceTouch为true
      onceTouch = true
    }

    let bindOptions = {
      capture: false,
      passive: false
    }

    document.addEventListener('touchstart', touchstartHandle, bindOptions)

    document.addEventListener('touchmove', touchmoveHandle, bindOptions)

    document.addEventListener('touchend', touchendHandle, bindOptions)
  }

  /**
   * 绑定鼠标滚动事件
   */
  function bindMouseWheel () {
    // FIXME change the way binding event.
    let type
    let deltaY

    if (navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
      type = 'DOMMouseScroll'
    } else {
      type = 'mousewheel'
    }

    function mouseWheelHandle (event) {
      if (page.isScrolling) {
        return false
      }
      deltaY = event.detail || -event.wheelDelta || event.deltaY
      if (deltaY > 0) {
        page.move.next()
        // console.log('next')
      } else if (deltaY < 0) {
        page.move.pre()
        // console.log('pre')
      }
    }

    el.addEventListener(type, mouseWheelHandle, false)
  }

  /**
   * 绑定键盘事件
   */
  function bindKeyboard () {
    function keyboardHandle (event) {
      let key = event.keyCode || event.which
      switch (key) {
        case 37:
          page.slide.pre()
          break
        case 38:
          page.move.pre()
          break
        case 39:
          page.slide.next()
          break
        case 40:
          page.move.next()
          break
      }
    }
    // in order to bind key event to a normal element,we should add a tabindex attribute on it.
    el.setAttribute('tabindex', '1')
    el.focus()
    el.addEventListener('keydown', keyboardHandle, false)
  }

  Events.push(bindTouchMove, bindKeyboard, bindMouseWheel)

  Events.forEach(function (now) {
    now()
  })
}

export default bindEvent
