using CarDealer.Middleware;
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
    public class CarsController : ControllerBase
    {
        private static List<Car> _carRepository = new List<Car>();
        /// <summary>
        /// Helper function to seed a sample car in repogitory
        /// </summary>
        public static void SeedCars()
        {
            if (_carRepository.Count == 0)
            {
                var newCar = new Car()
                {
                    Id = Guid.NewGuid(),
                    Make = "Audi",
                    Model = "A4",
                    Year = 2018,
                    Body = "Wagon",
                    Color = "Red",
                    Price = 56999,
                    ImageUrls = new List<string>(){
                        "http://bay2car.com/img/2014-AUDI-A4-2-0-TDI-RED-4-DOOR-S-LINE-BLACK-EDITION-DAMAGED-REPAIRED-252538560351/0.jpg",
                        "http://bay2car.com/img/2014-AUDI-A4-2-0-TDI-RED-4-DOOR-S-LINE-BLACK-EDITION-DAMAGED-REPAIRED-252538560351/1.jpg",
                        "http://bay2car.com/img/2014-AUDI-A4-2-0-TDI-RED-4-DOOR-S-LINE-BLACK-EDITION-DAMAGED-REPAIRED-252538560351/2.jpg",
                        "http://bay2car.com/img/2014-AUDI-A4-2-0-TDI-RED-4-DOOR-S-LINE-BLACK-EDITION-DAMAGED-REPAIRED-252538560351/3.jpg",
                        "http://bay2car.com/img/2014-AUDI-A4-2-0-TDI-RED-4-DOOR-S-LINE-BLACK-EDITION-DAMAGED-REPAIRED-252538560351/4.jpg",
                    },
                    StockLevel = 1,
                };
                _carRepository.Add(newCar);
            }
        }
        /// <summary>
        ///  Get all cars in the car repository
        /// </summary>
        /// <remarks> 
        /// Sample request
        /// 
        ///         GET /Cars
        ///         
        /// </remarks>
        /// 
        /// <returns>Entire list of cars in the car repository</returns>
        /// <response code="200">
        ///     Return 200 if no exception occured
        /// </response>
        [ProducesResponseType(typeof(List<Car>), 200)]
        [HttpGet("")]
        public IEnumerable<Car> GetCars()
        {
            return _carRepository;
        }
        /// <summary>
        ///  Add new car into the car repository
        /// </summary>
        /// <remarks> 
        /// Sample request
        /// 
        ///         POST /Cars
        ///         
        /// </remarks>
        /// 
        /// <returns>Entire list of cars in the car repository</returns>
        /// <response code="200">
        ///     Return new car if succesfully add car to car repository
        /// </response>
        /// <response code="422">
        ///     Return validation error messages if car fails model validation
        ///     (via ModelStateValidationFilter)
        /// </response>
        [HttpPost]
        [ProducesResponseType(typeof(Car), 200)]
        [ProducesResponseType(typeof(List<string>), 422)]
        public ActionResult AddCar([FromBody] Car newCar)
        {
            // generate new id for the car
            newCar.Id = Guid.NewGuid();
            // save to database
            _carRepository.Add(newCar);
            return Ok(newCar);
        }
        /// <summary>
        ///  Partially update car, currenly support updating stock level
        /// </summary>
        /// <remarks> 
        /// Sample request
        /// 
        ///         PATCH /Cars/0793c770-8dfb-4436-b3e6-d7dbb0b08c4e
        ///         
        /// </remarks>
        /// 
        /// <returns>Update car object</returns>
        /// <response code="404">
        ///     return error message with single message when cannot
        ///   find car with this id in the repository
        ///    
        /// </response>
        /// <response code="422">
        ///     Return validation error messages if car fails model validation
        ///     (via ModelStateValidationFilter)
        /// </response>
        /// <response code="200">
        ///     Return updated car if succesfully update 
        /// </response>
        [HttpPatch("{id:Guid}")]
        [ProducesResponseType(typeof(Car), 200)]
        [ProducesResponseType(typeof(List<string>), 422)]
        [ProducesResponseType(typeof(List<string>), 404)]
        public ActionResult UpdateCar([FromRoute] Guid id,
            [FromBody] Car updatingCarData)
        {
            var carIndex = _carRepository.FindIndex(x => x.Id == id);
            if (carIndex == -1)
            {
                var errors = new List<string>(){
                    "Cannot find car with this id"
                };
                return NotFound(new { errors });
            }
            else
            {
                var updatingCar = _carRepository.ElementAt(carIndex);
                updatingCar.StockLevel = updatingCarData.StockLevel;
                return Ok(updatingCar);
            }

        }
        /// <summary>
        ///  Search for car with make or model contain search term (case insensitive
        /// </summary>
        /// <remarks> 
        /// Sample request
        /// 
        ///         GET /Cars/search?searchTerm=a4
        ///         
        /// </remarks>
        /// <param name="searchTerm">search term</param>
        /// <returns>List of items whose make and model contains search term  </returns>
        /// <response code="422">
        ///     When search term is null , empty or contains only white space    
        /// </response>
        /// <response code="200">
        ///     Return 200 if no exception occured
        /// </response>
        [HttpGet("search")]
        [ProducesResponseType(typeof(List<Car>),200)]
        [ProducesResponseType(typeof(List<string>),422)]
        public ActionResult SearchForCarByMakeAndModel([FromQuery] string searchTerm)
        {
            if (String.IsNullOrWhiteSpace(searchTerm))
            {
                var errors = new[] { "Search term cannot be empty or contains only whitespace" };
                return UnprocessableEntity(new { errors });
            }

            return Ok(_carRepository.Where(x =>
                x.Make.ToUpper().Contains(searchTerm.ToUpper()) ||
                x.Model.ToUpper().Contains(searchTerm.ToUpper())));
        }
        /// <summary>
        /// Delete a car with specific id
        /// </summary>
        /// <remarks> 
        /// Sample request
        /// 
        ///         DELETE /Cars/0793c770-8dfb-4436-b3e6-d7dbb0b08c4e
        ///         
        /// </remarks>
        /// <param name="id">Id of the car to be deleted</param>
        /// <returns>True if item is deleted</returns>
        /// <response code="200">
        ///     Return 200 if item has been succesfully deleted
        /// </response>
        [HttpDelete("{id:Guid}")]
        [ProducesResponseType(typeof(bool), 200)]
        public ActionResult<bool> DeleteCar([FromRoute] Guid id)
        {
            _carRepository = _carRepository.Where(x => x.Id != id).ToList();
            return true;
        }
    }
}
