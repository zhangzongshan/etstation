using NS.ModuleClass.Login;
using PublicClass.Common;
using PublicClass.Result;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using ModuleClass.DataModule;

namespace EtsationApi.Controllers
{
    [RoutePrefix("api/accounts")]
    public class LoginController : ApiController
    {
        /// <summary>
        /// 用户登录
        /// </summary>
        /// <param name="item"></param>
        /// <returns></returns>
        [Route("account/login")]
        public HttpResponseMessage PostLogin(LoginModule login_param)
        {
            return Login.LoginIn(login_param);
        }

        /// <summary>
        /// 退出登录
        /// </summary>
        /// <param name="sessionkey"></param>
        /// <returns></returns>
        [Route("account/loginOut")]
        //[SessionValidate]
        public HttpResponseMessage PostLoginOut()
        {
            return Login.LoginOut();
        }

        
    }
}
