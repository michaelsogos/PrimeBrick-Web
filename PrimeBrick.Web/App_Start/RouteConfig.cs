using System.Web.Mvc;
using System.Web.Routing;

namespace PrimeBrick.Web
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(
                name: "Default",
                url: "{tenant}",
                defaults: new { controller = "Home", action = "Index" }
            );
        }
    }
}
