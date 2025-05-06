namespace CycleRetailShop.DTO.Payment
{
    public class PaymentCreateDTO
    {
        public int OrderID { get; set; }
        public decimal AmountPaid { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentStatus { get; set; } = "Unsuccesfull";

    }

    public class PaymentUpdateDTO
    {

  
        public decimal AmountPaid { get; set; }
        public string PaymentMethod { get; set; }
        public string PaymentStatus { get; set; } = "Unsuccessfull"; 
    }
}
