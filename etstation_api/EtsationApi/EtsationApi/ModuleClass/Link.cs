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

namespace ModuleClass.Link
{
    class Link
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
                string name = request.Form["name"];
                string cate = request.Form["cate"];
                string linkPic = request.Form["LinkPic"];
                string herf_url = request.Form["herf_url"];
                string pic = "";

                string root = HttpContext.Current.Server.MapPath("~/App_Data/LinkImg/");

                if (!Directory.Exists(root))
                {
                    Common.creatDir(root);
                }

                if (id != null && id != "")
                {
                    string get_old_pic_sql_str = "select pic from etstation.page_link where id=" + id;
                    string old_pic = mysql.ExecuteFirst(get_old_pic_sql_str);
                    if (old_pic != "")
                    {
                        del_file = old_pic.Split(',').ToList();
                    }
                }
                if (linkPic != null)
                {
                    string[] array_orgin = linkPic.Split(',');
                    for (int i = 0; i < array_orgin.Length; i++)
                    {
                        string tempValue = array_orgin[i];

                        if (tempValue == "" && request.Files[i] != null && request.Files[i].FileName != "")
                        {
                            string fileName = Common.getRandom(5) + request.Files[i].FileName;
                            pic += fileName + ",";
                            request.Files[i].SaveAs(root + fileName);
                        }
                        else
                        {
                            if (tempValue != "")
                            {
                                if (del_file.Contains(tempValue))
                                {
                                    del_file.Remove(tempValue);
                                }
                                pic += tempValue + ",";
                            }
                        }
                    }
                }

                if (id != null && id != "")
                {
                    string update_str = "";
                    if (name != null)
                    {
                        update_str += "name='" + name + "', ";
                    }
                    if (pic != null)
                    {
                        update_str += "pic='" + pic + "', ";
                    }
                    if (herf_url != null)
                    {
                        update_str += "herf_url='" + herf_url + "', ";
                    }
                    if (cate != null)
                    {
                        update_str += "page_cate=" + cate + ", ";
                    }

                    update_str = update_str.Substring(0, update_str.Length - 2);

                    string update_question_sql_str = "update etstation.page_link set " + update_str + " where id=" + id;
                    if (mysql.ExecuteNonQuery(update_question_sql_str))
                    {
                        status = "success";
                    }
                }
                else
                {
                    string insert_item = "";
                    string insert_value = "";
                    if (name != null)
                    {
                        insert_item += "name,";
                        insert_value += "'" + name + "',";
                    }
                    if (cate != null)
                    {
                        insert_item += "page_cate,";
                        insert_value += cate + ",";
                    }
                    if (pic != "")
                    {
                        insert_item += "pic,";
                        insert_value += "'" + pic + "',";
                    }
                    if (herf_url != "")
                    {
                        insert_item += "herf_url,";
                        insert_value += "'" + herf_url + "',";
                    }

                    insert_item += "company_id";
                    insert_value += company_id;


                    if (insert_item != "" && insert_value != "")
                    {
                        string insert_question_sql_str = "insert into etstation.page_link (" + insert_item + ") values (" + insert_value + ")";
                        long question_id = mysql.ExecuteInsertId(insert_question_sql_str);
                        if (question_id > 0)
                        {
                            status = "success";
                        }
                    }
                }
                if (del_file != null)
                {
                    for (int i = 0; i < del_file.Count; i++)
                    {
                        if (del_file[i] != "")
                        {
                            Common.FileDel(root + del_file[i]);
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
                string formName = request.Form["title"];
                string cate = request.Form["cate"];

                int current = (formCurrent != null && formCurrent != "") ? Convert.ToInt16(formCurrent) : 1;
                int pageSize = (formPageSize != null && formPageSize != "") ? Convert.ToInt16(formPageSize) : 10;
                string name = mysql.ReplaceSql((formName != null && formName != "") ? formName : null);

                string where_str = "company_id=" + company_id;
                if (name != null)
                {
                    where_str += " and name like '%" + name + "%'";
                }

                if (cate != null && cate != "")
                {
                    where_str += " and cate=" + cate;
                }
                

                list = mysql.Page(
                    mysql
                    , "etstation.link_view"
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
                string get_pic_sql_str = "select pic from etstation.page_link where id=" + id;
                string pic = mysql.ExecuteFirst(get_pic_sql_str);

                string del_productCate_sql_str = "delete from etstation.page_link where id=" + id;
                if (mysql.ExecuteNonQuery(del_productCate_sql_str))
                {
                    status = "success";
                    if (pic != "")
                    {
                        string root = HttpContext.Current.Server.MapPath("~/App_Data/LinkImg/");
                        string[] arrPic = pic.Split(',');
                        for (int i = 0; i < arrPic.Length; i++)
                        {
                            if (arrPic[i] != "")
                            {
                                Common.FileDel(root + arrPic[i]);
                            }
                        }
                    }
                }

            }

            return Result.getDataResult(resCode, resMessage, status, "");
        }
    }
}
