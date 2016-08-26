using NS.ClassMysqlHelper;
using NS.ClassValidateCode;
using PublicClass.Result;
using PublicClass.WebMessage;
using System;
using System.Collections;
using System.Net.Http;
using System.Web;

namespace NS.ModuleClass.ValidationCode
{
    class ModuleValidationCode
    {
        public static HttpResponseMessage Content(string clientInfoId)
        {
            Hashtable validation = new Hashtable();
            string resCode = "";
            string resMessage = "";
            try
            {
                if (clientInfoId != null && clientInfoId != "")
                {
                    ValidateCode validateCode = new ValidateCode();
                    //设置验证码位数
                    validateCode.ValidationCodeCount = 4;
                    validateCode.FontMinSize = 40;
                    validateCode.FontMaxSize = 50;
                    validateCode.Width = 300;
                    validateCode.Height = 80;
                    //获取验证码
                    string code = validateCode.GetRandomString(validateCode.ValidationCodeCount);
                    //创建验证码的图片
                    byte[] bytes = validateCode.CreateImage(code);
                    String strbaser64 = Convert.ToBase64String(bytes);

                    MysqlHelper mysql = new MysqlHelper(mysqlconnection.conn());
                    string check_uuid_sql_str = "select * from etstation.validationcode where uuid='" + mysql.ReplaceSql(clientInfoId) + "'";

                    bool result = false;
                    bool uuidFlg = mysql.ExecuteExists(check_uuid_sql_str);
                    if (uuidFlg)
                    {
                        string update_uuid_sql_str = "update etstation.validationcode set code='" + mysql.ReplaceSql(code) + "',last_time='" + DateTime.UtcNow + "' where uuid='" + mysql.ReplaceSql(clientInfoId) + "'";
                        result = mysql.ExecuteNonQuery(update_uuid_sql_str);
                    }
                    else
                    {
                        string inert_uuid_sql_str = "insert into etstation.validationcode (uuid, code,expires) values ( '" + mysql.ReplaceSql(clientInfoId) + "','" + mysql.ReplaceSql(code) + "',300)";
                        result = mysql.ExecuteNonQuery(inert_uuid_sql_str);
                    }

                    if (result)
                    {
                        validation.Add("images", @"data:image/jpeg;base64," + strbaser64);
                        resCode = WebMessageConstant.GET_VALCODE_SUCCESS;
                        resMessage = "验证码获取成功";
                    }
                    else
                    {
                        validation.Add("images", null);
                        resCode = WebMessageConstant.SQL_MODIFY_ERR;
                        resMessage = "验证码获取失败";
                    }
                }
                else
                {
                    validation.Add("images", null);
                    resCode = WebMessageConstant.GET_VALCODE_FAIL;
                    resMessage = "无客户端信息";
                }
            }
            catch (Exception err)
            {
                validation.Add("images", null);
                resCode = WebMessageConstant.SYS_ERR;
                resMessage = err.Message;
            }
            return Result.getDataResult(resCode, resMessage, validation);
        }
    }
}
