using Backend.Data;
using Backend.Entities;
using Backend.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json;
using System.Web;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MessagesController : ControllerBase
    {
        private string[] allowed = new string[] { "<b>", "</b>", "<i>", "</i>", "å", "ä", "ö", "Å", "Ä", "Ö" };
        private readonly AppDbContext _context;
        
        public MessagesController(AppDbContext context)
        {
            _context = context;
        }


        // GET: api/<MessagesController>
        [HttpGet]
        [Authorize]
        [Route("getMessages")]
        public async Task<IActionResult> Get()
        {
            try
            {
                List<MessageEntity> blogPosts = await _context.Messages.ToListAsync();

                if (blogPosts.Count < 1) return NotFound("No blog posts in database");


                foreach (var post in blogPosts)
                {
                    post.MessageHeader = HttpUtility.HtmlEncode(post.MessageHeader);
                    post.Message = HttpUtility.HtmlEncode(post.Message);

                }

                foreach (var tag in allowed)
                {
                    var encodedTag = HttpUtility.HtmlEncode(tag);

                    foreach (var post in blogPosts)
                    {
                        post.MessageHeader = post.MessageHeader.Replace(encodedTag, tag);
                        post.Message = post.Message.Replace(encodedTag, tag);
                    }

                }



                return new OkObjectResult(JsonConvert.SerializeObject(blogPosts));
            }
            catch (Exception)
            {

                return NotFound("Something unexpected happend");
            }
            
            
        }







        [HttpPost]
        [Authorize]
        [Route("postMessage")]
        public async Task<IActionResult> Post([FromBody] MessageCreateModel message)
        {
            try
            {
                DateTime now = DateTime.Now;


                MessageCreateModel encodedMessage = new MessageCreateModel(HttpUtility.HtmlEncode(message.Header), HttpUtility.HtmlEncode(message.Message));


                foreach (var tag in allowed)
                {
                    var encodedTag = HttpUtility.HtmlEncode(tag);
                    encodedMessage.Header = encodedMessage.Header.Replace(encodedTag, tag);
                    encodedMessage.Message = encodedMessage.Message.Replace(encodedTag, tag);
                }


                MessageEntity _message = new MessageEntity()
                {
                    Id = new Guid(),
                    MessageHeader = encodedMessage.Header,
                    Message = encodedMessage.Message,
                    Date = now.ToString()
                };

                _context.Messages.Add(_message);
                await _context.SaveChangesAsync();
                return new OkObjectResult(_message);
            }
            
            catch (Exception)
            {

                return NotFound("Something unexpected happend");
            }

            

        }


        // DELETE api/<MessagesController>/5
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(string id)
        {

            try
            {
                MessageEntity message = await _context.Messages.FirstOrDefaultAsync(x => x.Id.ToString() == id);

                if (message == null)
                    return NotFound();


                _context.Messages.Remove(message);
                await _context.SaveChangesAsync();
                return Ok();
            }
            catch (Exception)
            {

                return BadRequest("Something bad happend");
            }
            
           
        }
    }
}
