using CycleRetailShop.Data;
using CycleRetailShop.DTO.Payment;
using CycleRetailShop.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CycleRetailShop.Services.PaymentService
{
    public class PaymentService : IPaymentService
    {
        private readonly AppDbContext _context;

        public PaymentService(AppDbContext context)
        {
            _context = context;
        }

        // Get all payments logic unchanged
        public async Task<IEnumerable<Payment>> GetAllPayments()
        {
            var payments = await _context.Payments.Include(o=>o.Order).ToListAsync();

            if(!payments.Any())
            {
                throw new InvalidOperationException("No users Found");
            }

            return payments;
        }



        // Get payment by ID logic unchanged
        public async Task<Payment> GetPaymentByID(int id)
        {
            var payment = await _context.Payments.FindAsync(id);
            if (payment == null)
            {
                throw new KeyNotFoundException($"Payment with ID {id} not found.");
            }

            return payment;
        }

        // Add Payment logic
        public async Task<Payment> AddPayment(Payment paymentDto)
        {
            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderID == paymentDto.OrderID);
            if (order == null)
            {
                throw new KeyNotFoundException($"Order with ID {paymentDto.OrderID} not found.");
            }

            //var payment = new Payment
            //{
            //    OrderID = paymentDto.OrderID,
            //    PaymentDate = DateTime.UtcNow,
            //    AmountPaid = paymentDto.AmountPaid,
            //    PaymentMethod = paymentDto.PaymentMethod,
            //    PaymentStatus = paymentDto.AmountPaid >= order.TotalAmount ? "Paid" : "Pending"
            //};

            paymentDto.PaymentStatus = paymentDto.AmountPaid >= order.TotalAmount ? "Paid" : "Pending";


             _context.Payments.Add(paymentDto);
            await _context.SaveChangesAsync();


            return paymentDto;
        }

        // Update Payment logic
        public async Task UpdatePayment(Payment paymentDto)
        {
            var payment = await _context.Payments.FirstOrDefaultAsync(o => o.PaymentID == paymentDto.PaymentID);
            if (payment == null)
            {
                throw new KeyNotFoundException("Payment not found.");
            }

            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderID == payment.OrderID);
            if (order == null)
            {
                throw new KeyNotFoundException($"Order with ID {payment.OrderID} not found.");
            }
            
            if(payment.AmountPaid != order.TotalAmount)
            {
                throw new InvalidOperationException($"The amount paid ({payment.AmountPaid}) does not match the order total amount ({order.TotalAmount}). Please ensure the payment is exactly the total amount.");
            }

       

            paymentDto.PaymentStatus = paymentDto.AmountPaid >= order.TotalAmount ? "Paid" : "Pending";
            _context.Payments.Update(paymentDto);


            await _context.SaveChangesAsync();
        }
    }
}