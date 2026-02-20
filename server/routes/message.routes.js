import express from "express";
import { getAllUsers, getMessages, sendMessages ,deleteMessage} from "../controller/message.controller.js";
import { isAuthenticated } from "../middleware/auth.middleware.js";

const router = express.Router();


router.get("/users", isAuthenticated, getAllUsers);// to get all users except logged in user
router.get("/:id", isAuthenticated, getMessages); // :userId is dynamic parameter
router.post("/send/:id", isAuthenticated, sendMessages);// to send message to a particular user
router.delete("/:messageId", isAuthenticated, deleteMessage);


export default router;