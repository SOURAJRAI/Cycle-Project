using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace CycleRetailShop.DTO.CycleDto
{
    public class CycleUpdateDto
    {

      
        public string Brand { get; set; }

 
        public string Type { get; set; }


        public string ModelName { get; set; }


        public decimal Price { get; set; }

 
        public int StockQuantity { get; set; }

 
        public IFormFile ImageUrl { get; set; }


        public string description { get; set; }



        public string WarrantyPeriod { get; set; }
    }
}
