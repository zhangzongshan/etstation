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
