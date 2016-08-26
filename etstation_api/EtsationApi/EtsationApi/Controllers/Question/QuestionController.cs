using ModuleClass.Question;
using NS.ModuleClass.Login;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;

[SessionValidate]
[RoutePrefix("api/question")]

public class QuestionController : ApiController
{
    [Route("update")]
    public HttpResponseMessage PostUpdate()
    {
        return Question.Update();
    }
    [Route("list")]
    public HttpResponseMessage PostList()
    {
        return Question.PostList();
    }
    [Route("del")]
    public HttpResponseMessage PostDel()
    {
        return Question.PostDel();
    }
}