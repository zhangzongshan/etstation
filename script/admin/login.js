/**
 * Created by zhangzongshan on 16/6/15.
 */
'use strict'
define(function (require, exports, module) {
    var scriptPath = common.fn.getScriptRoot('common');
    var rootPath = scriptPath.substr(0, scriptPath.indexOf('_assets/'));
    var err = require('../../script/public/input_dialog_info');
    seajs.use([
        rootPath + 'style/admin/login.css'
    ]);

    function uuid() {
        var client_uuid = common.fn.getstorage('client_uuid');
        if (client_uuid === null) {
            client_uuid = common.fn.uuid();
            common.fn.writestorage('client_uuid', client_uuid);
        }
        return client_uuid;
    }

    var loginObj = {
        _callback: null
        , validationCodeApi: apiRoot + '/api/ValidationCode'
        , loginApi: apiRoot + '/api/accounts/account/login'
        , loginOutApi: apiRoot + '/api/accounts/account/loginOut'
        , login: {
            username: null
            , password: null
            , check_code: null
            , client_uuid: uuid()
            , type: 'uuid'
        }
        , errMessage: []
        , init: function (container, callback) {
            loginObj._callback = callback;
            DataLoad.GetFile('Login_html', rootPath + 'html/admin/login/login.html', function (html) {
                container.html(html);
                container.css({
                    'width': container.width() + 'px'
                    , 'height': container.height() + 'px'
                });
                $(window).on("resize", function () {
                    container.css({
                        'width': container.width() + 'px'
                        , 'height': container.height() + 'px'
                    });
                });

                container.find('input').focus(function () {
                    var loginItemObj = $(this).closest(".login_item").css({
                        "border": "2px solid #f89e1d"
                    });
                });

                container.find('input').blur(function () {
                    var loginItemObj = $(this).closest(".login_item").css({
                        "border": "2px solid transparent"
                    });
                });

                loginObj.getCode(container);

                container.find('.check_code_right').off('click');
                container.find('.check_code_right').on('click', function () {
                    loginObj.getCode(container);
                });

                container.find('.login_btn').off('click');
                container.find('.login_btn').on('click', function () {
                    loginObj.sumbit(container);
                });
                common.fn.inputEnter(container, true, function () {
                    loginObj.sumbit(container);
                });
            });
        }
        , getCode: function (container) {
            var clientInfo = {
                clientInfoId: uuid()
            };
            DataLoad.GetData(null, loginObj.validationCodeApi, clientInfo, function (result) {
                if (result.status === 'success' && result.resultObject !== '') {
                    container.find(".check_code_image").css({
                        "background-image": "url(" + result.resultObject.images + ")"
                    });
                }
            }, true, "post", 'json');
        }
        , sumbit: function (container) {
            this.login.username = container.find('#username').val();
            this.login.password = container.find('#password').val();
            this.login.check_code = container.find('#check_code').val();
            this.errMessage = [];
            $(".login_errmessage_container").closest('.notykit_container').remove();
            if (this.verify(container)) {
                DataLoad.GetData(null, this.loginApi, this.login, function (result) {
                    if (result.status === 'success' && (result.resultObject !== null || result.resultObject !== '')) {
                        common.fn.writestorage('sessionkey', result.resultObject.SessionKey.sessionkey);
                        common.fn.writestorage('userinfo', JSON.stringify(result.resultObject.Userinfo));
                        if (typeof loginObj._callback === 'function') {
                            loginObj._callback(result.resultObject.Userinfo);
                        }
                    }
                    else {
                        loginObj.getCode(container);
                        var errDialog = err.dialog(result.message, {
                            width: 400
                            , callback: function (notykit) {
                                errDialog.Close();
                            }
                        });
                    }
                }, true, "post", "json");
            }
        }
        , verify: function (container) {
            this.errMessage = [];
            var verifyFlg = true;
            var username = this.login.username;
            if (username === null || username === '') {
                this.errMessage.push({
                    obj: container.find("#username")
                    , message: "登录名不能为空!"
                });
                verifyFlg = false;
            }
            else {
                if (common.is.isContainCN(username)) {
                    this.errMessage.push({
                        obj: container.find("#username")
                        , message: "登录名不能包括汉字!"
                    });
                    verifyFlg = false;
                }
                else {
                    if (username.length < 5) {
                        this.errMessage.push({
                            obj: container.find("#username")
                            , message: "登录名必须大于4个字符!"
                        });
                        verifyFlg = false;
                    }
                }
            }

            var password = this.login.password;
            if (password === null || password === '') {
                this.errMessage.push({
                    obj: container.find("#password")
                    , message: "密码不能为空!"
                });
                verifyFlg = false;
            }

            var check_code = this.login.check_code;
            if (check_code === null || check_code === '') {
                this.errMessage.push({
                    obj: container.find("#check_code")
                    , message: "验证码不能为空!"
                });
                verifyFlg = false;
            }

            if (!verifyFlg) {
                err.err(this.errMessage, {
                    width: 200
                    , height: 20
                    , msgClass: 'login_err'
                    , layout: 'centerleft'
                    , background: 'rgba(255,255,255,1)'
                });
            }
            return verifyFlg;
        },
        loginOut: function (container, callback) {
            DataLoad.GetData(null, loginObj.loginOutApi, null, function (result) {
                common.fn.delstorage('sessionkey');
                common.fn.delstorage('userinfo');
                if (result.status === 'success' && (result.resultObject !== null || result.resultObject !== '')) {
                    if (typeof callback === 'function') {
                        callback();
                    }
                }
                else {
                    var errDialog = err.dialog(result.message, {
                        width: 400
                        , obj: container
                        , callback: function (notykit) {
                            errDialog.Close();
                        }
                    });
                }
            });
        }
    }

    return {
        login: loginObj.init
        , loginOut: loginObj.loginOut
    }
});