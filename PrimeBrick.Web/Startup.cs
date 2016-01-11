using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(PrimeBrick.Web.Startup))]

namespace PrimeBrick.Web
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            LoadApplicationConfiguration();
            ConfigureAuth(app);
        }
    }
}
