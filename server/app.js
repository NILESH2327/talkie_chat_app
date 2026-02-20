import express from "express";
import cookieParser from "cookie-parser";
import {config} from "dotenv";
import cors from "cors";
import fileUpload from "express-fileupload";
import {connectDB} from "./database/db.js";
import userRouter from "./routes/user.routes.js";
import messageRouter from "./routes/message.routes.js";

const app = express();
config({path: "./config/config.env"});

app.use(cors({
    origin: "http://localhost:5173",
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE"],
  }),
);

app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(fileUpload({
    useTempFiles: true,
    tempFileDir: "/tmp/",
}));


app.use("/api/v1/user",userRouter);
app.use("/api/v1/message",messageRouter);

// connect to database


connectDB();
export default app;
