using System;
using System.Collections.Generic;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Net.Http.Formatting;
using System.Net.Http.Headers;
using System.Web.Http;

namespace PrimeBrick.Web.Controllers
{
    [Authorize]
    [RoutePrefix("api/Dictionary")]
    public class DictionaryController : ApiController
    {
        [AllowAnonymous]
        [Route("ViewLabels/{Namespace}")]
        public HttpResponseMessage GetViewLabels(String Namespace)
        {
            var Response = new HttpResponseMessage(HttpStatusCode.OK);
            try
            {
                String CurrentCulture = GSW.Managers.DBResourceManager.GetCultureName();
                List<GSW.Models.gsw_GlobalResources> Entities = GSW.Helpers.DBResourceHelper.GetResourceEntities(CurrentCulture, Namespace);
                if (Entities.Count <= 0)
                {
                    CurrentCulture = GSW.Helpers.DBResourceHelper.GetDefaultCultureCode();
                    if (CurrentCulture == null) throw new Exception("Cannot find labels for view [" + Namespace + "] and culture [" + CurrentCulture + "]!");
                    Entities = GSW.Helpers.DBResourceHelper.GetResourceEntities(CurrentCulture, Namespace);
                }
                if (Entities.Count <= 0) throw new Exception("Cannot find labels for view [" + Namespace + "] and culture [" + CurrentCulture + "]!");

                Dictionary<string, string> Labels = Entities.ToDictionary(k => k.ResourceKey, v => v.ResourceValue);
                Response.Content = new ObjectContent(Labels.GetType(), Labels, new JsonMediaTypeFormatter());
                Response.Headers.CacheControl = new CacheControlHeaderValue();
                Response.Headers.CacheControl.MaxAge = new TimeSpan(1, 0, 0, 0);
                Response.Headers.CacheControl.Public = true;
            }
            catch (Exception ex)
            {
                Response.StatusCode = HttpStatusCode.BadRequest;
                Response.Content = new ObjectContent(ex.Message.GetType(), ex.Message, new JsonMediaTypeFormatter());
            }

            return Response;
        }
    }
}
