using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class VectorDataMetaDataDto
    {
        public int totalVecotrs { get; set; }
        public double xMin { get; set; }
        public double yMin { get; set; }
        public double zMin { get; set; }
        public double xMax { get; set; }
        public double yMax { get; set; }
        public double zMax { get; set; }

    }
}
