/**
 * Created by zhangzongshan on 16/4/29.
 *
 * SpinKit依赖 jquery,使用前必须引入jquery,
 *
 * 使用方法:
 * SpinKit.show(obj, configs, callback)显示
 * @obj:jquery对象,放置加载动画
 * @configs:参数配置
 * {
 *  spin:动画效果,包括[circle,fading,square,bounce,double,three,cube,dot,grid,folding,timer,location,battery,rotation]14种效果,默认值为circle,支持自定义图片{images:url}
 *  size:动画大小,默认为40
 *  position:显示位置,相对位置,包括[Top,Center,Bottom,TopLeft,CenterLeft,BottomLeft,TopRight,CenterRight,BottomRight],默认为Center,支持自定位位置{top:value,left:value}
 *  background:背景,仅支持 RGBA传入,默认值为 RBGA(0,0,0,.1)
 *  color:动画颜色,默认值为#999
 *  shade:bool,是否显示背景遮罩,默认显示(true),如果设置为 false,background值将失效
 * }
 * @callback,回调函数
 *
 * SpinKit.hidden(obj,callback),去除动画
 * @obj:jquery对象
 * @callback,回调函数
 *
 * SpinKit.get(obj),获取动画对象
 *
 * SpinKit.version,版本信息
 *
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
        }, window['SpinKit'] = {}, {});
    }
}(function (require, exports, module) {
    var SpinKit = typeof exports !== 'undefined' ? exports : {};

    function hex2Rgb(hex) {
        var reg = /^#([0-9a-fA-f]{3}|[0-9a-fA-f]{6})$/;
        var sColor = hex.toLowerCase();
        if (sColor && reg.test(sColor)) {
            if (sColor.length === 4) {
                var sColorNew = "#";
                for (var i = 1; i < 4; i += 1) {
                    sColorNew += sColor.slice(i, i + 1).concat(sColor.slice(i, i + 1));
                }
                sColor = sColorNew;
            }
            //处理六位的颜色值
            var sColorChange = [];
            for (var i = 1; i < 7; i += 2) {
                sColorChange.push(parseInt("0x" + sColor.slice(i, i + 2)));
            }
            return "RGB(" + sColorChange.join(",") + ")";
        } else {
            return sColor;
        }
    }

    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
    }

    function getArrJsonItem(obj, key, value) {
        obj = (isArray(obj) && obj.length > 0) ? obj
            : (!isArray(obj)) ? obj : null;
        var k = (typeof (key) == "string" && key != "") ? key : null;
        var v = (typeof (value) != "undefined") ? value : null;
        if (typeof (obj) == "object" && obj != null && k != null) {
            for (var item in obj) {
                if (typeof (obj[item]) === 'object' && obj[item] != null) {
                    if (v != null) {
                        if (obj[item][k] === v || (typeof (v) === "object" && obj[item][k].is(v))) {
                            return {index: parseInt(item), item: obj[item]};
                            break;
                        }
                    }
                    else {
                        if (obj[item].hasOwnProperty(k)) {
                            return {index: parseInt(item), item: obj[item]};
                            break;
                        }
                    }
                }
            }
        }
        return {index: -1, item: null};
    }

    function getmaxZindex(obj, max) {
        obj = (typeof (obj) == "object" && obj.length > 0) ? obj.find("*") : $('body *');
        max = max > 0 ? max + 1 : -1;
        var maxZ = Math.max.apply(null, $.map(obj, function (e, n) {
            if ($(e).css('position') == 'absolute' || $(e).css('position') == 'fixed')
                return parseInt($(e).css('z-index')) || 1;
        }));
        maxZ = maxZ == -Infinity ? 1 : maxZ;
        if (max != -1) {
            maxZ = maxZ < max ? maxZ : max;
        }
        return maxZ;
    }

    function getObjPosition(obj, position, width, height) {
        var _top = (typeof (position) == "string" && (position).toLowerCase() == "top") ? 0
            : (typeof (position) == "string" && (position).toLowerCase() == "center") ? (obj.outerHeight() - height) / 2
            : (typeof (position) == "string" && (position).toLowerCase() == "bottom") ? obj.outerHeight() - height
            : (typeof (position) == "string" && (position).toLowerCase() == "topleft") ? 0
            : (typeof (position) == "string" && (position).toLowerCase() == "centerleft") ? (obj.outerHeight() - height) / 2
            : (typeof (position) == "string" && (position).toLowerCase() == "bottomleft") ? obj.outerHeight() - height
            : (typeof (position) == "string" && (position).toLowerCase() == "topright") ? 0
            : (typeof (position) == "string" && (position).toLowerCase() == "centerright") ? (obj.outerHeight() - height) / 2
            : (typeof (position) == "string" && (position).toLowerCase() == "bottomright") ? obj.outerHeight() - height
            : (typeof (position) == "string" && (position).toLowerCase() == "windowscenter") ? $(document).scrollTop() + ($(window).height() - height) / 2
            : (typeof (position) == "string" && (position).toLowerCase() == "windowsleft") ? $(document).scrollTop() + ($(window).height() - height) / 2
            : (typeof (position) == "string" && (position).toLowerCase() == "windowsright") ? $(document).scrollTop() + ($(window).height() - height) / 2
            : (typeof (position) == "object" && position != null) ? (position.top > 0 ? position.top : 0)
            : (obj.outerHeight() - height) / 2;

        var _left = (typeof (position) == "string" && (position).toLowerCase() == "top") ? (obj.outerWidth() - width) / 2
            : (typeof (position) == "string" && (position).toLowerCase() == "center") ? (obj.outerWidth() - width) / 2
            : (typeof (position) == "string" && (position).toLowerCase() == "bottom") ? (obj.outerWidth() - width) / 2
            : (typeof (position) == "string" && (position).toLowerCase() == "topleft") ? 0
            : (typeof (position) == "string" && (position).toLowerCase() == "centerleft") ? 0
            : (typeof (position) == "string" && (position).toLowerCase() == "bottomleft") ? 0
            : (typeof (position) == "string" && (position).toLowerCase() == "topright") ? obj.outerWidth() - width
            : (typeof (position) == "string" && (position).toLowerCase() == "centerright") ? obj.outerWidth() - width
            : (typeof (position) == "string" && (position).toLowerCase() == "bottomright") ? obj.outerWidth() - width
            : (typeof (position) == "string" && (position).toLowerCase() == "windowscenter") ? $(document).scrollLeft() + (obj.outerWidth() - width) / 2
            : (typeof (position) == "string" && (position).toLowerCase() == "windowsleft") ? $(document).scrollLeft()
            : (typeof (position) == "string" && (position).toLowerCase() == "windowsright") ? $(document).scrollLeft() + $(window).width() - width
            : (typeof (position) == "object" && position != null) ? (position.left > 0 ? position.left : 0)
            : (obj.outerWidth() - width) / 2;

        return {
            top: _top
            , left: _left
        };
    }

    var spinnerArr = [];

    var _html = '<div class="spinner_container">'
        + '    <div class="spinner"></div>'
        + '    <div class="spinner_info"></div>'
        + '</div>';

    var _default = {
        spin: "circle"
        , container: $('body')
        , size: 40
        , position: "windowscenter"
        , background: "rgba(0,0,0,.1)"
        , color: "#999"
        , shade: true
        , zIndex: getmaxZindex() + 1
    };

    function resize(id) {
        var _id = id;
        var thisSpinnerObj = getArrJsonItem(spinnerArr, "id", id).item;
        var _container = thisSpinnerObj.configs.container;
        var obj = _container;
        if (thisSpinnerObj != null) {
            var options = thisSpinnerObj.configs;

            if (!obj.is($('body'))) {
                $("#" + _id).css({
                    width: obj.outerWidth() + "px"
                    , height: obj.outerHeight() + "px"
                    , top: obj.offset().top + "px"
                    , left: obj.offset().left + "px"
                });
            }
            else {
                var _width = obj.is($('body')) ?
                    ((($(window).width() > obj.outerWidth() ? $(window).width() : obj.outerWidth()) > options.size)
                        ? ($(window).width() > obj.outerWidth() ? $(window).width() : obj.outerWidth())
                        : (options.size))
                    : (obj.outerWidth() > options.size ? obj.outerWidth() : options.size);

                var _height = obj.is($('body')) ?
                    ((($(window).height() > obj.outerHeight() ? $(window).height() : obj.outerHeight()) > options.size)
                        ? ($(window).height() > obj.outerHeight() ? $(window).height() : obj.outerHeight())
                        : (options.size))
                    : (obj.outerHeight() > options.size ? obj.outerHeight() : options.size);

                $("#" + _id).css({
                    width: _width + "px"
                    , height: _height + "px"
                    , top: 0 + "px"
                    , left: 0 + "px"
                });
            }

            var _top = 0;
            var _left = 0;
            var thisPosition = null;
            if (!obj.is($('body'))) {

                thisPosition = getObjPosition($("#" + _id), options.position, options.size, options.size);
                _top = thisPosition.top;
                _left = thisPosition.left;

                _top = (_top < 0 && (_top + obj.offset().top) < 0) ? -obj.offset().top : _top;
                _left = (_left < 0 && (_left + obj.offset().left) < 0) ? -obj.offset().left : _left;
            }
            else {

                thisPosition = getObjPosition($("#" + _id), options.position, options.size, options.size);
                _top = thisPosition.top;
                _left = thisPosition.left;

                _top = _top < 0 ? 0 : _top;
                _left = _left < 0 ? 0 : _left;
            }

            $("#" + _id + " .spinner").css({
                "top": _top + "px"
                , "left": _left + "px"
            });

            $("#" + _id + " .spinner_info").css({
                "top": _top + "px"
                , "left": _left + "px"
            });

        }
    }

    function creatSpin(configs, callback) {
        configs = (typeof (configs) == "object" && configs != null) ? configs : _default;
        var _id = "spinner_" + (new Date().getTime() * Math.floor(Math.random() * 1000000));
        var _spin = (typeof (configs.spin) != "undefined" && configs.spin != "") ? configs.spin : _default.spin;
        var _container = configs.container ? configs.container : _default.container;
        var _size = configs.size > 0 ? configs.size : _default.size;
        var _position = (typeof (configs.position) != "undefined" && configs.position != "") ? configs.position : _default.position;
        var _background = (typeof (configs.background) != "undefined" && configs.background.indexOf("rgba(") != -1) ? configs.background : _default.background;
        var _color = (typeof (configs.color) != "undefined" && configs.color.indexOf("#") != -1) ? configs.color : _default.color;
        var _hexColor = hex2Rgb(_color).match(/RGB\((\S*)\)/)[1];
        var _shade = (typeof (configs.shade) != "undefined" && !configs.shade) ? false : _default.shade;
        var _zIndex = (typeof (configs.zIndex) === "number") ? configs.zIndex : _default.zIndex;
        var _infoHtml = typeof configs.infoHtml === 'string' && configs.infoHtml !== '' ? configs.infoHtml : '';
        var _infoClass = typeof configs.infoClass === 'string' && configs.infoClass !== '' ? configs.infoClass : '';

        var thisConfigs = {
            "id": _id
            , "configs": {
                spin: _spin
                , size: _size
                , position: _position
                , background: (!_shade) ? 'transparent' : _background
                , color: _color
                , shade: _shade
                , zIndex: _zIndex
                , container: _container
            }
        }

        spinnerArr.push(thisConfigs);

        var _spinObj = (typeof (configs.spin) === "string" && configs.spin === "circle") ? getArrJsonItem(spinObj, "circle").item
            : (typeof (configs.spin) === "string" && configs.spin === "fading") ? getArrJsonItem(spinObj, "fading").item
            : (typeof (configs.spin) === "string" && configs.spin === "square") ? getArrJsonItem(spinObj, "square").item
            : (typeof (configs.spin) === "string" && configs.spin === "bounce") ? getArrJsonItem(spinObj, "bounce").item
            : (typeof (configs.spin) === "string" && configs.spin === "double") ? getArrJsonItem(spinObj, "double").item
            : (typeof (configs.spin) === "string" && configs.spin === "three") ? getArrJsonItem(spinObj, "three").item
            : (typeof (configs.spin) === "string" && configs.spin === "cube") ? getArrJsonItem(spinObj, "cube").item
            : (typeof (configs.spin) === "string" && configs.spin === "dot") ? getArrJsonItem(spinObj, "dot").item
            : (typeof (configs.spin) === "string" && configs.spin === "grid") ? getArrJsonItem(spinObj, "grid").item
            : (typeof (configs.spin) === "string" && configs.spin === "folding") ? getArrJsonItem(spinObj, "folding").item
            : (typeof (configs.spin) === "string" && configs.spin === "timer") ? getArrJsonItem(spinObj, "timer").item
            : (typeof (configs.spin) === "string" && configs.spin === "location") ? getArrJsonItem(spinObj, "location").item
            : (typeof (configs.spin) === "string" && configs.spin === "battery") ? getArrJsonItem(spinObj, "battery").item
            : (typeof (configs.spin) === "string" && configs.spin === "rotation") ? getArrJsonItem(spinObj, "rotation").item
            : (typeof (configs.spin) === "object" && configs.spin.images != "") ? configs.spin.images
            : getArrJsonItem(spinObj, _default.spin).item;

        $('body').append($(_html).attr("id", _id));

        $('body').find("#" + _id).css({
            "position": "absolute"
            , "z-index": _zIndex
            , "background-color": _background
        });

        $('body').find("#" + _id).addClass('animated fadeIn');


        var _spinnerHtml = "";

        if (typeof _spinObj === "string") {
            _spinnerHtml = "<div id=" + _id + "_img></div>";
        } else {
            _spinnerHtml = getArrJsonItem(_spinObj, "html").item.html;
            _spinnerHtml = _spinnerHtml.replace(/{SpinnerObjIDValue}/g, _id);
            _spinnerHtml = _spinnerHtml.replace(/{SpinnerObjColorValue}/g, _color.replace("#", ""));
            _spinnerHtml = _spinnerHtml.replace(/{SpinnerObjRGBColorValue}/g, _hexColor);
            _spinnerHtml = _spinnerHtml.replace(/{SpinnerObjSizeValue}/g, _size);
        }

        $('body').find("#" + _id + " .spinner").html(_spinnerHtml);

        if ($('body').find("#" + _id + "_img").length > 0) {
            $('body').find("#" + _id + "_img").css({
                "width": "100%"
                , "height": "100%"
                , "background-image": "url(" + _spinObj + ")"
                , "background-size": "contain"
                , "background-repeat": "no-repeat"
                , "background-position": "center"
            });
        }

        $('body').find("#" + _id + " .spinner").css({
            "width": _size + "px"
            , "height": _size + "px"
            , "position": "relative"
            , "overflow": "hidden"
            , "text-align": "center"
        });

        $('body').find("#" + _id + " .spinner_info").css({
            "width": _size + "px"
            , "height": _size + "px"
            , "position": "absolute"
            , "text-align": "center"
        });

        if (_infoHtml != '') {
            $('body').find("#" + _id + " .spinner_info").html(_infoHtml);
        }
        if (_infoClass != '') {
            $('body').find("#" + _id + " .spinner_info").addClass(_infoClass);
        }

        resize(_id);

        $(window).on("resize", function () {
            $.each(spinnerArr, function (index, item) {
                resize(item.id);
            });
        });

        if (typeof (callback) === "function") {
            callback();
        }

        return {
            configs: {
                spin: _spin
                , size: _size
                , position: _position
                , background: _background
                , color: _color
                , shade: _shade
                , container: _container
            }
            , id: _id
            , obj: $('body').find("#" + _id)
            , infoObj: $('body').find("#" + _id + " .spinner_info")
            , show: function (callback) {
                this.obj.show();
                if (typeof callback === "function") {
                    callback();
                }
            }
            , hidden: function (callback) {
                this.obj.hide();
                if (typeof callback === "function") {
                    callback();
                }
            }
            , remove: function (callback) {
                remove(this, callback);
            }
            , position: function (position) {
                this.configs.position = position;
                var hasSpinnerObj = getArrJsonItem(spinnerArr, "id", this.id);
                spinnerArr.splice(hasSpinnerObj.index, hasSpinnerObj.index + 1);
                spinnerArr.push({
                    id: this.id
                    , configs: this.configs
                });
                resize(this.id);
            }
        }
    }

    function remove(spinnerObj, callback) {
        var hasSpinnerObj = getArrJsonItem(spinnerArr, "id", spinnerObj.id);
        if (hasSpinnerObj.index != -1) {
            spinnerArr.splice(hasSpinnerObj.index, hasSpinnerObj.index + 1);
            spinnerObj.obj.removeClass('animated fadeIn').addClass('animated fadeOut');
            setTimeout(function () {
                spinnerObj.obj.remove();
                if (typeof (callback) === "function") {
                    callback();
                }
            }, 500);
        }
    }

    var spinObj = [
        {
            "circle": {
                "html": ''
                + '<div class="sk-circle">'
                + '  <div class="sk-circle1 sk-child"></div>'
                + '  <div class="sk-circle2 sk-child"></div>'
                + '  <div class="sk-circle3 sk-child"></div>'
                + '  <div class="sk-circle4 sk-child"></div>'
                + '  <div class="sk-circle5 sk-child"></div>'
                + '  <div class="sk-circle6 sk-child"></div>'
                + '  <div class="sk-circle7 sk-child"></div>'
                + '  <div class="sk-circle8 sk-child"></div>'
                + '  <div class="sk-circle9 sk-child"></div>'
                + '  <div class="sk-circle10 sk-child"></div>'
                + '  <div class="sk-circle11 sk-child"></div>'
                + '  <div class="sk-circle12 sk-child"></div>'
                + '</div>'
                + '<style>'
                + '   #{SpinnerObjIDValue} .sk-circle {'
                + '        margin: auto;'
                + '        width: 100%;'
                + '        height: 100%;'
                + '        position: relative;'
                + '    }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-child {'
                + '        width: 100%;'
                + '        height: 100%;'
                + '        position: absolute;'
                + '        left: 0;'
                + '        top: 0;'
                + '    }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-child:before {'
                + '        content: "";'
                + '        display: block;'
                + '        margin: 0 auto;'
                + '        width: 15%;'
                + '        height: 15%;'
                + '        background-color: #{SpinnerObjColorValue};'
                + '        border-radius: 100%;'
                + '        -webkit-animation: {SpinnerObjIDValue}sk-circleBounceDelay 1.2s infinite ease-in-out both;'
                + '        animation: {SpinnerObjIDValue}sk-circleBounceDelay 1.2s infinite ease-in-out both;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle2 {'
                + '        -webkit-transform: rotate(30deg);'
                + '        -ms-transform: rotate(30deg);'
                + '        transform: rotate(30deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle3 {'
                + '        -webkit-transform: rotate(60deg);'
                + '        -ms-transform: rotate(60deg);'
                + '        transform: rotate(60deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle4 {'
                + '        -webkit-transform: rotate(90deg);'
                + '        -ms-transform: rotate(90deg);'
                + '        transform: rotate(90deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle5 {'
                + '        -webkit-transform: rotate(120deg);'
                + '        -ms-transform: rotate(120deg);'
                + '        transform: rotate(120deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle6 {'
                + '        -webkit-transform: rotate(150deg);'
                + '        -ms-transform: rotate(150deg);'
                + '        transform: rotate(150deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle7 {'
                + '        -webkit-transform: rotate(180deg);'
                + '        -ms-transform: rotate(180deg);'
                + '        transform: rotate(180deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle8 {'
                + '        -webkit-transform: rotate(210deg);'
                + '        -ms-transform: rotate(210deg);'
                + '        transform: rotate(210deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle9 {'
                + '        -webkit-transform: rotate(240deg);'
                + '        -ms-transform: rotate(240deg);'
                + '        transform: rotate(240deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle10 {'
                + '        -webkit-transform: rotate(270deg);'
                + '        -ms-transform: rotate(270deg);'
                + '        transform: rotate(270deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle11 {'
                + '        -webkit-transform: rotate(300deg);'
                + '        -ms-transform: rotate(300deg);'
                + '        transform: rotate(300deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle12 {'
                + '        -webkit-transform: rotate(330deg);'
                + '        -ms-transform: rotate(330deg);'
                + '        transform: rotate(330deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle2:before {'
                + '        -webkit-animation-delay: -1.1s;'
                + '        animation-delay: -1.1s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle3:before {'
                + '        -webkit-animation-delay: -1s;'
                + '        animation-delay: -1s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle4:before {'
                + '        -webkit-animation-delay: -0.9s;'
                + '        animation-delay: -0.9s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle5:before {'
                + '        -webkit-animation-delay: -0.8s;'
                + '        animation-delay: -0.8s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle6:before {'
                + '        -webkit-animation-delay: -0.7s;'
                + '        animation-delay: -0.7s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle7:before {'
                + '        -webkit-animation-delay: -0.6s;'
                + '        animation-delay: -0.6s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle8:before {'
                + '        -webkit-animation-delay: -0.5s;'
                + '        animation-delay: -0.5s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle9:before {'
                + '        -webkit-animation-delay: -0.4s;'
                + '        animation-delay: -0.4s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle10:before {'
                + '        -webkit-animation-delay: -0.3s;'
                + '        animation-delay: -0.3s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle11:before {'
                + '        -webkit-animation-delay: -0.2s;'
                + '        animation-delay: -0.2s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-circle .sk-circle12:before {'
                + '        -webkit-animation-delay: -0.1s;'
                + '        animation-delay: -0.1s;'
                + '   }'
                + '   @-webkit-keyframes {SpinnerObjIDValue}sk-circleBounceDelay {'
                + '        0%, 80%, 100% {'
                + '            -webkit-transform: scale(0);'
                + '            transform: scale(0);'
                + '        } 40% {'
                + '            -webkit-transform: scale(1);'
                + '            transform: scale(1);'
                + '            }'
                + '        }'
                + '   @keyframes {SpinnerObjIDValue}sk-circleBounceDelay {'
                + '        0%, 80%, 100% {'
                + '            -webkit-transform: scale(0);'
                + '            transform: scale(0);'
                + '        } 40% {'
                + '            -webkit-transform: scale(1);'
                + '            transform: scale(1);'
                + '            }'
                + '        }'
                + '</style>'
            }
        },
        {
            "fading": {
                "html": ''
                + '<div class="sk-fading-circle">'
                + '  <div class="sk-circle1 sk-circle"></div>'
                + '  <div class="sk-circle2 sk-circle"></div>'
                + '  <div class="sk-circle3 sk-circle"></div>'
                + '  <div class="sk-circle4 sk-circle"></div>'
                + '  <div class="sk-circle5 sk-circle"></div>'
                + '  <div class="sk-circle6 sk-circle"></div>'
                + '  <div class="sk-circle7 sk-circle"></div>'
                + '  <div class="sk-circle8 sk-circle"></div>'
                + '  <div class="sk-circle9 sk-circle"></div>'
                + '  <div class="sk-circle10 sk-circle"></div>'
                + '  <div class="sk-circle11 sk-circle"></div>'
                + '  <div class="sk-circle12 sk-circle"></div>'
                + '</div>'
                + '<style>'
                + '   #{SpinnerObjIDValue} .sk-fading-circle {'
                + '        margin: auto;'
                + '        width: 100%;'
                + '        height: 100%;'
                + '        position: relative;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle {'
                + '        width: 100%;'
                + '        height: 100%;'
                + '        position: absolute;'
                + '        left: 0;'
                + '        top: 0;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle:before {'
                + '        content: "";'
                + '        display: block;'
                + '        margin: 0 auto;'
                + '        width: 15%;'
                + '        height: 15%;'
                + '        background-color: #{SpinnerObjColorValue};'
                + '        border-radius: 100%;'
                + '        -webkit-animation: {SpinnerObjIDValue}sk-circleFadeDelay 1.2s infinite ease-in-out both;'
                + '        animation: {SpinnerObjIDValue}sk-circleFadeDelay 1.2s infinite ease-in-out both;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle2 {'
                + '        -webkit-transform: rotate(30deg);'
                + '        -ms-transform: rotate(30deg);'
                + '        transform: rotate(30deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle3 {'
                + '        -webkit-transform: rotate(60deg);'
                + '        -ms-transform: rotate(60deg);'
                + '        transform: rotate(60deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle4 {'
                + '        -webkit-transform: rotate(90deg);'
                + '        -ms-transform: rotate(90deg);'
                + '        transform: rotate(90deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle5 {'
                + '        -webkit-transform: rotate(120deg);'
                + '        -ms-transform: rotate(120deg);'
                + '        transform: rotate(120deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle6 {'
                + '        -webkit-transform: rotate(150deg);'
                + '        -ms-transform: rotate(150deg);'
                + '        transform: rotate(150deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle7 {'
                + '        -webkit-transform: rotate(180deg);'
                + '        -ms-transform: rotate(180deg);'
                + '        transform: rotate(180deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle8 {'
                + '        -webkit-transform: rotate(210deg);'
                + '        -ms-transform: rotate(210deg);'
                + '        transform: rotate(210deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle9 {'
                + '        -webkit-transform: rotate(240deg);'
                + '        -ms-transform: rotate(240deg);'
                + '        transform: rotate(240deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle10 {'
                + '        -webkit-transform: rotate(270deg);'
                + '        -ms-transform: rotate(270deg);'
                + '        transform: rotate(270deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle11 {'
                + '        -webkit-transform: rotate(300deg);'
                + '        -ms-transform: rotate(300deg);'
                + '        transform: rotate(300deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle12 {'
                + '        -webkit-transform: rotate(330deg);'
                + '        -ms-transform: rotate(330deg);'
                + '        transform: rotate(330deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle2:before {'
                + '        -webkit-animation-delay: -1.1s;'
                + '        animation-delay: -1.1s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle3:before {'
                + '        -webkit-animation-delay: -1s;'
                + '        animation-delay: -1s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle4:before {'
                + '        -webkit-animation-delay: -0.9s;'
                + '        animation-delay: -0.9s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle5:before {'
                + '        -webkit-animation-delay: -0.8s;'
                + '        animation-delay: -0.8s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle6:before {'
                + '        -webkit-animation-delay: -0.7s;'
                + '        animation-delay: -0.7s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle7:before {'
                + '        -webkit-animation-delay: -0.6s;'
                + '        animation-delay: -0.6s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle8:before {'
                + '        -webkit-animation-delay: -0.5s;'
                + '        animation-delay: -0.5s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle9:before {'
                + '        -webkit-animation-delay: -0.4s;'
                + '        animation-delay: -0.4s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle10:before {'
                + '        -webkit-animation-delay: -0.3s;'
                + '        animation-delay: -0.3s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle11:before {'
                + '        -webkit-animation-delay: -0.2s;'
                + '        animation-delay: -0.2s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-fading-circle .sk-circle12:before {'
                + '        -webkit-animation-delay: -0.1s;'
                + '        animation-delay: -0.1s;'
                + '   }'
                + '   @-webkit-keyframes {SpinnerObjIDValue}sk-circleFadeDelay {'
                + '        0%, 39%, 100% { opacity: 0; }'
                + '        40% { opacity: 1; }'
                + '   }'
                + '   @keyframes {SpinnerObjIDValue}sk-circleFadeDelay {'
                + '        0%, 39%, 100% { opacity: 0; }'
                + '        40% { opacity: 1; }'
                + '   }'
                + '</style>'
            }
        },
        {
            "grid": {
                "html": ''
                + '<div class="sk-cube-grid">'
                + '  <div class="sk-cube sk-cube1"></div>'
                + '  <div class="sk-cube sk-cube2"></div>'
                + '  <div class="sk-cube sk-cube3"></div>'
                + '  <div class="sk-cube sk-cube4"></div>'
                + '  <div class="sk-cube sk-cube5"></div>'
                + '  <div class="sk-cube sk-cube6"></div>'
                + '  <div class="sk-cube sk-cube7"></div>'
                + '  <div class="sk-cube sk-cube8"></div>'
                + '  <div class="sk-cube sk-cube9"></div>'
                + '</div>'
                + '<style>'
                + '   #{SpinnerObjIDValue} .sk-cube-grid {'
                + '        width: 100%;'
                + '        height: 100%;'
                + '        margin: auto;'
                + '     }'
                + '   #{SpinnerObjIDValue} .sk-cube-grid .sk-cube {'
                + '        width: 33%;'
                + '        height: 33%;'
                + '        background-color: #{SpinnerObjColorValue};'
                + '        float: left;'
                + '        -webkit-animation: {SpinnerObjIDValue}sk-cubeGridScaleDelay 1.3s infinite ease-in-out;'
                + '        animation: {SpinnerObjIDValue}sk-cubeGridScaleDelay 1.3s infinite ease-in-out;'
                + '     }'
                + '   #{SpinnerObjIDValue} .sk-cube-grid .sk-cube1 {'
                + '        -webkit-animation-delay: 0.2s;'
                + '        animation-delay: 0.2s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-cube-grid .sk-cube2 {'
                + '        -webkit-animation-delay: 0.3s;'
                + '        animation-delay: 0.3s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-cube-grid .sk-cube3 {'
                + '        -webkit-animation-delay: 0.4s;'
                + '        animation-delay: 0.4s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-cube-grid .sk-cube4 {'
                + '        -webkit-animation-delay: 0.1s;'
                + '        animation-delay: 0.1s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-cube-grid .sk-cube5 {'
                + '        -webkit-animation-delay: 0.2s;'
                + '        animation-delay: 0.2s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-cube-grid .sk-cube6 {'
                + '        -webkit-animation-delay: 0.3s;'
                + '        animation-delay: 0.3s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-cube-grid .sk-cube7 {'
                + '        -webkit-animation-delay: 0s;'
                + '        animation-delay: 0s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-cube-grid .sk-cube8 {'
                + '        -webkit-animation-delay: 0.1s;'
                + '        animation-delay: 0.1s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-cube-grid .sk-cube9 {'
                + '        -webkit-animation-delay: 0.2s;'
                + '        animation-delay: 0.2s;'
                + '   }'
                + '   @-webkit-keyframes {SpinnerObjIDValue}sk-cubeGridScaleDelay {'
                + '        0%, 70%, 100% {'
                + '             -webkit-transform: scale3D(1, 1, 1);'
                + '             transform: scale3D(1, 1, 1);'
                + '        } 35% {'
                + '             -webkit-transform: scale3D(0, 0, 1);'
                + '             transform: scale3D(0, 0, 1);'
                + '        }'
                + '   }'
                + '   @keyframes {SpinnerObjIDValue}sk-cubeGridScaleDelay {'
                + '        0%, 70%, 100% {'
                + '             -webkit-transform: scale3D(1, 1, 1);'
                + '             transform: scale3D(1, 1, 1);'
                + '        } 35% {'
                + '             -webkit-transform: scale3D(0, 0, 1);'
                + '             transform: scale3D(0, 0, 1);'
                + '        }'
                + '   }'
                + '</style>'
            }
        },
        {
            "folding": {
                "html": ''
                + '<div class="sk-folding-cube">'
                + '  <div class="sk-cube1 sk-cube"></div>'
                + '  <div class="sk-cube2 sk-cube"></div>'
                + '  <div class="sk-cube4 sk-cube"></div>'
                + '  <div class="sk-cube3 sk-cube"></div>'
                + '</div>'
                + '<style>'
                + '   #{SpinnerObjIDValue} .sk-folding-cube {'
                + '        margin: 20% auto;'
                + '        width: 60%;'
                + '        height: 60%;'
                + '        position: relative;'
                + '        -webkit-transform: rotateZ(45deg);'
                + '        transform: rotateZ(45deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-folding-cube .sk-cube {'
                + '        float: left;'
                + '        width: 50%;'
                + '        height: 50%;'
                + '        position: relative;'
                + '        -webkit-transform: scale(1.1);'
                + '        -ms-transform: scale(1.1);'
                + '        transform: scale(1.1);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-folding-cube .sk-cube:before {'
                + '        content: "";'
                + '        position: absolute;'
                + '        top: 0;'
                + '        left: 0;'
                + '        width: 100%;'
                + '        height: 100%;'
                + '        background-color: #{SpinnerObjColorValue};'
                + '        -webkit-animation: {SpinnerObjIDValue}sk-foldCubeAngle 2.4s infinite linear both;'
                + '        animation: {SpinnerObjIDValue}sk-foldCubeAngle 2.4s infinite linear both;'
                + '        -webkit-transform-origin: 100% 100%;'
                + '        -ms-transform-origin: 100% 100%;'
                + '        transform-origin: 100% 100%;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-folding-cube .sk-cube2 {'
                + '        -webkit-transform: scale(1.1) rotateZ(90deg);'
                + '        transform: scale(1.1) rotateZ(90deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-folding-cube .sk-cube3 {'
                + '        -webkit-transform: scale(1.1) rotateZ(180deg);'
                + '        transform: scale(1.1) rotateZ(180deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-folding-cube .sk-cube4 {'
                + '        -webkit-transform: scale(1.1) rotateZ(270deg);'
                + '        transform: scale(1.1) rotateZ(270deg);'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-folding-cube .sk-cube2:before {'
                + '        -webkit-animation-delay: 0.3s;'
                + '        animation-delay: 0.3s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-folding-cube .sk-cube3:before {'
                + '        -webkit-animation-delay: 0.6s;'
                + '        animation-delay: 0.6s;'
                + '   }'
                + '   #{SpinnerObjIDValue} .sk-folding-cube .sk-cube4:before {'
                + '        -webkit-animation-delay: 0.9s;'
                + '        animation-delay: 0.9s;'
                + '   }'
                + '   @-webkit-keyframes {SpinnerObjIDValue}sk-foldCubeAngle {'
                + '        0%, 10% {'
                + '            -webkit-transform: perspective(140px) rotateX(-180deg);'
                + '            transform: perspective(140px) rotateX(-180deg);'
                + '            opacity: 0;'
                + '        } 25%, 75% {'
                + '            -webkit-transform: perspective(140px) rotateX(0deg);'
                + '            transform: perspective(140px) rotateX(0deg);'
                + '            opacity: 1;'
                + '        } 90%, 100% {'
                + '            -webkit-transform: perspective(140px) rotateY(180deg);'
                + '            transform: perspective(140px) rotateY(180deg);'
                + '            opacity: 0;'
                + '        }'
                + '   }'
                + '   @keyframes {SpinnerObjIDValue}sk-foldCubeAngle {'
                + '        0%, 10% {'
                + '            -webkit-transform: perspective(140px) rotateX(-180deg);'
                + '            transform: perspective(140px) rotateX(-180deg);'
                + '            opacity: 0;'
                + '        } 25%, 75% {'
                + '            -webkit-transform: perspective(140px) rotateX(0deg);'
                + '            transform: perspective(140px) rotateX(0deg);'
                + '            opacity: 1;'
                + '        } 90%, 100% {'
                + '            -webkit-transform: perspective(140px) rotateY(180deg);'
                + '            transform: perspective(140px) rotateY(180deg);'
                + '            opacity: 0;'
                + '        }'
                + '   }'
                + '</style>'
            }
        },
        {
            "square": {
                "html": ''
                + '<style>'
                + '   #{SpinnerObjIDValue} .spinner {'
                + '        background-color: #{SpinnerObjColorValue};'
                + '        margin:auto;'
                + '        -webkit-animation: {SpinnerObjIDValue}sk-rotateplane 1.2s infinite ease-in-out;'
                + '        animation: {SpinnerObjIDValue}sk-rotateplane 1.2s infinite ease-in-out;'
                + '    }'
                + '   @-webkit-keyframes {SpinnerObjIDValue}sk-rotateplane {'
                + '        0% { -webkit-transform: perspective(120px) }'
                + '        50% { -webkit-transform: perspective(120px) rotateY(180deg) }'
                + '        100% { -webkit-transform: perspective(120px) rotateY(180deg)  rotateX(180deg) }'
                + '    }'
                + '   @keyframes {SpinnerObjIDValue}sk-rotateplane {'
                + '        0% {'
                + '            transform: perspective(120px) rotateX(0deg) rotateY(0deg);'
                + '            -webkit-transform: perspective(120px) rotateX(0deg) rotateY(0deg)'
                + '        } 50% {'
                + '            transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg);'
                + '            -webkit-transform: perspective(120px) rotateX(-180.1deg) rotateY(0deg)'
                + '        } 100% {'
                + '            transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);'
                + '            -webkit-transform: perspective(120px) rotateX(-180deg) rotateY(-179.9deg);'
                + '        }'
                + '    }'
                + '</style>'
            }
        },
        {
            "bounce": {
                "html": ''
                + '<div class="double-bounce1"></div>'
                + '<div class="double-bounce2"></div>'
                + '<style>'
                + '   #{SpinnerObjIDValue} .spinner {'
                + '        margin:auto;'
                + '        background-color: #{SpinnerObjColorValue};'
                + '        border-radius: 100%;'
                + '        -webkit-animation: {SpinnerObjIDValue}sk-scaleout 1.0s infinite ease-in-out;'
                + '        animation: {SpinnerObjIDValue}sk-scaleout 1.0s infinite ease-in-out;'
                + '    }'
                + '   @-webkit-keyframes {SpinnerObjIDValue}sk-scaleout {'
                + '        0% { -webkit-transform: scale(0) }'
                + '        100% {'
                + '            -webkit-transform: scale(1.0);'
                + '            opacity: 0;'
                + '        }'
                + '    }'
                + '   @keyframes {SpinnerObjIDValue}sk-scaleout {'
                + '        0% {'
                + '            -webkit-transform: scale(0);'
                + '            transform: scale(0);'
                + '        } 100% {'
                + '            -webkit-transform: scale(1.0);'
                + '            transform: scale(1.0);'
                + '            opacity: 0;'
                + '        }'
                + '    }'
                + '</style>'
            }
        },
        {
            "double": {
                "html": ''
                + '<div class="double-bounce1"></div>'
                + '<div class="double-bounce2"></div>'
                + '<style>'
                + '   #{SpinnerObjIDValue} .spinner {'
                + '        margin:auto;'
                + '    }'
                + '   #{SpinnerObjIDValue} .double-bounce1,#{SpinnerObjIDValue} .double-bounce2 {'
                + '        width: 100%;'
                + '        height: 100%;'
                + '        border-radius: 50%;'
                + '        background-color: #{SpinnerObjColorValue};'
                + '        opacity: 0.6;'
                + '        position: absolute;'
                + '        top: 0;'
                + '        left: 0;'
                + '        -webkit-animation: {SpinnerObjIDValue}sk-bounce 2.0s infinite ease-in-out;'
                + '        animation: {SpinnerObjIDValue}sk-bounce 2.0s infinite ease-in-out;'
                + '    }'
                + '   #{SpinnerObjIDValue} .double-bounce2 {'
                + '        -webkit-animation-delay: -1.0s;'
                + '        animation-delay: -1.0s;'
                + '    }'
                + '   @-webkit-keyframes {SpinnerObjIDValue}sk-bounce {'
                + '        0%, 100% { -webkit-transform: scale(0.0) }'
                + '        50% { -webkit-transform: scale(1.0) }'
                + '    }'
                + '   @keyframes {SpinnerObjIDValue}sk-bounce {'
                + '        0%, 100% {'
                + '            transform: scale(0.0);'
                + '            -webkit-transform: scale(0.0);'
                + '        } 50% {'
                + '            transform: scale(1.0);'
                + '            -webkit-transform: scale(1.0);'
                + '        }'
                + '    }'
                + '</style>'
            }
        },
        {
            "three": {
                "html": ''
                + '<div class="bounce1"></div>'
                + '<div class="bounce2"></div>'
                + '<div class="bounce3"></div>'
                + '<style>'
                + '   #{SpinnerObjIDValue} .spinner {'
                + '        margin:auto;'
                + '    }'
                + '   #{SpinnerObjIDValue} .spinner > div {'
                + '        width: 25%;'
                + '        height: 25%;'
                + '        background-color: #{SpinnerObjColorValue};'
                + '        border-radius: 100%;'
                + '        display: inline-block;'
                + '        -webkit-animation: {SpinnerObjIDValue}sk-bouncedelay 1.4s infinite ease-in-out both;'
                + '        animation: {SpinnerObjIDValue}sk-bouncedelay 1.4s infinite ease-in-out both;'
                + '    }'
                + '   #{SpinnerObjIDValue} .spinner .bounce1 {'
                + '        -webkit-animation-delay: -0.32s;'
                + '        animation-delay: -0.32s;'
                + '    }'
                + '   #{SpinnerObjIDValue} .spinner .bounce2 {'
                + '        -webkit-animation-delay: -0.16s;'
                + '        animation-delay: -0.16s;'
                + '    }'
                + '   @-webkit-keyframes {SpinnerObjIDValue}sk-bouncedelay {'
                + '        0%, 80%, 100% { -webkit-transform: scale(0) }'
                + '        40% { -webkit-transform: scale(1.0) }'
                + '    }'
                + '   @keyframes {SpinnerObjIDValue}sk-bouncedelay {'
                + '        0%, 80%, 100% {'
                + '            -webkit-transform: scale(0);'
                + '            transform: scale(0);'
                + '        } 40% {'
                + '            -webkit-transform: scale(1.0);'
                + '            transform: scale(1.0);'
                + '        }'
                + '    }'
                + '</style>'
            }
        },
        {
            "dot": {
                "html": ''
                + '<div class="dot1"></div>'
                + '<div class="dot2"></div>'
                + '<style>'
                + '   #{SpinnerObjIDValue} .spinner {'
                + '        margin:auto;'
                + '        -webkit-animation: {SpinnerObjIDValue}sk-rotate 2.0s infinite linear;'
                + '        animation: {SpinnerObjIDValue}sk-rotate 2.0s infinite linear;'
                + '    }'
                + '   #{SpinnerObjIDValue} .dot1,#{SpinnerObjIDValue} .dot2 {'
                + '        width: 50%;'
                + '        height: 50%;'
                + '        display: inline-block;'
                + '        position: absolute;'
                + '        top: 0;'
                + '        background-color: #{SpinnerObjColorValue};'
                + '        border-radius: 100%;'
                + '        -webkit-animation: {SpinnerObjIDValue}sk-bounce 2.0s infinite ease-in-out;'
                + '        animation: {SpinnerObjIDValue}sk-bounce 2.0s infinite ease-in-out;'
                + '    }'
                + '   #{SpinnerObjIDValue} .dot2 {'
                + '        top: auto;'
                + '        bottom: 0;'
                + '        -webkit-animation-delay: -1.0s;'
                + '        animation-delay: -1.0s;'
                + '    }'
                + '   @-webkit-keyframes {SpinnerObjIDValue}sk-rotate { 100% { -webkit-transform: rotate(360deg) }}'
                + '   @keyframes {SpinnerObjIDValue}sk-rotate { 100% { transform: rotate(360deg); -webkit-transform: rotate(360deg) }}'
                + '   @-webkit-keyframes {SpinnerObjIDValue}sk-bounce {'
                + '        0%, 100% { -webkit-transform: scale(0.0) }'
                + '        50% { -webkit-transform: scale(1.0) }'
                + '    }'
                + '   @keyframes {SpinnerObjIDValue}sk-bounce {'
                + '        0%, 100% {'
                + '             transform: scale(0.0);'
                + '             -webkit-transform: scale(0.0);'
                + '        } 50% {'
                + '             transform: scale(1.0);'
                + '             -webkit-transform: scale(1.0);'
                + '        }'
                + '    }'
                + '</style>'
            }
        },
        {
            "cube": {
                "html": ''
                + '<div class="cube1"></div>'
                + '<div class="cube2"></div>'
                + '<style>'
                + '   #{SpinnerObjIDValue} .spinner {'
                + '        margin:auto;'
                + '    }'
                + '   #{SpinnerObjIDValue} .cube1,#{SpinnerObjIDValue} .cube2 {'
                + '        background-color: #{SpinnerObjColorValue};'
                + '        width: 45%;'
                + '        height: 45%;'
                + '        position: absolute;'
                + '        top: 0;'
                + '        left: 0;'
                + '        margin: 5%;'
                + '        -webkit-animation: {SpinnerObjIDValue}sk-cubemove 1.8s infinite ease-in-out;'
                + '        animation: {SpinnerObjIDValue}sk-cubemove 1.8s infinite ease-in-out;'
                + '    }'
                + '   #{SpinnerObjIDValue} .cube2 {'
                + '        -webkit-animation-delay: -0.9s;'
                + '        animation-delay: -0.9s;'
                + '    }'
                + '   @-webkit-keyframes {SpinnerObjIDValue}sk-cubemove {'
                + '        25% { -webkit-transform: translateX(100%) rotate(-90deg) scale(0.5) }'
                + '        50% { -webkit-transform: translateX(100%) translateY(100%) rotate(-180deg) }'
                + '        75% { -webkit-transform: translateX(0px) translateY(100%) rotate(-270deg) scale(0.5) }'
                + '        100% { -webkit-transform: rotate(-360deg) }'
                + '    }'
                + '   @keyframes {SpinnerObjIDValue}sk-cubemove {'
                + '        25% {'
                + '            transform: translateX(100%) rotate(-90deg) scale(0.5);'
                + '        -webkit-transform: translateX(100%) rotate(-90deg) scale(0.5);'
                + '        } 50% {'
                + '            transform: translateX(100%) translateY(100%) rotate(-179deg);'
                + '        -webkit-transform: translateX(100%) translateY(100%) rotate(-179deg);'
                + '        } 50.1% {'
                + '            transform: translateX(100%) translateY(100%) rotate(-180deg);'
                + '        -webkit-transform: translateX(100%) translateY(100%) rotate(-180deg);'
                + '        } 75% {'
                + '            transform: translateX(0px) translateY(100%) rotate(-270deg) scale(0.5);'
                + '        -webkit-transform: translateX(0px) translateY(100%) rotate(-270deg) scale(0.5);'
                + '        } 100% {'
                + '            transform: rotate(-360deg);'
                + '        -webkit-transform: rotate(-360deg);'
                + '        }'
                + '    }'
                + '</style>'
            }
        },
        {
            "timer": {
                "html": ''
                + '<div class="timer"></div>'
                + '<style>'
                + '   #{SpinnerObjIDValue} .timer{'
                + '        width: 100%;'
                + '        height: 100%;'
                + '        background-color: transparent;'
                + '        box-shadow: inset 0px 0px 0px 2px #{SpinnerObjColorValue};'
                + '        border-radius: 50%;'
                + '        position: relative;'
                + '        margin: auto;/* Not necessary- its only for layouting*/'
                + '    }'
                + '   #{SpinnerObjIDValue} .timer:after,#{SpinnerObjIDValue} .timer:before {'
                + '        position: absolute;'
                + '        content:"";'
                + '        background-color: #{SpinnerObjColorValue};'
                + '    }'
                + '   #{SpinnerObjIDValue} .timer:after{'
                + '        width: 45%;'
                + '        height: 2%;'
                + '        top: 50%;'
                + '        left: 50%;;'
                + '        -webkit-transform-origin: 1px 1px;'
                + '        -moz-transform-origin: 1px 1px;'
                + '        transform-origin: 1px 1px;'
                + '        -webkit-animation: {SpinnerObjIDValue}minhand 2s linear infinite;'
                + '        -moz-animation: {SpinnerObjIDValue}minhand 2s linear infinite;'
                + '        animation: {SpinnerObjIDValue}minhand 2s linear infinite;'
                + '    }'
                + '   #{SpinnerObjIDValue} .timer:before{'
                + '        width: 30%;'
                + '        height: 4%;'
                + '        top: 50%;'
                + '        left: 50%;'
                + '        -webkit-transform-origin: 1px 1px;'
                + '        -moz-transform-origin: 1px 1px;'
                + '        transform-origin: 1px 1px;'
                + '        -webkit-animation: {SpinnerObjIDValue}hrhand 8s linear infinite;'
                + '        -moz-animation: {SpinnerObjIDValue}hrhand 8s linear infinite;'
                + '        animation: {SpinnerObjIDValue}hrhand 8s linear infinite;'
                + '    }'
                + '   @-webkit-keyframes {SpinnerObjIDValue}minhand{'
                + '        0%{-webkit-transform:rotate(0deg)}'
                + '        100%{-webkit-transform:rotate(360deg)}'
                + '    }'
                + '   @-moz-keyframes {SpinnerObjIDValue}minhand{'
                + '        0%{-moz-transform:rotate(0deg)}'
                + '        100%{-moz-transform:rotate(360deg)}'
                + '    }'
                + '   @keyframes {SpinnerObjIDValue}minhand{'
                + '        0%{transform:rotate(0deg)}'
                + '        100%{transform:rotate(360deg)}'
                + '        }'

                + '   @-webkit-keyframes {SpinnerObjIDValue}hrhand{'
                + '        0%{-webkit-transform:rotate(0deg)}'
                + '        100%{-webkit-transform:rotate(360deg)}'
                + '    }'
                + '   @-moz-keyframes {SpinnerObjIDValue}hrhand{'
                + '        0%{-moz-transform:rotate(0deg)}'
                + '        100%{-moz-transform:rotate(360deg)}'
                + '    }'
                + '   @keyframes {SpinnerObjIDValue}hrhand{'
                + '        0%{transform:rotate(0deg)}'
                + '        100%{transform:rotate(360deg)}'
                + '    }'
                + '</style>'
            }
        },
        {
            "location": {
                "html": ''
                + '<div class="location_indicator"></div>'
                + '<style>'
                + '   #{SpinnerObjIDValue} .location_indicator{'
                + '        margin: 15% auto;'
                + '        width: 100%;'
                + '        height: 100%;'
                + '        position: relative;'
                + '        left: -20%;'
                + '    }'
                + '   #{SpinnerObjIDValue} .location_indicator:before, #{SpinnerObjIDValue} .location_indicator:after{'
                + '        position: absolute;'
                + '        content: "";'
                + '    }'
                + '   #{SpinnerObjIDValue} .location_indicator:before{'
                + '        width: 40%;'
                + '        height: 40%;'
                + '        border-radius: 100% 100% 100% 0;'
                + '        box-shadow: 0px 0px 0px 2px #{SpinnerObjColorValue};'
                + '        -webkit-animation: {SpinnerObjIDValue}mapping 1s linear infinite;'
                + '        -moz-animation: {SpinnerObjIDValue}mapping 1s linear infinite;'
                + '        animation: {SpinnerObjIDValue}mapping 1s linear infinite;'
                + '        -webkit-transform: rotate(-46deg);'
                + '        -moz-transform: rotate(-46deg);'
                + '        transform: rotate(-46deg);'
                + '    }'
                + '   #{SpinnerObjIDValue} .location_indicator:after{'
                + '        width: 80%;'
                + '        height: 25%;'
                + '        border-radius: 100%;'
                + '        left: 30%;'
                + '        background-color: rgba({SpinnerObjRGBColorValue},.2);'
                + '        top: 40%;'
                + '        z-index: -1;'
                + '    }'
                + '   @-webkit-keyframes {SpinnerObjIDValue}mapping{'
                + '        0% {top: 0;}'
                + '        50% {top: -10%;}'
                + '        100% {top:0; }'
                + '    }'
                + '   @-moz-keyframes {SpinnerObjIDValue}mapping{'
                + '        0% {top: 0;}'
                + '        50% {top: -10%;}'
                + '        100% {top:0; }'
                + '    }'
                + '   @keyframes {SpinnerObjIDValue}mapping{'
                + '        0% {top: 0;}'
                + '        50% {top: -10%;}'
                + '        100% {top:0; }'
                + '    }'
                + '</style>'
            }
        },
        {
            "battery": {
                "html": ''
                + '<div class="battery"></div>'
                + '<style>'
                + '   #{SpinnerObjIDValue} .battery{'
                + '        width: 90%;'
                + '        height: 50%;'
                + '        border: 1px #{SpinnerObjColorValue} solid;'
                + '        border-radius: 2px;'
                + '        position: relative;'
                + '        -webkit-animation: {SpinnerObjIDValue}charge 5s linear infinite;'
                + '        -moz-animation: {SpinnerObjIDValue}charge 5s linear infinite;'
                + '        animation: {SpinnerObjIDValue}charge 5s linear infinite;'
                + '        top:25%;'
                + '        margin: auto;'
                + '    }'
                + '   #{SpinnerObjIDValue} .battery:after{'
                + '        width: 10%;'
                + '        height: 40%;'
                + '        background-color: #{SpinnerObjColorValue};'
                + '        border-radius: 0px 1px 1px 0px;'
                + '        position: absolute;'
                + '        content: "";'
                + '        top: 30%;'
                + '        right: -10%;'
                + '    }'
                + '   @-webkit-keyframes {SpinnerObjIDValue}charge{'
                + '        0%{box-shadow: inset 0px 0px 0px #{SpinnerObjColorValue};}'
                + '        100%{box-shadow: inset {SpinnerObjSizeValue}px 0px 0px #{SpinnerObjColorValue};}'
                + '    }'
                + '   @-moz-keyframes {SpinnerObjIDValue}charge{'
                + '        0%{box-shadow: inset 0px 0px 0px #{SpinnerObjColorValue};}'
                + '        100%{box-shadow: inset {SpinnerObjSizeValue}px 0px 0px #{SpinnerObjColorValue};}'
                + '    }'
                + '   @keyframes {SpinnerObjIDValue}charge{'
                + '        0%{box-shadow: inset 0px 0px 0px #{SpinnerObjColorValue};}'
                + '        100%{box-shadow: inset {SpinnerObjSizeValue}px 0px 0px #{SpinnerObjColorValue};}'
                + '    }'
                + '</style>'
            }
        },
        {
            "rotation": {
                "html": ''
                + '<div class="rotation"></div>'
                + '<style>'
                + '   #{SpinnerObjIDValue} .rotation{'
                + '        width: 100%;'
                + '        height: 100%;'
                + '        border: 1px #{SpinnerObjColorValue} solid;'
                + '        border-radius: 50%;'
                + '        -webkit-animation: {SpinnerObjIDValue}rotation 1s ease-in-out infinite;'
                + '        -moz-animation: {SpinnerObjIDValue}rotation 1s ease-in-out infinite;'
                + '        animation: {SpinnerObjIDValue}rotation 1s ease-in-out infinite;'
                + '        margin: auto;'
                + '    }'
                + '   #{SpinnerObjIDValue} .rotation:after{'
                + '        width: 20%;'
                + '        height: 20%;'
                + '        background-color: rgba({SpinnerObjRGBColorValue},1);'
                + '        border-radius: 100%;'
                + '        position: absolute;'
                + '        content: "";'
                + '    }'
                + '   @-webkit-keyframes {SpinnerObjIDValue}rotation{'
                + '        0%{-webkit-transform: rotate(0deg);}'
                + '        100%{-webkit-transform: rotate(360deg);}'
                + '    }'
                + '   @-moz-keyframes {SpinnerObjIDValue}rotation{'
                + '        0%{-moz-transform: rotate(0deg);}'
                + '        100%{-moz-transform: rotate(360deg);}'
                + '    }'
                + '   @keyframes {SpinnerObjIDValue}rotation{'
                + '        0%{transform: rotate(0deg);}'
                + '        100%{transform: rotate(360deg);}'
                + '    }'
                + '</style>'
            }
        }
    ];

    exports.Create = function (configs, callback) {
        return creatSpin(configs, callback);
    }
    exports.Destroy = function (callback) {
        $.each(spinnerArr, function (index, item) {
            $('#' + item.id).remove();
        });
        spinnerArr = [];
        if (typeof (callback) === "function") {
            callback();
        }
    }
    exports.version = "1.0.0";
}));