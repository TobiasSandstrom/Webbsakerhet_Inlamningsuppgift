using Backend.Data;
using Backend.Entities;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Drawing;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class UserImageController : ControllerBase
    {

        private readonly AppDbContext _context;
        private readonly IWebHostEnvironment _hostEnvironment;

        public UserImageController(AppDbContext context, IWebHostEnvironment hostEnvironment)
        {
            _context = context;
            _hostEnvironment = hostEnvironment;
        }



        [HttpDelete("delete/{id}")]

        public async Task<ActionResult> Delete(string id)
        {
            try
            {
                var image = await _context.UserImages.FindAsync(id);
                if (image == null) return BadRequest("Cant find image");


                _context.UserImages.Remove(image);
                var res = await DeleteImageFromServer(image.ImageName);
                if (res is OkResult)
                {
                    await _context.SaveChangesAsync();
                    return Ok();
                }
                else
                {
                    return BadRequest("Could not remove image from database");
                }

                
            }
            catch (Exception)
            {

                return BadRequest("Something bad happend");
            }

        }

            // GET api/<UserImageController>/5
            [HttpGet("get/{id}")]

        public async Task<ActionResult<UserImageModel>> Get(string id)
        {

            try
            {
                var image = await _context.UserImages.FindAsync(id);
                if (image == null) return BadRequest("Cant find image");



                UserImageModel _image = new UserImageModel(
                    id,
                    image.ImageName,
                    String.Format("{0}://{1}{2}/Images/{3}", Request.Scheme, Request.Host, Request.PathBase, image.ImageName)
                    );






                return Ok(_image);
            }
            catch (Exception)
            {

                return BadRequest();
            }

        }


        // POST api/<UserImageController>
        [HttpPost]
        [Consumes("multipart/form-data")]
        [Route("post")]
        public async Task<IActionResult> Post([FromForm] UserImageEntity entity)
        {
            try
            {


                if (entity.ImageFile == null)
                {
                    return BadRequest("No image attached to request");
                }

                var _path = Path.GetExtension(entity.ImageName);
                if(_path == ".jpg" || _path == ".jpeg" || _path == ".png")
                {

                    string uniqeImageName = Guid.NewGuid().ToString() + Path.GetExtension(entity.ImageName);
                    UserImageCreateModel createImage = new UserImageCreateModel(entity.UserId, uniqeImageName);


                    // Checks if there is an existing image in database connected to user

                    var _check = await _context.UserImages.FindAsync(entity.UserId);
                    
                    // An image exists on user
                    if (_check != null)
                    {

                        var res = await ChangeProfileImage(createImage);
                        if (res is OkResult)
                        {
                            UserImageSaveModel _newImage = new UserImageSaveModel(uniqeImageName, entity.ImageFile);
                            var result = await SaveImageOnServer(_newImage);
                            if (result is OkResult)
                            {
                                return Ok();
                            }
                        }
                    }


                    // No image in db so we create a new row
                    else
                    {
                        UserImageEntity _model = new UserImageEntity()
                        {
                            UserId = entity.UserId,
                            ImageName = uniqeImageName
                        };

                        _context.UserImages.Add(_model);

                        UserImageSaveModel _newImage = new UserImageSaveModel(uniqeImageName, entity.ImageFile);
                        var res = await SaveImageOnServer(_newImage);
                        if (res is OkResult)
                        {
                            await _context.SaveChangesAsync();
                            return Ok();
                        }
                        else
                        {
                            return res;
                        }

                    }

                    return BadRequest();
                }

                else
                {
                    return BadRequest("Invalid image type");
                }
            }
            catch (Exception)
            {

                return BadRequest("Something bad happend");
            }
   
        }


        [NonAction]
        public async Task<IActionResult> ChangeProfileImage(UserImageCreateModel model)
        {

            try
            {
                var oldImageModel = await _context.UserImages.FindAsync(model.UserId);
                if (oldImageModel == null)
                {
                    return BadRequest("Cant find UserImage row");
                }
                string oldImageName = oldImageModel.ImageName;
                oldImageModel.ImageName = model.ImageName;

                _context.UserImages.Update(oldImageModel);



                var result = await DeleteImageFromServer(oldImageName);
                if (result is OkResult)
                {
                    await _context.SaveChangesAsync();
                    return Ok();
                }
                else
                {
                    return result;
                }

                return Ok();

            }
            catch (Exception)
            {
                return BadRequest("Something bad happend");
            }




        }


        [NonAction]
        public async Task<IActionResult> SaveImageOnServer(UserImageSaveModel model)
        {
            try
            {
                var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "wwwroot/Images", model.ImageName);
                using (var fileStream = new FileStream(imagePath, FileMode.Create))
                {
                    await model.formFile.CopyToAsync(fileStream);
                }

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest("Could not save file on server");
            }   
            
        }

        [NonAction]
        public async Task<IActionResult> DeleteImageFromServer(string filename)
        {
            
            
            try
            {
                var imagePath = Path.Combine(_hostEnvironment.ContentRootPath, "wwwroot/Images", filename);
                if (System.IO.File.Exists(imagePath))
                    System.IO.File.Delete(imagePath);

                return Ok();
            }
            catch (Exception e)
            {
                return BadRequest("Could not delete file from server");
            }

        }

    }
}
