using System;
using System.Data;
using MySql.Data.MySqlClient;
using ModuleClass.DataModule;

namespace NS.ClassMysqlHelper
{
    public class MysqlHelper
    {
        /// <summary>
        /// 数据库连接串
        /// </summary>
        private string ConnString = "";
        /// <summary>
        /// 数据库连接
        /// </summary>
        private MySqlConnection Conn;
        /// <summary>
        /// 数据库连接
        /// </summary>
        private MySqlDataReader reader;
        /// <summary>
        /// 错误信息
        /// </summary>
        public static string ErrorString = "";
        /// <summary>
        /// 超时（秒）
        /// </summary>
        public int TimeOut = 100;
        /// <summary>
        /// 初始化数据库链接
        /// </summary>
        /// <param name="connString">数据库链接</param>
        public MysqlHelper(string connString)
        {
            ConnString = connString;
            ConnTo();
        }
        /// <summary>
        /// 去掉SQL中的特殊字符
        /// </summary>
        /// <param name="value">字符串</param>
        /// <returns></returns>
        public string ReplaceSql(string value)
        {
            if (string.IsNullOrEmpty(value))
                return null;
            value = value.Replace("\\", "\\\\");
            value = value.Replace("'", "''");
            value = value.Replace("\"", "\\\"");
            value = value.Replace("%", "\\%");
            return value;
        }
        /// <summary>
        /// 数据库分页
        /// </summary>
        /// <param name="mysql">mysql 连接对象</param>
        /// <param name="table">表名</param>
        /// <param name="key">主键</param>
        /// <param name="sort">排序</param>
        /// <param name="where">SQL条件,不需要写where</param>
        /// <param name="page">页码数据</param>
        /// <param name="pagesize">每页数据大小</param>
        /// <returns></returns>
        public PageModule Page(MysqlHelper mysql,string table,string key ,string sort, string where,int page,int pagesize)
        {
            key = (key == null || key == "") ? "id" : key;
            sort = (sort != null || sort != "") ? "DESC" : "ACS";
            page = page <= 0 ? 1 : page;
            pagesize = (pagesize <= 0 || pagesize >= 1000) ? 10 : pagesize;

            PageModule pg = new PageModule();

            string have_where_str = "";
            string no_where_str = "";
            if(where!=null && where != "")
            {
                have_where_str = " WHERE " + where;
                no_where_str = where;
            }

            string count_sql = "select count("+ key + ") from " + table + have_where_str;

            int totalRecord = Convert.ToInt32(mysql.ExecuteFirst(count_sql));
            if (totalRecord > 0)
            {
                string data_sql = "SELECT * FROM " + table + " WHERE "+ key + " <= (SELECT " + key + " FROM " + table + have_where_str + " ORDER BY " + key + " desc LIMIT " + (page - 1) * pagesize + ", 1) and "+ no_where_str + " ORDER BY " + key + " " + sort + " LIMIT " + pagesize;
                DataTable data = mysql.ExecuteDataTable(data_sql);

                pg.totalRecord = totalRecord;
                pg.current = page;
                pg.totalPage = (totalRecord + pagesize - 1) / pagesize;
                pg.data = data;
            }
            return pg;
        }

        public DataTable ExecuteDataTable(string SqlString)
        {
            return ExecuteDataTable(SqlString, null);
        }

        /// <summary>
        /// 执行sql返回DataTable
        /// </summary>
        /// <param name="SqlString">SQL语句</param>
        /// <param name="parms">Sql参数</param>
        /// <returns>DataTable</returns>
        public DataTable ExecuteDataTable(string SqlString, MySqlParameter[] parms)
        {
            if (Conn == null || Conn.State != ConnectionState.Open)
                ConnTo();
            try
            {
                MySqlCommand cmd = new MySqlCommand();
                cmd.Connection = Conn;
                cmd.CommandType = CommandType.Text;
                cmd.CommandText = SqlString;
                cmd.CommandTimeout = TimeOut;
                if (parms != null)
                    foreach (MySqlParameter pram in parms)
                        cmd.Parameters.Add(pram);
                DataTable dt = new DataTable();
                try
                {
                    if (reader != null && !reader.IsClosed)
                        reader.Close();
                    reader = cmd.ExecuteReader();
                    dt.Load(reader);
                }
                catch
                {
                    if (reader != null && !reader.IsClosed)
                        reader.Close();
                    reader = cmd.ExecuteReader();
                    dt = Read(ref reader);
                }
                return dt;
            }
            catch (Exception e)
            {
                AddError(e.Message, SqlString);
                return null;
            }
            finally
            {
                if (reader != null && !reader.IsClosed)
                    reader.Close();
            }
        }

        /// <summary>
        /// 读取所有数据
        /// </summary>
        /// <param name="reader"></param>
        /// <returns></returns>
        private DataTable Read(ref MySqlDataReader reader)
        {
            DataTable dt = new DataTable();
            bool frist = true;
            while (reader.Read())
            {
                if (frist)
                {
                    for (int i = 0; i < reader.FieldCount; i++)
                    {
                        string s = reader.GetName(i);
                        //var type = reader[0].GetType();
                        dt.Columns.Add(s, Type.GetType("System.String"));
                    }
                    frist = false;
                }
                DataRow dr = dt.NewRow();
                for (int i = 0; i < reader.FieldCount; i++)
                    dr[i] = reader.GetString(i);
                dt.Rows.Add(dr);
            }
            return dt;
        }


        public DataRow ExecuteDataTableRow(string SqlString)
        {
            return ExecuteDataTableRow(SqlString, null);
        }

        /// <summary>
        /// 返回第一行
        /// </summary>
        /// <param name="SqlString"></param>
        /// <returns></returns>
        public DataRow ExecuteDataTableRow(string SqlString, MySqlParameter[] parms)
        {
            if (Conn == null || Conn.State != ConnectionState.Open)
                ConnTo();
            try
            {
                MySqlCommand cmd = new MySqlCommand();
                cmd.Connection = Conn;
                cmd.CommandType = CommandType.Text;
                cmd.CommandText = SqlString;
                cmd.CommandTimeout = TimeOut;
                if (parms != null)
                    foreach (MySqlParameter pram in parms)
                        cmd.Parameters.Add(pram);
                DataTable dt = new DataTable();
                try
                {
                    if (reader != null && !reader.IsClosed)
                        reader.Close();
                    reader = cmd.ExecuteReader();
                    dt.Load(reader);
                }
                catch
                {
                    if (reader != null && !reader.IsClosed)
                        reader.Close();
                    reader = cmd.ExecuteReader();
                    dt = Read(ref reader);
                }
                if (dt.Rows.Count > 0)
                    return dt.Rows[0];
            }
            catch (Exception e)
            {
                AddError(e.Message, SqlString);
            }
            finally
            {
                if (reader != null && !reader.IsClosed)
                    reader.Close();
            }
            return null;
        }

        public string ExecuteFirst(string SqlString)
        {
            return ExecuteFirst(SqlString, null);
        }

        /// <summary>
        /// 返回第一个值
        /// </summary>
        /// <param name="SqlString"></param>
        /// <returns></returns>
        public string ExecuteFirst(string SqlString, MySqlParameter[] parms)
        {
            if (Conn == null || Conn.State != ConnectionState.Open)
                ConnTo();
            try
            {
                MySqlCommand cmd = new MySqlCommand();
                cmd.Connection = Conn;
                cmd.CommandType = CommandType.Text;
                cmd.CommandText = SqlString;
                cmd.CommandTimeout = TimeOut;
                if (parms != null)
                    foreach (MySqlParameter pram in parms)
                        cmd.Parameters.Add(pram);
                if (reader != null && !reader.IsClosed)
                    reader.Close();
                reader = cmd.ExecuteReader();
                string xx = "";
                if (reader.Read())
                    xx = reader[0].ToString();
                return xx;
            }
            catch (Exception e)
            {
                AddError(e.Message, SqlString);
            }
            finally
            {
                if (reader != null && !reader.IsClosed)
                    reader.Close();
            }
            return null;
        }

        public long ExecuteInsertId(string SqlString)
        {
            return ExecuteInsertId(SqlString, null);
        }

        /// <summary>
        /// 返回第一个值
        /// </summary>
        /// <param name="SqlString"></param>
        /// <returns></returns>
        public long ExecuteInsertId(string SqlString, MySqlParameter[] parms)
        {
            if (Conn == null || Conn.State != ConnectionState.Open)
                ConnTo();
            try
            {
                MySqlCommand cmd = new MySqlCommand();
                cmd.Connection = Conn;
                cmd.CommandType = CommandType.Text;
                cmd.CommandText = SqlString;
                cmd.CommandTimeout = TimeOut;
                if (parms != null)
                    foreach (MySqlParameter pram in parms)
                        cmd.Parameters.Add(pram);
                cmd.ExecuteNonQuery();
                return cmd.LastInsertedId;
            }
            catch (Exception e)
            {
                AddError(e.Message, SqlString);
            }
            return 0;
        }

        public bool ExecuteNonQuery(string SqlString)
        {
            return ExecuteNonQuery(SqlString, null);
        }

        /// <summary>
        /// 执行无返回SQL语句
        /// </summary>
        /// <param name="SqlString">SQL语句</param>
        /// <param name="parms">Sql参数</param>
        ///<returns>是否执行成功</returns>
        public bool ExecuteNonQuery(string SqlString, MySqlParameter[] parms)
        {
            if (Conn == null || Conn.State != ConnectionState.Open)
                ConnTo();
            try
            {
                MySqlCommand cmd = new MySqlCommand();
                cmd.Connection = Conn;
                cmd.CommandType = CommandType.Text;
                cmd.CommandText = SqlString;
                cmd.CommandTimeout = TimeOut;
                if (parms != null)
                    foreach (MySqlParameter pram in parms)
                        cmd.Parameters.Add(pram);
                cmd.ExecuteNonQuery();
                return true;
            }
            catch (Exception e)
            {
                AddError(e.Message, SqlString);
                return false;
            }
        }

        public bool ExecuteExists(string SqlString)
        {
            return ExecuteExists(SqlString, null);
        }

        /// <summary>
        /// 查询是否存在
        /// </summary>
        /// <param name="SqlString">SQL语句</param>
        /// <param name="parms">SQL参数</param>
        /// <returns>是否存在</returns>
        public bool ExecuteExists(string SqlString, MySqlParameter[] parms)
        {
            if (Conn == null || Conn.State != ConnectionState.Open)
                ConnTo();
            try
            {
                MySqlCommand cmd = new MySqlCommand();
                cmd.Connection = Conn;
                cmd.CommandType = CommandType.Text;
                cmd.CommandText = SqlString;
                cmd.CommandTimeout = TimeOut;
                if (parms != null)
                    foreach (MySqlParameter pram in parms)
                        cmd.Parameters.Add(pram);
                if (reader != null && !reader.IsClosed)
                    reader.Close();
                reader = cmd.ExecuteReader();
                if (reader.Read())
                    return true;
                return false;
            }
            catch (Exception e)
            {
                AddError(e.Message, SqlString);
                return false;
            }
            finally
            {
                if (reader != null && !reader.IsClosed)
                    reader.Close();
            }
        }
        /// <summary>
        /// 连接数据库
        /// </summary>
        private void ConnTo()
        {
            Close();
            try
            {
                Conn = new MySqlConnection(ConnString);
                Conn.Open();
            }
            catch (Exception e)
            {
                AddError(e.Message, ConnString);
            }
        }
        /// <summary>
        /// 错误信息
        /// </summary>
        /// <param name="message"></param>
        /// <param name="sql"></param>
        private void AddError(string message, string sql)
        {
            ErrorString += "数据库连接错误：" + message + "\r\nSQL语句：" + sql + "\r\n";
            if (!string.IsNullOrEmpty(ErrorString) && ErrorString.Length > 1000)
                ErrorString = "";
        }

        /// <summary>
        /// 关闭数据库链接
        /// </summary>
        public void Close()
        {
            if (Conn != null && Conn.State == ConnectionState.Open)
            {
                Conn.Close();
                Conn = null;
            }
            else
                Conn = null;
            GC.Collect();
            //try
            //{
            //    Conn.Close();
            //    Conn = null;
            //}
            //catch
            //{
            //}
        }

    }
}
