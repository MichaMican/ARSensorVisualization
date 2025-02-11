using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Threading.Tasks;
using backend.Controllers.Engines;
using backend.Interface;
using backend.Models.Settings;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.StaticFiles;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;

namespace backend
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {
            services.Configure<AppSettings>(Configuration.GetSection("AppSettings"));

            services.AddCors(o => o.AddPolicy("AllowAnyOrigin", builder => {
                builder.AllowAnyOrigin()
                    .AllowAnyMethod()
                    .AllowAnyHeader();
            }));

            services.AddSingleton<IDefaultEngine, DefaultEngineV2>();

            services.AddControllers();
            services.AddDirectoryBrowser();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();
            }

#if DEBUG
                Console.WriteLine("Skipping HttpsRedirection due to DEBUG run");
#else
            //Add Https Redirection only in release build
            app.UseHttpsRedirection();
#endif
            app.UseCors("AllowAnyOrigin");

            var provider = new FileExtensionContentTypeProvider();

            provider.Mappings[".dat"] = "application/octet-stream";
            provider.Mappings[".patt"] = "text/html";
            provider.Mappings[".mtl"] = "text/html";
            provider.Mappings[".obj"] = "text/html";

            app.UseStaticFiles(new StaticFileOptions
            {
                ServeUnknownFileTypes=true,
                FileProvider = new PhysicalFileProvider(
                    Path.Combine(env.WebRootPath, "data")),
                RequestPath = "/data",
                ContentTypeProvider = provider
            });

            app.UseDirectoryBrowser();

            app.UseRouting();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });
        }
    }
}
