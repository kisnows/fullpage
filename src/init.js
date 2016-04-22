import utils from './utils'
import {defaults, stepHeight, stepWidth} from './constant'
import bindEvent from './events'
import page from './page'

let sectionContent
let sections
let options


function init (ele, Customize) {
  sectionContent = utils.$$(ele)[0]
  sections = utils.$$('.fp-section')
  options = Object.assign({}, defaults, Customize)
  initEle()
  bindEvent(options, page, sectionContent)
}

function initEle () {
  function init () {
    initContent()
    initSlide()
    pageController()
    customize()
  }

  init()
  /**
   * 初始化 Section
   */
  function initContent () {
    utils.setCss(sectionContent, {
      'transform': 'translate3d(0,0,0)',
      '-webkit-transform': 'translate3d(0,0,0)',
      'transitionDuration': options.pageSpeed + 'ms',
      '-webkit-transitionDuration': options.pageSpeed + 'ms',
      'display': 'block'
    })

    sectionContent.addEventListener(utils.transitionEvent, function () {
      page.isScrolling = false
    }, false)

    for (let i = sections.length - 1; i >= 0; i--) {
      sections[i].style.height = stepHeight + 'px'
    }

    sections[page.nowPage].classList.add('active')
  }

  /**
   * 初始化 Slide
   */
  function initSlide () {
    let slideWrap = utils.$$('.fp-slide-wrap')
    let slides

    function slideWrapInitHandle () {
      page.isScrolling = false
    }

    for (let i = slideWrap.length - 1; i >= 0; i--) {
      slides = utils.$$('.fp-slide', slideWrap[i])
      for (let j = slides.length - 1; j >= 0; j--) {
        slides[j].style.width = stepWidth + 'px'
      }
      slideWrap[i].style.width = slides.length * stepWidth + 'px'
      slideWrap[i].dataset.x = '0'
      slideWrap[i].dataset.index = '1'
      slideWrap[i].addEventListener(utils.transitionEvent, slideWrapInitHandle, false)
    }
  }

  /**
   * 初始化翻页控制点
   */
  function pageController () {
    function init () {
      createControllerNode()
      bindEvent()
      initController()
    }

    init()
    // 插入控制点
    function createControllerNode () {
      let controllerWrap = document.createElement('div')
      let controllerText = ''
      controllerWrap.className = 'fp-controller'
      for (let i = sections.length; i--; i > 0) {
        controllerText += "<div class='fp-controller-dotted'></div>"
      }
      controllerWrap.innerHTML = controllerText
      document.body.appendChild(controllerWrap)
    }

    // 给控制点绑定切换事件
    function bindEvent () {
      let controllers = utils.$$('.fp-controller-dotted')
      for (let i = controllers.length - 1; i >= 0; i--) {
        controllers[i].addEventListener('click', helper(i + 1), false)
      }
      function helper (i) {
        return function () {
          utils.addClassToOneEle(controllers, i - 1)
          page.moveTo(i)
        }
      }
    }

    // 获取控制点初试状态
    function initController () {
      let controllers = utils.$$('.fp-controller-dotted')
      controllers[page.nowPage].classList.add('active')
    }
  }

  /**
   * 初始化定制内容
   */
  function customize () {
    let prop = {
      autoScroll: function () {
        /* eslint-disable */
        let timer = null
        /* eslint-enable */
        if (options.autoScroll) {
          timer = setInterval(function () {
            page.move.next()
          }, options.autoScroll)
        }
      }
    }

    for (let key in prop) {
      if (prop.hasOwnProperty(key)) {
        prop[key]()
      }
    }
  }
}


export {init, sectionContent, sections, options}
