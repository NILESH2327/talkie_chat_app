import { catchAsyncError } from "../middleware/catchAsyncError.middleware.js";
import { User } from "../models/User.model.js";
import { Message } from "../models/message.model.js";
import { v2 as cloudinary } from "cloudinary";
import { io, getReceiverSocketId } from "../utils/socket.js";

export const getAllUsers = catchAsyncError(async (req, res, next) => {
  const user = req.user;
  const filteredUsers = await User.find({ _id: { $ne: user } }).select(
    "-password"
  );

  res.status(200).json({
    success: true,
    users: filteredUsers,
  });
});

export const getMessages = catchAsyncError(async (req, res, next) => {
  const receiverId = req.params.id;
  const senderId = req.user._id;

  const receiver = await User.findById(receiverId);

  if (!receiver) {
    return res.status(404).json({
      success: false,
      message: "receiver id not found",
    });
  }

  const messages = await Message.find({
    $or: [
      { senderId: senderId, receiverId: receiverId },
      { senderId: receiverId, receiverId: senderId },
    ],
  }).sort({ createdAt: 1 });

  res.status(200).json({
    success: true,
    messages,
  });
});

export const sendMessages = catchAsyncError(async (req, res, next) => {
  const { text } = req.body;
  const media = req?.files?.media;

  const { id: receiverId } = req.params;
  const senderId = req.user._id;

  const receiver = await User.findById(receiverId);

  if (!receiver) {
    return res.status(404).json({
      success: false,
      message: "Receiver not found",
    });
  }

  const sanitizedText = text?.trim() || "";

  if (!sanitizedText && !media) {
    return res.status(400).json({
      success: false,
      message: "Message text or media is required to send message",
    });
  }

  let mediaUrl = "";

  if (media) {
    try {
      const uploadResponse = await cloudinary.uploader.upload(
        media.tempFilePath,
        {
          resource_type: "auto",
          folder: "chat_app_media",
          transformation: [
            { width: 1080, height: 1080, crop: "limit" },
            { quality: "auto" },
            { fetch_format: "auto" },
          ],
        }
      );

      mediaUrl = uploadResponse?.secure_url;
    } catch (error) {
      console.log("Media upload error:", error);
      return res.status(500).json({
        success: false,
        message: "Media upload failed",
      });
    }
  }

  const newMessage = await Message.create({
    senderId,
    receiverId,
    text: sanitizedText,
    mediaUrl,
  });

  const receiverSocketId = getReceiverSocketId(receiverId);

  if (receiverSocketId) {
    io.to(receiverSocketId).emit("newMessage", newMessage);
  }

  res.status(201).json({
    success: true,
    message: newMessage,
  });
});


export const deleteMessage = catchAsyncError(async (req, res, next) => {
  const { messageId } = req.params;
  const userId = req.user._id;

  const message = await Message.findById(messageId);

  if (!message) {
    return res.status(404).json({
      success: false,
      message: "Message not found",
    });
  }

  // ✅ Only sender can delete
  if (message.senderId.toString() !== userId.toString()) {
    return res.status(403).json({
      success: false,
      message: "You are not allowed to delete this message",
    });
  }

  await Message.findByIdAndDelete(messageId);

  res.status(200).json({
    success: true,
    message: "Message deleted successfully",
    deletedMessageId: messageId,
  });
});
