/**
 * Created by qi on 2015/7/23.
 */


"use strict";
//helper
var $$ = document.querySelectorAll.bind(document);


var sectionContent = $$('#sectionContent')[0];
var sections = $$('.section');
var stepHeight = sections[0].offsetHeight;
var stepWidth = sections[0].offsetWidth;

function setAttr() {
    sectionContent.style.height = stepHeight * sections.length;
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
        diffX = startPos.x - endPos.x;
        diffY = startPos.y - endPos.y;
        //阈值
        var threshold = 10;
        //console.log('startPos.x:', startPos.x, 'startPos.y:', startPos.y);
        //console.log('diffX:', diffX, 'diffY:', diffY);

        //DONE Add TouchMoveEvent
        if (Math.abs(diffX) > Math.abs(diffY)) {
            //horizontal
            isVertical = false;
            if (diffX > threshold) {
                //Move to left
                direction = 'left';
                console.log('Go left');
            } else {
                //Move to right
                direction = 'right';
                console.log('Go right');
            }
        } else {
            //vertical
            isVertical = true;
            if (diffY > threshold) {
                //Move to top
                direction = 'top';
                console.log('Go top');
            } else {
                //Move to bottom
                direction = 'bottom';
                console.log('Go bottom');
            }
        }
        if(isVertical){
            page.move[direction]();
        }else{
            page.slide[direction]();
        }
    }, false);
}

var page = {
    nowPage: 1,
    move: {
        top: function () {
            //TODO move to pre section

        },
        bottom: function () {
            //TODO move to next section
        }
    },
    moveTo: function () {
        //TODO move to a specify section
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
init();
