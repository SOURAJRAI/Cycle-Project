
using CycleRetailShop.Models;
namespace CycleRetailShop.Services.CustomerService
{
    public interface ICustomerService
    {
        Task<IEnumerable<Customer>> GetAllCustomers();
        Task<Customer> GetCustomerById(int id);
        Task<Customer> GetCustomerByMobile(string  mobile);

        Task<Customer> CreateCustomer(Customer customer);
        Task UpdateCustomer(Customer customer);
        Task DeleteCustomer(int id);

    }
}
