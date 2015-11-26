using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace PrimeBrick.Web.Controllers
{
    public class HomeController : Controller
    {
        public Tenant CurrentTenant;


        protected override void OnActionExecuting(ActionExecutingContext filterContext)
        {
            if (String.IsNullOrWhiteSpace((string)RouteData.Values["tenant"])) throw new Exception("Cannot retrieve the tenant from URL!");
            if (!GetAvailableTenants().Contains((string)RouteData.Values["tenant"], StringComparer.InvariantCultureIgnoreCase)) throw new Exception(string.Format("The tenant [{0}] is not available!", (string)RouteData.Values["tenant"]));
            base.OnActionExecuting(filterContext);
        }

        public ActionResult Index()
        {
            ViewBag.Title = "Home Page";

            return View();
        }

        private List<string> GetAvailableTenants()
        {
            //TODO Michael Sogos: CREATE AN APPLICATION VARIABLE THAT EVERY 30 MIN CHECK NEW ENTRY IN A DB TO BE BETTER SCALABLE IT SHOULD NOT REAL-TIME
            return new List<string>()
            {
                "Customer1",
                "Customer2",
                "Customer3"
            };
        }

    }

    public sealed class Tenant
    {
        public String Name;
    }
}


