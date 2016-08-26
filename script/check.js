/**
 * Created by zhangzongshan on 16/8/23.
 */
"use strict"
define(function (require, exports, module) {
    var swiper = require('_assets/js/public/swiper/swiper-3.3.1.jquery.min');
    var page = require('_assets/js/module/page/page');
    var scrollCtr = require('_assets/js/module/scrollcontrol/scrollcontrol');

    function showInfo(title, contentTxet, config) {
        if (!config) {
            config = {
                width: 740
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

        var template = '<div class="text_container">'
            + '<div class="text_title windows_title"></div>'
            + '<div class="text_content"></div>'
            + '</div>';

        var dialog = NotyKit.Create({
            obj: obj
            , width: width !== 0 ? width : obj.width()
            , height: height !== 0 ? height : obj.height()
            , template: template
            , title: {
                container: '.text_title'
                , text: ''
                , addClass: titleClass
            }
            , text: {
                container: '.text_content'
                ,
                text: '<div class="title">' + title + '</div><div class="content">' + contentTxet + '</div>'
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
        return dialog;
    }

    var checkObj = {
        init: function (container, checkBgImg) {
            DataLoad.GetFile('ProductHtml', 'html/content/check.html', function (html) {
                if (html != '') {
                    var container = $('#check');
                    container.html(html);
                    container.find(".check_title").css({
                        "background-image": "url('" + apiPath.imageApi + "?img=BgImg/" + checkBgImg + "')"
                    });
                    checkObj.link(container);
                    checkObj.list(container);
                }
            });
        },
        list: function (container) {
            var spinkit = SpinKit.Create({
                color: '#fff'
                , infoClass: "onprogressClass"
            });
            DataLoad.GetData(null, apiPath.questionListApi, {pageSize: 1000, current: 1}, function (result) {
                if (result.resultObject != null && result.resultObject.data != null) {
                    var tempHtml = container.find('.check_content_templete').html();
                    var listData = result.resultObject.data;
                    var arrdate = [];
                    $.each(listData, function (index, item) {
                        var id = item.id;
                        var title = item.title;
                        var cate = item.cate;
                        var content = item.content;
                        var cate_name = item.cate_name;
                        var itemData = {
                            id: id
                            , title: title
                            , content: content
                        };
                        if (common.fn.getArrJsonItem(arrdate, 'cate', cate).index == -1) {
                            arrdate.push({
                                cate: cate
                                , cate_name: cate_name
                                , date: [itemData]
                            });
                        } else {
                            common.fn.getArrJsonItem(arrdate, 'cate', cate).item.date.push(itemData);
                        }
                    });

                    if (arrdate.length > 0) {
                        $.each(arrdate, function (index, item) {
                            var str_Obj = $(tempHtml);
                            var cate_name = item.cate_name;
                            cate_name = (cate_name == null || cate_name == '') ? "其他问题" : cate_name;
                            str_Obj.find('.cate_name').html(cate_name);
                            $.each(item.date, function (c_index, c_item) {
                                var content = common.string.removeHtml(common.fn.htmlDecode(c_item.content));
                                var l_html = '<div class="check_list_item"><span class="title">' + c_item.title + '</span><div class="content" style="display: none;">' + content + '</div></div>';
                                str_Obj.find(".cate_list").append(l_html);
                            });
                            container.find('.check_content').append(str_Obj);
                        });
                    }
                    container.find('.check_list_item').off('click');
                    container.find('.check_list_item').on('click', function () {
                        var content = $(this).find('.content').html();
                        var title = $(this).find('.title').html();
                        showInfo(title, content);
                    });

                }
            }, true, 'post', 'json', function (event) {
                var pre = Math.floor(100 * event.loaded / event.total);
                if (pre == 100) {
                    spinkit.remove();
                }
                spinkit.infoObj.html(pre + "/%");
            });
        },
        link: function (container) {
            DataLoad.GetData(null, apiPath.linkListApi, {cate: 2}, function (result) {
                if (result.resultObject != null && result.resultObject.data != null) {

                    var listData = result.resultObject.data.reverse();

                    if (listData.length > 0) {
                        var data = listData[0];
                        checkObj.fileSwiper(data, container.find('.check_left'));
                    }

                    if (listData.length > 1) {
                        var data = listData[1];
                        checkObj.fileSwiper(data, container.find('.check_right'));
                    }
                }
            });
        },
        fileSwiper: function (data, container) {
            var herf_url = data.herf_url;
            var pic = data.pic;
            var swiperContent = "";
            herf_url = herf_url == null ? "" : herf_url;
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
                    autoplay: 5000,//可选选项，自动滑动
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
    }

    return {
        init: checkObj.init
    }
});