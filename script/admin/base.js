/**
 * Created by zhangzongshan on 16/6/23.
 */
"use strict"
define(function (require, exports, module) {
    var scriptPath = common.fn.getScriptRoot('common');
    var rootPath = scriptPath.substr(0, scriptPath.indexOf('_assets/'));
    seajs.use([
        rootPath + '/style/admin/base.css'
        , rootPath + '_assets/js/module/page/page.css'
    ]);
    var page = require('../../_assets/js/module/page/page');
    var basetabsKit = require('../../_assets/js/module/tabskit/tabskit');
    var login = require('../admin/login');
    var dialog = require('../../script/public/input_dialog_info');
    var ueditorConfig = require('../public/ueditor_config');
    var index = require('../../script/admin/index');
    var baiduMap = require('../../script/admin/set_map_pointer');
    var tables = require('../public/tables_config');

    var getApi = apiRoot + '/api/commpanys/get';
    var getTeamApi = apiRoot + '/api/commpanys/teamlist';
    var updateApi = apiRoot + '/api/commpanys/update';
    var updateTeamApi = apiRoot + '/api/commpanys/teamUpdate';

    var imageApi = apiRoot + '/api/Images';

    var bdEditor = null;
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
                case "team":
                {
                    team.init(content_container);
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
        sumbit_content: {
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
                        if (bdEditor !== null) {
                            bdEditor.destroy();
                            bdEditor = null;
                        }
                        bdEditor = UE.getEditor('editor', ueditorConfig.config);
                        bdEditor.ready(function () {
                            bdEditor.setContent(common.fn.htmlDecode(content));
                            bdEditor.addListener('contentChange', function () {
                                container.find(".base_btn").removeClass("hidden_btn").addClass("sumbit_btn");
                                container.find(".base_btn").off('click');
                                container.find(".base_btn").on('click', function () {
                                    var content = bdEditor.getContent();
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
            content = common.fn.htmlEncode(content);
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
                                        "background-image": "url(" + imageApi + "?img=CommpanyImg/" + item + ")"
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
            var spinkit = SpinKit.Create({
                color: '#1f548a'
            });
            DataLoad.PostForm(updateApi, form, function (result) {
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

    var team = {
        errMessage: [],
        search: {
            current: 1
            , pageSize: 10
        },
        table: null,
        init: function (container) {
            container = typeof container === 'string' ? $(container) : container;
            var spinkit = SpinKit.Create({
                color: '#1f548a'
            });
            DataLoad.GetFile("teamInfo_Html", rootPath + "/html/admin/base/team_list.html", function (html) {
                spinkit.remove();
                container.html(html);

                container.find(".add_sumbit_btn").off('click');
                container.find(".add_sumbit_btn").on('click', function () {
                    team.add(container);
                });

                team.list(container);
            });
        },
        list: function (container) {
            var spinkit = SpinKit.Create({
                color: '#1f548a'
            });
            DataLoad.GetData(null, getTeamApi, team.search, function (result) {
                spinkit.remove();
                if (result.status === "success") {
                    var tabledata = [];
                    var tableColumns = [
                        {data: "teampic", class: "dt-center", width: "100px"}
                        , {data: "info", class: "dt-left", width: "200px"}
                        , {data: "detail", class: "dt-left"}
                        , {data: "option", class: "dt-center", width: "120px"}
                    ];

                    if (result.resultObject != null && result.resultObject.data != null) {
                        var listData = result.resultObject.data;
                        $.each(listData, function (index, item) {
                            var photo = item.photo;
                            var username = item.username;
                            var name = item.name;
                            var email = item.email;
                            var mobile = item.mobile;
                            var job = item.job;
                            var detailed = common.string.removeHtml(common.fn.htmlDecode(item.detailed));

                            var orginData = {
                                photo: photo
                                , username: username
                                , name: name
                                , email: email
                                , mobile: mobile
                                , job: job
                                , detailed: detailed
                            };


                            var teampic = '<div class="list_team_photo" style="background-image: url(' + imageApi + '?img=TeamImg/' + photo + ');"></div>'
                            var info = '<div class="list_team_info">'
                                + '<div class="list_team_info_item">' + common.string.subString(name + '(' + username + ')', 24, '...') + '</div>'
                                + '<div class="list_team_info_item">' + job + '</div>'
                                + '<div class="list_team_info_item">' + mobile + '</div>'
                                + '</div>';
                            var detailed = common.string.subString(detailed, 180, '...');
                            var option = '<div class="list_team_option">'
                                + '<span class="list_team_edit">编辑</span>'
                                + '<span class="list_team_del">删除</span>'
                                + '</div>';

                            tabledata.push({
                                teampic: teampic
                                , info: info
                                , detail: detailed
                                , option: option
                                , orginData: orginData
                            });


                            // pageCount: option.totalPage,//总页码数
                            //     showCount: option.showCount,//每页显示数据
                            //     current: option.currentPage,//当前页码
                            //     totalResult: option.totalResult,//总记录数据
                            //     input: option.option === true ? true : false,//是否显示页面输入框和详细信息
                            //     backFn: option.callback//回调信息

                            // page.createPage($(".tcdPageCode"), {
                            //         totalPage: pagination.totalPage
                            //         , currentPage: pagination.currentPage
                            //         , showCount: pagination.showCount
                            //         , totalResult: pagination.totalResult
                            //     }, function (params) {
                            //         account_audit_list.searchData.showCount = params.showCount;
                            //         account_audit_list.searchData.currentPage = params.currentPage;
                            //         account_audit_list.list(list_container_obj, containerObj);
                            //     }
                            // );

                        });

                        page.create({
                            obj: container.find(".page_container")
                            , pageSize: team.search.pageSize
                            , current: team.search.current
                            , totalPage: result.resultObject.totalPage
                            , totalRecord: result.resultObject.totalRecord
                            , input: true
                            , callback: function (pageation) {
                                team.search.pageSize = pageation.pageSize;
                                team.search.current = pageation.current;

                                team.list(container);
                            }
                        });
                    }

                    if (team.table != null) {
                        team.table.destroy();
                    }
                    team.table = tables.init(container.find("#table_id"), tabledata, tableColumns, function () {
                        //alert("aa");
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
        add: function (container) {
            DataLoad.GetFile("addteam_Html", rootPath + "/html/admin/base/team_add.html", function (html) {
                container.html($(html));


                container.find("#photo_btn").off("click");
                container.find("#photo_btn").on("click", function () {
                    container.find("#photo").trigger("click");
                });

                container.find("#photo").change(function () {
                    var objUrl = common.fn.createObjectURL(this.files[0]);
                    container.find("#photo_btn").css({
                        "background-image": "url(" + objUrl + ")"
                    });
                    container.find("#photo_btn").html("");
                });

                var htmlContent = ''
                    + '<div class="editor" id="editor" name="editor" type="text/plain">'
                    + '</div>';
                container.find('#team_content').html(htmlContent);
                if (bdEditor !== null) {
                    bdEditor.destroy();
                    bdEditor = null;
                }
                bdEditor = UE.getEditor('editor', ueditorConfig.config);
                bdEditor.ready(function () {
                    bdEditor.addListener('contentChange', function () {
                        var content = bdEditor.getContent();
                        container.find("#detailed").val(content);
                    });
                });

                container.find(".sumbit_btn").off("click");
                container.find(".sumbit_btn").on("click", function () {
                    var confirmDialog = dialog.confirm("确定现在提交吗?", {
                        width: 400
                        , submit: function () {
                            team.sumbit(container);
                            confirmDialog.Close();
                        }
                    });
                });

                container.find(".cancle_btn").off("click");
                container.find(".cancle_btn").on("click", function () {
                    var confirmDialog = dialog.confirm("确定现在返回列表吗?<br>如果返回,数据将不保存.", {
                        width: 400
                        , submit: function () {
                            confirmDialog.Close();
                            container.html("");
                            team.init(container);
                        }
                    });
                });
            });
        },
        sumbit: function (container) {
            if (this.verify(container)) {
                container.find("#detailed").val(common.fn.htmlEncode(container.find("#detailed").val()));
                var form = container.find("#submitForm");
                var spinkit = SpinKit.Create({
                    color: '#1f548a'
                });
                DataLoad.PostForm(updateTeamApi, form, function (result) {
                    spinkit.remove();
                    if (result.status === "success") {
                        var infoDialog = dialog.notify("操作成功!", {
                            width: 400
                            , callback: function (notykit) {
                                container.html("");
                                team.init(container);
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
                                        container.html("");
                                        index.init();
                                    })
                                }
                                errDialog.Close();
                            }
                        });
                    }
                });
            }

        },
        verify: function (container) {
            var verifyFlg = true;
            var username = container.find("#username").val();
            if (username === null || username === '') {
                this.errMessage.push({
                    obj: container.find("#username")
                    , message: "用户名不能为空!"
                });
                verifyFlg = false;
            }
            else {
                if (common.is.isContainCN(username)) {
                    this.errMessage.push({
                        obj: container.find("#username")
                        , message: "用户名不能包括汉字!"
                    });
                    verifyFlg = false;
                }
                else {
                    if (username.length < 5) {
                        this.errMessage.push({
                            obj: container.find("#username")
                            , message: "用户名必须大于4个字符!"
                        });
                        verifyFlg = false;
                    }
                }
            }

            var name = container.find("#name").val();
            if (name === '') {
                this.errMessage.push({
                    obj: container.find("#name")
                    , message: "姓名不能为空!"
                });
                verifyFlg = false;
            }

            if (!verifyFlg) {
                dialog.err(this.errMessage, {
                    width: 200
                    , height: 20
                    , msgClass: 'login_err'
                    , layout: 'centerleft'
                    , background: 'rgba(255,255,255,1)'
                });
            }
            return verifyFlg;
        }
    }

    return {
        init: baseObj.init
    }
});