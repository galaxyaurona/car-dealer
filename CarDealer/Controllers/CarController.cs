using CarDealer.Model;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CarDealer.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    [ApiController]
    public class CarController : ControllerBase
    {
        private readonly List<Car> _carRepository;
        public CarController()
        {
            _carRepository = new List<Car>();
            SeedCars();
        }

        private void SeedCars()
        {
            if (_carRepository.Count == 0)
            {
                var newCar = new Car()
                {
                    Id = 1,
                    Make = "Audi",
                    Model = "A4",
                    Year = 2018,
                    Body = "Wagon",
                    Color = "Red",
                    Price = 56999,
                    ImageUrls = new List<string>(),
                    StockLevel = 1,
                };
                _carRepository.Add(newCar);
            }


        }

        [HttpGet("")]
        public IEnumerable<Car> GetCars()
        {
            return _carRepository;
        }

        [HttpPut("{id:int}")]
        public ActionResult UpdateCar([FromRoute] int id,
            [FromBody] Car updatingCarData)
        {
            var carIndex = _carRepository.FindIndex(x => x.Id == id);
            if (carIndex == -1)
            {
                return NotFound("Cannot find car with this id");
            }
            else
            {
                var updatingCar = _carRepository.ElementAt(carIndex);
                updatingCar.StockLevel = updatingCarData.StockLevel;
                return Ok(updatingCar);
            }
           
        }

        [HttpGet("search")]
        public IEnumerable<Car> SearchForCarByMakeAndModel([FromQuery] string searchTerm)
        {
            return _carRepository.Where(x => 
                x.Make.ToUpper().Contains(searchTerm) ||
                x.Model.ToUpper().Contains(searchTerm));
        }
        /// <summary>
        /// Delete a car with specific id
        /// </summary>
        /// <remarks> 
        /// Sample request
        /// 
        ///         DELETE /Car/1
        ///         
        /// </remarks>
        /// <param name="id">Id of the car to be deleted</param>
        /// <returns>True if item is deleted</returns>
        /// <response code="200">
        ///     Return 200 if item has been succesfully deleted
        /// </response>

        [HttpDelete("{id:int}")]

        [ProducesResponseType(200)]
        public ActionResult<bool> DeleteCar([FromRoute] int id)
        {
            return true;
        }
    }
}
