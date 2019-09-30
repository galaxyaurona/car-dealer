using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Threading.Tasks;

namespace CarDealer.Model
{
    public class Car
    {
        [Required]
        public int Id { get; set; }
        [Required]
        public string Make { get; set; }
        [Required]
        [L]
        public string Model { get; set; }
        [Required]
        [Range(1900, 2200 , ErrorMessage = "Year must be between 1900 and 2200")]
        public int Year { get; set; }
        [Required]
        public string Body { get; set; }
        [Required]
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
