
using CycleRetailShop.Data;
using CycleRetailShop.Migrations;
using CycleRetailShop.Models;
using CycleRetailShop.Services.CycleService;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CycleRetailShop.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class logfailedAttempts : ControllerBase
    {
        private readonly AppDbContext  _context;

        public logfailedAttempts(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task LogFailedPaymentAsync([FromBody]failedAttempts failedattempt)
        {
            var attempt = new FailedPayment
            {
                PaymentMethod = failedattempt.PaymentMethod,
                CustomerEmail = failedattempt.CustomerEmail,
                PhoneNumber = failedattempt.PhoneNumber
            };

            _context.FailedPaymentAttempts.Add(attempt);
            await _context.SaveChangesAsync();
        }
    }
    public class failedAttempts
    {

        public string PaymentMethod { get; set; } = string.Empty;

        public string? CustomerEmail { get; set; }

        public string PhoneNumber { get; set; }
    }
}
