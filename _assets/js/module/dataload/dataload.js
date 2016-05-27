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

    var dataStorge = [];

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

    function removeArrJsonItem(obj, key, value) {
        var k = (typeof (key) == "string" && key != "") ? key : null;
        var v = (typeof (value) != "undefined") ? value : null;
        if (typeof (obj) == "object" && obj != null && k != null) {
            for (var item in obj) {
                if (typeof (obj[item]) === 'object' && obj[item] != null) {
                    if (v != null) {
                        if (obj[item][k] === v || (typeof (v) === "object" && obj[item][k].is(v))) {
                            delete obj[item];
                            break;
                        }
                    }
                    else {
                        if (obj[item].hasOwnProperty(k)) {
                            delete obj[item];
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
            storage.setItem(key, value);
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
            $.get(url, function (data) {
                _callback(callback, data);
                if (id != '') {
                    writeDataStorge(id, data);
                }
            });
        }
    }

    function postfile(id, url, parameters, callback, type) {
        if (url != '') {
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

            type = type.toLowerCase() === 'json' ? 'json'
                : type.toLowerCase() === 'xml' ? 'xml'
                : type.toLowerCase() === 'html' ? 'html'
                : type.toLowerCase() === 'script' ? 'script'
                : 'json';
            $.post(url, pars, function (data) {
                _callback(callback, data);
                if (id != '') {
                    writeDataStorge(id, data);
                }
            }, type);
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
            }
            if(dataStorge.length>0){
                writestorage('_data_storge_system-DataLoad', JSON.stringify(dataStorge));
            }
            else
            {
                delstorage('_data_storge_system-DataLoad');
            }
        }
    }

    exports.GetFile = function (id, url, callback) {
        id = (typeof id === 'string' && id != '' && id != 'null') ? id : '';
        url = (typeof url === 'string' && url != '' && url != 'null') ? url : '';
        callback = (typeof callback === 'function' && callback != null) ? callback : null;
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
    }

    exports.PostFile = function (id, url, parameters, callback, type) {
        id = (typeof id === 'string' && id != '' && id != 'null') ? id : '';
        url = (typeof url === 'string' && url != '' && url != 'null') ? url : '';
        callback = (typeof callback === 'function' && callback != null) ? callback : null;
        type = (typeof type === 'string' && type != '') ? type : 'json';
        if (id != '') {
            var dataObj = getDataStorge(id);
            if (dataObj != null) {
                _callback(callback, dataObj);
            }
            else {
                postfile(id, url, parameters, callback, type);
            }
        }
        else {
            postfile(id, url, parameters, callback, type);
        }
    }

}));