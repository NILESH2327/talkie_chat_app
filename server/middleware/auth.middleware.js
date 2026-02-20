import jwt from 'jsonwebtoken';
import {User} from "../models/User.model.js";
import { catchAsyncError } from './catchAsyncError.middleware.js';


export const isAuthenticated = catchAsyncError (async (req , res , next) => {

  const token = req.cookies.token ;
  if(!token){
    return res.status(401).json({
        success:false,
        message:"Please login to access this resource",
    });
  }

  const decoded = jwt.verify(token , process.env.JWT_SECRET_KEY);

  if(!decoded){
    return res.status(401).json({
        success:false,
        message:"Invalid Token , Please login again",
    });
  }

  const user = await User.findById(decoded._id);
  req.user = user;
  next();
  


})
