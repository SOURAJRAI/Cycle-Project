using System.ComponentModel.DataAnnotations;

namespace CycleRetailShop.Models
{
    public class FailedPayment
    {
        public int Id { get; set; }

        public string PaymentMethod { get; set; } = string.Empty;

      
        public DateTime AttemptedAt { get; set; } = DateTime.UtcNow;

        public string? CustomerEmail { get; set; }


    
        public string PhoneNumber { get; set; }
    }
}
