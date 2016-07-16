/**
 * Created by zhangzongshan on 16/7/13.
 */
"use strict"
define(function (require, exports, module) {

    var scriptPath = common.fn.getScriptRoot('common');
    var rootPath = scriptPath.substr(0, scriptPath.indexOf('_assets/'));
    seajs.use([
        rootPath + '/style/admin/news.css'
        , rootPath + '_assets/js/module/page/page.css'
        , rootPath + '_assets/js/public/select2-4.0.3/css/select2.css'
        , rootPath + '_assets/js/public/icheck/skins/all.css'
        , rootPath + '_assets/js/public/icheck/icheck.min'
        , rootPath + '/_assets/js/public/datepicker/pikaday/pikaday.css'
        //, rootPath + '/_assets/js/public/moment/locale/zh-cn'
    ]);
    var page = require('../../_assets/js/module/page/page');
    var newsTabsKit = require('../../_assets/js/module/tabskit/tabskit');
    var login = require('../admin/login');
    var dialog = require('../../script/public/input_dialog_info');
    var ueditorConfig = require('../public/ueditor_config');
    var index = require('../../script/admin/index');
    var baiduMap = require('../../script/admin/set_map_pointer');
    var tables = require('../public/tables_config');
    var imgInput = require('../../_assets/js/module/imginput/imginput.min');
    var pikaday = require('../../_assets/js/public/datepicker/pikaday/pikaday.min');
    //加载 select2
    require('../../_assets/js/public/select2-4.0.3/js/select2.full.min');

    var cateListApi = apiRoot + '/api/cate/list';
    var newsListApi = apiRoot + '/api/news/list';
    var newsUpdateApi = apiRoot + '/api/news/update';
    var newsDelApi = apiRoot + '/api/news/del';

    var imageApi = apiRoot + '/api/Images';

    var bdEditor = null;

    DataLoad.Debug(true);

    function selectInputData(obj, url, parameter, selectType, placeholder_text, value) {
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
    }

    var news = {
        search: {
            title: null
            , media_type: null
            , cate: null
            , current: 1
            , pageSize: 5
        },
        errMessage: [],
        table: null,
        init: function (container) {
            container = $(container);
            var spinkit = SpinKit.Create({
                color: '#1f548a'
            });
            DataLoad.GetFile("news_html", rootPath + "/html/admin/news/news.html", function (html) {
                spinkit.remove();
                container.html(html);

                container.find("#media_type").select2({
                    placeholder: {
                        id: '-1', // the value of the option
                        text: '请选择类别...'
                    }
                    , data: []
                });
                container.find("#cate").select2({
                    placeholder: {
                        id: '-1', // the value of the option
                        text: '选择分类...'
                    }
                    , data: []
                });

                selectInputData(container.find("#cate"), cateListApi, {
                    name: null
                    , current: 1
                    , pageSize: 1000
                }, "name", '请选择分类...');

                container.find(".search_sumbit_btn").off('click');
                container.find(".search_sumbit_btn").on('click', function () {
                    news.list(container);
                });
                container.find(".add_sumbit_btn").off("click");
                container.find(".add_sumbit_btn").on("click", function () {
                    news.cateInfo(container);
                });
                news.list(container);
            });
        },
        list: function (container) {
            var title = container.find("#title").val();
            if (title != "") {
                news.search.title = title;
            }
            else {
                news.search.title = null;
            }
            var media_type = container.find("#media_type").val();
            if (media_type === "all") {
                news.search.media_type = null;
            }
            else if (media_type === "pic") {
                news.search.media_type = "pic";
            }
            else {
                news.search.media_type = "video";
            }

            var cate = container.find("#cate").val();
            if (cate === "0") {
                news.search.cate = null;
            }
            else {
                news.search.cate = cate;
            }

            var spinkit = SpinKit.Create({
                color: '#1f548a'
            });
            DataLoad.GetData(null, newsListApi, news.search, function (result) {
                spinkit.remove();
                dialog.dataResult(result, function () {
                    news.fillTable(result, container)
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
                    var title = item.title;
                    var media_url = item.media_url;
                    var media_type = item.media_type;
                    var pic_index = item.pic_index;
                    var isShow = item.isShow;
                    var read_count = item.read_count;
                    var times = item.times;
                    var cate = item.cate;
                    var cate_name = item.cate_name;
                    var content = common.string.removeHtml(common.fn.htmlDecode(item.content));

                    var orginData = {
                        id: id
                        , title: title
                        , media_url: media_url
                        , media_type: media_type
                        , pic_index: pic_index
                        , isShow: isShow
                        , read_count: read_count
                        , times: times
                        , cate: cate
                        , cate_name: cate_name
                        , content: common.fn.htmlDecode(item.content)
                    };
                    var showPic = "";
                    if (media_url != "") {
                        var arrPic = media_url.split(',');
                        if (pic_index != "") {
                            showPic = arrPic[pic_index];
                        } else {
                            showPic = arrPic[0];
                        }
                    }

                    var picInfo = '<div class="list_cate_logo" style="background-image: url(' + imageApi + '?img=NewsImg/' + showPic + ');"></div>'
                    var info = '<div class="list_team_info">'
                        + '<div class="list_team_info_item">' + common.string.subString(title, 24, '...') + '</div>'
                        + '<div class="list_team_info_item" style="color: #888;font-size: 12px;">' + common.string.subString(cate_name, 30, '...') + '</div>'
                        + '</div>';
                    var content_str = common.string.subString(content, 140, '...');
                    var option = '<div class="list_cate_option">'
                        + '<span class="list_edit">编辑</span>'
                        + '<span class="list_del">删除</span>'
                        + '</div>';

                    tabledata.push({
                        logopic: picInfo
                        , info: info
                        , detail: content_str
                        , option: option
                        , orginData: orginData
                    });
                });

                page.create({
                    obj: container.find(".page_container")
                    , pageSize: news.search.pageSize
                    , current: news.search.current
                    , totalPage: result.resultObject.totalPage
                    , totalRecord: result.resultObject.totalRecord
                    , input: true
                    , defaultPageSize: 5
                    , callback: function (pageation) {
                        news.search.pageSize = pageation.pageSize;
                        news.search.current = pageation.current;
                        news.list(container);
                    }
                });
            }
            else {
                container.find(".page_container").empty();
            }

            if (news.table != null) {
                news.table.destroy();
            }
            news.table = tables.init(container.find("#table_id"), tabledata, tableColumns, function () {

                container.find(".list_edit").off("click");
                container.find(".list_edit").on("click", function () {
                    var tr = $(this).parents("tr");
                    var data = news.table.row(tr).data();
                    news.cateInfo(container, data);
                });
                container.find(".list_del").off("click");
                container.find(".list_del").on("click", function () {
                    var tr = $(this).parents("tr");
                    var data = news.table.row(tr).data();
                    news.del(container, data.orginData.id);
                });
            });
        },
        cateInfo: function (container) {
            DataLoad.GetFile("product_html", rootPath + "/html/admin/news/news_add.html", function (html) {
                container.html(html);
                var form = container.find("#submitForm");
                var detailContent = "";
                var times = "";
                var mediaInput = null;


                form.find("input:radio").iCheck({
                    checkboxClass: 'icheckbox_minimal-blue',
                    radioClass: 'iradio_minimal-blue',
                    increaseArea: '20%' // optional
                });

                mediaInput = news.input_media_type(form);

                form.find("input[name='media_type']").off('ifChanged');
                form.find("input[name='media_type']").on('ifChanged', function () {
                    NotyKit.Destroy();
                    mediaInput = news.input_media_type(form);
                });

                var htmlContent = ''
                    + '<div class="editor" id="news_editor" name="news_editor" type="text/plain">'
                    + '</div>';
                form.find('#news_content').html(htmlContent);

                if (bdEditor !== null) {
                    bdEditor.destroy();
                    bdEditor = null;
                }
                bdEditor = UE.getEditor('news_editor', ueditorConfig.config("simple"));
                bdEditor.ready(function () {
                    bdEditor.setContent(detailContent);
                    bdEditor.addListener('contentChange', function () {
                        var content = bdEditor.getContent();
                        form.find("#content").val(content);
                    });
                });

                form.find(".calendar").off('click');
                form.find(".calendar").on('click', function () {
                    form.find("#times").trigger('click');
                });

                var picker = new pikaday({
                    field: form.find("#times")[0]
                    // ,disableDayFn:function (day) {
                    //     if(day<moment()){
                    //         return true;
                    //     }
                    // }
                });
                picker.setDate(times === "" ? moment().toDate() : times);

                container.find("#cate").select2({
                    placeholder: {
                        id: '-1', // the value of the option
                        text: '选择分类...'
                    }
                    , data: []
                });

                selectInputData(container.find("#cate"), cateListApi, {
                    name: null
                    , current: 1
                    , pageSize: 1000
                }, "name", '请选择分类...');

                form.find(".sumbit_btn").off("click");
                form.find(".sumbit_btn").on("click", function () {
                    form.find("#pic_index").remove();
                    var media_type = form.find("input[name='media_type']:checked").val();
                    if (media_type === 'pic') {
                        var pic_index = 0;
                        if (form.find(".innerActive").length > 0) {
                            var pics = form.find(".innerActive").closest(".news_img_container").find(".icon-home");
                            pic_index = pics.index(form.find(".innerActive"));
                        }
                        form.append('<input type="hidden" name="pic_index" id="pic_index" value="' + pic_index + '">');
                    }
                    var confirmDialog = dialog.confirm("确定现在提交吗?", {
                        width: 400
                        , submit: function () {
                            news.sumbit(container, mediaInput);
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
                            container.html("");
                            NotyKit.Destroy();
                            news.init(container);
                        }
                    });
                });

            });
        },
        input_media_type: function (form, arrPic, pic_index) {
            arrPic = arrPic != null ? arrPic : [];
            pic_index = pic_index != null ? pic_index : 0;
            form.find(".news_img_container").html('');
            var mediaInput = null;
            var media_type = form.find("input[name='media_type']:checked").val();
            if (media_type === 'pic') {
                var picInput = imgInput.Create(arrPic, {
                    obj: form.find('.news_img_container')
                    , rootpath: imageApi + '?img=NewsImg/'
                    , class: "logo_img"
                    , height: 100
                    , name: "NewsPic"
                    , infoItem: {
                        text: "<div></div>"
                        , class: "innerInfo"
                        , item: [{
                            text: "<span class='icon-home'></span>"
                            , class: "innerItem"
                            , callback: function (imgObj) {
                                if (imgObj.find('.innerActive').length < 1) {
                                    imgObj.closest(".news_img_container").find(".icon-home").removeClass("innerActive");
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
                        if (form.find(".icon-home").length > pic_index) {
                            $(form.find(".icon-home")[pic_index]).addClass("innerActive");
                        }
                    }
                });
                mediaInput = picInput;
            }
            else {
                var videoHtml = ''
                    + '<div >视频封面:</div>'
                    + '<div class="video_pic"></div>'
                    + '<div >视频地址:</div>'
                    + '<div >'
                    + '    <input class="item_input" id="video_url" name="video_url" type="text" style="width: 350px;">'
                    + '</div>'
                    + '<div class="clear"></div>';
                form.find(".news_img_container").html(videoHtml);
                var videoPicInput = imgInput.Create(arrPic, {
                    obj: form.find('.video_pic')
                    , rootpath: imageApi + '?img=NewsImg/'
                    , class: "logo_img"
                    , height: 100
                    , total: 1
                    , name: "NewsPic"
                    , infoItem: {
                        text: "<div></div>"
                        , class: "innerInfo"
                        , item: [{
                            text: "<span class='icon-trash'></span>"
                            , class: "innerItem"
                            , callback: function (imgObj) {
                                var confirmDialog = dialog.confirm("确定删除该图片吗?", {
                                    width: 400
                                    , submit: function () {
                                        confirmDialog.Close();
                                        imgObj.remove();
                                        videoPicInput.redraw();
                                    }
                                });
                            }
                        }]
                    }
                    , callback: function () {

                    }
                });
                mediaInput = videoPicInput;
            }
            return mediaInput;
        },
        sumbit: function (container, mediaInput) {
            if (this.verify(container, mediaInput)) {
                container.find("#content").val(common.fn.htmlEncode(container.find("#content").val()));
                var form = container.find("#submitForm");
                var spinkit = SpinKit.Create({
                    color: '#1f548a'
                });
                DataLoad.PostForm(newsUpdateApi, form, function (result) {
                    spinkit.remove();
                    dialog.dataResult(result, function () {
                        container.html("");
                        news.init(container);
                    }, function () {

                    }, {
                        success: '分类添加成功!'
                        , fail: ''
                    });
                });
            }
        },
        verify: function (container, mediaInput) {
            this.errMessage = [];

            var verifyFlg = true;
            var title = container.find("#title").val();
            if (title === null || title === '') {
                this.errMessage.push({
                    obj: container.find("#title")
                    , message: "标题内容不能为空!"
                });
                verifyFlg = false;
            }

            var media_type = container.find("input[name='media_type']:checked").val();
            if (media_type === 'pic') {
                var newsPic = mediaInput.getdata();
                if (newsPic.length == 0) {
                    this.errMessage.push({
                        obj: container.find(":file")
                        , message: "必须添加图片!"
                    });
                    verifyFlg = false;
                }
            }
            else {
                var newsVideo = mediaInput.getdata();
                if (newsVideo.length == 0) {
                    this.errMessage.push({
                        obj: container.find(":file")
                        , message: "必须添加视频封面图片!"
                    });
                    verifyFlg = false;
                }
                var video_url = container.find("#video_url").val();
                if (video_url === '') {
                    this.errMessage.push({
                        obj: container.find("#video_url")
                        , message: "必须添加视频地址!"
                    });
                    verifyFlg = false;
                } else {
                    if (!validator.isURL(video_url, {protocols: ['http', 'https']})) {
                        this.errMessage.push({
                            obj: container.find("#video_url")
                            , message: "视频地址格式不对!"
                        });
                        verifyFlg = false;
                    }
                }
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
                    DataLoad.GetData(null, newsDelApi, {id: id}, function (result) {
                        spinkit.remove();
                        dialog.dataResult(result, function () {
                            news.list(container);
                        }, function () {

                        }, {
                            success: '作品案例删除成功!'
                            , fail: ''
                        });
                    });
                    confirmDialog.Close();
                }
            });
        }
    };

    var question = {
        init: function (container) {

        }
    };

    var link = {
        init: function (container) {

        }
    };

    var NewsObj = {
        init: function (menu_container, content_container) {
            var pTabsKit = new newsTabsKit.Create({
                obj: $(menu_container)
                , id: "news_menu"
                , autowidth: false
                , container: $(content_container)
                , showtabs: 'news_p_list'
                , direct: 'Portrait'
                , tabs: [{
                    id: 'news_p_list'
                    , normal: 'tabs_menu_normal'
                    , active: 'tabs_menu_active'
                    , html: '<span>作品案例</span>'
                    , fn: function () {
                        NewsObj.load(content_container, 'news_p_list');
                    },
                    content: ''
                }, {
                    id: 'question_list'
                    , normal: 'tabs_menu_normal'
                    , active: 'tabs_menu_active'
                    , html: '<span>常见问题</span>'
                    , fn: function () {
                        NewsObj.load(content_container, 'question_list');
                    }
                    , content: ''
                }, {
                    id: 'link_list'
                    , normal: 'tabs_menu_normal'
                    , active: 'tabs_menu_active'
                    , html: '<span>外部链接</span>'
                    , fn: function () {
                        NewsObj.load(content_container, 'link_list');
                    }
                    , content: ''
                }]
            });
        },
        load: function (content_container, case_type) {
            NotyKit.Destroy();
            switch (case_type) {
                case "news_p_list": {
                    news.init(content_container);
                    break;
                }
                case "question_list": {
                    question.init(content_container);
                    break;
                }
                case "link_list": {
                    link.init(content_container);
                    break;
                }
            }
        }
    }

    return {
        init: NewsObj.init
    }

});