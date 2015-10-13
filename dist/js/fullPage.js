/**
 * fullPage v1.3.0
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


    //helper===========================================================

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
        return el;
    }

    function setAttr() {

        function translate(el, value, direction) {
            if (direction === 'y') {
                setCss(el, {
                    'transform': "translate3d(0," + value + "px,0)",
                    '-webkit-transform': "translate3d(0," + value + "px,0)"
                });
                //console.log('setAttr Done');
            } else if (direction === 'x') {
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

    /**
     * 动画检测
     */
    /* From Modernizr */
    function whichTransitionEvent() {
        var t;
        var el = document.createElement('fakeelement');
        var transitions = {
            'transition': 'transitionend',
            'OTransition': 'oTransitionEnd',
            'MozTransition': 'transitionend',
            'WebkitTransition': 'webkitTransitionEnd',
            'MsTransition': 'msTransitionEnd'
        };

        for (t in transitions) {
            if (el.style[t] !== undefined) {
                return transitions[t];
            }
        }
    }

    /* Listen for a transition! */
    var transitionEvent = whichTransitionEvent();

    //end helper=========================================================

    var sectionContent;
    var sections;
    var translate3dY = 0;
    var stepHeight = $$('body')[0].scrollHeight;
    var stepWidth = $$('body')[0].scrollWidth;

    var options = {};
    var defaults = {
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


    /**
     * 绑定触摸事件
     * @param ele {string}
     */
    function bindTouchMove(ele) {

        var startPos = {},
            movePos = {},
            endPos = {};
        var diffX,
            diffY;
        var touch;
        var onceTouch = false;                  //判断是否为一次触摸，保证一次触摸只触发一次事件

        var threshold = options.threshold;      //阈值,灵敏度，越小越灵敏
        var isVertical;                         //是否为垂直滚动事件

        function touchstartHandle(event) {
            //onceTouch首先置为true，表明开始了一次触摸
            onceTouch = true;
            // 初始化 x,y 值，防止点击一次后出现假 move 事件
            startPos = {};
            endPos = {};
            if (event.target.tagName.toLowerCase() !== 'a') {
                event.preventDefault();
            }
            touch = event.touches[0];
            startPos.x = touch.pageX;
            startPos.y = touch.pageY;
            //console.log(startPos.x,startPos.y);
        }

        function touchmoveHandle(event) {

            //DONE add eventHandel
            event.preventDefault();
            touch = event.touches[0];
            movePos.x = touch.pageX;
            movePos.y = touch.pageY;
            diffX = startPos.x - movePos.x;
            diffY = startPos.y - movePos.y;

            //如果页面正在滚动或者不是一次滚动事件，则直接return掉
            if (page.isScrolling || !onceTouch) {
                return false;
            }

            isVertical = Math.abs(diffX) - Math.abs(diffY) <= 0;
            //如果diff大于阈值，则事件触发，将onceTouch置为false
            onceTouch = Math.max(diffX, diffY) <= threshold;
            if (!isVertical) {
                if (diffX > threshold) {
                    //Move to left
                    page.slide.next();
                } else if (diffX < -threshold) {
                    //Move to right
                    page.slide.pre();
                }
            } else {
                //isVertical = true;
                if (diffY > threshold) {
                    //Move to top
                    page.move.next();
                } else if (diffY < -threshold) {
                    //Move to bottom
                    page.move.pre();
                }
            }
        }

        function touchendHandle(event) {
            if (event.target.tagName.toLowerCase() !== 'a') {
                event.preventDefault();
            }
            //重置onceTouch为true
            onceTouch = true;
        }

        ele.addEventListener('touchstart', touchstartHandle, false);

        ele.addEventListener('touchmove', touchmoveHandle, false);

        ele.addEventListener('touchend', touchendHandle, false);
    }

    /**
     * 绑定鼠标滚动事件
     */
    function bindMouseWheel() {
        //FIXME change the way binding event.
        var type;
        var deltaY;

        if (navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
            type = 'DOMMouseScroll';
        } else {
            type = 'mousewheel';
        }

        function mouseWheelHandle(event) {
            if (page.isScrolling) {
                return false;
            }
            deltaY = event.detail || -event.wheelDelta || event.deltaY;
            if (deltaY > 0) {
                page.move.next();
                //console.log('next');
            } else if (deltaY < 0) {
                page.move.pre();
                //console.log('pre');
            }
        }

        document.addEventListener(type, mouseWheelHandle, false);
    }

    /**
     * 绑定键盘事件
     */
    function bindKeyboard() {
        function keyboardHandle(event) {
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
        }

        document.addEventListener('keydown', keyboardHandle, false);
    }

    /**
     * 页面滚动主要逻辑
     * @type {{nowPage: number, scrollPage: Function, scrollSlide: Function, move: {next: Function, pre: Function}, moveTo: Function, slide: {next: Function, pre: Function}}}
     */
    var page = {
        nowPage: 1,
        isScrolling: false,
        modifyIsScrolling: function () {

        },
        /**
         * Scroll to a specified page.
         * @param pageIndex {number} The page index you want scroll to.
         * @returns {boolean}
         */
        scrollPage: function (pageIndex) {

            var pageDiff = pageIndex - page.nowPage;
            var leaveSection = sections[page.nowPage - 1];
            var nowSection = sections[pageIndex - 1];
            var controllers = $$('.fp-controller-dotted');
            if (pageIndex >= 1 && pageIndex <= sections.length && !page.isScrolling && pageDiff) {

                if (typeof options.beforeLeave === 'function') {
                    /**
                     * leaveSection 函数内部 this 指向，将要离开的 section
                     * page.nowPage 将要离开页面的 index
                     * pageIndex    将要载入页面的 index
                     */
                    options.beforeLeave.call(leaveSection, page.nowPage, pageIndex);
                }

                leaveSection.classList.remove('active');
                addClassToOneEle(controllers, pageIndex - 1);
                translate3dY -= pageDiff * stepHeight;
                setAttr().translate(sectionContent, translate3dY, 'y');
                page.isScrolling = true;
                page.nowPage = pageIndex;
                nowSection.classList.add('active');

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
            var slideWrap = $$('.fp-slide-wrap', sections[page.nowPage - 1])[0];

            if (!slideWrap) {
                console.log('This page has no slide');
                return false;
            }

            //当前页面下所有的slide
            var slide = sections[page.nowPage - 1].querySelectorAll('.fp-slide');

            //当前页面上存储的数据
            var slideData = slideWrap.dataset;

            //当前页面上slide的index
            var slideNowIndex = parseInt(slideData.index);

            //当前页面上slide的x轴偏移值
            var slideX = slideData.x;

            var slideDiff = slideIndex - slideNowIndex;

            if (slideIndex >= 1 && slideIndex <= slide.length && !page.isScrolling) {
                if (typeof options.beforeSlideLeave === 'function') {
                    /**
                     * leaveSlide           函数内部 this 指向，将要离开的 slide
                     * page.nowPage         将要离开 section 的 index
                     * slideNowIndex        将要离开 slide 的 index
                     * slideIndex           将要载入 slide 的 index
                     */
                    options.beforeSlideLeave.call(slide[slideNowIndex - 1], page.nowPage, slideNowIndex, slideIndex);
                }

                slide[slideNowIndex - 1].classList.remove('active');
                slideX -= slideDiff * stepWidth;
                setAttr().translate(slideWrap, slideX, 'x');
                page.isScrolling = true;
                slideData.x = slideX;
                slideData.index = slideIndex;
                slide[slideIndex - 1].classList.add('active');

                if (typeof options.afterSlideLoad === 'function') {
                    options.pageSpeed = options.pageSpeed ? 500 : options.pageSpeed;
                    setTimeout(function () {
                        /**
                         * nowSection 函数内部 this 指向，载入后的 section
                         * pageIndex 载入后的 index
                         */
                        options.afterSlideLoad.call(slide[slideIndex - 1], page.nowPage, slideIndex);
                    }, options.pageSpeed);
                }
                return true;
            }
            return false;
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
                if (slideIndex) {
                    //DONE move to a specify slide
                    return !!page.scrollSlide(slideIndex);
                }
                return true;
            } else {
                return false;
            }
        },
        move: {
            next: function (callback) {

                if (page.scrollPage(page.nowPage + 1)) {

                    var arg = Array.prototype.slice.call(arguments, 1);

                    if (typeof callback === 'function') {
                        callback.call(null, arg);
                    }
                    return true;
                } else if (options.loopSection) {

                    page.moveTo(1);

                    return true;
                } else {
                    return false;
                }
            },
            pre: function (callback) {

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
                var slideWrap = $$('.fp-slide-wrap', sections[page.nowPage - 1])[0];

                if (!slideWrap) {
                    return false;
                } else {
                    var slideData = slideWrap.dataset;
                    var slideNowIndex = parseInt(slideData.index);

                    if (page.scrollSlide(slideNowIndex + 1)) {

                        slideData.index = slideNowIndex + 1;
                        //console.log('slide move to next');
                        return true;
                    } else if (options.loopSlide && page.scrollSlide(1)) {
                        slideData.index = 1;
                        return true;
                    }
                    return false;
                }

            },
            pre: function () {

                var slideWrap = $$('.fp-slide-wrap', sections[page.nowPage - 1])[0];
                var slide = sections[page.nowPage - 1].querySelectorAll('.fp-slide');
                if (!slideWrap) {
                    return false;
                } else {
                    var slideData = slideWrap.dataset;
                    var slideNowIndex = parseInt(slideData.index);

                    if (page.scrollSlide(slideNowIndex - 1)) {

                        slideData.index = slideNowIndex - 1;
                        //console.log('slide move to pre');
                        return true;
                    } else if (options.loopSlide && page.scrollSlide(slide.length)) {

                        slideData.index = slide.length;
                        return true;
                    }
                    return false;
                }

            }
        }
    };

    function pageController() {
        function init() {
            creatControllerNode();
            bindEvent();
        }

        function creatControllerNode() {
            var controllerWrap = document.createElement('div');
            var controllerText = '';
            controllerWrap.className = 'fp-controller';
            for (var i = sections.length; i--; i > 0) {
                controllerText += '<div class="fp-controller-dotted"></div>';
            }
            controllerWrap.innerHTML = controllerText;
            document.body.appendChild(controllerWrap);
        }

        function bindEvent() {
            var controllers = $$('.fp-controller-dotted');
            for (var i = controllers.length - 1; i >= 0; i--) {
                controllers[i].addEventListener('click', helper(i + 1), false)
            }
            function helper(i) {
                return function () {
                    addClassToOneEle(controllers, i - 1);
                    //for (var j = controllers.length - 1; j >= 0; j--) {
                    //    controllers[j].classList.remove('active');
                    //}
                    page.moveTo(i);
                    //controllers[i - 1].classList.add('active');
                }
            }
        }

        return init();
    }

    /**
     * 只给一组元素中的某一个元素添加class
     * @param els 一组元素
     * @param theOne 要添加元素的index值
     */
    function addClassToOneEle(els, theOne) {
        for (var j = els.length - 1; j >= 0; j--) {
            els[j].classList.remove('active');
        }
        els[theOne].classList.add('active');
    }

    /**
     * 初始化页面主体元素
     * @returns {{init: init, initContent: initContent, initSlide: initSlide}}
     */
    function initEle() {

        function init() {
            initContent();
            initSlide();
            pageController();
            initController();
        }

        /**
         * 初始化 Section
         */
        function initContent() {
            setCss(sectionContent, {
                "transform": "translate3d(0,0,0)",
                "-webkit-transform": "translate3d(0,0,0)",
                "transitionDuration": options.pageSpeed + 'ms',
                "-webkit-transitionDuration": options.pageSpeed + 'ms',
                "display": "block"
            });
            sectionContent.addEventListener(transitionEvent, function () {
                page.isScrolling = false;
            }, false);
            for (var i = sections.length - 1; i >= 0; i--) {
                sections[i].style.height = stepHeight + 'px';
            }
            sections[page.nowPage-1].classList.add('active');
        }

        /**
         * 初始化 Slide
         */
        function initSlide() {
            var slideWrap = $$('.fp-slide-wrap');
            var slides;

            function slideWrapInitHandle() {
                page.isScrolling = false;
            }

            for (var i = slideWrap.length - 1; i >= 0; i--) {
                slides = $$('.fp-slide', slideWrap[i]);
                for (var j = slides.length - 1; j >= 0; j--) {
                    slides[j].style.width = stepWidth + 'px';
                }
                slideWrap[i].style.width = slides.length * stepWidth + 'px';
                slideWrap[i].dataset.x = '0';
                slideWrap[i].dataset.index = '1';
                slideWrap[i].addEventListener(transitionEvent, slideWrapInitHandle, false);
            }
        }

        function initController(){
            var controllers = $$('.fp-controller-dotted');
            controllers[page.nowPage-1].classList.add('active');
        }

        return {
            init: init,
            initContent: initContent,
            initSlide: initSlide
        };
    }

    /**
     * 初始化定制内容
     * @returns {{init: init}}
     */
    function initProp() {

        function init() {
            for (var key in prop) {
                if (prop.hasOwnProperty(key)) {
                    prop[key]();
                }
            }
        }

        var prop = {
            autoScroll: function () {
                var timer = null;
                if (options.autoScroll) {
                    timer = setInterval(function () {
                        page.move.next();
                    }, options.autoScrollDuration);
                }
            }
        };

        return {
            init: init
        };
    }

    /**
     * 注册事件
     * @param ele {String} 要绑定的元素
     */
    function bindEvent(ele) {
        bindTouchMove(ele);
        bindKeyboard();
        bindMouseWheel();
    }

    function init(ele, Customize) {

        sectionContent = $$(ele)[0];
        sections = $$('.fp-section');
        options = extendOption(defaults, Customize);

        initEle().init();
        initProp().init();
        bindEvent(sectionContent);
    }

    //API
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
});


