using backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Interface
{
    public interface IDefaultEngine
    {
        VectorDataMetaData GetVectorMetaData();
        List<VectorDto> GetAllVectors();
        List<VectorDto> FilterVectors(List<VectorDto> vectors, VectorDto plainVector, double maxDist);
    }
}
