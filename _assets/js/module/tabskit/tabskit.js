/**
 * Created by zhangzongshan on 16/5/29.
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
        }, window['TabsKit'] = {}, {});
    }
}(function (require, exports, module) {
    var TabsKit = typeof exports !== 'undefined' ? exports : {};

    var tabsKitDate = [];

    if (typeof Object.create !== 'function') {
        Object.create = function (o) {
            function F() {
            }

            F.prototype = o;
            return new F();
        };
    }

    function getArrJsonItem(obj, key, value) {
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

    function removeArrJsonItem(obj, key, value, newsItem) {
        var k = (typeof (key) == "string" && key != "") ? key : null;
        var v = (typeof (value) != "undefined") ? value : null;
        var itemObj = (typeof (newsItem) != "undefined") ? newsItem : null;
        if (typeof (obj) == "object" && obj != null && k != null) {
            for (var item in obj) {
                if (typeof (obj[item]) === 'object' && obj[item] != null) {
                    if (v != null) {
                        if (obj[item][k] === v || (typeof (v) === "object" && obj[item][k].is(v))) {
                            if (itemObj != null) {
                                obj.splice(obj.indexOf(item), 1, itemObj);
                            }
                            else {
                                obj.splice(obj.indexOf(item), 1);
                            }
                            break;
                        }
                    }
                    else {
                        if (obj[item].hasOwnProperty(k)) {
                            if (itemObj != null) {
                                obj.splice(obj.indexOf(item), 1, itemObj);
                            }
                            else {
                                obj.splice(obj.indexOf(item), 1);
                            }
                            break;
                        }
                    }
                }
            }
        }
        return obj;
    }

    function addArrJosnItem(obj, key, value, newsItem) {
        var k = (typeof (key) == "string" && key != "") ? key : null;
        var v = (typeof (value) != "undefined") ? value : null;
        var itemObj = (typeof (newsItem) != "undefined") ? newsItem : null;
        if (typeof (obj) == "object" && obj != null && k != null) {
            for (var item in obj) {
                if (typeof (obj[item]) === 'object' && obj[item] != null) {
                    if (v != null) {
                        if (obj[item][k] === v || (typeof (v) === "object" && obj[item][k].is(v))) {
                            if (itemObj != null) {
                                obj.splice(obj.indexOf(item), 0, itemObj);
                            }
                            break;
                        }
                    }
                    else {
                        if (obj[item].hasOwnProperty(k)) {
                            if (itemObj != null) {
                                obj.splice(obj.indexOf(item), 0, itemObj);
                            }
                            break;
                        }
                    }
                }
            }
        }
        return obj;
    }

    function isArray(obj) {
        return Object.prototype.toString.call(obj) === '[object Array]';
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

    function getstorage(key) {
        var storage = window.localStorage;
        if (storage) {
            return storage.getItem(key) == "undefined" ? null : storage.getItem(key);
        }
        return null;
    }

    function writestorage(key, value) {
        var storage = window.localStorage;
        if (storage) {
            try {
                storage.setItem(key, value);
            } catch (oException) {
                if (oException.name == 'QuotaExceededError') {
                    console.log('超出本地存储限额！');
                    //如果历史信息不重要了，可清空后再设置
                    clearstorage();
                    storage.setItem(key, value);
                }
            }
            return true;
        }
        return false;
    }

    function delstorage(key) {
        var storage = window.localStorage;
        if (storage) {
            storage.removeItem(key);
            return true;
        }
        return false;
    }

    function clearstorage() {
        var storage = window.localStorage;
        if (storage) {
            storage.clear();
            return true;
        }
        return false;
    }

    function getDataStorge(id) {
        var tempDataStorge = null;
        if (tabsKitDate.length > 0) {
            tempDataStorge = tabsKitDate;
        }
        else {
            tempDataStorge = getstorage('_data_storge_system-TabsKit');
            if (tempDataStorge !== null) {
                tempDataStorge = JSON.parse(tempDataStorge);
            }
        }

        if (tempDataStorge != null) {
            tabsKitDate = tempDataStorge;
            tempDataStorge = null;
        }
        tabsKitDate = tabsStorgeRestore(tabsKitDate);
        var getDataByIDObj = getArrJsonItem(tabsKitDate, 'id', id);
        if (getDataByIDObj.index != -1) {
            return getDataByIDObj.item;
        }

        return null;
    }

    function writeDataStorge(id, data) {
        if (id !== '') {
            var getDataByIDObj = getArrJsonItem(tabsKitDate, 'id', id);
            if (getDataByIDObj.index != -1) {
                if (data != null) {
                    tabsKitDate = removeArrJsonItem(tabsKitDate, 'id', id, data);
                }
                else {
                    tabsKitDate = removeArrJsonItem(tabsKitDate, 'id', id);
                }
            }
            var tempDataStorge = [];
            $.each(tabsKitDate, function (index, item) {
                if (item.initIdFlg) {
                    tempDataStorge.push(item);
                }
            });
            if (tempDataStorge.length > 0) {
                tempDataStorge = tabsFnToString(tempDataStorge);
                writestorage('_data_storge_system-TabsKit', JSON.stringify(tempDataStorge));
            }
            else {
                delstorage('_data_storge_system-TabsKit');
            }
        }
    }

    function tabsStorgeRestore(data) {
        var newData = [];
        $.each(data, function (index, item) {
            item.config.obj = $(item.config.obj.selector);
            item.config.container = $(item.config.container.selector);
            item = tabsFnToFun(item);
            newData.push(item);
        })
        return newData
    }

    function tabsFnToString(data) {
        var newData = [];
        $.each(data, function (index, item) {
            newData.push(fnToString(item));
        });
        return newData;
    }

    //将 函数转化为字符串以便于储存,
    function fnToString(obj) {
        if (typeof (obj) == "object" && obj != null && obj != document) {//必须过滤掉document,否则引起无限自循环
            for (var i = 0; i < Object.keys(obj).length; i++) {
                var thiskey = Object.keys(obj)[i];
                if (typeof (obj[Object.keys(obj)[i]]) == "object") {
                    obj[Object.keys(obj)[i]] = fnToString(obj[Object.keys(obj)[i]]);
                }
                else {
                    if (typeof (obj[Object.keys(obj)[i]]) === 'function' && (Object.keys(obj)[i]) === 'fn') {
                        obj[Object.keys(obj)[i]] = (obj[Object.keys(obj)[i]]).toString();
                    }
                }
            }
        }
        return obj;
    }

    function tabsFnToFun(obj) {
        if (typeof (obj) == "object" && obj != null && obj != document) {
            for (var i = 0; i < Object.keys(obj).length; i++) {
                var thiskey = Object.keys(obj)[i];
                if (typeof (obj[Object.keys(obj)[i]]) == "object" && Object.keys(obj)[i] !== '__proto__') {
                    obj[Object.keys(obj)[i]] = tabsFnToFun(obj[Object.keys(obj)[i]]);
                }
                else {
                    if (typeof (obj[Object.keys(obj)[i]]) === 'string' && (Object.keys(obj)[i]) === 'fn') {
                        obj[Object.keys(obj)[i]] = (new Function("return " + obj[Object.keys(obj)[i]]))();//由于 eval()不支持匿名函数,所以用此方法恢复字符串函数
                    }
                }
            }
        }
        return obj;
    }

    var tabsObj = {
        default: {
            id: "tabs_" + (new Date().getTime() * Math.floor(Math.random() * 1000000))
            , obj: $('body')
            , autowidth: true
            , tabs: [{
                id: ''
                , normal: ''
                , active: ''
                , html: ''
                , fn: function () {

                }
                , content: ''
            }]
            , btnWith: ['click']
            , showtabs: ''
            , direct: 'Landscape'//Portrait纵向
            , storge: false
            , container: null
        },
        build: function (option) {
            var thisObj = this.creat(option);

            return {
                tabsObj: thisObj
                , config: option
                , SetTabs: function (tabsId, thisTabsObj) {
                    var thisTabsConfig = this.config;
                    var thisTabs = getArrJsonItem(thisTabsConfig.config.tabs, 'id', tabsId).item;
                    var changflg = false;
                    var activeID = this.tabsObj.find('._tabs_active').attr('id').replace('tabsLi', '');
                    var setTabsObj = this.tabsObj.find('#tabsLi' + tabsId);
                    if (activeID === tabsId) {
                        changflg = true;
                    }
                    if (thisTabs != null) {
                        thisTabsObj = (typeof thisTabsObj === 'object' && thisTabsObj != null) ? thisTabsObj : null;
                        if (thisTabsObj != null) {
                            var _normal = thisTabs.normal;
                            var _active = thisTabs.active;

                            var normal = (typeof thisTabsObj.normal === 'string' && thisTabsObj.normal !== '') ? thisTabsObj.normal : null;
                            var active = (typeof thisTabsObj.active === 'string' && thisTabsObj.active !== '') ? thisTabsObj.active : null;
                            var html = (typeof thisTabsObj.html === 'string') ? thisTabsObj.html : null;
                            var fn = (typeof thisTabsObj.fn === 'function') ? thisTabsObj.fn : null;
                            var content = (typeof thisTabsObj.content === 'string') ? thisTabsObj.content : null;

                            if (normal !== null) {
                                thisTabs.normal = normal;
                                if (!changflg) {
                                    setTabsObj.removeClass(_normal).addClass(normal);
                                }
                            }
                            if (active !== null) {
                                thisTabs.active = active;
                                if (!changflg) {
                                    setTabsObj.removeClass(_active).addClass(active);
                                }
                            }
                            if (html !== null) {
                                thisTabs.html = html;
                                setTabsObj.html(html);
                            }
                            if (fn !== null) {
                                thisTabs.fn = fn;
                                if (changflg) {
                                    if (typeof fn === 'function') {
                                        fn();
                                    }
                                }
                            }
                            if (content !== null) {
                                thisTabs.content = content;
                                if (changflg) {
                                    thisTabsConfig.config.container.html(content);
                                }
                            }
                            writeDataStorge(this.config.id, this.config);
                        }
                    }
                }
                , AddTabs: function (tabsId, thisTabsObj) {
                    var thisTabsConfig = this.config;
                    var index = getArrJsonItem(thisTabsConfig.config.tabs, 'id', tabsId).index;
                    if (index > -1) {
                        thisTabsObj = (typeof thisTabsObj === 'object' && thisTabsObj != null) ? thisTabsObj : null;
                        if (thisTabsObj != null) {
                            var id = (typeof thisTabsObj.id === 'string' && thisTabsObj.id !== '') ? thisTabsObj.id : thisTabsConfig.config.tabs.length + 1;
                            var normal = (typeof thisTabsObj.normal === 'string' && thisTabsObj.normal !== '') ? thisTabsObj.normal : '';
                            var active = (typeof thisTabsObj.active === 'string' && thisTabsObj.active !== '') ? thisTabsObj.active : '';
                            var html = (typeof thisTabsObj.html === 'string') ? thisTabsObj.html : '';
                            var fn = (typeof thisTabsObj.fn === 'function') ? thisTabsObj.fn : '';
                            var content = (typeof thisTabsObj.content === 'string') ? thisTabsObj.content : '';

                            if (this.tabsObj.find('#tabsLi' + id).length === 0) {
                                thisTabsConfig.config.tabs = addArrJosnItem(thisTabsConfig.config.tabs, 'id', tabsId, {
                                    id: id
                                    , normal: normal
                                    , active: active
                                    , html: html
                                    , fn: fn
                                    , content: content
                                });
                                this.tabsObj = tabsObj.creat(this.config, this.tabsObj);
                                writeDataStorge(this.config.id, this.config);
                            }
                        }
                    }


                }
                , RemoveTabs: function (tabsId) {
                    var thisTabsConfig = this.config;
                    var index = getArrJsonItem(thisTabsConfig.config.tabs, 'id', tabsId).index;
                    if (index > -1) {
                        this.config.config.tabs = removeArrJsonItem(thisTabsConfig.config.tabs, 'id', tabsId);
                        this.tabsObj = tabsObj.creat(this.config, this.tabsObj);
                        writeDataStorge(this.config.id, this.config);
                    }
                }
                , Remove: function () {
                    this.tabsObj.remove();
                    writeDataStorge(this.config.id, null);
                    this.tabsObj = null;
                    this.config = null;
                }
            }

        },

        creat: function (option, thisTabsObj) {
            thisTabsObj = (typeof thisTabsObj === 'object' && thisTabsObj != null) ? thisTabsObj : null;
            if (thisTabsObj != null) {
                thisTabsObj.remove();
            }
            var tapHtml = $("<div></div>");
            var _obj = (typeof option.config.obj === 'object' && option.config.obj != null) ? option.config.obj : $('body');
            var _tabs = (isArray(option.config.tabs) && option.config.tabs.length > 0) ? option.config.tabs : [];
            var _direct = option.config.direct.toLowerCase();
            var _showtabs = (typeof option.config.showtabs === 'string' && option.config.showtabs != '') ? option.config.showtabs : '';
            var _autowidth = (typeof option.config.autowidth === 'boolean') ? option.config.autowidth : false;
            var _btnWith = (isArray(option.config.btnWith) && option.config.btnWith.length > 0) ?
                ((getJqueryEventString(option.config.btnWith) !== '') ? getJqueryEventString(option.config.btnWith) : ""
                ) : "";
            var _container = (typeof option.config.container === 'object' && option.config.container != null) ? option.config.container : null;

            var hasActiveFlg = false;

            var firstNormal = null;
            var firstActive = null;
            var firstFun = null;

            var runFun = null;

            $.each(_tabs, function (index, item) {
                var id = (typeof item.id === 'string' && item.id != '') ? item.id : index;
                var normalClass = (typeof item.normal === 'string' && item.normal != '') ? item.normal : '';
                var activeClass = (typeof item.active === 'string' && item.active != '') ? item.active : '';
                var html = item.html != null ? item.html : '';
                var fn = (typeof item.fn === 'function' && item.fn != null) ? item.fn : null;
                var content = item.content != null ? item.content : '';

                var _directHtml = _direct === 'landscape' ? 'style="display:inline-block;"' : 'style="display:block;"';

                var tabsItemHtml = $('<div ' + _directHtml + ' id="tabsLi' + id + '">' + html + '</div>');

                if (index === 0) {
                    firstNormal = normalClass;
                    firstActive = activeClass;
                    firstFun = fn;
                }

                if (normalClass !== '') {
                    tabsItemHtml.addClass(normalClass).addClass('_tabs_normal');
                }

                if (_showtabs === id && activeClass !== '' && !hasActiveFlg) {
                    tabsItemHtml.removeClass(normalClass).removeClass('_tabs_normal').addClass(activeClass).addClass('_tabs_active');
                    hasActiveFlg = true;
                    if (_container !== null && content !== '') {
                        _container.html(content);
                    }
                    if (fn !== null) {
                        runFun = fn;
                    }
                }

                tabsItemHtml.off(_btnWith);
                tabsItemHtml.on(_btnWith, function () {
                    var tabsId = $(this).attr('id');
                    tabsObj.setTabsEvent(option.id, tabsId);
                });

                tapHtml.append(tabsItemHtml);

            });
            _obj.append(tapHtml.attr('id', option.id));

            if (!hasActiveFlg) {
                var firstTabs = _obj.find('#' + option.id).find('._tabs_normal:first');
                if (firstNormal != '') {
                    firstTabs.removeClass(firstNormal);
                }
                if (firstActive != '') {
                    firstTabs.addClass(firstActive);
                }
                firstTabs.addClass('_tabs_active');

                runFun = firstFun;
            }

            if (_autowidth) {
                if (_direct === 'landscape') {
                    var hasWidth = 0;
                    $.each(_obj.find('#' + option.id + ' > div'), function (index, item) {
                        hasWidth += $(this).outerWidth(true);
                    });
                    var addWidth = (_obj.width() - hasWidth) / _tabs.length;
                    $.each(_obj.find('#' + option.id + ' > div'), function (index, item) {
                        var box_sizing = $(this).css('box-sizing');
                        if (box_sizing === 'border-box') {
                            $(this).css({
                                'width': ($(this).outerWidth() + addWidth) + 'px'
                            });
                        }
                        else {
                            $(this).css({
                                'width': ($(this).width() + addWidth) + 'px'
                            });
                        }
                    });
                }
                else {
                    $.each(_obj.find('#' + option.id + ' > div'), function (index, item) {
                        $(this).css({
                            'width': '100%'
                        });
                    });
                }
            }

            if (runFun != null) {
                runFun();
            }

            return _obj.find('#' + option.id);
        },

        setTabsEvent: function (id, tabsId) {
            tabsKitDate = tabsStorgeRestore(tabsKitDate);
            var thisTabs = getArrJsonItem(tabsKitDate, 'id', id).item;
            var thisTabsId = tabsId.replace('tabsLi', '');
            var runFun = null;
            if (thisTabs != null) {
                var _obj = (typeof thisTabs.config.obj === 'object' && thisTabs.config.obj != null) ? thisTabs.config.obj : $('body');
                var _tabs = (isArray(thisTabs.config.tabs) && thisTabs.config.tabs.length > 0) ? thisTabs.config.tabs : [];
                var _container = (typeof thisTabs.config.container === 'object' && thisTabs.config.container != null) ? thisTabs.config.container : null;
                var _storge = (typeof thisTabs.config.storge === 'boolean') ? thisTabs.config.storge : false;

                var tabsContainer = _obj.find('#' + thisTabs.id);
                $.each(_tabs, function (index, item) {
                    var id = (typeof item.id === 'string' && item.id != '') ? item.id : index;
                    var normalClass = (typeof item.normal === 'string' && item.normal != '') ? item.normal : '';
                    var activeClass = (typeof item.active === 'string' && item.active != '') ? item.active : '';
                    var fn = (typeof item.fn === 'function' && item.fn != null) ? item.fn : null;
                    var content = item.content != null ? item.content : '';

                    if (thisTabsId === id) {
                        tabsContainer.find('#tabsLi' + id).removeClass(normalClass).removeClass('_tabs_normal').addClass(activeClass).addClass('_tabs_active');
                        if (_container !== null && content !== '') {
                            _container.html(content);
                        }
                        if (fn !== null) {
                            runFun = fn;
                        }
                    }
                    else {
                        tabsContainer.find('#tabsLi' + id).removeClass(activeClass).removeClass('_tabs_active').addClass(normalClass).addClass('_tabs_normal');
                    }
                });
                if (runFun != null) {
                    runFun();
                }
                if (_storge) {
                    thisTabs.config.showtabs = thisTabsId;
                    writeDataStorge(id, thisTabs);
                }
            }
        }
    }

    function init(config) {
        clearstorage();
        var _config = tabsObj.default;
        config = (typeof (config) == "object" && config != null) ? config : _config;
        var initIdFlg = (typeof config.id === 'string' && config.id !== '') ? true : false;
        var _id = (typeof config.id === 'string') ? config.id : _config.id;
        var thisConfig = null;
        var oldtabsObj = getDataStorge(_id);
        if (oldtabsObj === null) {
            var _obj = (typeof config.obj === 'object' && config.obj != null) ? config.obj : _config.obj;
            var _autowidth = (typeof config.autowidth === 'boolean') ? config.autowidth : _config.autowidth;
            var _tabs = (typeof config.tabs === 'object' && config.tabs != null) ? config.tabs : _config.tabs;
            var _showtabs = (typeof config.showtabs === 'string') ? config.showtabs : _config.showtabs;
            var _direct = (typeof config.direct === 'string' && (config.direct.toLowerCase() === 'landscape' || config.direct.toLowerCase() === 'portrait')) ? config.direct : _config.direct;
            var _btnWith = (isArray(config.btnWith) && config.btnWith.length > 0) ? config.btnWith : _config.btnWith;
            var _storge = (typeof config.storge === 'boolean') ? config.storge : _config.storge;
            var _container = (typeof config.container === 'object' && config.container != null) ? config.container : _config.container;
            var thisConfig = {
                id: _id
                , initIdFlg: initIdFlg
                , config: {
                    obj: _obj
                    , autowidth: _autowidth
                    , tabs: _tabs
                    , showtabs: _showtabs
                    , direct: _direct
                    , btnWith: _btnWith
                    , storge: _storge
                    , container: _container
                }
            }
            tabsKitDate.push(thisConfig);
            if (_storge && initIdFlg) {
                writeDataStorge(_id, thisConfig);
            }
        }
        else {
            thisConfig = oldtabsObj;
        }
        return Object.create(tabsObj).build(thisConfig);
    }

    exports.Create = function (config) {
        return init(config);
    }
}));