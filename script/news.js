/**
 * Created by zhangzongshan on 16/8/16.
 */
"use strict"
define(function (require, exports, module) {

    var swiper = require('_assets/js/public/swiper/swiper-3.3.1.jquery.min');
    var page = require('_assets/js/module/page/page');
    var scrollCtr = require('_assets/js/module/scrollcontrol/scrollcontrol');

    function showPic(pic, id, config) {
        if (!config) {
            config = {
                width: 940
                , height: 540
                , background: ''
                , layout: 'windowscenter'
                , msgClass: ''
                , titleClass: ''
            };
        }
        var width = (typeof (config.width) === 'number' && config.width > 0) ? config.width : 0;
        var height = (typeof (config.height) === 'number' && config.height > 0) ? config.height : 0;
        var background = (typeof (config.background) === 'string' && config.background != "") ? config.background : '';
        var layout = (typeof (config.layout) === 'string' || typeof (config.layout) === 'object') ? config.layout : 'windowscenter';
        var titleClass = (typeof (config.titleClass) === 'string' && config.titleClass != "") ? config.titleClass : '';
        var msgClass = (typeof (config.msgClass) === 'string' && config.msgClass != "") ? config.msgClass : '';
        var obj = (typeof config.obj === 'object' && config.obj != null) ? config.obj : $("body");
        var zIndex = (typeof (config.zIndex) === 'number' && config.zIndex > 0) ? config.zIndex : common.fn.getmaxZindex() + 1;

        var template = '<div class="config_container">'
            + '<div class="text_title windows_title"></div>'
            + '<div class="pic_content"></div>'
            + '</div>';

        var dialog = NotyKit.Create({
            obj: obj
            , width: width !== 0 ? width : obj.width()
            , height: height !== 0 ? height : obj.height()
            , template: template
            , title: {
                container: '.config_title'
                , text: ""
                , addClass: titleClass
            }
            , text: {
                container: '.pic_content'
                ,
                text: '<div class="show_pic" id="show_' + id + '" style="background-image: url(' + pic + ');"></div>'
                ,
                addClass: msgClass
            }
            , closeItem: [{
                container: '.text_title'
                , closeWith: ['click']
                , text: '<span class="icon-remove" style="margin-right: 10px;"></span>'//当 text 不为空时候下面配置生效
                , layout: 'centerright'
                , addClass: 'text_title config_close'
            }]
            , layout: layout !== '' ? layout : ''
            , background: background !== '' ? background : "rgba(0,0,0,.6)"
            , zIndex: zIndex
            , callback: {
                onShow: function () {
                    scrollCtr.disableScroll();
                },
                afterClose: function () {
                    scrollCtr.enableScroll();
                }
            }
        });
        dialog.AutoSize(function () {
            var dialogObj = dialog.notyKitObj.find(".notykit_content");
            var arrowHtml = $("<div class='arrow_container'><div class='left_arrow'><span class='arrow icon-chevron-left'></span></div><div class='right_arrow'><span class='arrow icon-chevron-right'></span></div></div>");
            arrowHtml.css({
                "position": "absolute"
                , "width": (dialogObj.outerWidth(true) + 60) + "px"
                , "height": "100%"
                , "line-height": "100%"
                , "font-size": "30px"
                , "top": 0
                , "left": "-30px"
            });
            arrowHtml.find(".left_arrow,.right_arrow").css({
                "height": (dialogObj.outerHeight(true)) + "px"
                , "line-height": (dialogObj.outerHeight(true)) + "px"
            });
            dialogObj.css({
                "overflow": ""
            });
            dialogObj.append(arrowHtml);

            dialogObj.find(".arrow").off('click');
            dialogObj.find(".arrow").on('click', function () {
                var showID = null;
                var thisID = $(this).parents(".notykit_content").find('.show_pic').attr('id').replace('show_small_item', "");
                var thisArrow = $(this).hasClass('icon-chevron-left') ? true : false;
                if (thisArrow) {
                    showID = parseInt(thisID) > 0 ? parseInt(thisID) - 1 : $('.small_pic').length - 1;
                } else {
                    showID = parseInt(thisID) < ($('.small_pic').length - 1) ? parseInt(thisID) + 1 : 0;
                }
                $(this).parents(".notykit_content").find('.show_pic').css({
                    "background-image": $("#small_item" + showID).css("background-image")
                });
                $(this).parents(".notykit_content").find('.show_pic').attr('id', 'show_small_item' + showID);
            });

        });
        return dialog;
    }

    function video(title, media_pic, media_video, config) {
        if (!config) {
            config = {
                width: 940
                , height: 540
                , background: ''
                , layout: 'windowscenter'
                , msgClass: ''
                , titleClass: ''
            };
        }
        var width = (typeof (config.width) === 'number' && config.width > 0) ? config.width : 0;
        var height = (typeof (config.height) === 'number' && config.height > 0) ? config.height : 0;
        var background = (typeof (config.background) === 'string' && config.background != "") ? config.background : '';
        var layout = (typeof (config.layout) === 'string' || typeof (config.layout) === 'object') ? config.layout : 'windowscenter';
        var titleClass = (typeof (config.titleClass) === 'string' && config.titleClass != "") ? config.titleClass : '';
        var msgClass = (typeof (config.msgClass) === 'string' && config.msgClass != "") ? config.msgClass : '';
        var obj = (typeof config.obj === 'object' && config.obj != null) ? config.obj : $("body");
        var zIndex = (typeof (config.zIndex) === 'number' && config.zIndex > 0) ? config.zIndex : common.fn.getmaxZindex() + 1;

        var template = '<div class="config_container">'
            + '<div class="text_title windows_title"></div>'
            + '<div class="video_content"></div>'
            + '</div>';

        var dialog = NotyKit.Create({
            obj: obj
            , width: width !== 0 ? width : obj.width()
            , height: height !== 0 ? height : obj.height()
            , template: template
            , title: {
                container: '.config_title'
                , text: title
                , addClass: titleClass
            }
            , text: {
                container: '.video_content'
                ,
                text: '<video controls autoplay poster="' + media_pic + '" src="' + media_video + '" width="100%" height="100%"></video>'
                ,
                addClass: msgClass
            }
            , closeItem: [{
                container: '.text_title'
                , closeWith: ['click']
                , text: '<span class="icon-remove" style="margin-right: 10px;"></span>'//当 text 不为空时候下面配置生效
                , layout: 'centerright'
                , addClass: 'config_close'
            }]
            , layout: layout !== '' ? layout : ''
            , background: background !== '' ? background : "rgba(0,0,0,.6)"
            , zIndex: zIndex
            , callback: {
                onShow: function () {
                    scrollCtr.disableScroll();
                },
                afterClose: function () {
                    scrollCtr.enableScroll();
                }
            }
        });
        dialog.AutoSize();
        var Media = dialog.notyKitObj.find('video')[0];

        Media.addEventListener('play', function () {
            dialog.AutoSize();
        }, false);
        Media.addEventListener('error', function () {
            var height = $(Media).height();
            var errObj = $('<div style="width:100%;font-size: 30px;padding-top: 200px;"><span class="icon-remove-circle"></span></div><div style="padding-bottom: 200px;width: 100%;"><span>视频发生错误!</span></div>');
            errObj.css({
                'text-align': 'center'
            });
            $(Media).closest('.video_content').html(errObj);
            dialog.AutoSize();
        }, false);
        return dialog;
    }

    var newsObj = {
        init: function (container) {
            container.html('');
            DataLoad.GetFile('NewsHtml', 'html/content/news.html', function (html) {
                if (html != '') {
                    container.html(html);
                    newsObj.search.current = 1;
                    newsObj.show_link(container);
                    newsObj.list(container);
                }
            });
        },
        search: {
            title: null
            , media_type: null
            , cate: null
            , current: 1
            , pageSize: 5
        },
        list: function (container) {
            var spinkit = SpinKit.Create({
                color: '#fff'
                , infoClass: "onprogressClass"
            });
            DataLoad.GetData(null, apiPath.newsListApi, newsObj.search, function (result) {
                if (result.resultObject != null && result.resultObject.data != null) {
                    var listData = result.resultObject.data;
                    var data_pic = [];
                    var data_video = [];
                    var data_str = [];
                    $.each(listData, function (index, item) {
                        var id = item.id;
                        var title = item.title;
                        var media_url = item.media_url;
                        var media_type = item.media_type;
                        var pic_index = item.pic_index;
                        var isShow = item.isShow;
                        var read_count = item.read_count > 0 ? item.read_count : "";
                        var times = moment(item.times).format('YYYY年MM月DD日');
                        var cate = item.cate;
                        var cate_name = item.cate_name;
                        var content = common.string.removeHtml(common.fn.htmlDecode(item.content));

                        var str_Obj = $(container.find(".right_content_templete").html());
                        str_Obj.find(".item_time").html(times);
                        str_Obj.find(".count").html(read_count);
                        str_Obj.find(".item_detail").html(content);
                        if (media_type === "pic") {
                            var arrPic = media_url.split(",");
                            $.each(arrPic, function (index, item) {
                                if (item !== "") {
                                    data_pic.push(item);
                                    var picHtml = '<div class="big_pic" style="cursor: pointer; background-image: url(' + apiPath.imageApi + '?img=NewsImg/' + item + ')"><span style="display: none;">' + apiPath.imageApi + '?img=NewsImg/' + item + '</span></div>';
                                    str_Obj.find(".item_media").append($(picHtml));
                                    str_Obj.find(".big_pic").off('click');
                                    str_Obj.find(".big_pic").on('click', function () {
                                        showPic($(this).find('span').html());
                                    });

                                }
                            });
                            str_Obj.find(".item_media").append("<div style='clear: both;'></div>");
                        }
                        else {
                            if (media_type != "") {
                                data_video.push({
                                    pic: media_url.replace(",", "")
                                    , video: media_type
                                });
                                var videoHtml = '<div class="big_pic" style="background-image: url(' + apiPath.imageApi + '?img=NewsImg/' + media_url.replace(",", "") + ')">'
                                    + '<div class="play_class"><div class="play_circle"><span class="icon-play" style="margin-left: 5px;"></span></div></div>'
                                    + '</div>';
                                str_Obj.find(".item_media").append($(videoHtml));
                                str_Obj.find(".play_circle").off('click');
                                str_Obj.find(".play_circle").on('click', function () {
                                    var pic_url = apiPath.imageApi + '?img=NewsImg/' + media_url.replace(",", "");
                                    var video_url = apiPath.videoApi + '?img=NewsImg/' + media_type;
                                    video("", pic_url, video_url, null);
                                });
                            }
                        }

                        data_str.push(str_Obj);

                    });

                    var pageContainObj = container.find(".page_container");

                    newsObj.show_str(container, data_str);
                    newsObj.list_pic(container, data_pic);
                    newsObj.list_video(container, data_video);

                    if (result.resultObject.totalPage > 1) {
                        page.create({
                            obj: container.find(".page_container")
                            , pageSize: newsObj.search.pageSize
                            , current: newsObj.search.current
                            , totalPage: result.resultObject.totalPage
                            , totalRecord: result.resultObject.totalRecord
                            , input: false
                            , defaultPageSize: 5
                            , callback: function (pageation) {
                                newsObj.search.pageSize = pageation.pageSize;
                                newsObj.search.current = pageation.current;
                                newsObj.list(container);
                            }
                        });
                    } else {
                        pageContainObj.empty();
                    }
                }
            }, true, 'post', 'json', function (event) {
                var pre = Math.floor(100 * event.loaded / event.total);
                if (pre == 100) {
                    spinkit.remove();
                }
                spinkit.infoObj.html(pre + "/%");
            });
        },
        show_str: function (container, data_str) {
            var listContainObj = container.find(".list_container");
            listContainObj.empty();
            $.each(data_str, function (index, item) {
                listContainObj.append(item);
            });
            var mediaObj = listContainObj.find(".item_media");
            $.each(mediaObj, function (index, item) {
                var thisItem = $(item);
                var bigPicObj = thisItem.find(".big_pic");

                if (bigPicObj.length > 0 && bigPicObj.length < 3) {
                    var playClassObj = bigPicObj.find(".play_class");
                    if (playClassObj.length > 0) {
                        bigPicObj.css({
                            "width": (thisItem.width() - bigPicObj.length * 10) / bigPicObj.length + "px"
                            , "height": thisItem.height() * 2 / bigPicObj.length + "px"
                        });
                        playClassObj.css({
                            "line-height": thisItem.height() + "px"
                        });
                    }
                    else {
                        bigPicObj.css({
                            "width": (thisItem.width() - bigPicObj.length * 10) / bigPicObj.length + "px"
                            , "height": thisItem.height() * 2 / bigPicObj.length + "px"
                        });
                    }
                }
            });
        },
        list_pic: function (container, data_pic) {
            container.find(".img_container .pic").empty();
            $.each(data_pic, function (index, item) {
                var picHtml = '<div class="small_pic" id="small_item' + index + '" style="cursor: pointer; background-image: url(' + apiPath.imageApi + '?img=NewsImg/' + item + ')"><span style="display: none;">' + apiPath.imageApi + '?img=NewsImg/' + item + '</span></div>';
                container.find(".img_container .pic").append($(picHtml));
                container.find(".small_pic").off('click');
                container.find(".small_pic").on('click', function () {
                    showPic($(this).find('span').html(), $(this).attr('id'));
                });

            });
            container.find(".img_container .pic").append("<div style='clear: both;'></div>");
        },
        list_video: function (container, data_video) {
            container.find(".video_container .video").empty();
            $.each(data_video, function (index, item) {
                var picHtml = '<div class="small_video" style="background-image: url(' + apiPath.imageApi + '?img=NewsImg/' + item.pic + ')">'
                    + '<div class="small_play_class"><div class="small_play_circle"><span class="icon-play" style="margin-left: 5px;"></span></div></div>'
                    + '</div>';
                var smallVideo = $(picHtml);
                smallVideo.find(".small_play_circle").off('click');
                smallVideo.find(".small_play_circle").on('click', function () {
                    var pic_url = apiPath.imageApi + '?img=NewsImg/' + item.pic;
                    var video_url = apiPath.videoApi + '?img=NewsImg/' + item.video;
                    video("", pic_url, video_url, null);
                });
                container.find(".video_container .video").append(smallVideo);

            });
            container.find(".video_container .video").append("<div style='clear: both;'></div>");
        },
        show_link: function (container) {
            DataLoad.GetData(null, apiPath.linkListApi, {cate: 1}, function (result) {
                if (result.resultObject != null && result.resultObject.data != null) {
                    var data = result.resultObject.data[0];
                    var herf_url = data.herf_url;
                    herf_url = herf_url == null ? "" : herf_url;
                    var pic = data.pic;
                    var swiperContent = "";
                    var arrHerf = herf_url.split(',');
                    $.each(pic.split(','), function (index, item) {
                        var herf = arrHerf[index];
                        if (item != "") {
                            swiperContent += '<div class="swiper-slide" style="background-image: url(' + apiPath.imageApi + '?img=LinkImg/' + item + ')"><span style="display: none;">' + herf + '</span></div>';
                        }
                    });

                    if (swiperContent != "") {
                        container.find('.swiper-wrapper').html(swiperContent);

                        var picSwiper = new swiper('.swiper-container', {
                            autoplay: 3000,//可选选项，自动滑动
                            loop: true
                        });

                        container.find('.swiper-slide').off('click');
                        container.find('.swiper-slide').on('click', function () {
                            var url = $(this).find('span').html();
                            if (url.toLowerCase().indexOf("http://") != 0) {
                                url = "http://" + url;
                            }
                            if (url.toLowerCase().indexOf("etstation.net") != -1) {
                                url = "";
                            }
                            if (url != "" && url != "http://") {
                                window.open(url);
                            }
                        });
                        container.find('.swiper-slide').css({
                            "cursor": "pointer"
                        });
                    }
                }
            });
        }
    }

    return {
        init: newsObj.init
    }
});