using System.ComponentModel.DataAnnotations;
using System.ComponentModel;

namespace CycleRetailShop.DTO.UserDto
{
    public class UserUpdateDto
    {
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
