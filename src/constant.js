import utils from './utils'

const stepHeight = utils.$$('body')[0].scrollHeight;
const stepWidth = utils.$$('body')[0].scrollWidth;
const defaults = {
  threshold: 50,              //触发滚动事件的阈值，越小越灵敏
  pageSpeed: 500,             //滚屏速度，单位为毫秒 ms
  autoScroll: false,          //DONE 是否自动播放
  autoScrollDuration: 1000,   //DONE 自动播放间隔时间
  loopSection: true,          //DONE Section循环滚动
  loopSlide: true,            //DONE Slide循环滑动
  afterLoad: null,            //DONE 页面载入事件
  beforeLeave: null,           //DONE 页面离开事件
  afterSlideLoad: null,        //DONE slide 载入事件
  beforeSlideLeave: null      //DONE slide 离开事件
};

export {
  stepHeight,
  stepWidth,
  defaults
}