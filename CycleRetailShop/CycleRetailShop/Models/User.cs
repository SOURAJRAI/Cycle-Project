using System.ComponentModel;
using System.ComponentModel.DataAnnotations;

namespace CycleRetailShop.Models
{
    public class User
    {
        [Key]
        public int UserID { get; set; }

        [Required]
        [StringLength(100)]
        public string UserName { get; set; } = "";

        [Required, StringLength(100)]
        public string PasswordHash { get; set; } = "";

        [DefaultValue("Employee")]
        public string Role { get; set; }

        [Required, StringLength(100)]
        public string Email { get; set; } = "";

        [Required, StringLength(12)]
        public string PhoneNo { get; set; } = "";

        [Required]
        public string status { get; set; } = "1";

    }
}
