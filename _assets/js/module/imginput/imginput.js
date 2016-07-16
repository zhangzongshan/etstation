/**
 * Created by zhangzongshan on 16/7/10.
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
        }, window['ImgInput'] = {}, {});
    }
}(function (require, exports, module) {
    var ImgInput = typeof exports !== 'undefined' ? exports : {};

    function imgContainer(oConfig) {
        var imgContainerObj = $('<div class="__inputImgContainerClass"></div>');
        if (oConfig._class != "") {
            imgContainerObj.addClass(oConfig._class);
        }
        imgContainerObj.css({
            "position": "relative"
            ,
            "float": "left"
            ,
            "margin": oConfig._margin_top + "px " + oConfig._margin_right + "px " + oConfig._margin_bottom + "px " + oConfig._margin_left + "px"
            ,
            "height": oConfig._height + "px"
            ,
            "line-height": oConfig._height + "px"
            ,
            "width": oConfig._containerObj.width() / oConfig._count - (oConfig._margin_left + oConfig._margin_right) + "px"
            ,
            "background-size": "contain"
            ,
            "background-repeat": "no-repeat"
            ,
            "background-position": "center center"
        });
        return imgContainerObj;
    }

    function inputText(oConfig) {
        return $('<input type="hidden" class="__inputTextClass" name="' + oConfig._name + '"/>');
    }

    function inputFile(oConfig) {
        var inputFileObj = $('<input type="file" class="__inputFileClass" name="' + oConfig._name + '" accept="' + oConfig._accept + '" multiple="multiple"/>');
        inputFileObj.css({
            "position": "absolute"
            , "width": "100%"
            , "height": "100%"
            , "opacity": "0"
            , "top": "0px"
            , "left": "0px"
            , "z-index": 10
            , "cursor": "pointer"
        });

        inputFileObj.change(function () {
            var file = this.files[0];
            // var fileSize = file.size;
            // var fileName = file.name;
            // var fileType = file.type;

            var objUrl = createObjectURL(file);
            if (objUrl != null) {
                var thisImgContainerObj = $(this).closest(".__inputImgContainerClass");
                thisImgContainerObj.find('input:hidden').val("");
                if (thisImgContainerObj.find('.__addItemClass').length > 0) {
                    thisImgContainerObj.find('.__addItemClass').remove();

                    var currentTotal = oConfig._containerObj.find(".__inputImgContainerClass").length;
                    if (oConfig._total === -1 || currentTotal < oConfig._total) {
                        var additemObj = imgAdditem(oConfig);
                        var imgContainerObj = imgContainer(oConfig);
                        var inputFileObj = inputFile(oConfig);
                        var inputTextObj = inputText(oConfig);

                        imgContainerObj.append(additemObj);
                        imgContainerObj.append(inputFileObj);
                        imgContainerObj.append(inputTextObj);
                        thisImgContainerObj.after(imgContainerObj);
                    }
                }
                thisImgContainerObj.css({
                    "background-image": "url(" + objUrl + ")"
                });
                var imgInfoObj = imgInfo(oConfig, thisImgContainerObj);
                thisImgContainerObj.append(imgInfoObj);
            }
        });

        return inputFileObj;
    }

    function imgAdditem(oConfig) {
        var additemObj = $('<div class="__addItemClass"></div>');
        additemObj.css({
            "position": "absolute"
            , "width": "100%"
            , "height": "100%"
            , "z-index": 5
        });
        if (oConfig._addItem_text != "") {
            additemObj.append($(oConfig._addItem_text));
        }
        if (oConfig._addItem_class != "") {
            additemObj.addClass(oConfig._addItem_class);
        }
        return additemObj;
    }

    function imgInfo(oConfig, currentObj) {
        var imgInfoObj = $(oConfig._infoItem_text);
        if (oConfig._infoItem_class != "") {
            imgInfoObj.addClass(oConfig._infoItem_class);
        }
        imgInfoObj.addClass('__imgInfoClass');
        imgInfoObj.css({
            "position": "absolute"
            , "z-index": 10
        });
        if (isArray(oConfig._infoItem_item)) {
            $.each(oConfig._infoItem_item, function (index, item) {
                var text = (typeof item.text === "string" && item.text !== "") ? item.text : "";
                var item_class = (typeof item.class === "string" && item.class !== "") ? item.class : "";
                var callback = (typeof item.callback === "function") ? item.callback : null;

                if (text !== "") {
                    var itemObj = $(text);
                    if (item_class !== "") {
                        itemObj.addClass(item_class);
                    }
                    itemObj.off("click");
                    if (callback != null) {
                        itemObj.on("click", function () {
                            callback(currentObj);
                        });
                    }
                    imgInfoObj.append(itemObj);
                }
            });
        }
        return imgInfoObj;
    }

    function clear() {
        return $('<div style="clear: both;width: 0px;height: 0px;"></div>');
    }

    function isArray() {
        return $('<div style="clear: both;width: 0px;height: 0px;"></div>');
    }

    function createObjectURL(blob) {
        if (blob) {
            return window[window.webkitURL ? 'webkitURL' : 'URL']['createObjectURL'](blob);
            resolveObjectURL(blob);
        }
        return null;
    }

    function resolveObjectURL(blob) {
        window[window.webkitURL ? 'webkitURL' : 'URL']['revokeObjectURL'](blob);
    }

    var ImgObj = {
        default: {
            obj: $('body')
            , rootpath: ''//图片根路径
            , count: 4//每行放置显示数量
            , margin: {
                top: 5
                , right: 5
                , bottom: 5
                , left: 5
            }
            , class: ""
            , name: "imgInput"//input 输入框 name标志,非常重要
            , accept: "image/*"//添加类别限制,默认为所有图片
            , height: 70//高度
            , total: -1//图片总数限制,-1不限制
            //添加图片内容信息
            , addItem: {
                text: "<span class='icon-plus'></span>"
                , class: ""
            }
            //图片操作信息显示
            , infoItem: {
                text: '<div></div>'
                , class: ''
                , item: [{
                    text: "<span class='icon-home'></span>"
                    , class: ""
                    , callback: function (imgObj) {

                    }
                }, {
                    text: "<span class='icon-trash'></span>"
                    , class: ""
                    , callback: function (imgObj) {

                    }
                }]
            },
            callback: function () {

            }
        },
        init: function (data, config) {
            config = (typeof config === 'object' && config != null) ? config : this.default;
            var _id = "imgInput_" + (new Date().getTime() * Math.floor(Math.random() * 1000000));
            var _rootpath = (typeof config.rootpath === 'string' && config.rootpath != "") ? config.rootpath : this.default.rootpath;
            var _containerObj = (typeof config.obj === 'object' && config.obj != null) ? config.obj : this.default.obj;
            var _count = (typeof config.count === 'number' && config.count > 0) ? config.count : this.default.count;
            var _margin = (typeof config.margin === 'object' && config.margin != null) ? config.margin : this.default.margin;
            var _class = (typeof config.class === 'string' && config.class != "") ? config.class : this.default.class;
            var _name = (typeof config.name === 'string' && config.name != "") ? config.name : this.default.name;
            var _accept = (typeof config.accept === 'string' && config.accept != "") ? config.accept : this.default.accept;
            var _height = (typeof config.height === 'number' && config.height > 0) ? config.height : this.default.height;
            var _margin_top = (typeof _margin.top === 'number' && _margin.top > 0) ? _margin.top : this.margin.top;
            var _margin_right = (typeof _margin.right === 'number' && _margin.right > 0) ? _margin.right : this.margin.right;
            var _margin_bottom = (typeof _margin.bottom === 'number' && _margin.bottom > 0) ? _margin.bottom : this.margin.bottom;
            var _margin_left = (typeof _margin.left === 'number' && _margin.left > 0) ? _margin.left : this.margin.left;
            var _total = (typeof config.total === 'number' && config.total > 0) ? config.total : this.default.total;
            var _addItem = (typeof config.addItem === 'object' && config.addItem != null) ? config.addItem : this.default.addItem;
            var _addItem_text = (_addItem.text != null && _addItem.text != "") ? _addItem.text : this.default.addItem.text;
            var _addItem_class = (_addItem.class != null && _addItem.class != "") ? _addItem.class : this.default.addItem.class;
            var _infoItem = (typeof config.infoItem === 'object' && config.infoItem != null) ? config.infoItem : this.default.infoItem;
            var _infoItem_text = (_infoItem.text != null && _infoItem.text != "") ? _infoItem.text : this.default.infoItem.text;
            var _infoItem_class = (_infoItem.class != null && _infoItem.class != "") ? _infoItem.class : this.default.infoItem.class;
            var _infoItem_item = (_infoItem.item != null && _infoItem.item != "") ? _infoItem.item : this.default.infoItem.item;
            var _callback = (typeof config.callback === 'function' && config.callback != null) ? config.callback : this.default.callback;

            var oConfig = {
                _id: _id
                , _rootpath: _rootpath
                , _containerObj: _containerObj
                , _count: _count
                , _class: _class
                , _name: _name
                , _accept: _accept
                , _height: _height
                , _margin_top: _margin_top
                , _margin_right: _margin_right
                , _margin_bottom: _margin_bottom
                , _margin_left: _margin_left
                , _total: _total
                , _addItem: _addItem
                , _addItem_text: _addItem_text
                , _addItem_class: _addItem_class
                , _infoItem_text: _infoItem_text
                , _infoItem_class: _infoItem_class
                , _infoItem_item: _infoItem_item
                , _callback: _callback
            };

            var imgContainerObj = imgContainer(oConfig);
            var inputFileObj = inputFile(oConfig);
            var inputTextObj = inputText(oConfig);
            var clearObj = clear();

            var imgDataArr = [];

            data = isArray(data) ? data : [];

            if (data.length > 0) {
                $.each(data, function (index, item) {
                    if (item != "") {
                        var imgpath = item;
                        var newImgContainerObj = imgContainer(oConfig);
                        var newInputFileObj = inputFile(oConfig);
                        var newInputTextObj = inputText(oConfig);
                        newInputTextObj.val(imgpath);

                        newImgContainerObj.css({
                            "background-image": "url(" + _rootpath + imgpath + ")"
                        });
                        var imgInfoObj = imgInfo(oConfig, newImgContainerObj);
                        newImgContainerObj.append(newInputFileObj);
                        newImgContainerObj.append(newInputTextObj);
                        newImgContainerObj.append(imgInfoObj);
                        oConfig._containerObj.append(newImgContainerObj);
                    }
                });
                if (oConfig._total === -1 || data.length < oConfig._total) {
                    var additemObj = imgAdditem(oConfig);
                    imgContainerObj.append(additemObj);
                    imgContainerObj.append(inputFileObj);
                    imgContainerObj.append(inputTextObj);
                    oConfig._containerObj.append(imgContainerObj);
                }
            } else {
                var additemObj = imgAdditem(oConfig);
                imgContainerObj.append(additemObj);
                imgContainerObj.append(inputFileObj);
                imgContainerObj.append(inputTextObj);
                oConfig._containerObj.append(imgContainerObj);
            }
            oConfig._containerObj.append(clearObj);

            if (_callback != null) {
                _callback();
            }

            return {
                oConfig: oConfig
                , obj: oConfig._containerObj
                , getdata: function () {
                    var thisData = [];
                    $.each(this.oConfig._containerObj.find(".__inputImgContainerClass"), function (index, item) {
                        var file = $(item).find(".__inputFileClass").val();
                        var text = $(item).find(".__inputTextClass").val();
                        if (file != "" || text != "") {
                            thisData.push({
                                file: file
                                , text: text
                            });
                        }
                    });
                    return thisData;
                }
                , redraw: function () {
                    var currentTotal = this.oConfig._containerObj.find(".__inputImgContainerClass").length;
                    var lastImgContainerObj = this.oConfig._containerObj.find(".__inputImgContainerClass").last();
                    var hasAdd = this.oConfig._containerObj.find(".__addItemClass").length > 0 ? true : false
                    if ((this.oConfig._total === -1 || currentTotal < this.oConfig._total) && !hasAdd) {
                        var additemObj = imgAdditem(this.oConfig);
                        var imgContainerObj = imgContainer(this.oConfig);
                        var inputFileObj = inputFile(this.oConfig);
                        var inputTextObj = inputText(this.oConfig);

                        imgContainerObj.append(additemObj);
                        imgContainerObj.append(inputFileObj);
                        imgContainerObj.append(inputTextObj);
                        if (lastImgContainerObj.length > 0) {
                            lastImgContainerObj.after(imgContainerObj);
                        }
                        else {
                            this.oConfig._containerObj.append(imgContainerObj);
                            this.oConfig._containerObj.append(clear());
                        }
                    }
                }
            }
        }
    }

    function create(data, config) {
        return ImgObj.init(data, config);
    }

    exports.Create = function (data, config) {
        return create(data, config);
    }

}));
