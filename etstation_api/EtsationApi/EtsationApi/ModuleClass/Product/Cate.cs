using ModuleClass.DataModule;
using NS.ClassMysqlHelper;
using PublicClass.Common;
using PublicClass.Result;
using PublicClass.WebMessage;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ModuleClass.Product
{
    class Cate
    {
        private static MysqlHelper mysql = new MysqlHelper(mysqlconnection.conn());
        public static HttpResponseMessage UpdateCate()
        {
            string resCode = "";
            string resMessage = "";
            string status = "fail";
            string delfile = "";

            string sessionKey = HttpContext.Current.Request.QueryString["sessionkey"];
            SessionObject loginSession = (SessionObject)CacheHelper.GetCache(sessionKey);

            if (loginSession.Userinfo.company_id > 0)
            {
                var request = HttpContext.Current.Request;
                string root = HttpContext.Current.Server.MapPath("~/App_Data/ProductCate/");

                if (!Directory.Exists(root))
                {
                    Common.creatDir(root);
                }

                string id = request.Form["id"];
                string name = request.Form["name"];
                string website = request.Form["website"];
                string logo = "";
                string detail = request.Form["detail"];

                var logoObj = request.Files["logo"];

                if (logoObj != null && logoObj.FileName != "")
                {
                    if (id != null && id != "")
                    {
                        string get_old_logo_sql_str = "select logo from etstation.product_cate where id=" + id;
                        string old_logo = mysql.ExecuteFirst(get_old_logo_sql_str);
                        if (old_logo != "")
                        {
                            delfile = old_logo;
                        }
                    }
                    logo = Common.getRandom(5) + logoObj.FileName;
                    logoObj.SaveAs(root + logo);
                }
                else
                {
                    logo = null;
                }

                int company_id = loginSession.Userinfo.company_id;

                if (id != null && id != "")
                {
                    string update_str = "";
                    if (name != null)
                    {
                        update_str += "name='" + name + "', ";
                    }
                    if (website != null)
                    {
                        update_str += "website='" + website + "', ";
                    }
                    if (logo != null)
                    {
                        update_str += "logo='" + logo + "', ";
                    }
                    if (detail != null)
                    {
                        update_str += "detail='" + detail + "', ";
                    }

                    update_str = update_str.Substring(0, update_str.Length - 2);

                    string update_productCate_sql_str = "update etstation.product_cate set " + update_str + " where id=" + id;
                    if (mysql.ExecuteNonQuery(update_productCate_sql_str))
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
                    if (website != null)
                    {
                        insert_item += "website,";
                        insert_value += "'" + website + "',";
                    }
                    if (logo != null)
                    {
                        insert_item += "logo,";
                        insert_value += "'" + logo + "',";
                    }
                    if (detail != null)
                    {
                        insert_item += "detail,";
                        insert_value += "'" + detail + "',";
                    }

                    insert_item += "company_id";
                    insert_value += company_id;


                    if (insert_item != "" && insert_value != "")
                    {
                        string insert_productCate_sql_str = "insert into etstation.product_cate (" + insert_item + ") values (" + insert_value + ")";
                        long productCate_user_id = mysql.ExecuteInsertId(insert_productCate_sql_str);
                        if (productCate_user_id > 0)
                        {
                            status = "success";
                        }
                    }

                }

                if (delfile != "")
                {
                    Common.FileDel(root + delfile);
                }
            }

            return Result.getDataResult(resCode, resMessage, status, "");
        }

        public static HttpResponseMessage UpdateChildCate()
        {
            string resCode = "";
            string resMessage = "";
            string status = "fail";

            string sessionKey = HttpContext.Current.Request.QueryString["sessionkey"];
            SessionObject loginSession = (SessionObject)CacheHelper.GetCache(sessionKey);

            if (loginSession.Userinfo.company_id > 0)
            {
                var request = HttpContext.Current.Request;

                string id = request.Form["id"];
                string name = request.Form["name"];
                string cate_id = request.Form["cate_id"];

                int company_id = loginSession.Userinfo.company_id;

                if (id != null && id != "")
                {
                    string update_str = "";
                    if (name != null)
                    {
                        update_str += "cate_name='" + name + "', ";
                    }

                    update_str += "cate_id=" + cate_id;

                    string update_productCate_sql_str = "update etstation.child_cate set " + update_str + " where id=" + id;
                    if (mysql.ExecuteNonQuery(update_productCate_sql_str))
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
                        insert_item += "cate_name,";
                        insert_value += "'" + name + "',";
                    }
                    insert_item += "cate_id";
                    insert_value += cate_id;

                    if (insert_item != "" && insert_value != "")
                    {
                        string insert_productCate_sql_str = "insert into etstation.child_cate (" + insert_item + ") values (" + insert_value + ")";
                        long productCate_user_id = mysql.ExecuteInsertId(insert_productCate_sql_str);
                        if (productCate_user_id > 0)
                        {
                            status = "success";
                        }
                    }
                }
            }

            return Result.getDataResult(resCode, resMessage, status, "");
        }

        public static HttpResponseMessage ListCate()
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
                string formName = request.Form["name"];
                
                int current = (formCurrent != null && formCurrent != "") ? Convert.ToInt16(formCurrent) : 1;
                int pageSize = (formPageSize != null && formPageSize != "") ? Convert.ToInt16(formPageSize) : 10;
                string name = mysql.ReplaceSql((formName != null && formName != "") ? formName : null);
                
                string where_str = "company_id=" + company_id;
                if (name != null)
                {
                    where_str += " and name like '%" + name + "%'";
                }

                list = mysql.Page(
                    mysql
                    , "etstation.product_cate"
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

        public static HttpResponseMessage ListChildCate()
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
                string cate_id = request.Form["cate_id"];

                int current = (formCurrent != null && formCurrent != "") ? Convert.ToInt16(formCurrent) : 1;
                int pageSize = (formPageSize != null && formPageSize != "") ? Convert.ToInt16(formPageSize) : 10;
                
                string where_str = "cate_id=" + cate_id;

                list = mysql.Page(
                    mysql
                    , "etstation.child_cate"
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

        public static HttpResponseMessage CateDel()
        {
            string resCode = "";
            string resMessage = "";
            string status = "fail";

            var request = HttpContext.Current.Request;
            string id_str = request.Form["id"];
            int id = (id_str != null && id_str != "") ? Convert.ToInt32(id_str) : 0;
            if (id > 0)
            {
                string count_childCate_sql_str= "select count(id) from etstation.child_cate where cate_id=" + id;
                int count_childCate = Convert.ToInt32(mysql.ExecuteFirst(count_childCate_sql_str));
                if (count_childCate > 0)
                {
                    resCode = WebMessageConstant.HAVE_DEPENDENCE;
                    resMessage = "子分类不为空";
                }
                else
                {
                    string get_productCate_logo_sql_str = "select logo from etstation.product_cate where id=" + id;
                    string logo = mysql.ExecuteFirst(get_productCate_logo_sql_str);
                    if (logo != "")
                    {
                        string root = HttpContext.Current.Server.MapPath("~/App_Data/ProductCate/");
                        Common.FileDel(root + logo);
                    }
                    string del_productCate_sql_str = "delete from etstation.product_cate where id=" + id;
                    if (mysql.ExecuteNonQuery(del_productCate_sql_str))
                    {
                        status = "success";
                    }
                }
                
            }

            return Result.getDataResult(resCode, resMessage, status, "");
        }

        public static HttpResponseMessage CateChildDel()
        {
            string resCode = "";
            string resMessage = "";
            string status = "fail";

            var request = HttpContext.Current.Request;
            string id_str = request.Form["id"];
            int id = (id_str != null && id_str != "") ? Convert.ToInt32(id_str) : 0;
            if (id > 0)
            {
                string del_productCate_sql_str = "delete from etstation.child_cate where id=" + id;
                if (mysql.ExecuteNonQuery(del_productCate_sql_str))
                {
                    status = "success";
                }
            }
            return Result.getDataResult(resCode, resMessage, status, "");
        }
    }
}
