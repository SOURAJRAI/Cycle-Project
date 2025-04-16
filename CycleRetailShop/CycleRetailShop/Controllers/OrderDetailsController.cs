using CycleRetailShop.Data;
using CycleRetailShop.DTO.OrderDetailsDto;
using CycleRetailShop.DTO.OrderDetailsDto;
using CycleRetailShop.Models;
using CycleRetailShop.Services.OrderDetailService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CycleRetailShop.Controllers
{
    [Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class OrderDetailsController : ControllerBase
    {
        private readonly IOrderDetailService _orderDetailService;
        private readonly AppDbContext _context;

        public OrderDetailsController(IOrderDetailService orderDetailService,AppDbContext context)
        {
            _orderDetailService = orderDetailService;
            _context = context;
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<OrderDetail>>> GetAllOrderDetails()
        {
            try
            {
                var orderDetails = await _orderDetailService.GetAllOrderDetails();
                return Ok(orderDetails);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpGet("{id}")]
        public async Task<ActionResult<OrderDetail>> GetOrderDetailByID(int id)
        {
            try
            {
                var orderDetail = await _orderDetailService.GetOrderDetailByID(id);
                return Ok(orderDetail);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpPost]
        public async Task<ActionResult<OrderDetail>> AddOrderDetail(OrderDetailCreateDto orderDetailDto)
        {
            try
            {
                var orderDetail = new OrderDetail
                {
                    OrderID = orderDetailDto.OrderID,
                    CycleID = orderDetailDto.CycleID,
                    Quantity = orderDetailDto.Quantity,
                    UnitPrice = orderDetailDto.UnitPrice,
                    TotalPrice = orderDetailDto.Quantity * orderDetailDto.UnitPrice
                };

               

                var addedOrderDetail = await _orderDetailService.AddOrderDetail(orderDetail);
                //await _orderDetailService.UpdateOrderTotalPrice(orderDetail.OrderID);
                return Ok(addedOrderDetail);
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin,Employee")]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateOrderDetail(int id, OrderDetailsUpdateDto orderDetailDto)
        {
            try
            {
                var existOrderDetail = await _orderDetailService.GetOrderDetailByID(id);
              

                existOrderDetail.CycleID = orderDetailDto.CycleID;
                existOrderDetail.Quantity = orderDetailDto.Quantity;
                existOrderDetail.UnitPrice = orderDetailDto.UnitPrice;
                existOrderDetail.TotalPrice = orderDetailDto.Quantity * orderDetailDto.UnitPrice;

                await _orderDetailService.UpdateOrderDetail(existOrderDetail);
                //await _orderDetailService.UpdateOrderTotalPrice(existOrderDetail.OrderID);
                return Ok(new { Message = "Order Detail Updated Successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(ex.Message);
            }
        }

        [Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteOrderDetail(int id)
        {
            try
            {
                var existOrderDetail = await _orderDetailService.GetOrderDetailByID(id);
                if (existOrderDetail == null)
                {
                    return NotFound(new { Message = "Order Detail Not Found" });
                }

                await _orderDetailService.DeleteOrderDetail(id);
                return Ok(new { Message = "Order Detail Deleted Successfully" });
            }
            catch (KeyNotFoundException ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}
