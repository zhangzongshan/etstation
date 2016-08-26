using NS.ModuleClass.Login;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using ModuleClass.Commpany;
using ModuleClass.DataModule;

namespace EtsationApi.Controllers.Company
{
    [SessionValidate]
    [RoutePrefix("api/commpanys")]
    public class CompanyController : ApiController
    {
        [Route("get")]
        public HttpResponseMessage PostGetCommpany()
        {
            return Commpany.GetCommpany();
        }
        [Route("update")]
        public HttpResponseMessage PostUpdateAbout()
        {
            return Commpany.UpdateCompany();
        }
        [Route("teamUpdate")]
        public HttpResponseMessage PostUpdateTeam()
        {
            return Commpany.UpdateTeam();
        }
        
        [Route("teamlist")]
        public HttpResponseMessage PostTeamList()
        {
            return Commpany.TeamList();
        }

        [Route("del")]
        public HttpResponseMessage PostTeamDel()
        {
            return Commpany.TeamDel();
        }

    }
}
