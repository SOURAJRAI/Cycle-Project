namespace CycleRetailShop.DTO.OrderDto
{
    public class OrderCreateDto
    {
     
            public int CustomerID { get; set; }
        public string Status { get; set; } = "Pending";
            //public decimal TotalAmount { get; set; }
            public int CreatedBy { get; set; }  
    }


}
