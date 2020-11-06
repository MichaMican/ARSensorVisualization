using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Models
{
    public class VectorDto
    { 

        public VectorDto()
        {

        }

        //Copy Constructor
        public VectorDto(VectorDto vector)
        {
            this.x = vector.x;
            this.y = vector.y;
            this.z = vector.z;
            this.xVec = vector.xVec;
            this.yVec = vector.yVec;
            this.zVec = vector.zVec;
        }

        public double x { get; set; }
        public double y { get; set; }
        public double z { get; set; }
        public double xVec { get; set; }
        public double yVec { get; set; }
        public double zVec { get; set; }
    }
}
