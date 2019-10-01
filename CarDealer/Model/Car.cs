using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CarDealer.Model
{
    public class Car
    {
        public Guid Id { get; set; }
        [Required(AllowEmptyStrings = false, ErrorMessage = "Car make can't be empty or contains whitespace only")]
        public string Make { get; set; }
        [Required(AllowEmptyStrings = false, ErrorMessage = "Car model can't be empty or contains whitespace only")]
        public string Model { get; set; }
        [Required]
        [Range(1900, 2200 , ErrorMessage = "Year must be between 1900 and 2200")]
        public int Year { get; set; }
        [Required(AllowEmptyStrings = false, ErrorMessage = "Car Body can't be empty or contains whitespace only")]
        public string Body { get; set; }
        public string Color { get; set; }
        [Required]
        [Range(0, Double.MaxValue, ErrorMessage = "Price must be >= 0")]
        public decimal Price { get; set; }
        public List<string> ImageUrls { get; set; }
        [Required]
        [Range(0,Int16.MaxValue,ErrorMessage ="Stock level must >= 0")]       
        public int StockLevel { get; set; }
    }
}
