# FullPage-light v1.3.0
![](https://travis-ci.org/kisnows/fullpage-light.js.svg?branch=master)

一个轻巧的`fullpage`框架，不依赖其他任何库，压缩后不到4kb。
轻松创建炫酷的单页滑动网站。

[一个简单的DEMO](http://kisnows.com/fullpage-light.js/)
##功能
* 触摸/键盘/鼠标滚轮控制
* 垂直/水平翻页

##兼容性
|Android 4.1+|Safari 7.1+|IE 11|Opera|Chrome|firefox|
|------------|-----------|-------|-----|------|-----|

##使用方法
* 引入 JavaScript 文件 `fullPage.min.js`
* 引入 css 文件 `fullPage.css`（如果你使用`less`，则可以在less主文件中引入`fullPage.less`）
* 按照下面格式书写`html`代码（其中 id 为 `sectionContent` 的为包裹层，你可以自定义修改其id）

```html
    <div id="sectionContent" class="fp-section-content">
        <div class="fp-section">
            <div class="fp-slide-wrap">
              <div class="fp-slide">1</div>
              <div class="fp-slide">2</div>
              <div class="fp-slide">3</div>
              <div class="fp-slide">4</div>
              <div class="fp-slide">5</div>
            </div>
          </div>
          <div class="fp-section">2</div>
          <div class="fp-section">3</div>
    </div>
```

##初始化
简单使用，只要在页面加载完成后执行：
```javascript
    fullpage.init('#sectionContent');
```
如果需要定制化，则需要如下方法：
```javascript
    fullpage.init('#sectionContent',{
        threshold: 10,              //触发滚动事件的阈值，越小越灵敏
        pageSpeed: 600,             //滚屏速度，单位为毫秒 ms
        autoScroll: false,          //是否自动播放
        autoScrollDuration: 1000,   //自动播放间隔时间
        loopSection: true,          //Section循环滚动
        loopSlide: true,            //Slide循环滑动
        afterLoad: null,            //页面载入事件，具体查看下面的 afterLoad 函数
        beforeLeave: null           //页面离开事件，具体查看下面的 beforeLeave 函数
    });
```
###beforeLeave(leaveIndex,nowIndex)
离开当前页面时触发的事件，函数中 `this` 指向当前页面的 **section**,`leaveIndex`为要**离开**页面的 `index` ，`nowIndex` 为要**载入**页面的 `Index`
###afterLoad(afterIndex)
载入下一张页面后触发的事件，函数中 `this` 指向将要**载入**页面的 `section`, `afterIndex` 为要**载入**页面的 `index`
###beforeSlideLeave(pageIndex, slideNow, slideAfter)
离开当前 Slide 时触发的事件，`pageIndex`是**当前**`section`的`index`，`slideNow`是**当前**`slide`的`index`，`slideAfter`是要**载入**`slide`的`index`
###afterSlideLoad(pageIndex, slideIndex)
载入下一个`slide`后触发的事件，`pageIndex`是**当前**`section`的`index`，`slideIndex`是要**载入**`slide`的`index`
```javascript
    fullpage.init('#sectionContent', {
      beforeLeave: function (leaveIndex, nowIndex) {        //如果现在在第1个页面，向下滚动后
        if (nowIndex === 2) {                               //leaveIndex = 1,nowIndex = 2
          console.log('You will leave page 2')              //这条语句会执行
        }
        console.log(this, leaveIndex, nowIndex)             //这里的 this 指向将要离开的页面元素，即第一个页面
      },
      afterLoad: function (afterIndex) {                    //afterIndex = 2
        if (afterIndex === 2) {                             
          console.log('You will go to page 2')              //这条语句会执行
        } 
        console.log(this, afterIndex)                       //此处 this 指向当前载入的页面，即第二个页面
      },
      beforeSlideLeave: function (pageIndex, slideNow, slideAfter) {
        var _this = this;
        console.log(_this, 'beforeSlideLeave:', pageIndex, slideNow, slideAfter);
      },
      afterSlideLoad: function (pageIndex, slideIndex) {
        var _this = this;
        console.log(_this, 'afterSlideLoad:', pageIndex, slideIndex);
      }
    });
```
##方法
###init(el,options)
页面初始化，`el`为最外包裹层选择器，`options`是要定制的参数。具体同[初始化](#初始化)
###moveTo(index,slideIndex)
滚动到指定页面,`index` 为必选参数，`slideIndex`为可选参数
```javascript
    fullpage.moveTo(1)      //滚动到第一个页面
    fullpage.moveTo(3,2)    //滚动到第三个页面的第二个slider
```
###moveToNext(callback)
垂直滚动到下一个页面,`callback`为回掉函数，可选。
```javascript
    fullpage.moveToNext();            //滚动到下一个页面
    fullpage.moveToNext(callback)     //滚动到下一个页面后，执行 callback
    fullpage.moveToNext(callback,params...)   //滚动到下一个页面后，执行 callback,params为callback的参数，根据情况传入
    function foo(a,b){
        console.log(a,b)
    }
    fullpage.moveToNext(foo,1,2)              //滚动到下一个页面，并输出 1，2
```
###moveToPre(callback)
垂直滚动到上一个页面，用法同 `moveToNext(callback)`
###slideToNext()
水平滚动到下一个页面（页面向左滚动）
###slideToPre()
水平滚动到上一个页面（页面向右滚动）


## LICENSE

Copyright 2015 kisnows(https://github.com/kisnows)

Licensed under the Apache License, Version 2.0 (the "License");you may not use this file except in compliance with the License.

You may obtain a copy of the License at

http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the specific language governing permissions and limitations under the License.
