using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace CycleRetailShop.Models
{
    public class OrderDetail
    {
        [Key]
        public int OrderDetailID { get; set; } 

        [ForeignKey("Order")]
        public int OrderID { get; set; } 
        public Order Order { get; set; }

        [ForeignKey("Cycle")]
        public int CycleID { get; set; } 
        public Cycle Cycle { get; set; } 

        [Required]
        public int Quantity { get; set; }

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal UnitPrice { get; set; }

        [Column(TypeName = "decimal(18,2)")]
        public decimal TotalPrice { get; set; } 
    }
}
