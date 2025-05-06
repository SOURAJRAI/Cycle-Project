using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using CycleRetailShop.Models;

namespace CycleRetailShop.Data
{
    public class AppDbContext:DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options):base(options) 
        { }

        public DbSet<User> Users { get; set; }
        public DbSet<Customer> Customers { get; set; }
        public DbSet<Cycle> Cycles { get; set; }

        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderDetail> OrderDetails { get; set; }
        public DbSet<Payment> Payments { get; set; }

        public DbSet<FailedPayment> FailedPaymentAttempts { get; set; }

    }
}

