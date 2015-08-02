#Fullpage

一个轻巧的`fullpage`框架，不依赖其他库。
目前仅支持触摸屏且支持`css3`浏览器的设备。
##使用简介
* 引入 JavaScript 文件 `fullpage.js`
* 引入 css 文件 `fullpage.css`（如果你使用`less`，则可以在less主文件中引入`fullpage.less`）
* 按照下面格式书写`html`代码（其中 id 为 'sectionContent` 的为包裹层，应直接放在`body`下面）
```
<div id="sectionContent" class="section-content">
    <div class="section">1</div>
    <div class="section">2</div>
    <div class="section">3</div>
</div>
```