using CycleRetailShop.DTO.OrderDetailsDto;

namespace CycleRetailShop.DTO.OrderDto
{
    public class OrderFullDto
    {
        public int CustomerID { get; set; }
        public string Status { get; set; } = "Pending";
  
        public int CreatedBy { get; set; }

        public List<OrderDetailCreateDto> orderDetails { get; set; }
    }
}
