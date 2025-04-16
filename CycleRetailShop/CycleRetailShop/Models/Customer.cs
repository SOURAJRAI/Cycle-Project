using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace CycleRetailShop.Models
{
    public class Customer
    {

        [Key]
        public int CustomerID { get; set; }

        [Required,StringLength(100)]
        public string FirstName { get; set; }

        [Required, StringLength(100)]
        public string LastName { get; set; }

        [Required, StringLength(100)]
        public string Email { get; set; }

        [Required, StringLength(100)]
        public string PhoneNumber { get; set; }

        [Required,StringLength(300)]
        public string Address { get; set; }


        [Required]
        public string status { get; set; } = "1";
    }
}
