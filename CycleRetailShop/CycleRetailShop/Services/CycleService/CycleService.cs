using CycleRetailShop.Data;
using CycleRetailShop.Models;
using Microsoft.EntityFrameworkCore;

namespace CycleRetailShop.Services.CycleService
{
    public class CycleService:ICycleService
    {
        private readonly AppDbContext _context;
        public CycleService(AppDbContext context)
        {
            _context = context;
        }

        public async Task<IEnumerable<Cycle>> GetAllCycles()
        {
            var cycles = await _context.Cycles.ToListAsync();
            if (!cycles.Any())
            {
                throw new InvalidOperationException("No Cycles Found");
            }
            return cycles;
        }

        public async Task<Cycle> GetCycleByID(int id)
        {
            var cycle = await _context.Cycles.FindAsync(id);

            if (cycle == null)
            {
                throw new KeyNotFoundException($"Cycle with id {id} not found");
            }
            return cycle;
        }

        public async Task<Cycle> AddCycle(Cycle cycle)
        {
            _context.Cycles.Add(cycle);
            await _context.SaveChangesAsync();
            return cycle;
        }

        public async Task UpdateCycle(Cycle cycle)
        {
            _context.Cycles.Update(cycle);
            await _context.SaveChangesAsync();
        }

        public async Task DeleteCycle(int id)
        {
            var cycle = await _context.Cycles.FindAsync(id);
            if (cycle == null)
            {
            throw new KeyNotFoundException($"Cycle with id {id} not found");
            }
                _context.Cycles.Remove(cycle);
                await _context.SaveChangesAsync();

        }

    }
}
