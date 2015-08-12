/**
 * Created by qi on 2015/7/23.
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
                console.log('slide translate3d change');
            }
        }

        return {
            translate: translate
        };
    }

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
        threshold: 10,
        pageSpeed: 600
    };

    function initEle() {

        sectionContent.style.transform = "translate3d(0,0,0)";
        sectionContent.style["-webkit-transform"] = "translate3d(0,0,0)";

        var slideWrap = $$('.slide-wrap');
        var sliders;
        for (var i = slideWrap.length; i >= 0; i++) {
            sliders = $$('.slide', slideWrap[i]);
            slideWrap[i].style.width = sliders.length * stepWidth + 'px';
        }

    }

    function init(ele, Customize) {

        sectionContent = $(ele);
        options = extendOption(defaults, Customize);

        initEle();
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
        var direction;
        var isVertical = false;

        el.addEventListener('touchstart', function (event) {

            // 初始化 x,y 值，防止点击一次后出现假 move 事件
            startPos = {};
            endPos = {};
            event.preventDefault();
            touch = event.touches[0];
            startPos.x = touch.pageX;
            startPos.y = touch.pageY;

        }, false);

        el.addEventListener('touchmove', function (event) {

            event.preventDefault();
            touch = event.touches[0];
            endPos.x = touch.pageX;
            endPos.y = touch.pageY;
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
                    direction = 'left';
                    console.log('Go left');
                } else if (diffX < -threshold) {
                    //Move to right
                    direction = 'right';
                    console.log('Go right');
                }
            } else {
                //vertical
                //isVertical = true;
                if (diffY > threshold) {
                    //Move to top
                    direction = 'next';
                } else if (diffY < -threshold) {
                    //Move to bottom
                    direction = 'pre';
                }
            }
            if (direction) {
                if (isVertical) {
                    page.move[direction]();
                } else {
                    page.slide[direction]();
                }
            }
        }, false);
    }

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
            var slide = sections[page.nowPage - 1].querySelectorAll('slide');
            //当前页面上存储的数据
            var slideData = sections[page.nowPage - 1].dataset;
            //当前页面上slide的index
            var slideNowIndex = slideData.index;
            //当前页面上slide的x轴偏移值
            var slideX = slideData.x;
            var slideDiff = slideIndex - slideNowIndex;

            if (slideIndex >= 1 && slideIndex <= slide.lenght) {

                slideX -= slideDiff * stepWidth;
                setAttr().translate(slide[slideNowIndex], slideX, 'x');
            }
        },
        move: {
            next: function (callback) {

                //DONE move to next section
                //DONE add move next eventHandler

                var arg = Array.prototype.slice.call(arguments, 1);

                if (page.nowPage < sections.length) {

                    translate3dY -= stepHeight;
                    setAttr().translate(sectionContent, translate3dY, 'y');
                    console.log('page move to next');

                    page.nowPage = page.nowPage === sections.length ? sections.length : page.nowPage + 1;

                    if (typeof callback === 'function') {
                        console.log('arg', arg);
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

                var arg = Array.prototype.slice.call(arguments, 1);

                if (page.nowPage > 1) {

                    translate3dY += stepHeight;
                    setAttr().translate(sectionContent, translate3dY, 'y');
                    console.log('page move to pre');

                    page.nowPage = page.nowPage === 1 ? 1 : page.nowPage - 1;

                    if (typeof callback === 'function') {
                        callback.apply(null, arg);
                    }
                    return true;
                } else {
                    return false;
                }
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
                    //TODO move to a specify slide
                    /**
                     * 把每个页面的当前slideIndex以data-slide的方式存在section中，
                     * 然后再用的时候取出来。data-slide 从1开始计数。
                     */
                    //var slideNowIndex = sections[pageIndex - 1].attribute('data-slide');
                    //var slideDiff = slideIndex - slideNowIndex;
                }
                return true;
            } else {
                return false;
            }

        },
        slide: {
            left: function () {
                console.log('slide move to next');
            },
            right: function () {
                console.log('slide move to pre');
            }
        }
    };

    return {
        initEle: init,
        moveTo: page.moveTo,
        moveToNext: page.move.next,
        moveToPre: page.move.pre,
        slideToLeft: page.slide.left,
        slideToRight: page.slide.right
    };
});

