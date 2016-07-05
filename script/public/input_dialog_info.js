/**
 * Created by zhangzongshan on 16/6/19.
 */
"use strict"
define(function (require, exports, module) {

    function err(errObj, config) {
        if (!config) {
            config = {
                width: 0
                , height: 0
                , background: ''
                , layout: 'center'
                , msgClass: ''
            };
        }
        var width = (typeof (config.width) === 'number' && config.width > 0) ? config.width : 0;
        var height = (typeof (config.height) === 'number' && config.height > 0) ? config.height : 0;
        var background = (typeof (config.background) === 'string' && config.background != "") ? config.background : '';
        var layout = (typeof (config.layout) === 'string' || typeof (config.layout) === 'object') ? config.layout : 'center';
        var msgClass = (typeof (config.msgClass) === 'string' && config.msgClass != "") ? config.msgClass : '';
        var zIndex = (typeof (config.zIndex) === 'number' && config.zIndex > 0) ? config.zIndex : common.fn.getmaxZindex() + 1;

        $.each(errObj, function (index, item) {
            var obj = item.obj;
            var message = '<span class="icon-remove-sign"></span>&nbsp;' + item.message;
            if (obj.length != -1) {
                var errNotyKit = NotyKit.Create({
                    obj: obj
                    , width: width !== 0 ? width : obj.width()
                    , height: height !== 0 ? height : obj.height()
                    , template: "<div class='login_errmessage_container'></div>"
                    , text: {
                        container: '.login_errmessage_container'
                        , text: message
                        , addClass: msgClass
                    }
                    , closeItem: [{
                        container: '.notykit_content,.login_errmessage_container'
                        , closeWith: ['click']
                        , text: ''//当 text 不为空时候下面配置生效
                        , layout: ''
                        , addClass: ''
                    }]
                    , layout: layout !== '' ? layout : "left"
                    , background: background !== '' ? background : "rgba(255,255,255,1)"
                    , zIndex: zIndex
                });
            }
        });
    }


    function dialog(message, config) {
        if (!config) {
            config = {
                width: 0
                , height: 0
                , background: ''
                , layout: 'windowscenter'
                , msgClass: ''
            };
        }
        var width = (typeof (config.width) === 'number' && config.width > 0) ? config.width : 0;
        var height = (typeof (config.height) === 'number' && config.height > 0) ? config.height : 0;
        var background = (typeof (config.background) === 'string' && config.background != "") ? config.background : '';
        var layout = (typeof (config.layout) === 'string' || typeof (config.layout) === 'object') ? config.layout : 'windowscenter';
        var msgClass = (typeof (config.msgClass) === 'string' && config.msgClass != "") ? config.msgClass : '';
        var obj = (typeof config.obj === 'object' && config.obj != null) ? config.obj : $("body");
        var callback = (typeof config.callback === 'function') ? config.callback : null;
        var zIndex = (typeof (config.zIndex) === 'number' && config.zIndex > 0) ? config.zIndex : common.fn.getmaxZindex() + 1;

        var template = '<div class="dialog_container">'
            + '<div class="dialog_title">错误信息</div>'
            + '<div class="dialog_content"></div>'
            + '<div class="dialog_btn_container"></div>'
            + '</div>';

        var dialog = NotyKit.Create({
            obj: obj
            , width: width !== 0 ? width : obj.width()
            , height: height !== 0 ? height : obj.height()
            , template: template
            , text: {
                container: '.dialog_content'
                , text: message
                , addClass: msgClass
            }
            , closeItem: [{
                container: '.dialog_title'
                , closeWith: ['click']
                , text: '<span class="icon-remove" style="margin-right: 10px;"></span>'//当 text 不为空时候下面配置生效
                , layout: 'centerright'
                , addClass: 'dialog_close'
            }]
            , buttons: [{
                container: '.dialog_btn_container'//noty_foot,或自定义容器
                , addClass: 'dialog_sumbit'
                , btnWith: ['click']
                , text: '<span>确定</span>'
                , callback: callback != null ? callback : function () {
                    dialog.Close();
                }
            }]
            , layout: layout !== '' ? layout : "windowscenter"
            , background: background !== '' ? background : "rgba(255,255,255,.2)"
            , zIndex: zIndex
        });
        dialog.AutoSize();
        return dialog;
    }

    function confirm(message, config) {
        if (!config) {
            config = {
                width: 0
                , height: 0
                , background: ''
                , layout: 'windowscenter'
                , msgClass: ''
            };
        }
        var width = (typeof (config.width) === 'number' && config.width > 0) ? config.width : 0;
        var height = (typeof (config.height) === 'number' && config.height > 0) ? config.height : 0;
        var background = (typeof (config.background) === 'string' && config.background != "") ? config.background : '';
        var layout = (typeof (config.layout) === 'string' || typeof (config.layout) === 'object') ? config.layout : 'windowscenter';
        var msgClass = (typeof (config.msgClass) === 'string' && config.msgClass != "") ? config.msgClass : '';
        var obj = (typeof config.obj === 'object' && config.obj != null) ? config.obj : $("body");
        var submit = (typeof config.submit === 'function') ? config.submit : null;
        var cancle = (typeof config.cancle === 'function') ? config.cancle : null;
        var zIndex = (typeof (config.zIndex) === 'number' && config.zIndex > 0) ? config.zIndex : common.fn.getmaxZindex() + 1;

        var template = '<div class="config_container">'
            + '<div class="config_title">提示信息</div>'
            + '<div class="config_content"></div>'
            + '<div class="config_btn_container"></div>'
            + '</div>';

        var dialog = NotyKit.Create({
            obj: obj
            , width: width !== 0 ? width : obj.width()
            , height: height !== 0 ? height : obj.height()
            , template: template
            , text: {
                container: '.config_content'
                , text: message
                , addClass: msgClass
            }
            , closeItem: [{
                container: '.config_title'
                , closeWith: ['click']
                , text: '<span class="icon-remove" style="margin-right: 10px;"></span>'//当 text 不为空时候下面配置生效
                , layout: 'centerright'
                , addClass: 'config_close'
            }]
            , buttons: [{
                container: '.config_btn_container'//noty_foot,或自定义容器
                , addClass: 'config_sumbit'
                , btnWith: ['click']
                , text: '<span>确定</span>'
                , callback: submit != null ? submit : function () {
                    dialog.Close();
                }
            }, {
                container: '.config_btn_container'//noty_foot,或自定义容器
                , addClass: 'cancle_sumbit'
                , btnWith: ['click']
                , text: '<span>取消</span>'
                , callback: cancle != null ? cancle : function () {
                    dialog.Close();
                }
            }]
            , layout: layout !== '' ? layout : ''
            , background: background !== '' ? background : "rgba(255,255,255,.2)"
            , zIndex: zIndex
        });
        dialog.AutoSize(function () {
            // alert($("body").scrollTop());
            // // dialog.SetLayOut({
            // //     top:dialog.obj.scrollTop()
            // //     ,left:100
            // // });
        });
        return dialog;
    }
    
    
    function notify(message, config) {
        if (!config) {
            config = {
                width: 0
                , height: 0
                , background: ''
                , layout: 'windowscenter'
                , msgClass: ''
            };
        }
        var width = (typeof (config.width) === 'number' && config.width > 0) ? config.width : 0;
        var height = (typeof (config.height) === 'number' && config.height > 0) ? config.height : 0;
        var background = (typeof (config.background) === 'string' && config.background != "") ? config.background : '';
        var layout = (typeof (config.layout) === 'string' || typeof (config.layout) === 'object') ? config.layout : 'windowscenter';
        var msgClass = (typeof (config.msgClass) === 'string' && config.msgClass != "") ? config.msgClass : '';
        var obj = (typeof config.obj === 'object' && config.obj != null) ? config.obj : $("body");
        var callback = (typeof config.callback === 'function') ? config.callback : null;
        var zIndex = (typeof (config.zIndex) === 'number' && config.zIndex > 0) ? config.zIndex : common.fn.getmaxZindex() + 1;

        var template = '<div class="notify_message_container">'
            + '<div class="notify_message_title">信息提示</div>'
            + '<div class="notify_message_content"></div>'
            + '</div>';

        var dialog = NotyKit.Create({
            obj: obj
            , width: width !== 0 ? width : obj.width()
            , height: height !== 0 ? height : obj.height()
            , template: template
            , text: {
                container: '.notify_message_content'
                , text: message
                , addClass: msgClass
            }
            , closeItem: [{
                container: ''
                , closeWith: ['click']
                , text: ''//当 text 不为空时候下面配置生效
                , layout: ''
                , addClass: ''
            }]
            , layout: layout !== '' ? layout : ''
            , background: background !== '' ? background : "rgba(255,255,255,.2)"
            , zIndex: zIndex
        });
        dialog.AutoSize();
        if(typeof callback==='function'){
            setTimeout(function () {
                callback();
            },2000);
        }
        else {
            setTimeout(function () {
                dialog.Close();
            },2000);
        }
        return dialog;
    }

    return {
        err: err
        , dialog: dialog
        , confirm: confirm
        ,notify:notify
    }
});