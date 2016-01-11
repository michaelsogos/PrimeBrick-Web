using PrimeBrick.Web.Models;
using System;
using System.Linq;

namespace PrimeBrick.Web
{
    public partial class Startup
    {

        ApplicationConfiguration _AppConfig;


        private void LoadApplicationConfiguration()
        {
            DataReader DBContext = new DataReader();
            //_AppConfig = DBContext.ApplicationConfiguration.FirstOrDefault();
            //if (_AppConfig == null) throw new Exception("The system cannot retrieve the [Application Configuration]!");

            var a = new ApplicationConfiguration()
            {
                ApplicationConfigurationID = 1
            };
                               
            DBContext.ApplicationConfiguration.Attach(a);

            a.TenantDiscoveryInterval = 89;

            DBContext.SaveChanges();
            var b = 0;

        }

    }
}