using System.Web;
using System.Web.Mvc;

namespace PrimeBrick.Web.HelpPages
{
    public class FilterConfig
    {
        public static void RegisterGlobalFilters(GlobalFilterCollection filters)
        {
            filters.Add(new HandleErrorAttribute());
        }
    }
}
