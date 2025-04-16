using CycleRetailShop.Models;
using CycleRetailShop.Data;
using Microsoft.EntityFrameworkCore;
using Microsoft.AspNetCore.Identity;

namespace CycleRetailShop.Services.UserService
{
    public class UserServices : IUserService
    {
        private readonly AppDbContext _context;

        public UserServices(AppDbContext context)
        {
            _context = context;

        }


        public async Task<IEnumerable<User>> GetAllUsers()
        {
            var users = await _context.Users.ToListAsync();
                
            if(!users.Any())
            {
                throw new InvalidOperationException("No User Found");
            }
            return users;

            
        }

        public async Task<User> GetUserById(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with id {id} not found");
            }
            return user;
        }

        public async Task<User> CreateUser(User user)
        {
            var passwordHasher = new PasswordHasher<User>();
            user.PasswordHash = passwordHasher.HashPassword(user, user.PasswordHash);
            _context.Users.Add(user);
            await _context.SaveChangesAsync();
            return user;

        }
        public async Task UpdateUser(User user)
        {
            _context.Users.Update(user);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user != null)
            {
                _context.Users.Remove(user);
                await _context.SaveChangesAsync();

            }
        }
    }
}
