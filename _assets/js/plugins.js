// Avoid `console` errors in browsers that lack a console.
//解决的console调试的时候报错
(function () {
    var method;
    var noop = function () {
    };
    var methods = [
        'assert', 'clear', 'count', 'debug', 'dir', 'dirxml', 'error',
        'exception', 'group', 'groupCollapsed', 'groupEnd', 'info', 'log',
        'markTimeline', 'profile', 'profileEnd', 'table', 'time', 'timeEnd',
        'timeline', 'timelineEnd', 'timeStamp', 'trace', 'warn'
    ];
    var length = methods.length;
    var console = (window.console = window.console || {});

    while (length--) {
        method = methods[length];

        // Only stub undefined methods.
        if (!console[method]) {
            console[method] = noop;
        }
    }
}());

(function () {
    var sysSpinkit = null;
    Modernizr.load([{
        load: {
            'jquery': '_assets/js/public/jquery/jquery-1.12.3.min.js'//jquery
            , 'spink': '_assets/js/module/spinkit/spinkit.js'//加载动画
        },
        callback: function (url, result, key) {
            //alert(url);
        },
        complete: function () {
            sysSpinkit = SpinKit.Create({
                color: '#fff'
            });
        }
    }, {
        load: {
            'lodash': '_assets/js/public/underscore/underscore.js'//基础库
            , 'html5media': '_assets/js/public/html5media/html5media-1.1.8.min.js'//多媒体
            , 'moment': '_assets/js/public/moment/moment-local-2.1.3.min.js'//日期
            , 'validator': '_assets/js/public/validator/validator-5.2.0.min.js'//验证
            , 'common': '_assets/js/module/common/common.js'//加载通用函数
            , 'noty': '_assets/js/module/notykit/notykit.js'//对话框
            , 'dataload': '_assets/js/module/dataload/dataload.js'//数据请求
            , 'seajs': '_assets/js/frame/seajs/sea.js'//
            , 'seajs-css': '_assets/js/frame/seajs/seajs-css.js'//
            , 'seajs-preload': '_assets/js/frame/seajs/seajs-preload.js'//数据请求
            , 'baiduMao': 'http://api.map.baidu.com/api?v=2.0&ak=e35biu9blkyBwcyfYBXaI5zfwyMRjLSU&callback=mapinit'//数据请求
        },
        callback: function (url, result, key) {
            //alert(url);
        },
        complete: function () {
            pageInit();
            sysSpinkit.remove();
            sysSpinkit=null;
        }
    }]);
}());
