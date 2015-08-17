# FullPage v0.8.0(Alpha)

**仍在开发中**

一个轻巧的`fullpage`框架，不依赖其他库。
目前仅支持触摸屏且支持`css3`浏览器的设备。

##使用方法
* 引入 JavaScript 文件 `fullpage.js`
* 引入 css 文件 `fullpage.css`（如果你使用`less`，则可以在less主文件中引入`fullpage.less`）
* 按照下面格式书写`html`代码（其中 id 为 `sectionContent` 的为包裹层，你可以自定义修改其id）
```
<div id="sectionContent" class="section-content">
    <div class="section">1</div>
    <div class="section">2</div>
    <div class="section">3</div>
</div>
```

##初始化
简单使用，只要在页面加载完成后执行：

```
fullpage.init('#sectionContent');
```
如果需要定制化，则需要如下方法：

```
fullpage.init('#sectionContent',{
	threshold: 10,              //触发滚动事件的阈值，越小越灵敏
  pageSpeed: 600,             //滚屏速度，单位为毫秒 ms
  afterLoad: null,            //TODO 页面载入事件
  beforeLeave: null           //TODO 页面离开事件
});
```
##方法

###moveTo(index,slideIndex)
滚动到指定页面,`index` 为必选参数，`slideIndex`为可选参数

```
fllpage.moveTo(1)      //滚动到第一个页面
fullpage.moveTo(3,2)    //滚动到第三个页面的第二个slider
```
###moveToNext(callback)
垂直滚动到下一个页面,`callback`为回掉函数，可选。

```
fullpage.moveToNext();            //滚动到下一个页面
fullpage.moveToNext(callback)     //滚动到下一个页面后，执行 callback
fullpage.moveToNext(callback,params...)   //滚动到下一个页面后，执行 callback,params为callback的参数，根据情况传入
```
###moveToPre(callback)
垂直滚动到上一个页面，用法同 `moveToNext(callback)`
###slideToNext()
水平滚动到下一个页面（页面向左滚动）
###slideToPre()
水平滚动到上一个页面（页面向右滚动）

## TODO
* ~~添加滚动到指定页面方法~~
* 页面滚动时，页面载入或离开时添加自定义事件
* ~~横屏滚动支持~~
