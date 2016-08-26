using ModuleClass.DataModule;
using NS.ClassMysqlHelper;
using PublicClass.Common;
using PublicClass.Result;
using PublicClass.WebMessage;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ModuleClass.News
{
    class News
    {
        private static MysqlHelper mysql = new MysqlHelper(mysqlconnection.conn());
        public static HttpResponseMessage Update()
        {
            string resCode = "";
            string resMessage = "";
            string status = "fail";
            List<string> del_file = null;
            string del_video = "";

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
                string times = request.Form["times"];
                string show = request.Form["show"];

                string media_type = request.Form["media_type"];
                string newsPic = request.Form["NewsPic"];
                string pic_index = request.Form["pic_index"];

                string pic = "";
                string root = HttpContext.Current.Server.MapPath("~/App_Data/NewsImg/");
                if (!Directory.Exists(root))
                {
                    Common.creatDir(root);
                }

                if (id != null && id != "")
                {
                    string get_old_media_url_sql_str = "select media_url,media_type from etstation.news where id=" + id;
                    DataTable old_media_url = mysql.ExecuteDataTable(get_old_media_url_sql_str);
                    
                    if (old_media_url.Rows.Count>0)
                    {
                        del_file = old_media_url.Rows[0]["media_url"].ToString().Split(',').ToList();
                        string media_type_value = old_media_url.Rows[0]["media_type"].ToString();
                        if (media_type_value != "" && media_type_value != "pic")
                        {
                            del_video = media_type_value;
                        }
                    }
                }
                if (newsPic != null)
                {
                    string[] array_orgin = newsPic.Split(',');
                    for (int i = 0; i < array_orgin.Length; i++)
                    {
                        string tempValue = array_orgin[i];

                        if (tempValue == "" && request.Files[i]!= null && request.Files[i].FileName != "")
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
                if (media_type == "video")
                {
                    if (request.Files["file_video_url"] != null && request.Files["file_video_url"].FileName != "")
                    {
                        string video_file = Common.getRandom(5) + request.Files["file_video_url"].FileName;
                        request.Files["file_video_url"].SaveAs(root + video_file);
                        media_type = video_file;
                    }
                    else
                    {
                        media_type = del_video;
                        del_video = "";
                    }
                }

                if (pic_index == null)
                {
                    pic_index = "0";
                }

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
                    if (times != null)
                    {
                        update_str += "times='" + Convert.ToDateTime(times) + "', ";
                    }
                    if (show != null)
                    {
                        update_str += "isShow=" + show + ", ";
                    }
                    update_str += "media_type='" + media_type + "', ";
                    update_str += "media_url='" + pic + "', ";
                    update_str += "pic_index=" + pic_index;

                    string update_product_sql_str = "update etstation.news set " + update_str + " where id=" + id;
                    if (mysql.ExecuteNonQuery(update_product_sql_str))
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
                    if (times != null)
                    {
                        insert_item += "times,";
                        insert_value += "'" + Convert.ToDateTime(times) + "',";
                    }
                    if (show != null)
                    {
                        insert_item += "isShow,";
                        insert_value +=  show + ",";
                    }
                    insert_item += "media_type,";
                    insert_value += "'" + media_type + "',";

                    insert_item += "media_url,";
                    insert_value += "'" + pic + "',";

                    insert_item += "pic_index,";
                    insert_value += pic_index + ",";

                    insert_item += "company_id";
                    insert_value += company_id;


                    if (insert_item != "" && insert_value != "")
                    {
                        string insert_product_sql_str = "insert into etstation.news (" + insert_item + ") values (" + insert_value + ")";
                        long product_id = mysql.ExecuteInsertId(insert_product_sql_str);
                        if (product_id > 0)
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

                if (del_video != "")
                {
                    Common.FileDel(root + del_video);
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
                string media_type = request.Form["media_type"];

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

                if (media_type != null && media_type != "")
                {
                    if (media_type == "pic")
                    {
                        where_str += " and media_type='pic'";
                    }
                    else
                    {
                        where_str += " and media_type!='pic'";
                    }
                }

                list = mysql.Page(
                    mysql
                    , "etstation.news_view"
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
                string get_media_url_sql_str = "select media_url,media_type from etstation.news where id=" + id;
                DataTable deldata = mysql.ExecuteDataTable(get_media_url_sql_str);

                string pic = deldata.Rows[0]["media_url"].ToString();
                string video= deldata.Rows[0]["media_type"].ToString();

                string del_productCate_sql_str = "delete from etstation.news where id=" + id;
                if (mysql.ExecuteNonQuery(del_productCate_sql_str))
                {
                    status = "success";
                    string root = HttpContext.Current.Server.MapPath("~/App_Data/NewsImg/");
                    if (pic != "")
                    {
                        string[] arrPic = pic.Split(',');
                        for (int i = 0; i < arrPic.Length; i++)
                        {
                            if (arrPic[i] != "")
                            {
                                Common.FileDel(root + arrPic[i]);
                            }
                        }
                    }

                    if(video!="pic" && video != "")
                    {
                        Common.FileDel(root + video);
                    }
                }

            }
            return Result.getDataResult(resCode, resMessage, status, "");
        }

    }
}
