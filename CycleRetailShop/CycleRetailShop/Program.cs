using CycleRetailShop.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using CycleRetailShop.Services.UserService;
using CycleRetailShop.Services.CustomerService;
using System.Reflection.Metadata.Ecma335;
using CycleRetailShop.Services.CycleService;
using CycleRetailShop.Services.OrderService;
using CycleRetailShop.Services.OrderDetailService;
using CycleRetailShop.Services.PaymentService;
using CycleRetailShop.Services.LoginService;
using System.Text;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.Filters;
using System.Security.Claims;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.AddDbContext<AppDbContext>(options =>
options.UseNpgsql(builder.Configuration.GetConnectionString("ConnectDatabaseConnection")));

//JWT Auhthentication


builder.Services.AddScoped<IUserService, UserServices>()
                 .AddScoped<ICustomerService, CustomerService>()
                 .AddScoped<ICycleService, CycleService>()
                 .AddScoped<IOrderService, OrderService>()
                 .AddScoped<IOrderDetailService, OrderDetailsService>()
                 .AddScoped<IPaymentService, PaymentService>()
                 .AddScoped< JwtService>()
                 .AddScoped<AuthService>();


var Jwtsettings = builder.Configuration.GetSection("JwtSettings");
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = false,
            ValidateAudience = false,
            ValidateIssuerSigningKey = true,
            IssuerSigningKey =new SymmetricSecurityKey(Encoding.UTF8.GetBytes(Jwtsettings["SecretKey"])),
        };
    });

builder.Services.AddAuthorization();
Console.WriteLine("JWT Secret Key: " + builder.Configuration["JwtSettings:SecretKey"]);

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(options =>
{
    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "Bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter 'Bearer <your_token>'"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            new List<string>()
        }
    });
});




var app = builder.Build();


app.UseCors(options =>
options.WithOrigins("http://localhost:4200")
.AllowAnyMethod()
.AllowAnyOrigin()
.AllowAnyHeader());


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseStaticFiles();
app.UseHttpsRedirection();
app.UseAuthentication();

app.UseAuthorization();


app.Use(async (context, next) =>
{
    Console.WriteLine($"User: {context.User.Identity.Name}");
    Console.WriteLine($"Is Authenticated: {context.User.Identity.IsAuthenticated}");
    Console.WriteLine($"User Roles: {string.Join(", ", context.User.Claims.Where(c => c.Type == ClaimTypes.Role).Select(c => c.Value))}");
    await next();
});

app.MapControllers();


app.Run();
