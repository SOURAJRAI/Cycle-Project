using CycleRetailShop.Data;
using CycleRetailShop.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace CycleRetailShop.Services.LoginService
{
    public class AuthService
    {
        private readonly AppDbContext _context;
        private readonly JwtService _jwtService;
        public AuthService(AppDbContext context, JwtService jwtService)
        {
            _context = context;
            _jwtService = jwtService;
        }

        public async Task<(string Token,User user)?> Login(string username, string password)
        {
            var user =await _context.Users.FirstOrDefaultAsync(u => u.UserName== username);
            if (user == null)
            {
                return null;
            }

            var passwordHasher = new PasswordHasher<User>();
            var result = passwordHasher.VerifyHashedPassword(user, user.PasswordHash, password);
            if(result == PasswordVerificationResult.Failed)
            {
                return null;
            }

            var token= _jwtService.GenerateToken(user.UserName, user.Role);

            return (token, user);


   
        }


    }
}
