using backend.Interface;
using backend.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Controllers.Engines
{
    public class DefaultEngine : IDefaultEngine
    {
        private List<GravitationPointDto> gravitationPoints = new List<GravitationPointDto>();
        private int VECTOR_COUNT = 3000;

        public DefaultEngine()
        {
            gravitationPoints.Add(new GravitationPointDto()
            {
                x = 5,
                y = 5,
                z = 5,
                force = 1
            });
            gravitationPoints.Add(new GravitationPointDto()
            {
                x = -5,
                y = 5,
                z = 5,
                force = 1
            });
            gravitationPoints.Add(new GravitationPointDto()
            {
                x = 0,
                y = 12,
                z = 5,
                force = 1
            });
        }

        private VectorDto CalculateVectorForGravitationalPoint(VectorDto vector, GravitationPointDto gravitationPoint)
        {
            var vectorCpy = new VectorDto(vector);

            double dx = gravitationPoint.x - vector.x;
            double dy = gravitationPoint.y - vector.y;
            double dz = gravitationPoint.z - vector.z;

            double distance = Math.Sqrt(Math.Pow(dx, 2) + Math.Pow(dy, 2) + Math.Pow(dz, 2));

            double xForce = (gravitationPoint.force / (distance + 1)) * dx;
            double yForce = (gravitationPoint.force / (distance + 1)) * dy;
            double zForce = (gravitationPoint.force / (distance + 1)) * dz;

            vectorCpy.xVec = vector.xVec + xForce;
            vectorCpy.yVec = vector.yVec + yForce;
            vectorCpy.zVec = vector.zVec + zForce;

            return vectorCpy;
        }

        private VectorDto CalculateDirectionVectror(double x, double y, double z)
        {
            var defaultVector = new VectorDto()
            {
                x = x,
                y = y,
                z = z,
                xVec = 0,
                yVec = -1,
                zVec = 0,
            };

            foreach (var gravPoint in gravitationPoints)
            {
                defaultVector = CalculateVectorForGravitationalPoint(defaultVector, gravPoint);
            }

            return defaultVector;

        }

        public List<VectorDto> GetAllVectors()
        {
            var returnList = new List<VectorDto>();

            for (int i = 0; i < VECTOR_COUNT; i++)
            {
                double x = ((i % 10) - 5f) / 2;
                double y = (Math.Floor(i / 200f));
                double z = (Math.Floor(i / 20f) % 10);

                var vector = CalculateDirectionVectror(x, y, z);
                returnList.Add(vector);
            }

            return returnList;
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
