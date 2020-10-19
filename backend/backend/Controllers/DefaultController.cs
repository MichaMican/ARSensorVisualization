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

        [HttpGet("data")]
        public ActionResult<List<VectorDto>> GetVectorCollection()
        {
            var returnList = new List<VectorDto>();
            var count = 10000;

            double vectorLength = rnd.Next(0, 10) / 10f;

            for(int i = 0; i < count; i++)
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