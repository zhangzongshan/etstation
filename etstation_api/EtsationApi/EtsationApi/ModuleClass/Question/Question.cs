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

namespace ModuleClass.Question
{
    class Question
    {
        private static MysqlHelper mysql = new MysqlHelper(mysqlconnection.conn());
        public static HttpResponseMessage Update()
        {
            string resCode = "";
            string resMessage = "";
            string status = "fail";
            List<string> del_file = null;

            string sessionKey = HttpContext.Current.Request.QueryString["sessionkey"];
            SessionObject loginSession = (SessionObject)CacheHelper.GetCache(sessionKey);
            int company_id = loginSession.Userinfo.company_id;
            if (company_id > 0)
            {
                var request = HttpContext.Current.Request;

                string id = request.Form["id"];
                string title = request.Form["title"];
                string cate = request.Form["cate"];
                string content = request.Form["content"];

                if (id != null && id != "")
                {
                    string update_str = "";
                    if (title != null)
                    {
                        update_str += "title='" + title + "', ";
                    }
                    if (cate != null)
                    {
                        update_str += "cate=" + cate + ", ";
                    }
                    if (content != null)
                    {
                        update_str += "content='" + content + "', ";
                    }

                    update_str = update_str.Substring(0, update_str.Length - 2);

                    string update_question_sql_str = "update etstation.question set " + update_str + " where id=" + id;
                    if (mysql.ExecuteNonQuery(update_question_sql_str))
                    {
                        status = "success";
                    }
                }
                else
                {
                    string insert_item = "";
                    string insert_value = "";
                    if (title != null)
                    {
                        insert_item += "title,";
                        insert_value += "'" + title + "',";
                    }
                    if (cate != null)
                    {
                        insert_item += "cate,";
                        insert_value += cate + ",";
                    }
                    if (content != null)
                    {
                        insert_item += "content,";
                        insert_value += "'" + content + "',";
                    }

                    insert_item += "company_id";
                    insert_value += company_id;


                    if (insert_item != "" && insert_value != "")
                    {
                        string insert_question_sql_str = "insert into etstation.question (" + insert_item + ") values (" + insert_value + ")";
                        long question_id = mysql.ExecuteInsertId(insert_question_sql_str);
                        if (question_id > 0)
                        {
                            status = "success";
                        }
                    }
                }
            }

            return Result.getDataResult(resCode, resMessage, status, "");
        }
        public static HttpResponseMessage PostList()
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
                string formTitle = request.Form["title"];
                string cate = request.Form["cate"];

                int current = (formCurrent != null && formCurrent != "") ? Convert.ToInt16(formCurrent) : 1;
                int pageSize = (formPageSize != null && formPageSize != "") ? Convert.ToInt16(formPageSize) : 10;
                string title = mysql.ReplaceSql((formTitle != null && formTitle != "") ? formTitle : null);

                string where_str = "company_id=" + company_id;
                if (title != null)
                {
                    where_str += " and title like '%" + title + "%'";
                }

                if (cate != null && cate != "")
                {
                    where_str += " and cate=" + cate;
                }

                list = mysql.Page(
                    mysql
                    , "etstation.question_view"
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

        public static HttpResponseMessage PostDel()
        {
            string resCode = "";
            string resMessage = "";
            string status = "fail";
            var request = HttpContext.Current.Request;
            string id_str = request.Form["id"];
            int id = (id_str != null && id_str != "") ? Convert.ToInt32(id_str) : 0;
            if (id > 0)
            {
                string del_question_sql_str = "delete from etstation.question where id=" + id;
                if (mysql.ExecuteNonQuery(del_question_sql_str))
                {
                    status = "success";
                }
            }
            return Result.getDataResult(resCode, resMessage, status, "");
        }
    }
}
