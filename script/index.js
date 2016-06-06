/**
 * Created by zhangzongshan on 16/5/27.
 */
'use stice';
define(function (require, exports, module) {

    seajs.use([
        'style/head/head.css'
        , 'style/content.css'
        , 'style/foot/foot.css'
        , '_assets/js/public/swiper/swiper-3.3.1.min.css'
    ]);
    var tabsKit = require('_assets/js/module/tabskit/tabskit');
    var swiper = require('_assets/js/public/swiper/swiper-3.3.1.jquery.min')
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
            });

            $("#head .link").off('click');
            $("#head .link").on('click', function () {
                contenObj.showIndex();
                $("html,body").animate({scrollTop: $("#content .link").offset().top + 50}, 500);
                $("#content .link").addClass('animated bounce').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    $(this).removeClass('animated bounce');
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
                        contenObj.loadProduct();
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
            DataLoad.GetFile('ContentHtml', 'html/content/index.html', function (html) {
                if (html != '') {
                    container.html(html);

                    var aboutTabs = tabsKit.Create({
                        obj: $("#about_item_about_tabs")
                        , autowidth: false
                        , container: $('#about_item_about_content')
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

                            }
                            ,
                            content: '子罡商贸有限公司旗下杭州外星人汽车贴膜服务机构（ExquisiteTecnique）创立时间为2012年。是美国CleraPlex玻璃盾/美国3M1080车身改色膜/美国XEPL漆面保护膜/德国PWF车身改色膜/ET轮毂防擦碰轮毂保护圈/美国VP燃油添加剂浙江省独家总代理。本公司秉承高品质服务诚信经营理念服务浙江省广大车主.'
                        }, {
                            id: 'aboutteam'
                            , normal: 'tabs_normal'
                            , active: 'tabs_active'
                            , html: '<span>技师团队</span>&nbsp;&nbsp;<span class="icon-caret-right"></span>'
                            , fn: function () {

                            }
                            , content: ''
                        }]
                    });

                    container.find('.product_item').css({
                        'width': (container.find('.product_cate').width() - 40) / 3 + 'px'
                    });

                    $('#content .product .btn').off('click');
                    $('#content .product .btn').on('click', function () {
                        contenObj.showProduct($(this).attr('id'));
                    });

                    headObj.menuEvent();

                }
            });
        },
        showIndex: function () {
            $('#content').show();
            $('#product').hide();
        },
        loadProduct: function (callback) {
            seajs.use(['style/product/product.css']);
            DataLoad.GetFile('ProductHtml', 'html/content/product.html', function (html) {
                if (html != '') {
                    $('#product').html(html);
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
            });
        },
        showProduct: function (productCate) {
            $("html,body").animate({scrollTop: 0}, 100);
            if ($('#product').html() !== '') {
                $('#content').hide();
                $('#product').show();
            } else {
                this.loadProduct(function () {
                    $('#content').hide();
                    $('#product').show();
                })
            }
        }
    }

    function mapinit() {
        var map = new BMap.Map("link_map_content");
        var point = new BMap.Point(120.17533, 30.285734);
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
        headObj.init($('#head'));
        contenObj.init($('#content'));
        footObj.init($('#foot'));
        $('#content').css({
            'min-height': ($(window).height() - 180) + 'px'
        });
    }

    return {
        init: init
        , mapinit: mapinit
    }
});
