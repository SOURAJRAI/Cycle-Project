using CycleRetailShop.Services.CycleService;
using CycleRetailShop.Models;
using CycleRetailShop.DTO.CycleDto;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Authorization;

namespace CycleRetailShop.Controllers
{
    //[Authorize]
    [Route("api/[controller]")]
    [ApiController]
    public class CycleController : ControllerBase
    {
        private readonly ICycleService _cycleService;

        public CycleController(ICycleService cycleService)
        {
            _cycleService = cycleService;
        }

        //[Authorize(Roles = "Admin,Employee")]
        [HttpGet]
        public async Task<ActionResult<IEnumerable<Cycle>>> GetAllCycles()
        {
            try
            {
                var cycles = await _cycleService.GetAllCycles();
                return Ok(cycles);
            }
            catch (InvalidOperationException ex)
            {
                return NotFound(new {Message=ex.Message});
            }
        }

        //[Authorize(Roles = "Admin,Employee")]
        [HttpGet("{id}")]
        public async Task<ActionResult<Cycle>> GetCycleById(int id)
        {
            try
            {
                var cycle = await _cycleService.GetCycleByID(id);
                return Ok(cycle);
            }
            catch (KeyNotFoundException ex)
            {
                return NotFound(new { Message = ex.Message });
            }
        }

        //[Authorize(Roles = "Admin")]
        [HttpPost]
        public async Task<ActionResult<Cycle>> AddCycle(CycleCreateDto cycleDto)
        {
            try
            {
                string imageUrl = null;
                if (cycleDto.ImageUrl != null && cycleDto.ImageUrl.Length > 0 )
                {
                    var imagesFolder = Path.Combine( "wwwroot", "images");

                    if(!Directory.Exists(imagesFolder))
                    {
                        Directory.CreateDirectory(imagesFolder);
                    }

                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + cycleDto.ImageUrl.FileName;

                    var imagePath = Path.Combine(imagesFolder, uniqueFileName);

                    using (var stream = new FileStream(imagePath, FileMode.Create))
                    {
                        await cycleDto.ImageUrl.CopyToAsync(stream);
                    }

                    imageUrl = "/images/" + uniqueFileName;
                }
                else
                {
                    return BadRequest(new { Message = "Image file is required" });
                }

                var cycle = new Cycle
                {
                    Brand = cycleDto.Brand,
                    Type = cycleDto.Type,
                    ModelName = cycleDto.ModelName,
                    Price = cycleDto.Price,
                    StockQuantity = cycleDto.StockQuantity,
                    ImageUrl = imageUrl,
                    description = cycleDto.description,
                    AddedDate = DateTime.UtcNow,
                    WarrantyPeriod = cycleDto.WarrantyPeriod
                };
                var addedCycle = await _cycleService.AddCycle(cycle);
                return Ok(addedCycle);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        //[Authorize(Roles = "Admin")]
        [HttpPut("{id}")]
        public async Task<ActionResult> UpdateCycle(int id,CycleUpdateDto cycleDto)
        {
            try
            {
            var existingcycle = await _cycleService.GetCycleByID(id);
            if (existingcycle == null)
            {
                return NotFound($"Cycle with {id} Not Found");
            }
                string imageUrl = existingcycle.ImageUrl;
                if (cycleDto.ImageUrl != null && cycleDto.ImageUrl.Length > 0)
                {
                    var imagesFolder = Path.Combine("wwwroot", "images");

                    if (!Directory.Exists(imagesFolder))
                    {
                        Directory.CreateDirectory(imagesFolder);
                    }

                    var uniqueFileName = Guid.NewGuid().ToString() + "_" + cycleDto.ImageUrl.FileName;

                    var imagePath = Path.Combine(imagesFolder, uniqueFileName);

                    using (var stream = new FileStream(imagePath, FileMode.Create))
                    {
                        await cycleDto.ImageUrl.CopyToAsync(stream);
                    }

                    imageUrl = "/images/" + uniqueFileName;
                }
                else
                {
                    return BadRequest(new { Message = "Image file is required" });
                }


                var cycle = new Cycle
                {
                    Brand = cycleDto.Brand,
                    Type = cycleDto.Type,
                    ModelName = cycleDto.ModelName,
                    Price = cycleDto.Price,
                    StockQuantity = cycleDto.StockQuantity,
                    ImageUrl = imageUrl,
                    description = cycleDto.description,
                    UpdatedDate = DateTime.UtcNow,
                    WarrantyPeriod = cycleDto.WarrantyPeriod
                };
                await _cycleService.UpdateCycle(cycle);
                return Ok(new {Message="Customer Updated Successfully"});
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        //[Authorize(Roles = "Admin")]
        [HttpDelete("{id}")]
        public async Task<ActionResult> DeleteCycle(int id)
        {
            try
            {

            var existingCycle = await _cycleService.GetCycleByID(id);
            if(existingCycle== null)
            {
                return NotFound($"Cycle with {id} Not Found");
            }
                await _cycleService.DeleteCycle(id);
                return Ok(new { Message = "Cycle Deleted Successfully" });
            }
            catch (KeyNotFoundException ex)

            {
                return BadRequest(new { Message = ex.Message });
            }
        }



    }
}
