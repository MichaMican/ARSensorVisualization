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
        public ActionResult<List<VectorDto>> GetVectorCollection(int limit = MAX_VECTOR, int offset = 0)
        {

            if (limit + offset > MAX_VECTOR)
            {
                if (offset > MAX_VECTOR)
                {
                    return BadRequest("There are a maximum of 10000 Vectors");
                }

                limit = MAX_VECTOR - offset;
            }

            var returnList = new List<VectorDto>();
            var count = limit;

            double vectorLength = rnd.Next(0, 10) / 10f;

            for (int i = offset; i < count + offset; i++)
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

            Response.Headers.Add("YOLO", "You Only live once du kek");

            return returnList;
        }
    }
}