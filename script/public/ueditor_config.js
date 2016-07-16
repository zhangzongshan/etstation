/**
 * Created by zhangzongshan on 16/6/28.
 */
"use strict";
define(function (require, exports, module) {
    var allEditor = [
        ['fullscreen', 'source', 'undo', 'redo', '|', 'link', 'unlink', //取消链接
            'justifyleft', //居左对齐
            'justifyright', //居右对齐
            'justifycenter', //居中对齐
            'justifyjustify', //两端对齐
            'directionalityltr', //从左向右输入
            'directionalityrtl', //从右向左输入
            'forecolor', //字体颜色
            'backcolor', //背景色
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough',
            'subscript', //下标
            'superscript', //上标
            'rowspacingtop', 'rowspacingbottom', 'lineheight'
        ], [
            'inserttable',//插入表格
            'insertrow', //前插入行
            'insertcol', //前插入列
            'mergeright', //右合并单元格
            'mergedown', //下合并单元格
            'deleterow', //删除行
            'deletecol', //删除列
            'splittorows', //拆分成行
            'splittocols', //拆分成列
            'splittocells', //完全拆分单元格
            'deletecaption', //删除表格标题
            'inserttitle', //插入标题
            'mergecells', //合并多个单元格
            'deletetable', //删除表格
            'edittable', //表格属性
            'edittd', //单元格属性
            'insertparagraphbeforetable', //"表格前插入行"
            'imagenone', //默认
            'imageleft', //左浮动
            'imageright', //右浮动
            'imagecenter', //居中
            '|',
            'pagebreak', //分页
            'emotion', //表情
            'spechars', //特殊字符
            'searchreplace', //查询替换
        ], [
            'fontfamily', //字体
            'fontsize', //字号
            '|',
            'removeformat',
            'formatmatch', 'autotypeset', 'pasteplain', '|', 'insertorderedlist', 'insertunorderedlist', 'selectall', 'cleardoc',
            'date', //日期
            'time', //时间
        ]
    ];
    var simpleEditor = [
        ['fullscreen',
            'source',
            'undo',
            'redo',
            'removeformat',
            'cleardoc',
        ],[
            'fontfamily', //字体
            'fontsize', //字号
            'justifyleft', //居左对齐
            'justifyright', //居右对齐
            'justifycenter', //居中对齐
            'justifyjustify', //两端对齐
            'bold', 'italic', 'underline', 'fontborder', 'strikethrough',
            'subscript', //下标
            'superscript', //上标
            'link',
            'unlink', //取消链接
            'date', //日期
            'time', //时间
        ]
    ];

    function ueditor_config(toolbars) {
        toolbars = toolbars === 'simple' ? simpleEditor : allEditor;
        return {
            toolbars: toolbars
            // , initialFrameWidth: 700
            // , initialFrameHeight: 200
            ,
            zIndex: common.fn.getmaxZindex() + 1
            ,
            elementPathEnabled: false
            ,
            autoHeightEnabled: false
            //, initialContent: content
            ,
            lang: /^zh/.test(navigator.language || navigator.browserLanguage || navigator.userLanguage) ? 'zh-cn' : 'en'
            ,
            focus: false
            ,
            enableAutoSave: false
        }
    }

    return {
        config: ueditor_config
    }
});