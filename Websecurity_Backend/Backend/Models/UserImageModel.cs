namespace Backend.Models
{
    public class UserImageModel
    {
        public UserImageModel(string userId, string imageName, string imageSource)
        {
            UserId = userId;
            ImageName = imageName;
            ImageSource = imageSource;
        }

        public string UserId { get; set; }
        public string ImageName { get; set; }
        public string ImageSource { get; set; }
    }
}

