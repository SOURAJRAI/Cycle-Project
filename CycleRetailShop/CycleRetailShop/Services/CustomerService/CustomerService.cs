using CycleRetailShop.Data;
using CycleRetailShop.Models;
using Microsoft.EntityFrameworkCore;

namespace CycleRetailShop.Services.CustomerService
{
    public class CustomerService : ICustomerService
    {
        private readonly AppDbContext _context;
        public CustomerService(AppDbContext context) {
          
                _context =context;
        }

        public async Task<IEnumerable<Customer>> GetAllCustomers()
        {
            var customers = await _context.Customers.ToListAsync();
            if (!customers.Any())
            {
                throw new InvalidOperationException("No Customer Found");
            }
            return customers;
        }

        public async Task<Customer> GetCustomerById(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
                throw new KeyNotFoundException($"Customer with id {id} not found");
            }
            return customer;
        }

        public async Task<Customer> CreateCustomer(Customer customer)
        {
            _context.Customers.Add(customer);
            await _context.SaveChangesAsync();
            return customer;
        }

        public async Task UpdateCustomer(Customer customer)
        {
            _context.Customers.Update(customer);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCustomer(int id)
        {
            var customer = await _context.Customers.FindAsync(id);
            if (customer == null)
            {
            throw new KeyNotFoundException($"Customer with id {id} not found"); 
            }
            _context.Customers.Remove(customer);
            await _context.SaveChangesAsync();

        }

    }
}
