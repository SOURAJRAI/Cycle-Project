using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace CycleRetailShop.Models
{
    public class Order
    {

        [Key]
        public int OrderID { get; set; } 

        [ForeignKey("Customer")]
        public int CustomerID { get; set; } 

        [Required]
        public DateTime OrderDate { get; set; } 

        [Required]
        [StringLength(50)]
        public string Status { get; set; } = "Pending"; 

        [Required]
        [Column(TypeName = "decimal(10, 2)")]
        public decimal TotalAmount { get; set; } 

        [ForeignKey("User")]
        public int CreatedBy { get; set; } 

        // Navigation properties
        public Customer? Customer { get; set; }
        public User? User { get; set; }

    }
}
