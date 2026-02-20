

import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({

  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Sender ID is required"], 
  },
  receiverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: [true, "Receiver ID is required"],  
  },
  text : String,
  mediaUrl: String,//img and video 
  
}, {timestamps: true}// its help to track time  when user was created or updated or any changes made or registered
);

export const Message = mongoose.model("Message", messageSchema);

