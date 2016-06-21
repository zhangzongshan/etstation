/**
 * Created by zhangzongshan on 16/5/24.
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
        }, window['DataLoad'] = {}, {});
    }
}(function (require, exports, module) {
    var DataLoad = typeof exports !== 'undefined' ? exports : {};
    var basil = new window.Basil();
    var dataStorge = [];
    var debug = false;

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
        if (dataStorge.length > 0) {
            tempDataStorge = dataStorge;
        }
        else {
            tempDataStorge = getstorage('_data_storge_system-DataLoad');
            if (tempDataStorge !== null) {
                tempDataStorge = JSON.parse(tempDataStorge);
            }
        }

        if (tempDataStorge != null) {
            dataStorge = tempDataStorge;
            tempDataStorge = null;
        }

        var getDataByIDObj = getArrJsonItem(dataStorge, 'id', id);
        if (getDataByIDObj.index != -1) {
            return getDataByIDObj.item.value;
        }

        return null;
    }

    function writeDataStorge(id, data) {
        if (id !== '') {
            var getDataByIDObj = getArrJsonItem(dataStorge, 'id', id);
            if (getDataByIDObj.index != -1) {
                dataStorge = removeArrJsonItem(dataStorge, 'id', id);
            }
            dataStorge.push({
                id: id
                , value: data
            });
            writestorage('_data_storge_system-DataLoad', JSON.stringify(dataStorge));
        }
    }

    function getfile(id, url, callback) {
        if (url != '') {
            var sessionkey = basil.get("sessionkey");
            if (url.indexOf("?") !== -1) {
                url += "&sessionkey=" + sessionkey
            }
            else {
                url += "?sessionkey=" + sessionkey
            }
            $.get(url, function (data) {
                _callback(callback, data);
                if (!debug) {
                    if (id != '') {
                        writeDataStorge(id, data);
                    }
                }
            });
        }
    }

    function postfile(id, url, parameters, callback, async, type, dataType) {
        if (url != '') {
            var sessionkey = basil.get("sessionkey");
            if (url.indexOf("?") !== -1) {
                url += "&sessionkey=" + sessionkey
            }
            else {
                url += "?sessionkey=" + sessionkey
            }
            var pars = "";
            parameters = (parameters == null || parameters == "") ? {} : parameters;
            $.each(Object.keys(parameters), function (index, item) {
                if (parameters[item] != null) {

                    var _value = "";
                    if (typeof(parameters[item]) == "object") {
                        _value = JSON.stringify(parameters[item]);
                    }
                    else {
                        _value = parameters[item];
                    }
                    _value = encodeURIComponent(_value);

                    if (index < Object.keys(parameters).length - 1) {
                        pars += item + "=" + _value + "&";
                    }
                    else {
                        pars += item + "=" + _value;
                    }
                }
            });

            dataType = dataType.toLowerCase() === 'json' ? 'json'
                : dataType.toLowerCase() === 'jsonp' ? 'jsonp'
                : dataType.toLowerCase() === 'xml' ? 'xml'
                : dataType.toLowerCase() === 'html' ? 'html'
                : dataType.toLowerCase() === 'script' ? 'script'
                : 'json';

            type = type.toLowerCase() === 'post' ? 'POST'
                : type.toLowerCase() === 'get' ? 'GET'
                : type.toLowerCase() === 'put' ? 'PUT'
                : type.toLowerCase() === 'delete' ? 'DELETE'
                : 'POST';
            pars = $.param(parameters, true);
            $.ajax({
                url: url
                , type: type
                , cache: false
                , data: pars
                , async: async
                , dataType: dataType
                , success: function (result, status, xhr) {
                    _callback(callback, result);
                    if (!debug) {
                        if (id != '') {
                            writeDataStorge(id, result);
                        }
                    }
                }
                , error: function (xhr, status, error) {
                    _callback(callback, error);
                    console.log(error);
                }
            });
        }
    }

    function _callback(callback, result) {
        if (typeof callback === 'function' && callback != null) {
            callback(result);
        }
    }

    exports.Clear = function () {
        dataStorge = [];
        delstorage('_data_storge_system-DataLoad');
    }

    exports.RemoveStorge = function (id) {
        id = (typeof id === 'string' && id != '' && id != 'null') ? id : '';
        if (id !== '') {
            var tempDataStorge = null;
            if (dataStorge.length > 0) {
                tempDataStorge = dataStorge;
            }
            else {
                tempDataStorge = getstorage('_data_storge_system-DataLoad');
                if (tempDataStorge !== null) {
                    tempDataStorge = JSON.parse(tempDataStorge);
                }
            }

            if (tempDataStorge != null) {
                dataStorge = tempDataStorge;
                tempDataStorge = null;
            }

            var getDataByIDObj = getArrJsonItem(dataStorge, 'id', id);
            if (getDataByIDObj.index != -1) {
                dataStorge = removeArrJsonItem(dataStorge, 'id', id);
                if (dataStorge === null) {
                    dataStorge = [];
                }
            }
            if (dataStorge.length > 0) {
                writestorage('_data_storge_system-DataLoad', JSON.stringify(dataStorge));
            }
            else {
                delstorage('_data_storge_system-DataLoad');
            }
        }
    }

    exports.GetFile = function (id, url, callback) {
        id = (typeof id === 'string' && id != '' && id != 'null') ? id : '';
        url = (typeof url === 'string' && url != '' && url != 'null') ? url : '';
        callback = (typeof callback === 'function' && callback != null) ? callback : null;
        if (!debug) {
            if (id != '') {
                var dataObj = getDataStorge(id);
                if (dataObj != null) {
                    _callback(callback, dataObj);
                }
                else {
                    getfile(id, url, callback);
                }
            }
            else {
                getfile(id, url, callback);
            }
        } else {
            getfile(id, url, callback);
        }
    }

    exports.GetData = function (id, url, parameters, callback, async, type, dataType) {
        id = (typeof id === 'string' && id != '' && id != 'null') ? id : '';
        url = (typeof url === 'string' && url != '' && url != 'null') ? url : '';
        callback = (typeof callback === 'function' && callback != null) ? callback : null;
        async = (typeof async === 'boolean') ? async : true;
        type = (typeof type === 'string' && type != '') ? type : 'POST';
        dataType = (typeof dataType === 'string' && dataType != '') ? dataType : 'json';
        if (!debug) {
            if (id != '') {
                var dataObj = getDataStorge(id);
                if (dataObj != null) {
                    _callback(callback, dataObj);
                }
                else {
                    postfile(id, url, parameters, callback, async, type, dataType);
                }
            }
            else {
                postfile(id, url, parameters, callback, async, type, dataType);
            }
        }
        else {
            postfile(id, url, parameters, callback, async, type, dataType);
        }
    }

    //设置调式模式
    exports.Debug = function (contig) {
        contig = contig.toString().toLowerCase() === 'true' ? true : false;
        if (contig) {
            debug = true;
        }
    }
}));