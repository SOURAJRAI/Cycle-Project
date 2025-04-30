using CycleRetailShop.Data;
using CycleRetailShop.Models;
using CycleRetailShop.Services.OrderService;
using Microsoft.EntityFrameworkCore;

namespace CycleRetailShop.Services.OrderService
{
    public class OrderService : IOrderService
    {
        private readonly AppDbContext _context;

        public OrderService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Order>> GetAllOrders()
        {
            var orders=await _context.Orders.Include(o=>o.Customer).Include(o=>o.User).ToListAsync();
            if(!orders.Any())
            {
                throw new InvalidOperationException("User not found");
            }
            return orders;
           
        }

        public async Task<Order> GetOrderByID(int id)
        {
            var order = await _context.Orders.Include(o => o.Customer).Include(o => o.User).FirstOrDefaultAsync(o => o.OrderID == id);
            if (order == null)
            {
                throw new KeyNotFoundException($"Order with {id} not found");
            }
            return order;
        }

        public async Task<Order> AddOrder(Order order)
        {
            _context.Orders.Add(order);
            await _context.SaveChangesAsync();
            return order;

        }

        public async Task UpdateOrder(Order order)
        {
            _context.Orders.Update(order);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteOrder(int id)
        {
            var order = await _context.Orders.Include(o => o.Customer).Include(o => o.User).FirstOrDefaultAsync(o => o.OrderID == id);
            if (order != null)
            {
                _context.Orders.Remove(order);
                await _context.SaveChangesAsync();
            }

        }

        public async Task<Order> getPendingOrderByCustomerId(int customerID)
        {
            return await _context.Orders.FirstOrDefaultAsync(o => o.CustomerID == customerID && o.Status == "Pending");
        }




    
    }
}
