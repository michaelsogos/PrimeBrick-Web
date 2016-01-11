using System.Data.Entity;
using System.Data.Entity.ModelConfiguration.Conventions;

namespace PrimeBrick.Web.Models
{
    public class DataContext : DbContext
    {
        public DataContext() : base("name=DataAccessReader") { }
        public DataContext(string ConnectionStringName) : base(ConnectionStringName) { }

        public DbSet<ApplicationConfiguration> ApplicationConfiguration { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);
            modelBuilder.Conventions.Remove<PluralizingTableNameConvention>();
        }
    }
}