using System;
using System.Collections.Generic;
using System.Linq;
using backend.Controllers.Engines;
using backend.Interface;
using backend.Models;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [Route("api")]
    [ApiController]
    public class DefaultController : ControllerBase
    {
        private const int MAX_VECTOR = 3200;
        private IDefaultEngine _engine;

        public DefaultController()
        {
            _engine = new DefaultEngine();
        }

        [HttpGet("data/meta")]
        public ActionResult<VectorDataMetaData> GetVectorMetaData()
        {
            var vectors = _engine.GenerateVectors(MAX_VECTOR);
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

        /*
         * limit: max number of vectors returned
         * n1: NormalVector X
         * n2: NormalVector Y
         * n3: NormalVector Z
         * x: X value of point on Plain
         * y: Y value of point on Plain
         * z: Z value of point on Plain
         * maxDist = 0.5: maximal Distance of returned vector bases to plain
         */
        [HttpGet("data/v2")]
        public ActionResult<List<VectorDto>> GetVectorCollectionV2(int limit = MAX_VECTOR, double? n1 = null, double? n2 = null, double? n3 = null, double? x = null, double? y = null, double? z = null, double maxDist = 0.5)
        {
            var vectors = _engine.GenerateVectors(MAX_VECTOR);

            if (n1.HasValue || n2.HasValue || n3.HasValue || x.HasValue || y.HasValue || z.HasValue)
            {
                //makes sure that all variables are set
                if (!n1.HasValue || !n2.HasValue || !n3.HasValue || !x.HasValue || !y.HasValue || !z.HasValue)
                {
                    return BadRequest("Please specify n1, n2, n3, x, y and z");
                }

                VectorDto plainVector = new VectorDto()
                {
                    x = x.Value,
                    y = y.Value,
                    z = z.Value,
                    xVec = n1.Value,
                    yVec = n2.Value,
                    zVec = n3.Value
                };
                vectors = _engine.FilterVectors(vectors, plainVector, 0.5);
            }

            if (vectors.Count > limit)
            {
                vectors.RemoveRange(limit, vectors.Count - limit);
            }

            return Ok(vectors);
        }

        [HttpGet("data")]
        public ActionResult<List<VectorDto>> GetVectorCollection(int limit = MAX_VECTOR, int offset = 0, int? minY = null, int? maxY = null, int? minX = null, int? maxX = null)
        {
            var returnList = _engine.GenerateVectors(MAX_VECTOR);

            //Filter Y axis
            if (minY != null && maxY != null)
            {
                returnList = returnList.Where((vector) => { return vector.y >= minY && vector.y <= maxY; }).ToList();
            }
            else if (minY != null)
            {
                returnList = returnList.Where((vector) => { return vector.y >= minY; }).ToList();
            }
            else if (maxY != null)
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
                if (offset >= returnList.Count)
                {
                    returnList.Clear();
                }
                else
                {
                    returnList.RemoveRange(0, offset);
                }
            }
            if (returnList.Count > limit)
            {
                returnList.RemoveRange(limit, returnList.Count - limit);
            }

            return Ok(returnList);
        }
    }
}