import {bootstrap, page} from './bootstrap'
let fullpage = {
  init: bootstrap,
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
