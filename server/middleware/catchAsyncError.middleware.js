export const catchAsyncError = (func)=>{
  return (req, res, next)=>{
    Promise.resolve(func(req, res, next)).catch(next);
  }
  // if i use this middleware then no need to use try catch block in controller functions
  
}