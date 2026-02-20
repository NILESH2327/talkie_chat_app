import { catchAsyncError } from "../middleware/catchAsyncError.middleware.js";
import {User} from "../models/User.model.js";
import bcrypt from "bcryptjs";
import { generateToken } from "../utils/jwtToken.js";
 import {v2 as cloudinary} from "cloudinary";
export const signup = catchAsyncError  (async (req , res ,next)=>{
const {fullName , email , password} = req.body;
 if(!email || !password || !fullName){
    return  res.status(400).json({
        success:false,
        message:"Please provide all required fields"
    });


  }
  // for check email validity
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "invalid email address"
        });
    }
    if(password.length < 8){
        return res.status(400).json({
            success:false,
            message:"Password must be at least 8 characters long"
        });
    }

    const isEmailAlreadyExists = await User.findOne({email});
    if(isEmailAlreadyExists){
        return res.status(400).json({
            success:false,
            message:"Email already exists"
        });
    } 

    const hashedPassword = await bcrypt.hash(password , 10);
    const user = await User.create({
        fullName,
        email,
        password:hashedPassword,
        avatar:{
            public_id:"",
            url:""
        },

    });

    // generate token
    generateToken(user,"User registered successfully",201,res);

 
});
export const signin =catchAsyncError (async (req , res ,next)=>{
   

    const {email ,password} =req.body;
    if(!email || !password){
        return res.status(400).json({
            success :false,
            message:"please provide email and password",
        });
    }
    
   // for checking email formate 
    const emailRegex = /^\S+@\S+\.\S+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({
            success: false,
            message: "invalid email address"
        });
    }

    const user = await User.findOne({email});
   

    if(!user){
        return res.status(401).json({
            success:false,
            message:"Invalid email or password",
        });
    }

    // compare password
    const isPasswordMatched = await bcrypt.compare(password , user.password);
    if(!isPasswordMatched){
        return res.status(401).json({
            success:false,
            message:"Invalid email or password",
        });
    }

    // generate token
    generateToken(user,"User signeed in successfully",200,res);


});


export const signout = catchAsyncError(async (req, res, next) => {
  res
    .status(200)
    .cookie("token", "", {
      httpOnly: true,
      maxAge: 0,
      sameSite: "strict",
      secure: process.env.NODE_ENV !== "development",
    })
    .json({
      success: true,
      message: "User signed out successfully",
    });
});

export const getUser= catchAsyncError (async (req , res ,next)=>{

    const user = req.user;
    res.status(200).json({
        success:true,
        user,
    });
});


export const updateProfile = catchAsyncError(async (req, res, next) => {

  const { fullName, email } = req.body;

  // ✅ FIRST check: undefined / null
  if (!fullName || !email) {
    return res.status(400).json({
      success: false,
      message: "Please provide all required fields",
    });
  }

  // ✅ SECOND check: empty strings
  if (fullName.trim().length === 0 || email.trim().length === 0) {
    return res.status(400).json({
      success: false,
      message: "Fields cannot be empty",
    });
  }

  const avatar = req?.files?.avatar;
  let cloudinaryResponse = {};

  if (avatar) {
    try {
      const oldAvatarPublicId = req.user?.avatar?.public_id;

      if (oldAvatarPublicId) {
        await cloudinary.uploader.destroy(oldAvatarPublicId);
      }

      cloudinaryResponse = await cloudinary.uploader.upload(
        avatar.tempFilePath,
        {
          folder: "Chat_APP_Users_Avatars",
          transformation: [
            { width: 300, height: 300, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        }
      );

    } catch (error) {
      console.error("Error uploading avatar to Cloudinary:", error);
      return res.status(500).json({
        success: false,
        message: "Failed to upload avatar image",
      });
    }
  }

  let data = {
    fullName,
    email,
  };

  if (
    avatar &&
    cloudinaryResponse?.public_id &&
    cloudinaryResponse?.secure_url
  ) {
    data.avatar = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  const user = await User.findByIdAndUpdate(req.user._id, data, {
    new: true,
    runValidators: true,
  }).select("+avatar.url");

  res.status(200).json({
    success: true,
    message: "Profile updated successfully",
    user,
  });
});
