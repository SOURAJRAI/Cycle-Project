using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CycleRetailShop.DTO.CycleDto
{
    public class CycleCreateDto
    {

        [Required, StringLength(100)]
        public string Brand { get; set; }

        [Required, StringLength(50)]
        public string Type { get; set; }

        [Required, StringLength(100)]
        public string ModelName { get; set; }

        [Required, Column(TypeName = "decimal(18,2)")]
        public decimal Price { get; set; }

        [Required]
        public int StockQuantity { get; set; }

        public IFormFile ImageUrl { get; set; }

        [Required, StringLength(255)]
        public string description { get; set; }

  

        [StringLength(200)]
        public string WarrantyPeriod { get; set; }
    }
}
