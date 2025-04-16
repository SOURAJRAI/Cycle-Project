using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Globalization;

namespace CycleRetailShop.Models
{
    public class Cycle
    {
        [Key]
        public int CycleID { get; set; }

        [Required, StringLength(100)]
        public string Brand { get; set; }

        [Required, StringLength(50)]
        public string Type { get; set; }

        [Required, StringLength(100)]
        public string ModelName { get; set; }

        [Required,Column(TypeName ="decimal(18,2)")]
        public decimal Price { get; set; }

        [Required]
        public int StockQuantity { get; set; }

        [StringLength(255)]
        public string? ImageUrl { get; set; }

        [Required,StringLength(255)]
        public string description { get; set; }

        [Required]
        public DateTime AddedDate { get; set; }

       
        public DateTime UpdatedDate { get; set; }

        [StringLength(200)]
        public string WarrantyPeriod { get; set; } 
    }
}
