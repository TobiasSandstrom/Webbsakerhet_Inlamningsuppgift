namespace Backend.Models
{
    public class UserImageSaveModel
    {
        public UserImageSaveModel(string imageName, IFormFile formFile)
        {
            ImageName = imageName;
            this.formFile = formFile;
        }

        public string ImageName { get; set; }
        public IFormFile formFile { get; set; }
    }
}
