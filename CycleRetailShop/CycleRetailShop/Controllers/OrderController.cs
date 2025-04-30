using System.Linq.Expressions;
using CycleRetailShop.DTO.OrderDto;
using CycleRetailShop.Models;
using CycleRetailShop.Services.OrderDetailService;
using CycleRetailShop.Services.OrderService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;

namespace CycleRetailShop.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrderController : ControllerBase
    {
        private readonly IOrderService _orderService;
        private readonly IOrderDetailService _orderDetailService;

        public OrderController(IOrderService orderService,IOrderDetailService orderDetailService)
        {
            _orderService = orderService;
            _orderDetailService = orderDetailService;
        }

        //[Authorize(Roles = "Admin,Employee")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Order>>> GetAllOrders()
        {
            try
            {
                var orders = await _orderService.GetAllOrders();
                return Ok(orders);

            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }

        //[Authorize(Roles = "Admin,Employee")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Order>> GetOrderByID(int id)
        {

            try
            {
                var order = await _orderService.GetOrderByID(id);
                return Ok(order);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }

        //[Authorize(Roles = "Admin,Employee")]
        [HttpPost]
        public async Task<ActionResult<Order>> AddOrder(OrderCreateDto orderDto)
        {
            try
            {
                var order = new Order
                {
                    CustomerID = orderDto.CustomerID,
                    OrderDate = DateTime.UtcNow,
                    Status = orderDto.Status,
                    CreatedBy = orderDto.CreatedBy
                };
                var addOrder = await _orderService.AddOrder(order);
                return Ok(addOrder);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        //[Authorize(Roles = "Admin,Employee")]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateOrder(int id, OrderUpdateDto orderDto)
        {
            try
            {


                var existOrder = await _orderService.GetOrderByID(id);
                if (existOrder == null)
                {
                    return NotFound(new { Message = "Order Not Found" });
                }


                existOrder.Status = orderDto.Status;

                await _orderService.UpdateOrder(existOrder);
                return Ok(new { Message = "Orders Updated Successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }

        }

        //[Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteOrder(int id)
        {
            try
            {
                var ExistOrder = await _orderService.GetOrderByID(id);
                if (ExistOrder == null)
                {
                    return NotFound($"Cycle with {id} Not Found");
                }
                await _orderService.DeleteOrder(id);
                return Ok(new { Message = "Cycle Deleted Successfully" });
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }

        }

        [HttpPost("AddOrderDetails")]
        public async Task<ActionResult> AddOrderDetails(OrderFullDto orderDto)
        {
            var existingOrder = await _orderService.getPendingOrderByCustomerId(orderDto.CustomerID);
            Order order;

            if (existingOrder != null)
            {
                order = existingOrder;
            }
            else
            {


                 order = new Order
                {
                    CustomerID = orderDto.CustomerID,
                    OrderDate = DateTime.UtcNow,
                    Status = orderDto.Status,
                    CreatedBy = orderDto.CreatedBy
                };

                order = await _orderService.AddOrder(order);
            }
            decimal total = order.TotalAmount;

            foreach (var item in orderDto.orderDetails)
            {
                var detail = new OrderDetail
                {
                    OrderID = order.OrderID,
                    CycleID = item.CycleID,
                    Quantity = item.Quantity,
                    UnitPrice =item.UnitPrice,
                    TotalPrice = item.Quantity * item.UnitPrice,

                };
                total += detail.TotalPrice;
                await _orderDetailService.AddOrderDetail(detail);
            }
            order.TotalAmount = total;
            await _orderService.UpdateOrder(order);

            return Ok(new { Message = "Order and Order Details Saved Successfully" });


        }


        


    }
}
