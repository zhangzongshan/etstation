/**
 * Created by zhangzongshan on 16/6/15.
 */
'use strict';
define(function (require, exports, module) {
    var scriptPath = common.fn.getScriptRoot('common');
    var rootPath = scriptPath.substr(0, scriptPath.indexOf('_assets/'));
    seajs.use([
        rootPath + '/style/admin/head.css'
        , rootPath + '/style/admin/content.css'
        , rootPath + '/style/admin/menu.css'
    ]);
    var tabsKit = require('../../_assets/js/module/tabskit/tabskit');
    var login = require('../admin/login');
    var dialog = require('../../script/public/input_dialog_info');

    DataLoad.Debug(true);
    var headObj = {
        init: function (container, callback) {
            container.html('');
            DataLoad.GetFile('admin_head', rootPath + '/html/admin/head/head.html', function (html) {
                container.html(html);

                //设置用户信息
                var user = JSON.parse(common.fn.getstorage('userinfo'));
                var user_photo = user.photo != "" ? user.photo : rootPath + "/images/no_user_128.png";
                var user_name = user.name;
                var loginOut = '<span class="icon-signout signout">退出</span>'

                container.find('.user_photo').css({
                    "background-image": "url(" + user_photo + ")"
                });
                container.find('.user_name').html(user_name);
                container.find('.user_loginOut').html(loginOut);
                container.find('.signout').off('click');
                container.find('.signout').on('click', function () {
                    var configDialog = dialog.confirm("确定退出吗?", {
                        width: 400
                        , submit: function (notykit) {
                            configDialog.Close();
                            headObj.loginOut(null, function () {
                                init();
                            });
                        }
                        , cancle: function () {
                            configDialog.Close();
                        }
                    });
                });

                contentObj.init($('#content'), function () {
                    headObj.setmenu();
                });
            });
        },
        setmenu: function () {
            //设置导航菜单
            var headTabsKit = new tabsKit.Create({
                obj: $(".menu_container")
                , id: 'head_menu'
                , storge: false
                , autowidth: false
                , container: $('.admin_menu')
                , showtabs: 'baseInfo'
                , tabs: [{
                    id: 'baseInfo'
                    , normal: 'tabs_normal'
                    , active: 'tabs_active'
                    , html: '<span>基础信息</span>'
                    , fn: function () {
                        var base = require('../../script/admin/base');
                        //不能直接使用 jquery 对象,因为重新加载以后不能定位到页面
                        base.init('.admin_menu', '.admin_content');
                    },
                    content: ''
                }, {
                    id: 'product'
                    , normal: 'tabs_normal'
                    , active: 'tabs_active'
                    , html: '<span>产品管理</span>'
                    , fn: function () {
                        var product = require('../../script/admin/product');
                        //不能直接使用 jquery 对象,因为重新加载以后不能定位到页面
                        product.init('.admin_menu', '.admin_content');
                    }
                    , content: ''
                }, {
                    id: 'newsinfo'
                    , normal: 'tabs_normal'
                    , active: 'tabs_active'
                    , html: '<span>动态信息</span>'
                    , fn: function () {
                        var news = require('../../script/admin/news');
                        //不能直接使用 jquery 对象,因为重新加载以后不能定位到页面
                        news.init('.admin_menu', '.admin_content');
                    }
                    , content: ''
                }, {
                    id: 'config'
                    , normal: 'tabs_normal'
                    , active: 'tabs_active'
                    , html: '<span>设置</span>'
                    , fn: function () {

                    }
                    , content: ''
                }]
            });
        },
        loginOut: function (container, callback) {
            login.loginOut(container, callback);
        }
    }
    var contentObj = {
        init: function (container, callback) {
            container.html('');
            DataLoad.GetFile('admin_content', '../html/admin/content/content.html', function (html) {
                container.html(html);

                container.css({
                    "width": $(document).width() - 25 + "px"
                });
                container.find('.content_right').css({
                    'width': container.width() - container.find('.content_left').outerWidth(true) + 'px'
                });
                container.find('.content_left,.content_right').css({
                    'min-height': $(document).height() - $('#head').height() + 'px'
                });

                $(window).on("resize", function () {
                    container.css({
                        "width": $(document).width() - 25 + "px"
                    });
                    container.find('.content_left,.content_right').css({
                        'min-height': $(document).height() - $('#head').height() + 'px'
                    });
                    container.find('.content_right').css({
                        'width': container.width() - container.find('.content_left').outerWidth(true) + 'px'
                    });
                });

                if (typeof callback === 'function') {
                    callback();
                }
            });
        }
    }


    function init() {
        var user = JSON.parse(common.fn.getstorage('userinfo'));
        $('#head').html('');
        $('#content').html('');
        if (user !== null) {
            headObj.init($('#head'));
        }
        else {
            login.login($('#content'), function (result) {
                headObj.init($('#head'));
            });
        }
    }

    return {
        init: init
    }
});