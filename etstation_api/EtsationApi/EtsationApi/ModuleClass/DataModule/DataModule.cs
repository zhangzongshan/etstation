using System;
using System.Collections.Generic;
using System.Data;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace ModuleClass.DataModule
{
    public class SessionObject
    {
        public UserDevice SessionKey { get; set; }
        public User Userinfo { get; set; }
    }

    public class UserDevice
    {
        public int userid { get; internal set; }
        public DateTime createtime { get; internal set; }
        public DateTime activetime { get; internal set; }
        public DateTime expiredtime { get; internal set; }
        public string devicetype { get; internal set; }
        public string sessionkey { get; internal set; }
        public string password { get; internal set;  }

    }

    public class User
    {
        public int id { get; set; }
        public string username { get; set; }
        public string name { get; set; }
        public string mobile { get; set; }
        public string email { get; set; }
        public string photo { get; set; }
        public Boolean isActive { get; internal set; }
        public int company_id { get; set; }
    }

    /// <summary>
    /// 登陆参数
    /// </summary>
    public class LoginModule
    {
        /// <summary>
        /// 用户名
        /// </summary>
        public string username { get; set; }
        /// <summary>
        /// 密码
        /// </summary>
        public string password { get; set; }
        /// <summary>
        /// 验证码
        /// </summary>
        public string check_code { get; set; }
        /// <summary>
        /// 客户端UUID
        /// </summary>
        public string client_uuid { get; set; }
        /// <summary>
        /// 登陆类型
        /// </summary>
        public string type { get; set; }
    }

    /// <summary>
    /// 公司信息
    /// </summary>
    public class CommpanyModule
    {
        public int id { get; set; }
        public string about { get; set; }
        public string company { get; set; }
        public string address { get; set; }
        public string tell { get; set; }
        public string moblie { get; set; }
        public string email { get; set; }
        public string ecode { get; set; }
        public string map { get; set; }
        public string linkname { get; set; }
    }

    public class TeamModule
    {
        public int id { get; set; }
        public string username { get; set; }
        public string name { get; set; }
        public string job { get; set; }
        public string email { get; set; }
        public string mobile { get; set; }
        public string company_id { get; set; }
        public string photo { get; set; }
        public string detailed { get; set; }
    }

    public class PageModule
    {
        public int totalPage { get; set; }
        public int current { get; set; }
        public int pageSize { get; set; }
        public int totalRecord { get; set; }
        public DataTable data { get; set; }

    }

    public class ProductCate
    {
        public int id { get; set; }
        public string name { get; set; }
        public string logo { get; set; }
        public string detail { get; set; }
        public string website { get; set; }
        public int company_id { get; set; }
    }

    public class ProductChildCate
    {
        public int id { get; set; }
        public int cate_id { get; set; }
        public string cate_name { get; set; }
    }

    public class Product
    {
        public int id { get; set; }
        public string name { get; set; }
        public string pic { get; set; }
        public int pic_index { get; set; }
        public Object cate { get; set; }
        public string detail { get; set; }
        public int company_id { get; set; }
    }

}
