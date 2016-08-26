using ModuleClass.DataModule;
using NS.ClassMysqlHelper;
using PublicClass.Common;
using PublicClass.Result;
using PublicClass.SystemConfig;
using System;
using System.Collections.Generic;
using System.Data;
using System.IO;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Headers;
using System.Text;
using System.Threading.Tasks;
using System.Web;

namespace ModuleClass.Commpany
{
    class Commpany
    {
        private static MysqlHelper mysql = new MysqlHelper(mysqlconnection.conn());
        public static HttpResponseMessage GetCommpany()
        {
            string resCode = "";
            string resMessage = "";
            string status = "fail";
            CommpanyModule commpany = new CommpanyModule();

            string sessionKey= HttpContext.Current.Request.QueryString["sessionkey"];
            SessionObject loginSession= (SessionObject)CacheHelper.GetCache(sessionKey);
            if(loginSession!=null)
            {
                status = "success";
                if (loginSession.Userinfo.company_id != -1)
                {
                    string get_company_sql_str = "select * from etstation.company where id=" + loginSession.Userinfo.company_id;
                    DataRow commpanyRow=mysql.ExecuteDataTableRow(get_company_sql_str);

                    commpany.id = Convert.ToInt32(commpanyRow["id"]);
                    commpany.about = commpanyRow["about"].ToString();
                    commpany.address= commpanyRow["address"].ToString();
                    commpany.company = commpanyRow["company"].ToString();
                    commpany.tell = commpanyRow["tell"].ToString();
                    commpany.moblie = commpanyRow["moblie"].ToString();
                    commpany.email = commpanyRow["email"].ToString();
                    commpany.ecode = commpanyRow["ecode"].ToString();
                    commpany.linkname = commpanyRow["linkname"].ToString();
                    commpany.map = commpanyRow["map"].ToString();
                }
            }

            return Result.getDataResult(resCode, resMessage, status, commpany);
        }

        public static HttpResponseMessage UpdateTeam()
        {
            string resCode = "";
            string resMessage = "";
            string status = "fail";
            string delfile = "";

            string sessionKey = HttpContext.Current.Request.QueryString["sessionkey"];
            SessionObject loginSession = (SessionObject)CacheHelper.GetCache(sessionKey);

            if(loginSession.Userinfo.company_id >0)
            {
                var request = HttpContext.Current.Request;
                string root = HttpContext.Current.Server.MapPath("~/App_Data/TeamImg/");

                if (!Directory.Exists(root))
                {
                    Common.creatDir(root);
                }

                string id = request.Form["id"];
                string name = request.Form["name"];
                string username = request.Form["username"];
                string job = request.Form["job"];
                string mobile = request.Form["mobile"];
                string email = request.Form["email"];
                string photo = "";
                string detailed = request.Form["detailed"];

                var photoObj = request.Files["photo"];
                if (photoObj != null && photoObj.FileName != "")
                {
                    if(id != null && id != "")
                    {
                        string get_old_ecode_sql_str = "select photo from etstation.team_user where id=" + id;
                        string old_ecode = mysql.ExecuteFirst(get_old_ecode_sql_str);
                        if (old_ecode != "")
                        {
                            delfile = old_ecode;
                        }
                    }
                    photo = Common.getRandom(5) + photoObj.FileName;
                    photoObj.SaveAs(root+ photo);
                }
                else
                {
                    photo = null;
                }

                int company_id = loginSession.Userinfo.company_id;

                if(id!=null && id != "")
                {
                    //更新
                    #region
                    string update_str = "";
                    if (name != null)
                    {
                        update_str += "name='" + name + "', ";
                    }
                    if (username != null)
                    {
                        update_str += "username='" + username + "', ";
                    }
                    if (job != null)
                    {
                        update_str += "job='" + job + "', ";
                    }
                    if (mobile != null)
                    {
                        update_str += "mobile='" + mobile + "', ";
                    }
                    if (email != null)
                    {
                        update_str += "email='" + email + "', ";
                    }
                    if (photo != null)
                    {
                        update_str += "photo='" + photo + "', ";
                    }
                    if (detailed != null)
                    {
                        update_str += "detailed='" + detailed + "', ";
                    }

                    update_str = update_str.Substring(0, update_str.Length - 2);

                    string update_team_sql_str = "update etstation.team_user set " + update_str + " where id=" + id;
                    if (mysql.ExecuteNonQuery(update_team_sql_str))
                    {
                        status = "success";
                    }
                    #endregion
                }
                else
                {
                    //添加
                    #region
                    string insert_item = "";
                    string insert_value = "";
                    if (name != null)
                    {
                        insert_item += "name,";
                        insert_value += "'" + name + "',";
                    }

                    if (username != null)
                    {
                        insert_item += "username,";
                        insert_value += "'" + username + "',";
                    }

                    if (job != null)
                    {
                        insert_item += "job,";
                        insert_value += "'" + job + "',";
                    }
                    if (mobile != null)
                    {
                        insert_item += "mobile,";
                        insert_value += "'" + mobile + "',";
                    }
                    if (email != null)
                    {
                        insert_item += "email,";
                        insert_value += "'" + email + "',";
                    }
                    if (photo != null)
                    {
                        insert_item += "photo,";
                        insert_value += "'" + photo + "',";
                    }
                    if (detailed != null)
                    {
                        insert_item += "detailed,";
                        insert_value += "'" + detailed + "',";
                    }

                    insert_item += "company_id";
                    insert_value += company_id;


                    if (insert_item != "" && insert_value != "")
                    {
                        string insert_commpany_sql_str = "insert into etstation.team_user (" + insert_item + ") values (" + insert_value + ")";
                        long team_user_id = mysql.ExecuteInsertId(insert_commpany_sql_str);
                        if (team_user_id > 0)
                        {
                            status = "success";
                        }
                    }
                    #endregion
                }

                if (delfile != "")
                {
                    Common.FileDel(root + delfile);
                }

            }

            return Result.getDataResult(resCode, resMessage, status, "");
        }

        public static HttpResponseMessage TeamDel()
        {
            string resCode = "";
            string resMessage = "";
            string status = "fail";

            var request = HttpContext.Current.Request;
            string id_str = request.Form["id"];
            int id = (id_str != null && id_str != "") ? Convert.ToInt32(id_str) : 0;
            if (id > 0)
            {
                string get_teamUser_photo_sql_str = "select photo from etstation.team_user where id=" + id;
                string photo = mysql.ExecuteFirst(get_teamUser_photo_sql_str);
                if (photo != "")
                {
                    string root = HttpContext.Current.Server.MapPath("~/App_Data/TeamImg/");
                    Common.FileDel(root + photo);
                }

                string del_team_sql_str= "delete from etstation.team_user where id=" + id;
                if (mysql.ExecuteNonQuery(del_team_sql_str))
                {
                    status = "success";
                }
            }

            return Result.getDataResult(resCode, resMessage, status, "");
        }

        public static HttpResponseMessage UpdateCompany()
        {
            string resCode = "";
            string resMessage = "";
            string status = "fail";
            string delEcode = "";

            CommpanyModule commpany = new CommpanyModule();

            string sessionKey = HttpContext.Current.Request.QueryString["sessionkey"];
            var request = HttpContext.Current.Request;
            string root = HttpContext.Current.Server.MapPath("~/App_Data/CommpanyImg/");

            if (!Directory.Exists(root))
            {
                Common.creatDir(root);
            }

            string about = request.Form["about"];
            string address = request.Form["address"];
            string company = request.Form["company"];
            string tell = request.Form["tell"];
            string moblie = request.Form["moblie"];
            string email = request.Form["email"];
            string map = request.Form["map"];
            string linkname = request.Form["linkname"];

            string ecodefile1 = "";
            string ecodefile2 = "";
            var ecodeFileObj1 = request.Files["ecode1"];
            if (ecodeFileObj1 != null && ecodeFileObj1.FileName!="")
            {
                ecodefile1 = Common.RandomStr(5) + ecodeFileObj1.FileName;
                ecodeFileObj1.SaveAs(root+ ecodefile1);
            }
            var ecodeFileObj2 = request.Files["ecode2"];
            if (ecodeFileObj2 != null && ecodeFileObj2.FileName!="")
            {
                ecodefile2 = Common.RandomStr(5) + ecodeFileObj2.FileName;
                ecodeFileObj2.SaveAs(root + ecodefile2);
            }
            string ecode = ecodefile1 + "," + ecodefile2;

            if (ecode == ",")
            {
                ecode = null;
            }

            commpany.about = about;
            commpany.address = address;
            commpany.company = company;
            commpany.ecode = ecode;
            commpany.email = email;
            commpany.linkname = linkname;
            commpany.map = map;
            commpany.moblie = moblie;
            commpany.tell = tell;

            SessionObject loginSession = (SessionObject)CacheHelper.GetCache(sessionKey);

            if (loginSession != null)
            {
                
                if (loginSession.Userinfo.company_id != -1)
                {
                    string update_str = "";
                    if (commpany.about != null)
                    {
                        update_str += "about='" + commpany.about + "', ";
                    }

                    if (commpany.address != null)
                    {
                        update_str += "address='" + commpany.address + "', ";
                    }
                    if (commpany.company != null)
                    {
                        update_str += "company='" + commpany.company + "', ";
                    }
                    if (commpany.tell != null)
                    {
                        update_str += "tell='" + commpany.tell + "', ";
                    }
                    if (commpany.moblie != null)
                    {
                        update_str += "moblie='" + commpany.moblie + "', ";
                    }
                    if (commpany.email != null)
                    {
                        update_str += "email='" + commpany.email + "', ";
                    }
                    if (commpany.ecode != null)
                    {
                        string get_old_ecode_sql_str = "select ecode from etstation.company where id=" + loginSession.Userinfo.company_id;
                        string old_ecode = mysql.ExecuteFirst(get_old_ecode_sql_str);
                        if (old_ecode != null && old_ecode != "" && old_ecode.Contains(","))
                        {
                            string[] oldarr = old_ecode.Split(',');
                            string[] newarr = commpany.ecode.Split(',');

                            for (int i = 0; i < newarr.Length; i++)
                            {
                                if (newarr[i] != "")
                                {
                                    if (oldarr[i] != null && oldarr[i] != "")
                                    {
                                        delEcode += oldarr[i] + ",";
                                    }
                                }
                                else
                                {
                                    if (oldarr[i] != null && oldarr[i] != "")
                                    {
                                        newarr[i] = oldarr[i];
                                    }
                                }
                            }

                            commpany.ecode = string.Join(",", newarr);
                        }
                        update_str += "ecode='" + commpany.ecode + "', ";
                    }
                    if (commpany.linkname != null)
                    {
                        update_str += "linkname='" + commpany.linkname + "', ";
                    }
                    if (commpany.map != null)
                    {
                        update_str += "map='" + commpany.map + "', ";
                    }

                    update_str = update_str.Substring(0, update_str.Length - 2);

                    if (update_str != "")
                    {
                        string update_commpany_sql_str = "update etstation.company set " + update_str + " where id=" + loginSession.Userinfo.company_id;
                        
                        if (mysql.ExecuteNonQuery(update_commpany_sql_str))
                        {
                            status = "success";
                        }
                        //删除旧图片
                        if (delEcode != "")
                        {
                            var arr = delEcode.Split(',');
                            for (int i = 0; i < arr.Length; i++)
                            {
                                if (arr[i] != "")
                                {
                                    Common.FileDel(root + arr[i]);
                                }
                            }
                        }
                    }
                }
                else
                {
                    string insert_item = "";
                    string insert_value = "";
                    if (commpany.about != null)
                    {
                        insert_item += "about,";
                        insert_value += "'" + commpany.about + "',";
                    }

                    if (commpany.address != null)
                    {
                        insert_item += "address,";
                        insert_value += "'" + commpany.address + "',";
                    }
                    if (commpany.company != null)
                    {
                        insert_item += "company,";
                        insert_value += "'" + commpany.company + "',";
                    }
                    if (commpany.tell != null)
                    {
                        insert_item += "tell,";
                        insert_value += "'" + commpany.tell + "',";
                    }
                    if (commpany.moblie != null)
                    {
                        insert_item += "moblie,";
                        insert_value += "'" + commpany.moblie + "',";
                    }
                    if (commpany.email != null)
                    {
                        insert_item += "email,";
                        insert_value += "'" + commpany.email + "',";
                    }
                    if (commpany.ecode != null)
                    {
                        insert_item += "ecode,";
                        insert_value += "'" + commpany.ecode + "',";
                    }
                    if (commpany.linkname != null)
                    {
                        insert_item += "linkname,";
                        insert_value += "'" + commpany.linkname + "',";
                    }
                    if (commpany.map != null)
                    {
                        insert_item += "map,";
                        insert_value += "'" + commpany.map + "',";
                    }
                    insert_item = insert_item.Substring(0, insert_item.Length - 1);
                    insert_value= insert_value.Substring(0, insert_value.Length - 1);

                    
                    if(insert_item!="" && insert_value != "")
                    {
                        string insert_commpany_sql_str = "insert into etstation.company (" + insert_item + ") values (" + insert_value + ")";
                        long company_id = mysql.ExecuteInsertId(insert_commpany_sql_str);
                        if (company_id > 0)
                        {
                            string upadate_user_sql_str = "update etstation.user set company_id=" + company_id + " where id=" + loginSession.Userinfo.id;

                            if (mysql.ExecuteNonQuery(upadate_user_sql_str))
                            {
                                loginSession.Userinfo.company_id = (int)company_id;
                                CacheHelper.SetCache(sessionKey, loginSession, TimeSpan.FromMinutes(SystemConfig.session_time_out));
                                status = "success";
                            }
                        }
                    }                    
                }
            }

            return Result.getDataResult(resCode, resMessage, status,"");
        }

        public static HttpResponseMessage TeamList()
        {
            string resCode = "";
            string resMessage = "";
            string status = "fail";
            PageModule list_team = null;

            string sessionKey = HttpContext.Current.Request.QueryString["sessionkey"];
            SessionObject loginSession = (SessionObject)CacheHelper.GetCache(sessionKey);

            int company_id = loginSession.Userinfo.company_id;

            if (company_id > 0)
            {
                var request = HttpContext.Current.Request;
                string formCurrent = request.Form["current"];
                string formPageSize= request.Form["pageSize"];
                string formName= request.Form["name"];
                string formMobile = request.Form["mobile"];
                int current = (formCurrent != null && formCurrent != "") ? Convert.ToInt16(formCurrent) : 1;
                int pageSize= (formPageSize != null && formPageSize != "") ? Convert.ToInt16(formPageSize) : 10;
                string name = mysql.ReplaceSql((formName != null && formName != "") ? formName : null);
                string mobile = mysql.ReplaceSql((formMobile != null && formMobile != "") ? formMobile : null);

                string where_str = "company_id=" + company_id;
                if (name != null)
                {
                    where_str += " and name like '%" + name + "%'";
                }

                if (mobile != null)
                {
                    where_str += " and mobile='" + mobile + "'";
                }

                list_team = mysql.Page(
                    mysql
                    , "etstation.team_user"
                    ,"id"
                    ,"desc"
                    , where_str
                    , current
                    , pageSize
                    );
                status = "success";
            }
            
            return Result.getDataResult(resCode, resMessage, status, list_team);
        }

    }
}
