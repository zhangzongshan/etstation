using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;

namespace PublicClass.Result
{
    class Result
    {
        public static HttpResponseMessage getDataResult(string code,string message, Object obj)
        {
            return getDataResult(code, message, "success", obj);
        }

        public static HttpResponseMessage getSuccessDataResult(string code, string message)
        {
            return getDataResult(code, message, "success", "");
        }

        public static HttpResponseMessage getFailDataResult(string code, string message)
        {
            return getDataResult(code, message, "fail", "");
        }

        public static HttpResponseMessage getDataResult(string code, string message,string status, Object obj)
        {
            Hashtable result = new Hashtable();
            result.Add("resultObject", obj);
            result.Add("status", status);
            result.Add("code", code);
            result.Add("message", message);
            HttpResponseMessage res = new HttpResponseMessage(HttpStatusCode.OK) {
                Content = new StringContent(JsonConvert.SerializeObject(result), Encoding.GetEncoding("UTF-8"), "application/json")
            };
            return res;
        }
    }
}
