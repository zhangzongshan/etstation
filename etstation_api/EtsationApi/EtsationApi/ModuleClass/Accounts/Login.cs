using NS.ClassMysqlHelper;
using PublicClass.Result;
using PublicClass.WebMessage;
using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;
using System.Security.Cryptography;
using PublicClass.Common;
using ModuleClass.DataModule;
using System.Web.Http.Controllers;
using System.Security.Principal;
using System.Threading;
using PublicClass.SystemConfig;

namespace NS.ModuleClass.Login
{
    class Login
    {
        /// <summary>
        /// 用户登录
        /// </summary>
        /// <param name="login_param"></param>
        /// <returns></returns>
        public static HttpResponseMessage LoginIn(LoginModule login_param)
        {
            string resCode = "";
            string resMessage = "";
            string status = "fail";
            //参数验证
            #region
            if (string.IsNullOrEmpty(login_param.username))
            {
                throw new ApiException("用户名称不能为空.", "RequireParameter_username");
            }

            if (string.IsNullOrEmpty(login_param.password))
            {
                throw new ApiException("密码不能为空.", "RequireParameter_password");
            }

            if (string.IsNullOrEmpty(login_param.check_code))
            {
                throw new ApiException("验证码不能为空.", "RequireParameter_check_code");
            }

            if (string.IsNullOrEmpty(login_param.client_uuid))
            {
                throw new ApiException("UUID不能为空.", "RequireParameter_client_uuid");
            }

            if (string.IsNullOrEmpty(login_param.type))
            {
                throw new ApiException("验证类别不能为空.", "RequireParameter_type");
            }
            #endregion

            //用户登录
            #region
            SessionObject loginSession = null;
            User userInfo = null;
            UserDevice uDevice = null;

            MysqlHelper mysql = new MysqlHelper(mysqlconnection.conn());
            if (login_param.type == "uuid")
            {
                string check_validationCode_sql_str = "select * from etstation.validationcode where uuid='" + mysql.ReplaceSql(login_param.client_uuid) + "' and lower(code)=lower('" + mysql.ReplaceSql(login_param.check_code) + "')";
                DataTable checkTable = mysql.ExecuteDataTable(check_validationCode_sql_str);

                if (checkTable.Rows.Count == 1)
                {
                    DateTime last_time = (DateTime)checkTable.Rows[0]["last_time"];
                    int expires=(int)checkTable.Rows[0]["expires"];
                    if((DateTime.UtcNow - last_time).TotalSeconds <= expires)
                    {
                        string check_password_sql_str = "select user_id from etstation.authenticate where oauth_id='uuid' and oauth_name='" + mysql.ReplaceSql(login_param.username) + "' and password='" + Common.GetMD5(login_param.password) + "'";
                        string userId = mysql.ExecuteFirst(check_password_sql_str);
                        if (userId != "" && Convert.ToInt32(userId) > 0)
                        {
                            string get_user_sql_str = "select * from etstation.user where id=" + userId;
                            DataTable userTableInfo = mysql.ExecuteDataTable(get_user_sql_str);
                            if (userTableInfo.Rows.Count >0)
                            {
                                DataRow datarow = userTableInfo.Rows[0];

                                int id = Convert.ToInt32(userId);
                                string username = datarow["username"].ToString();
                                string mobile = datarow["mobile"].ToString();
                                string email = datarow["email"].ToString();
                                string photo = datarow["photo"].ToString();
                                string name = datarow["name"].ToString();
                                bool isActive =Convert.ToBoolean(datarow["isActive"]);
                                int company_id = datarow["company_id"].ToString() != "" ? Convert.ToInt32(datarow["company_id"].ToString()) : -1;

                                userInfo = new User();
                                userInfo.id = id;
                                userInfo.username = username;
                                userInfo.mobile = mobile;
                                userInfo.email = email;
                                userInfo.photo = photo;
                                userInfo.name = name;
                                userInfo.isActive = isActive;
                                userInfo.company_id = company_id;

                                string sessionkey = Common.GetMD5(id + username + DateTime.UtcNow.ToString() + login_param.client_uuid);

                                uDevice = new UserDevice();
                                uDevice.createtime = DateTime.UtcNow;
                                uDevice.activetime = DateTime.UtcNow;
                                uDevice.expiredtime = DateTime.UtcNow.AddMinutes(SystemConfig.session_time_out);
                                uDevice.devicetype = login_param.client_uuid;
                                uDevice.userid = id;
                                uDevice.sessionkey = sessionkey;
                                uDevice.password = login_param.password;

                                string updata_login_sql_str = "update etstation.authenticate set count=count+1,last_time='" + DateTime.UtcNow + "' where user_id=" + id;
                                bool updateFlg = mysql.ExecuteNonQuery(updata_login_sql_str);
                                if (updateFlg)
                                {
                                    loginSession = new SessionObject();
                                    loginSession.Userinfo = userInfo;
                                    loginSession.SessionKey = uDevice;
                                    //写入缓存
                                    CacheHelper.SetCache(sessionkey, loginSession, TimeSpan.FromMinutes(SystemConfig.session_time_out));

                                    loginSession.SessionKey.password = "";

                                    resCode = WebMessageConstant.PASS_DATA_CATCH;
                                    resMessage = "登陆成功!";
                                    status = "success";
                                }
                                else
                                {
                                    resCode = WebMessageConstant.SQL_MODIFY_ERR;
                                    resMessage = "登陆信息数据更新失败!";
                                }
                            }
                            else
                            {
                                resCode = WebMessageConstant.GET_USER_ERR;
                                resMessage = "用户名或密码错误!";
                            }
                        }
                        else
                        {
                            resCode = WebMessageConstant.GET_USER_ERR;
                            resMessage = "用户名或密码错误!";                            
                        }
                    }
                    else
                    {
                        resCode = WebMessageConstant.TIME_OUT_ERR;
                        resMessage = "验证码过期!";
                    }
                }
                else
                {
                    resCode = WebMessageConstant.GET_VALCODE_FAIL;
                    resMessage = "验证码输入错误!";
                }
            }
            #endregion

            return Result.getDataResult(resCode, resMessage, status,loginSession);
        }
        /// <summary>
        /// 用户退出登录
        /// </summary>
        /// <param name="sessionkey"></param>
        /// <returns></returns>
        public static HttpResponseMessage LoginOut()
        {
            string resCode = WebMessageConstant.OP_SUCCESS;
            string resMessage = "用户退出成功!";
            string status = "success";

            string sessionkey = HttpContext.Current.Request.QueryString["sessionkey"];

            CacheHelper.RemoveAllCache(sessionkey);

            return Result.getDataResult(resCode, resMessage, status, "");
        }
    }

    /// <summary>
    /// 用户更新验证
    /// </summary>
    public class SessionValidateAttribute : System.Web.Http.Filters.ActionFilterAttribute {
        public override void OnActionExecuting(HttpActionContext filterContext)
        {
            var qs = HttpUtility.ParseQueryString(filterContext.Request.RequestUri.Query);
            string sessionKey = qs["sessionkey"];
            if (sessionKey==null || sessionKey == "" || sessionKey== "anonymous")
            {
                SessionObject loginSession = (SessionObject)CacheHelper.GetCache(sessionKey);
                if (loginSession != null)
                {
                    loginSession.SessionKey.createtime = DateTime.UtcNow;
                    loginSession.SessionKey.activetime = DateTime.UtcNow;
                    loginSession.SessionKey.expiredtime = DateTime.UtcNow.AddMinutes(SystemConfig.session_time_out);

                    CacheHelper.SetCache(sessionKey, loginSession);
                }
                else
                {
                    User userInfo = new User();
                    userInfo.id = -1;
                    userInfo.username = "";
                    userInfo.mobile = "";
                    userInfo.email = "";
                    userInfo.photo = "";
                    userInfo.name = "";
                    userInfo.isActive = false;
                    userInfo.company_id = 2;

                    UserDevice uDevice = new UserDevice();
                    uDevice.createtime = DateTime.UtcNow;
                    uDevice.activetime = DateTime.UtcNow;
                    uDevice.expiredtime = DateTime.UtcNow.AddMinutes(SystemConfig.session_time_out);
                    uDevice.devicetype = "";
                    uDevice.userid = -1;
                    uDevice.sessionkey = sessionKey;
                    uDevice.password = "";

                    loginSession = new SessionObject();
                    loginSession.Userinfo = userInfo;
                    loginSession.SessionKey = uDevice;
                    //写入缓存
                    CacheHelper.SetCache(sessionKey, loginSession, TimeSpan.FromMinutes(SystemConfig.session_time_out));
                }
            }
            else
            {
                if (!string.IsNullOrEmpty(sessionKey))
                {
                    SessionObject loginSession = (SessionObject)CacheHelper.GetCache(sessionKey);
                    if (loginSession != null)
                    {
                        if (loginSession.SessionKey.expiredtime < DateTime.UtcNow)
                        {
                            throw new ApiException("登陆信息过期!", WebMessageConstant.SESSION_TIME_OUT);
                        }

                        if (loginSession.Userinfo.id < 1)
                        {
                            throw new ApiException("用户不存在!", WebMessageConstant.GET_USER_ERR);
                        }
                        else
                        {
                            filterContext.ControllerContext.RouteData.Values["loginUser"] = loginSession.Userinfo;
                        }

                        loginSession.SessionKey.createtime = DateTime.UtcNow;
                        loginSession.SessionKey.activetime = DateTime.UtcNow;
                        loginSession.SessionKey.expiredtime = DateTime.UtcNow.AddMinutes(SystemConfig.session_time_out);

                        CacheHelper.SetCache(sessionKey, loginSession);
                    }
                    else
                    {
                        throw new ApiException("登陆信息过期或用户不存在!", WebMessageConstant.LOGIN_TIME_ERR);
                    }

                }
                else
                {
                    throw new ApiException("没有用户信息传入!", WebMessageConstant.REQUIRE_USER_LOGIN);
                }
            }
        }
    }

}
