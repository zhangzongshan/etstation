/**
 * Created by zhangzongshan on 16/6/15.
 */
'use strict';
define(function (require, exports, module) {
    seajs.use([
        '../style/admin/head.css'
        , '../style/admin/content.css'
    ]);
    DataLoad.Debug(true);
    var headObj = {
        init: function (container, callback) {
            DataLoad.GetFile('admin_head', '../html/admin/head/head.html', function (html) {
                container.html(html);
                if (typeof callback === 'function') {
                    callback();
                }
            });
        }
    }
    var contentObj = {
        init: function (container) {
            DataLoad.GetFile('admin_content', '../html/admin/content/content.html', function (html) {
                container.html(html);
                container.find('.content_left,.content_right').css({
                    'height': $(window).height() - $('#head').height() + 'px'
                });

                container.find('.content_right').css({
                    'width': $(window).width() - container.find('.content_left').outerWidth(true) + 'px'
                });

                $(window).on("resize", function () {
                    container.find('.content_left,.content_right').css({
                        'height': $(window).height() - $('#head').height() + 'px'
                    });
                    container.find('.content_right').css({
                        'width': $(window).width() - container.find('.content_left').outerWidth(true) + 'px'
                    });
                });

            });
        }
    }


    function init() {
        //var basil = new window.Basil();
        var user=Basil.cookie.get('admin_user');
        if(user!==null){
            headObj.init($('#head'), function () {
                contentObj.init($('#content'));
            });
        }
        else
        {
            $('#head').html('');
            $('#content').html('');
            var login=require('../admin/login');
            login.login($('#content'),function (result) {
                headObj.init($('#head'), function () {
                    contentObj.init($('#content'));
                });
            });
        }
    }

    return {
        init: init
    }
});