/**
 * Created by zhangzongshan on 16/7/6.
 */
"use strict";
(function (factory) {
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        var target = module['exports'] || exports; // module.exports is for Node.js
        factory(target);
    } else if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof define === 'function' && define.cmd) {
        define(factory);
    } else {
        factory(function () {
        }, window['ScrollControl'] = {}, {});
    }
}(function (require, exports, module) {
    var ScrollControl = typeof exports !== 'undefined' ? exports : {};

    var keys = {37: 1, 38: 1, 39: 1, 40: 1};

    function preventDefault(e) {
        e = e || window.event;
        if (e.preventDefault)
            e.preventDefault();
        e.returnValue = false;
    }

    function preventDefaultForScrollKeys(e) {
        if (keys[e.keyCode]) {
            preventDefault(e);
            return false;
        }
    }

    var oldonwheel
        , oldonmousewheel1
        , oldonmousewheel2
        , oldontouchmove
        , oldonkeydown
        , isDisabled;

    function disableScroll() {
        if (window.addEventListener) // older FF
            window.addEventListener('DOMMouseScroll', preventDefault, false);
        oldonwheel = window.onwheel;
        window.onwheel = preventDefault; // modern standard
        oldonmousewheel1 = window.onmousewheel;
        window.onmousewheel = preventDefault; // older browsers, IE
        oldonmousewheel2 = document.onmousewheel;
        document.onmousewheel = preventDefault; // older browsers, IE
        oldontouchmove = window.ontouchmove;
        window.ontouchmove = preventDefault; // mobile
        oldonkeydown = document.onkeydown;
        document.onkeydown = preventDefaultForScrollKeys;
        isDisabled = true;
    }

    function enableScroll() {
        if (!isDisabled) return;
        if (window.removeEventListener)
            window.removeEventListener('DOMMouseScroll', preventDefault, false);
        window.onwheel = oldonwheel; // modern standard
        window.onmousewheel = oldonmousewheel1; // older browsers, IE
        document.onmousewheel = oldonmousewheel2; // older browsers, IE
        window.ontouchmove = oldontouchmove; // mobile
        document.onkeydown = oldonkeydown;
        isDisabled = false;
    }
    /*
    * 禁止滚动
    * */
    exports.disableScroll = function () {
        disableScroll();
    }
    /*
     * 开启滚动
     * */
    exports.enableScroll = function () {
        enableScroll();
    }

}));