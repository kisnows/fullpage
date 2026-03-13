# fullpage

[![Build Status](https://travis-ci.org/kisnows/fullpage.svg?branch=master)](https://travis-ci.org/kisnows/fullpage)
[![GitHub issues](https://img.shields.io/github/issues/kisnows/fullpage.svg)](https://github.com/kisnows/fullpage/issues)
[![GitHub license](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/kisnows/fullpage/master/LICENSE)

[中文文档](./readme.zh-CN.md)

A lightweight fullpage scrolling framework with zero dependencies. Less than 1KB gzipped.
Easily create stunning single-page scrolling websites.

[Live Demo](http://github.kisnows.com/fullpage/)

## Features

- Touch / Keyboard / Mouse wheel control
- Vertical / Horizontal page scrolling

## Compatibility

| Android 4.1+ | Safari 7.1+ | IE 11 | Opera | Chrome | Firefox |
| ------------ | ----------- | ----- | ----- | ------ | ------- |

## Installation

Install via npm:

```bash
npm install fullpage
```

- Include `fullpage.min.js` (or `fullpage.js` for development) from the `build` directory
- Include the CSS file `fullpage.css`
- Structure your HTML as follows (the element with id `sectionContent` is the wrapper — you can customize this id):

```html
<head>
  <link rel='stylesheet' href='fullpage.css'>
  <script src='fullpage.min.js'></script>
</head>
<body>
<div class="fp-wrap">
  <div id="sectionContent" class="fp-section-content">
    <div class="fp-section">
      <div class="fp-slide-wrap">
        <div class="fp-slide">1</div>
        <div class="fp-slide">2</div>
        <div class="fp-slide">3</div>
      </div>
    </div>
    <div class="fp-section">2</div>
    <div class="fp-section">3</div>
  </div>
</div>
</body>
```

## Initialization

Basic usage — just call after the page has loaded:

```javascript
fullpage.init('#sectionContent');
```

For custom configuration:

```javascript
fullpage.init('#sectionContent', {
    threshold: 10,              // Scroll trigger threshold, lower = more sensitive
    pageSpeed: 600,             // Scroll speed in milliseconds
    autoScroll: 0,              // Auto-scroll interval in ms (0 = disabled)
    loopSection: true,          // Enable section looping
    loopSlide: true,            // Enable slide looping
    afterLoad: null,            // Callback after a page loads
    beforeLeave: null,          // Callback before leaving a page
    afterSlideLoad: null,       // Callback after a slide loads
    beforeSlideLeave: null      // Callback before leaving a slide
});
```

### beforeLeave(leaveIndex, nowIndex)

Triggered when leaving the current page. Inside the callback, `this` refers to the current **section** element. `leaveIndex` is the index of the page being **left**, and `nowIndex` is the index of the page being **entered**.

### afterLoad(afterIndex)

Triggered after the next page has loaded. Inside the callback, `this` refers to the **loaded** section element. `afterIndex` is the index of the loaded page.

### beforeSlideLeave(pageIndex, slideNow, slideAfter)

Triggered when leaving the current slide. `pageIndex` is the current section index, `slideNow` is the current slide index, and `slideAfter` is the index of the slide being entered.

### afterSlideLoad(pageIndex, slideIndex)

Triggered after the next slide has loaded. `pageIndex` is the current section index, `slideIndex` is the loaded slide index.

```javascript
fullpage.init('#sectionContent', {
    beforeLeave: function (leaveIndex, nowIndex) {
        if (nowIndex === 2) {
            console.log('You will leave page 2');
        }
        console.log(this, leaveIndex, nowIndex);
    },
    afterLoad: function (afterIndex) {
        if (afterIndex === 2) {
            console.log('You will go to page 2');
        }
        console.log(this, afterIndex);
    },
    beforeSlideLeave: function (pageIndex, slideNow, slideAfter) {
        console.log(this, 'beforeSlideLeave:', pageIndex, slideNow, slideAfter);
    },
    afterSlideLoad: function (pageIndex, slideIndex) {
        console.log(this, 'afterSlideLoad:', pageIndex, slideIndex);
    }
});
```

## Methods

### init(el, options)

Initialize fullpage. `el` is the CSS selector for the wrapper element, `options` is the configuration object. See [Initialization](#initialization).

### moveTo(index, slideIndex)

Scroll to the specified page. `index` is required, `slideIndex` is optional.

```javascript
fullpage.moveTo(1);       // Scroll to the first page
fullpage.moveTo(3, 2);    // Scroll to the 2nd slide of the 3rd page
```

### moveToNext(callback)

Scroll vertically to the next page. `callback` is an optional function.

```javascript
fullpage.moveToNext();                    // Scroll to next page
fullpage.moveToNext(callback);            // Scroll to next page, then execute callback
fullpage.moveToNext(callback, params...); // Scroll to next page, execute callback with params

function foo(a, b) {
    console.log(a, b);
}
fullpage.moveToNext(foo, 1, 2);           // Scroll to next page, outputs 1, 2
```

### moveToPre(callback)

Scroll vertically to the previous page. Usage is the same as `moveToNext(callback)`.

### slideToNext()

Scroll horizontally to the next slide (slides left).

### slideToPre()

Scroll horizontally to the previous slide (slides right).

## Donate

If you find this project helpful, feel free to buy me a coffee.

<img src="./doc/wechatpay.png" width="250" />

## LICENSE

The MIT License (MIT)

Copyright (c) 2015-2016 [抹桥](mailto:yq12315@gmail.com)

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.
