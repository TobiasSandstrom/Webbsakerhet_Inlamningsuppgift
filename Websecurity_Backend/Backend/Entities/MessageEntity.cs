using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
namespace Backend.Entities
{
    public class MessageEntity
    {
        [Key]
        public Guid Id { get; set; }

        [Column(TypeName = "Nvarchar(50)")]
        public string MessageHeader { get; set; }
        
        
        [Column(TypeName = "Nvarchar(500)")]
        public string Message { get; set; }

        [Column(TypeName = "Nvarchar(20)")]
        public string Date { get; set; }

    }
}
