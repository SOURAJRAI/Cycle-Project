using CycleRetailShop.Models;

namespace CycleRetailShop.Services.OrderDetailService
{
    public interface IOrderDetailService
    {

        Task<IEnumerable<OrderDetail>> GetAllOrderDetails(); 
        Task<OrderDetail> GetOrderDetailByID(int id); 
        Task<OrderDetail> AddOrderDetail(OrderDetail orderDetail); 
        Task UpdateOrderDetail(OrderDetail orderDetail); 
        Task DeleteOrderDetail(int id);
        Task UpdateOrderTotalPrice(int orderId);
    }
}
