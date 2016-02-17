import utils from './utils'

const stepHeight = utils.$$('body')[0].scrollHeight
const stepWidth = utils.$$('body')[0].scrollWidth
const defaults = {
  threshold: 50,              // 触发滚动事件的阈值，越小越灵敏
  pageSpeed: 500,             // 滚屏速度，单位为毫秒 ms
  autoScroll: 0,              // 自动播放事件间隔，如果为 0 则不自动播放
  loopSection: true,          // Section循环滚动
  loopSlide: true,            // Slide循环滑动
  afterLoad: null,            // 页面载入事件
  beforeLeave: null,          // 页面离开事件
  afterSlideLoad: null,       // slide 载入事件
  beforeSlideLeave: null      // slide 离开事件
}

export {
  stepHeight,
  stepWidth,
  defaults
}
