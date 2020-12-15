using backend.Interface;
using backend.Models;
using backend.Models.Settings;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers.Engines
{
    public class DefaultEngineV2 : IDefaultEngine
    {
        private AppSettings _settings;

        public DefaultEngineV2(IOptions<AppSettings> settings)
        {
            _settings = settings.Value;
        }

        private List<VectorDto> LoadVectorsFromJsonFile(string path)
        {
            var returnList = new List<VectorDto>();

            using (StreamReader r = new StreamReader(path))
            {
                string json = r.ReadToEnd();
                returnList = JsonConvert.DeserializeObject<List<VectorDto>>(json);
            }

            return returnList;
        }

        public List<VectorDto> GetAllVectors()
        {
            return LoadVectorsFromJsonFile(_settings.jsonPath);
        }

        public VectorDataMetaData GetVectorMetaData()
        {
            var vectors = GetAllVectors();
            var xMin = vectors.Min((v) => v.x);
            var yMin = vectors.Min((v) => v.y);
            var zMin = vectors.Min((v) => v.z);
            var xMax = vectors.Max((v) => v.x);
            var yMax = vectors.Max((v) => v.y);
            var zMax = vectors.Max((v) => v.z);
            var totalVectors = vectors.Count;

            return new VectorDataMetaData()
            {
                totalVecotrs = totalVectors,
                xMin = xMin,
                yMin = yMin,
                zMin = zMin,
                xMax = xMax,
                yMax = yMax,
                zMax = zMax
            };
        }

        private double GetDistanceVectorBasePlain(double n1, double n2, double n3, double c, VectorDto vector)
        {
            return Math.Abs(n1 * vector.x + n2 * vector.y + n3 * vector.z - c) / Math.Sqrt(Math.Pow(n1, 2) + Math.Pow(n2, 2) + Math.Pow(n3, 2));
        }

        public List<VectorDto> FilterVectors(List<VectorDto> vectors, VectorDto plainVector, double maxDist)
        {
            double n1 = plainVector.xVec;
            double n2 = plainVector.yVec;
            double n3 = plainVector.zVec;

            double px = plainVector.x;
            double py = plainVector.y;
            double pz = plainVector.z;

            double c = n1 * px + n2 * py + n3 * pz;

            return vectors.Where((v) => GetDistanceVectorBasePlain(n1, n2, n3, c, v) <= maxDist).ToList();
        }

    }
}
