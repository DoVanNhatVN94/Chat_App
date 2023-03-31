using Service.Hubs;

namespace Service;

public class Program
{
    public static void Main(string[] args)
    {
        var builder = WebApplication.CreateBuilder(args);

        builder.Services.AddSignalR();

        //builder.Services.AddCors(option =>
        //{
        //    option.AddDefaultPolicy(builder =>
        //    {
        //        builder.WithOrigins("http://localhost:3000/")
        //        .AllowAnyHeader()
        //        .AllowAnyMethod()
        //        .AllowCredentials();
        //    });
        //});

        builder.Services.AddCors(options =>
        {
            options.AddPolicy("AllowOrigin",
                builder => builder.AllowAnyOrigin()
                                  .AllowAnyMethod()
                                  .AllowAnyHeader());
        });

        builder.Services.AddSingleton<IDictionary<string, UserConnection>>(opts => new Dictionary<string, UserConnection>());

        var app = builder.Build();

        app.UseRouting();

        app.UseCors(x => x
           .AllowAnyMethod()
           .AllowAnyHeader()
           .SetIsOriginAllowed(origin => true)
           .AllowCredentials());


        app.UseEndpoints(endpoints =>
        {
            endpoints.MapHub<ChatHub>("/chat");
        });


        app.Run();
    }
}

