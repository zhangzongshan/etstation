using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace PublicClass.WebMessage
{
    class WebMessageConstant
    {
        /** 成功抓取数据 */
        public static String PASS_DATA_CATCH = "100000";

        /** 增加成功 */
        public static String ADD_SUCCESS = "100001";

        /** 修改成功 */
        public static String MODIFY_SUCCESS = "100002";

        /** 删除成功 */
        public static String REMOVE_SUCCESS = "100003";

        /** 保存成功 */
        public static String SAVE_SUCCESS = "100004";

        /** 上传成功 */
        public static String UPLOAD_SUCCESS = "100005";

        /** 下载成功 */
        public static String DOWNLOAD_SUCCESS = "100006";

        /** 操作成功 */
        public static String OP_SUCCESS = "100007";

        /** 验证码获取成功 */
        public static String GET_VALCODE_SUCCESS = "100008";

        /** 验证码获取失败 */
        public static String GET_VALCODE_FAIL = "-100008";

        /** 系统错误 */
        public static String SYS_ERR = "-100000";

        /** 数据库错误 */
        public static String SQL_ERR = "-100001";

        /** 数据库添加错误 */
        public static String SQL_ADD_ERR = "-100002";

        /** 数据库修改错误 */
        public static String SQL_MODIFY_ERR = "-100003";

        /** 数据库删除错误 */
        public static String SQL_REMOVE_ERR = "-100003";

        /**用户不存在*/
        public static String LOGIN_USER_ERR = "-100004";

        /**登陆信息过期*/
        public static String LOGIN_TIME_ERR = "-100005";

        /**时间过期*/
        public static String TIME_OUT_ERR = "-100006";

        /**获取用户错误*/
        public static String GET_USER_ERR = "-100009";

        /**需要用户登录*/
        public static String REQUIRE_USER_LOGIN = "-100010";

        /**登陆时间过期*/
        public static String SESSION_TIME_OUT = "-100011";

        /**存在数据依赖*/
        public static String HAVE_DEPENDENCE = "100020";
        /**不存在数据依赖*/
        public static String NO_DEPENDENCE = "-100020";


    }
}
