using ModuleClass.Set;
using NS.ModuleClass.Login;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

[SessionValidate]
public class BgsetController : ApiController
{
    [Route("api/bg/update")]
    public HttpResponseMessage PostUpdate()
    {
        return Set.Update();
    }
    [Route("api/bg/get")]
    public HttpResponseMessage PostList()
    {
        return Set.Get();
    }
    [Route("api/admin/update")]
    public HttpResponseMessage PostAdminUpdate()
    {
        return Set.AdminUpdate();
    }
}
