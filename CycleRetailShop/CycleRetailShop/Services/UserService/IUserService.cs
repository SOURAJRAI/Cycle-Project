using CycleRetailShop.Models;

namespace CycleRetailShop.Services.UserService
{
    public interface IUserService
    {
        Task<IEnumerable<User>> GetAllUsers();
        Task <User> GetUserById(int id);
        Task<User> CreateUser(User user);
        Task UpdateUser(User user);
        Task DeleteUser(int id);
    }
}
