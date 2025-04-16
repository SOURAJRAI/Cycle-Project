using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using CycleRetailShop.Models;
using CycleRetailShop.DTO.UserDto;
using CycleRetailShop.Services.UserService;
using Microsoft.AspNetCore.Authorization;

namespace CycleRetailShop.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly IUserService _userService;

        public UserController(IUserService userService)
        {
            _userService = userService;
        }

        //[Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<User>>> GetAllUsers()
        {
            try
            {
            var users = await _userService.GetAllUsers();
            return Ok(users);

            }catch(InvalidOperationException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }

        //[Authorize(Roles = "Admin,Employee")]
        [HttpGet("{id}")]
        public async Task<ActionResult<User>> GetUserByID(int id)
        {
            try
            {
            var users = await _userService.GetUserById(id);
                return Ok(users);


            }
            catch (KeyNotFoundException ex)
            {
                Console.WriteLine(ex.Message);
                return NotFound(new { Message = ex.Message });
            }
        }

        //[Authorize(Roles ="Admin")]
        [HttpPost]
        public async Task<ActionResult<User>> CreateNewUser(UserCreateDto userDto)
        {
            if (userDto.UserName != "string" && userDto.PasswordHash != "string")
            {
                var user = new User
                {
                    UserName = userDto.UserName,
                    PasswordHash = userDto.PasswordHash,
                    Role = userDto.Role,
                    Email=userDto.Email,
                    PhoneNo=userDto.PhoneNo,
                

                };

                var createduser = await _userService.CreateUser(user);
                return Ok(createduser);
            }
           
            return BadRequest("Enter Correct Details");
           
            

        }

        //[Authorize(Roles = "Admin,Employee")]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateUser(int id, UserUpdateDto Updatedto)
        {
            var existingUser = await _userService.GetUserById(id);
            Console.WriteLine(Updatedto);
            if (id != existingUser.UserID )
            {
                return BadRequest("User Id Mistmatch");
            }
            try
            {   
                existingUser.UserName = Updatedto.UserName;
                existingUser.PasswordHash = Updatedto.PasswordHash;
                existingUser.Role = Updatedto.Role;
                existingUser.Email = Updatedto.Email;
                existingUser.PhoneNo = Updatedto.PhoneNo;
                existingUser.status = Updatedto.status;


                await _userService.UpdateUser(existingUser);
                return Ok();
            }
            catch (KeyNotFoundException)
            {
                return NotFound($"User with ID {id} not found");
            }
        }

        //[Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult>  DeleteUser(int id)
        {
            var checkUser = await _userService.GetUserById(id);
            if (checkUser == null)
            {
                return BadRequest("User Not Found");
            }
            await _userService.DeleteUser(id);
            return Ok();
        }


        

    }
}
