import app from "./app.js";
import {v2 as cloudinary} from "cloudinary";
import http from "http";
import { initSocket } from "./utils/socket.js";
import dotenv from "dotenv";
dotenv.config();

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

const server = http.createServer(app);// http server create kar liya

// server ko socket se initialize karna hai
initSocket(server);

server.listen(process.env.PORT, "0.0.0.0", () => {
    console.log(`Server is running on port ${process.env.PORT}`);
});