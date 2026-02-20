import mongoose from "mongoose";

const userSchema = new mongoose.Schema({

  fullName: {
    type: String,
    required: [true, "Full name is required"], 
  },
  email: {
    type: String,
    required: [true, "Email is required"],  
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Password is required"], 
    
  },
  avatar: {
  public_id: {
    type: String,
  },
  url: {
    type: String,
  },
 },
}, {timestamps: true}// its help to track time  when user was created or updated or any changes made or registered
);

export const User = mongoose.model("User", userSchema);

