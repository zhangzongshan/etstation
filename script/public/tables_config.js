/**
 * Created by zhangzongshan on 16/7/4.
 */
"use strict";
define(function (require, expotrs, module) {
    var scriptPath = common.fn.getScriptRoot('common');
    var rootPath = scriptPath.substr(0, scriptPath.indexOf('_assets/'));
    seajs.use([
        rootPath + '_assets/js/public/DataTables/css/jquery.dataTables.min.css'
    ]);

    var table = require("../../_assets/js/public/DataTables/js/jquery.dataTables.min");

    function init(table_container, data, columns, data_table_fn) {
        var option = {
            searching: false
            , ordering: false
            , dom: "<'tableContent't>"//"<'tableContent'rt>"//<'tableFoot'<'tableLeft'<'dataTables_info'l>><'tableLeft'i><'tableRight'p>>
            , "processing": true
            , "serverSide": false
            , data: data
            , columns: columns
            , paging: false
            , language: {
                emptyTable:"<span class='emptyTable'>没有数据!</span>"
            }
            , initComplete: function () {
                //更改表格默认样式
                table_container.find("thead").css({
                    "background-color": "#f0f0f0"
                    , "color": "#666"
                });
                table_container.find("thead th, thead td").css({
                    "border-bottom": "1px solid #e5e5e5"
                    , "font-weight": "normal"
                    , "padding": "15px 18px"
                });
                table_container.find(".emptyTable").css({
                    "height": "80px"
                    ,"line-height": "80px"
                    , "font-weight": "normal"
                    , "padding": "15px 18px"
                });

                $("table.dataTable.no-footer").css({
                    "border-bottom": "0px solid #e5e5e5"
                });
            }
        }
        var table = table_container.DataTable(option);
        if (typeof data_table_fn === 'function') {
            data_table_fn(table);
        }
        return table;
    }

    return {
        init: init
    }
});