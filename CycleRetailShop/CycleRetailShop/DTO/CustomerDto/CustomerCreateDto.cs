using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace CycleRetailShop.DTO.CustomerDto
{
    public class CustomerCreateDto
    {
        [Required, StringLength(100)]
        public string FirstName { get; set; }

        [Required, StringLength(100)]
        public string LastName { get; set; }

        [Required, StringLength(100)]
        public string Email { get; set; }

        [Required, StringLength(100)]
        public string PhoneNumber { get; set; }

        [Required, StringLength(300)]
        public string Address { get; set; }

        //[DefaultValue("1")]
        //public string status { get; set; }
    }
}
