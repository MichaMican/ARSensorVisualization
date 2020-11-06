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

        [HttpGet("data/v2")]
        public ActionResult<List<VectorDto>> GetVectorCollectionV2(int limit = MAX_VECTOR, double[] normalVector = null, double[] pointOnPlane = null, double maxDist = 0.5)
        {
            var vectors = _engine.GenerateVectors(MAX_VECTOR);

            if(normalVector != null && pointOnPlane != null)
            {
                if(normalVector.Length != 3 || pointOnPlane.Length != 3)
                {
                    return BadRequest("Please specify a valid plainVector");
                }

                VectorDto plainVector = new VectorDto()
                {
                    x = pointOnPlane[0],
                    y = pointOnPlane[1],
                    z = pointOnPlane[2],
                    xVec = normalVector[0],
                    yVec = normalVector[1],
                    zVec = normalVector[2]
                };
                vectors = _engine.FilterVectors(vectors, plainVector, 0.5);
            }

            if (vectors.Count > limit)
            {
                vectors.RemoveRange(limit, vectors.Count - limit);
            }

            return vectors;
        }

        [HttpGet("data")]
        public ActionResult<List<VectorDto>> GetVectorCollection(int limit = MAX_VECTOR, int offset = 0, int? minY = null, int? maxY = null, int? minX = null, int? maxX = null)
        {
            var returnList = _engine.GenerateVectors(MAX_VECTOR);

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