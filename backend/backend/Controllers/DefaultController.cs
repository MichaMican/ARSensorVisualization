using System;
using System.Collections.Generic;
using System.Linq;
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


        private List<VectorDto> GenerateVectors(int vectorCount) {

            var returnList = new List<VectorDto>();

            double vectorLength = rnd.Next(0, 10) / 10f;

            for (int i = 0; i < vectorCount; i++)
            {
                var vector = new VectorDto()
                {
                    x = ((i % 10) / 10f - 0.5f),
                    y = (Math.Floor(i / 100f) / 10f),
                    z = ((Math.Floor(i / 10f) % 10) / 10f - 0.5f),
                    xVec = vectorLength,
                    yVec = vectorLength,
                    zVec = vectorLength
                };

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