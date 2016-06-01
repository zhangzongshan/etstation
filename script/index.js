/**
 * Created by zhangzongshan on 16/5/27.
 */
'use stice';
define(function (require, exports, module) {

    seajs.use([
        'style/head/head.css'
        ,'style/content.css'
        ,'style/foot/foot.css'
    ]);
    var tabsKit=require('_assets/js/module/tabskit/tabskit');
    DataLoad.Debug(true);
    var headObj = {
        init: function (container) {
            DataLoad.GetFile('HeadHtml', 'html/head/head.html', function (html) {
                if (html != '') {
                    container.html(html);
                    container.css({
                        'z-index':common.fn.getmaxZindex()
                    });
                }
            });
        }
    }
    
    var footObj={
        init:function (container) {
            DataLoad.GetFile('FootHtml', 'html/foot/foot.html', function (html) {
                if (html != '') {
                    container.html(html);
                }
            });
        }
    }


    var contenObj={
        init:function (container) {
            DataLoad.GetFile('ContentHtml', 'html/content/index.html', function (html) {
                if (html != '') {
                    container.html(html);
                    var aboutTabs=tabsKit.Create({
                        obj:$("#about_item_about_tabs")
                        ,autowidth:false
                        ,container:$('#about_item_about_content')
                        ,showtabs:'abouts'
                        ,tabs:[{
                            id: 'abouts'
                            , normal: 'tabs_normal'
                            , active: 'tabs_active'
                            , html: '<span>关于我们</span>&nbsp;&nbsp;<span class="icon-caret-right"></span>'
                            , fn: function () {

                            }
                            , content: '子罡商贸有限公司旗下杭州外星人汽车贴膜服务机构（ExquisiteTecnique）创立时间为2012年。是美国CleraPlex玻璃盾/美国3M1080车身改色膜/美国XEPL漆面保护膜/德国PWF车身改色膜/ET轮毂防擦碰轮毂保护圈/美国VP燃油添加剂浙江省独家总代理。本公司秉承高品质服务诚信经营理念服务浙江省广大车主.'
                        },{
                            id: 'aboutteam'
                            , normal: 'tabs_normal'
                            , active: 'tabs_active'
                            , html: '<span>技师团队</span>&nbsp;&nbsp;<span class="icon-caret-right"></span>'
                            , fn: function () {

                            }
                            , content: ''
                        }]
                    });
                }
            });
        }
    }

    function init() {
        headObj.init($('#head'));
        contenObj.init($('#content'));
        footObj.init($('#foot'));
        $('#content').css({
            'min-height':($(window).height()-180)+'px'
        });
    }

    return {
        init: init
    }
});
