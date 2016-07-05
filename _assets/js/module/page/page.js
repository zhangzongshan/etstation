/**
 * Created by zhangzongshan on 16/5/10.
 */
"use strict";
(function (factory) {
    if (typeof require === 'function' && typeof exports === 'object' && typeof module === 'object') {
        var target = module['exports'] || exports; // module.exports is for Node.js
        factory(target);
    } else if (typeof define === 'function' && define.amd) {
        define(['exports'], factory);
    } else if (typeof define === 'function' && define.cmd) {
        define(factory);
    } else {
        factory(function () {
        }, window['Page'] = {}, {});
    }
}(function (require, exports, module) {
    var Page = typeof exports !== 'undefined' ? exports : {};
    var ms = {
        init: function (obj, args) {
            ms.fillHtml(obj, args);
        },
        //填充html
        fillHtml: function (obj, args) {
            obj.empty();

            obj.append('<div class="tcdPageCode page_left" style="float: left;"><span class="detail">每页<input class="pageSize" name="pageSize" type="text" value="' + args.pageSize + '">条<span style="5px"> </span>共<label class="totalRecord">' + args.totalRecord + '</label>条</span></div>');
            obj.append('<div class="tcdPageCode page_right" style="float: right;text-align: right;"></div>');
            //上一页
            if (args.current > 1) {
                obj.find(".page_right").append('<a href="javascript:;" class="prevPage">上一页</a>');
            } else {
                obj.find(".page_right").remove('.prevPage');
                obj.find(".page_right").append('<span class="disabled">上一页</span>');
            }
            //中间页码
            if (args.current != 1 && args.current >= 4 && args.totalPage != 4) {
                obj.find(".page_right").find(".page_right").append('<a href="javascript:;" class="tcdNumber">' + 1 + '</a>');
            }
            if (args.current - 2 > 2 && args.current <= args.totalPage && args.totalPage > 5) {
                obj.find(".page_right").append('<span>...</span>');
            }
            var start = args.current - 2, end = args.current + 2;
            if ((start > 1 && args.current < 4) || args.current == 1) {
                end++;
            }
            if (args.current > args.totalPage - 4 && args.current >= args.totalPage) {
                start--;
            }
            for (; start <= end; start++) {
                if (start <= args.totalPage && start >= 1) {
                    if (start != args.current) {
                        obj.find(".page_right").append('<a href="javascript:;" class="tcdNumber">' + start + '</a>');
                    } else {
                        obj.find(".page_right").append('<span class="current">' + start + '</span>');
                    }
                }
            }
            if (args.current + 2 < args.totalPage - 1 && args.current >= 1 && args.totalPage > 5) {
                obj.find(".page_right").append('<span>...</span>');
            }
            if (args.current != args.totalPage && args.current < args.totalPage - 2 && args.totalPage != 4) {
                obj.find(".page_right").append('<a href="javascript:;" class="tcdNumber">' + args.totalPage + '</a>');
            }
            //下一页
            if (args.current < args.totalPage) {
                obj.find(".page_right").append('<a href="javascript:;" class="nextPage">下一页</a>');
            } else {
                obj.find(".page_right").remove('.nextPage');
                obj.find(".page_right").append('<span class="disabled">下一页</span>');
            }
            obj.append("<div style='clear: both;'></div>");

            if (!args.input) {
                obj.find(".page_left").css({
                    display: "none"
                });
            }
            this.bindEvent(obj, args);
        },
        //绑定事件
        bindEvent: function (obj, args) {
            obj.off("click");
            obj.on("click", "a.tcdNumber", function () {
                var current = parseInt($(this).text());
                var pageSize = parseInt(obj.find("input.pageSize").first().val());
                if (typeof(args.callback) == "function") {
                    args.callback({current: current, pageSize: pageSize});
                }
            });
            //上一页
            obj.on("click", "a.prevPage", function () {
                var current = parseInt(obj.find(".page_right").children("span.current").first().text());
                var pageSize = parseInt(obj.find(".page_left").find("input.pageSize").first().val());
                if (typeof(args.callback) == "function") {
                    args.callback({current: current - 1, pageSize: pageSize});
                }
            });
            //下一页
            obj.on("click", "a.nextPage", function () {
                var current = parseInt(obj.find(".page_right").children("span.current").first().text());
                var pageSize = parseInt(obj.find(".page_left").find("input.pageSize").first().val());
                if (typeof(args.callback) == "function") {
                    args.callback({current: current + 1, pageSize: pageSize});
                }
            });
            obj.find("input.pageSize").off("keypress");
            obj.find("input.pageSize").on("keypress", function (event) {
                if (event.keyCode == "13") {
                    var current = parseInt(obj.find(".page_right").children("span.current").first().text());
                    var pageSize = parseInt($(this).val());
                    if (isNaN(pageSize)) {
                        pageSize = args.defaultPageSize;
                        $(this).val(pageSize)
                    }
                    else {
                        if (pageSize < args.minPageSize) {
                            pageSize = args.minPageSize;
                        }
                        if (pageSize > args.maxPageSize) {
                            pageSize = args.maxPageSize;
                        }
                    }
                    if (typeof(args.callback) == "function") {
                        args.callback({current: current, pageSize: pageSize});
                    }
                }
            });
        }
    };

    exports.create = function (option) {
        var pagination = {
            totalPage: option.totalPage//总页码数
            , pageSize: option.pageSize//每页显示数据
            , current: option.current//当前页码
            , totalRecord: option.totalRecord//总记录数据
            , callback: option.callback//回调信息
            , input: option.input === false ? false : true//是否显示页面输入框和详细信息
            , defaultPageSize: isNaN(parseInt(option.defaultPageSize)) ? 10 : parseInt(option.defaultPageSize)//默认页面数据
            , maxPageSize: isNaN(parseInt(option.maxPageSize)) ? 100 : parseInt(option.maxPageSize)//最大页面数据
            , minPageSize: isNaN(parseInt(option.minPageSize)) ? 1 : parseInt(option.minPageSize)//最小页面数据
        };
        var obj = typeof (option.obj) === 'string' ? $(option.obj) : option.obj;
        if (obj.length > 0) {
            ms.init(obj, pagination);
        }
    }
}));