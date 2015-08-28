
/*
    listScroller.js v 0.1.0
    Author: Sudhanshu Yadav
    Copyright (c) 2015 Sudhanshu Yadav - ignitersworld.com , released under the MIT license.
    https://github.com/s-yadav/LongListScroller
*/

(function($,window) {
    var nullFunc = function() {};

    var defaults = {
        scrollBodyClass: 'scroll-body',
        listItemClass: 'list-item',
        maxList: 50, //maximum list item on a page at a time
        topLimit: 35, // top limit where element will be appended
        bottomLimit: 15 // bottom limit where element will be prepended
    };

    //class for list scroll in web view
    function ListScroller(container, options) {
        this.container = $(container);
        this.options = $.extend({}, defaults, options);
        this.scrollBody = this.container.find('.' + this.options.scrollBodyClass);
    }

    ListScroller.prototype = {
        constructor: ListScroller,
        init: function() {
            var self = this,
                options = self.options,
                maxList = options.maxList;

            this.list = this.container.find('.' + this.options.listItemClass);

            var currentRange = this.currentRange = {
                from: 0,
                to: 0
            };

            //get container height
            function getContainerHeight() {
                self.containerHeight = self.container.height();
            }

            getContainerHeight();
            $(window).resize(getContainerHeight);

            //calculate trigger points and set absolute positioning
            var triggerPoints = this.triggerPoints = [];
            var lastTop = 0;
            var listTops = [];
            this.list.each(function(index) {
                var elm = $(this);
                var top = lastTop;
                listTops.push(lastTop);
                lastTop += elm.outerHeight();
                if (index % maxList == options.bottomLimit || index % maxList == options.topLimit) {
                    var lastTrigger = triggerPoints[triggerPoints.length - 1];
                    triggerPoints.push({
                        from: lastTrigger ? lastTrigger.to : 0,
                        fromIndx: lastTrigger ? lastTrigger.toIndx : 0,
                        toIndx: index,
                        to: lastTop
                    });
                }
            });

            this.list.each(function(index) {
                var elm = $(this);
                elm.css({
                    position: 'absolute',
                    width: '100%',
                    top: listTops[index] + 'px',
                });
            });


            this.list.detach();

            //update height of scroll body
            this.scrollBody.height(lastTop);

            //remove scroll if its already create
            if (this.iscroll) {
                this.iscroll.destroy();
                this.iscroll = null;
            }

            this.iscroll = new IScroll(this.container[0], {
                lockDirection: true,
                scrollbars: false,
                tap: true,
                mouseWheel: true,
                probeType: 3,
                deceleration: .0006
            });

            function filterElm(from, to, filterOn) {
                return (filterOn || self.list).filter(function(idx) {
                    return idx >= from && idx < to;
                });
            }

            function refreshView(from, to) {
                from = Math.max(0, from);
                to = Math.min(to, self.list.length);
                var fromDiff = from - self.currentRange.from,
                    toDiff = to - self.currentRange.to;

                var curList = self.scrollBody.find('.' + options.listItemClass);

                if (fromDiff > 0) {
                    console.log('remove elm', filterElm(0, fromDiff, curList));
                    filterElm(0, fromDiff, curList).detach();
                }

                if (toDiff < 0) {
                    filterElm(curList.length + toDiff, curList.length, curList).detach();
                }


                if (fromDiff < 0) {
                    self.scrollBody.prepend(filterElm(from, self.currentRange.from));
                }

                if (toDiff > 0) {
                    self.scrollBody.append(filterElm(self.currentRange.to, to));
                }

                currentRange.from = from;
                currentRange.to = to;

            }

            this.iscroll.on('scroll', function() {
                var scrollTop = -self.iscroll.y + self.containerHeight / 2;
                for (var i = 0, ln = triggerPoints.length; i < ln; i++) {
                    var obj = triggerPoints[i];
                    if (scrollTop >= obj.from && scrollTop < obj.to) {
                        if (i % 2) {
                            refreshView((i - 1) / 2 * maxList, (i + 1) / 2 * maxList);
                        } else {
                            refreshView((i - 2) / 2 * maxList, (i + 2) / 2 * maxList);
                        }
                    }
                }
            });

            //to reset view port on initialization.
            refreshView(0, maxList);

            return this;

        },
    }

    window.ListScroller = ListScroller;

}(jQuery,window,undefined));
