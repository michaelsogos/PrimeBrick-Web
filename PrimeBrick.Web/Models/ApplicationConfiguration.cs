using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PrimeBrick.Web.Models
{
    public class ApplicationConfiguration
    {
        public int ApplicationConfigurationID { get; set; }
        public int TenantDiscoveryInterval { get; set; }
    }
}