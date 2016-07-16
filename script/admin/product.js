/**
 * Created by zhangzongshan on 16/7/7.
 */
"use strict";
define(function (require, exports, module) {
    var scriptPath = common.fn.getScriptRoot('common');
    var rootPath = scriptPath.substr(0, scriptPath.indexOf('_assets/'));
    seajs.use([
        rootPath + '/style/admin/product.css'
        , rootPath + '_assets/js/module/page/page.css'
        , rootPath + '_assets/js/public/select2-4.0.3/css/select2.css'
    ]);
    var page = require('../../_assets/js/module/page/page');
    var productTabsKit = require('../../_assets/js/module/tabskit/tabskit');
    var login = require('../admin/login');
    var dialog = require('../../script/public/input_dialog_info');
    var ueditorConfig = require('../public/ueditor_config');
    var index = require('../../script/admin/index');
    var baiduMap = require('../../script/admin/set_map_pointer');
    var tables = require('../public/tables_config');
    var imgInput = require('../../_assets/js/module/imginput/imginput.min');
    //加载 select2
    require('../../_assets/js/public/select2-4.0.3/js/select2.full.min');

    var cateUpdateApi = apiRoot + '/api/cate/update';
    var cateListApi = apiRoot + '/api/cate/list';
    var delCateApi = apiRoot + '/api/cate/del';
    var childCateUpdateApi = apiRoot + '/api/cate/child/update';
    var childCateListApi = apiRoot + '/api/cate/child/list';
    var childDelCateApi = apiRoot + '/api/cate/child/del';
    var productUpdateApi = apiRoot + '/api/product/update';
    var productListApi = apiRoot + '/api/product/list';
    var productDelApi = apiRoot + '/api/product/del';
    var imageApi = apiRoot + '/api/Images';

    var bdEditor = null;

    DataLoad.Debug(true);
    var cate = {
        errMessage: [],
        search: {
            name: null
            , current: 1
            , pageSize: 5
        },
        child_search: {
            cate_id: null
            , current: 1
            , pageSize: 5
        },
        table: null,
        childTable: null,
        init: function (container) {
            container = $(container);
            var spinkit = SpinKit.Create({
                color: '#1f548a'
            });
            DataLoad.GetFile("cate_html", rootPath + "/html/admin/product/cate.html", function (html) {
                spinkit.remove();
                container.html(html);

                container.find(".search_sumbit_btn").off('click');
                container.find(".search_sumbit_btn").on('click', function () {
                    cate.list(container);
                });
                container.find(".add_sumbit_btn").off("click");
                container.find(".add_sumbit_btn").on("click", function () {
                    cate.cateInfo(container);
                });
                cate.list(container);
            });
        },
        list: function (container) {
            var name = container.find("#name").val();
            if (name != "") {
                cate.search.name = name;
            }
            else {
                cate.search.name = null;
            }

            var spinkit = SpinKit.Create({
                color: '#1f548a'
            });
            DataLoad.GetData(null, cateListApi, cate.search, function (result) {
                spinkit.remove();
                dialog.dataResult(result, function () {
                    cate.fillTable(result, container)
                }, function () {
                    container.html("");
                });
            }, true, 'post', 'json');
        },
        fillTable: function (result, container) {
            var tabledata = [];
            var tableColumns = [
                {data: "logopic", class: "dt-center", width: "100px"}
                , {data: "info", class: "dt-left", width: "200px"}
                , {data: "detail", class: "dt-left"}
                , {data: "option", class: "dt-center", width: "180px"}
            ];

            if (result.resultObject != null && result.resultObject.data != null) {
                var listData = result.resultObject.data;
                $.each(listData, function (index, item) {
                    var id = item.id;
                    var logo = item.logo;
                    var name = item.name;
                    var website = item.website;
                    var detail = common.string.removeHtml(common.fn.htmlDecode(item.detail));

                    var orginData = {
                        id: id
                        , logo: logo
                        , name: name
                        , website: website
                        , detail: common.fn.htmlDecode(item.detail)
                    };


                    var logopic = '<div class="list_cate_logo" style="background-image: url(' + imageApi + '?img=ProductCate/' + logo + ');"></div>'
                    var info = '<div class="list_team_info">'
                        + '<div class="list_team_info_item">' + common.string.subString(name, 24, '...') + '</div>'
                        + '<div class="list_team_info_item" style="color: #888;font-size: 12px;">' + common.string.subString(website, 30, '...') + '</div>'
                        + '</div>';
                    var detail_str = common.string.subString(detail, 140, '...');
                    var option = '<div class="list_cate_option">'
                        + '<span class="list_cate">分类</span>'
                        + '<span class="list_edit">编辑</span>'
                        + '<span class="list_del">删除</span>'
                        + '</div>';

                    tabledata.push({
                        logopic: logopic
                        , info: info
                        , detail: detail_str
                        , option: option
                        , orginData: orginData
                    });
                });

                page.create({
                    obj: container.find(".page_container")
                    , pageSize: cate.search.pageSize
                    , current: cate.search.current
                    , totalPage: result.resultObject.totalPage
                    , totalRecord: result.resultObject.totalRecord
                    , input: true
                    , defaultPageSize: 5
                    , callback: function (pageation) {
                        cate.search.pageSize = pageation.pageSize;
                        cate.search.current = pageation.current;
                        cate.list(container);
                    }
                });
            }
            else {
                container.find(".page_container").empty();
            }

            if (cate.table != null) {
                cate.table.destroy();
            }
            cate.table = tables.init(container.find("#table_id"), tabledata, tableColumns, function () {

                container.find(".list_cate").off("click");
                container.find(".list_cate").on("click", function () {
                    var tr = $(this).parents("tr");
                    var data = cate.table.row(tr).data();
                    cate.child_cate(data);
                });
                container.find(".list_edit").off("click");
                container.find(".list_edit").on("click", function () {
                    var tr = $(this).parents("tr");
                    var data = cate.table.row(tr).data();
                    cate.cateInfo(container, data);
                });
                container.find(".list_del").off("click");
                container.find(".list_del").on("click", function () {
                    var tr = $(this).parents("tr");
                    var data = cate.table.row(tr).data();
                    cate.del(container, data.orginData.id);
                });
            });
        },
        cateInfo: function (container, data) {
            DataLoad.GetFile("addcate_Html", rootPath + "/html/admin/product/cate_add.html", function (html) {
                container.html(html);
                var detailContent = "";
                var form = container.find("#submitForm");

                if (data != null) {
                    var orginData = data.orginData;
                    var id = orginData.id;
                    var logo = orginData.logo;
                    var name = orginData.name;
                    var website = orginData.website;
                    var detail = orginData.detail;


                    detailContent = detail;

                    form.find(".title").html(form.find(".title").html().replace("添加分类", "修改分类"));

                    form.append('<input type="hidden" id="id" name="id" value="' + id + '">');
                    if (logo != "") {
                        form.find("#photo_btn").css({
                            "background-image": "url(" + imageApi + '?img=ProductCate/' + logo + ")"
                        });
                        form.find("#photo_btn").html("");
                    }

                    form.find("#name").val(name);
                    form.find("#website").val(website);
                    form.find("#detail").val(detail);
                }

                form.find("#photo_btn").off("click");
                form.find("#photo_btn").on("click", function () {
                    form.find("#logo").trigger("click");
                });

                form.find("#logo").change(function () {
                    var objUrl = common.fn.createObjectURL(this.files[0]);
                    if (objUrl != null) {
                        form.find("#photo_btn").css({
                            "background-image": "url(" + objUrl + ")"
                        });
                        form.find("#photo_btn").html("");
                    }
                });

                var htmlContent = ''
                    + '<div class="editor" id="cate_editor" name="cate_editor" type="text/plain">'
                    + '</div>';
                form.find('#cate_content').html(htmlContent);
                if (bdEditor !== null) {
                    bdEditor.destroy();
                    bdEditor = null;
                }
                bdEditor = UE.getEditor('cate_editor', ueditorConfig.config());
                bdEditor.ready(function () {
                    bdEditor.setContent(detailContent);
                    bdEditor.addListener('contentChange', function () {
                        var content = bdEditor.getContent();
                        form.find("#detail").val(content);
                    });
                });

                form.find(".sumbit_btn").off("click");
                form.find(".sumbit_btn").on("click", function () {
                    var confirmDialog = dialog.confirm("确定现在提交吗?", {
                        width: 400
                        , submit: function () {
                            cate.sumbit(container);
                            confirmDialog.Close();
                        }
                    });
                });

                form.find(".cancle_btn").off("click");
                form.find(".cancle_btn").on("click", function () {
                    var confirmDialog = dialog.confirm("确定现在返回列表吗?<br>如果返回,数据将不保存.", {
                        width: 400
                        , submit: function () {
                            confirmDialog.Close();
                            NotyKit.Destroy();
                            container.html("");
                            cate.init(container);
                        }
                    });
                });
            });
        },
        sumbit: function (container) {
            if (this.verify(container)) {
                container.find("#detail").val(common.fn.htmlEncode(container.find("#detail").val()));
                var form = container.find("#submitForm");
                var spinkit = SpinKit.Create({
                    color: '#1f548a'
                });
                DataLoad.PostForm(cateUpdateApi, form, function (result) {
                    spinkit.remove();
                    dialog.dataResult(result, function () {
                        container.html("");
                        cate.init(container);
                    }, function () {

                    }, {
                        success: '分类添加成功!'
                        , fail: ''
                    });
                });
            }
        },
        verify: function (container) {
            this.errMessage = [];
            var verifyFlg = true;
            var name = container.find("#name").val();
            if (name === null || name === '') {
                this.errMessage.push({
                    obj: container.find("#name")
                    , message: "品牌名称不能为空!"
                });
                verifyFlg = false;
            }

            var logo = container.find("#logo").val();
            if (logo === '') {
                this.errMessage.push({
                    obj: container.find("#photo_btn")
                    , message: "Logo图片必须上传!"
                });
                verifyFlg = false;
            }

            var website = container.find("#website").val();
            if (website === '') {
                this.errMessage.push({
                    obj: container.find("#website")
                    , message: "官方网站必须填写!"
                });
                verifyFlg = false;
            } else {
                if (!validator.isURL(website, {protocols: ['http', 'https']})) {
                    this.errMessage.push({
                        obj: container.find("#website")
                        , message: "官方网站格式不对!"
                    });
                    verifyFlg = false;
                }
            }
            var detail = container.find("#detail").val();
            if (detail === '') {
                this.errMessage.push({
                    obj: container.find("#cate_content")
                    , message: "详细介绍必须填写!"
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
        },
        del: function (container, id) {
            var confirmDialog = dialog.confirm("确定删除吗??<br>如果删除,数据将无法恢复.", {
                width: 400
                , submit: function () {
                    var spinkit = SpinKit.Create({
                        color: '#1f548a'
                    });
                    DataLoad.GetData(null, delCateApi, {id: id}, function (result) {
                        spinkit.remove();
                        dialog.dataResult(result, function () {
                            cate.list(container);
                        }, function () {
                            container.html("");
                            cate.init(container);
                        }, {
                            success: '分类删除成功!'
                            , fail: ''
                        });
                    });
                    confirmDialog.Close();
                }
            });
        },
        child_cate: function (data) {
            var orginData = data.orginData;
            var id = orginData.id;
            var name = orginData.name;
            cate.child_search = {
                cate_id: id
                , current: 1
                , pageSize: 5
            };
            var spinkit = SpinKit.Create({
                color: '#1f548a'
            });
            DataLoad.GetFile("child_cate_html", rootPath + "/html/admin/product/child_cate.html", function (html) {
                spinkit.remove();

                var childCateDialog = dialog.windows(name + "分类管理", html, {
                    width: 600
                    , height: 400
                    , titleClass: 'windows_title'
                });
                var container = childCateDialog.notyKitObj;

                container.find(".add_sumbit_btn").off("click");
                container.find(".add_sumbit_btn").on("click", function () {
                    cate.childSumbit(childCateDialog);
                });
                cate.child_cate_list(childCateDialog);
            });
        },
        child_cate_list: function (childCateDialog) {
            var container = childCateDialog.notyKitObj;
            var spinkit = SpinKit.Create({
                color: '#1f548a'
            });
            DataLoad.GetData(null, childCateListApi, cate.child_search, function (result) {
                spinkit.remove();
                dialog.dataResult(result, function () {
                    cate.child_cate_fillTable(childCateDialog, result)
                }, function () {
                    container.html("");
                });
            }, true, 'post', 'json');
        },
        child_cate_fillTable: function (childCateDialog, result) {
            var container = childCateDialog.notyKitObj;
            var tabledata = [];
            var tableColumns = [
                {data: "id", class: "dt-center", width: "80px"}
                , {data: "cate_name", class: "dt-left", width: "200px"}
                , {data: "option", class: "dt-center", width: "180px"}
            ];

            if (result.resultObject != null && result.resultObject.data != null) {
                var listData = result.resultObject.data;
                $.each(listData, function (index, item) {
                    var id = item.id;
                    var cate_name = item.cate_name;
                    var cate_id = item.cate_id;

                    var orginData = {
                        id: id
                        , cate_name: cate_name
                        , cate_id: cate_id
                    };

                    var option = '<div class="list_cate_option">'
                        + '<span class="list_edit">编辑</span>'
                        + '<span class="list_del">删除</span>'
                        + '</div>';

                    tabledata.push({
                        id: id
                        , cate_name: cate_name
                        , option: option
                        , orginData: orginData
                    });
                });

                page.create({
                    obj: container.find(".page_container")
                    , pageSize: cate.child_search.pageSize
                    , current: cate.child_search.current
                    , totalPage: result.resultObject.totalPage
                    , totalRecord: result.resultObject.totalRecord
                    , input: true
                    , defaultPageSize: 5
                    , callback: function (pageation) {
                        cate.child_search.pageSize = pageation.pageSize;
                        cate.child_search.current = pageation.current;
                        cate.child_cate_list(childCateDialog);
                    }
                });
            }
            else {
                container.find(".page_container").empty();
            }

            if (cate.childTable != null) {
                cate.childTable.destroy();
            }
            cate.childTable = tables.init(container.find("#table_id"), tabledata, tableColumns, function () {

                container.find(".list_edit").off("click");
                container.find(".list_edit").on("click", function () {
                    var tr = $(this).parents("tr");
                    var data = cate.childTable.row(tr).data();
                    cate.childCateInfo(childCateDialog, data);
                });

                container.find(".list_del").off("click");
                container.find(".list_del").on("click", function () {
                    var tr = $(this).parents("tr");
                    var data = cate.childTable.row(tr).data();
                    cate.childDel(childCateDialog, data.orginData.id);
                });

                childCateDialog.AutoSize();
            });
        },
        childSumbit: function (childCateDialog) {
            var container = childCateDialog.notyKitObj;
            if (this.childVerify(container)) {
                var confirmDialog = dialog.confirm("确定现在提交吗?", {
                    width: 400
                    , submit: function () {
                        var form = container.find("#submitForm");
                        form.find("#cate_id").remove();
                        form.append('<input type="hidden" id="cate_id" name="cate_id" value="' + cate.child_search.cate_id + '">');
                        var spinkit = SpinKit.Create({
                            color: '#1f548a'
                        });
                        DataLoad.PostForm(childCateUpdateApi, form, function (result) {
                            spinkit.remove();
                            dialog.dataResult(result, function () {
                                form.find("#name").val("");
                                form.find("#cate_id").remove();
                                form.find("#id").remove();
                                form.find(".add_sumbit_btn").html("添加");
                                cate.child_cate_list(childCateDialog, cate.child_search.cate_id);
                            }, function () {

                            }, {
                                success: form.find("#id").length > 0 ? '分类修改成功' : '分类添加成功!'
                                , fail: ''
                            });
                        });
                        confirmDialog.Close();
                    }
                });
            }
        },
        childVerify: function (container) {
            var name = container.find("#name").val();
            var errMessag = [];
            var verifyFlg = true;
            if (name === "" || name.replace(/ /g, "") === "") {
                errMessag.push({
                    obj: container.find("#name")
                    , message: "分类名称必须填写!"
                });
                verifyFlg = false;
            }

            if (!verifyFlg) {
                dialog.err(errMessag, {
                    width: 200
                    , height: 20
                    , msgClass: 'login_err'
                    , layout: 'centerleft'
                    , background: 'rgba(255,255,255,.8)'
                });
            }
            return verifyFlg;
        },

        childCateInfo: function (childCateDialog, data) {
            var container = childCateDialog.notyKitObj;
            var form = container.find("#submitForm");
            form.find("#id").remove();
            form.append('<input type="hidden" id="id" name="id" value="' + data.orginData.id + '">');
            form.find("#name").val(data.orginData.cate_name);
            form.find(".add_sumbit_btn").html("修改");
        },
        childDel: function (childCateDialog, id) {
            var confirmDialog = dialog.confirm("确定删除吗??<br>如果删除,数据将无法恢复.", {
                width: 400
                , submit: function () {
                    var spinkit = SpinKit.Create({
                        color: '#1f548a'
                    });
                    DataLoad.GetData(null, childDelCateApi, {id: id}, function (result) {
                        spinkit.remove();
                        dialog.dataResult(result, function () {
                            cate.child_cate_list(childCateDialog);
                        }, function () {

                        }, {
                            success: '分类删除成功!'
                            , fail: ''
                        });
                    });
                    confirmDialog.Close();
                }
            });
        }

    };

    var product = {
        errMessage: [],
        search: {
            name: null
            , cate: null
            , child_cate: null
            , current: 1
            , pageSize: 5
        },
        table: null,
        init: function (container) {
            container = $(container);
            var spinkit = SpinKit.Create({
                color: '#1f548a'
            });
            DataLoad.GetFile("product_html", rootPath + "/html/admin/product/product.html", function (html) {
                spinkit.remove();
                container.html(html);

                container.find("#cate").select2({
                    placeholder: {
                        id: '-1', // the value of the option
                        text: '请选择名牌...'
                    }
                    , data: []
                });
                container.find("#child_cate").select2({
                    placeholder: {
                        id: '-1', // the value of the option
                        text: '选择分类...'
                    }
                    , data: []
                });

                product.selectInputData(container.find("#cate"), cateListApi, {
                    name: null
                    , current: 1
                    , pageSize: 1000
                }, "name", '请选择名牌...');

                container.find("#cate").on('change', function () {
                    product.selectInputData(container.find("#child_cate"), childCateListApi, {
                        cate_id: container.find("#cate").val()
                        , current: 1
                        , pageSize: 1000
                    }, "cate_name", '选择分类...');
                });

                container.find(".search_sumbit_btn").off('click');
                container.find(".search_sumbit_btn").on('click', function () {
                    product.list(container);
                });
                container.find(".add_sumbit_btn").off("click");
                container.find(".add_sumbit_btn").on("click", function () {
                    product.cateInfo(container);
                });
                product.list(container);
            });
        },
        list: function (container) {
            var spinkit = SpinKit.Create({
                color: '#1f548a'
            });
            var name = container.find("#name").val();
            if (name != "") {
                product.search.name = name;
            }
            else {
                product.search.name = null;
            }
            var cate = container.find("#cate").val();
            if (cate != "" && cate != "-1") {
                product.search.cate = cate;
            }
            else {
                product.search.cate = null;
            }
            var child_cate = container.find("#child_cate").val();
            if (child_cate != null && child_cate != "-1" && child_cate != "") {
                product.search.child_cate = child_cate;
            }
            else {
                product.search.child_cate = null;
            }
            DataLoad.GetData(null, productListApi, product.search, function (result) {
                spinkit.remove();
                dialog.dataResult(result, function () {
                    product.fillTable(result, container);
                }, function () {
                    container.html("");
                });
            }, true, 'post', 'json');
        },
        fillTable: function (result, container) {
            var tabledata = [];
            var tableColumns = [
                {data: "pic", class: "dt-center", width: "100px"}
                , {data: "info", class: "dt-left", width: "200px"}
                , {data: "detail", class: "dt-left"}
                , {data: "option", class: "dt-center", width: "180px"}
            ];

            if (result.resultObject != null && result.resultObject.data != null) {
                var listData = result.resultObject.data;
                $.each(listData, function (index, item) {
                    var id = item.id;
                    var pic = item.pic;
                    var name = item.name;
                    var pic_index = item.pic_index;
                    var cate = item.cate;
                    var cate_name = item.cate_name;
                    var child_cate = item.child_cate;
                    var child_cate_name = item.child_cate_name;
                    var detail = common.string.removeHtml(common.fn.htmlDecode(item.detail));

                    var orginData = {
                        id: id
                        , pic: pic
                        , pic_index: pic_index
                        , name: name
                        , cate: cate
                        , child_cate: child_cate
                        , detail: common.fn.htmlDecode(item.detail)
                    };
                    var showPic = "";
                    if (pic != "") {
                        var arrPic = pic.split(',');
                        if (pic_index != "") {
                            showPic = arrPic[pic_index];
                        } else {
                            showPic = arrPic[0];
                        }
                    }

                    var picInfo = '<div class="list_cate_logo" style="background-image: url(' + imageApi + '?img=ProductImg/' + showPic + ');"></div>'
                    var info = '<div class="list_team_info">'
                        + '<div class="list_team_info_item"><b>' + common.string.subString(name, 24, '...') + '</b></div>'
                        + '<div class="list_team_info_item" style="color: #888;font-size: 12px;">'
                        + '<div >品牌:<span class="herfItem">'+common.string.subString(cate_name, 20, '...')+'</span></div>'
                        + '<div >类别:<span class="herfItem">'+common.string.subString(child_cate_name, 20, '...')+'</span></div>'
                        + '</div>'
                        + '</div>';
                    var detail_str = common.string.subString(detail, 140, '...');
                    var option = '<div class="list_cate_option">'
                        + '<span class="list_edit">编辑</span>'
                        + '<span class="list_del">删除</span>'
                        + '</div>';

                    tabledata.push({
                        pic: picInfo
                        , info: info
                        , detail: detail_str
                        , option: option
                        , orginData: orginData
                    });
                });

                page.create({
                    obj: container.find(".page_container")
                    , pageSize: product.search.pageSize
                    , current: product.search.current
                    , totalPage: result.resultObject.totalPage
                    , totalRecord: result.resultObject.totalRecord
                    , input: true
                    , defaultPageSize: 5
                    , callback: function (pageation) {
                        product.search.pageSize = pageation.pageSize;
                        product.search.current = pageation.current;
                        product.list(container);
                    }
                });
            }
            else {
                container.find(".page_container").empty();
            }

            if (product.table != null) {
                product.table.destroy();
            }
            product.table = tables.init(container.find("#table_id"), tabledata, tableColumns, function () {

                container.find(".list_edit").off("click");
                container.find(".list_edit").on("click", function () {
                    var tr = $(this).parents("tr");
                    var data = product.table.row(tr).data();
                    product.cateInfo(container, data);
                });
                container.find(".list_del").off("click");
                container.find(".list_del").on("click", function () {
                    var tr = $(this).parents("tr");
                    var data = product.table.row(tr).data();
                    product.del(container, data.orginData.id);
                });
            });
        },
        cateInfo: function (container, data) {
            DataLoad.GetFile("product_html", rootPath + "/html/admin/product/product_add.html", function (html) {
                container.html(html);
                var form = container.find("#submitForm");

                var detailContent = "";
                var cate = "";
                var child_cate = "";
                var pic_index = 0;
                var arrPic = [];
                if (data != null) {
                    var orginData = data.orginData;

                    var id = orginData.id;
                    var pic = orginData.pic;
                    var name = orginData.name;
                    pic_index = orginData.pic_index;
                    cate = orginData.cate;
                    child_cate = orginData.child_cate;
                    var detail = orginData.detail;

                    detailContent = detail;
                    arrPic = pic.split(',');

                    form.find(".title").html(form.find(".title").html().replace("添加产品", "修改产品信息"));

                    form.append('<input type="hidden" id="id" name="id" value="' + id + '">');
                    form.find("#name").val(name);
                    form.find("#detail").val(detail);
                }

                form.find("#cate").select2({
                    placeholder: {
                        id: '-1', // the value of the option
                        text: '请选择名牌...'
                    }
                    , data: []
                });


                form.find("#child_cate").select2({
                    placeholder: {
                        id: '-1', // the value of the option
                        text: '选择分类...'
                    }
                    , data: []
                });
                product.selectInputData(form.find("#cate"), cateListApi, {
                    name: null
                    , current: 1
                    , pageSize: 1000
                }, "name", '请选择名牌...', cate);

                form.find("#cate").on('change', function () {
                    product.selectInputData(form.find("#child_cate"), childCateListApi, {
                        cate_id: form.find("#cate").val()
                        , current: 1
                        , pageSize: 1000
                    }, "cate_name", '选择分类...', child_cate);
                });

                var picInput = imgInput.Create(arrPic, {
                    obj: form.find('.product_img_container')
                    , rootpath: imageApi + '?img=ProductImg/'
                    , class: "logo_img"
                    , height: 100
                    , name: "productPic"
                    , infoItem: {
                        text: "<div></div>"
                        , class: "innerInfo"
                        , item: [{
                            text: "<span class='icon-home'></span>"
                            , class: "innerItem"
                            , callback: function (imgObj) {
                                if (imgObj.find('.innerActive').length < 1) {
                                    imgObj.closest(".product_img_container").find(".icon-home").removeClass("innerActive");
                                    imgObj.find('.icon-home').addClass("innerActive");
                                }
                                else {
                                    imgObj.find('.icon-home').removeClass("innerActive");
                                }
                            }
                        }, {
                            text: "<span class='icon-trash'></span>"
                            , class: "innerItem"
                            , callback: function (imgObj) {
                                var confirmDialog = dialog.confirm("确定删除该图片吗?", {
                                    width: 400
                                    , submit: function () {
                                        confirmDialog.Close();
                                        imgObj.remove();
                                        picInput.redraw();
                                    }
                                });
                            }
                        }]
                    }
                    , callback: function () {
                        if(form.find(".icon-home").length>pic_index){
                            $(form.find(".icon-home")[pic_index]).addClass("innerActive");
                        }
                    }
                });

                var htmlContent = ''
                    + '<div class="editor" id="product_editor" name="product_editor" type="text/plain">'
                    + '</div>';
                form.find('#product_content').html(htmlContent);

                if (bdEditor !== null) {
                    bdEditor.destroy();
                    bdEditor = null;
                }
                bdEditor = UE.getEditor('product_editor', ueditorConfig.config());
                bdEditor.ready(function () {
                    bdEditor.setContent(detailContent);
                    bdEditor.addListener('contentChange', function () {
                        var content = bdEditor.getContent();
                        form.find("#detail").val(content);
                    });
                });

                form.find(".sumbit_btn").off("click");
                form.find(".sumbit_btn").on("click", function () {
                    var pic_index = 0;
                    if (form.find(".innerActive").length > 0) {
                        var pics = form.find(".innerActive").closest(".product_img_container").find(".icon-home");
                        pic_index = pics.index(form.find(".innerActive"));
                    }
                    form.find("#pic_index").remove();
                    form.append('<input type="hidden" name="pic_index" id="pic_index" value="' + pic_index + '">');
                    var confirmDialog = dialog.confirm("确定现在提交吗?", {
                        width: 400
                        , submit: function () {
                            product.sumbit(container, picInput);
                            confirmDialog.Close();
                        }
                    });
                });

                form.find(".cancle_btn").off("click");
                form.find(".cancle_btn").on("click", function () {
                    var confirmDialog = dialog.confirm("确定现在返回列表吗?<br>如果返回,数据将不保存.", {
                        width: 400
                        , submit: function () {
                            confirmDialog.Close();
                            NotyKit.Destroy();
                            container.html("");
                            product.init(container);
                        }
                    });
                });

            });
        },
        selectInputData: function (obj, url, parameter, selectType, placeholder_text, value) {
            obj.empty();
            DataLoad.GetData(null, url, parameter, function (result) {
                var data = [{
                    id: '-1', // the value of the option
                    text: placeholder_text
                }];
                if (result.status === 'success') {
                    var cateData = result.resultObject.data;
                    $.each(cateData, function (index, item) {
                        data.push({id: item.id, text: selectType === 'cate_name' ? item.cate_name : item.name})
                    });
                }
                var selectObj = obj.select2({
                    placeholder: {
                        id: '-1', // the value of the option
                        text: placeholder_text
                    }
                    , data: data
                    , allowClear: true
                    , selectOnClose: false
                    , language: "zh-CN"
                });
                if (value != "" && value != null) {
                    selectObj.val(value).trigger("change");
                }
            }, true, 'post', 'json');
        },
        sumbit: function (container, picInput) {
            if (this.verify(container, picInput)) {
                container.find("#detail").val(common.fn.htmlEncode(container.find("#detail").val()));
                var form = container.find("#submitForm");
                var spinkit = SpinKit.Create({
                    color: '#1f548a'
                });
                DataLoad.PostForm(productUpdateApi, form, function (result) {
                    spinkit.remove();
                    dialog.dataResult(result, function () {
                        container.html("");
                        product.init(container);
                    }, function () {

                    }, {
                        success: container.find("#id").length > 0 ? '产品修改成功!' : '产品添加成功!'
                        , fail: ''
                    });
                });
            }
        },
        verify: function (container, picInput) {
            this.errMessage = [];
            var verifyFlg = true;
            var name = container.find("#name").val();
            if (name === null || name === '') {
                this.errMessage.push({
                    obj: container.find("#name")
                    , message: "产品名称不能为空!"
                });
                verifyFlg = false;
            }

            var cate = container.find("#cate").val();
            if (cate === '-1') {
                this.errMessage.push({
                    obj: container.find("#cate").closest(".item_right").find(".select2-container").first()
                    , message: "必须选择一个品牌!"
                });
                verifyFlg = false;
            }

            var child_cate = container.find("#child_cate").val();
            if (child_cate === '-1') {
                this.errMessage.push({
                    obj: container.find("#child_cate").closest(".item_right").find(".select2-container").first()
                    , message: "必须选择一个分类!"
                });
                verifyFlg = false;
            }

            var productPic = picInput.getdata();
            if (productPic.length == 0) {
                this.errMessage.push({
                    obj: container.find(":file")
                    , message: "必须选择一个分类!"
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
        },
        del: function (container, id) {
            var confirmDialog = dialog.confirm("确定删除吗??<br>如果删除,数据将无法恢复.", {
                width: 400
                , submit: function () {
                    var spinkit = SpinKit.Create({
                        color: '#1f548a'
                    });
                    DataLoad.GetData(null, productDelApi, {id: id}, function (result) {
                        spinkit.remove();
                        dialog.dataResult(result, function () {
                            product.list(container);
                        }, function () {

                        }, {
                            success: '产品删除成功!'
                            , fail: ''
                        });
                    });
                    confirmDialog.Close();
                }
            });
        }
    }

    var PObj = {
        init: function (menu_container, content_container) {
            var pTabsKit = new productTabsKit.Create({
                obj: $(menu_container)
                , id: "prdouct_menu"
                , autowidth: false
                , container: $(content_container)
                , showtabs: 'p_list'
                , direct: 'Portrait'
                , tabs: [{
                    id: 'p_cate'
                    , normal: 'tabs_menu_normal'
                    , active: 'tabs_menu_active'
                    , html: '<span> 分录管理</span>'
                    , fn: function () {
                        PObj.load(content_container, 'p_cate');
                    },
                    content: ''
                }, {
                    id: 'p_list'
                    , normal: 'tabs_menu_normal'
                    , active: 'tabs_menu_active'
                    , html: '<span>产品列表</span>'
                    , fn: function () {
                        PObj.load(content_container, 'p_list');
                    }
                    , content: ''
                }]
            });
        },
        load: function (content_container, case_type) {
            NotyKit.Destroy();
            switch (case_type) {
                case "p_cate": {
                    cate.init(content_container);
                    break;
                }
                case "p_list": {
                    product.init(content_container);
                    break;
                }
            }
        }
    }

    return {
        init: PObj.init
    }
});