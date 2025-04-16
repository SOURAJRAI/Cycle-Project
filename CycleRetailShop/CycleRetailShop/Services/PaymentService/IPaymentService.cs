using CycleRetailShop.Models;

namespace CycleRetailShop.Services.PaymentService
{
    public interface IPaymentService
    {
       
            Task<IEnumerable<Payment>> GetAllPayments();
            Task<Payment> GetPaymentByID(int id); // To get payment by ID
            Task<Payment> AddPayment(Payment payment); // To add a new payment
            Task UpdatePayment(Payment payment); // To update an existing payment
     

    }
}
