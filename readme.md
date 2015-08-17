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
	//未完成
});
```
##方法
###moveTo(index,slideIndex)
滚动到指定页面
###moveToNext()
垂直滚动到下一个页面
###moveToPre()
垂直滚动到上一个页面

##以下为待完成方法
###slideToNext()
水平滚动到下一个页面（页面向左滚动）
###slideToPre()
遂平滚动到上一个页面（页面向右滚动）

## TODO
* ~~添加滚动到指定页面方法~~
* 页面滚动时，页面载入或离开时添加自定义事件
* ~~横屏滚动支持~~
