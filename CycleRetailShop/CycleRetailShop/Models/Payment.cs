using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CycleRetailShop.Models
{
    public class Payment
    {

        [Key]
        public int PaymentID { get; set; } 

        [Required]
        [ForeignKey("Order")]
        public int OrderID { get; set; } 

        [Required]
        public DateTime PaymentDate { get; set; }  

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal AmountPaid { get; set; }  

        [Required]
        [StringLength(50)]
        public string PaymentMethod { get; set; } 

        [StringLength(20)]
        public string PaymentStatus { get; set; } = "Successfull";  

       
        public Order Order { get; set; }
    }
}
