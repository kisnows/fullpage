/**
 * Created by qi on 2015/7/23.
 */
var $$ = document.querySelector.bind(document);

function bindTouchMove(el) {
    'use strict';

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
        var diffY = startPos.y - startPos.y;
        var threshold = 10;
        console.log('startPos.x:',startPos.x,'startPos.y:',startPos.y);
        console.log('endPos.x:');
        console.log('diffX:',diffX,'diffY:',diffY);
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
