/**
 * fullPage v0.8.0 (Alpha)
 * https://github.com/kisnows/fullpage.js
 *
 * Apache License
 *
 * A JavaScript lib for developer to develop some fullPage site by a simple way.
 * Author: yq12315@gmail.com
 */

(function (global, fn) {
    "use strict";

    global.fullpage = fn();

})(window, function () {
    "use strict";


    //helper

    function $(el, parent) {
        if (!parent) {
            return document.querySelector(el);
        } else {
            return parent.querySelector(el);
        }
    }

    function $$(el, parent) {
        if (!parent) {
            return document.querySelectorAll(el);
        } else {
            return parent.querySelectorAll(el);
        }
    }

    function setAttr() {

        function translate(el, value, direction) {
            if (direction === 'y') {
                el.style.transform = "translate3d(0," + value + "px,0)";
                el.style["-webkit-transform"] = "translate3d(0," + value + "px,0)";
            } else if (direction === 'x') {
                el.style.transform = "translate3d(" + value + "px,0,0)";
                el.style["-webkit-transform"] = "translate3d(" + value + "px,0,0)";
            }
        }

        return {
            translate: translate
        };
    }

    /**
     * 扩展 Option 对象
     * @param {Object} Default 默认设置
     * @param {Object} Customize 自定义设置
     * @returns {Object} Default 扩展后的设置
     */
    function extendOption(Default, Customize) {
        if (typeof Customize !== 'object') {
            Customize = {};
        }
        for (var i in Customize) {
            if (Default.hasOwnProperty(i)) {
                Default[i] = Customize[i];
            }
        }
        return Default;
    }

    //end helper

    var sectionContent;
    var sections = $$('.section');

    var translate3dY = 0;
    var stepHeight = sections[0].offsetHeight;
    var stepWidth = sections[0].offsetWidth;

    var options = {};
    var defaults = {
        threshold: 30,              //触发滚动事件的阈值，越小越灵敏
        pageSpeed: 600,             //滚屏速度，单位为毫秒 ms
        afterLoad: null,            //TODO 页面载入事件
        beforeLeave: null           //TODO 页面离开事件
    };

    function initEle() {

        function init() {
            initContent();
            initSlider();
        }

        function initContent() {
            sectionContent.style.transform = "translate3d(0,0,0)";
            sectionContent.style["-webkit-transform"] = "translate3d(0,0,0)";
            sectionContent.style.transitionDuration = options.pageSpeed + 'ms';
            sectionContent.style.height = "100%";
            sectionContent.style.display = "block";
        }

        function initSlider() {
            var sliderWrap = $$('.slide-wrap');
            var sliders;
            for (var i = sliderWrap.length - 1; i >= 0; i--) {
                sliders = $$('.slide', sliderWrap[i]);
                for (var j = sliders.length - 1; j >= 0; j--) {
                    sliders[j].style.width = stepWidth + 'px';
                }
                sliderWrap[i].style.width = sliders.length * stepWidth + 'px';
                sliderWrap[i].dataset.x = '0';
                sliderWrap[i].dataset.index = '1';
            }
        }

        return {
            init: init,
            initContent: initContent,
            initSlider: initSlider
        };
    }

    function init(ele, Customize) {

        sectionContent = $(ele);
        options = extendOption(defaults, Customize);

        initEle().init();
        bindTouchMove(sectionContent);
    }

    /**
     * 绑定触摸事件
     * @param el {string}
     */
    function bindTouchMove(el) {

        var startPos = {},
            endPos = {};
        var diffX,
            diffY;
        var touch;
        var isVertical = false;

        el.addEventListener('touchstart', function (event) {

            // 初始化 x,y 值，防止点击一次后出现假 move 事件
            startPos = {};
            endPos = {};
            event.preventDefault();
            touch = event.touches[0];
            startPos.x = touch.pageX;
            startPos.y = touch.pageY;
            //console.log(startPos.x,startPos.y);
        }, false);

        el.addEventListener('touchmove', function (event) {
            //TODO add eventHandel
            event.preventDefault();
            touch = event.touches[0];
            diffX = startPos.x - touch.pageX;
            diffY = startPos.y - touch.pageY;
            //阈值,灵敏度，越小越灵敏
            var threshold = options.threshold;
            isVertical = Math.abs(diffX) - Math.abs(diffY) <= 0;

            if (!isVertical) {
                //horizontal
                //isVertical = false;
                if (diffX > threshold) {
                    //Move to left
                    page.slide.next();
                } else if (diffX < -threshold) {
                    //Move to right
                    page.slide.pre();
                }
            } else {
                //vertical
                //isVertical = true;
                if (diffY > threshold) {
                    //Move to top
                    page.move.next();
                } else if (diffY < -threshold) {
                    //Move to bottom
                    page.move.pre();
                }
            }
            console.log(touch.pageX, touch.pageY);
        }, false);

        el.addEventListener('touchend', function (event) {

            event.preventDefault();
            //endPos.x = touch.pageX;
            //endPos.y = touch.pageY;
            //diffX = startPos.x - endPos.x;
            //diffY = startPos.y - endPos.y;
            ////阈值,灵敏度，越小越灵敏
            //var threshold = options.threshold;
            ////console.log('diffX:', diffX, 'diffY:', diffY);
            //
            ///**
            // * 这里有个小bug：
            // * 即如果点击屏幕没有移动的话，Math.abs(diffX) - Math.abs(diffY) = 0 ,
            // * isVertical 会默认为 true
            // * 不过并不影响程序正常运行
            // */
            //isVertical = Math.abs(diffX) - Math.abs(diffY) <= 0;
            //
            //if (!isVertical) {
            //    //horizontal
            //    //isVertical = false;
            //    if (diffX > threshold) {
            //        //Move to left
            //        page.slide.next();
            //    } else if (diffX < -threshold) {
            //        //Move to right
            //        page.slide.pre();
            //    }
            //} else {
            //    //vertical
            //    //isVertical = true;
            //    if (diffY > threshold) {
            //        //Move to top
            //        page.move.next();
            //    } else if (diffY < -threshold) {
            //        //Move to bottom
            //        page.move.pre();
            //    }
            //}

        }, false);
    }

    // TODO add MouseWheelHandel and bindKeyboard
    function bindMouseWheel(el) {
    }

    function bindKeyboard(el) {
    }

    /**
     * 页面滚动主要逻辑
     * @type {{nowPage: number, scrollPage: Function, scrollSlide: Function, move: {next: Function, pre: Function}, moveTo: Function, slide: {next: Function, pre: Function}}}
     */
    var page = {
        nowPage: 1,
        scrollPage: function (pageIndex) {
            var pageDiff = pageIndex - page.nowPage;

            if (pageIndex >= 1 && pageIndex <= sections.length) {

                translate3dY -= pageDiff * stepHeight;
                setAttr().translate(sectionContent, translate3dY, 'y');
                page.nowPage = pageIndex;

                return true;
            } else {
                return false;
            }
        },
        scrollSlide: function (slideIndex) {

            //当前页面下所有的slide
            var slide = sections[page.nowPage - 1].querySelectorAll('.slide');

            //获取slide包裹层
            var slideWrap = $('.slide-wrap', sections[page.nowPage - 1]);

            //当前页面上存储的数据
            var slideData = slideWrap.dataset;

            //当前页面上slide的index
            var slideNowIndex = parseInt(slideData.index);

            //当前页面上slide的x轴偏移值
            var slideX = slideData.x;

            var slideDiff = slideIndex - slideNowIndex;

            if (slideIndex >= 1 && slideIndex <= slide.length) {

                slideX -= slideDiff * stepWidth;
                setAttr().translate(slideWrap, slideX, 'x');
                slideData.x = slideX;
                slideData.index = slideIndex;

                return true;
            }
        },
        moveTo: function (pageIndex, slideIndex) {
            //DONE move to a specify section or slide
            var pageDiff = pageIndex - page.nowPage;

            if (pageIndex >= 1 && pageIndex <= sections.length) {
                translate3dY -= pageDiff * stepHeight;
                setAttr().translate(sectionContent, translate3dY, 'y');
                page.nowPage = pageIndex;
                if (slideIndex) {
                    //DONE move to a specify slide
                    page.scrollSlide(slideIndex);
                }
                return true;
            } else {
                return false;
            }

        },
        move: {
            next: function (callback) {

                //DONE move to next section
                //DONE add move next eventHandler

                if (page.scrollPage(page.nowPage + 1)) {

                    var arg = Array.prototype.slice.call(arguments, 1);

                    if (typeof callback === 'function') {
                        callback.apply(null, arg);
                    }
                    return true;
                } else {
                    return false;
                }
            },
            pre: function (callback) {

                //DONE move to pre section
                //DONE add move pre eventHandler

                if (page.scrollPage(page.nowPage - 1)) {

                    var arg = Array.prototype.slice.call(arguments, 1);

                    if (typeof callback === 'function') {
                        callback.apply(null, arg);
                    }
                    return true;
                } else {
                    return false;
                }
            }
        },
        slide: {
            next: function () {
                var slideWrap = $('.slide-wrap', sections[page.nowPage - 1]);

                if (!slideWrap) {
                    return false;
                } else {
                    var slideData = slideWrap.dataset;
                    var slideNowIndex = parseInt(slideData.index);

                    if (page.scrollSlide(slideNowIndex + 1)) {

                        slideData.index = slideNowIndex + 1;
                        //console.log('slide move to next');
                        return true;
                    }
                    return false;
                }

            },
            pre: function () {

                var slideWrap = $('.slide-wrap', sections[page.nowPage - 1]);

                if (!slideWrap) {
                    return false;
                } else {
                    var slideData = slideWrap.dataset;
                    var slideNowIndex = parseInt(slideData.index);

                    if (page.scrollSlide(slideNowIndex - 1)) {

                        slideData.index = slideNowIndex - 1;
                        //console.log('slide move to pre');
                        return true;
                    }
                    return false;
                }

            }
        }
    };

    return {
        init: init,
        scrollPage: page.scrollPage,
        scrollSlide: page.scrollSlide,
        moveTo: page.moveTo,
        moveToNext: page.move.next,
        moveToPre: page.move.pre,
        slideToNext: page.slide.next,
        slideToPre: page.slide.pre,
        //afterLoad: page.afterLoad,
        //beforeLeave: page.beforeLeave
    };
});

