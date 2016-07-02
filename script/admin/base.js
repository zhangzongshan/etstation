/**
 * Created by zhangzongshan on 16/6/23.
 */
"use strict"
define(function (require, exports, module) {
    var scriptPath = common.fn.getScriptRoot('common');
    var rootPath = scriptPath.substr(0, scriptPath.indexOf('_assets/'));
    seajs.use([
        rootPath + '/style/admin/base.css'
        // ,rootPath + '_assets/js/public/ueditor/ueditor.all.js'
        // ,rootPath + '_assets/js/public/ueditor/ueditor.config.js'
    ]);
    var basetabsKit = require('../../_assets/js/module/tabskit/tabskit');
    var login = require('../admin/login');
    var dialog = require('../../script/public/input_dialog_info');
    var ueditorConfig = require('../../script/admin/ueditor_config');
    var index = require('../../script/admin/index');
    var baiduMap = require('../../script/admin/set_map_pointer');

    var getApi = apiRoot + '/api/commpanys/get';
    var updateApi = apiRoot + '/api/commpanys/update';
    var imageApi = apiRoot + '/api/commpanys/image';
    DataLoad.Debug(true);
    var baseObj = {
        init: function (menu_container, content_container) {
            var headTabsKit = new basetabsKit.Create({
                obj: $(menu_container)
                , id: "base_menu"
                , autowidth: false
                , container: $(content_container)
                , showtabs: 'about'
                , direct: 'Portrait'
                , tabs: [{
                    id: 'about'
                    , normal: 'tabs_menu_normal'
                    , active: 'tabs_menu_active'
                    , html: '<span>关于我们</span>'
                    , fn: function () {
                        baseObj.load(content_container, 'about');
                    },
                    content: ''
                }, {
                    id: 'team'
                    , normal: 'tabs_menu_normal'
                    , active: 'tabs_menu_active'
                    , html: '<span>团队成员</span>'
                    , fn: function () {
                        baseObj.load(content_container, 'team');
                    }
                    , content: ''
                }, {
                    id: 'link'
                    , normal: 'tabs_menu_normal'
                    , active: 'tabs_menu_active'
                    , html: '<span>联系方式</span>'
                    , fn: function () {
                        baseObj.load(content_container, 'link');
                    }
                    , content: ''
                }]
            });
        },
        load: function (content_container, case_type) {
            switch (case_type) {
                case "about":
                {
                    about.init(content_container);
                    break;
                }
                case "link":
                {
                    link.init(content_container);
                    break;
                }
            }
        }
    }
    var about = {
        editor: null
        , sumbit_content: {
            about: null
        }
        , init: function (container) {
            container = $(container);
            var spinkit = SpinKit.Create({
                color: '#1f548a'
            });
            DataLoad.GetData(null, getApi, null, function (result) {
                if (result.status === "success") {
                    DataLoad.GetFile("aboutInfo_Html", rootPath + "/html/admin/base/about.html", function (html) {
                        spinkit.remove();
                        container.html($(html));
                        var content = result.resultObject.about;
                        var htmlContent = ''
                            + '<div class="editor" id="editor" name="editor" type="text/plain">'
                            + '</div>';
                        container.find('#about_content').html(htmlContent);

                        //必须销毁
                        if (about.editor !== null) {
                            about.editor.destroy();
                            about.editor = null;
                        }
                        about.editor = UE.getEditor('editor', ueditorConfig.config);
                        about.editor.ready(function () {
                            about.editor.setContent(content);
                            about.editor.addListener('contentChange', function () {
                                container.find(".base_btn").removeClass("hidden_btn").addClass("sumbit_btn");
                                container.find(".base_btn").off('click');
                                container.find(".base_btn").on('click', function () {
                                    var content = about.editor.getContent();
                                    if (content !== '') {
                                        var confirmDialog = dialog.confirm("确定现在提交吗?", {
                                            width: 400
                                            , submit: function () {
                                                about.sumbit(container, content);
                                                confirmDialog.Close();
                                            }
                                        });

                                    } else {
                                        var errDialog = dialog.dialog("必须填写内容!", {
                                            width: 400
                                            , callback: function (notykit) {
                                                errDialog.Close();
                                            }
                                        });
                                    }
                                });
                            });
                        });

                        container.find(".base_btn").off('click');

                    });
                }
                else {
                    spinkit.remove();
                    var errDialog = dialog.dialog(result.message, {
                        width: 400
                        , callback: function (notykit) {
                            if (parseInt(result.code) <= -100005 && parseInt(result.code) >= -100011) {
                                login.loginOut(null, function () {
                                    index.init();
                                })
                            }
                            errDialog.Close();
                        }
                    });
                }
            }, true, 'post', 'json');

        },
        sumbit: function (container, content) {
            var spinkit = SpinKit.Create({
                color: '#1f548a'
            });
            DataLoad.GetData(null, updateApi, {about: content}, function (result) {
                spinkit.remove();
                if (result.status === "success") {
                    var infoDialog = dialog.notify("操作成功!", {
                        width: 400
                        , callback: function (notykit) {
                            container.find(".base_btn").off('click');
                            container.find(".base_btn").removeClass("sumbit_btn").addClass("hidden_btn");
                            infoDialog.Close();
                        }
                    });
                }
                else {
                    var errDialog = dialog.dialog(result.message, {
                        width: 400
                        , callback: function (notykit) {
                            if (parseInt(result.code) <= -100005 && parseInt(result.code) >= -100011) {
                                login.loginOut(null, function () {
                                    index.init();
                                })
                            }
                            errDialog.Close();
                        }
                    });
                }
            }, true, 'post', 'json');
        }
    }

    var link = {
        init: function (container) {
            container = $(container);
            var spinkit = SpinKit.Create({
                color: '#1f548a'
            });
            DataLoad.GetData(null, getApi, null, function (result) {
                if (result.status === "success") {
                    DataLoad.GetFile("linkInfo_Html", rootPath + "/html/admin/base/link.html", function (html) {
                        spinkit.remove();
                        container.html($(html));

                        var company = result.resultObject.company;
                        var linkname = result.resultObject.linkname;
                        var tell = result.resultObject.tell;
                        var moblie = result.resultObject.moblie;
                        var email = result.resultObject.email;
                        var address = result.resultObject.address;
                        var map = result.resultObject.map;
                        var ecode = result.resultObject.ecode;

                        container.find("#company").val(company);
                        container.find("#linkname").val(linkname);
                        container.find("#tell").val(tell);
                        container.find("#moblie").val(moblie);
                        container.find("#email").val(email);
                        container.find("#address").val(address);
                        container.find("#map").val(map);

                        if (ecode != "") {
                            var arrQrCode = ecode.split(",");
                            $.each(arrQrCode, function (index, item) {
                                if (item != "") {
                                    container.find("#qrCode" + (index + 1)).html("");
                                    container.find("#qrCode" + (index + 1)).css({
                                        "background-image": "url(" + imageApi + "?img=" + item + ")"
                                    });
                                }
                            });

                        }

                        container.find(".map_btn").off("click");
                        container.find(".map_btn").on("click", function () {
                            var pointer = {
                                lng: ""
                                , lat: ""
                            };
                            if (map.indexOf(",") != -1) {
                                pointer.lng = map.split(",")[0];
                                pointer.lat = map.split(",")[1];
                            }
                            link.setMap(container, pointer);
                        });

                        container.find(".addQrCode").off("click");
                        container.find(".addQrCode").on("click", function () {
                            var ecodeid = $(this).attr("id").replace("qrCode", "ecode");
                            container.find("#" + ecodeid).trigger("click");
                        });

                        container.find("#ecode1,#ecode2").change(function () {
                            var objUrl = common.fn.createObjectURL(this.files[0]);
                            var qrCodeid = $(this).attr("id").replace("ecode", "qrCode");
                            if (objUrl != null) {
                                container.find("#" + qrCodeid).css({
                                    "background-image": "url(" + objUrl + ")"
                                });
                                container.find("#" + qrCodeid).html("");
                            }
                            link.sumbitEvent(container);
                        });

                        container.find("input").off("input propertychange");
                        container.find("input").on("input propertychange", function () {
                            link.sumbitEvent(container);
                        });
                        container.find(".base_btn").off('click');

                    });
                }
                else {
                    spinkit.remove();
                    var errDialog = dialog.dialog(result.message, {
                        width: 400
                        , callback: function (notykit) {
                            if (parseInt(result.code) <= -100005 && parseInt(result.code) >= -100011) {
                                login.loginOut(null, function () {
                                    index.init();
                                })
                            }
                            errDialog.Close();
                        }
                    });
                }
            }, true, 'post', 'json');
        },
        sumbitEvent: function (container) {
            container.find(".base_btn").removeClass("hidden_btn").addClass("sumbit_btn");
            container.find(".base_btn").off('click');
            container.find(".base_btn").on('click', function () {
                var confirmDialog = dialog.confirm("确定现在提交吗?", {
                    width: 400
                    , submit: function () {
                        link.sumbit(container);
                        confirmDialog.Close();
                    }
                });
            });
        },
        sumbit: function (container) {
            var form = container.find("#submitForm");
            DataLoad.PostForm(updateApi, form, function (result) {
                if (result.status === "success") {
                    var infoDialog = dialog.notify("操作成功!", {
                        width: 400
                        , callback: function (notykit) {
                            container.find(".base_btn").off('click');
                            container.find(".base_btn").removeClass("sumbit_btn").addClass("hidden_btn");
                            infoDialog.Close();
                        }
                    });
                }
                else {
                    var errDialog = dialog.dialog(result.message, {
                        width: 400
                        , callback: function (notykit) {
                            if (parseInt(result.code) <= -100005 && parseInt(result.code) >= -100011) {
                                login.loginOut(null, function () {
                                    index.init();
                                })
                            }
                            errDialog.Close();
                        }
                    });
                }
            });
        },
        setMap: function (container, oldPointer) {
            var template = ''
                + '<div class="map_container">'
                + '<div class="map_title"></div>'
                + '<div class="map_content" id="map_content">地图加载中...</div>'
                + '<div class="map_boot">'
                + '<div class="map_pointer_info">请拖动图钉定位所在位置...</div>'
                + '<div class="map_sumbit">确定</div>'
                + '</div>'
                + '</div>';
            var loadMapNotyKit = NotyKit.Create({
                width: 600
                , height: 400
                , template: template
                , title: {
                    container: '.map_title'
                    , text: '地图位置标注'
                    , addClass: ''
                }
                , closeItem: [{
                    container: '.map_title'
                    , closeWith: ['click']
                    , text: '<span class="icon-remove" style="margin-right: 10px;"></span>'//当 text 不为空时候下面配置生效
                    , layout: 'centerright'
                    , addClass: 'dialog_close'
                }]
                , callback: {
                    afterShow: function (notykit) {
                        $(".map_sumbit").off("click");
                        $(".map_sumbit").on("click", function () {
                            loadMapNotyKit.Close();
                        });
                    }
                }
            });
            loadMapNotyKit.AutoSize(function () {
                baiduMap.loadMap('map_content', oldPointer, function (point) {
                    var pointerHtml = "当前坐标:" + point.point.lng + " , " + point.point.lat;
                    $(".map_pointer_info").html(pointerHtml);
                }, function (point) {
                    $(".map_sumbit").off("click");
                    $(".map_sumbit").on("click", function () {
                        container.find("#map").val(point.point.lng + "," + point.point.lat);
                        link.sumbitEvent(container);
                        loadMapNotyKit.Close();
                    });
                });
            });
        }
    }

    return {
        init: baseObj.init
    }
});