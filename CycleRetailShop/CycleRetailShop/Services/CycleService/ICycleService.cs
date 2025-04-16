using CycleRetailShop.Models;

namespace CycleRetailShop.Services.CycleService
{
    public interface ICycleService
    {
        public Task<IEnumerable<Cycle>> GetAllCycles();
        public Task<Cycle> GetCycleByID(int cycleId);
        public Task<Cycle> AddCycle(Cycle cycle);
        public Task UpdateCycle(Cycle cycle);
        public Task DeleteCycle(int cycleId);


    }
}
