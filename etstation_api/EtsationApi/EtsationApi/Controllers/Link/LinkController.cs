using ModuleClass.Link;
using NS.ModuleClass.Login;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

[SessionValidate]
[RoutePrefix("api/link")]
public class LinkController : ApiController
{
    [Route("update")]
    public HttpResponseMessage PostUpdate()
    {
        return Link.Update();
    }
    [Route("list")]
    public HttpResponseMessage PostList()
    {
        return Link.PostList();
    }
    [Route("del")]
    public HttpResponseMessage PostDel()
    {
        return Link.PostDel();
    }
}

