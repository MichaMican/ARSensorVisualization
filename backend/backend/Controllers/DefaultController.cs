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

        [HttpGet("data")]
        public ActionResult<List<VectorDto>> GetVectorCollection(int limit = MAX_VECTOR, int offset = 0, int? minY = null, int? maxY = null)
        {

            var returnList = new List<VectorDto>();
            var count = MAX_VECTOR;

            double vectorLength = rnd.Next(0, 10) / 10f;

            for (int i = 0; i < count; i++)
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
            
            if(offset != 0)
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