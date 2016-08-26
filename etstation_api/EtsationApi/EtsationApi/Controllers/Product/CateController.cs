using ModuleClass.Product;
using NS.ModuleClass.Login;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

[SessionValidate]
[RoutePrefix("api/cate")]
public class CateController : ApiController
{
    [Route("update")]
    public HttpResponseMessage PostUpdate()
    {
        return Cate.UpdateCate();
    }
    [Route("list")]
    public HttpResponseMessage PostList()
    {
        return Cate.ListCate();
    }
    [Route("del")]
    public HttpResponseMessage PostCateDel()
    {
        return Cate.CateDel();
    }

    [Route("child/update")]
    public HttpResponseMessage PostChildUpdate()
    {
        return Cate.UpdateChildCate();
    }
    [Route("child/list")]
    public HttpResponseMessage PostChildList()
    {
        return Cate.ListChildCate();
    }
    [Route("child/del")]
    public HttpResponseMessage PostChildCateDel()
    {
        return Cate.CateChildDel();
    }
}