using ModuleClass.Product;
using NS.ModuleClass.Login;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;


[SessionValidate]
[RoutePrefix("api/product")]
public class ProductController : ApiController
{
    [Route("update")]
    public HttpResponseMessage PostUpdate()
    {
        return Product.Update();
    }
    [Route("list")]
    public HttpResponseMessage PostList()
    {
        return Product.PostList();
    }
    [Route("del")]
    public HttpResponseMessage PostDel()
    {
        return Product.PostDel();
    }
}
