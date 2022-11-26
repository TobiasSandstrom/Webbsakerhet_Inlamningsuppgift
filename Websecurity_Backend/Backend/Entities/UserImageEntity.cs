using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Backend.Entities
{
    public class UserImageEntity
    {

        [Key]
        [Required]
        public string UserId { get; set; }

        [Required]
        public string ImageName { get; set; }

        [NotMapped]
        public IFormFile ImageFile { get; set; }



    }
}
