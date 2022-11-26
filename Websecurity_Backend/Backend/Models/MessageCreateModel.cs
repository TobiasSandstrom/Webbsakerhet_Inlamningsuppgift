namespace Backend.Models
{
    public class MessageCreateModel
    {
        public MessageCreateModel(string header, string message)
        {
            Header = header;
            Message = message;
        }

        public string Header { get; set; }
        public string Message { get; set; }
    }
}
