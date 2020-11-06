using backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Interface
{
    interface IDefaultEngine
    {
        List<VectorDto> GenerateVectors(int vectorCount);
        List<VectorDto> FilterVectors(List<VectorDto> vectors, VectorDto plainVector, double maxDist);
    }
}
