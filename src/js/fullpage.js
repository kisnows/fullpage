/**
 * fullPage v0.11.0 (Alpha)
 * https://github.com/kisnows/fullpage.js
 *
 * Apache License
 *
 * A light JavaScript framework for developer to build some fullPage site by a simple way.Write with pure JavaScript.
 * Author: yq12315@gmail.com
 */

(function (global, fn) {
    "use strict";

    global.fullpage = fn();

})(this, function () {
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

    function setCss(el, props) {
        var prop;
        for (prop in props) {
            if (props.hasOwnProperty(prop)) {
                el.style[prop] = props[prop];
            }
        }
    }

    function setAttr() {

        function translate(el, value, direction) {
            if (direction === 'y') {
                //el.style.transform = "translate3d(0," + value + "px,0)";
                //el.style["-webkit-transform"] = "translate3d(0," + value + "px,0)";
                setCss(el, {
                    'transform': "translate3d(0," + value + "px,0)",
                    '-webkit-transform': "translate3d(0," + value + "px,0)"
                });
                console.log('setAttr Done');
            } else if (direction === 'x') {
                //el.style.transform = "translate3d(" + value + "px,0,0)";
                //el.style["-webkit-transform"] = "translate3d(" + value + "px,0,0)";
                setCss(el, {
                    "transform": "translate3d(" + value + "px,0,0)",
                    "-webkit-transform": "translate3d(" + value + "px,0,0)"
                });
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
    var stepHeight = document.body.scrollHeight;
    var stepWidth = document.body.scrollWidth;

    var options = {};
    var defaults = {
        threshold: 30,              //触发滚动事件的阈值，越小越灵敏
        pageSpeed: 600,             //滚屏速度，单位为毫秒 ms
        afterLoad: null,            //DONE 页面载入事件
        beforeLeave: null           //DONE 页面离开事件
    };

    function initEle() {

        function init() {
            initContent();
            initSlider();
        }

        function initContent() {
            //sectionContent.style.transform = "translate3d(0,0,0)";
            //sectionContent.style["-webkit-transform"] = "translate3d(0,0,0)";
            //sectionContent.style.transitionDuration = options.pageSpeed + 'ms';
            //sectionContent.style.display = "block";
            setCss(sectionContent, {
                "transform": "translate3d(0,0,0)",
                "-webkit-transform": "translate3d(0,0,0)",
                "transitionDuration": options.pageSpeed + 'ms',
                "-webkit-transitionDuration": options.pageSpeed + 'ms',
                "display": "block"
            });
            for (var i = sections.length - 1; i >= 0; i--) {
                sections[i].style.height = document.body.scrollHeight + 'px';
            }
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

    function bindEvent(el) {
        bindTouchMove(el);
        bindKeyboard();
        bindMouseWheel();
    }
    function init(ele, Customize) {

        sectionContent = $(ele);
        options = extendOption(defaults, Customize);

        initEle().init();
        bindEvent(sectionContent);
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

        }, false);

        el.addEventListener('touchend', function (event) {

            event.preventDefault();
            endPos.x = touch.pageX;
            endPos.y = touch.pageY;
            diffX = startPos.x - endPos.x;
            diffY = startPos.y - endPos.y;
            //阈值,灵敏度，越小越灵敏
            var threshold = options.threshold;
            //console.log('diffX:', diffX, 'diffY:', diffY);

            /**
             * 这里有个小bug：
             * 即如果点击屏幕没有移动的话，Math.abs(diffX) - Math.abs(diffY) = 0 ,
             * isVertical 会默认为 true
             * 不过并不影响程序正常运行
             */
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

        }, false);
    }

    // TODO add MouseWheelHandel and bindKeyboard
    function bindMouseWheel() {
        document.addEventListener('mousewheel', function (event) {
            console.log(event.wheelDeltaY, event.deltaY, event);
            var deltaY = event.deltaY;
            if (deltaY > 0) {
                page.move.next()
            } else if (deltaY < 0) {
                page.move.pre();
            }
        }, false);

    }

    function bindKeyboard() {
        document.addEventListener('keydown', function (event) {
            //37 left 38 top 39 right 40 down
            var key = event.keyCode || event.which;
            switch (key) {
                case 37:
                    page.slide.pre();
                    break;
                case 38:
                    page.move.pre();
                    break;
                case 39:
                    page.slide.next();
                    break;
                case 40:
                    page.move.next();
                    break;
            }
        }, false);
    }


    /**
     * 页面滚动主要逻辑
     * @type {{nowPage: number, scrollPage: Function, scrollSlide: Function, move: {next: Function, pre: Function}, moveTo: Function, slide: {next: Function, pre: Function}}}
     */
    var page = {
        nowPage: 1,
        /**
         * Scroll to a specified page.
         * @param pageIndex {number} The page index you want scroll to.
         * @returns {boolean}
         */
        scrollPage: function (pageIndex) {

            var pageDiff = pageIndex - page.nowPage;
            var leaveSection = sections[page.nowPage - 1];
            var nowSection = sections[pageIndex - 1];

            if (pageIndex >= 1 && pageIndex <= sections.length) {

                if (typeof options.beforeLeave === 'function') {
                    /**
                     * leaveSection 函数内部 this 指向，将要离开的 section
                     * page.nowPage 将要离开页面的 index
                     * pageIndex    将要载入页面的 index
                     */
                    options.beforeLeave.call(leaveSection, page.nowPage, pageIndex);
                }

                translate3dY -= pageDiff * stepHeight;
                setAttr().translate(sectionContent, translate3dY, 'y');
                page.nowPage = pageIndex;
                if (typeof options.afterLoad === 'function') {
                    options.pageSpeed = options.pageSpeed ? 500 : options.pageSpeed;
                    setTimeout(function () {
                        /**
                         * nowSection 函数内部 this 指向，载入后的 section
                         * pageIndex 载入后的 index
                         */
                        options.afterLoad.call(nowSection, pageIndex);
                    }, options.pageSpeed);
                }

                console.log('scrollPage to', pageIndex);
                return true;
            } else {
                return false;
            }
        },
        /**
         * Scroll to a specified slide.
         * @param slideIndex {number} The slide index you want scroll to.
         * @returns {boolean}
         */
        scrollSlide: function (slideIndex) {

            //获取slide包裹层
            var slideWrap = $('.slide-wrap', sections[page.nowPage - 1]);

            if (!slideWrap) {
                console.log('This page has no slide');
                return false;
            }

            //当前页面下所有的slide
            var slide = sections[page.nowPage - 1].querySelectorAll('.slide');

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
                console.log('scrollSlide to', slideIndex);
                return true;
            }
        },
        /**
         * Scroll to a specified section and slide.
         * @param pageIndex {number}
         * @param slideIndex {number}
         * @returns {boolean}
         */
        moveTo: function (pageIndex, slideIndex) {
            //DONE move to a specify section or slide
            if (page.scrollPage(pageIndex)) {
                //translate3dY -= pageDiff * stepHeight;
                //setAttr().translate(sectionContent, translate3dY, 'y');
                //page.nowPage = pageIndex;
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
                        callback.call(null, arg);
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
                        callback.call(null, arg);
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
        slideToPre: page.slide.pre
    };
})
;

