using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using NS.ModuleClass.ValidationCode;
using System.Web;
using NS.ModuleClass.Login;

namespace Controllers.ValidationCode
{
    [RoutePrefix("api/ValidationCode")]
    public class ValidationCodeController : ApiController
    {
        // GET: api/ValidationCode
        /// <summary>
        /// 获取图片验证码
        /// </summary>
        /// <returns>Json字符串</returns>
        public HttpResponseMessage Get(string par)
        {
            string clientInfoId = HttpContext.Current.Request["clientInfoId"];
            return ModuleValidationCode.Content(clientInfoId);
        }

        // POST: api/ValidationCode
        /// <summary>
        /// 获取图片验证码
        /// </summary>
        /// <returns>Json字符串</returns>
        public HttpResponseMessage Post(string sessionkey)
        {
            string clientInfoId = HttpContext.Current.Request["clientInfoId"];
            return ModuleValidationCode.Content(clientInfoId);
        }
    }
}