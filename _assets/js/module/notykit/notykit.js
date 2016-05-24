/**
 * Created by zhangzongshan on 16/5/10.
 */
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
        }, window['NotyKit'] = {}, {});
    }
}(function (require, exports, module) {

    var NotyKit = typeof exports !== 'undefined' ? exports : {};


    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            function F() {
            }

            F.prototype = o;
            return new F();
        };
    }

    function getmaxZindex(obj, max) {
        obj = (typeof (obj) == "object" && obj.length > 0) ? obj.find("*") : $('body *');
        max = max > 0 ? max + 1 : -1;
        var maxZ = Math.max.apply(null, $.map(obj, function (e, n) {
            if ($(e).css('layout') == 'absolute' || $(e).css('layout') == 'fixed')
                return parseInt($(e).css('z-index')) || 1;
        }));
        maxZ = maxZ == -Infinity ? 1 : maxZ;
        if (max != -1) {
            maxZ = maxZ < max ? maxZ : max;
        }
        return maxZ;
    }

    function getArrJsonItem(obj, key, value) {
        var k = (typeof (key) == "string" && key != "") ? key : null;
        var v = (typeof (value) != "undefined") ? value : null;
        if (typeof (obj) == "object" && obj != null && k != null) {
            for (var item in obj) {
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
        return {index: -1, item: null};
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
            : (typeof (position) == "object" && position != null) ? (position.left > 0 ? position.left : 0)
            : (obj.outerWidth() - width) / 2;

        return {
            top: _top
            , left: _left
        };
    }

    function getJqueryEventString(arrayObj) {
        var s = "";
        $.each(arrayObj, function (index, item) {
            var thisItem = (item.toLowerCase() === 'click') ? 'click'
                : (item.toLowerCase() === 'hover') ? 'hover'
                : (item.toLowerCase() === 'dblclick') ? 'dblclick'
                : (item.toLowerCase() === 'mousedown') ? 'mousedown'
                : (item.toLowerCase() === 'mousemove') ? 'mousemove'
                : (item.toLowerCase() === 'mouseout') ? 'mouseout'
                : (item.toLowerCase() === 'mouseover') ? 'mouseover'
                : (item.toLowerCase() === 'mouseup') ? 'mouseup'
                : (item.toLowerCase() === 'change') ? 'change'
                : (item.toLowerCase() === 'input') ? 'input propertychange'
                : (item.toLowerCase() === 'keydown') ? 'keydown'
                : (item.toLowerCase() === 'keypress') ? 'keypress'
                : (item.toLowerCase() === 'reset') ? 'reset'
                : (item.toLowerCase() === 'resize') ? 'resize'
                : (item.toLowerCase() === 'select') ? 'select'
                : (item.toLowerCase() === 'submit') ? 'submit'
                : (item.toLowerCase() === 'unload') ? 'unload'
                : "";
            if (index < arrayObj.length - 1 && thisItem != "") {
                thisItem += " ";
            }

            s += thisItem;
        });
        return s;
    }

    function setParentsStyle(obj, exprClass) {
        parentsObj = obj.parents(exprClass);
        parentObj = obj.parent();
        parentsObj.find("*").each(function () {
            if (!$(this).is(parentObj)) {
                $(this).css({
                    "position": "relative"
                });
            } else {
                parentObj.css({
                    "position": "relative"
                });
                return false;
            }
        });
    }

    function init(options) {
        var _options = NotyKitObj.options;
        options = (typeof (options) == "object" && options != null) ? options : _options;
        var _id = "notykit_" + (new Date().getTime() * Math.floor(Math.random() * 1000000));
        var _container = options.obj ? options.obj : $('body');
        var _width = options.width > 0 ? options.width : _options.width;
        var _height = options.height > 0 ? options.height : _options.height;
        var _background = (typeof (options.background) != "undefined" && options.background.indexOf("rgba(") != -1) ? options.background : _options.background;
        var _shade = (typeof (options.shade) != "undefined" && !options.shade) ? false : _options.shade;
        var _layout = (typeof (options.layout) != "undefined" && options.layout !== "") ? options.layout : _options.layout;
        var _template = (typeof (options.template) != "undefined" && options.template !== "") ? options.template : _options.template;
        var _title = (typeof (options.title) != "undefined" && typeof (options.title) === "object") ? {
            text: (typeof (options.title.text) != "undefined" && options.title.text !== "") ? options.title.text : _options.title.text,
            container: (typeof (options.title.container) != "undefined" && options.title.container !== "") ? options.title.container : _options.title.container,
            addClass: (typeof (options.title.addClass) != "undefined" && options.title.addClass !== "") ? options.title.addClass : _options.title.addClass
        } : _options.title;

        var _text = (typeof (options.text) != "undefined" && typeof (options.text) === "object") ? {
            text: (typeof (options.text.text) != "undefined" && options.text.text !== "") ? options.text.text : _options.text.text,
            container: (typeof (options.text.container) != "undefined" && options.text.container !== "") ? options.text.container : _options.text.container,
            addClass: (typeof (options.text.addClass) != "undefined" && options.text.addClass !== "") ? options.text.addClass : _options.text.addClass
        } : _options.text;
        var _closeItem = (typeof (options.closeItem) != "undefined" && typeof (options.closeItem) === "object") ? options.closeItem : _options.closeItem;
        var _callback = (typeof (options.callback) != "undefined" && typeof (options.callback) === "object") ? options.callback : _options.callback;
        var _buttons = (typeof (options.buttons) != "undefined" && typeof (options.buttons) === "object") ? options.buttons : _options.buttons;
        var _theme = (typeof (options.theme) != "undefined" && options.theme !== "") ? options.theme : _options.theme;

        var thisOptions = {};
        thisOptions.id = _id;
        thisOptions.obj = _container;
        thisOptions.width = _width;
        thisOptions.height = _height;
        thisOptions.background = (!_shade) ? 'transparent' : _background;
        thisOptions.shade = _shade;
        thisOptions.layout = _layout;
        thisOptions.template = _template;
        thisOptions.title = _title;
        thisOptions.text = _text;
        thisOptions.closeItem = _closeItem;
        thisOptions.callback = _callback;
        thisOptions.buttons = _buttons;
        thisOptions.theme = _theme;

        notykitDate.push({
            id: thisOptions.id
            , notykit: thisOptions
        });

        return Object.create(NotyKitObj).build(thisOptions);
    }

    var notykitDate = [];
    var template = '<div class="noty_border">'
        + '    <div class="noty_title"></div>'
        + '    <div class="noty_text"></div>'
        + '    <div class="noty_foot"></div>'
        + '</div>';

    var NotyKitObj = {
        options: {
            id: ""
            , obj: $('body')
            , width: 600
            , height: 400
            , background: "rgba(0,0,0,.1)"
            , shade: true
            , layout: 'center'
            , template: template
            , title: {
                container: '.noty_title'
                , text: ''
                , addClass: ''
            }
            , text: {
                container: '.noty_text'
                , text: ''
                , addClass: ''
            }
            , closeItem: [{
                container: '.notykit_content'//noty_border,noty_title,noty_text,noty_foot,notykit_content,notykit_container,或自定义容器
                , closeWith: ['click']
                , text: '<span class="icon-remove"></span>'//当 text 不为空时候下面配置生效
                , layout: 'topright'
                , addClass: 'close'
            }]
            , callback: {
                onShow: function (notykit) {
                }
                , afterShow: function (notykit) {
                }
                , onClose: function (notykit) {
                }
                , afterClose: function (notykit) {
                }
            }
            , buttons: [{
                container: '.noty_foot'//noty_foot,或自定义容器
                , addClass: ''
                , btnWith: ['click']
                , text: '确定'
                , callback: function (notykit) {
                }
            }, {
                container: '.noty_foot'//noty_foot,或自定义容器
                , addClass: ''
                , btnWith: ['click']
                , text: '取消'
                , callback: function (notykit) {
                }
            }]
            , theme: 'default.css'
            , type: 'alert'
            , animation: {
                open: {height: 'toggle'},
                close: {height: 'toggle'},
                easing: 'swing',
                speed: 500,
                fadeSpeed: 'fast',
            }
            , timeout: false
        },
        build: function (options) {
            var callbackObj = (typeof options.callback === "object" && options.callback != null) ? options.callback : null;
            var onShowFn = (typeof callbackObj.onShow === "function") ? callbackObj.onShow : function () {
            };
            var afterShowFn = (typeof callbackObj.afterShow === "function") ? callbackObj.afterShow : function () {
            };

            if (typeof onShowFn === "function") {
                onShowFn(options);
            }
            var _html = $("<div class='notykit_container'><div class='notykit_content'></div></div>");
            $('body').append(_html.attr("id", options.id));
            $("#" + options.id + " .notykit_content").html(options.template);

            var titleObj = this.addTitle(options);
            var textObj = this.addText(options);
            var btnObj = this.addBtnEvent(options);

            $("#" + options.id).css({
                "position": "absolute"
                , "top": options.obj.offset().top
                , "left": options.obj.offset().left
                , "z-index": getmaxZindex() + 1
                , "background-color": options.background
            });
            $("#" + options.id + " .notykit_content").css({
                "position": "relative"
                , "width": options.width + "px"
                , "height": options.height + "px"
                , "overflow": "hidden"
            });

            this.resize_noty(options);
            //添加关闭
            var closeObj = this.addCloseEvent(options);

            $(window).on("resize", function () {
                $.each(notykitDate, function (index, item) {
                    NotyKitObj.resize_noty(item.notykit);
                });
            });

            if (typeof afterShowFn === "function") {
                afterShowFn(options);
            }

            return {
                notyKitObj: $("#" + options.id)
                , notyKitConfig: options
                , titleObj: titleObj
                , textObj: textObj
                , closeObj: closeObj
                , btnObj: btnObj
                , Close: function (callback) {
                    Object.create(NotyKitObj).close(this.notyKitConfig);
                    if (typeof callback === "function") {
                        callback();
                    }
                }
                , Show: function (callback) {
                    this.notyKitObj.show();
                    if (typeof callback === "function") {
                        callback();
                    }
                }
                , Hidden: function (callback) {
                    this.notyKitObj.hide();
                    if (typeof callback === "function") {
                        callback();
                    }
                }
                , AutoSize: function () {
                    var width = 0;
                    var height = 0;
                    this.notyKitObj.find(".notykit_content > *").each(function () {
                        if (width < $(this).outerWidth(true)) {
                            width = $(this).outerWidth(true);
                        }
                    });
                    this.notyKitObj.find(".notykit_content > *").each(function () {
                        height += $(this).outerHeight(true);
                    });

                    this.notyKitConfig.width = width;
                    this.notyKitConfig.height = height;

                    if (width > 0) {
                        this.notyKitConfig.width = width;
                        this.notyKitObj.find(".notykit_content").css({
                            width: width + "px"
                        });
                    }
                    if (height > 0) {
                        this.notyKitConfig.height = height;
                        this.notyKitObj.find(".notykit_content").css({
                            height: height + "px"
                        });
                    }
                    Object.create(NotyKitObj).resize_noty(this.notyKitConfig);
                    this.notyKitObj.find(".close" + this.notyKitConfig.id).remove();
                    Object.create(NotyKitObj).addCloseEvent(this.notyKitConfig);
                    $(window).on("resize", function () {
                        NotyKitObj.resize_noty(this.notyKitConfig);
                    });
                }
                , Resize: function (width, height) {
                    if (width > 0) {
                        this.notyKitConfig.width = width;
                        this.notyKitObj.find(".notykit_content").css({
                            width: width + "px"
                        });
                    }
                    if (height > 0) {
                        this.notyKitConfig.height = height;
                        this.notyKitObj.find(".notykit_content").css({
                            height: height + "px"
                        });
                    }
                    Object.create(NotyKitObj).resize_noty(this.notyKitConfig);
                    this.notyKitObj.find(".close" + this.notyKitConfig.id).remove();
                    Object.create(NotyKitObj).addCloseEvent(this.notyKitConfig);
                    $(window).on("resize", function () {
                        NotyKitObj.resize_noty(this.notyKitConfig);
                    });
                }
                , SetTitle: function (text) {
                    this.notyKitObj.find(".notykit_content").css({
                        width: "100%"
                    });
                    this.notyKitObj.find(".notykit_content").css({
                        height: "100%"
                    });
                    this.titleObj.html(text);
                    this.AutoSize();
                }
                , SetText: function (text) {
                    this.notyKitObj.find(".notykit_content").css({
                        width: "100%"
                    });
                    this.notyKitObj.find(".notykit_content").css({
                        height: "100%"
                    });
                    this.textObj.html(text);
                    this.AutoSize();
                }
                , SetClose: function (close) {
                    close = (typeof (close) != "undefined" && typeof (close) === "object") ? close : NotyKitObj.options.closeItem;
                    this.notyKitConfig.closeItem = close;
                    this.notyKitObj.find(".notykit_content").css({
                        width: "100%"
                    });
                    this.notyKitObj.find(".notykit_content").css({
                        height: "100%"
                    });
                    Object.create(NotyKitObj).addCloseEvent(this.notyKitConfig);
                    this.AutoSize();
                }
                , SetBtn: function (btn) {
                    btn = (typeof (btn) != "undefined" && typeof (btn) === "object") ? btn : NotyKitObj.options.buttons;
                    this.notyKitConfig.buttons = close;
                    this.notyKitObj.find(".notykit_content").css({
                        width: "100%"
                    });
                    this.notyKitObj.find(".notykit_content").css({
                        height: "100%"
                    });
                    Object.create(NotyKitObj).addBtnEvent(this.notyKitConfig);
                    this.AutoSize();
                }
            };
        },
        addTitle: function (notykit) {
            var obj = $("#" + notykit.id);
            var titleItem = notykit.title;
            var titleObj = null;
            if (obj.length > 0) {
                var container = (typeof (titleItem.container) != "undefined" && titleItem.container !== "") ? titleItem.container : "";
                container = container.toLowerCase() === "noty_border" ? ".noty_title"
                    : container.toLowerCase() === "noty_title" ? ".noty_title"
                    : container.toLowerCase() === "noty_text" ? ".noty_title"
                    : container.toLowerCase() === "noty_foot" ? ".noty_title"
                    : container.toLowerCase() === "notykit_content" ? ".noty_title"
                    : container;//模版自定义容器

                var text = (typeof (titleItem.text) != "undefined" && titleItem.text !== "") ? titleItem.text : "";
                var addClass = (typeof (titleItem.addClass) != "undefined" && titleItem.addClass !== "") ? titleItem.addClass : "";
                if (container !== "" && text !== "") {
                    var thisObj = obj.find(container);
                    if (!thisObj.is(".notykit_container")) {
                        thisObj.css({
                            "position": "relative"
                        });
                        setParentsStyle(thisObj, ".notykit_content");
                    }

                    if (thisObj.length > 0) {
                        titleObj = $("<span class='title" + notykit.id + "'>" + text + "</span>");
                        if (addClass != "") {
                            titleObj.addClass(addClass);
                        }
                        thisObj.append(titleObj);
                    }
                }
            }
            return titleObj;
        },
        addText: function (notykit) {
            var obj = $("#" + notykit.id);
            var textItem = notykit.text;
            var textObj = null;
            if (obj.length > 0) {
                var container = (typeof (textItem.container) != "undefined" && textItem.container !== "") ? textItem.container : "";
                container = container.toLowerCase() === "noty_border" ? ".noty_text"
                    : container.toLowerCase() === "noty_title" ? ".noty_text"
                    : container.toLowerCase() === "noty_text" ? ".noty_text"
                    : container.toLowerCase() === "noty_foot" ? ".noty_text"
                    : container.toLowerCase() === "notykit_content" ? ".noty_text"
                    : container;//模版自定义容器

                var text = (typeof (textItem.text) != "undefined" && textItem.text !== "") ? textItem.text : "";
                var addClass = (typeof (textItem.addClass) != "undefined" && textItem.addClass !== "") ? textItem.addClass : "";
                if (container !== "" && text !== "") {
                    var thisObj = obj.find(container);
                    if (!thisObj.is(".notykit_container")) {
                        thisObj.css({
                            "position": "relative"
                        });
                        setParentsStyle(thisObj, ".notykit_content");
                    }
                    if (thisObj.length > 0) {
                        textObj = $("<span class='text" + notykit.id + "'>" + text + "</span>");
                        if (addClass != "") {
                            textObj.addClass(addClass);
                        }
                        thisObj.append(textObj);
                    }
                }
            }
            return textObj;
        },
        addCloseEvent: function (notykit) {
            var obj = $("#" + notykit.id);
            var closeItem = notykit.closeItem;
            $(".close" + notykit.id).remove();
            var closeObj = null;
            if (obj.length > 0) {
                $.each(closeItem, function (index, item) {
                    var container = (typeof (item.container) != "undefined" && item.container !== "") ? item.container : "";
                    container = container.toLowerCase() === "noty_border" ? ".noty_border"
                        : container.toLowerCase() === "noty_title" ? ".noty_title"
                        : container.toLowerCase() === "noty_text" ? ".noty_text"
                        : container.toLowerCase() === "noty_foot" ? ".noty_foot"
                        : container.toLowerCase() === "notykit_content" ? ".notykit_content"
                        : container.toLowerCase() === "notykit_container" ? ".notykit_container"
                        : container;

                    var layout = (typeof (item.layout) != "undefined" && item.layout !== "") ? item.layout : "centerleft";
                    var addClass = (typeof (item.addClass) != "undefined" && item.addClass !== "") ? item.addClass : "";
                    var text = (typeof (item.text) != "undefined" && item.text !== "") ? item.text : "";
                    var closeWith = (typeof (item.closeWith) != "undefined" && item.closeWith !== "") ?
                        ((getJqueryEventString(item.closeWith) !== '') ? getJqueryEventString(item.closeWith) : ""
                        ) : "";
                    if (container != "" && closeWith != "") {
                        var thisObj = obj.find(container);
                        if (container === ".notykit_container")
                            thisObj = obj;
                        if (!thisObj.is(".notykit_container")) {
                            thisObj.css({
                                "position": "relative"
                            });
                            setParentsStyle(thisObj, ".notykit_content");
                        }
                        if (text != "") {
                            var closeTextObj = $("<div class='close" + notykit.id + "'>" + text + "</div>");
                            if (addClass != "") {
                                closeTextObj.addClass(addClass);
                            }
                            closeTextObj.css({
                                "position": "absolute"
                                , "z-index": getmaxZindex() + 1
                            });

                            thisObj.append(closeTextObj);

                            NotyKitObj.resize_close(thisObj, layout, closeTextObj);

                            $(window).on("resize", function () {
                                NotyKitObj.resize_close(thisObj, layout, closeTextObj);
                            });

                            closeTextObj.off(closeWith);
                            closeTextObj.on(closeWith, function () {
                                NotyKitObj.close(notykit);
                            });
                        }
                        else {
                            thisObj.off(closeWith);
                            thisObj.on(closeWith, function () {
                                NotyKitObj.close(notykit);
                            });
                        }
                    }
                });
                closeObj = obj.find(".close" + notykit.id);
            }
            return closeObj;
        },
        addBtnEvent: function (notykit) {
            var obj = $("#" + notykit.id);
            var buttonsItem = notykit.buttons;
            $(".btn" + notykit.id).remove();
            var btnObj = null;
            if (obj.length > 0) {
                $.each(buttonsItem, function (index, item) {
                    var container = (typeof (item.container) != "undefined" && item.container !== "") ? item.container : "";
                    container = container.toLowerCase() === "noty_border" ? ".noty_foot"
                        : container.toLowerCase() === "noty_title" ? ".noty_foot"
                        : container.toLowerCase() === "noty_text" ? ".noty_foot"
                        : container.toLowerCase() === "noty_foot" ? ".noty_foot"
                        : container.toLowerCase() === "notykit_content" ? ".noty_foot"
                        : container;//模版自定义容器

                    var addClass = (typeof (item.addClass) != "undefined" && item.addClass !== "") ? item.addClass : "";
                    var text = (typeof (item.text) != "undefined" && item.text !== "") ? item.text : "";
                    var btnWith = (typeof (item.btnWith) != "undefined" && item.btnWith !== "") ?
                        ((getJqueryEventString(item.btnWith) !== '') ? getJqueryEventString(item.btnWith) : "click"
                        ) : "click";
                    var btnCallback = (typeof (item.callback) === "function") ? item.callback : "";

                    if (container != "" && text != "") {
                        var thisObj = obj.find(container);
                        if (!thisObj.is(".notykit_container")) {
                            thisObj.css({
                                "position": "relative"
                            });
                            setParentsStyle(thisObj, ".notykit_content");
                        }
                        if (thisObj.length > 0) {
                            var btnObj = $("<span class='btn" + notykit.id + "'>" + text + "</span>");
                            if (addClass != "") {
                                btnObj.addClass(addClass);
                            }
                            thisObj.append(btnObj);
                            btnObj.off(btnWith);
                            btnObj.on(btnWith, function () {
                                btnCallback(notykit);
                            });
                        }
                    }
                });
                btnObj = obj.find(".btn" + notykit.id);
            }
            return btnObj;
        },
        resize_close: function (appendObj, layout, closeObj) {
            var thisPosition = getObjPosition(appendObj, layout, closeObj.outerWidth(), closeObj.outerHeight());
            var _top = thisPosition.top;
            var _left = thisPosition.left;

            _top = (_top < 0 && (_top + appendObj.offset().top) < 0) ? -appendObj.offset().top : _top;
            _left = (_left < 0 && (_left + appendObj.offset().left) < 0) ? -appendObj.offset().left : _left;
            closeObj.css({
                "top": _top + "px"
                , "left": _left + "px"
            });
        },
        resize_noty: function (options) {
            if (options != null) {
                var _id = options.id;
                var obj = options.obj;

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
                        ((($(window).width() > obj.outerWidth() ? $(window).width() : obj.outerWidth()) > options.width)
                            ? ($(window).width() > obj.outerWidth() ? $(window).width() : obj.outerWidth())
                            : (options.width))
                        : (obj.outerWidth() > options.width ? obj.outerWidth() : options.width);

                    var _height = obj.is($('body')) ?
                        ((($(window).height() > obj.outerHeight() ? $(window).height() : obj.outerHeight()) > options.height)
                            ? ($(window).height() > obj.outerHeight() ? $(window).height() : obj.outerHeight())
                            : (options.height))
                        : (obj.outerHeight() > options.height ? obj.outerHeight() : options.height);

                    obj.find("#" + _id).css({
                        width: _width + "px"
                        , height: _height + "px"
                        , top: obj.offset().top + "px"
                        , left: obj.offset().left + "px"
                    });
                }

                var _top = 0;
                var _left = 0;
                if (!obj.is($('body'))) {
                    var thisPosition = getObjPosition(obj, options.layout, options.width, options.height);
                    _top = thisPosition.top;
                    _left = thisPosition.left;

                    _top = (_top < 0 && (_top + obj.offset().top) < 0) ? -obj.offset().top : _top;
                    _left = (_left < 0 && (_left + obj.offset().left) < 0) ? -obj.offset().left : _left;
                }
                else {
                    var thisPosition = getObjPosition(obj.find("#" + _id), options.layout, options.width, options.height);
                    _top = thisPosition.top;
                    _left = thisPosition.left;

                    _top = _top < 0 ? 0 : _top;
                    _left = _left < 0 ? 0 : _left;
                }

                $("#" + _id + " .notykit_content").css({
                    "top": _top + "px"
                    , "left": _left + "px"
                });
            }
        },
        close: function (notykit) {
            var id = notykit.id;
            var obj = $("#" + notykit.id);
            var callbackObj = (typeof notykit.callback === "object" && notykit.callback != null) ? notykit.callback : null;
            var onCloseFn = (typeof callbackObj.onClose === "function") ? callbackObj.onClose : function () {

            };

            var afterCloseFn = (typeof callbackObj.afterClose === "function") ? callbackObj.afterClose : function () {

            };

            if (typeof onCloseFn === "function") {
                onCloseFn(notykit);
            }

            if (obj.length > 0) {
                var hasNotykitObj = getArrJsonItem(notykitDate, "id", id);
                var hasNotykitIndex = hasNotykitObj.index;
                if (hasNotykitIndex != -1) {
                    notykitDate.splice(hasNotykitIndex, hasNotykitIndex + 1);
                    obj.remove();
                    if (typeof afterCloseFn === "function") {
                        afterCloseFn(notykit);
                    }
                }
            }
        },
        destroy: function (notykit) {
            var id = notykit.id;
            var obj = $("#" + notykit.id);
            if (obj.length > 0) {
                var hasNotykitObj = getArrJsonItem(notykitDate, "id", id);
                var hasNotykitIndex = hasNotykitObj.index;
                if (hasNotykitIndex != -1) {
                    notykitDate.splice(hasNotykitIndex, hasNotykitIndex + 1);
                    obj.remove();
                }
            }
        },
        destroyAll: function () {
            $.each(notykitDate, function (index, item) {
                NotyKitObj.destroy(item.notykit);
            });
        }
    }

    exports.Create = function (options) {
        return new init(options);
    };

    exports.Destroy = function () {
        Object.create(NotyKitObj).destroyAll();
    };

}));