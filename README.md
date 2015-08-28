# LongListScroller
A small plugin to handle long list scroll using IScroll

The idea behind this plugin is to limit the number of list item in dom to reduce the overall dom elements in a page, hence increase the page performance (Primarly on phonegap applications).

Include jquery, iscroll.js probe version (http://iscrolljs.com/), and listScroller.js

Sample HTML
```html
<div class="scroll-wrapper" id="listHolder">
    <div class="scroll-body">
        <div class="list-item"></div>
        <div class="list-item"></div>
        <div class="list-item"></div>
        <div class="list-item"></div>
    </div>
</div>
```

JavaScript
```js
var scroller = new ListScroller('#listHolder');
scroller.init();
```

Options
```js
var scroller = new ListScroller('#listHolder',{
        scrollBodyClass: 'scroll-body', //class name of scrollable elment
        listItemClass: 'list-item', //class name of each list item
        maxList: 50, //maximum list item on a page at a time
        topLimit: 35, // top limit where element will be appended
        bottomLimit: 15 // bottom limit where element will be prepended
});
scroller.init();
```
