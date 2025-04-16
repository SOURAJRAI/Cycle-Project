using CycleRetailShop.Models;

namespace CycleRetailShop.Services.OrderService
{
    public interface IOrderService
    {

        public Task<IEnumerable<Order>> GetAllOrders();

        public Task<Order> GetOrderByID(int id);
        public Task<Order> AddOrder(Order order);
        public Task UpdateOrder(Order order);
        public Task DeleteOrder(int id);
    }
}
