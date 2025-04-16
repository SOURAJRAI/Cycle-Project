using CycleRetailShop.DTO.Payment;
using CycleRetailShop.Models;
using CycleRetailShop.Services.PaymentService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CycleRetailShop.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class PaymentController : ControllerBase
    {

        private readonly IPaymentService _paymentService;
        public PaymentController(IPaymentService paymentService)
        {
            _paymentService = paymentService;
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Payment>>> GetAllPayments()
        {
            try { 
            var payments = await _paymentService.GetAllPayments();
            return Ok(payments);
            }
            catch(InvalidOperationException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Payment>> GetPaymentById(int id)
        {
            try
            {
                var payment = await _paymentService.GetPaymentByID(id);
                return Ok(payment);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpPost]
        public async Task<ActionResult<Payment>> AddPayment(PaymentCreateDTO paymentDto)
        {
            try
            {
                var payment = new Payment
                {
                    OrderID = paymentDto.OrderID,
                    PaymentDate=DateTime.UtcNow,
                    AmountPaid = paymentDto.AmountPaid,
                    PaymentMethod = paymentDto.PaymentMethod
                };

                var createdPayment = await _paymentService.AddPayment(payment);
                return CreatedAtAction(nameof(GetPaymentById), new { id = createdPayment.PaymentID }, createdPayment);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdatePayment(int id, PaymentUpdateDTO paymentDto)
        {
            try
            {
                var payment = await _paymentService.GetPaymentByID(id);
                    if (id != payment.PaymentID)
                    {
                        return BadRequest(new { message = "Payment id mismatch" });
                    }



                payment.AmountPaid = paymentDto.AmountPaid;
                payment.PaymentMethod = paymentDto.PaymentMethod;

                await _paymentService.UpdatePayment(payment);
                    return Ok(payment);
            }
            catch (KeyNotFoundException ex)
            {
                    return NotFound(new { message = ex.Message });
            }
        }

    }
}
