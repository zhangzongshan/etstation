/**
 * Created by zhangzongshan on 16/5/27.
 */
'use stice';
define(function (require, exports, module) {

    seajs.use(['style/head/head.css']);
    var headObj = {
        init: function (container) {
            //DataLoad.Clear('HeadHtml');
            DataLoad.RemoveStorge('HeadHtml');
            DataLoad.GetFile('HeadHtml', 'html/head/head.html', function (html) {
                if (html != '') {
                    container.html(html);
                }
            });
        }
    }

    function init() {
        headObj.init($('#head'));
    }

    return {
        init: init
    }
});
