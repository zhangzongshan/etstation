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
        var layout = (typeof (config.layout) === 'string' || typeof (config.layout) === 'object') ? config.layout : '';
        var msgClass = (typeof (config.msgClass) === 'string' && config.msgClass != "") ? config.msgClass : '';

        $.each(errObj, function (index, item) {
            var obj = item.obj;
            var message = '<span class="icon-remove-sign"></span>&nbsp;'+item.message;
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
                });
            }
        });
    }

    return {
        err: err
    }
});