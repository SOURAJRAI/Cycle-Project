using CycleRetailShop.Data;
using CycleRetailShop.Models;

using Microsoft.EntityFrameworkCore;


namespace CycleRetailShop.Services.OrderDetailService
{
    public class OrderDetailsService : IOrderDetailService
    {
        private readonly AppDbContext _context;

        public OrderDetailsService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<OrderDetail>> GetAllOrderDetails()
        {
            var orderDetails = await _context.OrderDetails
                .Include(od => od.Order)
                .Include(od => od.Cycle)
                .ToListAsync();

            if (!orderDetails.Any())
            {
                throw new InvalidOperationException("No order details found.");
            }

            return orderDetails;
        }

        public async Task<OrderDetail> GetOrderDetailByID(int id)
        {
            var orderDetail = await _context.OrderDetails
                .Include(od => od.Order)
                .Include(od => od.Cycle)
                .FirstOrDefaultAsync(od => od.OrderDetailID == id);

            if (orderDetail == null)
            {
                throw new KeyNotFoundException($"Order Detail with ID {id} not found.");
            }

            return orderDetail;
        }

        public async Task<OrderDetail> AddOrderDetail(OrderDetail orderDetail)
        {
            var cycle = await _context.Cycles.FirstOrDefaultAsync(c => c.CycleID == orderDetail.CycleID);

            if (cycle == null)
            {
                throw new KeyNotFoundException($"Cycle with ID {orderDetail.CycleID} not found.");
            }
            if (cycle.StockQuantity < orderDetail.Quantity)
            {
                throw new InvalidOperationException("Insufficient stock for the selected cycle.");
                }

            cycle.StockQuantity -= orderDetail.Quantity;

             _context.Cycles.Update(cycle);

            _context.OrderDetails.Add(orderDetail);
            
            await _context.SaveChangesAsync();
            await UpdateOrderTotalPrice(orderDetail.OrderID);
            return orderDetail;
        }

        public async Task UpdateOrderDetail(OrderDetail orderDetail)
        {
            var existingOrderDetail = await _context.OrderDetails.FirstOrDefaultAsync(od => od.OrderDetailID == orderDetail.OrderDetailID);
            if (existingOrderDetail == null)
            {
                throw new KeyNotFoundException("OrderDetail not found.");
            }

            var cycle = await _context.Cycles.FirstOrDefaultAsync(c => c.CycleID == orderDetail.CycleID);
            if (cycle == null)
            {
                throw new InvalidOperationException("Cycle not found.");
            }

        
            int stockAdjustment = existingOrderDetail.Quantity - orderDetail.Quantity;
            if (cycle.StockQuantity + stockAdjustment < 0)
            {
                throw new InvalidOperationException("Insufficient stock for the selected cycle.");
            }
            cycle.StockQuantity += stockAdjustment;
            _context.Cycles.Update(cycle);

            _context.OrderDetails.Update(orderDetail);
            await _context.SaveChangesAsync();
            await UpdateOrderTotalPrice(orderDetail.OrderID);
        }

        public async Task DeleteOrderDetail(int id)
        {
            var orderDetail = await _context.OrderDetails.FirstOrDefaultAsync(od => od.OrderDetailID == id);
            if (orderDetail == null)
            {
                throw new KeyNotFoundException("OrderDetail not found.");
            }

            var cycle = await _context.Cycles.FirstOrDefaultAsync(c => c.CycleID == orderDetail.CycleID);
            if (cycle == null)
            {
                throw new InvalidOperationException("Cycle not found.");
            }

            // Add the quantity back to stock
            cycle.StockQuantity += orderDetail.Quantity;
            _context.Cycles.Update(cycle);

            // Delete order detail
            _context.OrderDetails.Remove(orderDetail);
            await _context.SaveChangesAsync();

            // Update total price in the Order
            await UpdateOrderTotalPrice(orderDetail.OrderID);
        }
        public async Task UpdateOrderTotalPrice(int orderId)
        {
            var orderDetails = await _context.OrderDetails
                                              .Where(od => od.OrderID == orderId)
                                              .ToListAsync();

            decimal newTotalPrice = orderDetails.Sum(od => od.TotalPrice);

            var order = await _context.Orders.FirstOrDefaultAsync(o => o.OrderID == orderId);
            if (order != null)
            {
                order.TotalAmount = newTotalPrice;
                _context.Orders.Update(order);
                await _context.SaveChangesAsync();
            }
        }
    }
}