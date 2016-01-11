using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PrimeBrick.Web.Handlers
{
    public class HtmlHttpHandler : IHttpHandler
    {
        public bool IsReusable
        {
            get
            {
                throw new NotImplementedException();
            }
        }

        public void ProcessRequest(HttpContext context)
        {
            throw new NotImplementedException();
        }
    }
}