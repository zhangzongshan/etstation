using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

/// <summary>
/// mysqlconnection 的摘要说明
/// </summary>
public class mysqlconnection
{
    public mysqlconnection()
    {
        
    }
    public static string conn()
    {
        string conn = "Database = 'etstation'; Data Source = '121.40.49.208'; User Id = 'etstation_root'; Password = 'wzdajz1123'; charset = 'utf8'; pooling = true";
        return conn;
    }
}