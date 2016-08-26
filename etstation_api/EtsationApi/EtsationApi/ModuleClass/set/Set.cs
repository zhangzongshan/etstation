using ModuleClass.DataModule;
using NS.ClassMysqlHelper;
using PublicClass.Common;
using PublicClass.Result;
using PublicClass.WebMessage;
using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ModuleClass.Set
{
    class Set
    {
        private static MysqlHelper mysql = new MysqlHelper(mysqlconnection.conn());

        public static HttpResponseMessage Update()
        {
            string resCode = "";
            string resMessage = "";
            string status = "fail";
            string del_file = null;

            string sessionKey = HttpContext.Current.Request.QueryString["sessionkey"];
            SessionObject loginSession = (SessionObject)CacheHelper.GetCache(sessionKey);
            int company_id = loginSession.Userinfo.company_id;
            if (company_id > 0)
            {
                var request = HttpContext.Current.Request;

                string id = request.Form["id"];
                string ids = request.Form["ids"];
                string picInfo = request.Form["pic"];
                string pic = null;

                string root = HttpContext.Current.Server.MapPath("~/App_Data/BgImg/");

                if (!Directory.Exists(root))
                {
                    Common.creatDir(root);
                }

                if (ids != null && ids != "")
                {
                    string get_old_pic_sql_str = "select pic from etstation.web_bg where id=" + id;
                    string old_pic = mysql.ExecuteFirst(get_old_pic_sql_str);
                    if (old_pic != "")
                    {
                        del_file = old_pic;
                    }
                }

                if(picInfo!=null)
                {
                    if(request.Files["pic"]!=null && request.Files["pic"].FileName != "")
                    {
                        string fileName = Common.getRandom(5) + request.Files["pic"].FileName;
                        pic = fileName;
                        request.Files["pic"].SaveAs(root + fileName);
                    }
                    if (picInfo != "" && picInfo== del_file)
                    {
                        del_file = "";
                    }
                }
                else
                {
                    del_file = "";
                }

                if (id != null && id != "")
                {
                    string update_str = "";
                    
                    if (pic != null)
                    {
                        update_str += "pic='" + pic + "',";
                    }
                    if (ids != null)
                    {
                        update_str += "ids='" + ids + "',";
                    }

                    update_str = update_str.Substring(0, update_str.Length - 1);

                    string update_question_sql_str = "update etstation.web_bg set " + update_str + " where id=" + id;
                    if (mysql.ExecuteNonQuery(update_question_sql_str))
                    {
                        status = "success";
                    }
                }
                else
                {
                    string insert_item = "";
                    string insert_value = "";
                    if (ids != null)
                    {
                        insert_item += "ids,";
                        insert_value += "'" + ids + "',";
                    }

                    if (pic != "")
                    {
                        insert_item += "pic,";
                        insert_value += "'" + pic + "',";
                    }

                    insert_item += "company_id";
                    insert_value += company_id;


                    if (insert_item != "" && insert_value != "")
                    {
                        string insert_question_sql_str = "insert into etstation.web_bg (" + insert_item + ") values (" + insert_value + ")";
                        long question_id = mysql.ExecuteInsertId(insert_question_sql_str);
                        if (question_id > 0)
                        {
                            status = "success";
                        }
                    }
                }
                if (del_file != null && del_file!="")
                {
                    Common.FileDel(root + del_file);
                }
            }

            return Result.getDataResult(resCode, resMessage, status, "");
        }

        public static HttpResponseMessage AdminUpdate()
        {
            string resCode = "";
            string resMessage = "";
            string status = "fail";
            string del_file = null;

            string sessionKey = HttpContext.Current.Request.QueryString["sessionkey"];
            SessionObject loginSession = (SessionObject)CacheHelper.GetCache(sessionKey);
            int company_id = loginSession.Userinfo.company_id;

            var request = HttpContext.Current.Request;

            string id = request.Form["id"];
            string username = request.Form["username"];
            string mobile = request.Form["mobile"];
            string email = request.Form["email"];
            string photo = request.Form["photo"];
            string name = request.Form["name"];
            string password = request.Form["password"];
            string repassword = request.Form["repassword"];

            string pic_photo = null;

            string root = HttpContext.Current.Server.MapPath("~/App_Data/AdminImg/");

            if (!Directory.Exists(root))
            {
                Common.creatDir(root);
            }

            string get_old_photo_sql_str = "select photo from etstation.user where id=" + id;
            string old_photo = mysql.ExecuteFirst(get_old_photo_sql_str);
            if (old_photo != "")
            {
                del_file = old_photo;
            }

            if (request.Files["photo"] != null && request.Files["photo"].FileName != "")
            {
                string fileName = Common.getRandom(5) + request.Files["photo"].FileName;
                pic_photo = fileName;
                request.Files["photo"].SaveAs(root + fileName);
            }
            if (photo != "" && photo == del_file)
            {
                del_file = "";
            }

            string update_str = "";

            if (username != null)
            {
                update_str += "username='" + username + "',";
            }
            if (mobile != null)
            {
                update_str += "mobile='" + mobile + "',";
            }
            if (email != null)
            {
                update_str += "mobile='" + email + "',";
            }
            if (name != null)
            {
                update_str += "name='" + name + "',";
            }
            if (pic_photo != null)
            {
                update_str += "photo='" + pic_photo + "',";
            }

            update_str = update_str.Substring(0, update_str.Length - 1);

            bool userflg = false;
            bool passflg = false;

            string update_user_sql_str = "update etstation.user set " + update_str + " where id=" + id;
            if (mysql.ExecuteNonQuery(update_user_sql_str))
            {
                userflg = true;
            }

            if (password != "")
            {
                if (password == repassword)
                {
                    string update_password = "password='" + Common.GetMD5(password) + "',";
                    update_password += "oauth_name='" + username + "'";
                    string update_password_sql_str = "update etstation.authenticate set " + update_password + " where user_id=" + id;
                    if (mysql.ExecuteNonQuery(update_password_sql_str))
                    {
                        passflg = true;
                    }
                }
            }
            else
            {
                passflg = true;
            }

            if (userflg && passflg)
            {
                status = "success";
            }

            if (del_file != null && del_file != "")
            {
                Common.FileDel(root + del_file);
            }

            return Result.getDataResult(resCode, resMessage, status, "");
        }

        public static HttpResponseMessage Get()
        {
            string resCode = "";
            string resMessage = "";
            string status = "fail";
            PageModule list = null;

            string sessionKey = HttpContext.Current.Request.QueryString["sessionkey"];
            SessionObject loginSession = (SessionObject)CacheHelper.GetCache(sessionKey);

            int company_id = loginSession.Userinfo.company_id;

            if (company_id > 0)
            {
                var request = HttpContext.Current.Request;
                string formCurrent = request.Form["current"];
                string formPageSize = request.Form["pageSize"];
                string ids = request.Form["ids"];

                int current = (formCurrent != null && formCurrent != "") ? Convert.ToInt16(formCurrent) : 1;
                int pageSize = (formPageSize != null && formPageSize != "") ? Convert.ToInt16(formPageSize) : 100;
                ids = mysql.ReplaceSql((ids != null && ids != "") ? ids : null);

                string where_str = "company_id=" + company_id;
                if (ids != null)
                {
                    where_str += " and ids='" + ids + "'";
                }


                list = mysql.Page(
                    mysql
                    , "etstation.web_bg"
                    , "id"
                    , "desc"
                    , where_str
                    , current
                    , pageSize
                    );
                status = "success";
            }

            return Result.getDataResult(resCode, resMessage, status, list);
        }

    }
}
