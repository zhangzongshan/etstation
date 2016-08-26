/**
 * Created by zhangzongshan on 16/5/27.
 */
'use strict';
define(function (require, exports, module) {

    seajs.use([
        'style/head/head.css'
        , 'style/content.css'
        , 'style/foot/foot.css'
        , '_assets/js/public/swiper/swiper-3.3.1.min.css'
        , 'style/product/product.css'
        , 'style/news/news.css'
        , 'style/check/check.css'
        , 'style/page.css'
    ]);
    var tabsKit = require('_assets/js/module/tabskit/tabskit');
    var swiper = require('_assets/js/public/swiper/swiper-3.3.1.jquery.min');
    var news = require("script/news");
    var check = require("script/check");
    var indexBgImg, aboutBgImg, productBgImg, linkBgImg, product_innerBgImg, newsBgImg, checkBgImg;

    DataLoad.Debug(true);
    var headObj = {
        init: function (container) {
            DataLoad.GetFile('HeadHtml', 'html/head/head.html', function (html) {
                if (html != '') {
                    container.html(html);
                    container.css({
                        'z-index': common.fn.getmaxZindex()
                    });
                }
            });
        },
        menuEvent: function () {
            $("#head .index").off('click');
            $("#head .index").on('click', function () {
                contenObj.showIndex();
                $("html,body").animate({scrollTop: $("#content .index").offset().top}, 500);
                $("#content .index").addClass('animated bounceInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $(this).removeClass('animated bounceInDown');
                });
                $(this).closest('.menu').children().removeClass('active');
                $(this).addClass('active');
                //$("#content .index").removeClass('animated bounceInDown');
            });


            $("#head .about").off('click');
            $("#head .about").on('click', function () {
                contenObj.showIndex();
                $("html,body").animate({scrollTop: $("#content .about").offset().top - 45}, 500);
                $("#content .about").addClass('animated bounceInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $(this).removeClass('animated bounceInDown');
                });
                $(this).closest('.menu').children().removeClass('active');
                $(this).addClass('active');
            });

            $("#head .new").off('click');
            $("#head .new").on('click', function () {
                //$("html,body").animate({scrollTop:$("#content .about").offset().top},500);
                $(this).closest('.menu').children().removeClass('active');
                $(this).addClass('active');
                contenObj.showNews();
            });

            $("#head .product").off('click');
            $("#head .product").on('click', function () {
                contenObj.showIndex();
                $("html,body").animate({scrollTop: $("#content .product").offset().top - 45}, 500);
                $("#content .product").addClass('animated bounceInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $(this).removeClass('animated bounceInDown');
                });
                $(this).closest('.menu').children().removeClass('active');
                $(this).addClass('active');
            });

            $("#head .quality").off('click');
            $("#head .quality").on('click', function () {
                //$("html,body").animate({scrollTop:$("#content .product").offset().top},500);
                $(this).closest('.menu').children().removeClass('active');
                $(this).addClass('active');
                contenObj.showCheck();
            });

            $("#head .link").off('click');
            $("#head .link").on('click', function () {
                contenObj.showIndex();
                $("html,body").animate({scrollTop: $("#content .link").offset().top + 50}, 500);
                $("#content .link").addClass('animated bounceInDown').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $(this).removeClass('animated bounceInDown');
                });
                $(this).closest('.menu').children().removeClass('active');
                $(this).addClass('active');
            });

            $(window).scroll(function () {
                console.log($(window).scrollTop());
                if ($("#content").css('display') !== 'none') {
                    var currentScroll = $(window).scrollTop();

                    if (currentScroll > 0 && currentScroll < 400) {
                        $("#head .index").closest('.menu').children().removeClass('active');
                        $("#head .index").addClass('active');
                    } else if (currentScroll > 400 && currentScroll < 990) {
                        $("#head .about").closest('.menu').children().removeClass('active');
                        $("#head .about").addClass('active');
                    } else if (currentScroll > 990 && currentScroll < 1360) {
                        $("#head .product").closest('.menu').children().removeClass('active');
                        $("#head .product").addClass('active');
                        //contenObj.loadProduct();
                    } else if (currentScroll > 1360) {
                        $("#head .link").closest('.menu').children().removeClass('active');
                        $("#head .link").addClass('active');
                    }
                }
            });

        }
    }

    var footObj = {
        init: function (container) {
            DataLoad.GetFile('FootHtml', 'html/foot/foot.html', function (html) {
                if (html != '') {
                    container.html(html);
                }
            });
        }

    }


    var contenObj = {
        init: function (container) {
            DataLoad.GetData(null, apiPath.compangApi, null, function (result) {
                if (result.status === "success") {
                    var data = result.resultObject;
                    var map = data.map;
                    if (map.indexOf(",") != -1) {
                        var mapData = map.split(',');
                        lng = mapData[0];
                        lat = mapData[1];
                    }
                    var aboutContent = common.fn.htmlDecode(data.about);
                    DataLoad.GetFile('ContentHtml', 'html/content/index.html', function (html) {
                        if (html != '') {
                            container.html(html);

                            //背景样式设置
                            container.find(".index").css({
                                "background-image": "url('" + apiPath.imageApi + "?img=BgImg/" + indexBgImg + "')"
                            });
                            container.find(".about").css({
                                "background-image": "url('" + apiPath.imageApi + "?img=BgImg/" + aboutBgImg + "')"
                            });

                            container.find(".product").css({
                                "background-image": "url('" + apiPath.imageApi + "?img=BgImg/" + productBgImg + "')"
                            });

                            container.find(".link").css({
                                "background-image": "url('" + apiPath.imageApi + "?img=BgImg/" + linkBgImg + "')"
                            });


                            var aboutTabs = tabsKit.Create({
                                obj: $("#about_item_about_tabs")
                                , autowidth: false
                                , container: container.find('#about_item_about_content')
                                , showtabs: 'abouts'
                                , tabs: [{
                                    id: 'abouts'
                                    ,
                                    normal: 'tabs_normal'
                                    ,
                                    active: 'tabs_active'
                                    ,
                                    html: '<span>关于我们</span>&nbsp;&nbsp;<span class="icon-caret-right"></span>'
                                    ,
                                    fn: function () {
                                        container.find('#about_item_about_content').css({
                                            "background-image": ""
                                        });
                                    }
                                    ,
                                    content: aboutContent
                                }, {
                                    id: 'aboutteam'
                                    , normal: 'tabs_normal'
                                    , active: 'tabs_active'
                                    , html: '<span>技师团队</span>&nbsp;&nbsp;<span class="icon-caret-right"></span>'
                                    , fn: function () {
                                        DataLoad.GetData(null, apiPath.teamApi, null, function (result) {
                                            if (result.status === "success") {
                                                var photo = result.resultObject.data[0].photo;
                                                if (photo != null && photo != "") {
                                                    container.find('#about_item_about_content').css({
                                                        "background-image": "url('" + apiPath.imageApi + "?img=TeamImg/" + photo + "')"
                                                    });
                                                }
                                            }
                                        });
                                    }
                                    , content: ''
                                }]
                            });

                            DataLoad.GetData(null, apiPath.cateListApi, null, function (result) {
                                if (result.status === "success") {

                                    var cateHtmlTemp = ''
                                        + '<div class="product_item">'
                                        + '    <div class="product_cate_logo cate_logo"></div>'
                                        + '    <div class="product_cate_content">'
                                        + '        <div class="content_title"></div>'
                                        + '        <div class="content_text"></div>'
                                        + '        <div class="content_btn"><span class="btn">查看详细</span></div>'
                                        + '    </div>'
                                        + '</div>';

                                    var appHtml = null;

                                    var cateData = result.resultObject.data;

                                    cateData = cateData.reverse();
                                    $.each(cateData, function (index, item) {
                                        var name = item.name;
                                        var detail = item.detail;
                                        var logo = item.logo;
                                        var id = item.id;

                                        detail = common.string.removeHtml(common.fn.htmlDecode(detail));
                                        appHtml = $(cateHtmlTemp);

                                        if (name.toLowerCase().indexOf("xpel") != -1) {
                                            appHtml.addClass("product_XPEL");
                                            appHtml.find(".product_cate_content").addClass("content_XPEL");
                                        }
                                        if (name.toLowerCase().indexOf("3m") != -1) {
                                            appHtml.addClass("product_3M");
                                            appHtml.find(".product_cate_content").addClass("content_3M");
                                        }
                                        if (name.toLowerCase().indexOf("pwf") != -1) {
                                            appHtml.addClass("product_PWF");
                                            appHtml.find(".product_cate_content").addClass("content_PWF");
                                        }
                                        if (name.toLowerCase().indexOf("oviio") != -1) {
                                            appHtml.addClass("product_OVIIO");
                                            appHtml.find(".product_cate_content").addClass("content_OVIIO");
                                        }

                                        appHtml.find(".btn").attr("id", id);

                                        appHtml.find(".content_title").html(name);
                                        appHtml.find(".content_text").html(common.string.subString(detail, 80, "..."));
                                        appHtml.find(".cate_logo").css({
                                            "background-image": "url('" + apiPath.imageApi + "?img=ProductCate/" + logo + "')"
                                        });

                                        container.find(".product_cate").append(appHtml);
                                    });
                                    container.find('.product_item').css({
                                        'width': (container.find('.product_cate').width() - 40) / 4 + 'px'
                                    });

                                    $('#content .product .btn').off('click');
                                    $('#content .product .btn').on('click', function () {
                                        contenObj.showProduct($(this).attr('id'));
                                    });
                                }
                            }, true, 'post', 'json');


                            container.find('.link_content_comName').html(data.company);
                            container.find('.link_content_text .address').html(data.address);
                            container.find('.link_content_text .tell').html(data.tell);
                            container.find('.link_content_text .linkname').html(data.linkname);
                            container.find('.link_content_text .moblie').html(data.moblie);
                            container.find('.link_content_text .email').html(data.email);

                            var friendsImg = "";
                            var subscribeImg = "";
                            if (data.ecode !== "") {
                                var arrEcode = data.ecode.split(",");
                                if (arrEcode.length > 1) {
                                    friendsImg = arrEcode[1];
                                    subscribeImg = arrEcode[0];
                                }
                                if (friendsImg != "") {
                                    container.find(".weixin_friends").css({
                                        "background-image": "url('" + apiPath.imageApi + "?img=CommpanyImg/" + friendsImg + "')"
                                    });
                                }
                                if (subscribeImg != "") {
                                    container.find(".weixin_subscribe").css({
                                        "background-image": "url('" + apiPath.imageApi + "?img=CommpanyImg/" + subscribeImg + "')"
                                    });
                                }
                            }
                            headObj.menuEvent();

                        }
                    });
                }


            }, true, 'post', 'json');


        },
        showIndex: function () {
            $('#content').show();
            $('#product').hide();
            $('#news').hide();
            $('#check').hide();
        },
        loadProduct: function (callback) {
            DataLoad.GetFile('ProductHtml', 'html/content/product.html', function (html) {
                if (html != '') {
                    var container = $('#product');
                    container.html(html);
                    container.find(".product_title").css({
                        "background-image": "url('" + apiPath.imageApi + "?img=BgImg/" + product_innerBgImg + "')"
                    });
                    container.find(".product_content").html("");
                    var tempHtml = container.find(".product_content_templete").html();
                    DataLoad.GetData(null, apiPath.cateListApi, null, function (result) {
                        if (result.status === "success") {
                            var cateData = result.resultObject.data;
                            cateData = cateData.reverse();
                            $.each(cateData, function (index, item) {
                                var cateHtmlObj = $(tempHtml);
                                var name = item.name;
                                var detail = item.detail;
                                var logo = item.logo;
                                var id = item.id;
                                var webSite = item.website;
                                if (webSite.toLowerCase().indexOf("http://") != 0) {
                                    webSite = "http://" + webSite;
                                }
                                if (webSite.toLowerCase().indexOf("etstation.net") != -1) {
                                    webSite = "";
                                }
                                detail = common.string.removeHtml(common.fn.htmlDecode(detail));
                                detail = common.string.ltrim(detail);

                                cateHtmlObj.find(".small_Logo").css({
                                    "background-image": "url('" + apiPath.imageApi + "?img=ProductCate/" + logo + "')"
                                });
                                cateHtmlObj.find(".product_text_cateName").html(name);
                                cateHtmlObj.find(".product_text_content").html(detail);
                                if (webSite != "") {
                                    cateHtmlObj.find(".btn").on("click", function () {
                                        window.open(webSite);
                                    });
                                }
                                var picList = [];
                                DataLoad.GetData(null, apiPath.productListApi, {cate: id}, function (result) {
                                    if (result.status === "success") {
                                        var productData = result.resultObject.data;
                                        $.each(productData, function (pIndex, pItem) {
                                            var pic = pItem.pic;
                                            if (pic != "") {
                                                var arrPic = pic.split(",");
                                                $.each(arrPic, function (picIndex, picItem) {
                                                    if (picItem != "") {
                                                        picList.push(picItem);
                                                    }
                                                });
                                            }
                                        });
                                    }
                                }, false, 'post', 'json');

                                cateHtmlObj.attr("id", "productCate" + id);

                                if (picList.length > 0) {
                                    cateHtmlObj.find(".swiper-container").attr("id", "pSwiper" + id);
                                    cateHtmlObj.find(".icon-caret-left").addClass("leftSwiper" + id);
                                    cateHtmlObj.find(".icon-caret-right").addClass("rightSwiper" + id)
                                    var swiperHtml = ''
                                        + '<div class="swiper-slide">'
                                        + '    <div class="swiper_img"></div>'
                                        + '    <div class="swiper_text"></div>'
                                        + '</div>';
                                    var swiperContent = "";
                                    $.each(picList, function (lIndex, lItem) {
                                        var picUrl = lItem;
                                        swiperContent += '<div class="swiper-slide">';
                                        swiperContent += '    <div class="swiper_img" style="background-image: url(' + apiPath.imageApi + '?img=ProductImg/' + picUrl + ')"></div>';
                                        swiperContent += '    <div class="swiper_text"></div>';
                                        swiperContent += '</div>';
                                    });
                                    cateHtmlObj.find(".swiper-wrapper").html(swiperContent);
                                }

                                container.find(".product_content").append(cateHtmlObj);
                            });
                        }
                        if (typeof callback === 'function') {
                            callback();
                        }
                    }, true, 'post', 'json');
                }
            });
        },
        showProduct: function (productCate) {
            $('#content').hide();
            $('#news').hide();
            $('#check').hide();
            var spinkit_Product = SpinKit.Create({
                color: '#fff'
            });
            $("html,body").animate({scrollTop: 0}, 100);
            if ($('#product').html() !== '') {
                $('#product').show();
                contenObj.productList(productCate, spinkit_Product);
            } else {
                this.loadProduct(function () {
                    $('#product').show();
                    contenObj.productList(productCate, spinkit_Product);
                })
            }
        },
        showNews: function () {
            $('#content').hide();
            $('#product').hide();
            $('#check').hide();
            $("html,body").animate({scrollTop: 0}, 100);
            this.loadNews();
        }
        , showCheck: function () {
            $('#content').hide();
            $('#product').hide();
            $('#news').hide();
            $("html,body").animate({scrollTop: 0}, 100);
            this.loadCheck();
        }
        , productList: function (productCate, spinkit_Product) {
            spinkit_Product.remove();

            var currentCate = $("#productCate" + productCate);
            currentCate.remove();
            $(".product_id").first().before(currentCate);

            var sWiperObj = $(".product_item").find(".swiper-container");
            $.each(sWiperObj, function (index, item) {
                var id = $(item).attr("id");
                if (id != null && id != "") {
                    var id = id.replace("pSwiper", "");
                    var picSwiper = new swiper('#' + $(item).attr("id"), {
                        loop: true,
                        nextButton: '.leftSwiper' + id,
                        prevButton: '.rightSwiper' + id,
                        slidesPerView: parseInt($(item).width() / 200),
                        centeredSlides: false,
                        spaceBetween: 0,
                    });
                }
            });
        }
        , loadNews: function () {
            var container = $('#news');
            container.show();
            news.init(container);
        }
        , loadCheck: function () {
            var container = $('#check');
            container.show();
            check.init(container, checkBgImg);
        }
    }

    function mapinit(lng, lat) {
        var map = new BMap.Map("link_map_content");
        var point = new BMap.Point(lng, lat);
        map.centerAndZoom(point, 16);

        map.addControl(new BMap.NavigationControl());        // 添加平移缩放控件

        var marker = new BMap.Marker(point);  // 创建标注
        map.addOverlay(marker);               // 将标注添加到地图中
        marker.setAnimation(BMAP_ANIMATION_BOUNCE); //跳动的动画

        var myIcon = new BMap.Icon("images/index/map_icon.png", new BMap.Size(180, 80));
        var marker_com = new BMap.Marker(point, {icon: myIcon});  // 创建标注
        map.addOverlay(marker_com);
    }


    function init() {
        common.fn.writestorage('sessionkey', 'anonymous');
        var spinkit = SpinKit.Create({
            color: '#fff'
        });

        DataLoad.GetData(null, apiPath.bgGetApi, {}, function (result) {
            spinkit.remove();
            if (result.resultObject.data != null && result.resultObject.data.length > 0) {
                $.each(result.resultObject.data, function (index, item) {
                    var ids = item.ids;
                    if (ids === "index") {
                        indexBgImg = item.pic;
                    }
                    if (ids === "about") {
                        aboutBgImg = item.pic;
                    }
                    if (ids === "product") {
                        productBgImg = item.pic;
                    }
                    if (ids === "product_inner") {
                        product_innerBgImg = item.pic;
                    }
                    if (ids === "link") {
                        linkBgImg = item.pic;
                    }
                    if (ids === "news") {
                        newsBgImg = item.pic;
                    }
                    if (ids === "check") {
                        checkBgImg = item.pic;
                    }
                });

                headObj.init($('#head'));
                contenObj.init($('#content'));
                footObj.init($('#foot'));
                $('#content').css({
                    'min-height': ($(window).height() - 180) + 'px'
                });
            }
        }, true, 'post', 'json');
    }

    return {
        init: init
        , mapinit: mapinit
    }
});
