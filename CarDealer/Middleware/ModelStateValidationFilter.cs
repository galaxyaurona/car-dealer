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
            // Check if model binding is valid
            if (!context.ModelState.IsValid)
            {
                // filter all the attributes with errors
                var errorLists = context.ModelState.Select(x => x.Value.Errors)
                           .Where(y => y.Count > 0)
                           .ToList();
                // flatten, then aggregate them to single list of error
                var errors = errorLists.Aggregate(new List<string>(),(acc, errorList) =>
                {
                    // map errors to its errorMessage
                    return acc.Concat(errorList.Select(x => x.ErrorMessage)).ToList();
                });
                //return in
                var result = new UnprocessableEntityObjectResult(new { errors });
               // return 422 immediately
                context.Result = result;
               
            }
            else
            {
                base.OnActionExecuting(context);
            }
        
        
        }
    }
}
