import utils from './utils'
import {stepHeight, stepWidth, sectionContent, sections, options} from './init'

let page = {
  nowPage: 0,
  isScrolling: false,
  translate3dY: 0,
  /**
   * Scroll to a specified page.
   * @param pageIndex {number} The page index you want scroll to.
   * @returns {boolean}
   */
  scrollPage: function (pageIndex) {
    let pageDiff = pageIndex - page.nowPage
    let leaveSection = sections[page.nowPage]
    let nowSection = sections[pageIndex]
    let controllers = utils.$$('.fp-controller-dotted')
    if (pageIndex >= 0 && pageIndex <= sections.length - 1 && !page.isScrolling && pageDiff) {
      if (typeof options.beforeLeave === 'function') {
        /**
         * leaveSection 函数内部 this 指向，为将要离开的 section
         * page.nowPage 将要离开页面的 index
         * pageIndex    将要载入页面的 index
         */
        options.beforeLeave.call(leaveSection, page.nowPage, pageIndex)
      }

      leaveSection.classList.remove('active')
      utils.addClassToOneEle(controllers, pageIndex)
      page.translate3dY -= pageDiff * stepHeight
      utils.translate(sectionContent, page.translate3dY, 'y')
      page.isScrolling = true
      page.nowPage = pageIndex
      nowSection.classList.add('active')

      if (typeof options.afterLoad === 'function') {
        options.pageSpeed = options.pageSpeed ? 500 : options.pageSpeed
        setTimeout(function () {
          /**
           * nowSection 函数内部 this 指向,为载入后的 section
           * pageIndex 载入后的 index
           */
          options.afterLoad.call(nowSection, pageIndex)
        }, options.pageSpeed)
      }
      return true
    } else {
      return false
    }
  },
  /**
   * Scroll to a specified slide.
   * @param slideIndex {number} The slide index you want scroll to.
   * @returns {boolean}
   */
  scrollSlide: function (slideIndex) {
    // 获取slide包裹层
    let slideWrap = utils.$$('.fp-slide-wrap', sections[page.nowPage])[0]

    if (!slideWrap) {
      console.log('This page has no slide')
      return false
    }

    // 当前页面下所有的slide
    let slide = sections[page.nowPage].querySelectorAll('.fp-slide')

    // 当前页面上存储的数据
    let slideData = slideWrap.dataset

    // 当前页面上slide的index
    let slideNowIndex = parseInt(slideData.index, 10)

    // 当前页面上slide的x轴偏移值
    let slideX = slideData.x

    let slideDiff = slideIndex - slideNowIndex

    if (slideIndex >= 0 && slideIndex <= slide.length - 1 && !page.isScrolling) {
      if (typeof options.beforeSlideLeave === 'function') {
        /**
         * leaveSlide           函数内部 this 指向，将要离开的 slide
         * page.nowPage         将要离开 section 的 index
         * slideNowIndex        将要离开 slide 的 index
         * slideIndex           将要载入 slide 的 index
         */
        options.beforeSlideLeave.call(slide[slideNowIndex], page.nowPage, slideNowIndex, slideIndex)
      }

      slide[slideNowIndex].classList.remove('active')
      slideX -= slideDiff * stepWidth
      utils.translate(slideWrap, slideX, 'x')
      page.isScrolling = true
      slideData.x = slideX
      slideData.index = slideIndex
      slide[slideIndex].classList.add('active')

      if (typeof options.afterSlideLoad === 'function') {
        options.pageSpeed = options.pageSpeed ? 500 : options.pageSpeed
        setTimeout(function () {
          /**
           * nowSection           函数内部 this 指向，载入后的 section
           * page.nowPage         将要载入 section 的 index
           * pageIndex            载入后的 Slide 的 index
           */
          options.afterSlideLoad.call(slide[slideIndex], page.nowPage, slideIndex)
        }, options.pageSpeed)
      }
      return true
    }
    return false
  },
  /**
   * Scroll to a specified section and slide.
   * @param pageIndex {number}
   * @param slideIndex {number}
   * @returns {boolean}
   */
  moveTo: function (pageIndex, slideIndex) {
    // DONE move to a specify section or slide
    if (page.nowPage === pageIndex || page.scrollPage(pageIndex)) {
      if (typeof slideIndex !== 'undefined') {
        // DONE move to a specify slide
        return !!page.scrollSlide(slideIndex)
      }
      return true
    } else {
      return false
    }
  },
  move: {
    next: function (callback) {
      if (page.scrollPage(page.nowPage + 1)) {
        let arg = Array.prototype.slice.call(arguments, 1)

        if (typeof callback === 'function') {
          callback(arg)
        }
        return true
      } else if (options.loopSection) {
        page.moveTo(0)

        return true
      } else {
        return false
      }
    },
    pre: function (callback) {
      if (page.scrollPage(page.nowPage - 1)) {
        let arg = Array.prototype.slice.call(arguments, 1)

        if (typeof callback === 'function') {
          callback(arg)
        }
        return true
      } else {
        return false
      }
    }
  },
  slide: {
    /**
     * slide move 方法，移动到上一个或下一个 slide
     * @param {string} direction 要移动的方向，next 为下一个， pre 为上一个
     * @returns {boolean}
     */
    move: function (direction) {
      let slideWrap = utils.$$('.fp-slide-wrap', sections[page.nowPage])[0]
      let slide = sections[page.nowPage].querySelectorAll('.fp-slide')
      // slideNowIndexChange slideNowIndex 将要的变化
      let slideNowIndexChange
      // slideWillBe 将要滚到slide的index
      let slideWillBe
      if (direction === 'next') {
        slideNowIndexChange = 1
        slideWillBe = 0
      } else if (direction === 'pre') {
        slideNowIndexChange = -1
        slideWillBe = slide.length - 1
      }
      if (!slideWrap) {
        return false
      } else {
        let slideData = slideWrap.dataset
        let slideNowIndex = parseInt(slideData.index, 10)

        if (page.scrollSlide(slideNowIndex + slideNowIndexChange)) {
          slideData.index = slideNowIndex + slideNowIndexChange
          return true
        } else if (options.loopSlide && page.scrollSlide(slideWillBe)) {
          slideData.index = slideWillBe
          return true
        }
        return false
      }
    },
    next: function () {
      page.slide.move('next')
    },
    pre: function () {
      page.slide.move('pre')
    }
  }
}

export default page
