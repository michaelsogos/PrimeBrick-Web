using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace PrimeBrick.Web.Models
{
    public class DataReader : DataContext
    {
        public DataReader() : base("DataAccessReader")
        {
            base.Configuration.AutoDetectChangesEnabled = true;
        }
    }
}