/**
 * Created by qi on 2015/7/23.
 */
var $$ = document.querySelectorAll().bind(document);

function bindTouch(el) {
    'use strict';

    //首页月份左右滑动事件
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
        var min = startPos.x - endPos.x;

        if (min > 10 && Math.abs(startPos.y - endPos.y) < 30) {

        } else if (min < -10 && Math.abs(startPos.y - endPos.y) < 30) {

        }

    }, false);

}
