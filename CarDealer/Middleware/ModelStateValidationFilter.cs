using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System.Web.Http.ModelBinding;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;

namespace CarDealer.Middleware
{
    // Return model validation in specific format
    // 422, with error message arrays;
    public class ModelStateValidationFilter : ActionFilterAttribute
    {
        public override void OnActionExecuting(ActionExecutingContext context)
        {
            // You can access it via context.ModelState
            if (!context.ModelState.IsValid)
            {
                var errorLists = context.ModelState.Select(x => x.Value.Errors)
                           .Where(y => y.Count > 0)
    
                           .ToList();
            
                var errors = errorLists.Aggregate(new List<string>(),(acc, errorList) =>
                {
                    // map errors to its errorMessage
                    return acc.Concat(errorList.Select(x => x.ErrorMessage)).ToList();
                });
                var result = new UnprocessableEntityObjectResult(new { errors });
               
                context.Result = result;
               
            }
            else
            {
                base.OnActionExecuting(context);
            }
        
        
        }
    }
}
