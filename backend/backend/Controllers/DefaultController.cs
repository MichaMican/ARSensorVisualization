using System;
using System.Collections.Generic;
using System.Linq;
using System.Numerics;
using System.Text.Json;
using System.Threading.Tasks;
using backend.Models;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api")]
    [ApiController]
    public class DefaultController : ControllerBase
    {
        Random rnd = new Random();
        private const int MAX_VECTOR = 10000;
        private List<GravitationPointDto> gravitationPoints = new List<GravitationPointDto>();

        public DefaultController()
        {
            gravitationPoints.Add(new GravitationPointDto()
            {
                x = -0.35,
                y = 6,
                z = 0,
                force = 1
            });
            gravitationPoints.Add(new GravitationPointDto()
            {
                x = 0.2,
                y = 5.5,
                z = 0,
                force = 1
            });
            gravitationPoints.Add(new GravitationPointDto()
            {
                x = 0,
                y = 2,
                z = 0,
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

            foreach(var gravPoint in gravitationPoints)
            {
                defaultVector = CalculateVectorForGravitationalPoint(defaultVector, gravPoint);
            }

            return defaultVector;

        }

        private List<VectorDto> GenerateVectors(int vectorCount) {

            var returnList = new List<VectorDto>();

            for (int i = 0; i < vectorCount; i++)
            {
                double x = ((i % 10) / 10f - 0.5f);
                double y = (Math.Floor(i / 100f) / 10f);
                double z = ((Math.Floor(i / 10f) % 10) / 10f - 0.5f);

                var vector = CalculateDirectionVectror(x, y, z);
                returnList.Add(vector);
            }

            return returnList;
        }

        [HttpGet("data/v2")]
        public ActionResult<List<VectorDto>> GetVectorCollectionV2(int limit = MAX_VECTOR, double minY = 0.0, double maxY = 1.0, double minX = 0.0, double maxX = 1.0)
        {
            var returnList = GenerateVectors(MAX_VECTOR);

            var maxXVecValue = returnList.Max((vec) => { return vec.x; });
            var maxYVecValue = returnList.Max((vec) => { return vec.y; });
            var minXVecValue = returnList.Min((vec) => { return vec.x; });
            var minYVecValue = returnList.Min((vec) => { return vec.y; });

            double xMaxBorder = maxX * (maxXVecValue - minXVecValue) + minXVecValue;
            double yMaxBorder = maxY * (maxYVecValue - minYVecValue) + minYVecValue;
            double xMinBorder = minX * (maxXVecValue - minXVecValue) + minXVecValue;
            double yMinBorder = minY * (maxYVecValue - minYVecValue) + minYVecValue;

            returnList = returnList.Where((vector) => { return vector.y >= yMinBorder && vector.y <= yMaxBorder; }).ToList();
            returnList = returnList.Where((vector) => { return vector.x >= xMinBorder && vector.x <= xMaxBorder; }).ToList();

            if (returnList.Count > limit)
            {
                returnList.RemoveRange(limit, returnList.Count - limit);
            }

            return returnList;
        }

        [HttpGet("data")]
        public ActionResult<List<VectorDto>> GetVectorCollection(int limit = MAX_VECTOR, int offset = 0, int? minY = null, int? maxY = null, int? minX = null, int? maxX = null)
        {
            var returnList = GenerateVectors(MAX_VECTOR);

            //Filter Y axis
            if(minY != null && maxY != null)
            {
                returnList = returnList.Where((vector) => { return vector.y >= minY && vector.y <= maxY; }).ToList();
            }
            else if(minY != null)
            {
                returnList = returnList.Where((vector) => { return vector.y >= minY; }).ToList();
            }
            else if(maxY != null)
            {
                returnList = returnList.Where((vector) => { return vector.y <= maxY; }).ToList();
            }

            //Filter X axis
            if (minX != null && maxX != null)
            {
                returnList = returnList.Where((vector) => { return vector.x >= minX && vector.x <= maxX; }).ToList();
            }
            else if (minX != null)
            {
                returnList = returnList.Where((vector) => { return vector.x >= minX; }).ToList();
            }
            else if (maxX != null)
            {
                returnList = returnList.Where((vector) => { return vector.x <= maxX; }).ToList();
            }

            //Convert output to fullfill offset & limit
            if (offset != 0)
            {
                if(offset >= returnList.Count)
                {
                    returnList.Clear();
                }
                else
                {
                    returnList.RemoveRange(0, offset);
                }
            }
            if(returnList.Count > limit)
            {
                returnList.RemoveRange(limit, returnList.Count - limit);
            }

            return returnList;
        }
    }
}