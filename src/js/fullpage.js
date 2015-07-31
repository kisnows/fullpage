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

    el.addEventListener('touchstart', function (event) {

        // 初始化 x,y 值，防止点击一次后出现假 move 事件
        startPos = {};
        endPos = {};
        event.preventDefault();
        var touch = event.touches[0];
        startPos.x = touch.pageX;
        startPos.y = touch.pageY;
    }, false);

    el.addEventListener('touchmove', function (event) {

        event.preventDefault();
        var touch = event.touches[0];
        endPos.x = touch.pageX;
        endPos.y = touch.pageY;
    }, false);

    el.addEventListener('touchend', function (event) {

        event.preventDefault();
        var diffX = startPos.x - endPos.x;
        var diffY = startPos.y - endPos.y;
        //阈值
        var threshold = 10;
        //console.log('startPos.x:', startPos.x, 'startPos.y:', startPos.y);
        //console.log('diffX:', diffX, 'diffY:', diffY);

        //TODO Add TouchMoveEvent
        if (Math.abs(diffX) > Math.abs(diffY)) {
            //horizontal
            if (diffX > threshold) {
                //Move to left
                console.log('Go left');
            } else {
                //Move to right
                console.log('Go right');
            }
        } else {
            //vertical
            if (diffY > threshold) {
                //Move to top
                console.log('Go top');
            } else {
                //Move to bottom
                console.log('Go bottom');
            }
        }
    }, false);
}

var page = {
    nowPage: 1,
    moveToTop: function () {

    },
    moveToBottom: function () {

    },
    moveTo: function () {

    },
    slide: {
        moveToLeft: function () {

        },
        moveToRight: function () {

        }
    }
};

function init(options) {
    bindTouchMove(sectionContent);
}
init();
