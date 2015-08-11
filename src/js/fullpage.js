/**
 * Created by qi on 2015/7/23.
 */

(function (global, fn) {
  "use strict";

  global.fullpage = fn();
})(this, function () {
  "use strict";

  //helper

  var $$ = document.querySelectorAll.bind(document);

  var sectionContent = $$('#sectionContent')[0];
  var translate3dY = 0;
  var sections = $$('.section');
  var stepHeight = sections[0].offsetHeight;
  var stepWidth = sections[0].offsetWidth;

  function setAttr() {
    function init() {
      sectionContent.style.transform = "translate3d(0,0,0)";
      sectionContent.style.webkitTransform = "translate3d(0,0,0)";
    }

    function translate(value, direction) {
      if (direction === 'y') {
        sectionContent.style.transform = "translate3d(0," + value + "px,0)";
        sectionContent.style.webkitTransform = "translate3d(0," + value + "px,0)";
      }
    }

    return {
      init: init,
      translate: translate
    };
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
      //阈值
      var threshold = 10;
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
          console.log('Go top');
        } else if (diffY < -threshold) {
          //Move to bottom
          direction = 'pre';
          console.log('Go bottom');
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
    move: {
      next: function () {
        //TODO move to next section
        console.log('page move to pre');
        if (page.nowPage < sections.length) {
          translate3dY -= stepHeight;
          setAttr().translate(translate3dY, 'y');
          page.nowPage = page.nowPage === sections.length ? sections.length : page.nowPage + 1;

        }
      },
      pre: function () {
        //TODO move to pre section
        console.log('page move to next');
        if (page.nowPage > 1) {
          translate3dY += stepHeight;
          setAttr().translate(translate3dY, 'y');
          page.nowPage = page.nowPage === 1 ? 1 : page.nowPage - 1;

        }
      }
    },
    moveTo: function (pageIndex) {
      //TODO move to a specify section
      var pageDiff = pageIndex - page.nowPage;
      translate3dY -= pageDiff * stepHeight;
      setAttr().translate(translate3dY, 'y');
      page.nowPage = pageIndex;
    },
    slide: {
      left: function () {

      },
      right: function () {

      }
    }
  };

  function init(options) {
    bindTouchMove(sectionContent);
  }

  function extendOption(Default, Customize) {
    if (typeof Customize !== 'Object') {
      Customize = {};
    }
    for (var i in Customize) {
      if (Default.hasOwnProperty(i)) {
        Default[i] = Customize[i];
      }
    }
    return Default;
  }
});

