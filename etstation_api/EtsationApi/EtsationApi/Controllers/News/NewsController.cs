using ModuleClass.News;
using NS.ModuleClass.Login;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Threading.Tasks;
using System.Web.Http;

[RoutePrefix("api/news")]
public class NewsController : ApiController
{
    [Route("update")]
    public HttpResponseMessage PostUpdate()
    {
        return News.Update();
    }
    [Route("list")]
    public HttpResponseMessage PostList()
    {
        return News.PostList();
    }
    [Route("del")]
    public HttpResponseMessage PostDel()
    {
        return News.PostDel();
    }
}