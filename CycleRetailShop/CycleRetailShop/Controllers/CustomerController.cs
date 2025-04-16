using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using CycleRetailShop.Models;
using CycleRetailShop.Services.CustomerService;
using CycleRetailShop.DTO.CustomerDto;
using Microsoft.AspNetCore.Authorization;

namespace CycleRetailShop.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CustomerController : ControllerBase
    {

        private readonly ICustomerService _customerService;
        
        public CustomerController(ICustomerService customerService)
        {
            _customerService = customerService;
        }

        //[Authorize(Roles ="Admin,Employee")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Customer>>> GetAllCustomers()
        {
            try
            {
                var customers = await _customerService.GetAllCustomers();
                return Ok(customers);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }

        //[Authorize(Roles = "Admin,Employee")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Customer>> GetCustomerById(int id)
        {
            try
            {
                var customer = await _customerService.GetCustomerById(id);
                return Ok(customer);
            }
            catch (KeyNotFoundException ex)
            {
                Console.WriteLine(ex.Message);
                return NotFound(new { Message = ex.Message });
            }
        }

        //[Authorize(Roles = "Admin,Employee")]
        [HttpPost]
        public async Task<ActionResult<Customer>> CreateNewCustomer(CustomerCreateDto customerDto)
        {
            if (customerDto.FirstName != "string" && customerDto.LastName != "string")
            {
                var customer = new Customer
                {
                    FirstName = customerDto.FirstName,
                    LastName = customerDto.LastName,
                    Email = customerDto.Email,
                    PhoneNumber = customerDto.PhoneNumber,
                    Address = customerDto.Address,
                    
                };
                var newCustomer = await _customerService.CreateCustomer(customer);
                return Ok(newCustomer);
            }
            return BadRequest(new { Message = "Invalid Customer Data" });
        }

        //[Authorize(Roles = "Admin,Employee")]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCustomer(int id, CustomerUpdateDto customerDto)
        {
            var customer = await _customerService.GetCustomerById(id);
            if (customer == null)
            {
                return NotFound(new { Message = "Customer Not Found" });
            }
            customer.FirstName = customerDto.FirstName;
            customer.LastName = customerDto.LastName;
            customer.Email = customerDto.Email;
            customer.PhoneNumber = customerDto.PhoneNumber;
            customer.Address = customerDto.Address;
            customer.status = customerDto.status;
            await _customerService.UpdateCustomer(customer);
            return Ok(new { Message = "Customer Updated Successfully" });
        }

        //[Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCustomer(int id)
        {
            try
            {


                var customer = await _customerService.GetCustomerById(id);
                if (customer == null)
                {
                    return NotFound(new { Message = "Customer Not Found" });
                }
                await _customerService.DeleteCustomer(id);
                return Ok(new { Message = "Customer Deleted Successfully" });
            }
            catch(KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }

    }

}
