namespace Backend.Models
{
    public class UserImageCreateModel
    {

        public UserImageCreateModel(string userId, string imageName)
        {
            UserId = userId;
            ImageName = imageName;
        }

        public string UserId { get; set; }
        public string ImageName { get; set; }
    }
}
