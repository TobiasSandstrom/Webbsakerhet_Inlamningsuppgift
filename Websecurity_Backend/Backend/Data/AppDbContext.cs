using Backend.Entities;
using Microsoft.EntityFrameworkCore;

namespace Backend.Data
{
    public class AppDbContext : DbContext
    {
        public AppDbContext()
        {

        }
        public AppDbContext(DbContextOptions<AppDbContext> options)
            : base(options)
        {

        }

        public DbSet<MessageEntity> Messages { get; set; }
        public DbSet<UserImageEntity> UserImages { get; set; }
    }
}
