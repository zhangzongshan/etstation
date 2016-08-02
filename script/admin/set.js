/**
 * Created by zhangzongshan on 16/7/30.
 */
define(function (require, exports, module) {

    var scriptPath = common.fn.getScriptRoot('common');
    var rootPath = scriptPath.substr(0, scriptPath.indexOf('_assets/'));
    seajs.use([
        rootPath + '/style/admin/set.css'
        , rootPath + '_assets/js/module/page/page.css'
        , rootPath + '_assets/js/public/select2-4.0.3/css/select2.css'
        , rootPath + '_assets/js/public/icheck/skins/all.css'
        , rootPath + '_assets/js/public/icheck/icheck.min'
    ]);

    var newsTabsKit = require('../../_assets/js/module/tabskit/tabskit');
    var login = require('../admin/login');
    var dialog = require('../../script/public/input_dialog_info');
    var imgInput = require('../../_assets/js/module/imginput/imginput');

    var bgUpdateApi = apiRoot + '/api/bg/update';
    var bgGetApi = apiRoot + '/api/bg/get';
    var adminUpdateApi = apiRoot + '/api/admin/update';
    var imageApi = apiRoot + '/api/Images';

    var bgObj = {
        init: function (container) {
            container = $(container);
            DataLoad.GetFile("bgset_html", rootPath + "/html/admin/set/bgset.html", function (html) {
                container.html(html);

                var bgTabsKit = newsTabsKit.Create({
                    obj: container.find(".bg_tab")
                    , id: "bgSet"
                    , autowidth: true
                    , container: container.find(".bg_content")
                    , tabs: [{
                        id: 'index'
                        , normal: 'tabs_bg_normal'
                        , active: 'tabs_bg_active'
                        , html: '<span>首页</span>'
                        , fn: function () {
                            bgObj.load('index');
                        },
                        content: ''
                    }, {
                        id: 'about'
                        , normal: 'tabs_bg_normal'
                        , active: 'tabs_bg_active'
                        , html: '<span>了解外星人</span>'
                        , fn: function () {
                            bgObj.load('about');
                        }
                        , content: ''
                    }, {
                        id: 'news'
                        , normal: 'tabs_bg_normal'
                        , active: 'tabs_bg_active'
                        , html: '<span>最新作品</span>'
                        , fn: function () {
                            bgObj.load('news');
                        }
                        , content: ''
                    }, {
                        id: 'product'
                        , normal: 'tabs_bg_normal'
                        , active: 'tabs_bg_active'
                        , html: '<span>外星人产品</span>'
                        , fn: function () {
                            bgObj.load('product');
                        }
                        , content: ''
                    }, {
                        id: 'check'
                        , normal: 'tabs_bg_normal'
                        , active: 'tabs_bg_active'
                        , html: '<span>质保查询</span>'
                        , fn: function () {
                            bgObj.load('check');
                        }
                        , content: ''
                    }, {
                        id: 'link'
                        , normal: 'tabs_bg_normal'
                        , active: 'tabs_bg_active'
                        , html: '<span>联系方式</span>'
                        , fn: function () {
                            bgObj.load('link');
                        }
                        , content: ''
                    }, {
                        id: 'product_inner'
                        , normal: 'tabs_bg_normal'
                        , active: 'tabs_bg_active'
                        , html: '<span>产品内页</span>'
                        , fn: function () {
                            bgObj.load('product_inner');
                        }
                        , content: ''
                    }]
                });
            });
        },
        load: function (id) {
            var container = $(".bg_content");
            var spinkit = SpinKit.Create({
                color: '#1f548a'
            });
            DataLoad.GetData(null, bgGetApi, {ids: id}, function (result) {
                spinkit.remove();
                dialog.dataResult(result, function () {
                    bgObj.bgset(container, result.resultObject.data, id);
                }, function () {
                    container.html("");
                });
            }, true, 'post', 'json');
        },
        bgset: function (container, data, idkey) {
            var img = null;
            var ids = idkey;
            var id = "";
            var form = $("#submitForm");
            form.find("#ids").remove();
            form.find("#id").remove();

            if (data != null && data.length > 0) {
                var dataObj = data[0];
                img = dataObj.pic !== "" ? [dataObj.pic] : null;
                ids = dataObj.ids;
                id = dataObj.id;
                form.append('<input type="hidden" id="id" name="id" value="' + id + '">');
            }
            form.append('<input type="hidden" id="ids" name="ids" value="' + ids + '">');

            var picInput = imgInput.Create(img, {
                obj: container
                , rootpath: imageApi + '?img=BgImg/'
                , class: ""
                , height: 498
                , total: 1
                , count: 1
                , margin: {
                    top: 0
                    , right: 0
                    , bottom: 0
                    , left: 0
                }
                , backgroundSize: 'cover'
                , name: "pic"
                , addItem: {
                    text: "<span class='icon-plus' style='line-height: 498px;'></span>"
                    , class: "add_bg_content"
                }
                , infoItem: {
                    text: "<div class='bg_btn'>如需要修改,请点击图片</div>"
                    , class: "btn_info"
                    , item: [{}]
                }
                , changfn: function () {
                    var btnObj = container.find(".bg_btn");
                    btnObj.removeClass("btn_info").addClass("btn_info_active");
                    btnObj.html('保存');
                    btnObj.off('click');
                    btnObj.on('click', function () {
                        bgObj.sumbit(container, picInput, form);
                    });
                }
                , callback: function () {

                }
            });
        },
        sumbit: function (container, picInput, form) {
            var spinkit = SpinKit.Create({
                color: '#1f548a'
            });
            DataLoad.PostForm(bgUpdateApi, form, function (result) {
                spinkit.remove();
                dialog.dataResult(result, function () {
                    var btnObj = container.find(".bg_btn");
                    btnObj.removeClass("btn_info_active").addClass("btn_info");
                    btnObj.html("如需要修改,请点击图片");
                }, function () {

                }, {
                    success: form.find("#id").length > 0 ? '修改成功!' : '添加成功!'
                    , fail: ''
                });
            });
        }
    }
    var adminObj = {
        errMessage:[],
        init: function (container) {
            container = $(container);
            DataLoad.GetFile("adminSet_html", rootPath + "/html/admin/set/adminset.html", function (html) {
                container.html(html);
                login.login(container.find(".admin_login"), function (userinfo) {
                    container.find(".admin_login").remove();
                    container.find(".admin_set").show();

                    var username = userinfo.username;
                    var name = userinfo.name;
                    var photo = userinfo.photo;
                    var mobile = userinfo.mobile;
                    var email = userinfo.email;
                    var id = userinfo.id;

                    var form = container.find("#submitForm");
                    form.append('<input type="hidden" name="id" id="id" value="' + id + '">');
                    form.find("#username").val(username);
                    form.find("#name").val(name);
                    form.find("#mobile").val(mobile);
                    form.find("#email").val(email);
                    photo = photo == "" ? null : [photo];
                    var picInput = imgInput.Create(photo, {
                        obj: form.find('.user_img_container')
                        , rootpath: imageApi + '?img=AdminImg/'
                        , margin: {
                            top: 0
                            , right: 0
                            , bottom: 0
                            , left: 0
                        }
                        , class: "photo_img"
                        , height: 100
                        , total: 1
                        , count: 1
                        , name: "photo"
                        , addItem: {
                            text: "<span class='icon-plus' style='line-height: 100px;'></span>"
                        }
                        , infoItem: {
                            text: ""
                            , class: ""
                            , item: [{}]
                        }
                        , changfn: function () {
                            adminObj.sumbitEvent(container);
                        }
                        , callback: function () {

                        }
                    });

                    container.find("input").off("input propertychange");
                    container.find("input").on("input propertychange", function () {
                        adminObj.sumbitEvent(container);
                    });

                });
            });
        },
        sumbitEvent: function (container) {
            container.find(".base_btn").removeClass("hidden_btn").addClass("sumbit_btn");
            container.find(".base_btn").off('click');
            container.find(".base_btn").on('click', function () {
                var confirmDialog = dialog.confirm("确定现在提交吗?", {
                    width: 400
                    , submit: function () {
                        adminObj.sumbit(container);
                        confirmDialog.Close();
                    }
                });
            });
        },
        sumbit:function (container) {
            if (this.verify(container)) {
                var form = container.find("#submitForm");
                var spinkit = SpinKit.Create({
                    color: '#1f548a'
                });
                DataLoad.PostForm(adminUpdateApi, form, function (result) {
                    spinkit.remove();
                    dialog.dataResult(result, function () {
                        container.find(".base_btn").removeClass("sumbit_btn").addClass("hidden_btn");
                    }, function () {

                    }, {
                        success: container.find("#id").length > 0 ? '修改成功!' : '添加成功!'
                        , fail: ''
                    });
                });
            }
        },
        verify:function (container) {
            this.errMessage = [];

            var verifyFlg = true;
            var username = container.find("#username").val();
            if (username === null || username === '') {
                this.errMessage.push({
                    obj: container.find("#username")
                    , message: "用户名必须填写!"
                });
                verifyFlg = false;
            }

            var password = container.find("#password").val();
            var repassword = container.find("#repassword").val();
            password=common.string.alltrim(password);
            repassword=common.string.alltrim(repassword);

            if(password!="" || repassword!=""){
                if(password!==repassword){
                    this.errMessage.push({
                        obj: container.find("#repassword")
                        , message: "两次密码输入不一致!"
                    });
                    verifyFlg = false;
                }else{
                    if(password.length<6){
                        this.errMessage.push({
                            obj: container.find("#password")
                            , message: "必须是6位数以上的密码!"
                        });
                        verifyFlg = false;
                    } else{
                        var strength=common.fn.checkPassword(container.find("#password"));
                        if(strength<3){
                            this.errMessage.push({
                                obj: container.find("#password")
                                , message: "密码太弱,请输入复杂的密码!"
                            });
                            verifyFlg = false;
                        }
                    }
                }
            }

            var name = container.find("#name").val();
            if (name === null || name === '') {
                this.errMessage.push({
                    obj: container.find("#name")
                    , message: "姓名必须填写!"
                });
                verifyFlg = false;
            }

            if (!verifyFlg) {
                dialog.err(this.errMessage, {
                    width: 200
                    , height: 20
                    , msgClass: 'login_err'
                    , layout: 'centerleft'
                    , background: 'rgba(255,255,255,.8)'
                });
            }
            return verifyFlg;
        }
    }
    var setObj = {
        init: function (menu_container, content_container) {
            var pTabsKit = new newsTabsKit.Create({
                obj: $(menu_container)
                , id: "set_menu"
                , autowidth: false
                , container: $(content_container)
                , showtabs: 'set_bg_set'
                , direct: 'Portrait'
                , tabs: [{
                    id: 'set_bg_list'
                    , normal: 'tabs_menu_normal'
                    , active: 'tabs_menu_active'
                    , html: '<span>网页背景设置</span>'
                    , fn: function () {
                        setObj.load(content_container, 'set_bg_set');
                    },
                    content: ''
                }, {
                    id: 'admin_set'
                    , normal: 'tabs_menu_normal'
                    , active: 'tabs_menu_active'
                    , html: '<span>管理员设置</span>'
                    , fn: function () {
                        setObj.load(content_container, 'admin_set');
                    }
                    , content: ''
                }]
            });
        },
        load: function (content_container, case_type) {
            NotyKit.Destroy();
            switch (case_type) {
                case "set_bg_set": {
                    bgObj.init(content_container);
                    break;
                }
                case "admin_set": {
                    adminObj.init(content_container);
                    break;
                }
            }
        }
    }

    return {
        init: setObj.init
    }

});