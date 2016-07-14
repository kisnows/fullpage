import {init} from './init'
import page from './page'

let fullpage = {
  init: init,
  scrollPage: page.scrollPage,
  scrollSlide: page.scrollSlide,
  moveTo: page.moveTo,
  moveToNext: page.move.next,
  moveToPre: page.move.pre,
  slideToNext: page.slide.next,
  slideToPre: page.slide.pre
};

(function (global) {
  global.fullpage = fullpage
})(window)

export default fullpage
